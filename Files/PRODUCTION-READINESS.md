# Cerebyl — Production Readiness Master Checklist

**Created 28 Jul 2026.** Source: (a) the 16-video guide Harish supplied, distilled and
filtered for what actually applies to this stack, plus (b) Claude's own audit of the
codebase and research into what breaks a multi-tenant Supabase/Cloudflare CRM at scale.

**Status: nothing here is started.** This is a backlog, not a report of work done.
Same trap as `Files/CLIENT-BACKLOG.md` — **re-verify against current code before building
any item**, because a finished item reads exactly like a to-do.

**Owner column:** `Claude` = quality floor, never delegate (architecture, RLS, migrations,
live infra, prompts). `Kimi` = mechanical/bulk, delegate with a ticket.

---

## 0. Findings from the audit run on 28 Jul 2026 (verified, with evidence)

These were checked against the actual code, not assumed.

| # | Finding | Evidence | Verdict |
|---|---|---|---|
| ✅ | **AI worker auth is solid.** Verifies the Supabase JWT server-side against `/auth/v1/user`, 401s on missing/invalid token, then rate-limits per *verified* user id. | `acrowell-ai-worker/src/index.ts:120,191-206` | No action. Better than most. |
| ✅ | **AI worker has rate limiting AND a token budget.** 400 requests/user/day plus a separate daily token budget. | `index.ts:6,128,161` | No action. Earlier concern was wrong. |
| ✅ | **Repo is private; no service-role key in git.** | `gh repo view` → `isPrivate: true`; `.env` holds only `*_PUBLISHABLE_KEY` / `*_URL` / `*_PROJECT_ID`. | Low severity. |
| ⚠️ | **`.env` is committed and not in `.gitignore`.** Only publishable keys (public by design, RLS-protected), so not an emergency — but the pattern is one careless paste away from leaking a real secret. | `git ls-files` shows `.env`; `.gitignore` has no `.env` line. | **P1 hygiene.** |
| 🔴 | **Zero automated tests.** `find src -name "*.test.*"` = 0. `acrowell-ai-worker` = 0 test files, despite root `CLAUDE.md` §2b item 5 telling us to run `npx vitest run` there. **That instruction is stale and unrunnable.** | audit | **P0.** |
| 🔴 | **No error monitoring.** No Sentry/LogRocket/Datadog/PostHog in either `package.json`. Production crashes are invisible unless a user phones Harish. | audit | **P0.** |
| 🔴 | **No analytics.** No Umami/Plausible/GA. Zero visibility into feature usage or drop-off. | audit | **P1.** |
| 🔴 | **No security headers.** No CSP, HSTS, X-Frame-Options, or X-Content-Type-Options anywhere in the app or worker responses. | audit | **P1.** |

### Second audit pass — security surfaces (28 Jul 2026)

