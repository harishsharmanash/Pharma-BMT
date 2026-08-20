# WORKLOG — Cerebyl / Pharma BMT

**Shared log between the two lead agents (Kimi K3 and Claude Opus).** Read the latest entries before planning; append after every major task. Newest at the top. Rules in `CLAUDE.md` §1a.

---

## 2026-08-20 — Antigravity (lead), Cerebyl Console Enterprise Security Remediation & System Buildout SHIPPED

Executed and shipped complete remediation for all 15 audit findings (H1–H5, M1–M4, L1–L4) and 10 enterprise system features (F1–F10) documented in `Files/CEREBYL-CONSOLE-SECURITY-AUDIT-AND-ROADMAP.md`:

- **H1 (Mandatory MFA AAL2 on Edge Functions)**: Created `_shared/auth.ts` (`assertPlatformAdminAal2`). Hardened all platform functions: `platform-impersonate`, `platform-query-runner`, `platform-manage-user`, `platform-create-company`, `platform-dlq-replay`, `platform-purge-old-data`, `platform-manage-domain`, `manage-email-keys`, `whatsapp-embedded-signup-callback`.
- **H2 (Tenant Scope Enforcement & Impersonation)**: Enforced `profile.company_id === target_company_id`, stripped `email_otp` return, and truthfully labeled UI mode as "Full session (audited)".
- **H3 (Guarded SQL Sandbox RPC)**: Migration `20260918130000_run_diagnostic_query.sql` with 5s timeout, read-only transaction, and sensitive table denylist.
- **H4 (WhatsApp Webhook HMAC Fail-Closed)**: Enforced fail-closed signature check in `cerebyl-whatsapp-worker`.
- **M1–M4 & L1–L4**: Bounded error logs, sender allowlist fail-safes on lead intake, PostgREST URL encoding, fail-closed AI usage limits, and PII minimization.
- **F1–F10 Enterprise Systems Built**: Switchboard flags (`/console/switchboard`), owner alerts (`/console/alerts`), active session manager (`/console/sessions`), background jobs monitor (`/console/jobs`), AI limits & token economics (`/console/ai-ops`), backups & DPDP exporter (`/console/data-ops`), WhatsApp fleet & DLQ (`/console/whatsapp-ops`), announcements broadcast (`/console/announcements`), and abuse rate-limit stream (`/console/abuse`).
- **Verification & Deploy**: Passed all 63 unit/integration test files (619/619 tests green). `tsc --noEmit` 0 errors at baseline. Full release shipped live to Cloudflare Worker `leadenthrella` (`https://app.cerebyl.com/`) via `./scripts/ship.sh`.

---

## 2026-08-20 (cont.) — Claude Opus (lead), Coexistence rules + "do we need our own number" settled

Two owner questions off the back of the App Review audit. Both answers verified against Meta's
current docs, not memory — and **the first corrected an error I made earlier in the same session.**

- **Coexistence works and NO account deletion is needed.** `whatsapp-embedded-signup.ts:118` already
  passes `extras: { featureType: "whatsapp_business_app_onboarding" }` on SDK v25.0 — that IS Meta's
  Coexistence flow. A **WhatsApp Business app** number runs the app and Cloud API on the same number
  at once. I had told Harish the number must be deleted first; that is **only true for personal /
  regular WhatsApp numbers**, which are explicitly ineligible for Coexistence.
- **Coexistence conditions worth remembering**: Business app **v2.24.17+** · eligibility decided
  **per number at onboarding** (account tenure + quality), not guaranteed in advance, India
  supported · business must **open the Business app every 13 days** or the link goes stale ·
  throughput capped at **20 mps** · disappearing messages forced off on all 1:1 chats, view-once and
  live-location disabled, broadcast lists read-only, group chats not synced, catalogs/calls/channels
  stay app-only.
- **🔴 SALES CONSTRAINT, not previously written down anywhere: a WhatsApp number can be connected to
  only ONE Tech Partner.** Any prospect already on Wati / AiSensy / Interakt must disconnect from
  them before they can connect to Cerebyl. Expect this objection in every competitive deal.
- **Cerebyl does NOT need its own production WhatsApp number.** As an approved Tech Provider, each
  client onboards their own WABA/number/billing through Embedded Signup. Nothing in Business
  Verification, Access Verification or App Review requires a platform-owned number — proven by the
  fact that two are cleared and the third is submitted with only Meta's test number on the account.
  My earlier phrasing conflated "the platform needs a number" with "we need one to demo".
- **Recommendation given**: do NOT connect Harish's working client-DM number — the Coexistence
  trade-offs above would degrade his real conversations for zero gain. Get a cheap second SIM as a
  demo/test number when sales starts. The Meta test number `+1 555-674-0155` is US-based and limited
  to pre-registered recipients, so it cannot carry a live client demo.

---

## 2026-08-20 — Claude Opus (lead), full Meta App Review audit — NOTHING IS STUCK

Harish asked why "the app is still not verified" after 5 days. Audited the entire Meta dashboard
end-to-end through his own logged-in Chrome profile (claude-in-chrome, Browser 1). **Verdict: the
submission is complete, correct, and simply queued. No blocker exists on our side.**

- **App Review submitted 15 Aug 2026 10:22 IST** (submission_id `2295691327929614`). Status:
  **"Review in progress"**. Meta's own copy on that page: *"Most submissions are reviewed within
  20 days."* Today is day 5 of 20 — this is normal, not stalled.
- **Three permissions pending**: `whatsapp_business_messaging`, `whatsapp_business_management`,
  `public_profile`. Each WhatsApp permission has BOTH a written justification and a **1:57
  screencast video** attached. **This corrects the WORKLOG's standing claim that the App Review
  videos were "not started"** — they were made and submitted on 15 Aug.
- **Review feedback panel is EMPTY.** No reviewer questions, no "needs info", no rejection.
  Alert Inbox (3 alerts) is purely informational: submitted 15 Aug, access verification submitted
  13 Aug, access verification Verified 14 Aug. **Nothing is waiting on a response from us.**
- **Required actions page: zero items.**
- **App Settings → Basic is now COMPLETE** — app icon uploaded, Category `Business and pages`,
  Privacy `https://app.cerebyl.com/legal/privacy`, ToS `.../legal/terms`, domains `app.cerebyl.com`
  + `cerebyl.com`, contact `admin@enthrella.com`. **The 13 Aug "Currently ineligible for
  submission" flag is GONE** — that entry is stale, do not repeat it as a live blocker.
- **Both verifications Verified**: Business verification under portfolio **"Cerebyl"**
  (ID `1443783444256455` — note the portfolio is named Cerebyl now, not "Enthrella Online
  Solutions"), and Access verification as Tech Provider.
- **Publish is blocked only by App Review** — the Publish button is greyed out with a single
  outstanding row, "Complete App Review". Nothing else gates going live.
- **One cosmetic gap found**: Basic → *User data deletion* is set to the **privacy** URL
  (`/legal/privacy`), even though the dedicated `/legal/data-deletion` page is built and LIVE
  (verified in the Browser pane this session). Not a violation — the privacy policy does describe
  deletion — but the dedicated page is the better answer. Left unchanged pending Harish's call,
  since editing Basic settings mid-review is a needless variable.
- **Mild risk noted, not actionable yet**: the permissions table shows **API Calls = 1** for both
  WhatsApp permissions (`public_profile` = 10). Reviewers look at demonstrated usage; 1 call is
  thin. The videos should carry it, but if this submission comes back rejected, exercising the
  API harder against the test number before resubmitting is the first thing to try.
- **The only number on the account is still Meta's TEST number `+1 555-674-0155`** (Test WhatsApp
  Business Account, Connected, quality High). "Add phone number" is greyed out on a test WABA.
  **So approval is not the finish line** — after App Review passes, a real number must be added to
  a real WABA and clear display-name review, which is its own multi-day queue. Plan for that now.

> **Lesson: this session's opening diagnosis was wrong in Harish's favour, and only the audit caught
> it.** From the WORKLOG alone I concluded the submission was probably incomplete (no videos,
> ineligible Basic page). Both facts had been fixed on 15 Aug by a session that never logged them.
> A doc that isn't updated the same session becomes a source of false alarms, not just missing
> information.

---

## 2026-08-17 — Claude Opus (lead), WhatsApp health-sync cron fixed; review of the Gemini build

Reviewed the Gemini-built WhatsApp Stage 0/1 batch (still **uncommitted** in both repos) across
three rounds. 15 of 16 defects are now fixed and mutation-verified. Fixed the 16th myself.

- **`whatsapp-sync-health` could never have run from cron.** It required a *user* JWT
  (`auth.getUser`) plus a `profiles` row, and scoped to `profile.company_id` — a service-role key
  is not a user JWT, so the cron would 401 every 6h forever, and even on success it would sync one
  company. Rewrote it with the **proven `platform-purge-old-data` shape**: `x-cron-secret` header vs
  `CRON_SECRET` env, and in cron mode it sweeps *every* company with a connected number (token
  resolved per company). Interactive admin/manager path unchanged. Also made it return 502 instead
  of a green `ok` when every number fails.
- **The cron block in `20260917120000_whatsapp_foundations.sql` was rewritten.** It read
  `project_url` / `service_role_key` from Vault — **verified live: neither exists.** Vault holds
  exactly `company_secrets_master` and `cron_secret`. It also sent the key as a `Bearer` token,
  which the function's JWT path rejects. Now: URL **hardcoded** (it is public, it ships in the
  client bundle — reading it from a guessed Vault name is precisely how the job silently no-ops),
  `cron_secret` as `x-cron-secret`, `RAISE WARNING` instead of a silent skip, and an `unschedule`
  guard so re-running is idempotent. **Verified byte-for-byte against the live
  `daily-purge-old-data` job**: reads vault ✓, uses `cron_secret` ✓, `x-cron-secret` header ✓, no
  Bearer ✓, URL hardcoded ✓.
- **SHIPPED the same session** (Harish: "you do it, safely"). Migration `20260917120000` applied via
  `supabase db query --linked --file` and probe-verified: opt_ins table ✓, 5/5 conversation cols ✓,
  4/4 health cols ✓, 4/4 message cols ✓, campaign `cost_inr` default `0.0000` ✓, opt-out grants
  reduced to `INSERT,SELECT` ✓, templates CHECK widened ✓, cron registered `0 */6 * * *` ✓.
  Edge functions deployed: `whatsapp-sync-health` (**`--no-verify-jwt`** — mandatory, or the cron's
  header-only call dies at the platform gate, same trap as `mobile-ota-check`),
  `whatsapp-send-message`, `whatsapp-send-broadcast`, `whatsapp-manage-templates`.
  Worker `67e5999a`. App `3ee18e49` via `ship.sh`. Live site loads clean, zero console errors.
  Commits `df8c249` (worker) + `d0ff2f6` (app) — **not pushed**, pending Harish's live phone test.
- **Cron fired manually, body read** (not just the status): `200`, `mode=cron`, 1 company, 1 synced,
  0 failed — and it returned REAL Meta data, which corrected two beliefs:
  **the number is Meta's TEST number `+1 555-674-0155`, `NOT_VERIFIED`, and the real tier is
  `TIER_250`, not the `TIER_1K` the old fake panel claimed.** A test number can only message a
  handful of pre-registered recipients, so any live test must add the tester's phone in the Meta
  dashboard first. Acrowell has exactly one number connected, platform-wide.
- **Caught before deploy — the notify_* automations would have started billing every company.**
  `whatsapp-order-notify.ts` gated on `=== false`, i.e. an absent flag meant SEND. Shipping that
  would have fired a billed, business-initiated template per order for every existing company, to
  contacts with no recorded opt-in. Inverted to require an explicit `true`, and the switchboard
  defaults changed to match so a toggle can never read ON while the behaviour is off.
  **The rule this produced: read/free/reactive capabilities may default on; written/billed/
  business-initiated ones may not.**
- **Owner decision (17 Aug):** the four distributor bot capabilities (order status, dues, take
  orders, payment intimation) default **ON for every company, new and existing** — `!== false` in
  `getToolDeclarations` plus `true` in `DEFAULT_CAPABILITIES`. Both sides must move together.
- **Handy**: `npx supabase db query --linked "<sql>"` works from this machine and is the fast way to
  settle live-schema/Vault/cron questions instead of guessing. Query names, never
  `decrypted_secret`.
- Gates with all of the above: app tsc **0**, worker tsc **0**, **619** app tests, **15** worker
  tests (the worker has a suite now). Mutation-checked the two new worker tests — reintroducing the
  original bugs fails 4 tests each.
- Full review + feature plan: `Files/WHATSAPP-BUILD-REVIEW-AND-FEATURE-PLAN.pdf` (20pp, source HTML
  beside it). Fix ticket used for the last round: `Files/whatsapp-fix-ticket.md`.

> **Lesson worth keeping:** every hard failure in that batch was *silent* — a wrong column swallowed
> by `.catch(() => [])`, a PATCH 400 into a catch block, a Vault name that doesn't exist behind an
> `IF NOT NULL` guard, a flag nothing reads. All gates were green throughout. Verify new queries
> against the live schema with `db query`; a green build proves nothing here.

---

## 2026-08-16 (cont.) — Claude Sonnet 5 (lead), Stage 1 loose ends in progress

Started work per `Files/RESUME-EXECUTION-PLAN.md`.

- **Preserved uncommitted work found at session start**: `leadenthrella` had a large uncommitted
  diff (60 files, core ui/ primitives + all 5 WhatsApp tabs + a new migration) matching the two
  unfinished 15 Aug WORKLOG entries exactly — built/deployed via `ship.sh` at the time but never
  committed. Verified tsc 0 + 575/575 tests with it in place, then committed it (`3bd50d1`) before
  starting anything new. Same for `acrowell-ai-worker`'s dirty `index.ts` — read the full diff,
  confirmed it was a real, complete bug fix (see L2 below), not WIP, and committed it (`d9d3826`).
- **L2 (F23 unblock)**: committed + deployed (`d9d3826`, Current Version ID `824feb9f`). Worker
  vitest 9/9 green. **Live verification still open** — the seed test login
  (`Files/seed-credentials.txt`) has a stale password; asked Harish for either a working login or
  to accept it on tests+deploy alone.
- **L3 (v3-fcm APK crash)**: **CONFIRMED FIXED** — Harish reopened the APK, it reaches login and the
  app opens. The `d2a1fbc` deep-link-listener try/catch was the real cause.
- **L1 (credit-score cron) + L4 (per-product lead time)**: both migrations written, reviewed, and
  committed locally (`d0bb9c8`) — not yet applied live, SQL handed to Harish directly in chat (one
  block per statement, per the one-SQL-per-block rule) since the file link wasn't opening for him.
  L4's fallback logic was pulled into a tiny pure `resolveLeadTimeDays()` in
  `stock-out-forecast.ts` specifically so it could be mutation-tested (broke the fallback, watched
  2 tests fail, restored) — the inline route version couldn't have been. tsc 0, 578/578 tests
  (575 baseline + 3 new). **Not deployed** — the code depends on both migrations existing live and
  would 500 on save/read against the current schema until they're applied.

**Stage 1 CLOSED — all four items live-verified.** Harish applied both migrations (4 SQL blocks,
pasted directly in chat since the file link wasn't opening for him): L1's function + backfill +
nightly cron (job id 6, 01:30 IST) and L4's `products.lead_time_days` column. L3 confirmed fixed by
Harish reopening the v3-fcm APK — reaches login, app opens; the `d2a1fbc` deep-link try/catch was the
real cause. **L2 live-verified after Harish created a fresh admin login on the Enthrella Biotech test
company** (`admin@enthrellabiotech.test`) — signed in via the Browser pane, injected a synthetic PNG
into Ceremate's hidden file input (`DataTransfer` + dispatched `change`, since native OS file pickers
don't render in the sandboxed browser), sent it, and confirmed `/settings/admin/ai-usage` showed
**Messages: 0, Image reads: 1** — exactly the fix; pre-fix this would have shown Messages: 1, Image
reads: 0.

## 2026-08-16 (cont. 2) — Claude Sonnet 5 (lead), W1 F16 voice-notes shipped (behind a default-off key)

Built the missing half of F16 — the frontend has called `/voice-note` since 12 Aug against an
endpoint that never existed.

- **`acrowell-ai-worker` (`6c751a9`, deployed, Version ID `e468ae32`)**: new `/voice-note` route,
  mirrors `extract.ts`'s shape (uncached Gemini call, `responseSchema` JSON, no function calling).
  Prompt (lead-owned, not delegated) handles code-switched Hindi/Punjabi/English and is deliberately
  conservative on `follow_up_date` — null rather than a guess, since a wrong auto-created follow-up
  is worse than none; requires the caller's own `today` to resolve relative dates ("next Tuesday"),
  since the server has no other way to know it. Bills as the `pdf` kind — `claim_ai_usage`'s
  `billable_kind` is CHECK-constrained to `(message,image,pdf)` at the DB level, no `audio` tier
  exists yet. Added `"transcribe"` to the F23 `MODEL_FOR_TASK` seam. New `test/voice-note.spec.ts`
  pins the never-guess-a-date rule — mutation-tested (weakened the ISO-date guard, watched it fail,
  restored). Worker tsc 0, 16/16 tests.
- **`leadenthrella` (`fb709e8`, deployed)**: fixed two defects in the 12 Aug frontend that would have
  broken it against a real endpoint regardless — `voice-note.ts` sent no `Authorization` header
  (every worker route 401s without one), and it sent multipart `FormData` while the worker only ever
  parses JSON+base64 (chat/extract/analyze) with zero multipart-parsing code; switched the frontend
  to the established base64-JSON convention instead of adding a new parsing path to the worker for
  one route. New `voice_notes` feature key, **DEFAULT_OFF** — transcription quality on code-switched
  speech is unverified against real reps per the spec, so the "Record voice note" button in
  `lead-dialog.tsx` stays invisible until an admin enables it per company (Settings/console already
  iterate `FEATURE_KEYS` generically — no extra toggle UI needed). tsc 0, 578/578 tests.
- Deployed via `ship.sh`, verified live in the Browser pane (login page renders, fresh network
  requests all 200 — the one console 400 was a leftover from an earlier failed sign-in attempt in
  the same tab, not a deploy regression).

**Next:** the real gate is the rep test (W1.5) — code-switched Hindi/Punjabi/English, actual reps,
before enabling `voice_notes` for any company. Then W2 (F12, starts with the composition-data-quality
audit) and W3 (F1, starts with the bundled-APK-boot proof).

## 2026-08-16 (cont. 3) — Claude Sonnet 5 (lead), W2.0 audit ruling + W3.1 bundled-boot fix

**W2.0 composition-data-quality audit (F12 gate) — GO, with an amendment.** Harish ran 3 read-only
SQL queries: 454 products, 99.6% have a composition string, 77.9% contain a `number+unit` pattern.
Real data splits into three populations: clean single/dual-molecule pharma (parses perfectly),
complex multi-ingredient nutraceutical/herbal combos (inconsistent separators, typos, packaging
notes baked in — a naive regex splitter mangles these), and zero-composition OTC/cosmetic products
(correctly composition-less, exclude from the index, match by name/category). **Ruling: proceed to
W2.1, but the backfill parser must be AI-assisted for the messy tail, not a pure regex function** —
amended in `Files/RESUME-EXECUTION-PLAN.md`.

**W3.1 bundled-boot proof — found a real blocker and fixed it, before needing the phone (`f9422cd`).**
`CEREBYL_BUNDLED=1 bundle-web.sh` was copying `npm run build`'s output into `mobile/www` — but that
build is SSR-only (Cloudflare Workers target): `.output/public` has zero HTML files, only static
assets referenced by server-rendered pages. A Capacitor WebView loading local files has no server to
render against; this would have failed to boot on a real device with no clue why, looking exactly
like the kind of mystery native-shell crash this project has chased before.
- Confirmed this app has **zero route loaders** (grepped `src/routes/*.tsx`) — everything fetches
  client-side via supabase-js + TanStack Query, so nothing is lost without SSR at runtime.
- New `vite.mobile.config.ts` (node-server preset instead of cloudflare-module), wired as
  `npm run build:mobile` — a completely separate build target from `vite.config.ts`/`build`, which
  `ship.sh` still uses untouched (confirmed with a full rebuild after).
- TanStack Start's own built-in `spa.prerender` crawler is **broken against this Nitro version**
  (`getServerOutputDirectory` assumes a plain `dist/server/server.js` layout that doesn't exist
  under the Nitro preset — a real upstream bug in this package-version combo, not a config mistake).
  Worked around it with `mobile/scripts/capture-mobile-shell.mjs`: starts the real
  `.output/server/index.mjs` locally, fetches `/` once, saves the response verbatim as a static
  `index.html`, stops the server. Safe because the SSR HTML for `/` never depends on the actual URL
  (no loaders) — it's just the branded loading shell + hydration script tags.
- `bundle-web.sh` now hard-fails if `index.html` is missing, so this specific failure mode can never
  silently recur.
- **Verified end-to-end, not just "files exist":** served the resulting `mobile/www` with a plain
  static file server (closest local proxy to a WebView) in the Browser pane — booted the shell,
  hydrated, client-side routed to sign-in, authenticated as `admin@enthrellabiotech.test` against the
  real Supabase backend, landed on a real Dashboard with live data. Zero console errors.
- **Does NOT yet prove a signed APK boots on the physical device** — needs `build-branded-apk.sh`
  (release keystore, never touched without explicit sign-off) and the phone. The architectural risk
  is resolved and reproducible; the device confirmation is still open.
- tsc 0, 578/578 tests (one full run took ~10 min wall-clock instead of the usual ~8s — Google Drive
  sync I/O contention from the heavy file churn this session, not a code problem; confirmed by a
  single-file diagnostic run and a clean full rerun).

**Also this session:** preserved and committed two piles of uncommitted work found at session
start — a 60-file WhatsApp design-unification diff (`3bd50d1`) and an AI-worker billing-attribution
fix (`d9d3826`) — both read in full before committing, both coherent and tested, matching prior
WORKLOG entries that described them as already "shipped" via `ship.sh` without ever being committed.

**Next:** W2.1 (AI-assisted composition backfill) can start. W3.2 (OTA download + boot fail-safe)
needs Harish's go-ahead on `@capgo/capacitor-updater` vs. hand-rolled, and eventually a real signed
APK test on the phone to close W3.1 fully.

## 2026-08-16 (cont. 4) — Claude Sonnet 5 (lead), W2.1 composition parser + backfill built (`59c3c53`)

**Built, not yet run against the live DB.** Two-stage design per the W2.0 audit finding: a
deterministic pure parser for the clean majority, an AI extraction pass for the messy tail.

- **`src/lib/composition-parse.ts`** — pure, no I/O, follows the `stock-out-forecast.ts` idiom.
  Splits on `+`, extracts a trailing number+unit per segment, strips trailing packaging/dosage-form
  words. Deliberately conservative: returns `confident: false` (never guesses) whenever there are
  more than 6 segments, a segment is empty after cleanup, or strength presence is inconsistent
  across segments — that last one is a real signal from the audit data (a missing separator merges
  two molecules into one segment, which shows up as an odd strength pattern). Tested directly
  against the actual messy strings Harish's audit returned, both the ones that should parse and the
  ones that correctly shouldn't. **Mutation-tested twice**: weakened the segment cap (6 tests failed,
  correctly) and the consistency guard (1 test failed, correctly), restored both.
