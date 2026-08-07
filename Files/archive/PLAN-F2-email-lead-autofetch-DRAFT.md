# F2 — Email Lead Auto-Fetch — Build Plan (DRAFT)

Status: PLANNING. Nothing built yet. Scope locked by Harish (see roadmap F2).
Product = **Cerebyl**. Backend = Supabase `cjowrlrjyhdltbyqwozr`. Cloudflare account `admin@enthrella.com`.

Scope = **website forms + portals only** (IndiaMART, PharmaHopper, Pharmavends, DawaCharcha, TradeIndia).
**Meta/WhatsApp is explicitly OUT** (arrives via WhatsApp, separate later project). MX-takeover was rejected — do not revisit.

---

## 0. What already exists (so we don't rebuild it)

- **`profiles.handles`** — ALREADY SHIPPED in migration `20260725120000_rep_transfer_handles_offboard.sql` (F3). Column is `text NOT NULL DEFAULT 'pcd'`, CHECK `('pcd','third_party','both')`. **F2 consumes this — do NOT add it.** The values are exactly what our PCD/Third-Party classifier + round-robin pool need.
- Managers (not just admins) can already UPDATE rep profiles (policy `profiles_manager_update_reps`) — so the `handles` picker in settings/users already has a working write path for managers+admins.
- **`notifications`** table exists (`20260710150000_notifications.sql`) — `company_id, user_id, type, title, body, order_id?, party_id?, ref_date, is_read`, with a dedupe unique index on `(user_id,type,order_id,ref_date)`. We can raise an "unallocated lead" notification for managers off this.
- **`leads`** insert shape (from `lead-dialog.tsx` / `leads.index.tsx`): required = `company_id`, `rep_id` (NOT NULL), `date_received`, `stage`. Useful = `name, firm_name, contact, area_city, state, product_interest, products_interested, source, temp, call_summary`. `source` is free text; existing UI values `SOURCES = ["Meta","PharmaHoppers","IndiaMart","Website","Other"]` (crm.ts) — we will extend the display list to include the new portals.
- RLS `leads_insert` requires `company_id = current_company_id() AND (manager/admin OR own+active rep)`. **The Email Worker uses the Supabase service-role key, which BYPASSES RLS** — so it can insert a lead with any `rep_id` and any `company_id`. This is the key reason the worker holds a service-role secret, not the publishable key the AI worker uses.
- **`companies`** table is tiny (`id, name, created_at`) — **it has NO slug**. F2 must add a slug/intake address (see schema below).
- Helpers available in DB: `current_company_id()`, `is_manager_or_admin()`, `is_platform_admin()`, `is_active_user()`.
- `company_domains` (Phase E) is a separate concern (white-label app hostnames) — not reused here, but it's the precedent for "a company-scoped external-identity table + an edge function that syncs Cloudflare state."

---

## 1. Architecture (prose diagram)

**Option A — dedicated Cloudflare address (default):**

```
Portal (IndiaMART / PharmaHopper / Pharmavends / DawaCharcha / TradeIndia / website form)
   │  sends its lead-notification email TO:
   ▼
acmepharma@leads.cerebyl.com                     ← company's dedicated address (slug@leads.cerebyl.com)
   │
   ▼
Cloudflare Email Routing (catch-all on the leads.cerebyl.com zone/subdomain, FREE)
   │  routes every *@leads.cerebyl.com message to →
   ▼
Email Worker  (cerebyl-lead-intake, an `email()` handler)
   │  1. read `message.to` → strip domain → slug → look up company_lead_intake row (service-role REST)
   │  2. read `message.from` + raw MIME → pick per-source parser by From/Subject signature
   │  3. parser extracts {name, firm, phone, city, state, product_interest, raw_source_name}
   │        └─ if no parser matches / fields missing → Gemini fallback (sibling AI worker /extract-style call)
   │  4. classify PCD vs Third-Party (keyword scan; unsure → PCD)
   │  5. de-dupe: normalized phone vs existing company leads (service-role select)
   │  6. allocate rep: call Postgres RPC allocate_lead_rep(company, detected_type) → round-robin
   │  7. INSERT lead (service-role, bypasses RLS) with source = friendly portal name, rep_id = allocated (or NULL→manager)
   │  8. INSERT lead_intake_log row (raw + parsed + outcome) for observability
   │  9. message.forward(company.forward_to_inbox)   ← Cloudflare native forward, FREE + unlimited
   ▼
Lead appears in Cerebyl (assigned or unassigned) + a copy lands in the company's real inbox untouched
```

