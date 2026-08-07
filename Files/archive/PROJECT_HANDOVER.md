# Pharma BMS — Project Handover (historical)

> **⚠️ NO LONGER CANONICAL — the infrastructure sections below are wrong.**
>
> Written while the project ran on **Lovable Cloud**, decommissioned **21 July 2026**. The app now runs on Enthrella's own Supabase (`pharma-bms-prod`, ref `cjowrlrjyhdltbyqwozr`) and Cloudflare Workers (`leadenthrella.icy-sunset-05b0.workers.dev`).
>
> **Ignore anything below about:** the `preview--leadenthrella.lovable.app` URL; Supabase project `crzddmxogxhirzqkrgwb`; "Lovable rebuilds on push"; "Lovable runs npm install" (it's **bun** now, and `bun.lock` must be regenerated whenever dependencies change); "edge functions don't reliably redeploy" (they deploy cleanly via the Supabase CLI now); "the sandbox can't run npm/tsc" (it can — and you should actually run them).
>
> **Current sources of truth:** `leadenthrella/CLAUDE.md` and `leadenthrella/.claude/skills/leadenthrella-deploy/SKILL.md`.
>
> Identity correction too: the business is **Enthrella**, the app is **Pharma BMS**. "Acrowell" is one *client company* inside the platform, not the product — this document's original title was itself an instance of that stale naming.
>
> Kept for the **product and feature history** below, which is still accurate and useful.

Last updated after the session that built the universal file-import/OCR, monopoly system, trash bin, grid views, and more.

---

## 1. What this is

**Acrowell CRM** (page titles sometimes say "Lead CRM") — a multi-company CRM for a **PCD pharma franchise** business. Manages leads, parties (customers), orders/invoices, products, transporters, team, dues, and now stock/staff modules are being planned.

- **Active project folder (connected):** `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`
- **GitHub repo:** `https://github.com/harishsharmanash/leadenthrella.git` (branch `main`)
- **Live preview:** `https://preview--leadenthrella.lovable.app`
- **Backend:** Supabase project ref `crzddmxogxhirzqkrgwb` → `https://crzddmxogxhirzqkrgwb.supabase.co`, hosted via **Lovable Cloud**.
- **Stack:** React 19 + TypeScript, TanStack Start/Router (file-based routes in `src/routes/`), TanStack Query, Supabase (Postgres + RLS + Storage + Edge Functions), Tailwind v4 + shadcn/ui, jsPDF + jspdf-autotable (PDFs), xlsx/papaparse (spreadsheets), and for the file-import engine: pdfjs-dist, tesseract.js, mammoth, html2canvas-pro.

## 2. Folder map (Pharma BMT/)

- `leadenthrella/` — **the live app.** All code work happens here.
- `leadenthrella-main/` — **STALE duplicate** (dated ~July 10, no git, old migrations, uses bun). Not used. Safe to delete after a glance.
- `Files/` — **reference docs, kept outside the code repo** (this handover, the stock & staff idea files). Put future notes/memory here, not in the repo.

## 3. Deployment workflow — READ FIRST

1. **Editing files does NOT deploy.** Changes must be **committed + pushed via GitHub Desktop** (user does this manually). Lovable then rebuilds/redeploys.
2. **SQL migrations never auto-apply.** Each file in `supabase/migrations/` must be opened and run **manually** by the user in the Supabase/Lovable SQL editor. A migration existing in the repo says nothing about whether it's been run — assume "not run" unless confirmed.
3. **New npm dependencies:** adding to `package.json` is enough — Lovable runs `npm install` on build. But the change must be **pushed** first.
4. **GitHub Desktop lock-file error** ("A lock file already exists…") = stale `.git/index.lock`. Fix on the user's Mac: quit GitHub Desktop, Terminal → `rm "/Users/harishsharma/Claude/Pharma BMT/leadenthrella/.git/index.lock"`, reopen, retry.

## 4. Hard-won gotchas (do not relearn these)

- **Edge functions do NOT reliably redeploy on push.** A long-running bug (Manage Users edit not saving name/phone) was caused by a **stale deployed edge function** — the repo code was correct but the live function was an old build that only wrote `role`/`is_active`, not `full_name`/`phone`. **Fix pattern: avoid depending on edge functions for new features.** The Manage Users fix moved the profile update to a **direct RLS update from the frontend** (admins can update `profiles` in their own company via RLS). Prefer direct Supabase calls over new/edited edge functions.
- **The Supabase client is strictly typed** (`createClient<Database>`) against generated `src/integrations/supabase/types.ts`. When you add DB columns/tables via migration, `types.ts` is NOT regenerated until Lovable does it. So:
  - Add new columns to the **hand-written** types (in the `src/lib/use-*.ts` files) as **optional** (`foo?: string | null`) so reads/writes compile.
  - For **new tables** or unknown columns in `.from()/.rpc()`, cast: `(supabase.from("x") as any)` / `(supabase.rpc as any)("fn")`. This is used for `party_status_history`, soft-delete writes, and lead-followup RPC.
- **Sandbox limits:** the agent's sandbox generally **cannot run `npm install` or `tsc`** (times out / no node_modules). Verification is by careful manual reading + grep, plus live testing against the preview via the Claude-in-Chrome tools.
- **Live-testing technique that works:** read `.env` for `VITE_SUPABASE_PUBLISHABLE_KEY`/`URL`, then in a signed-in browser tab run `fetch()` with the session JWT from `localStorage['sb-crzddmxogxhirzqkrgwb-auth-token']`. Bypasses the app UI and shows the real server response. (`read_network_requests` is unreliable for `*.supabase.co`.)
- **Tailwind v4 uses oklch colors** → the original `html2canvas` can't parse them; we use **`html2canvas-pro`**.

## 5. Migrations & their status

Base schema + everything through `20260711160000` = older, assume applied (verified working live).

Migrations added in recent sessions (confirm before assuming run):
- `20260711140000_security_hardening.sql` — STATUS UNKNOWN historically; closes cross-tenant holes. Verify it ran.
- `20260711170000_features_phase2.sql` — **CONFIRMED RUN.** Adds: `leads.lost_reason`; parties monopoly fields (`dealing_area`, `monopoly_given`, `monopoly_division`, `monopoly_district`, `monopoly_state`); `orders.delivery_proof_url`; `products.parent_product_id`; `party_status_history` table + auto-log trigger.
- `20260711180000_lead_followup_notifications.sql` — needs running (adds `notifications.lead_id` + `generate_lead_followup_notifications()` RPC for in-app follow-up reminders).
- `20260711190000_soft_delete_trash.sql` — needs running (adds `deleted_at` to leads/parties/orders/products for the Trash bin). **The frontend already soft-deletes via `deleted_at`, so run this or deletes will error.**

> If unsure whether the last two ran: test in the app — deleting a product should move it to Trash (not error), and follow-up reminders should appear in the bell.

## 6. What's been built (by area)

**Leads:** full CRUD, stages/temp/source, 5-slot follow-ups, Hot & Warm view, Follow-Up Schedule (snooze), duplicate detection, Excel/CSV export, lead→party conversion, per-lead product interests, Bill Summary PDF, **Quick enquiry** (2-tap capture), **lost/not-interested reason** (shown when stage=Lost), **in-app follow-up reminders** (via notification bell), **list/grid view toggle**.

**Parties:** full CRUD, tags (now **colour-categorised** client-side), star/pin, diary notes, birthday/anniversary reminders, tap-to-call/WhatsApp, contacts, document uploads w/ expiry, credit limit, cheque/bank details + image, dues-aging filter, **has-dues/clear filter**, **sort-by-highest-dues** (opt-in), **owner-rep column**, bulk Excel import, party ledger tab, **ledger/statement PDF**, **advance-payment recording** (payment with no order), rep reassignment (managers/admins only), party rate overrides, **Open in Maps**, **Copy details**, **prominent lifetime-business figure**, **Repeat last order**, **status-history tab** (auto-logged), **monopoly/territory fields + overlap warning**, **list/grid view toggle**.

**Monopoly/territory:** per-party dealing area + "Monopoly Given" flag tied to division/state/district; live **overlap warning** in the party form; **Booked Areas** admin/manager route (states → district-booked counts → holding party & rep).

**Orders:** create/edit/duplicate/draft, line items w/ batch/expiry/disc/GST, live totals (DB-trigger computed), cancel, payments (full/partial, modes, cheque bounce), logistics (transporter, freight, dispatch/expected/delivered, mark-dispatched/delivered, delay+3), invoice PDF, **invoice as JPG** (html2canvas-pro on the on-screen invoice), **choose invoice columns** (localStorage), copy-as-text, Excel/CSV + **universal bill upload** import, **item-count column**, **free-goods ₹ value**, **delivery-proof photo upload**, filters, **Repeat last order** via `?dup=&party=` search params.

**Products:** full CRUD, image upload, division/category, **universal file upload import** (see §7), **Undo import**, **pack-size variants** (parent link), duplicate, **selection mode** ("Select Products" button; checkboxes only in select mode), **bulk % rate change** (only when selected) with **undo/redo**, best-sellers sort, search (name/composition/HSN), catalogue PDF, clean Rate List PDF, **image-gallery PDF** (now includes composition), **exports respect selection** (export rates for just the selected products), **list/grid view toggle**.

**Transporters:** CRUD, rate cards, freight-to-pay, extend delivery, **tap-to-call**, **shipments-this-month count**, **bulk "Settle all" freight payment**, **list/grid view toggle**.

**Team:** Manage Users (create/edit/deactivate — the edit bug is FIXED via direct RLS update), **Team phone book** route, Leaderboard (per-rep leads/won/conv%/overdue **+ orders & money collected this month**), **My Day** rep home (day-plan of who to call, start-of-day check-in, month tallies), rep-only visibility via RLS.

**Dashboard:** today's orders/billing, **today's collection**, money-to-collect, lead KPIs, pipeline/temp/alert/funnel/state/source/FU-outcome charts, **payment-mode breakdown**, **this-month-vs-last-month sales**, **top-5 customers & products**.

**App-wide:** **global search** (parties/leads/orders/products) + **recently-viewed** in the header, **30-day Trash bin** (soft-delete for leads/parties/orders/products with restore/purge, in sidebar), notifications (order dues, delivery-date, lead follow-ups).

## 7. Universal file-import / OCR engine (key architecture)

Reusable, all free/open libraries, all heavy parsers lazy-loaded (SSR-safe):
- **`src/lib/file-extract.ts`** — `extractRecordsFromFile(file, onProgress)` accepts Excel/CSV (SheetJS), Word .docx (mammoth), HTML (DOM tables/text), digital PDF (pdf.js text layer), scanned PDF + images (tesseract.js OCR). Returns `{ rows, rawText, kind, confidence, note }`. Exports `ACCEPTED_FILE_TYPES`.
- **`src/lib/import-products.ts`** — `parseProductsFromExtract(res)` → product drafts. Header-mapping for tables; **pharma-aware regex** for OCR lines that keeps **strengths (mg/mcg) in Composition** and puts **real packaging (10x10, ALU-ALU, blister, bottle/ml for liquids + dosage form) in Pack** (this was a specific bug the user hit and it's fixed). Brand is separated from salt via single-salt-word-before-strength heuristic.
- **`src/lib/import-orders.ts`** — `parseOrderFromExtract(res)` → one `ImportedInvoice` with line items. Structured tables reuse `guessMapping`+`rowsToInvoices`; OCR/text uses a per-line item parser (product/qty/rate/amount). The order importer converts these to named-column rows so the **existing map→preview→create pipeline** handles them.
- **UI:** "+ New Product" and "+ New Order" are **dropdowns** ("Upload file"/"Add manually"). Product upload shows an **editable review sheet** before import.

**Known weakness (be honest with the user):** structured sources (Excel/CSV/Word tables/digital PDFs) parse well. **Photos/scans of bills are best-effort** — OCR of dense pharma invoice tables is genuinely hard with free tools; the review/preview step is the safety net. If the user wants higher accuracy on scanned bills, options are a document-AI API (Textract/Azure/Google — paid, free tiers) or a vision LLM via edge function (costs per call; note the edge-function redeploy caveat).

## 8. Standing product instructions (do NOT regress)

- Dashboard "Leads by Source" chart must be a **bar chart, never pie**.
- **Default sort is alphabetical** everywhere; anything else (highest dues, best-sellers) is an explicit opt-in.
- **Reassigning a party's rep** stays restricted to **managers/admins** — reps never see that control.
- Reps only ever see their own data (enforced via RLS).
- App is a **business tool only**; PDFs carry a "Business tool only" footer.

## 9. Key file locations

- Routes: `src/routes/` (dashboard, my-day, leads.index/$id, hot-warm, followups, products, parties.index/$id, orders.index/$id, transporters.index/$id, booked-areas, team, trash, leaderboard, users, settings, duplicates, help).
- Data hooks: `src/lib/use-leads.ts`, `use-parties.ts`, `use-orders.ts`, `use-products.ts`, `use-transporters.ts`, `use-party-rates.ts`, `use-notifications.ts`, `use-company.ts`, `crm.ts` (types + helpers).
- Import engine: `src/lib/file-extract.ts`, `import-products.ts`, `import-orders.ts`, `order-share.ts` (share/PDF helpers).
- Shared UI: `src/components/app-shell.tsx` (nav), `global-search.tsx`, `view-toggle.tsx`, `lead-dialog.tsx`, `notification-bell.tsx`, `ui/*` (shadcn).
- Edge functions: `supabase/functions/*` (admin-create-user, admin-update-user, backup-*). **Remember these don't reliably redeploy.**

## 10. What's next / open threads

- **Stock/Inventory module** — 30 ideas in `Files/Inventory_Stock_Management_30_Ideas.md`. Suggested start: batch-wise stock ledger + goods-inward/outward, then expiry dashboard + FEFO, then reorder alerts.
- **Staff/Salary module** — 30 ideas in `Files/Staff_Salary_Management_30_Ideas.md`. Suggested start: employee records → attendance/leave → payroll + payslip → sales incentives (driven off live order/collection data).
- **Grid views** — done on all 5 lists (Products, Parties, Leads, Hot & Warm, Transporters) via the shared `ViewToggle`.
- **Possible future polish:** higher-accuracy bill OCR (paid API/vision LLM), and re-verifying `security_hardening` migration ran.

## 11. First steps in the new chat

1. Confirm which migrations have been run (`20260711180000`, `20260711190000`, `20260711140000`).
2. Confirm the latest code is pushed (GitHub Desktop clean).
3. Then continue — likely the **stock/inventory module** next.
