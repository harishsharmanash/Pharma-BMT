# Connecting a real WhatsApp number to Cerebyl — runbook

**Written 29 Aug 2026 (Claude Opus), the day the Meta app `CerebylWA` went live.**
Every fact below was verified against the code or live infrastructure, not recalled.
Use this for the first test number AND for every client onboarding after it.

---

## 0. Before you touch anything — is this number eligible?

**Decide which kind of number it is. This determines whether it works at all.**

| The number today | Can it connect? | What happens |
|---|---|---|
| **Unused / fresh SIM** | ✅ Best case | Clean onboarding, no trade-offs. |
| **Running the WhatsApp _Business_ app** (v2.24.17+) | ✅ Via Coexistence | App + Cloud API run on the SAME number. Chats and contacts survive. Eligibility is decided **per number at onboarding** (account tenure + quality) — it is not guaranteed in advance. |
| **Running regular / personal WhatsApp** | ❌ Not directly | Explicitly **ineligible for Coexistence**. The WhatsApp account on that number must be deleted first, then onboarded fresh. |
| **Already connected to another Tech Partner** (Wati, AiSensy, Interakt…) | ❌ | A number can be connected to only **ONE** Tech Partner. They must disconnect there first. |

**🔴 Do NOT use your working client-DM number.** Coexistence forces real trade-offs on
every 1:1 chat on that number: disappearing messages off, view-once and live-location
disabled, broadcast lists read-only, groups not synced, and the Business app must be
opened at least **every 13 days** or the link goes stale. Throughput is capped at 20 mps.
For testing, use a spare SIM.

You will also need to receive an **SMS or voice OTP** on the number during signup.

---

## 1. Enable the feature for the company (console — you only)

`whatsapp_integration` is **DEFAULT_OFF** *and* **CONSOLE_ONLY**
(`src/lib/features.ts`). A company admin cannot switch it on for themselves, and with it
off **no WhatsApp UI renders in Settings at all** — the card simply is not there.

→ `/console/switchboard` → find the company → enable **WhatsApp Integration**.

If you skip this, step 3 will look like a bug. It is not.

---

## 2. Confirm the Embedded Signup config is in the deployed build

The Connect button is disabled unless `VITE_WHATSAPP_CONFIG_ID` is present at build
time (`settings.index.tsx:1591,1718`). Both it and `VITE_FACEBOOK_APP_ID` are set in
`.env` locally.

**You do not need to check this by hand — the UI tells you.** If the config is missing,
the button is greyed out and the card shows *"Waiting on Embedded Signup
configuration"*. If the button is blue and clickable, the config shipped.

---

## 3. Run Embedded Signup (in the app, as a company admin)

1. Sign in to **https://app.cerebyl.com** as an **admin of the test company**.
2. **Settings** → scroll to the **WhatsApp** card.
3. Click **Connect WhatsApp**.
4. A Facebook popup opens. **⚠️ Meta remembers the browser's last Facebook login** — this
   is exactly why this control lives per-company in Settings rather than the console. If
   the wrong account appears, log out of Facebook in that browser first, or use a fresh
   profile / incognito window.
5. In the popup: select or create the **Business portfolio** → create or select the
   **WhatsApp Business Account (WABA)** → add the **phone number** → enter the **OTP**.

---

## 4. What happens automatically after the popup closes

`whatsapp-embedded-signup-callback` does all of this server-side — **there are no manual
Meta steps left**:

- Exchanges the returned code for a token.
- **Registers the number for Cloud API** with a generated 6-digit PIN, stored encrypted in
  `company_secrets` as `whatsapp_pin_<phoneNumberId>`. Re-registration later needs the
  **same PIN**, which is why it is stored rather than discarded.
- **Subscribes the app to that WABA's webhooks** (`{wabaId}/subscribed_apps`) so inbound
  messages reach `cerebyl-whatsapp-worker`.
- Verifies the WABA belongs to this company before storing it, so an admin cannot pin a
  foreign WABA.

If any step fails, the function returns the failing stage by name ("Phone number
registration", "Webhook subscription") — read that, do not guess.

---

## 5. The acceptance test — prove it end to end

Run these in order. Each one exercises a different path that has only ever been tested
against Meta's test number.

1. **Inbound + bot.** From a *different* phone, WhatsApp-message the connected number.
   Expect: a lead is created, and the bot replies in one or two short lines.
   → Proves webhook delivery, HMAC verification, and the Gemini loop.
2. **Conversation UI.** Open `/whatsapp` in the app. The thread appears, with delivery
   ticks updating.
3. **Manual reply.** Take over the conversation and send from the reply box.
   → Proves `whatsapp-send-message` and the `WHATSAPP_PLATFORM_TOKEN` path. This is the
   one that was broken for a week in Aug (truncated secret, 209 chars vs 294) — worth
   watching closely.
4. **Opt-out.** Reply **STOP** from the customer phone. Expect the confirmation, and a
   row in `whatsapp_opt_outs`. Then confirm that number is excluded from a broadcast.
5. **Health.** `/console/whatsapp-ops` — number health, quality rating, DLQ empty.

**Watch the worker while you test:** `npx wrangler tail` from `cerebyl-whatsapp-worker/`.
Every past WhatsApp bug on this project was diagnosed from that stream, not from the UI.

---

## 6. Expectations to set before anyone calls it broken

- **The 24-hour window.** Outside 24h from the customer's last message you may only send
  **approved templates**, never free text. This is Meta policy, not a Cerebyl limit.
- **A new number starts on a low messaging tier** (typically 250 business-initiated
  conversations/24h) and scales with quality and volume. It is not a defect.
- **Quality rating is fragile early.** Bursts of marketing to cold numbers is what tanks
  it. The broadcast sender already paces and honours opt-outs — do not work around it.
- Business Verification and Tech Provider access are already cleared at the platform
  level, so no client hits those.

---

## 7. Notes for the platform

- **Cerebyl does NOT need its own production WhatsApp number.** Each client onboards their
  own WABA, number and billing. Meta's test number `+1 555-674-0155` is US-based and can
  only message pre-registered recipients, so it can never carry a live client demo — get a
  cheap second SIM for sales demos.
- The registration PIN lives in `company_secrets`, encrypted under the Vault passphrase
  `company_secrets_master`. **If that passphrase is lost, PINs are unrecoverable** and
  numbers cannot be re-registered without Meta support.
