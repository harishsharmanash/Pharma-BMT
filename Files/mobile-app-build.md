# Mobile App — Build Plan

> ## ✅ SHIPPED AND WORKING — 3 Aug 2026
>
> A **branded APK for Acrowell Labs was built by the live pipeline, installed on a real Android
> phone, and runs.** Correct logo and app name on the home screen; login, invoice PDF/JPG downloads,
> WhatsApp file share, camera and safe-area insets all confirmed working on device.
>
> Phases 0–5 are complete and merged to `main`. The Download button, the branded build pipeline,
> release signing, private R2 storage with presigned URLs, and the in-app update prompt are all live.
>
> **Do not rebuild any of it.** Remaining work is listed under "Open" below.
>
> **Operational setup lives in `MOBILE-APP-SETUP-RUNBOOK.md`** — including the seven real failures
> the first live run exposed and the guards now preventing each. Read that before touching the
> pipeline.
>
> ### Open
> - **Launcher icon quality** — a wide, opaque, white-background logo renders as a small white
>   rectangle on the brand colour. Branch `mobile/icon-quality`.
> - **Rotate the exposed R2 API token** (`cfat_…` appeared in a shared screenshot during debugging).
>   Must be updated in **both** GitHub Secrets and Supabase edge-function secrets.
> - **Upgrade-in-place never tested** — change branding, rebuild, install over the top without
>   uninstalling, confirm the session survives. This is the feature Harish specifically asked for.
> - Full on-device sweep planned for the afternoon of 3 Aug 2026.
> - iOS still out of scope (§10 item 1).

**Original plan below. Written 30 Jul 2026.**
Authority for all mobile-app work. If a note, memory, or ticket contradicts this file, this file wins
until it is superseded. When a phase ships, mark it here in the same session (CLAUDE.md §9).

> ⚠️ **Read §2 before writing a single line.** Roughly half of what this feature needs is already
> built and shipped. Every backlog in this project has listed shipped work as outstanding at least
> once. Verify against code before building anything below.

---

## 1. What we are building

A **downloadable Android app, branded per company**.

A company admin opens **Settings → Branding**, taps **Download mobile app**, and gets an `.apk` file.
They install it on their phone; so does their team. On the home screen it shows **their logo and
their company name** — to a field rep it is their company's own app. Inside, they log in exactly as
they do on the web, and every feature works the same, with mobile behaviours (WhatsApp share,
tap-to-call, camera) going through the real phone apps.

Behind it, it is still one Cerebyl codebase, one Supabase backend, one deploy.

Two console-side switches control who gets what:

| Switch | Off | On |
|---|---|---|
| **Mobile app** | No "Download mobile app" button anywhere. Company doesn't know it exists. | Button appears; they can download a **Cerebyl-branded** app. |
| **Custom branded app** | App carries Cerebyl branding. | App carries **their** logo and name. Sold as an upgrade. |

This is a packaging/upsell tier, not a security boundary.

### Explicitly NOT in scope

- **Play Store / App Store listings.** We distribute the APK directly. No store review, no per-client
  developer accounts. This was decided deliberately — Apple in particular rejects near-identical
  template apps, and per-client store ops does not scale.
- **iOS.** Sideloading is impossible on iPhone. iOS users stay on the web app, optionally
  "Add to Home Screen" (a PWA, which does give a branded icon). See §10 — this is a real gap and a
  decision, not an oversight. Indian pharma field teams are overwhelmingly Android.
- **A second codebase.** The app is a wrapper around the existing web app, not a rewrite.

---

## 2. What already exists — DO NOT REBUILD

Audited against code on 30 Jul 2026. All line numbers verified.

### 2.1 Per-company white-label branding — BUILT (Phase E), never switched on

`src/lib/use-domain-branding.ts` (124 lines) resolves the current hostname to a company and returns
its branding. `src/routes/auth.tsx` already renders **that company's** logo and name on the login
screen and hides Cerebyl naming when the host is a client domain. `src/routes/console.tsx` 404s the
console on any non-platform hostname.

