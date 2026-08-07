# AI Assistant V4 Execution Plan — Full-App Vocabulary + Multi-Step Plans

**Written 2026-07-19 by Fable (planning role). Implementing model: Sonnet — follow this
exactly; where something is genuinely ambiguous, stop and ask the user, don't invent.**

**Read first, in order:** `Files/ai-assistant-build-spec.md` (architecture authority —
especially §8 hard rules and the 2026-07-18 build-status blocks), the repo skill
`.claude/skills/leadenthrella-deploy/SKILL.md`, and `acrowell-ai-worker/test/corpus/README.md`
(the corpus harness — V4's acceptance gate).

**User decisions already made (do not re-ask):**
- Token budget: **target ~6,000 actual measured tokens, hard ceiling 6,500** for the
  cached prefix (STATIC_SYSTEM_PROMPT + FUNCTION_DECLARATIONS). The 6K budget was chosen
  over 4,500 deliberately — spend it on accuracy (keep enums schema-level, keep real
  descriptions on tricky actions, keep bug-fix examples), not on maximal compression.
- Staff/payroll module: **EXCLUDED** (user included it briefly, then reverted; the
  existing hard exclusion stands).
- Gap B option (b) (model-generated smalltalk prose): **declined** — do not build.
- Full-app coverage: user wants "every small to small step" reachable via chat. The
  three 2026-07-19 audit reports (see §2 source note) are the authoritative gap list.

---

## §0 Safety rules (inherited, non-negotiable)

Everything in build-spec §8 still stands: never touch GEMINI_API_KEY directly (it's a
write-only wrangler secret; test via the live Worker like a real user); Worker code
stays in `acrowell-ai-worker/` (not a git repo, deploys via `npx wrangler deploy`);
migrations run BY HAND by the user only (V4 needs ZERO migrations — every capability
maps to existing tables/hooks; if you find yourself wanting a migration, stop and ask);
never `git push` (user pushes via GitHub Desktop); every write action keeps a visible
confirm step; RLS is the security boundary — the Worker only translates NL→intent
JSON, ALL reads/writes happen in the frontend via the user's own supabase client;
payroll/staff, user management, company settings, backups, and ALL DELETES stay
excluded (soft *flag toggles* — cancel order, quarantine batch, star party, cheque
bounced — are allowed; they're reversible flags, not deletions; `manage_*` actions get
NO delete mode); TEST- prefix on any data created for testing, with a cleanup list
handed back; after ANY prompt.ts/declarations change: redeploy → delete KV key
`gemini:cache:name` → 3 consecutive live calls confirming `usage.cached > 0` and the
new expected token count → then acceptance-test. One stage at a time, build-status
block updated honestly in the build-spec after each stage, including deviations.

Budget/ops facts current as of 2026-07-19: Cloudflare account is on Workers Paid (KV
write quota no longer a constraint). Worker token budget is cost-weighted
(`weightedTokens()` in index.ts — cached×0.1). Working demo accounts (password
`Demo1234!`): admin/manager/rep@acrowell.test, test1/test2/test4/test5/test7@enthrella
(test3/test6 never authenticated — don't burn time on them). Message cap 400/day/account.

---

## §1 What V4 delivers

1. **Full-app action vocabulary** (§2): every capability found by the 2026-07-19
   audits becomes reachable, via ~19 new consolidated actions (+1 retirement), taking
   the vocabulary from 34 → ~52 actions.
2. **Multi-step plans** (§4): one message like "is bill se naya party banao, order
   start karo, aur ye rates unke negotiated rates me save kar do" produces an ordered
   multi-action plan, executed by the frontend with ONE combined confirm card and a
   live checklist. This is the co-worker feature.
3. **Compression pass** (§3): moderate, prescribed edits to keep the expanded prefix
   at ~6,000 tokens.
4. **Re-validation** (§6): full corpus re-run as the exit gate, since action names and
   rules change.

The screenshot bug that motivated this ("Who is our top-performing client?" →
confidently wrong `get_stats` answer) must be a named acceptance case: it becomes
`get_report(report="top_customers")`.

---

## §2 The V4 vocabulary

Source: three audit reports from 2026-07-19 (Leads/Parties/Dashboard: 36 raw gaps;
Products/Orders/Stock: 43; Transporters/Reporting/Notes: 26; overlapping). The
consolidation below covers every non-excluded item. If while implementing you find an
audit item that doesn't fit any action below, stop and flag it — don't silently drop
it or silently add a new action.

### 2a. Existing actions — kept as-is (33)

All current actions EXCEPT `share_invoice` (retired into `export_document`, §2c#12).
No renames, no merges of update_stage/update_temp or the get_X_details family — the
6K budget explicitly buys keeping these separate (they're corpus-validated).

Two small widenings (not new actions):
- `start_order` gains optional `repeat_last: boolean` — "sharma ka pichla order repeat
  karo" → opens the order form pre-filled from their last order (frontend: existing
  `?dup=` flow; find last order id for the party via `useLastOrderDates`/orders list).
- `get_stats` is unchanged, but the prompt must now say: for ranked/top/breakdown
  questions use `get_report`, get_stats is ONLY for single-number metrics. (This is
  the fix for the screenshot bug's misroute.)

### 2b. Frontend-only additions to existing actions

None — all other existing actions keep exact current behavior.

### 2c. New actions (19)

Args marked * are required. All `*_query` args follow the existing convention: copy
the user's words verbatim, app resolves. Role gating in §5.

1. **`get_report`** — the reporting mega-action. THE highest-value addition.
   - Args: `report`* (enum), `period` (enum: today|this_week|this_month|last_month|
     this_year|all_time; default sensible per report), `query` (free text — party for
     party_ledger, product for stock_movements, state/division for booked_territories),
     `limit` (number, default 5–10 per report).
   - `report` enum (17 values):
     `top_customers` (dashboard money.topCustomers), `top_products`
     (money.topProducts), `rep_leaderboard` (leaderboard.tsx computation),
     `sales_trend` (this-vs-last month + MoM %), `payment_mode_breakdown`,
     `leads_breakdown` (by state/source/outcome — computeCharts), `dues_aging`
     (usePartiesDuesAging buckets), `reorder_due` (useLastOrderDates/daysSince
     ranking), `priority_calls` (hot-warm.tsx Hot-then-Warm ranked list),
     `duplicate_leads` (dupSets logic), `booked_territories` (booked-areas.tsx +
     findMonopolyOverlap when query names a division/state/district),
     `expiring_documents` (useAllPartyDocuments), `upcoming_dates`
     (birthday/anniversary next 14d), `product_performance`
     (product-performance.tsx date-ranged qty/amount + trend), `expiring_stock`
     (expiryBucket summary), `stock_movements` (useStockMovements, per-product with
     query), `party_ledger` (opening balance/invoices/payments/running balance —
     needs `query`).
   - Frontend: each report renders as a compact card/list message reusing the page's
     own computation (import/extract the pure computation where possible rather than
     duplicating math — if a page computes inline, extract to a shared helper in the
     page's own file or `use-*.ts` and have both call it).
   - Manager/admin-only reports: `rep_leaderboard`, `payment_mode_breakdown` (others
     are role-safe: RLS narrows data, and money reads are already company-wide per
     §V2.0.6 precedent).
2. **`update_lead`** — edit core lead fields. Args: `lead_query`*, plus optional
   `name, firm_name, contact, area_city, state, source, product_interest`. Confirm
   card → existing LeadDialog prefilled (reuse the create_lead dialog-prefill
   pattern) OR direct patch with confirm; prefer dialog-prefill for consistency.
3. **`convert_lead_to_party`** — args: `lead_query`*. Frontend: leads.$id
   `handleConvert` logic (creates party linked via source_lead_id, marks lead Won).
   Confirm-gated.
4. **`manage_lead_products`** — lead product-interest lines. Args: `lead_query`*,
   `mode`* (enum: add|update|list), `product_query`, `qty`, `given_rate`,
   `expected_rate`. Hooks: useAddLeadProductInterest/useUpdateLeadProductInterest.
   THIS is the "Raman Ghosh interested in 6 products at these rates" capability — and
   in a multi-step plan, several `manage_lead_products(mode=add)` steps may follow one
   `create_lead`.
5. **`update_party`** — edit core party fields + flags. Args: `party_query`*, optional
   `firm_name, phone, email, city, state, address, gstin, drug_license, starred
   (boolean — covers star/unstar), assigned_rep_name (manager/admin-gated at FIELD
   level: frontend blocks this field for reps, other fields allowed)`. Hooks:
   useSaveParty, useToggleStarred, useAssignPartyRep (resolve rep by name from
   useProfiles).
6. **`save_party_rate`** — negotiated per-party product rate. Args: `party_query`*,
   `product_query`*, `rate`*, `notes`. Hook: useSavePartyRate (use-party-rates.ts).
   The bill-example capability.
7. **`manage_party_contact`** — args: `party_query`*, `mode`* (add|update|list),
   `name`, `phone`, `role`, `email`, `is_primary`. Hook: useSavePartyContact /
   usePartyContacts.
8. **`manage_party_document`** — args: `party_query`*, `mode`* (add|list),
   `doc_type`, `number`, `expiry_date`. mode=add opens the document dialog prefilled
   (file upload itself is UI — same pattern as photo→product image); mode=list renders
   the party's documents sorted by expiry. Hooks: useSavePartyDocument /
   usePartyDocuments.
9. **`update_product`** — full product edit beyond rates. Args: `product_query`*,
   optional `name, composition, pack, hsn, gst_pct, min_order_qty, reorder_level,
   division, category, notes, active (boolean)`. Dialog-prefill via ProductDialog
   (edit mode). division/category stay dynamic-vocab strings.
10. **`bulk_adjust_rates`** — args: `pct`* (signed number), `scope_query` (free text:
    division/category/name filter; empty = ask_clarification, never default to ALL
    without the user saying "sab/all"). Hook: products.tsx applyBulkAdjust. Confirm
    card MUST state the resolved product count ("Adjust rates +5% on 37 products?").
11. **`update_order`** — the order-write superset. Args: `order_query`*, optional
    `fulfillment_status` (Placed|Dispatched|Delivered), `cancelled` (boolean —
    cancel/reactivate), `draft` (boolean), `transporter_query`, `origin`,
    `destination`, `cartons`, `freight_amount`, `dispatch_date`, `expected_date`,
    `delivered_date`, `extend_days` (number — push expected_date back N days),
    `payment_status_flag` (enum: cheque_bounced|cheque_cleared — applies to the
    order's cheque payment via orders.$id logic). Hooks: useUpdateOrderLogistics,
    useSetOrderFlags, payment flag handlers. One action, many small verbs: "INV-2041
    dispatch ho gaya", "order cancel kar do", "delivery 3 din aage badhao".
12. **`export_document`** — generalizes and RETIRES `share_invoice`. Args: `doc`*
    (enum: invoice|party_statement|product_catalogue|rate_list|product_gallery|
    product_performance|leads_list|products_list), `format` (enum: pdf|excel|jpg;
    default pdf), `channel` (enum: whatsapp|email|download; default download),
    `query` (order for invoice, party for statement, filter text for lists),
    `period` (for product_performance). Frontend: route to the existing generators —
    invoice→orders.$id flows (keep the `?action=` deep-link mechanism, extend it),
    catalogue/rate_list/gallery/products_list→products.tsx exports,
    party_statement→parties.$id PDF, product_performance→its exportXlsx,
    leads_list→leads.index export. Reuse `shareFileSmart` for whatsapp/email.
    Validator maps old `share_invoice` shape → `export_document(doc=invoice)` for
    safety during transition.
13. **`send_reminder`** — dues reminder. Args: `party_query`*, `order_query`
    (optional specific invoice), `channel` (whatsapp|email; default whatsapp).
    Frontend: shareDues/duesMessage flow. Distinct from export_document because the
    payload is a reminder message, not a document.
14. **`record_purchase`** — goods-inward. Args: `supplier`*, `invoice_no`,
    `invoice_date`. Frontend: opens the stock purchase form prefilled (start_order
    pattern — NO line-item extraction from text; a bill PDF attached to the message
    may prefill more via the review UI later, but V4 keeps items in the form).
15. **`adjust_stock`** — stock-take correction. Args: `product_query`*, `new_qty`*,
    `batch_no`, `reason`. Hook: useAdjustBatch. Confirm card states old→new qty.
16. **`quarantine_stock`** — args: `product_query`*, `batch_no`*, `on`* (boolean).
    Hook: useQuarantineBatch.
17. **`manage_transporter`** — args: `mode`* (add|update), `transporter_query` (for
    update), `name`, `contact_person`, `phone`, `gstin`, `address`, `active`
    (boolean). Hook: useSaveTransporter.
18. **`save_transporter_rate`** — args: `transporter_query`*, `origin`*,
    `destination`*, `rate`*, `rate_type` (per_trip|per_carton). Hook:
    useSaveTransporterRate.
19. **`log_transporter_payment`** — args: `transporter_query`*, `amount` (required
    unless settle_all), `date`, `mode` (reuse payment_mode enum), `settle_all`
    (boolean — covers the SettleAllButton "pura hisaab clear kar do" flow; when true,
    amount is computed by the frontend from the statement and shown in the confirm).
    Hooks: useSaveTransporterPayment, transporters.$id settle logic.

Deliberately NOT actions (handled otherwise or excluded):
- Bulk imports (parties/products/orders/stock files) → `navigate_to` gains 4 new page
  values? NO — keep NAV_PAGES stable; instead app_help explains imports and
  `navigate_to(page=...)` covers reaching the pages. Rationale: imports are
  file-picker UI flows; a chat action adds nothing but tokens. If the user later
  wants "open the import dialog directly", add then.
- Saved filter views, invoice column preferences, Google-Maps directions link,
  copy-to-clipboard, notification list/read — LOW-VALUE UI conveniences; excluded
  from V4 to protect the token budget. Documented here so it's a decision, not a miss.
- All deletes (payments, contacts, documents, notes, products, orders, transporter
  payments/rates, lead product lines) — hard rule.
- Delivery-proof upload/view — file UI; reachable via navigate/order page.

### 2d. Expected count & shape

33 kept + 19 new = **52 actions**. New declarations must be written LEAN: no
description on self-evident args; one-line function descriptions ≤12 words except
get_report/update_order/export_document which may take 2 lines each.

---

## §3 Token budget: prescribed compression + measurement gate

Current measured prefix: **5,919 actual tokens** (34 actions). Naive addition would
blow past 8K, so Stage 1 applies these prescribed edits (in this order, measuring
after each group):

1. Retire share_invoice declaration + its prompt rule (−~110).
2. Strip arg descriptions that restate the arg name across ALL existing declarations
   (keep: date formats, phone format, query-verbatim notes, enum-selection notes)
   (−~350).
3. Shorten function descriptions >12 words where the name is self-evident (−~150).
4. Examples: 12 → 8. KEEP the lost_reason example, the multi-intent example, one
   photo/PDF example, one Hinglish create_lead, one clarification example. CUT
   examples that duplicate a rule already stated (−~180).
5. Merge overlapping rule text: the two missing-field passages, the two
   photo-related passages. Do NOT delete any rule that exists as a named bug fix
   (off-topic→unsupported, transporter-vs-party, dues-summary-vs-stats,
   call-recap→log_call, navigate-vs-list, code-injection, no-content) — tighten
   wording only (−~250).
6. Add new: 19 declarations (~1,450 lean) + new rules for get_report-vs-get_stats,
   export/send routing, plan protocol (§4), report enum guidance (~+350).

Projected landing: 5,919 −1,040 +1,800 ≈ **6,680 — above target**, so the budget gate
is: after Stage 1 code is written, MEASURE (deploy to the live worker, create cache,
read `usage.cached` off a real call — same ritual as always). If >6,500: first cut
arg descriptions on the NEW declarations harder, then compress get_report's enum
value names (e.g. `mom_trend` not `sales_trend_month_over_month`), then trim rules
prose again. Do NOT cut enum lists from schemas and do NOT drop bug-fix rules to make
budget — if you can't reach ≤6,500 without those, stop and report the real number to
the user with options.

Record the final measured number in the build-status block.

---

## §4 Multi-step plans (the co-worker feature)

**Mechanism: Gemini parallel function calls — no schema change.** Today gemini.ts
takes the FIRST functionCall part. V4: collect ALL functionCall parts from the
response, in order, as the plan.

Worker changes:
- `gemini.ts`: return `raws: {action, args}[]` (all functionCall parts, capped at 6 —
  truncate beyond and note truncation in the response).
- `validate.ts`: `postValidate` runs per step. If a step fails validation into
  ask_clarification, the WHOLE response becomes that single ask_clarification (the
  plan pauses before starting — simpler and safer than mid-plan questions in V4).
  Exception: if the invalid step is last, return the valid prefix + drop the tail
  only if the tail was `unsupported`; otherwise still clarify-first. Keep this rule
  simple; note deviations.
- `index.ts` response shape: `{ intent, intents, usage }` where `intents` is the full
  array and `intent` remains `intents[0]` for backward compatibility (the deployed
  frontend keeps working mid-rollout).
- Prompt addition (part of §3 budget): "If the message clearly requests MULTIPLE
  supported actions, emit one function call per action in execution order (max 6).
  Later steps referring to an entity created in an earlier step repeat the same
  name text in their query arg. A message asking for one thing = exactly one call, as
  before. Never pad; never split one action into steps."

Frontend executor (`use-assistant.ts` + `assistant-chat.tsx`):
- If `intents.length === 1`: exactly today's behavior.
- If >1: build a **PlanCard** message: numbered list of human summaries (reuse
  `summarizeAction`), ONE confirm/cancel pair. On confirm, execute steps
  SEQUENTIALLY through the existing per-action handlers (refactor handlers so each
  returns a promise + created-entity info; today's `confirmAction` largely does).
- **Plan entity chaining**: keep a per-plan map of entities created during execution
  (e.g. step 1 create_party → {type:'party', id, name}). Before each later step's
  resolver runs, check the map first: if the step's query text matches a created
  entity's name (same substring matching as the normal resolvers), use the created id
  directly. This makes "create party X, then start order for X" work without model-
  side ID plumbing.
- **Failure handling**: stop-on-first-failure. PlanCard updates each step to
  ✓ done / ✗ failed / ◦ skipped, with the failure reason on the failed step. Never
  auto-retry, never continue past a failure. Completed steps stay completed (no
  rollback — same as if the user had done them manually one by one).
- Steps that are dialog-prefill actions (create_lead/create_party/create_product/
  update_lead/update_product/record_purchase/manage_party_document(add)): a plan may
  contain AT MOST ONE dialog-opening step, and it must be the LAST step executed —
  if the model emits more than one, execute the first and mark the rest skipped with
  "ek baar mein ek form" note. (Dialogs are modal; stacking them is broken UX.)
  Navigation steps (start_order, navigate_to, export_document with download) also
  end the plan (they leave the chat context) — same last-step rule.
- History: record one compact assistant entry summarizing the plan and outcomes.

Acceptance examples (must all pass live):
- "naya party banao Ghosh Medical Agency Ahmedabad 9898... aur dolo 650 ka unka rate
  31 save karo" → plan: [create_party, save_party_rate] with chaining.
- "gupta ko 5000 cash mila aur unka followup kal laga do" → [log_payment,
  set_followup(lead-vs-party: log_payment on party; followup needs a LEAD — model
  should emit set_followup with query 'gupta'; if no lead matches, that step fails
  cleanly and says so)].
- "mehta ko won karo aur unka thank-you followup kal ka lagao" → [update_stage,
  set_followup].
- Single-action messages from the corpus MUST still produce single calls (spot-check
  20 corpus rows across categories — no plan-padding regressions).

---

## §5 Role gating (frontend soft-gate additions)

Extend `MANAGER_ONLY_ACTIONS` in use-assistant.ts with: `bulk_adjust_rates`,
`adjust_stock`, `quarantine_stock`, `record_purchase`, `manage_transporter`,
`save_transporter_rate`, `log_transporter_payment`, `update_product`. Field-level:
`update_party.assigned_rep_name` manager/admin only (block the field, allow the rest).
Report-level: `get_report` allowed for all, but `rep_leaderboard` and
`payment_mode_breakdown` manager/admin-only (return the standard Hinglish block
message for reps). Everything else: extract-always, app decides (role rule unchanged
— the model NEVER refuses on role grounds).

---

## §6 Staged rollout — each stage gates on its checks before the next starts

**Stage 1 — Vocabulary + reports (biggest value, mostly reads).**
Worker: full §2 vocabulary + §3 compression + §5 prompt-side notes. Frontend:
handlers for get_report (all 17), export_document, send_reminder, update_order,
start_order.repeat_last. Checks: token measurement gate (§3); cache ritual; a NEW
~40-case acceptance table covering every report value + export doc/channel combos +
update_order verbs + the screenshot bug case verbatim ("Who is our current
top-performing client?" → get_report top_customers); then FULL corpus re-run
(expect ≥ the 92–95% band; the harness's acceptableActions already reads Pass
Criteria text, but update the 3 share_invoice-era rows' expectations to
export_document). Fix real regressions before Stage 2.

**Stage 2 — Write-action gaps.**
Frontend handlers: update_lead, convert_lead_to_party, manage_lead_products,
update_party, save_party_rate, manage_party_contact, manage_party_document,
update_product, bulk_adjust_rates, record_purchase, adjust_stock, quarantine_stock,
manage_transporter, save_transporter_rate, log_transporter_payment. (Worker already
shipped these declarations in Stage 1 — Stage 2 is frontend-only, so no cache
invalidation.) Checks: per-action live acceptance (write each row BEFORE coding),
role-gate checks as rep + admin, TEST- prefixed data + cleanup list.

**Stage 3 — Multi-step plans (§4).**
Worker: parallel-call collection + prompt rule (cache ritual again). Frontend:
PlanCard + executor + chaining. Checks: the §4 acceptance examples live, plus the
20-row single-action no-padding spot-check, plus one full corpus category re-run
(Multi-intent — the 12 rows; the corpus expects ONE call on those rows, but V4
legitimately changes the contract: a plan emitting the requested read AND write is
now CORRECT. Score them manually against the new contract and record the deviation
in the build-status block rather than calling it a failure).

**Stage 4 — Docs + handoff.** Update build-spec build-status (final token count,
final action count, corpus numbers, deviations), corpus README, memory. Hand the
user: push list (leadenthrella files), cleanup list, and what remains open.

---

## §7 Out of scope for V4 (explicit, so nothing re-litigates silently)

Staff/payroll (user decision), Tier-2 analytical LLM loop ("compile sales data" style
narrative analysis — get_report covers the structured version; the LLM-written
analysis layer stays V3-Phase-8+), per-user memory (Phase 10), voice (Phase 12),
WhatsApp Business bridge, order line-item extraction from bills into saved orders
(review-in-form stays the rule), bulk-import chat actions, notification actions,
saved-view management, delivery-proof upload, all deletes.
