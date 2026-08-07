
# Acrowell CRM — Project Handover

This file is a snapshot of where the project stands, meant to be pasted into a fresh chat so work can continue without re-discovering context. It covers: where everything lives, what's been built, what's still broken, and what's still missing. It does **not** prescribe how to fix or build anything below — just what's outstanding.

---

## 1. Project basics

- **App**: "Acrowell CRM" (also called "Lead CRM" in some page titles) — a multi-company pharma lead/order/party management tool built for a PCD pharma franchise business.
- **Local project folder** (connected Cowork folder, where all source files live): `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`
- **GitHub repo**: `https://github.com/harishsharmanash/leadenthrella.git` (branch `main`)
- **Live preview URL**: `https://preview--leadenthrella.lovable.app`
- **Backend**: Supabase project ref `crzddmxogxhirzqkrgwb` (`https://crzddmxogxhirzqkrgwb.supabase.co`), built/hosted via Lovable Cloud.
- **Stack**: React + TypeScript, TanStack Start/Router (file-based routing in `src/routes/`), TanStack Query, Supabase (Postgres + RLS + Storage + Edge Functions), Tailwind + shadcn/ui, jsPDF + jspdf-autotable for PDF generation, `xlsx`/`papaparse` for Excel/CSV import-export.

### Deployment workflow — read this before touching anything

1. Editing files in the connected folder does **not** deploy anything by itself.
2. Changes must be **committed and pushed via the GitHub Desktop app** (the user does this manually) before Lovable will rebuild/redeploy the site and edge functions. Nothing here auto-pushes.
3. **SQL migrations never auto-apply.** Every file in `supabase/migrations/` has to be manually opened and run by the user in the Supabase/Lovable SQL editor. A migration existing in the repo means nothing about whether it's actually been applied to the live database — always assume "not run" unless explicitly confirmed by the user or verified live.
4. A recurring annoyance: GitHub Desktop can get stuck with **"A lock file already exists in the repository, which blocks this operation from completing."** This is a stale `.git/index.lock` file. Fix is on the user's actual Mac (Terminal: `rm ".git/index.lock"` inside the project folder, after fully quitting GitHub Desktop) — an agent's sandboxed bash tool typically cannot delete it due to permissions across the mount.
5. Edge functions (`supabase/functions/*/index.ts`) are part of the same git push/redeploy cycle as frontend code — no separate deploy step needed for them beyond the push, as far as has been observed.

### Migration files that exist (chronological)

```
20260709110515_...   through   20260710200000_notification_triggers.sql   → older/base schema, pre-dates this handover's working window, assume applied
20260710210000_lead_products_interested.sql
20260711120000_batch_qol.sql
20260711140000_security_hardening.sql        ← STATUS UNKNOWN, see "Outstanding actions" below
20260711150000_party_cheque_details.sql      ← confirmed applied (verified live via direct API query)
20260711160000_lead_product_interests.sql    ← confirmed applied (user ran it, reported "Query succeeded")
```

### Outstanding action (not a bug, just unfinished admin work)

- **`20260711140000_security_hardening.sql` has never been confirmed as run.** It closes two real cross-tenant security holes (`recompute_order_totals` and `generate_due_notifications_all` had no access restrictions at all) plus some smaller lint findings (missing `search_path` pinning, missing DELETE/UPDATE policies, etc.). The code/SQL is correct and ready — it just needs to actually be executed against the live database. Nobody has confirmed either way whether this happened.

---

## 2. Known bugs — still broken

### 🔴 Manage Users → editing a user's name/phone silently fails

