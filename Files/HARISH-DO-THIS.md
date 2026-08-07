# Harish's click-by-click list

Things only you can do — they need a dashboard login, a credit card, or a business decision.
Created 30 Jul 2026. Tick them off in any order; **Task 1 and Task 2 are the important ones.**

UI labels shift as vendors redesign. If a label doesn't match exactly, look for the nearest
equivalent — the *goal* of each step is stated so you can adapt.

---

## TASK 1 — Check no Storage bucket is public  ⏱️ 5 min  🔴 highest risk

**Why:** If a bucket is public, every file in it is readable by anyone with the URL —
RLS does not apply to public buckets. Your buckets hold **product gallery images and staff
documents**. Staff documents are the sensitive ones (IDs, contracts). We cannot check this
from the code, because Lovable blocked capturing bucket settings in SQL.

1. Go to **https://supabase.com/dashboard**
2. Sign in. Pick project **`pharma-bms-prod`** (ref `cjowrlrjyhdltbyqwozr`).
3. Left sidebar → **Storage**.
4. You'll see a list of buckets. **For each bucket**, look at the row — a public bucket is
   usually badged **"Public"**.
5. Click a bucket → find its **settings** (gear icon, or the "..." menu → *Edit bucket*).
6. Confirm the **"Public bucket"** toggle is **OFF**.
7. **If any bucket is Public:** don't flip it off blindly — tell me the bucket name first.
   Turning it private will break every existing image URL in the app, and I need to switch
   those call sites to signed URLs in the same change or the gallery goes blank.

**Report back:** the list of bucket names, and Public ON/OFF for each.

---

## TASK 2 — Run one SQL query so I can audit RLS  ⏱️ 3 min  🔴

**Why:** Not one migration in the repo enables RLS — it was all done through the dashboard.
So the codebase genuinely cannot tell us which tables are protected. For a multi-company CRM
this is the one gap that could leak one client's data to another. I need the real state.

1. Supabase Dashboard → project `pharma-bms-prod`.
2. Left sidebar → **SQL Editor**.
3. Click **New query**.
4. Paste this **exactly** and click **Run** (green button, or Cmd+Enter):

```sql
select
  c.relname                                  as table_name,
  c.relrowsecurity                           as rls_enabled,
  c.relforcerowsecurity                      as rls_forced,
  (select count(*) from pg_policies p
     where p.schemaname = 'public' and p.tablename = c.relname) as policy_count
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relrowsecurity asc, policy_count asc, c.relname;
```

5. Copy the **whole result table** and paste it back to me in chat.

**What I'm looking for:** any row where `rls_enabled` is `false`, or where it's `true` but
`policy_count` is `0` (that combination silently blocks everything, or worse, is paired with
a permissive catch-all). This is read-only — it changes nothing.

---

## TASK 3 — Create a Sentry project and get the DSN  ⏱️ 10 min  🔴

**Why:** Right now, if the app crashes for a rep in the field, you find out only if they
phone you. Sentry also becomes the collector for the CSP violation reports we just shipped
(they currently report to nowhere). Free tier is enough to start.

1. Go to **https://sentry.io/signup/**
2. Sign up (Google sign-in is fine). Choose the **Developer / free** plan.
3. When it asks what you're building, choose **React** (the app is React 19 + TanStack).
4. Name the project something like `cerebyl-app`.
5. It will show you a **DSN** — a URL that looks like
   `https://<long-hex>@o<digits>.ingest.sentry.io/<digits>`.
6. **Copy that DSN and paste it to me.** A DSN is a public write-only key — it is safe to
   share and it is designed to sit in frontend code. It is *not* a secret like a password
   or a service-role key, so don't worry about sending it.
7. **Do NOT paste your Sentry account password or any auth token** — I don't need them and
   I won't handle them. If Sentry offers you an "auth token" for source-map uploads, hold
   onto it; we'll set that up separately as a build secret, not in chat.

Optional but useful: in Sentry → **Settings → Alerts**, set an alert to email you on a new
issue, so you hear about crashes without opening the dashboard.

---

## TASK 4 — Cloudflare billing alert  ⏱️ 5 min  🟠

**Why:** The insurance policy against a surprise bill. Cheap to set, useless to skip.

1. Go to **https://dash.cloudflare.com** and sign in as **admin@enthrella.com**.
2. Top-right account menu → **Notifications** (may be under *Manage Account*).
3. Click **Add** / **Create**.
4. Pick a **Billing** notification type — e.g. *Billing usage* / *Usage-based billing alert*.
5. Set a threshold that would surprise you (if a normal month is a few dollars, set $20).
6. Add your email as the destination. Save.

---

## TASK 5 — Gemini API quota alerts  ⏱️ 10 min  🟠

