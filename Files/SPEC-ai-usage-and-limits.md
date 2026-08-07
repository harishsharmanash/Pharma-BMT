# SPEC — AI usage, limits and billing (v1)

Written 28 Jul 2026 from Harish's brief. Build the first version, refine later.

## What already exists (do not rebuild)

`assistant_usage` (migration `20260715180000`) already records **per interaction**: `company_id`,
`user_id`, `action`, `input_tokens`, `cached_tokens`, `output_tokens`, `created_at`. So the *real*
cost data is already being collected — cached tokens included, which matters because most input is
served from the Gemini cache at a 90% discount.

**But it is written by the browser** (`use-assistant.ts`). That is fine for reporting and fatal for
rate limiting — see decision 1.

## Three things I'd change from the brief

### 1. Caps must be enforced server-side, not in the frontend
A limit checked in the browser is advice, not a cap: anyone with devtools clears it, and any bug
that skips the write gives free usage. Enforcement goes in a `SECURITY DEFINER` Postgres function
that the AI Worker calls **before** doing the work. It atomically counts today's usage, compares it
to the limits, and either records the event and returns `allowed`, or returns `denied` with a
reason. The browser only *displays* what the server reports.

### 2. "Company cap = users × per-user cap" adds nothing
50 users × 100/day already bounds the company at 5,000/day — a second limit at the same number can
never fire. A company cap is only useful when it can be set **lower** than the sum, which is the
real business case: a company on a smaller plan gets, say, 2,000/day shared across 50 users,
whichever users spend it.

So: `per_user_daily_messages` (default 100) and `company_daily_messages` (nullable). NULL means
"no separate company ceiling — the per-user caps are the only limit". Setting it makes it a genuine
shared pool.

### 3. Flat per-message pricing is right for v1, but we must be able to check the margin
Our cost per message varies enormously — a Tier-2 analytics question runs up to 4 tool rounds with
a large prompt; "hi" costs almost nothing. Charging a flat ₹0.10 is the right call for a customer
(predictable, explainable), but it means **our margin varies per message and we cannot see it**.

Fix: record the billable unit *and* keep the real tokens on the same row. Then the platform console
can show charged-vs-actual and we find out whether ₹0.10 is really 5× our cost or occasionally
below it — before it becomes a monthly loss rather than a surprise.

## Pricing (Harish's numbers, per-company overridable)

| Unit | Charge |
|---|---|
| Assistant message | ₹0.10 |
| Image read | ₹1.00 |
| PDF read | ₹2.00 |

## Who sees what — this distinction matters

- **Rep / user:** their own bar only — "23 of 100 messages today". No money.
- **Company admin:** their company's usage (messages, image reads, PDF reads), per-user breakdown,
  and **what the company is charged** in ₹. They must never see our Gemini cost.
- **Platform console (Cerebyl Operations):** everything, plus **our actual token cost and the
  resulting margin**. This is the only place cost-to-us appears.

## Data model

```
ai_limits                          -- one row per company, all optional overrides
  company_id uuid PK
  per_user_daily_messages int   default 100
  company_daily_messages   int   null      -- null = no shared ceiling
  price_per_message numeric      default 0.10
  price_per_image   numeric      default 1.00
  price_per_pdf     numeric      default 2.00
  is_enabled boolean             default true   -- false = assistant off for this company

assistant_usage  (extend the existing table)
  + billable_kind text null    -- 'message' | 'image' | 'pdf'
  + billed_amount numeric null -- what the COMPANY is charged, priced at the time of use
```

Pricing is stamped onto the row at the time of use, not looked up later — otherwise changing the
price would retroactively rewrite past bills.

## Enforcement flow

1. Frontend sends the request to the AI Worker with the user's JWT (already does).
2. Worker calls `rpc('claim_ai_usage', { p_kind })` **before** calling Gemini.
3. The function, in one transaction: counts today's rows for that user and company, compares to
   `ai_limits`, and either inserts the billable row and returns `{allowed: true, remaining}` or
   returns `{allowed: false, reason, limit, used}`.
4. On `denied` the Worker returns a friendly 429 and does no Gemini call — so a blocked user costs
   us nothing.
5. Token counts are written back onto the same row after the Gemini response.

"Today" is **IST**, not UTC — the users are Indian and a cap that resets at 05:30 local would be
baffling.

## What the user sees when blocked

Plain language, no jargon: *"You've used all 100 assistant messages for today. It resets at
midnight. Ask your admin if you need more."* Never a raw 429.

## Deliberately out of scope for v1

Monthly invoicing, payment collection, plan tiers, per-model pricing, and alerting when a company
nears its cap. All are easier once real usage data exists.
