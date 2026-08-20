# BotBiz — feature teardown & Cerebyl gap analysis

**Written:** 14 Aug 2026 · Claude (lead)
**Source:** 29 screenshots of `dash.botbiz.io` (Harish's own paid account — Growth Yearly,
₹7,646.40/yr via Razorpay, 477 subscribers, 100k message quota).
**Harish's instruction:** *"I basically want all these features in the app. Only remove the features
which you think Meta won't allow."* and *"make a complete map of all the features that we can add in
our app and make them automated or smoothly inflow with our current service systems."*

> **Read this before building any WhatsApp feature.** It is the competitive reference for what a
> mature WhatsApp-business-suite looks like. It is NOT a build order — see §6 for that.

---

## 1. BotBiz's information architecture (what the product actually is)

BotBiz is a **generic multi-channel WhatsApp marketing/automation suite** — not vertical-specific.
Its whole shape assumes: you have an audience ("subscribers"), you broadcast to them, you automate
replies, and you sell to them. Cerebyl is the opposite — a **vertical CRM** where WhatsApp is one
input channel into an existing lead/party/order system. That difference decides what's worth copying.

**Top-level sidebar (9 items):**

| Section | What it does |
|---|---|
| **Dashboard** | Subscriber growth (30d), label-added report, custom-field-assigned report, recent activity feed, AI Assistant status card (knowledge sources count, last training), quick-action tiles (New Broadcast, Open Inbox, Create Flow, Train AI, Connect Channel) |
| **Shared Inbox** | Unified live-chat inbox across channels. Filter by channel/account, follow-up list, per-conversation notification toggle, groupchat settings (beta), dark mode, "Add WhatsApp Subscriber" manually, installable PWA |
| **Setup WA API** | WhatsApp Business Account connection manager — connect *multiple* WABAs, per-number health: status, **quality rating**, **messaging limit tier** (TIER_2K etc.), last sync, **MM (marketing-message) eligibility status**, expiring-soon/disconnected counters |
| **Bot Manager** | The core. Six tabs — detailed in §2 |
| **Subscriber Manager** | Audience CRM — see §3 |
| **Broadcasting** | Campaign center — see §4 |
| **Webhook Workflow** | Webhook-triggered automation workflows with delivery funnel stats (targeted → processed → delivered → opened) |
| **eCommerce Catalog** | Catalog orders + manual-payment catalog orders |
| **Control Panel** | Settings & Integration (API keys per service), Agent Role (permission packages), Agent Manager (team users), Transactions (billing log) |

---

## 2. Bot Manager — the six tabs (the heart of the product)

### 2.1 Automation
| Sub-tab | What it does |
|---|---|
| **Keyword Replies** | Keyword → canned reply mapping, organised in folders. Each has a unique ID + reference name. |
| **Message Templates** | Create/sync/manage **Meta-approved templates**. Shows ID, name, category (Utility/Marketing), status (Approved), updated-at. Separate **Variables** tab for template placeholders. "Sync Templates" pulls approval status from Meta. |
| **Follow-up Sequences** | Automated drip campaigns — campaign name, campaign type, sequence type, last-sent-at. |
| **Quick Actions** | 9 system action buttons: **Get-started** (default flow on first contact), **No Match** (fallback when no keyword matches), **Location Reply**, **Un-subscribe**, **Re-subscribe**, **Chat with Human** (hand to live agent), **Chat with Bot** (hand back), **Confirm Order**, **Cancel Order** |
| **Outbound Actions** | Outbound webhooks fired by bot events — name, URL, created/last-called timestamps |
| **Webhook Workflows** | Same as the top-level nav item, scoped to this bot |

### 2.2 Data Collection
- **User Input Flows** — structured multi-question data capture inside the chat.
- **WhatsApp Flows** — Meta's native interactive **Flows** (form-like mini-apps rendered inside
  WhatsApp). Has Sync, publish, a **Flows Studio (Beta)** builder, and a preview-URL check before
  publishing.

### 2.3 AI
- **AI Configuration** — master on/off for AI agents; intent settings decide *which agent starts and
  how they switch*.
- **Agents** — multiple named AI agents (multi-agent routing).
- **AI Knowledge Base** — training sources; the dashboard tracks "Knowledge Sources: N" and "Last
  Training: <date>".

### 2.4 Engagement
- **Chat Entry / Chat Widget** — generates a website chat widget + embed code and click-to-chat links
  that drop a visitor into the WhatsApp bot.

### 2.5 Commerce
- **Store Automation** — WooCommerce/Shopify campaign automations (abandoned cart, order updates).
- **Product Catalog** — two order tables: **Catalog Orders** (native WhatsApp catalog checkout:
  order id, catalog, phone, buyer, amount, currency, status) and **Catalog Orders (Manual Payment)**
  (same + an **attachment** column — i.e. customer uploads a payment screenshot/UTR).

