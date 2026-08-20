# TICKET F2-a — speed-to-lead schema: first_contact_at + SLA thresholds (schema only)

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

Create ONE new migration file `supabase/migrations/20260822120000_speed_to_lead.sql`. Nothing
else. Do not touch any other file.

F2 in one line: every lead gets a `first_contact_at` timestamp, and each company gets configurable
per-grade response SLAs. Later tickets build the badge, breach notify and reports on top of this.

## Contents (in this order)

### 1. `leads.first_contact_at`

```sql
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_contact_at timestamptz;
```

With a `COMMENT ON COLUMN` explaining: set once, by trigger, at the first real contact; NULL means
never contacted (or contacted before this column existed with no follow-up evidence).

### 2. Backfill — honest data only, no fabrication

```sql
UPDATE public.leads
SET first_contact_at = (LEAST of the fuN_date values whose matching fuN_status IS NOT NULL
                        AND fuN_status <> 'Not Done')::timestamptz
WHERE first_contact_at IS NULL;
```

Write it with a `CROSS JOIN LATERAL (VALUES (fu1_date, fu1_status), …)` in the style of
`supabase/migrations/20260805180000_notification_generators_for_cron.sql` section 4 if convenient,
or a plain `LEAST(...)` over per-slot CASE expressions — your choice, but keep it readable.
Rules that matter:

- A fu date only counts as contact evidence when its SAME-slot status is a real outcome
  (not NULL, not 'Not Done'). A bare future-dated fu date is a planned call, not a contact.
- Leads with `stage <> 'New'` but NO fu evidence stay NULL on purpose — we do not fabricate
  contact times. The UI treats `stage <> 'New'` as contacted anyway; reports just skip these rows.
- Do not touch soft-deleted leads (`deleted_at IS NOT NULL`).

### 3. Trigger — set first_contact_at on the first real contact, from ANY write path

`log-call-dialog.tsx` (attached as --read) always writes a same-slot `fuN_date` + `fuN_status`
(real outcome). The Ceremate assistant and future paths update leads too, so this must be a
trigger, not client code:

```sql
CREATE OR REPLACE FUNCTION public.leads_set_first_contact()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.first_contact_at IS NULL AND (
       (OLD.stage = 'New' AND NEW.stage IS DISTINCT FROM OLD.stage)
       OR (NEW.fu1_status IS DISTINCT FROM OLD.fu1_status AND NEW.fu1_status IS NOT NULL AND NEW.fu1_status <> 'Not Done')
       OR (… same for fu2..fu5 …)
     ) THEN
    NEW.first_contact_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_leads_first_contact ON public.leads;
CREATE TRIGGER trg_leads_first_contact
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.leads_set_first_contact();
```

- Any stage change away from 'New' counts (including 'Lost' — discovering disinterest IS contact).
- A fu date changing WITHOUT its status does NOT count (that's scheduling, not contact).

### 4. Per-company SLA thresholds

```sql
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS sla_hot_minutes  integer NOT NULL DEFAULT 15   CHECK (sla_hot_minutes  > 0),
  ADD COLUMN IF NOT EXISTS sla_warm_minutes integer NOT NULL DEFAULT 120  CHECK (sla_warm_minutes > 0),
  ADD COLUMN IF NOT EXISTS sla_cold_minutes integer NOT NULL DEFAULT 1440 CHECK (sla_cold_minutes > 0);
```

(Grade = lead `temp`: Hot/Warm/Cold. Defaults from the spec: 15 min hot, 2 h warm; cold gets a
sensible 24 h.) One COMMENT on the columns explaining units and that NULL/unknown temp falls back
to the warm threshold in app code.

## Constraints

- One file, under ~90 lines, banner-comment style like `20260821120000_territory_disputes.sql`
  (attached as --read for style, not content).
- No `db push`, no applying — the human applies it by hand.
- Do NOT regenerate types.ts. Do NOT commit.
- You cannot run commands — re-read the file once after writing; check every column you reference
  exists in the attached `src/lib/crm.ts` Lead type (fu1..fu5_date, fu1..fu5_status, stage,
  date_received, deleted_at). Report the file path, line count, and any deviation.
