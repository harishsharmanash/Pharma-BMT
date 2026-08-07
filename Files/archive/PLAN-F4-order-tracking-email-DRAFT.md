# PLAN — Feature 4: Order tracking page + email notifications (EMAIL ONLY)

**Status:** DRAFT plan (Fable / Opus 4.8). No app code changed. Two phases — **P1 (public tracking page)** ships independently and needs no email decision; **P2 (transactional emails)** waits on the sender-mechanism decision.

**Scope locked by Harish:** Email only. **No SMS, no WhatsApp** (WhatsApp deferred, SMS dropped). Keep it free / cheapest.

---

## 1. Current state (what already exists)

### Fulfillment flow
- `orders.fulfillment_status` is a text column, default `'Placed'`, values `["Placed","Dispatched","Delivered"]` (`FULFILLMENT_STATUSES` in `src/lib/use-orders.ts:63`).
- Status is changed **only** from the **LogisticsCard** on `src/routes/orders.$id.tsx` (the `patch()` helper → `useUpdateOrderLogistics`, `orders.$id.tsx:648`):
  - **"Mark dispatched"** → `{ fulfillment_status: "Dispatched", dispatch_date: today }`
  - **"Confirm delivery received"** → `{ fulfillment_status: "Delivered", delivered_date: today }`
  - **"Delay +3 days"** → extends `expected_delivery_date`
  - Delivery-proof upload → `delivery_proof_url` (storage path in `company-assets`, viewed via signed URL).
- `useUpdateOrderLogistics` (`use-orders.ts:344`) is a plain `orders` UPDATE + query invalidation. **This is the single choke-point** where an email trigger belongs.
- Logistics can also be set at order-create time via `useSaveOrder` (`input.logistics`), but the status buttons are the meaningful state transitions to notify on.

### Data available for a tracking page / email
- **Order:** `invoice_no`, `invoice_date`, `fulfillment_status`, `dispatch_date`, `expected_delivery_date`, `delivered_date`, `transporter_id`, `origin`/`destination`, `total`, `paid_total`, `due_total`, `is_cancelled`, `is_draft`, `deleted_at`, `company_id`, `party_id`.
- **Order items:** `product_name`, `pack`, `qty_billed`, `qty_free`, `rate`, `amount`, `batch`, `expiry`, `hsn`, `gst_pct` (per-line pricing exists — decide what to expose publicly).
- **Party (customer):** `email` (`use-parties.ts:14`), `firm_name`, `phone`, `city`/`state`.
- **Company:** `company_settings.email`, `logo_url` (storage path), `primary_color`, `phone`, `website`, `address` (`use-company.ts:5`).
- **Transporter:** `name` (via `useTransporters`). No tracking-URL field today — see §2 open question.

### Public-route mechanism (already proven)
- `Protected` (`src/components/app-shell.tsx:220`) is what gates every logged-in page — it redirects to `/auth` when there's no session. **A route is public simply by NOT wrapping its component in `<Protected>`.** `auth.tsx` is exactly this. So `/track/$token` just renders directly.
- The browser Supabase client (`src/integrations/supabase/client.ts`) always sends the **publishable/anon key**, so an anon can call an RPC or hit an anon RLS policy without a session. Perfect for the tracking read.

### Anon-safe read pattern (already proven — copy it)
- `supabase/migrations/20260724120000_company_domains.sql` already does exactly the shape we need for a **pre-auth, anon read of a narrow safe field set**: a `SECURITY DEFINER STABLE` SQL function `get_company_branding_by_domain(text)` with `GRANT EXECUTE ... TO anon`, returning only whitelisted columns and filtering internally. **This is the template for the tracking read.**

### Existing PDF/share infra (reuse, don't rebuild)
- `orders.$id.tsx` has `inr()`, `inrPdf()`, `generatePdf()`, `shareFileSmart`, `invoiceMessage`. The public page can render its own lightweight PDF/none — P1 doesn't need PDF at all.

### Edge-function pattern (for P2)
- 10 functions live under `supabase/functions/`. Template = `platform-manage-user/index.ts`: `Deno.serve`, `corsHeaders` (`Access-Control-Allow-Origin: *`), verify caller JWT via `userClient.auth.getUser(jwt)`, then a service-role client for privileged work. Deploy: `supabase functions deploy <name> --project-ref cjowrlrjyhdltbyqwozr`. Secrets: `supabase secrets set KEY=... --project-ref ...`.