- Table: `company_domains`, migration `20260724120000_company_domains.sql`
- Spec: `Files/archive/PHASE-E-CUSTOM-DOMAINS-SOLUTION.md` §6.4
- Console UI for linking domains exists (`platform-manage-domain` edge function)

**Status per its own header comment: never exercised end-to-end**, because no client custom domain
has ever gone live. The code path is written but unproven.

**Consequence for us:** the "show this company's branding instead of Cerebyl's" problem is *solved
code*. We do not build a second branding system. The mobile app reuses this one.

### 2.2 Two-gate feature entitlements — BUILT and correctly secured

`supabase/migrations/20260719120000_feature_entitlements.sql` defines `company_features`:

| Column | Meaning |
|---|---|
| `allowed` | **Platform admin gate.** Written only from the console. Company admins have *no write policy* — enforced in RLS, not just UI. |
| `enabled` | **Company admin gate.** Only flippable when `allowed = true`, via `SECURITY DEFINER` RPC `set_company_feature_enabled`. |

Both consumer surfaces already iterate the key list:
- `src/routes/console.companies.$companyId.tsx:404` — platform console, writes `allowed`
- `src/routes/settings.tsx:402` — company settings, writes `enabled` via the RPC

**Consequence:** the two toggles Harish asked for are *two strings in an array plus two labels*.
No new table, no new RLS, no new UI. See §4.

### 2.3 Company branding data — BUILT

`src/lib/use-company.ts` — `logo_url` (path inside the `company-assets` storage bucket, written as
`{company_id}/logo.{ext}`) and `primary_color` already exist and are already editable in
Settings → Branding. This is the source of truth for the APK icon and theme colour. Do not add new
columns for it.

### 2.4 Mobile-shaped features already working on the web

- **WhatsApp share** — `src/lib/order-share.ts:28` builds `https://wa.me/` links;
  `src/components/share-sheet.tsx` is the format→platform picker. `wa.me` links fire the real
  WhatsApp app from inside a WebView with zero extra work. **No native share plugin needed for v1.**
- **Tap-to-call** — `tel:` links, e.g. `src/routes/parties.$id.tsx:207`. Works natively.
- **Camera / bill extraction** — file inputs, `src/lib/file-extract.ts`.

### 2.5 What does NOT exist

- Capacitor — `package.json` has zero capacitor packages.
- Any APK, keystore, or build pipeline.
- Any `mobile_app` feature key.

---

## 3. Architecture

### 3.1 The shape

```
┌─────────────────────────────────────────────┐
│  Company admin: Settings → Branding         │
│  [ Download mobile app ]                    │
└────────────────────┬────────────────────────┘
                     │  invoke
                     ▼
        Edge Function: build-mobile-app
        · verifies caller is a company admin
        · verifies company_features.mobile_app allowed+enabled
        · reads branding (name, logo, primary_color)
        · reads mobile_app_white_label → branded or generic
        · writes company_apps row, status = 'building'
                     │  GitHub API workflow_dispatch
                     ▼
        GitHub Actions: build-apk.yml
        · checks out the Capacitor shell
        · injects app name, icon, splash, colour, package id, start URL
        · ./gradlew assembleRelease
        · signs with ONE platform keystore (GH secret)
        · uploads APK to Supabase Storage
        · marks company_apps row status = 'ready'
                     │
                     ▼
        Button becomes [ Download ] → signed URL → .apk
```

### 3.2 The shell

A **Capacitor** Android project — a thin native wrapper whose only job is to open the live web app in
a full-screen WebView with no address bar. It is checked into the repo at `mobile/` (or a sibling
folder — see §10).

Only **six** things vary per company:

