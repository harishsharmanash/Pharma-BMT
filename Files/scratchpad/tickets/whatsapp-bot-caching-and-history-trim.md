# Ticket: Gemini explicit caching + trim conversation history sent per turn

## Goal

Two independent token-cost changes to `cerebyl-whatsapp-worker`:

1. **Explicit caching** for the bot's system prompt + tool declarations, mirroring
   `acrowell-ai-worker/src/cache.ts`'s exact pattern (already reviewed, copy its shape closely).
   A KV namespace binding `GEMINI_CACHE` has already been added to `wrangler.jsonc` (infra step
   already done, do not touch `wrangler.jsonc` in this ticket). Note honestly: Gemini's explicit
   caching has a ~2048-token minimum, and this bot's prompt is smaller than Ceremate's — the
   Google API may reject the cache-creation call for being under that floor. That is fine and
   expected: mirror `cache.ts`'s own graceful-fallback behavior exactly (a failed/rejected cache
   creation returns `null`, and the caller falls back to sending `system_instruction`/`tools`
   inline, so the bot never breaks even if caching doesn't activate for this prompt).

2. **Shorter history window** — `HISTORY_LIMIT` is currently 20 messages, resent in full every
   single turn. Now that lead facts get distilled into `leads.call_summary` and re-surfaced via
   `leadContext` (already shipped), the raw message history matters less for long conversations.
   Lower it to reduce tokens sent on every turn of a long-running lead conversation.

## Files

**Create:** `src/cache.ts` (new file in `cerebyl-whatsapp-worker/`)

**Edit:** `src/bot.ts`, `src/index.ts` (relative to `cerebyl-whatsapp-worker/`, the working
directory for this run)

**Read only:** `../acrowell-ai-worker/src/cache.ts` (the exact pattern to mirror — same repo root,
sibling directory to this Worker's own root)

## Approach

### 1. `src/index.ts` — add the KV binding to `Env`

Add one line to the `Env` interface:
```ts
	GEMINI_CACHE: KVNamespace;
```

### 2. `src/cache.ts` — new file, adapted from `acrowell-ai-worker/src/cache.ts`

Same shape as the reference file, adapted for this bot's single prompt (no multi-slot system needed
— this Worker only has one system prompt, not Tier-1/Tier-2 like Ceremate):

```ts
import type { Env } from "./index";

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const CACHE_TTL_SECONDS = 3600; // 1 hour
const REFRESH_BUFFER_MS = 60_000;
const KV_KEY = "gemini:whatsapp-bot:cache-name";

// Mirrors acrowell-ai-worker/src/cache.ts exactly: the system prompt + tool
// declarations are byte-identical for every company using this bot, so one
// shared cache serves everyone — not one per company. Its resource name and
// expiry live in KV so every Worker instance/region reuses the same cache.
//
// Gemini's explicit caching has a token-count floor (roughly 2048 tokens);
// this bot's prompt may sit under that. That is fine — a rejected or failed
// cache-creation call returns null here, and the caller in bot.ts falls back
// to sending systemInstruction/tools inline, exactly like Ceremate's own
// fallback. Caching is a pure cost optimization, never a correctness
// requirement.
export async function getOrCreateCachedContentName(
	env: Env,
	apiKey: string,
	systemPrompt: string,
	declarations: unknown,
): Promise<string | null> {
	const existing = await env.GEMINI_CACHE.get(KV_KEY);
	if (existing) {
		const [name, expiryStr] = existing.split("|");
		const expiry = parseInt(expiryStr, 10);
		if (name && Date.now() < expiry - REFRESH_BUFFER_MS) {
			return name;
		}
	}

	const res = await fetch("https://generativelanguage.googleapis.com/v1beta/cachedContents", {
		method: "POST",
		headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
		body: JSON.stringify({
			model: `models/${GEMINI_MODEL}`,
			systemInstruction: { parts: [{ text: systemPrompt }] },
			tools: [{ functionDeclarations: declarations }],
			toolConfig: { functionCallingConfig: { mode: "AUTO" } },
			ttl: `${CACHE_TTL_SECONDS}s`,
		}),
	});

	if (!res.ok) return null;

	const data = (await res.json()) as { name?: string };
	if (!data.name) return null;

	const expiry = Date.now() + CACHE_TTL_SECONDS * 1000;
	await env.GEMINI_CACHE.put(KV_KEY, `${data.name}|${expiry}`, { expirationTtl: CACHE_TTL_SECONDS + 60 });
	return data.name;
}
```

### 3. `src/bot.ts` — use the cache when available

Import it: `import { getOrCreateCachedContentName } from "./cache";`

Currently `runBotTurn` builds:
```ts
	const geminiBody: any = {
		system_instruction: { parts: [{ text: SYSTEM_PROMPT + leadContext }] },
		contents,
		tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
		tool_config: { functionCallingConfig: { mode: "AUTO" } },
	};
```

**Important nuance**: `leadContext` (the per-lead "what you already know" block) is NOT
cacheable — it's different for every conversation. Only the byte-identical `SYSTEM_PROMPT` +
`TOOL_DECLARATIONS` can be cached. Gemini's `cachedContent` API lets you reference a cache AND
still pass additional `system_instruction` content alongside it — but the simplest and safest
approach, matching how `acrowell-ai-worker` actually calls Gemini with a cache reference, is to
put `leadContext` into the first user-turn content instead of into `system_instruction` when a
cache is in play. To keep this change small and low-risk, do it like this:

Replace the `const geminiBody: any = {...}` block with:
```ts
	const cachedContentName = await getOrCreateCachedContentName(env, apiKey, SYSTEM_PROMPT, TOOL_DECLARATIONS);

	const geminiBody: any = cachedContentName
		? {
				cachedContent: cachedContentName,
				contents: leadContext
					? [{ role: "user", parts: [{ text: leadContext.trim() }] }, ...contents]
					: contents,
			}
		: {
				system_instruction: { parts: [{ text: SYSTEM_PROMPT + leadContext }] },
				contents,
				tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
				tool_config: { functionCallingConfig: { mode: "AUTO" } },
			};
```

Note `contents` at this point is still the raw array built from history a few lines above — this
still works whether or not `cachedContentName` is set, since both branches reference the same
`contents` array.

Do not change `callGeminiWithRetry` — it already just POSTs whatever `body` it's given, no change
needed there regardless of which shape `geminiBody` takes.

### 4. Trim `HISTORY_LIMIT`

Change:
```ts
const HISTORY_LIMIT = 20;
```
to:
```ts
const HISTORY_LIMIT = 12; // call_summary now retains distilled facts, so older raw
// messages matter less — this trims tokens resent every turn on long conversations.
```

## Constraints

- Do NOT change `SYSTEM_PROMPT` or `TOOL_DECLARATIONS` wording — that content is not delegated on
  this project and was just deliberately written; this ticket only changes HOW it's transmitted,
  never what it says.
- Do not touch `wrangler.jsonc` (KV binding already added).
- Do not touch `send.ts`, `index.ts` beyond the one `Env` line, `lead-intake.ts`, `supabase.ts`,
  `gemini.ts`, `dedupe.ts`, `classify.ts`.
- This repo uses **tabs** for indentation — match it exactly.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `git status` → only `src/cache.ts` (new), `src/bot.ts`, `src/index.ts` show as changed/new.
- In your report, quote the final `geminiBody` construction (both branches) and the new
  `HISTORY_LIMIT` line.