- **Symptom**: In Manage Users (`src/routes/users.tsx`), editing an existing user's full name or mobile number and hitting Save shows a toast (either "User updated" or a generic error), but the underlying `profiles` row never actually changes — refreshing shows the old data.
- **Investigation so far**: Confirmed via direct Supabase REST/Edge Function calls (bypassing the app UI entirely, using the anon key from `.env` + a session JWT pulled from browser localStorage) that the row genuinely never updates server-side — this isn't a frontend caching/display issue.
- **One real bug found and fixed**: all four admin-only edge functions (`admin-update-user`, `admin-create-user`, `backup-run`, `backup-oauth-start`) were calling `userClient.auth.getUser()` with no argument. On a server-side Supabase client built from a manually-set Authorization header (no real session), `getUser()` without the JWT passed explicitly always fails to authenticate — a well-known Supabase Edge Function gotcha. This was fixed (passing the JWT into `getUser(jwt)`) and pushed live (visible in git history as part of "Round 7/8 fixes").
- **Current status**: user reports the bug is **still happening after that fix was deployed**. That means either the getUser fix wasn't the full/only cause, or there's a second issue layered on top that hasn't been found yet. This has not been investigated further — user asked to park it for now.
- **Useful debugging approach that worked**: reading `.env` for `VITE_SUPABASE_PUBLISHABLE_KEY`/`VITE_SUPABASE_URL`, then in a live browser tab running JS like:
  ```js
  const { access_token } = JSON.parse(localStorage.getItem('sb-crzddmxogxhirzqkrgwb-auth-token'));
  await fetch('https://crzddmxogxhirzqkrgwb.supabase.co/functions/v1/admin-update-user', {
    method: 'POST',
    headers: { apikey: '<publishable key>', Authorization: 'Bearer ' + access_token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: '<id>', full_name: 'Test', phone: '123', role: 'rep' })
  }).then(r => r.text())
  ```
  This bypasses the app's own error-swallowing and shows the real HTTP status + response body from the edge function directly — much faster than clicking through the UI repeatedly.

### 🟢 Resolved this session (for reference, not action needed)

- `lead_product_interests` table missing — was simply a migration that hadn't been run; user has now run it and confirmed success.
- New orders were auto-marking as "Dispatched" the moment a rep entered a planned dispatch date during creation — fixed in `src/routes/orders.index.tsx` (fulfillment_status now always starts "Placed"; only the explicit "Mark dispatched" button on the order detail page changes it). Not re-verified live after deploy, but the fix is a simple, unambiguous one-line change.
- Cheque image had one combined "View/Download" button — split into separate View and Download buttons in `src/routes/parties.$id.tsx`.

---

## 3. Features already built

Broad strokes only (so the new chat doesn't accidentally rebuild these). If in doubt, grep the codebase before assuming something is missing.

- **Leads**: full CRUD, stages/temperature/source tracking, 5-slot follow-up scheduling, Hot & Warm view, Follow-Up Schedule view (with snooze), lead detail page reachable from every list, "Log a call" quick action, days-since-last-contact shown everywhere, Converted-lead badge, duplicate-phone/firm detection, Excel/CSV export, lead → party conversion, per-lead product interest line items (qty/given rate/expected rate) with a searchable product picker, "Generate Bill Summary" PDF export from a lead's interested products.
- **Parties**: full CRUD, tags, star/pin, diary notes (dated), birthday/anniversary field + reminder, tap-to-call/tap-to-WhatsApp, multiple contacts per party, document uploads with expiry tags, credit limit, cheque/bank details with image upload + separate View/Download, dues-aging filter, bulk Excel import, quick-add from inside the New Order screen, party ledger/statement tab (opening balance, total billed, total paid, outstanding, timeline), rep reassignment (managers/admins only), party rate overrides per product.
- **Orders**: create/edit/duplicate/draft, line items with batch/expiry/discount/GST, live totals, cancel (excluded from sales totals but record kept), payments (full + partial) with cash/UPI/cheque/etc. modes, cheque bounce tracking, logistics (transporter, freight, dispatch/expected/delivered dates, "Mark dispatched"/"Delivery confirmed" buttons, extend-delivery-date-by-3-days), invoice PDF generation (regeneratable anytime), copy invoice as plain text, Excel/CSV import mapping tool, filters by date range/rep/status/party.
- **Products**: full CRUD, image upload, division/category, Excel bulk import + template download, duplicate product, bulk % rate adjustment (multi-select + apply), best-sellers sort (based on real order history), search by name/composition/HSN, full catalogue PDF export, separate "clean" Rate List PDF (grouped by division, no images).
- **Transporters**: CRUD, rate cards per route, freight-to-pay total per transporter, extend delivery date on orders.
- **Team**: Manage Users (create/edit/deactivate — edit is the broken one, see bugs), Leaderboard (per-rep lead count/won/conversion%/overdue), rep-only data visibility enforced via RLS.
- **Dashboard**: today's orders/billing, money-to-collect, lead KPI tiles, pipeline/temperature/alert/funnel/state/source/follow-up-outcome charts (lead-source chart is a **bar chart**, not pie — this was an explicit standing instruction, don't regress it).
- **Notifications**: system-generated notifications for order dues and for orders past their expected delivery date. No equivalent exists yet for lead follow-ups (see gaps below).
- **Security**: RLS policies scoped by `company_id` throughout; `current_company_id()`, `is_admin()`, `is_manager_or_admin()` SECURITY DEFINER helper functions gate most policies.