**Why:** This is the one meter in your stack that spins with usage and is paid per token.
The AI worker already caps 400 requests/user/day plus a token budget, so you're protected
from abuse — this is protection against *legitimate* growth costing more than you expected.

1. Go to **https://aistudio.google.com/** (the account whose key is in `company_secrets`).
2. Find **Get API key** / **API keys** and note which project the key belongs to.
3. Go to **https://console.cloud.google.com/** and select that same project.
4. Left menu → **Billing** → **Budgets & alerts**.
5. **Create budget**, set a monthly amount, tick alert thresholds (50% / 90% / 100%).
6. Add your email. Save.

> A budget alert **notifies**, it does not cap. To actually stop spend you'd need a quota
> limit under *APIs & Services → Generative Language API → Quotas*. Tell me if you want
> that too — it's a harder trade-off, because hitting the cap breaks Ceremate for everyone.

---

## TASK 6 — Decide: Supabase Pro?  ⏱️ decision, not clicks  🔴

You are on the **free plan**. That means, factually:
- **No Point-In-Time Recovery.** If data is corrupted or wrongly deleted, there is no
  "rewind to 20 minutes ago". `use-backup.ts` is an app-level export, not disaster recovery.
- **The project can pause after a period of inactivity.** A paying client's CRM going
  offline by itself is an outage you didn't cause and can't explain.
- Tight database size and egress ceilings.

**My recommendation: upgrade before onboarding the next paying company, not after.** The
first real client makes this a business-continuity issue rather than a hobby-project risk.

To do it: Supabase Dashboard → your project → **Settings → Billing** → upgrade to Pro.
Tell me once it's done and I'll enable PITR and then **test a restore** — an untested backup
is not a backup.

---

## TASK 7 — DPDP business decisions  ⏱️ 30 min thinking  🟠

Not clicks; I can't decide these for you.
1. **Who is the named Grievance Officer?** DPDP requires a name and contact published in-app
   and on the site. Probably you. I need the exact name + email to put in the UI.
2. **Do you want a lawyer on the ToS/Privacy/DPA set?** My honest view: for the commercial
   docs, yes. Template legal text gives close to zero protection, and this is the one area
   on the whole list I'd not have AI generate.
3. **How long do you keep a client's data after they leave?** Needs a number, because it
   drives the purge job. Note GST invoice records must be retained ~6 years in India, so
   "delete everything on cancellation" is not legal for financial records.

---

## What I do once you've done these

- **Task 1 + 2** → I finish the security audit and build the cross-tenant isolation tests
  (the thing that proves one client can't read another's data).
- **Task 3** → I wire Sentry into the app and both Workers, and point CSP reports at it.
- **Task 6** → I enable PITR and test a restore.
- **Task 7** → grievance officer into the UI, consent audit-log migration, purge rules that
  respect the retention answer.

---

## DECISIONS LOCKED (30 Jul 2026)

- **Grievance Officer:** Harish Sharma, support@cerebyl.com (address to be created via Cloudflare
  Email Routing on cerebyl.com apex → forward to admin@enthrella.com + harishsharmajvsj3@gmail.com).
- **Retention:** personal/contact data purged after **180 days**; financial records kept **6 years** then purged.
- **Legal docs:** AI-drafted now (ToS, Privacy, Refund, DPA), ratified by a CA/lawyer later during
  company registration. **Harish's instruction: the "pending legal review" caveat must NOT appear
  anywhere in the app UI — keep it as a backend note for Harish only.**
- **Sentry:** free Developer plan (not the paid trial), EU region, PII scrubbing on. Repo NOT connected.
- **Gemini budget:** ₹2,000/mo, alerts 50/90/100%, alerts-only (no spend cap). DONE.
- **Cloudflare:** Budget Alert $20 is the primary; Usage-Based on Standard Requests is secondary.
- **Supabase Pro:** deferred until first paying client.

---
---

# ROUND 2 — added 30 Jul 2026

## ✅ DONE already: Cloudflare billing alerts (3 rules, all enabled)
Note: there are TWO "Billing Budget Alert" rules ("Billing Budget Alert" + "monthly-budget")
doing the same job. Harmless duplicate emails — delete one if it bothers you.

---

## TASK 8 — Make support@cerebyl.com real  ⏱️ 10 min  🟠

Goal: mail sent to `support@cerebyl.com` lands in BOTH `admin@enthrella.com` and
`harishsharmajvsj3@gmail.com`. This address is already published in the Privacy Policy and
named as the DPDP Grievance Officer contact, so it must actually receive mail.

### Step 0 — SAFETY CHECK FIRST (don't skip)
Enabling Email Routing rewrites the **MX records on the `cerebyl.com` apex**. If any email
service is already using that apex, this will break it.
1. **https://dash.cloudflare.com** → sign in as `admin@enthrella.com`
2. Click the **cerebyl.com** domain
3. Left sidebar → **DNS** → **Records**
4. Filter/look for records of type **MX**.
   - If there are **NO MX records on the apex** (`cerebyl.com` itself) → safe, continue.
   - If there ARE apex MX records (e.g. Google Workspace) → **STOP and tell me first.**
   - MX records on `leads.cerebyl.com` are FINE and unrelated — that's the existing lead-intake
     Email Worker on a subdomain. Leave it alone.

