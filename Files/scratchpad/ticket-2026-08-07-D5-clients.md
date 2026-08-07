# Ticket D5 — Clients: Parties list + Territory mapping restructure

## Preamble (applies to the whole task)
Project: Cerebyl CRM, repo `leadenthrella` (React 19 + TanStack Start + Tailwind + framer-motion). The Stitch design system is FINAL: CSS tokens (`--st-*`), type classes (`t-head-md`, `t-body-sm`, …), shadows (`sh-sm`/`sh-md`), pill bars (`bar-primary`), Inter font, white glass cards (`rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`). Do NOT restyle colors/fonts/tokens — they already match.

You are adapting PAGE STRUCTURE ONLY to a reference design:
- DO NOT touch: `src/components/app-shell.tsx`, any `src/components/*-section-header.tsx`, nav/menu bars of any kind, `src/styles.css` / tokens, data hooks, queries, mutations, route search schemas.
- Keep ALL functionality identical: same handlers, dialogs, role gating, params. Layout/structure only.
- Page container: full-width like the leads pages — NO `max-w-*` caps (the territories page currently caps at `max-w-3xl` — remove that), vertical rhythm `space-y-5`. Page padding comes from the app shell — do NOT add page-level padding wrappers.
- The section header (title + lens bar) and pill toolbar were finalized previously — KEEP them. Your changes start BELOW them.
- Structure source of truth: the analysis file and design HTMLs attached read-only. Where design and current code conflict on STRUCTURE, follow the design. Where the design shows data we don't have, SKIP that element — never invent data or queries.
- After your edits, `npx tsc --noEmit` must pass with 0 errors.

## This ticket: Parties + Territories
Read first, in this order:
1. `../Files/design/stitch-v2/ANALYSIS.md` lines 203–238 (sections "clients_parties_list", "clients_territory_mapping") AND lines 257–271 ("Common patterns").
2. Design HTMLs: `clients_parties_list/code.html` and `clients_territory_mapping/code.html` under `../Files/design/stitch-v2/`.
3. `src/routes/clients.parties.tsx` and `src/routes/clients.territories.tsx`.

Restructure:
- **clients.parties.tsx**: adopt the design's parties list/table structure — glass table/list card with avatar-or-initials + two-line row anatomy (firm name + city/contact line), status/dues pills where the current data has them, `px-6 py-4` cells, and a "Showing X–Y of Z" footer if the design has one (keep existing pagination/data logic; if the page currently shows all parties without pagination, keep that and skip the footer). Keep the existing grid/table view toggle and its data.
- **clients.territories.tsx**: replace the accordion/state-grouped layout with the design's persistent side-by-side structure: map on the left (`flex-1`) + searchable territory sidebar on the right (`w-96`, list of territories with counts, using existing data). Remove the `max-w-3xl` cap so the split uses the full width. Keep the existing map component and its data wiring; on mobile the sidebar stacks below/above the map (design's mobile order). Keep the existing list/map toggle ONLY if the new structure still needs it — if the new structure shows both persistently on desktop, the toggle may collapse to mobile-only; use your judgment but keep ALL existing data and actions.
