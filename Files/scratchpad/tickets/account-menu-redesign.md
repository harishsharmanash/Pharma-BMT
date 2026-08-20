# Ticket: Move Settings/Bin/Help into the account menu, restyle it

## Goal

The main top nav bar (desktop) and the mobile "More" sheet both currently list "Settings", "Bin"
and "Help" alongside the core business sections (Dashboard, Leads, Clients, Orders, Products,
Team, WhatsApp, Analytics). The owner wants these three moved OUT of that nav and INTO the
account dropdown menu (the avatar button, top-right, `AccountMenu` in
`src/components/account-menu.tsx`) instead — and wants that dropdown's visual style brought in
line with the rest of the app (it currently uses plain default dropdown rows; the rest of the app
uses filled pill buttons, press-scale feedback, and the `sh-md`/`sh-lg` shadow tokens defined in
`src/styles.css`).

## Files

**Edit:**
- `src/components/account-menu.tsx`
- `src/components/app-shell.tsx`

**Read only:**
- `src/styles.css` (for `.pill`, `.press-scale`, `.sh-md`, `.sh-lg` — the exact classes to reuse;
  do not invent new CSS, these already exist and are used everywhere else in the app)
- `src/components/ui/dropdown-menu.tsx` (the underlying Radix wrapper — confirm what props/slots
  it already exposes before adding anything custom)

## Approach

### 1. `app-shell.tsx` — remove Settings/Bin/Help from the shared nav array

Find the `NAV` array (it has entries like `{ to: "/settings", label: "Settings", icon: Settings,
roles: ["admin"] }`, `{ to: "/trash", label: "Bin", icon: Trash2 }`,
`{ to: "/help", label: "Help", icon: HelpCircle }` — these three are the LAST three entries).
Delete these three entries. This array (`NAV`, filtered into `visible`) drives BOTH the desktop
top pill-bar AND the mobile slide-over "More" sheet (`renderSidebar`) — removing them here removes
them from both places at once, which is what we want since they're moving into the account menu
that's already present on both breakpoints.

Remove the now-unused `Settings`, `Trash2`, `HelpCircle` icon imports from `lucide-react` at the
top of the file ONLY if nothing else in this file still uses them — check first (`Settings` in
particular might be used elsewhere in this large file; if so, keep the import and only remove the
NAV entries).

### 2. `account-menu.tsx` — add Settings/Bin/Help, restyle

Add three new `DropdownMenuItem`s linking to `/settings`, `/trash`, `/help` (use `onSelect={() =>
navigate({ to: "..." })}`, matching the existing `Assistant memory` item's pattern one line below
in this same file — same `navigate` hook already in scope). Icons: reuse `Settings`, `Trash2`,
`HelpCircle` from `lucide-react` (same icons the nav bar used before this ticket removed them).

**Settings must stay admin-only** — the removed nav entry had `roles: ["admin"]`; preserve that
restriction here. Check `useAuth()`'s `profile.role` (already destructured at the top of this
file) and only render the Settings item when `profile?.role === "admin"`. Bin and Help have no
role restriction (same as before), render unconditionally.

Placement: add these as a new group, with a `DropdownMenuSeparator` before and after, positioned
after the notifications group and before "Assistant memory" (or wherever reads most naturally —
use judgement, but keep "Sign out" last, it already is).

**Restyle to match the app's visual language.** This dropdown currently uses bare
`DropdownMenuItem`s with no special styling — every other clickable surface in this app (buttons,
top-nav pills, the settings tab bar) uses the `.pill` / `.press-scale` / `.sh-md` classes defined
in `styles.css`, plus small hover/tap transitions. Concretely:
- Give each `DropdownMenuItem` (the new ones AND the existing Theme/notification/Assistant
  memory/Sign out ones — for consistency, restyle all of them, not just the new three) the
  `press-scale` class so they scale down slightly on press like every other interactive element
  in the app.
- The trigger button (`<Button variant="ghost" size="icon" className="hit-area-44">` wrapping the
  avatar) can gain a subtle `sh-md` shadow on the avatar circle itself
  (`className="grid h-8 w-8 place-items-center rounded-full gradient-brand sh-md text-xs
  font-bold text-primary-foreground"`) so it doesn't look flat next to the pill-styled "Ask
  Ceremate" button beside it in the header.
- Do NOT change the underlying `DropdownMenu`/`DropdownMenuContent` component from Radix to
  something custom, and do NOT add a full pill/filled-background treatment to every row (that
  would make a long list of rows look like a stack of buttons, which is heavier than this menu
  needs) — the ask is for it to feel like it belongs in this app (subtle motion + shadow), not for
  a from-scratch redesign. If unsure how much is enough, less is safer: `press-scale` on rows,
  `sh-md` on the trigger avatar, is probably the whole change needed on top of adding the three
  new items.

## Constraints

- `/settings`, `/trash`, `/help` routes themselves are UNCHANGED by this ticket — only how users
  navigate to them changes.
- Settings menu item must remain admin-only, matching the nav entry it replaces.
- No `Enthrella`/`Acrowell` strings in any new UI text.
- Do not commit. Leave changes staged for review.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- `git status` — only `src/components/account-menu.tsx` and `src/components/app-shell.tsx` should
  be modified.
- In your report, confirm whether any other file in the app referenced the removed NAV entries
  directly (grep for `"/settings"` role-gate logic elsewhere, or any test asserting the OLD nav
  item count) — flag it if so, don't silently leave a stale reference.
