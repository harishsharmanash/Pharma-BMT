# Leads visual-fidelity punch-list — app vs approved reference

Reference (source of truth): `Files/design/leads-reference/leads-reference-SELF-CONTAINED.tsx` (+ `stitch-tokens.css`).
App: `leadenthrella/src/routes/leads.all.tsx`, `leadenthrella/src/components/app-shell.tsx`, `leadenthrella/src/components/leads-section-header.tsx`, `leadenthrella/src/components/lead-dialog.tsx`, `leadenthrella/src/styles.css`.

## 1. Design tokens

`stitch-tokens.css` == `styles.css:482-529` `.stitch` block. **Token parity is OK — no hex/type/shadow differences.** Real divergences:

| Item | Reference | App |
|---|---|---|
| Font | Inter via `.stitch` (tokens.css:31) | `leads.all.tsx:249` adds `font-ios`, overriding Inter on the whole page → remove `font-ios` |
| Viewport | fixed `h-screen overflow-hidden` panes with internal scroll (ref:132) | `AppShell` root is `min-h-screen` page scroll (`app-shell.tsx:257`, main `p-4 md:p-8` line 302) — page-level scroll, not pane scroll |
| Dark palette | none exists | app still has dark `--hot/--cold/--alert-*` tokens (`styles.css:221-233`) — fine to leave, but Leads must never read them |

## 2. Lead card

App grid `LeadCard` (`leads.all.tsx:590-653`) is structurally close. Diffs:

- `leads.all.tsx:593` — `gap-5` → reference `gap-6` (ref:307).
- `leads.all.tsx:643` — footer `mt-1` → reference `mt-2` (ref:341).
- Chip discipline (README: exactly 2 chips: stage + product interest):
  - `leads.all.tsx:635` — extra amber `Duplicate` Badge → remove; the red `Copy` icon at line 607 already flags it (matches ref:314).
  - `leads.all.tsx:636-639` — extra `Converted` chip → remove from card (it crowds the chip row; it can stay in the drawer/table).
- Temp pill on cards (`leads.all.tsx:609-616`, `ST_TEMP:69-74`) **matches** reference (Hot=red container+pulse, Warm=blue-grey secondary-container, Cold=neutral grey).
- **The "everything is a different blue" problem is the table-view badges**, not the cards:
  - `lead-dialog.tsx:145-153` `TempBadge` — uses `--hot` (orange), `--warm` (yellow), `--cold` (saturated blue oklch(0.628 0.157 244.8), `styles.css:157-162`). Replace with the `ST_TEMP` stitch mapping (red / blue-grey / neutral, with dot + uppercase label).
  - `lead-dialog.tsx:155-164` `AlertBadge` — 5 more hues (`--alert-*`, styles.css:163-167) incl. grey-blue Closed/No-FU. Reference has NO alert badge; urgency is the meta chip tone (ref:297-302: alert=red 10% tint, info=primary 10% tint, muted=grey). Replace the table "Alert" column with that 3-tone meta chip.
  - Both are used in the table at `leads.all.tsx:503,507`.

## 3. Page layout

- **Title + lens row**: reference puts the segmented lens control right-aligned on the SAME line as the title (ref:205-225). App `leads-section-header.tsx:46-100` stacks: title+actions row, then lens row below. Merge to one row (title left, lens right), matching ref.
- **Toolbar / button placement** (owner: "buttons misplaced"):
  - Reference toolbar (ref:227-252): LEFT = filled blue pills `Stage ▸ Temp ▸ Rep ▸ | divider | Newly added`; RIGHT = view-toggle segmented icons + filled pills `Select / Import / Add Lead`.
  - App: filters are a separate translucent bar of bare Selects/Combobox/SortSelect (`leads.all.tsx:289-356`) — different heights, no divider, not pills. Actions (`Select/Import/Quick enquiry/Add lead`) sit up in the section header (`leads.all.tsx:262-282`) as shadcn `Button variant="outline"` — squared, not filled pills.
  - Fix: rebuild the toolbar as the reference row — filter controls as `pill` buttons (ref `.pill`, styles.css:521-529), add the `h-6 w-px` divider (ref:234), move `Select / Import / Add Lead` pills into the toolbar right group. Keep `Quick enquiry` only if owner wants it (not in reference); if kept, make it a pill too.
  - All action buttons must use `.pill sh-md` (filled `--st-primary`, rounded-full) — the owner explicitly approved all-primary toolbar buttons (README:42-44).
