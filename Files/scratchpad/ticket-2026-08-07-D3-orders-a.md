# Ticket D3 — Orders list + Dues aging restructure to stitch-v2 design

## Preamble (applies to the whole task)
Project: Cerebyl CRM, repo `leadenthrella` (React 19 + TanStack Start + Tailwind + framer-motion). The Stitch design system is FINAL: CSS tokens (`--st-*`), type classes (`t-head-md`, `t-body-sm`, …), shadows (`sh-sm`/`sh-md`), pill bars (`bar-primary`), Inter font, white glass cards (`rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`). Do NOT restyle colors/fonts/tokens — they already match.

You are adapting PAGE STRUCTURE ONLY to a reference design:
- DO NOT touch: `src/components/app-shell.tsx`, any `src/components/*-section-header.tsx`, nav/menu bars of any kind, `src/styles.css` / tokens, data hooks, queries, mutations, route search schemas.
- Keep ALL functionality identical: same handlers, dialogs, role gating, params. Layout/structure only.
- Page container: full-width like the leads pages — NO `max-w-*` caps on page content, vertical rhythm `space-y-5`. Page padding comes from the app shell — do NOT add page-level padding wrappers.
- The section header (title + lens bar) and the pill toolbar row below it were finalized in a previous ticket — KEEP them exactly as they are. Your changes start BELOW the toolbar row.
- Structure source of truth: the analysis file and design HTMLs attached read-only. Where design and current code conflict on STRUCTURE, follow the design. Where the design shows data we don't have a hook for, SKIP that element — never invent data or queries. Only add a KPI/stat card if the numbers can be derived from data the page ALREADY loads (useMemo over existing arrays).
- After your edits, `npx tsc --noEmit` must pass with 0 errors.

## This ticket: Orders list + Dues aging
Read first, in this order:
1. `../Files/design/stitch-v2/ANALYSIS.md` lines 79–123 (sections "orders_dues_aging_analysis", "orders_invoices_dues") AND lines 257–271 ("Common patterns").
2. Design HTMLs: `orders_invoices_dues/code.html` and `orders_dues_aging_analysis/code.html` under `../Files/design/stitch-v2/`.
3. `src/routes/orders.all.tsx` and `src/routes/orders.dues.tsx`.

Restructure:
- **orders.all.tsx**: add the design's KPI strip — 3 big stat cards (`p-6`/`p-8` glass cards, icon chip + uppercase small label + large value + small delta/sub line) ABOVE the table, computed ONLY from already-loaded orders data (e.g. today's orders, overdue >30d, pending approvals/drafts — pick what the existing data supports). Then the orders table becomes a titled glass table card per the design: card header row (title + existing filter controls stay in the toolbar above, card header may hold the table title/count), `px-6 py-4` cells, and a "Showing X–Y of Z" pagination footer inside the card. Keep existing pagination/filter logic.
- **orders.dues.tsx**: keep the existing 4 bucket stat cards but restyle their anatomy to the design's KPI card anatomy (icon chip + label + big value). Keep the pill toolbar (search + bucket filter) as-is. Restructure the dues list/table below to the design's row anatomy (party name + two-line meta, amount right-aligned, aging bucket pill, `px-6 py-4`).
