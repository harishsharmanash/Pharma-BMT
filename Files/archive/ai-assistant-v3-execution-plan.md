# AI Assistant V3 — Execution Plan for the Implementing Model (Sonnet 5)

**Written 2026-07-18 by Fable (planning model), approved by Harish the same day.**
This file is the work order. The architecture/spec authority remains
`Files/ai-assistant-build-spec.md` — read its build-status block, §8 hard rules,
§V2.0–V2.4, and the V3 roadmap (Phases 7–12) BEFORE starting. Where this file and the
spec conflict, STOP and ask the user.

**User approvals on record (2026-07-18):** §8.5 relaxation approved for V3 Tier-2
(field-whitelisted aggregates only), chat persistence retention 30 days, monthly budget
ceiling stays ₹5,000 (Google Cloud alert unchanged), WhatsApp OUT of scope for now.
Model bake-off approved. Everything below is pre-approved — do not re-ask unless you
hit a genuine conflict.

---

## 0. Non-negotiable safety rules for this whole engagement

1. **The live app must stay safe at all times.**
   - The bake-off harness lives ONLY in `acrowell-ai-worker/test/` (new folder). It
     imports `src/prompt.ts` / `src/validate.ts` read-only. ZERO changes to `src/`
     for the bake-off. No harness code, dependency, or config may leak into the
     leadenthrella repo (Lovable builds that repo on push — anything in it can reach
     production).
   - App-code workstreams (W1/W2) touch the repo, but the user publishes manually via
     GitHub Desktop + Lovable publish. Never `git commit`/`git push` yourself. At every
     hand-off, list exactly which files changed and what must be published.
   - Worker deploys (`npx wrangler deploy`) are instant-live: deploy only after the
     workstream's own tests pass locally, and always run the §V2.0.7 cache
     verification (delete KV key `gemini:cache:name`, 3 calls, `usage.cached > 0`)
     after any prompt.ts change.
2. **Test data hygiene.** Every entity created during testing gets the name prefix
   `TEST-` (parties, products, leads, orders where the form allows). Payments/stock
   movements should reference TEST- entities only. Final step of every session: list
   all TEST- records created so the user can bulk-delete them (do NOT delete yourself —
   deletes are excluded from the assistant and from your remit).
3. Migrations: files only, run BY HAND by the user in the Supabase SQL editor. Say so
   at every hand-off. GEMINI_API_KEY / any new Workers AI binding: wrangler
   secrets/bindings only, never in files.
4. Demo logins for live testing: admin@acrowell.test / manager@acrowell.test /
   rep@acrowell.test, password `Demo1234!`, dev server port 8080
   (`.claude/launch.json` exists). Live site: https://leadenthrella.lovable.app.