### 2.6 Integrations
**HTTP API** (outbound API calls usable inside flows, with per-API call/success/error counters and an
import-settings feature) · **Google Sheets** (OAuth connect, sheet+tab data-fetch campaigns) ·
**Autoresponder** · **Email** · **SMS**.

---

## 3. Flow Builder (the visual bot builder)

Drag-and-drop canvas, one flow per action (Get-Started, Chat With Human, etc.), with per-node live
counters (**Sent / Delivered / Subscribers / Errors** on message nodes; **Click / Subscribers /
Errors** on button nodes).

**Block palette:**
- **Messages:** Text · Image · Audio · Video · File · Location
- **Data Collection:** User Input Flow · WhatsApp Flows
- **Interactive:** Interactive Message (with 4 outlets — Buttons, List Messages, E-commerce, Next) ·
  Template Message · CTA URL Button
- **Flow Control:** Condition · New Sequence Campaign · Label Assign · Random Number Generator
- **Integrations:** HTTP API · Google Sheet Data Fetch

Message text supports merge variables (`#LEAD_USER_FIRST_NAME#`).

---

## 4. Subscriber Manager (audience CRM)

Filters: channel · bot/account · **labels** · **lists** · **sequences** · status · free-text search,
combinable as removable filter chips. Stat tiles: Total / Active / In Sequences / Recently Active
(7d). List + grid view, sortable, **bulk actions**, **export/import**.

Per-subscriber profile panel with tabs: **Overview · Agent · Labels · Lists · Sequences · Custom
Fields · Notes**, plus last-outgoing-message tracking.

---

## 5. Broadcasting (campaign center)

Per-channel (WhatsApp / SMS), scoped to a bot. 30-day stats: Total Campaigns · Completed · **Avg.
Open Rate** · Total Messages Sent · **Failed/Unreached**. Campaign table: processed / delivered /
opened / unreached / scheduled-at.

---

## 6. Gap analysis — what Cerebyl has, lacks, and should build

### ✅ Already shipped in Cerebyl (do NOT rebuild)
- WhatsApp Business Platform connection per company (Settings → Connect WhatsApp, Embedded Signup)
- Inbound webhook → **auto lead creation** (BotBiz has no CRM — this is our advantage)
- AI sales-qualification bot with Gemini tool-calling, language mirroring, paced questioning
- Human takeover (rep/manager/admin manual reply box) + per-conversation & company-wide bot on/off
- Delivery ticks (sent/delivered/read), live-updating chat via Realtime, clear-chat reset
- Gemini explicit context caching for cost control
- Message templates table (basic)
- Multi-number support with rep-specific handoff numbers

### 🟢 HIGH VALUE — build these (ranked)

| # | Feature | Why it matters for Cerebyl specifically |
|---|---|---|
| 1 | **Number health panel** — quality rating, messaging-limit tier, MM eligibility, last sync, disconnected/expiring alerts | We currently have *no visibility* into whether a client's number is being throttled or flagged by Meta. A client whose quality drops to Red silently stops reaching customers. This is operationally the highest-value item on the list and is pure read-from-Graph-API. |
| 2 | **Broadcast / campaign center** with delivery funnel stats | PCD pharma runs on price-list blasts, new-launch announcements and scheme circulars to distributors. Today reps do this by hand in WhatsApp. This is the single biggest *revenue-visible* feature here. Must be template-based (see §7). |
| 3 | **Labels + segments on parties/leads, usable as broadcast audiences** | We already have leads/parties; what's missing is the *segment → campaign* bridge. "All distributors in Punjab with no order in 60 days" → broadcast. |
| 4 | **Follow-up sequences (drip)** | Maps exactly onto our existing `fu1..fu5` follow-up slots and SLA work. A lead that goes quiet gets a timed nudge automatically instead of relying on a rep remembering. |
| 5 | **Quick Actions / system flows** — Get-started, No Match, Un-subscribe, Re-subscribe, Chat-with-human, Chat-with-bot | We have handoff, but no explicit **unsubscribe/resubscribe** handling. **Unsubscribe is not optional — see §7.** |
| 6 | **Catalog Orders (Manual Payment) with attachment** | This is *exactly* how PCD pharma actually works — distributor sends a payment screenshot/UTR. Pairs with the existing "payment intimation is NOT a payment" rule in the distributor portal (`project-distributor-portal`). Reuse that logic; do not invent a second one. |
| 7 | **Interactive messages — buttons & list messages** | Our bot is text-only today. Buttons/lists dramatically reduce typing for distributors on phones and cut the conversation length (= token cost). Low effort, high UX gain. |
| 8 | **AI Knowledge Base per company** | Each client has their own product range, schemes, and territory policy. Today the bot is told "never invent rates/policy" because it has no source. A per-company KB is what lets it actually answer instead of deflecting. |

