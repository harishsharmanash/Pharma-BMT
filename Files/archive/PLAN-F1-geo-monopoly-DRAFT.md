# PLAN — Feature 1: Geo monopoly + radius territory map (DRAFT)

Status: planning draft, 23 Jul 2026. Nothing built yet. Author: Claude (Fable / Opus 4.8).
Decisions locked by Harish are treated as fixed (see "Locked decisions"). Open questions are collected at the end.

---

## 0. Locked decisions (do not re-litigate)
- Territory shape = **radius circles**. Manager drops a pin, sets a radius (50 km / 100 km presets + custom, blockable per party).
- **Reps see the map READ-ONLY.** Create/edit monopoly territory = managers/admins only (mirrors the rep-reassignment rule).
- Map = **Leaflet + free OSM tiles** (no Google, no key, no billing). India state/district boundaries from free GeoJSON (DataMeet). Geocoding = pin-drop primary; optional Nominatim as convenience only.
- **Keep** the existing string state→district→party-count drill-down on `/booked-areas`, and keep the existing string monopoly fields for back-compat/display. The map is a NEW layer, not a replacement.
- Map download = render current map view to PNG → into the existing jsPDF pipeline, alongside a party table.

---

## 1. Current state (what the implementer is extending)

**Schema (today).** `parties` carries four monopoly columns (added in the `features_phase2` migration), typed as OPTIONAL in the hand-written `Party` interface in `src/lib/use-parties.ts` (lines ~39–45):
```
monopoly_given?: boolean;
monopoly_division?: string | null;
monopoly_district?: string | null;
monopoly_state?: string | null;
```
There is **no geography today** — no lat/lng, no radius, no coordinates, no map library. It is pure free-text string matching.

**Conflict function (today).** `findMonopolyOverlap(parties, { division, state, district, excludeId })` in `src/lib/use-parties.ts` (~line 317). It is an **exact case-insensitive string match** on division + state + district. Returns the first conflicting party or null. Requires a division and (state or district) to fire. Pure client-side helper over the already-loaded `parties` array — no DB round-trip.

**Where it surfaces (today) — ONLY TWO places:**
1. **Party edit form** (`src/routes/parties.index.tsx`, `PartyDialog`, ~lines 855–877): a "Territory / monopoly" sub-section — a `monopoly_given` checkbox that reveals Division/State/District text inputs, plus a **live inline overlap-warning banner** (soft warning, never a hard block — you can still save) computed via `findMonopolyOverlap`.
2. **`/booked-areas`** (`src/routes/booked-areas.tsx`): managers/admins only (reps hard-redirected to `/dashboard`). Groups `monopoly_given` parties by state, shows district-count + party-count per state, click a state → accordion expands to the party list, each row links to `/parties/$id`. No editing here.

**IMPORTANT correction to the brief:** there is **no order-side or lead-side monopoly flagging in the codebase.** Grepping `src/routes/orders*.tsx`, `src/lib/use-orders.ts`, and `src/routes/leads*.tsx` for monopoly/territory/conflict returns nothing. The only other reference is `src/lib/use-assistant.ts` (the AI assistant reads the fields). So "keep the existing order flagging" is a no-op — there is nothing to preserve there. If Harish *wants* order-time flagging, that's a NEW feature (flagged as an open decision below), not a preservation task.