**Option B — connect existing inbox via IMAP:** no Cloudflare address. A **scheduled Worker (cron)** or **Supabase edge function on a cron** polls the company's mailbox read-only over IMAP (app-password), pulls unseen messages, and runs the identical steps 2–8. No forward step (the mail is already in their box). Higher friction + a stored credential (security note below). Recommend building Option A first and Option B as a fast-follow.

---

## 2. The Worker — NEW dedicated worker, do NOT extend the AI worker

**Recommendation: create a new worker `cerebyl-lead-intake` in `/Users/harishsharma/Claude/Pharma BMT/cerebyl-lead-intake/` (sibling folder, not in the repo, same as `acrowell-ai-worker`).**

Why not extend `acrowell-ai-worker`:
- **Different trigger type.** The AI worker is a `fetch()` HTTP handler behind Supabase-JWT auth. Email intake is an `email()` handler (Cloudflare Email Routing binding) with no user session at all. Bolting an unauthenticated email path onto a JWT-gated HTTP worker muddies its security model.
- **Different Supabase credential.** AI worker holds the **publishable** key (RLS-enforced, per-user). Intake needs the **service-role** key (RLS-bypassing) to insert leads for arbitrary reps. Keeping a service-role secret out of the user-facing AI worker is a real blast-radius win.
- **Independent blast radius / deploy cadence.** A bad email-parser deploy must never be able to take down the in-app Assistant, and vice-versa. Two small workers > one worker with two unrelated jobs.
- It CAN still call the existing Gemini plumbing — either by copying `gemini.ts`/`extract.ts` or (cleaner) via a **service binding** to the AI worker so the Gemini API key lives in exactly one place. Decide at build; a service binding is preferred so the LLM key isn't duplicated.

**Worker structure:**
```
cerebyl-lead-intake/
  wrangler.jsonc        ← name, send_email binding, vars (SUPABASE_URL), secrets refs
  src/
    index.ts            ← email() handler: orchestrates steps 1–9 above
    company.ts          ← slug → company_lead_intake lookup (service-role REST)
    parse/
      index.ts          ← router: pick parser by From/Subject; fallback to llm
      indiamart.ts      ← per-source regex/DOM parsers (one file each)
      pharmahopper.ts
      pharmavends.ts
      dawacharcha.ts
      tradeindia.ts
      website.ts        ← generic web-form → key:value body
      llm.ts            ← Gemini fallback (via service binding to AI worker, or inline)
    classify.ts         ← PCD vs Third-Party keyword scan
    dedupe.ts           ← phone normalization + existing-lead check
    supabase.ts         ← thin service-role REST helpers (insert lead, insert log, RPC call)
```

**wrangler.jsonc essentials:**
- `"name": "cerebyl-lead-intake"`, `"send_email": [{ "name": "LEAD_FORWARD" }]` (Email Routing send binding, needed for `message.forward`),
- `vars`: `SUPABASE_URL`, `GEMINI_MODEL` etc.,
- secrets (via `wrangler secret put`): **`SUPABASE_SERVICE_ROLE_KEY`**, and `GEMINI_API_KEY` if not using a service binding.
- **Do not commit the service-role key** — it's a wrangler secret only.

**Company resolution:** `message.to` = `acmepharma@leads.cerebyl.com` → slug = local part → `GET company_lead_intake?intake_slug=eq.acmepharma&option=eq.A` (service-role). If no row / option B slug / disabled → drop or bounce (log it either way).

**Forward step:** `await message.forward(row.forward_to_inbox)`. The destination address must be **verified once** in Cloudflare Email Routing before forward succeeds (per-company one-time click — see §7).

---

## 3. Schema / migration (idempotent, hand-applied)

