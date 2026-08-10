# Cerebyl — UI Design Brief for Stitch

**Purpose of this document:** a complete functionality + design-identity brief for generating UI screens in Stitch. It lists every button, action, view, and data element on each page, and the visual/design language the whole app should follow. Stitch should design the *layout and look* for these — this doc intentionally does not prescribe where each element sits on screen.

---

## ⚠️ READ THIS FIRST — What kind of app this is

**Cerebyl is a B2B business-management CRM for a PCD (Propaganda-Cum-Distribution) pharma franchise company.** It is used internally by pharma companies and their distributors to run their *business* — not by doctors, not by patients, and it has no clinical, diagnostic, or medical-advice function whatsoever.

The users are:
- **Sales reps** who chase leads (prospective retailers/stockists/distributors) and manage their own customers
- **Managers** who oversee a team of reps, review territory, and approve things
- **Admins** who run company-wide settings, billing, and reporting
- **Distributors/customers** (external, via a separate limited portal) who place orders and view their account

What they do inside the app: track sales leads, manage customer/retailer accounts, create and track invoices/orders, manage a product catalogue and stock, pay commissions/salaries, run sales analytics, and handle company admin.

**This is a sales/operations tool that happens to sell pharmaceutical products — visually and functionally it should look like a modern B2B CRM / ERP (think: a clean sales & inventory dashboard), NOT a doctor's app, NOT a patient app, NOT a hospital/clinical dashboard.** Avoid stethoscope icons, heartbeat/pulse motifs, doctor avatars, patient-record layouts, appointment-booking UI, or any clinical iconography. Product icons should read as "pharma packaging/commerce" (tablets/boxes/cartons, invoices, trucks, rupee amounts, charts) — not "medicine cabinet" or "health record."

Every page brief below repeats this context on purpose — treat it as binding for every single screen you generate.

---

## Overall design identity — how the whole app should feel

This applies uniformly across every page. Individual pages should NOT get their own color theme, font, or interaction style — the whole app is one consistent design system, and only content/layout differs per page.

### Visual language
- **Style:** clean, modern, iOS-inspired native-app aesthetic (grouped inset lists, large collapsing titles, sheet-style dialogs, segmented controls) — but must work correctly on Android and desktop web too, so nothing iOS-exclusive-only (no dependence on iOS-only gestures).
- **Light theme only for now** — do not design or propose a dark mode; nothing in the current design system defines dark-mode colors.
- **One brand accent color** for all interactive elements (buttons, links, active states, primary actions) — applied consistently everywhere. Never invent a different accent color per section/page.
- **Color is used sparingly and only to mean one consistent thing each time** — e.g. red always means "overdue / due / destructive," green always means "paid / positive / success," never repurpose a color to mean something else on a different page.
- **Section/category color-coding, where it exists (e.g. product divisions, lead temperature), lives only on small accents** — icon tiles, dots, badges — never on full buttons or backgrounds.
- **Typography:** one clean sans-serif family throughout (Inter, or an equivalent modern grotesk — NOT a system/Apple-only font, NOT a decorative or medical/clinical-looking font). One consistent type scale across the whole app — large page titles, clear section headers, comfortable readable body text (favor slightly larger, easy-to-read body text over dense tiny text — this app has historically been criticized for feeling "cluttered" from oversized/undersized text mixed together; keep hierarchy simple: title / section header / body / caption, not six different sizes).
- **Spacing:** generous, consistent padding and whitespace; consistent corner radius across cards/buttons/dialogs; consistent shadow/elevation style for cards vs. sheets/dialogs.
- **Icons:** one consistent icon set throughout (simple line icons, e.g. Lucide-style) — never mix icon styles or weights.

