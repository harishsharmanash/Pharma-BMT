# Phase E Solution — Custom Domains / White-Label (researched & decided)

*Written 20 July 2026. Resolves the blocker in `REMAINING-PHASES-BUILD-PLAN.md` §E.1. This document replaces Phase E's "blocked" status with a concrete architecture and build spec.*

---

## 1. The decision (TL;DR)

**Move frontend hosting off Lovable onto Cloudflare Pages (free), and use Cloudflare for SaaS (Custom Hostnames) to serve unlimited client domains from the one deployment. The Supabase backend stays exactly where it is.**

This is the same mechanism Shopify-style platforms use: every client domain is a "custom hostname" registered via API, SSL certificates are issued and renewed automatically by Cloudflare, and the client only ever has to create **one CNAME record** at their existing DNS provider. No client needs a Cloudflare account.

What you get:

- Console → company → **"Add custom domain"** button → type the domain → done. The system registers it with Cloudflare, shows the client their one DNS record, and flips to **Live** when it's detected.
- **₹0 / $0 per month** in hosting costs until you pass **100 client domains** (then $0.10/domain/month — i.e., 200 domains ≈ $10/month).
- Lovable is no longer needed for hosting at all. (One open question about Lovable Cloud — the backend — is covered in §8. Do not cancel anything until you read it.)

---

## 2. What the research confirmed

### 2.1 Lovable — dead end for white-labelling

- Custom domains require a **paid plan (~$25/month)** — there is no $5 tier. Free plan: no custom domains, Lovable badge stays.
- Each domain can only be attached to **one** Lovable project, and although Lovable does allow several domains/subdomains on one project, **every single one is manual**: dashboard steps + DNS verification per domain. **There is no API to automate it**, so the "click a button in my portal" experience is impossible on Lovable hosting.
- On downgrade to free: projects and code remain, GitHub sync remains, but custom domains stop working and the badge returns.
- **Verdict:** even at $25/month forever, Lovable hosting cannot power a self-serve white-label system. It was the wrong tool for this from the start — not a config issue.

### 2.2 Cloudflare for SaaS — the right tool (verified against official docs)

From the official Cloudflare for SaaS plans page and API docs:

| Fact | Value |
|---|---|
| Plans supported | **Free**, Pro, Business, Enterprise |
| Custom hostnames included | **100 free** |
| Price beyond that | **$0.10 per hostname per month**, pro-rated per day (removing a churned client stops the charge) |
| Max hostnames (Free plan) | **50,000** |
| SSL certificates | Issued + renewed automatically (ECDSA + RSA bundle), per hostname |
| Wildcard custom hostnames | Enterprise only (not needed — clients use their own full hostname) |
| API | `POST /zones/{zone_id}/custom_hostnames`, token permission **Zone → SSL and Certificates → Edit** |
| Client requirement | One **CNAME** record at their own DNS provider (GoDaddy, Route53, whoever) |

Two honest caveats:

1. **Enabling Cloudflare for SaaS asks you to add a payment method** (card or PayPal) even on the Free plan. The first 100 hostnames are still free; the payment method is for overage. No surprise charges as long as you know the $0.10/hostname number.
2. A hostname counts as live only when **both** `status: active` (hostname validated) **and** `ssl.status: active` (certificate deployed). The edge function in §6 checks both.

### 2.3 Vercel — viable but second choice

Vercel's Domains API can do this (dub.co runs exactly this), and their "Platforms Starter Kit" is the reference implementation. But: commercial use wants the Pro plan (~$20/seat/month), per-project domain caps apply, and bandwidth is metered. Cloudflare gives more headroom at $0. Keep Vercel as the fallback if Cloudflare ever doesn't work out — the app-side code (tenant resolution, console UI, DB schema) is identical either way; only the edge function's API calls change.

---

## 3. Target architecture

```
Client's DNS (their provider, no Cloudflare needed)
  app.acrowelllabs.com  ──CNAME──▶  customers.enthrella.com      ← the only record the client creates

Your Cloudflare zone (enthrella.com, Free plan)
  customers.enthrella.com  ──CNAME──▶  app.enthrella.com (proxied)   ← "fallback origin"
  app.enthrella.com  ──attached to──▶  Cloudflare Pages project (leadenthrella)

Cloudflare Pages
  Serves the SAME React build to every hostname. Auto-deploys from GitHub on every push.

Supabase (unchanged)
  Auth, database, RLS, storage, edge functions. The app talks to it by URL — it does
  not care which domain the browser is on.
```