| Thing | Source |
|---|---|
| App name (home-screen label) | `companies.name`, or `"Cerebyl"` if not white-labelled |
| Launcher icon | `company-assets/{id}/logo.*`, or the Cerebyl icon |
| Splash screen | Same logo on `primary_color` |
| Theme / status-bar colour | `companies.primary_color` |
| `applicationId` (package id) | `com.cerebyl.app.{slug}` — distinct per company |
| Start URL | See §3.3 |

Everything else — every screen, every feature — is the existing web app, unchanged.

**The shell lives at `leadenthrella/mobile/` with its OWN `package.json`** — deliberately isolated
from the web app's dependencies. Two reasons:

1. CLAUDE.md §4 warns the repo carries **both `bun.lock` and `package-lock.json`**, and any
   dependency change that desyncs the lockfile Cloudflare uses fails the production build with
   *"lockfile had changes, but lockfile is frozen."* Adding Capacitor to the root `package.json`
   would risk taking the live site down to build a phone app. Isolation removes that risk entirely.
2. The shell loads a **remote URL**, so it never bundles the web build output and genuinely has no
   dependency on the web app's toolchain.

Nothing in `mobile/` may modify the root `package.json`, `bun.lock`, or `package-lock.json`.

### 3.3 What URL the app opens — DECIDED

**The APK points at `app.cerebyl.com`, with the company identified in the start URL.**
Not a per-client custom domain, for v1.

Rationale:
- Inside a full-screen WebView **nobody ever sees a URL**, so the "feels like their app" goal is met
  100% either way.
- A custom domain per client requires Cloudflare for SaaS setup, per-client DNS, and — critically —
  adding every client domain to the **AI Worker's CORS allowlist** (`acrowell-ai-worker/wrangler.jsonc`,
  currently only `.icy-sunset-05b0.workers.dev` + `cerebyl.com`). Miss one and Ceremate silently
  breaks in that client's app only. CLAUDE.md already flags this trap.
- Staying on `app.cerebyl.com` means **the origin never changes**, so CORS, CSP, Supabase auth
  redirects, and the Sentry config all keep working untouched.
- A client can be graduated to a real custom domain later **without rebuilding the APK** — the shell
  reads its start URL from config.

The branded login screen still works because §2.1's branding resolution runs off the start URL.
**Ticket note:** `use-domain-branding.ts` currently resolves on *hostname only*. It will need to also
accept a company hint from the start URL (path or query param) so branding works without a custom
domain. This is a small, surgical change to an existing file — not a rewrite.

### 3.4 Updates — the good part

Because the app is a WebView onto the live site, **every feature update ships through the normal
`./scripts/ship.sh` deploy and appears in the app immediately.** No reissue, no reinstall, no store
review.

APKs only need rebuilding when:
1. The native shell itself changes (should be almost never — design it minimal), or
2. A company's **branding or white-label toggle changes** (see §6.3 — icon and app name are frozen at
   build time).

This is the single design decision that makes sideloaded distribution viable. Keep the shell dumb.

---

## 4. Feature flags

### 4.1 New keys

Add to `src/lib/features.ts`:

```ts
"mobile_app",              // label: "Mobile App"
"mobile_app_white_label",  // label: "Custom Branded App"
```

`console.companies.$companyId.tsx:404` picks both up automatically and renders console toggles.
That is the whole console-side build.

### 4.2 Gotcha A — entitlements currently fail OPEN

`src/lib/use-features.ts` is explicit and deliberate: **no row = allowed + enabled**, so existing
companies work with zero seeding. Correct for core modules. **Exactly backwards for a paid add-on** —
every company would get the mobile app for free by default.

These two keys must **fail closed**. Options:

- **(preferred)** A `DEFAULT_OFF: Set<FeatureKey>` in `features.ts`, honoured by `isFeatureOn` /
  `useFeatureOn`. One place, self-documenting, no seeding, and correct for future paid add-ons too.