### Layout patterns to reuse across pages
- **List pages** (Leads, Parties, Orders, Products, Transporters): search bar + filter row + sort control, then a list/grid of cards or table rows, with a List/Grid view toggle where useful. A prominent primary "add new" action (top of page).
- **Detail pages** (a single lead / party / order / product): a header block with key identity info and quick actions (call, share, edit), then organized info cards/sections, often with tabs for sub-areas (e.g. a customer's contacts, documents, ledger, notes).
- **Dialogs/sheets** for create/edit forms and confirmations — not full-page navigations, so the user doesn't lose their place in a list.
- **Peek/preview panel**: clicking a list row can open a lightweight summary panel (slide-in from the side or bottom) with key facts and a "open full page" link, rather than always jumping straight to the full detail page.
- **Empty states**: every list/table needs a friendly, on-brand empty state (icon + one line of text + primary action where relevant) — never a blank white area.
- **Confirmation before destructive actions**: every delete action requires an explicit confirm step, and should clearly say whether it's reversible (soft-delete, "goes to Trash") or not (hard delete, "cannot be undone").
- **Status/urgency communicated by color + text/badge together, never color alone** — e.g. a red "Overdue" badge, not just a red dot.
- **Currency is always ₹ (Indian Rupees)**, and Indian date/number formatting (DD Mon YYYY, comma-grouped numbers) throughout.
- **Role-based visibility:** some buttons/sections only show for Managers/Admins, and are simply invisible (not disabled/greyed) for Reps who can't use them. Design should account for "fewer things visible" states, not just "disabled" states.
- **Default sort is always alphabetical (A–Z by name)** unless the user actively picks something else — this is a strict product rule everywhere a sort control exists.
- **Charts:** never use pie charts for "distribution by category" data (e.g. leads by source) — always bar charts. Pie/donut charts are acceptable only for simple 2–4-segment splits (e.g. hot/warm/cold).

### Navigation shell
The app has a persistent sidebar (desktop) / bottom tab bar (phone, 5 items: Dashboard · Leads · Clients · Orders · More) with these top-level sections: **Dashboard, Leads, Clients, Orders, Products, Team, Analytics, Settings** — plus utility items (Trash, Help, an AI assistant chat, account menu). Stitch should design a consistent shell/header pattern (page title, search where relevant, primary action button, account avatar) that every page below sits inside.

---

## 1. Dashboard

**Context:** Pharma B2B CRM — this is the sales rep/manager's home screen when they open the app. It answers "what do I need to do right now," not "how is the business doing" (that's the separate Analytics section). Keep it action-first, not chart-heavy.

**Purpose:** a personalized action-oriented home screen — greets the user, surfaces urgent things needing attention today, and gives one-tap shortcuts to the most common actions, so the user doesn't have to navigate deep into other sections just to do routine things.

