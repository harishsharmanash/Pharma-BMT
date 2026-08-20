# TICKET 1A.1c — Two `compareByReceived` tests pass for the wrong reason

## The defect

The lead mutation-tested your tests: `const timeCmp = bTime.localeCompare(aTime)` in
`compareByReceived` was replaced with `const timeCmp = 0` — deleting the entire intra-day ordering
rule, which is the whole point of ticket 1A.1b — and **every test still passed.**

The cause is the fixture ids. In both new tests the row expected to sort first is also given the
alphabetically-smaller `id`:

```ts
const later   = { id: "1", date_received: "2026-08-10", created_at: "2026-08-10T14:30:00Z" };
const earlier = { id: "2", date_received: "2026-08-10", created_at: "2026-08-10T09:00:00Z" };
```

With the time comparison removed, the function falls through to `a.id.localeCompare(b.id)`, and
`"1" < "2"` produces exactly the expected sign. The assertion is satisfied by the tiebreak, not by
the behaviour under test. A test that cannot fail when its subject is deleted is worse than no test:
it reports safety that does not exist.

Affected tests in `src/test/leads-sort.test.ts`:
- `"orders same-day leads by created_at descending"`
- `"compares by day before created_at when date_received is missing"`

## The fix

In `src/test/leads-sort.test.ts` only — **do not change `compareByReceived`**, it is correct.

1. Invert the ids in both tests so the id order **opposes** the expected result: give the row that
   must sort first the alphabetically **larger** id (e.g. later → `id: "2"`, earlier → `id: "1"`).
   Then the only thing that can produce the expected sign is the `created_at` comparison, and
   deleting it must flip the result.
2. Apply the same scrutiny to the other three tests. For each, ask: *if the rule this test targets
   were deleted, would some other rule still produce the expected answer?* Fix any that would.
   - Note the first test (`"puts newest date_received first"`) has the same shape — check it.
   - The `id` tiebreak test is legitimately about ids, so it may keep its ordering.
3. Add a short comment above each fixture pair stating **why** the ids are ordered as they are, e.g.
   `// ids deliberately oppose the expected order so the id tiebreak cannot satisfy this assertion`.
   Without that note someone will "tidy" them back and silently restore the hole.

## General rule to apply from now on

When a comparator has multiple fallback stages, a test for stage N must be constructed so that
**every later stage would give the wrong answer.** Otherwise you are testing the fallback, not the
stage.

## Acceptance

- All tests in `src/test/leads-sort.test.ts` pass against the current, correct implementation.
- Setting `timeCmp = 0` inside `compareByReceived` must make at least one test fail. The lead will
  run exactly that mutation to verify — state in your report which test you expect it to kill.
- Do not run shell commands; you cannot in this session.
- Do not commit.
