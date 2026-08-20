# Ticket: Fix stale test assertion after Settings/Bin/Help moved out of nav

## Goal

`src/test/app-shell-bottom-nav.test.tsx`'s test "More opens the slide-over sheet — the only route
to the other sections" fails now. It proved the sheet opened by checking that "Settings" text
appeared (Settings previously lived ONLY in the sheet, never in the bottom bar). Settings — along
with Bin and Help — was just moved out of the nav array entirely and into the account menu
dropdown (a separate, unrelated ticket this session), so "Settings" no longer appears in the nav
at all, in the sheet or otherwise. The test's proof signal is stale, not the app's behavior wrong.

## Files

**Edit:** `src/test/app-shell-bottom-nav.test.tsx`

**Read only:** `src/components/app-shell.tsx` (to confirm the current `NAV` array's remaining
entries — Dashboard, Leads, Clients, Orders, Products, Team, WhatsApp, Analytics — before picking
a replacement proof signal)

## Approach

In the failing test, replace the assertion:
```ts
// Settings lives only in the sheet, so its appearance proves the sheet opened.
expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
```
with an equivalent check using a label that is CURRENTLY in `NAV` but NOT one of the four bottom-
bar primaries (Dashboard/Leads/Clients/Orders) — e.g. "Products" (already used elsewhere in this
same test file as a known sheet-only item). Update the preceding comment to match ("Products lives
only in the sheet, so its appearance proves the sheet opened.").

Do not change any other test in this file — the "renders the four primary destinations plus More"
and "omits a destination..." and "keeps every tap target..." tests are unaffected and already pass.

## Constraints

- This must be a genuine fix that would fail if the sheet did NOT open (mutation-check it
  yourself before reporting done: temporarily verify in your head that if `mobileOpen` never
  became true, "Products" would not appear — it wouldn't, since Products is only rendered inside
  `renderSidebar`, which is gated by the sheet's open state).
- Do not commit.

## Acceptance

- `npm run test` → all 563 tests pass, including this one.
- `git status` — only `src/test/app-shell-bottom-nav.test.tsx` modified.