**PDF pipeline (today).** `jspdf` + `jspdf-autotable` are imported **statically at module top** and work fine under SSR (they don't touch `window` at import). Existing examples: `src/routes/parties.$id.tsx` (~line 987, `new jsPDF()` + `autoTable`), `src/routes/products.tsx` (~line 320), `src/lib/order-share.ts` (has a `fetch logo → data URL for jsPDF.addImage` helper — reusable for embedding the map PNG). `html2canvas-pro` is already a dependency. Static assets are served from `public/` (currently only `favicon.ico`).

**SSR context.** TanStack Start with SSR is on. The app already guards browser globals with `typeof window !== "undefined"` (see `src/integrations/supabase/client.ts` line 51, `src/lib/theme.tsx` lines 12/19/38/43). There is **no existing dynamic-import / `React.lazy` / client-only wrapper pattern in use** — this feature will introduce the first one (see §6).

---

## 2. Schema / migration

**Decision: columns on `parties`, NOT a separate `party_territories` table.** Justification:
- A party holds **one** monopoly today (single `monopoly_given` boolean + single division/state/district). One pin + one radius fits the same 1:1 shape. A join table only earns its keep if a party can hold *multiple* disjoint territories — that is an open question (§7), and YAGNI until Harish says yes. Columns keep the haversine check a trivial in-memory scan of the already-loaded `parties` array (no extra query, no join), exactly like `findMonopolyOverlap` today.
- If multi-territory is later needed, migrating columns → child table is a clean, additive follow-up. Start simple.

**Migration (idempotent, hand-applied via Supabase SQL Editor — never `supabase db push`):**
```sql
-- F1: geo monopoly — pin + radius on parties
ALTER TABLE public.parties ADD COLUMN IF NOT EXISTS monopoly_lat        double precision;
ALTER TABLE public.parties ADD COLUMN IF NOT EXISTS monopoly_lng        double precision;
ALTER TABLE public.parties ADD COLUMN IF NOT EXISTS monopoly_radius_km  numeric;
-- all nullable: a party can have monopoly_given=true with no pin yet (back-compat).
```
No new RLS policies needed — these are columns on an existing table already covered by `parties` RLS and grants. **Confirm grants** after applying (the schema relies on explicit `GRANT … TO authenticated`; new columns inherit table-level grants, so nothing extra, but verify per the deploy skill's grants-trap note).

**TS types (per deploy rule):** add the three fields as OPTIONAL to the `Party` interface in `src/lib/use-parties.ts`:
```
monopoly_lat?: number | null;
monopoly_lng?: number | null;
monopoly_radius_km?: number | null;
```
Do NOT regenerate Supabase types. Writes to the new columns use the existing `(supabase.from("parties") as any)` escape hatch where the strict generated type would otherwise reject them (the parties mutation in `parties.index.tsx` already spreads a form object — confirm it compiles; add `as any` on the update/insert payload if the generated type complains). Typecheck baseline must stay **139 errors**.

---

## 3. Conflict detection rewrite (haversine, with graceful fallback)

Add a new helper **next to** `findMonopolyOverlap` in `src/lib/use-parties.ts` (keep the old one — it's the fallback):

```ts
// Distance between two lat/lng points in km (haversine).
export function haversineKm(aLat, aLng, bLat, bLng): number { … }

// Geo conflict: does a candidate pin+radius overlap any OTHER party's monopoly circle?
// Two circles overlap when distance(centers) < rA + rB.
export function findMonopolyGeoOverlap(
  parties: Party[],
  opts: { lat?: number|null; lng?: number|null; radiusKm?: number|null; division?: string|null; excludeId?: string },
): Party | null
```

**Rules:**
- **Both parties have pins** → geo check: `haversineKm(candidate, existing) < (candidateRadius + existingRadius)` ⇒ overlap. (Circle-vs-circle intersection. Simpler alternative — "is candidate center inside existing circle" — under-reports; use the sum-of-radii test.)
- **Candidate has a pin but the existing party does not** (or vice versa) → cannot compare geographically → **fall back to the old string `findMonopolyOverlap`** for that pair.
- **Neither has a pin** → pure string match (today's behavior, unchanged).
- **Division scoping (open question, §7):** today's overlap is division-scoped (same division = clash). Recommend keeping that: only flag a geo overlap when the **division matches** (two different divisions in the same town is legitimate). Make division-match part of `findMonopolyGeoOverlap`. If Harish wants any-division geographic exclusivity, drop that clause.

**Where it runs:** client-side, same as today — in the `PartyDialog` render, replacing/augmenting the current `findMonopolyOverlap` call so the banner reflects geo overlap when pins exist and string overlap otherwise. Still a **soft warning, not a hard block** (matches current behavior; hard-block is an open question).

---

## 4. Map component & libraries

**Package: `react-leaflet` + `leaflet`** (not maplibre-gl). Why:
- Leaflet is lighter, has first-class circle/marker primitives (`<Circle>`, `<Marker>`, `useMapEvents` for click-to-drop-pin) that map 1:1 onto our "pin + radius" model with almost no code. MapLibre is GL/vector-tile oriented — overkill for OSM raster tiles + a few circles, and heavier to make SSR-safe.
- OSM raster tiles need no key/billing. Tile URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` with the required attribution. (Respect OSM tile usage policy; fine at this app's scale.)

**Install (bun — this repo does NOT use npm):**
```
bun add leaflet react-leaflet
bun add -d @types/leaflet
```
Commit `package.json` **and** `bun.lock` together, or the Cloudflare build fails "lockfile is frozen." Leaflet's CSS (`leaflet/dist/leaflet.css`) must be imported once (in the client-only map component, not a top-level route module).

**India GeoJSON:** DataMeet India state + district boundaries. Store as static assets under `public/geo/` (e.g. `india-states.geojson`, `india-districts.geojson`) and `fetch()` them at runtime from the client-only map (keeps them out of the JS bundle — district GeoJSON is large, ~MB-scale; consider simplifying with mapshaper before committing, and/or lazy-loading district polygons only when a state is opened). Render via react-leaflet `<GeoJSON>`.

**UX — party edit form (managers/admins, in `PartyDialog`):**
- Inside the existing "Territory / monopoly" sub-section, when `monopoly_given` is checked, add a **pin-drop mini-map**: click the map to set `monopoly_lat`/`monopoly_lng` (a `<Marker>`), with a `<Circle>` preview of the radius.
- **Radius selector:** segmented control 50 km / 100 km / Custom (numeric km input) → writes `monopoly_radius_km`.
- Optional "Find location" text box → **Nominatim** (`https://nominatim.openstreetmap.org/search`) to recenter the map — convenience only, rate-limited, must send a proper `User-Agent`/`Referer`; pin-drop remains the source of truth. Treat Nominatim as best-effort (may fail/throttle — never block save on it).
- Keep the existing Division/State/District text inputs (back-compat + human-readable labels used by `/booked-areas` and the AI assistant).
- Live overlap banner now driven by `findMonopolyGeoOverlap` (§3).

**`/booked-areas` integration:** add a **map view alongside** the existing state accordion (a tab or a toggle — "List / Map"). The map plots every `monopoly_given` party that has a pin as a `<Circle>` + `<Marker>` (color/label by division or rep), with the India state/district GeoJSON underneath. Clicking a circle → popup linking to `/parties/$id`. The existing string drill-down stays as the default/fallback for parties without pins. **Reps:** the whole `/booked-areas` route is already manager/admin-only (reps hard-redirected). Per Harish's "reps see the map read-only" decision, we likely want reps to reach a **read-only map** — that means either relaxing the redirect for a read-only variant, or exposing the map elsewhere reps can reach (e.g. a read-only panel on `/parties/$id`). **Open question §7.**

---

## 5. Map → PNG → PDF download

**Approach: `html2canvas-pro` (already a dep) on the Leaflet map container**, not `leaflet-image` (leaflet-image is unmaintained, only handles canvas/raster layers, and struggles with GeoJSON/DOM markers). html2canvas-pro rasterizes the rendered DOM tile+overlay stack.
- **Caveat:** OSM tiles are cross-origin images; html2canvas needs them CORS-clean. OSM tile servers send permissive CORS, but set `crossOrigin: "anonymous"` on the Leaflet tile layer (`{ crossOrigin: true }` in react-leaflet `<TileLayer>`) so the canvas isn't tainted. Verify a real export before declaring done — a tainted canvas throws on `toDataURL`.
- Wait for tiles to finish loading before capturing (listen for the tile layer `load` event, or a short settle delay).

**Into the PDF (reuse existing pipeline):** capture → `canvas.toDataURL("image/png")` → `new jsPDF()` → `doc.addImage(pngDataUrl, "PNG", …)` for the map view, then `autoTable(doc, …)` below it with the party table (firm name, district, division, rep, radius) for the visible state/district. Header/logo can reuse the logo-to-dataURL helper in `src/lib/order-share.ts`. This is a "download this state/district with its parties" button on `/booked-areas`. jsPDF/autoTable are already imported statically elsewhere and are SSR-safe.

---

## 6. SSR caveat (must-handle — this is the biggest technical risk)

TanStack Start SSRs route modules on the server. **Leaflet and react-leaflet touch `window`/`document` at import time** — importing them at the top of a route module will crash SSR ("window is not defined"). The app has **no existing dynamic-import/client-only pattern** to copy, so this feature introduces it.

**Plan:**
- Put ALL Leaflet code in a dedicated component file (e.g. `src/components/territory-map.tsx`) that imports `leaflet`, `react-leaflet`, and `leaflet/dist/leaflet.css`. **Never import this file at a route-module top level.**
- Load it **client-only**: gate render behind a mounted flag (`const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`) and `React.lazy(() => import("@/components/territory-map"))` wrapped in `<Suspense>`, rendering only when `mounted`. This guarantees the Leaflet import never runs on the server.
- Also fix Leaflet's default marker-icon path issue (the well-known `L.Icon.Default` broken-marker bug under bundlers) inside that client-only file.
- Verify with `bun run build` (SSR build) + a real page load — an SSR crash shows at build/first-render, not in `tsc`.

---

## 7. Open decisions for Harish

1. **Order-time flagging** — there is currently NO monopoly check on orders/leads. Do you want one added (e.g. warn when an order's party sits inside another party's monopoly circle)? If yes it's a new sub-feature; if no, we do nothing there. (The brief assumed it already existed — it doesn't.)
2. **Multiple territories per party** — one pin/radius per party (current plan, columns on `parties`), or should a party hold several disjoint circles (→ needs a `party_territories` child table)?
3. **Default & max radius** — presets 50/100 km confirmed; what default when the manager just checks "monopoly given" without choosing? Any hard max (e.g. cap custom at 500 km)?
4. **Hard block vs soft warning** — today overlap is a soft warning (you can still save). Keep soft, or make an overlapping pin a hard block that prevents save?
5. **Division scoping of geo overlap** — only clash when the division matches (recommended), or geographic exclusivity regardless of division?
6. **Rep read-only map access** — `/booked-areas` is manager/admin-only today (reps redirected). Where do reps see the read-only map — a relaxed read-only `/booked-areas`, or a read-only panel on `/parties/$id`?
7. **District GeoJSON weight** — full DataMeet district polygons are large. OK to simplify (mapshaper) and/or lazy-load per-state, accepting slightly coarser boundaries?

---

## 8. Phased implementation plan

Each phase is independently shippable.

- **P1 — Schema + haversine + capture (no map render yet).** Migration (§2), `Party` type fields, `haversineKm` + `findMonopolyGeoOverlap` in `use-parties.ts`, wire the party form to persist lat/lng/radius (radius selector + a temporary plain numeric lat/lng entry OR a minimal pin map — see note), overlap banner uses the geo helper with string fallback. Fully useful on its own: geo-aware conflict warnings, data captured.
- **P2 — The map view.** Add `leaflet`/`react-leaflet` (bun + lockfile), client-only `territory-map.tsx` (§6), pin-drop UX in the party form, India GeoJSON assets, map view on `/booked-areas` alongside the accordion, read-only variant for reps (per §7 answer).
- **P3 — Map download.** "Download state/district (map + parties)" button → html2canvas-pro capture → jsPDF/autoTable (§5).

> Note: P1 needs *some* way to enter lat/lng. Cleanest is to land the pin-drop map in P1 (merges P1+P2 map work) — but if we want P1 shippable without the Leaflet/bun/SSR work, P1 can capture lat/lng via a temporary plain numeric input or a "paste Google-Maps coords" field, then P2 replaces it with the real pin-drop map. Recommend the latter split so P1 stays small and SSR-risk is isolated to P2.

---

## 9. Paste-ready implementer (Kimi) prompt — Phase 1

> **Task: Feature 1 (Geo monopoly), Phase 1 — schema + haversine conflict + pin/radius capture. Repo: `leadenthrella` (Cerebyl). Do NOT touch the map/Leaflet work yet (that's Phase 2).**
>
> 1. **Migration** — create `supabase/migrations/<timestamp>_f1_geo_monopoly.sql` with EXACTLY (idempotent):
>    ```sql
>    ALTER TABLE public.parties ADD COLUMN IF NOT EXISTS monopoly_lat       double precision;
>    ALTER TABLE public.parties ADD COLUMN IF NOT EXISTS monopoly_lng       double precision;
>    ALTER TABLE public.parties ADD COLUMN IF NOT EXISTS monopoly_radius_km numeric;
>    ```
>    (This migration is applied BY HAND in the Supabase SQL editor — do not run `supabase db push`.)
> 2. **Types** — in `src/lib/use-parties.ts`, add to the `Party` interface (near the existing `monopoly_*` fields), all OPTIONAL: `monopoly_lat?: number | null; monopoly_lng?: number | null; monopoly_radius_km?: number | null;`. Do not regenerate Supabase types; if the parties insert/update payload fails to typecheck, cast it `as any`.
> 3. **Helpers** — in `src/lib/use-parties.ts`, next to `findMonopolyOverlap`, add and export:
>    - `haversineKm(aLat:number, aLng:number, bLat:number, bLng:number): number` (standard haversine, R=6371).
>    - `findMonopolyGeoOverlap(parties: Party[], opts: { lat?: number|null; lng?: number|null; radiusKm?: number|null; division?: string|null; excludeId?: string }): Party | null` — returns the first OTHER party whose monopoly circle overlaps the candidate: when both parties have `monopoly_lat/lng/radius_km`, overlap = `haversineKm(centers) < candidateRadius + existingRadius` AND same division (case-insensitive); when either party lacks a pin, fall back to the existing `findMonopolyOverlap` string logic for that pair; consider only `monopoly_given` parties; skip `excludeId`.
> 4. **Party form** (`src/routes/parties.index.tsx`, `PartyDialog`, the "Territory / monopoly" sub-section): when `monopoly_given` is checked, add (a) a radius selector — segmented 50 km / 100 km / Custom(number) writing `form.monopoly_radius_km`, and (b) for now, a simple numeric Latitude and Longitude input pair writing `form.monopoly_lat` / `form.monopoly_lng` (the real map pin-drop lands in Phase 2). Persist all three on save. Keep the existing Division/State/District text inputs unchanged.
> 5. **Overlap banner** — replace the current `findMonopolyOverlap(...)` call in that section with `findMonopolyGeoOverlap(...)` (passing lat/lng/radius/division). Keep it a soft inline warning (do NOT block save). Message when geo overlap: "⚠ Overlap: {firm} holds a monopoly circle within range." Keep the existing string-overlap message as the fallback path.
> 6. Add the three fields to the party form's initial-state object (where `monopoly_given/division/state/district` defaults are set, ~lines 1029–1032).
> 7. Verify: `npx tsc --noEmit 2>&1 | grep -c "error TS"` must stay **139**; run `bun run build`. Do not commit `bun.lock`/`package.json` changes in this phase (no new deps).
> 8. Do not push — commit locally; Harish pushes.