---

## 4. Features requested but not yet built, or only partially built

Grouped the same way the client originally listed them. No implementation guidance included on purpose — just what's missing.

### Orders
- Repeat last order — a one-click button on a party's page that pre-fills their most recent order. (A generic "Duplicate" exists on individual orders, but there's no direct party → last-order shortcut.)
- Item count per row in the orders list (number of line items + total quantity).
- Delivery proof photo attachment on an order (should be optional, not mandatory).
- Free-goods value shown as its own figure (quantity of free goods is tracked, but never surfaced as a ₹ value anywhere).
- Keyboard/type-ahead product add when building an order — currently a plain dropdown plus a separate free-text field, not a real search-as-you-type combobox.

### Parties
- Open in Maps link for a party's address.
- Colored/categorized tags (e.g. VIP, Slow payer, Cash only as distinct visual categories) — tags exist today but are plain free-text badges with no color/category meaning.
- Lifetime business figure isn't prominent — it exists inside a Ledger tab, not visible at a glance on the main party page.
- Copy party details (name/GST/address) to clipboard in one tap.
- A simple "has dues vs clear" filter — only a more granular aging-bucket filter exists today.
- Party status history (a log of when a party went active/inactive/blocked).
- Owner rep is shown on the individual party's page but not as a column in the parties list.

### Monopoly / territory system (parties) — entirely new, not started
This was described in detail and nothing exists for it yet:
- A "dealing area" field and a "Monopoly Given" yes/no flag per party, tied to a specific product division from the division list.
- Overlap detection: when accepting an order/lead for a new party in an area/pincode already monopolized for a given division, the system should flag the overlap so the team can either route the order to the franchise holder or switch to a different (non-overlapping) division/brand.
- A separate "Booked Areas" section, visible only to admins/managers, showing all Indian states in a grid with a "X/Y districts booked" count per state, drilling down into a per-district view showing which party and which rep hold that district's monopoly.

### Money & dues
- Today's collection running total.
- Payment mode breakdown (cash/UPI/cheque totals) — the `mode` field is recorded per payment but never rolled up into any report.
- Advance payment — recording money from a party before any order/invoice exists. The data model technically allows a payment with no linked order, but there's no UI path to create one that way.
- An explicit "sort by highest dues" option (as a filter, not the default — default sort should stay alphabetical everywhere, which is already the case elsewhere in the app).

