# TICKET — CRITICAL: no page scrolls anywhere + default density should be today's 80% zoom look

Repo: `leadenthrella/` — React 19 + TanStack Start + Tailwind + shadcn + framer-motion. Stitch tokens in `src/styles.css`. Do not commit.

## Bug 1 — Nothing scrolls (BROKE IN THE LAST TWO COMMITS — top priority)

Symptom (confirmed live on app.cerebyl.com): NO page scrolls — not /leads/all, not the peek drawer, not any other section. The layout is stuck at the first viewport.

Context: the shell is `h-screen overflow-hidden` (`src/components/app-shell.tsx`, root ~line 197) with the intent that ONLY `main` scrolls (`main` has `flex-1 overflow-y-auto`, ~line 297). The likely regression: when the desktop header row and the menu-bar row were added, the wrapper chain between the `h-screen` root and `main` grew (`glass … flex flex-col overflow-hidden` → header div → menu-bar div → `div.flex.min-w-0.flex-1.flex-col` → header (mobile) → main), and some flex child in that chain is missing `min-h-0`, so the content column grows past the viewport instead of constraining `main` — `overflow-y-auto` then never engages.

Fix:
- Walk the full ancestor chain of `<main>` in app-shell.tsx. Every flex-column ancestor between the `h-screen overflow-hidden` root and `main` that carries `flex-1` must also carry `min-h-0` (and the chain must be exactly one continuous height-constrained column: root h-screen → glass container flex-1 min-h-0? → content wrapper flex-1 min-h-0 → main flex-1 overflow-y-auto).
- Verify with the browser mental model: header + menu bar are `shrink-0`, main fills the rest and scrolls.
- Then check `src/routes/leads.all.tsx`: the card grid must scroll inside main; with the peek drawer open, the drawer (`xl:sticky xl:top-0 xl:max-h-[calc(100vh-10rem)] xl:self-start`) must stay visible with its internal body scroll and pinned action bar — re-verify this still works after the chain fix (adjust the max-h calc if the header+menubar heights changed the math; 100vh minus the actual chrome above main).
- Do NOT revert to page-level (body) scrolling — the rounded-window design with internal scroll stays.

## Bug 2 — Default density: make today's 80%-zoom layout the 100% default

The owner wants the app at browser-zoom 100% to look like it currently does at 80% zoom (denser, more content visible). Implement as an app-level density scale, desktop only:

- Simplest acceptable approach: CSS `zoom: 0.8` on the app shell's outer container at `md:` and up (via a Tailwind arbitrary variant like `md:[zoom:0.8]` or a small rule in styles.css under a `.app-density` class applied to the shell root). It must NOT apply on mobile.
- If `zoom` creates visible breakage (sticky/fixed offsets, popover anchoring), fall back to reducing the base font-size on the shell root to 12.8px equivalent — but try `zoom` first and check the leads page, header, menu bar, and a dialog/popover for glitches.
- After the scale, re-check Bug 1's `max-h-[calc(100vh-…)]` math still holds.

## Verify

`npx tsc --noEmit` = 0 errors. Report exactly which elements got `min-h-0`, what the final main-scroll chain looks like, which density approach you used, and any side effects you saw.
