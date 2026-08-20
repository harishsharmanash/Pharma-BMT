# WhatsApp — next tasks (handoff for Gemini 3.7 Flash / Antigravity)

**Written:** 15 Aug 2026 · Claude (lead) · point your coding agent at THIS FILE to start.

Read `../CLAUDE.md` first (project root) — brand rules, deploy rules, and the standing product rules
apply to everything below. Then read `Files/BOTBIZ-FEATURE-TEARDOWN.md` §7 for the Meta policy
constraints, which are not optional.

---

## ✅ Already done by Claude — do NOT redo

- **Coexistence / v25.0 bump.** `src/lib/whatsapp-embedded-signup.ts` now inits the FB SDK at
  `v25.0` and passes `extras: { featureType: "whatsapp_business_app_onboarding", setup: {} }`.
  `supabase/functions/whatsapp-embedded-signup-callback/index.ts` bumped to `v25.0` to match.
  Typecheck 0 errors, 563 tests green. **Not yet deployed.**
- `/legal/data-deletion` page + legal index entry (built, gated, not deployed).
- `scripts/seed-test-company.ts` parameterised via `SEED_COMPANY_NAME` / `SEED_EMAIL_DOMAIN` /
  `SEED_MANIFEST` (defaults unchanged, existing fixture safe).
- Migration `20260914150000` (`whatsapp_messages.media_url`) applied live.

---

## 🔴 TASK 1 — BLOCKER: the opt-out is fake. Fix before ANY broadcast ships.

**This is a Meta policy violation and it will get a client's WhatsApp Business Account banned.**

`cerebyl-whatsapp-worker/src/bot.ts:313-321` replies to STOP / UNSUBSCRIBE / CANCEL / ROKO /
OPT OUT with *"You have been unsubscribed from WhatsApp broadcasts"* — and then `return`s. **It
persists nothing.** There is no opt-out column anywhere in the schema (verified: grepped every
migration, the app, all edge functions, and the worker). And
`supabase/functions/whatsapp-send-broadcast/index.ts` never filters on one — it selects every
lead/party with a phone number.

Net effect today: a distributor replies STOP, is told they are unsubscribed, and receives the next
broadcast anyway. That is both a lie to the user and a ban risk.

**Build:**
1. A migration adding opt-out state. Prefer a dedicated table
   `whatsapp_opt_outs(company_id, contact_phone, opted_out_at, source)` with a unique index on
   `(company_id, contact_phone)` — phone-scoped, not lead-scoped, because the same person can exist
   as both a lead and a party, and an opt-out must apply to the human, not the row.
2. STOP handler writes the row (upsert). START handler deletes it. Both must persist BEFORE sending
   the confirmation message — never confirm an action you have not performed.
3. `whatsapp-send-broadcast` must exclude opted-out phone numbers, server-side. Not in the UI —
   the edge function is the enforcement point.
4. A test proving a STOP'd number is excluded from a broadcast. **Mutation-check it**: delete the
   filter and confirm the test fails. See `CLAUDE.md` §2 rule 7 — this repo has shipped tests that
   passed while the behaviour under test was deleted.

---

## 🟠 TASK 2 — the broadcast sender will time out and double-send

Same file, `whatsapp-send-broadcast/index.ts`:

- **Sequential loop, up to 500 recipients.** Each Graph call is `await`ed one at a time. At
  200–500ms per call that is 100–250s — past the edge function wall-clock limit. It dies partway.
- **Recipient rows are only inserted AFTER the loop** (line ~166). So a timeout leaves **no record
  of who was already messaged**, and a retry double-sends to everyone. That is the worst failure
  mode available: duplicate marketing messages are exactly what tanks a number's quality rating.
- **Fix:** batch (e.g. 20–50 at a time) with bounded concurrency, and write each recipient row **as
  it sends**, not at the end. Make the campaign resumable: on retry, skip recipients already
  recorded for that `campaign_id`.
- **Add pacing.** Bursting hundreds of messages degrades quality rating.

---

## 🟠 TASK 3 — templates with variables are broken

Same file. The send payload is `template: { name, language }` with **no `components`**. Any approved
template with body placeholders is rejected by Meta with error `132000` (parameter count mismatch).
Also `language: { code: tmpl.language || "en" }` — Meta template languages are usually `en_US`; a
bare `en` will not match.

Build variable support: store the template's placeholder list, let the campaign UI map each
placeholder to a field (party name, firm name, etc.), and send a proper `components` array.

---

## 🟡 TASK 4 — bump the remaining Graph API versions (SEPARATE change, own test pass)

`GRAPH_VERSION = "v21.0"` is still hardcoded in five places on the **message-sending** path:

- `cerebyl-whatsapp-worker/src/send.ts:17`
- `cerebyl-whatsapp-worker/src/media.ts:3`
- `supabase/functions/whatsapp-send-message/index.ts:11`
- `supabase/functions/whatsapp-manage-templates/index.ts:29`
- `supabase/functions/whatsapp-send-broadcast/index.ts:11`

**v21.0 expires 21 January 2027** (Meta's official versions table). Meta's versioned changelogs list
**no WhatsApp Business Platform changes at all between v23.0 and v26.0** — v25.0 and v26.0 mention
WhatsApp zero times — so this is expected to be low-risk. It was deliberately NOT bundled with the
coexistence change because this path serves a live client; do it on its own and re-test message
send, media send, template sync, delivery-status webhooks.

---

## 🟡 TASK 5 — small correctness item

`src/components/whatsapp/whatsapp-health-panel.tsx:233` displays *"Direct Meta Cloud API v21.0
connection"* to users. Make it read from a shared constant rather than a hardcoded string, so it
cannot drift from the actual version again.

---

## Rules that apply to all of the above

1. **Never claim an action you have not performed.** Task 1 exists because a reassuring message was
   written without the mechanism behind it.
2. **Server-side is the enforcement point.** UI gating is a convenience, never a control.
3. **Broadcast is template-only outside the 24-hour customer service window**, opt-in gated, and
   opt-out honoured. See `Files/BOTBIZ-FEATURE-TEARDOWN.md` §7.
4. **No medical claims, ever.** No "Enthrella" or "Acrowell" in user-facing UI.
5. **Migrations are applied by the lead**, not by the coding agent, and never via `supabase db push`.
6. **Mutation-test every new test** before believing it.
7. Verification gates: `npx tsc --noEmit` must be **0**, `npm run test` must stay green.