**Functionality:**
- **Personalized greeting banner** — "Good morning/afternoon/evening, [Name]" with a short framing line ("here's what needs you today").
- **Quick action shortcuts** (grid of large tappable tiles): **New Lead**, **New Order**, **Add Party (customer)**, **Record Payment** — each jumps straight into that creation flow from the dashboard, saving a trip to the relevant section. "Record Payment" opens a small dialog to first pick which customer the payment is for, then continues to that customer's payment form.
- **"Today at a glance" stat cards**: Today's Orders (count), Today's Billing (₹), Today's Collection (₹, shown positively), Money to Collect / Outstanding (₹, shown as urgent/red if greater than zero).
- **"Needs attention today" list** — a prioritized list of things requiring action, each tappable and jumping straight to where it's resolved:
  - Overdue follow-ups (leads the user was supposed to contact and didn't)
  - Follow-ups due today
  - Deliveries due (orders expected to arrive today that haven't been marked delivered)
  - Invoices past the customer's credit period (unpaid past their allowed credit days) — shown with count and total ₹ overdue
  - Pending order requests from the distributor portal (only for companies using that feature)
  - When nothing needs attention: a positive "you're all clear" empty state.
- **"My Day" section** — the rep's personal daily task/follow-up plan folded into the dashboard.
- **Link into Analytics** — a card/button inviting the user to view fuller sales/performance analysis, making clear that deeper reporting lives in a separate Analytics section.

---

## 2. Duplicates page (part of Leads)

**Context:** Pharma B2B CRM — this is a data-hygiene tool for sales reps/managers to spot duplicate lead entries (the same prospective retailer/stockist being logged twice, often by different reps), not a medical duplicate-record tool.

**Purpose:** flags potential duplicate lead entries so the team can notice and manually clean them up — prevents two reps unknowingly chasing the same prospect, and keeps the pipeline data trustworthy.

**Functionality:**
- Automatically scans all leads for two kinds of duplication and groups matches together:
  - **Same phone number** used on more than one lead
  - **Same firm/business name** used on more than one lead (case-insensitive match)
- For each duplicate group, shows the shared value (the phone number or firm name) and the list of leads sharing it, each showing the lead's name/firm and which rep it's assigned to — so a manager can quickly see "these two reps have the same prospect."
- A count badge shows how many duplicate groups exist, for each of the two detection types.
- **This is a read-only report** — there is no merge/delete/ignore button on this page itself; it exists purely to surface the problem so someone can go fix it (e.g. by opening the individual lead elsewhere and deciding what to do).
- Friendly empty state when no duplicates are found ("no duplicates found").

---

## 3. Clients / Parties page (customer management)

**Context:** Pharma B2B CRM — "Parties" here means the company's B2B customers: retailers, stockists, hospitals, and distributors who buy pharma products from them. This is a customer/account-management screen, like a CRM's account list — not a patient list.

**Purpose:** the full directory of business customers — tracks who they are, where they are, what they owe, what documents/licenses they have on file, and the full relationship history (orders, payments, notes, contacts) with each one.

### List page functionality
- **List/Grid view toggle.**
- **Bulk import** — upload an Excel/CSV file of customers at once (with a downloadable template), auto-mapping columns like firm name, contact info, GST number, credit terms, etc.
- **"New Party" button** — opens a full create-customer form.
- **Search** across firm name, city, state, GST number, phone, and tags.
- **Filters:** customer type, active/inactive/blocked status, dues-aging bucket (how overdue their payments are), has-dues vs. clear, "starred only."
- **Sort:** alphabetical by firm name (default), reorder-due first, highest-dues first, newly added, last edited. Starred/pinned customers always float to the top regardless of sort.
- **Save current filter/search as a reusable view**, and re-apply it later.
- **Alert banners** at the top: upcoming birthdays/anniversaries for customers (within 2 weeks), and a count of customer documents (licenses etc.) that are expired or expiring soon.
- **Each customer row/card shows:** firm name, GST number, status badge, colored tags, assigned territory, city/state, phone (tap-to-call), assigned sales rep, a "reorder due" indicator (how long since their last order — flags if overdue for a repeat order), document-expiry warning badges, an outstanding-dues badge (the most prominent element, shown in red if they owe money), and a star/pin toggle.
- **Clicking a row opens a quick-preview panel**: key facts, tap-to-call, outstanding balance & days-since-last-order, location, assigned rep, credit terms, document status, and a button to open the full profile page.
- **Create/Edit customer form fields:** firm name, type, status, GST number, drug license number, PAN, phone, email, full address, credit days & credit limit, opening balance, bank/cheque details, tags, territory assignment (managers/admins only), an "important date" (e.g. anniversary) with a label, notes, a company logo/photo upload, and document uploads (license, ID, etc. with expiry dates).
- **Deleting a customer is a soft delete** (recoverable from Trash), not permanent.

### Customer detail page functionality
- **Header:** firm name, star toggle, type/status badges, tags, lifetime business total, current outstanding balance, and any upcoming important-date reminder.
- **Quick-action icons:** Call, WhatsApp message, Open location in Maps, Copy customer details to clipboard.
- **"Repeat last order"** — one-tap to start a new order pre-filled with everything from their last order.
- **"New order"** — start a fresh order for this customer.
- **"Territory"** — (managers/admins only) manage the geographic/product territory assigned to this customer on a map.
- **Edit / Delete** (delete is admin-only, with confirmation, and is a soft/recoverable delete).
- **Info cards:** all the business/registration details (GST, license, PAN, contact info, credit terms), with an editable assigned-rep field (reassigning a customer to a different rep is manager/admin-only — reps can never do this).
- **Portal access card** (only for companies with distributor-portal enabled) — admins can create/reset/disable a login so this customer can access their own limited self-service portal, with a one-time-reveal generated password.
- **Bank/cheque details card** with a cheque-image upload.
- **Tabs on the customer profile:**
  - **Contacts** — list of individual people at this customer's business (name, role, phone, email, mark one as primary); add/edit/delete.
  - **Documents** — licenses/IDs on file with expiry tracking (expired/expiring/valid badges); add/edit/delete, view uploaded file.
  - **Ledger** — full financial history: opening balance, total billed, total paid, outstanding balance; every invoice and payment in one running-balance table; buttons to view all their orders, download/share a PDF account statement, record an advance payment (not tied to a specific invoice), record a payment against a specific invoice, and send a dues-reminder message.
  - **Diary** — a free-text activity log for the rep to note calls made, visits, promises made, etc., with timestamps.
  - **Status history** — an automatic read-only timeline of status changes over time.
- **Territory management sub-page** (managers/admins only): assign this customer a sales territory — either by scope (all products / a specific product / a division / a range) and area (state, district, pincode, or a radius drawn on a map) — with a live warning if it overlaps another customer's assigned territory (still allowed, just flagged), and a map view showing this and other customers' territories.

---

## 4. Orders page

**Context:** Pharma B2B CRM — "orders" are pharma product invoices/sales orders placed by or for customers (retailers/stockists), including transport/delivery tracking. This is an invoicing & logistics screen, like a sales-order module in an ERP — not a prescription or medical-order system.

**Purpose:** create, track, and manage every sales invoice from creation through delivery through payment — the core transactional record of the business.

### List page functionality
- **Search** by invoice number or customer name.
- **Filters:** customer, payment status (unpaid/partial/paid), assigned rep (managers/admins only), date range.
- **Sort:** invoice date (newest/oldest), amount (high/low), last edited, last uploaded.
- **Save/apply/clear a saved filter view.**
- **Header summary line:** total invoice count, total billed, total outstanding (for the current filter).
- **"New Order" button (split button with two options):** "Upload bill" (scan/import an existing invoice document or spreadsheet, using AI-assisted extraction for photos/PDFs) or "Add manually" (blank order form).
- **Each order row/card shows:** invoice number (with draft/cancelled indicators), date, customer, item count, total/paid/due amounts, payment status badge, and (in card view) a visual delivery-progress rail: Placed → Dispatched → Delivered → Paid.
- **Managers/admins get a delete option per row** (with confirmation, notes that linked payments become unlinked).
- **Clicking a row opens a quick-preview panel** with totals, item count, delivery status, dispatch date, notes, and a link to the full invoice.
- **New Order form:** pick a customer (or add a new one inline without leaving the form), invoice number & date, an editable line-item table (product picker with search, pack, batch, expiry, quantity, free quantity, MRP, rate, discount %, GST %, auto-computed line amount, add/remove rows), live-updating subtotal/discount/GST/total summary, an optional transport & delivery section (transporter, saved route with auto-filled origin/destination/freight, number of cartons, freight cost, dispatch & expected-delivery dates), and notes. Can save as a draft or save as a final order.
- **Bill-upload/import flow:** upload a photo, PDF, or spreadsheet of an existing invoice; the system attempts to auto-read it (AI-assisted for photos/PDFs), lets the user map spreadsheet columns to the right fields if needed, shows a preview of everything it parsed, and lets the user confirm before creating the order(s) — auto-creating any new customers it encounters, and skipping duplicates.

### Order detail page functionality
- **Export options:** download as PDF, as an image (JPG, for easy WhatsApp sharing), or as an Excel file.
- **Share button** — send the invoice (as PDF, image, or text summary) via WhatsApp, email, or other targets.
- **Column customization** — choose which optional invoice columns are visible.
- **Copy invoice summary as text**, **duplicate this order** (start a new order pre-filled from this one), **edit this order in place**.
- **Cancel/Reactivate** (managers/admins only) — mark an order cancelled without deleting it; cancelled/draft orders are excluded from sales and dues totals.
- **Full line-items table.**
- **Transport & delivery card:** shows transporter, route, cartons, freight cost, any demurrage charges, and key dates (dispatched/expected/delivered — flags if overdue). Actions: mark as dispatched, confirm delivery received, push back the expected date by a few days, copy a public tracking link (a no-login page the customer can open to see their order status), and upload/view proof-of-delivery. Marking dispatched or delivered can automatically notify the customer by email and offers to share the tracking link via WhatsApp/email.
- **Payments card:** table of all payments recorded against this invoice (date, mode, reference, amount, bounced-cheque flag). Actions: record a new payment, send a dues reminder (if anything is still owed), and for managers/admins — mark a cheque payment as bounced/cleared, or delete a payment (with confirmation).
- **Summary card:** subtotal, discount, GST, total, paid, due, plus any notes and where the order came from if it was imported.
- **Payment form:** amount, date, payment mode (cash/UPI/cheque/etc. — shows cheque number & date fields if mode is cheque), reference number, notes; warns if the amount entered is less than what's actually due.

### Dues Aging (sub-page under Orders)
**Purpose:** shows exactly which customers owe money and how overdue each is, so collections can be prioritized by urgency.
- **Four aging-bucket summary tiles:** 0–30 days, 30–60 days, 60–90 days, 90+ days overdue — each shows how many customers fall in that bucket and the total ₹ outstanding.
- **Search** (by customer firm name or city) and a **bucket filter** dropdown.
- **Results table**, sorted most-overdue first: customer name (links to their profile), city, assigned rep, outstanding amount, aging bucket badge, how long the oldest unpaid invoice has been outstanding, and a **one-tap "Remind" button** that opens a pre-written WhatsApp reminder message to that customer.

### Order Requests (sub-page under Orders, distributor-portal companies only)
**Purpose:** a review queue for orders that customers themselves placed through their self-service portal, which staff must approve before they become real orders.
- List of requests (filterable by status, pending by default); clicking one shows the requested line items; staff can **Accept** (turns it into a real order) or **Reject** (with a required reason).

### Payment Intimations (sub-page under Orders, distributor-portal companies only, and only if online payment reporting is enabled)
**Purpose:** customers can report ("intimate") that they made a payment through the portal; staff must confirm it before it counts as a real recorded payment — prevents unverified claims from affecting the books.
- List of pending intimations; **Confirm** (creates the real payment record) or **Reject** (with a required reason) per row.

### Transporters (sub-page under Orders)
**Purpose:** manages the logistics companies/couriers used to ship orders to customers.
- List/Grid toggle, search, "Add Transporter" button.
- Each entry shows name, contact, phone (tap-to-call), and how many shipments they've handled this month; clicking opens their detail page. Edit/delete (delete is admin-only).

### Public order-tracking page (no login required)
**Purpose:** a link a customer can open (no account needed) to check the status of their own order — the destination of every "share tracking link" action above.
- Company branding header, a 3-step visual timeline (Confirmed → Dispatched → Delivered) with dates and a "running late" note if applicable, the list of items ordered, and a payment status indicator (paid / payment pending) with the total amount.

---

## 5. Products page

**Context:** Pharma B2B CRM — this is the company's own pharmaceutical product catalogue (what they manufacture/distribute and sell to their customers) — a catalogue/inventory management screen, like a B2B product catalogue in a sales/ERP tool. Not a drug-information or clinical-reference app; no dosage/prescribing guidance is shown, only commercial details (price, pack, stock, GST, HSN code).

### Section landing
A landing page with cards into: **Products** (the catalogue), **Stock** (inventory/expiring batches — managers/admins only), **Offers** (schemes/promotions run on products, shown to distributors via the portal), and **Visual Aids** (marketing artwork — see section 6 below).

### Product catalogue functionality
- **List/Grid view toggle.**
- **"HSN lookup"** — a searchable reference tool to find/verify tax HSN codes by product name or composition.
- **Export options:** catalogue PDF, a rate list PDF (grouped by division, prices only), an image-gallery PDF, and a fullscreen swipeable "product showcase" gallery view of the current selection.
- **Multi-select mode** (managers/admins) — select multiple products at once to bulk-adjust their prices by a percentage (with undo/redo), bulk-export the selection, or bulk soft-delete.
- **Bulk import** — upload a spreadsheet, PDF, or photo of a product list; the system extracts a draft table the user can review/edit before confirming the import.
- **Filters:** search (name/composition/HSN), division, category, dosage form, "active only" toggle. **Sort:** name A–Z (default), bestsellers, newly added, last edited, price high-low, stock high-low.
- **Save/apply a filter view.**
- **Products with multiple pack sizes group together** under a parent product, collapsible/expandable.
- **Each product row/card shows:** photo thumbnail (tap to zoom), name, dosage form/pack info, division badge (color-coded), pack-size badge, inactive flag if applicable, composition, HSN code, a stock level bar (flags low stock against a reorder threshold), MRP/rate/trade prices, and a menu to edit, update stock, duplicate, or delete (delete is admin-only).
- **Create/Edit product form:** product photo, an optional multi-image gallery (shown to distributors in the portal, separate from the main photo, with drag-to-reorder and captions), name, division, category, composition, HSN code, pack size, dosage form, packing type, "this is a pack-size variant of [another product]" linking, GST %, minimum order quantity, reorder-alert threshold, MRP, base rate, and optional trade prices (PTR/PTS), description (customer-facing), internal notes, and an active/inactive toggle.

### Product Performance (lives under Analytics, but reachable from Products)
**Purpose:** shows which products are selling well or slowing down over a chosen date range, so the business can spot trends.
- Date range picker (defaults to last 90 days) and an Excel export (permission-gated).
- A "top products by sales" bar chart — bar color signals whether that product is trending up or down vs. the prior period.
- Stat tiles: total sales, count of rising products, count of declining products.
- A full breakdown table/list: every product, quantity sold, sales this period vs. previous period, and a trend badge (rising %, declining %, flat, or "new" if it has no prior-period data to compare against).

---

## 6. Visual Aids (part of Products)

**Context:** Pharma B2B CRM — "visual aids" here means marketing/promotional artwork (product posters, leaflets) that the pharma company gives its distributor sales reps to forward on to doctors as promotional material. This is a marketing-asset library, not a diagnostic or clinical visual aid.

**Purpose:** a shared image library so the company can upload promotional artwork once, and its distributors/reps can browse and share it with the doctors they visit — replacing scattered WhatsApp forwards with one managed source.

### Staff-side management functionality
- **"Add visual aid" button** — upload flow: pick an image file, an auto-suggested title (editable), optionally link it to a specific product and a division.
- **List of uploaded visual aids**, each showing a thumbnail, title, linked product/division badges, and a "hidden from distributors" indicator if turned off.
- **Active/off toggle per item** — controls whether distributors can currently see it, without deleting it.
- **Delete** (with confirmation — permanently removes the image).
- Friendly empty state with a call-to-action to add the first one.

### Distributor-facing gallery functionality (the actual "visual aid gallery" viewing experience)
- A **grid gallery** of artwork thumbnails, with **search** by title/division.
- **Tapping an image opens a full-screen lightbox view** — full-size image, title, and a **"Share with a doctor" button** that uses the phone's native share sheet (or falls back to copying a shareable link) so the distributor can quickly forward it via WhatsApp or any other app.

---

## 7. Analytics page

**Context:** Pharma B2B CRM — this is the sales/business-performance reporting section: pipeline, sales trends, product performance, and team leaderboards for a pharma distribution business. Not clinical/patient analytics.

**Purpose:** the "how is the business doing" companion to the Dashboard's "what do I do now" — deeper trend analysis and reporting, organized into three tabs.

### Overview tab
- **Chart-first layout**, all read-only reporting (no click-through actions):
  - Pipeline by stage (bar chart) — how many leads are at each stage of the sales process
  - Temperature split (donut/pie) — hot/warm/cold lead counts
  - Alert status (bar chart) — overdue / due today / upcoming / closed / no-follow-up-set counts
  - Conversion funnel (horizontal bar chart) across the full lead lifecycle stages
  - Leads by state (horizontal bar chart, geographic breakdown)
  - **Leads by source (horizontal bar chart — never a pie chart, standing rule)**
  - Follow-up outcomes (horizontal bar chart)
- **KPI strip:** total leads, hot, warm, cold, lost, overdue, due today, upcoming, won, and conversion %.
- **Money summary cards:** this-month vs. last-month sales with a % change indicator, this-month payments broken down by payment mode, top 5 customers by lifetime billing, top 5 products by sales.

### Product Performance tab
(Described above under Products — same page, reached from either section.)

### Leaderboard tab
**Purpose:** ranks the sales team by performance to motivate and surface top/struggling performers — managers/admins only.
- A highlighted #1 rank card (crown icon), then the rest of the team ranked below (medal icons for #2/#3).
- Per rep: total leads owned, leads won, conversion %, overdue leads, this-month order count, this-month amount collected. Ranked by conversion % by default.

---

## 8. Settings page

**Context:** Pharma B2B CRM — company-wide configuration and admin controls for the business running the app. Admin-only section. Not consumer/patient-facing.

**Purpose:** everything an admin needs to configure how the company's instance of the app looks, behaves, and is governed — branding, catalog reference data, feature availability, backups, the mobile app, and legal/compliance.

### Company Settings (tabbed)
- **Branding tab:** upload & crop a company logo, pick a primary brand color (color picker + hex input) that applies across the whole app and generated documents/PDFs.
- **PDF / Contact tab:** company contact details and header/footer text used on generated PDFs (invoices, product lists, statements); plus a toggle for automatically emailing customers on order status changes, with a reply-to override.
- **Divisions / Categories / Dosage Forms / Packing Types tabs** (four tabs, same pattern): manage the dropdown reference lists used throughout Products — add new values, edit inline, toggle active/hidden, delete (with confirmation); Divisions additionally get an assignable color swatch used for their badge/dot throughout the app.
- **Features tab:** toggle switches to turn optional app features on/off for this company (e.g. Orders, Stock, Transporters, Distributor Portal, Mobile App) — features not included in the company's plan show as disabled with a "contact your provider" note.
- **Legal tab:** links to the published Privacy Policy, Terms, Refund Policy, and Data Processing Agreement.

### Administration section
- **Activity Log:** a searchable, filterable audit trail of every create/edit/delete/restore/sign-in/export/download action across the company, with a before/after diff view per entry.
- **AI Usage:** this-month usage stats for the built-in AI assistant (action count, amount charged) with a per-team-member breakdown table.
- **Automated backup:** connect a Google Drive account, set a backup frequency (daily/weekly/monthly), enable scheduled automatic backups, and trigger an on-demand backup — shows connection and last-backup status.
- **Manual backup:** one-click full data export to a single Excel file (one sheet per data table).
- **Mobile app:** the company's branded Android app — a button to kick off building it (bakes in their current logo/brand color), a progress state while it builds, a download button once ready (with a warning + rebuild option if branding has changed since the last build, and an install-help guide), and a retry option if the build fails.

---

## Notes for whoever is building screens from this doc

- Every page above serves **internal business staff** (reps/managers/admins) except the two customer-facing surfaces explicitly called out: the **public order-tracking page** (no login) and the **Visual Aids gallery's distributor-facing view** — design those two slightly more consumer-friendly/simple, but still on the same visual design system, and still clearly a pharma **business/commerce** context (never clinical).
- Currency is always ₹, dates are Indian format, and default sorting is always alphabetical unless stated otherwise.
- Destructive actions always confirm first, and always make clear whether the deletion is recoverable (soft-delete/Trash) or permanent.
- Role differences (rep vs. manager vs. admin) mean some buttons/sections simply don't exist for some users — design should feel complete either way, not like something is "missing."