- (alternative) Seed `allowed = false` rows for every existing company in the migration. Works, but
  silently wrong for any company created afterwards unless the default changes too.

Whichever is chosen, **there must be a test** asserting a missing row means OFF for these keys and ON
for core keys. This is precisely the kind of inverted default that passes review and ships broken.

### 4.3 Gotcha B — the white-label toggle must never render company-side

`src/routes/settings.tsx:402` maps over the *same* `FEATURE_KEYS`. Adding `mobile_app_white_label`
naively puts a **"Custom Branded App" switch in the customer's own settings** — letting them switch
on the exact thing we are charging for.

Fix: a `CONSOLE_ONLY_FEATURE_KEYS` set in `features.ts`, filtered out of the settings map.
`mobile_app_white_label` goes in it. `mobile_app` does **not** — a company may legitimately want to
hide the download button from their own staff via `enabled`.

Note the RPC is already safe server-side (`set_company_feature_enabled` refuses when
`allowed = false`), so this is a UI-correctness fix, not a security hole. But an admin seeing a
switch they cannot use is a support ticket, and a switch they *can* use is lost revenue.

### 4.4 Resulting behaviour

| `mobile_app` | `mobile_app_white_label` | What the company sees |
|---|---|---|
| allowed = false | — | No button. Feature invisible. |
| allowed = true, enabled = false | — | Company admin has turned it off for their team. |
| allowed = true, enabled = true | allowed = false | Button → **Cerebyl-branded** app. |
| allowed = true, enabled = true | allowed = true | Button → **their branded** app. |

---

## 5. Data model

One new table. Nothing else.

```sql
CREATE TABLE public.company_apps (
  company_id     uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  status         text NOT NULL DEFAULT 'none'
                 CHECK (status IN ('none','building','ready','failed')),
  apk_key        text,          -- object key in the R2 bucket (see §5.1)
  version_code   int  NOT NULL DEFAULT 0,
  built_at       timestamptz,
  build_error    text,
  -- fingerprint of the inputs the APK was built from (name+logo+colour+white_label).
  -- If this no longer matches current branding, the installed app is STALE. See §6.3.
  branding_hash  text,
  requested_by   uuid REFERENCES auth.users(id),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
```

RLS:
- `SELECT` — own company (`company_id = current_company_id()`) or platform admin.
- **No** company-side `INSERT`/`UPDATE`/`DELETE` policy. All writes go through the edge function on
  `service_role`. Same shape as `company_features`.

Migrations are applied **by hand in the SQL Editor** (CLAUDE.md §4 — never `supabase db push`).

### 5.1 APK storage: Cloudflare R2, NOT Supabase Storage — DECIDED

APKs live in a **private Cloudflare R2 bucket** (`cerebyl-mobile-apps`), served only via short-lived
presigned URLs.

**Never public.** An APK is an executable; a public bucket makes us a malware distribution vector and
lets anyone enumerate our clients.

Rationale for R2 over Supabase Storage:
- **Zero egress fees.** R2's defining feature. Every APK download is ~10–15 MB, and reps reinstall.
  On Supabase's free plan those downloads burn a capped monthly egress allowance; on R2 downloads are
  free at any volume. This is the deciding factor — the workload is "distribute binaries repeatedly."
- Keeps the Supabase free plan's storage and bandwidth clear for **actual application data**, which
  is what it is scarce for.
- The Cloudflare account already exists (`admin@enthrella.com`) and already hosts the Worker and DNS.
  No new vendor, no new subscription.

Retention: keep only the **latest** APK per company; delete the previous object on a successful
rebuild. There is no reason to accumulate old builds, and it keeps storage flat as clients grow.

> Verify current R2 and Supabase free-tier limits on their pricing pages before launch rather than
> trusting figures quoted in this doc — both change.

---

## 6. The build pipeline

### 6.1 Edge function `build-mobile-app`

Follow the existing pattern in `supabase/functions/platform-manage-domain/`.

