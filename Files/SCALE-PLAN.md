# Cerebyl — Scale Plan (target: real client volume)

**Created 30 Jul 2026.** Written in response to Harish's actual target numbers, which are far
above the current demo data (products 659, order_items 209, everything else < 30).

## The target we are building for

| Dimension | Realistic client | Extreme / "big company" |
|---|---|---|
| Leads per company | 7,000–8,000 (imported day one) | 100,000 |
| Parties | ~100s | 1,000 |
| Products | 2,000–3,000 | 3,000 |
| Orders | — | 100s/day → ~36,000/yr |
| Order items | — | ~430,000/yr (~12/order) |
| Staff per company | 30 sales people | 100s |
| Companies on the platform | — | 200 |
| Total users | — | 10,000 |

**Latency budget (the actual acceptance criterion):** every common action completes in
**under ~1 second** at 100k rows. Not "zero lag" — an unmeasurable goal invites
over-engineering. A budget you can test is what keeps the product shippable.

---

## Decision: STAY MULTI-TENANT

Single-tenant (a custom app per company) was considered and **rejected**:

- 200 companies = 200 deployments, 200 databases, 200 migration runs per schema change,
  200 builds per bug fix. For a solo operator + AI worker, one security patch becomes a
  200-deploy project. Shipping stops.
- The scale numbers above are **not large for Postgres**. 200 × 100k = 20M lead rows is an
  ordinary indexed table. Per-company working set is ~100k rows, which is small.
- Per-company customisation is better served by feature flags + config
  (`company_features`, `company_settings`, `custom_roles` already exist) than by forking code.

**The bottleneck is not tenancy and not Postgres. It is that the app moves the entire
dataset to the browser.** Every symptom below is that one root cause.

---

## What breaks at target scale, and why

| # | Symptom at scale | Root cause | Fix class |
|---|---|---|---|
| 1 | 100k leads → ~80MB JSON, 100 round-trips, frozen tab | `fetchAllRows` pages everything; filter/sort/search happen client-side over the full array | server-side pagination |
| 2 | Typing in search freezes the UI | `.filter()` + `.includes()` over 100k objects per keystroke | server-side search + debounce |
| 3 | 3k product cards / 100k rows in DOM | no virtualization anywhere (`@tanstack/react-virtual` not installed) | virtualized lists |
| 4 | Product performance page unusable | `useProductSalesTotals` fetches ALL orders + ALL order_items and sums in JS (~430k rows) | SQL aggregate (view or RPC) |
| 5 | Parties page does 3 full-table scans per load | `usePartiesDuesAging`, `useLastOrderDates` each pull the whole orders table | SQL aggregate |
| 6 | 20-item purchase takes 6–9s | `use-stock.ts:408-414` loops `await addStock()` per item → ~60 **sequential** round-trips | bulk insert / single RPC |
| 7 | "Registering a lead takes 20–30s" | the insert is fast; the cache invalidation then refetches ALL leads | optimistic UI + targeted cache update |
| 8 | Queries slow even when paged | no composite indexes leading with `company_id` | indexing |
| 9 | 20M rows | Supabase free = 500MB, no PITR, pauses on inactivity | plan upgrade |
| 10 | 10k users | direct Postgres connections exhaust under serverless concurrency | Supavisor pooling |

---

## STAGE 0 — Measure first (do this before writing any optimisation)

**Every number above is an estimate, including the audit's earlier "hurts at ~1–2k rows".**
Optimising on guesses wastes weeks on the wrong thing.

Build a seed script that creates a scratch company with target volume:
100k leads · 1,000 parties · 3,000 products · 36,000 orders · 430,000 order_items ·
100 staff · 50k stock movements.

Then record, as a baseline table: time-to-interactive for `/leads`, `/orders`, `/parties`,
`/products`, `/stock`, `/dashboard`; search keystroke latency; lead-save round-trip;
20-item purchase save. Use a throttled CPU/network profile (reps use mid-range Android on
mobile data), not a MacBook on wifi.

Keep the fixture. Re-run it after every stage — that is how we prove a fix worked and catch
a regression later.

---

## STAGE 1 — Server-side lists (the single biggest win)

Move filtering, sorting, searching and paging into Postgres. `fetchAllRows` stays only for
genuinely small reference tables (dropdown options, locations, staff).

