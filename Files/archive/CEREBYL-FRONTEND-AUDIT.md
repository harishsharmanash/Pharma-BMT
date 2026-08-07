# Cerebyl Frontend Audit — Every Route, Every Button

Compiled 22 Jul 2026. This is a from-the-code inventory of every route in `leadenthrella/src/routes/` plus the persistent shell/nav and the shared dialog components they open — exact button labels, exact role gating, exact dialogs and their fields. It exists so the next UI redesign pass has a real map of what functionality must survive, instead of guessing from screenshots.

**How to use this doc:** read the Executive Summary first — it's the synthesized signal across all six audits (what's repetitive, what's inconsistent, what already stands out and should inform new patterns). Then dip into the per-area sections for the exhaustive detail on any specific page before touching it.

**Scope note:** the first pass at a visual refresh (auth screen, developer contact page, console shell/login, products page gallery/lightbox) already shipped this session — those sections describe the *current* state including that work, not the pre-refresh state. The user's feedback was that a tokens-only pass wasn't enough — this document is the input for the real redesign that follows.

---

## Table of Contents

1. [Executive Summary — cross-cutting signal](#executive-summary)
2. [Shell, Nav, Auth, Dashboard](#section-1)
3. [Leads & Follow-ups](#section-2)
4. [Parties & Orders](#section-3)
5. [Products, Stock, Transporters](#section-4)
6. [Team/Staff, Users, Settings, Help, Trash, Leaderboard](#section-5)
7. [Console Operations (`/console/*`)](#section-6)

---

<a name="executive-summary"></a>
## Executive Summary — cross-cutting signal

**The core problem, stated plainly:** roughly 30 of the app's ~37 routes use exactly one visual template — a filter/search card, then a `Table` or card-grid, then per-row actions in a `DropdownMenu` or bare icon buttons, then a handful of shadcn `Dialog`s for create/edit. It's functionally solid and every agent independently confirmed it's implemented correctly and consistently — but it means the app has almost no visual variety between conceptually very different pages (a sales-trend report looks identical to a customer directory looks identical to a bug-report inbox). This is the main thing a real redesign needs to fix — not by reskinning the template, but by giving different *kinds* of pages different *shapes*.

**Pages that already break the mold — use these as the seeds for new patterns, don't flatten them back into the generic template:**
- `/my-day` — three entirely different bodies per role (rep/manager/admin), stat-tile + card-list layout, zero tables. Best existing "dashboard" page in the app.
- `/dashboard` — genuinely chart-heavy (6 Recharts bar/pie charts), correctly respects the "Leads by Source must be a bar chart, never pie" rule. Good bones, but 10 flat KPI tiles above it is a lot of same-shaped boxes in a row.
- `/help` — pure documentation, no data at all. Currently five stacked plain cards; a strong candidate for a real FAQ/article layout.
- `/leaderboard` — conceptually a competitive/gamified ranking, currently rendered as a plain table indistinguishable from a dues report. Ripe for rank badges/medals/visual hierarchy.
- `/trash` — already breaks from `Table` into a hand-built flex-row "activity feed" list. Note: subtitle promises 30-day auto-clear but there's no bulk "empty trash" button — a functionality gap, not just visual.
- Stock's **Issue & Returns** tab — 3-card side-by-side mini-forms (Dispatch/Return/Transfer), not a table at all.
- Team's **Attendance** tab — a real spreadsheet grid where clicking a cell cycles its status in place. The one genuinely novel interaction pattern in the whole app.
- Team's **HR Dashboard** tab — KPI tiles + list cards, no table.
- `product-performance.tsx` — a "report" page family of its own (KPI stat cards + trend badges), no filter-card-with-selects, no row actions.
- `ProductImageLightbox` (this session's new component) — full-black backdrop, swipeable, zoomable. Every agent flagged this independently as the single most visually distinctive/immersive moment in the app and a strong template to extend to other image-bearing records (staff photos, party documents).
- Console dashboard (`/console`) — has genuinely chartable data (AI spend by company, feature adoption %) but renders it as plain number tiles and lists with zero visualization.

**Toolbar overload — the busiest single screens, strong candidates for consolidating into menus:**
- `/orders/$id` — 9 header buttons (PDF/JPG/Columns/Excel/WhatsApp/Email/Copy/Edit/Duplicate/Cancel) plus 2 more inside the Payments card.
- `/parties/$id` — 7 header buttons (Call/WhatsApp/Maps/Copy/Repeat/Edit/Delete).

**Inconsistent destructive-action friction — a running theme, worth fixing as UX not just visuals:**
- Console: deleting a user requires typing their exact name to confirm; removing a custom domain gets a plain confirm dialog; **suspending/archiving an entire company** (arguably the most consequential action in the console) requires zero confirmation — just a dropdown + Save. Removing your own MFA factor also has zero confirmation despite an explicit in-copy risk warning.
- Team/Staff: deleting a staff document or an incentive rule, or marking an advance "settled," happens instantly with no dialog — while Trash and Settings-tab deletes correctly use `AlertDialog`.
- Orders: deleting a payment row is instant/unconfirmed; deleting a rate on Transporters is confirmed. Same action class, different treatment.
- Users page: reps get a ceremonial "Deactivate & keep records" flow with messaging; managers/admins get a silent instant toggle — possibly intentional (no book-of-business to worry about) but worth a deliberate visual decision either way.

**Component inconsistencies worth normalizing:**
- Products builds its own bespoke list/grid view toggle instead of reusing the shared `ViewToggle` component used everywhere else (Leads, Hot & Warm, Transporters, Parties).
- Stock's `LocationDialog` uses a plain HTML checkbox where the rest of the app uses the styled shadcn `Switch`.
- Party's `DocumentDialog` uses a native `<select>` where the rest of the app uses the shadcn `Select`.
- Badge/status color conventions (amber/emerald/sky/rose/destructive) are defined ad hoc per file rather than from one shared status-color source of truth — Products' "Inactive" badge, Transporters' "Active/Inactive" badges, and Team's five different status badges all invented their own mappings independently.
- The console (`/console/*`) is a **deliberately, permanently dark** zinc-950/900/800 palette regardless of the main app's light/dark toggle — this is intentional, not a bug, and any redesign should preserve that split identity rather than unify it.

**Functionality gaps surfaced along the way (flag, don't silently drop, in any rebuild):**
- `/duplicates` has zero interactivity — a manager spotting a duplicate lead can't click through to it, they have to go search `/leads` manually.
- Console's Errors log has no filter and no dismiss/resolve state, while the structurally parallel Bug Reports view has both — likely an intentional asymmetry but worth confirming.
- `/console/users` (the cross-company user search) has no per-user actions at all — you have to navigate to the company detail page to actually do anything with a user you found.
- There's no way to delete a company from the console UI at all, only suspend/archive.
- Console login has no "forgot password" path.
- Transporter detail: deleting a rate gets a confirm dialog, deleting a *payment* does not — same page, inconsistent treatment.

**What already exists and works — preserve these mechanics exactly, whatever the visual language becomes:**
- Three independent gating dimensions per nav item (role, feature flag, fine-grained permission) — not just role checks.
- The multi-step order import wizard (mapping → preview) and AI bill-extraction flow — the most functionally complex UI in the app.
- FEFO (first-expiry-first-out) auto-suggestion in Stock dispatch.
- The batch recall/traceability lookup in Stock (a compliance tool).
- The Invoice detail page's line-items card doubling as an `html2canvas` print surface for JPG export — any redesign of that card must stay renderable via html2canvas.
- The role-based three-way branch in `/my-day` (rep/manager/admin bodies are structurally different, not just filtered).

---

<a name="section-1"></a>
## Section 1 — Shell, Nav, Auth, Dashboard

### Route: `/` (index)
Pure redirect gate. Full-screen spinner while auth state resolves, then bounces to `/dashboard` or `/auth`. No interactive controls.

### Root Shell (`__root.tsx`)
TanStack Router root: HTML document shell, pre-hydration dark-mode script (avoids flash of wrong theme), wraps everything in `QueryClientProvider → ThemeProvider → AuthProvider`, global `Toaster`. Sets default `<head>` meta (title "Cerebyl — AI-powered pharma business management", OG/Twitter tags).
- **404 page:** giant "404", "Page not found" heading, explanatory paragraph, one "Go home" pill button → `/`.
- **Error boundary page:** "This page didn't load" heading, apology text, **"Try again"** button (`router.invalidate()` + `reset()`) and **"Go home"** link. Reports the error via `reportLovableError`/`logAppError` on mount.

### App Shell (`app-shell.tsx`) — persistent sidebar/header around every logged-in page
**Sidebar** (`w-64`, `bg-sidebar`, collapses to a mobile drawer below `md`):
- Header block: company logo (or first-initial fallback square) + company name + "Cerebyl" subtitle.
- **Full nav list, in order, with exact gating:**
  1. Dashboard — `/dashboard` — everyone
  2. Leads — `/leads` — feature `leads` + perm `leads.view`
  3. Hot & Warm — `/hot-warm` — feature `leads` + perm `leads.view`
  4. Follow-Up Schedule — `/followups` — feature `leads` + perm `leads.view`
  5. Products — `/products` — feature `products` + perm `products.view`
  6. Stock — `/stock` — roles `manager`/`admin` + feature `stock` + perm `stock.view`
  7. Parties — `/parties` — feature `parties` + perm `parties.view`
  8. Booked Areas — `/booked-areas` — roles `manager`/`admin` + feature `leads` + perm `leads.view`
  9. Orders — `/orders` — feature `orders` + perm `orders.view`
  10. Staff — `/team` — feature `staff` + perm `staff.view`
  11. Product Performance — `/product-performance` — roles `manager`/`admin` + feature `products` + perm `reports.view`
  12. Transporters — `/transporters` — roles `manager`/`admin` + feature `transporters` + perm `transporters.view`
  13. Leaderboard — `/leaderboard` — roles `manager`/`admin` + feature `leads` + perm `leads.view`
  14. Manage Users — `/users` — role `admin` only
  15. Company Settings — `/settings` — role `admin` only
  16. Duplicate Flags — `/duplicates` — feature `leads` + perm `leads.view`
  17. Trash — `/trash` — no gating
  18. Help — `/help` — no gating
  - Active-link rule: exact match OR pathname starts with `item.to + "/"` (so detail routes highlight the parent nav item).
- Footer: "Cerebyl" / "Business tool only."

**Header** (sticky, `h-16`, backdrop-blur):
- Left: mobile hamburger, user's full name (lg+), role pill (lg+).
- Center: `GlobalSearch` (sm+ only).
- Right: **"My Day"** button (`Sun` icon, → `/my-day`, collapses to icon-only on small screens), `NotificationBell`, theme toggle (Sun/Moon), **"Sign out"** button.
- `AssistantChat` mounts as a sibling only if feature `ai_assistant` is on AND the user has permission `ai.use`.

**Non-shell states `Protected` handles before rendering the shell:** auth loading (spinner) → no session (redirect to `/auth`) → session but no profile row (platform-admin check → redirect to `/console`, else "Account not linked" message) → company `suspended`/`archived` (full "This account is suspended" screen with a "Sign out" button, message no longer shows a literal email address — fixed this session).

### Component: `NotificationBell`
Bell icon + red unread-count badge ("9+" cap). Popover: header ("Notifications" + conditional "Mark all read" button), scrollable list of rows (unread dot, bold title, 3-line-clamp body, relative timestamp). Empty state: "You're all caught up." Clicking a row marks it read and navigates to the linked order/party.

### Component: `GlobalSearch`
Header search input, live client-side filter across parties/leads/products/orders (already-fetched data), capped at 12 results, remembers last 8 recently-viewed items in localStorage. Each result: type icon, label, subtitle, uppercase type badge (PARTY/LEAD/PRODUCT/ORDER). Products have no detail route, so a product result navigates to `/products` generally, not a specific product page.

### Component: `AssistantChat` (current shape — full redesign scoped separately)
Floating circular FAB, fixed bottom-right (`bottom-6 right-6`, 56×56px, `Bot` icon). Opens a right-side sliding `Sheet` (full-width mobile, `sm:max-w-md` desktop) with a message list, text input, attach controls, and inline plan-confirmation UI that can hand off into the app's own Lead/Party/Product dialogs. The one floating-overlay element in the entire app outside of toasts/dialogs. Conditionally mounted per feature flag + permission.

### Route: `/auth` (Sign in) — reskinned this session
Full-viewport centered layout, decorative blurred-circle background glow, theme toggle pinned top-right. Card: dark **hero-surface** header strip (logo/initial badge + display name + tagline) above a light form body (email, password, submit "Sign in"/"Signing in…", "Ask your admin to create your account." caption). Footer link "Created by Harish Sharma" → `/developer` (default domain only). Handles white-label tenant branding (logo/name/brand color) and rejects cross-tenant logins on a client's custom domain. Special states: branding-loading spinner-only screen; "This address isn't configured yet" message for an unmapped custom domain (deliberately never falls through to a normal login form).

### Route: `/developer` — reskinned this session
Same background glow + entrance animation as `/auth`, but a plain centered card (no hero strip). "HS" initials badge, name, "Cerebyl" subtitle. Contact card: Email row (label now reads "Send an email", `mailto:` link — visible literal address removed this session, per-comment flagged for a proper `cerebyl.com` address later), Call row (`tel:`), WhatsApp row (`wa.me`, new tab). Footer "Back to sign in" → `/auth`.

### Route: `/dashboard` — home/landing page, highest-traffic screen
1. Header: "Dashboard" / "A live overview of your pipeline."
2. Row of 4 "today" stat cards: Today's orders, Today's billing, Today's collection (green), Money to collect (red if >0).
3. 2×2 "money" insight grid: Sales this-month-vs-last (with a colored ▲/▼ % delta), Payments this month by mode, Top 5 customers, Top 5 products.
4. Loading state: 10 pulsing skeleton blocks.
5. 10 lead-derived KPI tiles (2×5 grid): Total Leads, Hot, Warm, Cold, Lost, Overdue, Due Today, Upcoming, Won, Conversion %. (Note: "Won" tile reuses the `alert-upcoming` color token — likely an accidental copy-paste, worth a deliberate color choice in redesign.)
6. **Chart grid** (Recharts, all colors from CSS vars for light/dark parity):
   - Pipeline by Stage — bar chart
   - Temperature Split — donut/pie (Hot/Warm/Cold)
   - Alert Status — bar chart, individually colored bars
   - Conversion Funnel — horizontal bar chart
   - Leads by State — bar chart
   - **Leads by Source — bar chart** (confirmed compliant with the standing "never a pie" rule)
   - Follow-Up Outcomes — bar chart, spans both columns

No buttons, links, or drill-down actions anywhere on this page — 100% read-only.

---

<a name="section-2"></a>
## Section 2 — Leads & Follow-ups

### `/leads`
**Purpose:** master lead list. Reps effectively see their own (RLS-scoped); managers/admins see everyone + a rep filter.
**Layout:** header (title + count) → toolbar → filter bar (search + Stage/Temp/Rep selects + sort) → optional select-mode callout → grid or table (view-toggle) → pagination (25/page).
**Toolbar:** view toggle (list/grid) · Select/Done (bulk mode) · Excel export · CSV export (both gated by perm `leads.export` inside the bulk bar) · **Quick enquiry** (opens a fast-capture dialog: Name, Phone, Source, "Capture enquiry") · **Add lead** (opens full `LeadDialog`).
**Filters:** search (name/firm/contact/city/state/lead_code) · Stage select · Temp select · Rep select (managers/admins only) · Sort (Newly added / Last edited / Name A-Z / Next follow-up soonest / Temperature Hot→Cold).
**Bulk bar (select mode):** Select all/Clear all · Export Excel/CSV (perm-gated) · Clear selection.
**Grid/table rows:** click → `/leads/$id` (or toggles selection in select-mode); phone `tel:` link; Stage/Temp/Converted badges; `AlertBadge` (Overdue/Due Today/Upcoming/Closed/No FU Set); duplicate-warning icon inline in table if phone/firm is duplicated elsewhere; per-row Edit pencil icon (opens `LeadDialog` prefilled).

### `/leads/$id`
**Purpose:** lead detail — profile, follow-ups, product interest, conversion to Party.
**Layout:** header (back, name, lead code, actions) → 2-col grid (Overview card + Status card) → Products-interested card → Call-summary card → Follow-up-history timeline.
**Header actions:** Edit (canEdit = rep owns it or is manager/admin) · **Convert to Party** (creates the Party, marks lead Won, links `converted_party_id`, navigates to the new party) · View Party (if already converted) · Delete (perm `leads.delete`, soft-delete to Trash, `AlertDialog` confirm) · **"Log a call"** (opens `LogCallDialog`).
**Products card:** Add products toggle (inline search/filter picker: search + Division/Category selects, "Add"/"Added" per row) · inline-editable Qty/Given Rate/Expected Rate per added product (commit on blur) · Remove (X) per row · **"Generate Bill Summary"** (branded jsPDF, itemized table, "sample bill" disclaimer).
**Dialogs:** `LeadDialog` (shared, see below) · `LogCallDialog` (Outcome select, Note textarea, writes to next open FU slot + appends to call_summary; warns if all 5 FU slots are used).

### `/leads.tsx` (layout)
Pure `FeatureGate feature="leads"` + `<Outlet/>` wrapper, no UI.

### `/hot-warm`
Filtered priority-call queue (Hot+Warm, soonest-FU-first). Header (flame icon) + view toggle only — **no filters, no search, no pagination, no select mode.** Card/row click → `/leads/$id`; phone `tel:` link. Simplest of the lead-family pages.

### `/followups`
Open leads with a set next-FU date, soonest-first. Header + single table, no filter bar, no view toggle, no pagination. Row click → `/leads/$id`. Distinctive inline **"+3d" snooze button** per row (pushes the next FU date back 3 days directly from the table, no dialog) — the one quick-mutation-in-a-table-cell pattern in the leads family.

### `/my-day`
Role-based daily landing page — **three structurally different bodies** gated by `profile.role` (not a permission hook):
- **Shared:** `CheckInButton` ("Start my day" → green "Checked in" badge, localStorage-persisted per day).
- **RepDay:** 4 stat tiles (To call today / My orders today / My orders this month / Collected this month) → "Day plan — who to call" list (Overdue/Due-Today badges + per-row **"Call"** button where a phone exists) → quick-links: Follow-up schedule, My orders, My performance.
- **ManagerDay:** 4 stat tiles (Present today / Leave approvals / Claims to approve / Orders to dispatch) → two `ActionList` cards (pending leave, expense claims, top-5 each) with "Open Staff →" links → quick-links: Stock (badge count), Dispatch orders, Doc expiries (badge count), Team leaderboard.
- **AdminDay:** 4 stat tiles (Sales/Collected this month, Outstanding dues, Active staff) → "Approvals & actions waiting" card (5 linked rows with count badges) → Payroll status card ("Open payroll" button) → quick-links: Full dashboard, Manage users, Company settings.

### `/duplicates`
Read-only report of leads sharing a phone or firm name. Two stacked sections (phone dupes, firm-name dupes). **Zero interactive elements — no click-through to the actual lead**, a real functionality gap (a manager has to go search `/leads` manually to act on a spotted duplicate).

### `/booked-areas`
Managers/admins only — **reps are hard-redirected away** (`navigate({ to: "/dashboard" })`, not just hidden UI). Shows monopoly/territory commitments across Parties, grouped state → district. Search filters state cards; clicking a state card **expands an accordion-style detail card below the grid** (unique interaction pattern — not seen elsewhere) listing districts with firm name, monopoly-division badge, assigned rep, each a `Link` → `/parties/$id`. No add/edit here — monopoly editing happens on the party's own edit form.

### Shared: `LeadDialog` (Add/Edit Lead)
Fields (2-col grid): Date received, Assigned rep (select, **hidden entirely for reps** — their own id is force-set on submit regardless), Contact name, Firm name, Phone, City/Area, State, Product interest (enum), Source (enum), Stage (enum), Temperature (enum), **Reason lost** (conditional — only shown when Stage = "Lost"), Call summary (textarea), a note that product-interest quantities live on the lead detail page, and 5× Follow-up date + status pairs. Footer: Cancel / Save.
Also exports `TempBadge` (Hot/Warm/Cold pill) and `AlertBadge` (Overdue/Due Today/Upcoming/Closed/No FU Set pill) — both reused across every lead-family page.

---

<a name="section-3"></a>
## Section 3 — Parties & Orders

### `/parties`
**Purpose:** customer/distributor/retailer directory. Any authenticated user can create/bulk-import; edit/delete restrictions live on the detail page.
**Layout:** header (title + count, view toggle, Bulk import + New Party buttons) → conditional alert cards (birthday/anniversary "Coming up"; document-expiry alerts) → Filters card (with **Save view / Apply saved** — localStorage-persisted filter presets, unique to this page) → grid or table.
**Filters:** search (firm/city/state/GSTIN/phone/tags) · Type select · Status select (Active default/Inactive/Blocked) · Dues-aging select (0-30/30-60/60-90/90+) · Dues-status select (Has dues/Clear) · Sort (Reorder due first default / Highest dues / Firm A-Z / Newly added / Last edited) · "Starred only" checkbox.
**Row/card:** star toggle · click → `/parties/$id` · phone `tel:` link · party_type/status/tag badges · **`ReorderPill`** (Never ordered / "{n}d — overdue" destructive if ≥90d / "{n}d — due soon" amber if ≥45d / plain "{n}d ago") · document-expiry badge or "Docs OK".
**Dialogs:** `BulkImportDialog` (template download + file import, flexible column mapping) · `PartyDialog` (large — firm info, cheque/bank sub-section, tags, **territory/monopoly sub-section with a live overlap-warning banner**, and on *create only* an inline logo + documents uploader).

### `/parties/$id`
**Purpose:** full party profile — financials, documents, contacts, ledger, rates, diary, status history.
**Layout:** back link → header card (icon, firm name, star, badges, lifetime-billed/outstanding summary, **7-button action row**: Call/WhatsApp/Maps/Copy details/Repeat last order/Edit/Delete) → 3-col `InfoCard` grid (GSTIN, DL, PAN, Phone, Email, Pincode, Credit terms, **Assigned Rep select — manager/admin only, per the standing rep-reassignment rule**, Address, Notes) → Cheque/bank-details card → `Tabs`: Contacts, Documents, Ledger, Negotiated Rates, Diary, Status history.
**Header actions:** Call/WhatsApp/Maps (conditional on data present) · Copy details (clipboard) · Repeat last order (→ `/orders` with prefill) · Edit (manager/admin) · Delete (admin + perm `parties.delete`, `AlertDialog`).
**Tabs, briefly:**
- Contacts — Add/Edit/Delete, primary-contact star.
- Documents — Add/Edit/Delete, expiry badges (expired/soon/later/no-expiry), View file.
- Ledger — 4 stat cards, "All orders" link, **Statement PDF** export, **Advance payment** dialog, **Dues reminder via WhatsApp** (only if net > 0), full transaction table with invoice links.
- Negotiated Rates — product + rate input, table with per-row delete.
- Diary — free-text timestamped notes, delete gated to manager/admin OR the note's own author.
- Status history — read-only, auto-logged.

### `/orders`
**Purpose:** invoice list. `canManage` (manager/admin) additionally sees a rep filter and row-delete.
**Layout:** header (title + billed/due summary) → **"New Order" split dropdown** (Upload bill / Add manually) → Filters card (search, Party, Status, Rep [managers/admins only], date-range, sort) → single table (no grid view here, unlike Parties).
**Row:** click → `/orders/$id`; Draft/Cancelled badges (strikethrough invoice #); Status badge (Paid/Partial/Unpaid); arrow-link icon + (canManage) delete icon with confirm.
**Auto-behavior:** opens `NewOrderDialog` automatically if URL carries `?dup=<id>` (Repeat-last-order from Party page) or `?party=<id>` (AI-assistant deep link).
**Dialogs:**
- `NewOrderDialog` (also reused for Edit/Duplicate from `/orders/$id`) — Party select (+ inline "create new party" icon), Invoice No, Invoice Date, editable line-items table (`ProductCombobox` type-ahead incl. "use as new product"), computed Subtotal/Discount/GST/Total, an optional Transport & delivery sub-section (transporter/route auto-fills freight), Notes. Footer: Cancel / Save as draft / Save Order.
- `ImportDialog` ("Upload bill") — **3-step wizard**: file drop (AI extraction for PDF/image, direct parse for CSV/XLSX) → column mapping (with warnings for unmapped required fields) → preview + "Confirm & Import" (auto-creates missing parties, remembers the mapping for next time).

### `/orders/$id`
**Purpose:** single invoice detail — line items, logistics, payments, exports.
**Layout:** header (back, invoice #, date, party, status, **dense export/edit toolbar**) → optional cancelled/draft banner → Line Items card (also the `html2canvas` print surface for JPG export) → `LogisticsCard` → 2-col grid (Payments card + Summary card).
**Header toolbar (9 buttons):** PDF · JPG · Columns (toggle optional PDF columns, persisted to localStorage) · Excel · WhatsApp PDF · Email PDF · Copy text · Edit · Duplicate · Cancel/Reactivate (canManage).
**Logistics card:** view mode (Transporter/Route/Cartons/Freight/Demurrage/Dispatched/Expected/Delivered + fulfillment badge) with action buttons **Mark dispatched → Confirm delivery received → Delay +3 days**, delivery-proof upload; **toggles to an inline edit form** rather than opening a separate dialog (an inconsistency vs. every other edit flow in the app, which uses a `Dialog`).
**Payments card:** table + header actions **Remind** (WhatsApp dues message, if due>0) and **Record/Add Payment**; per-row mark-bounced/cleared toggle (cheque only) and delete (no confirmation — instant).
**Dialogs:** `NewOrderDialog` (Edit/Duplicate modes) · Columns dialog (checkbox grid) · `PaymentDialog` (amount defaults to due, partial-payment warning, conditional cheque fields).

---

<a name="section-4"></a>
## Section 4 — Products, Stock, Transporters

### `/products` (1292 lines — largest single route file, also exports the shared `ProductDialog`)
**Purpose:** catalogue. Viewing open to all; create/edit/import/bulk-rate = manager/admin; delete = admin.
**Toolbar:** List/Grid toggle (bespoke, not the shared `ViewToggle`) · Export PDF · Rate List PDF · Image gallery PDF · **Product Showcase** (this session's new addition — swipeable fullscreen gallery via `ProductImageLightbox`) · (manager/admin) Select Products (bulk mode) · Undo/Redo rate-change (session-only stack) · universal file importer (Excel/CSV/PDF/image/Word/HTML, auto-extract) · Undo import · **New Product split-button** (Upload file / Add manually / Download Excel template).
**Filters:** search · Division · Category · Active-only switch · Sort (Name / Best sellers / Newly added / Last edited / MRP high-low / Stock high-low).
**Bulk bar:** Select all/Clear · % rate-adjust + Apply (with undo snapshot) · Download split-button (Excel/PDF/Rate-list/Gallery, scoped to selection) · Delete (admin, confirm dialog) · Clear selection.
**Grid/table:** **click-to-zoom thumbnail** (new this session, opens `ProductImageLightbox`) · Inactive/bestseller badges · per-row dropdown (Edit / Update stock / Duplicate) · admin-only separate Delete button with its own confirm.
**Dialogs:** `ProductDialog` (image upload, Division/Category, Composition, HSN, Pack, **"Pack variant of" — 2-level nesting only**, GST%, Min Order Qty, Reorder level, MRP, Base Rate, Notes, Active switch) · `ImportReviewDialog` (editable review table before commit) · `UpdateStockDialog` (shared with Stock) · `ProductImageLightbox` (shared component, see below).

### `/product-performance`
Read-only sales-trend report (this-window vs. previous-equal-window). Period date-range + Export (perm `reports.export`, XLSX). 3 KPI stat cards (Total sales, Rising, Declining) + a **`TrendBadge`** (▲emerald >+5% / ▼destructive <-5% / secondary "flat" otherwise) per product row in a breakdown table. No charts yet despite being inherently chart-shaped data — flagged as a good redesign target for a real bar/line chart.

### `/transporters` (list)
Textbook instance of the standard pattern: `ViewToggle` (shared component, unlike Products) + search + New Transporter button + grid/table with row-click-to-navigate + admin-gated delete-with-confirm. Active/Inactive badges (note: inverted convention vs. Products' single "Inactive"-only badge).

### `/transporters/$id`
Header card + 3 stat cards (Total owed/Paid/Outstanding) + `Tabs` (Rate card / Statement).
- Rate card tab: Add/Edit/Delete route rates (confirm dialog on delete).
- Statement tab: **"Settle all (₹X)"** one-tap bulk-settlement button (confirm dialog) · Record payment · trips table (invoice links to `/orders/$id`) · payments table with **unconfirmed instant delete** (inconsistent vs. rate delete on the same page, which does confirm).

### `/stock` (manager/admin only — hard page-level block, not per-control)
Six tabs, each a separate component:
1. **Overview** — 4 KPI cards, near-expiry bucket breakdown, reorder-now list, searchable on-hand table, Valuation Excel export.
2. **Batches** — **Batch recall/traceability lookup** (compliance tool: trace every movement tied to a batch number) · Add stock record · searchable 12-col ledger table · per-row Adjust quantity (mandatory reason enforced) and Quarantine/Release toggle (no confirmation).
3. **Inward/Purchases** — header fields + editable line-item table (Add row, can't delete the last remaining row) + running total + Record inward · Template download · **`OpeningImportDialog`** (universal file import with fuzzy product-name matching, unmatched rows highlighted).
4. **Issue & Returns** — **3-card side-by-side layout** (not a table): Dispatch (with **FEFO auto-suggestion** + manual override), Saleable return in (batch-number autocomplete via `<datalist>`), Godown transfer (two chained mutations client-side, not atomic — a resilience note, not a visual one).
5. **Movements** — pure read-only audit trail, searchable, colored type badges, qty change colored by sign.
6. **Locations** — Add/Edit location; **`LocationDialog` uses a plain HTML checkbox** where the rest of the app uses the styled `Switch`.
Shared `UpdateStockDialog` (used here and from `/products`) is the largest single form in the app — 16 fields.

### Shared: `ProductImageLightbox` (new this session)
Fullscreen, black-backdrop, swipeable (Embla carousel), zoom-toggle image viewer. Used both as a single-image click-to-zoom popout and the multi-image "Product Showcase" gallery. Flagged repeatedly across audits as the app's one genuinely immersive UI moment — a strong template to extend elsewhere (party documents, staff photos).

---

<a name="section-5"></a>
## Section 5 — Team/Staff, Users, Settings, Help, Trash, Leaderboard

### `/team` — the staff/HR/salary module (largest, most complex page in the app)
**Rep view:** 3 tabs only — My performance, My attendance, Team directory (read-only).
**Manager/admin view:** 8 tabs — Directory, Staff, Attendance, Leave, Payroll, Incentives, Claims & Advances, HR Dashboard.
- **Directory** — searchable, Active/Inactive sub-tabs; per-row Call/WhatsApp; **"Transfer book" button (manager/admin only, rep rows only)** opens `TransferBookDialog`; Inactive tab → read-only `InactiveRepRecord` (7-tab viewer: Personal/Documents/Status history/Attendance/Salary/Payslips/Settlements — explicitly non-editable by design).
- **Staff** — profile/HR records, colored employment-status badges, `StaffDialog` (Profile / Documents / Status history tabs).
- **Attendance** — month navigator, colored legend, **"Upload biometric"** import, **"All present today"** bulk-mark, and the **click-to-cycle spreadsheet grid** (the one genuinely novel interaction in the app — click a day-cell to cycle Present→Absent→Half-day→Leave→Holiday in place, no dialog).
- **Leave** — pending-approvals card (inline Approve/Reject, auto-fills attendance on approval), `ApplyDialog`, `BalancesDialog`.
- **Payroll** — salary-structure table + `StructureDialog` (revision history shown inline) · monthly payroll run (Generate/Recalculate, Register/Bank-sheet exports, Finalize lock, editable Incentive/Advance columns while draft, **per-row branded PDF payslip generation**).
- **Incentives** — rule table (`RuleDialog`: 4 rule types) + target-vs-achievement table (`Progress` bars, `TargetDialog`).
- **Claims & Advances** — 3 stacked cards: expense claims (inline Approve/Reject/Mark-paid), advances/loans (Mark settled, no partial-recovery UI), full & final settlements (live-computed net payable, **no PDF export unlike Payroll** despite conceptual similarity).
- **HR Dashboard** — 4 KPI tiles + 2×2 card grid (salary-by-department, doc expiries, birthdays/anniversaries, reminders). Zero buttons — pure reporting, breaks the table pattern entirely.

Shared `TransferBookDialog` (also on `/users`): target-rep select, live preview counts, confirm, optional follow-up deactivation.

### `/users` — manager/admin only (reps redirected away)
Add-user form (always visible) → Active/Inactive tabs.
- Active table: Edit (`EditUserDialog` — incl. **Handles select** for lead-allocation routing, and inline warning steering toward Transfer+Deactivate over renaming for departed staff) · Transfer book (reps only) · **"Deactivate & keep records"** (reps, ceremonial) vs. **plain "Deactivate"** (managers/admins, silent instant toggle — a real asymmetry, possibly intentional).
- Inactive table: View record (`InactiveRepRecord`) · Reactivate.

### `/settings` — admin only, 8 tabs
Branding (logo upload + crop tool, brand color picker) · PDF/Contact (address/phone/GSTIN/PDF header-footer) · Divisions / Categories (**identical `DropdownManager` component reused twice** — a strong signal this could become a first-class reusable "option list" pattern) · Backup (Google Drive OAuth connect + scheduled + manual XLSX export) · Assistant (read-only usage stats) · Features (per-feature `Switch`, disabled + "not in your plan" caption when plan-gated) · Roles (custom role builder — `RoleEditDialog` permission checklist that can only narrow a base role's permissions, never expand).

### `/help` — all users, pure documentation
Five stacked static cards (Roles/Temperature/Next-FU-and-Alerts/Adding-data explainer) plus one live control: **`ReportBugDialog`** ("Report a bug" — description textarea, up to 5 screenshots, 1 video, "Send report"). The only page with literally no data-table content — flagged as the strongest candidate for a real FAQ/help layout rather than plain cards.

### `/trash` — all users
Tabs: Leads/Parties/Orders/Products. Hand-built flex-row list (not the `Table` component) — closer to an activity feed. Per-row "N days left" badge, **Restore** button, **Delete forever** (confirm dialog, hard delete). No bulk "empty trash" action despite the subtitle referencing 30-day auto-clear.

### `/leaderboard` — manager/admin only
Simplest page in the app — one table, zero buttons, zero filters, current-month rep ranking (Leads/Won/Conversion%/Overdue/Orders/Collected). Strong candidate for a genuinely gamified visual treatment (rank badges, medals) given its conceptual purpose.

---

<a name="section-6"></a>
## Section 6 — Console Operations (`/console/*`)

The internal platform-admin console — **permanently dark** (zinc-950/900/800), not theme-toggle-aware by design, not reachable on client custom domains, gated by mandatory TOTP MFA on every route.

### Shell (`console-shell.tsx`, `console-login.tsx`, `console.tsx` guard)
Sidebar: "C" logo tile (fixed from a leftover "E" typo this session) + "Cerebyl"/"Operations" label, pill-shaped nav (Dashboard/Companies/Users/Bug reports/Errors/Security), footer "Internal tool. Not visible to customers." Header: hamburger (mobile) + "Sign out". `console-login.tsx` (reskinned this session): centered card, background glow, entrance animation, no "forgot password" path. Route guard sequence (must be preserved exactly): platform-hostname check → auth loading → no session → admin-check loading → not-a-platform-admin → MFA-loading → no verified TOTP factor (`EnrollTotp`) → AAL1→AAL2 step-up (`ChallengeTotp`) → render the page. *(`console-mfa.tsx`'s `EnrollTotp`/`ChallengeTotp` screens are load-bearing in this flow but weren't independently audited — read that file before finalizing any redesign of the login funnel.)*

### `/console` (Dashboard)
9 identical stat-card tiles (Companies/Active-trial/Suspended-archived/Total users/Open bugs/Errors-7d/Total orders/AI actions/Est. AI spend) + two list cards (AI usage by company — links to company detail — and Feature adoption). Zero data visualization despite genuinely chartable data — flagged as a good `dataviz` candidate.

### `/console/companies` (list)
Table (Company link/Plan/Status badge/Users/Created) + **"Run cleanup now"** (purges old bug-report files, no confirmation) + **"New Company"** dialog (creates the tenant *and* its first admin login in one flat form — **temp password is a visible plain-text input**, a real UX/security note, not just visual).

### `/console/companies/$companyId` — the richest single page in the console
**Not tabbed** (despite being complex enough to warrant it) — six `Card`s stacked vertically: Company info (name/plan/status/trial-end/contact/notes, Save — **zero confirmation on status change**, i.e. suspending a company is one click) → Feature entitlements (per-feature "Allowed" switch, separate from the company's own on/off) → Custom domain (Phase E white-label: add/check/remove, DNS instruction rows with copy buttons, auto status-poll on mount) → Bug reports (company-scoped, status `Select` per report, image/video attachment links) → Recent errors (company-scoped, 100% read-only, no filter/dismiss) → Users table (Edit / Reset password / **Delete — the only "type the exact name to confirm" pattern in the whole app** / Active-Disabled switch, no confirm).

### `/console/users`
Cross-company search (name/phone) → results link to the owning company's detail page. **No per-user actions here at all** — you must navigate away to act on someone you found.

### `/console/bugs`
Cross-company version of the bug-report list embedded on the company page (same `BugAttachmentLink` component literally duplicated between the two files). Status filter select + per-report status `Select`.

### `/console/errors`
Cross-company crash log. **Zero interactivity** — no filter, no dismiss, no company-scoping control (asymmetric vs. the Bugs page, which has both a filter and a status workflow).

### `/console/security`
Self-service TOTP management for the *currently logged-in admin's own account*. Verified-factor state: "Replace authenticator" (swaps in `EnrollTotp`, no dialog) and **"Remove" with zero confirmation** despite an explicit in-copy warning about the risk — the one clearly under-protected destructive action in the console.

**Repeated list idioms across the console (three different ones, worth unifying):** stat-card grid (dashboard only) · shadcn `Table` (companies, users, company-detail's user sub-table) · hand-built `divide-y` block list (bugs, errors, both global and company-scoped versions).
</content>