### Products
- Pack-size variants — linking multiple pack sizes of what is really the same product under one entry, instead of each pack size needing its own separate catalogue row.
- Product image gallery as a customer-facing share feature: selecting products/a division and generating either a downloadable PDF of just their images + details, or a public shareable view-only page/link, similar to how the existing rate-list/bill-summary PDFs work but image-first. Whether/how many of these generated PDFs or public pages should be persisted in the database (and the storage-size implications of doing so) is an open question that hasn't been decided.
- A dedicated fast HSN-code lookup — HSN is already one of the fields the existing product search box matches against, but there's no standalone lookup view for it.

### Leads & follow-ups
- Enquiry → lead in two taps — a fast minimal-field capture flow for a cold phone/WhatsApp enquiry, separate from the full "Add lead" form.
- "Not interested" + reason: closed/lost leads already stay in the database permanently and are already filterable-by-stage and exportable via the existing Excel/CSV export — what's missing is a structured "reason" captured specifically at close time (today there's only a generic "Not Interested" follow-up outcome option and free-text notes, no dedicated reason field/dropdown).
- Follow-up reminders don't actively notify anyone — the Follow-Up Schedule page shows what's overdue/due only when a rep visits it. There's no push/ping to the assigned rep on the due day itself (the notification system that exists today only covers order dues and delivery dates, nothing lead-related).

### Team / salespeople
- A dedicated rep "home screen" — reps already only ever see their own data everywhere (enforced via RLS), but there's no single consolidated home view pulling it together.
- Rep's day plan — a to-do list of who to call/visit today.
- Rep scorecard currently only covers leads (count/won/conversion%/overdue) via the Leaderboard page — it doesn't include orders placed or money collected per rep per month, which is what was actually asked for.
- Start-of-day check-in button for reps.
- Team phone book — an internal contact list for quick calling between teammates.

### Transporters & delivery
- Tap-to-call on a transporter's phone number — it's displayed as plain text today, not a clickable `tel:` link (unlike parties, where this already works).
- Marking freight paid in bulk across multiple trips at once.
- A "shipments this month" count per transporter.

### Finding things fast
- No global search exists anywhere in the app.
- No "recently viewed" list.
- No way to save/favorite a filter combination.
- No general type-ahead search-as-you-type behavior — most pickers in the app are plain dropdowns.

### Sharing & printing
- Invoice as a shareable image (JPG), as an alternative to PDF.
- A full party statement/ledger PDF to hand or send to a customer (the Ledger tab shows this data on-screen, but there's no PDF export of it).
- Emailing a report directly from the app.
- Choosing which columns appear on a printed invoice.

### Dashboard
- This-month-vs-last-month sales comparison.
- A "Top 5 customers & products" widget.
- Undo delete / a 30-day trash bin — every delete in the app today is immediate and permanent, nothing is soft-deleted.

---

## 5. Useful context for whoever picks this up

- The sandboxed bash environment used for verification generally can't run `npm install`/`tsc` within its time limits (large dependency tree, times out) — code correctness has mostly been verified by careful manual reading against the real Supabase types/schemas, plus **live testing directly against the deployed preview site** using the Claude-in-Chrome tools, which has proven far more reliable than trusting a toast message alone.
- When testing live, the browser's own `read_network_requests` tool has been unreliable for capturing Supabase API calls (buffer seems to drop or never populate for `functions.supabase.co`/`supabase.co` requests specifically). The direct-fetch-via-JS-eval technique described in the Manage Users bug section above is the reliable fallback.
- There is a live Chrome tab group already open, generally pointed at `https://preview--leadenthrella.lovable.app`, previously signed in as an admin test user ("Aarav Sharma"). The session can expire/log out over a long conversation — if so, credentials will be needed from the user to log back in and keep testing live.
- Standing product instructions to preserve (given explicitly by the user during this project, easy to accidentally regress):
  - The dashboard's "Leads by Source" chart must be a **bar chart**, never a pie chart.
  - Default sort order everywhere in the app should be alphabetical; anything else (highest dues, best sellers, etc.) should be an explicit opt-in filter/sort choice, not the default.
  - Reassigning a party to a different rep must stay restricted to managers/admins — reps should never see that control.
