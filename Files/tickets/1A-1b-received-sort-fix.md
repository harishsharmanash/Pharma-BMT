# TICKET 1A.1b — Fix `compareByReceived`: intra-day ordering and mixed granularity

## What is wrong with the current implementation

You wrote `compareByReceived` in `src/routes/leads.all.tsx`. It typechecks and its tests pass, but
it does not deliver the required behaviour. Two defects, both caused by the same wrong assumption
about the data:

**1. `date_received` is a `date` column — day granularity only.** Confirmed in the schema
(`date_received date NOT NULL DEFAULT CURRENT_DATE`) and in the email-intake worker, which writes
`new Date().toISOString().slice(0, 10)`. So **every lead received today compares equal**, and your
comparator then falls through to `a.id.localeCompare(b.id)` — a random uuid. The result is that
today's leads, which are exactly the ones the user cares about seeing newest-first, come out in
arbitrary order. The owner's requirement is "latest leads on top"; a uuid tiebreak does not
implement it.

**2. Mixed granularity in the fallback path.** When `date_received` is missing you substitute
`created_at`, which is a full ISO timestamp (`2026-08-10T09:14:22.123Z`), and compare it
lexicographically against another row's date-only string (`2026-08-10`). Because the timestamp is
longer, `"2026-08-10" < "2026-08-10T09:14:22Z"` — so a fallback row always sorts above a
same-day `date_received` row, systematically rather than by actual time.

## The fix

Rewrite `compareByReceived` to compare in three stages:

1. **Day** — take the first 10 characters of `date_received`, falling back to the first 10
   characters of `created_at` when `date_received` is null/empty. Compare descending. This makes
   both sides date-only, so granularity can never differ.
2. **Within the same day — `created_at` descending.** This is the actual intra-day arrival proxy:
   the intake worker inserts the row when the email arrives, so `created_at` orders today's leads
   correctly.
3. **Final tiebreak — `id` ascending**, so the sort remains stable and deterministic when two rows
   share both a day and a `created_at`.

Keep the exported signature and the `Pick<Lead, "date_received" | "created_at" | "id">` parameter
type. Update the doc comment to explain *why* the day/time split exists — specifically that
`date_received` is a `date` column and cannot order within a day. A future reader must not
"simplify" this back into a single comparison.

## Files

Edit:
- `src/routes/leads.all.tsx` (the `compareByReceived` function and its comment only)
- `src/test/leads-sort.test.ts`

Change nothing else. Do not touch the sort options, the default value, or the Call List preset —
those are correct.

## Tests to add (keep the three existing ones)

- Two leads on the **same** `date_received`, different `created_at` → the later `created_at` sorts
  first. **This is the test that would have caught the bug; write it first.**
- A row with null `date_received` and a `created_at` on the same day as another row's
  `date_received` → they compare by day first, then by `created_at`, not by string length.
- Existing tests must still pass unchanged.

## Acceptance

- Do not run shell commands — you cannot in this session. The human lead runs `npx tsc --noEmit` and
  `npm run test`. Write the code and tests so both pass; do not claim to have run them.
- **State plainly in your report** which mutation you would use to prove the new intra-day test can
  fail (the lead will run it).
- Do not commit. Leave changes uncommitted.
