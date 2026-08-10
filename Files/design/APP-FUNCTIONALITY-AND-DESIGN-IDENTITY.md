# Cerebyl — App Functionality & Design Identity

*Compiled 07 Aug 2026. Source: live codebase recon of `leadenthrella`. This is the reference for what every page does and how the app is designed.*

---

## Part 1 — Page-by-page functionality

### 1. Dashboard (`/dashboard`)

**Purpose:** the "what needs me right now" surface. Not an analytics page — an action page.

- **Greeting hero** — time-of-day greeting, "Here's what needs you today".
- **Quick actions** (each shown only if your role/feature allows it):
  - `New Lead` → opens the new-lead dialog on `/leads/all`
  - `New Order` → opens the new-order dialog on `/orders/all`
  - `Add Party` → opens the party form on `/clients/parties`
  - `Record Payment` → party picker → lands on that party's page with the payment dialog open
- **"Today at a glance"** — 4 stat cards: today's orders (count), today's billing (₹), today's collection (₹), money still to collect (₹).
- **"Needs attention today"** — exception list with counts, each row links to its work queue: overdue follow-ups, follow-ups due today, deliveries due, invoices past credit period, pending order requests.
- **My Day** — the rep's personal day plan, folded into the dashboard (also at `/my-day`).
- **Analytics link card** — the only path to charts from here ("How are we doing?").

### 2. Leads

The lens bar **All | Call List | Follow-ups | Duplicates** is the section's identity — `/leads` redirects straight to `/leads/all`. (Admin extra: Lead Intake link.)

- **All** — full lead book: search, stage/temp/rep filters, sort, saved views, grid cards or table, bulk select/import/export, quick enquiry, add lead. Card click → peek drawer (call/WhatsApp, stage, temp, product interest, log a call, convert, edit, open full lead).
- **Call List** — the same list pre-filtered to Hot & Warm, most urgent first.
- **Follow-ups** — leads with a scheduled follow-up, most overdue first; snooze +3d per row.
- **Duplicates** (`/leads/duplicates`) — **read-only housekeeping view.** Two groups: leads sharing a phone number, and leads sharing a firm name, each entry showing lead code, name/firm, and owning rep. Purpose: catch the same prospect entered by two reps. No merge action yet.

### 3. Clients

- **Home (`/clients`)** — card hub: Parties, Territories, Portal Access (signpost), plus cross-links to Order Requests and Payment Intimations (which live in Orders).
- **Parties (`/clients/parties`)** — the customer book (distributors/chemists/doctors):
  - View toggle (list/grid), **Bulk import**, **New Party** (full form: firm, GSTIN/DL/PAN, contacts, credit days/limit, opening balance, bank/cheque details, tags, important dates, logo & document uploads).
  - Banner alerts: important dates coming up (≤14 days), document expiry (expired or ≤30 days).
  - Filters: search (firm/city/GSTIN/phone/tags), type, status, **dues-aging filter** (0–30/30–60/60–90/90+ days by oldest unpaid invoice), dues status, starred-only, sort, saved views.
  - Row click → quick-view sheet → full party page.
- **Territories (`/clients/territories`)** — "Booked Areas": monopoly-territory map + list. List/Map toggle, search, **Download PDF** of the territory map. Each area links to its party. Manager/admin only.
- **Party page (`/parties/$id`)** — everything about one customer:
  - Header: star, call/WhatsApp/email, territory, edit, delete.
  - Info grid: GSTIN, drug license, PAN, credit days/limit, opening balance, address, notes.
  - **Portal Access card** (where portal logins live today): create login (email + password), reset password, change email, disable/enable, delete login. Admin manages; others see "ask an admin".
  - Tabs: **Contacts**, **Documents**, **Ledger** (orders & payments: statement PDF, share statement, record payment, advance payment, WhatsApp dues reminder), **Negotiated Rates** (per-product party pricing), **Diary** (notes), **Status history**.

