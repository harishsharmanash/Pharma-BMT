# TICKET — Fix the WhatsApp Stage 0/1 build

You wrote this code. A review found 16 defects. **Every hard failure is silent** — a wrong column
name swallowed by `.catch(() => [])`, a PATCH that 400s into a catch block, or a settings flag
nothing reads. None of them show up in a typecheck or a build. Read this whole ticket before editing.

## THE RULE THAT CAUSED ALL OF THIS

You wrote queries against column names you assumed existed instead of checking. Then you wrapped them
in error handling that hid the mismatch.

**For every query you write or touch in this ticket:**
1. Confirm each column name against `leadenthrella/src/integrations/supabase/types.ts` first. That
   file is generated from the live database and is the only source of truth.
2. **Never write `.catch(() => [])` on a new query.** If a query can fail, log the actual error:
   `.catch((e) => { console.error("[context] query failed:", e); return []; })`. A silent empty array
   is how all four of the worst bugs in this batch hid.

## VERIFIED SCHEMA FACTS — use these, do not re-derive

| Fact | Value |
|---|---|
| `parties` has **no** `name` column | it is **`firm_name`**. Also has `assigned_rep_id`, `phone`, `deleted_at`, `city`, `state`, `gstin`, `dl_number`, `credit_limit`, `contact_person` |
| `whatsapp_templates` rejection column | **`rejection_reason`** — `meta_rejection_reason` does not exist |
| `whatsapp_templates.status` CHECK | `IN ('pending','approved','rejected')` — nothing else is writable |
| `whatsapp_templates` unique index | `(company_id, name)` — **name alone is NOT unique across companies** |
| `orders` filter columns | `is_cancelled`, `is_draft`, `deleted_at`, `due_total`, `party_id` |
| `order_requests` | `company_id, party_id, status, note, order_id, requested_by, reviewed_by, reviewed_at, reject_reason, scheme_summary` |
| `order_request_items` | `request_id, company_id, product_id, qty, quoted_rate, disc_pct, qty_free` |
| `profiles` | has `phone`, `role`, `company_id` |
| Switchboard storage | `company_settings.raw_settings.whatsapp_capabilities` |
| Knowledge base storage | `company_settings.raw_settings.whatsapp_ai_knowledge` |
| Gemini cache key | `hash(apiKey + companyId)`, TTL 3600s, in `cerebyl-whatsapp-worker/src/cache.ts` |

## MIGRATION RULE

`supabase/migrations/20260917120000_whatsapp_foundations.sql` has **not been applied yet**. Edit that
file in place — do not create a second migration. (If the operator tells you it *has* been applied,
write a new follow-up migration instead and say so.) Never run `supabase db push`. One SQL statement
per tap-to-copy block in your final report.

---

# PASS A — features that are silently inert (do these first)

### A1. Party lookup selects a column that does not exist
`cerebyl-whatsapp-worker/src/lead-intake.ts`, `resolveAndAttachIdentity`.

The query selects `id,name,assigned_rep_id` from `parties`. There is no `name` column, so PostgREST
returns 400, `.catch(() => [])` swallows it, `partyRows` is always empty, and **the entire
party-identity resolution never fires.** All four distributor tools in `bot.ts` are gated on `party`
and are therefore unreachable.

- Change the select to `id,firm_name,assigned_rep_id`.
- Update the row type and every downstream use.
- Replace the silent catch with a logging catch.

### A2. Party phone matching must be exact, not a substring
Same function. `phone=ilike.*<digits>*` is a substring match. A typo'd or longer stored number
produces a **false match**, and `bot.ts` then puts that firm's `credit_limit` and total outstanding
balance into the model's context — so the bot would read another customer's finances out loud.

Match on a normalised exact value. Reuse `normalizePhone()` from `src/dedupe.ts` (last 10 digits) and
compare against the same normalisation of the stored number. If `parties.phone` is stored
inconsistently, match on the last 10 digits explicitly — never an open `ilike` wildcard.

### A3. Template status webhook fails on every call, three ways
`cerebyl-whatsapp-worker/src/index.ts`, `handleTemplateStatusUpdate`.

1. It writes `meta_rejection_reason`. Use **`rejection_reason`**.
2. It writes status values `paused` / `flagged` / `disabled`, which violate the CHECK constraint.
   Fix by widening the constraint in the migration:
   `ALTER TABLE public.whatsapp_templates DROP CONSTRAINT IF EXISTS whatsapp_templates_status_check;`
   then re-add allowing `('pending','approved','rejected','paused','flagged','disabled')`.
