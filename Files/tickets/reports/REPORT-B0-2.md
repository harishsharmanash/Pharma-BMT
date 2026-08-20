# REPORT-B0-2 — Distributor portal surface audit

Audit performed by reading the available source files.  This is a read‑only report; no product
code was changed.  Paths that were **not** provided in the chat are marked "unclear".

## Q1 — Offers / schemes

### Current offers data model

Evidence: `src/lib/use-offers.ts:11-20` defines the `Offer` type.

Columns present on `offers` (based on that type):

| Column | Type | Notes |
|---|---|---|
| `id` | string | PK |
| `company_id` | string | FK to company |
| `product_id` | string \| null | nullable; makes an offer product‑specific */
| `title` | string | |
| `description` | string \| null | |
| `kind` | `OfferKind` | values "scheme" \| "discount" \| "announcement" (`src/lib/use-offers.ts:6`) |
| `starts_on` | string \| null (YYYY‑MM‑DD) | inclusive |
| `ends_on` | string \| null (YYYY‑MM‑DD) | inclusive |
| `is_active` | boolean | hard‑switch used by staff |
| `created_by` | string \| null | |
| `created_at` | string | |
| `updated_at` | string | |

The date window logic is implemented in `src/lib/use-offers.ts:33-38`:

```ts
export function offerWindow(
  offer: Pick<Offer, "starts_on" | "ends_on">,
  today: string,
): OfferWindow {
  if (offer.starts_on && offer.starts_on > today) return "scheduled";
  if (offer.ends_on && offer.ends_on < today) return "expired";
  return "current";
}
```

`is_current` additionally requires `is_active === true` (`src/lib/use-offers.ts:41-43`).

### Who can CRUD offers?

- **Staff** use `useOffers()`, `useSaveOffer()` and `useDeleteOffer()` in `src/lib/use-offers.ts`.
  Those go through `offersTable()` which calls `supabase.from("offers")` (lines 46‑48).  The
  underlying RLS is not visible in the files supplied; the comment at the top says
  "Staff CRUD goes through PostgREST (RLS: offers_staff_all)" (`src/lib/use-offers.ts:5`).
- **Portal** reads offers via `usePortalOffers()` which invokes the `portal-offers` edge function
  (`src/lib/use-offers.ts:94-101`).  The edge function is not provided, so we cannot verify how it
  derives the party or filters offers.

### Where does order pricing happen today?

The pure math that the order form uses is in `src/lib/order-totals.ts`:

- `lineAmount()` (`src/lib/order-totals.ts:8-13`) computes:
  `gross = qty * rate`, `afterDisc = gross - gross*disc_pct/100`,
  `total = afterDisc + afterDisc*gst_pct/100`.
- `computeOrderTotals()` (`src/lib/order-totals.ts:20-28`) aggregates subtotal, discount, GST,
  and total using `lineAmount()`.