---

## 2. Public tracking page (P1)

### Route
- New file `src/routes/track.$token.tsx`, route `/track/$token`. Component rendered **directly, NOT inside `<Protected>`**.
- No app shell/sidebar — a standalone branded page (like `auth.tsx`), so an anonymous customer sees only their order.
- Uses the design tokens from `styles.css` (per `KIMI-UI-REDESIGN-HANDOFF.md`): `rounded-2xl` cards, `shadow-soft`, `gradient-brand` header accent, Poppins. Glass used sparingly.

### Token minting — recommended: a column on `orders`
Add `orders.public_token text UNIQUE`, default `encode(gen_random_bytes(16),'hex')` (128-bit, unguessable, non-sequential). Backfill existing rows in the same migration. Rationale over a separate `order_tracking_tokens` table:
- One token per order maps 1:1 to the entity; no join, no lifecycle table to keep in sync.
- Revocation/rotation is still possible later (`UPDATE ... SET public_token = ...`).
- Add it to the hand-written `Order` type as **optional** (`public_token?: string`) per the types rule; the anon page never touches the typed client anyway (it uses the RPC).

### Anon read — recommended: one SECURITY DEFINER RPC returning JSONB
Do **not** open a broad anon RLS policy on `orders`/`order_items` — a definer function is tighter and exposes only the whitelisted shape. One RPC keeps it to a single network call:

```sql
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_token text)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'company',  jsonb_build_object('name', c.name, 'logo_path', s.logo_url,
                                   'brand_color', s.primary_color, 'website', s.website),
    'order', jsonb_build_object(
      'ref', o.invoice_no, 'date', o.invoice_date,
      'status', o.fulfillment_status,
      'dispatch_date', o.dispatch_date, 'expected_delivery_date', o.expected_delivery_date,
      'delivered_date', o.delivered_date,
      'transporter', t.name,
      'total', o.total, 'is_paid', (o.due_total <= 0)   -- see decision below re: financials
    ),
    'items', COALESCE((SELECT jsonb_agg(jsonb_build_object(
                'product', oi.product_name, 'pack', oi.pack,
                'qty', oi.qty_billed, 'free', oi.qty_free) ORDER BY oi.position)
              FROM order_items oi WHERE oi.order_id = o.id), '[]'::jsonb)
  )
  FROM orders o
  JOIN companies c ON c.id = o.company_id
  LEFT JOIN company_settings s ON s.company_id = o.company_id
  LEFT JOIN transporters t ON t.id = o.transporter_id
  WHERE o.public_token = p_token
    AND o.deleted_at IS NULL
    AND o.is_cancelled = false
    AND o.is_draft = false
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(text) TO anon, authenticated;
```

**Security properties (the biggest consideration on this feature):**
- **No enumeration:** token is 128-bit random, not the row id; there is no listing endpoint.
- **Exposes exactly one order** — the function is filtered by token and `LIMIT 1`; `SECURITY DEFINER` bypasses RLS but the function body is the only surface, and it returns a fixed whitelist. **No `company_id`, no `party_id`, no other company's data, no rep info, no per-line pricing (unless the financial decision below opts in).**
- Cancelled / draft / trashed orders return `null` (page shows "not found").
- Logo: the P1 page can skip the logo (needs a signed URL / a public read policy). Simplest MVP = brand color + company name text only; if the logo is wanted, reuse the **already-existing** `branding_public_read` anon storage policy from the `company_domains` migration (it public-reads `company-assets/*/logo.*`) — the tracking function returns `logo_path`, page builds the public object URL. **Recommend: text + brand color for P1, logo as a fast-follow** to avoid a storage-policy dependency in the first ship.

### Public-safe field set — DECISION for Harish (financials)
Recommended default (Amazon-like, minimal leak):
- **Show:** company name + brand color, order ref (invoice_no), order date, status timeline, dispatch/expected/delivered dates, transporter name, item list (product + pack + qty + free), and a single **"Paid" / "Payment pending"** badge.
- **Hide:** per-line rate/discount/GST, subtotal breakdown, party's own contact details, drug-license/GSTIN.
- **Open sub-decision:** whether to also show the **order total (₹)**. Reasonable to show total + paid/pending (the customer knows what they ordered). Recommend **show total + paid/pending, hide the line-item math.** Flip a single flag in the RPC if Harish wants total hidden.

