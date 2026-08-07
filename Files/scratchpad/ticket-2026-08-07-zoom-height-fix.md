# TICKET — CRITICAL: zoom:0.8 broke all vh-based heights (empty band below app, drawer invisible)

Repo: `leadenthrella/`. Do not commit. Last commit added `.app-density { zoom: 0.8 }` (media md+) on the app shell root in `src/components/app-shell.tsx` and it broke the layout:

## Symptoms (confirmed live, screenshots reviewed)

1. The rounded app window only fills ~80% of the viewport HEIGHT — a large empty band of background shows below it; the leads sticky footer renders mid-cards; card rows are clipped.
2. Clicking a lead card appears to do nothing — the 420px peek drawer never becomes visible (it likely renders outside the visible/clipped area).

## Root cause

CSS `zoom: 0.8` scales the rendered result of `vh`-based lengths. The shell root uses `h-screen` (= 100vh), so after zoom the window is 80% of the viewport tall. Same for the leads drawer `xl:max-h-[calc(100vh-10rem)]`. Widths (percentage-based) are unaffected, which matches the screenshots.

## Fix (keep the density, kill the breakage)

1. In `src/styles.css`, change `.app-density` so the zoomed root compensates its height: keep `zoom: 0.8` and set `height: calc(100vh / 0.8)` (i.e. 125vh pre-zoom → exactly 100vh post-zoom). Ensure `html, body` have `overflow: hidden` so there is no outer page scroll and no empty scrollable band. The shell root already has `h-screen` — reconcile: the compensated height must WIN over `h-screen` (override in the same rule or replace the class on the root). Result: the rounded window must fill the viewport exactly, edge-to-edge vertically, with only the intended `md:p-4` breathing room.
2. Fix every other vh-based height inside the zoomed tree the same way — grep `src/` for `vh` usages inside components rendered under AppShell. Known: `src/routes/leads.all.tsx` drawer `xl:max-h-[calc(100vh-10rem)]` → compensate (e.g. `calc((100vh - 10rem) / 0.8)`) or better, drop vh entirely: make the drawer's height derive from its grid/flex parent (`self-start` + `max-h-full` against a height-bounded pane wrapper). Prefer parent-derived heights over vh wherever a bounded ancestor exists.
3. Verify the leads peek drawer specifically: click a card → drawer visible at the right, sticky within the scrolling main, internal body scroll, action bar (Log a call / Convert / Edit / Open full lead) always visible. The card grid scrolls to its last row.
4. Verify no outer/body scrollbar appears on any page (dashboard, leads, clients, settings).
5. Mobile (< md, no zoom): everything must behave exactly as before this ticket.

## Verify

`npx tsc --noEmit` = 0 errors AND `npm run build` succeeds. Report: every vh usage found and how each was fixed, plus the final height model (what bounds the window, what bounds main, what bounds the drawer).
