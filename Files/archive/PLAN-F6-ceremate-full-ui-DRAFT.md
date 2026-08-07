# Feature 6 — Ceremate Full UI Overhaul (Gemini-style) — PLAN (DRAFT)

**Status:** DRAFT plan, 23 Jul 2026. Nothing built yet. This is the biggest of the pending features; it is deliberately phased into 4 independently-shippable parts. Read the whole thing once, then build P1 first.

**Golden rule (repeat it every phase):** we are replacing the **shell** and **adding capabilities**. The existing conversational/action engine — the whole intent vocabulary, the plan executor, all resolvers, every dialog-handoff, and the Worker cache behaviour — must survive *byte-for-byte unchanged in behaviour*. If a change forces the engine to change, stop and re-scope.

---

## 1. Current architecture — what exists and what must be PRESERVED

Three pieces, two repos:

1. **`src/components/assistant-chat.tsx`** (~672 lines) — the **SHELL only**. A floating bottom-right FAB (`gradient-brand` pill with the `ceremate-pill.png` mascot) that opens a right-side shadcn `<Sheet>` drawer. It owns: local `text` state, a single attach `<input accept="image/*,application/pdf">`, `pendingImage` preview, the `MessageBubble` renderer (one function, ~16 message `kind`s), and the three prefilled dialogs it hands off to (`LeadDialog`, `PartyDialog`, `ProductDialog`). It calls `useAssistant()` and renders whatever `messages` the hook produces. **This file is what P1 replaces wholesale.** Nothing in it is load-bearing except the wiring into `useAssistant` and the dialog handoffs — both of which we carry over verbatim.

2. **`src/lib/use-assistant.ts`** (~2705 lines) — the **ENGINE. Do not restructure.** It holds:
   - The full `IntentAction` union (~50 actions across leads/parties/products/orders/stock/transporters/reports/plans).
   - `send()` — builds `{ messages: historyRef, image, context:{today,repName,role,vocab} }`, POSTs to the Worker `/chat`, fires bill-extraction in parallel when a `start_order` intent has an attachment, calls `handleIntent()`, and fire-and-forget logs `assistant_usage`.
   - `handleIntent()` + the resolvers (`resolvePartyForWrite`, `resolveProductAndAct`, etc.) + the plan executor (`confirmPlan`, `resumePlanAfterEntityCreated`, deferred-step handling) + all the synchronous `compute*`/`computeReport` functions.
   - `downscaleImage` / `prepImageForExtraction` (already handle image + PDF → base64).
   - The `canDo`/`MANAGER_ONLY_ACTIONS` soft role gate.
   - State: `messages` (`useState`), `historyRef` (`useRef`, last 6 turns, 300 chars each). **Both are ephemeral — confirmed: there is NO persistence today.** Reload = blank chat. This is exactly the gap P1's new tables fill.
   - The hook returns a fixed surface (`messages, sending, send, confirmAction, cancelAction, confirmPlan, resumePlanAfterEntityCreated, pickLeadForAction, pick…, divisionOptions, categoryOptions, partyTypeOptions`). The new shell consumes the same surface. We will *add* to this return object (history helpers) but not remove or change existing members.

3. **The AI Worker** — sibling repo `../acrowell-ai-worker/` (NOT version-controlled, NOT in this repo). Model `gemini-3.1-flash-lite`, temp 0, function-calling `mode:"ANY"`, explicit shared cache (`cachedContents`) keyed in KV, byte-identical across all companies. Endpoints: `/chat` (intent extraction) and `/extract` (bill line-items). It already accepts images + PDFs as base64. **The cache is the constraint that governs everything Worker-side** — see §5.