### Timeline UI
- Vertical stepper, 3 nodes: **Confirmed/Placed → Dispatched → Delivered**. The app already uses a vertical timeline idiom (leads follow-up history, per audit line 167/219) — match that: filled `gradient-brand` dot for reached steps, muted ring for pending, connecting line, date under each reached node (`dispatch_date`, `delivered_date`, `expected_delivery_date` as the ETA hint on the Delivered node while pending).
- Below the timeline: an **items card** (`rounded-2xl shadow-soft`), then a **payment badge** row, then a small "Questions? Contact {company} — {website/phone}" footer with the "Business tool only" line.
- Overdue nicety: if `expected_delivery_date < today` and not delivered, a soft "Running a little late" note (mirror the `overdue` flag logic already in LogisticsCard).

### Link surfacing (inside the app)
- On the LogisticsCard, add a **"Copy tracking link"** / share affordance that produces `${APP_URL}/track/${order.public_token}` (APP_URL = `https://app.cerebyl.com`). This is the link the email will also carry. Cheap to add in P1.

### Transporter tracking URL (open, low-priority)
- No column exists for an external courier tracking URL. If Harish wants "track with the courier" too, add `orders.tracking_url text` (nullable) later and surface it on the page. **Not required for P1** — out of scope unless requested.

---

## 3. Email notifications (P2)

### Trigger — recommended: frontend calls an edge function after a successful status mutation
Two options:
1. **Postgres trigger + `pg_net`** on `orders` UPDATE → calls the edge function. Rejected: `pg_net` may not be enabled, triggers are invisible/hard to debug, and the migration-drift memory warns against surprise DB behaviour. Harder to make idempotent and to pass company context.
2. **Frontend fire-after-mutation** (recommended): in `useUpdateOrderLogistics.onSuccess` (or right where the "Mark dispatched"/"Confirm delivery" buttons succeed), detect a `fulfillment_status` change and call `supabase.functions.invoke('send-order-notification', { body: { order_id, status } })`. The function does its own auth + idempotency, so a double-click or a retry can't double-send.

Rationale: keeps all email logic in one debuggable place, no DB extension dependency, matches how the app already calls edge functions, and the email-log unique constraint (below) is the real idempotency guarantee regardless of trigger source.

**Which transitions email:** Placed (on order confirm/create), Dispatched, Delivered. For "Placed", fire from order-create success (`useSaveOrder`) when not a draft — or keep P2 to Dispatched+Delivered first and add Confirmed later. Recommend all three, gated by the idempotency log.

### Edge function `send-order-notification` (shape)
- Template on `platform-manage-user/index.ts`.
- **Auth:** require the caller's JWT; `userClient.auth.getUser(jwt)`; then with a service-role client confirm the caller's `profiles.company_id` matches the order's `company_id` (so a signed-in user can only trigger mail for their own company's orders). Reject otherwise.
- **Body:** `{ order_id, status }`.
- **Work:**
  1. Load order + party email + company_settings (service role).
  2. If `company_settings.order_emails_enabled` is false → no-op `{ skipped: true }`.
  3. If party has no email → `{ skipped: 'no_email' }`.
  4. **Idempotency:** attempt insert into `order_email_log (order_id, status)` with a UNIQUE(order_id,status); on conflict → `{ skipped: 'already_sent' }`. (Insert *before* send, update row with provider id/error after — or insert-then-send-then-patch.)
  5. Build the templated HTML email (company name, order ref, the status headline, the item summary, and the **tracking link** `${APP_URL}/track/${public_token}`). Plain, brand-colored header, "Business tool only" footer.
  6. Send via the chosen provider (see §3 decision). `Reply-To: order_email_reply_to || company_settings.email`. `From: "{Company} via Cerebyl" <orders@{sending-subdomain}>`.
  7. Patch the log row with `provider_message_id` / `error`.
- **Secrets:** `RESEND_API_KEY` (or Brevo/SMTP creds) via `supabase secrets set`, plus reuse `APP_URL` (already set).

### Sender mechanism — DECISION for Harish (the big one)

