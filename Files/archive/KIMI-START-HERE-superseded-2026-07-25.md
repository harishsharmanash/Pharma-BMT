# KIMI — START HERE (Cerebyl / Pharma BMS)

**You (Kimi K3) are now the primary and only builder on this project.** You own the *thinking, the planning, the architecture, and the coding* end to end. There is no separate planner handing you specs anymore — read this file, read the repo, decide the approach yourself, and build it.

You have full read/write access to the whole `Pharma BMT/` folder. This file lives at its root on purpose: it consolidates the few facts that are **not** written down anywhere inside the repo. Everything else, you read directly from the files pointed to below.

---

## 0. How we work now

- **Harish is not a coder.** He tells you what he wants in plain language. You figure out *how*, then build it.
- **One human-in-the-loop step only: pushing to GitHub.** The local environment here cannot `git push` (it fails with "Device not configured"). So: you commit locally, then **tell Harish exactly what to push** — give him the branch, a one-line summary, and a short description. He runs the push.
- **Always verify before declaring done:** run the type-check / build, check `git status` and `git diff`, and only then report. If something fails, say so with the error — never claim success you didn't verify.
- **Keep it token-efficient.** Read only the files you need. Use the file map below instead of grepping the whole tree blindly.

---

## 1. What the product is

- **Brand: Cerebyl** — locked, final. The name **"Enthrella" and "Acrowell" must never appear in any user-facing UI** (Acrowell is just one *client company* inside the platform; Enthrella is backend-only infra — the Cloudflare account owner `admin@enthrella.com` and a parked domain). If you see "Acrowell CRM", "Lead CRM", "Pharma BMS", "Enthrella Operations", or "enthrella" in code or on a page, that is a **regression — fix it.** The internal dev console is **"Cerebyl Operations"**.
- **What it does:** a multi-company CRM for a **PCD pharma franchise** business — leads, parties (customers), orders/invoices, products, transporters, dues, team, plus stock/inventory and staff/salary. It is a **business tool only** — no medical claims (PDFs carry a "Business tool only" footer).

---

## 2. Where everything lives (infra — NOT in the repo, memorize this)

