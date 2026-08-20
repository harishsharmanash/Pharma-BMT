# Ticket: Reorganize Settings tabs — merge Administration in, consolidate related tabs

## Goal

Right now Settings has two separate surfaces: the main `/settings` page (tabs: Branding, PDF /
Contact, Divisions, Categories, Dosage forms, Packing types, Features, Legal, Lead SLA) and a
SEPARATE `/settings/admin` page (Administration — Activity Log link, AI Usage link, Automated
backup, Manual backup, WhatsApp integration, AI assistant usage summary), reached via a nav card
that was added on `/settings` in an earlier ticket this session. The owner wants Administration to
be a TAB alongside Branding/Categories, not a separate page — and wants three related tabs merged
down to reduce clutter. This ticket does both.

## Files

**Edit:**
- `src/routes/settings.index.tsx` — the main target. Add an "Administration" tab, merge "PDF /
  Contact" and "Divisions" into "Branding", merge "Categories" + "Dosage forms" + "Packing types"
  into one new tab, move `<CatalogueSettingsAdmin />` to render inside the Branding tab instead of
  below all tabs.
- `src/routes/settings.admin.index.tsx` — gut this down to a redirect (its content moves into
  `settings.index.tsx`).

**Read only:**
- `src/routes/settings.admin.activity.tsx`, `src/routes/settings.admin.ai-usage.tsx` — these stay
  exactly as they are, as their own routes. Do NOT touch them. The new Administration tab links OUT
  to `/settings/admin/activity` and `/settings/admin/ai-usage` the same way the current
  `settings.admin.index.tsx` page does (via `IosListRow` + `Link`) — it does not inline their
  content.
- `src/components/ios.tsx` (for `IosList`/`IosListRow`, already imported in `settings.index.tsx`)

## Approach

### 1. `settings.admin.index.tsx` → thin redirect

Replace the whole file's content with a route that redirects `/settings/admin` to `/settings`
(old URL must keep working, matching this project's standing rule that no URL is ever removed
outright). Use the `<Navigate to="/settings" replace />` pattern — see
`src/routes/leads.intake.tsx` for the exact syntax used elsewhere in this codebase (`import {
Navigate } from "@tanstack/react-router"`, then `if (...) return <Navigate to="..." replace />;`
inside the route's component — here there's no condition, just redirect unconditionally). Keep the
`createFileRoute("/settings/admin/")` call and `errorComponent: RouteError`, just change what
`component` renders. Delete everything else in the file — the `AdministrationPage` function and
all its imports move (see step 2), they don't stay here too.

### 2. Move Administration's content into `settings.index.tsx` as a new tab

Add a new entry to `SETTINGS_TABS` (in `settings.index.tsx`), e.g.
`{ value: "administration", label: "Administration", icon: SettingsIcon }` — place it as the LAST
tab, after `"sla"`. Reuse the `Settings as SettingsIcon` icon already imported in this file (do not
import `ShieldCheck` or another icon just because the old page used one; keep icon imports
minimal).

Copy the ENTIRE JSX body of `AdministrationPage` (currently in `settings.admin.index.tsx`) into a
new function `AdministrationTab()` defined in `settings.index.tsx`, and render it via
`<TabsContent value="administration" className="mt-5"><AdministrationTab /></TabsContent>` added
after the existing `<TabsContent value="sla">` block.

