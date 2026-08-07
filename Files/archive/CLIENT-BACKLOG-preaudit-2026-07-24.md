# Cerebyl — Client Request Backlog (unbuilt)

Consolidated 2026-07-24 from `leadenthrella/HANDOVER.md` §4 (now archived). Grouped the way the client originally listed them. Cross off / move items as they ship. The 8-feature roadmap lives in `CEREBYL-ROADMAP-8FEATURES.md`; this file is everything *outside* that roadmap.

## Orders
- Repeat last order — one-click button on a party's page pre-filling their most recent order.
- Item count per row in the orders list (line items + total quantity).
- Free-goods value surfaced as its own ₹ figure (quantity is tracked, value is not).
- Keyboard/type-ahead product add when building an order (search-as-you-type combobox).

## Parties
- Open in Maps link for a party's address.
- Colored/categorized tags (VIP, Slow payer, Cash only as visual categories).
- Lifetime business figure prominent on the main party page (currently buried in Ledger tab).
- Copy party details (name/GST/address) to clipboard in one tap.
- Simple "has dues vs clear" filter (only aging-bucket filter exists).
- Party status history log (active/inactive/blocked transitions).
- Owner rep as a column in the parties list.

## Money & dues
- Today's collection running total.
- Payment mode breakdown (cash/UPI/cheque rollups).
- Advance payment UI (payment with no linked order — model allows it, no UI path).
- Explicit "sort by highest dues" opt-in (default stays alphabetical everywhere).

## Products
- Pack-size variants under one product entry.
- Product image gallery as shareable feature: image-first PDF or public view-only link (persistence/storage question undecided).
- Dedicated fast HSN-code lookup view.

## Leads & follow-ups
- Enquiry → lead in two taps (minimal-field quick capture).
- Structured "not interested" reason at close time (dropdown, not free text).
- Follow-up reminders that actively ping the rep on the due day.

## Team / salespeople
- Rep home screen (single consolidated view).
- Rep day plan (who to call/visit today).
- Fuller scorecard: orders placed + money collected per rep per month (Leaderboard is leads-only today).
- Start-of-day check-in button.
- Team phone book (internal contact list).

## Transporters & delivery
- Tap-to-call on transporter phone (`tel:` link).
- Bulk "freight paid" across trips.
- "Shipments this month" count per transporter.

## Finding things
- Global search.
- Recently-viewed list.
- Saved/favorite filters.
- Type-ahead pickers app-wide (most are plain dropdowns).

## Sharing & printing
- Invoice as shareable JPG (alternative to PDF).
- Party statement/ledger PDF export.
- Email a report directly from the app.
- Choose which columns print on an invoice.

## Dashboard
- This-month vs last-month sales comparison.
- Top 5 customers & products widget.
- Undo delete / 30-day trash bin everywhere (soft-delete). *(A trash page exists for some entities — audit coverage before building.)*

## To verify (was listed as a live bug 2026-07)
- Manage Users → editing a user's name/phone silently fails. The console-side user management was rebuilt 2026-07-24 (full edit + email change + add user); check whether the company-side `/users` page still has this bug.