| Thing | Value |
|---|---|
| **Project root** | `~/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT` (moved to Google Drive 2026-07-24; the old `~/Claude/Pharma BMT` is Harish's frozen local backup — **never work in it**) |
| **Live app code** | `<project root>/leadenthrella` (this is the git repo) |
| **Reference/planning docs** | `<project root>/Files` (NOT version-controlled) |
| **GitHub** | `https://github.com/harishsharmanash/leadenthrella.git` — branch `main` |
| **Live site** | `https://app.cerebyl.com` (a Cloudflare Custom Domain on the Worker) |
| **Actual deploy target** | Cloudflare Worker `https://leadenthrella.icy-sunset-05b0.workers.dev` (still the real name; cerebyl.com points at it) |
| **Domain registrar + DNS + host** | Cloudflare, all-in-one, account `admin@enthrella.com` |
| **Backend** | Supabase project `pharma-bms-prod`, ref `cjowrlrjyhdltbyqwozr`, region ap-south-1 (Mumbai), free plan |
| **Stack** | React 19 + TypeScript, TanStack Start/Router (file-based routes), TanStack Query, Supabase (Postgres + RLS + Storage + Edge Functions), Tailwind v4 + shadcn/ui, framer-motion |
| **Deploy** | **Push ≠ deploy.** Frontend: `npm run build` then `cd .output && npx wrangler deploy`. Edge functions: `npx supabase functions deploy <name>`. Migrations: manual via SQL Editor, never `db push`. |
| **Ignore** | `leadenthrella-main/` is a stale duplicate — do not use it |

> **Lovable is dead.** This project was fully migrated OFF Lovable Cloud on 21 Jul 2026. Ignore anything mentioning `preview--leadenthrella.lovable.app`, Supabase project `crzddmxogxhirzqkrgwb`, or "Lovable rebuilds on push" — all dead. It is now on Enthrella's own Supabase + Cloudflare.

### GitHub repos in play
1. **`leadenthrella`** (`https://github.com/harishsharmanash/leadenthrella.git`, branch `main`) — the app. This is the only repo you commit to.
2. **The AI-assistant Worker is NOT a git repo** — see §3. It's a plain folder deployed with `wrangler`. Don't try to `git` it.

---

## 3. Sibling project — easy to forget, will silently break

**AI assistant ("Ceremate") Worker:** `<project root>/acrowell-ai-worker`
- Cloudflare Worker at `https://acrowell-ai-worker.icy-sunset-05b0.workers.dev`, powers the in-app assistant.
- **Not a git repo, not inside `leadenthrella`.** Deploy with `npx wrangler deploy` from that folder.
- Its `wrangler.jsonc` carries `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` / `ALLOWED_ORIGINS`. **Anything that changes the app's domain or Supabase project must be mirrored here or the assistant breaks.**
- Model in use: `gemini-3.1-flash-lite` (already ingests images + PDFs).
- CORS currently allows `.icy-sunset-05b0.workers.dev` + `cerebyl.com`/`.cerebyl.com`. It does **not** yet allow client white-label domains.
- Its spec: `Files/ai-assistant-build-spec.md` — **read its build-status block first** for assistant work.

**Rule:** when auditing "is X fully updated?", enumerate *deployed artifacts*, not just this repo. This Worker got left pointing at dead infra once already.

---

## 4. Read these IN the repo before you build

- **`leadenthrella/CLAUDE.md`** — the canonical project instructions (identity, file map, standing rules). Read it fully once.
- **`leadenthrella/.claude/skills/leadenthrella-deploy/SKILL.md`** — **the single source of truth for how any change reaches the live site**: deploy, DB migrations, edge functions, npm/bun deps, types, build sandbox. Read this before touching Supabase, schema, edge functions, or dependencies. Do not duplicate or contradict it.

### Standing product rules — never regress
- Dashboard "Leads by Source" is a **bar chart, never a pie**.
- **Default sort is alphabetical everywhere.** Any other order (highest dues, best-sellers) is an explicit opt-in only.
- **Reassigning a party's rep = managers/admins only.** Reps never see that control.
- **Reps only ever see their own data** (enforced by RLS).

### DB gotchas — read `migration-notes` below before schema work
- The migration-tracking table on the live DB is **empty / drifted**. **Never run `supabase db push`** — it can try to replay everything. Apply migrations deliberately/manually per the deploy skill.
- Audit live-schema drift via PostgREST 400-probes, not by trusting `supabase/migrations/` alone.

---

## 5. File map (so you don't grep blind)

Routes: `src/routes/` (TanStack file-based; each domain has a list route + often a `$id.tsx` detail route). Hooks: `src/lib/use-*.ts`. Migrations: `supabase/migrations/`.

- **Leads:** `src/routes/leads*.tsx`, `src/lib/use-leads.ts`, `src/lib/use-lead-products.ts`, `src/components/lead-dialog.tsx`. Views: `hot-warm.tsx`, `followups.tsx`, `my-day.tsx`, `duplicates.tsx`, `booked-areas.tsx`, `leaderboard.tsx`.
- **Parties (customers):** `src/routes/parties*.tsx`, `src/lib/use-parties.ts`, `src/lib/use-party-rates.ts`.
- **Orders/invoices:** `src/routes/orders*.tsx`, `src/lib/use-orders.ts` (largest hook, ~620 lines — orders, items, payments, dues aging, CSV import).
- **Products:** `src/routes/products.tsx`, `src/routes/product-performance.tsx`, `src/lib/use-products.ts`.
- **Stock/inventory:** `src/routes/stock.tsx`, `src/lib/use-stock.ts`.
- **Staff/salary:** `src/routes/team.tsx`, `src/lib/use-staff.ts` (largest module, ~613 lines).
- **Transporters:** `src/routes/transporters*.tsx`, `src/lib/use-transporters.ts`.
- **Company/settings:** `src/routes/settings.tsx`, `src/lib/use-company.ts`.
- **Assistant (Ceremate):** `src/routes/assistant-chat.tsx`, `src/lib/use-assistant.ts`.
- **Other:** `dashboard.tsx`, `auth.tsx`, `users.tsx`, `trash.tsx`, `developer.tsx`, `help.tsx`, `__root.tsx` (app shell). Backups: `src/lib/use-backup.ts`. Notifications: `src/lib/use-notifications.ts`. File extraction: `src/lib/file-extract.ts`.

---

## 6. Reference docs — what to read, what to skip

`Pharma BMT/Files/` holds planning + reference docs (not version-controlled, so nothing is ever deleted).

- **`Files/archive/` — DO NOT READ.** Everything in it is already built and shipped. A finished build plan reads exactly like a to-do list — opening one is how a shipped feature gets rebuilt by mistake. `Files/archive/README.md` has a status table if you need history.
- **Active `Files/`** holds only unbuilt work, living specs, and still-true reference. Structure (2026-07-24): `CLIENT-BACKLOG.md` (unbuilt client requests outside the roadmap), `Ideas/` (brainstorm docs), `data/` (xlsx artifacts), `Assets/` (branding/UI assets), `backups/` (cold-storage DB dump), `stress-test-assets/` (AI test PDFs), `App UI inspirations/`.
- For the assistant, `Files/ai-assistant-build-spec.md` is the living authority.
- **When you finish a feature, move its plan into `Files/archive/`** and add a one-line status to that README's table.

---

## 7. Current state & what to build next

The big **8-feature roadmap** (set 22 Jul 2026). Status verified against actual commits:

**DONE:** F3 rep transfer/offboarding · F5 product gallery/lightbox · F7 Ceremate rename (~90%; English intro now shipped) · F8 whole-app UI overhaul (every substantive route reskinned — brand system: Poppins, blue palette, pill buttons, framer-motion). Bonus shipped: collapsible sidebar, `/refer` referral page, quick-view peek sheets, chart polish, statement-PDF fix, empty-trash buttons.

**DONE (shipped 23 Jul 2026):**
- **F4-P1 — Order tracking.** `orders.public_token` + `get_order_tracking(token)` RPC + public `/track/$token` page + "Copy tracking link" on LogisticsCard.
- **F1 — Geo monopoly: COMPLETE (all 3 phases).** Geo cols on `parties`, haversine conflict w/ string fallback, radius selector + click-to-drop Leaflet pin map in PartyDialog (client-only lazy `src/components/territory-map.tsx`, OSM tiles, SSR-safe), `/booked-areas` List/Map toggle, map→PDF export. Deferred niceties: India GeoJSON overlay, Nominatim search box, order-time flagging (open decisions in the F1 plan).
- **F6 — Ceremate full UI: COMPLETE (all 4 phases).** Full-page `/ceremate` w/ persistent history (`assistant_conversations`/`assistant_messages`), FAB repointed + drawer gone, "+" guided flows (add lead/party/product/order + Request a feature → `feature_requests` + `/console/features` console surface), document attachments via local file-extract, Web Speech mic dictation. Audio-file attach deliberately deferred (low value/high effort).

**DONE (shipped 24 Jul 2026):**
- **F4-P2 — Order status emails, COMPLETE.** `send-order-notification` (provider chain: company's Brevo → company's Resend → platform Resend, idempotent via `order_email_log`), BYOK keys in `company_email_keys` (write-only, service-role only) managed from **console → company → Email sending accounts** (`manage-email-keys`, platform-admin gated), opt-in toggle + reply-to stays in company Settings, share-confirmation popup (Mail/WhatsApp/public link) on dispatch/delivered.
- **Console user management, COMPLETE.** Platform admins can add users and edit everything (name, role, phone, login email, password, deactivate, delete) via `platform-manage-user` (`create_user` + `update_email` actions).
- Login password show/hide eye toggle (both auth layouts).
- **F2 — Email lead auto-fetch, COMPLETE.** `cerebyl-lead-intake` Cloudflare Email Worker (sibling folder, not in git) receives catch-all `*@leads.cerebyl.com` via Email Routing, resolves company by slug, real MIME body extraction (`rawToText`), deterministic IndiaMART/website parsers with Gemini fallback, PCD/third-party classify, phone dedupe, `allocate_lead_rep()` allocation, lead insert, forwards original mail to the company's verified inbox. Log-first design: `lead_intake_log` row inserted on receipt and updated per step, so crashes always surface with the exact error in Settings → Email lead intake. **Gotchas hit:** worker source names must map to DB CHECK spellings (`IndiaMART`→`IndiaMart`, etc. — see `dbSource` in worker); `leads.product_interest` is a category ENUM — free-text products go to `products_interested`. Verified end-to-end 24 Jul (mail → parse → lead → forward). Duplicates LAND marked (`leads.is_duplicate`/`duplicate_of`, migration `20260724160000`, amber badge in UI) — Harish's call, to track which portals feed repeat queries. Plan archived to `Files/archive/PLAN-F2-*.md`. **Still open:** per-portal deterministic parsers for PharmaHopper/Pharmavends/etc. need real sample `.eml` files from Harish (Gemini fallback covers them until then).

**DONE 24 Jul 2026 — encrypted API-key storage.** `company_secrets(company_id, name, secret_enc bytea)` + pgcrypto; master passphrase in Supabase Vault as `company_secrets_master` (created by Harish by hand, never in repo — if lost, keys are unrecoverable and companies re-paste). All encrypt/decrypt inside security-definer `set_company_secret`/`get_company_secret`, executable by service_role ONLY. `company_email_keys` retrofitted (plaintext key columns dropped, `sender_email` stays); `manage-email-keys` + `send-order-notification` use the RPCs (response shapes unchanged, no frontend change). **This is THE key store — the AI setup adds keys as `name='gemini_api_key'` rows, no new infrastructure.**

**DONE 24–25 Jul 2026 — V3 Phase 8 conversational core (verified live).** Tier-2 agentic loop: worker `/analyze` (mode AUTO, second cache `gemini:cache2:name`, SSE prose vs JSON toolRequests), `analyze(question)` routed from Tier-1, frontend loop driver (≤4 steps, 6 whitelisted aggregate read-tools, stock snapshot rep-gated), streaming bubble, `assistant_usage` logging, transcripts excluded from history. **gemini-3 gotcha:** streamed functionCall parts carry `thoughtSignature` which MUST round-trip verbatim — worker sends raw part as `callPart` in toolRequests, frontend echoes it in toolResults; without it Gemini 400s "missing thought_signature". Worker `coerceResponse` parses string toolResults back to objects. Small-fix batch also shipped: plan-executor 7 search reads, ledger enum label, `share_invoice` party-name routing. **DEPLOY TRAP (cost a full debug session 25 Jul):** bare `npx wrangler deploy` in `.output` ships to wrong worker `harishsharmanash-leadenthrella`; app.cerebyl.com listens to worker `leadenthrella` — always `npx wrangler deploy --name leadenthrella --compatibility-date <today>`. Open rough edges: Tier-1 misrouted "sabse zyada dues kiske hain?" to ask_clarification once (routing prompt may need a ranking-question example); answers take several seconds by design (Tier-1 call → /analyze → tool round-trip → streamed prose).

**NEXT UP — AI setup remaining (V3 Phases 9–12).** Phase 9 analytics (chartSpec/CSV), Phase 10 leftovers (`assistant_memories`, 30-day retention), Phase 11 nightly digest + admin toggle, Phase 12 leftovers (TTS, multi-image). Small open items: 608-row corpus re-run, V6/V7 live verifications (need Harish's login), ₹99 test rate cleanup on Shree Balaji, stale-catalog-name limitation.

- **Deferred decisions:** per-company `{slug}@orders.cerebyl.com` sender addresses (parked — eats our shared Resend quota anyway); `Files/CLIENT-BACKLOG.md` items as Harish prioritises them.

**You own the build order and the approach — decide both yourself.** The drafts above are starting points, not gospel; schema and features have already moved since they were written. For each feature: read its draft, re-verify against the current code, then decide *how* to build it and *in what order* to tackle the backlog. Harish tells you what he wants; you plan it. (Prior-session notes floated F4-P1 → F6-P1 → F1-P1 as one possible order and flagged that F2 is gated on Harish's Cloudflare setup and F4-P2 on Resend DNS — treat that as context, not instruction.)

---

## 7b. Model & thinking policy — READ `KIMI-MODEL-POLICY.md`

You pick the model and thinking effort for every task — it's your call, not Harish's. Hard rules (full detail in `Pharma BMT/KIMI-MODEL-POLICY.md`): **never use `max`/ultra thinking; ~80% of work runs on `low`; at most 20% on `high`.** Start every task on low, step up only if low visibly struggles. Cheapest model that clears the bar (Highspeed → K2.7 Coding → K3-only-when-hard). The config defaults are already set to enforce this (`default_effort = "low"`).

---

## 8. Superpower skills — install these to code better and burn fewer tokens

Kimi supports **skills** (reusable SKILL.md instruction packs) that load only when relevant, so you spend tokens on building, not re-deriving process. Two ways to load them:

- **Auto-discovered:** Kimi picks up skills from your user skills dir and the project skills dir automatically.
- **Explicit:** `kimi --skills-dir <dir>` (repeatable) to point at a specific folder for a run.

**Already in this project — use it:** `leadenthrella/.claude/skills/leadenthrella-deploy/` is a working SKILL.md-format skill. Kimi reads the same `SKILL.md` format, so it works as-is — **always let it drive deploy/migration/edge-function/deps decisions.**

**Worth adding (each is a small `SKILL.md` folder you drop in the skills dir):**
1. **`cerebyl-context`** — a trimmed, always-loadable version of *this file* so every new Kimi session starts with the identity + infra + file map without re-reading everything. Biggest token saver.
2. **`supabase-migrations`** — the "never `db push`, audit drift via PostgREST probes, apply manually" ritual as a skill, so schema work is safe by default.
3. **`ceremate-assistant`** — the AI-worker facts from `Files/ai-assistant-build-spec.md` (Worker URL, model, CORS, deploy-from-sibling-folder) so assistant work doesn't forget the out-of-repo Worker.
4. **A commit/push skill** — encodes the "commit locally → hand Harish a summary + description to push" flow so every session ends the same clean way.

To create one: make a folder with a `SKILL.md` that has a short frontmatter `name` + `description` (the description is what Kimi matches on to decide relevance) and the instructions in the body. Keep descriptions specific — that's what makes the right skill fire at the right time. You can also pull community skill repos in the same SKILL.md format and drop them in the skills dir; just review any third-party skill before trusting it.

> **Verify Kimi's exact skills-dir path** with `kimi --help` / the docs at `https://moonshotai.github.io/kimi-code/` before assuming a location — then put the four above there so they auto-load.

---

## 9. Keep this current

After any change that alters **infrastructure, paths, domain, brand, or completed-phase status** (not routine feature work), update **this file**, `leadenthrella/CLAUDE.md`, and the deploy skill **in the same session**. Same session, same rule for **housekeeping**: shipped work's docs move to `Files/archive/` (with a status line in its README table), `Files/` stays structured, and the frontend deploy ritual (build + wrangler deploy) is part of "done", never an afterthought. Stale infra facts are how the AI Worker got left pointing at dead infrastructure once — don't repeat it.
