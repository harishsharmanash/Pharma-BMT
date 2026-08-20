# Cerebyl Console — Security Remediation & Backend Feature Roadmap

**Date:** 20 Aug 2026
**Scope:** Owner console (`leadenthrella/src/routes/console.*.tsx`), Supabase (migrations + 34 edge functions), and the three Cloudflare workers (`acrowell-ai-worker`, `cerebyl-whatsapp-worker`, `cerebyl-lead-intake`).
**Source:** Full codebase audit. Every finding below cites the exact file and line. Verify each on the live system before and after fixing — the live DB has migration drift (migrations are applied manually; `supabase db push` is banned), so repo state ≠ production state.

---

# PART 1 — SECURITY REMEDIATION

## Severity legend
- 🔴 **HIGH** — exploitable or unverifiable privilege path; fix first.
- 🟡 **MEDIUM** — abuse requires specific conditions or is bounded; fix this cycle.
- 🟢 **LOW** — hardening / hygiene.

---

## 🔴 H1 — Platform edge functions bypass the MFA (AAL2) gate

**Where:** every `platform-*` edge function, e.g.
- `leadenthrella/supabase/functions/platform-impersonate/index.ts:29-35`
- `leadenthrella/supabase/functions/platform-query-runner/index.ts:29-34`
- same pattern in `platform-manage-user`, `platform-create-company`, `platform-dlq-replay`, `platform-purge-old-data`, `platform-manage-domain`

**Problem:** The DB enforces MFA for console access — `is_platform_admin()` requires `auth.jwt()->>'aal' = 'aal2'` (`migrations/20260722130000_require_mfa_for_platform_admin.sql:12-16`). But edge functions run with the **service-role key** (RLS bypass) and only check that the caller's user id has a row in `platform_admins`. They never check the `aal` claim. An attacker holding a stolen **pre-MFA (AAL1) session JWT** can call every dangerous function directly with curl — impersonate users, run SQL, delete data — skipping the TOTP gate entirely.

**Fix:**
1. Create a shared helper in `supabase/functions/_shared/` (follow the existing `_shared` convention in that folder), e.g. `assertPlatformAdminAal2(req)`:
   - Validate the JWT via `auth.getUser(token)` (existing pattern).
   - Decode the JWT payload and require `payload.aal === 'aal2'`; return HTTP 403 otherwise.
   - Then do the existing `platform_admins` membership check via the service-role client.
2. Call this helper at the top of every `platform-*` function, replacing the current membership-only check.
3. Also apply it to `manage-email-keys` and any other function that mutates cross-tenant state.

**Double-checks:**
- [ ] Grep confirms **zero** `platform-*` functions still check `platform_admins` without the AAL2 helper: `grep -rn "platform_admins" supabase/functions/`
- [ ] Manual test: log into the console, grab the session JWT **before** completing TOTP (AAL1), call `platform-impersonate` with curl → must return 403. Repeat after TOTP (AAL2) → must work.
- [ ] Confirm the UI still works end-to-end (the console already forces AAL2 before rendering, so legit operators are unaffected).

---

## 🔴 H2 — Impersonation: "read_only" mode is not enforced; target user not bound to company

**Where:** `leadenthrella/supabase/functions/platform-impersonate/index.ts`
- `mode` recorded at `:95` but never enforced — the minted magic link grants the target user's **full** session regardless.
- `target_user_id` never verified to belong to `target_company_id` (`:56-68` fetches the profile but never compares `profile.company_id`).
- Returns `action_link` + `email_otp` to the browser (`:126-143`) — a full login token for any tenant user.

**Fix:**
1. **Company binding:** after fetching the target profile, reject with 400 if `profile.company_id !== target_company_id`.
2. **Read-only enforcement:** true server-side read-only sessions are hard with Supabase magic links. Two acceptable options — pick one and document the choice:
   - **Option A (recommended, simple):** drop the fiction. Remove `mode` from the UI, treat every impersonation as full-access, and rely on the existing mandatory reason + audit log + session expiry. Rename the UI label from "Read-only" to "Full session (audited)".
   - **Option B (real read-only):** add an `impersonation_read_only` flag on the session JWT (custom claim via a hook or a column the RLS helpers read), and make the write-path RLS policies reject mutations when the claim is set. This is a large RLS change — only do it if read-only mode is a real product requirement.