1. Authenticate the caller; require **company admin** role.
2. Re-check `company_features.mobile_app` is `allowed && enabled` **server-side.** Never trust that
   the button was hidden.
3. Read `mobile_app_white_label.allowed` → decides branded vs generic. Server-side only.
4. Compute `branding_hash`. If it matches an existing `ready` row, **return the existing APK** — do
   not rebuild.
5. Rate-limit: refuse if a build for this company is already `building`, or if one completed in the
   last N minutes. Builds cost CI minutes and are trivially spammable from a button.
6. `workflow_dispatch` to GitHub Actions with the branding payload.
7. Upsert `company_apps` → `status = 'building'`.

### 6.2 GitHub Actions `build-apk.yml`

`ubuntu-latest` ships with the Android SDK. A build is ~4–6 min; free-tier private-repo minutes give
us hundreds of builds a month. Cost is effectively zero at our scale.

Steps: checkout → fetch logo from Supabase Storage (`company-assets`) → generate icon + splash at all
densities → patch `strings.xml` (app name), `applicationId`, theme colour, and the Capacitor start
URL → `./gradlew assembleRelease` → sign → **upload to the R2 bucket (§5.1)** → delete the previous
APK object → update the `company_apps` row.

**Keystore.** One platform keystore signs every company's APK — that is fine and normal. It lives in
GitHub Secrets, **never in the repo**, and must be backed up somewhere Harish controls. If it is lost,
no installed app can ever be updated in place; every user would have to uninstall and reinstall.
Treat it like the `company_secrets_master` passphrase.

**Failure handling:** the workflow must write `status = 'failed'` + `build_error` on any failure.
A build that dies silently leaves the button spinning forever.

### 6.3 Staleness — branding changes cannot retro-brand an installed app

The launcher icon and app name are **compiled into the APK**. If a company installs the
Cerebyl-branded app and we later switch white-label on, their phone still shows the old icon and old
name until they re-download and reinstall.

Mitigated by design: *everything inside the app* — splash, login screen, colours, every screen — is
web content and re-skins **instantly** via the existing Phase E branding (§2.1) with no rebuild. Only
the home-screen icon and label are frozen.

So the handling is UX, not engineering:
- Store `branding_hash` at build time (§5).
- When current branding ≠ stored hash, the Settings button shows **"Update available — download the
  new version of your app"**.
- Flipping either toggle in the console must invalidate the hash so every affected company sees it.

### 6.4 Versioning

`version_code` increments per build. Installing an APK over an existing one with the **same
`applicationId`** and a **higher `versionCode`**, signed by the **same keystore**, upgrades in place
and keeps the user's session. Any of those three wrong = Android refuses the install with a confusing
error. Get this right in the spike, not in production.

---

## 7. The hard part: native gotchas

This is where the real engineering time goes. None of it is about branding.

### 7.1 🚨 Downloads are silently broken in a WebView — highest risk

Android WebView **ignores `a.download` and `blob:` URLs.** The tap does nothing. No error, no toast,
no console message. It is the single most likely way this ships "working" and is useless in the field.

It hits the most-used features in the product. Verified call sites:

| Feature | Location |
|---|---|
| Invoice PDF / JPG share | `src/routes/orders.$id.tsx:252`, `:277` |
| CSV export (all Ceremate reports + lists) | `src/lib/export-csv.ts:10` |
| Payslip PDF | `src/components/staff/payroll-tab.tsx:265` |
| Product rate list PDF | `src/routes/products.tsx:502`, `:563`, `:633` |
| Leads CSV | `src/routes/leads.index.tsx:176` |
| Bill summary PDF | `src/routes/leads.$id.tsx:544` |
| Booked-areas PDF | `src/routes/booked-areas.tsx:115` |
| Document viewer download | `src/components/document-viewer.tsx:29` |