### The cache ritual constraint (read before proposing ANY Worker prompt/tool change)
The static system prompt + all function declarations live *inside* a Gemini `cachedContents` resource, giving ~99% cached-input on every call. Any edit to `prompt.ts`, the function declarations, or `toolConfig` requires the full ritual: `wrangler deploy` from the Worker folder **then delete the stale KV key** (`wrangler kv key delete "gemini:cache:name" …`) so the cache rebuilds, then re-verify `usage.cached > 0` over 3 calls. **Conclusion that shapes this whole plan: we avoid touching the Worker prompt wherever possible.** The `/extract` module is standalone (no cache), so bill/doc extraction changes there are cheap. New attachment *text* is fed as ordinary user-turn content — no new tools, no prompt change, no cache ritual.

---

## 2. New route & entry points

- **New route: `/ceremate`** — a full-page surface, file `src/routes/ceremate.tsx`, wrapped in the existing `<Protected>` → `<AppShell>` chrome (so sidebar + header stay; the page is the `children`). Gated by the same `aiAssistantOn && canUseAi` check the FAB uses today (lift that check to the route: if off, redirect to `/dashboard`).
- **Two entry points into it:**
  1. **Sidebar nav** — add a `NAV` item in `app-shell.tsx`: `{ to: "/ceremate", label: "Ceremate", icon: Sparkles/Bot, feature: "ai_assistant", perm: "ai.use" }`. Reuses the existing `visible` filter (feature + perm gating already works).
  2. **Top-header button** — a small pill button in the header's right cluster (next to My Day / NotificationBell) with the mascot, linking to `/ceremate`.
- **The old FAB:** DECISION for Harish (see §8). Recommended default: **keep the FAB, but make it a shortcut that navigates to `/ceremate`** instead of opening the Sheet — one Ceremate, one conversation surface, reachable three ways (FAB, sidebar, header). This deletes the entire Sheet/drawer body from `assistant-chat.tsx` and leaves a 15-line launcher. Alternative: remove the FAB entirely. Either way the drawer UI is gone.
- **Layout of `/ceremate`** (model on the Gemini web screenshot Harish shared):
  - **Left rail** (collapsible on mobile): "New chat" button (pill), "Search chats" input, then the conversation history list (most-recent first, grouped Today / Yesterday / Older). This is the persistence spine from P1.
  - **Center column**: the message thread (reuse the exact `MessageBubble` renderer, lifted out of `assistant-chat.tsx` into its own `src/components/ceremate/message-bubble.tsx` so both the old launcher — if kept — and the new page share it). Empty state = the mascot + the existing intro copy.
  - **Input bar** (bottom, sticky): "+" menu (left), the textarea, the mic button, attachment pickers, send. See §4/§5/§6.

---

## 3. Persistence schema (P1) — idempotent migration, hand-applied

New migration `supabase/migrations/20260723xxxxxx_ceremate_persistence.sql`. Follows the deploy-skill rules: run BY HAND (dashboard SQL editor or CLI), never `db push`; use `IF NOT EXISTS`; add hand-written optional types in a new `use-ceremate-conversations.ts`; access new tables via `(supabase.from("x") as any)` until types regenerate.

```sql
-- assistant_conversations
CREATE TABLE IF NOT EXISTS public.assistant_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistant_conversations TO authenticated;
GRANT ALL ON public.assistant_conversations TO service_role;

-- assistant_messages
CREATE TABLE IF NOT EXISTS public.assistant_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.assistant_conversations(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  -- The rendered content: for user turns, the text. For assistant turns,
  -- store BOTH a plain-text fallback (for history/search) AND the structured
  -- message payload so a reloaded thread re-renders the real card/picker/plan.
  content text NOT NULL DEFAULT '',
  payload jsonb,                       -- the ChatMessage (kind + data), minus transient fns
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{path?, kind, mime, name, size}]
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS assistant_messages_conv_idx
  ON public.assistant_messages(conversation_id, created_at);
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.assistant_messages TO authenticated;
GRANT ALL ON public.assistant_messages TO service_role;

-- RLS: strictly owner-scoped (a rep's chats are private to that rep; not even
-- managers see them — this is personal assistant history, matches the "reps
-- see only their own data" product rule and avoids leaking a rep's queries).
CREATE POLICY conv_owner_all ON public.assistant_conversations
  FOR ALL TO authenticated
  USING (user_id = auth.uid() AND company_id = public.current_company_id())
  WITH CHECK (user_id = auth.uid() AND company_id = public.current_company_id());

CREATE POLICY msg_owner_all ON public.assistant_messages
  FOR ALL TO authenticated
  USING (user_id = auth.uid() AND company_id = public.current_company_id())
  WITH CHECK (user_id = auth.uid() AND company_id = public.current_company_id());
```

