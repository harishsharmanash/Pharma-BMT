# Ticket D4 — Payment intimations + Portal requests + Transporters restructure

## Preamble (applies to the whole task)
Project: Cerebyl CRM, repo `leadenthrella` (React 19 + TanStack Start + Tailwind + framer-motion). The Stitch design system is FINAL: CSS tokens (`--st-*`), type classes (`t-head-md`, `t-body-sm`, …), shadows (`sh-sm`/`sh-md`), pill bars (`bar-primary`), Inter font, white glass cards (`rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`). Do NOT restyle colors/fonts/tokens — they already match.

You are adapting PAGE STRUCTURE ONLY to a reference design:
- DO NOT touch: `src/components/app-shell.tsx`, any `src/components/*-section-header.tsx`, nav/menu bars of any kind, `src/styles.css` / tokens, data hooks, queries, mutations, route search schemas.
- Keep ALL functionality identical: same handlers, dialogs, role gating, params. Layout/structure only.
- Page container: full-width like the leads pages — NO `max-w-*` caps, vertical rhythm `space-y-5`. Page padding comes from the app shell — do NOT add page-level padding wrappers.
- The section header (title + lens bar) and pill toolbar were finalized previously — KEEP them. Your changes start BELOW them.
- Structure source of truth: the analysis file and design HTMLs attached read-only. Where design and current code conflict on STRUCTURE, follow the design. Where the design shows data we don't have, SKIP that element — never invent data or queries.
- After your edits, `npx tsc --noEmit` must pass with 0 errors.

## This ticket: Intimations + Requests + Transporters
Read first, in this order:
1. `../Files/design/stitch-v2/ANALYSIS.md` lines 124–187 (sections "orders_payment_intimations", "orders_portal_requests", "orders_transporters_management") AND lines 257–271 ("Common patterns").
2. Design HTMLs: `orders_payment_intimations/code.html`, `orders_portal_requests/code.html`, `orders_transporters_management/code.html` under `../Files/design/stitch-v2/`.
3. `src/routes/orders.intimations.tsx`, `src/routes/orders.requests.tsx`, `src/routes/orders.transporters.tsx`.

Restructure:
- **orders.intimations.tsx**: switch from the single-column stack to the design's 3-column card grid (`grid sm:grid-cols-2 xl:grid-cols-3 gap-6`). Card anatomy per design: status pill at top, 48px icon/avatar block, party name + meta lines, 2 inset stat boxes (amount / date or mode), footer action row with the Confirm action first — wire to the EXISTING confirm/reject handlers and dialog.
- **orders.requests.tsx**: adopt the design's rich inline request cards: items panel (product + qty + amount lines from existing data), notes box when notes exist, and a right action column (`lg:w-72`) with the existing approve/reject actions; 4px accent bar on the card's leading edge using an existing Stitch token color. Keep the existing review flow/dialog — the cards are the list anatomy, actions stay as they are.
- **orders.transporters.tsx**: adopt the design's wide horizontal transporter cards in the list, and convert the detail view into the design's sticky right detail panel layout (`h-[calc(100vh-10rem)]` sticky panel beside the list on desktop, list takes remaining width) instead of wherever detail currently renders. Keep the existing table/grid toggle ONLY if it still makes sense with the new cards — if the design replaces the grid, drop the grid view and keep list; keep all data and actions identical either way. If there is a separate transporter detail route, keep it working (link to it from the panel).
