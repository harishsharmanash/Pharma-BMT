# Archive — finished work, kept for history

**Agents: do not read anything in this folder unless you are deliberately digging into project history.** Nothing here is pending work. Every plan in here has already been built and shipped.

These were moved out of `Files/` because a finished build plan reads exactly like a to-do list. An agent grepping for a phase name would surface one of these and mistake completed work for outstanding work. Moving them keeps that from happening without destroying anything.

## Why archived rather than deleted

`Pharma BMT/Files/` is **not under version control**. Deletion here is permanent — no git history to recover from. The benefit of deleting is essentially zero (these files don't load into a session unless something opens them), so there is no reason to take an irreversible action.

## What's in here

| File | Status |
|---|---|
| `BUGS-2026-07-25-evening.md` | **DONE** — verified against code 30 Jul 2026 (`docs/DOC-AUDIT-2026-07-30.md` §1). Every bug fixed; the one ops item (purge scheduling) is itself now done. |
| `CEREBYL-ROADMAP-8FEATURES.md` | **DONE** — all 8 features verified shipped 30 Jul 2026 (`docs/DOC-AUDIT-2026-07-30.md` §4). Two minor F6 gaps noted there, both explicitly v1-optional (audio attach; Web Speech was chosen for mic instead). |
| `SCHEDULE-daily-purge.md` | **DONE 30 Jul 2026** — pg_cron `daily-purge-old-data` scheduled 21:00 UTC / 02:30 IST, Vault-backed secret, verified by a manual fire returning HTTP 200. Firing it also exposed that `purge_activity_log()` had no `GRANT ... TO service_role`, so 90-day Activity Log retention had never run; fixed by migration `20260730170000`. |
| `ai-assistant-v3-execution-plan.md` | Built. Superseded by later versions. |
| `ai-assistant-v4-execution-plan.md` | Built (53 actions, plan executor). |
| `ai-assistant-v5-bill-extraction-plan.md` | Built (`/extract` Worker endpoint). |
| `ai-assistant-v6-order-ux-and-robust-import-plan.md` | Built (Order dialog overhaul, robust import). |
| `ai-assistant-v7-import-review-edit-i18n-sort-plan.md` | Built (commits `14180ba`, `290542f`, `73918ff`). |
| `handoff.md` | A 2026-07-18 session handoff. That session happened; the corpus workstream it describes is complete. |
| `phase-a-entitlements-build-spec.md` | Built (`20260719120000_feature_entitlements.sql`). |
| `phase-d1-developer-user-management-spec.md` | Built (verified in-code 2026-07-21). |
| `LOVABLE-EXIT-PLAN.md` | The migration it plans is **done** as of 2026-07-21. Describes dead infrastructure. |
| `REMAINING-PHASES-BUILD-PLAN.md` | Built. D2 (`console.bugs.tsx`), D3 (`console-*`/`use-mfa.ts`), B (`permissions.ts`), E (`use-domain-branding.ts`), F (`use-platform-analytics.ts`) all verified in-code 2026-07-23. |
| `PHASE-E-CUSTOM-DOMAINS-SOLUTION.md` | Built — the white-label custom-domains architecture it specs is live (`use-domain-branding.ts`, `customers.cerebyl.com` fallback origin per `CLAUDE.md`). |
| `KIMI-BACKLOG-20260721.md` | A parallel-work handoff for Phase D3; D3 shipped, so this coordination doc is done. |
| `PLATFORM_BACKEND_AND_MULTITENANCY_PLAN.md` | Brainstorming doc that `REMAINING-PHASES-BUILD-PLAN.md` executed on; superseded, multi-tenancy + console are built. |
| `SONNET-TASK-01-ui-foundation.md` | Built, then superseded — Harish rejected the first UI pass as too shallow; real redesign is `KIMI-UI-REDESIGN-HANDOFF.md`. |
| `CEREBYL-FRONTEND-AUDIT.md` | Done — the audit that fed into `KIMI-UI-REDESIGN-HANDOFF.md`. |
| `KIMI-UI-REDESIGN-HANDOFF.md` | Built — executed across 5 "UI Draft" commits (verified 2026-07-23). |
| `PLAN-F2-email-lead-autofetch-DRAFT.md` | Built — F2 email lead intake shipped 2026-07-24 (Cloudflare Email Worker `cerebyl-lead-intake`, verified end-to-end: mail → parse → lead insert → forward). |
| `CEREBYL-UI-SWEEP-SPEC.md` | Built — the 3-agent "premium consistency sweep" it specs is committed. |
| `CEREBYL-BUGFIX-SPEC.md` | Built (commit `f679bb5` + bugfix-batch commit, verified 2026-07-23). |
| `KIMI-PROMPT-01-rep-transfer.md` | Built — F3 rep transfer/offboarding shipped (commit `e9e3f03`). |
| `SONNET-TASK-02-ceremate-intro-message.md` | Built (commit `e46e25d`, "Ceremate: English intro message"). |
| `SONNET-TASK-03-ai-assistant-fuzzy-matching-part2.md` | Built (commits `1d7e32b` + `e46e25d`, fuzzy/punctuation-insensitive matching parts 1–2). |
| `KIMI-REBRAND-TO-CEREBYL.md` | Built — rebrand locked 2026-07-22, verified complete per `project-identity` memory. |
| `PROJECT_HANDOVER.md` | Superseded, not "finished work" per se — historical Lovable-era handover, already self-flagged non-canonical; `leadenthrella/CLAUDE.md` is the real source now. Archived 2026-07-23. |
| `PROJECT_INSTRUCTIONS.md` | Superseded — its own banner said "no longer maintained, read CLAUDE.md instead." Archived 2026-07-23. |
| `TECHNICAL_HANDOVER.md` | Superseded, historical Lovable-era doc, already self-flagged non-canonical. Archived 2026-07-23. |
| `PLAN-F1-geo-monopoly-DRAFT.md` | Built — F1 complete in all 3 phases (map, radius, booked-areas, map→PDF). Archived 2026-07-24. |
| `PLAN-F4-order-tracking-email-DRAFT.md` | Built — F4-P1 tracking page + F4-P2 order emails (BYOK Brevo/Resend chain, console-managed keys, share popup). Archived 2026-07-24. |
| `PLAN-F6-ceremate-full-ui-DRAFT.md` | Built — F6 complete in all 4 phases. Archived 2026-07-24. |
| `HANDOVER.md` | Superseded — Lovable-era repo handover. Its unbuilt-requests list lives on as `Files/CLIENT-BACKLOG.md`. Archived 2026-07-24. |
| `scripts/` | One-off Python generators (stress-test corpus, cost model) — workstream complete, absolute paths inside are dead since the Drive move. Archived 2026-07-24. |
| `db-fixes/` | Three one-off SQL fixes, all self-marked ALREADY APPLIED. Archived 2026-07-24. |

For the AI assistant, the living authority is `Files/ai-assistant-build-spec.md` — **not** the version plans in here. It carries a build-status block at the top that supersedes all of them.

## Standing practice for this project

**Active `Files/`** holds only: work not yet built, living specs, and reference material still true today.

**Move a file here when** its work ships, or when it's superseded by a newer document.

**Add a one-line status** to the table above when you move something, so the next reader knows *why* it's here without opening it.

**Never delete from `Files/`** — this folder is not version controlled.

**Temporary/scratch files** belong in the session scratchpad directory, never in `Files/` — that keeps this folder meaningful by construction rather than needing periodic cleanup.

**Update 2026-07-23 — the "keep stale-but-useful docs in active `Files/` with a banner" carve-out is retired.** Harish decided banner-flagged historical docs (`PROJECT_HANDOVER.md`, `PROJECT_INSTRUCTIONS.md`, `TECHNICAL_HANDOVER.md`) should just move here instead of sitting in active `Files/` — a banner still means a Kimi/Claude session has to open the file and read past the warning to find out it doesn't need it, which burns tokens for zero benefit now that `leadenthrella/CLAUDE.md` fully covers the same ground. **New rule: if a doc's only value is "historical color, current facts live elsewhere," archive it — don't keep it active with a banner.**
| DESIGN-territory-screen.md | Built & shipped 28 Jul 2026 — party_territories + Territory screen + all consumers ported. Pincode areas match exactly, not by circle (GeoNames coords repeat one point across up to 115 pincodes). |
