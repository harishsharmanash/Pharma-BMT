# TICKET — Font consistency: one family everywhere (Inter), weight does the layering

Repo: `leadenthrella/`. Do not commit. Visual-only; zero behavior changes.

## Problem

The finalized app font is the stitch family — Inter (`src/styles.css` line ~505: `.stitch { font-family: Inter, system-ui, sans-serif }`). But large parts of the app still render in the old system/boxy font because of leftover overrides:

- `font-ios` class (`--font-ios: -apple-system, BlinkMacSystemFont, "Inter", …` — styles.css ~line 69) still applied on: `src/routes/dashboard.tsx:138`, `src/routes/leads.intake.tsx:27`, `src/routes/leads.duplicates.tsx:48`, `src/routes/leads.followups.tsx:69`, `src/routes/products.stock.tsx:34`, `src/components/ios/ios-sheet.tsx:41`, `src/routes/dev.ios.tsx:78` (leave dev.ios.tsx alone — it's a sandbox).
- Any other font-affecting utilities anywhere in `src/`: grep for `font-mono`, `font-serif`, `font-sans`, `font-ios`, `text-ios-`, and inline `fontFamily` styles. The base `body` font (styles.css base layer) may also not be Inter — check and align it.

## Required changes

1. **One family everywhere:** the whole app renders Inter (falling back to system-ui). Remove `font-ios` from the routes listed above (NOT from ios-sheet.tsx's iOS-specific components and NOT dev.ios.tsx — those are a deliberate device shell). Set the base `body` font-family to the same Inter stack so non-`.stitch` pages match too. Remove/convert any `font-mono`/`font-serif`/inline fontFamily found in app UI (lead codes, table cells, etc.) — if a numeric/code look is needed, use Inter with `tabular-nums` instead.
2. **Layering via weight only:** hierarchy comes from Inter weights (e.g. 300/400/500/600/700) — verify the type utility classes (`.t-head-*`, `.t-body-*`, `.t-data`, `.t-label`, `.chip` in styles.css) all resolve to the Inter stack with appropriate weights, and fix any that pull a different family. Keep sizes as they are; this ticket is about family consistency, not a type-scale redesign.
3. Ensure Inter is actually loaded for the weights used (check the font import in styles.css or index.html — if only 400/500 are fetched, extend the import to cover 300–700).
4. Special attention: the leads TABLE view (`src/routes/leads.all.tsx` table branch) — the owner flagged it specifically. After your changes every cell must render Inter.

## Verify

`npx tsc --noEmit` = 0. Grep results before/after for the font classes. Report every file changed and any spot you deliberately left (ios shell, dev sandbox).