3. **It looks up templates by `name` alone, with no `company_id` filter.** Names are only unique per
   company, so approving one company's template flips every other company's identically-named row.
   Scope the lookup by company: the WABA id is on the webhook payload at `entry[].id` — resolve it via
   `company_whatsapp_numbers.waba_id` → `company_id`, and filter on both.

Also subscribe to and handle `message_template_quality_update` while you are here — that is the event
that warns before Meta permanently disables a template.

### A4. `record_payment_intimation` records nothing
`cerebyl-whatsapp-worker/src/bot.ts`. The handler builds a result object saying the payment is "noted
for accounts verification" and performs **no database write**. The bot is confirming money that
exists nowhere.

Write a real pending record. Follow the existing distributor-portal rule: **a payment intimation is
never a payment** — it must not touch the `payments` table. Find how the portal stores intimations
(`supabase/functions/portal-*`) and reuse that table and shape. If no suitable table exists, add one
in the migration with company/party scoping and RLS matching the portal's, and say so clearly. Do not
invent a second concept.

### A5. The bot's master switch does nothing
`whatsapp_capabilities.bot_enabled` is written by the switchboard and read by **no code in the
worker**. Turning the bot off does not turn the bot off.

In `runBotTurn`, load `company_settings.raw_settings.whatsapp_capabilities` and return early when
`bot_enabled === false` — **but only after the STOP/START compliance block**. Opt-out must keep
working when the bot is disabled. Never place a capability check above a compliance check.

---

# PASS B — wrong money and wrong data reaching customers

### B1. Outstanding balance is computed from 5 orders and includes cancelled/draft
`bot.ts` fetches `orders?party_id=eq.X&deleted_at=is.null&limit=5` and sums `due_total` over that
slice for both the prompt context and `check_outstanding_dues`.

- Add `&is_cancelled=eq.false&is_draft=eq.false`.
- Compute the dues total from **all** open invoices, not the 5 most recent. Keep a separate small
  query (or a `head`/count-style aggregate) for the total; the recent-5 list is fine for display only.
- Label them distinctly in the tool result so the model cannot conflate "last 5 orders" with "total
  outstanding".

### B2. Order requests are priced at MRP
`create_draft_order_request` writes `quoted_rate: matched.mrp`. Distributors buy at PTS/PTR; MRP is
40–50% too high. The bot is deliberately never given trade rates, so it **cannot** compute the right
one.

Leave `quoted_rate` null (or omit it) so the rep prices the request on review. Do not load PTS/PTR
into the bot to "fix" this — the MRP-only boundary is a hard product rule.

### B3. An unmatched product silently becomes the first product in the catalogue
`const matched = matchProducts(products, item.product_name)[0] || products[0];`

Remove the `|| products[0]` fallback. Skip unmatched items, collect their names, and return them in
the tool result so the bot can honestly say which items it could not identify. Never guess a product
on an order.

### B4. Campaign cost default hardcodes the marketing price
The migration sets `whatsapp_campaign_recipients.cost_inr NUMERIC(10,4) DEFAULT 0.8800`. A utility
campaign that does not set it explicitly is costed 7.6× too high.

Change the default to `0` and always set the real value at insert time from the template's category
(marketing ≈ 0.88, utility/authentication ≈ 0.115).

### B5. A matched party with no rep leaves the conversation invisible
In the party branch, if `party.assigned_rep_id` is null and the number is not rep-specific, `rep_id`
stays null. RLS then hides that conversation from every rep; only managers see it.

Fall back to the same `allocate_lead_rep` round-robin already used for new leads.

### B6. A staff member messaging kills the bot with no explanation
The staff branch sets `status: 'human'` permanently. A rep testing the bot from their own phone gets
silence forever and will report "the bot is broken".

Keep the staff detection, but send one clear automated reply explaining this number is recognised as
internal staff and the bot does not qualify internal contacts. Log it.

---

# PASS C — make the switchboard real

Only 2 of 6 switches are enforced (`reps_can_send_from_company_number`,
`order_notifications_enabled`). Wire the rest, and add the granularity the owner asked for.

### C1. Enforce by removing the tool, never by instructing the model
`TOOL_DECLARATIONS` in `bot.ts` is a static const. Make it a function that takes the company's
capabilities and returns only the enabled tools. A tool that is not in the list cannot be called; a
prompt instruction saying "don't do X" is not an enforcement mechanism.

