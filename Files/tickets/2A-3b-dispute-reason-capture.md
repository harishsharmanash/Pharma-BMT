# TICKET 2A.3b — dispute capture on overlap override (hook + UI + tests)

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

Implement the owner's F4b ruling: an overlap NEVER blocks, but saving over one requires a typed
reason, and that reason auto-creates a `territory_disputes` row. The table already exists
(migration `20260821120000_territory_disputes.sql`, attached as --read) — do not change the
migration.

Two override surfaces exist today, each already computing a live conflict:

1. `src/components/territory-hold-dialog.tsx` — rep places a hold. It already computes
   `bookingConflict` (a `TerritoryConflict | null`, vs `party_territories`) and `holdConflict`
   (a `TerritoryHold | undefined`, vs live holds) and shows amber "you can still place this hold"
   banners.
2. `src/routes/parties_.$id.territory.tsx` — manager books/edits a territory. It already computes
   `conflict` (a `TerritoryConflict | null`) and shows an amber "You can still save" banner.

## What to build

### 1. New file `src/lib/use-territory-disputes.ts`

Model it on `src/lib/use-territory-holds.ts` (attached as --read): same `as any` house convention,
same `fetchAllRows` paging with the mandatory `.order("id", { ascending: true })` tiebreaker.

- `export type TerritoryDispute` — mirror the migration columns exactly (id, company_id, raised_by,
  reason, hold_id, territory_id, conflicts_territory_id, conflicts_hold_id, summary, status,
  resolved_by, resolved_at, created_at, updated_at).
- `useTerritoryDisputes()` — all rows for the company, ordered `created_at` ascending + `id`
  tiebreaker, paged via `fetchAllRows`.
- `RaiseDisputeInput` = `{ reason, summary, hold_id?, territory_id?, conflicts_territory_id?,
  conflicts_hold_id? }` (company_id and raised_by filled inside the mutation from the auth session,
  the same way `usePlaceHold` does it).
- `useRaiseDispute()` — insert, invalidate `["territory_disputes"]`.
- `useResolveDispute()` — update `{ status: "resolved", resolved_at: now, resolved_by: user.id }`,
  invalidate. (The resolve UI is a later ticket; the hook ships now.)

### 2. Return ids from the two save mutations

- `usePlaceHold` in `src/lib/use-territory-holds.ts`: change the insert to
  `.insert({...}).select("id").single()` and return the new row's id (mutationFn return type
  `Promise<string>`).
- `useSaveTerritory` in `src/lib/use-territories.ts`: same — for the insert branch return the new
  id; for the update branch return the existing `id`. Return type `Promise<string>`.
  Check the existing callers: the only caller is `parties_.$id.territory.tsx` (updated below).
  If you find another caller, keep it compiling.

### 3. Pure helper + tests — `src/lib/territory-disputes.ts` and
`src/lib/territory-disputes.test.ts` (tests live beside sources, e.g. `territory-holds.test.ts`)

Keep ALL decision logic pure here so it is unit-testable without rendering:

```ts
export type ConflictRef =
  | { kind: "territory"; id: string; label: string }   // e.g. "Shree Pharma's territory — Pincode 422001"
  | { kind: "hold"; id: string; label: string };       // e.g. "Ravi's hold — 25 km radius around a dropped pin"

/** True when the save form may proceed. Override requires a non-blank reason. */
export function overrideSaveAllowed(conflicts: ConflictRef[], reason: string): boolean;

/** One-line durable summary stored on the dispute row. */
export function disputeSummary(subjectLabel: string, conflicts: ConflictRef[]): string;

/** Build the insert payload's conflict columns from the refs (at most one of each kind). */
export function conflictColumns(conflicts: ConflictRef[]): {
  conflicts_territory_id: string | null;
  conflicts_hold_id: string | null;
};
```

