# Data breach response runbook — Cerebyl

**Written 10 Sep 2026.** DPDP Rules 2025 (notified 13 Nov 2025, full enforcement by May 2027) require
a detailed report to the **Data Protection Board within 72 hours** of becoming aware of a personal
data breach. The clock starts at *awareness*, not at the end of the investigation. Penalty for
failing to notify: up to ₹200 crore. Keep this file short enough to follow under pressure.

## Roles
- **Decision-maker and notifier:** Harish Sharma (Grievance Officer, support@cerebyl.com).
- **Technical lead:** whichever lead agent is running (Claude / Kimi), working from this file.

## How we find out
Sentry alerts (web app + the AI, WhatsApp and lead-intake workers, tagged `service`) · an email to
support@cerebyl.com · a client report · Supabase logs / `platform_audit_logs` · Meta or Google
security notices.

## Hour 0–1 — contain
1. **Write down the time you became aware.** That is T0. Start a log (a note with timestamps).
2. **Stop the bleeding with the console kill switches** (Console → Switchboard, take effect within
   30 s): pause AI, WhatsApp automation and/or lead intake as relevant.
3. **Cut off the access path:**
   - compromised user → deactivate in Console → Users (and reset password there);
   - leaked Supabase service-role key / JWT secret → rotate in Supabase → Project Settings → API,
     then redeploy every worker and edge function that holds it;
   - leaked WhatsApp platform token → regenerate the System User token in Meta Business Settings,
     then `wrangler secret put WHATSAPP_PLATFORM_TOKEN` in `cerebyl-whatsapp-worker`;
   - leaked Gemini key → revoke in Google AI Studio and replace.
4. **Preserve evidence** — export the relevant `platform_audit_logs`, Supabase auth/API logs and
   Sentry issues before anything rotates out. Do not delete rows.

## Hour 1–24 — assess
Answer, in the log: what data (which tables/fields), which companies, roughly how many people,
from when to when, how it happened, and whether it is still possible. Classify each affected data set:
- **Client-entered data** (their customers, leads, distributors, staff): the Client is the Data
  Fiduciary → **notify each affected Client company without undue delay** (DPA §6) with what you know;
  they notify their own people.
- **Cerebyl user accounts** (staff logins — name, email, role): Cerebyl is the Data Fiduciary →
  Cerebyl notifies the Board and the affected users.

Supabase **daily backups exist** (Pro plan); if data was altered or deleted, identify the last good
backup before restoring anything, and restore into a scratch project first.

## Before T0 + 72 h — notify
1. **Data Protection Board of India** — detailed report: nature, extent, timing and location of the
   breach; likely impact; measures taken to contain it; findings on cause; the Grievance Officer's
   contact. If some facts are still unknown, file with what is known and say so — do not miss the
   deadline waiting for completeness. `[Add the Board's current filing channel here once published.]`
2. **Affected people** (where Cerebyl is the fiduciary) — plain language: what happened, what data,
   what they should do (e.g. change password, watch for suspicious WhatsApp messages), and
   support@cerebyl.com for questions.
3. **Affected client companies** — same content, plus what they need to tell their own customers.

## After
Fix the root cause, add a test that would have caught it (and mutation-check it), write a dated
`Files/WORKLOG.md` entry, and update this runbook with anything that was slow or unclear.

## Message templates

**To a client company (first notice):**
> Subject: Security incident affecting your Cerebyl data — `[date]`
> On `[date/time]` we became aware of `[short description]`. It affected `[data]` for `[scope]`.
> We have `[containment steps]`. We are still investigating and will update you by `[time]`.
> Under DPDP you may need to inform the affected individuals; we will give you everything you need.
> Contact: Harish Sharma, support@cerebyl.com.

**To an affected user:**
> We are writing to tell you about a security incident at Cerebyl. On `[date]`, `[what happened]`.
> The information involved was `[data]`. We have `[what we did]`. We recommend you `[action]`.
> Questions: support@cerebyl.com (Grievance Officer: Harish Sharma).
