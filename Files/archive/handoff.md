# HANDOFF — Acrowell AI Assistant: "Co-Work Partner" Pivot

**Written 2026-07-18, end of session, context window exhausted.** This is the single
entry point for the next session. Read this file fully before doing anything else.
`Files/ai-assistant-build-spec.md` remains the architecture authority (read its
build-status block at the top); `Files/ai-assistant-v3-execution-plan.md` is the
Workstream 1–4 plan this session was executing. This handoff sits ABOVE both: it
records a philosophy change from the user that reframes what "done" means.

---

## 0. The pivot (read this first — it changes the goal, not just the backlog)

The user does not want a narrow intent-extraction bot. Direct quote: **"this assistant
should not be an assistant it should be a co-work partner that does everything a person
can do on the app."** Two concrete asks came out of this:

1. **Coverage**: build whatever the assistant currently lacks that a real user would
   ask for — the user had ANOTHER AI model generate a large adversarial stress-test
   corpus specifically to find these gaps (see §1 below). Analyze it in full, don't
   just skim.
2. **Personality**: add a conversational layer. Quote: "we should add some
   conversational aspect to the assistant as well like they can be short replies but
   something personal that make it feel like a real co-work partner." Short is fine —
   robotic is not.

Do not silently re-scope this back down to "intent extractor, slightly improved." The
user pushed back specifically because the previous session explained away order
creation as "excluded by design" — that exclusion (§V2.0.8 in the spec, order creation
with line items deep-links instead of extracting) may still be the RIGHT call
technically (line-item extraction is genuinely error-prone), but the next session's job
is to find every OTHER gap and close it, and to make the exclusions that remain feel
like a helpful handoff ("let's do this together on the order form") rather than a
refusal.

---

## 1. The stress-test corpus — READ THIS FULLY, don't skim

**File:** `Files/AI_Stress_Test_Corpus.xlsx` — built by a different AI model on
2026-07-18, verified against our actual `prompt.ts` (33 functions) at generation time.
Open it with the xlsx skill or `openpyxl`. Three sheets:

- **"Stress Test Messages"** — 608 rows (ST-0001..ST-0608+), columns: ID, Category,
  Sub-scenario, Message, Language Style, Expected Intent, Key Entities Expected,
  Difficulty, Pass Criteria.
- **"Scoring Rubric"** — weighted scoring: Intent accuracy 40%, Entity F1 25%, Enum
  correctness 10%, JSON validity 10%, Refusal correctness 10%, Latency 5%. **Suite
  passes only if overall ≥90% AND JSON validity = 100% AND refusal correctness =
  100%.** Also encodes as explicit rules: (a) multi-intent messages must emit exactly
  ONE function call, primary intent wins, secondary intent folds into that function's
  own fields or is dropped cleanly; (b) role rule — the model must still EXTRACT
  manager-only actions, refusing on role grounds is a FAIL (app enforces permission,
  not the model); (c) lost_reason rule — Lost with no stated reason must be
  `lost_reason=null`, never a placeholder string.
- **"Sources & Legend"** — language-style and difficulty definitions, plus: **demo
  vision/PDF assets are at `/Users/harishsharma/Claude/Pharma BMT/stress-test-assets/`**
  (9 files: 6 bills, 1 credit note, 2 visiting cards — all PDFs, already on disk,
  confirmed present this session).

**Category breakdown (23 categories, 608 rows) — already extracted this session:**

```
43  Lead Creation          33  Lead Search           33  Followups
37  Adversarial & Edge     33  Products               33  Unsupported/Refusals
36  Party Management       32  Call Logging           29  Stage/Temp Updates
35  Dues & Payments        28  Orders                 26  Stats
34  Stock                  23  Party Notes            20  Navigation
20  App Help               20  Vision/PDF Orders      19  Day Planning
18  Smalltalk              17  Transporters           15  Ambiguity/Clarification
12  Multi-intent           12  Corrections/Contradictions
```

