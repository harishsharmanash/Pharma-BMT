# TICKET F17-c — `send-push` edge function (FCM v1)

You are creating ONE new file. Do NOT commit. Do NOT run tsc, tests, or shell
commands. Create exactly: `supabase/functions/send-push/index.ts`

Study the existing pattern in `supabase/functions/send-order-notification/index.ts`
(Deno.serve, corsHeaders, env access via `Deno.env.get("SUPABASE_SECRET_KEY") ??
Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")`, trailing `json()` helper). Match its
style. No npm imports beyond `https://esm.sh/@supabase/supabase-js@2.49.4` —
FCM auth is hand-rolled with WebCrypto (see below); do NOT import
google-auth-library or any JWT package.

## What it does

Called by a Supabase Database Webhook on INSERT into `public.notifications`.
Request body is the webhook envelope:
`{ type: "INSERT", table: "notifications", schema: "public", record: {...}, old_record: null }`

For the inserted notification row it sends an FCM push to every live device
token of that user.

## Auth (webhook → function)

The webhook sends header `x-webhook-secret`. Compare it to
`Deno.env.get("PUSH_WEBHOOK_SECRET")`; mismatch or missing → 401. This is the
ONLY caller auth — do not expect a user JWT.

## Steps inside the handler

1. OPTIONS → cors. Non-POST → 405.
2. Verify `x-webhook-secret` (401).
3. Parse envelope; if `type !== "INSERT"` or no `record` → 400. Extract
   `record` fields: `id, company_id, user_id, type, title, body, order_id, party_id`.
4. `admin = createClient(url, service)` (service key as above).
5. **Prefs check** — read `user_push_prefs` row for `user_id` (`maybeSingle`).
   `prefs` jsonb shape: `{ categories: { tasks?, sla?, orders?, digest? }, quiet_hours: { start: "22:00", end: "07:00" } }`.
   - Category mapping from notification `type`: contains `sla` or starts with
     `slabreach` → `sla`; `delivery_due`/`order*` → `orders`;
     `daily_digest` → `digest`; everything else → `tasks`. If
     `categories[cat] === false` → return `{ skipped: "category_off" }`.
   - Quiet hours: if `quiet_hours.start`/`end` exist and the CURRENT time
     (UTC+5:30 IST — compute as `new Date(Date.now() + 5.5*3600e3)` and read its
     UTC hours/minutes) falls inside the window (windows may cross midnight,
     e.g. 22:00→07:00) → return `{ skipped: "quiet_hours" }`. The in-app bell
     still has the row; the push is simply not sent.
6. **Tokens** — select `id, token` from `device_tokens` where `user_id` matches.
   None → `{ skipped: "no_tokens" }`.
7. **FCM access token** — hand-rolled service-account JWT:
   - The service account JSON is in env `FCM_SERVICE_ACCOUNT_JSON` (the whole
     JSON file as one string). Parse it; need `client_email`, `private_key`,
     `token_uri` (default `https://oauth2.googleapis.com/token`).
   - Build JWT: header `{alg:"RS256",typ:"JWT"}`, claims
     `{iss: client_email, scope: "https://www.googleapis.com/auth/firebase.messaging", aud: token_uri, iat, exp: iat+3600}`.
   - base64url-encode header and claims (helper: btoa with the URL-safe
     replacements; handle unicode via TextEncoder).
   - Import `private_key` (PEM PKCS#8) via
     `crypto.subtle.importKey("pkcs8", derBytes, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"])`
     — strip the `-----BEGIN/END PRIVATE KEY-----` lines and base64-decode the
     body to get derBytes.
   - Sign `headerB64 + "." + claimsB64` with `crypto.subtle.sign`, base64url the
     signature, append.
   - POST to token_uri with form body
     `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<jwt>`.
     Response `access_token`. Module-scope cache `{ token, exp }`; reuse while
     `Date.now() < exp - 60_000`.
8. **Send** — for each token, POST
   `https://fcm.googleapis.com/v1/projects/cerebyl/messages:send` with
   `Authorization: Bearer <access_token>` and body:
   ```json
   { "message": {
       "token": "...",
       "notification": { "title": "...", "body": "..." },
       "data": { "notificationId": "...", "type": "...", "order_id": "...", "party_id": "..." },
       "android": { "priority": "HIGH", "notification": { "channel_id": "cerebyl-alerts", "visibility": "SECRET" } }
   } }
   ```
   All `data` values MUST be strings (FCM requirement); omit empty ones.
   `body` truncated to 200 chars.
9. **Stale-token cleanup** — FCM 404 or 400 with `error.details[].errorCode` of
   `UNREGISTERED` (or status 404) → delete that `device_tokens` row via admin
   client. Other failures: collect and continue.
10. Return `{ ok: true, sent, failed, deleted }`.

## Constraints

- Wrap the handler body in try/catch → 500 `{ error }`, same as the pattern file.
- `// deno-lint-ignore-file no-explicit-any` at the top, like the pattern file.
- No secrets hardcoded. Firebase project id is `cerebyl` (that one is fine inline).

## Done criteria

- File exists at the exact path, complete (no TODOs / placeholders).
- Report the path + one-line summary. Do not claim to have tested it.