Traffic flow for `app.acrowelllabs.com`:
request → Cloudflare edge (matches the custom hostname, presents Acrowell's auto-issued certificate) → fallback origin `customers.enthrella.com` → Pages serves the app → the app reads `window.location.hostname`, looks up the company, applies Acrowell branding.

Why the SPA makes this easy: the app is a Vite/React single-page app, so **tenant resolution happens in the browser**, not the server. Pages just serves static files; one build serves every client domain with zero server-side routing code.

---

## 4. The experience you're building toward

**Your side (console, e.g. `app.enthrella.com/console`):**

1. Companies → Acrowell Labs → **Domain** card → **Add custom domain**.
2. Type `app.acrowelllabs.com` → **Save**. (2 seconds. The edge function registers it with Cloudflare.)
3. The card immediately shows a status badge **Pending DNS** and a ready-to-copy instruction:

   > Ask Acrowell to add this record at their DNS provider:
   > **Type:** CNAME · **Name:** `app` · **Value:** `customers.enthrella.com`

4. When Acrowell adds it (usually 5–30 minutes), the badge flips to **Live** automatically (status is checked each time the page opens, plus a **Check now** button). SSL is already handled.

**Client side:** one CNAME record at their DNS provider. That's it — the same effort as linking a domain anywhere else. If they're not technical, it's a 5-minute screen-share.

**End user side:** staff open `app.acrowelllabs.com`, see the Acrowell-branded login (logo, name, colours — no Enthrella naming), and only Acrowell users can sign in there.

---

## 5. One-time infrastructure setup (Harish, click-by-click)

Do this once, before the build session. ~1–2 hours, no code.

1. **Cloudflare account** → create a free account → **Add site** → enter `enthrella.com` → choose the **Free** plan.
2. Cloudflare shows two nameservers. Go to wherever `enthrella.com` is registered and **change the nameservers** to Cloudflare's. **First**, note down every existing DNS record (website, email/MX, anything) and re-create them all in Cloudflare's DNS page before switching. Wait for the zone to show **Active**.
3. **Cloudflare Pages** → Workers & Pages → **Create** → **Pages** → **Connect to Git** → pick the `leadenthrella` GitHub repo.
   - Framework preset: **Vite** · Build command: `npm run build` · Output: `dist`
   - Environment variables: copy the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` / publishable key values the app uses today (from the Lovable/Supabase settings).
4. In the Pages project → **Custom domains** → attach **`app.enthrella.com`**. Open it, log in, click around — the app should work fully (auth, data, files) because it talks to Supabase directly. **This is the migration proof.**
5. In Cloudflare DNS: create **`customers.enthrella.com`** as a **CNAME → `app.enthrella.com`**, proxied (orange cloud).
6. **SSL/TLS → Custom Hostnames** → enable Cloudflare for SaaS (this is where it asks for a payment method — see §2.2). Set **Fallback Origin** = `customers.enthrella.com`. Wait for it to show **Active**.
7. **My Profile → API Tokens → Create Token → Custom token**: permission **Zone → SSL and Certificates → Edit**, zone resource **enthrella.com only**. Copy the token. Also copy the **Zone ID** from the zone's overview page (right sidebar).
8. In Supabase (project → Edge Functions → Secrets), add three secrets: `CF_API_TOKEN`, `CF_ZONE_ID`, and `CF_CNAME_TARGET` = `customers.enthrella.com`.

Done. From here everything else is code, specced below.

---

## 6. Build spec (for the Phase E build session)

Follows the house patterns from the master plan (manual SQL handover, `(supabase.from("x") as any)`, edge-function helper style of `platform-manage-user`).

### 6.1 Migration — `supabase/migrations/20260724120000_company_domains.sql`

```sql
CREATE TABLE public.company_domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  hostname text NOT NULL UNIQUE,                 -- e.g. app.acrowelllabs.com (lowercase, no protocol)
  cf_hostname_id text,                           -- Cloudflare custom hostname id
  status text NOT NULL DEFAULT 'pending_dns'
    CHECK (status IN ('pending_dns','pending_ssl','active','failed','removed')),
  status_detail text,                            -- last error / note from Cloudflare
  cname_target text NOT NULL DEFAULT 'customers.enthrella.com',
  created_at timestamptz NOT NULL now(),
  verified_at timestamptz
);
ALTER TABLE public.company_domains ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.company_domains TO authenticated;
GRANT ALL ON public.company_domains TO service_role;

-- Platform admin manages everything; a company's own admin may VIEW its domain row.
CREATE POLICY company_domains_select ON public.company_domains
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_platform_admin());
CREATE POLICY company_domains_platform_all ON public.company_domains
  FOR ALL TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

