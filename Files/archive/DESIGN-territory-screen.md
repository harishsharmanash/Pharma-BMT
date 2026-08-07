# DESIGN — Territory screen (queue item 7)

Written 28 Jul 2026, before any code, because the item is really a data-model change wearing a UI
costume. Read the "Decisions needed" section first — the rest follows from it.

## What exists today

- A party has **exactly one** monopoly: the columns `monopoly_given`, `monopoly_division`,
  `monopoly_state`, `monopoly_district`, `monopoly_radius_km`, `monopoly_lat`, `monopoly_lng` on
  `parties`.
- It is edited as a cramped section inside the party add/edit dialog on `/parties`.
- `findMonopolyGeoOverlap()` (`src/lib/use-parties.ts:373`) warns on a clash. It is
  **division-scoped**: two circles only conflict if their `monopoly_division` matches, with a
  string state/district fallback when either side has no pin.
- `/booked-areas` lists every booked territory and has the overview map (whose PDF export was
  fixed today).

## Why this needs a migration

The ask is monopoly **per Products / Division / Range(Category)**, and blocking **several** areas
(state / district / pincode / dropped pin). One row of `monopoly_*` columns can hold exactly one
scope and one circle. There is no way to express "Metro Care has Shilajit in Jaipur AND the whole
Derma range across Rajasthan" in the current shape.

**Proposed:** a `party_territories` table — one row per granted territory.

```
party_territories
  id, company_id, party_id
  scope_type      'product' | 'division' | 'category'
  scope_value     text        -- division/category name
  scope_product_id uuid       -- when scope_type = 'product'
  area_type       'state' | 'district' | 'pincode' | 'pin'
  state, district, pincode    text
  lat, lng, radius_km         -- when area_type = 'pin'
  created_by, created_at, deleted_at, deleted_by
```

The existing `monopoly_*` columns get **migrated into it, then kept in place and read-only** for a
release, so `/booked-areas`, the PDF export, the assistant's `booked areas` report and
`findMonopolyGeoOverlap` keep working while they are ported one at a time. Deleting them in the
same migration would break four consumers at once.

Overlap detection generalises: two territories clash when their **scope overlaps** (same division,
same category, or same product — a product clash also counts against its own division) **and**
their **areas overlap** (circle intersection when both have pins, else state/district/pincode
string match).

## The screen

Route `/parties/$id/territory`, opened by a **Territory** button on the party page. Full-bleed,
Google-Maps style: **controls left (~380px), map right**, map fills the viewport height.

**Left panel**
1. List of this party's existing territories as cards — scope chip + area summary + radius, each
   with edit/remove. Empty state explains what a territory is in one line.
2. "Add territory" opens an inline form in the same panel:
   - **Scope type** — segmented control: Product / Division / Range. Picking one swaps the next
     control: product → `Combobox` over products; division → searchable dropdown of divisions;
     range → searchable dropdown of categories. (`Combobox` already exists and is used on 20
     pickers.)
   - **Area type** — segmented: State / District / Pincode / Drop a pin.
   - State/district/pincode → the matching searchable input. Pin → "click the map", then a radius
     slider (1–500 km) that redraws the circle live.
   - A live **overlap warning** as they choose, reusing the generalised check — naming the party it
     clashes with, before save, not after.
3. Save / Cancel.

**Map (right)**
- This party's territories in **brand blue**, solid.
- **Every other party's territories in distinct colours**, semi-transparent, with a legend mapping
  colour → party name. This is the point of the screen: see the overlap while assigning.
- Clicking any other party's circle opens that party.
- A "show other parties" toggle, since on a dense map they will drown out the one being edited.
- Colours come from a fixed palette cycled by party index — deterministic, so a party keeps its
  colour between visits.

Reuses `TerritoryPinMap`/`TerritoryOverviewMap` patterns in `src/components/territory-map.tsx`.
Leaflet stays lazy + mounted-gated (it touches `window` at import). Any PDF/JPG capture here must
use `fixLeafletOverlayForCapture` or circles drift from pins — that bug was fixed today.

**Access:** managers/admins only, matching the standing rule that reps never assign territory.
Reps opening the URL directly bounce to `/dashboard`, and RLS backs it up.

## Decisions needed

1. **Pincode areas need geocoding data we do not have.** A pincode is only a circle on a map if
   something maps 110001 → lat/lng. Options: (a) ship State/District/Pin now and add pincode in a
   follow-up; (b) load an India pincode→centroid dataset (~19k rows) into a table, one-time, no
   runtime dependency; (c) call Nominatim live — previously *deferred by decision*, and it rate-limits.
   **Recommendation: (b)** if pincode matters now, else (a).

2. **Phasing.** This is the largest item in the queue. Suggested split:
   - **Phase 1** — table + migration of existing data, the screen, scope types, state/district/pin
     areas, other parties' coloured circles, generalised overlap. Ports `/booked-areas` to read the
     new table.
   - **Phase 2** — pincode areas, PDF export of the new map, retiring the old `monopoly_*` columns.
   **Recommendation: build Phase 1, review it live, then Phase 2.**

3. **What happens to the old monopoly section in the party dialog?** Recommendation: replace it
   with a read-only summary plus a "Manage territory" link, so there is exactly one place that
   edits territory and no chance of the two disagreeing.
