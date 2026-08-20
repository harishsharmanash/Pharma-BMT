# Ticket: Use the never-expiring platform token for WhatsApp sends

## Goal

Every outbound WhatsApp send currently uses the per-company access token stored in
`company_secrets` (`whatsapp_access_token`), written during Embedded Signup. Confirmed live:
that token expired mid-testing and every send began failing with
`401 {"message":"Authentication Error","code":190,"type":"OAuthException"}` — the bot generated a
reply, and the send was rejected because the token was dead.

A platform-level **System User token with expiration "Never"** now exists (see
`Files/HARISH-DO-THIS.md` Task 15). The Worker's `Env` interface has ALWAYS declared
`WHATSAPP_PLATFORM_TOKEN` but nothing ever read it — this ticket finally wires it up.

Order of preference is **platform token first, per-company token as fallback**, deliberately:
- Task 15 describes the platform token as the one that "lets our app act on behalf of every
  client WABA we onboard" — that is its designed purpose.
- It cannot silently expire mid-conversation, which is exactly the failure being fixed here.
- Preferring the company token first would NOT fix the observed bug, because the company token
  is present-but-expired, so a "company first" check keeps selecting the dead one.

## Files

**Edit:**
- `cerebyl-whatsapp-worker/src/bot.ts`
- `leadenthrella/supabase/functions/whatsapp-send-message/index.ts`

These live in two SEPARATE repos. Only one of them is in the working directory for any given
aider run — this ticket will be run twice, once per repo. Only edit the file that exists in the
current working directory; ignore the other.

## Approach

### A. `cerebyl-whatsapp-worker/src/bot.ts`

Find, near the top of `runBotTurn`:
```ts
	const accessToken = await sbRpc(env, "get_company_secret", { p_company: conversation.company_id, p_name: "whatsapp_access_token" }) as string | null;
	if (!accessToken || typeof accessToken !== "string") return;
```

Replace with:
```ts
	// Prefer the never-expiring platform System User token (HARISH-DO-THIS Task 15):
	// it is granted access to every client WABA this app onboards, and unlike the
	// per-company Embedded Signup token it cannot silently expire mid-conversation
	// (which is exactly what broke sends with a 190 "Authentication Error"). Falls
	// back to the company's own token when no platform token is configured.
	const companyToken = await sbRpc(env, "get_company_secret", { p_company: conversation.company_id, p_name: "whatsapp_access_token" }) as string | null;
	const accessToken = env.WHATSAPP_PLATFORM_TOKEN || (typeof companyToken === "string" ? companyToken : "");
	if (!accessToken) return;
```

`tryHandoffToRep` already receives `accessToken` as a parameter, so it inherits this
automatically — do not change it.

Do NOT change `SYSTEM_PROMPT`, `TOOL_DECLARATIONS`, the Gemini retry logic, or anything else in
this file. This repo uses **tabs** — match it.

### B. `leadenthrella/supabase/functions/whatsapp-send-message/index.ts`

Find:
```ts
    const accessToken = await admin
      .rpc("get_company_secret", { p_company: companyId, p_name: "whatsapp_access_token" })
      .then((r) => r.data as string | null);
    if (!accessToken) {
      return json({ error: "WhatsApp access token missing — reconnect WhatsApp in Settings." }, 400);
    }
```

Replace with:
```ts
    // Prefer the never-expiring platform System User token; fall back to the
    // company's own Embedded Signup token. Same ordering and reasoning as
    // cerebyl-whatsapp-worker/src/bot.ts — the per-company token can expire
    // silently, which surfaced as a 190 "Authentication Error" on every send.
    const companyToken = await admin
      .rpc("get_company_secret", { p_company: companyId, p_name: "whatsapp_access_token" })
      .then((r) => r.data as string | null);
    const accessToken = Deno.env.get("WHATSAPP_PLATFORM_TOKEN") || companyToken;
    if (!accessToken) {
      return json({ error: "WhatsApp access token missing — reconnect WhatsApp in Settings." }, 400);
    }
```

Do not change anything else in this file — in particular do not touch the authorization block
that restricts reps to their own conversations.

## Constraints

- Do not commit.
- Do not touch any other file in either repo.

## Acceptance

- `npx tsc --noEmit` → 0 errors (run in whichever repo was edited).
- `git status` → only the single intended file modified.
- In your report, quote the final `accessToken` assignment line so the preference order can be
  verified at a glance.
