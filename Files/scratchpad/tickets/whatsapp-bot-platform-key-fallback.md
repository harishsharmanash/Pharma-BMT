# Ticket: WhatsApp bot — fall back to the platform Gemini key

## Goal

`runBotTurn` in `cerebyl-whatsapp-worker/src/bot.ts` currently reads the company's Gemini API key
from `company_secrets` via `get_company_secret(company_id, 'gemini_api_key')`, and silently returns
(no bot reply at all) when that secret is absent.

That secret has NEVER been set for any company — nothing in the whole app writes it (only email
keys and the WhatsApp access token have UI paths that call `set_company_secret`). So the bot has
never replied for anyone. Confirmed live: a real inbound WhatsApp message created a lead and a
conversation correctly, but no bot reply was sent, because this lookup returned null.

A platform-level `GEMINI_API_KEY` Worker secret has now been uploaded to this Worker. Change the
bot to prefer the company's own key when present, and fall back to the platform key otherwise.
This keeps per-company billing possible for a client who wants their own key, while making the bot
work out of the box for every company with zero setup — matching how the main Ceremate assistant
already behaves (it uses a shared Worker-level `GEMINI_API_KEY` on `acrowell-ai-worker`).

## Files

**Edit:**
- `src/bot.ts`
- `src/index.ts`

(Both paths are relative to the `cerebyl-whatsapp-worker/` directory, which is the working
directory for this run — NOT the `leadenthrella` app repo.)

## Approach

### 1. `src/index.ts` — add the binding to the `Env` interface

The `Env` interface currently declares `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`WHATSAPP_PLATFORM_TOKEN`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`.

Add one more line to that interface:
```ts
	GEMINI_API_KEY: string;
```
Keep the existing tab-based indentation used throughout this file (this Worker repo uses tabs, not
spaces — match the surrounding lines exactly).

### 2. `src/bot.ts` — prefer the company key, fall back to the platform key

Find these two lines near the top of `runBotTurn` (around line 99-100):
```ts
	const apiKey = await sbRpc(env, "get_company_secret", { p_company: conversation.company_id, p_name: "gemini_api_key" }) as string | null;
	if (!apiKey || typeof apiKey !== "string") return; // no key configured — bot simply doesn't reply, lead still landed fine
```

Replace with a version that falls back. Keep the same variable name `apiKey` so the rest of the
function (the `fetch` call passing `"x-goog-api-key": apiKey`) is untouched:
```ts
	// Prefer the company's own Gemini key (per-company billing) and fall back to
	// the platform key, so the bot works out of the box for every company. Only
	// if BOTH are missing does the bot stay silent — the lead has still landed
	// fine by this point either way.
	const companyKey = await sbRpc(env, "get_company_secret", { p_company: conversation.company_id, p_name: "gemini_api_key" }) as string | null;
	const apiKey = (typeof companyKey === "string" && companyKey) ? companyKey : env.GEMINI_API_KEY;
	if (!apiKey || typeof apiKey !== "string") return;
```

Do not change anything else in `bot.ts` — the system prompt, the tool declarations, the tool loop,
the handoff logic and the `sendWhatsappText` call are all correct and out of scope.

## Constraints

- **Do NOT change the system prompt or tool declarations** in `bot.ts` — AI prompt content is
  explicitly not delegated on this project, and this ticket does not need it changed.
- Do not touch `send.ts`, `lead-intake.ts`, `supabase.ts`, `gemini.ts`, `classify.ts`, `dedupe.ts`
  or `signature.ts`.
- This Worker repo uses **tabs** for indentation — match it, do not reformat to spaces.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` from the `cerebyl-whatsapp-worker` directory → 0 errors. (This Worker has its
  own `tsconfig.json`; do not run the `leadenthrella` app's typecheck for this ticket.)
- `git status` — only `src/bot.ts` and `src/index.ts` inside `cerebyl-whatsapp-worker/` modified.
- In your report, quote the exact final `apiKey` assignment lines so the fallback order
  (company key first, platform key second) can be verified at a glance.
