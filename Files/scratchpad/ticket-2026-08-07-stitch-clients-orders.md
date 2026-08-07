# TICKET — Roll the stitch design system to Clients + Orders sections

You are working in the Cerebyl CRM repo `leadenthrella/` — React 19 + TanStack Start + Tailwind + shadcn/ui + framer-motion. The app has a locked design system called "stitch", already fully applied to the Leads section. Your job: bring the Clients and Orders sections up to the same look. Do NOT redesign — copy the established patterns.

## The stitch conventions (source of truth)

- Tokens: `.stitch` block in `src/styles.css` (~lines 482-529): `--st-primary`, `--st-on-primary`, `--st-on-surface`, `--st-on-surface-variant`, `--st-surface`, `--st-surface-container-low`, `--st-surface-container-high`, `--st-outline-variant`, `--st-background`, `--st-error`, `--st-error-container`, `--st-secondary-container`. Utility classes `.pill`, `.sh-sm`, `.sh-md`, `.sh-lg`, `.t-head-*`, `.t-data` live in the same file.
- Exemplar implementation (READ-ONLY, copy its idioms): `src/routes/leads.all.tsx` — note: page root `stitch space-y-5`; cards `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`; toolbar = single row `flex items-center justify-between gap-4 overflow-x-auto` with filled `.pill sh-md border-0` filter buttons, `mx-1 h-6 w-px bg-[color:var(--st-outline-variant)]/30` divider; action buttons `.pill sh-md` filled `bg-[color:var(--st-primary)] text-[color:var(--st-on-primary)]`; section header pattern in `src/components/leads-section-header.tsx` (icon tile + title + description left, segmented lens control right-aligned on the SAME row, sliding `layoutId` thumb); white-pill view toggle `src/components/view-toggle.tsx`; sticky footer bar `sticky bottom-0 z-20 ... border-t border-white/50 bg-white/90 backdrop-blur` with rows-per-page + `n-m of X` chevron pill.
- Light theme only. No gradients (`gradient-brand`, `shadow-glow`, `glass-hero` are banned). No dark glass.
- App shell already provides: `h-screen` rounded window, top nav bar, header, `main flex-1 overflow-y-auto`. Pages must NOT set their own min-h-screen or page scroll.

## Scope — ONLY these files

Clients: `src/routes/clients.tsx`, `clients.index.tsx`, `clients.parties.tsx`, `clients.territories.tsx`, plus their section-specific components under `src/components/` (e.g. parties/clients components you find imported there — NOT shared ui primitives in `src/components/ui/`).
Orders: `src/routes/orders.tsx`, `orders.index.tsx`, `orders.all.tsx`, `orders.requests.tsx`, `orders.intimations.tsx`, `orders.transporters.tsx`, plus their section-specific components.

Do NOT touch: app-shell.tsx, leads.* files, lead-dialog.tsx, view-toggle.tsx, `src/components/ui/*` primitives, portal.*, console.*, settings.*, analytics.*, team.*, products.* files.

## What to apply in each section

1. Page root gets the `stitch` class and the leads page spacing rhythm (`space-y-5`), Inter font (remove any font-ios or other font overrides).
2. Section header: same pattern as leads — icon tile + title + description left; any existing sub-nav/segmented control (clients/orders have layout routes with their own sub-nav — e.g. All parties / Territories; All / Requests / Intimations / Transporters) restyled as the leads lens segmented control, right-aligned on the title row with a sliding `layoutId` thumb (reuse the pattern from `leads-section-header.tsx`, distinct layoutId per section).
3. Cards/list containers → `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl` (or /70 bg for toolbar strips).
4. Buttons: primary actions (Add/Import/etc.) → `.pill sh-md` filled primary; filter/sort controls → `.pill sh-md border-0`; remove squared outline buttons from headers.
5. Badges/pills for statuses: map to stitch tones — error red tint for overdue/urgent, primary 10% tint for info, neutral grey (`--st-surface-container-high`) for muted. Kill saturated legacy blues/yellows and any `gradient-brand`.
6. Tables: keep functionality, but header row `text-[color:var(--st-on-surface-variant)]`, dividers `border-white/50`, row hover `--st-surface-container-low`.
7. Pagination footers (if any) → the leads sticky footer bar pattern.
8. Preserve ALL behavior: queries, mutations, filters, dialogs, permissions, routes. This is a visual pass only.

## Verify

Run `npx tsc --noEmit` in `leadenthrella/` — must be 0 errors. Report per file: what was restyled, any place you deliberately left unchanged and why.