- Cursor/keyset pagination (`WHERE (sort_key, id) < (:last_sort, :last_id)`) rather than
  OFFSET — OFFSET degrades linearly and re-scans skipped rows.
- Server-side search: Postgres trigram (`pg_trgm`) or `tsvector` index on the searched
  columns. Never `ILIKE '%x%'` over a full table without a trigram index.
- Return a total count separately (`count: 'estimated'`) — exact counts on large tables are
  their own expensive query.
- `.select()` only the columns the list renders, not `*`. Detail views fetch the rest.

**Keep the `.order("id")` tiebreaker discipline** from the 1000-row fix (commit `592e2d7`).
Any pagination without a total sort order silently duplicates and drops rows.

## STAGE 2 — Aggregates in SQL, not JavaScript

Replace the browser-side reduces with database work:
- `useProductSalesTotals` → a materialized view or RPC returning per-product totals.
- `usePartiesDuesAging` → SQL aggregate over orders grouped by party.
- `useLastOrderDates` → `DISTINCT ON (party_id)` query.
- `useOrderItemCounts` → count aggregate.

For dashboards that tolerate slight staleness, a **materialized view refreshed periodically**
turns a 430k-row scan into an indexed lookup. Note RLS: these must be security-definer RPCs
or views that enforce `company_id`, or they become a cross-tenant leak. **This is exactly the
kind of change that needs the cross-tenant isolation tests (P0.1) in place first.**

## STAGE 3 — Rendering

- `@tanstack/react-virtual` on every list that can exceed ~200 rows.
- Route-level code splitting audit (bundle is already ~10MB uncompressed / 2.2MB gzip).
- Defer heavy libs (`xlsx` 711kB, `pdfjs-dist` 582kB, `recharts` 554kB, `jspdf` 477kB) to
  dynamic import at point of use — they should never be in the initial load.

## STAGE 4 — Perceived speed on writes

- **Optimistic UI** on lead/party/order create+edit: update the TanStack Query cache
  immediately, roll back on error. This is what makes "register a lead" feel instant.
- **Targeted cache updates** instead of blanket `invalidateQueries` — do not refetch 100k
  rows because one row changed.
- **Kill the N+1 write loops** — purchase creation becomes one bulk insert or one RPC.
- Batch independent reads in parallel rather than awaiting in sequence.

## STAGE 5 — Database and platform

- Composite indexes leading with `company_id` on every tenant-scoped table, matching the
  actual sort keys (alphabetical defaults per CLAUDE.md §5, plus date/dues sorts).
- Indexes on all FK columns (Postgres does **not** create these automatically).
- RLS: `current_company_id()` is already `STABLE SECURITY DEFINER` (good — Postgres can hoist
  it). Still worth wrapping call sites as `(select current_company_id())`, the documented
  Supabase optimisation, and measuring with `EXPLAIN ANALYZE`.
- Confirm Supavisor (pooled) connections, not direct.
- **Supabase Pro/Team** — required for the data volume, PITR, and no inactivity pausing.
- Bulk import path for the 7–8k lead spreadsheets clients arrive with: server-side batch
  insert (chunked), not row-by-row from the browser.

---

## On the vocabulary from the reels

Relevant to us: **Optimistic UI** (Stage 4), **one-row-at-a-time writes** (Stage 4, the
purchase loop is a real instance), **round-trip latency** (Stage 4 batching — 60 sequential
requests at 50–150ms each is 6–9s of pure waiting), **dependency bottlenecks / waterfalls**
(Stage 4).

Not our problem: **JSON compression** — gzip is already applied by Cloudflare and Supabase,
and compressing an 80MB over-fetch to 8MB is still fatal; fetch 50 rows instead.
**Server rebuilding HTML per visitor** — real SSR cost, but an authenticated per-user CRM
cannot cache pages across users anyway, and it is nowhere near the top of our list.

The vocabulary in that content is accurate; the prioritisation is absent. Order matters more
than inventory.

---

## Sequencing

Stage 0 → Stage 1 → Stage 2 → Stage 4 → Stage 3 → Stage 5 ongoing.

Stage 1 and 2 are where the order-of-magnitude wins are. Stage 4 is where the product *feels*
fast. Stage 3 stops the browser dying. Stage 5 is the floor everything else stands on.

**Prerequisite for Stage 2: the cross-tenant isolation test suite (P0.1).** Moving logic into
SQL views/RPCs moves the tenant boundary too, and that boundary must be test-enforced before
we start relocating it.
