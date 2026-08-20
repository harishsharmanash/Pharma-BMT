# RESUME PLAN — the build we paused for WhatsApp

**Written:** 16 Aug 2026 · Claude Opus (lead)
**What this is:** the answer to "what were we building before WhatsApp took over, and what's left."
**Read alongside:** `Files/CEREBYL-BUILD-PLAN.md` (the HOW), `~/Desktop/CEREBYL-BUILD-SPEC.md` (the
WHAT — 24 features, 6 phases). This file is the *delta* — it does not restate either.

---

## 1. What the paused build actually was

**The 24-feature Cerebyl market-launch programme** (`CEREBYL-BUILD-SPEC.md`, planned in
`CEREBYL-BUILD-PLAN.md` on 10 Aug). Three parallel lanes — rep app (A), distributor portal (B),
infra/AI/mobile (C) — executed as ~90 DeepSeek tickets with the lead reviewing every diff.

**Where it stopped, precisely.** The last non-WhatsApp commit in `leadenthrella` is
`409366c — F1 prelude: wire the B0.9 CEREBYL_BUNDLED bundling step into the real build pipeline`
(12 Aug, 17:24 IST). Every commit after that (`0532529` onward) is WhatsApp. The two builds
collided on the same Drive-synced working directory — that collision is written up in `WORKLOG.md`
under *2026-08-12 (evening, cont.)*, where this lead wrongly deleted the other session's WhatsApp
files thinking they were hallucinated. That is the event that forced one build to pause.

So: **F1 (offline-first) is exactly one preparatory commit deep, and F12 has not been started.**
Everything else in the programme is either shipped or a named loose end below.

---

## 2. Status of all 24 features — audited against code and git log, 16 Aug

Per the standing rule (`CLAUDE.md` §8b): every backlog in this project has listed shipped work as
outstanding. This table was built from `git log`, the migrations folder, and greps — not from memory.

| # | Feature | Status | Evidence / gap |
|---|---|---|---|
| F1 | Offline-first + deferred sync | **NOT BUILT** | `src/lib/offline/` does not exist. Only `mobile/scripts/bundle-web.sh` + `409366c` wiring. |
| F2 | Speed-to-lead / SLA | Shipped | tickets `F2-a..d`, migration `20260823120000_sla_breach_notifications` |
| F3 | Objection library | Shipped | Batch 2A closed 11 Aug |
| F4 a–d | Territory hold / collision / dispute / dormancy | Shipped | holds render on map (`11dbff8`) |
| F5 | Coaching digest | **Shipped as BETA** | on-demand recompute, no Monday cadence. Deliberate. |
| F6 a–e | Scheme engine | Shipped | `1e76703`, `8edcb14`, `6648d04`, `60d31ea`, `a4b09d4` |
| F7 | Branded catalogue generator | Shipped | `690a21b` |
| F8 / F11 | Credit score + loyalty (one ladder) | **Shipped but INERT** | see loose end L1 |
| F9 | Margin/GST calculator | Shipped | ticket `1B-1` |
| F10 | Predictive reorder | Shipped | `31a0a75`, `568dccf` |
| F12 | **Photo-to-product** | **NOT BUILT** | no OCR/photo lib in `src/lib`. 3C index exists → unblocked. |
| F13 | Deep-zoom packaging | Shipped (pre-existing) | `product_media`, `product-image-lightbox.tsx` |
| F14 | Statement + ageing + dispute flag | Shipped | migration applied 11 Aug |
| F15 | My Day tasks | Shipped | tickets `1A-2..4` |
| F16 | Voice-note → structured note | **HALF BUILT** | UI shipped (`d72b0f1`) but calls a `/voice-note` endpoint on `acrowell-ai-worker` that **does not exist**. Plus the rep language test. |
| F17 | Push notifications | Shipped | stage 1 local + FCM ready |
| F18 | Lead ranking as filter | Shipped | ticket `TICKET-F18` |
| F19 | Predictive stock-out | Shipped | `ff6d180`. Lead time hardcoded 21 days. |
| F20 | Ceremate proactive alerts | Shipped, default OFF | `8dd00db` |
| F21 / F22 | Benchmarking / cross-company credit | **Consent shells only — correct** | no cross-company query exists, and none should until legal review |
| F23 | AI provider abstraction | **Committed, NOT DEPLOYED** | see loose end L2 |
| F24 | Score the 608-question corpus | **NOT DONE** | needs a login + live quota, not delegatable |

---

## 3. The loose ends (small, real, and cheap — do these first)

**L1 — Credit tiers show "No tier" for every party, forever.** `recompute_party_credit_score()`
exists in two migrations and is granted to `service_role`, but **nothing calls it** — no cron, no
trigger, no edge function (verified by grep across `src/` and `supabase/`). The whole F8/F11 feature
is live and invisible. Fix: a scheduled recompute following the existing
`generate_notifications_all()` pg_cron pattern. ~1 ticket + 1 migration.

**L2 — F23 is committed but undeployed, blocked by an unrelated dirty file.**
`acrowell-ai-worker` has `src/index.ts` modified and uncommitted (billing-claim work in flight from
12 Aug) plus a `.gitignore` change. Deploying F23 would ship that too. Decide: finish/commit or stash
that index.ts work, then deploy. **Lead task, not delegatable** — it is the AI worker.

**L3 — The v3-fcm APK crash was never confirmed fixed.** Two hardening fixes shipped (`d2a1fbc`,
`9cc3815`) and both error sinks are now wired, but nobody reopened the app to check. This needs the
phone, not more code. If it still crashes, `/console/errors` or Sentry now has the real stack.

**L4 — F19's 21-day lead time is hardcoded.** Spec's own example value, pending a per-product field.
One small schema + form ticket.

