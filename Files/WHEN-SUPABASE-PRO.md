# When we move to Supabase Pro — the do-list

**Created 30 Jul 2026.** Living file. Harish deferred Pro until "the whole app is 100% built."
Everything parked on that decision lands here so nothing is lost in chat scrollback.

**Standing rule: whenever we hit something that is blocked by, or would be materially easier on,
Supabase Pro — add it here in the same session.** Root `CLAUDE.md` §9 carries this rule too.

> ⚠️ **Read the second table before assuming something needs Pro.** Several items that got called
> "blocked on Pro" in conversation turned out not to be. Do not let this file become an excuse to
> defer work that is actually doable today on the free plan.

---

## A. GENUINELY GATED BY PRO — cannot be done on the free plan

| # | Item | Why Pro is required | Source |
|---|---|---|---|
| A1 | **Enable PITR, then test an actual restore** | Point-In-Time Recovery is a paid feature. Free has no rewind at all — `src/lib/use-backup.ts` is an app-level export, not disaster recovery. **An untested backup is not a backup**, so the restore rehearsal is part of this item, not a follow-up. | PRODUCTION-READINESS P0.5 |
| A2 | **Stop the project pausing on inactivity** | Free projects pause. A paying client's CRM going offline by itself is an outage you did not cause and cannot explain. Pro removes it. | PRODUCTION-READINESS P1.4 |
| A3 | **Stage 0 load test — seed 100k leads / 36k orders / 430k order_items** | Free caps the DB at 500MB; target-volume seed data will not fit. This is the measurement step that must precede any scale rewrite. | SCALE-PLAN Stage 0 |
| A4 | **A real staging environment** | Supabase **branching** is a Pro feature and is the clean way to get a staging DB. Today deploys go straight at the Worker serving `app.cerebyl.com`, and migrations are never rehearsed. This is also the proper fix for the migration-drift problem currently managed by "never run `supabase db push`". | PRODUCTION-READINESS P3.1 |
| A5 | **Daily automated backups** | Free has none. Pro adds them (7-day retention). Pair with A1. | PRODUCTION-READINESS P0.5 |
| A6 | **Egress / bandwidth headroom** | Free egress ceilings will bite well before the target volumes in SCALE-PLAN. | SCALE-PLAN |
| A7 | **Confirm Supavisor pooling under real concurrency** | Testing 10k-user concurrency needs a plan that will not throttle first. | SCALE-PLAN Stage 5 |

## B. NOT ACTUALLY BLOCKED — doable today on the free plan

These were spoken about as "waiting on Pro" and that was wrong. **Do not wait.**

| # | Item | What it really needs |
|---|---|---|
| B1 | **Role-gating tests (Tier 2 — the highest-value hole)** | `acrowell-ai-worker/test/corpus/run.ts:99,107` sends `role: "admin"` as **plain text inside the AI's prompt context** — it is not an authenticated session at all. The fix is to sign the harness in as a real **rep** user and assert on a real rep JWT. A second test user on the free plan is enough. |
| B2 | **Cross-tenant isolation test suite (P0.1)** | Needs *a* Postgres with RLS on and two seeded companies — not necessarily a *Pro* one. A second free Supabase project, or a local Postgres with the schema applied, both work. Volume is not the point here; correctness is. |
| B3 | **Tiers 1, 3, 5 of `PLAN-full-app-automated-test.md`** | Bill-extraction accuracy, duplicate detection, and a browser harness are all fixture/tooling work. No plan dependency. |
| B4 | **Server-side pagination, search, sort (SCALE-PLAN Stage 1–2)** | Can be built and unit-tested now. Only the *measurement* of the win (A3) needs Pro. |

---

## C. The single most important item on this page

**B1 + B2 together.** The app's core promise — *reps only see their own data, and no company can
read another's* — is enforced entirely by RLS and verified by **nothing**. Two independent audits on
30 Jul 2026 converged on this from different directions (the security audit found no isolation
tests; the doc audit found the corpus hardcodes admin).

It is not gated by Pro. It is gated by someone deciding to build it.

---

## D. Order of work once Pro is active

1. **A1 + A5** — turn on PITR and daily backups, then *actually restore one* into a scratch project.
   Do this first; it is the safety net for everything after.
2. **A4** — staging environment / branching, so migrations stop being rehearsed in production.
3. **A3** — seed target volume and record the baseline (SCALE-PLAN Stage 0). Measure before rewriting.
4. **A2, A6, A7** — verify the ceilings actually moved.
5. Then the SCALE-PLAN stages, now with real numbers instead of estimates.

## E. Cost note
Pro is ~$25/month per project plus usage. Harish's decision (30 Jul 2026) is to hold until the app
is feature-complete. That is a reasonable call **as long as section B does not get swept along with
it** — none of B is waiting on money.
