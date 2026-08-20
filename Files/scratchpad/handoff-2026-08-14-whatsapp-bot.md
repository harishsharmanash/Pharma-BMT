# Handoff — 2026-08-14, WhatsApp bot (paste into the new session)

## Mini-prompt to paste

> Continue the WhatsApp bot work in this repo. First read `Files/WORKLOG.md` top 3 entries and
> `Files/scratchpad/handoff-2026-08-14-whatsapp-bot.md`. Context: the bot
> (`cerebyl-whatsapp-worker/src/bot.ts`) just gained media understanding, a qualification
> checklist with auto-handoff, per-company cached MRP catalog, and product list/image serving.
> NO aider/DeepSeek — lead agent plans and executes everything.
>
> **Main task — PDF product lists:** Harish rejected the plain-text MRP list. He wants
> `share_product_list` (bot.ts) to send a designed PDF like the product section's export in the
> app (see `leadenthrella/src/routes/products.all.tsx` — it exports via an off-screen printable
> node + html2canvas, client-side only, so it can't run in the worker). Build a
> `whatsapp-product-list-pdf` Supabase edge function that: takes company_id + optional
> division/query filter, queries products (MRP ONLY — never base_rate/pts/ptr), renders a clean
> branded PDF (company name/header, grouped by division, columns: product, composition, pack,
> MRP), stores it in the `company-assets` bucket, and returns a signed URL. Then change
> `share_product_list` in bot.ts to call it and send the PDF as a WhatsApp **document** message
> (`type: "document", document: { link, filename, caption }` — add `sendWhatsappDocument` to
> send.ts mirroring `sendWhatsappImage`). Record the outbound message with
> `message_type: 'document'`. The bot's text reply should just say the list is on its way.
>
> **Harish's UX bar for the bot (his words, paraphrased):** it must be able to replace a human
> in sales. Small human messages, never paragraphs; polite but not clingy/chipku; acknowledge
> before acting ("ok", "sure", "hanji", "theek hai", "sending pls wait"); first message asks
> language preference and adapts the whole chat to it. This is already in the SYSTEM_PROMPT —
> verify behavior live and tune the prompt if the test chat still feels long-winded.
>
> **Verify while you're there:** (1) `[cache] cachedContents create failed` errors in
> `wrangler tail` — KV was empty post-deploy, explicit caching may never have engaged (Gemini
> token floor?); caching is Harish's #1 cost concern, so confirm a cache entry lands in KV
> namespace `5731b0a1ede5460782e678bf0d9e40a2`. (2) Live smoke test: voice note understood,
> photo understood, PDF inbound read, product images sent, PDF list received, no rate other
> than MRP ever appears, qualification stops after handoff.
>
> Deploy path: `npx wrangler deploy` in cerebyl-whatsapp-worker (wrangler is authed);
> `npx supabase functions deploy <name>` in leadenthrella; app changes via
> `leadenthrella/scripts/ship.sh`. Never paste secrets in chat — `wrangler secret put` /
> `supabase secrets set` only.

## Test script for Harish (run after the PDF feature ships)
1. Fresh conversation: "PCD franchise chahiye" → bot asks language preference, qualifies in small messages.
2. Voice note → understood and answered.
3. Photo (e.g. DL) → acknowledged by content.
4. "Derma range ki list bhejo" → PDF document lands, branded, MRP only.
5. "<product> ka photo bhejo" → image with MRP caption.
6. After "our team will connect" → bot still serves but doesn't re-qualify or repeat handoff.
