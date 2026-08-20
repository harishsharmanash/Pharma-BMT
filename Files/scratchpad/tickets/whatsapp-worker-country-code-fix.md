# Ticket: WhatsApp sends fail because contact_phone lacks the country code

## Goal

`whatsapp_conversations.contact_phone` is stored as a bare 10-digit Indian number (e.g.
`7027650821`) — deliberate, by `normalizePhone()` in `src/dedupe.ts`, so a WhatsApp-sourced lead
dedupes against an email-sourced lead on the same bare number. That's correct for dedup, but two
places in `src/bot.ts` pass `conversation.contact_phone` directly as the `to` field on an outbound
WhatsApp Cloud API send — Meta rejects it because it doesn't match the full `91XXXXXXXXXX`
WhatsApp ID the recipient was actually verified/known as, even when that exact number IS a valid
recipient. Confirmed live via `wrangler tail`:
```
(error) [whatsapp] send failed: 400 {"error":{"message":"(#131030) Recipient phone number not in allowed list", ...}}
```
This is why every bot reply and every rep-sent reply has failed to actually reach the customer,
even after correctly verifying the recipient's full number on Meta's side.

## Files

**Edit:** `src/bot.ts`

## Approach

`normalizePhone()` in `dedupe.ts` guarantees every `contact_phone` on a WhatsApp conversation is
exactly a bare 10-digit Indian mobile number (it strips a leading `91` or `0`, then takes the last
10 digits — every conversation in this pipeline is Indian-market only today, matching how the rest
of this CRM works). So reconstructing the full number for sending is safe: prepend `"91"`.

There are TWO send call sites in `bot.ts` that need this fix:

1. In `runBotTurn`, the bot's own reply send:
```ts
const waMessageId = await sendWhatsappText(env, accessToken, phoneNumberId, conversation.contact_phone, replyText);
```
Change to:
```ts
const waMessageId = await sendWhatsappText(env, accessToken, phoneNumberId, "91" + conversation.contact_phone, replyText);
```

2. In `tryHandoffToRep`, the rep-handoff template send:
```ts
const waMessageId = await sendWhatsappTemplate(env, accessToken, repNumber.phone_number_id, conversation.contact_phone, template.name, template.language, []);
```
Change to:
```ts
const waMessageId = await sendWhatsappTemplate(env, accessToken, repNumber.phone_number_id, "91" + conversation.contact_phone, template.name, template.language, []);
```

Do not change `contact_phone`'s stored format anywhere, do not touch `dedupe.ts`, and do not touch
`lead-intake.ts` — this ticket only fixes the two places `contact_phone` is used as a send target,
nothing about how it's stored or matched.

## Constraints

- Do not touch `send.ts`, `index.ts`, `lead-intake.ts`, `dedupe.ts`, `supabase.ts`, `gemini.ts`, or
  `classify.ts`.
- This Worker repo uses tabs for indentation — match it.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` (from `cerebyl-whatsapp-worker/`) → 0 errors.
- `git status` (from `cerebyl-whatsapp-worker/`) → only `src/bot.ts` modified.
- In your report, quote both changed lines so the `"91" +` prefix can be verified at a glance on
  both call sites.
