# TICKET B — Section lens bars everywhere + Portal Access page + Dues page + button cleanup

Repo: `leadenthrella/` — React 19 + TanStack Start (file-based routes in `src/routes/`), Tailwind v4, shadcn, framer-motion, Supabase. Do not commit. Preserve all behavior except the explicit removals below.

## Established patterns (read these first)

- `.bar-primary` / `.bar-primary-thumb` in `src/styles.css` — the elevated white pill bar + powder-blue sliding thumb. This is the design language for the new bars.
- Reference implementation of a section lens bar: `src/components/leads-section-header.tsx` (also products/team-section-header.tsx) — icon tile + title + description left, segmented control right on the same row, sliding thumb via `motion.span layoutId` (spring), distinct layoutId per section.
- `src/routes/leads.index.tsx` — how `/leads` redirects to its first lens (`/leads/all`).
- Role/feature gating precedent: NAV array in `src/components/app-shell.tsx` (~lines 39-80) and the gating in `src/routes/team.accounts.tsx` / `clients.territories.tsx` (manager/admin only pages redirect or hide).
- Portal access logic: `PortalAccessCard` in `src/routes/parties.$id.tsx` (~lines 325, 1329-1556) — create/reset/change-email/disable/delete portal logins, gated by the `distributor_portal` feature.
- Dues aging logic: `usePartiesDuesAging` / `duesAgingBucket` in `src/routes/clients.parties.tsx` (~lines 348-357) — buckets parties by days since oldest unpaid invoice (0-30/30-60/60-90/90+).

## B1 — Lens bars for Clients, Orders, Analytics; kill the card hubs

These three sections currently have card-hub homepages (`clients.index.tsx`, `orders.index.tsx`, `analytics.index.tsx`) and no lens bar. Convert them to the leads model:

1. Create section header components following the leads/products/team pattern, using `.bar-primary` + `.bar-primary-thumb`, each with its own layoutId:
   - `src/components/clients-section-header.tsx` — lens: **Parties** (`/clients/parties`) | **Territories** (`/clients/territories`, manager/admin + leads feature only) | **Portal Access** (`/clients/portal-access`, admin/manager only).
   - `src/components/orders-section-header.tsx` — lens: **Orders** (`/orders/all`) | **Order Requests** (`/orders/requests`) | **Intimations** (`/orders/intimations`) | **Dues** (`/orders/dues`) | **Transporters** (`/orders/transporters`, manager/admin).
   - `src/components/analytics-section-header.tsx` — lens: **Overview** (`/analytics/overview`) | **Product Performance** (`/analytics/products`, manager/admin) | **Leaderboard** (`/analytics/leaderboard`, manager/admin).
   Keep each section's existing title/description text on the left (take from the current pages).
2. Wire the headers into every sub-page of each section (all the routes listed above).
3. Retire the card hubs: `clients.index.tsx` → redirect to `/clients/parties`; `orders.index.tsx` → redirect to `/orders/all` (PRESERVE the existing `?party=`, `?new=1`, `?dup=` query forwarding that orders.index.tsx currently does — move that logic into the redirect); `analytics.index.tsx` → redirect to `/analytics/overview`. Deleting the hub pages automatically removes the "Today's Orders" card, the Clients "Order Requests" cross-link card, and the old "Portal Access"/"Dues Aging" signpost cards — that is intended (owner's tasks 4, 5, and part of 6). If any dashboard card or cross-link routes to `/clients` or `/orders` or `/analytics` index, it still works via the redirect — verify no links break.
4. Dashboard's "Needs attention" links point at real sub-pages already — leave dashboard untouched.

## B2 — New page: Portal Access management (`src/routes/clients.portal-access.tsx`)

Admin/manager only (others → redirect to `/clients/parties` or an access-denied state; mirror the gating used by team.accounts). Feature-gated by `distributor_portal` like PortalAccessCard.

Purpose: one place to manage distributor portal logins across ALL parties, instead of opening each party page.

Content:
- Header: `ClientsSectionHeader` with `lens="portal-access"`.
- A table (use the app's `ui/table.tsx` primitives) of all parties: Firm, city, owner/rep, portal status (Enabled / Disabled / No login), portal email, last relevant action if cheaply available.
- Search box (firm/city). Status filter pill (All / Enabled / Disabled / No login).
- Row actions, reusing the SAME mutations/logic as PortalAccessCard (extract them into a shared module, e.g. `src/components/portal-access.tsx` or a hook, and refactor PortalAccessCard to consume it — do NOT duplicate the logic):
  - No login → "Create login" (email + password flow as in PortalAccessCard).
  - Existing login → Reset password (with copy-reveal), Disable/Enable, (Delete login may stay party-page-only if it complicates the table — your call; note it in the report).
- Keep it read-safe for reps: they shouldn't reach it (redirect).

## B3 — New page: Dues (`src/routes/orders/dues` → `src/routes/orders.dues.tsx`)

A standalone dues-tracking page (today dues aging is only a filter on `/clients/parties` and a signpost card on `/orders`):

- Header: `OrdersSectionHeader` with `lens="dues"`.
- Top: summary strip of the four buckets with ₹ totals and party counts (0–30, 30–60, 60–90, 90+) — compute from the same dues-aging data (extract `usePartiesDuesAging`/`duesAgingBucket` from clients.parties.tsx into a shared hook file, e.g. `src/hooks/use-parties-dues-aging.ts`, and update clients.parties.tsx to import it — no logic change).
- Below: table of parties WITH outstanding dues, worst bucket first: Firm, city, owner, outstanding ₹, aging bucket (colored chip: 0-30 primary tint, 30-60 amber, 60-90 orange, 90+ red tint), oldest unpaid invoice date/days, and a row action "Remind" (WhatsApp dues reminder — reuse the exact share/reminder logic from the party page Ledger tab) + row click → `/parties/$id`.
- Filter pills: bucket filter (All/0-30/30-60/60-90/90+), search firm. Keep it simple — no saved views, no export in this pass.

## B4 — Explicit removals (owner directives)

- "Today's Orders" card — gone with the orders hub (B1.3). Also check: it is NOT a filter anywhere else; nothing else to remove.
- "Order Requests" card inside the Clients section — gone with the clients hub. The requests page itself stays (it's in the Orders lens).
- Old "Portal Access" signpost card and "Dues Aging" signpost card — gone with the hubs; real pages now exist.

## Verify

- `npx tsc --noEmit` = 0 and `npm run build` passes (build regenerates the route tree for the 2 new routes — make sure `routeTree.gen.ts` updates are included in the file changes).
- Manual sanity list to report on: `/clients` → parties; `/orders` → all (with `?new=1` still opening the dialog); `/analytics` → overview; portal-access page hidden from reps; dues page numbers match the parties-page dues filter for the same data.
- Report per file: created/modified/deleted, and anything you intentionally simplified.
