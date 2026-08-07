# Kimi backlog — paste-ready prompt

*Written 21 July 2026. Use this while Claude builds Phase D3 (developer console + 2FA) so both tracks move at once without touching the same files.*

---

## Before you start

1. **Pull `main` first.** Claude just committed Phase D3 (commit `cd0e40c`, "Phase D3: separate developer console...") — 17 new/changed files under `src/routes/console.*`, `src/components/console-*.tsx`, `src/lib/use-mfa.ts`, `src/lib/use-platform.ts`, `src/components/app-shell.tsx`, `src/routes/auth.tsx`. **Do not push until you've pulled this in** — if your local checkout predates it, `git pull` (or re-sync in Lovable) before making any commits, or you'll create a conflicting history.
2. **Never touch these files — another session owns them right now:**
   - `src/lib/use-assistant.ts`, `src/lib/use-orders.ts`, any `src/routes/orders*.tsx`
   - `acrowell-ai-worker/` (the AI Worker — not even in this repo)
   - `src/components/assistant-chat.tsx`, `src/components/lead-dialog.tsx`, `src/routes/parties.index.tsx`, `src/routes/products.tsx` (per the AI-assistant handoff — may have uncommitted work)
3. **Also leave these alone for now** — Claude is mid-build on the console/2FA login path and will keep touching them until D3 is fully handed over:
   - `src/routes/console.tsx`, `src/components/console-shell.tsx`, `src/components/console-login.tsx`, `src/components/console-mfa.tsx`, `src/lib/use-mfa.ts`, `src/components/app-shell.tsx`, `src/routes/auth.tsx`
   - You MAY add new content *inside* `src/routes/console.index.tsx` (Task 2 below) — that one's fine to extend, just don't touch the login/guard files.
4. Read `CLAUDE.md` and invoke the `leadenthrella-deploy` skill before writing any code. Same non-negotiables as always:
   - SQL migrations never auto-apply — write the file, tell Harish the exact SQL to paste.
   - Edge functions don't reliably redeploy on push — if a new action returns "Unknown action," tell Harish to re-trigger the deploy in Lovable.
   - Lovable Cloud blocks `CREATE TABLE`/policies against `storage.buckets` — reuse the existing `company-assets` bucket, separate by folder path. `storage.objects` RLS policies are fine.
   - New tables/columns: call them as `(supabase.from("x") as any)`, hand-write TS types as **optional** fields. Don't regenerate Supabase types.
   - You can't run `npm install` or `tsc` in your sandbox — verify by careful reading; Harish tests live after pushing.
5. Every task below ends with: the exact SQL to hand Harish, any manual dashboard steps, and a plain-language test script — he is not a developer.

---

## Task 1 — Phase E, code side only: custom domains / white-label

**Full spec:** `Files/PHASE-E-CUSTOM-DOMAINS-SOLUTION.md` — read it in full before starting, this summary is not a substitute.

**Important:** §5 of that doc is a ~1–2 hour manual Cloudflare setup Harish must do himself (create account, move DNS, connect Cloudflare Pages, enable Custom Hostnames, copy an API token + zone ID into three Supabase edge-function secrets: `CF_API_TOKEN`, `CF_ZONE_ID`, `CF_CNAME_TARGET`). **You are not doing that setup.** Your job is §6 only — the code — which can be written and pushed now; it just won't be *testable end-to-end* until Harish finishes §5 and sets those three secrets. Say this plainly in your handover so nobody thinks it's live before it is.

Build, in order:

