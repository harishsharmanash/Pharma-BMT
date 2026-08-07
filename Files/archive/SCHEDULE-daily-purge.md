# Scheduling the daily cleanup (`platform-purge-old-data`)

**Status 2026-07-28.** The function purges trashed rows older than 30 days (`purge_trashed_rows`), activity-log rows older than 90 days (`purge_activity_log`), plus bug reports, their storage files and the crash log. **Nothing calls it on a schedule yet** — it only runs when a platform admin presses "Run cleanup now" in the console.

Until it is scheduled, the Trash page's "30 days" and the Activity Log's "90 days" are true only when someone clicks that button.

> ### ⚠️ Fixed 2026-07-28 — the scheduling SQL below could never have worked before today
> The function was deployed with `verify_jwt: true`, so Supabase's **gateway** rejected any request without a JWT *before the function ran*. A pg_cron job sending only `x-cron-secret` got
> `401 UNAUTHORIZED_NO_AUTH_HEADER` — the cron job would have registered happily and silently never done anything.
>
> It is now deployed with `--no-verify-jwt`, so the function's own check is the gate (a valid `CRON_SECRET`, or a platform-admin JWT). Verified after the change: no auth → `401 {"error":"Not authenticated"}` from the function, wrong secret → same. Nothing is publicly callable.
>
> **Any future redeploy MUST pass the flag**, or the gateway check comes back and the cron silently dies again:
> ```
> npx supabase functions deploy platform-purge-old-data --no-verify-jwt
> ```

---

## Option A — pg_cron inside Supabase (preferred)

Runs entirely in your own infrastructure. Needs the `pg_cron` and `pg_net` extensions
(Dashboard → Database → Extensions).

**The secret never goes into chat and never gets pasted into the cron definition.** Put it in Vault
once, then the job reads it from there — so `cron.job` holds no credential and nobody has to
re-paste it if the schedule is ever rebuilt.

### Step 1 — put CRON_SECRET into Vault (once, by Harish)
Dashboard → Project Settings → Vault → **New secret**
- Name: `cron_secret`
- Value: the same value as the `CRON_SECRET` edge-function secret
  (Dashboard → Edge Functions → Secrets). Copy it across; don't type it anywhere else.

### Step 2 — schedule it (SQL Editor)
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 02:30 IST daily (pg_cron runs in UTC; 21:00 UTC = 02:30 IST next day).
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

### Step 3 — prove it actually works, don't assume
Fire it once by hand and read the response, rather than waiting a day to find out:

```sql
SELECT net.http_post(
  url     := 'https://cjowrlrjyhdltbyqwozr.supabase.co/functions/v1/platform-purge-old-data',
  headers := jsonb_build_object(
    'Content-Type',  'application/json',
    'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
  ),
  body    := '{}'::jsonb
) AS request_id;

-- a few seconds later — status_code MUST be 200
SELECT status_code, content::text
FROM net._http_response
ORDER BY created DESC
LIMIT 1;
```

`200` with an `{"ok":true,...}` body means it is genuinely wired.
`401 {"error":"Not authenticated"}` means the Vault value does not match `CRON_SECRET`.

Check it registered:

```sql
SELECT jobid, schedule, jobname, active FROM cron.job WHERE jobname = 'daily-purge-old-data';
```

Remove it later with `SELECT cron.unschedule('daily-purge-old-data');`

### If pg_cron isn't available on the plan
Use **Option B** — don't try to force it.

---

## Option B — external scheduler

Any free scheduler (cron-job.org and similar) can do it:

- **Method:** POST
- **URL:** `https://cjowrlrjyhdltbyqwozr.supabase.co/functions/v1/platform-purge-old-data`
- **Header:** `x-cron-secret: <YOUR_CRON_SECRET>`
- **Body:** `{}`
- **Schedule:** once daily, off-peak

The trade-off: a third party holds a secret that can trigger deletion of already-trashed rows. Bounded — it can only purge what a user already deleted more than 30 days ago, and the secret grants nothing else — but Option A avoids it entirely.

---

## Verifying it works

The response body reports exactly what happened:

```json
{
  "ok": true,
  "deleted_reports": 0,
  "deleted_files": 0,
  "purged_trashed": [{ "table_name": "payments", "purged": 3 }],
  "purged_trashed_total": 3
}
```

`purged_trashed` lists only tables that actually had rows removed, so an empty array means nothing was old enough — that's success, not failure. If the trashed-row purge fails, `purge_trashed_error` appears and the rest of the cleanup still runs; that is deliberate, so one broken step can't block the others.

**Safe to run repeatedly** — it only ever removes rows whose `deleted_at` is already older than the cutoff.

## Safety notes

- `purge_trashed_rows(p_days)` is `SECURITY DEFINER` and granted to **service_role only** — `anon` and `authenticated` are explicitly revoked, so no user session can reach it.
- It hard-deletes from 13 tables. That is the intended behaviour and the only place in the app that hard-deletes user records.
- `order_items` and `payslips` are deliberately excluded from soft-delete entirely (child rows re-inserted on save/regenerate), so the purge never touches them.
