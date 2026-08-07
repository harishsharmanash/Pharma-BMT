# V7 Execution Plan — Bill-import review/edit, order editing, big bills, English UI, sorting everywhere

**Written 2026-07-20 by Opus (planning role). Implementing model: Sonnet — follow this
exactly; where something is genuinely ambiguous, stop and ask the user, don't invent.**

**Read first, in order:** `Files/ai-assistant-build-spec.md` (esp. the "Build status — V5"
and "Build status — V6" blocks near the bottom), `Files/ai-assistant-v5-bill-extraction-plan.md`,
`Files/ai-assistant-v6-order-ux-and-robust-import-plan.md`, and
`.claude/skills/leadenthrella-deploy/SKILL.md`.

Five independent parts (A–E) from live user testing of the V6 build. All are frontend-only
EXCEPT Part C, which is a **Worker `extract.ts` change** (deploy needed, but NOT the cached
`/chat` prefix — no cache-invalidation ritual). **Zero migrations** anywhere; if you find
yourself wanting one, stop and ask. Commit after each part; **push to origin yourself** per
the `feedback-github-push` memory (if the push fails on credentials, say so and leave the
commit local — the user pushes via GitHub Desktop as fallback).

Baseline: repo-wide `tsc --noEmit` sits at **132 pre-existing errors** (all stale generated
Supabase types, unrelated — confirmed via git-stash diff in V6). Every part must keep the
count at 132; no NEW errors.

---

## §0 Context — what V6 shipped and what the user found

V6 shipped: New Order dialog UX overhaul (creatable product combobox, wider, Add-row bottom-
left, left-aligned footer), Orders "Sort by", and AI-only bill import. The user's live testing
(screenshots) confirms bills now import (18-item and 10-item bills succeeded) and the AI-only
error toast fires correctly. Five follow-up issues:

1. **Manual bill import has no line-item review.** The import dialog's step-3 "preview" shows
   only an invoice-level summary (invoice no / date / party / item-count / total) then
   "Confirm & Import" saves directly — the rep can't see or approve the actual products/
   quantities/rates until AFTER saving, by going to the order detail page. They want the
   review to be the same nice New Order dialog (with editable line items) that V6 built.
2. **No way to edit an order after it's saved.** The order detail page (`orders.$id.tsx`) has
   PDF/JPG/Excel/WhatsApp/Duplicate/Cancel actions and an inline "Edit" for the *logistics*
   block only — but the line items / invoice fields themselves can't be edited.
3. **Big bills fail** ("AI couldn't read that bill clearly") once they exceed ~30–40 products.
   Must work for 150+ line items regardless of bill size.
4. **Hinglish in the UI looks unprofessional.** All hardcoded UI strings should be English.
   The AI co-worker must still ACCEPT Hinglish input and MAY still converse in Hinglish
   (its casual personality), but app chrome / functional feedback should read as English.
5. **Sorting is missing/inconsistent** on Parties, Products, Leads. They want the same
   Sort-by dropdown pattern as Orders (customized per section: at minimum newly-added,
   last-edited, plus section-relevant options).

---

## §1 Part A — Manual bill import routes into the New Order dialog for review + edit

**File:** `src/routes/orders.index.tsx` (`ImportDialog`, `OrdersPage`, `NewOrderDialog`).

**Root cause (confirmed):** `ImportDialog`'s step-3 render (currently ~line 1039+) is an
invoice-level summary table, and `confirmImport` saves all `previewInvoices` in bulk with no
line-item review. For AI-extracted bills we want the rep to land in the V6 New Order dialog,
prefilled, where they see every line item, edit anything, and hit Save.

**Behaviour:**
- **Single-invoice AI extraction (the common case):** after `/extract` returns exactly ONE
  invoice, do NOT go to the import dialog's step 3. Instead close the import dialog and open
  `NewOrderDialog` prefilled with that invoice — party, invoice no/date, and every line item
  (product fuzzy-matched to the catalog the same way V5's chat prefill does, off-catalog
  names kept as free-text `product_id: null`). The rep reviews/edits in the exact V6 UI and
  clicks Save Order. This reuses the screen they explicitly asked for.
  - **Party matching:** case-insensitively match `party_name` against existing parties;
    preselect if matched. If unmatched, leave the party field blank (the dialog already has a
    "+ new party" button, and prefilling the extracted name into that new-party dialog is a
    nice touch if easy — otherwise blank is fine, the rep picks/creates). Do NOT silently
    auto-create a party here — the review step is the point.
