# TICKET 1A.4 — Auto-generate follow-up tasks (F15 generator)

## Goal

`tasks` and the My Day UI are live, but nothing populates the list except manager-assigned tasks.
This adds the generator for the two task kinds we can derive correctly today:
`followup_overdue` and `followup_today`.

**Only those two kinds.** `lead_uncontacted` needs `first_contact_at`, which is F2 and not built.
`dues_threshold` and `order_action` need decisions not yet made. Do not invent them.

## Files

Create:
- `supabase/migrations/20260819120000_generate_tasks.sql`

Edit:
- `src/lib/use-tasks.ts` (fire the generator before fetching — see below)

Read only:
- `supabase/migrations/20260805180000_notification_generators_for_cron.sql` — **section 4 is the
  model to copy**
- `supabase/migrations/20260817120000_tasks.sql`
- `src/lib/use-notifications.ts` — the fire-then-fetch idiom

## Copy the proven generator, do not invent one

Section 4 of `generate_due_notifications_for_company` is the **known-correct** follow-up generator in
this codebase. Its shape:

```sql
FROM public.leads l
CROSS JOIN LATERAL (VALUES
  (1, l.fu1_date, l.fu1_status), (2, l.fu2_date, l.fu2_status), (3, l.fu3_date, l.fu3_status),
  (4, l.fu4_date, l.fu4_status), (5, l.fu5_date, l.fu5_status)
) AS f(n, d, st)
WHERE l.company_id = cid AND l.rep_id IS NOT NULL
  AND f.d IS NOT NULL AND f.d <= CURRENT_DATE
  AND COALESCE(f.st, '') NOT IN ('Done', 'Completed', 'Closed')
  AND l.stage NOT IN ('Won', 'Lost')
ON CONFLICT (user_id, dedupe_key) DO NOTHING;
```

Two properties make it correct and both must survive: it checks **each of the five slots
separately** (a `GREATEST()` over the five dates silently never fires when an early follow-up is
overdue and a later one is in the future — that bug shipped here once), and it **honours
`fu*_status`** so a completed follow-up stops nagging.

## What to build

`public.generate_tasks_for_user(p_user uuid)` — `SECURITY DEFINER`, `search_path = public`.

- Resolve the user's `company_id` from `profiles`; return immediately if null.
- Insert `followup_overdue` rows where `f.d < CURRENT_DATE`, and `followup_today` rows where
  `f.d = CURRENT_DATE`. Same status/stage/rep filters as above.
- `assignee_id = l.rep_id`, and **only for `p_user`** — i.e. `l.rep_id = p_user`. A rep pulling their
  own list must not generate tasks for anyone else.
- `source = 'auto'`, `due_date = f.d`, `lead_id = l.id`.
- `priority`: **10** for `followup_overdue`, **20** for `followup_today` (lower sorts first).
- `title`: `'Follow up: ' || COALESCE(l.firm_name, l.name, 'lead')`.
- `body`: mention which follow-up number and the date, as section 4 does.
- `dedupe_key`: `'followup:' || l.id || ':' || f.n || ':' || f.d` — same shape as the notification
  generator so the two stay legible side by side.

### ⚠️ The ON CONFLICT target is NOT the same as the notifications one

`tasks` has a **partial** unique index:

```sql
CREATE UNIQUE INDEX tasks_dedupe_idx ON public.tasks (company_id, assignee_id, dedupe_key)
  WHERE deleted_at IS NULL AND dedupe_key IS NOT NULL;
```

Postgres only infers a partial index when the statement repeats its predicate, so the clause must be:

```sql
ON CONFLICT (company_id, assignee_id, dedupe_key)
  WHERE deleted_at IS NULL AND dedupe_key IS NOT NULL
DO NOTHING
```

Omitting the `WHERE` raises *"there is no unique or exclusion constraint matching the ON CONFLICT
specification"* and the whole function fails. Get this right.

Because a completed or dismissed task keeps its `dedupe_key`, a task the rep has already actioned
will **not** be regenerated. That is the intended behaviour — do not add logic to "refresh" them.

### Wrapper, and the trap to avoid

Add a zero-argument `public.generate_tasks()` that simply calls
`public.generate_tasks_for_user(auth.uid())`. **All logic lives in the parameterised function; the
wrapper only delegates.**

**Do NOT write a `generate_tasks_all()` cron variant in this ticket.** This repo shipped
`generate_due_notifications_all()` as a second copy of a generator, it rotted out of sync with the
original, and scheduling it would have produced duplicate rows. A second copy of a generator is a
bug waiting for a cron job. When a cron variant is genuinely needed it will iterate over users
calling the same parameterised function.

Grants:
```sql
REVOKE ALL ON FUNCTION public.generate_tasks_for_user(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.generate_tasks() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_tasks_for_user(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_tasks() TO authenticated;
```
Note `generate_due_notifications()` is still executable by **anon** because an old migration granted
to `authenticated` without revoking PUBLIC's default. Do not repeat that — revoke explicitly.

## Frontend

In `src/lib/use-tasks.ts`, mirror the fire-then-fetch idiom in `src/lib/use-notifications.ts`: inside
`useTasks`'s `queryFn`, call `supabase.rpc("generate_tasks")` **fire-and-forget** (ignore its error —
a generator failure must never blank the task list) and then run the existing fetch. Do not change
the query key, the paging, or the mandatory `.order("id", { ascending: true })` tiebreaker.

## Acceptance

- Do not run shell commands; you cannot. Do not apply the migration — the lead applies it by hand.
- Do not commit.
- In your report: quote your final `ON CONFLICT` clause, and confirm in one line each that (a) the
  five slots are checked separately, (b) `fu*_status` is honoured, (c) no `_all` variant was created.