**L5 — F5 coaching digest is a beta on-demand pass.** Fine by decision; revisit once a quarter of
real F2/F15 data exists. Not work for now — listed so it isn't rediscovered as a bug.

---

## 4. The actual remaining build — four workstreams

### W1 · F16 completion — *smallest, finishes something already half-paid-for*
- **C-lane ticket:** `/voice-note` endpoint on `acrowell-ai-worker` — audio in, transcript +
  structured fields out (`call_summary`, follow-up date, `product_interest`, territory, objections).
  Audio discarded after transcription. Maps onto **existing** lead columns — no migration.
- **Prompt work is the lead's**, per `CLAUDE.md` §2. DeepSeek does the routing/plumbing only.
- **Ship gate is human:** a real Hindi/Punjabi/English code-switched test with actual reps. A
  clean-English demo proves nothing — the spec says so explicitly. Until that passes, keep the UI
  behind a default-off feature key.
- Effort: ~3 tickets + one field test.

### W2 · F12 photo-to-product — *the flagship, now unblocked*
3C's `molecules` + `product_compositions` schema shipped 12 Aug, so the dependency is cleared.
Sequence:
1. **Backfill/normalise ticket** — parse `products.composition` free text into
   `product_compositions`. ⚠️ **This is the risk the plan flagged**: if compositions are inconsistent
   free text, F12 is a data-cleaning project wearing an AI hat. **First ticket is a read-only audit
   of composition data quality** — go/no-go on the rest.
2. OCR pass (C lane, worker) → composition extraction → match against the index.
3. UI (A/B lanes): exact match → product page with quantity ready; no match → filtered
   composition-family list; partial read → show what was extracted and let the user correct it.
4. Aggressive result caching (same 200 products get photographed repeatedly).
5. **Regulatory copy is a hard constraint enforced in two places** — the model prompt (lead's) and
   the UI copy (worker's, lead-reviewed): catalogue navigation results only, never substitution
   language, "Business tool only" on every screen.
- Effort: ~8 tickets. Do **not** start before the §1 audit ticket reports.

### W3 · F1 offline-first — *largest, most likely to slip*
Architecture already decided (`CEREBYL-BUILD-PLAN.md` §0.1, Option A: bundled assets + OTA from R2).
`bundle-web.sh` exists and is wired; nothing above it does.
1. **Prove the bundled APK boots** from local assets end to end (`CEREBYL_BUNDLED=1`) — on the
   device, before any sync code is written.
2. OTA bundle download + swap from R2. **Boot fail-safe is non-negotiable**: a bundle that fails to
   boot must revert to the APK baseline. Any implementation without it is rejected on sight — one bad
   bundle otherwise bricks every phone with no way to push a fix.
3. Local store + write queue with client-generated IDs; idempotent server handling so a retry cannot
   double-submit an order.
4. Header sync indicator ("All synced" / "2 pending").
5. **Never cached as authoritative: dues, live stock, ledger.** Stock may show from cache *with* a
   visible "last updated". Price changed while offline → explicit confirmation, never silent reprice.
- Effort: ~12 tickets. **Honest fallback if it goes badly: ship F1 as offline-*tolerant* and say so.**

### W4 · F24 corpus scoring — *not a coding task*
`acrowell-ai-worker/test/corpus/README.md` documents three large prior runs at 92–95% intent
accuracy. **Do not reopen this as if from scratch.** What's missing is one clean 588-row run under
the final code, with the summary actually *read*. Needs Harish's login or fresh demo credentials and
burns live quota. One evening, mostly waiting.

---

## 5. Suggested order

```
Week 1   L1 (credit cron) · L2 (deploy F23) · L3 (APK recheck, needs phone) · L4
         └── all small, all close a gap that is currently invisible-but-broken
Week 1   W1 F16 endpoint  ──► rep language test (Harish schedules)
Week 2   W2.1 composition audit ──► go/no-go ──► W2 rest
Week 2+  W3 F1, starting with the bundled-boot proof on a real device
Anytime  W4 corpus run (needs a login evening)
```

L1–L4 first because each one takes hours and each currently makes a *shipped* feature look broken.
W1 next because it finishes something already built. W2 and W3 are the two big ones and should not
run in the same lane — F12 is A+C, F1 is C+mobile; they conflict on lane C, so serialise the
worker-side pieces.

---

## 6. Process rules that apply on resume (learned the hard way, 12 Aug)

- **Two Claude sessions can edit this Drive folder at once.** A file appearing mid-session that
  nothing in `WORKLOG.md` explains may be a sibling session's live work — **check `git log` for very
  recent commits and ask before deleting anything unexplained.** This cost a real deletion.
- `git status`/`find` the **entire** working tree after every aider run — the `--file` list is not a
  boundary DeepSeek respects.
- Portal tickets: **never** read business data via direct PostgREST from a distributor session. Party
  users have no `profiles` row, so `current_company_id()` is NULL and RLS returns zero rows silently.
  Everything goes through the `portal-*` edge functions. This invariant needed defending twice in one
  session.
- Build and deploy from the **main checkout only** — worktrees have no `.env` and reproduce the
  MISSING-ENV outage exactly.
- Every batch: `ship.sh --dry-run` → `ship.sh` → **load the live URL in the browser and read console
  + network.** A green build proves nothing.

## 7. What only Harish can supply

1. **The phone**, for L3 (APK recheck) and W3.1 (bundled-boot proof).
2. **Real reps** for the W1 voice test — code-switched Hindi/Punjabi/English.
3. **A login or demo credentials** for W4.
4. **Applying each batch's migration** in the SQL Editor — one tap-to-copy block per migration.
5. **Indian counsel** before F12 ships production copy, and before F21/F22 are ever switched on.
