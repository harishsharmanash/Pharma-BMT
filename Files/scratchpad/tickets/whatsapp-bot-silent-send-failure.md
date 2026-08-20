# Ticket: Bot reply shows in-app even when the real WhatsApp send fails

## Goal

In `cerebyl-whatsapp-worker/src/bot.ts`, `runBotTurn` calls `sendWhatsappText(...)` and then
UNCONDITIONALLY inserts a `whatsapp_messages` row, regardless of whether the send actually
succeeded:

```ts
if (replyText) {
	const waMessageId = await sendWhatsappText(env, accessToken, phoneNumberId, conversation.contact_phone, replyText);
	await sbInsert(env, "whatsapp_messages", {
		conversation_id: conversation.id,
		direction: "out",
		body: replyText,
		wa_message_id: waMessageId,
	});
}
```

`sendWhatsappText` (in `send.ts`) returns `null` on failure (after logging a console error) — it
does not throw. So a failed send still inserts a message row with `wa_message_id: null`, which
renders in the app's Inbox UI as if the message was sent successfully. Confirmed live: a bot reply
appeared in the Cerebyl Inbox but never arrived on the real WhatsApp app of the phone that
messaged in.

## Files

**Edit:** `cerebyl-whatsapp-worker/src/bot.ts`

**Read only:** `cerebyl-whatsapp-worker/src/send.ts` (to confirm `sendWhatsappText`'s return
contract — `string | null`, `null` on any failure, already logs the failure via `console.error`
internally, no need to re-log)

## Approach

Change the block quoted above so the inserted row reflects reality: still insert a row (so the
failed attempt is visible in the thread rather than disappearing entirely — matches the UI's
existing "failed" tick state, which `whatsapp.tsx` already renders when `delivery_status ===
"failed"`), but set `delivery_status` based on whether the send actually returned a message id:

```ts
if (replyText) {
	const waMessageId = await sendWhatsappText(env, accessToken, phoneNumberId, conversation.contact_phone, replyText);
	await sbInsert(env, "whatsapp_messages", {
		conversation_id: conversation.id,
		direction: "out",
		body: replyText,
		wa_message_id: waMessageId,
		delivery_status: waMessageId ? "sent" : "failed",
	});
}
```

Do not change anything else in this function or file — the Gemini loop, tool handling, and handoff
logic are correct and out of scope.

## Constraints

- Do not touch `send.ts`, `index.ts`, `lead-intake.ts`, or any other file in this repo.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` (run from `cerebyl-whatsapp-worker/`) → 0 errors.
- `git status` (from `cerebyl-whatsapp-worker/`) → only `src/bot.ts` modified.
- In your report, quote the final `sbInsert` call so the `delivery_status` logic can be verified
  at a glance.