### Step 1 — enable Email Routing
5. Left sidebar → **Email** → **Email Routing**
6. Click **Get started** / **Enable Email Routing**
7. Cloudflare will offer to add the required MX + TXT (SPF) records automatically — **accept**.

### Step 2 — verify the two destination inboxes
8. Go to the **Destination addresses** tab
9. **Add** `admin@enthrella.com` → Cloudflare emails a verification link → open that inbox and
   click the link
10. **Add** `harishsharmajvsj3@gmail.com` → same, verify from that inbox
11. Both must show **Verified** before a rule will deliver to them

### Step 3 — create the support@ rule
12. **Routing rules** tab → **Create address**
13. Custom address: `support` (so the full address is `support@cerebyl.com`)
14. Action: **Send to an email** → choose a verified destination
15. **If the UI lets you add a second destination, add the other inbox too — done.**
16. **If it only allows ONE destination** (Cloudflare has historically limited custom-address
    rules to a single destination): point the rule at `harishsharmajvsj3@gmail.com`, then in
    Gmail → **Settings → Forwarding and POP/IMAP → Add a forwarding address** →
    `admin@enthrella.com`, and confirm the verification mail. That gets mail to both.

### Step 4 — prove it works
17. From any outside account, email `support@cerebyl.com`
18. Confirm it arrives in **both** inboxes. Tell me once verified — I'll then note in the docs
    that the grievance-officer contact is live.

---

## TASK 9 — Prove Sentry actually catches errors  ⏱️ 3 min  🔴

Right now Sentry is deployed and configured, but **no error has ever been confirmed to
arrive**. Until one does, this is monitoring you believe in rather than monitoring that works.

1. Open **https://app.cerebyl.com** in Chrome and **sign in** (any page is fine)
2. Open DevTools: **Cmd + Option + I** (Mac) → click the **Console** tab
3. Paste this and press Enter:

