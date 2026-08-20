# TICKET F2-c1 — SLA breach notification generator (schema only)

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

Create ONE new migration file `supabase/migrations/20260823120000_sla_breach_notifications.sql`.
Nothing else. Do not touch any other file.

When an uncontacted 'New' lead passes its SLA deadline, every active manager/admin of that company
gets ONE notification (deduped). The reference idiom is
`supabase/migrations/20260805180000_notification_generators_for_cron.sql` (attached as --read) —
match its SECURITY DEFINER / search_path / dedupe_key / grants pattern exactly. The SLA columns
live on `public.company_settings` (`sla_hot_minutes` / `sla_warm_minutes` / `sla_cold_minutes`,
NOT NULL with defaults 15/120/1440 — but a company may have NO company_settings row, so LEFT JOIN
and COALESCE to those defaults).

## Contents (in this order)

### 0. Cleanup of a superseded mistake

An earlier draft of the F2-a migration put the SLA columns on `public.companies` and that version
was applied by hand before the correction. Drop the strays:

```sql
ALTER TABLE public.companies
  DROP COLUMN IF EXISTS sla_hot_minutes,
  DROP COLUMN IF EXISTS sla_warm_minutes,
  DROP COLUMN IF EXISTS sla_cold_minutes;
```

### 1. `generate_sla_breach_notifications_for_company(p_company_id uuid)`

Same header shape as `generate_due_notifications_for_company`:
`RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, `DECLARE cid uuid :=
p_company_id; BEGIN IF cid IS NULL THEN RETURN; END IF; …`

One INSERT … SELECT:

- FROM `public.leads l`
- `LEFT JOIN public.company_settings cs ON cs.company_id = l.company_id`
- `CROSS JOIN LATERAL (SELECT p.id FROM public.profiles p WHERE p.company_id = cid AND
  p.role IN ('manager','admin') AND p.is_active) m` — one notification per manager/admin.
- WHERE: `l.company_id = cid AND l.deleted_at IS NULL AND l.first_contact_at IS NULL AND
  l.stage = 'New'` AND the deadline has passed:

```sql
l.created_at + make_interval(mins =>
  CASE l.temp
    WHEN 'Hot'  THEN COALESCE(cs.sla_hot_minutes, 15)
    WHEN 'Cold' THEN COALESCE(cs.sla_cold_minutes, 1440)
    ELSE             COALESCE(cs.sla_warm_minutes, 120)
  END) < now()
```

- Columns: `(company_id, user_id, type, title, body, lead_id, ref_date, dedupe_key)` —
  type `'sla_breach'`; title `'SLA breached: ' || COALESCE(l.firm_name, l.name, 'lead')`; body
  names the lead, the temp (COALESCE(l.temp,'ungraded')), and whole minutes overdue
  (`EXTRACT(EPOCH FROM (now() - deadline))/60` floored — restructure so the deadline expression is
  written once in a subquery/CTE, not twice); `ref_date = l.created_at::date`;
  `dedupe_key = 'slabreach:' || l.id` (one notification per lead per manager, ever).
- `ON CONFLICT (user_id, dedupe_key) DO NOTHING;`

### 2. `generate_sla_breach_notifications_all()`

Loop `FOR r IN SELECT id FROM public.companies WHERE terminated_at IS NULL` calling the per-company
function — same shape as `generate_due_notifications_all()`.

### 3. Grants (match the reference migration's plumbing section)

- REVOKE ALL on both new functions FROM PUBLIC, anon, authenticated.
- GRANT EXECUTE on both TO service_role.
- While here, fix a known open issue from the handover: the zero-arg
  `public.generate_due_notifications()` is currently executable by anon. Add
  `REVOKE ALL ON FUNCTION public.generate_due_notifications() FROM PUBLIC, anon;`
  (its authenticated grant stays).

### 4. Schedule — commented, NOT executed (house convention, see the reference migration tail)

```sql
-- Run separately after probe-verification:
--   SELECT cron.schedule(
--     'sla-breach-notifications',
--     '*/5 * * * *',
--     $$SELECT public.generate_sla_breach_notifications_all();$$
--   );
-- SLA is a minutes-scale metric, so this runs on its own 5-minute cron, NOT inside
-- generate_notifications_all() (daily 08:00 IST is useless against a 15-minute Hot SLA).
```

## Constraints

- One file, under ~100 lines, banner style like the territory_disputes migration.
- Do NOT modify the existing generator migration. Do NOT add the call to
  `generate_notifications_all()` (see the comment above for why).
- No `db push`, no applying, no types regen, no commit.
- You cannot run commands — re-read once; check every column exists per the attached reference
  (notifications columns: company_id, user_id, type, title, body, lead_id, ref_date, dedupe_key;
  profiles columns: company_id, role, is_active; leads: company_id, deleted_at, first_contact_at,
  stage, temp, firm_name, name, created_at). Report path, line count, deviations.