- `overrideSaveAllowed`: `conflicts.length === 0 || reason.trim().length > 0`.
- `disputeSummary`: `"<subjectLabel> vs <label1> + <label2>"` (join multiple conflicts with " + ").
- `conflictColumns`: first ref of each kind wins; null when absent.

Tests must cover: no conflicts → allowed with blank reason; conflict + blank/whitespace reason →
NOT allowed; conflict + reason → allowed; summary with one and with two conflicts; conflictColumns
with territory-only, hold-only, both, and (this is the important mutation guard) **two refs of the
same kind** must yield the FIRST one, not the last. Per the preamble, mutation-verify the tests:
e.g. flipping `reason.trim().length > 0` to `>= 0`, and changing first-wins to last-wins, must each
turn a test red. State in your report which mutations you used — you cannot run commands, so say
clearly that the mutation check is pending and describe the exact mutation the lead should apply.

### 4. UI wiring — hold dialog

In `src/components/territory-hold-dialog.tsx`:

- Add a `reason` state, reset with the rest of the form.
- When `bookingConflict || holdConflict`, render a required reason `Input` directly under the
  warning banners: label "Reason for overriding the overlap", placeholder "Why is this hold still
  needed?". Style consistent with the existing Note field.
- Build `ConflictRef[]` from the two conflicts: bookingConflict →
  `{ kind: "territory", id: bookingConflict.territory.id, label: \`${bookingConflict.partyName}'s territory — ${areaSummary(bookingConflict.territory)}\` }`;
  holdConflict → `{ kind: "hold", id: holdConflict.id, label: \`${holderName(holdConflict.held_by)}'s hold — ${areaSummary(holdConflict)}\` }`.
- Disable "Place hold" unless `overrideSaveAllowed(refs, reason)` (in addition to existing
  conditions).
- In `save()`: capture the id returned by `placeHold.mutateAsync(input)`; if refs are non-empty,
  then `await raiseDispute.mutateAsync({ reason: reason.trim(), summary: disputeSummary(subjectLabel, refs), hold_id: newId, ...conflictColumns(refs) })`
  where subjectLabel is e.g. `Hold on ${areaSummary(candidate-as-territory)}`. If the dispute
  insert throws AFTER the hold was placed, still close with a success toast for the hold but show a
  separate `toast.error("Hold placed, but the dispute was not recorded — tell your manager.")`.
  Do NOT roll back or retry the hold.

### 5. UI wiring — manager booking form

In `src/routes/parties_.$id.territory.tsx`:

- Same pattern: `reason` state (reset in `resetForm`), a required reason `Input` rendered under the
  existing amber conflict banner when `conflict` is non-null, labelled "Reason for overriding the
  overlap".
- Gate the Save button on `overrideSaveAllowed(refs, reason)` where refs has a single territory ref
  built from `conflict` (same label format as above).
- In `save()`: use the id returned by `saveTerritory.mutateAsync(draft)`; when `conflict`, insert
  the dispute with `territory_id: savedId`, subject label
  `Territory for ${party?.firm_name ?? "party"} — ${areaSummary(candidate)}`. Same failure handling:
  the territory save is not rolled back; show the separate error toast.

## Constraints

- Do NOT modify the migration file. Do NOT regenerate types.ts (lead does that).
- Do NOT build a disputes list/panel — that is ticket 2A.4. Only the two capture surfaces + hook.
- Do NOT add any server-side overlap check or trigger. Detection stays client-side.
- `areaSummary` accepts the candidate shape directly (it only reads area_type/state/district/
  pincode/radius_km) — reuse it, don't write a new formatter.
- Do NOT commit, do NOT push, do NOT run `git add`/`git stash`/`git restore`/`git checkout`.
- You cannot run `tsc` or tests (`--no-suggest-shell-commands`). Do not claim to have run them.
  Instead re-read each file you edited once, checking imports are all used and every new symbol is
  imported where used.

## Report

Files changed, anything the ticket got wrong, and the exact mutations the lead should apply to
verify the new tests are not vacuous.