**Fix:** one shared download helper that detects the native shell and routes through Capacitor
Filesystem + FileOpener, falling back to current behaviour on web. Then every call site above routes
through it. Mechanical once the helper exists — good Kimi work — but the helper itself needs care.

**Acceptance is manual, on a real phone.** A typecheck cannot catch this.

### 7.2 Auth sessions get silently cleared

`src/integrations/supabase/client.ts:51` stores the session in `localStorage`. Android reclaims
WebView storage under memory pressure, so reps would be randomly logged out — and a field rep who
must re-enter a password mid-visit will stop using the app.

**Fix:** a Capacitor Preferences storage adapter for Supabase auth in the native shell, `localStorage`
on web.

### 7.3 Camera and file picker need explicit permission wiring

Bill extraction (`src/lib/file-extract.ts`) uses a file input. WebView needs
`onShowFileChooser` wired plus manifest permissions, or the picker silently no-ops. Same failure
signature as §7.1.

### 7.4 Install friction

Android shows "install from unknown sources" plus a Play Protect warning that looks alarming to a
non-technical rep. Needs a real install-guide screen with screenshots next to the download button, or
support load spikes on day one. **Budget design time for this — it is not a footnote.**

### 7.5 Back button, deep links, offline

- Hardware back must map to router history, not "exit app".
- `/track/$token` order-tracking links and `/refer` should open in the *browser*, not the app shell.
- Offline: a blank white WebView is the worst failure mode. Minimum viable = a branded "no connection"
  screen. True offline support is out of scope.

### 7.6 Things that already work — do not "fix" them

WhatsApp (`wa.me`) and tap-to-call (`tel:`) fire native apps from a WebView with no plugin. Resist
adding a native share plugin in v1; `share-sheet.tsx` already does the job.

---

## 8. Phases

Each phase is one or more Kimi tickets, reviewed by Claude before the next starts. **Nothing is
"done" until it is verified on a real Android phone** — a green build proves nothing here.

### Phase 0 — Spike (2–3 days) · DO THIS FIRST, THROW IT AWAY

Hand-build **one** APK for **one** company. Hardcode everything. No pipeline, no toggles, no polish.

Install on a real Android phone and verify, by hand:
- [ ] Login works and **survives an app restart**
- [ ] Invoice PDF download actually produces a file that opens (§7.1)
- [ ] Invoice share opens the real WhatsApp app with the message attached
- [ ] Tap-to-call opens the dialer
- [ ] Camera bill capture works end-to-end
- [ ] Ceremate loads and streams (proves CORS is intact from the WebView origin)
- [ ] Hardware back navigates instead of exiting

**This phase exists to find out what breaks before we invest in a pipeline.** If §7.1 or §7.2 turn out
worse than expected, we re-plan here — cheaply. Do not skip to Phase 1 because the spike "mostly
worked."

### Phase 1 — Feature flags (~1 day)

Two keys, two labels, `DEFAULT_OFF` fail-closed handling (§4.2), `CONSOLE_ONLY_FEATURE_KEYS`
filtering (§4.3), plus tests for both defaults. Console toggles work end to end. No app yet.

Independent of Phase 0 — can run in parallel.

### Phase 2 — Native bridges (2–4 days)

The shared download helper + all 8 call-site groups in §7.1. Auth storage adapter (§7.2). File
chooser (§7.3). Back button (§7.5). Re-verify the whole Phase 0 checklist on device.

### Phase 3 — Branded build script (1–2 days)

Parameterise the shell: name, icon, splash, colour, `applicationId`, start URL from a JSON input.
One local command produces a correctly branded, correctly signed APK for any company. Verify two
different companies' APKs **coexist on one phone** (proves `applicationId` is right) and that a
rebuild **upgrades in place** (proves §6.4).

Includes the `use-domain-branding.ts` company-hint change from §3.3.

### Phase 4 — Pipeline (3–5 days)

