# TICKET — Stitch design pass on detail routes (leads.$id, parties.$id, orders.$id)

You are working in the Cerebyl CRM repo `leadenthrella/` — React 19 + TanStack Start + Tailwind + shadcn/ui + framer-motion. The app has a locked design system called "stitch", fully applied to the Leads list page. Your job: give the three detail pages the same look. Do NOT redesign — copy the established patterns.

## The stitch conventions (source of truth)

- Tokens: `.stitch` block in `src/styles.css` (~lines 482-529). Utility classes `.pill`, `.sh-sm`, `.sh-md`, `.sh-lg`, `.t-head-*`, `.t-data` in the same file.
- Exemplar (READ-ONLY): `src/routes/leads.all.tsx` (page root `stitch space-y-5`, cards `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`, `.pill sh-md` filled-primary action buttons, stitch status pills: error red tint urgent / primary 10% tint info / neutral grey muted) and `src/components/leads-section-header.tsx` (icon tile + title + description header pattern). Also the peek drawer inside `leads.all.tsx` (~line 765) shows the detail-panel idiom: avatar block, STAGE / TEMPERATURE / PRODUCT INTEREST label-value groups, sticky bottom action bar with filled `.pill sh-md` buttons.
- Light theme only. No gradients, no dark glass. App shell provides the rounded window + internal scroll; pages must NOT set min-h-screen.

## Scope — ONLY these files (+ their section-specific detail components under src/components/, NOT src/components/ui/*)

- `src/routes/leads.$id.tsx`
- `src/routes/parties.$id.tsx` (and `parties_.$id.territory.tsx` ONLY if it's a simple styled page; skip if complex)
- `src/routes/orders.$id.tsx`

## What to apply

1. Page root `stitch` + `space-y-5`; remove font overrides (`font-ios` etc.).
2. Header: back link + icon tile + entity name + subtitle, following the leads header pattern; primary actions (Edit, Convert, Log a call, record payment, etc.) as filled `.pill sh-md` primary buttons; destructive actions as error-tint pills, never filled red blocks.
3. Content cards/panels → `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`; section labels uppercase `t-data text-[color:var(--st-on-surface-variant)]`.
4. Status/temp/stage badges → stitch tones (error red tint / primary 10% tint / neutral grey, dot + uppercase label like the leads card pills).
5. Timeline/activity lists: dividers `border-white/50`, muted text `--st-on-surface-variant`, icons `--st-primary`.
6. Tables (order items, etc.): header `--st-on-surface-variant`, dividers `border-white/50`.
7. Preserve ALL behavior: loaders, mutations, dialogs, permissions. Visual pass only.

## Verify

Run `npx tsc --noEmit` in `leadenthrella/` — must be 0 errors. Report per file: what was restyled, anything deliberately left unchanged and why.
