# TICKET — Leads page UI fixes (4 items)

You are working in the Cerebyl CRM monorepo. The app is `leadenthrella/` — React 19 + TanStack Start + Tailwind + shadcn/ui. The active design system is "stitch": tokens in the `.stitch` block of `leadenthrella/src/styles.css` (~lines 482-529: `--st-primary`, `--st-on-surface`, `--st-surface-container-low`, `--st-outline-variant`, etc.) and the `.pill` / `.sh-md` / `.sh-sm` utility classes defined in the same file. The approved visual reference is `Files/design/leads-reference/leads-reference-SELF-CONTAINED.tsx` (already attached read-only) and the screenshot `Files/design/leads-reference/ss1.png` shows the target: the app looks like ONE fixed rounded window — header on top, content scrolls internally, footer bar pinned at the bottom so the window's bottom rounded corner is always visible without scrolling the page.

Make EXACTLY these 4 fixes. Do not refactor anything else. Do not commit.

## Fix 1 — Toolbar must be ONE row (file: leadenthrella/src/routes/leads.all.tsx)

Currently the toolbar wraps onto two rows: filters on row 1, and Select / Import / Quick enquiry / Add lead wrapped to row 2. Wrong. Match the reference (ref tsx lines 227-252): a single horizontal row, `flex items-center justify-between gap-4 flex-nowrap`:

- LEFT group: compact white-pill search input (shrink it: `max-w-[220px]`), Stage / Temp / Rep filter pills, the `h-6 w-px` divider, the sort pill, and the Save-view control (make it a compact pill too).
- RIGHT group: ViewToggle, then Select / Import / Quick enquiry / Add lead as `.pill sh-md` buttons.
- If space is tight, the row may scroll horizontally (`overflow-x-auto`) but must NOT wrap to a second line.

## Fix 2 — Footer pinned so the rounded window corner is always visible (files: leadenthrella/src/components/app-shell.tsx, leadenthrella/src/routes/leads.all.tsx)

Currently the app root is page-level scroll (`app-shell.tsx` ~line 257 `min-h-screen`, `main` ~line 302 `p-4 md:p-8`), so the leads footer and the shell's bottom rounded corner are only visible after scrolling. Change to the reference layout (ref tsx ~line 132: fixed `h-screen overflow-hidden` panes with internal scroll):

- App shell root becomes `h-screen overflow-hidden` (no page scroll). Sidebar stays full-height fixed. The content column is a flex column: the existing header stays pinned at top; `main` becomes `flex-1 overflow-y-auto` (internal scroll) keeping its padding.
- In leads.all.tsx, make the pagination footer bar sticky at the bottom of the scrolling pane: add `sticky bottom-0` (with its existing `border-t border-white/50` and a solid/blurred background so cards don't show through, e.g. `bg-[--st-surface]/90 backdrop-blur`).
- Result: on /leads/all the footer bar and the window's bottom rounded corner are visible at all times; only the card grid scrolls. Verify other pages still render sanely (their content just scrolls inside main).

## Fix 3 — Lead peek drawer needs its own scroll + sticky action bar (file: leadenthrella/src/routes/leads.all.tsx, drawer ~line 732)

Currently when a lead is clicked, the inline 420px peek panel's bottom action buttons (Log a call / Convert / Edit / Open full lead) require scrolling the whole page to reach. Fix: the drawer becomes a fixed-height flex column matching the content pane height (`h-full` inside the pane, `overflow-hidden`), its body content gets `flex-1 overflow-y-auto`, and the action-button block becomes a sticky footer inside the drawer (`shrink-0 border-t border-white/50 bg-[--st-surface] p-4`, always visible). No page scroll should be needed to reach Log a call / Convert / Edit.

## Fix 4 — Ceremate button + profile avatar: kill the old gradient (file: leadenthrella/src/components/app-shell.tsx, header ~lines 271-301)

The Ceremate header button and the user avatar still use the old gradient styling. Restyle to the flat stitch look:

- Ceremate button: `.pill sh-md` filled `bg-[--st-primary] text-[--st-on-primary]`, keep its sparkle icon, no gradient.
- Avatar circle: flat `bg-[--st-primary] text-[--st-on-primary]` (initials), no gradient, no ring beyond the existing one if any.

## Verify

Run `npx tsc --noEmit` inside `leadenthrella/` and report the error count. It must be 0. Report a concise list of every change you made.