`company_apps` table + RLS + the R2 bucket and its API token (§5.1). Edge function
`build-mobile-app` with authz, server-side entitlement re-check, dedupe, and rate limiting (§6.1).
GitHub Actions workflow (§6.2). Keystore into GitHub Secrets and backed up.

**Claude does the R2 bucket, the API token, and the keystore personally** — CLAUDE.md §2 reserves
live-infra and secrets work. Kimi writes the edge function and the workflow YAML.

### Phase 5 — The button (2–3 days)

Settings → Branding: **Download mobile app**, gated on `mobile_app`. States: not built / building
(with progress) / ready / failed / **update available** (§6.3). Install-guide screen (§7.4).
Console: per-company build status and a force-rebuild action.

### Phase 6 — Polish (optional, 2–5 days)

Push notifications via FCM (one shared project, topic per company). Offline screen. Deep links.
Faster splash.

**Total: ~2–3 weeks** excluding Phase 6.

---

## 9. Verification contract

Standard gates (CLAUDE.md §2b) apply to all web-side work: `./scripts/ship.sh --dry-run`,
**typecheck at 0** (baseline is 0 as of 30 Jul 2026 — any error is a regression), `npx vitest run`,
full `git diff` reviewed by Claude.

**Additionally, and non-negotiably:** every phase touching the shell or the bridges is verified **on a
physical Android phone**, by hand, against the Phase 0 checklist. There is no automated substitute.
Two of this project's worst bugs shipped typecheck-clean and completely broken; §7.1 fails with *no
error signal at all*.

New tests required:
- Fail-closed defaults for the two new keys, fail-open preserved for core keys (§4.2)
- `branding_hash` staleness detection (§6.3)
- Edge function refuses a build when the entitlement is off (§6.1 step 2)

---

## 10. Open decisions — for Harish

1. **iOS.** Android-only for v1 (APK), iPhone users stay on web? Or also do the PWA "Add to Home
   Screen" path so iOS gets a branded icon too? PWA is ~1–2 extra days and reuses everything here.
2. **Cerebyl attribution in white-labelled apps.** When white-label is ON, does a small
   "powered by Cerebyl" appear anywhere, or is it completely invisible? (Note: Cerebyl branding in a
   client app is a *product* choice — the §3 brand rule bans *Enthrella* and *Acrowell* in UI, not
   Cerebyl.)
3. **Package id scheme.** `com.cerebyl.app.{slug}` — confirm, since it is permanent. Changing it later
   means every user uninstalls and reinstalls.

   > 🚨 **`{slug}` CANNOT be dropped in raw.** Found the hard way on 30 Jul: the first real build
   > failed with *"Namespace 'com.cerebyl.app.default' is not a valid Java package name as 'default'
   > is a Java keyword."* The last segment of `appId` becomes a **Java package name**, so it must be a
   > valid Java identifier. A company slugged `new`, `class`, `public`, `static`, `int`, `for`, `if`,
   > `package`, `switch`, `case`, `do`, `try`, `final`, `native` (etc.) — or any slug containing a
   > **hyphen** or starting with a **digit** — produces an APK that cannot compile.
   >
   > `shree-balaji` and `3m-pharma` both break. Hyphens are illegal in Java packages, and plenty of
   > real pharma firm names slugify into keywords.
   >
   > **Phase 4 requirement:** the build pipeline must sanitise the slug into a valid Java identifier
   > (strip/replace illegal characters, prefix if it starts with a digit, suffix if it collides with
   > a keyword) **and persist the result**, because the package id is permanent per company and must
   > never change across rebuilds. This needs a unit test with the keyword list — it is exactly the
   > kind of thing that works for the first twenty clients and then permanently breaks the
   > twenty-first, whose APK can never be regenerated without forcing a reinstall.

   The Phase 0 shell now uses `com.cerebyl.app.base` for this reason.

*(Decided 30 Jul: shell location — `leadenthrella/mobile/` with an isolated `package.json`, see §3.2.
APK storage — Cloudflare R2, see §5.1.)*

