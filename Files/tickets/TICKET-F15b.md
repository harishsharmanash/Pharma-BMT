# TICKET F15-b — task generator: lead_uncontacted section (schema only)

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

Create ONE new migration file `supabase/migrations/20260824120000_tasks_lead_uncontacted.sql` that
`CREATE OR REPLACE`s `public.generate_tasks_for_user(p_user uuid)` with a third section added.
Nothing else. Do not touch any other file.

The current function lives in `supabase/migrations/20260819120000_generate_tasks.sql` (attached as
--read). Copy it VERBATIM — both existing sections, the NOTE comment, the SECURITY DEFINER /
search_path header, the closing grants are unchanged and NOT repeated in this file (grants on a
replaced function survive; only the function body changes) — and add section 3 below before the
`RETURN;`.

## Section 3 — uncontacted leads approaching their SLA deadline

Intent (F2 × F15): a 'New' lead with no `first_contact_at` whose SLA countdown has gone amber
(75% elapsed) becomes the rep's most urgent task. Priority scale: lower number = more urgent
(existing: followup_overdue = 10, followup_today = 20).

```sql
  -- 3) Uncontacted leads at 75%+ of their SLA (F2 × F15)
  INSERT INTO public.tasks (company_id, assignee_id, source, kind, title, body, lead_id, due_date, priority, dedupe_key)
  SELECT
    l.company_id,
    l.rep_id,
    'auto',
    'lead_uncontacted',
    'First call pending: ' || COALESCE(l.firm_name, l.name, 'lead'),
    COALESCE(l.firm_name, l.name, 'lead') || ' (' || COALESCE(l.temp, 'ungraded') ||
      ') has had no first contact; its SLA deadline is ' ||
      to_char(d.deadline AT TIME ZONE 'Asia/Kolkata', 'DD Mon HH24:MI') || ' IST.',
    l.id,
    d.deadline::date,
    5,
    'uncontacted:' || l.id
  FROM public.leads l
  LEFT JOIN public.company_settings cs ON cs.company_id = l.company_id
  CROSS JOIN LATERAL (
    SELECT l.created_at + (
      (CASE l.temp
        WHEN 'Hot'  THEN COALESCE(cs.sla_hot_minutes, 15)
        WHEN 'Cold' THEN COALESCE(cs.sla_cold_minutes, 1440)
        ELSE             COALESCE(cs.sla_warm_minutes, 120)
      END) * interval '1 minute'
    ) AS deadline
  ) d
  WHERE l.company_id = v_company
    AND l.rep_id = p_user
    AND l.deleted_at IS NULL
    AND l.stage = 'New'
    AND l.first_contact_at IS NULL
    AND now() >= l.created_at + (EXTRACT(EPOCH FROM (d.deadline - l.created_at)) * 0.75) * interval '1 second'
  ON CONFLICT (company_id, assignee_id, dedupe_key)
    WHERE deleted_at IS NULL AND dedupe_key IS NOT NULL
    DO NOTHING;
```

Design notes (do not "fix" these):
- Threshold is 75% elapsed (the amber badge state in `src/lib/speed-to-lead.ts`), giving the rep
  the last quarter of the SLA to act. Once breached it still generates (dedupe allows one row ever).
- SLA thresholds come from `company_settings` with COALESCE defaults 15/120/1440 — a company with
  no settings row still generates tasks.
- `'uncontacted:' || l.id` — one task per lead, ever.
- The task does not auto-close when the call is logged (existing generator semantics: tasks are
  closed by the user). Consistent with sections 1–2.

Also add one line to the NOTE comment block: lead_uncontacted has its own dedupe namespace and
never collides with the followup keys.

## Constraints

- One file. Keep it as close to 120 lines as the source allows — the function body is fixed, so
  the file is a copy + one section + one comment line. Do not reformat the copied sections.
- No `db push`, no applying, no types regen, no commit.
- You cannot run commands — re-read once and check: (a) sections 1 and 2 are byte-identical to the
  attached source, (b) `v_company` is the declared variable name, (c) the CASE/COALESCE column
  names match `company_settings` (sla_hot_minutes / sla_warm_minutes / sla_cold_minutes).
- Report: file path, line count, confirmation that sections 1–2 are verbatim copies, deviations.
