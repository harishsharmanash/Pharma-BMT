# Phase A Build Spec — Feature Entitlements, Two-Gate Toggles & Minimal Platform Console

*Execution spec for a Claude (Sonnet) session working in `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`. Follow it top to bottom. Written 19 July 2026.*

---

## 0. Ground rules — read before writing any code

1. **Read `CLAUDE.md` in the repo root** and **invoke the `leadenthrella-deploy` skill** first. Non-negotiable rules from it:
   - SQL migrations NEVER auto-apply. Write the migration file, then **tell Harish to run it by hand** in the Lovable/Supabase SQL editor before testing anything DB-backed.
   - Do NOT create or edit Supabase **edge functions**. Everything goes through direct Supabase client calls + RLS.
   - The Supabase client is strictly typed against generated types. For **brand-new tables**, call them as `(supabase.from("company_features") as any)`. Add hand-written TS types in the hook file. New fields on existing types must be **optional**.
   - The sandbox can't run `npm install` or `tsc`. Verify by careful reading; live testing happens on the preview after Harish pushes via GitHub Desktop.
2. **Coordination:** another Claude session may be working on `src/lib/use-assistant.ts`, the AI worker, and `src/lib/use-orders.ts` / `src/routes/orders*.tsx`. **Do not edit those files.** If a step seems to need them, add a `NOTE FOR LATER` in your summary instead.
3. **Harish is not a developer.** At the end, produce: (a) the exact SQL to paste, (b) a plain-language list of what to click to test each feature on the preview site.

### Existing facts you must build on (verified against the code)

- Roles are plain text on `profiles.role`: `'rep' | 'manager' | 'admin'` (check constraint in DB, type in `src/lib/crm.ts`).
- DB helper functions already exist: `public.current_role()`, `public.is_admin()` (admin + is_active), and a manager-or-admin helper — reuse them in RLS.
- `src/lib/auth-context.tsx` exposes `useAuth()` → `{ session, profile, company, loading }`. `profile.company_id` scopes everything.
- Sidebar nav is `src/components/app-shell.tsx`: a `NAV: NavItem[]` array where `NavItem = { to, label, icon, roles? }`, filtered by `profile.role`. You will extend this pattern.
- `src/routes/settings.tsx` (~600 lines) is the company-admin settings page. `src/lib/use-company.ts` shows the house style for hooks (TanStack Query + `useAuth().company.id` scoping) — copy that style exactly.
- `src/routes/developer.tsx` is a **public contact card** — do NOT repurpose it. The platform console gets new routes.

---

## 1. What Phase A delivers (scope)

1. **Entitlements table** — per company, per feature: `allowed` (developer's outer gate) and `enabled` (company admin's inner gate).
2. **Platform admin identity** — a way to mark Harish's user as the platform owner, enforced in the DB, not just the UI.
3. **Two-gate enforcement in the app** — nav items and routes hide/gate when a feature is off; settings gets a "Features" toggle section for company admins (toggles greyed out when not `allowed`).
4. **Minimal platform console** at `/platform` — visible only to the platform admin: list companies, open one, flip its `allowed` switches, edit plan/status.

**Explicitly OUT of scope for Phase A** (do not build): custom roles/RBAC grids, custom domains, billing, logs/analytics dashboards, impersonation, creating companies with their first user (note it as a stub — see §5.4).

### The feature key list (single source of truth)

Define once in a new file `src/lib/features.ts`:

| key | Label | Gates these routes |
|---|---|---|
| `leads` | Leads | `/leads`, `/leads/$id`, `/hot-warm`, `/followups`, `/my-day`, `/duplicates`, `/booked-areas`, `/leaderboard` |
| `parties` | Parties | `/parties`, `/parties/$id` |
| `orders` | Orders & Invoices | `/orders`, `/orders/$id` |
| `products` | Products | `/products`, `/product-performance` |
| `stock` | Stock / Inventory | `/stock` |
| `staff` | Staff & Salary | `/team` |
| `transporters` | Transporters | `/transporters`, `/transporters/$id` |
| `ai_assistant` | AI Co-worker | the assistant UI (component-level gate) |
| `backups` | Backups | backup section in settings |

Never gated: dashboard, auth, users, settings, trash, help, developer, notifications.

```ts
// src/lib/features.ts
export const FEATURE_KEYS = ["leads","parties","orders","products","stock","staff","transporters","ai_assistant","backups"] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];
export const FEATURE_LABELS: Record<FeatureKey, string> = { /* labels from table above */ };
```

