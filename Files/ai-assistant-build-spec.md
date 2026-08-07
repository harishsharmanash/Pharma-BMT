# Acrowell CRM — AI Chat Assistant: Build Specification v1

**Audience:** This document is the single source of truth for building the AI assistant.
The implementing model (Sonnet) must follow it exactly. Where this spec gives verbatim
code/JSON/prompts, copy them verbatim. Where something is genuinely ambiguous, stop and
ask the user rather than inventing.

**Read first:** `.claude/skills/leadenthrella-deploy/SKILL.md` in the repo. Its rules
apply everywhere below (migrations are run BY HAND, edge functions are NOT used, types
are added as optional, secrets never go in the repo).

---

---

## ✅ BUILD STATUS (2026-07-25, Claude) — V3 Phases 10, 11, 12: ALL SHIPPED & LIVE-VERIFIED

**Phase 10 (memory)** and **Phase 11 (daily digest)** were verified live by Harish (memory saved/recalled, brain-icon panel lists + deletes, digest fires). **Phase 12** (TTS read-back, up to 4 images/message) shipped but is NOT yet live-verified.

Details, decisions and gotchas for all three are recorded in the project-root `CLAUDE.md` §8 — including why the digest is deterministic SQL rather than the cron+Batch-API design this spec originally called for (pull-generation costs nothing for users who never log in, and every digest fact is a plain query, so an LLM between the user and their rupee figures adds cost and hallucination risk for no information gain).

**Tier-1 prompt fixes (25 Jul, worker `3df1916d`)**, three of which came from the corpus run: ranking/superlative questions may never route to `ask_clarification`; `plan` is ONLY for 2+ independent WRITES (a read+write pair, or two reads, is ONE action — the failing cases were "gupta se 5000 aaya entry karo aur batao ab kitna bacha", "dolo ka stock batao aur 50 strip sharma ko issue karo", "mere leads dikhao aur batao kitne won hue"); punctuation-only input ("???") is not smalltalk; "kahan hai / kaise" is `app_help` even when the feature is unavailable.

### ✅ GAP A CLOSED — Vision/PDF rows now tested automatically (25 Jul 2026)

`test/corpus/run-vision.mjs` runs the 20 Vision/PDF Orders rows that `run.ts` has always
skipped. Each row names its file inline (`"...bana do [bill_krishna_traders.pdf]"`), so the
runner strips the marker, loads the file from `Files/stress-test-assets/`, and posts it as a
real attachment via the Worker's `images[]` field. Same scoring as run.ts; output tees to
`results-vision-<timestamp>.txt`. 18 of 20 are runnable (ST-0353 names no file; ST-0355 wants
a `med_box_photo` that does not exist — a real medicine-box photo would enable it).

**Runs: 8/18 (44.4%) → 17/18 (94.4%) after the prompt fix below → 19/20 (95.0%) once all
20 rows became runnable.** Only ST-0353 still fails (see below).

All 20 now run. Two were previously unrunnable for different reasons:
- **ST-0353 was a HARNESS bug, not a missing file** — its marker sits at the START of the
  message (`"[card_dr_rajesh_mehta.pdf] ye kaun hai"`) and the runner only matched a
  trailing bracket, so a file that existed all along was reported as "no file named".
- **ST-0355** names a bare `med_box_photo` placeholder; `ASSET_ALIASES` in the runner maps it
  to a real product photo (Fruiter Syrup 200 mL — deliberately a NON-catalogue product so
  `create_product` is tested on something genuinely new).

> **ROOT CAUSE — the prompt was ordering the bad behaviour.** The Photo/PDF rule read
> `"stock add karo" ⇒ add_stock (one call per row)`. So a 12-row bill became 12 actions,
> which the model correctly expressed as a `plan` — and every "add this bill to stock" row
> failed. It was not a model error; it was following instructions. Now: **ONE call for the
> whole bill**, the app reads every row from the document itself.
> This also explains why the earlier "plan is only for 2+ independent WRITES" fix did not
> help these rows — under the old wording 12 stock rows genuinely *were* 12 writes.
> Same edit added: a bill + "order bana do" ⇒ `start_order` (not `create_party` first), and a
> second instruction that is merely a FIELD on the first action's form (`"lead banao aur
> followup bhi kal ka"`) ⇒ one `create_lead`, not a plan.

**Also fixed in the same edit:** the Tier-1 prompt opened "the action-extraction engine inside
**Acrowell CRM**" — the same brand leak found in the Tier-2 prompt earlier that day. Now
"Cerebyl". Zero `Acrowell CRM` references remain in either prompt.

**ST-0587 RESOLVED — the app was right, the test was wrong.** `useCreatePurchase`
(`use-stock.ts:374`) inserts the purchase, inserts `purchase_items`, then calls `addStock`
per item with an inward movement referencing the purchase — i.e. `record_purchase` already
does BOTH. Plain `add_stock` would add stock without recording the purchase, which is worse.
Harish confirmed both must happen, so the corpus expectation was corrected to
`record_purchase`. NOTE: `corpus.json` is exported from `Files/AI_Stress_Test_Corpus.xlsx`
— re-apply this edit if it is ever re-exported.

**Still open:** ST-0353 (`"[card] ye kaun hai"`) expects `create_lead`, returns
`search_leads`. Arguable: "who is this" reads as a lookup, but the card's person is almost
never already in the system, so searching returns nothing and the rep needs a second step.
Awaiting a product decision — not yet 'fixed' either way.

### ⚠️ Corpus run 2026-07-25 — INCOMPLETE RESULT, do not cite as a pass
588 of 608 rows attempted (20 Vision/PDF rows excluded by the harness — they need real attachments; still "Gap A", never automated in any run). The run reached the final row with real responses, but **the printed summary scrolled out of the terminal before it was read** — intent accuracy, refusal correctness and JSON validity are all UNKNOWN for this run. The three prompt fixes above were deployed AFTER it, so they are unverified.

Two harness limitations that make its score structurally pessimistic, worth knowing before anyone "fixes" the prompt to chase it:
1. **No conversation history** — `run.ts` sends a single message per row. Every Corrections/Contradictions row ("gupta nahi garg likhna tha payment mein", "won nahi yaar lost ho gaya wo lead") refers to a turn that is never sent, so `ask_clarification` is arguably the CORRECT answer and those rows cannot pass by construction.
2. **`role: "admin"` is hardcoded** for every row, so role-gating (reps seeing only their own data, stock being manager/admin-only) is never exercised.

`test/corpus/run-with-login.mjs` now signs in from `CORPUS_EMAILS`/`CORPUS_PASSWORD` and tees output to `results-<timestamp>.txt`, so a run's summary can no longer be lost.

## ✅ BUILD STATUS (2026-07-25, Claude) — V3 Phase 9 analytics brain: BUILT & DEPLOYED, awaiting live verification

Frontend (`leadenthrella`, commits `c7285e8`, `9becf2c`, `4a18ffb`, deployed to worker
`leadenthrella` and verified live — all 45 asset hashes on app.cerebyl.com match the local
build): `ChartSpec` type + `chartSpec` message kind; recharts render branch in
`src/components/ceremate/message-bubble.tsx` reusing the shared chart style helpers;
`src/lib/export-csv.ts` (`downloadCsv`, XLSX → sheet_to_csv idiom lifted from
`leads.index.tsx`) wired as an Export CSV button on `reportCard`/`duesCard`/`orderList`/
`chartSpec`. **Chart types are `bar | horizontalBar | line` only — no pie type exists**, per
the standing product rule.

Chart transport: the analyst appends ONE fenced ` ```chart ` JSON block at the end of its
prose; `parseChartBlock`/`stripChartBlock` in `use-assistant.ts` extract it at stream-settle,
emit a separate persisted `chartSpec` bubble, and hide the block mid-stream so raw JSON is
never shown. Chosen over a 7th `render_chart` tool because a tool call costs an extra Gemini
round-trip per chart and loop latency is already the known rough edge. Malformed blocks are
dropped (prose still renders) — a bad generation degrades to plain text, never an error. A
series named `"name"` is renamed, since that key carries the axis labels.

Worker (`acrowell-ai-worker`, deployed version `81b9d587`): `prompt-tier2.ts` gains an
"Analysis depth" section (period-over-period with absolute + percentage change, top-3/5 with
share-of-total, one actionable observation) and a "Charts" section defining the block schema
and when NOT to chart. **Also fixed a brand regression in the same edit** — the system prompt
opened "You are Ceremate, the business analyst inside **Acrowell CRM**", which is user-facing
model output and violates the never-surface-Acrowell rule; now "inside Cerebyl". Folded into
the same change so only one cache re-verification is needed.

🐛 **BUG FOUND & FIXED DURING PHASE 9 VERIFICATION (25 Jul, worker `0a6a8b62`, commit `2a944dd`).**
First live test returned *"I pulled a lot of data but couldn't finish the answer — try asking a
narrower question."* Root cause was **not** Phase 9: the Phase 8 loop driver reassigned
`toolResults` each step and posted only the latest batch, so `buildAutoContents` replayed a
single round. By round 3, round 1's data was gone; the model kept re-fetching to fill the gap
and always burned the 4-step cap. Any question needing more than one round could never
converge. Phase 8 passed verification only because its acceptance questions were all
single-round; Phase 9's "Analysis depth" prompt asks for period-over-period comparisons, which
need multiple rounds, so it surfaced on the first try.

Fix: the frontend accumulates rounds and sends `toolRounds` (oldest first); `buildAutoContents`
replays **each round as its own model/user turn pair**, so Gemini's call/response pairing and
every part's `thought_signature` stay intact — flattening rounds into one pair would break both.
Worker caps at the last 4 rounds × 6 results, dropping oldest first. The legacy flat
`toolResults` field is still accepted as a single round so browsers on a cached older bundle
keep working.
> **Lesson for future phases:** a loop feature verified only on single-round questions is not
> verified. Any acceptance set for the Tier-2 loop must include at least one question that
> genuinely requires two or more tool rounds.

⚠️ **CACHE PURGE — RESOLVED, no action needed.** The `gemini:cache2:name` key was checked on
25 Jul and returned 404: the entry had already lapsed on its own 1-hour TTL, so `cache.ts`
rebuilds it from the current prompt on the next `/analyze` call. The purge command below is
kept only for the next time a prompt changes inside a live TTL window.

⚠️ **ORIGINAL PURGE NOTE (still true whenever a prompt changes).** `cache.ts` keys the Gemini cache by a fixed KV key, not a
prompt hash, so slot 2 serves the OLD prompt until the 1-hour TTL expires. The purge command
(`wrangler kv key delete "gemini:cache2:name" --namespace-id 302493f121a0412484ac8322515ffa85
--remote`) was blocked by this environment's permission layer — Harish to run it, or wait out
the TTL. **Do not conclude the chart feature is broken before the cache turns over.**

LIVE VERIFICATION PENDING (needs Harish's login): the spec's acceptance utterance
"last 3 months collection trend dikha do" → chart bubble + 2-line prose insight; CSV export
downloads on all four bubble kinds; no chart for single-number answers.

Pre-existing, NOT caused by this work: `test/index.spec.ts` holds the untouched Cloudflare
scaffold tests asserting a "Hello World!" body — they cannot pass against a worker that only
handles POST /chat|/extract|/analyze, and have been failing since long before Phase 9.

## ✅ BUILD STATUS (2026-07-24, Kimi) — V3 Phase 8 conversational core: BUILT, awaiting live verification

Tier-2 agentic loop shipped end-to-end. Worker `acrowell-ai-worker`: new `/analyze` endpoint
(mode AUTO, second Gemini cache `gemini:cache2:name`, SSE prose streaming vs JSON
`{toolRequests, usage}` content-negotiated, same auth/KV budgets as /chat); `prompt-tier2.ts`
(CONVERSATIONAL_SYSTEM_PROMPT + 6 read-tool declarations); `analyze(question)` added to Tier-1
routing (declaration + one prompt rule; both KV cache keys purged post-deploy). Frontend
`use-assistant.ts`: `analyze` intent → loop driver (≤4 tool steps, 6K-char truncation per tool
result), 6 whitelisted aggregate executors (no raw rows; `get_stock_snapshot` rep-refused),
streaming bubble (`streamingText` kind → settles to `text`), `assistant_usage` logging
(`analyze` + `snapshot:<tool>`), loop transcripts excluded from history. Worker gemini.ts
`coerceResponse` parses string toolResults back to objects (Gemini requires object
functionResponse). Known scope note: `get_orders_summary` group_by product/division uses the
all-time productSales aggregate (line items not in assistant scope; note field flags it).
LIVE VERIFICATION PENDING (needs Harish's login): 3 acceptance utterances, assistant_usage
rows, cachedContentTokenCount ≥90% on both caches, writes still confirm-gated, rep stock refusal.

## ⏭️ RESUME HERE (2026-07-20, latest) — NEW WORK ORDER: `Files/ai-assistant-v7-import-review-edit-i18n-sort-plan.md`

**The current work order is V7** — five parts from the user's live V6 testing:
(A) manual bill import routes single-invoice AI extractions into the V6 New Order dialog for
line-item review+edit before saving (currently it only shows an invoice-level summary then
saves blind); (B) add an Edit button to the order detail page — `useSaveOrder` already supports
update-in-place via an optional `id`, so `NewOrderDialog` just needs an `editOrderId` mode;
(C) fix big bills (150+ items) failing — Worker `extract.ts` caps `maxOutputTokens: 4096` (too
low, truncates → invalid JSON → "AI couldn't read that bill") and `MAX_ITEMS_PER_INVOICE: 100`;
raise both + add truncation-salvage parse (standalone /extract module, deploy only, NO cache
ritual); (D) convert all hardcoded Hinglish UI strings to English (72 in use-assistant.ts + 1
in orders.index.tsx) while KEEPING the co-worker's Hinglish personality (SMALLTALK_REPLIES +
model-generated clarifications; prompt.ts untouched so no cache ritual); (E) add the Orders-
style "Sort by" dropdown to Parties/Products/Leads (all have created_at/updated_at; client-
side; recommend a shared SortSelect component). Frontend-only except Part C (Worker deploy).
Zero migrations. Full analysis + exact file/line refs in the V7 plan. Everything below this
paragraph is V6-and-earlier history.

<details><summary>Previous pointer (V6 — BUILT 2026-07-20)</summary>

**`Files/ai-assistant-v6-order-ux-and-robust-import-plan.md`** (New Order dialog UX overhaul
+ Orders sort + robust AI bill import) is BUILT — all 3 parts, live-verified in the browser.
See the "Build status — V6" block near the bottom of this file for exact acceptance detail,
including a real bug found and fixed DURING this session's own verification (not by the
user): the new product combobox's dropdown is portaled to `document.body` to escape a
clipping ancestor (shadcn's `<Table>` hardcodes an `overflow-auto` wrapper div), which meant
clicking a suggestion no longer registered as "inside" the click-outside-to-close detector —
every pick silently failed. Fixed by also tracking the portaled dropdown's own ref. Everything
below this paragraph is V5-and-earlier history.
</details>

<details><summary>Previous pointer (V5 — AI bill extraction, BUILT 2026-07-19)</summary>

**`Files/ai-assistant-v5-bill-extraction-plan.md`** (AI bill extraction: new Worker
`/extract` endpoint wired into the assistant's start_order flow, the create-party→
first-order plan chain, and the Orders manual import) is BUILT — all 3 stages. See
the "Build status — V5" block near the bottom of this file for exactly what shipped,
what was live-verified vs. verified-by-inspection-only. **UPDATE (from the user's V6
screenshots): Stage 2 chat prefill is now CONFIRMED working live** (screenshots show a
bill attached in chat → New Order opened with all line items filled → order saved). The
remaining Stage-3 manual-import gap is exactly what V6 Part C fixes.
</details>

<details><summary>Previous pointer (V4, built 2026-07-19 — kept for history)</summary>

**`Files/ai-assistant-v4-execution-plan.md`** (V4: full-app action vocabulary redesign,
`get_report` mega-action, multi-step plan executor) is BUILT (all 4 stages) as of
2026-07-19 — see the "Build status — V4" and "Targeted acceptance pass" blocks near
the bottom of this file for exactly what shipped, what was live-tested, and what
deviated (measured 8,637 tokens vs the 6K target/6.5K ceiling — accepted tradeoff).
A targeted acceptance pass (all 16 report types, manager-only gating, 4 write actions,
one plan with a dialog-handoff step, `share_invoice` classification) found no real
failures — only cosmetic nits, one pre-existing stale-catalog-name limitation, one
narrow `share_invoice` phrasing gap, and one leftover ₹99 test rate on Shree Balaji
Pharma Distributors needing manual removal. **Still NOT done: the full 608-row corpus
re-run** against the V4 vocabulary — explicitly out of scope for the acceptance pass,
deliberately not started. Read the two blocks near the bottom before doing more work
here. The 2026-07-18 handoff (`Files/handoff.md`) and the corpus/W4B/W4C work below it
are DONE — see the build-status blocks further down for what shipped.
</details>

<details><summary>Previous pointer (2026-07-18 handoff, completed)</summary>

Read `Files/handoff.md` in full. It reframed the assistant as a co-work partner and
pointed at the 608-row stress-test corpus. That work completed 2026-07-18: corpus
harness built and run, 6 real defects fixed and verified, Gap A (PDF), Gap B
(smalltalk subtypes), Gap C (corrections) all closed, W4B/W4C shipped.
</details>

<details><summary>Original W1–W4 pointer (superseded, kept for history)</summary>

Read `Files/ai-assistant-v3-execution-plan.md` and execute its workstreams in order
(W1 Hardening → W2 Phase 7 features → W3 model bake-off → W4 full end-to-end test
pass). That file is the approved work order; this spec stays the architecture
authority. Status: v1 + V2 Phases 4–6 are live and role-tested (2026-07-18); the CORS
fix below is DONE and verified; known open items are listed in the execution plan
(history-contamination bug, uncommitted >5-matches fix in use-assistant.ts, photo
flows never tested with real images). User approvals for V3 are recorded in §V3.4.
</details>

--- (historical context below: the 2026-07-16 CORS incident, resolved) ---

Context: v1 (Phases 0–3) is fully built, the code is pushed to GitHub (working tree clean,
in sync with origin/main), the `assistant_usage` migration has been run by hand, and the
Lovable app is live. BUT the assistant currently fails in the LIVE app with "Couldn't
reach the assistant. Check your connection and try again." on every message.

**Root cause (already diagnosed, confirmed by curl — not a guess):** a CORS origin
mismatch. The published app is served from `https://leadenthrella.lovable.app` (HTTP 200),
but the Worker's `ALLOWED_ORIGINS` only lists `https://preview--leadenthrella.lovable.app`
+ the two localhosts. So the browser's CORS preflight from the published domain gets no
`access-control-allow-origin` header back, the `fetch()` throws, and the frontend shows its
generic catch-block message. The Worker itself is healthy (returns 401 without a token as
designed); the frontend's `ASSISTANT_URL` constant is correct; Supabase auth is fine. This
is why it worked on localhost:8080 in testing but fails on the live site.