-- Pre-login branding lookup: the login screen is anonymous, so expose ONLY
-- safe branding fields via a definer function. No sensitive columns.
CREATE OR REPLACE FUNCTION public.get_company_branding_by_domain(p_hostname text)
RETURNS TABLE(company_id uuid, name text, logo_path text, brand_color text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.name, c.logo_path, c.brand_color   -- adjust to actual companies columns
  FROM public.company_domains d
  JOIN public.companies c ON c.id = d.company_id
  WHERE d.hostname = lower(p_hostname)
    AND d.status = 'active'
    AND c.status = 'active'
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_company_branding_by_domain(text) TO anon, authenticated;
```

Plus a storage policy so the **logo** is publicly readable pre-login (logos are not sensitive; keep everything else locked):

```sql
CREATE POLICY "branding_public_read" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'company-assets' AND (storage.foldername(name))[2] = 'branding');
```
(Build session: house rule is to reuse `company-assets` — store logos under `{company_id}/branding/…`. If existing logos live elsewhere, either move them or duplicate to this folder in this phase.)

### 6.2 Edge function — `supabase/functions/platform-manage-domain/index.ts`

Copy the auth/CORS scaffolding from `platform-manage-user`. Platform-admin JWT required, plus accept `x-cron-secret` for the scheduled `check_all` action (same pattern as D2.4).

Actions:

- **`add { company_id, hostname }`** — normalize (lowercase, strip protocol/path), validate it contains a dot and isn't one of our own domains, check the `UNIQUE` constraint, then `POST https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/custom_hostnames` with body `{ hostname, ssl: { method: "http", type: "dv", settings: { min_tls_version: "1.2" } } }` and header `Authorization: Bearer {CF_API_TOKEN}`. Insert the row with `cf_hostname_id` from `result.id`, status `pending_dns`. Return the row + the CNAME instruction text.
- **`check { id }`** — `GET …/custom_hostnames/{cf_hostname_id}`. Map `result.status` + `result.ssl.status` to our status: hostname not active → `pending_dns`; hostname active but cert not → `pending_ssl`; both active → `active` (set `verified_at`). Store any `verification_errors` into `status_detail`. If stuck in `pending_dns` for >24h, re-PATCH the SSL block once to re-trigger validation, then report honestly.
- **`check_all`** (cron) — same as `check` for every row not in `active`/`removed`. Schedule via pg_cron every 15 min if available (same optional pattern as D2.6); the manual **Check now** button covers it otherwise.
- **`remove { id }`** — `DELETE …/custom_hostnames/{cf_hostname_id}`, set status `removed`. (Billing is per-day pro-rated, so removing churned clients keeps you under the 100 free.)

Never trust the DB status alone for the UI badge — always refresh from Cloudflare on `check`.

### 6.3 Console UI

On `console.companies.$companyId.tsx` (from D3; or the platform detail page if D3 isn't built yet), a **Custom domain** card:

- No domain: an **Add custom domain** button + input. On save, call `add`, then show the DNS instruction panel (big, copy buttons for Type/Name/Value) and a short plain-English note: *"Send this to the client's IT person. If the client wants to use their root domain (`acrowelllabs.com` with no prefix) instead of a subdomain like `app.`, their DNS provider must support CNAME flattening/ALIAS — Cloudflare, Route53 and DNSimple do. A subdomain is always easier."*
- Existing domain: hostname, status badge (`Pending DNS` / `Issuing certificate` / `Live` / `Failed` with `status_detail` tooltip), **Check now** button, **Remove** button (with confirm).
- Also surface this same card (read-only for company admins, actions for you) inside the company's own **Settings** page later — v1 is console-only, which is fine: clients ask you, you click the button. That keeps the security surface to platform-admin only.

### 6.4 App-side resolution (replaces old E.2)

New hook `src/lib/use-domain-branding.ts`:

- Read `window.location.hostname`. If it's one of the platform's own hosts (`app.enthrella.com`, `*.pages.dev`, `*.lovable.app`, `localhost`) → return `null` (normal Enthrella experience).
- Otherwise call `get_company_branding_by_domain(hostname)`:
  - Row found → return branding; the login screen and app shell render the company logo/name/colours and hide Enthrella naming. Cache in TanStack Query for the session.
  - No row → show a plain screen: "This address isn't configured yet. If you were expecting your company portal, contact your administrator." (Never silently fall through to Enthrella branding on a client domain.)
- **Login restriction:** on a custom domain, after sign-in compare the user's `profile.company_id` to the resolved company; mismatch → sign out + "This account isn't part of this organisation."
- **Console safety:** `/console` routes render the 404 component on any non-platform hostname. The developer console is only ever reachable on `app.enthrella.com`.
- Keep the master plan's clarification in the handover: **the domain drives branding and login scoping only. Data security still comes entirely from RLS on the signed-in user's profile.** The domain is not a security boundary.

### 6.5 Supabase Auth detail (don't skip)

Password sign-in needs no redirects, so logins just work. But **email flows** (invites, password-reset links, magic links) use the project's **Site URL / allowed redirect URLs**, which today only cover the current domain. For each new client domain, add `https://app.acrowelllabs.com/**` to the redirect allow-list in Supabase (Authentication → URL Configuration). v1: do it by hand when you add the domain (30 seconds, one paste — include it in the handover checklist). A later iteration can automate it via the Supabase Management API inside the same edge function.

