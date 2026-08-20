# Ticket: Don't mark a conversation handed-off when the reply never actually sent

## Goal

In `src/bot.ts`'s `runBotTurn`, the conversation status is written unconditionally after the send
block:

```ts
	if (replyText) {
		const waMessageId = await sendWhatsappText(env, accessToken, phoneNumberId, "91" + conversation.contact_phone, replyText);
		await sbInsert(env, "whatsapp_messages", { ... delivery_status: waMessageId ? "sent" : "failed" });
	}

	let newNumberId: string | undefined;
	if (handedOff) {
		newNumberId = await tryHandoffToRep(env, conversation, accessToken);
	}

	const patch: Record<string, unknown> = { last_message_at: new Date().toISOString() };
	if (handedOff) patch.status = "handed_off";
```

`sendWhatsappText` returns `null` on failure without throwing. So when a send fails (confirmed live:
a `190 Authentication Error` from an expired token), the conversation is STILL marked
`handed_off` — even though the customer never received the "a representative will get in touch
shortly" message that handoff is supposed to be announcing.

Consequences observed live: the customer got total silence, AND because `runBotTurn` starts with
`if (conversation.status !== "bot") return;`, the bot then refused to respond to every subsequent
message from that customer. A transient send failure permanently killed the conversation.

Fix: only advance to `handed_off` when the reply was actually delivered. If the send failed, leave
the status as `bot` so the next inbound message retries the whole turn normally.

## Files

**Edit:** `src/bot.ts` (relative to `cerebyl-whatsapp-worker/`, the working directory for this run)

## Approach

Track whether the send actually succeeded, and gate both the handoff attempt and the status write
on it.

1. Change the send block to record success. It currently reads:
```ts
	if (replyText) {
		const waMessageId = await sendWhatsappText(env, accessToken, phoneNumberId, "91" + conversation.contact_phone, replyText);
		await sbInsert(env, "whatsapp_messages", {
			conversation_id: conversation.id,
			direction: "out",
			body: replyText,
			wa_message_id: waMessageId,
			delivery_status: waMessageId ? "sent" : "failed",
		});
	}
```
Add a `sendOk` flag declared immediately before the `if (replyText) {` line, and set it from the
send result:
```ts
	// Whether the customer actually received the reply. A failed send must not
	// advance conversation state — see the handoff gate below.
	let sendOk = false;
	if (replyText) {
		const waMessageId = await sendWhatsappText(env, accessToken, phoneNumberId, "91" + conversation.contact_phone, replyText);
		sendOk = !!waMessageId;
		await sbInsert(env, "whatsapp_messages", {
			conversation_id: conversation.id,
			direction: "out",
			body: replyText,
			wa_message_id: waMessageId,
			delivery_status: waMessageId ? "sent" : "failed",
		});
	}
```

2. Gate the handoff on it. Change:
```ts
	let newNumberId: string | undefined;
	if (handedOff) {
		newNumberId = await tryHandoffToRep(env, conversation, accessToken);
	}

	const patch: Record<string, unknown> = { last_message_at: new Date().toISOString() };
	if (handedOff) patch.status = "handed_off";
	if (newNumberId) patch.number_id = newNumberId;
```
to:
```ts
	// Only hand off once the customer has actually been told someone will follow
	// up. If that send failed, stay in 'bot' so the next inbound message retries
	// the turn instead of stranding the customer with a silent bot.
	const handoffConfirmed = handedOff && sendOk;

	let newNumberId: string | undefined;
	if (handoffConfirmed) {
		newNumberId = await tryHandoffToRep(env, conversation, accessToken);
	}

	const patch: Record<string, unknown> = { last_message_at: new Date().toISOString() };
	if (handoffConfirmed) patch.status = "handed_off";
	if (newNumberId) patch.number_id = newNumberId;
```

Do not change anything else — not `SYSTEM_PROMPT`, not `TOOL_DECLARATIONS`, not the Gemini retry
logic, not `tryHandoffToRep` itself, not the token-selection logic.

## Constraints

- Do not touch any other file in this repo.
- This repo uses **tabs** for indentation — match it exactly.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `git status` → only `src/bot.ts` modified.
- In your report, quote the `handoffConfirmed` line and both places it is used, so the gating can
  be verified at a glance.