**Expected-intent breakdown: all 33 expected intents map onto our EXISTING 33
declared functions — the corpus author did not invent new function names.** This
matters: the corpus is primarily a rigorous ACCURACY/ROBUSTNESS benchmark for what we
already have, not a spec for brand-new intents by name. The real gaps it surfaces are
architectural/behavioral, found by reading the actual message text, not the expected-
intent column. Three concrete gaps found this session (do not re-derive, act on these):

### Gap A — Purchase-bill / credit-note photo handling doesn't exist yet
The "Vision/PDF Orders" category (20 rows) has messages like `'is photo ka stock add
karo [bill_shree_balaji_distributors.pdf]'` (expected: `add_stock`), `'jo bill bheja
hai us party ka bakaya kitna hai [bill_krishna_traders.pdf]'` (expected:
`get_party_dues`), `'ye bill upload karke order bana do [bill_krishna_traders.pdf]'`
(expected: `start_order` — NOT full line-item extraction, confirming §V2.0.8's
exclusion is still respected by the corpus even here). Two real problems:
1. **PDF isn't supported by the upload path at all.** The frontend's `handleFile` /
   `downscaleImage` (`src/lib/use-assistant.ts`) calls `createImageBitmap(file)`,
   which throws on a PDF. The Worker side (`gemini.ts`) already passes through
   whatever `mimeType` it's given with no restriction, so `application/pdf` MIGHT
   just work end-to-end once the frontend stops blocking it at the attach step —
   but Gemini's document-understanding support for `gemini-3.1-flash-lite`
   specifically needs verifying before assuming this works (test with a real PDF
   from `stress-test-assets/` before building anything further on top).
2. **The photo→action mapping is currently a rigid, closed lookup baked into the
   system prompt** (`STATIC_SYSTEM_PROMPT` in `prompt.ts`): visiting card → lead/party,
   medicine box → product. Full stop — nothing else. The corpus wants a bill photo to
   route to `add_stock`, `get_party_dues`, `start_order`, or `get_order_status`
   depending on what the REP SAYS alongside the photo, not a fixed photo-type
   binding. Recommended fix: widen the photo rule in `STATIC_SYSTEM_PROMPT` to say
   the photo's content is EVIDENCE for whatever action the accompanying text
   requests (extract party/product/amount from the image, then follow the user's
   stated verb), rather than the current "visiting card ⇒ always create_lead" hard
   binding. This is a prompt-only change (no new functions needed) but is a
   meaningfully different framing — read the existing photo rule in `prompt.ts`
   before rewriting it, and re-verify the token budget + cache after any change
   (§V2.0.7 discipline, still non-negotiable).
3. Credit-note rows (`'ye credit note hai iske against payment adjust karo
   [credit_note_maakali_agencies.pdf]'`) expect `unsupported` at Hard difficulty —
   the corpus does NOT want us to build credit-note handling. Leave it out.

### Gap B — Smalltalk has no personality (this is the user's ask #2, directly)
`SMALLTALK_REPLIES` in `use-assistant.ts` currently has exactly two generic canned
lines used for EVERY smalltalk hit regardless of what was actually said. The corpus's
18-row Smalltalk category has real variety the current code can't distinguish:
greetings (`hello`, `good morning`, `namaste ji`), thanks (`thanks yaar bahut help
mili`, `thank you so much`), farewells (`bye kal baat karte hain`, `good night, kal
milte hain`), acknowledgement (`ok theek hai`, `haan`), praise (`wah kya baat hai`),
casual (`what's up`, `hey`, `lol`). All of these currently produce ONE of two identical
canned replies. This is the single clearest, cheapest win for the "feel like a real
co-work partner" ask. Two implementation options to weigh, in ascending order of
effort/risk:
   - **(a) Cheap:** widen `smalltalk`'s function declaration to accept an optional
     `subtype` enum (greeting/thanks/farewell/ack/praise/casual), have the model
     classify it (near-zero extra tokens), and expand `SMALLTALK_REPLIES` into a
     per-subtype pool with several Hinglish-flavored variants each, chosen randomly
     client-side. No architecture change, stays inside "model never writes prose."
   - **(b) Bigger:** let the model generate the actual short reply text for smalltalk
     ONLY (a narrow, deliberate exception to the "never write prose" rule, scoped to
     one inert action with no data access). More genuinely personal, more token cost
     per smalltalk hit (still cheap — smalltalk replies are short), but is a real
     precedent change worth flagging to the user explicitly before building, since
     hard rule #6 in the v1 spec treats prompt/schema changes as deliberate decisions.
   Recommend starting with (a); revisit (b) only if the user says (a) still feels
   robotic after testing.