### 4. Orders

- **Home (`/orders`)** — card hub: Today's Orders (stat card, links to the full list), Orders & Invoices, Dues Aging (summary card with ₹ + bucket breakdown — also just links to the full list), Order Requests, Payment Intimations, Transporters.
- **Orders & Invoices (`/orders/all`)** — the invoice book:
  - **New Order**: "Upload bill" (photo/PDF → AI extraction) or "Add manually".
  - Filters: search, party, status (Unpaid/Partial/Paid), rep, date range, sort, saved views. Duplicate-an-order via `?dup=`.
  - Row → peek sheet → invoice page.
- **Order Requests (`/orders/requests`)** — incoming portal orders from distributors. Detail dialog shows items + quoted rates + note; **Accept & create order** or **Reject** (reason required).
- **Payment Intimations (`/orders/intimations`)** — "I've paid" reports from the portal. **Confirm payment** (books a real payment, updates dues) or **Reject** with reason.
- **Transporters (`/orders/transporters`)** — logistics partners: add/edit (name, contact, GSTIN, address, active switch), shipments-this-month count, admin delete.
- **Invoice page (`/orders/$id`)** — line items, payments (record, WhatsApp reminder), totals, and **Transport & delivery**: transporter, LR/docket no., expected delivery, **Mark dispatched** / **Mark delivered**, share tracking (WhatsApp/email/link), delivery-proof photo, Export PDF, Share, Edit, Cancel/Reactivate.

### 5. Products

Lens bar: **All | Offers | Stock | Visual aids**. Home (`/products`) is a card hub under the same bar (Products, Stock, Expiring Batches ≤90d, Offers, Visual Aids).

- **All (`/products/all`)** — the catalogue:
  - **New Product**: upload-file import, manual add, Excel template download. **HSN lookup**, **Export** (Catalogue PDF, Rate List, Image gallery, Product Showcase), bulk-rate undo/redo, undo import.
  - Filters: search (name/composition/HSN), division, category, dosage form, active-only, sort, saved views.
  - Bulk mode: select → % rate adjust up/down, export selected, delete.
  - Per product: edit (full form incl. images, PTR/PTS, packing), update stock, duplicate, delete (admin). Low-stock bar on cards.
- **Offers (`/products/offers`)** — schemes/discounts/announcements shown in the distributor portal (display-only, not auto-applied). New Offer (manager/admin), Live/Expired/All filter, edit/delete.
- **Stock (`/products/stock`)** — six in-page tabs: Overview, Batches, Inward/Purchases, Issue & Returns, Movements, Locations.
- **Visual Aids (`/products/aids`)** — doctor-facing artwork library: upload (image + title + linked product + division), show/hide toggle, delete. Distributors forward these from their portal.

### 6. Team

Lens bar: **Directory | Accounts** (Accounts hidden from reps). Home is a card hub under the bar.

