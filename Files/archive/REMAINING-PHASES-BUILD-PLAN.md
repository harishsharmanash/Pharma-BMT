# Remaining Phases — Master Build Plan (D2 · D3 · B · E · F)

*Execution plan for Claude (Sonnet) sessions in `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`. Written 20 July 2026, after Phase A, A.5, C and D1 shipped.*

**How to use this file:** each phase below is self-contained. Hand ONE phase at a time to a building session, e.g.
> "Read `/Users/harishsharma/Claude/Pharma BMT/Files/REMAINING-PHASES-BUILD-PLAN.md` and execute **Phase D2** only. Follow it top to bottom."

Do **not** build multiple phases in one session — D3 relocates where D2's screens live, and B touches permissions. Order matters: **D2 → D3 → B → E → F**.

---

## 0. Ground rules that apply to EVERY phase

1. **Read `CLAUDE.md`** and **invoke the `leadenthrella-deploy` skill** before writing code. Non-negotiables:
   - **SQL migrations never auto-apply.** Write the file, then tell Harish the exact SQL to paste into the Supabase SQL editor. Nothing DB-backed works until he runs it.
   - **Edge functions don't reliably redeploy on push.** If a new action returns "Unknown action" in testing, the function didn't deploy — tell Harish to re-trigger it in Lovable.
   - **Lovable Cloud blocks SQL against `storage.buckets`** (error `bucket_sql_blocked`). You may NOT create buckets in a migration. Reuse the existing **`company-assets`** bucket and separate content by folder path. You MAY write `storage.objects` RLS policies in SQL — that works.
   - New tables/columns: call them as `(supabase.from("x") as any)` and hand-write TS types as **optional** fields. Do not regenerate Supabase types.
   - The sandbox can't run `npm install` or `tsc`. Verify by careful reading; Harish tests on the live site after pushing.
2. **Coordination:** another session may be working on `use-assistant.ts`, `use-orders.ts`, `orders*.tsx`, and the AI worker. **Never edit those files.** Run `git status` first; leave anything unrelated that's dirty alone.
3. **Harish is not a developer.** Every phase ends with: (a) the exact SQL to paste, (b) any manual dashboard steps, (c) a click-by-click test script in plain language.
4. **House patterns to copy:**
   - Hooks: `src/lib/use-company.ts` (TanStack Query + `useAuth().company.id` scoping).
   - Platform hooks + the `invokePlatformFn` edge-function helper: `src/lib/use-platform.ts`.
   - Storage RLS: the `staff_files_*` policies at the end of `supabase/migrations/20260712120000_staff_salary.sql` — folder pattern `(storage.foldername(name))[1] = current_company_id()::text AND [2] = '<module>'`.
   - Existing DB helpers: `public.current_company_id()`, `public.current_role()`, `public.is_admin()`, `public.is_manager_or_admin()`, `public.is_platform_admin()`.

---

# Phase D2 — "Report a bug" from Help, with 30-day auto-cleanup

**Status: ready to build. No external accounts needed.**

## D2.1 What it delivers
- A **Report a bug** form on the Help page for any signed-in user: description, up to 5 screenshots, and one short video (≤50 MB).
- Reports land in a `bug_reports` table; files go into the existing `company-assets` bucket under `{company_id}/bug-reports/...`.
- A **Bug reports** card in the developer console showing each report with its attachments.
- A cleanup routine that deletes reports + their files older than **30 days**, so storage stays healthy.

## D2.2 Migration — `supabase/migrations/20260721120000_bug_reports.sql`

