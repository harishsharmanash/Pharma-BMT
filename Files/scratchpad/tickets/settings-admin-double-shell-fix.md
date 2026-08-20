# Ticket: Fix duplicated app shell on Activity Log and AI Usage pages

## Goal

`/settings/admin/activity` and `/settings/admin/ai-usage` both render the entire app shell
(header + nav bar) TWICE — visually, the whole page frame repeats, with the real content
nested inside a second copy of itself. Confirmed root cause, no further investigation needed.

## Root cause

The `/settings` layout route (`src/routes/settings.tsx`) already wraps its whole subtree in
`<Protected>` once: `component: () => <Protected><SettingsLayout /></Protected>`. `Protected`
(from `@/components/app-shell`) is what renders the header/nav chrome. Every route nested under
`/settings/*` inherits that single wrap via `<Outlet />` — it must NOT wrap itself again.

`src/routes/settings.admin.index.tsx` and `src/routes/settings.index.tsx` get this right: their
`component` is just the bare page component, no extra `<Protected>`.

`src/routes/settings.admin.activity.tsx` and `src/routes/settings.admin.ai-usage.tsx` get it
wrong — each one's `component` is `() => <Protected><PageComponent /></Protected>`, double-
wrapping and rendering the shell twice.

## Files

**Edit:**
- `src/routes/settings.admin.activity.tsx`
- `src/routes/settings.admin.ai-usage.tsx`

**Read only:**
- `src/routes/settings.admin.index.tsx` (the correct pattern to match — its `Route` export has
  no `Protected` wrapper at all)

## Approach

In both files:
1. Remove `import { Protected } from "@/components/app-shell";` (no longer used).
2. Change `component: () => <Protected><ActivityLog /></Protected>,` to
   `component: ActivityLog,` (same for `AiUsageBoard` in the ai-usage file) — pass the component
   reference directly, matching how `settings.admin.index.tsx` does
   `component: () => <AdministrationPage />` (either form is fine as long as `Protected` is
   gone; keep whichever is closer to the existing line to minimize the diff).

Do not touch anything else in either file — the page components themselves (`ActivityLog`,
`AiUsageBoard`) are correct and unrelated to this bug.

## Constraints

- Do not remove `Protected` from `settings.tsx` itself — that one is correct and necessary.
- Do not commit. Leave changes staged for review.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green.
- `git status` — only the two files listed under "Edit" should be modified.