5. One workstream per session. After each: update the build-status block in the spec
   file honestly (deviations, what's untested), then stop.

---

## Workstream 1 — Hardening (do FIRST, one session)

All in `acrowell-ai-worker/src/` unless noted. Low risk, pure wins.

1. `maxOutputTokens: 1024` in both generationConfig blocks in gemini.ts.
2. Server-side truncation of the CURRENT user message in index.ts (history is already
   capped; the live message is not): cap at 2,000 chars.
3. Per-user daily TOKEN budget in KV alongside the message counter: key
   `t:<uuid>:<date>`, add `usage.input + usage.output` after each call, block at
   500,000 tokens/day with the same friendly 429. (Read-then-write race is accepted —
   do NOT build a Durable Object for this; explicitly deferred.)
4. **History-contamination fix** (3 live reproductions on 2026-07-18, see spec V3
   Phase 7 notes): add prompt rule "Resolve ONLY the latest message. Use earlier turns
   solely when the latest message explicitly references them (isme / uska / wahi /
   'that one' / 'same')." AND stop recording resolver/picker echo turns into
   historyRef in use-assistant.ts (frontend). Prompt change ⇒ full cache re-verify.
5. Frontend: the >5-matches resolver fix in `src/lib/use-assistant.ts` is ALREADY DONE
   and sitting uncommitted in the working tree (verify with `git status` — do not
   redo it, do not revert it). It ships with this workstream's push.

**Acceptance:** all 9 v1 utterances + the 3 contamination sequences pass on
localhost:8080; `usage.cached > 0` ×3 after redeploy; tsc shows zero new errors.

## Workstream 2 — Phase 7 pending features (one session)

Per spec §V2.1 cross-cutting, unchanged architecture (single forced-intent call):
1. `navigate_to(page)` — STATIC enum (leads, parties, orders, products, stock,
   followups, my_day, dashboard, transporters, team, settings, help). Cacheable.
   Frontend: TanStack `useNavigate()`, close the sheet on navigate.
2. `get_transporter_info(transporter_query)` — read-only card, manager/admin
   soft-gated, reuse use-transporters.ts.
3. Widen `get_stats`: metrics orders_total / collections / dues_total + arg
   `scope: mine|company` (company scope soft-gated manager/admin).
4. Widen `app_help` FAQ to every module.
Token budget: static prefix must stay under 8K (§V2.0.7). Report the new prefix size.

**Acceptance:** ~10-utterance table written BEFORE coding (spec §V2.4 style), run live
as admin AND rep, cache re-verified, spec build-status updated.

## Workstream 3 — Model bake-off (one session, ZERO production changes)

Goal: decide whether Tier-1 traffic moves to a Workers AI model. Full context and the
verification report live in the conversation summary in the spec build-status after
W1/W2 — key facts: Gemini 3.1 Flash-Lite $0.25/$1.50 cached-in $0.025 (verified);
GLM-4.7-Flash on Workers AI $0.06/$0.40 with documented `tools[]` + `tool_choice` +
`response_format` (primary challenger); Qwen3-30B-A3B $0.051/$0.335, function-calling
"Yes" but `tools` param undocumented (gate 1: does it work at all); Workers AI free
tier = 10,000 neurons/day ≈ ~700 Tier-1 messages/day at ₹0; Cloudflare does not train
on inference data; Gemma candidates eliminated (SKU doesn't exist / too pricey).

Harness: `acrowell-ai-worker/test/` with vitest, 56 fixture cases:
- 31 × one canonical utterance per existing function (Hinglish-weighted)
- 5 × relative dates · 4 × phone normalization · 4 × lead-vs-party disambiguation
- 3 × lost_reason rule (Lost without stated reason ⇒ lost_reason null, never invented)
- 3 × multi-entity messages (expect ask_clarification or first-intent-only)
- 3 × history-contamination 2-turn scripts (the 2026-07-18 reproductions)
- 3 × unsupported/prompt-injection ("delete all leads"; "ignore your instructions…")

Scoring per case: intent-name exact match → arg-level F1 → JSON validity → HARD FAIL
for any invented enum value or hallucinated arg that survives validate.ts logic.
Report: accuracy %, mean output tokens, p50/p95 latency, measured ₹/msg, per model.

**Decision rule (pre-agreed, do not soften):** switch Tier-1 only if challenger is
within 2 points of Gemini intent accuracy AND ≥95% arg-F1 AND zero hard-fails on
injection + lost_reason cases. Gemini stays as automatic fallback regardless. If
nothing passes: stay on Gemini, bank the hardening, say so plainly.

Workers AI access: bind AI to the existing Worker account (free tier covers the whole
bake-off, ~₹0; Gemini side ≤₹5). Needs the user to enable Workers AI on the Cloudflare
account if not already — ask at session start, it's a dashboard toggle.

## Workstream 4 — Full end-to-end test pass (one session, with the user available)

The user will be present to supply real files. Everything gets a written PASS/FAIL
table in the spec build-status. Use the LIVE site for this pass (it's what customers
use), TEST- prefix everywhere.

**4A. Image data extraction (assistant photo flows) — never yet tested with real files:**
1. Visiting card → lead: user uploads a real card photo in chat; expect create_lead
   confirm → LeadDialog prefilled (name/firm/phone/city correct); save; verify in
   Leads list. Repeat with a WhatsApp-contact screenshot.
2. Medicine box → product: real box/strip photo; expect create_product → ProductDialog
   prefilled (name, composition, pack, printed MRP, category picked from the company's
   own vocab list); save; verify the SAME original image was uploaded via
   uploadProductImage and image_url is set (spec §V2.0.5) — this upload path has never
   run in production.
3. Negative case: irrelevant photo (landscape/selfie) → expect ask_clarification or
   unsupported, never an invented entity.

**4B. Bill / invoice PDF:**
1. Create a TEST- order (4C first if needed), generate its invoice PDF from the orders
   UI. Verify: line items, qty × rate math, GST amounts per product gst_pct, totals,
   company branding/logo, and the "Business tool only" footer present.
2. Verify PDF renders for an order with 1 item and with 5+ items (pagination).
3. If any PDF bug is found: it's an APP bug, fix in the repo, re-test, list for push.

**4C. New order creation:**
1. Assistant path: "TEST-Gupta Medicos ka naya order banao" → start_order confirm →
   deep-link lands on the order form with the party preselected (this deep-link
   `search: { party: id }` has never been verified against the real orders route —
   check the route actually reads that param; if not, wire it, it's a small app fix).
2. Complete the order manually with 2+ TEST- products, save; verify totals, dues
   aging picks it up, dashboard "Today's orders/billing" updates.
3. Log a payment against it via the assistant; verify order due_total drops and the
   payment shows in Payments-by-mode.
4. As REP: verify whatever role limits the orders UI already enforces still hold when
   arriving via the assistant deep-link.

**4D. Regression:** re-run the W2 utterance table + 5 spot checks from the 56-case
fixture list in the live UI (not just the harness), as admin and rep.

---

## Reporting

After each workstream: update the spec build-status block (what shipped, deviations,
what's untested, files-to-push list, TEST- records created). After W4: produce the
final PASS/FAIL matrix and a one-paragraph go/no-go on starting V3 Phase 8 (the
conversational loop — separate future work order, blocked until W1–W4 are green).