```sql
CREATE TABLE public.bug_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name text,
  description text NOT NULL,
  route text,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{path, kind:'image'|'video', size}]
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','wont_fix')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.bug_reports TO authenticated;
GRANT ALL ON public.bug_reports TO service_role;

-- Anyone signed in may file a report for their own company.
CREATE POLICY bug_reports_insert ON public.bug_reports
  FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id());

-- Users see their own company's reports; the platform admin sees everything.
CREATE POLICY bug_reports_select ON public.bug_reports
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_platform_admin());

-- Only the platform admin can change status / delete.
CREATE POLICY bug_reports_platform_update ON public.bug_reports
  FOR UPDATE TO authenticated
  USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
CREATE POLICY bug_reports_platform_delete ON public.bug_reports
  FOR DELETE TO authenticated
  USING (public.is_platform_admin());

-- ===== Storage policies (bucket already exists — do NOT create it) =====
DROP POLICY IF EXISTS "bug_files_read" ON storage.objects;
CREATE POLICY "bug_files_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[2] = 'bug-reports'
    AND ((storage.foldername(name))[1] = public.current_company_id()::text OR public.is_platform_admin())
  );

DROP POLICY IF EXISTS "bug_files_write" ON storage.objects;
CREATE POLICY "bug_files_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'bug-reports'
  );

DROP POLICY IF EXISTS "bug_files_delete" ON storage.objects;
CREATE POLICY "bug_files_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[2] = 'bug-reports'
    AND public.is_platform_admin()
  );

-- ===== 30-day cleanup =====
-- Deletes the DB rows. Storage objects are removed by the edge function in D2.4,
-- which calls this and then deletes the returned paths from the bucket.
CREATE OR REPLACE FUNCTION public.purge_old_bug_reports()
RETURNS TABLE(deleted_path text) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
  WITH doomed AS (
    DELETE FROM public.bug_reports
    WHERE created_at < now() - interval '30 days'
    RETURNING attachments
  )
  SELECT jsonb_array_elements(attachments)->>'path' FROM doomed;
END; $$;

REVOKE ALL ON FUNCTION public.purge_old_bug_reports() FROM public, authenticated;
```

Also purge old rows from the existing crash log while we're here (same 30-day rule):
```sql
CREATE OR REPLACE FUNCTION public.purge_old_error_log()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.platform_error_log WHERE created_at < now() - interval '30 days';
$$;
REVOKE ALL ON FUNCTION public.purge_old_error_log() FROM public, authenticated;
```

## D2.3 Frontend — the report form

New file `src/components/report-bug-dialog.tsx`, opened from a button on `src/routes/help.tsx` (which is currently a short static page, ~44 lines — add a card at the top titled **"Found a problem?"** with a **Report a bug** button).

Behaviour:
- Fields: **Description** (`Textarea`, required, min ~10 chars), **Screenshots** (`<input type="file" accept="image/*" multiple`, max 5), **Video** (`<input type="file" accept="video/*"`, optional, single).
- **Client-side size guard:** reject any video over 50 MB and any image over 10 MB with a toast *before* uploading — do not attempt the upload.
- Upload each file to `company-assets` at `${company.id}/bug-reports/${reportId}/${crypto.randomUUID()}.${ext}` (generate `reportId` client-side with `crypto.randomUUID()` and use it as the row `id` so paths and row match).
- Then insert the `bug_reports` row with `attachments` = the array of `{path, kind, size}`, `route: window.location.pathname`, `reporter_name: profile.full_name`, `user_id: session.user.id`, `company_id: company.id`.
- Show upload progress state ("Uploading 2 of 3…"), disable submit while busy, toast success, close and reset.
- On any failure mid-upload, best-effort delete already-uploaded files, and surface the real error message.

New hook file `src/lib/use-bug-reports.ts`:
- `useSubmitBugReport()` — mutation doing the upload + insert above.
- `useBugReports(companyId?)` — platform-side query; when `companyId` given, filter to it; order `created_at desc`, limit 50.
- `useUpdateBugReportStatus()` — platform-only status change.
- `useBugReportFileUrl(path)` — `createSignedUrl(path, 3600)`, mirroring `useCompanyLogoUrl` in `use-company.ts`.

