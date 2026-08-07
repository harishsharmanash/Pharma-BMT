# TICKET — Move section nav from sidebar to a top bar with sliding bubble

You are working in the Cerebyl CRM repo `leadenthrella/` — React 19 + TanStack Start + Tailwind + shadcn/ui + framer-motion. Design system "stitch": tokens in the `.stitch` block of `src/styles.css` (`--st-primary`, `--st-on-surface`, `--st-surface-container-low`, `--st-outline-variant`, `--st-background`) and utility classes `.pill`, `.sh-sm`, `.sh-md`, `.sh-lg` in the same file. The app currently renders as a fixed rounded window: `app-shell.tsx` root is `h-screen overflow-hidden`, header pinned on top, `main` scrolls internally. KEEP that.

Make EXACTLY this change. Do not commit. Do not refactor anything else.

## What

Replace the desktop left sidebar with a horizontal top navigation bar with a sliding-bubble active indicator. Mobile keeps the existing sheet/drawer nav — do not touch the mobile sheet logic except removing what becomes dead.

## Current structure (recon already done for you)

`src/components/app-shell.tsx`:
- `NAV` array (~lines 38-81): section entries `{ to, icon, label, roles/feature/perm/anyOf, badge/count }` — gating logic MUST be preserved exactly.
- `renderSidebar` (~lines 123-251): renders the desktop sidebar — company brand block at top, nav items, collapse control, bottom links (Settings/Trash/Help may live here — preserve ALL entries in the new bar).
- Sliding active pill precedent (~lines 163-171): `motion.span layoutId={navId}` with the SLIDE spring from `useMotionFlow`. REUSE this exact pattern for the top bar bubble.
- Mobile sheet (~lines 308-326): keep working as-is.
- Shell root ~line 257: `stitch relative flex h-screen w-full overflow-hidden ... md:p-4`; header ~lines 271-301; `main` ~line 302 `flex-1 overflow-y-auto p-4 md:p-8`.

## Target layout (desktop)

A single flex column filling the rounded window, top to bottom:

1. **Top nav bar** (NEW): a horizontal bar `sh-md rounded-3xl border border-white bg-white/70 backdrop-blur-xl` containing:
   - Left: the company brand block (avatar tile + company name + "POWERED BY CEREBYL") moved up from the sidebar, compact.
   - Center/left: the section items as horizontal pills — icon + label, `rounded-full px-4 py-2`, inactive `text-[color:var(--st-on-surface-variant)]`, hover `text-[color:var(--st-primary)]`. The ACTIVE item gets a sliding white bubble: absolutely-positioned `motion.span` with `layoutId` (same pattern/spring as the old sidebar pill), `bg-white sh-sm rounded-full` behind the label, active text `text-[color:var(--st-primary)] font-semibold`. Bubble must animate between items on route change.
   - Preserve each item's badge/count chip and ALL role/feature/permission gating unchanged.
   - If items overflow the width: `overflow-x-auto` on the items row, never wrap to two lines.
2. **Existing header** (search + Ceremate + bell + avatar) — unchanged, sits below the nav bar.
3. **`main`** — now full width (no sidebar), still `flex-1 overflow-y-auto`.

Remove the desktop sidebar entirely: the `w-64`/`w-72` aside, the collapse control and its state (if it only served the sidebar), and any main-content margin that compensated for the sidebar. Mobile (`< md` or the existing breakpoint): no top section bar (or horizontally scrollable version if simple) — the hamburger/sheet remains the nav.

Per-section sub-menus are NOT part of this ticket (Leads already has its lens row in `leads-section-header.tsx`).

## Verify

Run `npx tsc --noEmit` in `leadenthrella/` — must be 0 errors. Report: every file changed, what happened to each sidebar element (brand block, collapse, bottom links), and how the bubble animation was wired.