---

## 2. Database migration

Create `supabase/migrations/20260719120000_feature_entitlements.sql`. Contents, in order:

### 2.1 Platform admins

```sql
CREATE TABLE public.platform_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.platform_admins TO service_role;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid());
$$;

-- Only platform admins can even see the table; nobody can write via the API (seed by SQL).
CREATE POLICY platform_admins_select ON public.platform_admins
  FOR SELECT TO authenticated USING (public.is_platform_admin());
```

Seed row (Harish runs this with his own user id — include a helper query in your handover so he can find it):
```sql
-- Find your id:  SELECT id, email FROM auth.users WHERE email = 'harishsharmajvsj3@gmail.com';
INSERT INTO public.platform_admins (user_id) VALUES ('<HARISH_USER_ID>');
```

### 2.2 Company metadata (plan/status)

```sql
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','trial','suspended','archived')),
  ADD COLUMN IF NOT EXISTS trial_ends_at date,
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS notes text;
```
(Remember: these become **optional** fields on the `Company` TS type in `src/lib/crm.ts`.)

### 2.3 Entitlements

```sql
CREATE TABLE public.company_features (
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  allowed boolean NOT NULL DEFAULT true,   -- developer's gate
  enabled boolean NOT NULL DEFAULT true,   -- company admin's gate
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (company_id, feature_key)
);
ALTER TABLE public.company_features ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.company_features TO service_role;
```

**Missing-row rule (critical for backwards compatibility):** if a company has NO row for a feature, the app treats it as `allowed = true, enabled = true`. Existing companies keep working with zero seeding.

### 2.4 RLS policies for `company_features`

- **SELECT:** any authenticated member of the company (`company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())`) OR `public.is_platform_admin()`.
- **INSERT/UPDATE/DELETE for platform admin:** full access via `is_platform_admin()`.
- **Company admins do NOT get direct write policies.** Their only write path is the RPC below, so column-level rules stay simple.

```sql
CREATE OR REPLACE FUNCTION public.set_company_feature_enabled(p_feature text, p_enabled boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_company uuid;
BEGIN
  SELECT company_id INTO v_company FROM public.profiles WHERE id = auth.uid();
  IF v_company IS NULL OR NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  INSERT INTO public.company_features (company_id, feature_key, enabled)
  VALUES (v_company, p_feature, p_enabled)
  ON CONFLICT (company_id, feature_key) DO UPDATE
    SET enabled = EXCLUDED.enabled, updated_at = now()
    WHERE company_features.allowed = true;  -- silently no-op if not allowed
END; $$;
```
The company-admin UI calls `supabase.rpc("set_company_feature_enabled", …)` (cast `as any`). The platform console writes rows directly (platform-admin RLS allows it).

### 2.5 Platform admin read access to companies