3. **Minimize token exposure:** prefer returning only the `action_link` and navigating to it immediately; stop returning `email_otp` to the client unless the OTP flow is actually used by the UI.

**Double-checks:**
- [ ] Attempt impersonation with a `target_user_id` from company A and `target_company_id` of company B → must 400.
- [ ] If Option A: grep the frontend for `read_only` in console routes — no user-facing mention remains. If Option B: attempt a mutation (e.g. edit a lead) inside a read-only session → blocked by RLS, and the attempt appears in the audit log.
- [ ] `platform_impersonation_sessions` row written for every session with reason, mode, expiry.

---

## 🔴 H3 — `platform-query-runner`: unverifiable SQL sandbox, missing RPC, 3-string blocklist

**Where:** `leadenthrella/supabase/functions/platform-query-runner/index.ts:46` (blocklist) and its call to RPC `run_diagnostic_query` — **which is defined in no migration in the repo**.

**Problem:** The function claims read-only / 5-second timeout / row-cap guarantees, but:
1. The backing RPC `run_diagnostic_query` does not exist in version control. It was either hand-created on the live DB (untracked drift — its privilege and definition are unknown) or the feature is silently broken.
2. The edge function's own guard is a substring blocklist of only `DROP DATABASE`, `ALTER SYSTEM`, `DROP EXTENSION`. The RPC runs as **service_role**, so if it executes arbitrary SQL, the operator can `DELETE FROM leads`, read `company_secrets` ciphertext, etc. — nothing in the repo enforces "read-only".

**Fix:**
1. **Inspect the live DB first:** run `\df+ run_diagnostic_query` (or query `pg_proc`) on production. Capture its exact definition, owner, and `SECURITY DEFINER` status into the audit trail.
2. **Bring it into version control:** write a proper migration defining `run_diagnostic_query` with hard guarantees:
   - `SECURITY DEFINER`, owned by a dedicated minimal-privilege role, `SET search_path = public`.
   - Force read-only inside the function: `SET LOCAL transaction_read_only = on` (rejects all writes at the engine level, not by string matching).
   - `SET LOCAL statement_timeout = '5s'`.
   - Reject multiple statements (only a single `SELECT`/`WITH`/`EXPLAIN` after trimming).
   - Enforce the row cap server-side (`LIMIT` injection or cursor fetch of N rows), not just in the UI.
   - Revoke access to `company_secrets`, `auth.*`, and Vault tables by explicit schema/table denylist inside the function.
3. Log every execution to `platform_audit_logs` (already partially done — confirm the query text is stored).

**Double-checks:**
- [ ] From the console Data Ops page: run `DELETE FROM companies` → must fail with a read-only error, and the attempt must appear in the audit log.
- [ ] Run a `pg_sleep(10)` query → must time out at ~5s.
- [ ] Run a query returning >100 rows → capped at the server, not the browser.
- [ ] `SELECT * FROM company_secrets` → denied.
- [ ] Migration file exists in `supabase/migrations/` and has been applied to production (record the date applied in `Files/WORKLOG.md`).

---

## 🔴 H4 — WhatsApp webhook HMAC verification skipped when secret is unset

**Where:** `cerebyl-whatsapp-worker/src/index.ts:302-308`