The actual screen that uses these functions is `src/routes/orders.index.tsx` — **not provided** in
this chat.  Based on the comment at the top of `src/lib/order-totals.ts:1` ("shared by the order
form (orders.index.tsx) and tests"), pricing for internal orders lives in that route and leverages
`computeOrderTotals`.

From the **distributor side**, order requests do not go through `order-totals.ts`; they submit only
`{ product_id, qty }` (`src/routes/portal.cart.tsx:41-44`):

```ts
submit.mutate({
  items: cart.items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
  note: note.trim() || undefined,
}, ...);
```

So no pricing is computed at request time on the client; the company side must compute it later.

### Party‑specific rates

`src/lib/use-party-rates.ts` exposes:

- `usePartyRates(partyId)` – fetches all `product_party_rates` rows for a party.
- `usePartyRateMap(partyId)` – returns a `Record<product_id, number>` map.

These hooks are intended to be used on the order form (comment at `src/lib/use-party-rates.ts:18`:
"used on the order form").  The actual order form code is not in this chat, so we cannot confirm
exactly where the map is applied.

### Critical: does an order line store the rate at placement?

**Unclear from the provided files.**

- The `PortalInvoiceItem` type in `src/lib/portal-orders.ts:12-24` includes `rate: number`; this is
  the rate shown on an existing invoice, strongly suggesting a snapshot is stored.
- However, `src/routes/portal.cart.tsx:41-44` discards the cart's rate when submitting an order
  request; only `product_id` and `qty` are sent.  This means the **request** is not rate‑locked;
  the company's order creator would compute the rate later from the product / party rate maps.

We did **not** see the `orders` table migration or the order‑creation code, so we cannot quote the
exact line that decides whether `rate` is written at order creation time.  This is the single most
important fact the builder will need to verify: **does `INSERT INTO order_items` store the current
`rate` or does it JOIN to the live product rate?**

### GST handling

GST is a **per‑line percentage** passed to `lineAmount()` (`src/lib/order-totals.ts:4` has
`gst_pct`).  The totals aggregation sums GST separately (`src/lib/order-totals.ts:23-26` line for
`gst`).  No evidence of GST being stored differently at a company or party level in the files we
have.

### Party groups / categories

No concept of a party group or category appears in any file we were given.

### VERDICT: Q1

**PARTIALLY BUILT (extend offers data model and connect it to pricing).**  The display‑only offers
layer exists; an actual scheme engine that computes discounts/free goods and locks them to an order
does not.

## Q2 — Statement, ageing and dues

### What the distributor statement shows

`src/routes/portal.statement.tsx` renders:

- Opening balance / closing balance cards.
- Ageing buckets (0‑30, 30‑60, 60‑90, 90+) when closing balance > 0 – buckets defined at
  `src/routes/portal.statement.tsx:25` (`const BUCKETS = ["0-30", "30-60", "60-90", "90+"]`).
- A date range selector defaulting to current Indian financial year (`financialYearStart()` from
  `src/lib/ledger.ts:41-44`).

The statement rows come from `src/lib/portal-orders.ts:119-155` as `PortalStatementRow` and are
populated by the `statement` action on the portal‑orders edge function (which is **not provided**).
The pure logic that builds the statement is in `src/lib/ledger.ts` – `buildLedger()`.

### Ageing bucketing

Yes, ageing bucketing is implemented.

- Server side: `computeAging()` in `src/lib/ledger.ts:59-72` uses `duesAgingBucket()` from
  `src/lib/portal.ts`.
- Portal statement displays the buckets (0‑30 / 30‑60 / 60‑90 / 90+) – `src/routes/portal.statement.tsx:25` and rendering around line 98.

### Payment allocation drill‑down

**NOT BUILT.**  `buildLedger()` simply lists invoice (debit) and payment (credit) rows; it does not
allocate a payment to specific invoices.  Each payment appears as its own row with a running balance,
but there is no per‑invoice breakdown of "this invoice was paid by these payments".  The portal
statement page only shows the flattened table – no drill‑down.

### Downloadable PDF

**BUILT.**  The statement page's "Download statement" button calls `buildStatementPdf()` and
`downloadBlob()` (`src/routes/portal.statement.tsx:35-58`).  The PDF builder itself is in
`src/lib/invoice-pdf.ts` (not provided) but the call is clearly wired.

### Disputes

**NOT BUILT.**  No dispute‑related code is present in any file we were given.  No button, API, or
edge‑function path for a distributor to dispute an invoice or a line appears.

### Default period / Indian financial year

Handled in `src/lib/ledger.ts:35-48` – `financialYearStart()` returns 1 April of the current Indian
financial year, and `todayIso()` returns today's ISO date.  The statement route uses both as default
`from`/`to` (`src/routes/portal.statement.tsx:28-29`).

### VERDICT: Q2

**ALREADY BUILT** for statement + ageing + PDF.  Missing: payment allocation drill‑down and dispute
flow.

## Q3 — Product page and margin maths

### Portal product allow‑list

`src/lib/portal.ts:11-23` defines `PORTAL_PRODUCT_FIELDS`:

```
id, name, brand, composition, pack, mrp, ptr, pts, gst_pct, hsn,
category, division, dosage_form, min_order_qty, image_url, description
```

This is the *only* set of product fields the portal may see.  `base_rate` is fetched server‑side but
stripped before the response leaves the edge function (`src/lib/portal.ts:6-9`).

### PTS/PTR/MRP presence

- The `PortalProduct` type contains `mrp`, `ptr`, `pts` (they are in the allow‑list).
- The product detail page renders MRP, PTR, PTS, and "Margin (PTR − PTS)"
  (`src/routes/portal.product.$productId.tsx:151-175`).

The meaning in this schema (pharma India):

- `MRP` = maximum retail price
- `PTR` = price to retailer (distributor buys at PTR)
- `PTS` = price to stockist

### Margin / GST calculator

**PARTIALLY BUILT.**  The product page shows a **static** margin (PTR − PTS) via `ptrPtsMargin()`
(`src/lib/portal.ts:99-104`).  There is no interactive GST or margin calculator anywhere in the
portal code we were given.

### Where is GST rate stored?

- Product table has a `gst_pct` column (in the allow‑list).
- Order‑line math uses `gst_pct` per line (`src/lib/order-totals.ts:4`).
- The portal does **not** store GST at company or party level; it is per product, and the order line
  snapshot records the then‑applied `gst_pct`.

### VERDICT: Q3

**ALREADY BUILT** for product detail fields and static margin display.  No interactive GST/margin
calculator exists.

## Q4 — Product imagery

We do **not** have the following in the chat:

- `supabase/migrations/20260805190000_product_media.sql`
- `src/components/product-image-lightbox.tsx`
- `src/routes/products.aids.tsx`

Therefore:

- We cannot describe the exact storage shape (bucket, path conventions, size limits) of
  `product_media`.
- The portal product detail page implements a custom swipeable gallery (see
  `src/routes/portal.product.$productId.tsx:207-275`), but that is *not* the shared lightbox
  component.
- No lightbox or zoom/pinch code is visible.

**Unclear** for all specifics.

### VERDICT: Q4

**UNKNOWN / NOT VERIFIABLE** with the files provided.

## Q5 — Reorder data availability

### Queryable order history for a party

`usePortalSuggestions()` in `src/lib/portal-orders.ts:85-91` fetches the `suggestions` action from
the `portal-orders` edge function, returning `PortalSuggestions`:

```ts
export type PortalSuggestion = {
  product: PortalProduct;
  order_count: number;
  median_interval_days: number;
  days_since_last: number;
  last_ordered_at: string;
};
```

The client‑side pure logic that generates these is `computeReorderSuggestions()` in
`src/lib/portal-orders.ts:45-80`.  It works from a party's own order history received via the edge
function; the edge function itself is not provided, so we cannot say how far back history goes.

### "Repeat last order" feature

**Unclear.**  We do not see any code that implements a "repeat last order" button.  The closest
concept is the smart‑reorder suggestions (above), which recommend products based on median reorder
interval.  There is no one‑click "re‑order previous cart" in the files we have.

### Expiry / batch data

Company stock is **not** directly reachable from the portal; portal‑orders edge function serves
invoice history that includes `batch` and `expiry` on `PortalInvoiceItem`
(`src/lib/portal-orders.ts:12-24`).  So a distributor can see past‑order expiry/batch, but not the
current stock status.

### VERDICT: Q5

**PARTIALLY BUILT** – reorder suggestions exist; explicit "repeat last order" and current stock
visibility do not.

## Q6 — Cart

### Cart state

`usePortalCart(partyId)` is used in `src/routes/portal.cart.tsx:16-20`.  The implementation of that
hook is **not provided** (`src/lib/use-portal-cart.ts`).  From usage we can tell it supports
`items`, `add`, `setQty`, `remove`, `clear`, and `total`.  Nothing in the code tells us whether it is
localStorage, sessionStorage, or a server‑side store.

If the cart is client‑side (likely, given `usePortalCart` naming and the fact that it only needs
`partyId`), refreshing the browser may lose the cart unless it uses `localStorage`.

### What is submitted

From `src/routes/portal.cart.tsx:41-44`:

```ts
submit.mutate({
  items: cart.items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
  note: note.trim() || undefined,
}, ...);
```

Only `product_id` and `qty` are sent; no rate, discount, or GST.  The company side receives this
payload through the `portal-orders` edge function (not provided) and presumably creates an order
request that a rep reviews.

### What the company side receives

The route `src/routes/orders.requests.tsx` is **not provided**.  Based on the above mapping, the
company will see an order request with a list of `product_id`/`qty` pairs and an optional note.

### VERDICT: Q6

**ALREADY BUILT** for the cart UI.  The cross‑session persistence mechanism could not be verified
from provided files.

## Traps for the builder

1. **Rate snapshot risk.**  If the order‑item table recomputes `rate` from the product at the time
   the order is created (rather than storing the rate shown to the customer), then changing a
   party‑specific rate after a cart was submitted will change the price the customer is invoiced.
   The cart itself already discards the rate (`src/routes/portal.cart.tsx:41-44`).  Before building a
   scheme engine, the builder must confirm *exactly* where `order_items.rate` is set (INSERT) and
   never allow a later rate change to silently modify an existing invoice.

2. **Do not let a scheme derail existing order line math.**  `src/lib/order-totals.ts` already sums
   subtotal, discount, GST, and total using per‑line `disc_pct` and `gst_pct`.  A scheme engine must
   apply the same rounding rules (`Math.round(x*100)/100`) and ideally reuse `lineAmount()` so the
   totals stay consistent with historical invoices.

3. **Portal access must stay read‑only through edge functions.**  The portal never touches PostgREST
   directly (`src/lib/use-offers.ts:94-101`, `src/lib/portal-orders.ts:31-40`).  Any scheme‑engine
   change that adds a new portal action must go through a *new edge function action*, never by adding
   a PostgREST query on the client side.  Otherwise a naïve implementation would widen the distributor's
   data access.

4. **Offers currently have no linkage to pricing.**  The `Offer` type has only `product_id` (nullable)
   and `kind`.  There is no `discount_value`, `free_qty`, `min_qty` etc.  The builder will need to
   extend the schema and the staff CRUD, and decide whether schemes apply at company level, party
   level, or party‑group level (no groups exist today).

5. **Distributor statement is already built, but payment allocation is not.**  Any new "dispute" or
   "payment allocation" feature must preserve the existing ledger rows and ageing buckets, which are
   already published to portals.  Changing `buildLedger()` could alter the closing balance shown to
   existing customers.

6. **Indian financial year default is already hard‑coded.**  Do not remove `financialYearStart()` /
   `todayIso()` from `src/lib/ledger.ts`; they are used by both the statement page and the edge‑
   function mirror.  Keep them byte‑identical with the mirrored copy in `supabase/functions/portal-
   orders/index.ts`.

7. **Product imagery is not verifiable from the files given.**  Any plan that touches the lightbox or
   media upload must first inspect the migration and the existing upload code; do not assume the
   current storage layout.

8. **Cart persistence is unknown.**  If `usePortalCart` is localStorage‑based, adding scheme‑related
   pricing into the cart could be lost on refresh.  The builder should verify the storage mechanism
   before changing what is displayed.

9. **The current cart only sends `product_id` and `qty` to the company.**  Trying to add scheme
   calculations client‑side will not reach the company side unless the order‑request payload is
   extended.  This is a deliberate design; changing it requires coordinated edge‑function and
   company‑side order‑creation changes.