| # | Finding | Evidence | Verdict |
|---|---|---|---|
| ✅ | **Edge functions authenticate correctly.** The pattern is right: pull the JWT from the `Authorization` header → 401 if absent → `getUser(jwt)` → look up the caller's profile with the service client → **403 unless `role === 'admin' && is_active`**. `platform-manage-user` checks `platform_admins` the same way. Privilege checks are server-side, not trusted from the client. | `supabase/functions/admin-create-user/index.ts:13-28`, `platform-manage-user/index.ts:17-35` | No action. |
| ✅ | **`verify_jwt = false` is NOT global.** It is scoped to `[functions.backup-oauth-callback]` only, with a correct documented reason (Google's OAuth callback arrives without a JWT). Every other function gets default JWT verification *plus* its own role check. | `supabase/config.toml:3-5` | No action. |
| ✅ | **Public order-tracking tokens are strong.** `encode(gen_random_bytes(16),'hex')` = 128 bits of CSPRNG randomness, non-sequential, defaulted at the column. The `/track/$token` unauthenticated surface is not brute-forceable. | `supabase/migrations/20260726120000_order_tracking.sql:14-20` | No action. |
| 🔴 | **RLS is invisible to the repo.** `grep -c "enable row level security" supabase/migrations/` = **0**. Not one migration enables RLS — it was turned on via the Lovable/Supabase dashboard. So **the repo cannot tell you which tables are protected**, and the only description of RLS coverage is prose in `CLAUDE.md`. Any RLS audit must run against the live DB. | audit | **P0 — see 0.1.** |
| 🔴 | **Storage bucket visibility is unknown.** `supabase/migrations/20260710120000_transporters_and_jpeg.sql:2` records that *"Lovable Cloud blocks SQL on storage.buckets"* — so bucket public/private flags were never captured in code. A public bucket would expose **product gallery images and staff documents** to anyone with a URL, RLS notwithstanding. | audit | **P0 — check the dashboard.** |
| 🟠 | **`supabase/config.toml` points at the DEAD Lovable project.** `project_id = "crzddmxogxhirzqkrgwb"`. The live project is `cjowrlrjyhdltbyqwozr` (`pharma-bms-prod`). Any CLI command that trusts this file targets a dead project — confusing at best, and it is exactly the kind of stale infra pointer that left the AI Worker aimed at dead infrastructure once before. | `supabase/config.toml:1` | **P1 — fix the ref.** |

---

## P0 — Do before onboarding another paying company

### 0.1 Cross-tenant isolation test suite  ·  Owner: **Claude**
**This is the single highest-consequence risk in the entire product** and it is not on any
of the 16 videos. Cerebyl is multi-company. One wrong RLS policy, one hook that forgets
`company_id`, and Company A reads Company B's parties, dues, and rates. In a PCD pharma
franchise market where clients compete with each other, that is company-ending, not a bug.

- Build an automated test that seeds two companies + a rep in each, then asserts **every**
  table returns zero cross-company rows for every role (rep / manager / admin).
- Must run against a real Postgres with RLS on, not mocks.
- Add reps-see-only-own-data assertions (root `CLAUDE.md` §5).
- Note the corpus harness runs every row as `role: "admin"` with no history — **role-gating
  is currently never exercised by any test.**

### 0.2 Error monitoring  ·  Owner: **Kimi** (setup), **Claude** (DSN/env)
Sentry on the React app + the two Workers. Source maps uploaded so stack traces are
readable. Scrub PII before send. This is the cheapest single upgrade on the list.

### 0.3 A test suite at all  ·  Owner: **Kimi**
Vitest + React Testing Library. Don't chase coverage — cover the money paths first:
order total/tax math, payment recording, dues calculation, invoice PDF/JPG totals,
soft-delete + restore, and the assistant's confirm-chip single-fire guard.
Rationale: AI-generated code regresses silently; the 25 Jul session shipped five bugs that
diff review passed and only live testing caught.

### 0.4 Fix the stale verification instruction  ·  Owner: **Claude**
Root `CLAUDE.md` §2b item 5 says to run `npx vitest run` in `acrowell-ai-worker`. There are
no tests there. Either write them (0.3) or correct the file — a green-light checklist with
an unrunnable step trains us to skip steps.

### 0.5 Backups & recovery  ·  Owner: **Claude**
Supabase **free plan has no Point-In-Time Recovery.** `src/lib/use-backup.ts` is an
app-level export, not a disaster-recovery plan. Decide: upgrade to Pro for PITR, or
schedule verified off-site `pg_dump`. **Then actually restore one into a scratch project** —
an untested backup is not a backup.

---

## P1 — Do before real user volume

### 1.1 The list routes will not survive 10k rows  ·  Owner: **Claude** → **Kimi**
Every list hook currently fetches the full table into TanStack Query. That is fine at
demo scale and falls over hard as a client's data grows. Needed:
- Server-side pagination + `.range()` on orders, leads, parties, products, stock.
- Server-side search/sort/filter — not client-side `.filter()` over an in-memory array.
- Virtualized lists (`@tanstack/react-virtual`) for anything that can exceed ~200 rows.
- Audit `use-orders.ts` (~620 lines) and `use-staff.ts` (~613 lines) for N+1 fetch patterns.

### 1.2 Database indexing  ·  Owner: **Claude**
Multi-tenant means *every* query filters `company_id`. Required:
- Composite indexes leading with `company_id` on every tenant-scoped table.
- Indexes on all FK columns (Postgres does **not** create these automatically).
- Indexes matching the actual sort keys (alphabetical default per §5, plus dues/date sorts).
- Run `EXPLAIN ANALYZE` on the dashboard aggregates and the dues report before assuming.

### 1.3 RLS performance trap  ·  Owner: **Claude**
A documented Supabase footgun: `auth.uid()` called bare in a policy re-evaluates **per row**.
Wrapping it — `(select auth.uid())` — lets Postgres hoist it to a single evaluation and can
be an order-of-magnitude difference on large tables. Audit every policy. Also avoid
correlated subqueries inside policies; prefer a security-definer helper returning the
caller's `company_id`.

### 1.4 Supabase plan limits  ·  Owner: **Claude**
Currently **free plan**. Free means: 500MB database, limited egress, no PITR, and projects
that **pause after inactivity**. A paying client's CRM pausing is an outage. Model the
cost curve and upgrade before onboarding, not after the incident.

### 1.5 Connection pooling  ·  Owner: **Claude**
Confirm the app and Edge Functions go through **Supavisor** (pooled), not direct
connections. Serverless + direct Postgres connections exhausts the pool under concurrency.

### 1.6 Security headers  ·  Owner: **Kimi**
CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy on all
responses from the Cloudflare Worker. CSP will need care with Supabase + the AI worker
origins — start report-only, then enforce.

### 1.7 `.env` hygiene  ·  Owner: **Kimi**
Add `.env` to `.gitignore`, `git rm --cached .env`, commit a `.env.example` with names only.
History rewrite is **not** needed — the values are publishable keys and the repo is private.

### 1.8 Client-side heavy work blocks the UI  ·  Owner: **Kimi**
`html2canvas` (invoice JPG) and PDF generation run on the main thread and will jank on the
mid-range Android phones reps actually use. Move to a worker thread, or show honest
progress UI. Measure on a throttled CPU profile, not on the Mac.

### 1.9 Analytics  ·  Owner: **Kimi**
Umami or Plausible (privacy-first — matters for DPDP). Track feature usage and drop-off so
roadmap decisions stop being guesses.

### 1.10 Graceful degradation  ·  Owner: **Kimi**
Error boundaries on every route. Kill the DB connection locally and confirm the app shows a
human error screen, never a raw Postgres error or stack trace. Verify no `console.error` of
full error objects containing tokens.

---

## P2 — Legal & compliance (India-first, since that is the market)

### 2.1 DPDP Act  ·  Owner: **Claude** (schema) + **Kimi** (UI)
Highest-relevance legal item, because this is Indian PII at scale.
- **Data residency is already good** — Supabase is `ap-south-1` (Mumbai).
- **Granular, unbundled, unchecked-by-default consent** at signup: separate Terms, Privacy,
  and Marketing checkboxes. Pre-ticked boxes are illegal under DPDP.
- **Consent audit log**: immutable table with `user_id`, `timestamp`, `ip_address`,
  `consent_version`, `consent_type`. No UPDATE grant.
- **Named Grievance Officer** with contact, published in-app and on the site.
- **Delete-my-data / delete-account** path for end users.
- **Breach notification readiness** — DPDP requires reporting to the Data Protection Board.
  You cannot report what you cannot detect; this depends on P0.2 (monitoring).
- **DPAs with processors** — Supabase, Cloudflare, Resend, Google (Gemini).
- Note the layered role: Cerebyl is a **Processor** for its client companies' customer data
  and a **Fiduciary** for the client companies' own user accounts. The client contract must
  say so.

### 2.2 Commercial documents  ·  Owner: **Harish + a real lawyer**
Terms of Service, Privacy Policy, Refund Policy (payment processors require it), DPA,
and an MSA/SLA for enterprise clients. **Generic templates give close to zero protection** —
this is the one area on the whole list that should not be AI-generated.

### 2.3 Indian financial-record retention  ·  Owner: **Claude**
Not on any video, but directly relevant: GST invoice records must be retained ~6 years.
That interacts with `purge_trashed_rows()` and the 30-day Trash policy — **make sure the
purge can never delete a record you are legally required to keep.** Check this before
scheduling the daily purge (`Files/SCHEDULE-daily-purge.md`).

### 2.4 AI disclosure  ·  Owner: **Kimi**
Ceremate should visibly disclose it is AI and that output can be wrong — cheap, and it is
the honest framing when the assistant quotes rupee figures. Keep the existing
"Business tool only" footer discipline. No medical claims anywhere (root `CLAUDE.md` §3).

---

## P3 — Operational maturity

### 3.1 Staging environment  ·  Owner: **Claude**
Deploys currently go straight to the Worker that `app.cerebyl.com` serves. A staging Worker
+ a staging Supabase project would let migrations be rehearsed. **This is the fix for the
migration-drift problem**, which is currently managed by never running `supabase db push`.

### 3.2 Documented rollback  ·  Owner: **Claude**
`wrangler rollback` exists; write the exact command and decision criteria into the deploy
skill so it can be executed under pressure without thinking.

### 3.3 Budget caps and alerts  ·  Owner: **Claude**
The $22K story from the videos. Our exposure is real but narrower than theirs (the AI worker
is authenticated and rate-limited). Still set: Cloudflare billing alerts, Supabase spend
cap, and — most importantly — **Google AI Studio / Gemini quota alerts per client key**,
since that is the one meter that spins on usage.

### 3.4 Concurrency and money correctness  ·  Owner: **Claude**
Not on the videos; matters for a CRM handling invoices.
- **Idempotency** on payment and order writes so a double-tap on a flaky mobile connection
  cannot record ₹50,000 twice. (We already fixed the assistant's double-confirm chip — the
  same class of bug exists in the normal UI paths.)
- **Optimistic concurrency** — two reps editing the same order should not silently
  last-write-wins.
- **Money must be `numeric`, never float.** Verify the schema.
- **Timezones** — confirm IST handling is consistent in reports and the daily digest.

### 3.5 Typecheck debt  ·  Owner: **Kimi**
138 errors is a permanent floor, not a gate. Burn it down in batched mechanical passes
(Highspeed model). Every one is a place TypeScript has stopped protecting the code.

### 3.6 Schedule the daily purge  ·  Owner: **Claude**
Still unscheduled (`Files/SCHEDULE-daily-purge.md`, needs `CRON_SECRET`). The Trash page
advertises 30-day retention that nothing currently enforces. **Do 2.3 first.**

---

## Deliberately NOT doing (and why)

- **Cookie consent banner** — authenticated B2B app, no ad tracking. Revisit if we add
  third-party analytics with cookies (Umami/Plausible are cookieless, which is why they win).
- **SEO / sitemap / Search Console** — there is no public marketing surface to index. If a
  marketing site ships later, it is a separate property.
- **US FTC / DMCA / arbitration clauses** — no US customers, no user-generated public
  content. Revisit only on a US client.
- **OmniRoute or any third-party LLM key gateway** — routing client pharma data and API
  keys through an unaudited proxy is the opposite of the encrypted `company_secrets`
  design. Hard no.
- **Kubernetes / orchestration / queueing** — the videos' scaling advice assumes a Docker
  VPS. We are on Cloudflare Workers + managed Postgres, which removes most of that class
  of problem. Our bottleneck will be Postgres and query shape (P1.1–1.3), not orchestration.

---

## Suggested order

1. **P0.1 cross-tenant isolation tests** — highest consequence, blocks safe onboarding.
2. **P0.2 Sentry** — cheapest, and everything else is easier to verify once you can see failures.
3. **P0.3 money-path tests** + **P0.4** fix the stale checklist step.
4. **P1.1–1.3 pagination + indexes + RLS perf** — one batched work area, biggest felt speed win.
5. **P1.6/1.7 headers + env hygiene** — quick Kimi tickets.
6. **P2.1 DPDP** — before any real client onboarding push.
7. **P0.5 backups** — pair with the Supabase Pro decision (P1.4).

---

## SHIPPED 30 Jul 2026 (verified live on app.cerebyl.com)

One session took several P0/P1 items from the list to done. All 20 commits reviewed, deployed,
`main` == live.

- **P0.2 error monitoring** — Sentry live (`@sentry/tanstackstart-react`), EU region, PII-scrubbed
  (`sendDefaultPii:false` + `beforeSend` strips bodies/cookies/auth headers, user reduced to uuid),
  error + light tracing (0.1), NO replay/logs/metrics. DSN in `src/lib/sentry.ts` (public, safe).
  TODO: `beforeSendTransaction` scrubber (spans not yet scrubbed — low risk); confirm a test error
  actually lands in the dashboard.
- **P0.3 tests** — Vitest + RTL stood up; **68 tests** across order totals/dues/trash/invoice-parity/
  friendly-error/payroll/stock/transporter/incentive. `npm run test` is now real (fixes the stale
  §2b push-gate step).
- **P1.6 security headers** — HSTS/nosniff/X-Frame-Options/Referrer-Policy + **report-only** CSP in
  `src/server.ts`. NOTE: CSP reports to nowhere until Sentry CSP endpoint wired.
- **P1.7 env hygiene** — `.env` gitignored + untracked, `.env.example` added.
- **Typecheck 137 -> 0** — regenerated Supabase types from live schema (was all drift). Gate is now `-eq 0`.
- **Resilience** — route error boundaries + graceful query-failure states; dead Lovable reporter removed.
- **UI** — glass refinement, Firefox blur fix, 116 icon aria-labels/tooltips, skeleton loaders.
- **Legal (P2.2)** — ToS/Privacy/Refund/DPA drafted (`Files/legal/`, AI-drafted, backend note says
  pending CA/lawyer ratification — caveat is backend-only per Harish) and published at public `/legal/*`.
- **DPDP consent (P2.1 partial)** — first-login consent gate (unbundled, unchecked, version-tracked) +
  passive login notice + **`consent_log`** immutable audit table (applied live 30 Jul). Grievance officer
  (Harish Sharma / support@cerebyl.com) is in the privacy policy.

### P1.1 PostgREST 1000-row cap — FIXED 30 Jul 2026 (commit 592e2d7, deployed)
`src/lib/fetch-all.ts` pages via `.range()` until a short page proves the end; 20 list queries
converted across leads/orders/parties/products/stock. **Every paged query MUST keep its
`.order("id")` tiebreaker** — offset paging over the non-unique sorts used here
(`date_received`, `firm_name`, `expiry_date`) lets Postgres order ties differently per page,
which duplicates some rows and drops others. Removing that tiebreaker silently corrupts lists.
`stock_movements` is deliberately bounded at `STOCK_MOVEMENTS_LIMIT` (2000) and the bound is
disclosed in the UI. 6 unit tests in `fetch-all.test.ts`.

Row counts when fixed (30 Jul): products 659, order_items 209, parties 28, leads 17, orders 17,
stock_movements 4, stock_batches 1 — i.e. **nothing was truncating yet**, the fix is preventive
and behaviour is currently identical (single page per query). `order_items` was the nearest
threat: ~12 rows per order means it reaches 1000 at roughly 83 orders, and its truncation would
have silently corrupted `useOrderItemCounts` and `useProductSalesTotals` rather than visibly
shortening a list.

### Still open — performance (separate from the correctness fix above)
Real server-side pagination + virtualization is still NOT done. `fetchAllRows` fixes data loss,
not payload size: past a few thousand rows these lists will get slow because filtering/sorting is
still client-side over the full array. That is the P1.1 "performance" half — needs server-side
search/sort/filter and `@tanstack/react-virtual`, and it is a UI redesign, not a helper swap.

### Harish's outstanding manual tasks (see Files/HARISH-DO-THIS.md)
Cloudflare billing alerts, support@cerebyl.com email routing, Supabase Pro (deferred to first client),
and confirming a Sentry test error lands.

---

## Round 3 — 30 Jul 2026 evening

- **Touch targets DONE** (commit `468f710`). `.hit-area-44` utility in `styles.css` (`inset:-8px`)
  expands the *hit* area without changing visible size; applied to 9 flagged controls. **Adjacency
  rule:** where two icon buttons sit adjacent (the orders row, `gap-1`), the class is applied to
  ONLY ONE — overlapping invisible areas make the later element win and partially kill the first,
  which is worse than the original problem. Delete lives behind More-actions, so that got it; the
  Open-order arrow is redundant (whole row is clickable). Do not "finish the job" by adding the
  class to the other button. One deliberate visible change: the password eye toggle padding went
  `p-0.5`→`p-1.5`, needed because a 16px icon cannot reach 44px from the inset alone.
- **Doc audit DONE** — `leadenthrella/docs/DOC-AUDIT-2026-07-30.md`, evidence-first, four planning
  docs checked against code. `BUGS-2026-07-25-evening.md` and `CEREBYL-ROADMAP-8FEATURES.md`
  archived as verified-complete. `SPEC-ai-usage-and-limits.md` kept (one small gap).
  `PLAN-full-app-automated-test.md` kept — **all five tiers genuinely unbuilt.**

### The audit's most important finding
**Tier 2 role-gating is still completely untested.** `test/corpus/run.ts:99,107` hardcodes
`role=admin`, so no test anywhere exercises what a *rep* can see. That is the same hole as P0.1
(cross-tenant isolation) viewed from the AI side: the app's core promise — reps only see their own
data — is enforced by RLS and verified by nothing.