## D2.4 Cleanup edge function — `supabase/functions/platform-purge-old-data/index.ts`

Same shape as `platform-manage-user` (copy its auth/CORS scaffolding), but it must accept **either**:
- a platform-admin JWT (so Harish can press a "Run cleanup now" button), **or**
- a `x-cron-secret` header matching `Deno.env.get("CRON_SECRET")` (so it can be scheduled later).

Logic: call `purge_old_bug_reports()` via `admin.rpc(...)`, collect the returned paths, `admin.storage.from("company-assets").remove(paths)` in batches of 100, then call `purge_old_error_log()`. Return `{ ok: true, deleted_reports: n, deleted_files: n }`.

## D2.5 Developer console UI
Add a **Bug reports** card to `src/routes/platform.$companyId.tsx` (place it directly above the existing `ErrorLogCard`), listing that company's reports: reporter, date, description, status dropdown, and attachment thumbnails/links via signed URLs. Also add a **"Run cleanup now"** button (calls the D2.4 function) on the companies list page `src/routes/platform.index.tsx`, in the header next to "New Company".

## D2.6 Handover for Harish
- Run the migration SQL.
- **Optional but recommended:** to automate cleanup instead of pressing the button, enable the `pg_cron` extension in the Supabase dashboard (Database → Extensions) and schedule the function daily. If `pg_cron` isn't available on the plan, the manual "Run cleanup now" button covers it — say so plainly rather than assuming.
- Test: Help → Report a bug → attach a screenshot + short video → submit → confirm it appears in `/platform` → that company → Bug reports, with the attachment opening correctly.

---

# Phase D3 — Separate developer console + authenticator-app 2FA

**Status: ready to build. Highest risk — it touches login. Build it in one focused session while Harish is available to test immediately.**

Decisions already locked by Harish: **authenticator app (TOTP), not SMS.** Dedicated developer identity, separate from the demo account.

## D3.1 Guiding rules for this phase
- **Reversible rollout.** The new console must go live *alongside* the existing `/auth` + `/platform` access. Do NOT delete or redirect `/platform` in this phase — Harish retires it only after confirming the new console works. Say this explicitly in the handover.
- **Never lock the developer out.** The database-level MFA enforcement (D3.5) is a SEPARATE, SECOND migration that Harish runs only after he has successfully enrolled and logged in with 2FA. Do not combine it with the first migration.

## D3.2 The dedicated developer identity
- Harish will create a new auth user (suggested `console@enthrella.com`) via the Supabase dashboard, then add it to `platform_admins`.
- Crucially this user has **NO row in `profiles`** — it belongs to no company. That's what makes it a pure developer identity.
- Provide him the SQL in the handover:
  ```sql
  -- after creating the user in the dashboard:
  INSERT INTO public.platform_admins (user_id)
  SELECT id FROM auth.users WHERE email = 'console@enthrella.com';
  ```

## D3.3 Routing — send developers to the console, never the company app
Currently `Protected` in `src/components/app-shell.tsx` shows "Account not linked" when a signed-in user has no `profile`. Change that branch:
- If **no profile** AND **is platform admin** → redirect to `/console`.
- If no profile and not a platform admin → keep the existing "Account not linked" screen.

Also in `src/routes/auth.tsx`: after a successful sign-in, if the user is a platform admin with no profile, navigate to `/console` instead of `/dashboard`.