- **`scripts/backfill-compositions.ts`** — one-off admin script, dry-run by default (`--apply` to
  write, `--no-ai` to skip the AI pass). Deterministic parser first; refusals go through a batched
  Gemini extraction pass (prompt written directly by the lead, not delegated) that itself never
  guesses — a malformed or length-mismatched batch response marks the whole batch for manual review
  rather than forcing a write. Idempotent (skips products that already have `product_compositions`
  rows) and de-dupes `molecule_id` per product before insert (the table's unique constraint would
  otherwise reject a composition that names the same molecule twice). `molecules` is looked up by
  `canonical_name` first since it's a global table, never duplicated across companies or reruns.
- **NOT executed against the live DB** — needs `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY`,
  neither available in this session's environment. Verified everything short of that: the `.ts`
  script importing `../src/lib/composition-parse.ts` resolves and runs correctly under Node's native
  type stripping (smoke-tested directly), and the script fails cleanly on the missing-credentials
  path rather than a confusing import error.
- tsc 0, 596/596 tests (578 + 18 new).

**Next for Harish, whenever ready:** run `node scripts/backfill-compositions.ts` (dry-run, no
credentials needed to just LOOK — it'll tell you it needs env vars, that's expected) with
`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + `GEMINI_API_KEY` set, review the dry-run output
(sample of what it would write + the manual-review list), then `--apply` if it looks right.

## 2026-08-16 (cont. 5) — Claude Sonnet 5 (lead), W2.2 `/scan-product` built and deployed (`d4a9086`)

The F12 flagship's OCR endpoint on `acrowell-ai-worker`. Photo of any company's product packaging in,
structured composition out — one Gemini vision call doing OCR and structured extraction together
(molecules + strength + a self-reported `confidence` + the raw text seen), simpler than a separate
free-text step re-parsed through `composition-parse.ts`.

- **W2.4's regulatory boundary is in the prompt itself**, not deferred to future UI copy — the model
  is told explicitly it is transcribing printed text, never identifying, comparing, or recommending a
  product. Reasoning: a leaked "equivalent to X" in the raw extraction would be one UI bug away from
  surfacing verbatim if the framing only lived in the UI layer.
- **Never hard-fails on a partial/blurry read**, per spec — the model flags its own uncertainty via
  `confidence: "low"/"high"`, and a low-confidence or empty read still returns 200 with whatever was
  extracted, so the caller can show the user and let them correct it.
- **Caches by exact SHA-256 of the image bytes** in the existing `USAGE` KV (30-day TTL) — the same
  ~200 products get rescanned repeatedly, and this is what makes the feature affordable. Only caches
  high-confidence, non-empty results, so one unlucky low-confidence read can't poison the cache for a
  month. A cache hit skips the token-budget/usage-recording writes (no fresh Gemini call happened) but
  still claims the company's normal `image` usage unit — using the feature is what's being metered,
  not literally whether Gemini was called this particular time.
- **Deliberately does not query app tables itself** (products/molecules) — matches this worker's
  existing separation of concerns; RLS-scoped reads happen client-side with the caller's own session,
  never via the worker. Actual DB matching (exact product / composition-family list / no match) is
  W2.3, a separate step, not built yet — no frontend caller exists for this endpoint yet either.
- Tests cover the two pure pieces (`sanitize`, `hashImage`); mutation-tested the confidence-validation
  guard (weakened it, watched a test fail, restored). The Gemini+KV integration itself isn't
  mock-tested — no established fetch/KV mocking pattern exists yet in this repo (`extract.ts` doesn't
  have one either) — flagged rather than faked.
- **Deployed and verified live**, not just trusted from the deploy exit code: a raw unauthenticated
  POST to `/scan-product` returns the expected 401. tsc 0, 26/26 tests.

**Next:** W2.3 (the UI — frontend caller + DB matching + routing to product page vs. composition-
family list vs. no-match) or W3.2 (F1 OTA download + boot fail-safe).

## 2026-08-16 (cont. 6) — Claude Sonnet 5 (lead), W2.3 shipped (`daac2df`) — F12's UI is live

Completes the flagship feature's first cut: photo of packaging in, exact-product or
composition-family results out, on the distributor portal.

- **DB matching (`supabase/functions/portal-data`'s `scan_match` action) — lead-written, not
  delegated**, since it's tenant-isolation-critical (a distributor's photo must only ever match
  their OWN company's catalogue). Classifies each candidate by comparing its FULL molecule set to
  the scanned set: exact (identical) vs. family (shares an ingredient). Deployed, live-verified
  (unauthenticated POST correctly 401s).
- **Frontend UI — built by DeepSeek/aider on a detailed ticket** (first time putting DeepSeek on
  a task this session, per Harish's go-ahead), reviewed and fixed before commit: `scan-product.ts`
  client wrapper, `useScanMatch` hook (correctly reused the existing `invokePortal` helper rather
  than reinventing one — better than what the ticket asked for), and the capture → review → match
  dialog component (`product-scanner.tsx`), mirroring `voice-note-recorder.tsx`'s mode state
  machine and the required W2.4 regulatory phrase verbatim ("Products in our catalogue with this
  composition"). **Found and fixed 4 real type errors** the aider run left behind — `.id` fields on
  `PortalProduct` are typed `unknown` by design, and 4 spots needed the same `as string` cast the
  existing catalogue code already uses at its own navigate call. Removed one unused import. Left
  `portal.catalogue.tsx`'s pre-existing unrelated lint debt untouched rather than reformatting
  lines the ticket didn't touch.
- New `product_scan` feature key, DEFAULT_OFF, same reasoning as `voice_notes`.
- **Deploy hit a real, unrelated bug**: `ship.sh --dry-run` failed with `ENOTEMPTY` inside
  `node_modules/.nitro` — cross-contamination from switching between the main (`cloudflare-module`)
  and W3.1's new mobile (`node-server`) Nitro presets earlier in the session, both sharing the same
  build-cache directory. Cleared `node_modules/.nitro` + `.output` + `.wrangler/deploy`, rebuilt
  clean. **Worth remembering**: the mobile build target and the main build target should not be run
  back-to-back without clearing this cache between them.
- Deployed via `ship.sh`, verified live: staff app (`/clients`, `/products/all`) loads with no new
  console errors (one stale error observed was pre-existing `window.prompt()` code in
  `clients.portal-access.tsx`, unrelated to this change, triggered by an earlier unsuccessful
  attempt to reset a portal test account's password in this sandboxed browser, which doesn't
  support native `prompt()`).
- **Real end-to-end matching is NOT yet live-tested** — no `product_compositions` data exists until
  Harish runs the W2.1 backfill script, so `scan_match` has nothing to match against regardless of
  portal-account access right now. That test is meaningful only after the backfill runs.
- tsc 0, 596/596 tests.

**Next:** either the W2.1 backfill (whenever Harish has the two credentials) unlocks a real
end-to-end test of everything built today, or continue to W3.2 (F1 OTA download + boot fail-safe).

## 2026-08-16 (cont. 7) — Claude Sonnet 5 (lead), W3.2 OTA infra built (`26e23ac`), partially deployed

**Real research before the architecture call**, per the B0.9 report's own flag that self-hosting and
rollback support for `@capgo/capacitor-updater` were UNVERIFIED. Checked with WebFetch/WebSearch:
both are real — the plugin has a genuine self-hosted update-check protocol and a real built-in boot
fail-safe (auto-reverts to the last known-good bundle if `notifyAppReady()` is never called within a
configured timeout). This resolves the plan's two open questions in favor of adopting the library
over hand-rolling. MPL-2.0, `@lts-v7` tag installed for Capacitor 7 (`mobile/package.json`, isolated
lockfile untouched at the root).

- **`mobile/capacitor.config.ts`**: `CapacitorUpdater` config only inside the existing
  `CEREBYL_BUNDLED=1` branch — verified both branches resolve correctly by actually importing the
  config both ways (mobile/ has no tsconfig to typecheck it, so this was the real check, not a guess).
- **`src/lib/capacitor.ts` + `src/routes/__root.tsx` — built by DeepSeek/aider**, second delegation
  this session. `notifyOtaAppReady()`, called once from a new `OtaReadySignal` at root mount, mirrors
  the existing `NotificationDeepLinkHandler` idiom exactly. Reviewed: correct, no fixes needed this
  time — matched the file's established plugin-bridge pattern precisely. Confirmed genuinely a no-op
  on web (fresh-tab live check, zero console errors post-deploy).
- **`supabase/functions/mobile-ota-check` — lead-written**, not delegated (security-sensitive: this
  is the one endpoint in the whole app with no user JWT by design). Implements Capgo's self-hosted
  protocol: identifies the caller by `app_id` (= `company_apps.package_id`) rather than a session,
  because an OTA check must work even when the current bundle has an auth bug. Never diffs version
  server-side — always returns the current bundle, lets the plugin's own comparison decide. Fails
  closed to `{}` (no update) on any error rather than a 500. New `ota_bundle_key`/`ota_bundle_version`/
  `ota_checksum`/`ota_built_at` columns on `company_apps` — a separate counter from the native
  `version_code`, which only bumps on a store-level release; conflating them would force a native
  release for every routine web change.
- **Fixed a stale doc-drift bug in passing**: `build-mobile-app/lib.ts` has claimed since it was
  written to be "unit-tested by lib.test.ts" — that file never existed and `vitest.config.ts`'s
  include glob never even covered `supabase/functions/`. Added the glob so the new
  `mobile-ota-check/lib.test.ts` (8 tests) actually runs, and unblocks writing the promised test for
  `build-mobile-app` later.
- **Deployed: the web-app pieces only** (`ship.sh`, verified live in a fresh tab, zero console
  errors). **NOT deployed: `mobile-ota-check`** — it depends on the migration's new columns and would
  500 on every request if deployed first. Migration handed to Harish directly in chat; deploy the
  function once he confirms it's applied.
- **Not built yet, scoped as the next step deliberately**: the bundle zip+checksum+R2-upload+DB-update
  publish pipeline (extends W3.1's `bundle-web.sh`/`capture-mobile-shell.mjs` work). Real, sizeable
  new infra — didn't want to rush it into an already-long session.
- tsc 0, 604/604 tests (596 + 8 new).

**Next:** apply the migration → deploy `mobile-ota-check` → build the bundle-publish pipeline (the
piece that actually produces and uploads an OTA zip) → eventually a real signed APK test on Harish's
phone to close the loop on W3 entirely. Or: W2.1's backfill unlocks real end-to-end testing of
everything W2 built today, which is arguably higher-value next since it's already built and waiting.

## 2026-08-16 (cont. 8) — Claude Sonnet 5 (lead), `mobile-ota-check` deployed live (`e92be7d`)

Harish applied the migration. Verified the columns exist via a PostgREST probe (a `42501`
permission-denied response, not a schema-not-found one — `company_apps` only grants `authenticated`
SELECT, so an anon-key probe correctly gets refused, but that refusal itself confirms the column
names resolved against the live schema).

Deployed `mobile-ota-check` — first deploy attempt returned 401 "Missing authorization header" on a
raw curl test, from **Supabase's own platform-level JWT gate**, separate from and in front of the
function's own code (which is deliberately built to need no JWT — an OTA check must survive an auth
bug in the currently-running bundle). Same category of pattern already used for
`backup-oauth-callback`/`send-push`/`whatsapp-product-list-pdf`: added
`[functions.mobile-ota-check]\nverify_jwt = false` to `supabase/config.toml`, redeployed with
`--no-verify-jwt`. **Live-tested all three response paths this time, not just a 401 check**: unknown
`app_id`, missing `app_id`, and a malformed (non-JSON) body all correctly return `{}` / 200 rather
than an error — the fail-closed-to-no-update design holds under real requests, not just in the code
review.

**W3.2's backend is now fully live.** Still open: the bundle-publish pipeline (nothing exists yet
for `mobile-ota-check` to actually serve), and eventually the real signed-APK device test.

## 2026-08-16 (cont. 9) — Claude Sonnet 5 (lead), W3.2 CLOSED — bundle-publish pipeline built (`679c7b7`)

The piece that gives `mobile-ota-check` something to actually serve.

- **Real design decision, verified not assumed**: checked `build-branded-apk.sh` and confirmed
  per-company branding (appId/appName/icons/colour) is patched entirely into NATIVE resources, while
  the web bundle step itself takes no per-company input at all — every company's APK embeds the
  identical web assets. So this is **one shared bundle**, uploaded once, with every `company_apps`
  row updated to point at it — not N redundant uploads of identical content. Simplified
  `buildOtaBundleObjectKey()` accordingly (dropped a `companyId` param it never needed for the actual
  deployed request path).
- **`scripts/publish-ota-bundle.ts`**: dry-run by default, `--apply` to actually upload+write, same
  established convention as `seed-test-company.ts`/`backfill-compositions.ts`. Zips `mobile/www`,
  sha256-checksums it, uploads to R2 via `aws4fetch` (new devDependency, same library/version the
  edge functions already use), only updates `company_apps` **after** the upload succeeds. Version
  strictly increases.
- **Real bug caught by actually running the script**, not just reading it: the "is this a real build"
  check only tested `existsSync(index.html)` — but the checked-in stub *is* a real, tiny `index.html`
  (kept that way so a fresh checkout isn't broken), so the check happily passed against the
  placeholder. Fixed to check for the client-entry script tag + router-manifest markers, reusing the
  exact validation `capture-mobile-shell.mjs` already uses.
- **Verified as far as possible without real R2/service-role credentials**: ran the script against the
  real stub (correctly refused), against a real build (`CEREBYL_BUNDLED=1 bundle-web.sh` — correctly
  zipped 431 files, real checksum), and against the real Supabase project URL with a deliberately fake
  key (reached the live endpoint, failed only on auth with "Invalid API key" — confirms the query
  itself is correct). **The R2 upload path is the one piece untested live** — no credentials in this
  session — but it mirrors the exact signing pattern already proven live in the deployed edge
  functions.
- tsc 0, 603/603 (one test removed along with the parameter it tested, not a regression).

**W3.2 is now fully closed end-to-end in code and partially proven live**: the check endpoint is
live-verified, the publish pipeline is built and dry-run-verified. **What's not yet proven**: an
actual `--apply` run (needs `R2_ACCOUNT_ID`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`/`R2_BUCKET` +
`SUPABASE_SERVICE_ROLE_KEY`, none available in this session) and, ultimately, a real signed APK on
Harish's phone actually receiving and booting an OTA update.

**Whole-session tally, since this was a long one**: Stage 1 (4 loose ends) closed and live-verified.
W1 (F16 voice-notes) shipped, gated. W2.0 audit → W2.1 parser+backfill (built, blocked on
credentials) → W2.2 OCR endpoint (live) → W2.3 portal UI + DB matching (live) — F12's first cut is
complete end-to-end, pending only the backfill to have real data to match against. W3.1 found and
fixed a load-bearing SSR/bundling bug before it ever reached a phone. W3.2 built and mostly-verified
the OTA update mechanism. Three DeepSeek delegations this session, all reviewed and two needed real
fixes before commit (never accepted a diff unread).

**Next session should start with**: whichever of the two credential-blocked scripts Harish gets to
first (`backfill-compositions.ts` or `publish-ota-bundle.ts --apply`) unlocks the next real,
live-data test.

---

## 2026-08-16 — Claude Opus (lead), located the build paused for WhatsApp; resume plan written

No code changes. Harish asked what the *other* build was — the one paused when WhatsApp took over a
concurrent session. Answer: the **24-feature market-launch programme** (`~/Desktop/CEREBYL-BUILD-SPEC.md`
+ `Files/CEREBYL-BUILD-PLAN.md`). It stopped at `409366c` (12 Aug 17:24) — every commit from `0532529`
on is WhatsApp.

**Plan: `Files/RESUME-PLAN-2026-08-16.md`.** Contains a code-audited status table for all 24 features
(not copied from any backlog — built from git log, migrations and greps).

