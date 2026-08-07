# V6 Execution Plan — New Order UX overhaul + robust AI bill import

**Written 2026-07-19 by Fable (planning role). Implementing model: Sonnet — follow this
exactly; where something is genuinely ambiguous, stop and ask the user, don't invent.**

**Read first, in order:** `Files/ai-assistant-build-spec.md` (esp. the "Build status — V5"
block near the bottom — V6 builds directly on the V5 `/extract` endpoint),
`Files/ai-assistant-v5-bill-extraction-plan.md`, and `.claude/skills/leadenthrella-deploy/SKILL.md`.

All V6 work is in the **leadenthrella** repo (frontend only). **Zero Worker changes, zero
prompt.ts changes, zero migrations.** The `/extract` endpoint already does everything the
backend needs — V6 is entirely about (a) how the New Order dialog looks/behaves and (b)
making the manual bill-import path actually USE `/extract` reliably instead of silently
falling back to the old regex parser. If you find yourself wanting a Worker or schema
change, STOP and ask.

Commit after each part; **push to origin yourself** (the user reversed the old
"GitHub-Desktop-only" rule on 2026-07-19 — see the `feedback-github-push` memory). If the
push fails on credentials, say so and leave the commits local — don't burn time on auth.

---

## §0 Context — what's already working (do not rebuild)

Screenshots from the user confirm V5 works end-to-end on the live preview: a bill attached
in chat → New Order opens with party + all line items filled → order saved (screenshots 1–2
show `TEST- Plan Resume Party` / INV-2026-003 with 2 correct line items and a saved
₹1,361.92 order). So the `/extract` Worker call, the sessionStorage handoff, and the
`NewOrderDialog` prefill are all sound. V6 does NOT touch that data flow — it changes the
dialog's *presentation* and fixes the *manual-import* entry point.

---

## §1 Part A — New Order dialog UI overhaul (`src/routes/orders.index.tsx`, `NewOrderDialog`)

Current code: dialog is `max-w-5xl`, the line-items `<Table>` is wrapped in
`overflow-x-auto` (forces left/right scroll), the product cell has a `<Select>` dropdown
PLUS an "or type" free-text `<Input>` stacked under it, the "+ Row" button sits top-right of
the "Line Items" header, and `<DialogFooter>` right-justifies Cancel / Save as draft / Save
Order. All of this changes.

### A1 — Product cell: one creatable search combobox, no "or type"
Replace the stacked `<Select>` + "or type" `<Input>` (current lines ~514–522) with a
SINGLE searchable, auto-suggesting combobox — the same feel as the app's global search
(`src/components/global-search.tsx`) and the existing `command.tsx` (cmdk is already a
dependency).

Build a small reusable component **`ProductCombobox`** (define it in `orders.index.tsx`
near `SummaryCell`, or a new `src/components/product-combobox.tsx` — your call, keep it
local to orders if unsure):
- Props: `products: Product[]`, `value: { product_id: string | null; product_name: string }`,
  `onPick: (p: Product) => void`, `onType: (name: string) => void`.