- **ViewToggle** (`view-toggle.tsx:9-26`): bordered `bg-card` box with ghost/secondary buttons → reference white pill container `sh-sm rounded-full bg-white p-1`, active icon button tinted `bg-[--st-surface-container-low]` text-primary shadow-inner (ref:240-247).
- **Pagination / footer** (owner: "footer messed up"):
  - Reference: sticky footer bar `border-t border-white/50 px-6 py-4` with rows-per-page select left and a white pill `1-25 of 124 + chevron icon buttons` right (ref:269-287).
  - App: bare `Page X of Y` + two outline `Previous/Next` buttons floating mid-page (`leads.all.tsx:530-536`). Rebuild as the reference footer bar.
  - Selection action bar (`leads.all.tsx:365`) uses dark `glass-hero` fixed pill — violates light-only stitch (README:41). Restyle to light glass (white/90 pill, `--st-*` text) and make it part of the footer flow, not an overlapping fixed element (the `pb-20` hack at line 530 then goes away).
- **Shell header**: reference topbar = search input + 2 round icon buttons + avatar (ref:181-201). App header (`app-shell.tsx:271-301`) = logo + name/role chip + GlobalSearch + Ceremate + bell + AccountMenu. Lower priority; leave unless owner asks.
- **Canvas spacing**: reference `gap-6` card grid + `px-6 pb-6` (ref:256-258); app grid `gap-5` (`leads.all.tsx:392`) inside `main p-4 md:p-8`. Set grid to `gap-6`.
- **Peek drawer**: app is correct in principle (inline 420px panel, `leads.all.tsx:732`) — keep. Minor: add reference's "Read full summary" link (ref:428) and dashed "Add" product-interest button (ref:409-411) if desired; drawer temp/stage chips already match.
- **Sidebar**: app has sliding white-pill indicator (`app-shell.tsx:163-171`) — actually nicer than the reference's static item; keep. Sidebar is `w-64` vs reference `w-72`; reference has a bottom `New Inquiry` pill (ref:163-167) the app lacks. Low priority.

## 4. Ordered punch-list for the coder

1. `leads.all.tsx:249` — remove `font-ios` from the page root class. (ref: tokens.css:31)
2. `lead-dialog.tsx:145-164` — restyle `TempBadge` to the `ST_TEMP` stitch map (red/blue-grey/neutral + dot + pulse); replace `AlertBadge` with the 3-tone meta-chip style from ref:297-302. Used at `leads.all.tsx:503,507`.
3. `leads.all.tsx:289-356` — rebuild filter bar as reference toolbar: filter controls as filled `.pill sh-md` buttons, `h-6 w-px bg-[--st-outline-variant]/30` divider, sort as a pill. (ref:227-238)
4. `leads.all.tsx:262-282` + `leads-section-header.tsx` — move `Select / Import / Add Lead` out of the section header into the toolbar right group as `.pill sh-md`; drop or pill-ify `Quick enquiry`. (ref:239-251)
5. `leads-section-header.tsx:46-100` — put the lens segmented control right-aligned on the title row (ref:205-225).
6. `view-toggle.tsx:9-26` — restyle to reference white pill segmented control. (ref:240-247)
7. `leads.all.tsx:530-536` — replace pagination with reference footer bar: `border-t border-white/50`, rows-per-page select, white pill with `n-m of X` + chevron buttons. (ref:269-287)
8. `leads.all.tsx:358-384,530` — restyle selection bar to light glass; remove fixed-position overlap and the `pb-20` conditional.
9. `leads.all.tsx:593,392` — card `gap-5`→`gap-6`, grid `gap-5`→`gap-6`; `leads.all.tsx:643` footer `mt-1`→`mt-2`. (ref:307,341,256)
10. `leads.all.tsx:635-640` — remove `Duplicate` Badge and `Converted` chip from the card chip row (keep the red Copy icon at :607). (README chip discipline; ref:332-339)
11. (Optional, low) `app-shell.tsx:257,302` — investigate pane-scroll layout (`h-screen` + internal scroll) vs page scroll; and add sidebar `New Inquiry` pill (ref:163-167).

## 5. Future change — top-bar section nav with sliding bubble (NOTE ONLY, do not implement)

- Top-level nav lives in `app-shell.tsx`: `NAV` array lines 38-81 (sections gated by `roles/feature/perm/anyOf`), rendered by `renderSidebar` (lines 123-251) for desktop + mobile sheet (lines 308-326). The existing sliding active pill (`motion.span layoutId={navId}`, lines 163-171, spring from `useMotionFlow` SLIDE) is the bubble-animation precedent to reuse for a top bar.
- Section sub-menus are NOT centralized — each section defines its own:
  - Leads: `LENS_OPTIONS` in `leads-section-header.tsx:24-29` (segmented control, routes `/leads/all`, `?preset=hot-warm`, `/leads/followups`, `/leads/duplicates`; Lead Intake separate admin link).
  - Other sections use layout/landing routes: `clients.tsx`, `orders.tsx`, `products.tsx`, `team.tsx`, `analytics.tsx` (see `src/routes/`), each rendering their own sub-nav/landing.
  - Plan implication: moving section nav to a top bar needs (a) `NAV` + the layoutId pill lifted out of `renderSidebar` into the header, and (b) a registry so each section's sub-menu (like `LENS_OPTIONS`) can render in the top bar when that section is active.