**THE FIX (do this, then verify, then proceed to V2):**
1. In `acrowell-ai-worker/src/index.ts`, change the origin check inside `corsHeaders()`
   from exact-list membership to: allow if the origin is in the explicit list OR the origin
   ends with `.lovable.app` over https (e.g. `origin.startsWith("https://") &&
   new URL(origin).hostname.endsWith(".lovable.app")`). Keep the explicit list too (it holds
   the localhost dev origins and is where real company custom domains get added later). This
   suffix approach covers preview + published + any future branch-preview URL so this class
   of error can't recur. Reflect the matched origin back in `Access-Control-Allow-Origin`
   (do NOT use `*` — credentials/authorization headers require an explicit origin echo).
   SECURITY NOTE: this is safe. CORS is not the security boundary — the Worker still 401s
   any request lacking a valid Supabase JWT for THIS project (crzddmxogxhirzqkrgwb). Origin
   matching only controls which browser pages may read the response.
2. Redeploy: `cd acrowell-ai-worker && npx wrangler deploy` (needs the sandbox-disabled
   bash flag, as in every prior deploy this project). This is a Worker-side change deployed
   directly via wrangler — NOT a GitHub push, NOT a Lovable rebuild. Takes effect in seconds.
   No frontend change and no repo push is needed for this fix.
3. Verify with a preflight from the published origin — it must now echo the header:
   `curl -s -i -X OPTIONS "https://acrowell-ai-worker.icy-sunset-05b0.workers.dev/chat"
   -H "Origin: https://leadenthrella.lovable.app" -H "Access-Control-Request-Method: POST"
   | grep -i "access-control-allow-origin"` — expect the origin echoed back.