## D3.4 The console itself
New routes, mirroring the layout/index/detail pattern that already works elsewhere:
- `src/routes/console.tsx` — layout route. Renders its own **`ConsoleShell`** (new component, `src/components/console-shell.tsx`): a distinct dark-styled shell titled **"Enthrella Operations"**, its own sidebar (Dashboard · Companies · Users · Bug reports · Errors), sign-out, NO company branding, NO `AssistantChat`. Guard: platform admin only, else the 404 component; not signed in → show the console login (D3.6).
- `src/routes/console.index.tsx` — **platform dashboard**: total companies, total users, active vs suspended counts, open bug reports, errors in the last 7 days. Simple stat cards; derive from existing hooks plus small count queries.
- `src/routes/console.companies.tsx` + `console.companies.$companyId.tsx` — **move** the current `platform.index.tsx` / `platform.$companyId.tsx` content here. Reuse the same components and hooks from `use-platform.ts` — this is a relocation, not a rewrite.
- `src/routes/console.users.tsx` — global user search across all companies (name/email), each row linking to its company; reuse the `UserRow` actions from D1.
- `src/routes/console.bugs.tsx` — all bug reports across all companies, filterable by status.
- **Leave `platform.*` routes in place and working** for this phase.

## D3.5 Authenticator 2FA (TOTP)
Supabase Auth has native TOTP MFA — use it, do not build your own.

**Enrollment** (new `src/routes/console.security.tsx`, plus a prompt on first console login if no verified factor exists):
- `supabase.auth.mfa.enroll({ factorType: 'totp' })` → returns a QR code SVG + secret. Render the QR, show the secret as fallback text.
- User scans with Google Authenticator/Authy, enters the 6-digit code → `supabase.auth.mfa.challenge({ factorId })` then `supabase.auth.mfa.verify({ factorId, challengeId, code })`.
- On success, tell them plainly: "Save your recovery access — if you lose this phone, you'll need to clear the factor from the Supabase dashboard."

**Login challenge:**
- After password sign-in, call `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`.
- If `currentLevel === 'aal1'` and `nextLevel === 'aal2'` → show a 6-digit code screen and run challenge/verify before entering the console.
- If the user has no factor at all → force enrollment before granting console access.

**Second migration (run LATER, only after 2FA is confirmed working)** — `supabase/migrations/20260722130000_require_mfa_for_platform_admin.sql`:
```sql
-- Hard server-side enforcement: platform-admin powers require a 2FA-verified session.
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
     AND COALESCE(auth.jwt()->>'aal', '') = 'aal2';
$$;
```
Flag loudly in the handover: **running this before enrolling 2FA will cut off console access** (recoverable by reverting the function, but avoid the scare).

## D3.6 Console login screen
A visually distinct login inside the console layout — different from `/auth`: dark, "Enthrella Operations", no "ask your admin" helper text, no link to `/developer`. Email + password → then the 2FA code step. On success, land on `/console`.

> Note for the builder: the console login uses the **same** Supabase auth backend as the company login — the separation here is identity (no company profile), interface, and the enforced MFA gate. Do not attempt to build a second auth system.

## D3.7 Handover for Harish
- Create the `console@enthrella.com` user in the dashboard, run the `platform_admins` insert.
- Log in at `/console`, enrol the authenticator app, confirm the code works, confirm `/console` loads with all sections.
- **Only then** run the second migration to enforce 2FA at the database level.
- Once satisfied, tell Claude to retire `/platform` in a small follow-up.

---

# Phase B — Custom roles & permissions (RBAC), the safe way

**Status: ready to build, with a deliberately conservative design. Read B.1 before anything else.**

## B.1 Why this design (do not "improve" it into something riskier)
The three base roles `rep` / `manager` / `admin` are wired into Row Level Security across **17 migration files** — every table (leads, orders, parties, stock, staff…) checks them. Rewriting that on a live database holding real customer data, with no staging copy and manual SQL execution, risks either locking a company out of its own data or leaking data across companies.

**So: this phase does NOT touch RLS at all.** Custom roles are an additive layer that can only **restrict** what a base role already allows — never expand it. A "Junior Rep" custom role sits on top of base role `rep`; the database still enforces rep-level access, and the custom permissions further hide things in the UI.

**Honest tradeoff to state in the handover:** UI-level permissions are not a hard security boundary — a determined technical user could work around them. But because every custom role is bounded by its base role's RLS, the worst case is never worse than that base role. That is the correct trade for this stage, and it can be hardened later once there's a staging environment.