New migration e.g. `20260801120000_lead_intake.sql`. Follow deploy-skill rules: idempotent (`IF NOT EXISTS`), explicit GRANTs to `authenticated` + `service_role`, RLS on, `(supabase.from("x") as any)` in the app until types regenerate.

### 3a. `company_lead_intake` (one row per company)
```sql
CREATE TABLE IF NOT EXISTS public.company_lead_intake (
  company_id       uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  option           text NOT NULL DEFAULT 'A' CHECK (option IN ('A','B','off')),
  intake_slug      text UNIQUE,                 -- e.g. 'acmepharma' → acmepharma@leads.cerebyl.com
  forward_to_inbox text,                        -- Option A: company's real inbox (must be CF-verified)
  auto_allocate    boolean NOT NULL DEFAULT true,
  -- Option B (IMAP) — SEE SECURITY NOTE. Store NOTHING here in plaintext.
  imap_host        text,
  imap_port        int,
  imap_username    text,
  imap_secret_ref  text,                        -- pointer to a secret store, NOT the password itself
  imap_last_uid    bigint,                      -- poll cursor
  rr_cursor        int NOT NULL DEFAULT 0,       -- round-robin cursor (see §5)
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```
- Slug uniqueness is global (the address space is global). Generate from company name, collision-suffix.
- RLS: a company's **managers/admins** may SELECT/UPDATE their own row (`company_id = current_company_id() AND is_manager_or_admin()`); `service_role` full access (the worker). Restrict which columns the UI updates — never let the client read/write raw IMAP secrets.

### 3b. `lead_intake_log` (observability — debug parse failures)
```sql
CREATE TABLE IF NOT EXISTS public.lead_intake_log (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     uuid REFERENCES public.companies(id) ON DELETE CASCADE,   -- nullable: unresolved slug
  received_at    timestamptz NOT NULL DEFAULT now(),
  intake_slug    text,
  from_addr      text,
  subject        text,
  source_matched text,        -- which parser matched, or 'llm', or 'none'
  parse_ok       boolean NOT NULL DEFAULT false,
  parsed         jsonb,        -- extracted fields
  outcome        text,         -- 'inserted' | 'duplicate' | 'unresolved_company' | 'parse_failed' | 'no_rep'
  lead_id        uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  allocated_rep  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  raw_excerpt    text          -- first ~4KB of raw body for debugging; NOT the full message
);
CREATE INDEX IF NOT EXISTS lead_intake_log_company_idx ON public.lead_intake_log(company_id, received_at DESC);
```
- RLS: managers/admins SELECT own-company rows; `service_role` full. Don't store full raw MIME long-term (PII); a bounded excerpt is enough to fix a parser.

### 3c. Lead insert — reuse `leads` as-is
No change to the `leads` table. Map `source` to a friendly portal name (`"IndiaMART"`, `"PharmaHopper"`, `"Pharmavends"`, `"DawaCharcha"`, `"TradeIndia"`, `"Website"`). Add these to the `SOURCES` display list in `crm.ts` so filters/badges render them. `stage='New'`, `temp='Warm'`, `date_received=today`, `rep_id` = allocated rep (see §5) or a sentinel/NULL-handling for unallocated.
- **Watch:** `leads.rep_id` is `NOT NULL` in the type. Confirm the DB column nullability. If NOT NULL, "unallocated" cannot be a NULL rep — options: (a) make the column nullable in this migration and update the "unassigned" UI, or (b) assign to the requesting manager/admin and flag `stage`/a tag as "needs assignment." **Open decision — see §8.** Recommend (a): allow `rep_id` NULL = unassigned, with a managers-only "Unassigned leads" view.

---

## 4. Per-source parsers

**Strategy:** deterministic template parser FIRST (each portal emails a consistent layout), Gemini fallback ONLY when no parser matches or required fields (phone/name) are missing — keeps LLM spend ~$0.

