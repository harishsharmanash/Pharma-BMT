# TICKET 1A.3b — Two role-gating tests fail on an incomplete module mock

## The failure

`npm run test` — 2 of your 5 tests in `src/test/my-day-tasks.test.tsx` are red:

```
× shows the Assign task control for a manager
× does not show the Assign task control for a rep
Error: [vitest] No "useCreateTask" export is defined on the "@/lib/use-tasks" mock.
```

`AssignTaskDialog` calls `useCreateTask()`, and `MyDayContent` renders that dialog for managers and
admins, so the mock of `@/lib/use-tasks` must provide it. Your mock omits it, the component throws
during render, and **both assertions therefore verify nothing** — including the negative one, which
would "pass" for the wrong reason if the error were swallowed.

This is the exact trap the ticket warned about: an incomplete hook mock makes the page throw before
rendering, and the test asserts nothing.

## The fix

In `src/test/my-day-tasks.test.tsx` only:

1. Add `useCreateTask` to the `@/lib/use-tasks` mock, returning the same mutation shape the other
   mocked mutations use (an object with `mutate`/`mutateAsync` and `isPending`, matching how the
   component actually calls it — read `assign-task-dialog.tsx` and mock exactly what it consumes).
2. **Audit the whole mock against the components under test.** List every export of
   `@/lib/use-tasks` that `MyDayTasks` or `AssignTaskDialog` calls, and confirm each is present in
   the mock. Do the same for any other module you mock in this file (`use-leads`, auth, features).
   Missing exports are silent until a code path reaches them.
3. Make the negative test robust: assert the manager case and the rep case in a way that cannot both
   pass if the component fails to render at all. For example, in the rep test also assert that
   something the rep *should* see is present — so a total render failure fails the test rather than
   satisfying "the Assign button is absent".

Do not change any component code — the components are correct.

## Acceptance

- All 5 tests pass.
- The rep test must fail if the component renders nothing at all. State how you ensured that.
- State the mutation you expect to kill each role-gating test (the lead will run it).
- Do not run shell commands; you cannot. Do not commit.
