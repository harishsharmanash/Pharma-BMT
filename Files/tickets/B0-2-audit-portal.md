# TICKET B0.2 — AUDIT ONLY: distributor portal surface

## THIS IS AN INVESTIGATION TICKET. CHANGE NO PRODUCT CODE.

The only file you may write is `Files/tickets/reports/REPORT-B0-2.md`. Do not edit, create, or
delete anything else. Do not commit. Do not run tsc or tests — nothing is being changed.

Context you need: the distributor portal lets a client company's CUSTOMERS log into the same app.
A party user has a `party_users` row and **deliberately no `profiles` row** — that single fact is
the entire tenant-isolation guarantee, because every RLS policy keys off `current_company_id()`
which reads `profiles`. Distributors never touch PostgREST directly; all their data comes from
edge functions running on service_role that derive the party from the JWT. Keep that model in mind
while reading; flag anything that appears to violate it.

## Method

Read the actual code. Every claim carries `path:line` evidence. Say "unclear" rather than guessing.

## Questions to answer

### Q1 — Offers / schemes (this is the big one)
Files: `src/lib/use-offers.ts`, `src/routes/offers.tsx`, `src/routes/products.offers.tsx`,
`src/routes/portal.offers.tsx`, `supabase/migrations/20260805150100_offers.sql`, and the
`portal-offers` edge function in `supabase/functions/`.

The header comment in `use-offers.ts` says offers are **DISPLAY ONLY — never auto-applied to an
order**. We intend to build a real scheme engine that computes discounts and free goods and locks
them to the order. Before we do:

- Describe the full current offers data model: every column, what each `kind` means, how the date
  window works, who can CRUD it, and how the portal reads it.
- Where exactly does order pricing happen today? Trace it: from the cart or order form through to
  the stored line items and totals. Name every file and function in that path.
- Where are **party-specific rates** applied (`src/lib/use-party-rates.ts`)? At what point in the
  pricing path, and what happens if a rate changes after an order exists?
- Does an order line item store the rate it was placed at, or does it recompute from the product?
  **Quote the code that decides this** — it is the single most important answer in this ticket.
- What tax/GST handling exists in the totals path (`src/lib/order-totals.ts`)?
- Is there any concept of a **party group** or party category that a scheme could target?

### Q2 — Statement, ageing and dues
Files: `src/routes/portal.statement.tsx`, `src/routes/portal.dues.tsx`, `src/lib/dues.ts`,
`src/lib/ledger.ts`, and the relevant `portal-*` edge functions.

- What does the distributor's statement show today? Is there **ageing bucketing** (0–30 / 31–60 /
  61–90 / 90+)? If yes, quote it.
- Is there invoice-level drill-down showing **how payments were allocated** across invoices?
- Is there a downloadable/shareable PDF of the statement?
- Is there any way for a distributor to **dispute** an invoice or a line today?
- What is the default period — is Indian financial year handled anywhere in the codebase?

### Q3 — Product page and margin maths
Files: `src/routes/portal.product.$productId.tsx`, `src/routes/portal.catalogue.tsx`,
`src/lib/portal.ts`, `supabase/migrations/20260805150000_product_pts_ptr.sql`.

- What product fields does the portal expose? `src/lib/portal.ts` holds an allow-list — list it.
- Are PTS/PTR/MRP present and populated? What do those columns mean in this schema?
- Is there ANY margin or GST calculator in the portal today?
- Is GST rate stored per product, per company, or per order line? Where?

### Q4 — Product imagery
Files: `supabase/migrations/20260805190000_product_media.sql`,
`src/components/product-image-lightbox.tsx`, `src/routes/products.aids.tsx`.

- What does `product_media` store? Multiple angles? Resolution constraints? Ordering?
- What does the lightbox currently support — zoom, pinch, multiple images, captions?
- How are images uploaded and where are they stored (bucket, path convention, size limits)?

### Q5 — Reorder data availability
- For a given party, what order history is queryable and how far back? Name the hook and shape.
- Is there any existing "repeat last order" or reorder feature? (There is believed to be one —
  find it and describe it exactly.)
- Is expiry/batch data on company stock reachable from the portal side, and if so how?

### Q6 — Cart
Files: `src/routes/portal.cart.tsx`, `src/lib/portal-orders.ts`.

- How does the cart store state (local, server, which)? What happens on refresh?
- What exactly is submitted when a distributor places an order request, and what does the company
  side receive (`src/routes/orders.requests.tsx`)?

## Report format

`Files/tickets/reports/REPORT-B0-2.md`, one section per question, each ending with:

`VERDICT: ALREADY BUILT | PARTIALLY BUILT (extend X) | NOT BUILT`

Then **"Traps for the builder"**: anything that would make a naive scheme-engine or statement change
break existing behaviour — especially anything in the pricing path where a change could alter what a
customer already agreed to pay, and anything that could accidentally give a party user broader read
access than they have today.
