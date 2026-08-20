# Ticket: Move WhatsApp Connect flow from console to the client's own Settings

## Goal

Right now the "Connect WhatsApp" button (Meta Embedded Signup) only exists on the platform
console (`console.companies.$companyId.tsx`), which only Harish can reach. That means every
client's WhatsApp connection has to happen through Harish's own browser session, with a
different client Facebook account logging in each time — Chrome/Facebook then "remembers" the
last login and re-uses it on the next click, which is a bad experience for switching between
clients. The fix: let each company's own admin connect their own WhatsApp number from their own
Settings page, on their own device, with their own Facebook login. The console keeps only a
read-only status view and the existing on/off entitlement toggle — it drops the ability to
trigger the connect flow itself.

`whatsapp_integration` stays a `CONSOLE_ONLY_FEATURE_KEYS` entry (Harish still decides which
companies get the paid feature at all) — this ticket does not change that gating. It only moves
*who runs the connect wizard* once the feature is already turned on for a company.

## Files

**Edit:**
- `src/routes/settings.admin.index.tsx` — add a new `WhatsAppSetupCard` component, rendered
  alongside `MobileAppCard` (which is at line ~98, `<MobileAppCard />`). Add `<WhatsAppSetupCard />`
  right after it.
- `supabase/functions/whatsapp-embedded-signup-callback/index.ts` — change the auth check so a
  company admin can call `status`/`connect` for their OWN company, not just a platform admin for
  any company.
- `src/lib/use-whatsapp.ts` — no signature change needed; the hooks already take `companyId` as
  a parameter, so the new card just passes the caller's own `company.id` instead of a console
  route param.
- `src/routes/console.companies.$companyId.tsx` — cut `WhatsAppCard` down to a read-only status
  view: keep the card, the status badge, the numbers table, and the account-error banner; REMOVE
  the mode picker, the rep-assignment picker, the "Connect WhatsApp" button, and `handleConnect`.
  Keep `useWhatsappStatus` (read) but drop `useConnectWhatsappNumber` and the
  `launchWhatsappEmbeddedSignup` import/call from this file.

**Read only (do not edit):**
- `src/routes/settings.admin.index.tsx` (full file, for the `MobileAppCard` pattern — auth via
  `useAuth()`, feature-gate via `useFeatureOn`, loading/error/toast conventions)
- `src/lib/whatsapp-embedded-signup.ts` (the `launchWhatsappEmbeddedSignup(configId)` helper —
  unchanged, just called from a new place)
- `supabase/functions/whatsapp-manage-templates/index.ts` — this is the auth pattern to copy into
  the callback function. Lines ~44-56 do exactly this: get the JWT, look up
  `profiles.company_id`/`profiles.role` for the caller, and 403 unless
  `["admin", "manager"].includes(profile.role)`. Reuse this pattern verbatim.
- `src/lib/auth-context.tsx` (for `useAuth()` — provides `company: { id, name, ... } | null`)
- `src/lib/use-features.ts` (for `useFeatureOn(key)`)

## Approach

### 1. Edge function auth (`whatsapp-embedded-signup-callback/index.ts`)