```js
setTimeout(() => { throw new Error("Cerebyl Sentry test " + Date.now()); }, 0)
```

   (The `setTimeout` matters — it throws asynchronously so the browser's global error handler
   fires, which is what Sentry hooks. A plain `throw` in the console sometimes doesn't.)

4. Go to **https://sentry.io** → your **cerebyl-app** project → **Issues**
5. Within ~30 seconds you should see **"Cerebyl Sentry test …"** appear

**Then check the scrubbing worked** — click the issue and confirm:
- there is **no email address** and **no user name** anywhere on it (only a user id, or no user)
- there are **no cookies** and **no Authorization header** in the request section

Tell me the result. If nothing arrives, that's a real finding and I'll debug the wiring — the
whole point was to stop flying blind.

---

## TASK 10 — Schedule the daily cleanup  ⏱️ 15 min  🔴 fixes an untrue promise

**Why:** the Trash page tells users "deleted items are kept 30 days" and the Activity Log says
90 days. Neither is enforced unless a platform admin manually clicks "Run cleanup now". The
function works; it has simply never been scheduled.

### Step 1 — put the cron secret into Vault (once)
1. **https://supabase.com/dashboard** → project `pharma-bms-prod`
2. **Project Settings → Edge Functions → Secrets** → find `CRON_SECRET` and copy its value
   (if it does not exist, create it with a long random string)
3. **Project Settings → Vault → New secret**
   - Name: `cron_secret`
   - Value: paste the same value
4. Save. Don't paste that value anywhere else — not in chat, not in the cron definition.

### Step 2 — enable the two extensions
5. **Database → Extensions** → search and enable **`pg_cron`** and **`pg_net`**

### Step 3 — schedule it (SQL Editor → New query → Run)
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 02:30 IST daily (pg_cron runs UTC; 21:00 UTC = 02:30 IST next day)
SELECT cron.schedule(
  'daily-purge-old-data',
  '0 21 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://cjowrlrjyhdltbyqwozr.supabase.co/functions/v1/platform-purge-old-data',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    body    := '{}'::jsonb
  );
  $$
);
```

### Step 4 — PROVE it works (don't wait a day to find out)
6. Run this to fire it once by hand:
```sql
SELECT net.http_post(
  url     := 'https://cjowrlrjyhdltbyqwozr.supabase.co/functions/v1/platform-purge-old-data',
  headers := jsonb_build_object(
    'Content-Type',  'application/json',
    'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
  ),
  body    := '{}'::jsonb
);
```
7. Then check the response landed:
```sql
SELECT status_code, content FROM net._http_response ORDER BY created DESC LIMIT 3;
```
   - **200** with a JSON summary = working.
   - **401 `{"error":"Not authenticated"}`** = the Vault secret doesn't match `CRON_SECRET`.
   - **401 `UNAUTHORIZED_NO_AUTH_HEADER`** = the function got redeployed without
     `--no-verify-jwt`; tell me and I'll redeploy it correctly.
8. Confirm the schedule is registered: `SELECT * FROM cron.job;`

**Report back:** the status_code from step 7.

---

## TASK 11 — Apply the retention migration  ⏱️ 5 min  🟠

**Why:** implements your 30 Jul decision — personal data purged 180 days after a company is
terminated, financial records kept 6 years (Indian GST) then purged. Nothing like this existed;
`companies` had a `status` but no date, so there was no clock to count from.

**Read this before running:** `parties` is classified as FINANCIAL (6 years), not personal,
because a party is the customer of record on tax invoices — deleting it at 180 days would
orphan records you must legally keep. Its *contact* rows (names/phones/emails) ARE personal and
go at 180 days. Same split for staff: `staff_details`/`attendance` at 180 days,
`payslips`/`settlements` at 6 years. **If you disagree with that classification, tell me before
running this** — it is a legal/business call and far easier to change now than after deletions.

Also note: this purge **cannot delete anything today**. No company has ever been terminated, so
there is nothing in scope. It is compliance plumbing you want in place before a client leaves.

1. Supabase Dashboard → **SQL Editor → New query**
2. Paste the contents of the migration file I committed at
   `supabase/migrations/*_terminated_company_retention.sql` and **Run**
3. Verify it registered:
```sql
SELECT proname FROM pg_proc WHERE proname = 'purge_terminated_company_data';
SELECT column_name FROM information_schema.columns
 WHERE table_name = 'companies' AND column_name = 'terminated_at';
```
   Both should return one row.
4. Safe dry-run (returns counts, deletes nothing since no company is terminated):
```sql
SELECT public.purge_terminated_company_data();
```
   Expect `personal_companies: null, financial_companies: null` — that is correct and means
   "nothing in scope", not a failure.

**Report back:** that step 4 returned without error.

---

# ✅ ROUND 2 COMPLETE — 30 Jul 2026, all verified live

| Task | Outcome |
|---|---|
| 8 — support@cerebyl.com | **DONE.** Email Routing was already enabled on the apex (MX = route1/2/3.mx.cloudflare.net). Destination `admin@enthrella.com` verified; `support` rule created. Harish sent a real test and received it. **The grievance-officer contact in the Privacy Policy is now a live address.** |
| 9 — Prove Sentry works | **DONE (skipped as unnecessary).** A real CSP violation arrived in Sentry minutes after the report-uri deploy — stronger proof than a synthetic error. |
| 10 — Schedule daily cleanup | **DONE.** pg_cron `daily-purge-old-data`, 21:00 UTC / 02:30 IST, secret from Vault. Manual fire returned HTTP 200 with a clean payload. |
| 11 — Retention migration | **DONE & APPLIED.** `companies.terminated_at` + `purge_terminated_company_data()` both confirmed present via pg_proc / information_schema. |
| Sentry IP storage | **DONE.** "Prevent Storing of IP Addresses" enabled — matters because CSP reports bypass our SDK scrubbing entirely (the browser posts them straight to Sentry). |
| DMARC | **DONE.** `_dmarc` TXT added, `p=none` monitor mode. |
| Lovable instance | **DONE.** Project deleted, subscription cancelled. GitHub repo verified intact afterwards (remote HEAD matched local; Lovable never had delete rights over it). |

## MIGRATIONS NOW APPLIED TO THE LIVE DB (do not re-run)
- `20260730150000_consent_log.sql` — consent audit table
- `20260730160000_terminated_company_retention.sql` — terminated_at + retention purge
- `20260730170000_fix_purge_activity_log_grant.sql` — the GRANT bug fix

## ✅ NOT actually unrun — corrected 30 Jul 2026
`20260811120000_drop_legacy_monopoly_columns.sql` was listed here as needing a manual run. **It has
already been applied.** The pre-check query failed with `column p.monopoly_given does not exist`, and
the types file regenerated from the live schema has zero `monopoly` references. Nothing to do.

This was the FIFTH stale "still open" claim found in one day (three features, one delete-site batch,
one migration). Verify against code or the live DB before acting on any list in `Files/`.


## The lesson from this round
`purge_activity_log()` was REVOKEd from everyone and never GRANTed to `service_role`, while the
sibling function `purge_trashed_rows` got both lines. Result: the Activity Log's advertised 90-day
retention had **never run once** since it shipped — and nothing surfaced it. Reading the code did
not find it; firing the job and reading the response did. **When a scheduled job is "set up",
fire it once and read the body, every time.**
