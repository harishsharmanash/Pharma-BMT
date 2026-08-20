# TICKET 1B.1 — Margin and GST calculator on the distributor product page (F9)

## Goal

Distributors do this arithmetic on paper or a phone calculator every working day. Put it where the
product already is. On the portal product page, the distributor enters an intended selling price (or
taps MRP / PTR to fill it) and immediately sees: gross margin in ₹ and %, GST liability, net
realisation, and what margin the retailer downstream would make at that price.

Today the page shows only a **static** PTR − PTS margin via `ptrPtsMargin()` in `src/lib/portal.ts`.
This ticket adds an interactive calculator alongside it. Do not remove the existing static display.

## Files

Edit:
- `src/lib/margin-calc.ts` (**new** — all arithmetic lives here as pure functions)
- `src/lib/margin-calc.test.ts` (**new**)
- `src/routes/portal.product.$productId.tsx` (UI only — no arithmetic in the component)

Read only:
- `src/lib/portal.ts`
- `src/lib/order-totals.ts`
- `src/lib/dues.ts`

Touch nothing else. Do **not** modify `src/lib/portal.ts`, the portal edge functions, or the
product field allow-list — every field you need is already exposed.

## Domain rules — read carefully, this is where a wrong answer is expensive

- `MRP` = maximum retail price. `PTR` = price to retailer. `PTS` = price to stockist.
- The distributor **buys at PTS** and **sells to the retailer at PTR** (or at whatever price they
  enter). The retailer then sells to the patient at MRP.
- **Treat PTS, PTR and any entered selling price as GST-EXCLUSIVE base rates.** This matches how the
  rest of this codebase computes money: `src/lib/order-totals.ts` applies `gst_pct` on top of the
  rate *after* discount. Do not invent an inclusive-price interpretation.
- **MRP is conventionally GST-inclusive.** So when computing the retailer's downstream margin
  against MRP, you must back out GST from MRP before comparing it to a GST-exclusive selling price.
  Get this right and state the formula in a comment.
- Round money to 2 decimals using the same convention as `order-totals.ts`
  (`Math.round(x * 100) / 100`). Percentages: round to 2 decimals, and never divide by zero — a zero
  or null base must yield `null`, not `Infinity` or `NaN`.

## Outputs the calculator must produce

Given `{ pts, ptr, mrp, gstPct, sellingPrice }`:

1. **Gross margin ₹** — `sellingPrice − pts`
2. **Gross margin %** — on cost (`(sellingPrice − pts) / pts`). Label it explicitly as "on cost" in
   the UI so it cannot be misread as margin on sale.
3. **GST liability ₹** — GST charged on the sale (`sellingPrice × gstPct / 100`).
4. **Net realisation per unit** — what the distributor actually keeps: `sellingPrice − pts`.
   (GST collected is not income — it is passed through. Say so in one short line of UI copy.)
5. **Retailer's downstream margin** at that selling price, versus GST-exclusive MRP, in ₹ and %.
6. **Per-pack figures** — only when a unit count can be parsed from the product's `pack_size` or
   `pack` field. Those are free-text columns (e.g. "10x10", "1x10 Tab", "100ml"), so:
   - write a `parsePackUnits(pack: string | null): number | null` helper,
   - handle at minimum `NxM` (multiply), a plain integer, and a leading `1x10` form,
   - return `null` when it cannot be determined, and **hide the per-pack block entirely** in that
     case rather than showing a wrong or zero figure.

Any output whose inputs are missing must render as "—", never as `0` or `NaN`.

## UI

- A collapsible card on the product page titled **"Margin calculator"**, below the existing price
  block.
- One number input for selling price, prefilled with `ptr` when present, plus small "MRP" and "PTR"
  buttons that fill it.
- Results in a simple two-column label/value list. Use existing shadcn/ui primitives already
  imported on that page or in `src/components/ui/`. Do not add a dependency.
- Must work on a phone: the portal is used on mobile more than desktop. No horizontal scrolling.
- Follow the existing visual language of that page. The app is **light-only** — do not add dark
  styles.
- Add the standard **"Business tool only"** framing already used elsewhere if you render any
  guidance text. Make no medical claim of any kind.

## Constraints

- **All arithmetic in `margin-calc.ts` as exported pure functions.** The component may not contain
  a single calculation — this is what makes it testable and is how the rest of this codebase is
  structured (`order-totals.ts`, `dues.ts`, `ledger.ts` are the precedent).
- No new dependency. No change to any query, hook, or edge function.
- The calculator is display-only: it must never write anything or affect cart pricing.

## Acceptance

- `npx tsc --noEmit` = 0 errors.
- `npm run test` passes.
- `margin-calc.test.ts` covers: a normal case with real pharma-like numbers; zero/null `pts`
  returning `null` rather than dividing by zero; the GST back-out from MRP; and `parsePackUnits` for
  `"10x10"` → 100, `"1x10 Tab"` → 10, `"100ml"` → null, `null` → null.
- **Mutation-verify**: break the GST back-out (compare against raw MRP) and break the divide-by-zero
  guard; confirm each turns a test red, then restore. Report which mutations you used.
- Report the exact formula you used for the retailer downstream margin.