- **Multi-invoice AI extraction (rare — a scan with several bills):** keep the existing step-3
  bulk summary + "Confirm & Import" path unchanged (you can't review N orders in one dialog).
- **CSV / Excel / Word / HTML:** completely unchanged (mapping step 2 → summary step 3 → bulk
  `confirmImport`). This part touches ONLY the AI-extracted branch.

**Implementation sketch:**
- Lift a small piece of state to `OrdersPage`: e.g. `const [importPrefill, setImportPrefill]
  = useState<PrefillOrder | null>(null)`. Give `ImportDialog` an
  `onSingleInvoice(invoice: ExtractedInvoice)` callback prop.
- In `ImportDialog.handleFile`'s AI branch: when `invoices.length === 1`, call
  `onSingleInvoice(invoices[0])`, then close the import dialog and return (skip
  `setParsed`/`setStep`). When `invoices.length > 1`, keep today's `setParsed`/`setStep(3)`.
- `OrdersPage`: when `importPrefill` is set, open `<NewOrderDialog>` with a new optional prop
  `prefillOrder={importPrefill}` (clear it on dialog close). Prefer a direct prop over the
  V5 `sessionStorage` handoff here — the import dialog and New Order dialog are the same
  route, no navigation, so a prop is cleaner. (The V5 `ORDER_PREFILL_STORAGE_KEY` chat path
  stays as-is and independent.)
- `NewOrderDialog`: add `prefillOrder?: { party_name: string | null; invoice_no: string |
  null; invoice_date: string | null; items: ImportedLineItem[] }`. In a `useEffect` gated on
  `open && prefillOrder`, prefill `partyId` (matched), `invoiceNo`, `invoiceDate`, and
  `items` — reuse the exact item-mapping shape V5's `sessionStorage` reader already builds
  (`resolveProductMatches` for `product_id`, keep the bill's rate/qty numbers). Consume-once
  (clear via the `onOpenChange` handler in `OrdersPage`). Guard so it never collides with the
  `duplicateFromOrderId` or `defaultPartyId`/sessionStorage prefill effects.

**Acceptance (Part A):** upload a single-invoice bill → New Order dialog opens with party +
all line items filled and editable → edit one qty → Save → order appears correctly. Upload a
multi-invoice scan → step-3 summary still works. A CSV import → unchanged mapping→preview→import.

---

## §2 Part B — Edit an existing order from the order detail page

**Files:** `src/routes/orders.$id.tsx` (add Edit button), `src/routes/orders.index.tsx`
(`NewOrderDialog` gains an edit mode). **No DB change — `useSaveOrder` already supports it.**

**Key fact:** `useSaveOrder` (`use-orders.ts` ~line 247) already takes an optional `id`: when
present it UPDATEs the order row and replaces its `order_items` (delete + re-insert). So an
"edit" is just: open `NewOrderDialog` prefilled from the existing order, keep its `id`, and
pass that `id` to `save.mutateAsync`. The detail page already imports `NewOrderDialog` and
uses `duplicateFromOrderId={order.id}` for the Duplicate button — edit is the same prefill
minus the "reset invoice no/new order" semantics, plus writing back to the same id.

**Implementation:**
- `NewOrderDialog`: add `editOrderId?: string`. When set, prefill from that order (reuse the
  existing `duplicateFromOrderId` prefill query/effect — same `useOrder`/`useOrderItems`
  data), but ALSO prefill `invoiceNo` and `invoiceDate` from the order (the duplicate flow may
  intentionally blank/regenerate the invoice no — edit must preserve it), and in `submit()`
  pass `id: editOrderId` to `save.mutateAsync` so it updates in place. Dialog title becomes
  "Edit Order" when in edit mode. On success toast "Order updated".
  - The two modes are mutually exclusive: `editOrderId` (update in place) vs
    `duplicateFromOrderId` (create a new order from an existing one's contents). Make sure the
    prefill effect handles both without cross-firing.
- `orders.$id.tsx`: add an **Edit** button in the top action row (near Duplicate/Cancel,
  ~line 352). `<Button variant="outline" size="sm" onClick={() => setEditOpen(true)}><Pencil
  … />Edit</Button>` + `<NewOrderDialog open={editOpen} onOpenChange={setEditOpen}
  editOrderId={order.id} />`. (There's already a `dupOpen`/`<NewOrderDialog … dup>` pattern
  to mirror.) Consider hiding Edit for cancelled orders, or allow it — your call, but keep it
  simple; allowing it is fine.

**Acceptance (Part B):** open a saved order → Edit → change a line item's qty and the invoice
date → Save → detail page reflects the change, the invoice number is unchanged, and no
duplicate order was created.

---

## §3 Part C — Big bills (150+ line items) — Worker `extract.ts`

**File:** `acrowell-ai-worker/src/extract.ts`. Deploy with `npx wrangler deploy` after. This
is the standalone `/extract` module — it does NOT touch the cached `/chat` prompt, so **no
cache-invalidation ritual** and no `prompt.ts` change.

**Root cause (confirmed in code):** two hard caps truncate big bills:
1. `maxOutputTokens: 4096` (line ~162). A 150-item invoice's JSON is roughly 7,000–9,000
   output tokens (~50/item). At 4,096 the model's JSON gets cut off mid-array → invalid JSON
   → `JSON.parse` throws → `invoices: []` → the frontend's "AI couldn't read that bill"
   error. THIS is the primary cause.
2. `MAX_ITEMS_PER_INVOICE = 100` (line 95) silently drops everything past 100 items even when
   extraction succeeds.

**Fix:**
- Raise `maxOutputTokens` to the model's practical max. Start at **8192**; the plan's
  acceptance step tests a 150-item bill — if it still truncates, raise further (gemini-3.1-
  flash-lite supports well above 8192 for output; go as high as the API accepts, e.g. 16384/
  32768, verifying via a real large-bill curl). Note the value you landed on in the build-spec.
- Raise `MAX_ITEMS_PER_INVOICE` to **300** (and `MAX_INVOICES` is fine at 20; leave it).
- **Truncation-salvage parse (robustness, so arbitrarily huge bills degrade gracefully
  instead of failing outright):** structured output (`responseMimeType: application/json` +
  `responseSchema`) still emits *invalid* JSON if it hits the token ceiling mid-object. Wrap
  the `JSON.parse(textOut)` so that on failure it attempts a salvage: strip the trailing
  incomplete fragment and close the open brackets/arrays to recover the complete line-item
  objects generated before truncation (e.g. cut back to the last `}` that closes a full
  `line_items` element, then close the array/object). If salvage yields ≥1 line item, return
  those (the rep still reviews in the Part-A New Order dialog); only return `invoices: []` if
  even salvage finds nothing. This means a 200-item bill on a model capped below that still
  imports the first ~N items rather than erroring to zero.
- Keep everything else (auth, size cap, the sanitize/clamp of individual fields) as-is.

**Acceptance (Part C):** curl `/extract` (Supabase password-grant token + base64 file, the
same pattern used to test V5 Stage 1 — see that build-spec block) with a genuinely large bill
(the user can supply one, or synthesize a long test invoice). Confirm ≥100 line items come
back with valid, correctly-typed data. Record the item count and the final `maxOutputTokens`
value in the build-spec.

---

## §4 Part D — English-only UI; keep the co-worker's Hinglish conversation

**Files:** almost entirely `src/lib/use-assistant.ts` (72 Hinglish strings), plus one in
`src/routes/orders.index.tsx` (the `"AI se bill padh raha hoon…"` busyMsg from V5/V6), plus a
final sweep of any stragglers elsewhere. **No `prompt.ts` change → no cache ritual.**

**The rule (apply exactly):**
- **Convert to English:** every hardcoded, deterministic, client-rendered string that is app
  chrome or functional/transactional feedback. This includes:
  - The import `busyMsg` in `orders.index.tsx` → e.g. "Reading the bill with AI…".
  - In `use-assistant.ts`: all resolver "not found" messages ("Koi party nahi mila …" →
    "No party found matching …"), disambiguation titles ("Kaunsa? City ya firm batao …" →
    "Which one? Add a city or firm name (top 5 of N)"), the confirm-action summaries built in
    `summarizeAction`, status lines ("Opening order form for X…", "Isse form khol ke complete
    karo — neeche dekho" → "Finish this in the form below.", "WhatsApp par bhejein"/"Email
    karein"/"Download karein" channel labels), `ROLE_BLOCKED_MESSAGE`, report empty-state
    prompts ("Kaunsi party? Naam batao." → "Which party? Enter a name."), and any other
    hardcoded Hinglish transaction text.
  - Any `toast.*`, placeholder, label, button, or dialog copy elsewhere that's Hinglish.
- **KEEP Hinglish (the co-worker "conversing"):**
  - `SMALLTALK_REPLIES` (`use-assistant.ts` ~line 793) — the greeting/thanks/farewell/ack/
    praise/casual personality pools. This IS the co-worker's casual voice the user wants to
    keep. **Leave these Hinglish.** (If the user later says "make even these English," it's a
    one-line-per-pool change — but the instruction is to keep the co-worker conversing in
    Hinglish, and this is that.)
  - The Worker `prompt.ts` stays untouched: it already handles Hinglish INPUT (line 34 "Reps
    write … English, Hindi, or Hinglish"), and its `ask_clarification` examples produce
    Hinglish questions — the model's own generated conversation. Leave it; that's co-worker
    output, and touching prompt.ts would force a cache ritual for no UI benefit.
- **Decision flagged for the user:** the split above keeps ONLY smalltalk + model-generated
  clarifications in Hinglish; all deterministic functional chat feedback becomes English. If
  the user wants the functional chat feedback (e.g. "No party found") to ALSO stay Hinglish,
  that's a smaller edit — but this plan's default is English for everything deterministic, per
  "the ui should always show english."

**Acceptance (Part D):** grep the frontend for the Hinglish token set
(`nahi mila|padh raha|kar do|dikhao|bhejo|batao|kaunsa|naam se|kholo|karein|boliye|neeche
dekho|khaali`) and confirm the only remaining hits are inside `SMALLTALK_REPLIES`. Spot-check
live: a resolver miss, a disambiguation, a confirm card, and the import progress text all read
in English; a greeting ("hi") still gets a Hinglish smalltalk reply.

---

## §5 Part E — Sort-by dropdown on Parties, Products, Leads (match the Orders pattern)

**Files:** `src/routes/parties.index.tsx`, `src/routes/products.tsx`, `src/routes/leads.index.tsx`.
All three types carry `created_at` + `updated_at` (verified), so newly-added / last-edited
sorts are pure client-side, no query changes.

**Shared piece (recommended):** extract a tiny reusable component, e.g.
`src/components/sort-select.tsx`:
```tsx
export type SortOption<T extends string> = { value: T; label: string };
export function SortSelect<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: SortOption<T>[];
}) { /* the same <Select> block Orders uses, labelled "Sort by" */ }
```
Use it in all three pages (and optionally refactor Orders' inline version to it — nice-to-
have, not required). Apply the sort inside each page's existing `filtered`/list `useMemo`, on
a COPY of the array (never mutate the query-cache array). Keep a stable tiebreaker.

**Per-section options (customized, all client-side):**
- **Parties** (`parties.index.tsx`): today it has `sortByReorder` + `sortByDues` *checkboxes*
  (lines ~73–74) — fold these into ONE "Sort by" dropdown for consistency:
  - Firm name (A–Z)  ·  Newly added (`created_at` desc)  ·  Last edited (`updated_at` desc)  ·
    Highest dues first  ·  Reorder due first (the existing reorder ordering).
  Replace the two checkboxes with the dropdown (or, if you'd rather not disturb saved-view
  persistence, keep them but ALSO add the dropdown — however the user explicitly wants the
  dropdown pattern, so converting is preferred; migrate the persisted `sortByReorder/
  sortByDues` in `SAVED_FILTER_KEY` to a single `sortBy` value, defaulting sensibly).
- **Products** (`products.tsx`): today `sortBy` is only `"name" | "bestsellers"` (line ~101,
  Select at ~595). Expand to: Name (A–Z) · Best sellers (existing) · Newly added · Last edited
  · MRP (high→low) · On-hand stock (high→low, data already available via `onHand`). Keep the
  existing Select; just widen the union + options.
- **Leads** (`leads.index.tsx`): today has NO sort. Add a "Sort by" dropdown:
  Newly added (`created_at` desc, default) · Last edited (`updated_at` desc) · Name (A–Z) ·
  Next follow-up (soonest first) · Temperature (Hot→Cold). Use whatever fields the `Lead`
  type already exposes (`crm.ts`); don't invent fields.

**Acceptance (Part E):** on each of the three pages, the "Sort by" dropdown appears in the
filters area, every option reorders the list correctly, and existing filters/search still
work alongside it. Parties' old reorder/dues sorting still reachable via the dropdown.

---

## §6 Out of scope (explicit)
- Any `/chat` `prompt.ts` / vocabulary / cache change (Part C is the standalone `/extract`
  module; Part D is client strings only).
- Migrations (none needed anywhere).
- The full 608-row corpus re-run (still deferred, unrelated).
- Editing multiple invoices from one multi-invoice scan in the New Order dialog (Part A keeps
  the bulk-summary path for that rare case).
- Auto-creating catalog products from bill line items (off-catalog items stay free-text, as
  today).