---

## 11. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| WebView downloads silently no-op (§7.1) | **High** | Phase 0 spike finds it before we build anything |
| Reps randomly logged out (§7.2) | **High** | Native storage adapter, Phase 2 |
| Install friction → reps give up (§7.4) | **Medium** | Real install guide, budgeted in Phase 5 |
| Entitlement fails open → everyone gets the paid tier free (§4.2) | **Medium** | Fail-closed + a test |
| White-label toggle exposed company-side (§4.3) | **Medium** | Console-only key filter |
| Keystore lost | **High** | Backed up outside GitHub, treated like the vault passphrase |
| Phase E branding path has never run (§2.1) | **Medium** | Phase 0 exercises it for the first time; expect to fix bugs there |
| Build spam burns CI minutes | Low | Dedupe on `branding_hash` + rate limit |
| Capacitor deps desync a root lockfile → **production build fails** | **High** | `mobile/` has its own `package.json`; root lockfiles are off-limits (§3.2) |

---

## 12. Cost

No new subscriptions. Verified 30 Jul 2026.

- **GitHub Actions** — repo is private with **no existing workflows**, so the full 2,000 free
  minutes/month are unused. A build is ~5 min → ~400 builds/month free. We will use a handful.
- **Signing keystore** — self-generated, free.
- **No Apple ($99/yr) or Google Play ($25) developer account** — we do not use the stores.
- **No Cloudflare for SaaS** — §3.3 keeps everyone on `app.cerebyl.com`.
- **R2** — free tier covers this comfortably, and egress is free regardless (§5.1).
- **FCM push** (Phase 6) — free.

The real cost is ~2–3 weeks of build time against existing Claude/Kimi quota, plus one physical
Android phone for Phase 0 testing.

---

## 13. Changelog

- **30 Jul 2026** — Written. Nothing built yet. Audited existing code: Phase E branding, feature
  entitlements, and company branding data all already exist and are reused rather than rebuilt.
- **30 Jul 2026** — APK storage decided as Cloudflare R2 over Supabase Storage (§5.1, zero egress).
  Shell location decided as `mobile/` with an isolated `package.json` to protect the root lockfiles
  (§3.2). Cost section added (§12).
- **30 Jul 2026** — First three phases built on branches, **not merged, not pushed**:
  - `mobile/phase0-capacitor-shell` (`92b8236`) — Phase 0 scaffold. `cap add android` succeeded.
    **Blocked: no JDK/Android SDK on this Mac**, so no APK has ever been built. Verified nothing
    outside `mobile/` is touched and root lockfiles have a zero diff.
  - `mobile/phase1-feature-flags` (`b1212bd`, `582f439`) — Phase 1 complete. Typecheck 0, 84 tests.
    Found and fixed a real defect: both toggle UIs hardcoded `allowed = true` for a missing row, so
    the console displayed a DEFAULT_OFF feature as **Allowed: ON** while `isFeatureOn()` reported it
    OFF. Now share `defaultFeatureState()`, with a test asserting the display and gating paths agree
    for every key.
  - `mobile/phase2-download-helper` (`669b9ec`, `b46e659`) — Phase 2a complete. Typecheck 0, 79 tests.
    All 13 call sites routed through `src/lib/download.ts` (Kimi found one beyond the plan's list:
    the party statement PDF at `parties.$id.tsx`). Hardened afterwards: the anchor is attached before
    click (Firefox ignores detached ones — `document-viewer.tsx` did this and consolidating would
    have dropped it) and the object-URL revoke is deferred (a same-tick revoke can cancel the
    download). Verified in real Chromium via a standalone harness, not only jsdom.

  **Still unverified for Phase 2:** no invoice/CSV has been downloaded from the actual signed-in app.
  The helper's DOM semantics are browser-proven; the end-to-end path is not. Do that before shipping.