- UI: a `Popover` whose trigger is a button showing `value.product_name || "Pick product"`;
  the popover content is a cmdk `Command` with a `CommandInput` (the search box) and a
  filtered `CommandList` of products (show `p.name` + a muted `p.pack`/`p.composition`
  subtitle, like global-search rows). Filter case-insensitively on name/composition/pack
  (reuse the exact matching approach `resolveProductMatches` in `use-assistant.ts` uses —
  don't invent a new fuzzy matcher).
- **Creatable** (this is why "or type" can be removed WITHOUT losing capability): the
  `CommandInput`'s current text is always available. If the rep picks a catalog row →
  `onPick(product)` (binds `product_id` + autofills pack/hsn/mrp/rate/gst via the existing
  `pickProduct` logic). If the catalog has no match for what they typed → show a
  `CommandEmpty` row like **`Use "<typed text>" as a new product`** that, when clicked,
  calls `onType(typedText)` — setting `product_name` to the typed text and leaving
  `product_id = null` (a fully valid state the app already supports for off-catalog / bill-
  extracted items). This preserves free-text entry through the SAME single search bar.
- The trigger must display `value.product_name` even when `product_id` is null, so V5-
  prefilled off-catalog names (and any typed names) stay visible.
- Wire it into the row: `product_id`/`product_name` come from `it`; `onPick={(p) =>
  pickProduct(i, p.id)}`; `onType={(name) => updateItem(i, { product_id: null,
  product_name: name })}`.

### A2 — Full-width, no horizontal scroll on desktop
- Widen the dialog: change `DialogContent` from `max-w-5xl w-[95vw]` to something like
  `w-[95vw] max-w-[1400px]` (use the extra left/right space the user pointed out). Keep
  `max-h-[92vh] overflow-y-auto` (vertical scroll is fine).
- Remove the `overflow-x-auto` wrapper's horizontal scroll on desktop: keep the
  `overflow-x-auto` div ONLY as a mobile fallback (e.g. `className="overflow-x-auto
  md:overflow-visible rounded-md border"`), and shrink the per-cell input widths so all 11
  columns fit at ≥`md`. Concretely: drop the fixed `w-24`/`w-20`/`w-16` widths to
  responsive/smaller values (e.g. Pack/Batch/Expiry `w-full md:w-auto` with a sensible
  min; numeric cells narrower), and remove the `min-w-[220px]` on the Product head so the
  combobox trigger flexes. Target: on a 1280px+ desktop the whole row — Product, Pack,
  Batch, Expiry, Qty, Free, MRP, Rate, Disc%, GST%, Amount, delete — is visible with no
  horizontal scrollbar. Verify this live at desktop width (see §4).

### A3 — "+ Row" button: move to bottom-left, above the subtotal bar
- Remove the "+ Row" button from the "Line Items" header row (top-right, current line ~491).
- Add it as a left-aligned button DIRECTLY BELOW the table and ABOVE the Subtotal/Discount/
  GST/Total summary grid: `<div className="flex justify-start"><Button size="sm"
  variant="outline" onClick={() => setItems((p) => [...p, blankItem()])}><Plus … />Add
  row</Button></div>`. The "Line Items" header keeps just its `<Label>`.

### A4 — Footer buttons: left-aligned
- `<DialogFooter>` defaults to `sm:justify-end`. Left-align the three actions. Either
  override the footer with `className="sm:justify-start"` (shadcn DialogFooter accepts
  `className`) or replace it with a plain `<div className="flex justify-start gap-2 pt-2">`.
  Order stays Cancel / Save as draft / Save Order. No behavior change — layout only.

**Part A is layout + one new combobox. No data-flow, submit, prefill, or calculation logic
changes.** The V5 sessionStorage prefill, `recalc`, `submit`, negotiated-rate re-apply
effects all stay byte-for-byte as they are.

---

## §2 Part B — Orders list "Sort by" (`src/routes/orders.index.tsx`, `OrdersPage`)

The `Order` type already carries `invoice_date`, `total`, `created_at`, `updated_at`
(confirmed in `use-orders.ts`) — so all four sorts are pure client-side, no query change.

- Add a `sortBy` state (default `"date_desc"`) and a `<Select>` in the Filters card (next
  to the existing party/status/rep filters) with options:
  - **Invoice date (newest first)** → `invoice_date` desc  *(current default behavior)*
  - **Invoice date (oldest first)** → `invoice_date` asc
  - **Amount (high → low)** → `Number(total)` desc
  - **Amount (low → high)** → `Number(total)` asc
  - **Last edited** → `updated_at` desc
  - **Last uploaded / created** → `created_at` desc
- Apply the sort inside the existing `filtered` `useMemo` (sort a copy AFTER the current
  filter chain; don't mutate `orders`). Keep the existing `invoice_date desc, created_at
  desc` as the tiebreaker for the date sorts so behavior is stable.
- Label the control "Sort by". Match the existing filter `<Select>` styling.

---

## §3 Part C — Robust AI bill import (fix the "structured PDF → column-mapping tab" bug)

### C1 — Root cause (confirmed in code, not guessed)
The user uploaded `bill5_wide_shreebalaji.jpg` and got dumped into the column-mapping screen
with 49 garbage rows (samples like `invoice_no → "To"`, `party_name → "r 6"`,
`product_name → "Plot No."`). That screen is the OLD regex parser's output
(`import-orders.ts` `parseOrderLine`), reached via the fallback branch in `ImportDialog.
handleFile`. It means **AI `/extract` did NOT run (or returned nothing) and the code
silently fell back to the garbage parser**, which coincidentally emits the same 15 canonical
column names → lands on step 2 (mapping). The fallback is the bug.

Why `/extract` failed for this file (both are live in the current code):
1. **`downscaleImage` throws on files > 8MB** (`MAX_IMAGE_BYTES = 8*1024*1024` in
   `use-assistant.ts`). A phone photo of a wide bill easily exceeds 8MB → throw → caught by
   handleFile's inner `try/catch` → falls through to the regex parser.
2. **`downscaleImage` shrinks to `MAX_IMAGE_DIMENSION = 1024`px.** A dense, wide (landscape,
   many-column) invoice downscaled to 1024px loses text legibility → Gemini reads garbage or
   returns 0 invoices → 422 → falls through.

### C2 — The fix (this IS the user's "give the AI a form to fill" idea — already the
### architecture; `/extract`'s `responseSchema` is that form. The real fixes are input-prep
### quality + removing the silent garbage fallback.)

**C2a — A dedicated, higher-fidelity image prep for extraction.** Add a new exported
function in `use-assistant.ts`, e.g. `prepImageForExtraction(file: File)`, used by BOTH the
chat extraction path and the import path (replace the `downscaleImage` call in the import,
and in `send()`'s extraction trigger, with this):
- Raise the byte ceiling meaningfully (bills are the point of this feature). Accept up to
  ~20MB source; the Worker already caps the *base64* at 15MB, so target an OUTPUT that
  stays comfortably under that.
- Downscale documents far less aggressively: max dimension ~**2048px** (not 1024), JPEG
  quality ~0.85. A 2048px/0.85 JPEG of a full bill is typically 1–3MB base64 — well under
  the Worker cap — and keeps small print legible.
- PDFs still pass straight through untouched (as today) — no raster downscale.
- If the *source* file is still too large after this, scale down further to fit the byte
  budget rather than throwing (loop/estimate), so a big photo degrades gracefully instead of
  hard-failing into the regex parser.
- Keep the existing `downscaleImage` (1024px) for the NON-bill chat photo flows (visiting
  card → lead, medicine box → product) — those don't need document-grade resolution and the
  smaller payload is cheaper. Only the two *bill-extraction* call sites switch to the new
  higher-res prep.

**C2b — Import: AI-only for PDF/image, NEVER fall back to the regex parser.** In
`ImportDialog.handleFile`, for `application/pdf` or `image/*`:
- Call `/extract` (via the new prep). On success with ≥1 invoice → flatten to canonical rows
  and go STRAIGHT to preview (step 3) exactly as the current V5 code already does when it
  works. (This part is already written; keep it.)
- On ANY failure (network error, 422 no-invoices, empty result, no session): **do NOT fall
  through to `extractRecordsFromFile`/`parseOrderFromExtract`.** Instead show a clear toast —
  e.g. *"AI couldn't read that bill clearly. Try a sharper photo or a PDF, or add the order
  manually."* — and stay on step 1 (don't advance to mapping at all). The garbage-mapping
  experience must be impossible for a bill.
- **Retire the regex fallback for bills.** `parseOrderFromExtract`/`parseOrderLine` may stay
  in the file for now (dead-ish), but nothing in the PDF/image path should route to them.
  Leave the CSV/XLSX branches completely untouched (they're deterministic and correct).
- Word/HTML (`.doc/.docx/.html`) are rare and out of scope — leave them on the existing
  `extractRecordsFromFile` structured-table path unchanged (they legitimately need mapping).

**C2c — Rename the dialog + copy.** The dialog title is still "Import Excel / CSV" and the
drop-zone copy is Excel-centric, even though the primary use is now photographing/PDF-ing a
bill. Retitle to **"Upload a bill"** (or "Import a bill / sheet") and update the drop-zone
text to lead with "Photograph or PDF a distributor bill — AI reads the items automatically.
Excel/CSV also supported." Keep the "Source (remembers your mapping)" field visible only for
the CSV/XLSX path if easy; otherwise leaving it is acceptable (low priority).

### C3 — Multi-invoice + off-catalog (already handled, just verify)
`/extract` returns `invoices[]`; the existing flatten + `rowsToInvoices` grouping already
splits multiple invoices and the import's auto-create-missing-party logic already exists.
Off-catalog products import as free-text `product_name` with `product_id: null` (valid).
Just confirm these still work after C2 in the §4 acceptance.

---

## §4 Acceptance (Sonnet: do these, record results in the build-spec)

Frontend-only, so verify in the browser (local dev on :8080, or the Lovable preview). File-
upload can't be automated in this environment (documented limitation — every prior session
hit it), so these are the user-facing checks to run manually / describe precisely for the
user to confirm; do whatever CAN be automated (typecheck, the sort logic, the combobox
behavior via seeded state) and clearly mark what needs a human file-pick.

- **A (New Order UI):** open New Order on a ≥1280px desktop window. Confirm: single "Pick
  product" search per row (no "or type"), typing filters the catalog and picking autofills;
  typing an off-catalog name and choosing `Use "…" as new product` keeps it as free text;
  all 11 columns visible with NO horizontal scroll; "Add row" sits bottom-left above the
  subtotal; Cancel/Save-draft/Save-Order are left-aligned. Save a normal manual order to
  confirm nothing regressed.
- **B (Sort):** on Orders, exercise each Sort-by option and eyeball the order (date asc/desc,
  amount asc/desc, last edited, last uploaded).
- **C (Robust import):** upload each of the user's real files (`Demo Bill.pdf`, `Demo Bill
  jpg.jpeg`, `Invoice_INV_2026_003.pdf`, and the `bill5_wide_shreebalaji.jpg` that failed) via
  "Upload a bill". Each must go straight to a correct PREVIEW (never the mapping screen) with
  real line items. Deliberately upload a non-bill image (e.g. a random photo) and confirm the
  clean error toast + staying on step 1 (no garbage mapping). Confirm a normal CSV still
  works via the unchanged path.
- **Typecheck** the repo (`npx tsc --noEmit`) — must stay at the pre-existing 119-error
  baseline (all pre-existing, unrelated — stale generated Supabase types); no NEW errors.

## §5 Out of scope (explicit)
- Any Worker/`/extract`/prompt.ts change (the endpoint already extracts correctly — proven
  in V5 Stage 1 curl tests; C's failures are frontend input-prep + fallback bugs).
- Auto-creating catalog products from bill line items (a bill item stays free-text if not in
  catalog — same as today; a separate future feature).
- Word/HTML import redesign, the CSV/XLSX mapping flow (untouched, works).
- Migrations (none needed).
