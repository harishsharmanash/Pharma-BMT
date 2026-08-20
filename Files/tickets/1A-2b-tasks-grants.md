# TICKET 1A.2b — Add explicit GRANTs to the tasks migration

## Why

`supabase/migrations/20260817120000_tasks.sql` creates `public.tasks`, enables RLS and defines three
policies, but issues **no GRANT statements**. RLS filters rows *within* privileges the role already
holds — it does not confer them. If the database's default privileges do not already cover the new
table, PostgREST answers every request with a permission error and the policies never even run.

This project has been bitten by exactly this before: `purge_activity_log()` was REVOKEd but never
GRANTed to `service_role`, so a 90-day retention job silently never ran once. The newer migrations
here (`20260801120000_lead_intake.sql`, `20260803140000_party_users.sql`) therefore state grants
explicitly. Follow that convention.

## The change

In `supabase/migrations/20260817120000_tasks.sql` only, after the policies, add:

```sql
GRANT SELECT, INSERT, UPDATE ON public.tasks TO authenticated;
GRANT ALL    ON public.tasks TO service_role;
```

Do **not** grant DELETE to `authenticated`. Removal is soft (`deleted_at`), matching the rest of this
schema, and there is deliberately no DELETE policy.

Add a one-line comment above the grants explaining that RLS filters rows but does not confer table
privileges, so the grants are required even though policies exist.

Change nothing else — the table, constraints, indexes, trigger and policies are all correct.

## Acceptance
- Do not run shell commands; you cannot in this session.
- Do not apply the migration. The human lead applies it by hand.
- Do not commit.
