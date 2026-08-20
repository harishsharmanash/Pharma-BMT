# TICKET 1A.1 — Leads list: default to newest by date RECEIVED

## Goal

The leads list must default to **most recently received at the top**. Today it defaults to
`created_desc`, which sorts by `created_at` (the row-insert time). That is not the same thing:
leads arrive automatically through an email intake worker and are also bulk-imported, so
`date_received` (true arrival) and `created_at` (row insert) diverge. The owner's instruction is
explicit: sort by **time received, latest on top**.

Note that `useLeads()` already fetches ordered by `date_received` descending
(`src/lib/use-leads.ts`) — the client-side sort in the list then overrides it. This ticket makes the
list agree with the fetch.

## Files

Edit:
- `src/routes/leads.all.tsx`
- a new test file `src/test/leads-sort.test.ts` (pure-function test — see below)

Read only:
- `src/lib/use-leads.ts`
- `src/lib/crm.ts`
- `src/components/sort-select.tsx`

Touch nothing else.

## Approach

1. In `src/routes/leads.all.tsx`, add a new sort option `received_desc` to the `LeadSortOption`
   union and to `LEAD_SORT_OPTIONS`, labelled **"Newest first"**. Place it first in the list.
2. Make `received_desc` the default for the normal list. The existing behaviour where the
   `?preset=hot-warm` Call List defaults to `next_followup` **must be preserved exactly** — that
   same component serves the old `/hot-warm` screen.
3. Implement the comparison so it is robust:
   - primary: `date_received` descending;
   - when `date_received` is null or empty on either side, fall back to that row's `created_at` for
     that row (do not treat a null as "oldest" — an intake lead missing the field should still land
     near its insert time);
   - final tiebreak on `id` ascending so the order is **stable** and identical on every render.
4. **Extract the comparison into an exported pure function** so it can be tested without rendering
   the route. Put it in `leads.all.tsx` and export it, e.g.
   `export function compareByReceived(a, b): number`. Keep the parameter type as narrow as possible
   (`Pick<Lead, "date_received" | "created_at" | "id">`), not the whole `Lead`.
5. Leave `created_desc` in the options list (some users may want insert order) but it is no longer
   the default.

## Constraints

- Do not change `useLeads()` or the query. The fetch order is already correct.
- Do not change any other sort option's behaviour.
- Do not alter the saved-filter mechanism in this ticket.
- The project's usual "default sort is alphabetical" rule **does not apply to the leads list** —
  recency is the deliberate, owner-approved default here. Do not "fix" it to alphabetical.
- Reps must not gain visibility of any lead they cannot already see; this is a sort change only.

## Acceptance

- `npx tsc --noEmit` = 0 errors.
- `npm run test` passes.
- New test file covers: newest `date_received` sorts first; a null `date_received` falls back to
  `created_at`; equal timestamps tiebreak by `id` deterministically.
- **Mutation-verify each test**: e.g. flip the comparison sign, drop the null fallback, and remove
  the `id` tiebreak — confirm each turns a test red, then restore. State in your report which
  mutations you used and that you saw them fail.
- Report the default sort value for both the normal list and the `preset=hot-warm` list, to prove
  the Call List default was not changed.