### 🟡 MEDIUM — worth building later
- **WhatsApp Flows** (native in-chat forms) — great for structured order-taking, but Meta's Flows API
  is its own build. Revisit after the basics.
- **Website chat widget / click-to-chat entry** — useful for client lead-gen sites.
- **Google Sheets integration** — many pharma clients still live in Sheets; a data-fetch bridge is a
  real onboarding accelerator.
- **HTTP API blocks in flows** — only once we have a flow builder at all.
- **Per-node flow analytics** (sent/delivered/clicked per step).

### 🔴 SKIP — deliberately not for us
- **Visual drag-and-drop Flow Builder.** Enormous build. Our bet is the *opposite*: an LLM that
  handles conversation without anyone drawing a flowchart. Building both would undercut our own
  differentiator. (Reconsider only if clients demand deterministic scripted flows.)
- **Keyword Replies.** Superseded by the AI bot. A keyword table is what you build when you *don't*
  have an LLM.
- **SMS / Email / Autoresponder channels.** Scope creep; we are a CRM with WhatsApp, not an
  omni-channel marketing suite.
- **WooCommerce / Shopify / Salla automation.** Wrong vertical entirely.
- **Agent Role packages / Transactions / User Manager.** We already have roles, RLS, company
  features, and the platform console. Do not duplicate.
- **"Subscriber" as a first-class object.** We have leads and parties. Adding a third audience
  primitive would fragment the data model — add labels/segments to the entities we already have.

---

## 7. ⚠️ Meta policy constraints — what will get an account banned

Harish asked to strip anything Meta won't allow. These are the real limits, and several BotBiz
features sit right on the line:

1. **You cannot freely broadcast.** Outside the **24-hour customer service window**, every
   business-initiated message MUST be a **pre-approved template**, in the right category (Marketing /
   Utility / Authentication). Marketing templates are rate-limited *and* billed per conversation. Any
   "broadcast center" we build must be template-only outside the window — never free text.
2. **Marketing-message limits & quality rating are enforced by Meta,** not by us. Numbers move
   through tiers (1K → 10K → 100K → unlimited) and get throttled or blocked when quality drops.
   This is precisely why the **number health panel (#1 above) is the highest-priority item.**
3. **Opt-in is mandatory** for marketing messages, and **opt-out must be honoured.** An
   unsubscribe/re-subscribe mechanism is a *compliance requirement*, not a feature — this is why
   Quick Actions ranks where it does.
4. **No medical claims — ever.** Standing Cerebyl rule (`CLAUDE.md` §3), and independently a Meta
   healthcare-advertising restriction. Any template we auto-generate must be screened for this.
5. **Payments:** taking real payments in-chat pulls in invoicing/compliance obligations the product
   isn't ready for — which is exactly why `portal_payments` is DEFAULT_OFF + CONSOLE_ONLY. The
   **manual-payment-with-attachment** pattern (#6) is the compliant version: it records an
   *intimation*, a human confirms, and only then does anything touch `payments`.
6. **Bulk unsolicited messaging = ban.** Importing a bought list of 477 numbers and blasting them
   (which BotBiz's shape invites) is the fastest way to lose a client's WABA. If we ship broadcast,
   it must be gated on opt-in provenance.

---

## 8. Where this connects to what we already have

- **Broadcast audiences** should be built on the existing `leads` / `parties` queries + RLS, not a new
  subscriber table. Reps must only broadcast to their own — the same rep-scoping rule as everywhere.
- **Sequences** should reuse the existing notification/generator pattern
  (`generate_*_for_company/user`, cron via `generate_notifications_all()`), not a new scheduler.
- **Manual-payment orders** must reuse the distributor-portal rule: a payment intimation is not a
  payment.
- **Template management** already half-exists on `/whatsapp`; the missing pieces are Meta sync of
  approval status, categories, and variables.
- **Number health** slots into the existing `company_whatsapp_numbers` table — add quality/tier/limit
  columns and a periodic Graph API sync.

---

## 9. Provenance note

The original 29 screenshots were shared in the 13–14 Aug 2026 session and analysed inline; that
analysis was never written to disk and was lost to context compaction. The images were recovered
from the session transcript and re-analysed from scratch to produce this document. They are cached at
the session scratchpad path (temporary) — **if this reference matters long-term, copy them into
`Files/` properly.**