## B.2 Migration — `supabase/migrations/20260723120000_custom_roles.sql`
```sql
CREATE TABLE public.custom_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  base_role text NOT NULL CHECK (base_role IN ('rep','manager','admin')),
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, name)
);
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_roles TO authenticated;
GRANT ALL ON public.custom_roles TO service_role;

CREATE POLICY custom_roles_select ON public.custom_roles
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() OR public.is_platform_admin());

CREATE POLICY custom_roles_admin_write ON public.custom_roles
  FOR ALL TO authenticated
  USING (public.is_admin() AND company_id = public.current_company_id())
  WITH CHECK (public.is_admin() AND company_id = public.current_company_id());

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS custom_role_id uuid REFERENCES public.custom_roles(id) ON DELETE SET NULL;
```
**Critical:** `profiles.role` stays exactly as it is and remains the security backbone. `custom_role_id` is purely additive.

## B.3 Permission catalogue — `src/lib/permissions.ts`
```ts
export const PERMISSIONS = [
  "leads.view","leads.edit","leads.delete","leads.export",
  "parties.view","parties.edit","parties.delete",
  "orders.view","orders.edit","orders.delete","orders.payments",
  "products.view","products.edit","products.rates",
  "stock.view","stock.edit",
  "staff.view","staff.edit","staff.payroll",
  "transporters.view","transporters.edit",
  "reports.view","reports.export",
  "ai.use",
] as const;
export type Permission = (typeof PERMISSIONS)[number];
```
Plus `PERMISSION_LABELS` (human text) and `PERMISSION_GROUPS` (for grouping the UI by module).

**Defaults per base role** — used when a user has no custom role, so behaviour is unchanged for everyone today:
- `admin` → all permissions.
- `manager` → everything except `staff.payroll`.
- `rep` → `*.view` for leads/parties/orders/products, `leads.edit`, `orders.edit`, `ai.use`.

## B.4 Hook — `src/lib/use-permissions.ts`
- `useMyPermissions(): Set<Permission>` — if the profile has a `custom_role_id`, load that role and **intersect** its permissions with the base-role defaults (the intersection is what enforces "can only restrict"). Otherwise return the base-role defaults.
- `useCan(p: Permission): boolean`.
- **Fail-open while loading** (return base-role defaults), same reasoning as `use-features.ts` — never flash a locked-out UI at a legitimate user.

## B.5 UI
- **Settings → new "Roles" tab** (admin only, alongside the existing Features tab in `src/routes/settings.tsx`): list custom roles, create/edit/delete, each with a name, a base-role select, and a grouped permission checkbox grid. Show a clear note: *"A role can only narrow what its base role allows."*
- **Manage Users** (`src/routes/users.tsx`): add an optional "Custom role" select to the user create/edit forms, writing `custom_role_id`.
- **Apply the checks** to the most valuable, lowest-risk spots first: hide Delete/Export buttons, and hide nav items, using `useCan(...)`. Do NOT attempt to thread permissions through every mutation in this phase — a follow-up can deepen it.

---

# Phase E — Custom domains / white-label

**Status: UNBLOCKED — decision made 20 July 2026. Read `PHASE-E-CUSTOM-DOMAINS-SOLUTION.md` FIRST; it supersedes E.1/E.2 below.** Answer to E.1: Lovable can technically hold several domains on one project, but only manually per-domain, with no API and only on a paid plan — so it cannot power a self-serve white-label system. Decision: move frontend hosting to **Cloudflare Pages (free)** + **Cloudflare for SaaS custom hostnames** (100 client domains free, $0.10/domain/month after, automatic SSL, API-driven, client adds one CNAME). Supabase backend untouched. The solution doc contains the one-time setup, full build spec (migration, edge function, console "Add custom domain" card, domain-based branding), costs, and rollout order. Keep E.1/E.2 below as historical context only.

