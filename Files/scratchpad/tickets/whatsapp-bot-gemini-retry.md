# Ticket: Bot must retry transient Gemini failures and never leave a customer in silence

## Goal

Confirmed live via `wrangler tail`:
```
(error) [whatsapp bot] Gemini call failed: 503
{"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand
are usually temporary. Please try again later.","status":"UNAVAILABLE"}}
```

Two problems in `runBotTurn` (`src/bot.ts`):

1. **No retry.** A single transient 503/429 from Gemini kills the entire bot turn. These are
   explicitly documented by Google as temporary and usually succeed on a retry seconds later.
2. **Silent failure.** On any non-ok Gemini response the code does `console.error(...); return;` —
   so no message is sent to the customer, no row is recorded, and nothing surfaces in the app.
   A real prospective customer messages in and gets complete silence, and no rep ever learns the
   bot dropped the ball. This is the more important half of the fix.

## Files

**Edit:** `src/bot.ts` (paths relative to `cerebyl-whatsapp-worker/`, which is the working
directory for this run — NOT the leadenthrella app repo)

## Approach

### 1. Add module-level constants and helpers

Near the existing `const GEMINI_MODEL`, `MAX_TOOL_ROUNDS`, `HISTORY_LIMIT` declarations, add:

```ts
const GEMINI_MAX_ATTEMPTS = 3;
// Google documents these as temporary — worth retrying. Anything else (401/400/403)
// is a real misconfiguration and retrying just wastes time.
const TRANSIENT_GEMINI_STATUSES = new Set([429, 500, 502, 503, 504]);
// Sent when Gemini is unreachable after every retry, so a real prospect is never
// left in silence. Deliberately generic and safe: it makes no claims, quotes no
// rates, and is true regardless of what the customer asked.
const FALLBACK_REPLY = "Thanks for your message! Someone from our team will get back to you shortly.";
```

And a small sleep helper (place it near the other module-level helpers, above `runBotTurn`):

```ts
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### 2. Add a retrying Gemini caller

Add this function above `runBotTurn`:

```ts
// Calls Gemini once per attempt, retrying only transient failures with a short
// linear backoff. Returns the parsed response, or null when every attempt failed.
async function callGeminiWithRetry(apiKey: string, body: unknown): Promise<any | null> {
	for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt++) {
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
			body: JSON.stringify(body),
		});
		if (res.ok) return await res.json();

		const detail = await res.text().catch(() => "");
		console.error(`[whatsapp bot] Gemini call failed (attempt ${attempt}/${GEMINI_MAX_ATTEMPTS}):`, res.status, detail.slice(0, 300));
		if (!TRANSIENT_GEMINI_STATUSES.has(res.status)) return null;
		if (attempt < GEMINI_MAX_ATTEMPTS) await sleep(attempt * 750);
	}
	return null;
}
```

### 3. Use it in the tool loop, and fall back instead of returning

Currently the loop body starts with:
```ts
	for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
			body: JSON.stringify(geminiBody),
		});
		if (!res.ok) {
			console.error("[whatsapp bot] Gemini call failed:", res.status, await res.text().catch(() => ""));
			return;
		}
		const data = await res.json();
```

Replace that fetch + `!res.ok` block + `const data = await res.json();` with:
```ts
	for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
		const data = await callGeminiWithRetry(apiKey, geminiBody);
		if (!data) {
			geminiFailed = true;
			break;
		}
```

Declare the new flag next to the existing `let handedOff = false;` / `let replyText: string | null = null;`:
```ts
	let geminiFailed = false;
```

Then, immediately AFTER the `for` loop ends and BEFORE the existing `if (replyText) { ... }` send
block, add:
```ts
	// Gemini never produced a reply — send a safe holding message rather than
	// leaving the customer with silence. Status stays 'bot', so the next inbound
	// message retries Gemini normally.
	if (!replyText && geminiFailed) replyText = FALLBACK_REPLY;
```

The existing `if (replyText) { ... sendWhatsappText ... sbInsert ... }` block then handles sending
and recording it, including the `delivery_status: waMessageId ? "sent" : "failed"` logic that is
already there — do not duplicate or modify that block.

## Constraints

- Do NOT change `SYSTEM_PROMPT` or `TOOL_DECLARATIONS` — AI prompt content is explicitly not
  delegated on this project.
- Do not change the handoff logic, `tryHandoffToRep`, or the final `sbUpdate` patch block.
- Do not touch `send.ts`, `index.ts`, `lead-intake.ts`, `supabase.ts`, `gemini.ts`, `dedupe.ts`,
  or `classify.ts`.
- This repo uses **tabs** for indentation — match it exactly, do not reformat to spaces.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` (from `cerebyl-whatsapp-worker/`) → 0 errors.
- `git status` → only `src/bot.ts` modified.
- In your report, quote (a) the `callGeminiWithRetry` signature and its retry condition, and
  (b) the `if (!replyText && geminiFailed)` line, so both halves of the fix can be verified at a
  glance.
