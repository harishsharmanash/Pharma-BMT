# Sonnet Task 02 — Ceremate's opening chat message (Feature 7 leftover)

**Run as:** Claude Code, Sonnet, in `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`.
**Scope:** one file, `src/components/assistant-chat.tsx`. Text-only change. No logic, no styling touch beyond what's needed to fit the new copy.

## Background
The Ceremate rename already landed (bot mascot, "Ceremate" labels everywhere, "Message Ceremate…" placeholder). One thing was missed: the chat's opening guidance line (around line 170) is still the **old Hindi example prompt**:

> `Tell me things like "naya lead Dr Mehta, Ambala, 9876543210" or "aaj kisko call karna hai".`

The original brief called for this to become a short **English capability guide, written as Ceremate introducing itself** — not a raw example string.

## What to do
1. Read `src/components/assistant-chat.tsx` in full first — find the empty-state/welcome block (search for "naya lead" or "kisko call") and see what other copy surrounds it (any heading above the line, any icon).
2. Replace that line with a short first-person intro from Ceremate (2–4 sentences, plain English, friendly but not childish) that actually tells a rep/manager what it can do. Base it on what the assistant genuinely supports per `Files/ai-assistant-build-spec.md`'s build-status block and the action vocabulary already implemented in `src/lib/use-assistant.ts` — don't invent capabilities it doesn't have. At minimum it should hint at: adding leads/parties/orders/products by just describing them, generating reports, and reading an attached bill/photo. Keep it Cerebyl's existing "business tool only" tone — no medical claims, no overpromising.
3. Keep the underlying Hinglish personality of the assistant's actual *replies* untouched (per the AI-assistant spec, `SMALLTALK_REPLIES` and model-generated text stay as they are) — this task only touches the one static onboarding line, not the assistant's conversational style.
4. Don't touch anything else in this file — no drawer→full-page conversion, no conversation history, no "+" menu (that's the separate, larger Feature 6 redesign, out of scope here).

## Verify
```bash
cd "/Users/harishsharma/Claude/Pharma BMT/leadenthrella"
npx tsc --noEmit 2>&1 | grep -c "error TS"   # must stay 139
```
Open the app, open Ceremate, confirm the new intro line reads naturally in the empty state.

## Report back
Quote the old and new line, confirm tsc is still 139.
</content>