**Problem:** If `WHATSAPP_APP_SECRET` is not configured, signature verification is **skipped** and any internet caller can POST fake inbound WhatsApp events: leads injected into companies, the bot replies (burning the tenant's Meta spend and Gemini tokens), template statuses forged. The code comment says the secret "MUST be configured before any real client goes live" but nothing enforces that.

**Fix:**
1. **Immediately:** verify in the Cloudflare dashboard / `wrangler secret list` that `WHATSAPP_APP_SECRET` is set for the production worker. If not, set it and redeploy.
2. **Fail closed in code:** if the secret is unset, reject webhook POSTs with 500 (misconfiguration) instead of skipping verification. Keep an explicit env flag (e.g. `ALLOW_INSECURE_WEBHOOK=1`) for local dev only, and make production refuse to start with it set.

**Double-checks:**
- [ ] POST to `/webhook` with a bogus signature → 401.
- [ ] POST with no signature → 401.
- [ ] Temporarily unset the secret in a staging worker → webhook rejects all POSTs.
- [ ] Meta dashboard still shows successful deliveries after the change (valid signature path works).

---

## 🔴 H5 — Confirm the MFA-for-admin migration is live on the production DB

**Where:** `leadenthrella/supabase/migrations/20260722130000_require_mfa_for_platform_admin.sql` — carries a "DO NOT RUN THIS UNTIL…" header; migrations are applied manually.

**Problem:** If this migration was never applied to production, `is_platform_admin()` passes at AAL1 and **all** direct console table access (companies, profiles, audit logs, DLQ, error log, bug reports) is reachable with a pre-MFA session. H1 then extends to the entire console data surface.

**Fix / verification:**
1. On production, run: `select proname, prosrc from pg_proc where proname = 'is_platform_admin';` — confirm the function body contains the `aal = 'aal2'` check.
2. If missing: apply the migration manually, following its own header instructions, and record the application in `Files/WORKLOG.md`.

**Double-check:**
- [ ] With an AAL1 session, a direct PostgREST read of `companies` as a platform admin returns 0 rows / 403; after AAL2 it succeeds.

---

## 🟡 M1 — Unauthenticated, unthrottled INSERT on `platform_error_log`

**Where:** `migrations/20260812150000_platform_error_log_anon_insert.sql:13-17`

**Problem:** Anon crash capture is intentional, but the policy lets any unauthenticated party insert unlimited rows with arbitrary `message`/`context` content — log-table spam and storage cost.

**Fix:**
- Add a size guard via a `CHECK` or trigger (e.g. reject `context` payloads > 8KB).
- Add rate limiting: easiest is a per-IP throttle in a thin edge function that the client error reporter calls instead of writing PostgREST directly; alternatively a trigger-based count cap per minute.
- Keep the existing constraint (`company_id IS NULL AND user_id IS NULL`).

**Double-check:** script 200 rapid anonymous inserts → throttled/rejected after the cap; legit crash from the app still lands.

---

## 🟡 M2 — Lead-intake sender allowlist fails open

**Where:** `cerebyl-lead-intake/src/sender-auth.ts:91` — `if (list.length === 0) return { ok: true }`

**Problem:** Any company that never configures `allowed_sender_domains` accepts inbound leads from anyone at the guessable `{slug}@leads.cerebyl.com` address.

**Fix:**
1. Audit: query which live companies have an empty allowlist and decide per company (configure or disable intake).
2. Consider flipping the default to **reject when intake was never explicitly enabled** (separate `intake_enabled` flag), while keeping empty-allowlist = accept-any only as an explicit opt-in.

**Double-check:** send a test email from a non-allowlisted domain to a company with an empty list → behavior matches the chosen policy and is logged in `lead_intake_log`.

---

## 🟡 M3 — Filter injection in whatsapp-worker PostgREST URLs

**Where:** `cerebyl-whatsapp-worker/src/index.ts:157` (`name=eq.${data.templateName}`) and `supabase.ts:48` (`filterVal` interpolation)

**Problem:** Raw values interpolated into PostgREST query strings; a `&` or `,` in a template name can rewrite the filter. Only reachable past the HMAC gate, but becomes live if H4 is unfixed.

**Fix:** `encodeURIComponent()` every interpolated filter value (the pattern already exists at `bot.ts:1280` — apply it everywhere).

**Double-check:** unit-test with a template name containing `&status=eq.APPROVED` → query behaves as a literal match.

---

## 🟡 M4 — Fake controls presented as real (operator trust hazard)

**Where:**
- `console.switchboard.tsx:41-45` — 4 "circuit breaker" switches are local `useState`; they persist and control nothing.
- `console.ai-ops.tsx:24-45` — latency, cache-hit rate, tool stats hardcoded; "Purge KV cache" buttons are `setTimeout` + success toast.
- `console.whatsapp-ops.tsx:92,102` — fleet number count and "TIER_250" hardcoded.

**Problem:** During an incident an operator may believe they paused WhatsApp sync or purged a cache when nothing happened. This is a security-relevant UX bug, not just polish.

**Fix:** interim — mark them clearly as "coming soon" / disabled. Proper fix is Feature F1/F4 below (real kill-switches and real AI telemetry), which replaces these controls entirely.

**Double-check:** toggling a breaker writes a row to the backend (after F1) and appears in `platform_audit_logs`.

---

## 🟢 L1 — CORS `*` on whatsapp-worker
`cerebyl-whatsapp-worker/src/index.ts:174-178`. Bearer-token API so low risk, but align with acrowell's allowlist pattern (`acrowell-ai-worker/src/index.ts:104-127`).

## 🟢 L2 — `claim_ai_usage` fails open on outage
`acrowell-ai-worker/src/index.ts:185-189` — usage-service 5xx = unlimited Gemini spend. Add a fallback: after N consecutive claim failures for a user/company, start rejecting with 503 instead of allowing.

## 🟢 L3 — Entitlement default is fail-open
No `company_features` row ⇒ feature treated as allowed+enabled (`use-features.ts`, migration `20260719120000:54-56`). Flip the default for **new** features to fail-closed; portal functions already re-check fail-closed.

## 🟢 L4 — PII minimization pass on console surfaces
Cross-tenant name/phone search (`console.users.tsx`), raw webhook payloads (DLQ modal), raw error `context` JSON, and IPs + operator emails in the audit CSV export. Given the DPDP claims on `console.security.tsx`, add: masking of phone numbers in list views (reveal on click, audit-logged), truncation of error contexts, and a warning footer on CSV exports.

---

## Verification checklist (run the whole list after all fixes)

| # | Check | Expected |
|---|---|---|
| 1 | curl `platform-impersonate` with AAL1 JWT | 403 |
| 2 | Impersonate with mismatched user/company ids | 400 |
| 3 | Data Ops: `DELETE FROM companies` | read-only error + audit row |
| 4 | Data Ops: `pg_sleep(10)` | times out ~5s |
| 5 | Live DB: `run_diagnostic_query` definition reviewed + in a migration | done |
| 6 | Live DB: `is_platform_admin` body contains `aal2` | done |
| 7 | WhatsApp webhook with bad/no signature | 401 |
| 8 | 200 anon inserts to error log | throttled |
| 9 | Switchboard toggle → backend row + audit log (after F1) | done |
| 10 | Full console smoke test as a real operator (AAL2) | all pages functional |

---

# PART 2 — NEW BACKEND SYSTEMS & FEATURES

Ordered by ROI. Each includes data model, backend, UI surface, and acceptance criteria. Existing tables/hooks noted so the developer builds on what's there instead of duplicating.

---

## F1 — Real platform kill-switches (replaces the fake circuit breakers) ⭐ start here

**Why:** incident response. Today there is no way to actually pause WhatsApp sync, AI, or lead intake.

**Data model** — new migration `platform_flags`:
```
key text primary key,           -- e.g. 'ai_enabled', 'whatsapp_sync_enabled', 'lead_intake_enabled', 'pdf_degraded_mode'
enabled boolean not null default true,
updated_by uuid references auth.users,
updated_at timestamptz,
reason text
```
RLS: select/update = `is_platform_admin()`. Workers read via service role (cache in KV for 30–60s to avoid a DB hit per request).

**Backend:**
- Workers check their flag at entry: `cerebyl-whatsapp-worker` (webhook + cron), `cerebyl-lead-intake` (email handler), `acrowell-ai-worker` (`/chat` etc. — return a friendly "temporarily disabled" response).
- `platform-purge-old-data` / DLQ replay respect `pdf_degraded_mode`-style flags where relevant.

**UI:** wire the 4 existing Switchboard toggles (`console.switchboard.tsx:41-45`) to real mutations; show `updated_by`/`updated_at`/`reason` under each switch; confirm dialog requiring a reason for disabling. Every change → `platform_audit_logs`.

**Acceptance:** toggle off `whatsapp_sync_enabled` → within 60s the worker stops processing; audit log records who/when/why; toggle back on resumes.

---

## F2 — Owner alerting & notifications

**Why:** nothing pushes to the owner today; "All Services Operational" is a static string.

**Signals to watch** (all data already exists):
- Error spike: `platform_error_log` inserts/minute above threshold.
- DLQ backlog: `platform_webhook_dlq` unresolved count > N or oldest age > X hours.
- Cron failure: `whatsapp-sync-health` non-200 (also see F4 job monitor).
- Backup failures: `company_backup_settings.last_backup_status != 'success'` or `last_backup_at` stale > 48h.
- Trials expiring within 7 days (`companies.trial_ends_at`).

**Backend:** pg_cron job (or scheduled worker) every 15 min evaluating rules from a new `platform_alert_rules` table (key, threshold, channel, enabled); dedupe via `platform_alert_events` (rule, fired_at, resolved_at). Delivery via existing email (Brevo/Resend) and/or owner WhatsApp number.

**UI:** new `console.alerts.tsx` — active alerts, history, rule editor (threshold + channel toggles). Badge on the console nav with active count; replace the static health badge on Mission Control with real aggregate status.

**Acceptance:** insert 50 synthetic error rows → alert fires once (deduped), appears in UI, email received; resolving clears it.

---

## F3 — Impersonation session manager

**Why:** the ledger (`platform_impersonation_sessions`) and an end hook (`useEndImpersonation`, `use-platform.ts:499`) already exist but have no UI.

**UI:** new `console.sessions.tsx` (or tab under console.users): active sessions table (operator, target user/company, mode, reason, started, expires, "End now" button) + history tab with filters.

**Backend:** edge function `platform-end-impersonation` — sets `ended_at`, and ideally revokes the refresh token via Supabase Admin API so "end" actually kills the session. All actions audit-logged. Add the AAL2 check (H1).

**Acceptance:** start impersonation → row appears as active → "End now" → target session's refresh token revoked, row shows ended, audit log entry written.

---

## F4 — Cron/job health monitor

**Why:** multiple pg_cron jobs (purge, WhatsApp sync, notification generators, credit recompute) run with zero visibility.

**Data model:** `platform_job_runs` (job_name, started_at, finished_at, status, duration_ms, error text, meta jsonb). RLS: platform admin read; service role write.

**Backend:** small shared wrapper each cron/edge job calls (start → run → record). For pg_cron jobs, wrap the SQL in a function that logs to the table.

**UI:** new `console.jobs.tsx` — per-job card: last run status, last success time, avg duration, failure count 7d; detail drawer with recent run history and error text. Feed the Mission Control health badge from this (replacing the static string).

**Acceptance:** force a job failure → red card with error text within one cycle; healthy jobs show green with real timestamps.

---

## F5 — AI limits & pricing admin (makes AI Ops real)

**Why:** `ai_limits` (per-user/company daily caps, ₹ price per message/image/pdf, enable flag) is only editable via manual SQL; the AI Ops page shows hardcoded telemetry.

**UI:** rework `console.ai-ops.tsx`:
- Real data from `assistant_usage`: per-company MTD actions + cost (already there), plus per-user split, `billable_kind` breakdown, trend chart.
- Limits editor: table of companies/users with daily cap, per-unit prices, enabled toggle → mutations to `ai_limits` (RLS already restricts writes to service role — add a `platform-manage-ai-limits` edge function with AAL2 check).
- Remove hardcoded latency/cache-hit/tool-stats until real instrumentation exists.

**Acceptance:** lower a company's daily cap to 1 → second AI action that day is rejected by `claim_ai_usage`; console reflects the new cap immediately.

---

## F6 — Backup health & control

**Why:** backups are tenant-self-service; console is blind.

**UI:** new card/tab on `console.companies.$companyId.tsx` (or a fleet view): `last_backup_at`, `last_backup_status`, Google-connected state from `company_backup_settings`; fleet-wide "backups failing" filter on the companies list; "Trigger backup now" button.

**Backend:** `platform-trigger-backup` edge function that enqueues/invokes the existing `backup-run` for a company (service role, AAL2, audit-logged).

**Acceptance:** fleet view flags a tenant whose `last_backup_at` is 7 days stale; trigger button produces a new `last_backup_at` within minutes.

---

## F7 — Tenant lifecycle & DPDP tooling

**Why:** trial expiry, offboarding, and erasure are manual SQL today; DPDP claims require better.

**Pieces:**
1. **Trials:** console list of trials expiring in 7/3/1 days (from `companies.trial_ends_at`) with status; feeds F2 alerts.
2. **Tenant data export:** `platform-export-tenant` edge function producing a ZIP (CSV/JSON per table + storage manifest) to a signed URL; audit-logged; AAL2.
3. **Guided erasure:** UI wrapper over the existing `terminated_company_retention` purge pipeline — type-to-confirm company name, dry-run mode showing row counts first, then execute; every step audit-logged.
4. **Consent visibility:** read-only view of `consent_log` per company (DPDP first-login consent already recorded).

**Acceptance:** dry-run erasure on a test company shows correct row counts; real run purges and writes the full audit trail; export ZIP downloads and contains the company's data.

---

## F8 — WhatsApp fleet ops (replace hardcoded cards)

**Why:** `console.whatsapp-ops.tsx:92,102` shows literal "1" and "TIER_250".

**UI:** real per-tenant aggregates from existing tables: connected numbers (`company_whatsapp_numbers`), 30d message volume (`whatsapp_messages`), campaign spend (`whatsapp_campaigns.cost_inr`), opt-outs (`whatsapp_opt_outs`), last `whatsapp-sync-health` cron result. Keep the DLQ inspector as-is (it's real).

**Acceptance:** every number on the page traces to a query; sending a test campaign moves the spend figure.

---

## F9 — Per-company announcement targeting

**Why:** schema supports `target_type='companies'` + `target_ids`, UI hardcodes `target_ids: []`.

**UI:** company multi-select in the Switchboard composer when target = "Specific companies".

**Acceptance:** announcement targeted at company A appears only for company A's users.

---

## F10 — Abuse / rate-limit dashboard

**UI:** new tab on `console.security.tsx` or its own page: per-tenant request/AI volume outliers (from `assistant_usage` + audit), failed-login counts (Supabase auth logs if accessible, else app-level), SQL-sandbox usage (from `platform_audit_logs` where action = `sql_sandbox_exec`), anon error-log insert volume (ties to M1).

**Acceptance:** each widget traces to a real query; sandbox usage list matches audit log.

---

## Suggested build order

1. **Week 1:** H1–H5 (security fixes) + M4 interim labels. Small, surgical, highest risk reduction.
2. **Week 2:** M1–M3, L1–L3. Then **F1** (kill-switches) — it also permanently resolves M4.
3. **Week 3–4:** **F2** (alerting) + **F4** (job monitor) — together they replace the fake health badges with real operational signal.
4. **Then:** F3, F5, F6 per appetite; F7 when the first offboarding/erasure request looms; F8–F10 as polish.

---

*Audit method note: findings are from repo source. Because migrations are applied manually and the live DB is drifted, every DB-side fix must be verified on production (the double-check lists above say exactly how) and each manual migration application recorded in `Files/WORKLOG.md`.*
