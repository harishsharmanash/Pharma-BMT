# WhatsApp automation — brainstorm & feature map

**Written:** 14 Aug 2026 · Claude Opus (lead)
**Companion docs:** `Files/BOTBIZ-FEATURE-TEARDOWN.md` (competitive reference),
`Files/scratchpad/handoff-2026-08-14-whatsapp-bot.md` (current bot state)
**Scope:** what the customer-facing chatbot should be able to do, and 40 company-side features
ranked in four tiers. Everything here is checked against Meta's 2026 policy surface.

---

## 0. Four research findings that change the plan

### 0.1 🚨 WhatsApp Commerce Policy bans selling pharma — catalog is DEAD for us
Meta's Commerce Policy prohibits "promoting or otherwise facilitating the exchange of prescription
drugs", and commerce content "may not promote the buying, selling, or trading of medical and
healthcare products… including medical devices or ingestible supplements." Pharmacies get a narrow
carve-out (grocery/convenience items via catalog; **OTC drugs = messaging only**), and manufacturers
may sell *services*, never product.

**Consequence:** BotBiz's entire eCommerce Catalog / Catalog Orders / WhatsApp Pay checkout branch is
**off the table for Cerebyl**, and §6 item 6 of the BotBiz teardown ("Catalog Orders with manual
payment attachment") must be re-cut. **Messaging about products is allowed; a WhatsApp catalog or
in-chat checkout is not.** The compliant version is: order *intent* is captured in conversation,
the line items land in **Cerebyl's** order system, and confirmation goes back as a message. No
WhatsApp catalog object, no WhatsApp cart, no WhatsApp payment.

This is a hard architectural fork and it is good news — it pushes the transaction into our product
instead of Meta's, which is where we make money anyway.

### 0.2 "Auto template approval request sending" isn't a separate step
There is no submit-then-request-approval flow. `POST /{WABA_ID}/message_templates` **is** the
approval request. Status returns `PENDING`, and the verdict arrives on the
`message_template_status_update` webhook (usually minutes) — **we never poll.** So the automation
worth building is not "click submit for the rep", it is everything *around* submission:
generation, pre-flight linting, rejection auto-repair, language fan-out, and quality lifecycle.
See §2.

### 0.3 The money is in the Utility/Marketing category line
India 2026: **Marketing ≈ ₹0.88/msg, Utility ≈ ₹0.115/msg** (+18% GST) — a **7.6×** difference.
Meta runs a recurring auto-recategorization pass that silently moves mis-tagged templates from
Utility to Marketing. A client whose 20 templates get reclassified sees their WhatsApp bill jump
7× with no notification from us. **Category discipline is a cost-control feature, not a compliance
checkbox.**

⚠️ **Deadline:** service replies and in-window utility messages **stop being free on 1 Oct 2026**.
Any pricing model or client quote we build must assume that.

### 0.4 Frequency capping is per-user and invisible
A business may send **~2 marketing template messages per person per 24h** unless that person
replies. Over-sending returns error `131049` and silently burns quality rating. Meta's **MM Lite
API** is the sanctioned path for marketing sends — it applies engagement-based pacing and reportedly
lifts delivery ~30% vs plain Cloud API sends. If we build a broadcast center, it should target
MM Lite for Marketing and the Cloud API for Utility.

---

## 1. The hard rails (every feature below obeys these)

1. **24-hour customer service window.** Free-form text only inside it. Outside → approved template
   or nothing. This is the single most important concept for the whole UI to expose.
2. **Opt-in is mandatory, opt-out must be honoured**, with provenance stored (who, when, channel).
   Under DPDP this is also an Indian legal requirement, not just Meta's.
3. **No medical claims. Ever.** Cerebyl standing rule + Meta healthcare restriction + India's
   Drugs & Magic Remedies Act. Every generated template and bot reply passes a claims screen.
4. **No catalog / cart / in-chat payment for pharma products** (§0.1).
5. **No bulk unsolicited messaging.** Broadcast audiences must be derivable only from opted-in,
   provenance-stamped CRM rows — never an imported list.
6. **Quality rating and messaging tier are Meta's, not ours.** Template pause ladder is
   3h → 6h → permanently disabled. We must watch it and react, never assume.
7. **Rep scoping.** Everything WhatsApp inherits existing RLS: a rep sees and messages only their
   own leads/parties.
8. **A payment intimation is not a payment** (existing distributor-portal rule — reuse it,
   do not invent a second).

---

## 2. The Template Autopilot (the core automation Harish asked for)

The chore we are dissolving: a rep today writes a message, guesses a category, submits it in
WhatsApp Manager, waits, gets rejected for a reason they don't understand, and gives up.

**Pipeline — fully automatic, human only on escalation:**

| Stage | What the system does |
|---|---|
| **1. Synthesis** | Every CRM event type (order placed / packed / dispatched / delivered, payment due, follow-up nudge, scheme launch, price-list drop, welcome, re-engagement) has a template *recipe*. On company onboarding we generate the whole pack in that company's brand voice and product vocabulary. |
| **2. Variable binding** | Template placeholders are bound to real CRM fields at design time (`{{1}} = party.firm_name`), and the Meta-required `example` payload is auto-filled from real (masked) rows. Makes a `132000` param-mismatch error structurally impossible later. |
| **3. Pre-flight linter** ⭐ | Rejects before Meta does: medical claims · price/offer copy sitting in a Utility category · body that is only variables or starts/ends with one · missing examples · missing opt-out on marketing · URL shorteners · formatting/emoji violations · category-intent mismatch. **This is the highest-leverage piece of the whole system.** |
| **4. Library-first** | If Meta's own pre-approved Template Library has a matching utility template, use it — those approve near-instantly. Only synthesize when nothing fits. |
| **5. Submit** | `POST /{WABA_ID}/message_templates`. Status `PENDING`. |
| **6. Webhook verdict** | `message_template_status_update` → APPROVED / REJECTED with reason. No polling. |
| **7. Auto-repair loop** | On rejection, feed the reason back to the LLM, rewrite, resubmit. Hard cap (2 retries) then escalate to a human with a plain-English explanation. Every attempt logged. |
| **8. Language fan-out** | One approved English template auto-translates and submits for hi / pa / gu / mr / ta / bn under the same template name. Meta keys by name+language, so the send layer picks by the customer's remembered language automatically. |
| **9. Quality lifecycle** | Watch `message_template_quality_update`. On *medium*: warn. On *low*: auto-pause campaigns using it and auto-draft a rewritten variant **before the third strike permanently disables it.** |
| **10. Category guard** | Continuously compare declared category vs actual copy; alert when a template drifts toward the 7.6× price band, and catch Meta's recategorization pass the day it lands. |

**Rep-facing result:** the rep never sees a template form. They see "Send price list to Punjab
distributors" and the right approved template in the right language is already there.

---

## 3. What the chatbot itself should be able to do

*(✅ = already shipped in `cerebyl-whatsapp-worker/src/bot.ts`)*

**Understanding**
- ✅ Understand text, voice notes, photos and PDFs (media understanding is live)
- ✅ Detect and mirror the customer's language; ask language preference on first contact
- ✅ Human-sized replies — short messages, acknowledgement before action, never paragraphs
- Remember a customer's language, product interest and last conversation across sessions
- Read a forwarded order text or a photo of a handwritten order pad into structured line items
- Extract DL number / GST / firm details from a photographed document into the lead record

**Qualifying & selling**
- ✅ Run a paced qualification checklist (name, firm, profession, city, state, DL/GST, category)
- ✅ Write findings straight into the lead record (`update_lead_details`)
- ✅ Send product images with MRP captions (`share_product_images`)
- ✅ Send the product list — moving to a branded PDF document (in flight)
- ✅ **Never quote anything but MRP** — base rate / PTS / PTR never leave the building
- Answer scheme, MOQ, territory-availability and dispatch-time questions from a per-company KB
- Check whether a requested territory is already booked, and say so honestly
- Offer a call slot and write it to the rep's follow-up slots

**Serving existing distributors**
- Order status: "where is my order" → live status + tracking link
- Outstanding dues and account statement on request (their own only)
- Reorder: "same as last time" → draft order from last invoice, sent back as a proforma for confirm
- Accept a payment intimation (UTR or screenshot) → OCR → **pending** record, never a posted payment
- Send their price list / visual aid PDF on demand

**Handing off & behaving**
- ✅ `mark_ready_for_handoff` → rep takes over, bot stops re-qualifying
- ✅ Per-conversation and company-wide bot on/off; human can seize the thread any time
- Recognise "stop" / "band karo" / "unsubscribe" in any language → opt out instantly and confirm
- Know when it is outside the 24h window and switch to template-only automatically
- Escalate on frustration, complaint, or anything smelling like a medical question
- Refuse medical claims and price undercutting by construction, not by prompt luck

---

## 4. Ten MUST-HAVE company-side features

Without these the product is either non-compliant, blind, or unusable at scale.

1. **Opt-in / opt-out ledger with provenance.** Every number's consent state, source, timestamp, and
   the exact opt-out event. One-tap unsubscribe/resubscribe honoured across every send path. Legal
   requirement under both Meta policy and DPDP.
2. **Number health panel.** Quality rating (Green/Yellow/Red), messaging tier (1K→10K→100K→∞), MM
   eligibility, verification status, disconnect/expiry alerts — with proactive alarms, because a
   client whose rating goes Red silently stops reaching customers.
3. **Template Autopilot** (§2) — generation, linting, submission, webhook verdict, auto-repair,
   language fan-out, quality lifecycle.
4. **Live 24-hour window meter** on every conversation. "Free window closes in 4h 12m" on the thread,
   and after it closes the composer switches itself to approved templates only. Prevents the single
   most common WABA mistake.
5. **Shared inbox with ownership.** Assignment, rep-scoped by RLS, internal notes, SLA/first-response
   timer, follow-up flags, unassigned queue. WhatsApp is a team channel or it is chaos.
6. **Cost meter and budget caps.** Per-company spend by category (Marketing / Utility / Auth /
   Service), live rupee counter, monthly cap with hard stop and alert. Especially after 1 Oct 2026
   when in-window utility stops being free.
7. **Broadcast center — template-only, segment-driven, opt-in gated.** Audience built from existing
   `leads`/`parties` queries under RLS, throttled to the number's tier, MM Lite for marketing sends.
   The single biggest revenue-visible feature for PCD pharma (price lists, launches, schemes).
8. **Delivery funnel with decoded errors.** Sent → delivered → read → failed, with Meta error codes
   translated into plain English and an action ("131049: Meta capped marketing to this user today —
   retry tomorrow or wait for a reply").
9. **One thread = one customer record.** Automatic dedupe and linking by phone across leads, parties
   and orders, so no rep ever talks to a "new" number that is actually an existing distributor.
10. **Audit log + retention + claims screen.** Every outbound message attributable to a human or the
    bot, retention/deletion policy under DPDP, and a no-medical-claims screen on every outbound path
    including templates and broadcasts.

---

## 5. Ten GOOD-TO-HAVE features

Real rep time savings; none of them are load-bearing for compliance.

1. **Interactive buttons and list messages.** Our bot is text-only today. Buttons cut typing on a
   phone, shorten conversations, and reduce token cost.
2. **Quick-reply snippet library** per company and per rep, with merge variables and a `/` picker in
   the composer.
3. **Follow-up drip sequences** wired to the existing `fu1..fu5` slots — a quiet lead gets a timed
   nudge automatically instead of relying on a rep's memory. Reuse the existing generator/cron
   pattern, do not build a second scheduler.
4. **Labels and segments** on leads and parties, usable directly as broadcast audiences
   ("Punjab distributors, derma range, no order in 60 days").
5. **Payment intimation capture.** UTR or payment screenshot → OCR → **pending** payment record for
   human confirmation. Never touches `payments` on its own.
6. **Order lifecycle utility templates** — placed / packed / dispatched / delivered, with the
   existing `/track/$token` link. Utility category, so ₹0.115 not ₹0.88, and it is the highest-trust
   message a distributor receives.
7. **Click-to-chat links and QR codes** per rep and per campaign, with source attribution flowing
   into the lead's source field.
8. **Business profile manager** in Settings — display name, hours, address, about, away message,
   profile photo — without anyone opening WhatsApp Manager.
9. **Scheduled and queued sends** respecting quiet hours, Sundays and Indian holidays. Nobody's
   distributor should get a scheme blast at 11pm.
10. **Shared media library** — price lists, visual aids, product PDFs, launch creatives — one-tap
    send with per-document read receipts so a rep knows what actually got opened.

---

## 6. Ten AMAZING-TO-HAVE features

Genuine differentiation; each is buildable on what we already own.

1. **Two-way voice.** The bot already understands voice notes; let it *reply* in voice, in Hindi.
   Half of PCD distributors would rather talk than type, and no CRM in this segment does it.
2. **WhatsApp Flows for structured capture** — a native in-chat form for KYC (DL + GST + address) or
   an order pad. Meta-sanctioned, far higher completion than a link to a web form.
3. **Conversation intelligence.** Auto-summary on every thread, sentiment, buying-intent score,
   objection tagging — feeding the existing lead score so the pipeline reflects what was *said*, not
   what a rep remembered to type.
4. **Rep coaching dashboard.** Response-time distribution, reply-quality scoring, "you left a hot
   lead unanswered for 9 hours", handoff-to-close rate. Turns the inbox into a management instrument.
5. **Predictive reorder nudges.** "Ramesh Medical reorders every 28 days on average; it's day 31" →
   one-tap approved utility template. Pure margin, zero new data.
6. **Per-company AI knowledge base.** Schemes, territory policy, dispatch SLAs, product range, with
   citations — so the bot *answers* instead of deflecting to a human.
7. **WhatsApp Business Calling API.** Click-to-call inside the thread, recorded, transcribed, and
   logged to the lead automatically. Closes the loop between chat and the phone call that actually
   closes PCD deals.
8. **Multi-number failover.** A company with several numbers: watch quality per number and shift
   traffic away from one that is degrading, before Meta throttles it.
9. **Territory-aware auto-routing.** Derive the pincode/state from the conversation, match against
   `party_territories` and booked areas, and route the thread to the owning rep before a human reads
   it — flagging a monopoly conflict mid-conversation.
10. **Template performance analytics.** Read rate, reply rate, conversion-to-order and cost-per-order
    **per template**, so the company learns which sentence sells and retires the ones that don't.

---

## 7. Ten features "not even imaginable in an app"

The tier that makes a PCD owner say nobody else has this. All still inside the rails in §1.

1. **A self-healing template estate.** The system continuously A/B-writes template variants, measures
   read rate, reply rate and cost-per-order, retires losers, promotes winners, and rewrites anything
   drifting toward a quality pause — the company's entire message library optimises itself, forever,
   with nobody touching it.
2. **Ambient order capture.** A distributor forwards a photo of a handwritten order pad, or a
   rambling voice note. Fifteen seconds later they have a confirmed proforma PDF: line items parsed,
   validated against live stock, priced on *their* rate card, MOQ and scheme applied, discrepancies
   flagged. The rep sees a finished order, not a chat.
3. **Cashflow-aware follow-up.** The system knows every distributor's outstanding dues, ageing bucket
   and payment habit, and decides *when* and *how hard* to nudge each one — throttling itself to
   protect both the relationship and the number's quality rating. Collections that behave like a
   good human, at 500 accounts.
4. **Negotiation guardrails.** The owner sets a margin floor once. The bot may quote, hold and close
   a scheme within it, and escalates to a human only when the ask breaches the floor. The rep never
   loses a deal to a slow reply; the company never loses margin to an eager one.
5. **Whole-company WhatsApp memory.** Ask Ceremate: *"which distributors complained about
   Pantoprazole packaging last quarter?"* — answered from every conversation, every rep, every
   number, with citations back to the exact message. Institutional memory that survives rep attrition.
6. **A digital twin of each rep.** The bot learns an individual rep's phrasing, pace and closing
   style from their own history and covers their inbox after hours in their own voice — clearly
   disclosed as automated, handing back the moment they're online.
7. **Market radar.** Aggregated across every conversation in a company: which molecules are being
   asked for that we don't stock, which territories are heating up, which competitor's scheme keeps
   getting quoted at us. Product-launch intelligence that no PCD company has ever had.
8. **Ten-minute zero-touch onboarding.** A new client connects their WABA via Embedded Signup. Within
   ten minutes the system has read their product master, learned their brand voice, generated and
   submitted 25 templates across five languages, built their knowledge base, imported their
   distributor list with consent state, and gone live. Competitors bill a week of "setup".
9. **Regulatory autopilot.** Every message, template and broadcast pre-screened against Meta's
   commerce and healthcare policy, the Drugs & Magic Remedies Act, and each contact's DPDP consent
   state — plus a one-click compliance evidence pack if a regulator or Meta ever asks. Compliance
   stops being a fear and becomes a sales feature.
10. **Ban-risk forecasting.** Model each number's trajectory — quality, block rate, read rate, send
    mix, frequency-cap hits — and warn *days before* Meta acts, with the specific campaign to pause.
    Losing a WABA is an extinction event for a distributor business; predicting it is the most
    valuable thing we could possibly do for a client.

---

## 8. Suggested build order

**Phase 1 — don't get banned, don't go blind (must-haves 1, 2, 4, 10 + §2 linter).**
Consent ledger, number health, window meter, audit/claims screen. None of it is glamorous and all of
it is load-bearing.

**Phase 2 — the automation Harish asked for (must-have 3 + good-to-have 1, 2).**
Full Template Autopilot with buttons/lists and snippets. This is where the chore work disappears.

**Phase 3 — revenue surface (must-have 7, 8, 9, 6 + good-to-have 4, 6).**
Segments → broadcast → funnel → cost meter. Order lifecycle templates as the cheap, high-trust
default.

**Phase 4 — inbox as a team tool (must-have 5 + good-to-have 3, 5, 9, 10).**

**Phase 5+ — differentiation (§6, then §7).**

**Deliberately not building:** visual drag-and-drop flow builder (our bet is the opposite), keyword
reply tables (superseded by the LLM), SMS/email channels, WhatsApp catalog & in-chat payments
(§0.1 — prohibited for pharma), and a separate "subscriber" primitive (we have leads and parties).

---

## 9. Sources

- [Template fundamentals — Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview)
- [Template categorization — Meta for Developers](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization)
- [WhatsApp Commerce Policy — Meta](https://www.facebook.com/policies_center/commerce)
- [What industries in the health sector are allowed on WhatsApp? — tyntec](https://www.tyntec.com/helpcenter/docs/faqs/whatsapp-business/whatsapp-commerce-policy/what-industries-in-the-health-sector-are-allowed-on-whatsapp/)
- [Fix paused WhatsApp templates: unpause rules & quality recovery](https://www.wuseller.com/whatsapp-business-knowledge-hub/fix-paused-whatsapp-templates-unpause-rules-quality-recovery-guide/)
- [MM Lite API — AiSensy](https://m.aisensy.com/blog/marketing-messages-lite-api/)
- [Marketing Messages Lite (MM Lite) FAQs — Wati](https://support.wati.io/en/articles/11864672-general-faqs-marketing-messages-lite-mm-lite)
- [WhatsApp Business API pricing India 2026 — Chati](https://chati.ai/blog/whatsapp-business-api-pricing-update-for-2026)
- [WhatsApp Business API pricing 2026 — Blueticks](https://blueticks.co/blog/whatsapp-business-api-pricing-2026)