### Gap C — Corrections-within-a-message are untested
`Corrections/Contradictions` (12 rows): `'nahi nahi, 20k nahi 25k likho'` (expects
`log_payment` amount=25000, i.e. the CORRECTED value wins, not the first-stated one).
This might already work correctly (Gemini's language understanding often handles
self-correction fine without any prompt change) — it has never been tested. Run these
12 rows specifically before assuming either way.

**What to do with the corpus, concretely, next session:**
1. Build a proper test harness (reuse the `acrowell-ai-worker/test/bakeoff/` pattern
   from Workstream 3 — same zero-production-changes discipline, same "call the live
   Worker like a real user, never touch GEMINI_API_KEY directly" approach) that runs
   all 608 rows against the live Worker, scores by the corpus's own rubric (weights
   above), and reports category-by-category pass rates. This gives real numbers
   instead of vibes.
2. Fix what the harness finds, prioritizing: refusal correctness (must be 100%, per
   the corpus's own passing bar) and JSON validity (must be 100%) FIRST — these are
   hard gates — then intent accuracy, then entity F1.
3. Build Gap A (bill/PDF photo flexibility) and Gap B (smalltalk personality) as
   proper features, following the same rigor as this session's Workstream 1/2 (write
   the acceptance table before coding, redeploy + cache-reverify after prompt.ts
   changes, test live with real files from `stress-test-assets/`).

---

## 2. Where things actually stand right now (as of 2026-07-18, this session's end)

- **V1 + V2 (Phases 0–6)**: live, deployed, tested across all three roles in earlier
  sessions. Working.
- **V3 execution plan Workstreams 1–3**: DONE this session.
  - W1 (hardening): maxOutputTokens cap, server-side message truncation, per-user
    token budget, history-contamination fix (root-caused: `historyRef` had
    consecutive user-role turns with no paired assistant turn — fixed by recording a
    history entry in every resolver branch). All verified live.
  - W2 (Phase 7 features): `navigate_to`, `get_transporter_info`, widened `get_stats`
    (orders_total/collections/dues_total + scope), fuller `app_help`. Verified live
    as admin + rep. Found and fixed an `appHelpAnswer()` keyword-priority bug along
    the way (longest-match now wins, not first-array-match).
  - W3 (model bake-off): **verdict is STAY ON GEMINI.** Full 56-fixture × 3-model run
    (168 real calls) — GLM-4.7-Flash has a 23% hard-fail rate (broken tool-call
    parsing, a hallucinated `lost_reason`); Qwen3-30B has a 5% hard-fail rate plus
    real accuracy gaps (dropped fields, wrong lead-vs-party calls). Gemini: 0
    hard-fails, ~100% real accuracy after discounting scorer artifacts. Harness lives
    at `acrowell-ai-worker/test/bakeoff/` (fixtures.ts, run.ts, README.md,
    results-2026-07-18.json) — reusable for the corpus harness in §1 above. Zero
    production changes were made for this workstream.
  - W4A (photo extraction) DONE, with two real bugs found and fixed:
    1. Product photos never actually uploaded the original image to storage —
       `ProductDialog` had no path to receive it. Fixed: `assistant-chat.tsx` now
       keeps the original full-quality `File` (`lastPhotoFile` state, distinct from
       the downscaled copy sent to Gemini), threaded through as `pendingImageFile` to
       `ProductDialog`, which uploads it via the existing `uploadProductImage()`
       immediately after a NEW product's first save. Added a `fromImage` flag to the
       `create_product` `PendingAction` (mirroring the existing `create_lead`
       pattern) so a stale photo from an earlier message can't bleed into an
       unrelated later product. Verified: re-uploaded file is byte-identical in size
       to the original (519,582 bytes) — confirmed full quality, not the downscaled
       Gemini copy.
    2. `ProductDialog`/`PartyDialog`/`LeadDialog` all showed "Edit X"/"X updated" for
       brand-new AI-created records (truthiness check on the whole prefill object
       instead of `?.id`). Fixed in all three.
  - **W4B/W4C (invoice PDF generation, order creation) — NOT STARTED.** Paused mid-
    session because the user redirected to the corpus/co-work-partner pivot instead.
    Still worth doing, but now secondary to §1's findings — fold into the same pass
    if it makes sense (e.g., order creation UX is directly relevant to Gap A).

