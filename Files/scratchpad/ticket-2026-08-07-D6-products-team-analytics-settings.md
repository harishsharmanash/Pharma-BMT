# Ticket D6 — Products catalogue + Team directory + Analytics + Settings restructure

## Preamble (applies to the whole task)
Project: Cerebyl CRM, repo `leadenthrella` (React 19 + TanStack Start + Tailwind + framer-motion). The Stitch design system is FINAL: CSS tokens (`--st-*`), type classes (`t-head-md`, `t-body-sm`, …), shadows (`sh-sm`/`sh-md`), pill bars (`bar-primary`), Inter font, white glass cards (`rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`). Do NOT restyle colors/fonts/tokens — they already match.

You are adapting PAGE STRUCTURE ONLY to a reference design:
- DO NOT touch: `src/components/app-shell.tsx`, any `src/components/*-section-header.tsx`, nav/menu bars of any kind, `src/styles.css` / tokens, data hooks, queries, mutations, route search schemas.
- Keep ALL functionality identical: same handlers, dialogs, role gating, params. Layout/structure only.
- Page container: full-width like the leads pages — NO `max-w-*` caps, vertical rhythm `space-y-5`. Page padding comes from the app shell — do NOT add page-level padding wrappers.
- The section header (title + lens bar) and pill toolbar were finalized previously — KEEP them. Your changes start BELOW them.
- Structure source of truth: the analysis file and design HTMLs attached read-only. Where design and current code conflict on STRUCTURE, follow the design. Where the design shows data we don't have, SKIP that element — never invent data or queries. Only add stat cards computable from data the page ALREADY loads.
- After your edits, `npx tsc --noEmit` must pass with 0 errors.

## This ticket: Products + Team + Analytics + Settings
Read first, in this order:
1. `../Files/design/stitch-v2/ANALYSIS.md` lines 188–202 ("products_catalogue"), 239–256 ("team_staff_directory", "analytics_performance_hub", "settings_platform_config") AND 257–271 ("Common patterns").
2. Design HTMLs: `products_catalogue/code.html`, `team_staff_directory/code.html`, `analytics_performance_hub/code.html`, `settings_platform_config/code.html` under `../Files/design/stitch-v2/`.
3. `src/routes/products.all.tsx`, `src/routes/team.directory.tsx`, `src/routes/analytics.overview.tsx`, `src/routes/settings.index.tsx`.

Restructure:
- **products.all.tsx**: adopt the design's catalogue structure — product card grid anatomy per the design (image/placeholder block, name + pack/rate lines, status/stock pills) with the existing product data and the existing view modes. Keep import/export and all actions.
- **team.directory.tsx**: add the design's KPI strip (3 stat cards from already-loaded profiles data — e.g. total teammates, on leave, present today — only what existing data supports) and adopt the design's directory row/card anatomy (avatar + name/role two-line, contact actions, status pill). Keep the existing tabs/HR functionality exactly as-is.
- **analytics.overview.tsx**: reorder to the design's structure — 3 big KPI cards with delta chips FIRST (from existing computed stats), then the chart bento (3-col, tall charts `h-96` where the design shows them). Keep all existing charts/queries; if a current chart has no design counterpart, keep it below the design's blocks.
- **settings.index.tsx**: LIGHT touch — adopt only the design's page-level structure (settings groups as glass cards with the design's group header anatomy). Do NOT add the design's Administration Log sidebar or floating save bar — no data backs them. Keep every existing setting control identical.
