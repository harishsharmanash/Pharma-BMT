# Ticket D2 — Leads list + table + peek drawer restructure to stitch-v2 design

## Preamble (applies to the whole task)
Project: Cerebyl CRM, repo `leadenthrella` (React 19 + TanStack Start + Tailwind + framer-motion). The Stitch design system is FINAL: CSS tokens (`--st-*`), type classes (`t-head-md`, `t-body-sm`, …), shadows (`sh-sm`/`sh-md`), pill bars (`bar-primary`), Inter font, white glass cards (`rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`). Do NOT restyle colors/fonts/tokens — they already match. Lead temperature/status colors (Hot #E5484D / Warm #F59E0B / Cold #38BDF8 and the ST_STAGE map) were finalized earlier — do NOT change them.

You are adapting PAGE STRUCTURE ONLY to a reference design:
- DO NOT touch: `src/components/app-shell.tsx`, any `src/components/*-section-header.tsx`, nav/menu bars of any kind, `src/styles.css` / tokens, data hooks, queries, mutations, route search schemas.
- Keep ALL functionality identical: same handlers, dialogs, role gating, params. Layout/structure only.
- Page container: full-width like the current leads pages, vertical rhythm `space-y-5`. Page padding comes from the app shell — do NOT add page-level padding wrappers.
- Structure source of truth: the analysis file and design HTMLs attached read-only. Where design and current code conflict on STRUCTURE, follow the design. Where the design shows data we don't have a hook for, SKIP that element — never invent data or queries.
- After your edits, `npx tsc --noEmit` must pass with 0 errors.

## This ticket: Leads
Read first, in this order:
1. `../Files/design/stitch-v2/ANALYSIS.md` lines 28–78 (sections "leads_all_views", "leads_database_table_view", "lead_details_dr._sarah_jenkins") AND lines 257–271 ("Common patterns").
2. Design HTMLs: `leads_all_views/code.html`, `leads_database_table_view/code.html`, `lead_details_dr._sarah_jenkins/code.html` under `../Files/design/stitch-v2/`.
3. `src/routes/leads.all.tsx` (list/grid/table + `LeadPeekDrawer` — the lead detail drawer is defined in this same file around line 730).

Restructure:
- **Table view**: adopt the design's table anatomy — glass table card with in-card header row, `px-6 py-4` cells, avatar/icon + two-line row anatomy, dot-pill status badges, and a "Showing X–Y of Z" pagination footer INSIDE the table card. Keep existing pagination logic.
- **Card/grid view**: adopt the design's card anatomy (icon/avatar block, title + two-line meta, badge placement, footer row) while keeping the existing card data and click behavior.
- **LeadPeekDrawer**: adopt the design's lead-detail header card anatomy — larger avatar/initials block, name + badge row (temp/stage/status pills), and a row of circular icon action buttons (call / WhatsApp / mail) using the EXISTING actions the drawer already has. Do NOT add the design's 5-tab system — the drawer keeps its current content sections below the new header; only the header anatomy and section spacing change.
- Keep the drawer's structural fixes from earlier work: bounded column layout, internal scroll, no sticky footer, opens at `lg` breakpoint.
