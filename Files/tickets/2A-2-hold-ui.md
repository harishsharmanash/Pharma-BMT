# TICKET 2A.2 — Territory soft-hold UI (F4a)

## Goal

The `territory_holds` table, hooks (`src/lib/use-territory-holds.ts`) and pure helpers
(`src/lib/territory-holds.ts`) are built and the migration is applied live. Put them on screen:

- a rep can **place a hold** on an area while working a live enquiry;
- **every rep sees every live hold**, with who holds it and when it expires;
- the holder or a manager can **release** a hold early.

**No migration in this ticket.** No dispute record yet — that is 2A.3.

## Files

Create:
- `src/components/territory-hold-dialog.tsx` — place a hold
- `src/components/territory-holds-panel.tsx` — list live holds, release
- `src/test/territory-holds-panel.test.tsx`

Edit:
- `src/routes/clients.territories.tsx` — mount both

Read only:
- `src/lib/use-territory-holds.ts`, `src/lib/territory-holds.ts`
- `src/lib/use-territories.ts` — **reuse `scopesOverlap` / `areasOverlap` / `findTerritoryConflict`**
- `src/routes/parties_.$id.territory.tsx` — copy its scope/area form idiom rather than inventing one
- `src/lib/use-leads.ts` (`useProfiles` for holder names), `src/lib/friendly-error.ts`

Touch nothing else. **Do not modify `src/components/territory-map.tsx`** — map rendering of holds is
deliberately out of scope for this ticket.

## Where it goes

`/clients/territories` is the company-wide territory hub (list + map of booked areas). Add:

- a **"Live holds"** panel above the existing booked-areas list. When there are no live holds, render
  a single quiet line rather than an empty card — do not push the existing content down for nothing.
- a **"Place hold"** button in the existing header/action area, opening the dialog.

Preserve everything already on that page — the search, the list/map toggle, and the PDF export all
still work exactly as before.

## The hold form

Mirror the scope/area form in `parties_.$id.territory.tsx` — same field order, same controls, same
labels — so the two feel like one system:

- **Scope**: all / product / division / category (product uses a `Combobox`, not a `Select` — the
  catalogue is long).
- **Area**: state / district / pincode / pin, with the same conditional fields and the same
  validity rule the booking form uses.
- **Duration**: a small set of choices (e.g. 3 / 7 / 14 days) rather than a free date picker; compute
  `expires_at` with `holdExpiryFromDuration` from `src/lib/territory-holds.ts`.
- Optional **note**, and optional **lead** link if a lead id is easy to supply — skip the lead picker
  if it needs a new query.

`held_by` is always the current user. **Never expose a "hold on behalf of" control** — the RLS
INSERT policy requires `held_by = auth.uid()` and would reject it anyway.

## The overlap warning — it warns, it never blocks

Owner's ruling, and it overrides the original spec: **an overlap never blocks a write.** Reps and
managers may both proceed. Show the conflict clearly and let them save.

- Check the draft against **existing bookings** using `findTerritoryConflict` from
  `use-territories.ts`. The hold columns mirror `party_territories` exactly, so the existing helpers
  work without translation — reuse them, do not write a parallel comparison.
- Also check against **other live holds** (filter with `isHoldLive`, and exclude the user's own hold
  being edited).
- Render the warning inline in the dialog, in the style of the existing conflict notice in
  `parties_.$id.territory.tsx`. Name who holds or owns the conflicting area.
- The save button stays enabled. Wording should make the situation plain without forbidding it, e.g.
  *"Overlaps X's territory — you can still place this hold."*

A reason field is **not** required in this ticket; that arrives with the dispute record in 2A.3.

## The holds panel

Per hold: holder name (resolve via `useProfiles`), scope label, area summary (reuse `scopeLabel` and
`areaSummary`), and remaining time via `describeHoldRemaining`. Show **only live holds** — filter
with `isHoldLive`, passing the current time in.

- **Release** is visible only to the holder or a manager/admin. Use the role check already present in
  that route; do not invent a new one. Confirm before releasing.
- Errors go through `friendlyError`.
- Sort soonest-to-expire first, so the list reads as urgency.

## Constraints

- Light-only; no dark palette exists. Respect `prefers-reduced-motion` via `use-motion-safe`.
- Phone-first: this page is used on mobile. No horizontal scrolling; `.hit-area-44` on small icon
  buttons — but where two icon buttons are adjacent, put it on **one only**, or the overlapping
  invisible areas kill the first button.
- Never colour alone — pair any expiry colour with text.
- Do not add a dependency.

## Tests

`src/test/territory-holds-panel.test.tsx`. **Mock every export the components read** — an incomplete
hook mock makes the component throw before rendering and the test then asserts nothing. That has
already happened once this session.

Cover:
1. An expired hold and a released hold are both absent; a live one is present.
2. Remaining-time text renders (assert the text, not a colour class).
3. Release is offered to the holder, and **not** offered to an unrelated rep.
4. Holds are ordered soonest-expiry first — construct fixtures so **no other rule** (insertion order,
   id order, holder name) could produce the expected order.

## Acceptance

- Do not run shell commands; you cannot. The lead runs `npx tsc --noEmit` and `npm run test`, and
  will mutation-test your tests.
- State, per test, the mutation you expect to kill it.
- Do not commit.
