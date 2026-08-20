# TICKET 1A.3 — My Day task list + manager task injection (F15 UI)

## Goal

The `tasks` table, hooks (`src/lib/use-tasks.ts`) and pure ordering (`src/lib/tasks.ts`) are built and
the migration is applied live. This ticket puts them on screen, turning My Day from a passive
dashboard into an instruction set:

- a rep opens the app and sees **one ordered list of what to do next**, each row with **Done**,
  **Postpone to tomorrow** and **Dismiss**;
- a manager or admin can **assign a task to a rep** with a due date and note.

Auto-generation of tasks is a **separate later ticket** — do not build it here. Manager injection is
what makes tasks exist for now, which is why both halves are in this one ticket.

## Files

Create:
- `src/components/my-day-tasks.tsx` — the list, the rows, and the three actions
- `src/components/assign-task-dialog.tsx` — manager/admin task injection
- `src/test/my-day-tasks.test.tsx` — render tests

Edit:
- `src/components/my-day-content.tsx` — mount the above

Read only:
- `src/lib/use-tasks.ts`, `src/lib/tasks.ts`, `src/lib/use-leads.ts` (for `useProfiles`),
  `src/components/confirm-delete.tsx` (dialog idiom), `src/components/log-call-dialog.tsx`
  (form-in-dialog idiom)

Touch nothing else.

## Where it goes — read `my-day-content.tsx` first

`MyDayContent` branches by role into `RepDay()`, `ManagerDay()` and `AdminDay()`. **Do not flatten or
restructure those branches** — each role's existing content must survive exactly as it is.

- Mount the task list at the **top** of `RepDay`, above its current cards. The rep should see what to
  do before they see numbers.
- Also mount it in `ManagerDay` (a manager has their own tasks too), below their existing
  action lists.
- Mount the **Assign task** button in `ManagerDay` and `AdminDay` only. A rep must never see it.
  Gate on the same `role` value already computed in that file — do not invent a new role check.

## The list

- Source: `useTasks()`. Filter to `state === "open"`, sort with `compareTasks(a, b, today)` from
  `src/lib/tasks.ts`, passing today's local date string.
- **One flat ordered list — no tabs, no filters, no grouping by section.** That is the point of F15:
  the rep opens the app and the next thing to do is at the top.
- Show the daily completion percentage from `completionPercent(tasks, today)` when it is not `null`.
  When it returns `null` (no tasks due today) render nothing rather than "0%".
- Overdue rows need a visible marker. **Never colour alone** — pair any colour with a text label
  (e.g. a small "Overdue" pill), matching the temperature-pill convention in `leads.all.tsx`.
- Empty state: a short, calm line ("Nothing due today.") — not an error, not an illustration.

## The three actions per row

1. **Done** → `useCompleteTask()`. If the task's `kind` relates to a call
   (`followup_overdue`, `followup_today`), prompt for a short outcome first and pass it as `outcome`;
   otherwise complete directly.
2. **Postpone to tomorrow** → `usePostponeTask()` with tomorrow's date. One tap. Optional reason.
3. **Dismiss** → `useDismissTask()`. **A reason is REQUIRED when `source === "auto"`** — the database
   has a CHECK constraint enforcing exactly this
   (`state <> 'dismissed' OR dismiss_reason IS NOT NULL OR source = 'manager'`), so a dismiss without
   a reason on an auto task will be rejected by Postgres. Collect it in the UI so the user never sees
   a raw database error. For `source === "manager"` a reason is optional.

Every mutation shows a failure through `friendlyError` from `src/lib/friendly-error.ts` — never a raw
Postgres message.

## Assign-task dialog

- Fields: assignee (a `Combobox` over `useProfiles()`, since a company can have many staff), title,
  optional note, optional due date.
- Submits via `useCreateTask()` with `source: "manager"`, `kind: "manual"`.
- The assignee list must only offer profiles in the user's own company — use whatever scoping
  `useProfiles()` already applies; do not add a broader query.

## Constraints

- Touch targets on phones: this is a primary mobile surface. Use the existing `.hit-area-44` utility
  where an icon button is small. **Where two icon buttons sit adjacent, put the class on ONE only** —
  overlapping invisible hit areas make the first button partially dead, which is worse than the
  original problem.
- Light-only. No dark palette exists; do not invent one.
- Respect `prefers-reduced-motion` via `src/lib/use-motion-safe.ts` if you animate anything.
- Reps see only their own tasks — that is enforced by RLS, so **do not add a client-side
  `assignee_id` filter and assume it is the security boundary.** You may filter for clarity, but the
  guarantee is the policy.

## Tests (`src/test/my-day-tasks.test.tsx`)

Follow the existing render-test idiom in `src/test/` — mock the hooks, render, assert on content.
Cover:

1. Tasks render in `compareTasks` order (assert by reading rendered text order, not by index into an
   unlabelled list).
2. An overdue task shows its text marker, not colour alone.
3. Dismissing an `auto` task requires a reason — the confirm control is unavailable until one is
   entered.
4. A rep does **not** see the Assign task control; a manager does.

**Build each test so no other rule could satisfy it.** Two earlier suites this session passed while
the behaviour under test was deleted, because the fixtures happened to agree with a fallback rule.
When you mock `use-features`/`useAuth`, make sure the mock includes every field the component reads,
or the page throws before rendering and the test asserts nothing.

## Acceptance

- Do not run shell commands; you cannot in this session. The lead runs `npx tsc --noEmit` and
  `npm run test` and will mutation-test your tests.
- State in your report, for each test, the mutation you expect to kill it.
- Do not commit.
