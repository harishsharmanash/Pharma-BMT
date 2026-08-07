# TICKET — CRITICAL: leads peek drawer never becomes visible when a card is clicked

Repo: `leadenthrella/`. Do not commit. Only touch `src/routes/leads.all.tsx` unless a tiny supporting change elsewhere is strictly necessary.

## Confirmed behavior (from live screenshots + code review)

Clicking a lead card DOES set state — the card grid correctly drops from 3 columns to 2 — but the 420px `LeadPeekDrawer` NEVER appears on screen. It renders in the DOM but is not visible/positioned correctly.

## Suspected root cause

The drawer (`LeadPeekDrawer`'s `<aside>`, ~line 763) relies on `xl:sticky xl:top-0 xl:max-h-[calc((100vh-10rem)/0.8)] xl:self-start` inside the scrolling `main`. The app root currently has `zoom: 0.8` (`.app-density` in `src/styles.css`, desktop only). `position: sticky` inside a CSS-zoomed ancestor is buggy in Chromium — the stuck offset is miscalculated, which fits the symptom exactly (drawer rendered but effectively offscreen).

## Required fix — remove the sticky dependency entirely

Make the drawer position structural, not sticky, on xl screens:

1. On `xl` and up, the leads page becomes a height-bounded column inside `main` (main already has a definite height — it is `flex-1 min-h-0 overflow-y-auto` in a bounded chain): page sections above the content (header, toolbar) stay `shrink-0`; the two-pane content row (`flex flex-col gap-6 xl:flex-row`, ~line 364) gets `xl:flex-1 xl:min-h-0 xl:overflow-hidden`.
   - The grid/table column (`min-w-0 flex-1` wrapper, ~line 365) gets `xl:min-h-0 xl:overflow-y-auto` — it scrolls internally on xl.
   - The drawer `<aside>` drops ALL of `xl:sticky xl:top-0 xl:max-h-[…] xl:self-start` and becomes simply `xl:h-full` (keep `w-full … xl:w-[420px]`) — a full-height column of the bounded row. Its internal body keeps `flex-1 overflow-y-auto` and the action block stays `shrink-0` pinned at the bottom. No vh math anywhere.
2. Below xl (mobile/tablet): unchanged — drawer stacks full-width under the grid and main scrolls normally.
3. The page root on xl: give it `xl:flex xl:h-full xl:min-h-0 xl:flex-col` (and remove `space-y-5` conflicts on xl if they fight the bounded layout — use gaps inside the scroll column instead if needed). If the conditional pagination footer (pageCount > 1) renders, it must sit at the bottom of the scrolling grid column on xl, and in normal main flow below xl.
4. The page-level `main` scroll on xl will mostly idle for /leads/all — that's fine and intended; other pages keep scrolling in main as today.

## Acceptance

- Click a card at desktop width → drawer visible immediately at the right, full height, body scrolls, action bar (Log a call / Convert / Edit / Open full lead) always visible.
- Grid scrolls to its last row with the drawer open; drawer never moves.
- Table view row click → same drawer behavior.
- No regression below xl; no outer body scroll; `npx tsc --noEmit` = 0.

Report exactly what you changed and the final height model on xl.
