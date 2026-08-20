# TICKET 1B.1b — Fix the two failing assertions in `margin-calc.test.ts`

## What is wrong

`npm run test` fails with 2 of your 5 margin tests red:

```
> handles a normal pharma-like case
AssertionError: expected 5.93 to be close to 5.931250000000006 ... expected 0.00005

> backs out GST from MRP before comparing to a GST-exclusive selling price
AssertionError: expected 33.33 to be close to 33.33333333333333 ... expected 0.00005
```

**The implementation is correct; the tests are wrong.** The ticket specified that percentages are
rounded to 2 decimals, and `calcMargin` does exactly that via `round2`. The tests then assert
`toBeCloseTo(<unrounded value>, 4)`, which demands 4-decimal precision the function is specified
never to produce. The assertions contradict the specification they were written against.

## The fix

In `src/lib/margin-calc.test.ts` only:

- Change the two percentage assertions to compare against the **rounded** expected value, using the
  same `round2` convention the implementation uses — e.g. assert `33.33` exactly, or use
  `toBeCloseTo(expected, 2)`. Prefer an exact `toBe(...)` on a hand-computed rounded literal: it
  documents the intended output precisely and cannot drift.
- Do the same for any other assertion in this file that compares a rounded output with more
  precision than 2 decimals. Check all five tests, not only the two that happen to fail today.
- Where you assert a hand-computed literal, add a one-line comment showing the arithmetic
  (e.g. `// 230 / 1.15 = 200 exactly`), so a future reader can check it without re-deriving.

**Do not change `src/lib/margin-calc.ts`.** Rounding to 2 decimals is the specified and correct
behaviour for money and percentages in this codebase, matching `src/lib/order-totals.ts`.

## Files

Edit only:
- `src/lib/margin-calc.test.ts`

## Acceptance

- All 5 tests in the file pass.
- Do not run shell commands — you cannot in this session. The lead runs `npm run test`.
- In your report, state which mutation to `margin-calc.ts` would make the GST back-out test fail
  (the lead will run it to confirm the test is real and not vacuous).
- Do not commit.
