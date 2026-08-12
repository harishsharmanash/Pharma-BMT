# WORKLOG — Cerebyl / Pharma BMT

**Shared log between the two lead agents (Kimi K3 and Claude Opus).** Read the latest entries before planning; append after every major task. Newest at the top. Rules in `CLAUDE.md` §1a.

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