| Option | Free tier | "From" identity | Setup cost | Deliverability | Verdict |
|---|---|---|---|---|---|
| **Resend** | ~3,000/mo, 100/day | `orders@cerebyl-subdomain`, Reply-To = company | One-time DNS (DKIM/SPF/DMARC) on a cerebyl.com sending subdomain | Good (proper domain auth) | **Recommended for MVP** |
| **Brevo** | 300/day but **account-wide total across ALL tenants** | Same (shared domain) | Similar DNS | Good | Risky — one shared daily cap that all companies burn together; a busy tenant starves the rest |
| **Per-company Gmail SMTP** | 500/day **each** | Truly from the company's own Gmail | **Per company**: each admin makes a Google app password + you store SMTP creds per tenant | Best (real sender) | Best long-term, highest friction; defer |

**Recommendation:** **Resend** for P2. Cleanest API, per-account quota comfortably covers a pharma franchise's status emails, one DNS setup (not per tenant), and `Reply-To = company email` means replies still reach the client. Design `company_settings` so per-company SMTP can be bolted on later **without schema churn** (add nullable `order_email_from`, `order_email_reply_to`, and — for the future SMTP path — leave room for a per-company SMTP secret store; don't build it now).

Why not Brevo: the 300/day is **per Brevo account, not per address** — with multiple client companies sharing one Cerebyl Brevo account they share one 300/day bucket. That's a scaling trap the roadmap already flagged.