4. Ask the user to send a message in the LIVE app and confirm it works end-to-end.
5. ONLY-IF-STILL-BROKEN fallback suspects (unlikely; diagnose from the real browser console
   error, not the app's generic message): (a) a Lovable page CSP `connect-src` blocking
   `*.workers.dev`; (b) a browser ad-blocker/extension blocking `workers.dev`.

After this fix is verified working live, proceed to the V2 roadmap (Phases 4–7) at the
bottom of this file, starting with Phase 4.

---

**Build status (2026-07-18): V3 execution-plan Workstream 1 (Hardening) — DONE, deployed
to the live Worker, verified via direct authenticated calls (dev server session; UI
login form didn't respond to automated clicks this session — worked around by setting
the Supabase session directly via a real password-grant call, which is a test-tooling
issue, not an app bug, and is not a code change).**

Changes (`acrowell-ai-worker/src/`):
- `gemini.ts`: `maxOutputTokens: 1024` added to both generationConfig blocks (inline and
  cached-content paths).
- `index.ts`: current user message now truncated server-side to 2000 chars (previously
  only history turns were capped) — verified: a message with the extractable content
  placed past char 2000 correctly produced `unsupported`, proving truncation is real,
  not just present in code. Added a per-user daily TOKEN budget (`t:<uuid>:<date>` KV
  key, cap 500,000/day, checked before the Gemini call and incremented after from real
  usage via `ctx.waitUntil`) alongside the existing 400-message/day cap — verified the
  KV key accumulates real token counts after live calls. KV read-then-write race
  accepted for both counters per the plan; a Durable Object counter is explicitly
  deferred, not built.
- `prompt.ts`: added a rule — "Resolve ONLY the latest user message... unless the
  latest message explicitly refers back" (isme/uska/wahi/same). Cache re-verified after
  this change (stale KV cache key deleted, redeployed, `usage.cached` = 4,668/4,701
  input tokens ≈ 99.3% across 3 consecutive live calls — prefix is healthy, well under
  the 8K budget).

Changes (`leadenthrella/src/lib/use-assistant.ts`):
- **Root cause found for the 2026-07-18 history-contamination bug**: `send()` always
  records the user's turn into `historyRef`, but four resolver helpers
  (`resolvePartyAndAct`, `resolveProductAndAct`, `resolvePartyForWrite`,
  `resolveProductForWrite`) plus the `get_order_status`/`start_order` branches recorded
  NO matching assistant turn — so `historyRef` could contain consecutive user-role
  entries with no paired assistant turn, breaking strict alternation in what gets sent
  to Gemini. Fixed: every branch of all four resolvers, plus `get_order_status` and
  `start_order`, now calls `recordHistory("assistant", ...)` with a concise marker of
  what was resolved (e.g. `"resolved party: <firm_name>"`, `"too many products matched
  ...\"`).
- The pending >5-matches resolver fix (done 2026-07-18, previously uncommitted) ships
  as part of this same diff — **still uncommitted, needs push via GitHub Desktop.**

**Verification performed (live, via direct authenticated Worker calls simulating the
real request shape):**
- History-contamination repro #1 (product lookup → unrelated party-dues follow-up):
  now correctly returns `get_party_dues`, not the stale `get_product_details`.
- Explicit back-reference ("usi party ka phone number bhi do") still correctly resolves
  to the earlier entity — confirms the fix isn't over-corrected.
- All 7 of the original v1 §5 regression utterances re-run and pass. One benign
  behavior drift noted: "mehta ko lost kar do" (no reason stated) now returns
  `ask_clarification` asking for the reason, instead of the old example's direct
  `update_stage(lost_reason=null)` — both are correct under the "never invent
  lost_reason" invariant; this is not a regression, just the model choosing to ask
  instead of proceeding with null. Not touched further.

**Still needs the user:** push `gemini.ts`/`index.ts`/`prompt.ts` (Worker, already live —
these are informational only, the Worker isn't in a git repo) and
`src/lib/use-assistant.ts` (leadenthrella repo — this one DOES need a GitHub
Desktop push + Lovable publish) to reach the live site. Until pushed, the live site
still has the >5-matches bug and the history-contamination bug; the Worker-side fixes
(prompt rule, token budget, truncation, maxOutputTokens) are already live regardless of
the frontend push since the Worker deploys independently.

---

**Build status (2026-07-18, same session): V3 execution-plan Workstream 2 (Phase 7
pending features) — DONE, deployed, verified live as both admin and rep.**

Added (`acrowell-ai-worker/src/prompt.ts` + `validate.ts`): `navigate_to(page)` — static
12-value enum (leads/parties/orders/products/stock/followups/my_day/dashboard/
transporters/team/settings/help), cacheable like any other static enum.
`get_transporter_info(transporter_query)` — manager/admin soft-gated. Widened
`get_stats`: metric enum gained `orders_total`/`collections`/`dues_total`, plus a new
`scope: mine|company` arg. Two new system-prompt rules for navigate_to and the scope
extraction convention. Cache re-verified after the prompt change: deleted stale KV
key, redeployed, 9-utterance acceptance table run live — `usage.cached` = 5,019/5,05x
input tokens across all calls (~99.4%), prefix now ~5,019 tokens (up from ~4,668 after
W1), comfortably under the 8K budget.

**Deliberate deviation from the original Phase 7 sketch:** `orders_total`/
`collections`/`dues_total` are NOT role-gated to manager/admin despite the plan's
"company scope soft-gated" language. Reason found during implementation: orders/
payments have no rep-level attribution in the schema (unlike leads), and §V2.0.6
already treats orders/payments as company-wide reads for *every* role — `search_orders`
and `get_dues_summary` (shipped in Phase 5) are not role-gated either. Adding a new
restriction here would be inconsistent with tools already live. So these three metrics
always compute company-wide figures; the model's `scope` arg is accepted and recorded
but currently a no-op for money metrics (kept for forward compatibility / future rep-
level order attribution). `get_transporter_info` IS role-gated (manager/admin), matching
the spec.

**Bug found and fixed during acceptance testing:** `appHelpAnswer()` picked the FIRST
array-order keyword match, so "transporter payment kaise dekhu" matched the older
generic "due/payment" FAQ entry (via the word "payment") before ever reaching the new
"transporter" entry — always giving the wrong, generic answer for any transporter
question that also mentioned money. Fixed: now picks the entry whose LONGEST matching
keyword wins, not the first array match. Re-verified live post-fix: the same phrase now
correctly returns the transporter-specific answer.

**Also fixed in this session:** `start_order`'s existing navigation (Phase 5, confirmAction)
never closed the chat sheet after deep-linking to the order form, same gap as the new
navigate_to needed to avoid (§V2.3 "close the sheet on navigate"). Both now share the
same `onNavigate` callback threaded from `AssistantChat` into `useAssistant()`.

**Verification performed (live):** full 10-item acceptance table (navigate_to ×3,
get_transporter_info, get_stats company/mine scope ×2, get_dues_summary overlap case,
app_help, unsupported) all correct. UI-level (not just Worker-level) checks: navigate_to
actually changes the route AND closes the sheet (confirmed via page title change +
screenshot); transporterCard renders real data (contact person, phone); rep correctly
BLOCKED from get_transporter_info with the standard Hinglish message; rep correctly
NOT blocked from navigate_to (role rule only restricts specific actions, not navigation).

**Still needs the user:** same push as noted above — `use-assistant.ts` and
`assistant-chat.tsx` are both further modified now and still uncommitted.

Proceeding to Workstream 3 (model bake-off, zero production changes) next.
Workstream 4 (full E2E test pass: photo extraction, invoice PDF, order creation) is
explicitly deferred — it needs the user present to supply real files, per the execution
plan.

---

**Build status (2026-07-18, same session): V3 execution-plan Workstream 3 (model
bake-off) — DONE. Verdict: STAY ON GEMINI. Zero production changes made.**

Harness built at `acrowell-ai-worker/test/bakeoff/` (`fixtures.ts` — the 56-case set
per §V3-execution-plan; `run.ts` — the runner; `README.md` — full write-up;
`results-2026-07-18.json` — raw output). Runs as plain Node 24 TypeScript (native type
stripping), zero new npm dependencies, never imported by `src/`, never touches
`wrangler.jsonc`. The Gemini arm calls the LIVE production Worker's `/chat` endpoint
(same as a real user) specifically so `GEMINI_API_KEY` — a write-only wrangler secret —
is never read directly, per hard rule #2. GLM-4.7-Flash and Qwen3-30B-A3B were called
directly via the Workers AI REST API using the existing Cloudflare account token.

**Results (56 fixtures × 3 models = 168 live calls):**

| Model | Pass | Hard-fail rate |
|---|---|---|
| Gemini 3.1 Flash-Lite (current) | 51/56 (91%; ~100% after discounting scorer artifacts — see harness README) | 0% |
| GLM-4.7-Flash | 38/56 (68%) | **23%** (13/56) |
| Qwen3-30B-A3B | 40/56 (71%) | **5%** (3/56) |

**GLM-4.7-Flash — disqualified on reliability, not just accuracy.** With forced
tool-calling (`tool_choice: "required"`) over a realistic ~30-tool set, the model
intermittently emits its tool call as raw `<tool_call>...</tool_call>` TEXT outside the
structured response field — Workers AI's own parser then throws a hard error
(`success: false`), not a wrong answer, a broken response the frontend can't handle at
all. Also hit several outright request timeouts. On a case that DID return, it
hallucinated `lost_reason` with unrelated garbled text ("cancel percentage in an order
to avoid misleading confidence...") — a second, worse form of exactly the bug the
"never invent lost_reason" system-prompt rule exists to prevent.

**Qwen3-30B-A3B — real `tools` support (contrary to the research brief's uncertainty),
but real accuracy and reliability gaps in the categories the decision rule protects.**
3/56 hard-fails (no tool_call returned at all on otherwise-simple messages). A
*systemic* pattern of silently dropping present fields (`area_city`, `city`, `mrp`,
phone numbers) even on canonical one-function cases. Two lead-vs-party
disambiguation misses on textbook cases. And the inverse of the lost_reason win noted
in earlier spot-checks: when a Lost reason WAS actually stated, Qwen dropped it instead
of capturing it — so its lost_reason handling isn't better than GLM's, it fails in the
opposite direction.

**Decision, per the pre-agreed rule (switch only if a challenger is within 2 points of
Gemini AND ≥95% arg-F1 AND zero hard-fails on lost_reason/injection cases): neither
candidate is close.** Gemini stays as the sole Tier-1 model. The Workers AI free-tier
cost story (10,000 neurons/day ≈ 700 messages at ₹0) remains attractive in principle,
but no candidate available today clears the bar this app's write-path (payments,
stock, lead/party/product creation) needs. Revisit if Cloudflare ships a more capable
tool-calling model, or specifically for the V3 Tier-2 analytical loop (Phase 8+, not
yet built) which may tolerate a lower bar than Tier-1's writes — out of scope for this
session.

No files under `acrowell-ai-worker/src/` or `leadenthrella/src/` were touched by this
workstream. The only new artifacts are the `test/bakeoff/` files listed above (Worker
project isn't a git repo, so nothing to push for this workstream specifically).

**Workstream 4 (full E2E test pass) — 4A (image extraction) DONE with a real bug found
and fixed. 4B/4C (invoice PDF, order creation) not yet started.**

**4A — Photo extraction, tested with real user-supplied photos (not synthetic):**
- Visiting card (Shree Pharma Distributors) → create_lead: name, firm, phone (correctly
  normalized from "+91 98765 43210"), city, and state ALL correctly extracted from the
  real photo. Saved successfully, confirmed in Leads.
- Medicine box (Rafrab-A, Natchem Pharma) → create_product: name, composition, and pack
  size all EXACT matches to the real box text. GST% was filled with "12" despite not
  being visible anywhere on the box — flagged as a minor over-extraction (not a hard
  rule violation since the rep reviews before saving, but worth a future prompt
  tightening pass). MRP/base rate correctly left at 0 (genuinely not visible on the box).

**Real bug found and fixed:** the "upload the SAME original photo after save" behavior
promised in §V2.0.5 was never actually implemented — `ProductDialog` had no prop to
receive the photo at all, so every photo-created product silently saved with
`image_url: null`. Root-caused and fixed in this session:
- `assistant-chat.tsx` now keeps the original full-quality `File` (not just the
  downscaled copy sent to Gemini) in new state `lastPhotoFile`, threaded to
  `ProductDialog` as `pendingImageFile`. Cleared whenever a create_product confirm did
  NOT come from a photo (new `fromImage` flag added to the `create_product`
  `PendingAction`, mirroring the existing `create_lead` pattern) — prevents a stale
  photo from an earlier message silently attaching to an unrelated later product.
- `ProductDialog.submit()` (`src/routes/products.tsx`) now uploads `pendingImageFile`
  via the existing `uploadProductImage()` immediately after a NEW product's first save
  (never on edits, never overwriting a manually-uploaded image).
- Verified: re-tested end-to-end on the local dev server post-fix — new product record
  has `image_url` set to a real storage path, and the uploaded file is byte-identical in
  size to the original (519,582 bytes) — confirms full quality, not the downscaled
  Gemini copy.

**Second bug found and fixed (same investigation):** `ProductDialog`, `PartyDialog`, and
`LeadDialog` all showed "Edit X" / "X updated" for brand-new AI-created records, because
the title/toast logic checked truthiness of the whole prefill object instead of
`?.id` — the prefill object is always truthy (it has fields, just no `id`), so every
photo- or text-created new entity looked like an edit to the rep. Fixed in all three
files by switching to `.id` presence checks. `LeadDialog`'s toast logic was already
correct (checked `lead?.id` for the actual save routing) — only its title had the bug.

**Files changed this session, still uncommitted:** `src/components/assistant-chat.tsx`,
`src/lib/use-assistant.ts`, `src/routes/products.tsx`, `src/routes/parties.index.tsx`,
`src/components/lead-dialog.tsx`. `npx tsc --noEmit` shows zero new errors (verified via
before/after diff against a git-stashed baseline).

**Test data created (real names, not TEST- prefixed — flagging for cleanup):**
- Lead: "Rajesh Kumar" / Shree Pharma Distributors (from the real visiting card).
- Product: "Rafrab-A" — TWO records exist: one orphan from before the fix
  (`image_url: null`, id `5e716885-642c-4945-a94f-f80a4e33d9f2`) and one correct one
  from after the fix (`image_url` set, id `9fdef263-3c27-4681-8397-9156e3bf3b50`). The
  user should delete the orphan (and optionally the correct one too, if this was just a
  test) via the Products page — not deleted by this session per the no-delete rule.

**Tooling note (not a product bug):** file uploads for this test were done via a
temporary local HTTP server (`python3 -m http.server` + CORS/Private-Network-Access
headers) serving the user's photos, fetched into the page as a Blob and assigned to the
file input via `DataTransfer` — the browser automation tools available couldn't
directly upload arbitrary local files. Stopped and cleaned up after testing.

Next: 4B (invoice PDF) and 4C (order creation) — paused to confirm with the user what
the "Demo Bill" files they provided are for, since generating our own app's invoice PDF
(the original 4B plan) is a different test than validating against an externally-
supplied reference bill, and the assistant has no bill-photo-to-order feature in scope
(order creation with line items is explicitly excluded per §V2.0.8).

---

**Build status (2026-07-16): Phases 4, 5, and 6 built (parties, products, orders/dues/
payments, stock). NOT live-tested — this session had no browser/test credentials; see the
"still needs a human" list below.**

**Worker side** (`acrowell-ai-worker/src/`): `prompt.ts` rewritten — STATIC_SYSTEM_PROMPT
now covers all modules with a lead-vs-party disambiguation rule, a photo-domain rule
(visiting card → lead/party, medicine box → product), the dynamic-vocabulary rule, and 10
few-shot examples (kept the v1 lost_reason=null example). 19 new function declarations
added (31 total): parties (search_parties, get_party_details, create_party,
update_party_status, add_party_note), products (search_products, get_product_details,
create_product, update_product_rate), orders/dues/payments (search_orders,
get_party_dues, get_dues_summary, get_order_status, log_payment, start_order), stock
(get_stock_on_hand, search_batches, add_stock, issue_stock). `validate.ts` extended with
post-validation for all 19. `index.ts` now accepts `context.vocab` (divisions/categories/
party_types) and appends it as bracketed lines in the DYNAMIC final-turn text, after the
cached prefix — the shared explicit cache stays byte-identical across companies. Deployed
via `wrangler deploy`; stale KV cache key deleted so the new prompt/tools take effect.
Post-deploy sanity: CORS preflight from the published origin still echoes the origin
correctly, and a request with no Authorization header still 401s. Could NOT verify
`usage.cached > 0` end-to-end (§V2.0.7) — that requires a real Supabase access token,
which this session doesn't have; ask the user to send 3 consecutive messages in the live
app and check the Settings → Assistant usage card, or watch the Worker's return payload,
to confirm caching re-engaged after the prompt change.

**Frontend side** (`leadenthrella/src/`): `use-assistant.ts` rewritten (now ~1000 lines).
Mounts `useParties()`, `useProducts()`, `useOrders()`, `usePayments()`,
`usePartiesDuesAging()` unconditionally (all are company-wide reads per RLS, cheap, and
already shared with the Orders/Parties/Products pages' own query cache) — a deliberate
deviation from "lazy, only when panel open" for orders/payments specifically, since gating
them on panel-open would need threading sheet-open state into the hook for marginal
benefit (TanStack Query already dedupes against the Orders page's identical query key).
Stock IS gated: `useStockBatches({ enabled: !isRep })` — reps' sessions never issue that
query. `context.vocab` is now sent on every request (divisions/categories/party_types from
`useDropdownOptions`, capped 30 items). The v1 lead-resolution helper was generalized into
three parallel resolvers (`resolvePartyMatches`, `resolveProductMatches`,
`resolveOrderMatches`) sharing the same match style — kept as three typed functions rather
than one fully generic one, since Party/Product/Order match fields differ enough (phone
vs. no-phone, closed-stage exclusion for leads only) that a single generic would need as
many special cases anyway; this is a deliberate, noted deviation from the literal
"resolveEntity(kind, query)" wording. The same 0/1/2-5/>5 UX is preserved for every entity,
split into read paths (`resolvePartyAndAct`/`resolveProductAndAct`, feeding read-only
partyCard/productCard) and write paths (`resolvePartyForWrite`/`resolveProductForWrite`,
feeding confirm bubbles, with a `buildPending` callback carried through the picker so a
2-5-match write resolves to the exact same confirm bubble the 1-match case would show).
New message kinds added: `partyPicker`, `productPicker`, `partyList`, `productList`,
`orderList`, `partyCard`, `productCard`, `duesCard`. Soft role gate implemented as a single
`canDo(action, role)` map (`MANAGER_ONLY_ACTIONS` set) checked before rendering any
restricted confirm bubble — blocked actions get the exact Hinglish message from the spec,
never a silent no-op; the model itself is never told to refuse.

**Prefilled-dialog reuse, exactly per §V2.0.4:** `PartyDialog` (already exported from
`parties.index.tsx`, confirmed already reused cross-file by `orders.index.tsx` before this
change) and `ProductDialog` (was module-private in `products.tsx` — added `export`, same
trick as v1's `emptyLead`) are both imported directly into `assistant-chat.tsx` and opened
prefilled for `create_party`/`create_product`, exactly like the v1 photo→lead flow.
Dynamic-vocab values (division/category/party_type) are matched against the company's real
dropdown list via `matchVocabValue()` (exact match, else unique substring match, else left
null for the rep to pick) before prefilling — never invented. **Deviation from spec**:
unlike v1's `create_lead` (which writes directly to Supabase for non-photo text input and
only opens a dialog when photo-sourced), `create_party` and `create_product` ALWAYS use the
prefilled-dialog pattern regardless of text vs. photo trigger, per the spec's own framing
of them as "entity creation with many fields" (§V2.0.4) — this is a deliberate, more
conservative choice, not an oversight.

**Stock intake reuse — a deliberate deviation.** The spec asked for `add_stock`/
`issue_stock` to use "the existing stock-intake form" as a prefilled dialog. On inspection,
Stock's inward/issue UI (`src/components/stock/inward-tab.tsx`, `issue-tab.tsx`) are full
page-tab components built for bulk/manual entry, not modal dialogs designed for the
prefill-and-open pattern the way `LeadDialog`/`PartyDialog`/`ProductDialog` are. Rather than
retrofitting a tab component into a dialog (high risk, out of proportion to a
single-batch/single-line add or issue), `add_stock` and `issue_stock` use the **confirm-chip
pattern** instead, calling the existing `useAddStock()`/`useIssueStock()` mutation hooks
directly (same hooks the real intake/issue tabs use) after the usual explicit confirm
step — still no silent writes, just a simpler UI for a simple one-line action.
`issue_stock` picks the batch with the nearest expiry automatically (FEFO) since the
spec's action signature doesn't carry a batch_no for issuing.

**Product photo → product record (§V2.0.5):** implemented as specced — the photo goes to
Gemini via the same `inlineData` mechanics as v1's visiting-card path; `create_product`
returns extracted fields plus category/division chosen from `context.vocab`; the
`ProductDialog` opens prefilled; the existing `uploadProductImage()` upload-after-save flow
already built into `ProductDialog` handles the image once the rep hits its own upload
button. **NOT tested with a real photo** in this session (no file-picker driving available)
— ask the user to test once with a real medicine-box photo.

**Role-gate list implemented** (`MANAGER_ONLY_ACTIONS`): `update_party_status`,
`create_product`, `update_product_rate`, `add_stock`, `issue_stock`,
`get_stock_on_hand`, `search_batches`. Everything else (create_party, add_party_note,
log_payment, start_order, all reads except stock) is allowed for every role, matching the
RLS actually found in the migrations (`stock_batches`/`stock_locations` SELECT is
company-wide at the DB level with no role check — only INSERT/UPDATE require
`is_manager_or_admin()`; the stock-read restriction in this build is a soft/UX gate plus a
disabled-hook gate, not a hard RLS wall, which is a correction to this spec's §V2.0.2 claim
that stock reads are hard-RLS-gated).

**`npx tsc --noEmit`**: baseline (verified by stashing all changes and re-running) is 120
pre-existing errors, unrelated to this feature (same class as the ~46 documented for v1 —
`supabase.from("table")` calls on tables missing from generated types — the count is just
higher than the v1 note's tally, this session did not audit why, that's the pre-existing
follow-up task, not this one). After all Phase 4-6 changes: still exactly 120 errors, zero
new ones in any touched file (`use-assistant.ts`, `assistant-chat.tsx`, `use-stock.ts`,
`src/routes/products.tsx`).

**No new SQL migrations were needed** — parties/products/orders/payments/stock tables and
their columns already exist per the CLAUDE.md repo map; nothing in Phases 4-6 required a
schema change.

**Token budget (§V2.0.7):** the static prefix (system prompt + all 31 function
declarations) is well under the 8,000-token hard limit — rough estimate ~2,600-3,000 tokens
total (system prompt ~1,100-1,300 tokens, 31 terse one-line declarations averaging well
under the 160-token/decl budget). Comfortable headroom remains for Phase 7's ~6 more
functions.

**What still needs the user, concretely:**
1. Push the frontend changes via GitHub Desktop (`src/lib/use-assistant.ts`,
   `src/components/assistant-chat.tsx`, `src/lib/use-stock.ts`, `src/routes/products.tsx`
   are modified, uncommitted, in the working tree right now).
2. Log in as a rep and try a manager-only action (e.g. "MRP badha do Dolo ki") — confirm
   the Hinglish block message appears instead of a confirm bubble.
3. Log in as manager/admin and run through the Phase 4 acceptance sketch already in this
   file (§V2.4): create_party, create_product from a real medicine-box photo,
   get_product_details, get_party_details.
4. Try Phase 5 utterances live: log a payment, ask for a party's dues, ask for the dues
   summary, "start_order" deep-link (confirm `/orders?party=<id>` opens the New Order
   dialog with the party preselected).
5. Try Phase 6 utterances live as manager/admin: stock on-hand lookup, near-expiry batch
   search, add_stock, issue_stock — and confirm a rep session shows the role-blocked
   message for all four instead of a stock RLS error.
6. After the user confirms the app works, send 3 consecutive assistant messages and check
   that caching re-engaged (`usage.cached > 0`) — this session deployed the new prompt but
   could not verify this live for lack of a real auth token.
7. Test the create_lead-from-photo and create_product-from-photo flows with real camera/
   file-picker uploads — this session could not drive a real file upload.

Phase 7 (navigate_to, get_transporter_info, wider get_stats/app_help) was intentionally
NOT started — the task given for this session was Phases 4-6 only.

---

**Build status (2026-07-15): Phases 0, 1, 2, and 3 all done, deployed, and live-tested.**
Worker code lives at `/Users/harishsharma/Claude/Pharma BMT/acrowell-ai-worker/` (Cloudflare
account: admin@enthrella.com). Live endpoint:
`https://acrowell-ai-worker.icy-sunset-05b0.workers.dev/chat`. All 9 text-based acceptance
tests from section 5 pass, 401-with-no-token confirmed, explicit caching confirmed working
(see the Caching update in section 1). Two real deviations from the original spec were
required in Phase 1 and are called out inline below: the model name (§1) and the caching
mechanism (§1, implicit → explicit).

**Phase 2 (frontend chat UI) — done.** Built exactly per §6 with two placement/tooling
corrections:
- The floating launcher + `<Sheet>` panel (`src/components/assistant-chat.tsx`) is mounted
  in `src/components/app-shell.tsx` (inside `AppShell`, rendered by every route wrapped in
  `<Protected>`), **not** `__root.tsx` — `__root.tsx` only holds `AuthProvider`/
  `QueryClientProvider`/`Outlet`, it has no per-page chrome, so it was never the right mount
  point. This still satisfies "visible on every page when logged in" (and correctly hides it
  on `/auth`).
- Local dev runs on **port 8080**, not 3000 (`vite dev`'s actual bound port — confirmed via
  `wrangler`/vite output, not the assumed default). `leadenthrella/.claude/launch.json` was
  created pointing at 8080, and the Worker's `ALLOWED_ORIGINS` was updated/redeployed to
  include `http://localhost:8080` (kept `:3000` too, harmless).
- All 9 flows were exercised live end-to-end against the real dev server + real Supabase DB
  (logged in as `admin@acrowell.test`): create_lead (write verified in the Leads table),
  set_followup (verified `nextOpenFuSlot` wrote the right column, query cache correctly
  excluded the lead from the next get_today_plan call), update_stage→Lost-with-reason
  (verified in DB), get_today_plan (correct overdue-first sort + badges), the 2–5-match
  lead picker (verified two leads sharing one phone number resolved correctly, tap-to-pick
  produced the right confirm card), and unsupported ("delete all my leads"). The photo/
  visiting-card path (`image` field, §4.6) is implemented exactly as specced and reuses the
  same `callGemini` code path already proven by the 9 passing tests, but still has **no
  direct end-to-end test with a real photo** — a genuine file-picker upload couldn't be
  driven from this session's tooling. Ask the user to test it once with a real card photo
  before fully signing this path off.
- `LeadDialog`'s `emptyLead` was exported (was previously module-private) so the
  photo-sourced create_lead flow can prefill the review dialog with sane defaults
  (stage/source/temp) merged with the AI-extracted fields, instead of leaving them blank.
- Found and fixed a real prompt bug live in Phase 1 (see the `lost_reason` note in §4.4)
  before Phase 2 testing began — not a Phase 2 issue, just recording where it was caught.

**Phase 3 (usage metering) — done, migration NOT yet run.**
`supabase/migrations/20260715180000_assistant_usage.sql` adds `assistant_usage` with one
schema change from spec: an added `cached_tokens int not null default 0` column (RLS
unchanged from spec — insert-own, select-if-manager-or-admin). This wasn't optional: the
spec's original cost formula (`input×₹0.0000095 + output×₹0.000038`) assumed the original,
uncached `gemini-2.5-flash-lite` pricing. With the real architecture (explicit caching, and
the model swap to `gemini-3.1-flash-lite`), `input_tokens` mixes cached (10% rate) and
uncached (full rate) tokens — a single flat per-input-token rate would misreport cost by a
large margin, defeating the entire point of a cost dashboard. New formula, in
`src/lib/use-assistant.ts` (`FULL_INPUT_RATE` / `CACHED_INPUT_RATE` / `OUTPUT_RATE`
constants, ₹90/$, gemini-3.1-flash-lite pricing): `(input_tokens − cached_tokens) ×
FULL_INPUT_RATE + cached_tokens × CACHED_INPUT_RATE + output_tokens × OUTPUT_RATE`.
Frontend inserts one row per assistant round-trip (fire-and-forget, via `(supabase as
any).from("assistant_usage")` — casting `supabase` itself, not the `.from()` result, is
what actually works around the missing-generated-types error; confirmed this is the only
working pattern by checking `use-backup.ts`, which has the identical unfixed error for
another brand-new table). The usage/cost card lives on **`/settings` → "Assistant" tab**
(admin-only page), **not** `/developer` — `/developer` turned out to be a personal contact
card for the real-world developer (Harish Sharma), completely unrelated to CRM admin
settings, so using it would have been actively confusing. Live-verified pre-migration: the
insert fails gracefully (console-logged, chat UX unaffected) and the summary card renders
"0 actions / ₹0.00" rather than crashing, since the table doesn't exist yet.
**REMINDER: `20260715180000_assistant_usage.sql` must still be run by hand in the Supabase
SQL editor** — until then, usage logging silently no-ops and the Settings card stays at zero.

**Also found (out of scope, spun off separately):** running `npx tsc --noEmit` on this repo
for the first time (previously never run — the build sandbox usually can't run it, per the
deploy skill) surfaced ~46 pre-existing TypeScript errors unrelated to this feature, all the
same root cause: `supabase.from("table_name")` calls where the table isn't in the generated
types (`use-backup.ts`, `use-parties.ts`, `use-lead-products.ts`, `use-notifications.ts`,
`use-orders.ts`, plus one `.update()` call in `lead-dialog.tsx`). None of this feature's own
files have any type errors. A follow-up task was flagged for the user to fix these
separately using the `(x as any).from(...)` pattern confirmed working in this file.

---

## 1. Architecture (decided — do not redesign)

```
Rep types message / uploads card photo
        │
        ▼
Frontend chat UI (in leadenthrella repo)
        │  POST { messages, image? } + Supabase access token
        ▼
Cloudflare Worker  "acrowell-ai-worker"   ← holds GEMINI_API_KEY
        │  ONE Gemini call, function-calling FORCED (mode ANY)
        ▼
Returns a structured INTENT JSON (never prose, never DB access)
        │
        ▼
Frontend executes the intent using the EXISTING supabase client
(RLS enforced exactly as the rest of the app; TanStack Query invalidation reuse)
```

**Core principle — the Worker never touches the database.** It is a pure
"natural language → structured intent" translator. All reads and writes happen in the
frontend through `@/integrations/supabase/client`, which already carries the rep's JWT,
already passes RLS, and already integrates with TanStack Query. This removes an entire
class of security and cache-invalidation bugs.

**Model:** `gemini-3.1-flash-lite` (REST API, generateContent). Temperature 0.
Function calling with `mode: "ANY"` so the model MUST return a function call — never prose.
The app writes all user-facing confirmation text in code.
UPDATE (built 2026-07-15): the original pick `gemini-2.5-flash-lite` still appears in
Google's ListModels output but is rejected on generateContent for API keys/projects created
after its new-user cutoff ("no longer available to new users"). `gemini-3.1-flash-lite` is
the current GA cheapest-tier model with function calling + vision. If this drifts again,
call `GET https://generativelanguage.googleapis.com/v1beta/models` with the key and pick a
`flash-lite`-class GA (non-preview) model that lists `generateContent` support.

**Caching:** UPDATE (built 2026-07-15) — Gemini's *implicit* caching (the mechanism this
section originally specified) is currently broken for this exact setup: confirmed via
Google's own developer forum that implicit caching stopped applying for
`gemini-3.1-flash-lite`, and separately that implicit caching does not reliably engage when
function/tool declarations are present in the request (our case, always). Five consecutive
identical-shape calls showed `cachedContentTokenCount: 0` every time. Built *explicit*
caching instead (`src/cache.ts`): the Worker creates one shared Gemini `cachedContents`
resource (`POST /v1beta/cachedContents`) containing the STATIC_SYSTEM_PROMPT +
FUNCTION_DECLARATIONS + the same forced `toolConfig` (Gemini rejects sending
systemInstruction/tools/toolConfig alongside `cachedContent` — they must live *in* the
cache, not in the per-request body), with a 1-hour TTL. The resource name + expiry are
stored in KV (`gemini:cache:name`) so every Worker instance/region reuses the same cache —
**one cache serves every company**, since the static prompt+tools are byte-identical
regardless of which company/rep is calling. Each `/chat` request calls
`getOrCreateCachedContentName()` first; if valid, `callGemini()` sends `cachedContent: name`
instead of inlining systemInstruction/tools. Falls back to inlining them if cache creation
ever fails (e.g. transient error), so the feature never hard-fails on caching. Verified
working: `cached: 2359` out of `input: 2408` tokens on every call including the first.
Storage cost is ~$1/1M tokens/hour for Flash models (~₹0.20/hour when a cache is alive) —
negligible against the ~90% discount on every action across the whole product. All dynamic
content (today's date, rep name, conversation turns, the user's message) goes in `contents`,
never in the cached portion.

**Scope v1: leads only.** Parties/orders/stock actions are v2. Do not add them now.

---

## 2. What already exists (ground truth from the repo)

### leads table (from `supabase/migrations/20260709110515_*.sql` + later migrations)
Columns the assistant may touch:

| column | type | constraint |
|---|---|---|
| name, firm_name, contact, area_city, state | text | free text |
| product_interest | text | enum: `PCD Franchise, Third Party, Generic Range, Distribution, Institutional, Other` |
| source | text | enum: `Meta, PharmaHoppers, IndiaMart, Website, Other` |
| stage | text | enum: `New, Contacted, Details Shared, Interested, Negotiating, Won, Lost` (default New) |
| temp | text | enum: `Hot, Warm, Cold` |
| call_summary | text | free text |
| fu1_date … fu5_date | date | ISO dates |
| fu1_status … fu5_status | text | enum: `Not Done, No Answer, Switched Off, Replied on WhatsApp, Spoke - Interested, Details Resent, Negotiating, Asked to Call Later, Not Interested, Converted` |
| lost_reason | text | free text |
| date_received | date | defaults to today |

Never set from the assistant: `id, company_id, rep_id, lead_code, converted_party_id,
deleted_at, created_at, updated_at` — DB triggers fill company_id/rep_id/lead_code on insert.

### Existing code to reuse (do not reinvent)
- `src/lib/crm.ts` — `Lead` type, `STAGES`, `TEMPS`, `SOURCES`, `PRODUCT_INTERESTS`,
  `FU_STATUSES` constants, `todayISO()`, `nextFuDate()`, `alertFor()` helpers.
- `src/lib/use-leads.ts` — `useLeads()` (query key `["leads"]`), `useProfiles()`.
- `src/lib/auth-context.tsx` — current session/profile.
- `src/components/lead-dialog.tsx` — existing create/edit lead dialog patterns.
- Query invalidation: after any write, `queryClient.invalidateQueries({ queryKey: ["leads"] })`.
- RLS: reps see/write only their own leads; managers/admins see the whole company.
  The assistant inherits this for free because all DB calls go through the frontend client.

---

## 3. Phase 0 — Cloudflare setup (user does account steps, Sonnet does CLI steps)

1. USER: create a free Cloudflare account at dash.cloudflare.com (email + password,
   turn on 2FA). Workers Free plan is fine (100k requests/day).
2. Worker project lives OUTSIDE the repo at:
   `/Users/harishsharma/Claude/Pharma BMT/acrowell-ai-worker/`
   (Lovable builds the repo on push; the Worker must not be in it.)
3. SONNET: scaffold with `npm create cloudflare@latest` (TypeScript, no framework,
   name `acrowell-ai-worker`), then `npx wrangler login` (user approves in browser).
4. Secrets & vars:
   - `npx wrangler secret put GEMINI_API_KEY` (user pastes the key into the terminal
     prompt themselves — Sonnet never sees or types the key value).
   - In `wrangler.toml` vars: `ALLOWED_ORIGINS = "https://preview--leadenthrella.lovable.app,http://localhost:3000"`
5. KV namespace for rate limiting: `npx wrangler kv namespace create USAGE`
   and bind it in wrangler.toml as `USAGE`.
6. Deploy: `npx wrangler deploy`. Record the resulting `*.workers.dev` URL — the frontend
   needs it (put it in the repo as a constant, see §6; it is not a secret).

---

## 4. Phase 1 — The Worker

Single endpoint: `POST /chat`.

### 4.1 Request/response contract (frozen — frontend and worker both implement this)

Request body:
```json
{
  "messages": [ { "role": "user" | "assistant", "text": "..." } ],   // last ≤6 turns, oldest first
  "image": { "mimeType": "image/jpeg", "dataBase64": "..." } | null,
  "context": { "today": "2026-07-15", "repName": "Ravi", "role": "rep" }
}
```
Headers: `Authorization: Bearer <supabase access token>`, `Content-Type: application/json`.

Response body (success):
```json
{ "intent": { "action": "<name>", "args": { ... } }, "usage": { "input": 0, "output": 0 } }
```
Errors: `401` (missing/invalid token), `429` (daily cap), `500` with `{ "error": "..." }`.

### 4.2 Worker request pipeline (in order)

1. **CORS**: reflect origin only if in `ALLOWED_ORIGINS`; handle OPTIONS preflight.
2. **Auth check**: require an Authorization Bearer token. Validate it by calling
   `https://crzddmxogxhirzqkrgwb.supabase.co/auth/v1/user` with headers
   `Authorization: Bearer <token>` and `apikey: <SUPABASE_PUBLISHABLE_KEY>` (put the
   publishable key — the same one the frontend uses, it is public — in wrangler.toml vars).
   A 200 gives `{ id: <user uuid> }`. Anything else → 401. Do NOT skip this: it is what
   stops random internet traffic from burning the Gemini budget.
3. **Rate limit**: KV key `u:<uuid>:<YYYY-MM-DD>`, increment, expirationTtl 172800 (2 days).
   If count > 400 → 429 with a friendly error. (400/day ≈ heavy but human use.)
4. **Deterministic pre-router** (zero AI cost). Lowercase, trim the last user message:
   - matches `^(hi|hello|hey|namaste|good (morning|afternoon|evening))\b` → return
     intent `{ action: "smalltalk", args: {} }` without calling Gemini.
   - empty message and no image → 400.
5. **Gemini call** (see 4.3). Exactly one call. No retries on schema grounds (constrained
   function calling cannot produce invalid JSON). One retry ONLY on network error/5xx/429
   from Google, with 1s backoff.
6. **Post-validate args in the Worker** (cheap insurance): enum fields must be one of the
   allowed values or dropped; dates must match `^\d{4}-\d{2}-\d{2}$` or dropped; strings
   trimmed and length-capped (name/firm 120 chars, call_summary 2000). If the model returned
   a function not in the registry → replace with `{ action: "unsupported", args: { reason: "..." } }`.
7. Return the intent + token usage from Gemini's `usageMetadata`.

### 4.3 The Gemini request

Endpoint:
`POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`
(model name updated — see the §1 UPDATE note) Header: `x-goog-api-key: <GEMINI_API_KEY>`.

Body layout — UPDATED to use explicit caching (see §1 Caching update, `src/cache.ts`).
When a valid shared cache exists (the normal case):
```
cachedContent: "<cache resource name from cache.ts>"   ← systemInstruction/tools/toolConfig
                                                           live IN the cache, not here
generationConfig: { temperature: 0 }
contents: [
  ...prior turns (role user/model, text only, each truncated to 300 chars),
  final user turn: [ context line, image part if any, the user's message text ]
]
```
Fallback (cache creation failed) — the originally-specified inline shape:
```
systemInstruction: STATIC_SYSTEM_PROMPT
tools: [ { functionDeclarations: [...] } ]
toolConfig: { functionCallingConfig: { mode: "ANY" } }
generationConfig: { temperature: 0 }
contents: [ ...same as above... ]
```
The final user turn's text is:
`"[today=<ISO date> | rep=<name> | role=<role>]\n<user message>"` — dynamic data lives
here, at the END, never in systemInstruction and never in the cache.

### 4.4 STATIC_SYSTEM_PROMPT (verbatim — Sonnet copies this exactly)

```
You are the action-extraction engine inside Acrowell CRM, a lead-management tool used by
Indian pharma-franchise sales reps. You NEVER write prose to the user. For every message
you MUST call exactly one of the provided functions with correctly extracted arguments.

Rules:
- The final user turn begins with a bracketed context line: [today=YYYY-MM-DD | rep=... | role=...].
  Use "today" to resolve every relative date: "tomorrow", "kal", "next Monday", "after 3 days",
  "agle hafte". Always output dates as YYYY-MM-DD. Never output a date in the past unless the
  user explicitly states a past date.
- Reps write informally, in English, Hindi, or Hinglish, with typos. Map meaning, not words:
  "garam lead" = Hot; "band karo / cancel karo / nahi banega" on a lead = mark Lost;
  "ho gaya deal / order mil gaya / convert ho gaya" = mark Won; "call kiya tha" = log_call;
  "yaad dilana / follow up / FU" = set_followup.
- When the user refers to a lead by name, firm, city, or phone fragment, put that text in
  the lead_query argument EXACTLY as they wrote it. Do not guess IDs. The app resolves matches.
- Phone numbers: keep digits and leading + only, strip spaces/dashes. Indian mobiles are 10
  digits; if a number has 11-12 digits starting with 0 or 91, normalize to the 10-digit form.
- For create_lead, extract only what is stated or visible. Leave unknown fields null — never
  invent a city, product, or source. If a visiting-card image is provided, read name, firm,
  phone, city and state from it; the person's designation is not a field, ignore it.
- For update_stage to Lost, set lost_reason ONLY if the user actually stated a reason. If no
  reason was given, leave lost_reason null — never write a placeholder like "Not specified",
  "Unknown", or "N/A". The app will ask the rep for the reason when it is null.
  (ADDED after Phase 1 testing: the model was observed inventing lost_reason="Not specified"
  when no reason was given, which defeated the Worker's null-check safety net. Fixed by this
  explicit rule + a matching example below. If you ever touch this prompt again, keep both.)
- enum fields must use EXACTLY one of the allowed values, or null if nothing matches.
- If the message clearly maps to an action but one REQUIRED detail is missing or genuinely
  ambiguous (e.g. a follow-up with no date and no lead), call ask_clarification with a short
  question and 2-4 concrete options. Do not ask about optional fields.
- If the user asks how to use the app or where a feature is, call app_help.
- If the message is chit-chat, call smalltalk. If it maps to nothing supported (deleting data,
  other modules like orders/stock/salary, or anything else), call unsupported with a one-line
  reason.
- The rep may only work with their own leads; never reference other reps' data.
- This is a business tool only: never give medical, dosage, or clinical advice — such
  requests are unsupported.

Examples (input → function):
"naya lead Dr Mehta Ambala 9876543210 pcd me interest" → create_lead(name="Dr Mehta",
  area_city="Ambala", contact="9876543210", product_interest="PCD Franchise")
"kal Sharma ji ko call karna hai" → set_followup(lead_query="Sharma", date=<today+1>)
"spoke to verma, wants price list, warm" → log_call(lead_query="verma",
  summary="Spoke; wants price list", set_temp="Warm")
"kaun kaun overdue hai" → search_leads(overdue=true)
"is month kitne convert kiye" → get_stats(metric="won", period="this_month")
"mehta wala band kar do, rate nahi jama" → update_stage(lead_query="mehta", stage="Lost",
  lost_reason="Rate not agreed")
"mehta ko lost kar do" → update_stage(lead_query="mehta", stage="Lost", lost_reason=null)
  — no reason was stated, so lost_reason stays null, NOT "Not specified" or similar
"follow up set karo" → ask_clarification(question="Kis lead ke liye aur kis din?",
  options=["Aaj","Kal","Is hafte"])
```

(≈650 tokens; combined with the function declarations below the static prefix comfortably
exceeds the 1024-token implicit-cache minimum. If it measures under 1024, pad the prompt
with additional realistic examples — never with filler text.)

### 4.5 Function declarations (the fixed action set — verbatim names and args)

Declare these 11 functions. Shared arg: `lead_query` (string) = the user's own words
identifying a lead. All dates `YYYY-MM-DD`. Use JSON-schema `enum` for every enum field,
copying the exact DB values from §2.

1. `create_lead` — args: `name`, `firm_name`, `contact`, `area_city`, `state`,
   `product_interest` (enum), `source` (enum), `temp` (enum), `call_summary`,
   `followup_date`. All optional (card photos are partial); at least one of
   name/firm_name/contact required — enforce in Worker post-validation, else convert
   to ask_clarification("Lead ka naam ya number kya hai?").
2. `search_leads` — args: `query` (free text vs name/firm/city/phone), `stage` (enum),
   `temp` (enum), `overdue` (bool), `due_today` (bool), `no_followup_set` (bool),
   `created_from`, `created_to` (dates).
3. `set_followup` — args: `lead_query` (required), `date` (required), `note`.
4. `log_call` — args: `lead_query` (required), `summary` (required), `fu_status` (enum
   FU_STATUSES), `set_temp` (enum), `next_followup_date`.
5. `update_stage` — args: `lead_query` (required), `stage` (required, enum),
   `lost_reason` (required if stage=Lost — Worker enforces: Lost without reason →
   ask_clarification "Lost hone ka reason?").
6. `update_temp` — args: `lead_query` (required), `temp` (required, enum).
7. `get_today_plan` — args: `date` (optional, default today).
8. `get_stats` — args: `metric` (enum: `won`, `lost`, `new_leads`, `pipeline`,
   `followups_done`), `period` (enum: `today`, `this_week`, `this_month`, `last_month`).
9. `ask_clarification` — args: `question` (required), `options` (string array, 2-4).
10. `app_help` — args: `topic` (free text).
11. `smalltalk` / `unsupported` — declare `unsupported` with `reason`; `smalltalk` has no args.

### 4.6 Vision input

If `image` is present, append it to the final user turn as an `inlineData` part
(`{ inlineData: { mimeType, data } }`) before the text part. No other changes — the same
forced function calling extracts create_lead from a card. The frontend downscales before
sending (§6.5), so images arrive ≤1024px JPEG.

---

## 5. Phase 1 acceptance tests (run with curl before touching the frontend)

Get a real access token: log in on the preview site, run in the browser console
`(await window.supabase?.auth.getSession())` — or simpler, Sonnet adds a temporary
`console.log` of the token in dev. Then for each utterance below, POST it and check the
returned intent (action + key args):

| utterance | expected action | key args |
|---|---|---|
| "naya lead: Rakesh Pharma, Karnal, 98123 45678, meta se aya, generic range" | create_lead | firm_name≈"Rakesh Pharma", contact="9812345678", source="Meta", product_interest="Generic Range" |
| "kal subah Gupta ji ko call" | set_followup | date = today+1 |
| "mehta ko lost kar do" | ask_clarification OR update_stage→Worker converts (no lost_reason) | — |
| "mehta ko lost karo, price issue" | update_stage | stage="Lost", lost_reason present |
| "aaj kisko call karna hai" | get_today_plan | — |
| "how many leads did I win this month" | get_stats | metric="won", period="this_month" |
| "hello" | smalltalk (pre-router, `usage.input` must be 0) | — |
| "delete all my leads" | unsupported | — |
| "dolo 650 ka dose kya hai" | unsupported | — |
| no auth header | HTTP 401 | — |
| visiting-card photo, empty text | create_lead | fields from card |

Also verify caching: after ~5 sequential calls, Gemini's `usageMetadata.cachedContentTokenCount`
should be > 0. If it stays 0, the static prefix is varying — find and fix before proceeding.

---

## 6. Phase 2 — Frontend (in the leadenthrella repo)

### 6.1 Files to create
- `src/lib/use-assistant.ts` — chat state hook + fetch to the Worker + intent executor.
- `src/components/assistant-chat.tsx` — the chat panel UI.
- Floating launcher button added to the app shell in `src/routes/__root.tsx`
  (visible on every page when logged in; keyboard shortcut optional, skip v1).
- Worker URL constant: `const ASSISTANT_URL = "https://acrowell-ai-worker.<subdomain>.workers.dev/chat"`
  in `use-assistant.ts` (not a secret; fine in the repo).

### 6.2 Sending a message
Get token via `supabase.auth.getSession()`. Send last ≤6 turns (truncate each to 300 chars),
`context.today = todayISO()` from `src/lib/crm.ts`, repName/role from auth context.
While waiting, show a typing indicator. On 429 show "Daily assistant limit reached."
On failure show a retry chip — never silently drop a message.

### 6.3 Executing intents (all app-side, all free — this is where UX quality lives)

**Lead resolution for `lead_query`** (used by set_followup, log_call, update_stage, update_temp):
match case-insensitively against the already-loaded `useLeads()` data on name, firm_name,
area_city, and contact-digit substring. Exclude stage Won/Lost from matching for
set_followup/log_call (but NOT for update_stage). Then:
- 0 matches → assistant bubble: "Koi lead nahi mila '<query>' naam se." + button "Create new lead?"
- 1 match → proceed to confirmation (below).
- 2-5 matches → show tappable list (lead name, firm, city, stage) to pick from.
- >5 matches → ask to narrow ("Kaunsa? City ya firm batao.") and show top 5.

**Write confirmation — REQUIRED for every write action.** Render a pending card showing
exactly what will change (e.g. "Mark **Dr Mehta / Ambala** as **Lost** — reason: price issue")
with [Confirm] [Cancel]. Only on Confirm run the supabase update/insert, then
`queryClient.invalidateQueries({ queryKey: ["leads"] })`, then show the success bubble with
a link to `/leads/$id`. create_lead from a card photo instead opens the existing lead
dialog prefilled (reuse `lead-dialog.tsx`), so the rep can fix OCR mistakes before saving.

**set_followup slot logic:** write into the first empty `fuN_date` slot (1→5). If all 5
slots are full, overwrite the slot with the oldest date and tell the user.
**log_call:** append to `call_summary` as a dated line: `"[<todayISO()>] <summary>"`
(prepend to existing text with a newline); optionally set `fuN_status` on the most recent
dated slot if `fu_status` was extracted; apply `set_temp`/`next_followup_date` if present.
**update_stage to Won:** just set stage (party conversion stays a manual UI flow, v1).

**Read intents** compute from already-loaded data — no new queries:
- `get_today_plan`: leads where `nextFuDate(l) <= todayISO()` and stage not Won/Lost,
  sorted overdue-first (reuse `alertFor`). Render as tappable lead cards.
- `search_leads`: filter loaded leads by extracted args.
- `get_stats`: count/aggregate loaded leads client-side (Won = stage changed… v1 simply:
  stage="Won" AND `updated_at` within period; note this approximation in a code comment).

**Static intents:** `smalltalk` → short canned greeting (hardcoded strings, rotate 2-3).
`app_help` → match topic against a small hardcoded FAQ map (create lead, follow-ups,
import, dues…) with links to the right routes; unknown topic → point to `/help`.
`ask_clarification` → show question + option chips; tapping a chip sends it as the next
user message. `unsupported` → polite canned "Ye main abhi nahi kar sakta" + reason.

### 6.4 Chat UI requirements
Right-side slide-in panel (Sheet) on desktop, full-screen on mobile; shadcn/ui components,
Tailwind, matches existing app styling. Message list + input + image-attach button +
send. History kept in React state only (cleared on reload) — no DB persistence in v1.
Auto-scroll to bottom. Disabled input while a request is in flight.

### 6.5 Image handling
Attach button accepts image/*. Before upload: draw to canvas, downscale longest side to
1024px, export JPEG quality 0.8, base64. Show a thumbnail in the sent bubble. Reject
files > 8 MB pre-downscale with a friendly message.

### 6.6 Types
No DB schema changes in v1 → no migration, no type changes. If any table types are
missing fields, follow the deploy skill (optional fields, `as any` for new tables).

---

## 7. Phase 3 — Usage metering (do AFTER phases 1-2 work end-to-end)

New migration `supabase/migrations/<timestamp>_assistant_usage.sql`:
table `assistant_usage(id uuid pk default gen_random_uuid(), company_id uuid not null,
user_id uuid not null, action text not null, input_tokens int not null default 0,
output_tokens int not null default 0, created_at timestamptz not null default now())`,
RLS: insert with check `user_id = auth.uid() AND company_id = public.current_company_id()`;
select using `company_id = public.current_company_id() AND public.is_manager_or_admin()`.
Grant to authenticated. **REMIND THE USER: this migration must be run by hand in the
Supabase SQL editor before the code that uses it ships.**
Frontend inserts one row (fire-and-forget, `as any` cast) after each successful assistant
round-trip using the `usage` numbers the Worker returned. A small usage card on
`/developer` or `/settings` (admin-only) shows this month's action count + est. cost
(input×₹0.0000095 + output×₹0.000038 per token at ₹90/$ — keep as named constants).

---

## 8. Hard rules for the implementing model

1. Worker code lives in `/Users/harishsharma/Claude/Pharma BMT/acrowell-ai-worker/`,
   NEVER inside the leadenthrella repo.
2. GEMINI_API_KEY exists only as a wrangler secret. Never in any file, log, commit, or
   chat message. The user types it into the `wrangler secret put` prompt themselves.
3. No Supabase edge functions. No service-role key anywhere in this feature.
4. The Worker makes exactly ONE Gemini call per user message (plus one network-error retry).
   Never chain calls, never add a second "classification" call.
5. Never send lead data TO Gemini beyond what the user typed/photographed. The model
   extracts; the app resolves and executes.
6. The static system prompt + function declarations are frozen constants. Any change to
   them is a deliberate decision (breaks the cache) — call it out to the user when it happens.
7. Every DB write goes through a visible in-chat confirmation step. No exceptions in v1.
8. Enum values must byte-match §2 (e.g. `"Spoke - Interested"` with spaces around the dash).
9. Repo changes reach the live site only after the user pushes via GitHub Desktop;
   migrations only run when the user executes them manually. Say so at each hand-off.
10. Test each phase per §5 before starting the next.

---

## 9. Cost guardrails already built into this design
- Forced function calling → output ≈ 30-120 tokens/action.
- Static ≥1024-token prefix → ~90% of input billed at the cached rate after warm-up.
- Deterministic pre-router → greetings cost ₹0.
- KV daily cap (400/user) → a runaway client cannot exceed ~₹9/user/day worst case.
- Google Cloud budget alert (user set: ₹5,000 cap, ₹2,500 prepaid, no autopay) is the
  final backstop.

Expected: ₹0.005–0.03 per action; a 50-rep heavy-use company ≈ ₹900–4,500/month worst case.

**Cost audit (2026-07-16, after all v1 build/test traffic):** observed spend ₹1.51 for the
entire Phase 1–3 build and test cycle (~50 Gemini calls). A bottom-up reconstruction at
list prices puts the expected worst case for that traffic at ~₹3.55, so the observed number
is comfortably ON TRACK — in fact below estimate. Why the average per-call cost of this
test traffic (~₹0.03/call) sits at the TOP of the predicted ₹0.01–0.03 band, and why
production will sit lower: (a) roughly half the test calls ran BEFORE explicit caching was
fixed, paying full input rate (~₹0.06/call — these never happen in production); (b) the
test cycle created ~6 separate cachedContents resources during debugging (~₹0.25 each in
one-off input+storage billing — production creates about one per hour of active use,
shared across ALL companies); (c) steady-state cached calls measure ₹0.0125 each, right in
the middle of the predicted band. No pricing surprise exists; do not redesign anything for
cost reasons.

---
---

# V2 — WHOLE-APP ASSISTANT (Phases 4–7)

**Goal:** extend the assistant from leads-only to every module of the CRM — parties,
products (including create-product-from-photo), orders/dues, stock — with role-appropriate
capabilities for rep / manager / admin. Same architecture, same Worker, same chat UI. This
section is the complete instruction set for the implementing model; the v1 spec above
remains the authority for everything it covers (architecture, hard rules §8, contract §4.1).

## V2.0 Architecture decisions (settled — do not redesign)

1. **Same single-call design.** One Worker, one Gemini call, forced function calling, the
   frontend executes every read/write through the existing hooks + supabase client. No
   second "router" call, no per-domain Workers.

2. **Role gaps are already enforced by RLS — the assistant inherits them.** Verified
   policies: products INSERT/UPDATE = manager/admin, DELETE = admin; parties SELECT/INSERT
   = whole company, UPDATE = manager/admin, DELETE = admin; leads = rep-own (managers/
   admins see all); stock module UI is manager/admin-gated. Because the assistant's writes
   run through the user's own JWT, a rep physically cannot do what the UI wouldn't let
   them do. On top of that hard layer, add a SOFT layer for UX: (a) the frontend intent
   executor checks `profile.role` before rendering a Confirm button for a restricted
   action and instead replies "Ye sirf manager/admin kar sakte hain — apne manager se
   boliye" (mapping: create/update product → manager+; update party → manager+; stock
   actions → manager+; delete anything → not supported for anyone, same as v1); (b) the
   role is already in the model's context line, and the V2 system prompt tells the model
   that restricted intents are still VALID extractions — the app decides eligibility, the
   model never refuses on role grounds (a wrongly-refused manager is worse than a
   politely-blocked rep).

3. **Dynamic per-company vocabulary — the single most important V2 mechanism.** Product
   `division`/`category` and party `party_type` are NOT static enums; they are per-company
   rows in `dropdown_options` (see `useDropdownOptions(kind)` in use-company.ts). They must
   NEVER be baked into the cached prompt or function declarations (the cache is shared
   byte-identical across every company — v1 §1). Mechanism:
   - Frontend adds `context.vocab` to the /chat request:
     `{ divisions: string[], categories: string[], party_types: string[] }` (values from
     the already-loaded dropdown hooks; cap each list at 30 entries, each ≤40 chars).
   - Worker appends them to the DYNAMIC final-turn text, after the context line, as e.g.
     `[categories: Tablet, Syrup, Injection, …]` — this lands after the cached prefix, so
     the cache stays intact. Only include vocab when the message plausibly needs it? No —
     keep it simple and always include it; ~100–200 extra uncached input tokens ≈ ₹0.0005.
   - Function declarations keep these args as plain STRING (no enum constraint).
   - The FRONTEND validates the returned value against the company's real list:
     case-insensitive exact match → accept; unique prefix/substring match → accept;
     otherwise show the value as a dropdown pre-set to "closest match" in the prefill
     dialog for the rep to fix. Never silently invent a new dropdown value.
   - The V2 system prompt instructs: "choose category/division/party_type ONLY from the
     bracketed lists in the user turn; if nothing fits, leave it null."
   This is what makes "upload a product photo and it picks the right category by itself"
   work: Gemini sees the photo AND the company's own category list in the same turn.

4. **Two write-execution patterns, chosen per action:**
   - **Confirm chip** (v1 pattern) — for single-field/simple writes: set follow-up, change
     status, log payment note, mark party starred, etc.
   - **Prefilled dialog** — for entity creation with many fields: create_product (reuse the
     existing product dialog on products.tsx), create_party (reuse the party dialog),
     add_stock (reuse the stock intake form). The chat extracts, opens the app's EXISTING
     dialog prefilled, the rep reviews and saves through the normal form. This is exactly
     the v1 photo→lead pattern (LeadDialog + exported emptyLead). NEVER rebuild an entity
     form inside the chat panel. Sonnet: before each phase, locate the existing dialog
     component the same way lead-dialog.tsx was reused, and export its empty-defaults
     object if it's module-private.

5. **Product photo → product record, end to end:** image goes to Gemini exactly like the
   visiting-card path (same inlineData mechanics, §4.6); model returns `create_product`
   with extracted name/composition/pack/MRP (MRP is usually printed on Indian pharma
   packaging) plus category/division chosen from `context.vocab`; frontend opens the
   product dialog prefilled; after the rep saves, the frontend uploads the SAME image the
   rep attached via the existing `uploadProductImage(companyId, productId, file)`
   (use-products.ts:119) and sets `image_url`. Keep the original File object in the chat
   message state so the upload uses full quality, not the downscaled copy sent to Gemini.

6. **Data loading in the executor:** useAssistant currently mounts only `useLeads()`. V2
   mounts `useProducts()`, `useParties()` the same way (both are company-wide reads,
   RLS-safe for all roles, already cached by TanStack Query). Orders and stock hooks are
   heavier and role-gated — call them lazily: `useOrders()`-equivalent only `enabled:` when
   the panel is open, and stock hooks only `enabled: profile.role !== "rep"`. Never let a
   rep's session issue a stock query that RLS will reject (noisy 4xx in console).

7. **Token-budget guardrail (HARD RULE).** Google has a documented implicit/explicit
   caching dead zone around ~9K–17K prompt tokens where cachedContentTokenCount can drop
   to 0. The v1 static prefix is ~2.4K tokens; V2 adds ~25 more function declarations and
   a longer system prompt. The static prefix (system prompt + ALL function declarations)
   must stay **under 8,000 tokens**. Budget: system prompt ≤1,800 tokens, ~37 function
   declarations averaging ≤160 tokens each. Enforce by: terse descriptions (one line, no
   examples inside declarations — examples live in the system prompt only), no redundant
   "description" on self-evident args. After EVERY deploy that touches prompt.ts, run 3
   consecutive test calls and confirm `usage.cached > 0`; if it drops to 0, the prefix
   either changed mid-test or crossed the dead zone — stop and fix before proceeding.
   Also delete the stale KV cache key (`wrangler kv key delete "gemini:cache:name"
   --namespace-id=302493f121a0412484ac8322515ffa85 --remote`) after every prompt change,
   as the old cache resource no longer matches the new constants.

8. **Deliberate exclusions from V2 (do not build, tell the user if asked):** payroll/
   salary data (sensitive; keep out of the AI surface entirely for now), user management,
   company settings changes, backups, deletes of any kind, and order CREATION with line
   items (an order needs party + N products + rates + GST — a chat extraction will get
   line items wrong too often; the assistant instead deep-links to the order form with
   the party preselected). Revisit order creation in V3 only if users ask.

## V2.1 The action set (~37 functions total)

Existing 12 (v1, unchanged) plus the following. Shared conventions: `*_query` args carry
the user's own words for entity lookup (app resolves, same as lead_query); dates
YYYY-MM-DD; all dynamic-vocab args are plain strings validated app-side (§V2.0.3).

**Parties (Phase 4)** — all roles can read & create; update is manager/admin (soft-gated):
- `search_parties(query, party_type, status, city, starred_only)` — filter loaded parties.
- `get_party_details(party_query)` — one card: firm, type, phone, city, credit, dues
  (dues from orders data when loaded), monopoly info. Deep-link to /parties/$id.
- `create_party(firm_name, party_type, phone, email, city, state, gstin, drug_license,
  address, notes)` — prefilled-dialog pattern. Also triggered by visiting-card photo when
  the user says it's a party/customer (context decides lead vs party; default lead).
- `update_party_status(party_query, status, note)` — confirm-chip; manager/admin only.
- `add_party_note(party_query, note)` — confirm-chip; all roles (notes table policy
  mirrors contacts: insert same-company).

**Products (Phase 4)** — read all roles; create/update manager/admin (soft-gated):
- `search_products(query, division, category, active_only)`.
- `get_product_details(product_query)` — card: pack, MRP, base rate, GST, stock-on-hand
  when stock data is loaded; deep-link to /products.
- `create_product(name, composition, pack, mrp, base_rate, gst_pct, hsn, division,
  category, min_order_qty, notes)` — prefilled-dialog pattern; the flagship photo flow
  (§V2.0.5). At least `name` required (Worker post-validation, else ask_clarification).
- `update_product_rate(product_query, mrp, base_rate)` — confirm-chip, manager/admin.

**Orders & dues (Phase 5)** — reads for all roles (RLS: orders are company-wide read):
- `search_orders(party_query, status, fulfillment_status, from_date, to_date)`.
- `get_party_dues(party_query)` — outstanding + aging for one party.
- `get_dues_summary(bucket)` — company/rep-level receivables (reuse the dues-aging logic
  already in use-orders.ts; do not reimplement bucketing).
- `get_order_status(order_query)` — by invoice no or party; shows fulfillment/dispatch.
- `log_payment(party_query, amount, mode, date, ref_no, order_query)` — confirm-chip.
  Payment modes: reuse whatever the payments UI offers (check use-orders.ts / the payment
  dialog for the source of truth; if it's a dropdown_options kind, treat as dynamic vocab).
- `start_order(party_query)` — NOT a data write: resolves the party, deep-links to the
  order-creation page with party preselected (see exclusion §V2.0.8).

**Stock (Phase 6)** — manager/admin only (hard RLS + soft gate; hooks disabled for reps):
- `get_stock_on_hand(product_query, location)` — from onHandByProduct(batches).
- `search_batches(product_query, expiry_bucket, batch_no)` — expiry buckets reuse
  expiryBucket() from use-stock.ts (near-expiry queries: "kaunsa stock expire ho raha
  hai").
- `add_stock(product_query, batch_no, qty, expiry, location)` — prefilled-dialog pattern
  into the existing stock-intake form.
- `issue_stock(product_query, qty, party_query, note)` — prefilled-dialog pattern.

**Cross-cutting (Phase 7)**:
- `navigate_to(page)` — enum of route names (STATIC enum, this one CAN be cached: leads,
  parties, orders, products, stock, followups, my_day, dashboard, transporters, team,
  settings, help…). "mera dashboard kholo" → app navigates. Zero-risk, high-delight.
- `get_transporter_info(transporter_query)` — read-only card (manager/admin).
- Widen `get_stats` with more metrics (orders_total, collections, dues_total) and a
  `scope: mine|company` arg (company scope soft-gated to manager/admin).
- Widen `app_help`'s FAQ map to cover every module.

## V2.2 System-prompt changes (Sonnet: rewrite STATIC_SYSTEM_PROMPT, keep it ≤1,800 tokens)

Keep every v1 rule (dates, Hinglish, phone normalization, lost_reason-null rule, never
invent data, business-tool-only). Add, in this spirit (Sonnet writes the final text, then
freezes it):
- The assistant now covers leads, parties (customers), products, orders/dues/payments,
  stock, and navigation. One function per message, still never prose.
- Disambiguation rule between look-alike domains: a person/firm who is NOT yet a customer
  = lead; an existing customer/buyer = party ("party", "customer", "distributor
  hamara") — when genuinely unclear whether create_lead or create_party, prefer
  create_lead and let the app's confirm step catch it; "dawai/product/item" + rate/pack/
  MRP context = product.
- Photo rule: visiting card / WhatsApp contact screenshot → create_lead (or create_party
  if the user says they're already a customer); medicine box / strip / bottle / carton →
  create_product, reading name, composition, pack size and printed MRP from the packaging.
- Dynamic-vocab rule (§V2.0.3): category/division/party_type only from the bracketed
  lists; null if nothing fits.
- Role rule: extract restricted intents normally; the app enforces permissions.
- Keep ~10 few-shot examples MAX across all domains (drop some v1 lead examples if needed
  to stay in token budget — keep the lost_reason=null one, it fixed a real bug).

## V2.3 Frontend executor changes (use-assistant.ts + assistant-chat.tsx)

- Generalize the v1 lead-resolution helper into `resolveEntity(kind, query)` used by
  parties (match firm_name/city/phone/gstin-fragment) and products (match name/
  composition/pack) with the same 0/1/2–5/>5 UX (not-found / confirm / picker / narrow).
- New message kinds: `partyCard`, `productCard`, `orderList`, `duesCard`, plus reuse of
  the generic picker/confirm. Keep every card small: name line, 2–3 data points, badges,
  deep-link. Follow the leadList card styling exactly.
- Soft role gate helper: `canDo(action, role)` map in one place; blocked → friendly
  message (§V2.0.2), never a silent no-op.
- Deep links: navigate with TanStack router `useNavigate()`; close the sheet on navigate.
- The `assistant_usage` logging and cost constants need NO changes (action name is
  already a free string).

## V2.4 Build order, testing, and hand-off gates

Phase 4 (parties + products + photo→product) → Phase 5 (orders/dues/payments) → Phase 6
(stock) → Phase 7 (navigation + polish). One phase per session; after each:
1. `npx tsc --noEmit` — zero errors in touched files (pre-existing errors in untouched
   files are a known separate issue, see build-status note).
2. Deploy Worker, delete stale KV cache key, run the phase's utterance suite via the live
   dev server (localhost:8080) — write a ~10-utterance table per phase BEFORE coding it,
   v1 §5 style, including at least: one Hinglish phrasing, one ambiguous entity that must
   trigger the picker, one role-blocked attempt AS A REP (log in as rep@acrowell.test),
   one photo case (user assists with real file upload), one unsupported request.
3. Verify `usage.cached > 0` on 3 consecutive calls (token-budget guardrail §V2.0.7).
4. Verify a rep login cannot execute manager-only writes end-to-end (expect the soft-gate
   message, and if bypassed, the RLS error surfaced gracefully).
5. Update the build-status block at the top of this file with what actually happened,
   including any deviations, before starting the next phase.

Phase 4 acceptance sketch (write the full table before coding):
| "naya customer add karo Gupta Medicos Delhi 9988776655 distributor hai" | create_party |
| medicine-box photo + "add this product" | create_product with category from vocab |
| "paracetamol ka rate kya hai" | get_product_details / search_products |
| "sharma traders ka number kya hai" | get_party_details |
| as REP: "MRP badha do Dolo ki" | update_product_rate → soft-gate message |

---
---

# V3 — CONVERSATIONAL ASSISTANT ROADMAP (Phases 7–12) — PLANNED 2026-07-18

**Goal:** evolve the assistant from a command-intent extractor into a ChatGPT/Gemini-style
conversational assistant over the company's own CRM data — prose answers, multi-step
reasoning over real data, streaming, memory — while keeping cost per action in the same
order of magnitude via a tiered router. Target: most messages stay on the cheap V2 path;
only analytical questions pay for the loop.

## V3.0 The one architecture change that unlocks everything

V1/V2 is: one forced-function call → intent JSON → frontend executes → canned UI card.
The model NEVER sees CRM data (hard rule §8.5) — which is exactly why it cannot answer
"is mahine kis division ki sales sabse zyada hai?" or "compare last 3 months".

**V3 core: an agentic tool loop with the FRONTEND as the tool runtime.**

```
User message
  ▼
Worker /chat (same auth/rate-limit/pre-router)
  ▼
Gemini call, mode AUTO (not ANY): model may answer in prose OR call read-tools
  ├─ prose → stream to UI (SSE), done                       [1 step, cheap path]
  └─ functionCall(s) → return to FRONTEND as "toolRequests"
        ▼
     Frontend executes reads via existing hooks/supabase (user's own JWT, RLS intact),
     truncates results to ≤1.5K tokens each, POSTs them back to /chat as functionResponse
     turns → loop (max 4 steps) → final prose streams to UI
```

- Writes NEVER execute inside the loop. Write intents still surface as the V2 confirm
  chips / prefilled dialogs. Non-negotiable.
- **This deliberately relaxes hard rule §8.5** ("never send lead data to Gemini"): V3
  sends the minimal tool results the model requested — under the user's own JWT, snapshot
  not firehose. USER MUST SIGN OFF on this privacy tradeoff (CRM business data flows to
  Google's API) before Phase 8 starts. Payroll/salary/user-management stay excluded
  forever regardless.
- Stateless Worker: each loop step is a separate HTTP POST carrying the transcript, so
  explicit caching keeps working and no Durable Objects are needed. SSE streaming for the
  final prose step only (streamGenerateContent pass-through).
- Two cache resources: (a) the existing small V2 intent cache for the Tier-1 path;
  (b) a second, bigger cache for the loop (conversational system prompt + read-tool
  declarations). Keeps the cheap path cheap and dodges prefix-size games. Monitor
  cachedContentTokenCount on BOTH after every prompt change (same §V2.0.7 discipline).

## V3.1 Tiered router = the cost strategy

| Tier | Trigger | Mechanism | Est. cost/msg |
|---|---|---|---|
| 0 | greetings | existing regex pre-router | ₹0 |
| 1 | commands & simple lookups (~80% of traffic) | existing V2 forced-intent single call | ₹0.01–0.03 |
| 2 | analytical/comparative/why questions | the V3 loop (2–4 steps) | ₹0.15–0.30 |
| batch | nightly digests (Phase 11) | Gemini Batch API (50% off) | ~₹0.10/user/day |

Routing needs no extra call: Tier 1 stays the first call; add one new declaration
`analyze(question)` — when the model picks it, the frontend re-submits the message to the
Tier-2 loop endpoint. Misroutes cost one cheap call, not a broken answer.
Cost guardrails carry over: KV daily cap, per-tool-result token cap (~1.5K), loop cap
(4 steps), history cap (6 turns / 300 chars — loop transcripts excluded from history).
Reference pricing (verified 2026-07): gemini-3.1-flash-lite $0.25/M in, $1.50/M out,
cached input ~10%, Batch API 50% off.

## V3.2 Phase plan

**Phase 7 — finish V2 (no architecture change, do first):**
navigate_to(page) static-enum, get_transporter_info, get_stats widening
(orders_total/collections/dues_total + scope mine|company), app_help full-module FAQ.
PLUS: push the pending >5-matches resolver fix (done locally 2026-07-18, uncommitted);
fix the HISTORY-CONTAMINATION bug found in live testing (3 reproductions: after a
product lookup, a follow-up dues/summary question re-triggers the previous action) —
prompt rule: "Resolve ONLY the latest message; use history solely when it references
earlier context (isme/uska/wahi/'that one')" + stop recording resolver-picker turns into
history. Prompt change ⇒ full §V2.0.7 cache re-verification. Also test both photo flows
(visiting card, medicine box) with real uploads — still never end-to-end tested.

**Phase 8 — conversational core:** the V3.0 loop + SSE streaming + markdown rendering in
chat bubbles + read-tools v1: get_leads_snapshot, get_parties_snapshot,
get_orders_summary(from,to,group_by: division|product|party|rep),
get_payments_summary(from,to,group_by), get_dues_snapshot, get_stock_snapshot (role-
gated). Each returns compact aggregated JSON, never raw row dumps. Acceptance: "is
mahine sales kaisi rahi division-wise?", "sabse zyada dues kiske hain aur kitne din se?",
"pichle mahine se compare karo" — prose answers with real numbers matching the dashboard.

**Phase 9 — analytics brain:** period-over-period comparisons, top-N, trend narration;
`chartSpec` message kind reusing the app's existing chart components (assistant returns
{type, series, labels} — frontend renders, model never draws); CSV export of any answer
table. Acceptance: "last 3 months collection trend dikha do" → chart bubble + 2-line
prose insight.

**Phase 10 — memory & persistence:** assistant_conversations + assistant_messages tables
(RLS: own rows only; migration BY HAND per deploy skill), conversation list + "new chat"
in the panel, auto-title, resume across devices; explicit long-term memory ("yaad rakhna
Rajasthan mera area hai") in an assistant_memories table injected into the DYNAMIC turn
(never the cache); 30-day retention default.

**Phase 11 — proactive assistant:** nightly Batch-API digest per user (overdue FUs, dues
crossing credit_days, near-expiry stock, yesterday's collections) → in-app notification
via the existing notifications system; "suggested actions" chips in chat. Opt-in per
user; admin toggle in Settings → Assistant.

**Phase 12 — multimodal & channels:** voice input via browser SpeechRecognition hi-IN
(free, no API cost) with the mic button in the chat bar; optional TTS read-back;
multi-image messages; WhatsApp Business bridge = separate scoped project, needs user
decision on Meta Business verification + per-message pricing first.

## V3.3 Rules that do NOT change in V3

Same Worker, no edge functions, no service-role key, GEMINI_API_KEY stays a wrangler
secret, all writes confirm-gated, RLS is the security boundary, role soft-gates stay,
payroll/user-management/settings/deletes stay excluded, migrations run BY HAND, repo
reaches live only via user push + Lovable publish, one phase per session with the
§V2.4-style gates and build-status updates in this file.

## V3.4 User decisions — ALL RESOLVED 2026-07-18 (approved by Harish)

1. §8.5 relaxation: **APPROVED** — CRM data may reach the LLM in V3 Tier-2 only as
   field-whitelisted aggregates (no phone numbers, document contents, or note bodies;
   every snapshot logged in assistant_usage).
2. Monthly budget ceiling: **stays ₹5,000** (existing Google Cloud alert unchanged);
   revisit after a month of real Tier-2 usage.
3. Conversation retention: **30 days**.
4. WhatsApp: **OUT of scope** for now.
Additionally approved: the model bake-off (Workers AI candidates) per
`Files/ai-assistant-v3-execution-plan.md`, with the strict no-production-changes rule.

---

**Build status (2026-07-18, new session): Co-work-partner pivot (handoff.md) — corpus
harness built and run (partially); confirmed 4 real defects; NO prompt changes deployed
yet (blocked on live re-verification quota, see below).**

Read `Files/handoff.md` in full, then the full 608-row `AI_Stress_Test_Corpus.xlsx`
across all 23 categories (not just the summary in the handoff). Confirms the handoff's
claim: all 33 expected intents map onto existing declared functions — no new function
needed anywhere in the corpus.

**Harness built** at `acrowell-ai-worker/test/corpus/` (`corpus.json` — exported from
the xlsx; `run.ts` — runner/scorer; `README.md` — full write-up of scoring
approximations and results; `results-2026-07-18.txt` — raw run output). Same
zero-production-coupling discipline as `test/bakeoff/`: never imported by `src/`, calls
the live Worker like a real user, never touches `GEMINI_API_KEY`.

**Run outcome: partial, blocked by account exhaustion, not by the harness.** The
Worker's per-user 500,000-token/day cap was already exhausted on all three original
demo accounts (admin/manager/rep@acrowell.test) from earlier same-day verification
before this run even started (226/588 real responses on the first attempt). The user
created 4 fresh accounts (test1-4@enthrella; test3's credentials didn't authenticate,
flagged not resolved); a second run against 3 of those got 437/588 real responses
before ALL SIX demo accounts hit the same daily cap. **Every available demo account is
now exhausted for the rest of 2026-07-18** — the harness itself is done and reusable,
but finishing the remaining ~150 rows needs either tomorrow's KV reset or more demo
accounts.

**On the 437 rows that did get real responses:** intent accuracy 92.4% (404/437),
refusal correctness 84.6% (44/52) — **failing the corpus's own 100% refusal-correctness
gate**, JSON validity 99.8% (one HTTP 500, not reproduced). Full category breakdown and
the approximation caveats (entity coverage is recall-only, not true F1; enum
correctness only checks a curated literal-token set) are in `test/corpus/README.md`.

**4 real, repeatable defects found** (full detail + example utterances in the README):
1. Off-topic chit-chat (cricket scores, weather, news) classified as `smalltalk`
   instead of `unsupported` — the direct cause of the refusal-correctness gate failure.
2. `get_transporter_info` vs `get_party_details` confusion on known courier names
   (Blue Dart, TCI).
3. `get_stats(metric=dues_total)` vs `get_dues_summary` inconsistency, in both
   directions, on near-identical phrasing.
4. Call-recap messages ("baat hui... interested hai... hot kar do", "order confirm kar
   diya call pe") sometimes route to `update_stage`/`update_temp` directly instead of
   `log_call` carrying the same signal via `fu_status`/`set_temp`.

None of these need a new function — all four are `STATIC_SYSTEM_PROMPT` rule-clarity
fixes, same category as Gap A/B in handoff.md. **Deliberately NOT yet fixed/deployed**:
this project's own hard-won discipline (documented earlier in this very file, e.g. the
GLM/Qwen bake-off, and every prompt.ts change since) is redeploy → delete stale cache
key → 3 consecutive live calls confirming `usage.cached > 0` → live acceptance test —
none of that is possible right now with zero available demo-account quota. Deploying a
shared-cache prompt change that touches every company's traffic without being able to
verify it live today is a real risk, not a formality, so it's being held rather than
shipped blind.

**Gap A (bill/PDF photo flexibility), Gap B (smalltalk personality), Gap C
(corrections-within-message verification)** from handoff.md are also blocked on the
same live-quota exhaustion and have not been started this session.

**Next steps, in order, once quota is available (tomorrow, or more demo accounts):**
1. Make the 4 prompt-clarity fixes above, redeploy, cache-reverify, run the acceptance
   rows that specifically failed (see README's mismatch list) to confirm the fix.
2. Finish the remaining ~150 corpus rows to get a full-corpus number.
3. Then proceed to Gap A / Gap B / Gap C per handoff.md §4.

---

**Build status (2026-07-18, same day): all of the above DONE — fixes deployed,
verified live, Gap A/B/C all closed. Two more infra bugs found and fixed along the
way (unrelated to prompt.ts).**

**Infra fixes** (`acrowell-ai-worker/src/index.ts`):
- Token-budget counter was charging `promptTokenCount` (which includes the cached
  prefix) at full weight even though Gemini bills cached tokens at 10% — this is what
  actually exhausted all 6 demo accounts' daily budget after only ~125 real messages
  each during the corpus run, nothing to do with real spend. Fixed: `weightedTokens()`
  charges `cached*0.1 + uncached + output` instead of raw `input+output`.
- The zero-cost greeting shortcut was checked AFTER the token-budget gate, so a user
  whose budget was already blown got 429'd even on a free "hi". Reordered so the
  greeting shortcut is checked first.
- Separately (Cloudflare-account-level, not a code bug): the day's heavy testing
  volume exhausted the account's Workers KV write quota (1,000/day, Free plan),
  500ing every `/chat` request account-wide regardless of user. Resolved by the user
  upgrading to Workers Paid ($5/mo) — not a code change.

**Prompt fixes** (`acrowell-ai-worker/src/prompt.ts`, `validate.ts`) — all 4 defects
from the corpus README, plus 2 more found during acceptance testing (adversarial
code-paste triggering `create_lead` via a literal function name in the pasted text;
a read+write multi-intent read-priority bug) — deployed, cache-reverified (3
consecutive live calls, ~99% cached, prefix ~5,838 tokens, still under the 8K budget),
and confirmed against the exact failing rows via a 33-case hand-built acceptance suite
(`test/corpus/acceptance.mjs`). One fix (multi-intent priority) caused a real
regression on first deploy — a single-action stock-issue message started
hallucinating a quantity instead of asking for the missing one — caught immediately
by the same acceptance suite, fixed by scoping the rule to not override the
missing-required-field rule, redeployed, re-verified clean. Full detail, plus the
handful of accepted low-priority residuals (emoji-only adversarial inputs, one
unstable call-recap phrasing), is in `test/corpus/README.md`.

**Gap A (photo/PDF flexibility) — CONFIRMED WORKING end-to-end with real files.**
Tested live against all 9 files in `stress-test-assets/` relevant to the 6 canonical
scenarios (bill→start_order/add_stock/get_party_dues depending on stated verb, card→
create_lead/create_party, credit note→unsupported) — 6/6 passed, with real data
(party names, phones, addresses, product/batch/qty/expiry) extracted directly from
PDF content via Gemini 3.1 Flash Lite's document understanding. Frontend
(`leadenthrella/src/lib/use-assistant.ts`, `src/components/assistant-chat.tsx`): PDFs
bypass the canvas-downscale path, file input accepts `application/pdf`, attachment
preview shows a file icon instead of a broken image tag for PDFs.

**Gap B (smalltalk personality) — CONFIRMED WORKING.** `smalltalk` now carries a
`subtype` enum (greeting/thanks/farewell/ack/praise/casual); Worker classification
verified live 6/6. Frontend `SMALLTALK_REPLIES` expanded into per-subtype
Hinglish-flavored pools, chosen randomly client-side — option (a) from the handoff.

**Gap C (corrections-within-message) — CONFIRMED: self-correction works whenever the
message has enough information to act.** Ran all 12 corpus rows verbatim: 5/12
resolved directly and correctly (latest value wins); the other 7 omit a required
field in isolation (a single-turn corpus-design limitation, not a prompt gap) — 6 of
those 7 correctly ask for clarification rather than guessing; one residual
(`ST-0416`) still guesses wrong instead of asking, not chased further (needs real
turn-history the single-turn design can't supply).

**Corpus-wide number is directional, not final**: the 437 rows scored before the
fixes and the 151 scored after were never re-run together under identical (post-fix)
code — demo-account message-count budget (400/day/account, separate from the
token-budget bug) ran out before a full uniform re-run was possible. The 33-case
acceptance suite is the authoritative confirmation of the actual fixes; a full
post-fix corpus sweep is cheap to do now (token-budget bug and KV quota both fixed)
whenever another day's allowance or one more demo account is available.

**Still outstanding:** `test6@enthrella`'s credentials never authenticated (same
symptom as `test3@enthrella` earlier this session) — flagged to the user twice, not
resolved. W4B/W4C (invoice PDF generation, order creation UX) from the original V3
execution plan remain not started — secondary to this session's corpus work per the
handoff's own ordering, and Gap A's PDF work covers most of the practical overlap
(reading a bill into stock/dues/order actions) already.

**Update, same day, user supplied a 5th fresh account (test7@enthrella):** ran the
full 588-row (non-vision) corpus sweep uniformly — 93.5% intent accuracy, 91.4%
refusal correctness, 99.0% cache hit. Found and fixed one more real defect:
`navigate_to` over-triggered on "show me my X"/"where do I find X" phrasing (verb
attached to the entities, not a named page) — sharpened the rule to key off what the
verb actually attaches to, deployed, cache-reverified, confirmed 3/3 previously-broken
cases fixed with no regression on 3/3 genuine navigation cases. A second full run to
get a clean post-this-fix number partially hit the account's message-count cap
(400/day, a deliberate design limit) but the 309 rows that completed show 95.1%
intent accuracy — consistent with the prior full run. Three independent large samples
(437, 151, and 550-of-588 valid rows) all land in the 92–95% intent-accuracy band;
this is treated as the stable current state, not chased further. Full detail and the
remaining known residuals (all single-digit occurrence, none blocking) are in
`test/corpus/README.md`. **Co-work-partner corpus workstream considered DONE** for
this session; W4B/W4C remain the next logical work if the user wants to continue.

---

**Build status (2026-07-18, same day): W4B and W4C DONE. Gap B option (b) explicitly
declined by the user — stays as built (subtype + reply pools only).**

**W4C — order-creation UX, real bug found and fixed.** Investigation (via a research
agent) found `start_order`'s own system-prompt description ("deep-links to the
order-creation form with the party preselected") was **not actually true** — the
route already accepted a `?party=<id>` search param and correctly threaded it into
`NewOrderDialog` as `defaultPartyId`, but nothing ever opened the dialog for that
param (only `?dup=<orderId>` did). One-line fix in
`leadenthrella/src/routes/orders.index.tsx`: the auto-open effect now fires on `dup
|| dupParty`. Verified live: navigating to `/orders?party=<id>` now opens New Order
with the party genuinely preselected.

**W4B — invoice PDF/share, wired to existing (not new) infrastructure.** Investigation
found full invoice PDF generation already built and shipped in
`leadenthrella/src/routes/orders.$id.tsx` (jsPDF + jspdf-autotable, html2canvas-pro
for JPG, xlsx export, WhatsApp/email sharing via `src/lib/order-share.ts`) — so "W4B"
became wiring the assistant to trigger that existing flow conversationally, not
building PDF generation from scratch:
- New Worker action `share_invoice(order_query, channel: whatsapp|email|download)` in
  `prompt.ts`/`validate.ts`, resolved the same way as `get_order_status`. Deployed,
  cache-reverified (99% cached, ~5,838-token prefix, still under the 8K budget).
- Frontend (`use-assistant.ts`): new `PendingAction` variant, confirm-card flow
  mirroring `start_order`'s pattern (0/1/many-match handling via the existing
  `resolveOrderMatches`).
- `orders.$id.tsx`: new `?action=share_whatsapp|share_email|download_pdf` search param
  auto-fires the corresponding existing `downloadPdf`/`share` function once on
  arrival, then clears the param.
- **Real bug caught during live testing, before it shipped**: the auto-fire effect
  was first placed after the component's `isLoading`/`!order` early-return guards —
  a Rules-of-Hooks violation (hook count differs between the loading and loaded
  render), causing a live "Rendered more hooks than during the previous render"
  crash caught via the browser preview's console, not by `tsc` (which doesn't check
  hook ordering). Fixed with a "latest ref" bridge: the hook itself moved above the
  guards (unconditional), while the actual `downloadPdf`/`share` closures (which need
  `order` to be non-null and are defined below the guard) get stashed into a ref via
  a plain assignment on every render that reaches that point.
- Verified live: `?action=download_pdf` fires and shows the existing "PDF downloaded"
  toast; `?action=share_whatsapp` fires the existing share flow with no crash,
  behavior matching a manual click of the same button (both equally inconclusive in
  the headless test browser about whether an actual WhatsApp window opens — a
  characteristic of the pre-existing, unmodified `shareFileSmart`/Web-Share-API path
  in a headless environment, not of the new wiring).
- **Not yet live-tested**: the Worker-side `share_invoice` intent classification
  itself (e.g. does "gupta ka invoice whatsapp pe bhejo" actually resolve to
  `share_invoice` with the right channel) — every available demo account (all 8 used
  this session) hit its daily cap before this could be tested. The code mechanically
  mirrors `get_order_status`/`start_order`'s already-proven extraction pattern, so
  confidence is high, but this specific path has not been confirmed with a real
  Gemini call. Verify this first, next session, before considering W4B fully closed.

Five navigation call-sites elsewhere in the app
(`components/notification-bell.tsx`, `components/global-search.tsx` [not flagged,
loosely typed], `components/assistant-chat.tsx`, `routes/transporters.$id.tsx`,
`routes/orders.index.tsx`) needed a `search: { action: undefined }` addition to keep
navigating to `/orders/$id` now that it has a `validateSearch` — confirmed via a
git-stash before/after `tsc --noEmit` comparison that these were the only NEW type
errors introduced (everything else flagged is pre-existing baseline noise, unrelated,
already documented).

---

## Build status — V4 (2026-07-19): Stages 1–3 built, smoke-tested live; full
## acceptance/corpus re-run NOT done — see deviations below

Per `Files/ai-assistant-v4-execution-plan.md` (§6 staged rollout). Sonnet implemented
against the plan across two sessions (Fable planned it same day). Honest status below
— read the "Not done" section before assuming this is fully closed.

**Worker (`acrowell-ai-worker/`)** — `prompt.ts`/`validate.ts`: all 19 new V4 actions
declared and validated (`ACTION_NAMES` 34→53), including the `get_report` mega-action
(16 report types), the `manage_*` sub-record bundles, `export_document`, `update_order`,
and the `plan` action (recursive step validation, max 10 steps, no nested plans). Hard
rule enforced: **no `delete` mode anywhere** in `MANAGE_MODES`/`PARTY_DOC_MODES` (a
"delete" mode briefly existed in a draft and was removed — see the plan's §0). Deployed
and cache-reverified: **8,637 measured tokens, 99.4% cached** — over the plan's 6,000
target/6,500 ceiling, but still safely under Gemini's 9K–17K caching dead zone. This was
an explicit, deliberate tradeoff (documented in a prior session): cutting real
capability/enums/bug-fix rules to force the number under 6,500 was judged not worth a
marginal ~₹100–600/month saving. **Deviation from the plan — flag to the user if this
matters more than it seemed at planning time.**

**Frontend (`leadenthrella/`)** — Stage 2 write handlers: all 17 new `PendingAction`
types have real `confirmAction` cases (direct `supabase` writes or existing mutation
hooks). Stage 3 plan executor: `stepToPending` resolves a plan step's entity silently
(first match, no disambiguation picker — a documented simplification), `handlePlan`
builds a `PlanStep[]`, `confirmPlan` executes steps in order with live per-step
status, stops on first failure, and hands off dialog-opening steps (create_party/
create_product/image-create_lead) to the ordinary top-level confirm-card flow instead
of trying to execute them directly (a plan can't stack N dialogs — must be last step).
`assistant-chat.tsx`'s `MessageBubble` now renders both new `ChatMessage` kinds:
`reportCard` (title + label/value/sub rows) and `plan` (numbered checklist with
✅/❌/⏭️ status once executed, Confirm all/Cancel before that).

**Real bug found and fixed this session**: `stepToPending` originally had NO cases for
any read-only action (`get_report`, `get_party_dues`, `get_party_details`,
`get_product_details`, `get_transporter_info`, `get_stats`, `get_dues_summary`) — every
plan step that was a read fell into a generic "not supported inside a plan" error. This
directly broke the plan's own most central use case (a message combining a write with a
read, e.g. "add this contact and show me their dues"). Fixed by adding a `{ read: () =>
void; summary: string }` result variant to `stepToPending`, with cases for the 7 read
actions above (each resolves its entity, then closures over `pushMessage` to render the
exact same card a single-action message would); `handlePlan`/`confirmPlan` updated to
run these synchronously (no confirm needed for a read) and mark them "done" immediately.

**Live-tested in the browser (manager@acrowell.test, real seeded data, not synthetic)**:
1. The exact original screenshot bug — "Who is our current top-performing client?" —
   now correctly resolves to `get_report(top_customers)` and renders a `reportCard`
   with real ranked data (A.D PHARMACY HARYANA ₹25,632, etc.), replacing the old
   nonsensical `get_stats` answer.
2. A real 2-step compound request — "Add a contact for A.D Pharmacy Haryana named
   Suresh, phone 9998887771, and also show me their total dues" — produced a correct
   2-step plan (`manage_party_contact` write + `get_party_dues` read, found *after*
   fixing the bug above), both steps executed on Confirm, both showed ✅, the contact
   write was verified to have actually persisted (checked the party's Contacts tab
   directly afterward — "Suresh / 9998887771" is there), and the dues card rendered
   the real total (₹25,631.52).
3. Frontend typecheck: net **119 errors vs a 120-error uncommitted baseline** (measured
   via `git stash`/`tsc --noEmit`/`git stash pop` before and after) — zero new
   regressions from any V4 frontend work. Worker repo (`acrowell-ai-worker/`)
   typechecks clean.

**NOT done — do not assume these are covered:**
- The plan's prescribed **~40-case acceptance table** (every report type + export
  doc/channel combo + update_order verb) was NOT built or run. Only the 2 live
  smoke tests above were done.
- **No full corpus re-run** against the V4 vocabulary (608-row harness at
  `acrowell-ai-worker/test/corpus/`). The 2026-07-18 numbers in that folder's README
  predate V4 entirely and should not be read as current.
- The plan's Stage 3 gate ("manually re-score the 12 Multi-intent corpus rows against
  the new plan contract") was not done.
- Only 7 of the read-only action types got `stepToPending` support (the ones judged
  most likely to co-occur with a write in a real compound request: report, party/
  product/transporter lookups, stats, dues). Search-style reads (`search_leads`,
  `search_parties`, `search_products`, `search_orders`, `search_batches`,
  `get_order_status`, `get_stock_on_hand`) still fall through to the plan's generic
  "not supported inside a plan" error if the model ever emits them as a plan step —
  low-probability (these read best as their own message) but not zero, and not
  fixed here.
- `share_invoice`, `update_order`, `export_document`'s own Worker-side intent
  classification (does natural-language phrasing actually route to them) was not
  re-verified this session — only the frontend execution paths for already-classified
  intents were tested.
- No demo-account cleanup was needed (only a real, intended write — Suresh's contact —
  was made, not TEST-prefixed synthetic data; leaving it in place is fine, it's
  realistic seed-adjacent data on a demo account).

**Recommended next step, if picked up again**: build a small, targeted acceptance
pass (10–15 rows covering each report type + the plan's dialog-handoff rule + the
7 supported read-in-plan actions) rather than the full 40-row table or a full corpus
sweep first — the live smoke tests above already give reasonable confidence in the
core mechanism; a full corpus re-run mostly re-validates single-action classification,
which V4 didn't change the underlying rules for outside the 19 new actions.

---

## Targeted acceptance pass (2026-07-19, same day) — the recommendation above, DONE

Ran exactly the "recommended next step" from the section above, live against the
deployed Worker + real seeded demo data (not synthetic rows). All 16 `get_report`
types as manager@acrowell.test, the 2 manager-only reports as rep@acrowell.test,
4 new write actions with TEST-prefixed data, one plan with a `create_party`
dialog-handoff step, and the `share_invoice` classification check. **No code changes
were made** — every finding below is either a pass, a pre-existing/documented
characteristic, or a minor cosmetic/classification nuance not worth prompt churn for.
Per instruction, only genuine failures would have been fixed; none were found.

**All 16 report types — PASS** (manager, real data):
`top_customers`, `top_products`, `rep_leaderboard`, `sales_trend`, `dues_aging`,
`priority_call_list`, `duplicate_leads`, `reorder_due`, `stock_movements`,
`party_ledger`, `transporter_statement` all rendered correct, real data. Three
came back with **sensible empty states** rather than data (`booked_territories`,
`expiring_documents` — this demo company has no monopoly parties or party documents
on file, not a bug). Two minor **cosmetic** nits, not fixed: `payment_mode_breakdown`
and `expiring_stock` render raw snake_case/lowercase enum values (`bank_transfer`,
`safe`) instead of Title Case — cheap to fix later, doesn't block anything.
`product_performance` confirmed the already-documented simplification (ignores
party/product scoping, same ranking as `top_products` — see the code comment at
`use-assistant.ts`'s `product_performance` case) — not new, not fixed.

**Real, narrow finding (not fixed — logged for awareness)**: asking for
`stock_movements`/`get_product_details` on **"Acrocef-200"** (the #1 product shown
on the Dashboard's "Top 5 products" card) returns "product not found." Verified via
the Products page search (413 products, no "Acrocef" match) that this product name
genuinely doesn't exist in the live catalog — the Dashboard/`top_products`/
`product_performance` reports source names from `productSales`, an aggregate keyed
off historical order-item text, which can drift from the current `products` catalog
(renamed/deleted products still show in past sales). This is a **pre-existing
app characteristic**, not a V4 regression — `top_products`/`product_performance`
already worked this way before V4. Any report or plan step needing a `product_query`
match will fail silently-but-correctly ("not found") for a top-seller whose catalog
entry has since changed. Not in V4's scope to fix.

**Manager-only gating — PASS**: `rep_leaderboard` and `payment_mode_breakdown` both
correctly blocked for rep@acrowell.test with the standard Hinglish message; both work
normally for manager.

**4 new write actions — ALL PASS, all verified via independent re-read after
confirming** (not just the confirm-card echo text):
- `update_lead` — renamed a real lead's firm to "TEST- Gupta Medicos", verified on
  the Leads page, reverted back to "Gupta Medicos" after.
- `manage_party_rate` — set Acnolite Soap's rate to ₹99 for Shree Balaji Pharma
  Distributors (as rep@acrowell.test — this action is NOT manager-gated), verified
  via a fresh `list` query. **Leftover, not cleaned up**: this ₹99 rate is still on
  the demo account — the row-click into the party's Negotiated Rates tab wouldn't
  navigate under automation (3 attempts, unclear why — possibly an overlapping
  dialog/z-index issue, not investigated further since it's a UI-navigation quirk
  unrelated to the assistant code), and `manage_party_rate` has no delete mode by
  design (§0 hard rule). **User action needed**: manually remove this test rate from
  Shree Balaji Pharma Distributors's Negotiated Rates tab if it matters.
- `adjust_stock` — corrected ACROMOL-P's batch to 40 units (its actual current
  count, so effectively a no-op write) as manager — confirmed persisted. No cleanup
  needed.
- `manage_transporter` — added "TEST- Acceptance Transporter 2" as manager, verified
  on the Transporters page, then **deactivated it** (toggled Active off — the
  Transporters UI has no delete, only an Edit dialog with an Active switch; this is
  the cleanest available cleanup given the app's own no-hard-delete philosophy).

**Gotcha hit repeatedly during this pass, worth remembering**: when multiple
confirm/plan messages accumulate in the same chat session, a naive
`querySelectorAll('button').find(...)` for "Confirm" grabs the **first** matching
button in the DOM (old, already-actioned cards' buttons don't get removed), not the
newest one — this caused one silent misfire (clicking an old "Confirm" re-triggered
nothing new) before switching to always selecting the **last** match. Not a product
bug — an artifact of how this test automation queried the DOM.

**Plan + `create_party` dialog-handoff — PASS, exactly as designed**: prompted
"mujhe aaj ke priority calls dikhao, aur ek naya party bhi banao 'TEST- Acceptance
Party' naam se Pune mein" (report + create_party). The model correctly ordered
`create_party` **last**. On Confirm all: step 1 executed and showed ✅ with the real
report card; step 2 showed ⏭️ with "Isse form khol ke complete karo — neeche dekho.";
a fresh confirm bubble ("Review & save") appeared; clicking it opened the real New
Party dialog, correctly prefilled with firm name "TEST- Acceptance Party". Closed
without saving — no cleanup needed, nothing was written.

**`share_invoice` classification — MOSTLY PASS, one real narrow gap found**:
- "AL25-26/0068 invoice ko whatsapp share karo" (invoice number + explicit
  share/bhejo verb) → correctly classified as `share_invoice(channel="whatsapp")`,
  produced the right confirm card. Cancelled before executing (no need to re-verify
  the actual WhatsApp hand-off — W4B already proved that mechanism works).
- "A.D Pharmacy Haryana ka invoice whatsapp pe bhejo" (party name + "invoice" +
  channel word, but the share verb reads more like it's modifying "invoice" than
  clearly invoking a share action) → **misclassified as `search_orders`**, returning
  a plain order lookup instead of a share confirm card. Real, minor, not fixed
  (prompt-clarity tuning, same category as the pre-V4 corpus defects) — logged here
  rather than chased, since the precise phrasing works and this wasn't in the
  4-case check scope beyond "does it work at all" (it does, with the right phrasing).

**Net assessment**: no real failures found that warranted a fix. The V4 build (all
4 stages) is functionally sound on this targeted pass. Remaining honest gaps are:
the ₹99 test rate needing manual removal, the two cosmetic label nits, the
Acrocef-200-style stale-catalog-name limitation, and the one `share_invoice`
phrasing gap — none blocking. The full 40-case table and full corpus re-run remain
not done, per instruction (out of scope for this pass).

---

## Correction (2026-07-19, same day) — the dialog-handoff test above was PASS for
## the wrong reason; a real bug was found by the user manually testing the exact
## flagship scenario, and has now been fixed

The acceptance-pass entry above ("Plan + `create_party` dialog-handoff — PASS,
exactly as designed") tested `create_party` followed by a **read** step
(`get_report`). That masked a real bug: when the step *after* `create_party` is a
**write that targets the new party** — e.g. exactly the flagship example from the
original V4 planning conversation, "add this new party and start their first
order" — the plan silently died after the party was saved. The user hit this live
and reported it.

**Root cause, found by tracing the code (two compounding bugs):**
1. `handlePlan` resolved every step **at plan-build time**, before the dialog
   handoff even ran — so a later step like `start_order` was fuzzy-matched
   against whatever party *already existed* with a similar name (in the
   reproduction case, this demo company has literal placeholder parties named
   "M/s XYZ", and the plan happily wired the order to one of those instead of the
   party about to be created).
2. Even when a later step's target genuinely didn't exist yet, `confirmPlan`'s
   dialog-handoff branch had no mechanism to resume the plan after the dialog was
   saved — it always just stopped, permanently. The design doc's own words
   ("hand it off... and stop the plan there") turned out to describe a dead end,
   not a pause.

**Fix (`leadenthrella/src/lib/use-assistant.ts`,
`leadenthrella/src/components/assistant-chat.tsx`,
`leadenthrella/src/routes/products.tsx`)**: added a new `PlanStep` kind,
`"deferred"` — `handlePlan` now defers (does not fuzzy-resolve) any step that
targets a party/product when an earlier step in the *same* plan creates a
party/product. Once `PartyDialog`/`ProductDialog`'s `onCreated(id)` fires (added
to `ProductDialog`, which previously had no such callback at all), a new
`resumePlanAfterEntityCreated(entityType, id, deferredSteps)` fetches the real
entity and resolves each deferred step **directly against it — no name-matching**,
then re-offers them as a fresh confirm/plan card (still requires the user's
Confirm, preserving the "every write keeps a visible confirm step" rule — the bug
was that nothing happened, not that one more click is required).

**Verified live** (manager@acrowell.test): "naya party 'TEST- Plan Resume Party'
naam se Ahmedabad mein banao, aur unke liye pehla order start karo" — step 2 now
shows "Open new order (once the new party is saved)" instead of wrongly resolving
early; after saving the party, a fresh "Open new order for **TEST- Plan Resume
Party**?" confirm bubble appeared automatically; confirming it navigated to
`/orders?party=<the-real-new-id>` and the New Order dialog opened with that exact
party preselected. Also verified no regression: a plan with no `create_party` step
(add a contact + show dues, both against an already-existing party) still resolves
both steps immediately, unaffected by the new deferral logic. Frontend typecheck
stayed at the 119-error baseline (no new errors). Committed as `85013a2`.

**Still not covered by this fix** (out of scope, not requested): a `create_lead`
(image-sourced) step followed by a write on that new lead — plans don't carry
images in practice (only one photo can be attached per message, and a plan is
built from a single text/photo message), so this combination is unlikely to occur
and wasn't implemented. Only `create_party`→party-writes and
`create_product`→product-writes are covered.

---

## Build status — V5 (2026-07-19, evening): AI bill extraction — all 3 stages BUILT

Per `Files/ai-assistant-v5-bill-extraction-plan.md`. Triggered by the user finding,
live, that "is bill se order banao" opened a genuinely empty order form (start_order
was deep-link-only by V4 design), and that the Orders manual import's PDF/image path
was a regex heuristic producing garbage — including on `Invoice_INV_2026_003.pdf`,
an invoice **this app's own PDF exporter generated**, which the old importer mapped
`party_name → "tal Rs. 1"`.

**Stage 1 — Worker `POST /extract`** (`acrowell-ai-worker/src/extract.ts`, wired
into `index.ts` alongside `/chat`). Deliberately a separate, uncached Gemini call
using `responseSchema` structured output (no function calling, no intent
classification) — the /chat cached prefix (8,637 tokens) was NOT touched, avoiding
any risk of the 9K–17K caching dead zone. Shares /chat's auth + message-count rate
limit; has its own token-budget check and a ~15MB base64 size cap. Deployed and
**live-tested with real curl calls (Supabase password-grant token + base64 file,
same pattern as the V4 acceptance sessions) against all three of the user's actual
files**:
- `Demo Bill.pdf` → 14 line items, invoice AL26-27/2139, 2026-07-06, party "M/s XYZ" — all products/HSN/pack/batch/qty/rate/GST correctly extracted, `subtotal`/`gst_total`/`grand_total` present.
- `Demo Bill jpg.jpeg` (same bill, photographed) → same 14 items via the image path, confirming both PDF and image inputs work.
- `Invoice_INV_2026_003.pdf` (the app's own generated invoice — the harshest test) → **exactly right**: invoice_no `INV-2026-003`, date `2026-07-02`, 2 line items (Acrocold Syrup, Acrozinc Drops) with correct qty/free/MRP/rate/disc%/GST%, `grand_total: 2053.52` matching the real order's total shown elsewhere in the app to the rupee. `party_name` came back `null` (not fabricated) since it wasn't clearly labeled on that PDF layout — correct null-when-absent behavior, not a miss.

**Stage 2 — Assistant chat prefill** (`use-assistant.ts`, `orders.index.tsx`).
`send()` now fires `/extract` in the background (via a ref, not state) the instant
it sees a bill attached to a message whose intent resolves to `start_order` —
directly, or as a step inside a multi-step plan — so extraction runs in parallel
with the rep reading/confirming, not serially after. `confirmAction`'s `start_order`
case consumes the ref exactly once (regardless of outcome, so nothing stale can
leak into a later unrelated order), matches each extracted line item's product name
against the catalog via the existing `resolveProductMatches` helper (falls back to
a free-text row — already a fully valid state in this app — when no match), writes
the result to a time-boxed (10 min) consume-once `sessionStorage` key, then navigates
to `/orders?party=<id>` exactly as before. `NewOrderDialog` reads+deletes that key on
auto-open, guarded so it can never fire during the unrelated "repeat last order"
duplicate-flow. **Live-verified end-to-end in the browser**: seeded `sessionStorage`
with the exact payload shape `confirmAction` produces (2 real items from the Demo
Bill extraction, against the real "Gupta Medicos" party id — the same party+id the
user's own live bug report screenshot showed), navigated to `/orders?party=<id>`,
and confirmed the New Order dialog opened with the party, invoice no/date, and both
line items (pack/batch/qty/MRP/rate correctly filled, subtotal/GST/total computing
live) — plus the toast "Filled 2 items from the bill — please review before saving."
Confirmed consume-once (key was gone after read) and confirmed a second load of the
same URL opens party-only with a blank line item (no stale leakage). This exact
seeded-payload test doesn't exercise `send()`'s own `/extract` fetch call or the
`resolveProductMatches` fuzzy-match step — those were verified separately (Stage 1's
curl tests prove the fetch/response shape; `resolveProductMatches` is pre-existing,
already-proven code reused as-is, not new logic) — but the actual bug the user hit
(dialog opens, nothing downstream happens) is conclusively fixed and demonstrated.

**Stage 3 — Manual import AI extraction** (`orders.index.tsx`'s `ImportDialog`).
PDF/image uploads now call `/extract` first; on success the extracted invoices are
flattened into rows using the exact canonical `ORDER_FIELDS` keys, and — because
those keys already match `ORDER_FIELDS` exactly — the column-mapping screen (step 2)
is skipped entirely via an identity mapping, landing straight on the preview step
(3). On any extraction failure (network error, 422 no-invoices-found, no session),
it falls through unchanged to the old regex/OCR engine, so nothing regresses for
Word/HTML imports or on a genuine extraction failure. CSV/Excel are completely
untouched. **NOT live-tested via a real file picker** — every browser automation
tool available this session (the in-app Browser pane has no file-upload capability
at all; Claude-in-Chrome's `file_upload` tool exists but rejects any path not
already "shared with this session," which `~/Downloads` files aren't, even when
directly referenced via `@path` earlier in the conversation) refused to attach a
real file to this specific input, the same wall hit for Stage 2's chat-attach path
before the sessionStorage-seeding workaround was used instead. That workaround
doesn't apply here since this path's entry point is a real native file input, not
JS-settable state. Verified instead by code inspection: the row-shape builder here
is structurally identical to Stage 2's (same field names, same source data), the
Worker call is byte-identical to the curl calls already proven in Stage 1, and the
identity-mapping → `rowsToInvoices` → preview path reuses pre-existing, already-
working code unchanged. **Recommended next step**: the user clicking "Upload bill"
and picking one of the three real files once, live, to close this out — expected to
work given the above, but not yet witnessed firsthand.

**Cost**: ~₹0.01–0.05 per extraction call (measured: Demo Bill.pdf used 720 input +
2106 output tokens uncached; Invoice_INV_2026_003.pdf used 720 + 414). Runs only
when a file is actually attached to an order-ish chat message or uploaded to import
— not on every message.

**No migrations needed** (verified true, per the plan's §2 hard-rule check) — V5 is
100% Worker + frontend code, zero schema changes.

---

## Build status — V6 (2026-07-20): New Order UX + robust bill import — all 3 parts BUILT

Per `Files/ai-assistant-v6-order-ux-and-robust-import-plan.md`. Triggered by the user's own
screenshots of the live V5 build working, plus three concrete UI complaints and one more
real import bug (`bill5_wide_shreebalaji.jpg` → 49 garbage mapping rows). 100% frontend
(`src/routes/orders.index.tsx`, `src/lib/use-assistant.ts`, `src/components/assistant-chat.tsx`)
— zero Worker, prompt.ts, or migration changes, as scoped.

**Part A — New Order dialog UX** (`NewOrderDialog` in `orders.index.tsx`):
- New `ProductCombobox` component replaces the old stacked `<Select>` + "or type" `<Input>`
  with one creatable search box — reuses the existing `resolveProductMatches` matcher (no
  new fuzzy-match logic), shows pack/composition as a subtitle, and a
  `Use "…" as a new product` row for off-catalog names (sets `product_id: null`, matching the
  app's pre-existing free-text-item support).
- Dialog widened (`max-w-5xl w-[95vw]` → `w-[95vw] max-w-[1400px]`), per-cell input widths
  shrunk/made responsive, table wrapper's forced scrollbar limited to below `md`.
- "Add row" moved from the Line Items header (top-right) to a left-aligned button directly
  above the Subtotal/Discount/GST/Total summary row.
- `DialogFooter` given `className="sm:justify-start"` (shadcn's `cn()` merge correctly
  overrides the component's own default `sm:justify-end`) — Cancel/Save as draft/Save Order
  now left-aligned, same order as before.
- **Real bug found and fixed during this session's own live verification** (not reported by
  the user — caught before shipping): the `ProductCombobox` dropdown is rendered via
  `createPortal(..., document.body)` specifically to escape shadcn's `<Table>` component,
  which hardcodes its own `<div className="relative w-full overflow-auto">` wrapper
  (`components/ui/table.tsx`) that isn't reachable via any className prop — the dropdown was
  confirmed present in the DOM/accessibility tree with correct filtered matches but never
  visually painted, silently clipped invisible. Portaling fixed the visibility, but
  introduced a SECOND bug: the existing click-outside-to-close handler only checked
  `boxRef` (wrapping the input), not the now-portaled dropdown — so a `mousedown` on any
  suggestion closed the dropdown (unmounting the portal) before the button's own `onClick`
  could fire, silently swallowing every single pick (confirmed live: picking a product
  added a blank extra row instead of filling data). Fixed by also tracking a `dropdownRef`
  on the portaled content and treating clicks inside it as "inside" for the outside-click
  check. **Live-verified after the fix** (via direct DOM `input.value`/button-click checks,
  since the in-app Browser pane's own file-picker-adjacent click flakiness this session made
  screenshot-timed clicks unreliable for this specific interaction): typing "acro" correctly
  lists Acrobast-10/-20/Acrobate/Acrobate-S/ACROCAL with pack/composition subtitles + a
  "Use as new product" row; clicking a match now correctly fills `product_name` AND
  autofills pack/MRP/rate/GST via the existing `pickProduct` logic (confirmed: picking
  "Acrobast-10" filled Pack "10x10, Alu/alu", GST% 12). Also re-verified after this fix that
  the V5 bill-prefill flow (sessionStorage → off-catalog product names with `product_id:
  null`) still displays correctly through the rewritten combobox — seeded a real
  extraction-shaped payload, confirmed "ALOEVERA AMLA JUICE" displayed with its pack/batch/
  qty/MRP/rate/GST filled and the correct subtotal/GST/total computed live.
- Live-verified the layout itself too: at 1280px width, all 11 line-item columns (Product,
  Pack, Batch, Expiry, Qty, Free, MRP, Rate, Disc%, GST%, Amount, delete) are visible with
  no horizontal scrollbar; "Add row" sits bottom-left above the subtotal cards; the footer
  buttons are left-aligned.

**Part B — Orders list "Sort by"** (`OrdersPage` in `orders.index.tsx`): a `sortBy` state
(default `date_desc`) plus a `SORT_OPTIONS` `<Select>` added to the Filters card, applied
inside the existing `filtered` `useMemo` as a `.sort()` on a copy of the filtered array
(never mutates the `orders` query-cache array). Six options: invoice date newest/oldest,
amount high/low, last edited (`updated_at` desc), last uploaded (`created_at` desc) — all
fields already existed on the `Order` type, so this needed zero new queries. **Live-verified**:
switched to "Amount (high to low)" and confirmed the list re-ordered correctly
(₹25,631.52 → ₹18,912.30 → ₹11,471.04 → … descending, replacing the prior date-ordered list).

**Part C — Robust AI bill import** (`use-assistant.ts`'s new `prepImageForExtraction`;
`ImportDialog.handleFile` and `send()`'s extraction trigger in `use-assistant.ts`/
`assistant-chat.tsx`):
- New `prepImageForExtraction(file)` in `use-assistant.ts`, used ONLY by the two bill-
  extraction call sites (chat's `send()`, the Orders manual import) — `downscaleImage`
  (1024px/0.8-quality, 8MB hard throw) is unchanged and still used by every other photo flow
  (visiting card → lead, medicine box → product). The new function: raises the source-size
  ceiling to 20MB (from 8MB), starts at 2048px/0.85 JPEG quality, and iteratively shrinks
  dimension/quality (down to a floor of 0.5 quality) across up to 6 attempts until the
  base64 payload fits under a 14MB budget (the Worker caps at 15MB) — a big bill photo now
  degrades gracefully instead of hard-failing.
- Chat side: `handleSend` in `assistant-chat.tsx` now also passes `lastPhotoFile` (the
  already-tracked full-quality original File, previously only used for product-photo
  uploads) through to `send()`, which now accepts an optional third `originalFile` param.
  When bill extraction fires, it prefers `prepImageForExtraction(originalFile)` over the
  low-res `image` already sent to `/chat` for classification, falling back to the low-res
  copy only if no original File is available. This also fixes a latent V5 gap: chat-attached
  bill extraction was previously using the SAME 1024px copy as classification, which would
  have hit the same legibility ceiling as the import bug below for a dense/wide bill photo.
- Import side: the PDF/image branch of `ImportDialog.handleFile` is now AI-only — no more
  falling through to the old regex parser (`import-orders.ts`'s `parseOrderFromExtract`/
  `parseOrderLine`) on a failed or empty extraction. On failure it shows
  `"AI couldn't read that bill clearly. Try a sharper photo or a PDF, or add the order
  manually."` and stays on step 1 (file picker) — the garbage-mapping-screen experience is
  now structurally impossible for a bill. Word/HTML/txt/tsv files are completely unchanged
  (still route through `extractRecordsFromFile` + the old structured/regex-fallback split —
  they legitimately have real table structure or none, unlike a bill).
- Dialog retitled from "Import Excel / CSV" to "Upload a bill"; drop-zone copy now leads
  with "Photograph or PDF a distributor bill — AI reads the items automatically."
- **Typecheck**: repo-wide error count is unchanged at 132 (confirmed via `git stash`/
  `tsc --noEmit`/`git stash pop` — this is the current committed-HEAD baseline, all
  pre-existing and unrelated: stale generated Supabase types in `use-transporters.ts`,
  `use-parties.ts`, `platform.*`, etc. — a prior summary's "119" baseline was stale from an
  earlier point in history, not a regression introduced here).
- **Not click-tested with a real file** (same documented environment limitation as V5 Stage
  3 — no browser automation tool this session can attach a `~/Downloads` file to a native
  file input). Verified by code inspection: the row-flattening logic is unchanged from the
  already-curl-proven V5 Stage 1 Worker response shape, and `prepImageForExtraction`'s image
  path was exercised indirectly via the New Order dialog's own bill-prefill re-verification
  above (same function, different call site). **Recommended next step**: the user uploading
  `bill5_wide_shreebalaji.jpg` (the one that failed before this fix) via "Upload a bill" to
  confirm it now reaches a correct preview instead of the garbage mapping screen.

**Environment note for future sessions**: this session's Radix `DropdownMenu` trigger (the
"New Order" split button) became extremely unreliable to click via every browser-automation
method tried (ref click, coordinate click, JS `.click()`, synthetic pointer-event sequences,
keyboard nav) — intermittently worked, more often silently no-opped. The reliable workaround
used here: navigate directly to `/orders?party=<id>` (or `?dup=<id>`), which auto-opens
`NewOrderDialog` via its existing `useEffect`, sidestepping the dropdown entirely. For
interactions inside an already-open dialog/portal, driving the DOM directly via
`javascript_exec` (focus + native-setter value + `dispatchEvent`, then `.click()` on the
target button) proved far more reliable than the `computer` tool's coordinate/ref clicks this
session — worth trying first if similar flakiness recurs.

---

## Build status — V7 (2026-07-20): import review/edit, order editing, big bills, English UI, sorting — all 5 parts BUILT

Per `Files/ai-assistant-v7-import-review-edit-i18n-sort-plan.md`. Triggered by five follow-up
issues from live V6 testing. **Baseline correction**: the plan's stated 132-error `tsc --noEmit`
baseline was stale — this session confirmed (via `git stash`/`tsc`/`git stash pop`, current
committed HEAD) the real baseline is **125**, all pre-existing/unrelated (stale generated
Supabase types). Every part below was checked against 125 and introduces zero new errors.

**Part A — manual bill import → New Order dialog** (`src/routes/orders.index.tsx`): a
single-invoice AI extraction from `ImportDialog.handleFile` now calls a new `onSingleInvoice`
prop instead of falling into the step-3 bulk summary, closing the import dialog and opening
`NewOrderDialog` via a new `prefillOrder` prop (party matched case-insensitively by firm name,
line items mapped through the existing `resolveProductMatches`, exactly mirroring the V5
sessionStorage prefill shape). Multi-invoice scans and CSV/Excel/Word/HTML imports are
untouched. Party left blank on no match (no auto-create) — the rep picks/creates via the
existing "+ new party" button, per the plan's explicit instruction not to auto-create here.

**Part B — edit an existing order** (`orders.$id.tsx`, `orders.index.tsx`): `NewOrderDialog`
gains an `editOrderId` prop, sharing the existing `duplicateFromOrderId` fetch (`sourceOrderId
= duplicateFromOrderId ?? editOrderId` — the two modes are mutually exclusive by construction,
never both set) but additionally preserving invoice no/date/notes and passing `id: editOrderId`
to `save.mutateAsync` so `useSaveOrder`'s existing update-in-place path fires. New "Edit" button
on the order detail page's action row; dialog title switches to "Edit Order", success toast to
"Order updated".

**Part C — big bills (Worker `extract.ts`)**: `maxOutputTokens` raised 4096 → 16384,
`MAX_ITEMS_PER_INVOICE` raised 100 → 300. Added a generic bracket-depth-tracking
`attemptSalvage()` that, on `JSON.parse` failure, finds the latest point where a complete
JSON element had just closed (outside string literals) and closes the remaining open
brackets there — verified with a synthetic truncated-mid-item payload (Node script, not
live Gemini): correctly recovered 2 of 3 items from text cut mid-way through the 3rd, and
correctly returned `null` (not a crash) when no complete item exists at all. Deployed via
`npx wrangler deploy` (worker lives in a sibling, non-git directory
`Pharma BMT/acrowell-ai-worker`, so no repo commit for this part — matches how prior Worker-only
fixes shipped). **NOT live-curl-tested against a real 150+ item bill** — this session had no
Supabase user credentials available to mint a password-grant token (unlike prior sessions,
where that token apparently came from the live session's own interactive testing). Recommended
next step: the user (or a future session with credentials) curling `/extract` with a genuinely
large bill to confirm ≥100 items round-trip, per the plan's acceptance criterion.

**Part D — English-only UI** (`src/lib/use-assistant.ts`): ~45 hardcoded Hinglish strings
(resolver "not found" messages for party/product/transporter/lead/order, disambiguation
titles, channel labels "Send via WhatsApp"/"Send via email"/"Download", `ROLE_BLOCKED_MESSAGE`,
plan-step error strings, report empty-state prompts) converted to English via a scripted exact-
string replace, then a manual sweep for stragglers with different variable names (`${query}`
vs `${args.party_query}` forms). `SMALLTALK_REPLIES` (lines 793–823) is untouched — still
Hinglish, the co-worker's intentional casual voice. `prompt.ts` untouched (no cache ritual
needed). The `orders.index.tsx` import `busyMsg` ("AI se bill padh raha hoon…") is now
"Reading the bill with AI…". Repo-wide grep for the plan's acceptance token set, and a broader
independent Hindi-word sweep, both confirm zero hits outside the smalltalk block afterward.
One intentional exception left as-is: the dues-view help hint's Hinglish example question
("gupta ke kitne paise bakaya hai") — this demonstrates accepted Hinglish INPUT phrasing
inside an otherwise-English help string, not deterministic app-chrome output, so it wasn't in
scope per the plan's own rule.

**Part E — Sort-by dropdowns** (`src/components/sort-select.tsx` new; `parties.index.tsx`,
`products.tsx`, `leads.index.tsx`): new generic `SortSelect<T>` component (thin wrapper around
the existing shadcn `<Select>`, matching Orders' pattern) — used as-is on Parties and Leads;
Products keeps its existing raw `<Select>` (per the plan's explicit instruction, to preserve
the bestsellers option's `TrendingUp` icon) and just widens the union/options. Parties' old
`sortByReorder`/`sortByDues` checkboxes fold into one dropdown (reorder-due-first / highest-
dues / name A–Z / newly-added / last-edited), with a backward-compatible migration in
`applyView()` for anyone's pre-V7 `localStorage` saved-view shape. Products gains newly-added/
last-edited/MRP-high-to-low/on-hand-stock-high-to-low alongside the existing name/bestsellers.
Leads gets its first sort control (newly-added default, last-edited, name A–Z, next-follow-up-
soonest, temperature Hot→Cold via a small `TEMP_ORDER` map).

**Not live-tested in the browser** — this session had no login credentials for the app (a
real Supabase user email/password), and entering credentials on the user's behalf is outside
this session's remit regardless. Verified instead by: `tsc --noEmit` staying at 125 (zero new
errors) after every part, a clean `vite dev` compile with no build/HMR errors, and careful
code-path reading against the existing (already-proven) V5/V6 prefill/sort logic each part
extends. **Recommended next step**: the user click-testing all five parts live — especially
Part A's single-invoice import prefill and Part C's big-bill extraction, the two riskiest
pieces — per the plan's acceptance criteria.

**Commits** (local only — `git push` failed with `fatal: could not read Username for
'https://github.com': Device not configured`; per the `feedback-github-push` memory's own
fallback, left local for the user to push via GitHub Desktop):
- `14180ba` — Part A+B (orders.index.tsx, orders.$id.tsx)
- `290542f` — Part D (use-assistant.ts)
- `73918ff` — Part E (sort-select.tsx, parties.index.tsx, products.tsx, leads.index.tsx)
- Part C has no repo commit (separate non-git Worker directory, already deployed live).