The console must list ALL companies. Existing RLS on `companies` (and `profiles`) is company-scoped, so ADD (don't replace) policies:

```sql
CREATE POLICY companies_platform_all ON public.companies
  FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
CREATE POLICY profiles_platform_select ON public.profiles
  FOR SELECT TO authenticated USING (public.is_platform_admin());
```
Check the existing policy names in earlier migrations first to avoid name clashes. Do NOT touch any other table's RLS in this phase.

---

## 3. Frontend — the features hook

New file `src/lib/use-features.ts`, in the exact style of `use-company.ts`:

```
export type CompanyFeature = { company_id: string; feature_key: string; allowed: boolean; enabled: boolean };

useFeatures():
  - query key ["company_features", company?.id], enabled when company exists
  - select * from company_features (RLS scopes to own company)
  - returns a record keyed by feature_key

useFeatureOn(key: FeatureKey): boolean
  - derives from useFeatures(): missing row → true; else allowed && enabled
  - while loading → return true (fail-open) so existing users never see a flash of missing nav

useIsPlatformAdmin():
  - query key ["platform_admin", session?.user.id]
  - select from platform_admins for own user id (as any); row present → true

useSetFeatureEnabled(): mutation calling rpc set_company_feature_enabled, invalidates ["company_features"]
```

**Fail-open decision (deliberate):** any error/missing data shows the feature. Entitlements are a packaging tool, not a security boundary — data security stays with RLS. Never let a bug in this layer lock a paying company out of their data.

---

## 4. Frontend — enforcement

### 4.1 Nav (`src/components/app-shell.tsx`)
Add optional `feature?: FeatureKey` to `NavItem`. Tag each nav entry per the §1 table. Extend the existing `visible` filter: role check (unchanged) AND (`!n.feature || featureOn(n.feature)`).

### 4.2 Route guards
Nav hiding isn't enough (deep links). Create a small component `src/components/feature-gate.tsx`:

```tsx
export function FeatureGate({ feature, children }: { feature: FeatureKey; children: ReactNode }) {
  // useFeatureOn(feature); while loading render children (fail-open);
  // if off → render a centered card: "This feature isn't enabled for your company"
  // with a Link home + "Contact your administrator" line. Do NOT redirect (avoids loops).
}
```
Wrap the top-level JSX of each gated route's component (per §1 table) in `<FeatureGate feature="...">`. Touch ONLY the wrapping — no logic changes inside those routes. **Exception: run `git status` first — if `orders.index.tsx` / `orders.$id.tsx` have uncommitted changes from the other session, skip wrapping them and say so in your summary.**

### 4.3 AI assistant gate
Find where the assistant UI mounts (grep for the assistant component in `app-shell.tsx` / dashboard — do NOT edit `use-assistant.ts` itself). Wrap its trigger/panel render in `useFeatureOn("ai_assistant")` — feature off → don't render the button.

### 4.4 Company-admin toggles in Settings
In `src/routes/settings.tsx`, add a new card/section **"Features"** (admin-only, matching the page's existing section style):
- One row per `FEATURE_KEYS` entry: label + Switch.
- `allowed === false` → Switch disabled (greyed) + caption "Not included in your plan — contact developer".
- Otherwise Switch bound to `enabled`, calling `useSetFeatureEnabled`, with a toast on save.

---

## 5. Frontend — minimal platform console

### 5.1 Guard
New route `src/routes/platform.tsx`: if `useIsPlatformAdmin()` is false (after loading) render the standard 404-style "Page not found" (do NOT hint the route exists). No nav link anywhere — Harish types `/platform` manually.

### 5.2 Companies list (`/platform`)
Table of all companies: name, plan, status, created date, user count (count profiles per company via a second query). Row click → `/platform/$companyId`. Header: "Enthrella Platform Console".

### 5.3 Company detail (`src/routes/platform.$companyId.tsx`)
- **Info card:** name, plan (select: free/starter/pro/custom), status (select: active/trial/suspended/archived), trial_ends_at (date), contact fields, notes. Save = direct update on `companies` (platform RLS permits).
- **Entitlements card:** all 9 features, each with an **Allowed** switch (writes/upserts the row directly) and a read-only badge showing the company's own `enabled` state.
- **Users card (read-only):** list profiles of that company (name, role, is_active).

### 5.4 Create company (stub only)
"New Company" button → dialog that inserts a `companies` row (+ default `company_settings` row if the schema requires one — check the existing signup/bootstrap migration for what a company needs). Show the caveat in the UI: *"Note: invite the first admin user via the existing signup flow."* Wiring user-creation is a later phase.

### 5.5 Suspension behaviour (minimal)
In `auth-context.tsx` or app-shell: if `company.status === 'suspended'` (or `'archived'`), render a full-screen notice — "This account is suspended. Contact admin@enthrella.com" — with a sign-out button, instead of the app. Skip this for the platform admin so Harish can still get in. (Add the new optional fields to the `Company` type in `src/lib/crm.ts`.)

---

## 6. Order of work, verification & handover

Build in this order (each step leaves the app working):
1. `src/lib/features.ts` + the migration file.
2. `use-features.ts` hook (safe even before the migration runs — queries error → fail-open).
3. Nav tagging + FeatureGate wrappers.
4. Settings "Features" section.
5. Platform console routes.
6. Suspension screen.

Then produce a **handover message for Harish** containing:
- The migration file path + instruction: run it in the Supabase SQL editor, THEN run the seed insert with his user id (include the lookup query).
- A click-by-click test script: (a) log in as admin → Settings → Features → toggle Stock off → Stock vanishes from sidebar, direct URL shows the gate card; (b) visit `/platform` → open a company → switch Leads "Allowed" off → that company admin's Leads toggle goes grey; (c) set a test company's status to suspended → its users see the suspension screen.
- Reminder that nothing is live until he pushes via GitHub Desktop and runs the SQL by hand.

**Do not** run `npm install`, create edge functions, regenerate Supabase types, or edit: `use-assistant.ts`, `use-orders.ts`, `orders*.tsx` (if dirty), the AI worker files, or `developer.tsx`.
