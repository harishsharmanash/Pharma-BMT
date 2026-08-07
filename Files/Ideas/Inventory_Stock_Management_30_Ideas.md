# Stock / Inventory Management — 30 Feature Ideas

For the Acrowell CRM (PCD pharma franchise). Grouped by theme. Pharma-specific concerns — batch, expiry, and regulatory traceability — are treated as first-class, not add-ons.

## Core stock tracking
1. **Batch-wise stock ledger** — every product tracked by batch number with its own quantity, MRP, expiry, and purchase rate, since two batches of the same product are legally distinct.
2. **Live stock-on-hand per product** — a running quantity that decrements on dispatch and increments on purchase/return, visible on the product page and catalogue.
3. **Multi-location / godown stock** — separate stock counts per warehouse or franchise point, with transfers between them logged.
4. **Opening stock import** — bulk-load current inventory via the same universal file uploader (Excel/PDF/photo) already built for products.
5. **Purchase / goods-inward entry** — record stock received from manufacturers with batch, expiry, qty, and landed cost; auto-increments stock.
6. **Stock adjustment with reason** — manual corrections (breakage, sample, theft, count fix) that require a reason code and leave an audit trail.

## Expiry & compliance
7. **Expiry dashboard** — buckets of stock expiring in 30/60/90/180 days, valued in ₹, so near-expiry stock can be pushed or returned.
8. **Auto FEFO allocation** — when creating an order, suggest the First-Expiry-First-Out batch automatically to minimise expiry write-offs.
9. **Expired-stock quarantine** — expired batches auto-flagged, blocked from being billed, and moved to a "to destroy / return" list.
10. **Saleable-return & expiry-return handling** — track returns from parties back into stock (saleable) vs. to manufacturer (expiry), each with its own workflow.
11. **Batch recall tool** — search a batch number and instantly see which parties it was billed to, for recalls or quality complaints.

## Reordering & planning
12. **Low-stock / reorder-level alerts** — per-product minimum threshold that raises a notification (reusing the existing notification bell) when breached.
13. **Auto-reorder suggestions** — recommended purchase quantities based on recent sales velocity and lead time.
14. **Fast/slow/dead-stock report** — classify SKUs by movement so slow movers can be discounted and dead stock cleared.
15. **Sales-velocity forecast** — simple moving-average demand per product to plan the next purchase cycle.
16. **Stock-out history** — log when a product hit zero, to quantify lost-sale risk and improve reorder points.

## Valuation & finance
17. **Stock valuation report** — total inventory value at cost and at MRP, by division/category, for the balance sheet.
18. **Margin per batch** — purchase rate vs. selling rate per batch, surfacing true profitability including scheme goods.
19. **Free-goods / scheme stock tracking** — free units received and given tracked separately so they don't distort valuation.
20. **Purchase-price history** — trend of landed cost per product over time to spot supplier price creep.

## Operations & accuracy
21. **Physical stock-count / audit mode** — a guided count screen that compares counted vs. system quantity and posts the variance as an adjustment.
22. **Barcode / QR scan-in and scan-out** — phone-camera scanning to speed up inward and dispatch and cut keying errors.
23. **Stock reservation on draft orders** — soft-hold stock when an order is drafted so it isn't double-sold before dispatch.
24. **Damage / breakage register** — dedicated log with photo proof (reusing the delivery-proof upload pattern).
25. **Godown transfer challan** — printable transfer document when moving stock between locations.

## Reporting & sharing
26. **Stock statement PDF** — a clean, shareable batch-wise stock report (reusing the ledger/gallery PDF engine).
27. **Division-wise stock snapshot** — inventory grouped by product division, matching how the franchise is structured.
28. **Stock movement timeline** — per product, a chronological feed of every in/out/adjustment event.
29. **Party-wise dispatch history from stock** — link stock issued to the party and order it went to, closing the loop with the CRM.
30. **WhatsApp low-stock digest** — a scheduled daily/weekly message of items needing reorder, using the existing scheduled-task + share infrastructure.

---
*Suggested build order: start with 1, 2, 5, 6 (the ledger + inward/outward that everything else depends on), then 7–9 (expiry, the biggest pharma pain), then 12–14 (reordering), then valuation and reporting.*