- **Router** keys off `message.from` domain + Subject signature (e.g. IndiaMART sends from a known `@indiamart.com` address with "You have received a new..." subjects). Each parser is a pure function `(raw, headers) => ParsedLead | null`.
- Portals typically send **HTML** with a labelled table (Name / Mobile / Company / City / Requirement). Parse by extracting text then regex on labels, OR parse the HTML table cells. Website forms are usually simple `label: value` bodies.
- **We cannot write final regexes without real samples.** BLOCKER on Harish: **provide 2–3 real sample lead emails (full source/`.eml`) from each of the 5 portals + the website form.** Until then, build the router + ONE parser (whichever portal Harish uses most, likely IndiaMART) against a sample, plus the generic website parser and the LLM fallback. The rest are added as samples arrive.
- LLM fallback returns the same `ParsedLead` shape; prompt it to output strict JSON (reuse the `extract.ts` JSON-mode pattern from the AI worker).

---

## 5. Round-robin allocation

**Do it in a SECURITY DEFINER Postgres function the worker calls** (cleaner, atomic, testable, keeps the cursor consistent under concurrent emails — a worker-side cursor races).

```sql
-- allocate_lead_rep(p_company uuid, p_type text) RETURNS uuid
-- p_type ∈ ('pcd','third_party'); pool = active reps whose handles = p_type OR 'both'.
-- Round-robin via company_lead_intake.rr_cursor advanced atomically (SELECT ... FOR UPDATE),
-- or "least-recently-assigned" = ORDER BY (count of leads assigned today/total) then name.
-- Returns the chosen rep_id, or NULL if the pool is empty.
```
- Pool = `profiles WHERE company_id=p_company AND is_active AND role='rep' AND handles IN (p_type,'both')`.
- **Recommended = least-recently-assigned** over a raw cursor: it self-heals when reps join/leave (a modulo cursor breaks when the pool size changes). Implement as "rep in pool with the oldest `MAX(leads.created_at)` (nulls first), tiebreak alphabetical (respects the standing alphabetical-default rule)."
- If `NULL` (no matching rep) → insert lead unassigned + notify managers (see §8).
- Gate the whole thing on `company_lead_intake.auto_allocate`; if false, always insert unassigned.
- `SECURITY DEFINER`, `REVOKE ALL FROM PUBLIC`, `GRANT EXECUTE TO service_role` (only the worker calls it). Mirror the pattern of the existing `transfer_book_of_business` function.

---

## 6. Settings UI (`src/routes/settings.tsx`, managers/admins only)

Add a **"Lead intake"** card, gated on `is_manager_or_admin()` (hide entirely for reps):
- **Intake option** radio: A (dedicated address) / B (connect inbox) / Off.
- **Option A:** show the assigned address `slug@leads.cerebyl.com` (read-only, copyable) + a "Forward a copy to" inbox field + a "Verify this address in Cloudflare" note/status. Instruction text: "Point your IndiaMART/PharmaHopper/website notification email to this address."
- **Option B:** IMAP host/port/username + app-password field (write-only; never render the stored value back). Prominent security note.
- **Auto-allocation** toggle (round-robin on/off).
- **Rep `handles` assignment** — a small table of reps with a PCD / Third-Party / Both selector each. (This may also/instead live on the users/team page — `users.tsx` already imports `handles` for F3; reuse that control rather than duplicating. **Open decision — one home for the handles picker.**) Writes go through the existing `profiles_manager_update_reps` policy.
- All new-table reads/writes use `(supabase.from("company_lead_intake") as any)` until types regenerate.
- Optional: a small **"Recent intake activity"** panel reading `lead_intake_log` so a manager can see what came in / what failed to parse.

---

## 7. Manual Cloudflare setup Harish must do (BLOCKING infra)