## E.1 The blocker Harish must check first
Serving many client domains (`app.acrowelllabs.com`, etc.) from one project requires the host to support **multiple custom domains / wildcard hostnames** on a single deployment. **Lovable typically supports only one custom domain per project.** Before any code is written, confirm with Lovable support (or their docs) whether one project can serve several custom domains.

- **If yes** → build E.2 as written.
- **If no** → white-labelling requires moving the frontend hosting to something that supports it (Cloudflare Pages / Vercel / Netlify, all of which do, and all of which can keep using the same Supabase backend unchanged). That's a hosting migration and deserves its own plan — flag it to Harish rather than improvising.

Do not tell Harish this is "just a toggle" — it may be a hosting change.

## E.2 App-side work (once unblocked)
- Migration: `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS custom_domain text UNIQUE;`
- Add the field to the console's company detail page, with the DNS instructions to hand the client (CNAME target depends on the host chosen in E.1).
- **Domain resolution:** on app load, read `window.location.hostname`. If it matches a `custom_domain`, load that company's branding (logo, name, colours) on the **login screen** and hide all Enthrella naming.
- **Login restriction:** on a custom domain, only permit sign-in by users belonging to that company; others get "This account isn't part of this organisation."
- **Important clarification for the handover:** the domain drives *branding and login scoping*. Actual data scoping still comes from the signed-in user's profile — that's already secure and doesn't change. Don't let anyone believe the domain itself is the security boundary.

---

# Phase F — Usage analytics + billing

**Status: split. F.1 is ready now; F.2 is blocked on a Razorpay account.**

## F.1 Platform usage analytics (ready to build)
There is already a per-company AI usage summary (`useAssistantUsageSummary`, shown in Settings → Assistant, backed by the `assistant_usage` table from migration `20260715180000_assistant_usage.sql`). This phase surfaces it platform-wide **without editing `use-assistant.ts`** — write a new, separate hook in `src/lib/use-platform.ts`.

Add to the console dashboard (`console.index.tsx`, from D3 — or `platform.index.tsx` if D3 isn't built yet):
- AI actions and estimated cost **per company**, this month, sorted by spend, so heavy users are obvious.
- Platform totals: companies, users, orders, AI spend.
- Most-used features (derive from `company_features` enabled counts).
- **Do not** log or display raw AI message content in this phase. If Harish later wants prompt-level analysis for improving the assistant, that's a separate decision with privacy implications (his own doc `PLATFORM_BACKEND_AND_MULTITENANCY_PLAN.md` §2.5 covers the reasoning) and needs a line in the customer terms first.

## F.2 Billing (blocked)
Needs Harish to create a **Razorpay** account and provide API keys before anything is built. When ready, the shape is:
- `subscriptions` table (company_id, plan, amount, interval, current_period_end, status).
- A Razorpay webhook receiver as an edge function, updating `subscriptions` on payment success/failure.
- Auto-set `companies.status = 'suspended'` when a payment is overdue past a grace period — this reuses the suspension screen already built in Phase A, so no new lockout logic is needed.
- Invoice history in the console.

Until the account exists, the practical stand-in is what already works today: set a company's status manually in the console.

---

## Summary — what to hand over, and when

| Phase | What it gives | Status | Build when |
|---|---|---|---|
| **D2** | Bug reports from Help + 30-day cleanup | ✅ Ready | Now |
| **D3** | Separate developer console + 2FA | ✅ Ready | Focused session, Harish available to test login |
| **B** | Custom roles & permissions (safe, UI-layer) | ✅ Ready | After D3 |
| **E** | Custom domains / white-label | ⛔ Blocked | After confirming Lovable multi-domain support |
| **F.1** | Platform usage analytics | ✅ Ready | Any time after D3 |
| **F.2** | Razorpay billing | ⛔ Blocked | After Razorpay account exists |