**feature_requests** — model EXACTLY on the existing `bug_reports` table (`use-bug-reports.ts` + its migration are the precedent). Same insert-own-company / select-own-company-or-platform-admin / platform-admin-only-update pattern, so it surfaces in the platform **console** where Harish (the platform admin) already reviews bug reports:

```sql
CREATE TABLE IF NOT EXISTS public.feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  requester_name text,
  text text NOT NULL,
  route text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','planned','in_progress','done','declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.feature_requests TO authenticated;
GRANT ALL ON public.feature_requests TO service_role;
CREATE POLICY fr_insert ON public.feature_requests FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id());
CREATE POLICY fr_select ON public.feature_requests FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_platform_admin());
CREATE POLICY fr_platform_update ON public.feature_requests FOR UPDATE TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
```

**How Harish gets notified:** primary = **console surface** (a "Feature requests" list/tab in the platform console mirroring the existing bug-reports view — reuse `useBugReports`-shaped hooks). Optional = **email** via a tiny edge function `feature-request-notify` (deploys cleanly per the updated deploy skill) that fires on insert and emails Harish. Recommend shipping the console surface in P2 and treating email as an opt-in follow-up (decision in §8).

**Message persistence mechanics (P1):** `send()` gains an active `conversationId`. On the first message of a fresh chat, insert a conversation row (title = first ~40 chars of the user's message, or auto-title later). Persist the user turn immediately; persist each assistant `ChatMessage` as `handleIntent`/resolvers push it. Store the structured `payload` (the `ChatMessage` minus non-serialisable callbacks like `buildPending`/`run`) so a reloaded thread re-renders real cards; on reload, interactive affordances (confirm buttons on a half-finished action) render disabled/expired — you cannot resurrect a pending mutation across reload, and shouldn't try. `historyRef` (the 6-turn Gemini context) is rebuilt from the last 6 persisted turns when a conversation is opened. Keep it best-effort and fire-and-forget (same pattern as `assistant_usage`): a persistence failure must never block the chat.

---

## 4. The "+" guided-workflow system (P2)

Goal: a "+" button in the input opens a menu of **app-specific actions** — Add order / Add party / Add lead / Add product / **Request a feature**. Each launches a **prebuilt guided in-chat flow** that collects the right fields/files step by step, then resolves through the **same** engine — no parallel AI engine, no new Worker tools.

**Design principle:** a guided flow is a thin, deterministic **client-side wizard** that ends by producing exactly the same artifact the free-text path already produces:
- "Add lead / party / product" → collect fields via in-chat prompts (or jump straight to the existing prefilled `LeadDialog`/`PartyDialog`/`ProductDialog` with whatever was gathered). These dialogs are ALREADY the confirm/save surface the engine uses — the flow just pre-opens them. Zero engine change.
- "Add order" → reuse the existing `start_order` path (navigates to `/orders` new-order dialog, optionally with a bill attachment routed through the existing `/extract` prefill). Again, the engine already does this.
- Optionally, a flow step can synthesise an intent and feed it to `handleIntent()` directly (e.g. gather a party name in-chat, then call the same `resolvePartyForWrite` the model would have triggered) — this is the "front feels bespoke, backend unchanged" path.
- "Request a feature" → a 1-field flow (textarea) that inserts a `feature_requests` row and shows a confirmation bubble. No AI call at all.

**Where flow definitions live:** a new `src/lib/ceremate-flows.ts` exporting a small declarative array: `{ id, label, icon, steps: [...] }` where each step is `{ prompt, field, type: 'text'|'number'|'select'|'file', options? }`. A generic `<GuidedFlow>` renderer in `src/components/ceremate/` walks the steps, collecting answers into an object, then calls a per-flow `finish(answers)` that dispatches into the existing engine (open prefilled dialog, or synthesise+`handleIntent`, or insert feature_request). Because every flow terminates in an existing engine entrypoint, the plan executor / resolvers / role gates all still apply unchanged.

**What runs over the Worker vs not:** guided flows mostly DON'T need the Worker — they collect fields deterministically and hand off to dialogs/mutations directly. Only if a step includes a free-text or attachment "let AI read this" moment does it call the existing `/chat` or `/extract` (unchanged). So P2 is **app-only, zero Worker change, zero migration** beyond the `feature_requests` table (which lands in P1's migration).

