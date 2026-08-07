# Distributor Portal — status and authority

**Built and LIVE as of 5 Aug 2026.** This is the record of what exists. Read it before
building anything portal-related — most of what looks missing is already shipped.

## What it is
A company's CUSTOMERS (distributors / franchise partners) log into the SAME app and
same URL as staff. Routing decides what they see. One login per party, created and
managed by a company admin from the party's page.

## THE SECURITY MODEL — read this before touching anything

A party user gets a row in `party_users` and **deliberately NO row in `profiles`**.

Every tenant policy in the schema is `company_id = public.current_company_id()`, and
that function reads `profiles`. With no profile it returns NULL, and `company_id = NULL`
is never true. So a distributor can read **nothing** from **any** table — not by a rule
someone remembered to write, but as the arithmetic consequence of having no profile.
Every table added in future inherits that denial for free.

**NEVER create a `profiles` row for a party user.** It would hand a customer staff-level
read of their company's leads, other parties' orders, and staff salaries.

Second wall: distributors never touch PostgREST. All portal data comes from edge
functions on `service_role` that derive `party_id`/`company_id` from the JWT. **A
body-supplied party id must be impossible** — that is the single most likely way this
feature would serve one distributor another's data.

## Edge functions (all deployed)
`portal-data` (me, catalogue, catalogue_facets, product_detail, dues, orders,
order_detail, submit_request, my_requests) · `portal-orders` (invoice, track,
suggestions, statement) · `portal-payments` (upi_info, declare, my_intimations) ·
`portal-media` (visual_aids) · `portal-offers` (offers) · `portal-notify` (list,
mark_read) · `portal-assistant` (5 party-scoped AI tools) · `manage-party-user` (admin).

## Distributor-facing features
Catalogue with their rates + PTS/PTR + margin, division/category filters, molecule
search, favourites · product pages with description + image gallery · quantity picker
(chips 10/20/50/100/500, stepper, typed input) with add-to-cart confirmation · cart →
order request · dues + aging · order history, detail, invoice PDF, tracking · reorder
suggestions from their own history · account statement PDF (Indian FY default) ·
visual aids · offers · notifications · AI assistant.

## Staff-facing
Portal access card on the party page · Order Requests inbox (accept → creates a real
order at the stored `quoted_rate`; reject with reason) · Payment Intimations · Visual
Aids · Offers. All gated on feature `distributor_portal`.

## Invariants that must not break
1. **No `profiles` row for a party user.** Ever.
2. **`party_id` from the JWT, never the body.** A `product_id`/`order_id` in the body is
   a lookup key only — every query must also pin the token-derived `company_id`.
3. **Product fields are an allow-list** (`PORTAL_PRODUCT_FIELDS` in `src/lib/portal.ts`,
   mirrored byte-identically in the edge function). Never `select("*")`. `notes` is
   internal; `base_rate` must not leak.
4. **An order request stores `quoted_rate`** — the rate the distributor was SHOWN. A
   later rate change must never alter what they thought they ordered.
5. **A payment intimation is NOT a payment.** It must never write to `payments`, reduce
   dues, or enter a financial figure until a human confirms.
6. **The assistant has its own 5-tool set**, none accepting a party/company id. It must
   never reuse Ceremate's company-wide tools.

## Payments are OFF by default (5 Aug 2026)
`portal_payments` is both **DEFAULT_OFF** and **CONSOLE_ONLY** — a company admin cannot
switch it on for themselves; only the platform console can. Accepting payments in-app
implies invoicing and compliance obligations the product is not ready for, so the
capability is built but dormant.

The real gate is server-side: `portal-payments` re-checks the entitlement before
dispatching any action and 403s when off. Hiding a nav item is not access control.
With the flag off a distributor sees only *"To record a payment, contact your sales
associate"* — nothing editable. **The statement stays available**: viewing a ledger is
not accepting payment. `NavItem.feature` now accepts an array, so Payment Intimations
requires BOTH `distributor_portal` AND `portal_payments`.

## OPEN — next session
1. **The full round trip has never been run once**: cart → submit → rep accepts → order
   appears → notification. Every piece is verified individually; the chain is not.
2. Migration `20260805190000_product_media.sql` — **still needs applying by hand.**
   Product descriptions and the image gallery will not work until it is.
3. Test fixture `portaltest@seed.enthrellabiotech.test` still exists; password is in a
   chat transcript. Delete before anything is real.

## Related
`MOBILE-APP-SETUP-RUNBOOK.md` (the portal ships inside the Android app) ·
`mobile-app-build.md` · isolation suite: `npm run test:isolation`.