1. **Choose + create the zone/subdomain** for intake — recommend `leads.cerebyl.com` (see §8). Since `cerebyl.com` is a full Cloudflare zone already, `leads.` is just records within it; enabling Email Routing on the zone covers it.
2. **Enable Email Routing** on the `cerebyl.com` zone (adds the required MX + SPF/DKIM/TXT records — Cloudflare does this automatically). Confirm it doesn't disturb any existing mail on `cerebyl.com` (it shouldn't; intake addresses are on the `leads.` subdomain and/or a catch-all we scope carefully).
3. **Create a catch-all route** on `*@leads.cerebyl.com` → action "Send to Worker" → `cerebyl-lead-intake`. (Catch-all so we don't add a route per company; the worker resolves the slug itself.)
4. **Deploy the worker:** from `../cerebyl-lead-intake/` run `npx wrangler deploy` (wrangler is already authed as `admin@enthrella.com`). Set secrets first: `wrangler secret put SUPABASE_SERVICE_ROLE_KEY` (and `GEMINI_API_KEY` if not using a service binding).
5. **Per-company destination verification (recurring, one-time each):** for every company using Option A, add their `forward_to_inbox` as a **verified destination address** in Email Routing (Cloudflare sends them a one-click verify email). Forwarding fails silently until they click. This is a per-onboarding step — document it in the company-onboarding runbook.
6. **What Harish must PROVIDE us:** real sample lead emails (`.eml` / full source) from IndiaMART, PharmaHopper, Pharmavends, DawaCharcha, TradeIndia, and the website form — without these the per-source regexes can't be finalized.

Note the deploy-skill rules: migrations are hand-run (SQL editor or Supabase CLI, already linked); nothing auto-applies; Claude can't `git push` (commit, Harish pushes); typecheck baseline is 139 errors.

---

## 8. Open decisions for Harish

1. **Subdomain:** `leads.cerebyl.com` (recommended — isolates intake mail from any future `@cerebyl.com` mail, clean catch-all) vs apex `@cerebyl.com` (risky — a catch-all there swallows all company mail). **Recommend `leads.cerebyl.com`.**
2. **Unallocated leads = NULL rep_id?** Requires making `leads.rep_id` nullable + an "Unassigned" managers view. Alternative: assign to the manager as a holding pen. **Recommend nullable + unassigned view.**
3. **Notify manager on unallocated / parse-failure?** Recommend yes — write a `notifications` row (`type='lead_unassigned'` / `'lead_parse_failed'`) to all company managers, reusing the existing notifications system.
4. **Option B IMAP security posture.** Storing app-passwords is a real risk. Options: (a) defer Option B entirely, ship A first; (b) store the password only as a **Supabase Vault secret** (pgsodium/`vault.secrets`) referenced by `imap_secret_ref`, never in a plain column, decrypted only inside a definer function the poller calls; (c) Cloudflare Secrets Store. **Recommend: ship A first; if B is needed, use Supabase Vault, never a plaintext column.** Also decide who polls (cron worker vs Supabase cron edge function).
5. **LLM fallback wiring:** service binding to `acrowell-ai-worker` (one Gemini key) vs duplicate the key in the new worker. **Recommend service binding.**
6. **Handles picker home:** settings card vs users/team page (F3 already touches `handles` in `users.tsx`). Pick one to avoid two controls writing the same field.
7. **Dedupe window/strictness:** exact normalized-phone match only, or also fuzzy firm-name (like `duplicates.tsx`)? And dedupe against leads only, or parties too? **Recommend:** normalized-phone exact match vs open leads; if a matching lead exists, log as `duplicate` and skip (optionally append a note to the existing lead).

---

## 9. Phased plan + what's blocked

**Buildable NOW (no Cloudflare / no samples needed):**
- Phase 1 — **Schema:** `company_lead_intake` + `lead_intake_log` migration; `allocate_lead_rep()` RPC; make `leads.rep_id` nullable if decision 2 = yes; add new source names to `crm.ts`. Hand-apply, verify by querying.
- Phase 2 — **Settings UI:** Lead-intake card (managers/admins only), auto-allocate toggle, handles picker, address display. Uses `(… as any)`. Verify with `bun run build` + typecheck stays at 139.
- Phase 3 — **Worker skeleton:** `cerebyl-lead-intake` folder, `email()` handler, company resolver, dedupe, classify, service-role insert, log write, forward call, **the parser router + ONE real parser (IndiaMART) + generic website parser + LLM fallback.** Can be code-complete and unit-tested against a saved sample before any Cloudflare wiring.

**BLOCKED until Harish acts:**
- Cloudflare Email Routing enablement + catch-all route + worker deploy + per-company destination verification (§7) — **infra, Harish-only.**
- Final regexes for PharmaHopper / Pharmavends / DawaCharcha / TradeIndia — **need real sample emails.**
- Option B (IMAP) — pending the security decision (§8.4).

**Biggest blocker:** the Cloudflare Email Routing setup + real portal sample emails. Everything DB/UI/worker-skeleton can proceed in parallel and be ready to flip on the moment infra + samples land.

---

## 10. Paste-ready implementer prompt (Phase 1 + 2 — the unblocked DB + UI slice)

> **Task: F2 Lead Intake — DB schema + settings UI (Cerebyl / leadenthrella repo).**
> Do NOT touch the Cloudflare worker (separate, out of repo). Follow the `leadenthrella-deploy` skill: migrations are idempotent and hand-applied, add new fields to `src/lib/use-*.ts` types as OPTIONAL, use `(supabase.from("x") as any)` for the two new tables, keep `npx tsc --noEmit` at the 139-error baseline, `bun run build` must pass. Do not `git push` — commit only.
>
> 1. **Migration** `supabase/migrations/20260801120000_lead_intake.sql` (idempotent):
>    - `company_lead_intake` (PK `company_id` FK companies; `option` text CHECK ('A','B','off') default 'A'; `intake_slug` text UNIQUE; `forward_to_inbox` text; `auto_allocate` bool default true; `imap_host/port/username`; `imap_secret_ref` text; `imap_last_uid` bigint; `rr_cursor` int default 0; timestamps). RLS: managers/admins of the company SELECT+UPDATE own row (`company_id=current_company_id() AND is_manager_or_admin()`); GRANT to authenticated + service_role; full access to service_role.
>    - `lead_intake_log` (see schema in the plan — company-scoped, jsonb `parsed`, `outcome`, `lead_id`, `allocated_rep`, `raw_excerpt`). RLS: managers/admins SELECT own-company; service_role full.
>    - `allocate_lead_rep(p_company uuid, p_type text) RETURNS uuid` — SECURITY DEFINER, search_path=public. Pool = active reps, role='rep', `handles IN (p_type,'both')`. Pick **least-recently-assigned** (oldest MAX(leads.created_at) in pool, nulls first, tiebreak `full_name`). Return NULL if pool empty. REVOKE ALL FROM PUBLIC; GRANT EXECUTE TO service_role. (Mirror the style of `transfer_book_of_business`.)
>    - Make `leads.rep_id` nullable (`ALTER TABLE public.leads ALTER COLUMN rep_id DROP NOT NULL;`) to allow unassigned intake leads. [confirm with Harish first]
>    - GRANTs on every new table per the deploy skill's grants trap.
>    Apply it (Supabase CLI, already linked) and verify by querying the tables + calling the RPC with a test company.
> 2. **`src/lib/crm.ts`** — extend `SOURCES` to include `"IndiaMART","PharmaHopper","Pharmavends","DawaCharcha","TradeIndia"` (keep existing). Add optional types for the two new tables in a `use-lead-intake.ts` hook (SELECT + UPDATE own-company row).
> 3. **`src/routes/settings.tsx`** — add a "Lead intake" card, rendered only when `is_manager_or_admin`. Controls: option radio (A/B/Off), read-only `slug@leads.cerebyl.com` address + copy button, `forward_to_inbox` input, `auto_allocate` toggle, and a reps→handles (PCD/Third-Party/Both) picker writing `profiles.handles` via the existing manager-update policy. Option B fields (IMAP host/port/user/app-password) render but the password is write-only (never display the stored value). Use `(… as any)` for the new-table reads/writes.
> 4. Verify: `bun run build` passes, `npx tsc --noEmit 2>&1 | grep -c "error TS"` = 139, migration confirmed applied.
>
> Do NOT build the parsers, the round-robin caller, or any Cloudflare/email code — that's the worker phase, handled separately once sample emails + Email Routing are ready.

(Worker phase — `cerebyl-lead-intake` skeleton + IndiaMART/website parsers + LLM fallback — gets its own just-in-time prompt once Harish provides sample emails and completes the Cloudflare setup in §7.)