- **Directory (`/team/directory`)** — two faces: reps see *My performance / My attendance / Team directory*; managers/admins see *Directory / Staff / Attendance / Leave / Payroll / Incentives / Claims & Advances / HR Dashboard*.
- **Accounts (`/team/accounts`)** — user management: create users (role Rep/Manager/Admin + permission overrides), view/edit/deactivate/reactivate, **Transfer book** (reassign a user's parties/leads), and the custom-role builder (named roles with permission checkboxes).

### 7. Analytics

Card-hub home; three read-only destinations:

- **Overview** — charts: pipeline by stage, leads by source (bar, never pie — standing rule), temperature mix, follow-up alerts, conversion; KPI strip, this-vs-last-month sales with MoM %, payment-mode split, top 5 customers & products.
- **Product Performance** (manager/admin) — period selector, top-products chart, per-product sales breakdown table, xlsx export. Rising/slowing analysis.
- **Leaderboard** (manager/admin) — reps ranked by conversion.

### 8. Settings (admin)

- **Company Settings (`/settings`)** — pill tabs: **Branding** (logo w/ crop, primary colour), **PDF/Contact** (address, GSTIN, UPI, PDF header/footer, auto order emails), **Divisions / Categories / Dosage forms / Packing types** (dropdown managers with activate-hide/delete), **Features** (module switches; plan-gated ones disabled), **Legal** (privacy/terms/refund/DPA).
- **Administration (`/settings/admin`)** — **Activity Log** (who/what/where filters; every company action), **AI Usage** (per-user messages/images/PDFs + ₹ charge, by period), Backups (Google Drive auto-backup + manual .xlsx), Mobile app (request branded Android APK, rebuild on branding change).

### 9. Trash & Help

- **Trash** — soft-deleted records with restore.
- **Help** — support/documentation page.

---

## Part 2 — Design identity ("Stitch")

The whole app follows one design system, locked in `src/styles.css` (`.stitch` tokens) with the Leads page as the reference implementation.

### Canvas & structure

- **One rounded window.** The app is a single floating card with large rounded corners on a soft blue-grey canvas (`--st-background`). The window never page-scrolls: the top chrome is fixed, only the content area scrolls internally.
- **Light theme only.** No dark glass, no gradients (banned: `gradient-brand`, `shadow-glow`, `glass-hero`).
- **Density:** compact desktop scale (the app is intentionally tuned to a "80%-zoom" feel at 100%).

### Typography

- **One family everywhere: Inter** (weights 300–700 loaded). Hierarchy comes from *weight and size*, never from mixing families. Type utilities: `.t-head-*` (headings), `.t-body-*` (text), `.t-data` (numbers/labels, tabular), `.t-label` / `.chip` (uppercase micro-labels). `font-mono` is gone — numeric data uses Inter with `tabular-nums`.

### Shape & elevation

- **Fully rounded language:** bars and buttons are pills (`rounded-full`); cards and panels are `rounded-3xl`.
- **Elevation, not outlines:** white/70–90 surfaces with `backdrop-blur` and soft shadows (`.sh-sm` / `.sh-md` / `.sh-lg`), hairline `border-white` separators. "Popped out" = higher shadow, never heavier border.

### Color language

- **Primary blue** (`--st-primary`) drives action and selection.
- **Bars (primary chrome):** elevated white pill bar with a sliding thumb — powder-blue tint (`--st-primary`/10) + primary text on the active item, animated with a spring (`framer-motion` `layoutId`). Used for the top menu and every section's lens bar.
- **Buttons (secondary chrome):** filled blue pills (`.pill sh-md`). Filter/sort controls are the same pill without border. Ghost/outline buttons are reserved for rare tertiary actions.
- **Status color semantics (leads):** temperature is a traffic-light system — **Hot = coral red** (with a pulsing dot), **Warm = amber**, **Cold = sky blue**. Lead stages each carry their own hue: New = blue, Contacted = violet, Details Shared = teal, Qualified/Negotiation = indigo, Won = green, Lost = slate. Same hues in cards, table, drawer, and dialogs.
- **Alerts:** urgency is red-tint text on a 10% red wash; info is primary on a 10% primary wash; muted is grey. No saturated legacy badge palettes.

### Motion

- One animation vocabulary: the **sliding bubble** (spring) for all segmented bars and the menu; fade-up stagger for page content; press-scale on buttons. Nothing bounces, nothing slides from off-screen except sheets/dialogs.

### Information pattern

- **List pages** = lens bar (if the section is lenses on one dataset) + single-row pill toolbar (filters left, view toggle + actions right) + card grid or table + conditional footer bar (only when multiple pages exist).
- **Cards are summaries, not documents** — code, temp, name, firm, stage, follow-up. Detail lives one click in: the **peek drawer** (right-side panel, own scroll, pinned action bar) and then the full detail page.
- **Tables** breathe: generous cell padding, clipped rounded containers, `--st-on-surface-variant` headers, `border-white/50` dividers.