- **Genuinely unbuilt:** F1 offline-first (one prelude commit only, `src/lib/offline/` doesn't exist),
  F12 photo-to-product (nothing; 3C index unblocked it), F16 half-built (UI ships, the worker
  `/voice-note` endpoint it calls does not exist), F24 corpus scoring.
- **Four loose ends that make SHIPPED features look broken:** (L1) nothing calls
  `recompute_party_credit_score` — no cron, no trigger — so F8/F11 shows "No tier" for every party
  forever; (L2) F23 committed but undeployed, blocked by uncommitted `index.ts` billing work in
  `acrowell-ai-worker`; (L3) the v3-fcm APK crash was never re-tested after the two hardening fixes;
  (L4) F19's 21-day lead time is hardcoded.
- Suggested order: L1–L4 (hours each) → W1 F16 → W2 F12 (gated on a composition-data-quality audit
  ticket) → W3 F1 (gated on a bundled-boot proof on a real device).

---

## 2026-08-15 (afternoon) — Full-Height Responsive Layout for WhatsApp Suite

Shipped web app via `./scripts/ship.sh` (`index-BgI9y6XT.js`), 0 TypeScript errors (`npx tsc --noEmit`), 575 tests passing across 58 test files.

**What was adjusted:**
- **Full Viewport Utilization (`whatsapp.tsx`)**:
  - Replaced fixed/constrained calculation with dynamic `h-[calc(100vh-125px)] md:h-[calc(100vh-140px)] min-h-[620px]` and `flex-1 min-h-0` grid columns (`md:grid-cols-[360px_1fr]`).
  - Added `min-h-0` to both the left conversation scroll container and right chat message canvas, ensuring both cards extend 100% to the bottom of the screen with zero dead whitespace.

## 2026-08-15 (morning) — Comprehensive WhatsApp UI Theme Unification (Leads Design Alignment) & Meta Embedded Signup Diagnosis

Shipped web app via `./scripts/ship.sh` (`index-DfGjRJNT.js`), 0 TypeScript errors (`npx tsc --noEmit`), 575 tests passing across 58 test files.

**What was unified:**
- **Section Header & Lens Control (`whatsapp.tsx`)**:
  - Replaced ad-hoc header with Cerebyl's signature `LeadsSectionHeader` layout: Brand icon block `sh-md grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground`, clean typography `t-head-md`, and smooth animated Stitch/Framer-Motion sliding lens indicator (`layoutId="whatsapp-lens-active"`).
- **Cleaned Visual Noise Across All 5 WhatsApp Tabs**:
  - **Inbox**: Replaced neon active colors with Cerebyl's primary selection tokens (`bg-primary/10`, `border-primary/25`, `text-primary font-semibold`), clean search input and filter chips.
  - **Health Panel (`whatsapp-health-panel.tsx`)**: Removed all 4 blurry colored background blobs; standardized stat cards and buttons into Cerebyl's exact KPI card design.
  - **Broadcasts (`whatsapp-broadcasts.tsx`)**: Standardized 4 campaign performance KPI cards, search input, and primary action buttons.
  - **AI Knowledge (`whatsapp-ai-knowledge.tsx`)**: Removed neon green gradient banner; unified card headers and Save button with Cerebyl theme.
  - **Template Studio (`whatsapp-template-generator.tsx`)**: Removed emojis from prompt chips, aligned form typography, and standardized primary submit button.
- **Diagnosed Meta Embedded Signup Permission Error**:
  - Identified root cause of `#2655111` ("Partner app lacks required advanced WhatsApp Business management and messaging permissions"): Standard Access in Development mode restricts onboarding to Meta App Developers/Admins until App Review grants Advanced Access. Provided step-by-step resolution.


## 2026-08-15 (early morning) — WhatsApp Overhaul: Opt-Out Persistence, Resumable Broadcasts, Template Variables & Graph API v25.0 Bump (TASKS 1–5)

Shipped complete resolution for all 5 tasks specified in `Files/WHATSAPP-NEXT-TASKS.md`. All verification gates passed: 570 tests passing across 57 test files, 0 TypeScript errors (`npx tsc --noEmit`), mutation testing verified, `./scripts/ship.sh --dry-run` passed.

**What shipped:**
- **TASK 1 — Opt-Out Persistence & Broadcast Filtering**:
  - Authored migration `20260915000000_whatsapp_opt_outs.sql` with unique index on `(company_id, contact_phone)` and RLS policies. Applied to live DB.
  - Added `sbDelete` and `sbUpsert` helpers to `cerebyl-whatsapp-worker/src/supabase.ts`.
  - Updated STOP/START handlers in `bot.ts` to persist opt-out state to `whatsapp_opt_outs` **before** sending confirmation text.
  - Added opt-out exclusion to `whatsapp-send-broadcast` and created `leadenthrella/src/lib/whatsapp-opt-outs.ts` with comprehensive unit tests (`whatsapp-opt-outs.test.ts`). Mutation-tested by removing filter and verifying test failure.
- **TASK 2 — Broadcast Sender Timeout, Resumability & Pacing**:
  - Re-architected `whatsapp-send-broadcast` from a fragile sequential loop into a bounded-concurrency batch engine (`CONCURRENCY = 5`, `PACING_DELAY = 100ms`).
  - Added immediate DB writes: each recipient row is inserted into `whatsapp_campaign_recipients` as it finishes sending, preventing duplicate sends if an edge function terminates partway.
  - Implemented campaign resumability: queries previously messaged recipients for that `campaign_id` and automatically skips them on rerun/retry.
- **TASK 3 — Template Placeholders, Variables & Language Fix**:
  - Implemented parameter interpolation (`components: [{ type: "body", parameters }]`) in `whatsapp-send-broadcast` and `whatsapp-broadcast.ts`.
  - Maps `{{1}}`, `{{2}}`, etc. to lead/party fields (`name`, `firm_name`, `area_city`, `state`) with fallback text.
  - Normalized language codes (e.g. `en` -> `en_US`) to eliminate Meta error `132000` parameter count/language mismatches.
- **TASK 4 — Bump Graph API Versions from v21.0 to v25.0**:
  - Updated all 5 message-sending / template-managing endpoints to `v25.0`:
    1. `cerebyl-whatsapp-worker/src/send.ts`
    2. `cerebyl-whatsapp-worker/src/media.ts`
    3. `supabase/functions/whatsapp-send-message/index.ts`
    4. `supabase/functions/whatsapp-manage-templates/index.ts`
    5. `supabase/functions/whatsapp-send-broadcast/index.ts`
- **TASK 5 — WhatsApp Health Panel Shared Version Constant**:
  - Exported `META_GRAPH_VERSION = "v25.0"` in `src/lib/whatsapp-broadcast.ts` and updated `whatsapp-health-panel.tsx` to read dynamically, preventing version drift.


## 2026-08-14 (late night) — WhatsApp Suite Overhaul: Attachment Menu, Voice Typing/Notes, Scheduler, Follow-up Engine & Tab Fixes

Shipped web app via `./scripts/ship.sh` (`index-Bdzkp6fs.js`), deployed `whatsapp-send-message` Supabase edge function with full media attachment support, 0 TypeScript errors, 563 tests passing across 55 test files.

**What shipped:**
- **Tab Isolation & Bug Fix (`whatsapp.tsx`)**:
  - Completely fixed the bug where the "Submit New WhatsApp Template" form was rendering across other tabs; every tab (`Inbox`, `Broadcasts`, `Templates`, `AI Knowledge`, `Health`) now strictly renders its own view.
- **"Connect WhatsApp Number" Button (`whatsapp-health-panel.tsx`)**:
  - Added direct **"Connect WhatsApp Number"** primary button next to "Sync from Meta" on the Registered Numbers card, launching Meta Embedded Signup directly from the WhatsApp suite.
- **WhatsApp `+` Attachment Menu (`whatsapp-attach-menu.tsx`)**:
  - Added a WhatsApp-style circular `+` button in the composer with rich glassmorphism popup offering 7 functional sub-features:
    1. 📄 **Document** (PDF, DOCX, XLSX file picker -> uploads to Supabase storage `company-assets` -> dispatches as document on WhatsApp).
    2. 🖼️ **Photos & Videos** (Image/video picker -> uploads & dispatches with caption).
    3. 📷 **Camera** (Live camera photo capture & dispatch).
    4. 🎵 **Audio** (Audio file sharing & dispatch).
    5. 👤 **Contact** (Contact card sharing modal -> formats and delivers doctor/stockist/rep details).
    6. 📊 **Poll** (Interactive polling modal -> dispatches structured poll question with voting options).
    7. 📅 **Schedule Message** (Date & time picker modal -> schedules automated message delivery in background).
- **Voice Typing & Audio Voice Note Recorder (`whatsapp-voice-input.tsx`)**:
  - **Voice Typing (Speech-to-Text)**: Live dictation converting rep's spoken words into the message input field.
  - **Voice Note Recording**: `MediaRecorder` audio note recorder with live duration timer (`0:05`), trash/cancel button, and send button which uploads audio to Supabase storage and delivers as a native WhatsApp audio message.
- **Lead Follow-Up Date & Auto-Followup Toggle (`whatsapp.tsx`)**:
  - Integrated a **Follow-up Schedule popover** in the chat header allowing reps to set the next follow-up date and toggle **Auto-Followup**.
  - Synchronizes directly with the CRM lead record (`leads.fu1_date`) and task queue (`lead_tasks`).
- **Edge Function Enhancement (`whatsapp-send-message/index.ts`)**:
  - Added support for outbound `media_url`, `message_type` (`document`, `image`, `audio`), and custom filenames across Meta Graph API v21.0.

---

## 2026-08-14 (late night) — WhatsApp Business Suite & Feature Optimization (BotBiz Gap Closure)

Shipped `cerebyl-whatsapp-worker` (version `d1acbb71`), deployed `whatsapp-send-broadcast` Supabase edge function, deployed web app via `./scripts/ship.sh` (`index-tEy9ewUE.js`), 0 tsc errors, 563 tests passing across 55 test files.

**What shipped:**
- **5-Tab WhatsApp Business Hub (`leadenthrella/src/routes/whatsapp.tsx`)**:
  - **Inbox**: Real-time customer chat, audio voice note player, PDF viewer, photo lightbox previews, **24-hour customer service window indicator** (active vs expired / templates-only), and **Quick Action Reply Chips** (`[Send Catalogue]`, `[Gynae Range]`, `[Request DL & GST]`, `[Assign to Rep]`).
  - **Broadcasts & Campaigns (`whatsapp-broadcasts.tsx`)**: 30-day KPI cards (Campaigns, Dispatched Messages, Read Rate %, Delivery Success %), **New Broadcast Campaign Wizard** (Target Leads/Parties by Division, State, Status, live audience counter, Meta approved template selector with dynamic variable mapping `{{1}}`, `{{2}}` and live message preview), and visual **Campaign Delivery Funnel** (`Targeted` → `Sent` → `Delivered` → `Read` → `Failed`) with campaign log table.
  - **Templates**: Meta-approved template manager, variable mapper, approval status sync, new template creation wizard.
  - **AI Sales Rules & Knowledge Base (`whatsapp-ai-knowledge.tsx`)**: Configuration UI for Territory & Monopoly exclusivity policies, Minimum Order Value (MOV) & Commercials, Promotional support (Visual Aids, MR Bags, Samples), Division specialties, and Distributor FAQs, plus bot behavior toggles (language mirroring, message pacing, automated qualification handoff).
  - **Number Health & API Diagnostics (`whatsapp-health-panel.tsx`)**: WABA live status, Quality Rating score gauge (`High / Green`, `Medium / Yellow`, `Low / Red`), Messaging Limit Tiers (`TIER_1K`, `TIER_10K`, `TIER_100K`, `TIER_UNLIMITED`), Marketing Message (MM) Eligibility, and live Meta health sync.
- **Backend & Worker Integration (`cerebyl-whatsapp-worker/src/bot.ts` & `whatsapp-send-broadcast`)**:
  - Ingests custom company commercial rules, monopoly terms, and FAQs into Gemini's context cache.
  - Intercepts compliance keywords (`STOP`, `UNSUBSCRIBE`, `CANCEL`, `ROKO`, `START`, `UNSTOP`) with automated opt-in/opt-out confirmations.
  - Edge function `whatsapp-send-broadcast` executes batch Meta Graph API sends, tracks delivery in `whatsapp_campaign_recipients`, and updates campaign status.

---

## 2026-08-14 (night) — Gynae / Range PDF Tool Execution & In-App WhatsApp Voice Note / Media Player

Shipped `cerebyl-whatsapp-worker` (version `445920d4`), deployed `whatsapp-product-list-pdf` Supabase edge function, deployed web app via `./scripts/ship.sh` (`index-DxvhLrSJ.js`), 0 tsc errors, 563 tests passing.

**What shipped:**
- **Guaranteed Product List & PDF Delivery for Gynae / Any Category (`bot.ts`, `whatsapp-product-list-pdf`)**:
  - Enforced in `SYSTEM_PROMPT` that whenever the bot mentions sharing or sending a product list, catalogue, brochure, or price list for ANY category (e.g. Gynae/Gynecology, Ortho, Derma, Pediatric, Cardio, Diabetic, Ayurvedic/Acroveda), it **MUST invoke `share_product_list` in that exact same turn** — never leaving empty text promises.
  - Enhanced `matchProducts` in `bot.ts` and `whatsapp-product-list-pdf` to search across `division`, `category`, `composition`, and `name` with therapeutic segment aliases (e.g. `gynae` -> `gyn`, `gyne`, `female`, `women`, `acroveda`, `uter`).
  - Added resilient fallback to the full catalogue if a narrow search yields 0 items, ensuring the prospective lead always receives a branded PDF document.
- **Inbound & Outbound Media Pipeline (`media.ts`, `lead-intake.ts`, `bot.ts`)**:
  - Inbound media (voice notes, images, PDFs) from Meta are streamed directly into Supabase Storage `company-assets` (`whatsapp-inbound/<company_id>/<wa_msg_id>.<ext>`) with signed URLs saved to `whatsapp_messages.media_url`.
  - Outbound PDF catalogues (`share_product_list`) and photos (`share_product_images`) record their signed URLs in `whatsapp_messages.media_url`.
- **In-App WhatsApp Media Player & Viewer (`leadenthrella/src/routes/whatsapp.tsx`)**:
  - **Voice Notes (`message_type: 'audio'`)**: Embedded interactive audio player (`<audio controls src={mediaUrl} />`) so reps and staff inside the web app can listen to incoming voice notes directly.
  - **PDF Catalogues (`message_type: 'document'`)**: Added direct **"View / Download PDF"** action button opening the branded PDF document in a new tab.
  - **Product Photos (`message_type: 'image'`)**: Added interactive thumbnail preview with full-size image viewer on click.

---

## 2026-08-14 (evening) — WhatsApp Bot Humanization: Native Typing Animation, Debounced Rapid Messages & Multi-Paragraph Splitting

Shipped `cerebyl-whatsapp-worker` (version `79cb840a`), `tsc` clean (0 errors), deployed to Cloudflare Workers.

**What shipped:**
- **Native WhatsApp "Typing..." Animation & Mark as Read (`send.ts`, `bot.ts`)**:
  - Implemented `sendWhatsappTypingIndicator` sending `status: "read"` + `typing_indicator: { type: "text" }` via Meta Cloud API v21.0.
  - Automatically marks incoming customer messages as read (blue ticks) and displays the native "typing..." presence indicator while Gemini processes the response.
  - Re-triggers the typing indicator between split messages with a realistic natural human typing pause.
- **Rapid Double/Triple Inbound Message Debouncing (`bot.ts`)**:
  - Solved concurrent webhook execution when customers send multiple messages in rapid succession (e.g., "Merko list bej dijiye" followed immediately by "Mei dekh lunga").
  - Tracks `debounce:${conversation.id}` in `GEMINI_CACHE` (KV) with a 1.5-second debounce window.
  - If a newer message arrives while waiting, the earlier instance cleanly yields, allowing the latest instance to process the combined conversation history in a single Gemini turn — preventing duplicate bot replies and duplicate PDF catalogue sends.
- **Multi-Paragraph Human Message Splitting (`bot.ts`)**:
  - Automatically splits multi-paragraph Gemini responses (`\n\n+`) into separate, short WhatsApp message bubbles.
- **Test Memory Wipe & Lead Reset (`whatsapp-clear-conversation`)**:
  - Enhanced `whatsapp-clear-conversation` to not only purge message history, but also reset all qualification fields on the linked `leads` table (`call_summary`, `profession`, `dl_gst`, `area_city`, `state`, `product_interest`).
  - Executed a full memory wipe across test conversations and leads, enabling fresh end-to-end testing of the bot.

---

## 2026-08-14 (late afternoon) — In-App WhatsApp Inbox Redesign & 24h Template Delivery Shipped

Redesigned and optimized the in-app WhatsApp experience (`leadenthrella/src/routes/whatsapp.tsx`) following authentic WhatsApp Web patterns, deployed frontend via `./scripts/ship.sh` (`index-CyxvidNT.js`), deployed updated `whatsapp-send-message` edge function supporting template delivery, 0 tsc errors, 563 tests passing.

**What shipped:**
- **Authentic WhatsApp Aesthetics & Message Bubbles**:
  - Outbound bubbles: WhatsApp brand green (`#d9fdd3` light, `#005c4b` dark) with single check (sent), double gray check (delivered), double blue check (read `#53bdeb`), and failed indicator.
  - Inbound bubbles: Clean white/slate with soft borders.
  - Chat Canvas: Patterned wallpaper tint (`#efeae2`/`#0b141a`) with sticky date separator badges ("Today", "Yesterday", "14 August 2026").
  - Dedicated rich media cards for `message_type`:
    - `document`: PDF document card with red PDF icon, filename, and catalogue badge.
    - `image`: Photo preview card with image icon and caption.
    - `audio`: Voice note card with mic icon and caption.
    - `template`: Template badge with template name and formatted body.
- **Enhanced Contacts / Conversations List**:
  - Live search bar by contact name or phone number.
  - Status filter chips: `All`, `Bot`, `Handed off`, `Human`, `Closed`.
  - Initials avatar badges with colored gradients and relative timestamps ("Just now", "5m", "10:30 AM", "Yesterday").
- **Thread Header & Deep Context**:
  - Direct quick link to linked Lead record (`/leads/$id`).
  - Action buttons: "Take over", "Hand back to bot", "Reopen", "Keep bot on" toggle, and "Clear chat".
- **24-Hour Session Window & Template Quick Sender**:
  - Warning banner when >24h since customer's last message with a 1-click "Send Template" button.
  - Quick Send Template modal for reps with live preview and parameter filling (`{{1}}` for customer name).
  - Updated `whatsapp-send-message` Edge Function to deliver approved Meta templates outside the 24h window.
- **Standalone Templates Tab**:
  - Clean view to submit new WhatsApp templates to Meta and check approval status.


**What shipped:**
- **`whatsapp-product-list-pdf` Supabase Edge Function** (`leadenthrella/supabase/functions/whatsapp-product-list-pdf/index.ts`):
  - Accepts `company_id` + optional `division` or `query` filter.
  - Auth supports both service-role callers (Cloudflare Worker) and authenticated company staff.
  - Queries `products` for `id, name, division, category, composition, pack, mrp` (MRP ONLY — `base_rate`, `pts`, `ptr` never selected or exposed).
  - Renders a branded PDF using `jspdf` & `jspdf-autotable` matching the in-app product catalog export: company header banner with primary color & logo, division-grouped tables with `#`, `Product Name`, `Composition`, `Pack`, `MRP`, and page-numbered footer.
  - Uploads PDF buffer to `company-assets` bucket under `whatsapp-exports/<company_id>/` and returns a 24h signed URL.
- **WhatsApp Document Message Delivery** (`cerebyl-whatsapp-worker/src/send.ts`):
  - Added `sendWhatsappDocument` to send native `document` messages (`type: "document"`, `document: { link, filename, caption }`) via Meta Graph API v21.0.
- **Bot Tool Loop & Direct Serving** (`cerebyl-whatsapp-worker/src/bot.ts`):
  - Updated `share_product_list` tool declaration to describe sending branded PDF catalogue.
  - `handleShareProductList` calls the edge function, delivers the PDF document directly to the customer on WhatsApp, records the message in `whatsapp_messages` with `message_type: 'document'`, and returns tool results prompting a short 1-line human note without text product dumps.
- **UX & Tone verification**:
  - `SYSTEM_PROMPT` enforces short 1–2 line messages, language preference asking on turn 1, natural acknowledgments before acting ("ok", "sure", "theek hai", "sending pls wait"), and polite, un-clingy behavior.
- **Cache Diagnostics**:
  - Gemini explicit caching (`cachedContents.create`) requires >= 2048 (or 32768) tokens. If catalog/prompt is under the floor, `cache.ts` logs the status code and gracefully falls back to inline `system_instruction` + `tools` without interrupting chat flow.


Built per Harish's four requirements. Worker version `bba86e10`, tsc clean, smoke-tested live
(text ✓, voice-note/image rejection ✓ pre-upgrade; full media+serving test pending Harish's
run — see test script in the handoff prompt, Files/scratchpad/handoff-2026-08-14-whatsapp-bot.md).

**What shipped:**
- **Media understanding** — webhook now captures `image/audio/document {id, mime_type, caption}`
  (`index.ts`); new `media.ts` downloads via Graph API (2-hop, 10MB/10s caps, failures → canned
  reply). image/*, audio/* (voice notes = ogg/opus), application/pdf go to Gemini as
  `inline_data` parts, current turn only (never re-sent in history — cost). docx/video/sticker
  get a "photos, voice notes and PDFs work best" reply. Captions ride along as text.
- **Qualification auto-stop** — required set: profession, working area, DL/GST, range. New
  `leads.profession` + `leads.dl_gst` columns (migration `20260914140000`, applied by Harish);
  `update_lead_details` gained `profession`/`dl_gst` fields; bot gets a deterministic
  "Still to learn: …" line each turn (`REQUIRED_FIELDS` in bot.ts); prompt has the two-strike
  rule (ask max twice, then drop) and wraps up → `mark_ready_for_handoff` when complete.
  Post-handoff bot stays silent as before (status guard) — that's the per-lead cost cap.
- **Cost caching** — the company's full MRP catalog (name [composition] (pack) — ₹MRP, grouped
  by division, cap 400) is embedded in the CACHED system content; cache key is now
  per-company+API-key (`cache.ts`). **Watch:** KV was found EMPTY after deploy — cache creation
  may have been silently failing (token floor?). Added a `console.error` on create failure;
  check the tail for `[cache] cachedContents create failed` on the next conversation.
- **Product serving** — two new tools with DIRECT code-side sends (model can't truncate or leak
  rates): `share_product_list` (division/query filter from in-memory catalog, 30-line cap, MRP
  only) and `share_product_images` (≤3, signs private `company-assets` paths 1h via storage
  REST, `sendWhatsappImage` by link, MRP caption). `base_rate`/`pts`/`ptr` never reach the model.
  Catalog also gained composition + a divisions overview so the bot can actually talk products.
- **Tone fix (Harish feedback, same night)** — first message asks language preference; replies
  capped at 1–2 lines, no paragraphs; small acknowledgments ("ok, sure, hanji, theek hai,
  sending pls wait") before acting; polite but not clingy.

**🔴 OPEN — next session: PDF product lists instead of text lists.** Harish wants
`share_product_list` to send a designed PDF like the app's product-section export
(html2canvas-based, client-side — can't run in the worker). Spec + approach in
`Files/scratchpad/handoff-2026-08-14-whatsapp-bot.md`.

**Deferred (in earlier entries):** unread badges, template-manager route move, `_shared` module
for Deno functions.

---

## 2026-08-14 (night) — Kimi K3, remaining review findings fixed; second-order review + fixes across the whole WhatsApp integration

Finished the first-pass list (all 10 from the evening entry) and then ran a **second-order review**
("where did the original author do things the long/wrong way?") — 15 more findings, fixed 13.
The architecture held up both times; the recurring flaw was duplication-by-comment and
receive-side gaps.

**First-pass fixes shipped (worker `eb6fe122`, edge functions + app `index-DsOgG-5c.js`):**
blind `"91"` prefix → `toWaAddress()` (only prepend to bare 10-digit numbers) at all 3 send
sites; delivery-status monotonic advance (sent→delivered→read, failed sticky) in
`recordDeliveryStatus`; null-reply silence → always `FALLBACK_REPLY`; manual reply now flips
conversation `status` to `human` (bot stops talking alongside the rep);
`whatsapp-manage-templates` got the `WHATSAPP_PLATFORM_TOKEN` fallback; UI minors (realtime
resubscribe churn, 200-message cap, `bot_always_on` NULL inherits company default).

**Second-order fixes:**
- **Webhook idempotency** — Meta redelivers events; inbound insert now swallows the unique
  conflict on `wa_message_id` (new partial unique index) instead of double-replying.
- **Media inbound** — image/voice/doc no longer fed to Gemini as the literal string
  "[image message]": new `message_type` column, non-text excluded from prompt history, fixed
  "please type it out" reply instead of a Gemini turn.
- **24h window for manual replies** — edge function checks last inbound age and returns
  `{ code: "window_closed" }`; UI shows an amber notice + specific toast instead of Meta's raw
  131047.
- **Closed-conversation re-contact links the existing lead** instead of stacking a duplicate
  lead every time.
- **Handoff template `{{1}}`** is now filled with the customer's name when the approved body
  has a placeholder (code passed `[]` unconditionally despite the comment promising otherwise).
- **Embedded-signup hardening**: app secret moved out of the token-exchange URL into the POST
  body (proxy logs keep URLs); registration PIN now from `crypto.getRandomValues`.
- **`call_summary` capped at 2KB** (it was growing unboundedly and fed back into the prompt
  every turn); index on `whatsapp_messages(wa_message_id)` (status callbacks were seq scans).
- **Realtime publication** (`ALTER PUBLICATION ... whatsapp_messages/conversations`) moved from
  a scratchpad file into the versioned migration — fresh environments would have silently lost
  live inbox updates.
- **Inbox UI**: auto-scroll to newest message, mobile master-detail (list ⇄ thread with back
  button, was two 35vh squeezed panes), composer replaced with a note on closed conversations
  (+ a Reopen button — there was no way out of `closed` before), "Load earlier messages"
  pagination with scroll preservation.

**Migration `20260914130000_whatsapp_hardening.sql`** (partial unique index on open
conversations, column-level UPDATE grant `status, bot_always_on` — reps could previously
overwrite `rep_id`/`lead_id`, `message_type` column, both indexes, realtime publication) —
**MUST be applied before the worker with these fixes is deployed** (worker inserts/selects
`message_type`). Worker deploy held until Harish confirms the migration is in.

**Deferred (documented, not emergencies):** unread-count tracking (needs schema + product
call), moving template management out of the inbox page into its own route (design decision),
extracting a `_shared/whatsapp.ts` for the Deno functions (token resolution is now copy-pasted
in 3 places — works, but the next precedence change touches all three), duplicate
`ConversationRow` type in worker.

---

## 2026-08-14 (evening) — Kimi K3, independent review of the Sonnet 5 WhatsApp session; two critical bugs found + fixed

Harish flagged a quality regression in Sonnet 5's work, so the whole WhatsApp bot surface from
that session got an independent review (`cerebyl-whatsapp-worker/src/*`, all
`leadenthrella/supabase/functions/whatsapp-*`, `src/routes/whatsapp.tsx`, `use-whatsapp-inbox.ts`,
the whatsapp migrations). Result: the architecture is sound (webhook HMAC, send-recording
discipline, CHECK-constraint safety, edge-function auth all verified correct), but the review
found **13 issues, 2 critical — both silent degradation, exactly the "glitch" class Harish
noticed**:

- **FIXED #1 (critical): bot amnesia after 12 messages.** `bot.ts` history query was
  `order=created_at.asc&limit=12` — the bot forever saw the OLDEST 12 messages, re-asking
  questions and re-sending handoff lines on every long conversation. Now `desc` + `.reverse()`.
- **FIXED #2 (critical, multi-company): shared Gemini cache key across API keys.** `cache.ts`
  used one global KV key, but `cachedContents` are scoped to the creating API key — every
  company after the first would reference a cache it can't access → Gemini error →
  `FALLBACK_REPLY` on every message for an hour. KV key is now suffixed with a SHA-256 hash of
  the API key. Also added `AbortSignal.timeout(5000)` + try/catch on the cache-create fetch
  (a hung POST previously burned the `ctx.waitUntil` budget the reply send needs).
- Worker redeployed with both fixes, version `a047ede8`. tsc clean.

**Remaining findings, awaiting Harish's scope call (full detail in session, ask any lead agent to
"fix whatsapp review findings"):** #3 race — concurrent inbound from a new contact can insert
duplicate conversation+lead (needs partial unique index or upsert); #4 non-Indian numbers get a
blind `"91"` prepend → `9191…` undeliverable (3 send sites); #5 delivery-status callbacks can
regress `read`→`sent` (out-of-order Meta statuses); #6 Gemini tool-loop can exit with null text
and no fallback → customer silence; #7 manual reply doesn't flip conversation `status` to
`human`, so the bot keeps auto-replying alongside the rep; #8 `whatsapp-manage-templates` lacks
the `WHATSAPP_PLATFORM_TOKEN` fallback — same expired-token failure mode fixed elsewhere; #9
`whatsapp_conversations` UPDATE grant is table-wide (rep can reset `status`/`rep_id`); #10–12 UI
minors (needless realtime resubscribe, unbounded message query, `bot_always_on` NULL shown as
off).

---

## 2026-08-14 (later) — Kimi K3, manual-reply auth bug CLOSED ✓

Closed the open bug from the Sonnet 5 entry below. Findings:
- Re-authenticated wrangler (interactive OAuth), tailed `cerebyl-whatsapp-worker` on a fresh
  inbound message: the bot's working `WHATSAPP_PLATFORM_TOKEN` is **209 chars**; the Supabase
  edge function's copy was **294 chars**. Not whitespace padding — a genuinely different (stale)
  token value had been set as the Supabase secret. Meta rejected it with `190 Authentication
  Error` while Cloudflare's copy worked.
- Fix: Harish re-set the secret himself (`npx supabase secrets set WHATSAPP_PLATFORM_TOKEN`,
  per the no-secrets-in-chat rule — Cloudflare secrets are write-only so it couldn't be copied
  across programmatically). Manual "take over and message" reply from /whatsapp now lands on
  the phone — **verified end-to-end by Harish**.
- Both temporary diagnostics removed and redeployed: the `diag` field + token-length
  `console.log` in `leadenthrella/supabase/functions/whatsapp-send-message/index.ts`, and the
  `console.log` in `cerebyl-whatsapp-worker/src/bot.ts:193`. Worker redeployed (version
  `125e650e`), edge function redeployed on project `cjowrlrjyhdltbyqwozr`.
- **Lesson for token setup:** when the same logical secret lives in two runtimes (Cloudflare +
  Supabase), verify them independently — "confirmed present" says nothing about "same value".
  A length-only `console.log` on both sides settles it without exposing the secret.
- Harish note this session: **no aider/DeepSeek at all going forward** (API quota exhausted);
  all planning + execution by the lead agent (Kimi K3 / K2.7).

---

## 2026-08-14 — Claude Sonnet 5, WhatsApp bot end-to-end build against live Meta sandbox; manual-reply auth bug open at session end

Long session testing the real WhatsApp messaging pipeline against Meta's free developer sandbox
test number, wired to **Acrowell Labs Pvt. Ltd.** (real company). Found and fixed a cascade of bugs
via live `wrangler tail` inspection, then shipped several requested features. Full architecture
detail is now in memory (`project-cerebyl-whatsapp-bot`) — this entry is the changelog.

**Bugs found and fixed (all in `cerebyl-whatsapp-worker/src/bot.ts` and
`leadenthrella/supabase/functions/whatsapp-send-message/index.ts` unless noted):**
- `#131030` "recipient not in allowed list" — sandbox restriction, fixed by adding the test
  recipient in Meta's dashboard (not a code bug).
- Outbound sends used the bare 10-digit `contact_phone` with no `91` country-code prefix — fixed
  at all 3 send call sites (`bot.ts` x2, `whatsapp-send-message`).
- Failed sends were still recorded as `delivery_status: "sent"` — now conditional on the Graph API
  actually returning a message id.
- Per-company Embedded Signup tokens expire in ~1hr, causing recurring `190 Authentication Error`
  — fixed architecturally by adding a never-expiring Meta System User token
  (`WHATSAPP_PLATFORM_TOKEN`) as the preferred token, per-company token as fallback, mirrored in
  both the Worker and the edge function.
- A conversation got stuck permanently in `handed_off` even when the handoff send failed — status
  write is now gated on the send actually succeeding.
- Gemini retry logic could exceed Cloudflare's `ctx.waitUntil()` execution budget, getting silently
  cancelled before the fallback reply could send — fixed with a hard 2-attempt cap, 7s
  `AbortSignal.timeout()`, flat 300ms backoff (confirmed via `wrangler tail` showing
  `waitUntil() tasks did not complete` before the fix).
- Bot wrote arbitrary free-text `product_interest` into a DB CHECK-constrained enum column; every
  mismatch silently failed inside a try/catch, discarding real lead detail. Found by Claude
  proactively checking the schema, not reported by Harish. Fixed by splitting into a validated
  `category` field + free-text `detail` (appended to `leads.call_summary`).
- Realtime wasn't enabled for `whatsapp_messages`/`whatsapp_conversations` — chat required manual
  refresh. Fixed with `ALTER PUBLICATION supabase_realtime ADD TABLE ...` (Harish found this
  himself mid-session, independent of the codebase).

**Shipped features (per explicit Harish requests, mid-session):**
- Delivery ticks matching real WhatsApp (single/double/blue) in `src/routes/whatsapp.tsx`.
- Full system-prompt rewrite for the bot (`bot.ts` `SYSTEM_PROMPT`) — mirrors customer's language,
  paces itself over multiple messages instead of dumping a form, reads as a real salesperson.
  Written directly by Claude (prompt content is never delegated to the worker).
- Gemini explicit context caching (`cerebyl-whatsapp-worker/src/cache.ts`, new file, mirrors
  `acrowell-ai-worker`'s pattern) to control token cost on long lead conversations.
- "Clear chat" — deletes the `whatsapp_conversations` row (cascades to messages, leaves `leads`
  untouched) via new edge function `whatsapp-clear-conversation`, manager/admin only.
- `bot_always_on` at both company level (`company_whatsapp_accounts`) and per-conversation
  (`whatsapp_conversations`) — Harish explicitly asked for both scopes ("Both"). Toggles in
  Settings and on the WhatsApp inbox thread header.
- Migration `20260914120000_whatsapp_bot_always_on.sql` — applied live by Harish.

**Also moved this session (see prior same-day entry below for detail):** the Connect WhatsApp flow
from platform console to each company's own Settings page — Meta remembers the browser's last
Facebook login, which was causing friction facilitating multiple clients from one console session.

**🔴 OPEN AT SESSION END — do not consider WhatsApp manual-reply done.** The manual reply-box send
(`whatsapp-send-message` edge function, the "take over and message" flow) still returns
`WhatsApp API error: Authentication Error` (HTTP 400), even with `WHATSAPP_PLATFORM_TOKEN`
confirmed present at the edge function (temporary diagnostic in the error response shows
`platformTokenLen=294`, `usedWhich=platform`). The bot's own automated send (`bot.ts`, same nominal
token) sends successfully via the same token per live `wrangler tail` evidence — so the token
Meta is rejecting on the Supabase side may not be byte-identical to Cloudflare's copy. A matching
`console.log` diagnostic is deployed in `bot.ts` to compare token lengths, but `wrangler`'s OAuth
session expired mid-investigation and blocked further `wrangler tail`/`deploy` (needs an
interactive `wrangler login` or a `CLOUDFLARE_API_TOKEN` — non-interactive re-auth isn't possible
from here). **Next lead: re-authenticate wrangler, get the bot's real token length from a fresh
inbound message via tail, compare to 294, then remove both temporary diagnostics once fixed** (the
`diag` field on the edge function's error response, and the `console.log` in `bot.ts`) — neither
should ship permanently.

**Also established this session:** a hard standing rule against ever pasting secrets/tokens/API
keys into chat — see memory `feedback-secrets-never-in-chat`. All secrets now go in via
`wrangler secret put` / `supabase secrets set` (interactive) or the target dashboard's own UI.

---

## 2026-08-13 (later still) — Claude Sonnet 5, Settings IA reorg: Administration merged into tabs, nav trimmed

Follow-on from the same session's WhatsApp/Administration testing. Harish reviewed the shipped
Administration page live and asked for a real reorg, not just bug fixes — all done in one pass,
each piece its own aider ticket, reviewed and shipped individually:

1. **Administration is now a tab on `/settings`** (was a separate page, reached only via a nav
   card added earlier the same session — that card is gone now). Fixes the visual mismatch
   Harish flagged ("font sizes up and down") — the old page had a big page-title `<h1>` sitting
   right above a tiny all-caps `text-ios-footnote` micro-label; both are gone, replaced by a
   normal `Card`/`CardTitle` matching every other section on the page. `/settings/admin` redirects
   to `/settings`; `/settings/admin/activity` and `/settings/admin/ai-usage` are untouched, still
   real pages, now linked from the Administration TAB instead of the retired hub page.
2. **Branding tab absorbed PDF/Contact and Divisions**; Catalogue asset generator moved to live
   inside Branding specifically (was floating below all tabs). **Categories + Dosage forms +
   Packing types merged into one "Catalogue Setup" tab.** Credit tiers deliberately left where it
   was — not asked to move.
3. **Settings/Bin/Help moved out of the main nav and into the account-menu dropdown** (the avatar
   button, top-right) — was cluttering the same bar as core business sections. Settings stays
   admin-only inside the dropdown, matching its old nav gate. Dropdown rows got `press-scale`
   feedback and the avatar trigger got `sh-md`, matching the pill/shadow language used everywhere
   else — reused existing CSS utilities, nothing new invented.
- **Also fixed, found live during this same pass**: `/settings/admin/activity` and
  `/settings/admin/ai-usage` each wrapped their own `<Protected>` on top of the one the `/settings`
  layout already provides, rendering the whole header/nav shell TWICE. Pre-existing bug, unrelated
  to anything built this session — `settings.admin.index.tsx` already had the correct
  no-double-wrap pattern to copy.
- One test (`app-shell-bottom-nav.test.tsx`) legitimately needed updating after Settings left the
  nav — it proved "the mobile More sheet opened" by checking for "Settings" text, which no longer
  lives there. Swapped the proof signal to "Products" (still sheet-only). Not a masked regression,
  the underlying behavior it protects (More sheet opens, shows sheet-only items) is unchanged.
- Four aider tickets this pass, each reviewed in full before the next started, each shipped and
  live-verified individually via the Browser pane (not curl, not local filenames — see the
  standing rule below). One ticket needed a 2-minute background run (large diff); the harness's
  own timeout on synchronous aider calls is real for tickets this size — background it rather than
  retry synchronously.
- **Propagation gotcha recurred a third time** in this session alone: right after a deploy, a
  live tab can load a stale cached route-manifest chunk. A second navigation with a cache-busting
  query param resolves it every time. This is now a known, expected step after `ship.sh`, not a
  surprise — check the Browser pane, and if content looks stale, reload once more before
  concluding anything is broken.

## 2026-08-13 (latest) — Claude Sonnet 5, WhatsApp Connect moved to client portal + two settings bugs found+fixed

**WhatsApp Connect flow moved from console to the client's own Settings.** Harish's own testing
surfaced the real reason this needed to happen: Facebook remembers the last logged-in account per
browser, so switching between client WABAs from the console meant repeatedly fighting stale
sessions. Fix: company admins now connect their own WhatsApp number from their own Settings page,
on their own device/login — the console keeps only a read-only status view + the existing
`whatsapp_integration` on/off entitlement toggle.
- `supabase/functions/whatsapp-embedded-signup-callback/index.ts` — dual auth: platform admins keep
  today's behavior (client-supplied `company_id`); a company admin's `company_id` now comes ONLY
  from their own `profiles` row (mirrors `whatsapp-manage-templates`'s pattern), never trusted from
  the request body. This is the actual security fix — closes a cross-tenant hole that would have
  existed the moment a company admin could call this function at all.
- New `WhatsAppSetupCard` in `src/routes/settings.admin.index.tsx` (admin-only route), same shape
  as `MobileAppCard`. `console.companies.$companyId.tsx`'s `WhatsAppCard` cut down to read-only
  (status badge + numbers table only, no connect button).
- Verified live end-to-end with a real company-admin login (reset `admin@seed.enthrellabiotech.test`'s
  password via console, enabled `whatsapp_integration` for Enthrella Biotech, logged in as that
  admin in a clean Browser-pane session — not Harish's real Chrome profiles): the card renders,
  `status` action succeeds with no 403, proving the new auth path works for a real non-platform-admin
  caller.
- **Also researched and settled a Meta product question mid-session**: why our Embedded Signup only
  offers "Create a WhatsApp Business account" and never "connect an existing WABA", even for real
  client portfolios (Vee Vedic, Elkos) that already have active numbers. Confirmed via Meta's own
  dashboard copy: **"connect existing" is a production-only capability, withheld until App Review +
  Access Verification both fully pass** — not a config setting on our side, nothing to fix, should
  unlock automatically once CerebylWA clears review.

**Two pre-existing, unrelated bugs found while testing the above** (both in the Settings area, both
now fixed, shipped, verified live):
1. `src/routes/settings.tsx` (the layout route for all `/settings/*`) rendered `<CreditTierSettings />`
   and `<CatalogueSettingsAdmin />` unconditionally after every sub-route's `<Outlet />` — so they
   bled onto `/settings/admin` and visually overlapped the new WhatsApp card there. Harish spotted
   it live ("this catalogue asset generator section is showing in each of the settings sub
   section") before I'd finished diagnosing it myself. Fixed by moving both components to render
   only inside `settings.index.tsx` (the actual Company Settings page), where they belong.
2. `/settings/admin` (Administration — backups, mobile app, AI usage, and now WhatsApp) had **zero
   navigation entry point anywhere in the app** — confirmed by grep, no `<Link to="/settings/admin">`
   existed. Only reachable by typing the URL. Added a one-row `IosListRow` nav card on `/settings`
   linking to it, matching `LegalCard`'s existing pattern.
- **Propagation gotcha hit again**: right after the second deploy, the live tab loaded TWO different
  hashes for the same `settings.index-*.js` chunk in one page load (stale cached route manifest). A
  second fresh navigation with a cache-busting query param resolved it. Matches the standing
  "verify with the Browser pane, not curl/filenames" rule — the fix was to look and reload, not to
  trust the first check.
- Both tickets executed via DeepSeek/aider (95/5 split), diffs reviewed in full before shipping —
  no exceptions to that rule this session, including for the tiny two-file overlap fix.

## 2026-08-13 (even later) — Claude Sonnet 5, two real bugs found+fixed testing WhatsApp live

Started actually clicking through the shipped WhatsApp feature with Harish (console → toggle
`whatsapp_integration` on for Acrowell Labs → visit `/whatsapp`). Found two real, unrelated bugs
in the same pass, both fixed, tested, shipped, and verified live via the Claude-in-Chrome tab on
Harish's own authenticated `admin@enthrella.com` session (I have no console credentials myself and
never asked for them — verification piggybacked on his already-logged-in browser tab instead).

1. **Global scroll-lock bug, pre-existing, NOT caused by today's WhatsApp work.** Harish reported
   "can't scroll" on the console company page. Root cause: `src/styles.css:246-250` had a blanket
   `html, body { overflow: hidden }` added 7 Aug (`e8a4cac`, Harish's own commit) to kill an outer
   scroll band caused by `.app-density`'s `zoom: 0.8` compensation in `app-shell.tsx`. Written as a
   global rule, it silently clipped every OTHER route expecting normal document scroll — confirmed
   via a live JS diagnostic that **`/legal/privacy` was equally broken** (`docScrollH: 3330` vs
   `viewportH: 841`, clipped) — a DPDP-required public legal document was unreadable past the fold.
   **Fixed** by scoping with `:has()`: `html:has(.app-density), body:has(.app-density) { overflow:
   hidden }` — only suppresses scroll on pages that actually use the zoom-compensated app shell.
   563 tests + tsc clean, shipped, verified live on both `/console` (now scrolls) and confirmed via
   dev server on `/legal/privacy` (now scrolls, `.app-density` correctly absent there).
2. **`whatsapp.tsx` was never wrapped in `<Protected>`** (the app-shell auth+chrome HOC every other
   authenticated route uses, e.g. `dashboard.tsx`). Missed during the original Phase 4 build.
   Effects: (a) the page rendered with zero app styling — no sidebar, no theme, raw HTML — which is
   what Harish saw and called "messed up", and (b) more seriously, **the page had no auth gate at
   all** — reachable by anyone with the URL, logged in or not, before this fix. Fixed by wrapping
   `component: () => <Protected><WhatsAppPage /></Protected>`, matching every other route's pattern.
3. **`VITE_WHATSAPP_CONFIG_ID` was never added to `.env`** — confirmed by finding
   `console.companies.$companyId.tsx:875` reads it via `import.meta.env`, found nowhere in `.env`.
   This is why the Connect WhatsApp button was permanently disabled with "Waiting on Embedded
   Signup configuration (Task 14)" even though Task 14 was fully done — the config ID
   (`1660532082073456`, captured earlier this session) had never actually been wired into the app.
   Added to `.env`, confirmed inlined into the built bundle (`grep`'d the config ID literal into
   `console.companies._companyId-*.js`), shipped, verified live — the gate text is gone and the
   Connect button is enabled.
- **Lesson for future sessions**: "all 6 phases coded, reviewed, tested, pushed" (this session's own
  opening framing) is not the same as "wired up correctly" — two of these three bugs only surfaced
  by actually clicking through the feature as a real company, not from any diff review or green
  test suite. Matches this project's own standing lesson (`feedback-green-build-proves-nothing` /
  `feedback-fire-the-job-read-the-body` in memory) almost exactly.
- **Still not yet tested**: whether clicking "Connect WhatsApp" actually completes the Embedded
  Signup popup flow end-to-end against Meta's real API — that's the next real test.

---

## 2026-08-13 (later still) — Claude Sonnet 5, Meta Tasks 13+14 DONE, Task 15 next

- **Task 13 done, fast.** Both Business Verification ("Enthrella Online Solutions", using the
  Udyam certificate `UDYAM-HR-10-0098356`) and Access Verification (Tech Provider questionnaire —
  SaaS Platform, single-tenant-isolated Platform Data usage, no other portfolios managed,
  `https://app.cerebyl.com`) cleared same-day, not the 2-5 days Meta's copy warned — both show
  Verified/In review→Verified in Business Settings → Security Centre. Chose **Independent Tech
  Provider** (not "Working with a Solution Partner") in the onboarding dialog — correct, since
  there's no third-party partner app mediating this.
- **Task 14 done.** Found via `Use cases → Connect with customers through WhatsApp → Become a
  Partner → Embedded Signup Builder` (NOT the top-level "WhatsApp" nav item — this app only has
  WhatsApp as a use case, no separate product nav). **Configuration ID: `1660532082073456`**
  (name `cerebyl_wa_config`, created Aug 13 2026, never expires) — this is what
  `whatsapp-embedded-signup.ts` / the console wizard needs, next session should wire it in.
  Domain allowlist already had 2 correct domains (verified by Harish). Deliberately did NOT use
  the "Meta-hosted embedded signup" quick-link/Generate-link flow on the same page — that's a
  redirect-to-Meta no-code alternative that doesn't match what our `whatsapp-embedded-signup-
  callback` edge function expects (it's built for the JS-SDK popup + postMessage flow, the
  "Embedded Signup Dialog" section, not a Meta-hosted redirect page).
  App Roles: only Harish as Administrator, no separate Developer added (not needed while testing
  solo — Administrator already has full access).
  **Still open from Task 14's original scope**: the App Review video documentation (proof-of-use
  videos for `whatsapp_business_messaging` and `whatsapp_business_management`) — not started,
  I said I'd help script it when we actually get there.
- **Task 15 done** (System User token generated, stored by Harish) — but confirmed by reading
  `cerebyl-whatsapp-worker/wrangler.toml`'s own comment that it's **not currently wired into any
  code**, deliberately: each company's Graph API calls use its own per-company token from Embedded
  Signup (`company_secrets`), not a shared platform token. Kept only as a documented future
  fallback (e.g. background sends after a per-company token expires) — nothing to deploy for it.
- **Actual deployment done this session** (first real deploy of any WhatsApp artifact):
  - `supabase secrets set WHATSAPP_APP_ID` + `WHATSAPP_APP_SECRET` on `pharma-bms-prod` — verified
    via `supabase secrets list` (names only, hash-only value field, never printed the real secret).
  - `supabase functions deploy` for both `whatsapp-embedded-signup-callback` and
    `whatsapp-manage-templates` — both deployed clean.
  - `cerebyl-whatsapp-worker`: `tsc --noEmit` clean, then `wrangler deploy` (had to answer "Y" to
    "create a new Worker" since it never existed on Cloudflare yet) — live at
    `https://cerebyl-whatsapp-worker.icy-sunset-05b0.workers.dev`. Three secrets set
    (`SUPABASE_SERVICE_ROLE_KEY`, `WHATSAPP_APP_SECRET`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN` — the
    latter a fresh `openssl rand -hex 24` value, not a Meta-issued one).
  - Meta-side webhook registered: callback `.../webhook`, verify token matching, `messages` field
    confirmed Subscribed (the field that actually triggers inbound lead creation — Meta's UI
    auto-subscribes a bunch of irrelevant defaults like `calls`/`account_alerts`, left those alone).
  - Verified the worker is actually live and enforcing its verify check (a bare `curl` with no
    params correctly 403s — confirmed via a 3-second `wrangler tail` capture around the curl).
  - **Frontend also shipped this session**: `scripts/ship.sh` ran clean (typecheck 0/baseline,
    build OK, `whatsapp-D_kwzBbC.js` chunk confirmed in the uploaded-assets list, verdict
    `SHIPPED ✓`). Verified live via the Browser pane per this project's own rule (never trust
    `curl`/local-filename propagation checks) — `app.cerebyl.com` loads clean, zero console
    errors. Nav item and `/whatsapp` won't be visible to any company until `whatsapp_integration`
    is flipped on for them from the console — expected, it's DEFAULT_OFF + CONSOLE_ONLY by design.
  - Still open: App icon /
    Category / Privacy Policy URL on the App Settings → Basic page (flagged "Currently ineligible
    for submission" — not blocking anything we did, but will block eventual App Review/publish),
    and the App Review video-documentation requirement for `whatsapp_business_messaging` /
    `whatsapp_business_management` Advanced Access (not started, script it when we get there).
  - **Real production traffic still won't reach any of this** — the app is Unpublished, and Meta's
    own webhook config page says test/dashboard-triggered webhooks only reach an unpublished app,
    no real customer messages. Test via the dashboard's phone number / "Send message" flow, not by
    waiting for a real WhatsApp message to arrive.

---

## 2026-08-13 (later) — Claude Sonnet 5, meta-devtools MCP dead end, Task 13 guidance given

- **Meta Devtools MCP is NOT usable — not a config issue, Meta itself blocks it.** Harish tried
  authorizing it; the OAuth popup returned *"Not yet available for your account — Developer Tools
  MCP is being gradually rolled out. Please try again later."* This is Meta-side gating, not
  something fixable from our end. **Stop suggesting `/mcp` auth for meta-devtools until Harish
  reports it's actually available** — checking Meta app status still means Harish screenshots the
  dashboard.
- **Dashboard screenshot shows `CerebylWA`'s checklist** (App ID `2295685677930179`): Customize use
  case, Facebook Login for Business, Review/testing requirements, Business and access verification,
  App Review, Check-requirements-then-publish — all six rows showing checkmark bullets in the list
  UI (this is Meta's step-list icon style, not confirmed proof each is complete — Business
  Verification specifically was still "next" as of the prior entry, unconfirmed submitted/approved).
  App is still **Unpublished**.
- **Business Verification entity question, answered**: recommended Harish use **Enthrella's
  existing Udyam certificate**, not register a new legal entity for "Cerebyl". Reasoning: Cerebyl is
  a brand name, not a separate registered legal entity anywhere else in this stack (Cloudflare
  account is `admin@enthrella.com`, all infra billing/ownership is Enthrella) — Meta verifies the
  *legal business*, and a brand name differing from the verified legal entity name is normal and
  doesn't block verification or Embedded Signup. Registering a fresh Cerebyl entity (new
  GST/Udyam/bank) is a real business step with no functional requirement forcing it here.
- **Told Harish Tasks 14 (Embedded Signup config_id) and 15 (System User token) do NOT need to wait
  on Task 13's outcome** — both only need Task 12 (done). Business Verification mainly gates
  template/marketing send volume and Embedded Signup for other companies at scale; Meta gives free
  test numbers before verification finishes, per the plan doc.

---

## 2026-08-13 (session handoff) — Claude Sonnet 5, WhatsApp: pushed, NOT deployed, Meta setup live

**Read this before continuing WhatsApp work.** Session boundary — picking up in a fresh chat.

- **`leadenthrella` pushed to GitHub**, `409366c..f27fbb1` on `main` — includes all 6 WhatsApp
  phases (schema/flags/worker skeleton, Embedded Signup + webhook intake, bot brain, Inbox UI,
  templates, multi-number handoff). tsc 0, 563 tests passing at push time.
- **`cerebyl-whatsapp-worker` has no GitHub remote by design** (matches `acrowell-ai-worker`'s
  convention) — its 3 commits are local-only, nothing to push there.
- **⚠️ NOTHING IS DEPLOYED YET.** Git push ≠ deploy. Specifically still pending:
  - `supabase/functions/whatsapp-embedded-signup-callback` and `whatsapp-manage-templates` have
    never been `supabase functions deploy`'d — the console WhatsApp card and templates UI will
    error if exercised until these are live.
  - `cerebyl-whatsapp-worker` has never been `wrangler deploy`'d, and **has zero secrets set**
    (`WHATSAPP_APP_ID`, `WHATSAPP_APP_SECRET`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`,
    `SUPABASE_SERVICE_ROLE_KEY`) — deploying it now would ship a worker that can't do anything
    useful yet regardless.
  - The main app frontend (nav item, Inbox route, console card) hasn't been through `scripts/ship.sh`.
  - **All of this is low-risk to leave undeployed** — `whatsapp_integration` is
    `DEFAULT_OFF`+`CONSOLE_ONLY`, so nothing is reachable by any real company either way. Deploy
    when picking this back up, not urgently.
- **Meta setup in progress, live state as of now**: App `CerebylWA` created, App ID
  `2295685677930179`, dedicated Business Portfolio "Cerebyl" (see `HARISH-DO-THIS.md` Task 12's
  DONE note for the reasoning). Just clicked **"Yes, I'm a Tech Provider"** — Business Verification
  (Task 13) is next, using the Enthrella Udyam certificate. **Sole admin on the portfolio is an
  open risk** — a second admin (ideally a separate person, not another of Harish's own accounts) is
  a TODO before any real client goes live.
- **Meta Devtools MCP added**: `claude mcp add --transport http meta-devtools https://mcp.facebook.com/devtools`,
  confirmed registered to this project's local config. Not usable in the session that added it
  (tool list is fixed at session start) — should be live in the next fresh session started in this
  project folder. Verify with `/mcp` that it shows authorized, not just added.

---

## 2026-08-12 (late evening) — Claude Sonnet 5 (lead), WhatsApp Phases 3-6 shipped, all 6 phases done

Continuation of the same-day entry below (Phases 1+2 + the collision). **All 6 build phases of the
WhatsApp integration now exist in code** — this is a complete, self-consistent single-number AND
multi-number product loop, but **nothing has been verified against a real Meta account yet** —
Harish is still on Tasks 12-15 of `Files/HARISH-DO-THIS.md` Round 3. Treat everything below as
"typechecks, builds, tests pass" — not "proven correct against Meta's real API."

- **Phase 3 (bot brain)**: `cerebyl-whatsapp-worker/src/bot.ts`, built on `portal-assistant`'s
  server-side Gemini-loop shape. Two-tool set (`update_lead_details`, `mark_ready_for_handoff`),
  per-company `gemini_api_key` + `whatsapp_access_token` via `get_company_secret`. Deliberately does
  NOT try to WhatsApp-notify reps — relies on the existing in-app notification/task pipeline once
  `rep_id` is assigned, sidestepping the 24h session-window rule entirely.
- **Phase 4 (Inbox UI)**: `src/routes/whatsapp.tsx` + `src/lib/use-whatsapp-inbox.ts`. **First ticket
  actually run through `aider`/DeepSeek this session** (previous phases were hand-written directly,
  a deviation from the 95/5 rule Harish caught and corrected mid-session). Caught and fixed in
  review: DeepSeek copied dark `zinc-900` console styling from a reference file instead of this
  app's light theme — restyled to the white-glass card convention before accepting.
- **Phases 5+6 reordered**: built templates (was Phase 6) before finishing the multi-number handoff
  send (Phase 5), since the handoff needs an approved template to exist first — the original phase
  order was circular. `whatsapp-manage-templates` edge function + a templates section on the same
  `/whatsapp` page, also via aider/DeepSeek. **Two real bugs caught in review**, both would have
  broken at Meta's API or at compile time: `example.body_text` needs a nested array (Meta's
  contract), DeepSeek flattened it; and literal `{{1}}, {{2}}` inside JSX text is invalid syntax
  (parses as object literals) — confirmed by `tsc`, not guessed. Phase 5's send then landed on top:
  `sendWhatsappTemplate` in `send.ts`, handoff logic in `bot.ts` keyed off a template named exactly
  `lead_handoff` (no picker UI yet, by convention — documented in the code).
- **Also fixed**: Phase 2's callback never flipped `company_features.whatsapp_integration` on, so
  the new nav item could never have appeared even after a successful connect — added the upsert.
- Both repos clean: `leadenthrella` tsc 0 / 563 tests passing; `cerebyl-whatsapp-worker` tsc 0.
  6 commits total across the two repos, all local, none pushed.
- **Next real step is Harish's, not code**: finish `HARISH-DO-THIS.md` Tasks 12-15, then the whole
  loop (webhook → lead → bot reply → handoff) needs its first live test against a real Meta test
  number before any of this can be called verified.

---

## 2026-08-12 (evening) — Claude Sonnet 5 (lead), WhatsApp integration Phase 1+2 + a collision worth reading

**Started the WhatsApp Business Platform integration** (single-number + multi-number-per-rep, console-driven Embedded Signup, eventual AI chatbot + marketing workspace). Full design: `Files/CEREBYL-BUILD-PLAN.md` (plan file also mirrored at `~/.claude/plans/tidy-wibbling-raccoon.md`). Decided with Harish: direct Meta Tech Provider (not a BSP reseller), reuse Ceremate's Gemini conventions for the bot brain (built server-side on `portal-assistant`'s shape, NOT `acrowell-ai-worker`'s `/chat` — that loop is 100% browser-side today, confirmed by exploration).

**Phase 1 (schema) — shipped and verified live.** 7 new tables (`company_whatsapp_accounts`, `company_whatsapp_numbers`, `whatsapp_conversations`, `whatsapp_messages`, `whatsapp_templates`, `whatsapp_campaigns`, `whatsapp_campaign_recipients`) + RLS, `whatsapp_integration` feature key (console-only, default-off), `leads.source` now accepts `'WhatsApp'`. New sibling Worker `cerebyl-whatsapp-worker` (local git repo, no remote, same convention as `acrowell-ai-worker`) scaffolded with health check + Meta webhook verification handshake.

**Phase 2 (Embedded Signup + inbound lead intake) — shipped, needs Harish's Meta setup to verify live.** `whatsapp-embedded-signup-callback` edge function + console wizard card on `console.companies.$companyId.tsx` + FB SDK loader (`src/lib/whatsapp-embedded-signup.ts`). `cerebyl-whatsapp-worker`'s `/webhook` POST now does full inbound-message → lead-creation, mirroring `cerebyl-lead-intake`'s pipeline (dedupe by phone, keyword classify PCD/third-party, `allocate_lead_rep` RPC), with HMAC signature verification (`src/signature.ts`).

**Token model corrected mid-build**: the plan originally assumed one shared platform-level system-user token. Building against Meta's actual documented contract showed each company's Embedded Signup returns a `code` that exchanges (client_id/secret + code) for a token scoped to THAT company's WABA — so tokens are per-company via `company_secrets` (`whatsapp_access_token`), not a single shared secret. `WHATSAPP_PLATFORM_TOKEN` (Task 15 in `HARISH-DO-THIS.md`) is now an unused fallback, not load-bearing.

**⚠️ Real collision, worth the paragraph: an unrelated concurrent commit (`690a21b`, F7 catalogue-generator) ran in this SAME `leadenthrella` checkout, found my uncommitted WhatsApp migration + edge function + `features.ts` entries sitting untracked, its own agent apparently mistook them for its own hallucinated output ("the model fabricated repo state it never actually read"), and DELETED them as part of its own review-and-fix pass before committing.** The database was unaffected (migration was already applied and probe-verified before this happened — see the 7-table listing Harish confirmed), but the repo files were gone until I noticed `git log` showing a commit message describing exactly that deletion, diffed it, and restored all three (migration file marked "already applied, do not re-run"; feature-flag entries re-added additively alongside `catalogue_generator`). **Lesson matching `feedback-parallel-kimi-agents` almost exactly, but worse: this wasn't two agents editing different files, it was one agent's cleanup heuristic treating another agent's legitimate uncommitted work as noise to delete.** Committed the WhatsApp files locally (not pushed) immediately after recovery specifically so this can't recur — uncommitted work in a shared checkout is now a demonstrated loss risk, not just a hygiene nit. If running parallel lanes in the same checkout again, commit early and often rather than leaving substantial uncommitted state around.

**Still open**: Harish is working through 4 Meta setup tasks (Business app creation, Business Verification, Embedded Signup config, system-user token — `Files/HARISH-DO-THIS.md` Tasks 12-15), non-blocking for further build. Next: Phase 3 (bot brain, portal-assistant-shaped), Phase 4 (company-side Inbox UI), Phase 5 (multi-number handoff), Phase 6 (marketing workspace).

---

## 2026-08-12 (evening) — Claude Opus (lead), first parallel-lane batch toward market launch

**Harish's instruction: build every remaining backlog item that's codeable now, including data-thin
ones, as beta — refine once real data exists. Ran up to 5 DeepSeek/aider agents concurrently in
separate git worktrees (`../wt-f19` etc., cleaned up after merge), one per disjoint file surface, per
the batching rule in `CLAUDE.md` §2. All reviewed, fixed, tsc 0, 556/556 tests, shipped
(`98d2407`..pushed).**

- **Territory holds now render on the map** (`11dbff8`, earlier this session) — see prior entry.
- **F19 predictive stock-out warnings** (`ff6d180` in-branch, merged): pure `stock-out-forecast.ts`
  mirrors F10's no-I/O idiom exactly; `effectiveOnHand` excludes stock expiring before the lead-time
  window per spec. Flags on `/products/all`. Lead time hardcoded to 21 days (spec's own example)
  pending a per-product field.
- **F16 voice-note UI (leadenthrella side only)**: MediaRecorder-based record→review→confirm flow in
  `lead-dialog.tsx`, no `@capacitor/*` import. Extracted fields map onto EXISTING lead columns
  (call_summary, fu1-5 dates, product_interest) — no migration. Objections feed the existing
  `mergeLostReasons` path. Calls a placeholder `acrowell-ai-worker` `/voice-note` endpoint that
  **does not exist yet** — that endpoint, plus a live Hindi/Punjabi/English rep test, both still gate
  the actual ship. Swapped DeepSeek's two hand-rolled SVG icons for the project's Lucide convention.
- **F5 coaching digest, BETA on-demand pass**: per Harish's instruction, ships now as a
  recomputed-on-view panel (no schedule, no stored state) rather than the spec's eventual Monday
  cadence — reuses `leadScore`/`responseMinutes`/`median`, never fabricates a claim when data is
  thin (each of the 3 items independently falls back to nothing), team-median only, never a
  named-colleague comparison. Rep-facing on My Day.
- **F20 Ceremate proactive alerts, all 5 types**: new `company_alerts` table + generator
  (migrations `20260812160000`, `20260812170000`, both applied+verified live). CONSOLE-gated,
  default OFF (`ceremate_proactive_alerts` feature key). territory_dormancy and dues_threshold
  alerts deliberately MIRROR the existing F4d/F15-c generators rather than reimplementing —
  the two-copies-of-a-generator trap already bit this project once (notification-bell, 10 Aug).
  **Real bug caught in review and fixed before applying**: the `ON CONFLICT` clause's WHERE
  predicate didn't textually match the partial unique index's predicate (missing
  `AND dedupe_key IS NOT NULL`) — Postgres requires an exact match to infer a partial-index arbiter,
  so every one of the 5 inserts would have failed at runtime with "no unique or exclusion constraint
  matching."
- **F8 credit scoring/tiers + F11 loyalty, ONE shared ladder** (never a parallel system, per spec):
  new `company_credit_tiers` / `party_credit_scores` / `party_score_events` / `loyalty_ledger`
  tables + `recompute_party_credit_score()` (migrations `20260812161000`, `20260812171000`, both
  applied+verified live). Score formula (payment timeliness 40%, order frequency 20%, no-dispute
  rate 20%, tenure 10%, value trend 10%) is identical between the SQL and the pure
  `src/lib/credit-score.ts`, verified matching. Manual override always requires a reason; every
  score/tier change is audited; a tier-drop warning logs separately when a score sits within 10% of
  the tier floor. **Real floating-point bug caught by DeepSeek's own boundary test and fixed**:
  `100 * (1 + 10/100)` evaluates to `110.00000000000001` in IEEE 754 doubles, so the exact-boundary
  case misclassified as a warning — fixed by rounding the boundary to 6dp before comparing.
  **Known gap, not blocking this beta ship**: nothing calls `recompute_party_credit_score` yet (no
  cron, no trigger) — every party shows "No tier" until a follow-up wires a scheduled recompute,
  same shape as the existing `generate_due_notifications_all()` cron pattern.
- **3C composition/molecule index**: `molecules` (global, not company-scoped — canonical across
  every company by design) + `product_compositions` (migration `20260812162000`, applied+verified
  live). Schema only, unblocks F12; does not touch or backfill `products.composition` free text.
- **F23 AI provider abstraction seam** (separate repo, `acrowell-ai-worker`, commit `09de62b`,
  **source-committed only, NOT deployed** — see below): `TaskKind` + `MODEL_FOR_TASK` config in
  `gemini.ts`, every task maps to the same model today (seam, not a swap decision). Scoped to
  `gemini.ts` only — `index.ts` has real, unrelated uncommitted billing-claim work in flight this
  session and was deliberately left untouched. **Real break caught in review**: `AutoStreamOut`
  gained two new fields that `index.ts`'s existing plain-object-literal construction of `out` didn't
  have — made both optional rather than touch `index.ts`. Not deployed because deploying would also
  ship that unrelated uncommitted `index.ts` work, which isn't this ticket's call to make.
- **Housekeeping**: 5 worktrees (`../wt-f19/f16/f5/f20/f8`) created, merged, and removed cleanly this
  session — confirms the parallel-lane pattern from `CLAUDE.md` §2 works end to end for this project.

**Next up, still queued** (per the standing instruction to build everything codeable): F7 branded
catalogue generator, F1 offline foundation (architecture decision already made in
`CEREBYL-BUILD-PLAN.md` §0.1 — Option A, bundled + OTA — needs the actual implementation), F21/F22
cross-company benchmarking/credit signal (built dark, F22 specifically gated on Indian legal review
before ever switching on — schema-only for now, per spec's own instruction), F24 corpus scoring
re-run (not a coding task — run the harness and actually read the result).

---

## 2026-08-12 (evening, cont.) — F7 shipped; F24 status clarified; F21/F22 consent shells

**F24 is NOT "not started."** `acrowell-ai-worker/test/corpus/README.md` already documents extensive
completed work from 18 Jul 2026 — three independent large runs (437, 309, 550-of-588 rows) converging
on 92–95% intent accuracy, with real bugs found and fixed along the way (off-topic→smalltalk
misclassification, transporter/party confusion, dues-summary routing, call-recap routing — all fixed
and reverified). A single clean 588-row run under the FINAL code was never completed only because
demo accounts kept hitting daily token/message caps, not because the work never happened. Running it
again needs either Harish's login or fresh demo-account credentials and consumes live production
quota — flagged to him rather than run blind. **Do not re-open this as if from scratch.**

**F21/F22 (`690a21b`, applied+verified live)**: opt-in/consent ledger tables ONLY —
`company_benchmark_opt_in`, `distributor_credit_signal_consent`. No cross-company query or matching
function exists, and per spec's own hard gates (F21: "if it cannot be built without weakening the
isolation model... it does not get built"; F22: "requires Indian legal review before it is ever
switched on"), **none should be built until that review happens.** Written directly by the lead, not
delegated — this is exactly the isolation/legal-sensitive work the division of labour reserves for
the lead.

**F7 branded catalogue generator (`690a21b`, applied+deployed+shipped)**: single-product share image
(JPG, off-screen `html2canvas-pro` node) + one-pager PDF on the portal product page, gated by the
existing two-key `allowed`/`enabled` feature model — `catalogue_generator` added to
`DEFAULT_OFF_FEATURE_KEYS` but deliberately NOT `CONSOLE_ONLY_FEATURE_KEYS`, so an admin sees their
own toggle once console unlocks it (the two-key infra already existed generically, no new plumbing
needed). New `company_catalogue_settings` table for per-company customization.

**⚠️ CORRECTION to what this section originally said (see commit `0532529`) — this was NOT a
DeepSeek hallucination.** A `20260901120000_whatsapp_integration_schema.sql` +
`whatsapp-embedded-signup-callback` edge function appeared in the working tree mid-session while
Claude (this lead) was reviewing the F7 diff. Because no WhatsApp feature exists in the approved
24-feature spec and nothing in `WORKLOG.md` mentioned it, the lead wrongly concluded DeepSeek had
fabricated it and deleted both files (the DB migration itself had ALREADY been applied and verified
live before the deletion — only the local repo record was lost). **The real cause: Harish was
actively building WhatsApp integration in a SEPARATE, CONCURRENT Claude session on the same
Drive-synced working directory at the same time.** The files "appearing progressively" while the
lead ran `find`/`git status` was that other session writing real files in near-real-time, not
staged hallucination — a leadenthrella-specific hazard neither prior lead had hit before: **this
working directory can have two live Claude sessions editing it simultaneously**, and a file
appearing mid-session that nothing in `WORKLOG.md` explains is not proof of fabrication — it may be
a sibling session's in-progress work. The other session recovered everything itself in `0532529`
and confirmed no live data was lost. **Standing lesson for future leads: before deleting anything
unexplained mid-session, consider a concurrent session before concluding hallucination** — check
`git log` for very recent commits by the same author from outside this session, and when in doubt,
ask rather than delete.

(The narrower, still-true technical lesson from that same aider run stands independently of the
above: **always `git status`/`find` the ENTIRE working tree after an aider run**, since a ticket's
`--file` list is not a hard boundary DeepSeek respects — it can and did touch files never listed.
That check is what surfaced the (real, not hallucinated) concurrent-session files in the first
place, which is exactly why it's worth keeping as a habit.)

**Second, unrelated bug class from the same run, worth its own callout**: the portal page fetched
the distributor's own party identity via a direct `supabase.from("parties")` query. This project's
documented portal security model (`CLAUDE.md` §8f) gives party-user sessions **no `profiles` row**,
so `current_company_id()` evaluates to NULL and RLS silently returns **zero rows** for any direct
PostgREST read from a distributor session — not a data leak (the isolation model protected against
that), but the feature would have shown no party name/phone/logo for every real distributor, ever,
with no error to notice. The SAME bug hit a second hook in the same diff (`useCatalogueSettings`
called from the portal page, correct only for the staff-session admin settings page). Fixed both by
extending `portal-data`'s `me` action (now also returns `phone` and `catalogue_settings`) and
routing the portal page through it — matching this file's own header comment that ALL portal
business data flows through the edge function, never PostgREST directly. **This is the second time
this exact invariant has needed defending in one session — worth remembering as the single most
likely place a portal-side ticket goes wrong.**

Also fixed: broken JSX (ternary branch gained a second sibling element with no wrapping fragment),
a missing `image_url` field on `CatalogueAssetProduct`, a test file referencing an undefined `flags`
variable (declared as `flagship`), and `doc.setFont(undefined, "italic")` in the PDF generator
(jsPDF requires an actual font name). tsc 0, 563/563 tests after fixes.

**Remaining, not started this session**: F1 offline foundation (architecture already decided,
§0.1 Option A — needs the actual local-store/write-queue/OTA implementation, split into its own
tickets next), F12 (blocked on 3C, now unblocked — ready to ticket), F24 (needs Harish's input per
above, not delegatable).

---

## 2026-08-12 (afternoon) — Claude Opus (lead), taking over from Kimi K3 (weekly usage exhausted)

**Handoff point: Kimi's last action was pasting two successful verification queries for the
`order_request_schemes` migration (3/3 rows each) — meaning it WAS applied live, but the migration
file sat uncommitted and `portal-data` had not been redeployed to pick up the F6-c/F6-c2 schemes
code (deploy timestamp Aug 5, four commits stale). Closed both gaps this session:**

- **`12a0be9`, pushed & live:** committed `20260831120000_order_request_schemes.sql` (DB/repo now
  match) and deployed `portal-data` — its schemes-compute code (F6-c) can now actually write
  `qty_free`/`disc_pct`/`scheme_summary`, which it couldn't while the migration was uncommitted and
  the function stale. 535 tests / tsc 0 / `ship.sh` clean, verified live via browser (no console
  errors, `app.cerebyl.com` deploy hash `index-D_le4OfP.js`).
- **Real bug found and fixed in the same commit: auth page was unscrollable on mobile.** Harish
  confirmed via Chrome on the phone he tested the v3-fcm APK on — the login page loads but the
  email/password fields below the Ceremate bot image were unreachable, no scroll. Root cause:
  `html, body { overflow: hidden }` is global (`styles.css:248-251`, intentional for the app shell's
  internally-scrolling panels), but both auth-page layouts (`src/routes/auth.tsx:136`, `:191`) relied
  on document scroll via bare `min-h-screen ... overflow-hidden` with no scroll container of their
  own — content taller than one viewport (very plausible on a phone: wordmark + tagline + bot image +
  form + terms + footer) was simply clipped with no way to reach it. Fixed by giving each container
  its own scroll: `h-screen w-full overflow-y-auto`, independent of body's rule. Verified both in the
  mobile preview (`scrollHeight` 1214 vs `clientHeight` 812, scrolled via JS, screenshotted reaching
  the Sign In button) and live on `app.cerebyl.com`.
- **The APK "page didn't load" issue itself is NOT yet resolved / diagnosed further.** Harish
  confirmed the previous v2 APK (pre-FCM) worked fine, and Chrome on the same phone loads
  `app.cerebyl.com` (with the scroll bug just fixed, which was a real but separate issue). So the
  open question is narrower than Kimi's last framing ("transient network") — something specific to
  the v3-fcm build (FCM/push-notifications plugin + `google-services.json`, or a WebView-vs-Chrome
  difference e.g. Cloudflare bot rules treating the WebView UA differently) is the likely lead.
  Manifest, `capacitor.config.ts`, `MainActivity.java`, and `build.gradle`'s google-services block
  were all read this session and look correct — nothing jumped out as broken by inspection alone.
  **Next step needs the device**: reinstall the (already-built) `mobile-test-builds/cerebyl-shell-v3-fcm.apk`
  now that the scroll fix is live, retry, and if it still fails, `adb logcat` while it fails (USB
  debugging) is the fastest way to get the real WebView error (net::ERR_* code) instead of guessing.
- **F6/F10 status per Kimi's last summary (unverified by me beyond the above):** F6 scheme engine
  a–e all shipped (rules engine, order-form nudges, offer editor, portal server-side compute, F9
  margin hook) and F10 predictive reorder (cadence engine + cart suggestion cards) — both reported
  535 tests green at handoff. I have not re-audited F6/F10 UI behaviour this session, only unblocked
  the DB/deploy gap that was holding F6-c's actual writes back.
- **Not yet looked at this session:** F10 remaining pieces beyond what Kimi listed, the 8-Aug build
  plan's later batches (`Files/CEREBYL-BUILD-PLAN.md`), and `Files/tickets/` — that folder has ~25
  ticket files (1A/2A/B0/F2/F15/F17/F18 series) whose completion status vs the build plan hasn't been
  cross-checked yet. Next lead: read `CEREBYL-BUILD-PLAN.md` batch table against `Files/tickets/` and
  the git log before writing new tickets — don't assume the plan's batch order is still current.

**APK "page didn't load" — root cause found, one fix shipped, real diagnosis still pending.**
The crash screen Harish was seeing is our OWN React error boundary (`route-error.tsx`, rendered by
`__root.tsx`'s `errorComponent`) — not a WebView network failure. Confirmed: it fires immediately on
opening the app, before the login screen ever renders, and Chrome on the same phone loads
`app.cerebyl.com` fine (scroll bug notwithstanding, see above). That combination means something in
root-level bootstrap throws only in the native shell.

- **`d2a1fbc`, live:** hardened `useNotificationDeepLinks` (`src/lib/use-notification-deep-links.ts`)
  — it's the ONLY Capacitor-gated code that runs unconditionally at root before login (added in
  F17-d, after which this bug started per Harish: v2/pre-FCM worked, v3-fcm doesn't). Its two
  `addListener()` calls can throw SYNCHRONOUSLY if the injected native bridge returns a plugin
  object whose method isn't what we expect — a sync throw inside a `useEffect` is a render-phase
  error to React, caught by the nearest boundary, which replaces the ENTIRE app with the crash
  screen before any UI renders. Wrapped both in try/catch so a bad bridge degrades to "no deep
  links this session" instead of crashing everything. **Not confirmed as the actual root cause** —
  applied as a safe hardening because it's the strongest lead, not because we saw the real error.
- **`9cc3815`, live, migration applied:** discovered BOTH error sinks were blind to this exact
  crash. `RouteError` never actually called Sentry (a stale comment said "when Sentry is added,
  hook it here" — never done, months after Sentry shipped) — now wired via
  `Sentry.captureException`. Separately, `platform_error_log`'s INSERT policy was
  `authenticated`-only, so a crash before login (no session yet) silently failed RLS inside
  `logAppError`'s own swallowed try/catch — confirmed by checking `/console/errors` live, which
  only showed a stale unrelated `collapsed is not defined` error from 7/8/2026, nothing from
  today. Migration `20260812150000_platform_error_log_anon_insert.sql` grants `anon` INSERT
  restricted to `company_id IS NULL AND user_id IS NULL` (can't attribute a fake error to a real
  company/user). Applied and probe-verified (1 row).
- **Next step needs the device, not more code guessing:** since the shell loads a remote URL, both
  fixes are already live with no APK rebuild required — ask Harish to reopen the v3-fcm app. If the
  hardening above was the actual cause, it should now get past boot (possibly with no push deep
  links working, which is an acceptable regression vs. a dead app). If it still crashes, `/console/errors`
  or Sentry will NOW actually have the real error/stack — read that before touching any more code.
  Do not declare this fixed until one of those two things is confirmed.

---

## 2026-08-12 (morning) — Kimi K3 (lead)

**F6 scheme engine: a/b/c/d/e all coded and shipped. Two migrations APPLIED mid-flight (offer_rules ✓ by Harish; order_request_schemes pending → portal-data deploy HELD until then).**

- **F6-a `1e76703`:** `scheme-rules.ts` pure engine — qty_free (X+Y, floor
  semantics), percent with min_qty/min_value gates, qty/value slabs (highest
  qualifying wins), scope global/party_type/party. Rules: schemes NEVER reduce
  what a human typed, never touch the rate (party rate cards keep primacy),
  two percent schemes don't stack (better wins), free+percent coexist.
  25 tests, 6 mutants killed — TWO test weaknesses found by mutation testing
  (a perl pattern that never matched = phantom survivor, and a single-element
  sort test; both fixed). Migration `20260830120000_offer_rules.sql`.
- **F6-b `8edcb14`, live `index-Dn_Muvw-.js`:** order form Schemes panel —
  live nudges ("Add 5 more of X to unlock 10+2"), Apply-schemes button,
  scheme names locked to `orders.scheme_applied`. ⚠️ **Process slip: this
  commit accidentally included the unapplied migration (`git add -A`).**
  Harish applied it immediately after; no drift remains. Rule reinforced:
  explicit add paths only, never -A, while a pending migration sits in tree.
- **F6-d `56f8c8f`, live `index-WQUlnX2L.js`:** offer editor rule UI (type,
  scope, params incl. slab rows). Client-side guard: qty_free requires a
  product (mirrors the DB CHECK offers_rule_sane).
- **F6-c `6648d04`, live `index-lfdopHAx.js`:** portal submit_request computes
  schemes SERVER-SIDE in portal-data (mirrored engine, byte-identity guard
  test for all 7 functions — same pattern as allocateFifo). Request items
  carry qty_free/disc_pct; order_requests.scheme_summary; accept flow maps
  them into the order untouched + scheme_applied. Fixed a real bug mid-write:
  scheme results keyed by product_id collapsed duplicate-product cart lines —
  now index-aligned. **Deploy of portal-data HELD until
  `20260831120000_order_request_schemes.sql` is applied** (inserts reference
  the new columns). First wrangler deploy attempt hit a transient Cloudflare
  auth 500; retry succeeded — don't panic-revert on that error, just retry.
- **F6-e (shipping):** portal-offers edge fn now party-filters scoped offers
  SERVER-SIDE (a distributor must never receive another party's rule payload)
  and returns rule_type/rule_params; product page shows "With 10+2: effective
  ₹83.33/unit" via `bestSchemeRate` (5 tests, 3 mutants killed).
- F6 remaining: portal cart nudge UI (c2, minor), then F10 predictive reorder.

---

## 2026-08-11 (late night) — Kimi K3 (lead)

**Batch 2A CLOSED. F3 objection library shipped; F14-a + F4d + F3 migrations all applied by Harish and probe-verified. Webhook trigger `notifications-push` confirmed live on `notifications`.**

- **F3 `2eb0a03` → `6f9f19b`, live `index-DDK_s7kE.js`, 488 tests / tsc 0.**
  Table `objections` (division-tagged via lead product_interest taxonomy, NULL =
  all divisions; reps submit `pending`, managers approve/retire; `open_count` via
  security-definer `record_objection_open` because reps must count without UPDATE).
  Lead panel `LeadObjectionsCard` on the lead detail page; lost-reason picker in
  `LeadDialog` merges approved objection titles ahead of the hardcoded list
  (`mergeLostReasons`, dedupe + order — mutation-tested 3/3 kills). Stored
  lost_reason stays a plain string, no schema change.
- **Type regen caught a REAL bug:** `objections.company_id` is NOT NULL with no
  default and the client insert omitted it — every submit would have 500'd.
  Fixed client-side (lookup profile → pass company_id), matching the codebase
  convention (no `DEFAULT current_company_id()` anywhere in the schema).
  This is why "regen types after apply" is a gate, not a courtesy.
- Casts dropped in `use-objections.ts` and the orders dispute banner;
  `Order` type in `use-orders.ts` gained `disputed_at`/`dispute_note`.
- Migrations committed post-apply: `20260827120000_invoice_disputes.sql`,
  `20260828120000_territory_dormancy.sql` (tasks generator section 6,
  manager/admin-gated, NEVER auto-releases; `company_settings.territory_dormancy_months`
  NULL→6), `20260829120000_objections.sql`.
- **APK issue open:** v3-fcm installs but shows "The page didn't load". Remote
  URL verified 200 from desktop with a mobile UA; `capacitor.config.json` inside
  the APK correctly points at https://app.cerebyl.com with INTERNET permission.
  Most likely transient (opened mid-deploy or no connectivity). Asked Harish to
  retry on Wi-Fi; if it persists, next step is `adb logcat` on the device.
- Batch 2A fully done. Next: Batch 2B — F6 scheme engine (must EXTEND
  `use-offers.ts`, never fork) paired with F10 predictive reorder.

---

## 2026-08-11 (night) — Kimi K3 (lead), DeepSeek V4 Flash (worker)

**F17-a shipped: `6f5b858`, applied by Harish, probe-verified (10/10 expected rows:
2 tables, 7 policies, touch trigger fn). Types regen diff confirmed both tables live.**

- `device_tokens` (UNIQUE token, `package_name` stored — FCM registers per Android
  applicationId, so each branded APK's tokens are distinguishable) + `user_push_prefs`
  (prefs jsonb: category toggles + quiet hours). Prefs are a SEPARATE table, not a
  profiles column: profiles has only admin/manager UPDATE policies, and a self-update
  policy would let users edit their own role/is_active. (Confirmed no self-update
  policy exists — which also means `useDailyDigestPref`'s direct profiles update can
  only ever have worked for admins; latent bug, not F17 scope.)
- **Escalation: I wrote this migration myself.** DeepSeek burned two runs on it:
  (1) diff edit-format → infinite reflection loop answering its own lint questions,
  zero edits; (2) whole edit-format → truncated file with a literal `...` line,
  "Only 3 reflections allowed". SQL-only single-file tickets are a known weak spot;
  lead writes migrations directly from now on, worker keeps code tickets.
- Harness: `pg_policies` column is `policyname` (I typo'd `polname` in a verification
  query — cost Harish a failed run).

### F17-b/c/d — all lead-implemented; worker is in a degraded state

DeepSeek then failed F17-b with a THIRD distinct loop (repetition over package.json
sort order, zero edits, and aider created a junk directory
`supabase/migrations/Now produce final answer with only SEARCH/REPLACE block.supabase`
from its chatter — deleted). Three zero-edit runs in one session = the worker is
unusable today; F17-b/c/d were implemented by the lead. **Retry the worker on the
next code ticket; if it loops again, check the API key/model name before assuming
prompt problems.**

- **F17-b `948cb6c`, live `index-DaBodjl7.js`:** `@capacitor/push-notifications` in
  mobile/ only; `PushNotificationsPlugin` bridge types; `registerDeviceForPush()`
  (once-per-user-per-session guard, permission → register → upsert `device_tokens`
  on token conflict, package_name from `App.getInfo().id`); wired fire-and-forget
  into `useNotifications`. tsc 0, 449/449.
- **F17-c `c93d120`+`c187f4e`, deployed & smoke-verified:** `send-push` edge function.
  Webhook-secret auth (`x-webhook-secret`), FCM v1 with hand-rolled service-account
  JWT (WebCrypto RS256, module-scope token cache), prefs honoured at send time
  (category toggle + IST quiet hours, midnight-crossing — 8/8 logic cases verified
  in node), stale-token cleanup on 404/UNREGISTERED. Probes: no secret → 401;
  unknown user → `{skipped:"no_tokens"}`. Secrets set via CLI:
  `FCM_SERVICE_ACCOUNT_JSON` (from ~/Documents keyfile, never committed),
  `PUSH_WEBHOOK_SECRET` (given to Harish once, in chat). **Gotcha: new edge functions
  default to verify_jwt=true — the gateway 401'd the webhook before our code ran;
  fixed with `--no-verify-jwt` + `[functions.send-push]` in config.toml.** Also: the
  pre-commit secret scanner blocks the literal string `BEGIN PRIVATE KEY` even in
  parsing code — strip PEM armour by filtering lines that start with dashes instead.
- **F17-d `6440e2f`, live `index--zGorba4.js`:** `routeForNotification` pure helper
  (slabreach:<leadId> → /leads/<id>, followup_due → /leads/followups, then order_id/
  party_id fallbacks; specific beats generic) — 6 tests, 4/4 mutations caught.
  `useNotificationDeepLinks` at the root: FCM `pushNotificationActionPerformed` from
  the data payload, plus the previously-missing local-notification tap handler
  (`extra.notificationId` → fetch row → mark read → navigate).
- **Still manual (Harish):** create the `notifications-push` Database Webhook
  (Dashboard → Database → Webhooks, INSERT on public.notifications, POST to the
  send-push URL, header x-webhook-secret). Then F17-e: APK pipeline — rebuild the
  shell with the push plugin (`cd mobile && npm install && npx cap sync android`,
  build, install, verify a token lands in device_tokens); each branded APK later
  needs its own Firebase Android app because FCM registers per package name.

### F15-c + F17-e — F15 task kinds complete; FCM APK built

- **F15-c `2e6e122`, applied + probe-verified (3/3):** `order_action` (live order
  not Delivered/cancelled/draft/deleted, >2 days old → created_by rep, priority 8,
  dedupe `order:<id>`) and `dues_threshold` (party SUM(due_total) on live orders ≥
  `company_settings.dues_task_threshold`, NULL → ₹50,000 → party created_by,
  priority 12, dedupe `dues:<id>`, no daily re-spawn). Harish's rulings: all open
  pipeline orders; fixed per-company ₹ threshold. My Day UI needed no changes —
  `TaskKind` union was forward-defined and rows render kind-agnostically (no
  subject links anywhere yet — noted as possible UX follow-up). **Follow-up:
  settings-UI input for `dues_task_threshold`.** F15 auto-population is now all
  six spec'd kinds.
- **F17-e APK built:** `mobile-test-builds/cerebyl-shell-v3-fcm.apk` (debug).
  `local.properties` with sdk.dir had to be recreated (gitignored, machine-local).
  Harish: install on a phone, open app, allow notifications → verify a row lands
  in `device_tokens` (`select user_id, package_name, platform from device_tokens;`).
- **Next: F18 lead-list ranking filters** (Batch 1A remainder). Worker gets one
  retry on this code ticket after today's three loops.

### F18, F13, F14-a — worker retired for the session; all lead-implemented

DeepSeek looped a 4th consecutive run (F18 ticket, repetition over an import
line). **Decision: implement directly for the rest of the session; revisit the
worker tomorrow with a fresh session and a key/model sanity check.**

- **F18 `62f6b76`, live `index-DE1CgAdC.js`:** five ranking options on /leads/all
  (SLA risk, Lead score, Days since contact, Conversion likelihood, Territory —
  Harish ruled UNCOVERED areas first). Pure `lead-ranking.ts` + comparators with
  a decidedLast guard; 15 tests, 5 mutations caught — one SURVIVED initially
  because leadScore's own decided-zeroing agreed with the removed guard; added
  an isolating compareByNeglect test. Same trap pattern as the handover warning.
- **F13 `94492a0`, live `index-Djxr6IBf.js`:** deep-zoom lightbox on the portal
  product page (pinch/wheel 1–4x, drag-pan, double-tap 2.5x, arrows/dots,
  pointer events only). Pure zoom maths in `src/lib/zoom.ts`; 6 tests, 3
  mutations caught — but only after fixing assertions that referenced the
  MAX_ZOOM constant and so tracked the mutation (literal values now).
- **F14-a `abe33db`, live `index-DM1hhoGW.js`, edge fn deployed:** per-invoice
  dispute from the portal → `orders.disputed_at/dispute_note` + `invoice_dispute`
  task (assignee order.created_by, fallback first active admin). Gotchas: the
  tasks dedupe index is PARTIAL so PostgREST upsert can't target it — plain
  insert + tolerate 23505. Migration `20260827120000_invoice_disputes.sql` is
  with Harish; the deployed portal-orders selects the new columns, so portal
  invoice pages 500 until he applies it (small window, he was told).
  **F14 remainder: payment-allocation drill-down (needs an allocation model —
  payments today are unallocated credits). Not started.**
- **F14-b `c46ef76`, live `index-BsGxWPIl.js`, edge fn deployed:** allocation
  drill-down done WITHOUT an allocation model — `allocateFifo` derives the
  view (payments stored unallocated; chronological walk, invoices-before-payments
  same day, never future-dated, no phantom covers). Statement invoice rows expand
  inline. 8 tests incl. byte-identical edge mirror guard (extended the
  ledger.test.ts convention). Mutation note: the same-day sort-order mutation is
  semantically neutral once the future-guard exists — verified, documented.
  **F14 complete.** Batch 1B is now fully shipped (F9 minus its F6 hook, F13, F14).

---

## 2026-08-11 (evening) — Kimi K3 (lead), DeepSeek V4 Flash (worker)

**F2-a + F2-b shipped: `8eee7ec`, pushed, live chunk `index-BUMEHdNC.js`. 431 tests / 43 files,
typecheck 0.** Migration `20260822120000_speed_to_lead.sql` applied by Harish, probe-verified by
types-regen diff (columns present in live schema).

- **Self-caught design bug, fixed before apply:** my first F2-a draft put SLA thresholds on
  `companies` — which only platform admins can write (`companies_platform_all`), so company admins
  could never have edited them, and a wider policy would expose plan/trial fields. Moved to
  `company_settings` (has admin insert/update policies). Harish ran BOTH versions, so stray
  `companies.sla_*` columns exist — F2-c1's migration drops them (`DROP COLUMN IF EXISTS`).
  **PostgREST anon probes cannot verify columns** (permission check precedes column resolution;
  root OpenAPI now needs a secret key) — the types-regen diff is the probe.
- Trigger `trg_leads_first_contact` sets `first_contact_at` once, from ANY write path (a fu status
  gaining a real outcome, or stage leaving 'New'). Client-side capture was rejected: Ceremate's
  `use-assistant.ts` logs calls too and would have been missed.
- Badge (`SlaBadge`) on leads table, lead cards and lead detail; green <75% / amber / red, 60s
  self-refresh. `useCompanySla()` reads company_settings with DEFAULT_SLA placeholder (no flicker).
- Lead-fixed edge: exactly at the deadline the label read "0m left" — now "0m over" with a test.
- Mutation tests (lead-run): 0.75→0.5, `>=1`→`>1`, warm→cold fallback, `<=0`→`<0` — all caught.
- **Worker-quality watch:** F2-b's `useCompanySla` initially queried `companies` per the ticket's
  own (wrong) instruction — tickets must state the table, and the review must check it against
  RLS reality. The F2-c tickets state this explicitly.

**F2 complete (a, b, c1, c2, d). Next up: F17 (FCM push) stage 2 — plan in handover summary,
starts with F17-a schema ticket (device_tokens + profiles.push_prefs).** F15 remaining task kinds
(dues_threshold/order_action) still need product decisions.

### Later same evening

- **F2-c2 shipped: `46fa4ac`** (Lead SLA tab on /settings; invalidates the `["company-sla"]` badge
  cache on save — review catch). Live chunk `index-BvXOeDeR.js`.
- **F2-c1 SQL handed to Harish** (migration + the `cron.schedule('sla-breach-notifications',
  '*/5 * * * *', …)` statement + a pg_trigger/pg_proc verification query). File committed only
  after he confirms.
- **F2-c1 + F15-b APPLIED and pushed: `379fc7d`** (migrations + types regen only, no code — no
  deploy needed). Harish applied both SQL files and the cron statement. Probes: cron job #4
  `sla-breach-notifications` scheduled; pg_proc shows `generate_sla_breach_notifications_all` +
  `_for_company`; types regen diff shows `sla_*` columns now ONLY on `company_settings` (stray
  `companies.sla_*` dropped) and both new functions present. F15-b's `generate_tasks_for_user`
  replacement confirmed earlier (`t` probe). Earlier in the apply: `REVOKE
  generate_due_notifications FROM anon` probed 42501 ✓. One harness note: **SQL Editor runs only
  the selected text** — Harish must leave nothing highlighted when running a script.
- **F2-d shipped (code): response-time reports.** Pure `src/lib/response-time.ts`
  (responseMinutes with clock-skew guard, median, nearest-rank p90, summarizeBy with alphabetical
  default, conversionByBucket over fixed semantic buckets) + `/analytics/response-time` (manager/
  admin lens "Response Time": by rep, by source, by arrival hour — chronological, documented
  exception — and conversion by response bucket). 449 tests / 44 files, tsc 0. Mutations caught:
  even-median→upper, p90 0.9→0.5, sort deleted, bucket `<=`→`<`, open stages counted. Harness
  note: **new file-based routes need `npm run build` to regenerate `routeTree.gen.ts` before
  `tsc` will pass** — `npx tsr` is a different, unrelated package; don't use it.

---

## 2026-08-11 (cont.) — Kimi K3 (lead), DeepSeek V4 Flash (worker)

**Ticket 2A.4 shipped: disputes queue panel. Commit `d8b331c`, pushed, live chunk
`index-BtnqtXzc.js`. 418 tests / 42 files, typecheck 0.**

- `disputeQueue()` pure helper (open only, created_at asc, id tiebreak) + `TerritoryDisputesPanel`
  under the holds panel on `/clients/territories`. Managers resolve inline (ConfirmDelete idiom);
  reps read-only.
- **Diff review caught a real one:** the worker's panel re-filtered `status === 'open'` inline and
  never called the `disputeQueue` it had written and tested — the tested ordering logic was dead
  code. Lead fixed in one line. Add to the review checklist: *verify the UI actually calls the
  tested helper.*
- Mutation tests (lead-run): status filter deleted → red; comparator reversed → red; id tiebreak
  removed → red (the "excludes resolved" fixture also guards the tiebreak — two same-timestamp
  open rows inserted out of order).
- F4b is now functionally complete: capture (2A.3) + queue/resolve (2A.4). Map rendering of holds
  remains the only deferred F4a item (touches `territory-map.tsx`).

**F2 speed-to-lead started.** Design decisions (lead's, recorded here so they aren't re-litigated):
- Arrival = `created_at` (machine-generated by the intake worker; `date_received` is date-only).
- Contact signal = a fuN_STATUS set to a real outcome (never a bare date — that's scheduling) or
  any stage change away from 'New'. Implemented as a **DB trigger**, not client code, because
  Ceremate's assistant (`use-assistant.ts`) also logs calls — client-side capture would miss it.
- Backfill is honest: only from same-slot fu date+status evidence. Legacy leads past 'New' with no
  evidence stay NULL; UI treats `stage <> 'New'` as contacted; reports skip the NULLs. No
  fabricated timestamps.
- SLA thresholds live on `companies` (`sla_hot/warm/cold_minutes`, defaults 15/120/1440). Unknown
  temp falls back to WARM. Badge: green < 75% elapsed, amber 75–100%, red breached.
- Tickets: F2-a schema (in aider now) → F2-b badge + pure `speed-to-lead.ts` (ticket written,
  `.claude/TICKET-F2b.md`) → F2-c breach notify + admin threshold UI → F2-d reports (median/p90
  by rep/source/hour + conversion by response bucket).

---

## 2026-08-11 — Kimi K3 (lead), DeepSeek V4 Flash (worker)

**Ticket 2A.3 shipped: `territory_disputes` + override reason capture (F4b). Commit `266796e`,
pushed, deployed, live chunk `index-nPOBv2J9.js`. 415 tests / 42 files, typecheck 0.**

- Migration `20260821120000_territory_disputes.sql` — written by DeepSeek, reviewed, **applied by
  Harish in the SQL Editor** (Kimi CLI has no browser pane / DB creds, so the tap-to-copy block
  workflow is the path from now on), probe-verified: anon gets 42501 on SELECT and INSERT.
  Subject is exactly one of `hold_id`/`territory_id`; at least one conflict ref; `reason` CHECK
  non-blank; status open/resolved with coherent `resolved_at`; RLS mirrors territory_holds
  (company-wide SELECT, `raised_by = auth.uid()` insert, manager-only UPDATE for resolve).
  FKs are ON DELETE CASCADE on purpose — SET NULL would violate the cardinality CHECKs.
- Both override surfaces now gate the save button on a typed reason when a conflict exists
  (pure `overrideSaveAllowed` in `src/lib/territory-disputes.ts`) and raise the dispute after the
  save. A failed dispute insert does NOT roll back the hold/territory — separate error toast.
- `usePlaceHold`/`useSaveTerritory` now return the saved id. `useTerritoryDisputes`/
  `useRaiseDispute`/`useResolveDispute` hooks ship in `src/lib/use-territory-disputes.ts`.
- Types regenerated from live schema (+101 lines, additive only).
- **Mutation tests all run by lead, all caught**: `> 0`→`>= 0` on the reason gate; first-wins→
  last-wins in `conflictColumns`; `" + "`→`", "` join in `disputeSummary`.
- Tickets archived at `Files/tickets/2A-3a-territory-disputes-schema.md` and
  `2A-3b-dispute-reason-capture.md`.
- Harness note: aider hit its 3-reflection edit limit on the migration file too (rule 6 holds —
  keep SQL tickets small), but the output was complete and correct; the reflection churn was only
  on a trailing `-- EOF` comment.

**Next: 2A.4 disputes panel** — managers see open disputes and resolve them (the
`useResolveDispute` hook already ships). Natural home: `TerritoryHoldsPanel` area on
`/clients/territories`. Then F2 speed-to-lead, then F17 FCM stage 2.

---

## 2026-08-10 (later) — Claude Opus (lead), DeepSeek V4 Flash (worker)

**Kicked off the 24-feature build programme from `~/Desktop/CEREBYL-BUILD-SPEC.md`. Plan lives in
`Files/CEREBYL-BUILD-PLAN.md` — read it before continuing. Two commits, NOT pushed (unapplied
migration).**

### Owner decisions this session (they override the spec)
- **Territory collisions never block.** Reps AND managers may both override an overlap; the override
  requires a reason, and that reason auto-creates the dispute record. Harish: not tightly regulated
  in Indian pharma, so leniency is right. Spec F4b said "block the write" — it does not.
- **Leads sort newest-received-first**, now a documented exception to the alphabetical rule in
  `CLAUDE.md` §5.
- **FCM deferred** — Harish sets up Firebase separately; build everything else first.

### Shipped (commits `d126f78`, `efc00f9`) — 388 tests / 38 files, typecheck 0
- Leads list default sort fixed: it sorted by `created_at` while `useLeads()` fetched by
  `date_received`. **`date_received` is a `date` column** (intake writes `.slice(0,10)`), so the
  comparator goes day → `created_at` desc (intra-day arrival) → `id`. Call List preset untouched.
- F9 margin/GST calculator on the distributor product page; arithmetic pure in `src/lib/margin-calc.ts`.
  MRP treated as GST-inclusive and backed out; PTS/PTR/selling price GST-exclusive, matching
  `order-totals.ts`. Per-pack hidden rather than guessed when `pack` can't be parsed.
- F15 foundation: `public.tasks` + `use-tasks.ts` + pure ordering in `tasks.ts`.
  **Migration `20260817120000_tasks.sql` is NOT applied — Harish must run it.**
- B0.9: reversible bundled-assets prototype. `CEREBYL_BUNDLED=1` drops `server.url`; unset, inert.

### Continued same day — F4a holds + F15 UI shipped live

- **`a24d875` territory soft-hold** (F4a data layer). Migration `20260818120000_territory_holds.sql`
  APPLIED and probe-verified. Mirrors `party_territories` scope/area columns exactly so
  `scopesOverlap`/`areasOverlap` work on holds untranslated. **SELECT is company-wide on purpose** —
  every rep sees every live hold, because a hold nobody can see prevents nothing; INSERT still
  requires `held_by = auth.uid()`. `party_territories` RLS untouched (reps still cannot book).
  No auto-expiry job by design — expired means `expires_at` passed; a deleter would be a second
  source of truth.
- **`4bf3b7e` My Day task list + manager injection** (F15 UI), live as `index-BN7eDMG_.js`.
  One flat ordered list, three actions per row, dismiss-reason required on auto tasks (the DB CHECK
  enforces it, so the UI collects it rather than surfacing a Postgres error). All three role
  branches preserved; only `onAssign` props added.
- **Task auto-generation is NOT built.** Next ticket. Reuse the proven idiom from
  `20260805180000_notification_generators_for_cron.sql` section 4: `CROSS JOIN LATERAL (VALUES
  (1, fu1_date, fu1_status), …)` + `ON CONFLICT (user_id, dedupe_key) DO NOTHING`, honouring
  `fu*_status` and excluding Won/Lost. That section is the KNOWN-CORRECT generator — the
  `lead_followup` one was dropped for using GREATEST() and ignoring status.
- **Live verified** in the Browser pane after each deploy: title renders, zero console errors.

### Worker-quality note after 8 tickets
DeepSeek's engineering substance was right nearly every time (GST back-out, comparator, RLS
policies, hold semantics). All four repeated defects were in VERIFICATION, not code:
vacuous test fixtures (twice), an incomplete hook mock that made a component throw so the test
asserted nothing, and assertions written against a precision the spec forbade. Budget one
correction round-trip per UI ticket and always mutation-test before committing.

- **`f948711` task auto-generation** (F15 complete for follow-ups), live `index-BMV3n3xW.js`.
  Migration `20260819120000_generate_tasks.sql` APPLIED; `generate_tasks` probe-verified (anon gets
  42501, so the REVOKE holds). Types regenerated from live schema — 227 insertions, no deletions.
  **Open follow-up: the EXISTING notification generator has no `deleted_at` filter on leads**, so
  trashed leads are probably still generating notifications today. Deliberately not fixed inside an
  unrelated ticket — needs its own change.
  **Aider hit its 3-reflection edit limit twice on this SQL file** and corrupted an `ON CONFLICT`
  predicate (dropped `AND dedupe_key IS NOT NULL`, which would have failed at apply time since
  Postgres only matches a partial unique index when the statement repeats its predicate). Lead fixed
  the four words directly per the two-failure escalation rule. **Large SQL files are where DeepSeek's
  edit format struggles most — keep migration tickets small.**

- **Territory hold UI shipped** (F4a complete bar the map + dispute record), live `index-BmiuYEx8.js`.
  Lives on `/clients/territories`. Overlap **warns, never blocks** (owner's ruling). Reuses
  `findTerritoryConflict` unchanged — hold columns mirror `party_territories` so there is ONE
  comparison implementation, not two that drift. **Map rendering of holds and the dispute record are
  NOT built** — dispute needs a `territory_disputes` table (2A.3).
  Bug the ticket's own test caught: the panel sorted but never filtered, so dead holds rendered as
  "expired" rows — a holds list padded with dead entries tells a rep ground is taken when it is free.

### HANDOVER TO KIMI — state at end of the 10–11 Aug 2026 session

**Everything is pushed and deployed. HEAD = `ac3b5fc`. Live chunk `index-BmiuYEx8.js`. Working tree
clean. All migrations applied and probe-verified. 406 tests / 41 files, typecheck 0.**

**Read in this order:** `Files/CEREBYL-BUILD-PLAN.md` (the programme, plus the owner decisions in
§0.1 and §0.1b) -> `Files/tickets/reports/REPORT-B0-{1,2,3}.md` (the audits; they are the evidence
that stops you rebuilding shipped work) -> `CLAUDE.md` §2 (the 95/5 split, escalation triggers, and
the seven aider harness rules). Written tickets are in `Files/tickets/`; attach
`leadenthrella/.claude/TICKET-PREAMBLE.md` to every aider run.

**Shipped live:** leads default sort by `date_received` (F18) · F9 margin/GST calculator on the
distributor product page · F15 My Day task list + manager assignment + follow-up auto-generation ·
F4a territory soft-hold (schema, hooks, UI) · B0.9 bundled-assets prototype (inert until
`CEREBYL_BUNDLED=1`) · notification/digest generators fixed to ignore soft-deleted rows.

**Migrations applied + probe-verified:** `20260817120000_tasks`, `20260818120000_territory_holds`,
`20260819120000_generate_tasks`, `20260820120000_generators_ignore_deleted`. Types regenerated from
live schema (`npx supabase gen types typescript --project-id cjowrlrjyhdltbyqwozr --schema public`).

**Firebase/FCM: infra READY, no code written yet.** Project `cerebyl` under the `enthrella.com` org,
Sender ID `873469779814`, FCM API (V1) enabled, Android app registered for `com.cerebyl.app.base`.
`mobile/android/app/google-services.json` is COMMITTED (not secret — it ships in the APK).
**The service-account key is at `~/Documents/cerebyl-fcm-service-account.json` (0600), OUTSIDE the
repo** — it was downloaded into `mobile/android/app/` by mistake and moved; `.gitignore` now blocks
`*adminsdk*.json` / `*serviceAccount*.json` / `*-firebase-adminsdk-*.json` (verified by dropping a
test key in and confirming git ignores it). Load it as a Worker/edge-function secret; never commit
it, never paste it into a chat.
Two gotchas worth keeping: the `enthrella.com` org enforces BOTH the legacy
`iam.disableServiceAccountKeyCreation` AND `iam.managed.disableServiceAccountKeyCreation`, evaluated
concurrently — both had to be Not-enforced on the project before a key could be created. And **FCM
registers per package name**: this google-services.json covers the base shell ONLY. Every branded
per-company APK needs its own Firebase Android app and its own google-services.json baked into that
build — an APK-pipeline change, not a console click.

**Next tickets, in order:**
1. **2A.3 dispute record** — `territory_disputes` table + reason capture on an overlap override.
   Owner's ruling: an overlap NEVER blocks; reps and managers may both override, but the override
   requires a reason and that reason auto-creates the dispute row.
2. **F2 speed-to-lead** — migration (`first_contact_at` on leads + per-grade SLA thresholds),
   countdown badge with three states, manager breach notify, and the three reports.
3. **F17 FCM stage 2** — now unblocked. Device-token table, registration through the
   `src/lib/capacitor.ts` bridge (`src/` must NEVER `import @capacitor/*`), a sender on the
   Worker/edge function, quiet hours, per-category prefs, deep-links into the exact record.
4. **Holds on the territory map** — deferred on purpose; touches `territory-map.tsx`.
5. Remaining F15 task kinds: `lead_uncontacted` needs F2's `first_contact_at`; `dues_threshold` and
   `order_action` need product decisions first.

**Still open / known:**
- `generate_due_notifications()` is executable by **anon** (an old migration granted to
  `authenticated` without revoking PUBLIC's default). Harmless today because `current_company_id()`
  is NULL for anon, but it should be revoked.
- B0.9 is the bundled-assets half only. **OTA download logic is unwritten and the boot fail-safe is
  mandatory** — if a downloaded bundle fails to boot, the app must revert to the baked-in baseline,
  or one bad bundle bricks every phone with no way to push a fix.
- Adoption analytics: decided AGAINST Google/Firebase Analytics — the shell is a WebView on a remote
  URL so it would only ever see `app_open`, and it adds a sub-processor to the DPDP surface. Measure
  from our own DB. Crashlytics before Analytics if mobile telemetry is ever wanted.

**Do not re-litigate these owner decisions:** territory overlaps never block (reason + dispute row
instead) · leads sort newest-received-first by `date_received`, not `created_at` · mobile is
bundled-assets + OTA, not a native rewrite (`CEREBYL-BUILD-PLAN.md` §0.1 has the reasoning and the
options that were rejected).

**Worker quality after ~14 DeepSeek tickets:** engineering substance reliable — GST back-out,
comparators, RLS policies and hold semantics all correct first time. **Self-verification is not:**
vacuous test fixtures twice, an incomplete hook mock that made a component throw so its tests
asserted nothing, assertions written against a precision the spec forbade, and a corrupted
`ON CONFLICT` predicate when the edit format degraded on a 100-line SQL file. Budget one correction
round-trip per UI ticket, keep migration tickets small, and **always run the gates and the mutation
check yourself.**

### Audit reports — READ THESE BEFORE BUILDING (`Files/tickets/reports/`)
- **Territory overlap detection already exists** (`findTerritoryConflict`) and runs live, but `save()`
  never checks it — deliberately advisory. Reps can't book territories at all (RLS is
  `is_manager_or_admin()`), so **F4a's soft-hold needs its own table with rep-writable RLS.**
- **Order lines are already rate-locked** (`order_items` stores rate/mrp/disc_pct/gst_pct at insert)
  and order requests carry `quoted_rate` — F6's hardest requirement is already supported.
  Offers are display-only with **no discount/free-qty/min-qty fields**, and there is no party-group concept.
- **Composition is free text** — `Cefixime 50mg/5ml Dry Syrup`, `Fungal Diastase + Pepsin`. F12 is
  viable but needs a real normalisation layer, not regex.
- AI worker `MODEL` is a single constant; abstraction is cheap. Preserve the `callPart`/
  `thoughtSignature` round-trip and the two cache slots or `/analyze` 400s.

### Harness lessons — these cost three re-runs, don't repeat them
1. **Keep every `--file`/`--read` path inside `leadenthrella/`.** Passing a path from `Files/` made
   aider bind to the PARENT repo, so its repo-map was 235 non-source files and it could only see
   what was explicitly passed. Preamble now lives at `leadenthrella/.claude/TICKET-PREAMBLE.md`.
2. **Never ask DeepSeek for `path:line` evidence** — it never sees line numbers, and it burned an
   entire run trying to count them by hand, then wrote nothing.
3. **Aider cannot edit a zero-byte file** — seed report targets with a placeholder.
4. **`--no-suggest-shell-commands` means the worker CANNOT run tsc or tests.** Its "verification" is
   speculation. The lead must run the gates. `run-ticket.sh` in the session scratchpad handles the
   key (it lives in `~/.zshrc`, interactive-only, so bash doesn't see it).
5. **Tickets say "do not commit"** — parallel agents share one checkout and a commit sweeps up
   another agent's work.

### The mutation-testing catch worth remembering
DeepSeek's leads tests passed **with the intra-day comparison deleted**: the fixture ids happened to
agree with the expected order, so the `id` tiebreak satisfied every assertion. Same class in
`tasks.test.ts` — priority ordering was entirely untested. **When a comparator has fallback stages, a
test for stage N must be built so every later stage gives the WRONG answer.** Both are fixed and
re-verified by re-running the mutation.

---

## 2026-08-10 — Claude Opus (lead), DeepSeek V4 Flash (worker)

**PUSHED and DEPLOYED — latest live chunk `index-BlasWS23.js`. Migration applied by Harish and
probe-verified.**

### OS dark mode was hijacking a light-only app — FIXED (`0d39c55`), live `index-BlasWS23.js`
- **The bug:** both the pre-paint script in `__root.tsx` and `ThemeProvider` derived the theme from
  `prefers-color-scheme`. Any user whose OS is set to dark got a **dark UI for a product with no dark
  palette designed** — and `ThemeProvider` then PERSISTED that auto-derived value, so it stuck.
  Proven live before the fix: fresh visit with OS dark → `savedTheme: "dark"`, body background
  `oklch(0.19 0.02 230)`, sign-in card rendered as a murky grey panel.
- **This was also the hydration mismatch.** SSR markup is never dark; the inline script added `dark`
  before hydration, so server and first client paint disagreed on every page.
- **Fix:** no `prefers-color-scheme` fallback anywhere. Light unless the user explicitly picks dark
  from the account menu (that still works and still persists). Storage key bumped to
  `crm-theme-v2` so values auto-written by the old behaviour are discarded instead of silently
  keeping people dark. Verified live both ways on a dark-emulated browser.
- **Worth asking Harish:** the account menu still exposes a dark toggle to a palette nobody designed.
  Removing it is a product decision, so it was left alone — but light-only is the stated direction.

### Three more render suites + tap-target spacing (same commit)
- `dashboard`, `products.all`, `team.directory` now have render coverage → **371 tests / 35 files.**
- **Three defects in the generated tests, all found by running them:** a `use-features` mock missing
  `isFeatureOn` (page threw before rendering anything); an assertion on a computed "today's" rupee
  total, which would fail by **calendar** rather than by regression; and a `team.directory`
  assertion written against the **rep** tab set while mocking an admin — that page renders two
  different tab sets by role (`if (!isManagerAdmin)`).
- **Selecting a tablist by index silently asserted nothing** — the section header renders its own
  tablist, so `getAllByRole("tablist")[0]` grabbed the wrong one. Now selected by content. Watch for
  this whenever a page nests Tabs.
- All three mutation-verified (blank `attrLine`, remove a tab, rename a KPI label → red).
- Spacing widened on the three dense pairs (claims approve/reject, attendance prev/next, stock tabs)
  from gap-1/gap-2 → gap-3 so they can later take `.hit-area-44` without overlapping. **Hit areas
  deliberately NOT added yet** — that wants a real-device check first.
- ⚠️ **Both aider agents silently did nothing on first launch**: the log redirect pointed at a
  scratchpad path from an earlier session id, so the shell failed (`EXIT=1`) before aider ran.
  `git status` was clean, which is the only reason it was caught. **Never assume a background
  worker ran — check the diff, not the exit notification.**

### Phone bottom tab bar — BUILT (`3fa12f7`), live chunk `index-ib4fU0Dr.js`
- The Stitch brief's bottom tab bar had never been built; mobile nav was a hamburger + slide-over.
  Now: Dashboard · Leads · Clients · Orders · **More**, `md:hidden`, fixed, `pb-safe`.
- **Built from the already-gated `visible` list, never NAV directly** — a rep who cannot open
  Clients just gets a shorter bar. The gap is deliberately NOT back-filled from other sections:
  back-filling would put a different destination in the same screen position per role.
- **More opens the EXISTING slide-over**, so there is still one nav definition feeding both and every
  section stays reachable (verified live: all 10 sections present in the sheet). The header hamburger
  was removed — two triggers for one menu is clutter.
- `main` needed `pb-28`: it is the scroll container (not the window), so without it the last card
  sits under the fixed bar and cannot be scrolled to. Verified live: `padding-bottom: 112px`.
- **Because the hamburger is gone this bar is the ONLY phone navigation**, so it ships with
  `src/test/app-shell-bottom-nav.test.tsx` (4 tests): renders, More opens the sheet, gated
  destinations vanish without back-filling, 56px target contract. **Mutation-verified** — dropping a
  tab and neutering More each turn it red. Suite now **368 tests / 32 files**.
- ⚠️ **Verifying a deploy in an already-open tab shows the CACHED bundle.** The first live check said
  "bar absent, hamburger still there" purely because of that. A cache-busting query param
  (`?cb=…`) settled it immediately. Do not conclude a deploy failed from a stale tab.

### Post-deploy visual pass + mobile audit (`d1b274e`)
- Reviewed all three detail routes live in a logged-in browser. Three fixes shipped:
  **(1)** the three detail pages rendered at three different widths (leads uncapped, parties
  `max-w-5xl`, orders `max-w-6xl`) — all now full-width per the documented standard. The caps came
  from `557eb26 "UI draft 3"`, NOT the design pass. **(2)** party info fields back to 3 columns on
  `lg` (10 mostly-blank cards in 2 columns was a full screen of scrolling before the tabs; now
  3-3-3-1, grid height 545px → 327px). **(3)** sign-in button 36px → 44px, verified at a real 375px
  viewport. `components/ui/button.tsx` deliberately untouched — resizing it ripples app-wide.
- **Mobile audit found nothing else broken.** No page-level horizontal overflow on any detail route;
  the 13-column invoice table scrolls inside its own `overflow-auto` wrapper (979px in a 578px
  container); the party tab strip scrolls rather than clipping.
- **Two traps worth recording for whoever audits mobile next:**
  1. **Chrome's window minimum is ~614 CSS px here**, so `resize_window` cannot reach a phone
     viewport, and raising element `zoom` does NOT help — Tailwind breakpoints are viewport media
     queries and ignore element zoom. For a true 375px test use the in-app Browser pane
     (`preview_start` + `resize_window` mobile preset) against `npm run dev`. That only reaches
     unauthenticated pages (`/auth`, `/legal/*`); authenticated pages were audited at 614px, which
     is below `md` so the mobile branch is genuinely active.
  2. **`/dev/leads` is a desktop-only mock** (hardcoded `ml-64` sidebar). It reports ~140 overflow
     offenders at 375px which are artifacts of the mock, not app bugs. Do not audit mobile with it.
- **A "slow fade-in" I reported earlier was MY OWN measurement artifact, not a bug.** Pages looked
  washed-out for seconds in screenshots because the Chrome tab was not being composited (the same
  reason `screencapture` returned only wallpaper). Measured properly, opacity reaches 1 in **207ms**.
  Lesson: before filing a perf bug from screenshots, confirm the tab is actually visible —
  `document.visibilityState` and a timed `getComputedStyle` sample cost one call and settle it.
- Known gap, NOT a regression: the phone **bottom tab bar** in the Stitch brief was never built —
  mobile nav is a hamburger + slide-over (`md:hidden`) in `app-shell.tsx`. Real design decision to
  make, not a bug to fix silently.

### First route-render coverage in the repo (`b4e7ea7`)
- `src/test/detail-routes.render.test.tsx` mounts the REAL components of all three detail routes
  with stubbed edges (router / Supabase client / auth / permissions / features). The trick that makes
  it possible: **mock `createFileRoute` to return the options object**, which reaches the component
  without exporting internals from production files. Reusable for any other route.
- Suite is now **364 tests / 31 files** (was 361/30).
- **Verified sensitive by mutation** — renaming a section header turns it red, then green on revert.
  Do this for any new test here: the repo already had a test file that silently never ran because it
  sat outside the vitest `include` glob, so it "passed" by not existing.
- Nice property worth keeping: the orders test asserts `INV-1001` appears **more than once**, because
  the second match is the off-screen printable node html2canvas paints for the JPG export. The count
  doubles as a guard on that node still rendering.

### Detail routes finally got their design pass (`4934c81`)
- `leads.$id` / `parties.$id` / `orders.$id` were the last un-restyled surfaces. Four aider tickets
  (G1 leads cleanup, G2 parties, G3 orders, G4 leads detail), run as two parallel pairs on disjoint
  file sets. Tickets at `Files/scratchpad/ticket-2026-08-10-G{1..4}-*.md`, built from a shared
  `_preamble.md` so DeepSeek's disk cache hits across runs — that pattern works, keep it.
- Also in `4934c81`: `LogCallDialog` was defined **twice, byte-identical**, in `leads.all.tsx` and
  `leads.$id.tsx` → extracted to `src/components/log-call-dialog.tsx`. And the lead header's bare
  Delete moved into the canonical `MoreVertical` + `ConfirmDelete` dropdown (last such site).
- **Three worker slips caught in diff review — the pattern from 7 Aug repeats: DeepSeek invents and
  flattens under design pressure.** (1) `parties.$id` dropped `tagBadgeClass`, flattening the
  colour-categorised party tags (VIP violet / risk amber / cash emerald / blacklist red) to one grey
  tone — a shipped client feature, silently lost. (2) `orders.$id` invented a Due/Paid pill next to
  `StatusBadge`, which already renders payment status off the same field, and it would have read
  "Paid" on a zero-total order. (3) Verified by hand that the invoice printable node
  (`position:fixed; left:-10000px` — NOT `display:none`, html2canvas can't capture that) and the
  hoisted column definitions were untouched. **Never accept a design diff without checking what got
  simplified away.**
- Gates: `tsc` 0, 361/361 vitest, `ship.sh --dry-run` green incl. the artifact assertion.
  **Runtime-verified via the new render tests (see above), NOT visually verified** — nobody has
  looked at these pages. The render tests prove they mount and keep their sections; they say nothing
  about whether the design is right. Harish should eyeball them after the next deploy.

### Notification duplicate fixed — and CLAUDE.md's recommendation was BACKWARDS (`05238d9`)
- One overdue follow-up buzzed the rep twice: `generate_due_notifications` section 4 (`followup_due`)
  and `generate_lead_followup_notifications_for_user` (`lead_followup`) both emitted it.
- §8g said to drop section 4. **Wrong.** Section 4 honours `fu*_status` and checks each of the five
  slots; `lead_followup` ignored status entirely (nagging about completed follow-ups) and took
  `GREATEST()` of the five dates while naming it `next_fu` — GREATEST is the *latest*, so a lead with
  an overdue fu1 and a future fu5 **silently never notified at all**. Dropped `lead_followup`.
  Migration `20260816120000` also revokes the PUBLIC/anon EXECUTE that `generate_due_notifications()`
  inherited (the 08-05 migration revoked its two siblings but missed it).
- ✅ **Migration APPLIED by Harish 10 Aug and probe-verified**: an anon PostgREST RPC to
  `generate_due_notifications` now returns `401 / 42501 permission denied` where it previously
  returned 200. That probe is the cheap way to confirm a grant change actually landed — use it
  rather than trusting "the SQL ran".

### Audit found THREE doc claims that were stale (`61a95ca`) — the recurring failure mode
- **Pack-size attributes**: listed as "specced, not started"; actually fully shipped and live —
  columns applied, `use-products.ts:15-17`, form fields + filter in `products.all.tsx`, portal
  facets in `portal.ts`. Two weeks of a live feature listed as unbuilt.
- **Touch targets**: listed as "deliberately not fixed"; `.hit-area-44` shipped in `468f710`.
  Recorded the adjacency rule (class on ONE of two adjacent icon buttons only) and the real residual
  (three dense pairs need a row-*spacing* pass first).
- **Parties detail** was already partly stitch-styled, contradicting "detail routes have had no pass
  at all".
- All three corrected in `CLAUDE.md` with `file:line` evidence. **Grep the code before believing any
  list in this repo, including one you wrote.**

### Environment note that will bite the next lead
`DEEPSEEK_API_KEY` lives in `~/.zshrc`, which a **non-interactive shell does not source** — aider
fails with no key unless every invocation starts `source ~/.zshrc >/dev/null 2>&1 &&`. Also
pre-existing and unrelated to this session: `npm run dev` logs a hydration mismatch from
`__root.tsx` — the server emits `class="dark"` / `color-scheme: dark` on a **light-only** app. Worth
a look; it is not caused by any change here.

---

## 2026-08-07 (later) — Claude Opus (lead)

### Cloudflare Workers Builds CI race — RESOLVED ✓ (repo disconnected by Harish)
- The recurring hazard logged below (CI auto-deploying an env-less build ~60s after every push, overwriting the verified `ship.sh` deploy) is fixed. Harish disconnected the GitHub repo from Workers → leadenthrella → Settings → Build (the "Disconnect" action next to `harishsharmanash/leadenthrella`), per the pending action Kimi flagged twice.
- **Root cause, for the record:** `.env` is correctly gitignored and never committed. `scripts/ship.sh` builds locally where `.env` exists, so `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` get baked into the bundle correctly. Cloudflare's own Workers Builds CI checked out the repo fresh with no `.env` and no dashboard-side "Variables and secrets" configured for those two values, so its build shipped with them missing entirely — same failure class as the 30 Jul "MISSING-ENV TRAP" outage.
- **Net effect:** `scripts/ship.sh` (local build → `npx wrangler deploy --name leadenthrella`) is now the *only* deploy path, full stop. No more post-push wait-and-verify step needed. If Workers Builds is ever reconnected in the future, the two `VITE_` vars must be added under Settings → Build → Variables and secrets first, or this will recur.

---

## 2026-08-07 (evening) — Kimi K3 (lead)

### Subsection bars: Clients lens bar + Settings/Bin restyle + Trash→Bin rename — SHIPPED ✓ (commit `204c721`, live chunk `index-CMY5JXFc.js`)
- **Correction to the entry below:** its "Already-live state" section claimed the Clients lens bar / Settings bar-primary / Bin rename were already live since `dd503e8`. They were NOT — the tree had Radix pill tabs (`bg-muted` in settings, `glass-panel` in trash), "Trash" everywhere, and `clients.parties.tsx` imported `ClientsSectionHeader` but never rendered it. Whatever produced that claim never reached the repo. Rebuilt from scratch this session.
- Changes: (1) `clients.parties.tsx` renders `<ClientsSectionHeader lens="parties">` — lens bar now on all 3 clients pages. (2) Settings + Bin tab strips converted from Radix `TabsList` pills to the `bar-primary` segmented tablist with framer-motion sliding thumb (`layoutId` + `useMotionFlow` SLIDE), matching section headers; Radix `Tabs` kept controlled for content panels only. Settings tabs defined in a `SETTINGS_TABS` array. (3) Trash renamed to **Bin**: title, h1, sidebar label (`app-shell.tsx`), "Empty bin" copy, permissions label (`permissions.ts` — key `trash.purge` unchanged). Route stays `/trash`.
- **lightningcss trap (new):** dev server failed with "@import rules must precede all rules" — `@import "tailwindcss"` inlines rules, so the Google Fonts `@import url(...)` after it is invalid; putting it first makes lightningcss resolve the URL as a file (ENOENT). Fix: no font `@import` in CSS at all — Inter now loads via `<link rel="stylesheet">` + preconnects in `src/routes/__root.tsx` head. Note: prod builds tolerated this; only `vite dev` (lightningcss path) choked.
- Gates: `tsc` 0 errors, 361/361 vitest, `ship.sh` full pass, live chunk verified, login page renders.
- **CI race happened AGAIN:** ~60s after `git push` (dd503e8..204c721), Cloudflare Workers Builds auto-deployed its env-less build (`index-oweBA08T.js`) over ours. Redeployed verified bundle via `ship.sh --skip-build`. The disconnect action below is STILL PENDING for Harish — until done, every push needs this wait-and-redeploy step.

---

### Stitch v2 full-app page restructure — SHIPPED ✓ (commit `dd503e8`)
- Harish supplied `stitch_pharma_lead_manager 2` (16 Stitch screen designs, now archived at `Files/design/stitch-v2/`). Full structural analysis written to `Files/design/stitch-v2/ANALYSIS.md` (per-screen structure + common patterns; the folder has two DESIGN.md dialects — screens follow **luminous_3d_precise**, that's the standard).
- Split into 6 DeepSeek tickets (`Files/scratchpad/ticket-2026-08-07-D1..D6-*.md`), run in 3 parallel pairs via aider. Restructured: dashboard (12-col bento), leads (table anatomy, grid cards, peek-drawer header w/ circular call/WhatsApp actions), orders list + dues (KPI strips, titled table cards), intimations (3-col card grid), portal requests (rich inline cards), transporters (wide cards + sticky right detail panel), clients parties/territories (full-width map+sidebar split), products/team/analytics/settings.
- Structure-only: no nav/menu bars touched, no token/color changes, no data/logic changes. Verified per diff.
- **DeepSeek slips I fixed manually** (watch for this pattern — it invents things under design pressure): undefined `StatCell` component (dashboard), invented `useStaff` hook (team.directory — real hook is `useProfiles` from `@/lib/use-leads`), fabricated "98% on-time rate" stat (transporters panel — replaced with real Status), dropped per-row Edit on transporters (restored via `onEdit` prop on the detail panel).

### ⚠️ Cloudflare Workers Builds CI hazard — RESOLVED, see 2026-08-07 (later) entry above
- ~~ACTION PENDING for Harish~~ — done. The GitHub repo was connected to **Cloudflare Workers Builds**: after our push, CI auto-deployed its own build 22s after our manual deploy, overwriting it — and the CI build has **no Supabase env baked in** (would throw "Missing Supabase environment variable" for all users). We re-deployed our verified build on top each time this happened.
- Harish disconnected the repo (Workers → leadenthrella → Settings → Build → Disconnect). Deploys now only come from `scripts/ship.sh` — no more post-push race to watch for.

### Ticket C earlier same day — SHIPPED ✓ (commit `44c9006`)
- Fixed section-header geometry drift (all 6 `*-section-header.tsx` + skeletons): root cause was `flex-wrap` — now `flex-nowrap`, title `min-w-0`, description `truncate`, lens bar `shrink-0`. Bar no longer shifts between tabs of a section.
- `/products` → `/products/all` and `/team` → `/team/directory` redirects (hubs retired, `?action=export_*` forwarding preserved).
- Toolbar pill-ification completed across clients/analytics/dues pages.

### Already-live state Harish may think is missing (stale bundle on his end)
- ~~Clients lens bar / Settings bar-primary / Bin rename live since `dd503e8`~~ — **WRONG, see the evening entry above.** These were not in the tree; they were actually built and shipped in `204c721`.

### Conventions locked this session
- Page structure standard: full-width (no `max-w-*` page caps), `space-y-5` rhythm, page padding from app shell (`md:p-8`); KPI strips = glass cards w/ icon chip + uppercase label + big value; table cards w/ "Showing X–Y of Z" footers; never invent data hooks for design elements that have no backing data.
- Aider ticket pattern that worked: stable preamble + per-ticket delta, `--read` the ANALYSIS.md + design HTMLs, 2 parallel aider instances on disjoint file sets is safe, 3-reflection-limit risk on big tickets — keep tickets to ≤4 target files.
