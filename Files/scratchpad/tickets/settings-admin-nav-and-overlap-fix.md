# Ticket: Fix Administration page overlap + missing nav entry (two pre-existing bugs)

Found while testing the WhatsApp client-portal move — NOT related to WhatsApp, both are
pre-existing bugs in the Settings area.

## Bug 1 — Credit tiers / Catalogue asset generator bleed onto every /settings/* sub-route

`src/routes/settings.tsx` is the LAYOUT route for the whole `/settings/*` subtree. Its
`SettingsLayout` component renders:
```tsx
<div className="stitch h-full">
  <Outlet />
  <CreditTierSettings />
  <CatalogueSettingsAdmin />
</div>
```
`<CreditTierSettings />` and `<CatalogueSettingsAdmin />` are meant to be part of the main
Company Settings page (`/settings`, i.e. `settings.index.tsx`) ONLY. Because they're rendered
in the shared layout instead, they render after the `<Outlet />` on EVERY settings sub-route —
including `/settings/admin` (Administration) — where they visually overlap the sub-route's own
content (confirmed live: "Catalogue asset generator" and "Credit tiers" overlap "WhatsApp
integration" / "AI assistant usage" text on `/settings/admin`).

**Fix:**
- In `src/routes/settings.tsx`: remove `<CreditTierSettings />` and `<CatalogueSettingsAdmin />`
  from `SettingsLayout`'s JSX, leaving just `<Outlet />` inside the `stitch h-full` div.
- `CatalogueSettingsAdmin` is currently a local (non-exported) function in `settings.tsx` — add
  `export` to its function declaration so it can be imported elsewhere. Leave its implementation
  untouched.
- In `src/routes/settings.index.tsx`: import `CatalogueSettingsAdmin` from `@/routes/settings`
  and `CreditTierSettings` from `@/components/credit-tier-settings` (check the existing import in
  `settings.tsx` for the exact path/default-vs-named export style, copy it verbatim). Render both
  inside `SettingsPage`'s returned `<motion.div className="stitch space-y-5" ...>`, as the LAST
  two children, each wrapped the same way every other section on this page is wrapped (look at
  how `LegalCard` or the branding section above it is wrapped — likely
  `<motion.div variants={fadeUp} transition={transition()}><LegalCard /></motion.div>`; match that
  exact wrapping for consistency, do not invent a new pattern).

## Bug 2 — Administration (/settings/admin) has NO navigation entry anywhere in the app

Confirmed by grep: no `<Link to="/settings/admin">` exists anywhere in `src/`. The only way to
reach Administration (backups, mobile app, AI usage, and the WhatsApp integration card that was
just added there) is typing the URL directly. It must be reachable from the main Settings page.

**Fix:** in `src/routes/settings.index.tsx`, add a new small card near the top of `SettingsPage`
(right after the header block that has the `SettingsIcon` and "Company Settings" title, before
the Branding section) that links to `/settings/admin`. Follow the exact pattern used by
`LegalCard` later in the same file (`Card` > `CardHeader` with `CardTitle`/`CardDescription` >
`CardContent` with `IosList` > `IosListRow asChild` wrapping a `Link`) — but this is a single
destination, not a list of four, so it should be ONE `IosListRow` inside ONE `IosList`, not a
loop. Title: "Administration". Description: "Backups, the branded mobile app, and usage & audit
surfaces." (this exact copy already exists as the page header text in
`settings.admin.index.tsx` — reuse it verbatim so the two don't drift). Label of the single row:
"Administration". Wrap the whole new card in the same `motion.div variants={fadeUp}
transition={transition()}` pattern as its siblings on this page.

## Files

**Edit:**
- `src/routes/settings.tsx`
- `src/routes/settings.index.tsx`

**Read only:**
- `src/routes/settings.admin.index.tsx` (for the exact "Backups, the branded mobile app, and
  usage & audit surfaces. Admin only." header copy — reuse the non-"Admin only" portion of it
  as instructed above)
- `src/components/ios.tsx` (for `IosList`/`IosListRow` — already imported in
  `settings.index.tsx`, no new import needed)

## Constraints

- Do not touch `settings.admin.index.tsx` (the WhatsApp card that was just added there is
  unrelated to this ticket and must not be modified).
- Do not change what `CreditTierSettings` or `CatalogueSettingsAdmin` actually render internally
  — this ticket only moves WHERE they're mounted, not their contents.
- No `Enthrella`/`Acrowell` strings in any new UI text.
- Do not commit. Leave changes staged for review.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- `git status` — only the two files listed under "Edit" should be modified.
