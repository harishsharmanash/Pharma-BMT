# TICKET 1A.2 — `tasks` table + hooks (F15 foundation)

## Goal

"My Day" is currently a **derived, read-only** view: it reads leads, orders, payments, staff and
stock and renders sections. Nothing can be marked done, postponed or dismissed, and a manager cannot
assign anything to a rep. This ticket adds the persistence layer that F15 needs. **It adds no UI** —
the screen changes come in 1A.3.

## Files

Create:
- `supabase/migrations/20260817120000_tasks.sql`
- `src/lib/use-tasks.ts`
- `src/lib/tasks.ts` (pure helpers — ordering and labels)
- `src/lib/tasks.test.ts`

Change nothing else. Do **not** touch `my-day-content.tsx` in this ticket.

## The schema — implement exactly this

The data model and the RLS policies below are decided; **type them as specified and do not redesign
them.** If you believe something is wrong, say so in your report rather than changing it.

```
public.tasks
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
  company_id      uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE
  assignee_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
  source          text NOT NULL CHECK (source IN ('auto','manager'))
  kind            text NOT NULL CHECK (kind IN (
                    'followup_overdue','lead_uncontacted','followup_today',
                    'order_action','dues_threshold','manual'))
  title           text NOT NULL
  body            text
  lead_id         uuid REFERENCES public.leads(id)   ON DELETE CASCADE
  party_id        uuid REFERENCES public.parties(id) ON DELETE CASCADE
  order_id        uuid REFERENCES public.orders(id)  ON DELETE CASCADE
  due_date        date
  priority        integer NOT NULL DEFAULT 100
  state           text NOT NULL DEFAULT 'open' CHECK (state IN ('open','done','dismissed'))
  done_at         timestamptz
  outcome         text
  postpone_count  integer NOT NULL DEFAULT 0
  postponed_to    date
  dismiss_reason  text
  dedupe_key      text
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL
  created_at      timestamptz NOT NULL DEFAULT now()
  updated_at      timestamptz NOT NULL DEFAULT now()
  deleted_at      timestamptz
  deleted_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL
```

Constraints and indexes:

- `CHECK (state <> 'dismissed' OR dismiss_reason IS NOT NULL OR source = 'manager')` — an
  auto-generated task cannot be dismissed without a reason. A manager-assigned one may be.
- Partial unique index for idempotent generation:
  `CREATE UNIQUE INDEX tasks_dedupe_idx ON public.tasks (company_id, assignee_id, dedupe_key)
   WHERE deleted_at IS NULL AND dedupe_key IS NOT NULL;`
- `CREATE INDEX tasks_open_idx ON public.tasks (company_id, assignee_id, state, due_date)
   WHERE deleted_at IS NULL;`
- A `BEFORE UPDATE` trigger setting `updated_at = now()`, following the exact pattern used by
  `trg_touch_party_territories` in `supabase/migrations/20260810120000_party_territories.sql`.

RLS — enable it, then these policies:

- **SELECT**: `company_id = public.current_company_id() AND (assignee_id = auth.uid() OR public.is_manager_or_admin())`
- **INSERT** (WITH CHECK): `company_id = public.current_company_id() AND (public.is_manager_or_admin() OR assignee_id = auth.uid())`
- **UPDATE** (USING and WITH CHECK): same predicate as SELECT.
- **No DELETE policy.** Removal is soft (`deleted_at`), consistent with the rest of this schema.

**Why the SELECT predicate matters: a rep must only ever see tasks assigned to them.** That is the
standing rule "reps only ever see their own data" and it is enforced here, not in the UI.

## The hooks (`src/lib/use-tasks.ts`)

Follow the shape of the existing hooks in this codebase (`src/lib/use-leads.ts`,
`src/lib/use-offers.ts`) — TanStack Query, `supabase.from("tasks")`, query keys as arrays.

- `useTasks()` — all non-deleted tasks visible to the caller. **Page it with `fetchAllRows` from
  `src/lib/fetch-all.ts`**, ordered by `due_date` ascending then **`.order("id", { ascending: true })`
  as the final sort** — the tiebreaker is mandatory, see the preamble.
- `useCompleteTask()` — sets `state='done'`, `done_at=now()`, optional `outcome`.
- `usePostponeTask()` — sets `postponed_to`, increments `postpone_count`, leaves `state='open'`.
- `useDismissTask()` — sets `state='dismissed'` and `dismiss_reason`.
- `useCreateTask()` — manager task injection: `source='manager'`, `created_by` = current user.

All mutations invalidate the `["tasks"]` query key on success.

## The pure helpers (`src/lib/tasks.ts`)

- `compareTasks(a, b)` — the ordering F15 requires as one flat list: overdue first (due_date before
  today), then due today, then future, then undated; within each band by `priority` ascending, then
  `due_date` ascending, then `id` ascending for stability. A task with `postponed_to` in the future
  is treated as due on `postponed_to`, not `due_date`.
- `completionPercent(tasks)` — of today's tasks, the share that are `done`. Returns `null` when
  there are no tasks today (so the UI can hide it rather than render "0%" or NaN).
- Keep these pure — no dates from `Date.now()` inside them; pass `today: string` in as a parameter
  so they are testable. This is the same convention as `todayLocalISODate` in `use-offers.ts`.

## Acceptance

- Do not run shell commands — you cannot in this session. The lead runs `npx tsc --noEmit` and
  `npm run test`.
- `tasks.test.ts` covers `compareTasks` (overdue before today before future before undated; the
  `postponed_to` override; the `id` tiebreak) and `completionPercent` (normal case, and `null` when
  there are no tasks today).
- **Do not apply the migration.** It is applied by hand by the human lead via the Supabase SQL
  Editor. Write the file only.
- Do not commit. Leave changes uncommitted.
- In your report: state the mutation you would use to prove each test can fail, and flag anything in
  the schema above you think is wrong.
