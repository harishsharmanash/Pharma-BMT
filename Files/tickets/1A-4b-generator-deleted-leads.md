# TICKET 1A.4b — Generator must ignore soft-deleted leads

## The defect

`generate_tasks_for_user` selects from `public.leads` with no `deleted_at` filter. `leads` is
soft-deleted — `src/lib/use-leads.ts` ends with `return data.filter((l) => !l.deleted_at)` and the
column exists in the generated types. So **a lead the user has moved to Trash keeps generating
follow-up tasks forever**, and because the row is soft-deleted it will never appear in any list where
the user could clear it. Deleting a lead must stop the nagging.

(The existing notification generator has the same omission. Do **not** change that function in this
ticket — it is separate, live, and out of scope. Note it in your report and we will fix it
deliberately.)

## The change

In `supabase/migrations/20260819120000_generate_tasks.sql` only, add to the `WHERE` clause of
**both** INSERT statements:

```sql
AND l.deleted_at IS NULL
```

Add a short comment above the first occurrence saying leads are soft-deleted, so a future reader
does not remove it as redundant.

## Also add one clarifying comment (no behaviour change)

Both inserts share the dedupe key `'followup:' || l.id || ':' || f.n || ':' || f.d`. That means a
follow-up first picked up as `followup_today` keeps `kind = 'followup_today'` and `priority = 20`
after it becomes overdue the next day, because the overdue insert hits the conflict and does nothing.
**This is intended** — it prevents a second row for the same follow-up, and the UI bands by
`due_date` rather than by `kind`, so the row still displays and sorts as overdue. Add a comment
saying exactly that, so nobody "fixes" it into duplicate rows later.

Change nothing else.

## Acceptance
- Do not run shell commands; you cannot. Do not apply the migration. Do not commit.
- Confirm in your report that both INSERTs now carry the filter.
