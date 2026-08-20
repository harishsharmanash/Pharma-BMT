# TICKET 2A.4 — territory disputes panel (manager queue)

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

Surface the `territory_disputes` rows captured in 2A.3 as a queue on `/clients/territories`, so a
manager can see who overrode which overlap and why, and mark a dispute resolved. Reps see the same
list read-only — the table's SELECT policy is deliberately company-wide, matching the holds
philosophy ("a dispute nobody can see resolves nothing").

Already shipped (do NOT rebuild): `src/lib/use-territory-disputes.ts` exports
`useTerritoryDisputes()`, `useResolveDispute()`, and the `TerritoryDispute` type. The disputes
table is live.

## What to build

### 1. Pure helpers — extend `src/lib/territory-disputes.ts` + its test file

Add:

```ts
/** Open disputes, oldest first (FIFO work queue), id tiebreak. */
export function disputeQueue(disputes: TerritoryDispute[]): TerritoryDispute[];
```

- Filters to `status === "open"`, sorts by `created_at` ascending, then `id` ascending.
- Import the `TerritoryDispute` type from `./use-territory-disputes` (type-only import is fine).

Tests in `src/lib/territory-disputes.test.ts` (append a new `describe` block, keep the existing
tests untouched):

- resolved rows are excluded — including the mutation guard: build the fixture so that if the
  filter is deleted entirely, the test goes red (i.e. assert on length AND on the ids returned).
- ordering is oldest-first: two open rows where the LATER-created row has the alphabetically
  smaller id — assert the created_at order wins.
- the id tiebreak: two open rows with identical `created_at`, assert ascending id order.
  (Mutation guard: if the id tiebreak is removed, this test must still fail when ids are added in
  reverse-sorted insertion order — make the input array ordered so that input order does NOT match
  the expected output order.)

You cannot run commands — describe in your report the exact mutations the lead should apply
(e.g. deleting the status filter, reversing the comparator) and which test each must turn red.

### 2. New component `src/components/territory-disputes-panel.tsx`

Model it closely on `src/components/territory-holds-panel.tsx` (attached as --read) — same section
card, header row with count badge, `ul` of rows, `ConfirmDelete` for the destructive-ish action,
`friendlyError` on catch. Props:

```ts
interface TerritoryDisputesPanelProps {
  disputes: TerritoryDispute[];
  profiles: { id: string; full_name: string | null }[];
  profile: { id?: string; role?: string } | null;
}
```

- Header: "Open disputes" + count badge of open rows.
- Empty state: `<p>No open disputes.</p>` styled like the holds panel's empty state.
- Each row: the dispute `summary` (medium, truncated), and a second line with: the quoted `reason`
  (e.g. `"needed for promotion"`), `by {raisedByName}`, and the raised date formatted
  `en-IN` short (reuse the `startedMonth`-style idiom — day+month is right here, e.g.
  `new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })`).
- Resolve action: managers/admins only (`profile?.role === "manager" || "admin"`), a ghost
  "Resolve" button wrapped in `ConfirmDelete` (itemLabel "this dispute", description
  "This marks the dispute as resolved."), calling `useResolveDispute().mutateAsync(d.id)`, success
  toast "Dispute resolved", `friendlyError` on failure. Reps get no button.

### 3. Wire into `src/routes/clients.territories.tsx`

- Import `useTerritoryDisputes` and `TerritoryDisputesPanel`.
- Fetch disputes alongside holds.
- Render `<TerritoryDisputesPanel disputes={disputes} profiles={profiles} profile={profile} />`
  directly below the existing `<TerritoryHoldsPanel … />` block.
- Note: this route redirects reps to /dashboard today, so in practice only manager/admin see it —
  keep the read-only rep branch in the component anyway (the panel is reusable).

## Constraints

- Do NOT touch the migration, the hooks file's logic, or either capture surface
  (`territory-hold-dialog.tsx`, `parties_.$id.territory.tsx`).
- Do NOT add a "resolved history" section — open queue only.
- No new dependencies. Match the holds panel's styling idioms exactly.
- Do NOT commit, push, or run any git mutation commands.
- You cannot run `tsc` or tests — do not claim to have run them; re-read your edits and report what
  you checked by eye.

## Report

Files changed, per-file summary, the mutation descriptions for the lead, and anything the ticket
got wrong.
