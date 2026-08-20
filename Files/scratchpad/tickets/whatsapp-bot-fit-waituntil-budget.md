# Ticket: Bot turn must finish inside Cloudflare's waitUntil budget

## Goal

Confirmed live via `wrangler tail`:
```
(error) [whatsapp bot] Gemini call failed (attempt 1/3): 503 ...
(warn) waitUntil() tasks did not complete within the allowed time after invocation end
       and have been cancelled.
```

`ingestInboundMessage` (and therefore `runBotTurn`) runs inside `ctx.waitUntil(...)` in
`src/index.ts`. Cloudflare cancels waitUntil work once its budget is exhausted. The current retry
config — 3 attempts, each an unbounded `fetch` to Gemini, plus 750ms/1500ms backoff sleeps — can
exceed that budget when Gemini is slow or persistently overloaded. The task is killed mid-flight,
so the code never reaches the `FALLBACK_REPLY` send and the customer gets total silence.

Two fixes, both about keeping the whole turn comfortably bounded:
1. Put a hard timeout on each Gemini fetch so one hung call can't eat the entire budget.
2. Reduce retries so worst-case total time leaves room for the fallback send.

The `FALLBACK_REPLY` send is the thing that MUST always happen — retrying Gemini is a nice-to-have,
never at the cost of the customer getting no message at all.

## Files

**Edit:** `src/bot.ts` (relative to `cerebyl-whatsapp-worker/`, the working directory for this run)

## Approach

### 1. Reduce the retry budget

Change:
```ts
const GEMINI_MAX_ATTEMPTS = 3;
```
to:
```ts
// Kept deliberately low: the whole bot turn runs inside ctx.waitUntil(), which
// Cloudflare cancels when its budget runs out. Retrying harder is worthless if
// it means the FALLBACK_REPLY send never gets reached.
const GEMINI_MAX_ATTEMPTS = 2;
// Hard ceiling per Gemini call — a hung request must not consume the budget
// that the fallback send needs.
const GEMINI_TIMEOUT_MS = 7000;
```

### 2. Add a per-call timeout, and shorten the backoff

In `callGeminiWithRetry`, the fetch currently reads:
```ts
		const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
			body: JSON.stringify(body),
		});
		if (res.ok) return await res.json();
```

Wrap it so a timeout (or any network throw) is treated the same as a transient failure rather than
propagating out of the function. Replace the whole body of the `for` loop with:
```ts
		try {
			const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
				method: "POST",
				headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
			});
			if (res.ok) return await res.json();

			const detail = await res.text().catch(() => "");
			console.error(`[whatsapp bot] Gemini call failed (attempt ${attempt}/${GEMINI_MAX_ATTEMPTS}):`, res.status, detail.slice(0, 300));
			if (!TRANSIENT_GEMINI_STATUSES.has(res.status)) return null;
		} catch (e) {
			// Timeout or network error — treat as transient, same as a 503.
			console.error(`[whatsapp bot] Gemini call errored (attempt ${attempt}/${GEMINI_MAX_ATTEMPTS}):`, e instanceof Error ? e.message : String(e));
		}
		if (attempt < GEMINI_MAX_ATTEMPTS) await sleep(300);
```

Note the backoff drops from `attempt * 750` to a flat `300`, and the `sleep` call moves outside the
try/catch so it applies after either failure path.

Do not change `SYSTEM_PROMPT`, `TOOL_DECLARATIONS`, the token-selection logic, the
`handoffConfirmed` gating, or anything else in this file.

## Constraints

- Do not touch any other file in this repo. In particular do NOT change `src/index.ts` — switching
  away from `ctx.waitUntil` would make the Worker hold Meta's webhook connection open, and Meta
  retries slow webhooks, which would create duplicate inbound message rows. Bounding the work is
  the correct fix, not removing waitUntil.
- This repo uses **tabs** for indentation — match it exactly.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `git status` → only `src/bot.ts` modified.
- In your report, state the new worst-case duration of `callGeminiWithRetry`
  (attempts × timeout + backoff) so it can be sanity-checked against the waitUntil budget.
