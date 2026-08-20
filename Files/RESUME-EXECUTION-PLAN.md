# RESUME — EXECUTION PLAN (step by step)

**Written:** 16 Aug 2026 · Claude Opus (lead)
**Companion to:** `Files/RESUME-PLAN-2026-08-16.md` (the *status audit* — what's built, what isn't).
**This file is the ORDER OF OPERATIONS** — every step, in sequence, with exact files, exact
commands, acceptance criteria, and who does it.

**Ground rules carried from `CLAUDE.md`:** lead plans/reviews/migrates/deploys; DeepSeek V4 Flash
via aider writes the code; every ticket says *do not commit*; the lead runs the gates because
`--no-suggest-shell-commands` means the worker cannot; mutation-test every new test; build and
deploy from the **main checkout only**.

Notation: **[L]** = lead does it · **[D]** = DeepSeek ticket · **[H]** = only Harish can do it.

---

# STAGE 0 — Pre-flight (do this before any ticket) · ~30 min · [L]

The tree is dirty from the WhatsApp work and one sibling repo has uncommitted code. Starting new
tickets on top of this is how a review gets muddled.

### 0.1 Clear the working tree [L]
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && git status --short
```
Expect modified `CLAUDE.md` and untracked `Files/*` (those live in the parent repo, not this one).
Commit the doc/worklog changes in the **parent** repo, leave `leadenthrella` clean. Nothing starts
until `git status --short` in `leadenthrella` is empty.

### 0.2 Confirm the baseline is real [L]
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && npx tsc --noEmit 2>&1 | tail -3 && npm run test 2>&1 | tail -5
```
Baseline is **0 tsc errors** and ~575 tests green. If either is off, fix that first — every later
acceptance check compares against this number, and a drifted baseline makes all of them meaningless.

### 0.3 Confirm the ticket preamble still exists [L]
```bash
ls leadenthrella/.claude/TICKET-PREAMBLE.md leadenthrella/.claude/skills/cerebyl-context/SKILL.md
```
Both get `--read` on every aider run below. If the preamble moved, fix the path once here rather
than in twelve tickets. **Keep every `--file`/`--read` path inside `leadenthrella/`** — a path from
`Files/` binds aider to the parent repo and wrecks its repo-map.

---

# STAGE 1 — The four loose ends · ~1 day · closes gaps that make SHIPPED features look broken

These come first deliberately. Each is hours, not days, and each one currently makes a feature we
already paid for either invisible or untrustworthy.

---

## L1 · Credit tiers are inert — nothing ever computes a score

**The problem, verified:** `recompute_party_credit_score(uuid)` exists (migrations
`20260812161000`, `20260812171000`) and is granted to `service_role`, but a grep across `src/` and
`supabase/` finds **no caller** — no cron, no trigger, no edge function. `use-credit-tiers.ts:57`
reads `party_credit_scores`, which no process ever writes. Every party shows "No tier" permanently.
F8 and F11 are live and invisible.

**Design call [L] — recompute nightly by cron, not by trigger.** A trigger on `payments`/`orders`
would recompute on every write, and the score depends on rolling windows (payment timeliness
weighted recent, value trend) that change with the *calendar*, not only with writes — a party who
stops paying would never be re-scored, because no write occurs. Nightly is also the cheapest correct
option and matches the pattern already proven in `generate_notifications_all()`.

### Step L1.1 [D] — write the migration
- Ticket: `Files/tickets/L1-credit-recompute-cron.md`
- File to create: `leadenthrella/supabase/migrations/20260916120000_recompute_credit_scores_all.sql`
- Read: `supabase/migrations/20260805180000_notification_generators_for_cron.sql` (the pattern —
  especially its header comment on why a second copy of a generator is a bug waiting for a cron job),
  `supabase/migrations/20260812171000_recompute_credit_score.sql`.
- Content: `recompute_party_credit_scores_all()` — SECURITY DEFINER, `SET search_path = public`,
  loops over parties of **active companies only** and calls the existing
  `recompute_party_credit_score(p_party_id)`. **It must call that function, never re-implement the
  formula** — two copies of a scoring formula is exactly the drift the notification-generator comment
  warns about, and this project has already been bitten twice.
- `REVOKE ALL … FROM PUBLIC; GRANT EXECUTE … TO service_role;`
- Keep it **small** — aider's edit format degrades on long SQL (§2 harness rule 6).

### Step L1.2 [L] — review, then hand Harish one tap-to-copy block
Read the SQL yourself. Check: loop bounded, no cross-company leak, grants correct, function name not
colliding with the existing one.

### Step L1.3 [H] — apply in the Supabase SQL Editor
One block, pasted, Run. Then schedule it:
```sql
SELECT cron.schedule(
  'nightly-credit-score-recompute',
  '0 20 * * *',                      -- 20:00 UTC = 01:30 IST, off-peak
  $$SELECT public.recompute_party_credit_scores_all();$$
);
```

### Step L1.4 [L] — fire it once manually and READ THE RESULT
```sql
SELECT public.recompute_party_credit_scores_all();
SELECT count(*), count(tier_id) FROM public.party_credit_scores;
```
**A 200/no-error is not proof.** The acceptance test is rows in `party_credit_scores` with a
non-null tier, and a real party page showing a tier in the UI. (Memory: *"Fire the job, read the
body"* — four bugs have hidden behind a green outer signal on this project.)

**Done when:** a real party page on `app.cerebyl.com` shows a credit tier.

---

## L2 · F23 is committed but undeployed, blocked by a dirty `index.ts`

**Status, verified this session:** `acrowell-ai-worker` has `src/index.ts` modified (+45/−16) and a
one-line `.gitignore` change. I read the full diff — **it is not half-finished work.** It is a
coherent, correct bug fix: the billing claim for `/chat` was made *before* the body was parsed, so
every image sent through chat was recorded as a plain text message (AI Usage showed "Image reads 0"
for a chat that clearly read one). The fix moves `/chat`'s claim after parsing and derives the kind
from the attachments, while `/extract` and `/analyze` still claim by route. It also now claims
*after* validation, so an empty/malformed message is no longer charged.

### Step L2.1 [L] — commit it as its own change
This is the lead's call, not DeepSeek's — it is billing logic in the AI worker.
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/acrowell-ai-worker" && git add src/index.ts .gitignore && git commit -m "Bill /chat by actual attachment kind, and only after validation"
```

### Step L2.2 [L] — run the worker's tests, then deploy
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/acrowell-ai-worker" && npx vitest run 2>&1 | tail -5
```
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/acrowell-ai-worker" && npx wrangler deploy
```
This deploys **both** the billing fix and the F23 seam (`09de62b`), which is what has been waiting.

### Step L2.3 [L] — verify live, not by exit code
Send one chat message with an image from the app, then check `/console` AI Usage shows it as an
**image read**, not a message. That single check proves the deploy and the fix together.

> ⚠️ **No prompt files changed here, so no cache purge is needed.** If a later ticket edits
> `prompt.ts`/`prompt-tier2.ts`, the KV cache key is fixed and the OLD prompt keeps serving for up to
> an hour — purge `gemini:cache:name` / `gemini:cache2:name` or the change looks like a no-op.

**Done when:** an image chat bills as an image read on the live console.

---

## L3 · The v3-fcm APK crash was never re-confirmed · [H] then [L]

Two hardening fixes shipped 12 Aug (`d2a1fbc` deep-link listener try/catch, `9cc3815` Sentry wiring +
anon insert into `platform_error_log`) and **nobody reopened the app.** The shell loads a remote URL,
so both fixes are already live — **no APK rebuild is needed.**

### Step L3.1 [H] — reopen `mobile-test-builds/cerebyl-shell-v3-fcm.apk` on the phone
Already installed. Just open it and report: does it reach the login screen?

### Step L3.2 [L] — read the sink, don't guess
- **If it loads:** the deep-link hardening was the cause. Note it in `WORKLOG.md` and close.
- **If it still crashes:** `/console/errors` and Sentry now actually capture pre-login crashes (they
  both silently didn't before `9cc3815`). **Read the real stack before touching any code.** If both
  are empty, `adb logcat` over USB while it fails is the next step — that gives the WebView
  `net::ERR_*` instead of another guess.

**Done when:** either the app boots, or we have a real stack trace. "Probably fixed" is not done.

---

## L4 · F19's stock-out lead time is hardcoded to 21 days

`src/lib/stock-out-forecast.ts` uses the spec's own example value for every product. A syrup and an
imported injectable do not share a lead time, so the warnings are directionally right and
numerically wrong.

### Step L4.1 [D] — schema + form + wiring, one ticket
- Ticket: `Files/tickets/L4-product-lead-time.md`
- Migration: add `products.lead_time_days integer` (nullable, `CHECK (lead_time_days > 0)`).
  Nullable on purpose — null means "use the 21-day default", so nothing breaks for unfilled products.
- Files: `supabase/migrations/20260916130000_product_lead_time.sql`,
  `src/lib/stock-out-forecast.ts`, `src/lib/use-products.ts`, `src/routes/products.all.tsx`.
- Read: `src/routes/products.all.tsx:1680-1698` (the pack-attributes fields — copy that form idiom
  exactly).
- The forecast reads `product.lead_time_days ?? 21`. Keep the 21 as one named exported constant, not
  a magic number in two places.
- Tests: extend the existing forecast tests — one product with an explicit lead time, one without.
  **Mutation-check:** remove the `?? 21` fallback and confirm a test goes red.

### Step L4.2 [L] — review diff, apply migration [H], regenerate types
After the migration is applied:
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && npx supabase gen types typescript --project-id cjowrlrjyhdltbyqwozr --schema public > src/integrations/supabase/types.ts
```
**Regenerate rather than hand-editing types** — type drift after a migration is what created a
137-error backlog for months.

---

## STAGE 1 GATE [L]
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && ./scripts/ship.sh --dry-run
```
then the full `./scripts/ship.sh`, then **open `app.cerebyl.com` in the Browser pane** and read
console + network on `/products` and a party page. A green build proves nothing. Then the §2b push
checklist, then a `WORKLOG.md` entry.

---

# STAGE 2 — W1 · Finish F16 voice-notes · ~2 days

The UI shipped 12 Aug (`d72b0f1`). It calls an endpoint that does not exist. **Two concrete defects
found in recon this session** — both must be in the ticket, because neither is obvious from the spec:

1. **`src/lib/voice-note.ts:19` sends no `Authorization` header.** The worker rejects any request
   without a Bearer token at `index.ts:275` (401). The call would fail even if the route existed.
2. **`acrowell-ai-worker/src/index.ts:269` hard-codes the route allow-list** to
   `/chat | /extract | /analyze` and 404s everything else. `/voice-note` must be added there, or the
   handler is unreachable no matter how correct it is.

### Step W1.1 [D] — the worker endpoint
- Ticket: `Files/tickets/W1-1-voice-note-endpoint.md`
- Repo: **`acrowell-ai-worker`** (separate repo — its own aider run, cwd is that folder).
- Files: create `src/voice-note.ts`; edit `src/index.ts` (route allow-list + dispatch + usage claim).
- Read: `src/extract.ts` — it is the closest existing shape (multipart in, structured JSON out) and
  the ticket should say *copy its structure*.
- Contract is already fixed by the frontend — **do not invent a new one.** `src/lib/voice-note.ts`
  defines it: multipart field `audio`, response
  `{ note, outcome, follow_up_date (YYYY-MM-DD), product_interests[], territory_mentions[], objections[] }`.
- Billing: claim as its own kind at the route level, **before** any Gemini call, following the
  `/extract` branch pattern (audio costs more than a text message).
- **Audio is discarded after transcription** — never written to storage. Spec requirement, and it is
  what keeps this feature out of the consent problem that killed call recording.

### Step W1.2 [L] — the prompt. NOT delegated.
The extraction prompt is a `prompt*.ts`-class change and belongs to the lead (`CLAUDE.md` §2). It
must handle code-switched Hindi/Punjabi/English, and must return **null rather than a guess** for
`follow_up_date` — a wrong auto-created task is worse than no task.

### Step W1.3 [D] — fix the frontend auth
- Ticket: `Files/tickets/W1-3-voice-note-auth.md`
- File: `src/lib/voice-note.ts` — take the session token as a parameter and send
  `Authorization: Bearer ${token}`, matching `use-assistant.ts:1319`. Update the one call site in
  `src/components/voice-note-recorder.tsx`.

### Step W1.4 [L] — gate it behind a default-off feature key
Add `voice_notes` to `DEFAULT_OFF_FEATURE_KEYS` in `src/lib/features.ts`. `features.ts` is a
**shared, unowned file** (§1 of the build plan) — the lead edits it, serialised, never a lane ticket.
This is what lets W1 ship to main without shipping to reps before the language test.

### Step W1.5 [H] — the real test, with real reps
Deploy the worker, enable the key for one company, and have **actual reps** record 15–40s notes in
naturally code-switched Hindi/Punjabi/English. The spec is explicit that a clean-English demo proves
nothing — transcription quality on code-switched speech is the entire risk of this feature.

**Ship decision [L]:** if extraction is unreliable, ship the *transcript* only and drop the
structured fields rather than auto-filling lead records with wrong dates. Degrading the feature is
correct; auto-creating a wrong follow-up task is not.

---

# STAGE 3 — W2 · F12 photo-to-product · ~2 weeks · GATED

The flagship. 3C's `molecules` + `product_compositions` schema shipped 12 Aug, so the dependency is
clear. **But the migration's own header says it deliberately did not backfill** — "backfilling free
text into normalized rows is an AI/data task for the F12 ticket". That backfill is the whole risk.

## Step W2.0 — RESULT (16 Aug 2026): GO, with an amendment

454 products, 99.6% have a composition string, 77.9% contain a recognizable `number+unit` pattern.
Real data splits into three populations, not one:
- **Clean single/dual-molecule pharma** (`Cefixime 200mg`) — parses perfectly with a deterministic
  parser.
- **Complex multi-ingredient nutraceutical/herbal combos** (10+ ingredients, inconsistent `+`
  spacing, `&`, embedded typos, packaging notes baked into the string) — a naive regex splitter
  mangles these.
- **Zero-composition OTC/cosmetic products** (`Noni Juice`, `Aloe Vera Gel`) — correctly
  composition-less; never going to match by molecule against a competitor photo either. Exclude
  from the index, match by name/category instead — not a defect.

**Amendment to W2.1 below: the backfill parser must be AI-assisted for the messy tail, not a pure
regex function.** A hybrid — regex for the clean majority, Gemini extraction for anything the regex
can't confidently split — is both more robust and exercises the same messy-text-extraction the
live OCR path needs anyway.

## Step W2.0 [D] — THE GO/NO-GO AUDIT. Nothing else starts until this reports.
- Ticket: `Files/tickets/W2-0-composition-audit.md` — **investigation only, changes no code.**
- Question: how clean is `products.composition` across real catalogues? Report: total products, how
  many have a non-empty composition, how many parse cleanly into `molecule + strength + unit`, the
  distinct strength formats found (`200mg` / `200 MG` / `0.2g` / `200mg+200mg`), the separator
  characters in use, and **20 verbatim examples spanning the messiest cases**.
- Ask for **verbatim quotes, never `path:line`** — DeepSeek cannot see line numbers and will burn an
  entire run trying to count them (§2 harness rule 2).

**[L] reads the report and rules:**
- **Clean enough (>70% parses):** proceed to W2.1.
- **Messy:** F12 is a data-cleaning project wearing an AI hat. Say so to Harish plainly and re-scope
  — either an AI-assisted normalisation pass with human review becomes its own priced workstream
  first, or F12 waits. **Do not build the flagship on top of unparseable data and discover it at demo
  time.**

## Step W2.1 — DONE (16 Aug 2026), NOT YET RUN against the live DB

Built as a hybrid per the W2.0 amendment: `src/lib/composition-parse.ts` (pure, deterministic,
mutation-tested, canonicalisation matches the `molecules.canonical_name` comment) for the clean
majority, `scripts/backfill-compositions.ts` (dry-run by default, `--apply` to write) adding a
batched Gemini extraction pass for whatever the deterministic parser refuses. tsc 0, 596/596 tests.

**Execution blocked on credentials this session didn't have**: `SUPABASE_SERVICE_ROLE_KEY` and
`GEMINI_API_KEY`. [H] runs it — `node scripts/backfill-compositions.ts` for a dry-run first (review
the sample output + manual-review list), then `--apply`.

## Step W2.2 — DONE and DEPLOYED (16 Aug 2026)

`acrowell-ai-worker`'s `/scan-product` endpoint (`d4a9086`, live — verified with a raw unauthenticated
POST returning the expected 401, not just trusting the deploy exit code). One Gemini vision call does
OCR and structured extraction together (molecules + strength + a self-reported `confidence` + the raw
text it saw), rather than a separate free-text step re-parsed by `composition-parse.ts`. Never hard-
fails on a partial/blurry read — returns what it extracted with `confidence: "low"` instead, per spec.
Caches by exact SHA-256 of the image bytes in the existing `USAGE` KV (30-day TTL), only when the
result was high-confidence and non-empty, so one bad read can't poison the cache for a month. Worker
tsc 0, 26/26 tests (mutation-tested the confidence-validation guard).

**Deliberately does NOT query app tables itself** — matches this worker's existing separation of
concerns (RLS-scoped reads happen client-side with the user's own session, never via the worker). The
DB matching (exact product / composition-family list / no match) is W2.3, not built yet.

## Step W2.3 — DONE and DEPLOYED (16 Aug 2026)

Built with DeepSeek/aider on a detailed ticket (frontend UI), lead-written for the DB matching
(`portal-data`'s new `scan_match` action — correctness- and tenant-isolation-critical, kept
undelegated per CLAUDE.md §2). Reviewed and fixed by hand before commit — see below.

- **`scan_match` (lead-written, deployed, live-verified with a raw unauthenticated POST returning
  401)**: canonicalizes scanned molecule names, looks them up against `molecules`, finds candidate
  products in the CALLER'S OWN COMPANY ONLY sharing at least one molecule, then classifies each by
  comparing its FULL molecule set against the scanned set — exact match (identical set) vs. family
  match (shares an ingredient, not identical). A product that's genuinely the exact match but where
  OCR missed one molecule falls into "family match" rather than a false auto-navigate — the
  conservative side to be wrong on.
- **Frontend** (`src/lib/scan-product.ts`, `src/lib/use-portal.ts`'s `useScanMatch`,
  `src/components/portal/product-scanner.tsx`): capture → review → match dialog, feature-gated
  camera button on the portal catalogue header. W2.4's exact required phrase — "Products in our
  catalogue with this composition" — is verbatim in the UI; audited the whole component for
  substitution/equivalence language, found none.
- **Caught and fixed after the aider run**: four `unknown`-vs-`string` type errors on `.id` fields
  (the existing catalogue code already casts `p.id as string` at its own navigate call — the new
  code needed the same cast in four places it was missing; DeepSeek's diff otherwise correctly
  matched every established convention in the file, including reusing the existing `invokePortal`
  helper rather than reinventing one).
- **New `product_scan` feature key, DEFAULT_OFF** — same reasoning as `voice_notes`: still being
  validated against real data quality, ships gated.
- Deployed via `ship.sh` (hit and fixed an unrelated stale-Nitro-build-cache issue from switching
  between the main and mobile build configs earlier in W3.1 — cleared `node_modules/.nitro`).
  Verified live: staff app loads with zero new console errors on `/clients` and `/products/all`.
- **NOT live-tested end-to-end with real matching** — the W2.1 backfill hasn't run yet (needs
  Harish's credentials), so there's no `product_compositions` data in the live DB for `scan_match`
  to actually match against regardless of portal-account access. That real test is meaningful only
  after the backfill runs.
- tsc 0, 596/596 tests (no new tests — UI wiring over already-tested server logic).

## Step W2.4 [L] — the regulatory boundary, enforced in two places
The model prompt (lead's) and the UI copy (worker's, lead-reviewed). Output is framed as a catalogue
navigation result — *"products in our catalogue with this composition"* — **never** as therapeutic
recommendation, interchangeability, or substitution. "Business tool only" footer on every screen.
This is non-negotiable in the spec and it is a lead review item on every W2 diff.

---

# STAGE 4 — W3 · F1 offline-first · ~2–3 weeks · the one most likely to slip

Architecture decided (Option A: bundled assets + OTA from R2). `mobile/scripts/bundle-web.sh` exists
and `409366c` wired it into `build-branded-apk.sh`. `capacitor.config.ts` already drops `server.url`
when `CEREBYL_BUNDLED=1`. **Nothing above that layer exists.**

## Step W3.1 — RESULT (16 Aug 2026): found and fixed a real blocker, no phone needed yet

Ran `CEREBYL_BUNDLED=1 bundle-web.sh` and inspected the output: **432 files, zero HTML files.**
Root cause: `npm run build` (the one `ship.sh` uses) targets Cloudflare Workers in SSR mode —
`.output/server` holds a real Nitro server; `.output/public` is only static assets referenced by
server-rendered pages. A Capacitor WebView loading local files has no server to render against, so
the existing bundling script was silently producing a dead asset set — this would have failed on
the phone regardless, and looked like a mysterious native-shell crash rather than a build problem.

**Fixed, not just diagnosed.** This app has ZERO route loaders (grepped `src/routes/*.tsx` —
confirmed) and fetches everything client-side via supabase-js + TanStack Query, so nothing is
actually lost by not having SSR at runtime. Built:
- `vite.mobile.config.ts` — a SEPARATE build config (node-server preset instead of
  cloudflare-module), wired as `npm run build:mobile`. Does not touch `vite.config.ts` or the
  `build` script `ship.sh` uses — confirmed with a full rebuild afterward that the live-deploy path
  is byte-for-byte unaffected.
- `mobile/scripts/capture-mobile-shell.mjs` — TanStack Start's own built-in `spa.prerender` crawler
  turned out to be broken against this Nitro version (`getServerOutputDirectory` assumes a plain
  `dist/server/server.js` layout that doesn't exist under the Nitro preset — a real bug in this
  package-version combo, not a config mistake). Worked around it by starting the real
  `.output/server/index.mjs` locally, fetching `/` once, saving the response verbatim as a static
  `index.html`, and stopping the server. The SSR HTML for `/` is identical regardless of which URL
  the WebView actually opens at, since there are no server loaders — it's just the branded loading
  shell + hydration script tags; TanStack Router takes over client-side via the History API.
- `bundle-web.sh` updated to call `build:mobile` + the capture script, and now hard-fails if
  `index.html` is missing from the output rather than silently bundling a dead asset set again.

**Verified end-to-end, not just "files exist."** Served the resulting `mobile/www` with a plain
Python static file server (zero server-side logic, closest local proxy to what a WebView does) and
loaded it in the Browser pane: booted the static shell → hydrated → client-side routed to
`/auth/sign-in` → signed in against the real Supabase backend as
`admin@enthrellabiotech.test` → landed on a real Dashboard with live company data
("Good afternoon, Enthrella"). Zero console errors at every step.

**What this does NOT prove yet:** that Capacitor's actual WebView (vs. a plain HTTP static server)
behaves identically, and that a real signed APK with `CEREBYL_BUNDLED=1` boots on the physical
device — that still needs `build-branded-apk.sh` (which requires the release keystore, never
touched without explicit sign-off) and Harish's phone. But the load-bearing architectural risk — an
SSR-only pipeline silently producing an unbootable bundle — is now resolved and reproducible.

---

*(Original step text below, superseded by the result above — kept for the untouched checklist items:
the boot fail-safe design and the OTA plumbing are still exactly as originally planned.)*

## Step W3.1 [L]+[H] — PROVE THE BUNDLED APK BOOTS. Before any sync code.
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && CEREBYL_BUNDLED=1 ./scripts/build-branded-apk.sh
```
Install on the real device. Does it boot from local assets and reach login? **If this fails,
everything downstream is worthless** — so it is step one, and it costs an afternoon rather than three
weeks of misplaced work.

⚠️ Two traps here, both already documented and both cheap to walk into again: build from the **main
checkout** (a worktree has no `.env` → the MISSING-ENV outage reproduces exactly), and the bundled
build inlines the `VITE_` vars at build time, so `ship.sh`'s artifact assertion logic applies here too.

## Step W3.2 — PARTIALLY DONE (16 Aug 2026): plugin adopted, backend built, publish pipeline pending

**Verified, not guessed, before adopting**: WebFetch/WebSearch confirmed both things the B0.9 report
flagged UNVERIFIED are real — `@capgo/capacitor-updater` genuinely supports self-hosting, and its
boot fail-safe is real (auto-reverts to the last known-good bundle if `notifyAppReady()` is never
called within a configured timeout). Adopted over hand-rolling on that basis. MPL-2.0, `@lts-v7` for
Capacitor 7, installed in `mobile/` only.

**Built (`26e23ac`)**: `mobile/capacitor.config.ts` wired (bundled-branch only, verified both branches
resolve correctly); `notifyOtaAppReady()` + `OtaReadySignal` (DeepSeek-built, mirrors
`NotificationDeepLinkHandler`, confirmed a real no-op on web); `mobile-ota-check` edge function
(lead-written — the one endpoint with no user JWT by design, since an OTA check must survive an
auth bug in the current bundle); `company_apps` gets `ota_bundle_key`/`ota_bundle_version`/
`ota_checksum`/`ota_built_at`, a counter deliberately separate from the native `version_code`.

**Deployed: web-app pieces only.** `mobile-ota-check` needs the migration applied first (500s
without those columns) — sequenced, not yet done.

**W3.2 CLOSED (16 Aug 2026, `679c7b7`) — publish pipeline built.** `scripts/publish-ota-bundle.ts`
zips `mobile/www`, checksums it, uploads to R2, updates `company_apps`. One shared bundle for every
company (verified, not assumed — branding is 100% native-side, the web bundle takes no per-company
input). Dry-run verified end-to-end against a real build and the real Supabase project (fails only on
the deliberately-fake key). **The one thing not proven live: an actual `--apply` run** — needs R2 +
service-role credentials this session never had. Whoever runs it next should do a dry-run first
regardless of urgency, read the output, then `--apply`.

## Step W3.3 [D] — local store + write queue
Client-generated IDs so a retry cannot double-submit an order; idempotent server handling to match.
Queue drains in order on reconnect.

## Step W3.4 [D] — sync-state indicator
Persistent header: "All synced" / "2 pending". A user unsure whether their work saved will either
re-enter it (duplicates) or assume it saved (gaps).

## Step W3.5 [L] — the never-cached list, enforced in code
**Dues, live stock, and anything touching a ledger are never served from cache as authoritative.**
Stock may render from cache *only* with a visible "last updated" timestamp. If a price changed while
offline, the order is **flagged for explicit confirmation, never silently repriced.** These are the
rules that decide whether offline mode is trustworthy or a liability.

**Honest fallback [L]:** if W3.2 goes badly, ship F1 as offline-*tolerant* (read-only cache, no write
queue) and say so plainly, rather than shipping a half-working queue that loses orders.

---

# STAGE 5 — W4 · F24 corpus scoring · one evening · [H]+[L]

**Not a coding task, and not a fresh start.** `acrowell-ai-worker/test/corpus/README.md` documents
three prior runs (437 / 309 / 550-of-588 rows) converging on 92–95% intent accuracy with real bugs
found and fixed. What is missing is **one clean 588-row run under the final code, with the summary
actually read.** The 25 Jul run reached the last row and the summary scrolled away unread — that is
not a score.

- [H] supplies a login or fresh demo credentials; the run consumes live production quota.
- [L] runs `test/corpus/run-with-login.mjs` (it now tees output to `results-<timestamp>.txt`, so this
  cannot recur) and **reads the file.**
- Known structural limits to state alongside any number: 20 Vision/PDF rows are excluded, the harness
  sends no conversation history (so Corrections/Contradictions cannot pass by construction) and
  `role: "admin"` as plain prompt text (so role-gating is never exercised). **Report the score with
  those caveats attached** — a bare percentage from this harness overstates what was tested.

---

# The order, in one view

```
STAGE 0  Pre-flight ....................... 30 min   [L]
STAGE 1  L1 credit cron .................... ~4 h    [D][L][H]   ← invisible feature, cheapest fix
         L2 deploy F23 + billing fix ....... ~1 h    [L]
         L3 APK recheck .................... ~30 min [H][L]      ← needs the phone
         L4 per-product lead time .......... ~3 h    [D][L][H]
         └─ GATE: ship.sh + live browser check + push + WORKLOG
STAGE 2  W1 F16 voice-notes ............... ~2 days  [D][L] → [H] rep test
STAGE 3  W2.0 composition audit ........... ~4 h     [D] → [L] GO/NO-GO
         W2.1–2.4 F12 .................... ~2 weeks  [D][L]
STAGE 4  W3.1 bundled-boot proof .......... ~4 h     [L][H]  → GO/NO-GO
         W3.2–3.5 F1 ..................... ~2–3 wks  [D][L]
STAGE 5  W4 corpus scoring ................ 1 evening [H][L]  ← can run any time
```

**Two hard gates worth naming:** W2.0 (composition data quality) and W3.1 (bundled APK boots). Both
are cheap, both come before their expensive workstream, and both are permitted to return "no". A plan
that cannot say no at those two points is not a plan.

**Lanes:** W2 and W3 both need the worker/mobile lane, so their C-lane pieces serialise. W1 and W2
touch disjoint surfaces and can overlap once W1's endpoint is deployed.

---

# Standing rules for every ticket in this plan

**Ticket shape** (five sections, always): Goal · Files (exact, all inside `leadenthrella/` or the
worker repo) · Approach (numbered, naming the existing pattern to copy) · Constraints (the §5 rules
relevant to *this* ticket) · Acceptance.

**Invocation:**
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && aider --yes-always --no-auto-commits --no-suggest-shell-commands --read .claude/skills/cerebyl-context/SKILL.md --read .claude/TICKET-PREAMBLE.md --file <edit> --read <reference> --message-file <ticket>
```

**Every ticket says:** "do not commit" · "do not claim to have run tsc or the tests — you cannot".

**After every aider run [L]:** `git status` the **entire** tree, not just the `--file` list — that
list is not a boundary DeepSeek respects, and this is the check that caught the concurrent-session
files on 12 Aug.

**Review the diff hunting for DELETIONS.** This worker has a proven habit of removing shipped
features while restyling.

**Mutation-test every new test** before it counts as green: break the code, watch the test go red,
restore. This repo has shipped a suite that passed while the behaviour under test was deleted.

**Per-batch gate:** `ship.sh --dry-run` → `ship.sh` → **load the live URL in the Browser pane and
read console + network** → §2b push checklist → `WORKLOG.md` entry. Never verify a deploy by
comparing local `.output` filenames to live, and never trust a `curl` 404 on an individual chunk.

**Concurrency warning:** this Drive folder can host two live Claude sessions at once. Before deleting
anything unexplained mid-session, check `git log` for very recent commits — and ask.

---

# What only Harish supplies (collected, so none of it blocks silently)

| # | Needed for | What |
|---|---|---|
| 1 | L1, L4, W2.1 | Applying each migration in the SQL Editor — one tap-to-copy block each |
| 2 | L3, W3.1 | The physical phone |
| 3 | W1.5 | Real reps, code-switched Hindi/Punjabi/English |
| 4 | W4 | A login or fresh demo credentials |
| 5 | W2.4 | Indian counsel before F12 ships production copy |