- **Git state:** `leadenthrella` repo has 5 modified files, UNCOMMITTED as of this
  handoff: `src/components/assistant-chat.tsx`, `src/components/lead-dialog.tsx`,
  `src/lib/use-assistant.ts`, `src/routes/parties.index.tsx`, `src/routes/products.tsx`.
  **Push these before or as part of the next session** — they contain real, verified
  bug fixes (the image-upload fix especially) that are currently only live on the
  local dev server, not in production. `npx tsc --noEmit` shows zero new errors vs
  baseline (verified via git-stash diff this session).
- **Test data cleanup needed** (flagged, not deleted, per the no-delete rule): a lead
  "Rajesh Kumar" (Shree Pharma Distributors) and TWO "Rafrab-A" products — one orphan
  from before the image-upload fix (`image_url: null`), one correct one from after.
  User should delete via the UI if these were just for testing.
- **Worker** (`acrowell-ai-worker/`, not a git repo, deploys independently via
  `wrangler deploy`): already reflects all W1/W2 changes, live. Cache re-verified
  healthy at ~5,019/~5,052 tokens (~99.4% cached), well under the 8K budget — but if
  the next session widens the photo rule (Gap A) or the smalltalk schema (Gap B),
  that's another prompt.ts change requiring the same cache-reverification ritual:
  delete the stale KV key, redeploy, 3 consecutive calls, confirm `usage.cached > 0`.

---

## 3. Rules that still apply, unchanged (do not relitigate these)

Everything in `Files/ai-assistant-build-spec.md` §8 (hard rules) and the V3 execution
plan §0 (safety rules) still stands: never touch `GEMINI_API_KEY` directly, Worker
code stays outside the leadenthrella repo, migrations run BY HAND by the user only,
never `git push` yourself (the user pushes via GitHub Desktop), every write still
needs a visible confirm step, RLS is the security boundary, payroll/user-management/
settings/deletes stay excluded, TEST- prefix (or clear flagging) on anything created
for testing with a cleanup list handed back to the user, one meaningful checkpoint at
a time with the spec's build-status block updated honestly including deviations.

The §V3.4 user approvals from earlier (§8.5 relaxation for Tier-2 aggregates, 30-day
retention, ₹5,000 budget ceiling, no WhatsApp) still stand and don't need re-asking.

---

## 4. Immediate next steps, in order

1. Push the 5 uncommitted files (or confirm with the user first, per the risk rules —
   they're verified and tested, same bar as the W1/W2 push earlier this session).
2. Read this handoff fully, then `Files/AI_Stress_Test_Corpus.xlsx` in full (not just
   the summary above — read actual message text across ALL 23 categories, the summary
   only covered the categories most relevant to the gaps already found).
3. Build the corpus-scoring harness (§1, point 1) and get real numbers before
   changing anything — don't guess at what's broken, measure it.
4. Fix what's broken, starting with hard gates (refusal correctness, JSON validity),
   then close Gap A (bill/PDF photo flexibility) and Gap B (smalltalk personality),
   using the same rigor pattern as every prior workstream this project has used:
   write the test cases before coding, redeploy, cache-reverify, test live with real
   files, update the spec's build-status block honestly.
5. Only then return to W4B/W4C (invoice PDF, order creation) if still relevant, or
   fold order-creation UX improvements into the Gap A work if the corpus findings
   point that way.
