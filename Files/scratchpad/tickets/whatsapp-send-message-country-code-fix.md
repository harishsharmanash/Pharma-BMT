# Ticket: Fix same country-code bug in the manual reply-box edge function

## Goal

Same root cause as the Worker fix: `whatsapp_conversations.contact_phone` is stored as a bare
10-digit Indian number (deliberate, for lead dedup — see `cerebyl-whatsapp-worker/src/dedupe.ts`
if curious, not part of this repo). `supabase/functions/whatsapp-send-message/index.ts` passes
`conversation.contact_phone` directly as the outbound `to` field, which Meta rejects because it
doesn't match the full WhatsApp ID. Confirmed live via wrangler tail on the sibling Worker with the
exact same bug: `(#131030) Recipient phone number not in allowed list`.

## Files

**Edit:** `supabase/functions/whatsapp-send-message/index.ts`

## Approach

Find this line (the Meta Graph API call body):
```ts
to: conversation.contact_phone,
```
Change to:
```ts
to: "91" + conversation.contact_phone,
```
Every conversation in this pipeline is an Indian number (10 bare digits after normalization) —
this is the same fix already applied to `cerebyl-whatsapp-worker/src/bot.ts` for consistency.
Do not change anything else in this file.

## Constraints

Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors (should be unaffected, this file isn't part of the app's
  typecheck target, but run it anyway to confirm nothing else broke).
- `git status` → only `supabase/functions/whatsapp-send-message/index.ts` modified.