---

## 5. Attachments (P3) — three pickers: Document, Image, Audio (NO video)

The "+"/attachment area exposes three distinct pickers.

- **Image** — already works. `downscaleImage` (1024px) for classification photos; `prepImageForExtraction` (2048px) for bills. No change.
- **PDF** — already works (sent through as base64; Gemini reads pages). No change.
- **Documents: xlsx / xls / csv / html / docx** — NEW, but the hard part is **already built**: `src/lib/file-extract.ts` (`extractRecordsFromFile`) already parses all of these client-side using the repo's existing free libs (`xlsx`, `mammoth`, `papaparse`-class, `pdfjs`, `tesseract` for OCR). It returns `{ rows, rawText, kind, confidence }`. **Pipeline:** on document attach, run `extractRecordsFromFile` in the browser → take `rawText` (and/or a compact rows summary) → send it to `/chat` as ordinary user-turn text (prefixed like `"[attached <name>]\n<extracted text>"`, truncated to the Worker's per-message char cap). **This means the model sees text, not a file — no new Worker tool, no prompt change, no cache ritual.** For bill-shaped spreadsheets/PDFs that should become an order, route through the existing `/extract` flow instead (it already accepts PDFs; for xlsx, feed the extracted rows to the same line-item mapping the Orders CSV import uses). Cost: ~zero (extraction is local; the model just gets more input tokens, mostly cached prefix + a bounded user turn).
- **Audio** — NEW. Two sub-cases:
  1. **Dictation (the mic, §6)** — free, browser-side, no file.
  2. **Attached audio file** — needs transcription. `gemini-3.1-flash-lite` *may* accept inline audio (verify against the model's current capabilities before building); if it does, send as base64 like images (a `/chat` request-shape addition, but NOT a prompt/cache change — audio goes in `contents`, same as images do today). If it does NOT, fall back to **Cloudflare Workers AI Whisper** (`@cf/openai/whisper`) via a tiny new Worker endpoint `/transcribe` (standalone, no cache) on the free daily neuron tier → returns text → fed to `/chat` as user-turn text. **Recommend deferring attached-audio-files to a P3.5 / later** — the mic (P4) covers the real "voice" need for free, and audio-file attach is the lowest-value, highest-effort picker (decision in §8).

**Worker-side changes needed (flag as separate deploys, sibling repo):** none for documents (text goes through `/chat` unchanged). For attached-audio only, either a request-shape tweak to accept an `audio` inline part (no cache ritual — it's request `contents`, not the cached prefix) or a new `/transcribe` endpoint. Everything else in P3 is app-only.

---

## 6. Mic (P4) — WhisperFlow-style toggle-lock dictation

- **v1 = free browser Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`). Confirmed with Harish: mic stays free, no paid transcription in v1.
- **Behaviour:** tap the mic to **lock ON** (`recognition.continuous = true; recognition.interimResults = true`), keep listening across pauses, stream interim results into the input textarea live and commit finals, until the user taps the mic OFF. It **transcribes into the input bar only** — it does NOT auto-send. The user reviews/edits, then hits Send. (Matches Harish's WhisperFlow spec.)
- **Component:** `src/components/ceremate/use-dictation.ts` hook wrapping the API (start/stop, interim/final text, `supported` flag, error handling for permission-denied).
- **Graceful degradation:** Web Speech is Chrome-strong, Safari-weak/absent. If `SpeechRecognition` is undefined (or on iOS Safari where it's unreliable), **hide or disable the mic button** with a tooltip ("Voice input needs Chrome") — never show a broken control. No paid fallback in v1. This is purely additive to the input bar; nothing else changes.
- **Cost:** ₹0 — runs entirely in the browser.

---

## 7. Cost note

No new subscription. Impact is marginal:
- **Text/intent** — unchanged; still `gemini-3.1-flash-lite` with ~99% cached input.
- **Document attachments** — extraction is 100% local (free libs already in the bundle); the only cost is a bounded number of extra *input* tokens per message (mostly billed at the cached rate).
- **Mic dictation** — free (Web Speech API, browser-side).
- **Attached audio files (if built)** — free-ish: native Gemini audio adds tokens, or Workers AI Whisper on the free daily neuron tier.
- **Persistence** — Supabase rows only; negligible.
- The one recurring micro-cost that already exists (Gemini cache storage ~₹0.20/hr while alive) is unchanged.

---

## 8. Open decisions for Harish

1. **Old FAB: keep-as-shortcut, or remove?** Recommended: keep it but repoint it to navigate to `/ceremate` (one surface, three doors). Alternative: delete it entirely. *(Default assumed in P1 prompt: keep-as-shortcut.)*
2. **Feature-request notification: console-only, or console + email?** Recommended: console surface in P2 (free, mirrors bug_reports); email as an opt-in follow-up via a small edge function. *(Default: console-only in P2, email deferred.)*
3. **Attached audio files: P3 or deferred?** Recommended: defer — the free mic (P4) covers the voice need; audio-file attach is highest-effort/lowest-value. *(Default: Document + Image pickers in P3; Audio-file picker deferred.)*
4. **Conversation title auto-generation** — cheap heuristic (first 40 chars of first message) vs. a model-generated title (one extra `/chat`-style call). Recommend the heuristic for v1.
5. **History visibility** — confirmed assumption: conversations are strictly per-user/private (managers do NOT see reps' Ceremate history). Flag if Harish wants managers to audit rep chats (would change RLS).

---

## 9. PHASING — four independently-shippable phases

Each phase: lands, is verified (`bun run build` + `npx tsc --noEmit` must stay at the **139**-error baseline), then Harish pushes (Bash can't `git push`). Worker changes deploy separately via `wrangler` from the sibling repo with the cache ritual where noted.

- **P1 — Full-page shell + route + entry points + conversation persistence.** THE BIG ONE. Everything else layers on. Delivers the visual + history spine: `/ceremate` route, sidebar + header entry points, FAB repointed, left-rail history (new-chat / search / list), the lifted `MessageBubble`, the two new tables + migration, and `send()`/history wired to persist and rehydrate. Engine behaviour unchanged.
- **P2 — The "+" guided workflows.** `ceremate-flows.ts` + `<GuidedFlow>` renderer + the "+" menu; Add order/party/lead/product flows terminating in existing engine entrypoints; "Request a feature" → `feature_requests` insert + console surface. App-only (table already created in P1).
- **P3 — New attachment types.** Document picker wired to `file-extract.ts` → `/chat` as text; (optional) audio-file picker. Mostly app-only; only attached-audio needs a Worker `/transcribe` or request-shape tweak (no cache ritual).
- **P4 — Mic.** Web Speech dictation hook + toggle-lock UI + graceful degradation. App-only, free.

---

## 10. Paste-ready implementer prompts

> These are for a frontend implementer (Sonnet-class) except where they say "Worker" (sibling repo) or "migration" (hand-apply). Each is self-contained. Build in order; each is shippable alone.

### P1 prompt — full-page Ceremate + persistence

```
You are working in /Users/harishsharma/Claude/Pharma BMT/leadenthrella (Cerebyl, a
React 19 + TanStack Router + Supabase pharma CRM). Read .claude/skills/leadenthrella-deploy
before doing anything DB-related. Typecheck baseline is 139 errors — it must stay 139.

GOAL: Replace the bottom-right Sheet-drawer AI assistant ("Ceremate") with a full-page
Gemini-style surface at a new /ceremate route, and make Ceremate conversations persist.
DO NOT change the assistant ENGINE (src/lib/use-assistant.ts's intent handling, resolvers,
plan executor, dialog handoffs, role gates). Only change the shell + add persistence.

1. New route src/routes/ceremate.tsx, rendered inside the existing Protected/AppShell
   chrome. Gate it with the same aiAssistantOn && canUseAi check app-shell.tsx uses for the
   FAB; redirect to /dashboard if off. Layout (model on Gemini web UI):
   - Left rail: "New chat" button, "Search chats" input, conversation history list grouped
     Today/Yesterday/Older, most-recent first. Collapsible on mobile.
   - Center: the message thread. LIFT the MessageBubble function out of
     src/components/assistant-chat.tsx into src/components/ceremate/message-bubble.tsx
     UNCHANGED and import it in both places. Empty state = ceremate-pill.png mascot + the
     existing intro copy.
   - Sticky input bar: attach button + textarea + send (mic and "+" come in later phases —
     leave hooks/space for them but don't build them now).
2. Entry points: add a NAV item to app-shell.tsx { to:"/ceremate", label:"Ceremate",
   icon: Bot/Sparkles, feature:"ai_assistant", perm:"ai.use" }. Add a small header pill
   button (mascot) linking to /ceremate. Repoint the existing FAB so onClick navigates to
   /ceremate instead of opening the Sheet; delete the Sheet/drawer body.
3. Persistence. Apply this migration BY HAND (do not db push) — file
   supabase/migrations/20260723xxxxxx_ceremate_persistence.sql — creating
   assistant_conversations, assistant_messages, and feature_requests with the RLS in the
   plan doc §3 (owner-scoped for conversations/messages; bug_reports-style for
   feature_requests). Add a new src/lib/use-ceremate-conversations.ts with hand-written
   OPTIONAL types and (supabase.from("x") as any) access (new tables aren't in generated
   types). Hooks: list conversations, load a conversation's messages, create conversation,
   append message, delete conversation, rename.
4. Wire persistence into useAssistant WITHOUT changing intent behaviour: add a current
   conversationId; on the first user message of a fresh chat, create a conversation
   (title = first ~40 chars). Persist each user turn and each assistant ChatMessage
   (store a serialisable payload minus callback fns) fire-and-forget (same pattern as the
   existing assistant_usage insert — never block chat on a persistence failure). When a
   conversation is opened from the rail, rehydrate messages from the DB and rebuild the
   6-turn historyRef from the last 6 persisted turns. Interactive affordances on rehydrated
   messages render disabled (can't resurrect a pending mutation across reload).
5. Verify: bun run build clean, npx tsc --noEmit stays at 139. Confirm the migration ran by
   querying the tables. Then STOP and tell Harish to push.
```

### P2 prompt — "+" guided workflows + Request a feature

```
Cerebyl /ceremate, continuing Feature 6. Read the plan doc §4. Typecheck baseline 139.
GOAL: add a "+" menu to the Ceremate input with app-specific guided flows that resolve
through the EXISTING engine — no parallel AI engine, no Worker change, no new migration
(feature_requests already exists from P1).

1. src/lib/ceremate-flows.ts: declarative flow defs { id, label, icon, steps:[{prompt,
   field, type, options?}], finish(answers) }. Flows: add_lead, add_party, add_product,
   add_order, request_feature.
2. src/components/ceremate/guided-flow.tsx: a generic renderer that walks a flow's steps
   in-chat (collecting answers), then calls finish(answers). finish() must terminate in an
   EXISTING engine entrypoint: open the existing prefilled LeadDialog/PartyDialog/
   ProductDialog, or reuse start_order's navigate, or synthesise an intent and call the
   hook's handleIntent-equivalent. request_feature.finish inserts a feature_requests row
   (via a new useSubmitFeatureRequest mirroring useSubmitBugReport) and shows a confirm
   bubble — no AI call.
3. "+" button in the input bar opens the menu of these flows.
4. Platform console: add a "Feature requests" surface mirroring the existing bug-reports
   view (hooks like useBugReports/useUpdateBugReportStatus, platform-admin only).
5. Verify build + tsc 139, then stop for push. (Email notification is a separate later task.)
```

### P3 prompt — Document + (optional) Audio attachments

```
Cerebyl /ceremate, Feature 6. Read plan doc §5. Baseline 139.
GOAL: add a Document attachment picker (xlsx/xls/csv/html/docx) and wire it to the EXISTING
extractor, feeding TEXT to the existing /chat — NO Worker prompt/tool change, NO cache ritual.

1. Add a Document picker to the input bar (separate from the existing Image/PDF path).
   accept per file-extract.ts's ACCEPTED_FILE_TYPES (documents subset).
2. On attach: call extractRecordsFromFile (src/lib/file-extract.ts — already handles all
   these formats client-side with free libs). Take rawText (+ optional compact row summary),
   prefix "[attached <name>]\n", truncate to the Worker's per-message cap, and send as
   ordinary user-turn text via the existing send(). For bill-shaped docs meant to become an
   order, route through the existing /extract flow instead (PDFs already; for xlsx feed rows
   to the same line-item mapping the Orders CSV import uses).
3. (OPTIONAL / can defer per Harish) Audio-file picker: FIRST verify whether current
   gemini-3.1-flash-lite accepts inline audio. If yes, send base64 audio in the request
   contents (request-shape only, NOT the cached prefix — no cache ritual) + a tiny Worker
   change. If no, add a standalone Worker /transcribe endpoint using Cloudflare Workers AI
   Whisper (@cf/openai/whisper, free daily tier) and feed its text to /chat. Deploy the
   Worker separately from ../acrowell-ai-worker with wrangler; do NOT touch prompt.ts.
4. Verify build + tsc 139, then stop for push.
```

### P4 prompt — Mic (Web Speech dictation)

```
Cerebyl /ceremate, Feature 6. Read plan doc §6. Baseline 139. App-only, free.
GOAL: a WhisperFlow-style mic in the Ceremate input: tap to LOCK listening on, keep
transcribing into the textarea (interim + final) until tapped off; do NOT auto-send — the
user edits then hits Send.

1. src/components/ceremate/use-dictation.ts: wrap SpeechRecognition/webkitSpeechRecognition
   (continuous=true, interimResults=true). Expose start/stop toggle, live interim text,
   committed final text, a `supported` boolean, and permission-error handling.
2. Mic button in the input bar: toggles lock on/off, shows a listening state; streams text
   into the existing input value (never sends on its own).
3. Graceful degradation: if SpeechRecognition is undefined (Safari/iOS), hide or disable the
   mic with a tooltip "Voice input needs Chrome". No paid fallback in v1.
4. Verify build + tsc 139, then stop for push.
```

---

*End of DRAFT. P1 is the load-bearing phase; P2–P4 each layer on without touching the engine or the Worker cache.*
