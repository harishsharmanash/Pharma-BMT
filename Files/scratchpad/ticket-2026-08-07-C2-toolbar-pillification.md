# Ticket C-followup: finish toolbar pill-ification on remaining section pages

You are working in the Cerebyl CRM repo (React 19 + TanStack Start, Tailwind). The design system is "Stitch". This ticket converts the REMAINING section pages to the same header/toolbar layout that Leads and Orders already use.

## The target idiom (already implemented — copy it exactly)

Look at `src/routes/orders.all.tsx` and `src/routes/leads.all.tsx` for the finished pattern:

- The section header component (`XSectionHeader`) renders ONLY the title block (icon + h1 + description) on the left and the segmented lens bar on the right. Page-level action buttons are NO LONGER passed as `actions` to the header.
- All page controls (search inputs, filter selects/dropdowns, and action buttons like Add/Import/Export) live in a single toolbar row DIRECTLY BELOW the header:
  - A flex row: `flex flex-wrap items-center gap-2` (search input first with `flex-1 min-w-...` if the page has one, then filters, then action buttons pushed right with `ml-auto` on the first action).
  - Action buttons use the stitch pill style already used in orders.all.tsx (rounded-full, filled primary for the primary action, secondary/outline pills for the rest). Match orders.all.tsx classes exactly — do not invent new variants.

## Files to convert (do NOT touch any other file)

1. `src/routes/clients.parties.tsx`
2. `src/routes/clients.territories.tsx`
3. `src/routes/clients.portal-access.tsx`
4. `src/routes/analytics.overview.tsx`
5. `src/routes/analytics.products.tsx`
6. `src/routes/analytics.leaderboard.tsx`
7. `src/routes/orders.dues.tsx`
8. `src/routes/orders.intimations.tsx`
9. `src/routes/team.directory.tsx`
10. `src/routes/team.accounts.tsx`
11. `src/routes/products.stock.tsx`

For each file:
- Remove any `actions={...}` prop passed to the section header (or page-level buttons rendered beside/above the header); move those controls into the toolbar row below the header.
- If the page already has a toolbar/filter row, restyle it to match the orders.all.tsx toolbar idiom (spacing, pill buttons) but keep ALL existing functionality: same handlers, same dialogs, same search params, same disabled/hidden logic, same role gating (`useCan`, `isAdmin` etc.).
- Do not change data hooks, queries, mutations, or route search schemas. No behavior changes — layout/styling only.
- Analytics pages may have fewer controls (maybe just a date range) — still use the same toolbar row idiom.

## Constraints

- TypeScript must compile: after your edits the parent will run `npx tsc --noEmit` and it must pass with 0 errors.
- Match the exact class strings used in orders.all.tsx for equivalent elements. Read that file first.
- Do not refactor, rename, or reformat anything beyond this layout change.
- If a file already fully matches the idiom, leave it unchanged.
