# TICKET C — Fixed section-header geometry across ALL tabs + Products/Team default to first lens

Repo: `leadenthrella/`. Do not commit. Visual/layout only — preserve all behavior and query-param forwarding.

## Problem (confirmed via live screenshots)

Within a section, the section header (icon tile + title + description) and its lens bar SHIFT position from tab to tab. Example from Orders: on `/orders/all` the "New Order" pill sits between the title and the lens bar; on `/orders/requests` a big "Pending" select renders ABOVE the lens bar pushing it down; on `/orders/dues` and `/orders/transporters` the bar sits at yet another height/offset. Same class of drift exists in other sections. The header must be pixel-identical in position on every tab of every section — it is the section's fixed chrome.

## C1 — Lock the geometry

Rule: on EVERY section sub-page, the FIRST row of the page is exactly: `[icon tile + title + description]  ……  [lens bar]` — one row, lens bar right-aligned, vertically centered, same margins everywhere. Nothing may render above this row, and no page-specific control may share it.

Do this by construction, not by per-page tweaks:

1. The six section header components (`leads-section-header.tsx`, `products-section-header.tsx`, `team-section-header.tsx`, `clients-section-header.tsx`, `orders-section-header.tsx`, `analytics-section-header.tsx`) must produce the SAME outer geometry: identical root element (`flex items-center justify-between gap-4` with the same min-height), identical title block, lens bar right-aligned. If it helps, extract a shared `SectionHeaderShell` in `src/components/section-header-shell.tsx` (title/icon/description left, children/right slot) and make all six use it — preferred over copy-paste drift.
2. Move every page-specific control OUT of the header row into that page's toolbar row directly below, styled as stitch pills (`.pill sh-md` for actions; pill-style triggers for selects/filters — match the leads toolbar idiom: white pill container, filled blue primary action):
   - `orders.all.tsx`: "New Order" dropdown → toolbar right side. ALSO rebuild its filter bar to the leads toolbar language: one row, `flex items-center justify-between gap-4 overflow-x-auto`; left = white-pill search input + party/status/rep pill triggers + date-range pills + sort pill + Save view; right = view toggle if any + New Order. Kill the orphaned "Save view" text row.
   - `orders.requests.tsx`: the "Pending" status select → into a small toolbar row below the header as a pill trigger (not a giant blue block above the lens bar).
   - `orders.transporters.tsx`: view toggle + "New Transporter" → toolbar row.
   - `orders.dues.tsx`, `orders.intimations.tsx`: bucket/status filters → pill triggers in the toolbar row.
   - `clients.parties.tsx`, `clients.territories.tsx`, `clients.portal-access.tsx`: same treatment — Bulk import / New Party / view toggle / List-Map toggle / Download PDF / search+filter triggers all live in the toolbar row as pills, never beside/above the lens bar.
   - `analytics.overview/products/leaderboard.tsx`: Period selector and Export on analytics.products → toolbar row as pills.
   - `products.all/offers/stock/aids.tsx`, `team.directory/accounts.tsx`: verify the header row contains ONLY title block + lens bar; move any strays (e.g. Add visual aid, New Offer) into the toolbar row as pills.
3. After C1, flipping between tabs of a section must not move the title or the bar by a single pixel (same DOM geometry, same `space-y-5` rhythm below).

## C2 — Products & Team: first lens is the home (like Leads)

- `src/routes/products.index.tsx` → redirect to `/products/all` (PRESERVE its existing `?action=export_*` query forwarding through the redirect, the way orders.index.tsx forwards `?party=/?new=1/?dup=`). The card-hub content is retired.
- `src/routes/team.index.tsx` → redirect to `/team/directory`.
- Check for links that point to `/products` or `/team` index expecting the hub (dashboard quick links, menus) — redirects cover them, but report any you find.

## Verify

`npx tsc --noEmit` = 0 and `npm run build` passes. Report: the shared shell (if extracted), every control that moved and where it landed, and confirmation that all six section headers share identical outer geometry.