### Company setting (opt-in + reply-to)
Add to `company_settings`:
- `order_emails_enabled boolean NOT NULL DEFAULT false` — **opt-in** (recommended; don't email a company's customers until they turn it on and have verified they want it).
- `order_email_reply_to text` — defaults to `company_settings.email` at send time if null.
- Surface both on `settings.tsx` (a small "Customer order emails" section: toggle + reply-to input + a note that emails send from Cerebyl on the company's behalf).

---

## 4. Schema / migration (idempotent)

One migration file, e.g. `supabase/migrations/20260726120000_order_tracking_and_emails.sql`. Idempotent (`IF NOT EXISTS`, `CREATE OR REPLACE`, `DROP POLICY IF EXISTS`). Run by hand (dashboard SQL editor or CLI) — migrations never auto-apply.

```sql
-- P1: tracking token
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS public_token text;
UPDATE public.orders SET public_token = encode(gen_random_bytes(16),'hex')
  WHERE public_token IS NULL;
ALTER TABLE public.orders
  ALTER COLUMN public_token SET DEFAULT encode(gen_random_bytes(16),'hex');
CREATE UNIQUE INDEX IF NOT EXISTS orders_public_token_key ON public.orders(public_token);

-- P1: anon read function (full body in §2)
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_token text) ... ;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(text) TO anon, authenticated;

-- P2: opt-in + reply-to
ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS order_emails_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS order_email_reply_to text;

-- P2: email log (idempotency + observability)
CREATE TABLE IF NOT EXISTS public.order_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status text NOT NULL,                 -- 'Placed' | 'Dispatched' | 'Delivered'
  to_email text,
  provider text,
  provider_message_id text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS order_email_log_order_status_key
  ON public.order_email_log(order_id, status);   -- prevents double-send per status
ALTER TABLE public.order_email_log ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.order_email_log TO service_role;
GRANT SELECT ON public.order_email_log TO authenticated;
CREATE POLICY order_email_log_select ON public.order_email_log
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_platform_admin());
```
(Confirm `current_company_id()` / `is_platform_admin()` helper names against a recent migration before running — they're used in `company_domains.sql`.)

**Add `public_token?: string` (optional) to the `Order` type** in `use-orders.ts`; the tracking page reads via the RPC (`supabase.rpc('get_order_tracking', { p_token })` — use `(supabase as any).rpc(...)` until types regen). Company-settings type gets the two optional fields.

---

## 5. Open decisions for Harish
1. **Sender mechanism** (the big one) — **recommend Resend.** Confirm, or pick Gmail-SMTP-per-company if "from the company's own address" matters more than setup simplicity.
2. **Financial detail on the public page** — recommend **show order total + Paid/Pending badge, hide per-line pricing.** Or hide total entirely (one flag).
3. **Opt-in per company** — recommend **opt-in (default off).** Or default-on for all companies.
4. **Which transitions email** — recommend all three (Placed/Dispatched/Delivered); acceptable to launch with Dispatched+Delivered only.
5. **Logo on the public page** — text+color for P1, or wire the existing `branding_public_read` storage policy for the real logo now.
6. **External courier tracking URL** — add `orders.tracking_url` or skip. Recommend skip for now.

---

## 6. Manual / infra steps Harish must do
- **P1:** run the migration (token column + RPC). Nothing else — no external accounts.
- **P2 (Resend path):**
  1. Create a Resend account; add a **sending subdomain** of cerebyl.com (e.g. `send.cerebyl.com`).
  2. Add the **DKIM / SPF / DMARC DNS records** Resend provides, in the **Cloudflare DNS** for the `cerebyl.com` zone (registrar+DNS+host are all Cloudflare — same dashboard). Wait for Resend to show the domain "verified".
  3. `supabase secrets set RESEND_API_KEY=... --project-ref cjowrlrjyhdltbyqwozr`.
  4. `supabase functions deploy send-order-notification --project-ref cjowrlrjyhdltbyqwozr`.
  5. In each company's Settings, turn on "Customer order emails" and set reply-to.
- **Note on the sibling AI Worker:** unaffected — this feature adds a new Supabase function + a public app route, neither of which touches `acrowell-ai-worker`'s CORS/config. No mirror needed. (The public `/track` route is same-origin `app.cerebyl.com`.)

---

## 7. Phased plan + paste-ready implementer prompts

**P1 — public tokenized tracking page.** Self-contained, no email, high wow / low risk. Ships before any sender decision.
**P2 — email edge function + provider + settings + log.** Waits on the Resend-vs-SMTP decision.

---

### KIMI PROMPT — P1 (paste into a fresh Kimi chat)

> **Task: Add a public, no-login order-tracking page to the Cerebyl app (`Pharma BMT/leadenthrella`).**
>
> **1. Migration** — create `supabase/migrations/20260726120000_order_tracking.sql`, idempotent:
> - `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS public_token text;` then backfill `UPDATE public.orders SET public_token = encode(gen_random_bytes(16),'hex') WHERE public_token IS NULL;` then `ALTER COLUMN public_token SET DEFAULT encode(gen_random_bytes(16),'hex');` and `CREATE UNIQUE INDEX IF NOT EXISTS orders_public_token_key ON public.orders(public_token);`
> - Create `CREATE OR REPLACE FUNCTION public.get_order_tracking(p_token text) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ ... $$;` returning a jsonb object with `company` (name, logo_path, brand_color, website from companies+company_settings), `order` (ref=invoice_no, date=invoice_date, status=fulfillment_status, dispatch_date, expected_delivery_date, delivered_date, transporter=transporters.name, total, is_paid=(due_total<=0)), and `items` (jsonb_agg of product=product_name, pack, qty=qty_billed, free=qty_free ordered by position). Filter `WHERE o.public_token = p_token AND o.deleted_at IS NULL AND o.is_cancelled=false AND o.is_draft=false LIMIT 1`. Then `GRANT EXECUTE ON FUNCTION public.get_order_tracking(text) TO anon, authenticated;` (Copy the exact SQL from `Files/PLAN-F4-order-tracking-email-DRAFT.md` §2.) Do NOT open any anon RLS policy on orders/order_items — the definer function is the only anon surface.
>
> **2. Type** — in `src/lib/use-orders.ts` add `public_token?: string;` (optional) to the `Order` type.
>
> **3. Route** — create `src/routes/track.$token.tsx`, route `/track/$token`. Render the component **directly — do NOT wrap it in `<Protected>`** (this is a public page, like `auth.tsx`). Read data with `const { data } = useQuery(... await (supabase as any).rpc('get_order_tracking', { p_token: token }) ...)`. If the RPC returns null → a clean "Order not found" card.
>
> **4. UI** — standalone branded page (no app sidebar), using the app's design tokens (`rounded-2xl`, `shadow-soft`, `gradient-brand`, Poppins; glass sparingly). Layout:
>   - Header: company name (+ brand_color accent), small "Order {ref} · {date}".
>   - **Vertical 3-step timeline: Confirmed → Dispatched → Delivered.** Reached steps get a filled `gradient-brand` dot, pending steps a muted ring, with a connecting line. Show `dispatch_date` under Dispatched, `delivered_date` under Delivered; while not delivered, show `expected_delivery_date` as an ETA on the Delivered node. If `expected_delivery_date` is past and not delivered, a soft "running a little late" note.
>   - Items card: product · pack · qty (+ free). No prices per line.
>   - A single **"Paid" / "Payment pending"** badge; show order **total (₹)** next to it.
>   - Footer: "Questions? Contact {company} {website}" + "Business tool only".
>   - Logo: skip for now (name + brand color only).
>
> **5. In-app link** — on `src/routes/orders.$id.tsx` LogisticsCard, add a small "Copy tracking link" button that copies `https://app.cerebyl.com/track/${order.public_token}` to the clipboard (toast on success). Only when `order.public_token` exists.
>
> **Constraints:** TypeScript strict; keep `npx tsc --noEmit` error count at the 139 baseline (use `(supabase as any).rpc` to avoid new type errors). Don't touch unrelated files. The SQL migration must be run by hand later — do not attempt to auto-apply it.

---

### KIMI PROMPT — P2 (paste later, AFTER the sender decision — written assuming Resend)

> **Task: Add transactional order-status emails to Cerebyl. Prereq: P1 (order tracking) is merged; `orders.public_token` and `get_order_tracking` exist. Sender = Resend.**
>
> **1. Migration** `supabase/migrations/20260727120000_order_emails.sql`, idempotent:
> - `ALTER TABLE public.company_settings ADD COLUMN IF NOT EXISTS order_emails_enabled boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS order_email_reply_to text;`
> - Create `public.order_email_log` table exactly as in `Files/PLAN-F4-order-tracking-email-DRAFT.md` §4 (id, order_id FK, company_id FK, status, to_email, provider, provider_message_id, error, created_at; UNIQUE(order_id,status); RLS on; service_role ALL; authenticated SELECT where `company_id = public.current_company_id() OR public.is_platform_admin()`). Verify those helper names against `supabase/migrations/20260724120000_company_domains.sql` first.
>
> **2. Types** — add `order_emails_enabled?: boolean; order_email_reply_to?: string | null;` (optional) to `CompanySettings` in `src/lib/use-company.ts`.
>
> **3. Edge function** `supabase/functions/send-order-notification/index.ts` — model on `supabase/functions/platform-manage-user/index.ts`:
>   - CORS + OPTIONS handling. Require caller JWT (`userClient.auth.getUser(jwt)`); 401 if none.
>   - Body `{ order_id, status }`. With a service-role client, load the order; confirm the caller's `profiles.company_id` equals the order's `company_id`, else 403.
>   - Load party email + company_settings. If `order_emails_enabled` is false → `{ skipped:'disabled' }`. If no party email → `{ skipped:'no_email' }`.
>   - Idempotency: `INSERT INTO order_email_log (order_id, company_id, status, to_email, provider) VALUES (...)` — on unique-violation return `{ skipped:'already_sent' }`.
>   - Build HTML email: brand-colored header with company name, a headline per status ("Order confirmed"/"Your order has been dispatched"/"Your order was delivered"), an item summary, and a button linking to `${Deno.env.get('APP_URL')}/track/${public_token}`. Footer "Business tool only".
>   - Send via Resend API (`POST https://api.resend.com/emails`, `Authorization: Bearer ${Deno.env.get('RESEND_API_KEY')}`), `from: "{company} via Cerebyl <orders@send.cerebyl.com>"`, `reply_to: order_email_reply_to || company_settings.email`.
>   - UPDATE the log row with `provider_message_id` or `error`. Return `{ ok:true, id }`.
>
> **4. Frontend trigger** — in `src/routes/orders.$id.tsx`, after the LogisticsCard "Mark dispatched" and "Confirm delivery received" patches succeed (and, if easy, on non-draft order create for "Placed"), call `supabase.functions.invoke('send-order-notification', { body: { order_id: order.id, status: <newStatus> } })`. Fire-and-forget with a `.catch` that shows no error to the user (email is best-effort); optionally a subtle toast "Customer notified".
>
> **5. Settings UI** — in `src/routes/settings.tsx`, add a "Customer order emails" section: a toggle bound to `order_emails_enabled` and a reply-to input bound to `order_email_reply_to`, with a one-line note "Emails are sent from Cerebyl on your company's behalf; replies go to this address."
>
> **Constraints:** keep `npx tsc --noEmit` at the 139 baseline; `(supabase as any)` for new columns/log table. Migration + `supabase functions deploy send-order-notification` + `supabase secrets set RESEND_API_KEY=...` are run by hand later — don't auto-run them. Do not touch the sibling `acrowell-ai-worker`.

---

*End of plan. P1 is safe to build and ship immediately; P2 is blocked only on Harish confirming the sender mechanism (recommend Resend) and doing the one-time DNS verification.*
