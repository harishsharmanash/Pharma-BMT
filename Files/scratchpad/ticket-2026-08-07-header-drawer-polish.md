# TICKET — Header redesign + leads toolbar/lens-bar polish + drawer scroll fix

Repo: `leadenthrella/` — React 19 + TanStack Start + Tailwind + shadcn + framer-motion. Stitch tokens in `src/styles.css` (`.stitch` block: `--st-primary`, `--st-on-primary`, `--st-on-surface`, `--st-on-surface-variant`, `--st-surface-container-low/high`, `--st-outline-variant`; utilities `.pill`, `.sh-sm`, `.sh-md`, `.sh-lg`, `.t-data`). App shell = fixed rounded window (`h-screen overflow-hidden`, `main` = `flex-1 overflow-y-auto`). KEEP that. Do not commit. Do not change any behavior/data logic.

## Fix A — Peek drawer scroll is broken (src/routes/leads.all.tsx, drawer ~line 765)

Symptom (confirmed live): with a lead open in the right peek panel, the user CANNOT scroll the card grid to the last rows, and CANNOT reach the bottom of the drawer itself — the "Open full lead" link and action buttons are unreachable. Root cause to investigate: the two-pane container (card grid + 420px drawer) does not constrain heights — the drawer `h-full` resolves against an unbounded parent inside the scrolling `main`, so the drawer and its sticky action bar render below the fold.

Fix it properly:
- Give the drawer a bounded height tied to the viewport/pane, e.g. make the pane wrapper `flex` with the drawer `sticky top-0 self-start` and `max-h`/`h` derived from the visible content area (compute from the shell: 100vh minus nav bar, header, and main padding — a `max-h-[calc(100vh-…)]` is acceptable).
- Drawer internals stay: body `flex-1 overflow-y-auto`, action block `shrink-0` pinned at the drawer bottom — it must ALWAYS be visible without any page scrolling.
- The card grid column must scroll normally to its last row while the drawer stays put.
- Verify on /leads/all with a lead selected: last card reachable AND "Open full lead" visible.

## Fix B — Leads page: move search up, slim + widen the lens bar (src/routes/leads.all.tsx, src/components/leads-section-header.tsx)

1. Move the leads search input (currently first item of the toolbar, `w-[220px]` white pill, ~line 278-286) OUT of the toolbar and INTO the section header title row (src/components/leads-section-header.tsx) — placed right after the title/count block, before the lens control. Width `w-64`, white pill, `sh-sm`. The toolbar row keeps: Stage/Temp/Rep pills, divider, sort, Save view … ViewToggle, Select, Import, Quick enquiry, Add lead — now it fits one row comfortably.
2. Lens bar (the `All / Call List / Follow-ups / Duplicates` segmented control + `Lead Intake` link, in leads-section-header.tsx): make it a distinct, full-width-of-its-row elevated bar instead of a small inline control:
   - Reduce its height (compact: `py-1`, small text, tight hit areas).
   - Make it span the available row width (`flex-1`/`w-full` within the header row's right side).
   - Give it a "popped out" 3D look WITHOUT gradients: `sh-lg` elevation + `border border-white bg-white/90 backdrop-blur-xl rounded-full`, and the active sliding thumb gets a subtle inner shadow + slightly stronger elevation (`shadow-inner` on track is fine; thumb `bg-white` with its own `sh-md`). It should visibly float above the canvas.
3. Apply the same slim/elevated lens-bar treatment to `src/components/products-section-header.tsx` and `src/components/team-section-header.tsx` for consistency (they share the pattern).

## Fix C — Header + top menu bar redesign (src/components/app-shell.tsx)

Match this approved mock (described precisely — it is the source of truth):

**Row 1 — header (white, clean, well-spaced):**
- LEFT: company avatar tile + two-line brand block: company name (bold, `--st-on-surface`) over "Powered by Cerebyl" (`t-data`, `--st-on-surface-variant`). (Move this up from wherever it currently lives; remove the duplicate logo/wordmark on the left of the header.)
- CENTER: the universal search (GlobalSearch) — centered, generous width (`max-w-md`/`flex-1 max-w-xl`), white pill `sh-sm`.
- RIGHT, in order: notification bell (round icon button), the Ceremate pill labeled **"Ask Ceremate"** (filled `bg-[--st-primary] text-[--st-on-primary]`, `.pill sh-md`, sparkle/ceremate icon — keep existing gating `aiAssistantOn && canUseAi`), the profile avatar circle, and at the FAR right the **Cerebyl wordmark** (`cerebylWordmark` img, small, `h-6`). Keep Admin name/role chip next to the avatar if it fits cleanly, else drop the name text and keep role chip inside AccountMenu only — your call, keep it clean.
- Mobile: keep the hamburger + existing sheet; stack sensibly.

**Row 2 — top menu bar (the section nav):**
- Full-width **filled blue bar**: `rounded-full bg-[color:var(--st-primary)] sh-md px-2 py-1.5`, items spread with `justify-between` (or even spacing), horizontally scrollable if overflowing, never wrapping.
- Each item = icon + text label, `rounded-full px-4 py-1.5`, inactive = `text-[color:var(--st-on-primary)]/75`, hover = full opacity.
- ACTIVE item = the sliding bubble: `motion.span layoutId` (existing pattern/spring), `bg-white rounded-full sh-sm`, with active text+icon `text-[color:var(--st-primary)] font-semibold`. White bubble sliding on the blue bar.
- Keep ALL gating (roles/feature/perm/anyOf) and the orders pending-count badge (restyle badge to `bg-white text-[--st-primary]` on the blue bar).
- Brand block no longer lives in this bar (it moved to row 1).

## Verify

`npx tsc --noEmit` in leadenthrella/ = 0 errors. Report per file what changed and confirm Fix A behavior (how the drawer height is now bounded).