**Note:** the tool list is baked into the Gemini cached content. The cache key must therefore include
a hash of the enabled-capability set, or a company that flips a switch keeps the old tool list for up
to an hour. Update `cache.ts` accordingly.

### C2. Add the missing per-capability switches
Current keys are too coarse. Add, defaulting to the safe value shown:

```
bot_qualify_leads            (on)   bot_share_product_list      (on)
bot_share_product_images     (on)   bot_serve_existing_parties  (on)
bot_order_status             (off)  bot_outstanding_dues        (off)
bot_take_orders              (off)  bot_payment_intimation      (off)
notify_order_placed          (off)  notify_order_dispatched     (off)
notify_order_delivered       (off)  notify_payment_received     (off)
notify_payment_due           (off)
```

The four `bot_*` distributor capabilities map 1:1 to the four tools from A4/B1–B3. The `notify_*`
keys gate outbound automation.

### C3. Every "off" redirects, it does not refuse
When a capability is off, the bot must not say "I can't help with that". It must point the customer
at the company's app or their rep. Add a per-company redirect line to the knowledge base
(`raw_settings.whatsapp_ai_knowledge`) and put it in the system prompt so the model has something
concrete to say.

### C4. Enforce the remaining switches at their real choke points
- `broadcast_enabled` → checked in `supabase/functions/whatsapp-send-broadcast` before any send.
- `payment_reminders_enabled` / the `notify_*` keys → checked in `src/lib/whatsapp-order-notify.ts`.
- `marketing_frequency_cap_per_day` → enforced in the broadcast sender by counting marketing sends
  per contact in the last 24h before sending. Meta's own limit is ~2/person/24h; never exceed the
  company's configured value or Meta's, whichever is lower.

---

# PASS D — hygiene

### D1. Put the deleted comments back
The diff stripped the explanatory comments on: the inbound `wa_message_id` idempotency index and why
the 409 is swallowed; the conversation-creation race and the partial unique index; the delivery-status
rank ordering and why `failed` is sticky; `product_interest` being a DB-constrained column; and the
`call_summary` 2000-char cap. Each explains why non-obvious code exists. Without them the next person
"simplifies" the 409-swallow and every customer gets every reply twice. Restore them.

### D2. Purge the Gemini cache on change
Product, price, knowledge-base and capability edits currently take up to an hour to reach a live
conversation because `systemContent` is cached for 3600s with no invalidation. Add a purge: delete
the company's KV cache key when products, `raw_settings.whatsapp_ai_knowledge`, or
`raw_settings.whatsapp_capabilities` change.

### D3. Health sync has no schedule
`whatsapp-sync-health` only runs when someone opens the Health tab and clicks. Schedule it (pg_cron,
same pattern as the existing `daily-purge-old-data` job) so a number's quality drop is detected
without a human. Keep the manual button.

### D4. AI brief never runs for always-on companies
`generateAiBrief` is reached only when `handoffConfirmed` is true, which requires `!alwaysOn`.
Generate it whenever the bot marks handoff, regardless of always-on. It is also fire-and-forget at
the very end of the `ctx.waitUntil` budget — the first thing Cloudflare cancels. Move it earlier or
schedule it separately.

### D5. Tighten the template-generator auth
`/template/generate` now requires a valid Supabase JWT — good — but accepts **any** authenticated
user. Check the caller's `profiles.role` is `admin` or `manager` and that they belong to a company,
matching the gate in `whatsapp-manage-templates`.

---

# VERIFICATION — required, do not skip

You cannot run `tsc` or the tests yourself, so **do not claim you ran them.** Do this instead:

1. **Prove every query you touched is valid against the live schema.** For each one, quote the exact
   column list and the `types.ts` line range that confirms it. Any query you cannot confirm this way
   is not finished.
2. List every `.catch(() => [])` or `.catch(() => ({}))` remaining in the files you touched, and
   justify each one that hides a query failure.
3. State plainly which of the 16 defects you fixed, which you could not, and why.

## DO NOT

- Do not commit. Do not push. Do not deploy. The lead reviews the diff and ships.
- Do not run `supabase db push`.
- Do not load PTS/PTR/base_rate into the bot under any circumstances.
- Do not create a second table or concept where one already exists (payments, order requests,
  feature flags). Find the existing one and reuse it.
- Do not delete existing comments.