Currently the function does this and ONLY this:
```ts
const { data: pa } = await admin.from("platform_admins").select("user_id").eq("user_id", userData.user.id).maybeSingle();
if (!pa) return json({ error: "Forbidden — platform admin only (console-only feature)" }, 403);
```
...and then requires the caller to pass `company_id` in the request body, trusting it blindly
(fine when only a platform admin could call it — NOT fine once a company admin can call it, since
a malicious body could pass someone else's `company_id`).

Replace this block with dual auth, following `whatsapp-manage-templates/index.ts`'s pattern:

1. First check if the caller is a platform admin (same query as today). If yes: `company_id` MUST
   still come from the request body (console behavior unchanged — Harish can view any company).
2. If NOT a platform admin: look up `profiles.company_id` and `profiles.role` for the caller
   (exact query from `whatsapp-manage-templates/index.ts` lines ~48-56). Require
   `role` to be `"admin"` (NOT `"manager"` here — connecting a WhatsApp number is a bigger
   action than managing templates, keep it admin-only). If the profile has no `company_id` or
   role isn't `"admin"`, 403 with `"Only a company admin can connect WhatsApp"`.
3. **Critical:** when the caller is a company admin (not a platform admin), IGNORE any
   `company_id` in the request body and use `profile.company_id` instead — this is what stops a
   company admin from acting on a different company's WhatsApp account. This mirrors the existing
   `whatsapp-manage-templates` pattern exactly (it never trusts a client-supplied company id).

The rest of the function (`status` and `connect` action bodies) is unchanged — it already just
uses whatever `companyId` variable is resolved at the top.

### 2. New `WhatsAppSetupCard` in `settings.admin.index.tsx`

Copy the shape of `MobileAppCard` (same file, ~line 221):
- `const { company } = useAuth();` for the company id/name.
- `const whatsappOn = useFeatureOn("whatsapp_integration");` — `if (!whatsappOn) return null;`
  (mirrors `if (!mobileOn) return null;` in MobileAppCard).
- `useWhatsappStatus(company.id)` and `useConnectWhatsappNumber(company.id)` from
  `src/lib/use-whatsapp.ts` (already imported nowhere in this file — add the import).
- Import `launchWhatsappEmbeddedSignup` from `src/lib/whatsapp-embedded-signup.ts`.
- Import `useProfiles` from `src/lib/use-leads.ts` — this is the existing hook that returns the
  logged-in company's own team members (used today by `src/routes/team.directory.tsx`), scoped
  by RLS to the caller's own company already. Use it for the multi-mode rep picker exactly like
  `console.companies.$companyId.tsx` used its `usePlatformCompanyUsers(companyId)` prop — filter
  to `role === "rep"` the same way (`reps.filter((r) => r.role === "rep")`).
- The actual JSX (mode picker, rep-assignment picker, numbers table, status badge, Connect
  button, `handleConnect` function) can be copied near-verbatim from the CURRENT (pre-edit)
  `WhatsAppCard` in `console.companies.$companyId.tsx` — same fields, same
  `VITE_WHATSAPP_CONFIG_ID` env read, same error toasts. The only real difference: this version
  has no `companyId`/`companyName`/`reps` props — it derives everything from the logged-in
  session (`useAuth()`, and the reps hook mentioned above).
- Match this page's existing card styling (`Card`/`CardHeader`/`CardTitle`/`CardDescription` with
  the `rounded-2xl shadow-soft` / `text-ios-title3` / `text-ios-subhead` classes already used
  elsewhere in this file — NOT the dark `border-zinc-800 bg-zinc-900` classes from the console
  version, which is a dark console-only theme that doesn't belong on a client-facing page).

### 3. Cut down `WhatsAppCard` in `console.companies.$companyId.tsx`

Keep:
- The card shell, `CardTitle`/`CardDescription`, the status badge function, the error banner,
  the numbers table.
- `useWhatsappStatus(companyId)` (read-only).

Remove:
- `useConnectWhatsappNumber`, `launchWhatsappEmbeddedSignup` import and call, `handleConnect`,
  the mode `Select`, the rep-assignment `Select`, the "Connect WhatsApp" / "Connect another
  number" `Button`, and the "Waiting on Embedded Signup configuration" hint paragraph.
- Update the `CardDescription` text to something like: "{companyName}'s WhatsApp connection,
  managed by their own admin from Settings. Toggle the feature on/off below." (adjust wording to
  fit whatever on/off toggle already exists nearby in this console page — do not invent a new
  toggle, there should already be one for `whatsapp_integration` since it's
  `CONSOLE_ONLY_FEATURE_KEYS`).

## Constraints

- Reps must never see this card — it's admin-only, same as `MobileAppCard`'s pattern (check how
  `MobileAppCard` or the surrounding page already restricts by role, if at all; if the whole
  `/settings/admin` route is already admin-gated, no extra check is needed here).
- Do not touch `company_whatsapp_accounts`/`company_whatsapp_numbers` RLS or schema — this is a
  frontend + edge-function-auth change only.
- Do not change how `whatsapp_integration`'s `CONSOLE_ONLY_FEATURE_KEYS` gating works — Harish
  still turns the feature on per company from console. This ticket only changes who can run
  the *connect* flow once it's on.
- No `Enthrella`/`Acrowell` strings anywhere in new UI text.
- Do not commit. Leave changes staged for review.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- Manual note in your report (no need to actually run it, since you have no login): confirm by
  reading the code that a company admin calling `whatsapp-embedded-signup-callback` with a
  forged `company_id` in the body gets the REAL company_id from their own profile, not the
  forged one — quote the exact lines that guarantee this.
- `git status` — only the four files listed under "Edit" above should be modified. No stray files.
