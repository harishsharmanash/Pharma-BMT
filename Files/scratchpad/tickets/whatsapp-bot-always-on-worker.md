# Ticket: Worker — respect the new bot "always on" flags

## Goal

A migration has been applied live adding two columns:
- `company_whatsapp_accounts.bot_always_on` — `boolean NOT NULL DEFAULT false` (company-wide default)
- `whatsapp_conversations.bot_always_on` — `boolean` NULLABLE, where NULL means "inherit the
  company default"

When "always on" resolves to true, the bot must NEVER auto-hand-off: it keeps replying to every
inbound message indefinitely. The only thing that silences it is a human explicitly taking the
conversation over (which sets `status = 'human'` from the app UI — already handled by the existing
`if (conversation.status !== "bot") return;` guard at the top of `runBotTurn`, which needs no
change).

Today the bot calls `mark_ready_for_handoff`, `handedOff` becomes true, and the conversation flips
to `'handed_off'` — after which the bot is silent forever. Confirmed live: the operator had to
click "Hand back to bot" after almost every single message to keep testing.

## Files

**Edit:**
- `src/bot.ts`
- `src/lead-intake.ts`

(Both relative to `cerebyl-whatsapp-worker/`, the working directory for this run.)

## Approach

### 1. `src/lead-intake.ts` — carry the new column through

Its local `ConversationRow` type currently is:
```ts
type ConversationRow = {
	id: string;
	company_id: string;
	number_id: string;
	contact_phone: string;
	lead_id: string | null;
	rep_id: string | null;
	status: string;
};
```
Add one field:
```ts
	bot_always_on: boolean | null;
```

`findOpenConversation` selects an explicit column list — it must fetch the new column too. Change:
```
&select=id,company_id,number_id,contact_phone,lead_id,rep_id,status&order=last_message_at.desc&limit=1
```
to:
```
&select=id,company_id,number_id,contact_phone,lead_id,rep_id,status,bot_always_on&order=last_message_at.desc&limit=1
```

`createConversation` uses `sbInsert`, which already returns the full row representation, so the new
column comes back automatically — do not change its insert payload (a new conversation should
inherit the company default, which is exactly what leaving the column NULL does).

### 2. `src/bot.ts` — resolve and honour the flag

Add the same field to this file's own local `ConversationRow` type:
```ts
	bot_always_on: boolean | null;
```

Add a row type near the other small types (`NumberRow`, `RepNumberRow`, `TemplateRow`):
```ts
type AccountRow = { bot_always_on: boolean };
```

In `runBotTurn`, there is an existing `Promise.all([...])` fetching `numberRows`, `history` and
`leadRows`. Add a fourth fetch to that same `Promise.all` so it costs no extra round trip:
```ts
		sbGet<AccountRow>(env, `company_whatsapp_accounts?company_id=eq.${conversation.company_id}&select=bot_always_on&limit=1`),
```
and destructure it as `accountRows` alongside the existing three.

Then resolve the effective setting, right after `const lead = leadRows[0] ?? null;`:
```ts
	// Per-conversation override wins; NULL means inherit the company default.
	// When on, the bot never auto-hands-off — only a human clicking "Take over"
	// (which sets status='human') stops it, via the guard at the top of this function.
	const alwaysOn = conversation.bot_always_on ?? accountRows[0]?.bot_always_on ?? false;
```

Finally, gate the handoff on it. The current line is:
```ts
	const handoffConfirmed = handedOff && sendOk;
```
Change to:
```ts
	const handoffConfirmed = handedOff && sendOk && !alwaysOn;
```
That single change covers both the `tryHandoffToRep` call and the `patch.status = "handed_off"`
write, since both are already gated on `handoffConfirmed`.

Note this deliberately leaves everything else about the turn intact when always-on is set: the bot
still calls `update_lead_details`, the lead is still enriched, and the rep still sees the
conversation in the Inbox. The ONLY difference is the conversation stays in `'bot'` status.

## Constraints

- Do NOT change `SYSTEM_PROMPT` or `TOOL_DECLARATIONS` — AI prompt content is not delegated on
  this project.
- Do not change the Gemini retry logic, the token-selection logic, or `tryHandoffToRep` itself.
- Do not touch `send.ts`, `index.ts`, `supabase.ts`, `gemini.ts`, `dedupe.ts`, `classify.ts`.
- This repo uses **tabs** for indentation — match it exactly.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `git status` → only `src/bot.ts` and `src/lead-intake.ts` modified.
- In your report, quote the `alwaysOn` resolution line and the new `handoffConfirmed` line.
