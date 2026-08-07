# TICKET — Roll the stitch design system to Analytics + Settings sections

You are working in the Cerebyl CRM repo `leadenthrella/` — React 19 + TanStack Start + Tailwind + shadcn/ui + framer-motion. The app has a locked design system called "stitch", already fully applied to the Leads section. Your job: bring the Analytics and Settings sections up to the same look. Do NOT redesign — copy the established patterns.

## The stitch conventions (source of truth)

- Tokens: `.stitch` block in `src/styles.css` (~lines 482-529): `--st-primary`, `--st-on-primary`, `--st-on-surface`, `--st-on-surface-variant`, `--st-surface`, `--st-surface-container-low`, `--st-surface-container-high`, `--st-outline-variant`, `--st-background`, `--st-error`, `--st-error-container`, `--st-secondary-container`. Utility classes `.pill`, `.sh-sm`, `.sh-md`, `.sh-lg`, `.t-head-*`, `.t-data` live in the same file.
- Exemplar implementation (READ-ONLY, copy its idioms): `src/routes/leads.all.tsx` — page root `stitch space-y-5`; cards `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`; toolbar row with `.pill sh-md border-0` filters; action buttons `.pill sh-md` filled primary; section header pattern in `src/components/leads-section-header.tsx` (icon tile + title + description left, segmented control right-aligned on the SAME row, sliding `layoutId` thumb); sticky footer bar pattern.
- Light theme only. No gradients (`gradient-brand`, `shadow-glow`, `glass-hero` banned). No dark glass.
- App shell already provides: `h-screen` rounded window, top nav bar, header, `main flex-1 overflow-y-auto`. Pages must NOT set min-h-screen or page scroll.

## Scope — ONLY these files

Analytics: `src/routes/analytics.tsx`, `analytics.index.tsx`, `analytics.overview.tsx`, `analytics.leaderboard.tsx`, `analytics.products.tsx` (+ section-specific components).
Settings: `src/routes/settings.tsx`, `settings.index.tsx`, `settings.admin.tsx`, `settings.admin.index.tsx`, `settings.admin.activity.tsx`, `settings.admin.ai-usage.tsx` (+ section-specific components).
Also small standalone pages if trivially in scope: `src/routes/trash.tsx`, `src/routes/help.tsx` — ONLY if they are simple pages; skip if complex.

Do NOT touch: app-shell.tsx, leads.*, clients.*, orders.*, products.*, team.*, portal.*, console.*, `src/components/ui/*`.

## What to apply

1. Page root `stitch` class + `space-y-5` rhythm; remove font overrides.
2. Section headers: leads pattern (icon tile + title + description left; sub-nav segmented control right-aligned same row, sliding layoutId thumb, distinct layoutId per section).
3. Cards/stat tiles → `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`.
4. Buttons → `.pill sh-md` filled primary for primary actions, `.pill sh-md border-0` for filters.
5. Status/alert badges → stitch tones (error red tint / primary 10% tint / neutral grey). Kill gradients and saturated legacy hues.
6. Tables: header `--st-on-surface-variant`, dividers `border-white/50`, row hover `--st-surface-container-low`.
7. Charts/graphs: restyle container cards + legend text colors to `--st-*`; do NOT change chart libraries or data logic. Accent color `--st-primary`.
8. Settings forms: inputs/toggles get rounded-full/rounded-2xl stitch treatment where trivially safe; never change form logic, validation, or mutations.
9. Preserve ALL behavior. Visual pass only.

## Verify

Run `npx tsc --noEmit` in `leadenthrella/` — must be 0 errors. Report per file: what was restyled, anything deliberately left unchanged and why.