While moving it, fix the visual size mismatch the owner flagged ("font sizes up and down, out of
line"): the old page had a big `<h1 className="t-head-md tracking-tight">Administration</h1>` page
title followed immediately by a tiny all-caps `<h2 className="... text-ios-footnote uppercase ...">
Usage & audit</h2>` micro-label right above two link rows — that jump from page-title-sized text to
footnote-sized text right next to each other is what reads as broken. Since this is now a TAB, not
a page, DELETE the `<h1>`/`<p>` page-header block entirely (the tab bar already shows "Administration"
as the active tab label — a page title repeating it is redundant) AND delete the tiny
`<h2>Usage & audit</h2>` micro-label. Keep the two `IosListRow` entries (Activity Log, AI Usage)
but wrap them directly in a `Card`/`CardHeader`/`CardTitle`/`CardContent` + `IosList`, matching
EXACTLY how `LegalCard` (later in this same file) wraps its `IosListRow` links — same
`CardTitle className="text-ios-title3"` / `CardDescription className="text-ios-subhead"` sizing,
so this section's typography matches every other card on the page instead of introducing its own
scale. Title this card "Usage & audit" (was previously a micro-label, now a proper `CardTitle`).
Everything else (Automated backup, Manual backup, WhatsApp integration, AI assistant usage cards)
already uses `text-ios-title3`/`text-ios-subhead`/`text-ios-footnote` consistently — carry those
cards over completely unchanged, just relocated.

All the hooks `AdministrationPage` used (`useAuth`, `useFeatureOn`, `useCompanySettings`,
`useCompanyAppStatus`, `useRequestAppBuild`, `computeBrandingHash`, `useBackupSettings`,
`useSaveBackupSettings`, `useRunBackupNow`, `connectGoogleDrive`, `downloadFullBackupXlsx`,
`useAssistantUsageSummary`, `useWhatsappStatus`, `useConnectWhatsappNumber`,
`launchWhatsappEmbeddedSignup`, `useProfiles`, friendlyError, toast, motion/useMotionSafe, Dialog
pieces, icons — Download, Smartphone, RefreshCw, ScrollText, Gauge, Bot etc.) need their imports
added to `settings.index.tsx` if not already present there (most are NOT, since this file didn't
previously need them) — copy the exact import lines from the current `settings.admin.index.tsx`
rather than reconstructing them from memory, to avoid subtly wrong paths.

If `AdministrationPage` had any OTHER helper functions defined in the same file (e.g. a
`MobileAppCard`-style sub-component, `WhatsAppSetupCard`, backup-related sub-components) — move
ALL of them into `settings.index.tsx` too; nothing should be left behind orphaned in the redirect
file.

### 3. Remove the "Administration" nav-card from `/settings`

An earlier ticket this session added a card near the top of `SettingsPage`'s JSX with a single
`IosListRow` linking to `/settings/admin`, titled "Administration". DELETE that whole card now —
it's superseded by the new tab; a page shouldn't both link to a page that no longer meaningfully
exists AND contain that content as a tab.

### 4. Merge "PDF / Contact" and "Divisions" into "Branding"

In `SETTINGS_TABS`, remove the `{ value: "pdf", ... }` and `{ value: "divisions", ... }` entries.
In the `<TabsContent value="branding">` block, after `<BrandingCard />`, add `<ContactPdfCard />`,
`<OrderEmailsCard />` (currently under the "pdf" tab) and
`<DropdownManager kind="division" title="Divisions" description="Business divisions used across
the product catalogue and reports." />` (currently under "divisions") as additional children —
stack them with the same spacing convention already visible between cards elsewhere on this page
(check whether cards need a wrapping `<div className="space-y-5">` or similar; match whatever
`space-y-*` gap this file already uses between top-level `motion.div` sections). Then delete the
old separate `<TabsContent value="pdf">` and `<TabsContent value="divisions">` blocks entirely —
they no longer exist as separate tabs.

Also move `<CatalogueSettingsAdmin />` (currently rendered in its own `motion.div` below the whole
`<Tabs>` block, near `<CreditTierSettings />`) to be the LAST child inside this same
`<TabsContent value="branding">` block, after the divisions manager. Remove the old standalone
`<motion.div><CatalogueSettingsAdmin /></motion.div>` block that currently sits after `</Tabs>`.
**Leave `<CreditTierSettings />` exactly where it is** (its own section below the tabs, unchanged) —
only `CatalogueSettingsAdmin` moves, per the owner's explicit instruction; Credit tiers was not
mentioned.

### 5. Merge "Categories" + "Dosage forms" + "Packing types" into one new tab

In `SETTINGS_TABS`, remove those three entries and add ONE new entry in their place (same
position), e.g. `{ value: "catalogue-setup", label: "Catalogue Setup", icon: Building2 }` (reuse
the `Building2` icon already used by all three of the tabs being merged — don't add a new icon
import for this).

Replace the three separate `<TabsContent value="categories">` / `="dosage-forms"` /
`="packing-types"` blocks with ONE `<TabsContent value="catalogue-setup" className="mt-5">`
containing all three `<DropdownManager kind="category" .../>`, `<DropdownManager
kind="dosage_form" .../>`, `<DropdownManager kind="packing_type" .../>` calls stacked in that
order, with the same prop values (`title`/`description`) they already have today — do not reword
them.

## Constraints

- Every changed/removed URL must still work: `/settings/admin` redirects to `/settings`;
  `/settings/admin/activity` and `/settings/admin/ai-usage` are UNCHANGED and still work exactly
  as they do today (this ticket does not touch either of those two files).
- Do not rename or restyle `BrandingCard`, `ContactPdfCard`, `OrderEmailsCard`, `DropdownManager`,
  `FeaturesCard`, `LegalCard`, `SLACard`, `CreditTierSettings`, or `CatalogueSettingsAdmin`
  internally — only where they're rendered/grouped changes in this ticket.
- No `Enthrella`/`Acrowell` strings in any new UI text.
- Do not commit. Leave changes staged for review.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- `git status` — only `src/routes/settings.index.tsx` and `src/routes/settings.admin.index.tsx`
  should be modified.
- In your report, list the final `SETTINGS_TABS` array's `value`s in order, and confirm
  `settings.admin.activity.tsx` / `settings.admin.ai-usage.tsx` were not touched (diff them
  yourself against git and confirm zero changes, don't just assume).
