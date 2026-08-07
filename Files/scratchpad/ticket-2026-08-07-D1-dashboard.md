# Ticket D1 — Dashboard restructure to stitch-v2 design

## Preamble (applies to the whole task)
Project: Cerebyl CRM, repo `leadenthrella` (React 19 + TanStack Start + Tailwind + framer-motion). The Stitch design system is FINAL: CSS tokens (`--st-*`), type classes (`t-head-md`, `t-body-sm`, …), shadows (`sh-sm`/`sh-md`), pill bars (`bar-primary`), Inter font, white glass cards (`rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`). Do NOT restyle colors/fonts/tokens — they already match.

You are adapting PAGE STRUCTURE ONLY to a reference design:
- DO NOT touch: `src/components/app-shell.tsx`, any `src/components/*-section-header.tsx`, nav/menu bars of any kind, `src/styles.css` / tokens, data hooks, queries, mutations, route search schemas.
- Keep ALL functionality identical: same handlers, dialogs, role gating, params. Layout/structure only.
- Page container: full-width like the leads pages — NO `max-w-*` caps on page content (except where the design explicitly uses one), vertical rhythm `space-y-5` between major blocks. Page padding comes from the app shell (`md:p-8`) — do NOT add page-level padding wrappers.
- Structure source of truth: the analysis file and design HTML attached read-only. Where design and current code conflict on STRUCTURE (grid columns, card anatomy, block order), follow the design. Where the design shows data we don't have a hook for, SKIP that element — never invent data or queries.
- After your edits, `npx tsc --noEmit` must pass with 0 errors.

## This ticket: Dashboard
Read first, in this order:
1. `../Files/design/stitch-v2/ANALYSIS.md` lines 10–27 (section "dashboard_action_center") AND lines 257–271 ("Common patterns").
2. `../Files/design/stitch-v2/dashboard_action_center/code.html` (the reference markup).
3. `src/routes/dashboard.tsx` and `src/components/my-day-content.tsx` (current implementation).

Restructure the dashboard page to the design's structure:
- 12-column bento grid (`grid grid-cols-1 lg:grid-cols-12 gap-6`) with the design's block order and column spans (quick-actions tile grid, main action-center/My-Day column, AI/assistant card, stat panel with divider-separated stats instead of separate cards) — translate the design's glass-card blocks into our card idiom (`sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`).
- Flat text header region per the design (date line + greeting + subtitle), keeping the existing greeting/date data.
- Keep the existing My Day data/logic and any existing quick-action links; only their layout/anatomy changes (2-col tile grid, tile anatomy per design: icon chip + label + short line).
- Do NOT remove existing functional blocks unless the analysis says the design has no counterpart; if a current block has no design counterpart, keep it but place it in the bento in the most sensible span.