1. **Migration** `supabase/migrations/20260724120000_company_domains.sql` — exactly as in §6.1 of the doc: `company_domains` table, RLS (platform-admin full access, a company can SELECT its own row), the `get_company_branding_by_domain(hostname)` SECURITY DEFINER function (anon + authenticated EXECUTE — this is the pre-login branding lookup), and the `branding_public_read` storage policy for `company-assets/{company_id}/branding/...`.
2. **Edge function** `supabase/functions/platform-manage-domain/index.ts` — copy the auth/CORS scaffolding from `platform-manage-user`. Actions `add`, `check`, `check_all` (accepts `x-cron-secret` same as `platform-purge-old-data`), `remove` — full behavior in §6.2. Calls the Cloudflare API directly with `CF_API_TOKEN`/`CF_ZONE_ID` from `Deno.env`.
3. **Console UI** — a **Custom domain** card on `src/routes/console.companies.$companyId.tsx` (pull it first — this file now exists from D3). Follow §6.3: add-domain form, DNS instruction panel with copy buttons, status badge (`Pending DNS` / `Issuing certificate` / `Live` / `Failed`), **Check now** / **Remove** buttons. Write the mutations in a new `useCompanyDomain`-style set of hooks inside `src/lib/use-platform.ts` — but since Claude may still be touching that file for D3, check `git log -1 -- src/lib/use-platform.ts` first; if there's a fresher commit than the one you pulled, re-pull before editing it.
4. **App-side resolution** — new hook `src/lib/use-domain-branding.ts` per §6.4: resolve `window.location.hostname` against `get_company_branding_by_domain`, branded pre-login screen, post-login company mismatch check, and the console-safety rule ("`/console` renders 404 on any non-platform hostname" — this depends on D3 being live; if `console.tsx` isn't in your checkout yet, skip this one sub-bullet and flag it rather than guessing at the guard's shape).
5. Don't wire this into the actual login screen (`src/routes/auth.tsx`) or the console login — those are D3 files Claude owns right now. Build the hook and leave a one-line TODO comment for where it plugs in; a follow-up session wires it in once D3 is fully settled.

**Handover:** the migration SQL, the three edge-function secret names Harish needs to set (values come from his own §5 setup, not from you), and the plain-language test script from §10 of the doc (steps 2–4 only — step 1 and 5 are Harish's infra work, not yours).

---

## Task 2 — Phase F.1: platform usage analytics (only after Task 1's migration is written)

**Spec:** `REMAINING-PHASES-BUILD-PLAN.md`, Phase F.1 section.

There's already a per-company AI usage summary (`useAssistantUsageSummary` in `src/lib/use-assistant.ts` — **read-only reference, do not edit that file**), backed by the `assistant_usage` table (migration `20260715180000_assistant_usage.sql`). This task surfaces it platform-wide.

1. New hook(s) in a **new file** `src/lib/use-platform-analytics.ts` (don't add to `use-platform.ts` — keep this separate so it can't collide with anything else in flight):
   - AI actions + estimated cost **per company**, this month, sorted by spend descending.
   - Platform totals: companies, users, orders, AI spend this month.
   - Most-used features, derived from `company_features` enabled counts.
2. Add a new card/section to `src/routes/console.index.tsx` (the D3 dashboard — pull latest first, this file exists now) showing the above. If for some reason `console.index.tsx` isn't in your checkout when you get to this, add it to `src/routes/platform.index.tsx` instead and leave a note that it should be copied into the console dashboard once D3 lands.
3. **Do not** log or display raw AI message content — counts and costs only. If Harish later wants prompt-level analysis, that's a separate decision with privacy implications (see `PLATFORM_BACKEND_AND_MULTITENANCY_PLAN.md` §2.5) and needs a customer-terms update first — don't build toward it here.

**Handover:** no SQL needed (read-only against existing tables) — just the plain-language test script: log in as the platform admin, open the dashboard, confirm the numbers look right for at least one company you know the AI usage for.

---

## What NOT to pick up right now

- **Phase B (custom roles/permissions)** — already built and live (`src/lib/permissions.ts`, `src/lib/use-permissions.ts`, the Roles tab in Settings). Nothing to do here.
- **Phase D2 (bug reports)** — already built and live. Nothing to do here.
- **Phase F.2 (Razorpay billing)** — blocked until Harish creates a Razorpay account and hands over API keys. Don't start.
- **AI assistant work (Gap A/B corpus fixes, invoice PDF generation, order-creation UX)** — actively owned by a separate session per `Files/handoff.md`. Stay out of `use-assistant.ts`, `use-orders.ts`, `orders*.tsx`, and the Worker.