---

## 7. Costs — honest totals

| Item | Now | At 100 client domains | At 200 |
|---|---|---|---|
| Cloudflare zone (enthrella.com) | $0 | $0 | $0 |
| Cloudflare Pages hosting + CI builds | $0 | $0 | $0 |
| Custom hostnames (SSL for SaaS) | $0 (first 100 free) | $0 | ~$10/mo |
| Lovable subscription | whatever you pay today | **$0 for hosting** — see §8 | $0 |
| Supabase / Lovable Cloud backend | unchanged | unchanged | unchanged |

Payment-method-on-file required to enable Custom Hostnames (§2.2). Client domains are paid by clients (their own registrar renewals). SSL renewals: automatic, free, forever.

---

## 8. The Lovable endgame (read before cancelling anything)

Your code lives in GitHub (Lovable's two-way sync), so **building with Claude/Kimi directly against the repo and deploying via Pages works with no Lovable involvement at all**. Two things to sort out:

1. **Frontend hosting — fully solved by this plan.** Pages replaces it. Keep the Lovable publish working in parallel during the cutover week, then stop publishing.
2. **The backend is Lovable Cloud** (the Supabase project Lovable provisioned and bills). This plan deliberately does **not** touch it — Pages talks to the same Supabase URL, so nothing breaks. But whether Lovable Cloud keeps running, and at what cost, on a downgraded/free Lovable plan is the **one question to confirm with Lovable support before cancelling**. Three possible outcomes:
   - Cloud keeps working on free → cancel the paid plan entirely. Best case.
   - Cloud needs any paid plan → keep the cheapest one and treat it as your database bill; nothing else changes.
   - You want Lovable fully gone → migrate the database to your own Supabase org (pg_dump/restore + repoint the app's env vars + redeploy edge functions via the Supabase CLI). That's a separate, well-understood mini-project — do it deliberately, not as a side-effect of cancelling.

Also note the workflow wrinkle: today edge functions deploy through Lovable on push. After the move, either keep the Lovable project connected (free) so that keeps working, or switch to `supabase functions deploy` from your machine. Decide this in the build session's handover.

---

## 9. Edge cases & risks (and their answers)

- **Client deletes/breaks their CNAME** → their domain stops working; nothing else is affected. `check_all` flips the row to `failed` so you can see it in the console and nudge them.
- **Apex/root domains** (`acrowelllabs.com` with no prefix) → only works if the client's DNS supports CNAME flattening/ALIAS. Recommend the `app.` / `portal.` subdomain convention; the UI note in §6.3 says this to the client.
- **Verification stuck** → the `check` action surfaces Cloudflare's actual `verification_errors`; 95% of cases are "CNAME not added yet" or "added with proxy/flattening quirks at the client's DNS".
- **Pages serving unknown hostnames** — the fallback origin is a Pages-attached hostname, which is the standard pattern. If a client domain ever shows a Pages 404 during first rollout, the documented fix is a tiny Cloudflare Worker as the fallback origin that proxies Pages; flag it in the build session rather than pre-building it.
- **Testing before the first client** — custom hostnames can't be subdomains of your own zone, so do the end-to-end test with the first real client (Acrowell) or a $2 throwaway domain you buy for testing.
- **Churn** → removing a hostname stops its metered charge (per-day pro-rating). Nothing to clean up beyond the `remove` action.

---

## 10. Rollout order & test script

1. Harish does §5 (one-time setup). Checkpoint: `app.enthrella.com` on Pages is fully functional.
2. Build session executes §6 (migration + edge function + console card + domain branding).
3. Harish runs the SQL, sets the three edge-function secrets, redeploys the function.
4. Pilot with one client: add `app.acrowelllabs.com` in the console → send Acrowell the CNAME instruction → add the redirect URL allow-list entry (§6.5) → wait for **Live** → open the domain logged out (Acrowell-branded login) → sign in as an Acrowell user (works) → sign in as a *different* company's user (rejected with the right message) → confirm Enthrella naming appears nowhere.
5. Cutover: point any remaining traffic at Pages, stop publishing from Lovable, keep the old deployment as a fallback for one week.
6. Resolve §8 (the Lovable Cloud question): if the answer is "cut all ties", follow **`LOVABLE-EXIT-PLAN.md`** (written 20 July 2026) — it is the full backend-migration runbook and supersedes the three options sketched in §8.
