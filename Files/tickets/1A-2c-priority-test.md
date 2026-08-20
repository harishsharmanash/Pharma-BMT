# TICKET 1A.2c — `compareTasks` priority ordering is untested

## The gap

The lead mutation-tested `src/lib/tasks.ts`. Deleting the entire priority rule —

```ts
if (a.priority !== b.priority) return a.priority - b.priority;
```

— left **all five tests passing**. The rule is therefore unverified: nothing would catch its removal
or its inversion. (The `postponed_to` override was properly covered — that mutation did turn a test
red. This is only about priority.)

## The fix

Add tests to `src/lib/tasks.test.ts` covering priority ordering. Change nothing in `tasks.ts`.

1. **Two tasks in the same due-date band, different `priority`** → the lower `priority` number sorts
   first. Construct the fixtures so that **no later stage can produce the expected answer**: give the
   lower-priority-number task a `due_date` and `id` that would put it *second* if priority were
   ignored. Otherwise the test passes via the fallback and the gap remains — this exact mistake was
   already found and fixed once in `src/test/leads-sort.test.ts` this session.
2. **Same band, equal priority, different `due_date`** → earlier `due_date` first, proving priority
   does not override the date comparison in the wrong direction.
3. Add a comment on each fixture pair noting why the non-priority fields are set as they are, so a
   later tidy-up cannot silently defeat the test.

## Acceptance
- All tests pass against the current implementation.
- Replacing the priority line with a no-op must turn at least one test red. State which test you
  expect it to kill.
- Do not run shell commands; you cannot in this session. Do not commit.
