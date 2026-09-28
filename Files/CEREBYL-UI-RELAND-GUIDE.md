# Re-land guide — completing the Cerebyl mobile rebuild properly

**Version 1.0 — 24 Aug 2026 · Author: Claude Opus (lead) · Status: active instruction**

**Read `CEREBYL-UI-UX-REBUILD-2026.md` first — it is still the design authority and none of it has
changed.** This document does not redesign anything. It covers *how the work gets landed this
time*, the defects found in the first attempt, and exactly what is still unbuilt.

---

## 1. What happened, factually

The first attempt (`4828e01`, "complete Cerebyl mobile UI/UX rebuild across phases P0–P8") was
**139 files, +8,897 / −3,575, in one commit**. It was deployed, then reverted (`cfb299e`) at the
owner's request, and the revert was deployed. Live is currently on the pre-rebuild UI.

**The work itself was good.** Independently verified, not taken on trust:

- `npx tsc --noEmit` → **0 errors**. `npx vitest run` → **654 tests / 66 files, all passing**.
- New tests are real: mutation-testing the two-chip rule (`slice(0,2)` → `slice(0,3)`) turned the
  suite red, as it should.
- **Zero feature loss.** No `handle*`/`on*` handler and no hook disappeared from any rewritten
  file. Exactly two `aria-label`s vanished app-wide and both controls still exist as
  visibly-labelled items.
- **Auth untouched.** No change to `NAV`, `gateOk`, `roles`, `perm`, `feature`, `anyOf` or
  `Protected`. `auth.tsx` changed className lines only.
- P0 landed properly: files carrying hardcoded hex went **97 → 18**, and all 18 remaining are
  `console.*` / `portal.*`, which are out of scope by design.

**So the rollback was not a verdict on the code.** It was the predictable consequence of shipping
everything at once: with 139 files in a single commit, any one problem forces an all-or-nothing
revert. That is the process failure this guide exists to prevent.

### The collateral damage — already repaired, but understand it

The rebuild was committed **on top of a dirty working tree**, absorbing the uncommitted 24 Aug
security remediation. The revert therefore rolled that back too, and it was deployed. Production
silently lost the follow-up correctness fix (`nextFuDate()` went back to returning the *latest*
date and ignoring `fu*_status`, so an overdue fu1 behind a future fu5 never surfaced), the atomic
`replace_order_items` call, the `fetchAllRows` paging on two hooks, and eight migration files that
document policies live in the production database.

Restored in commit `91b544b` (tsc 0, 644/644 tests, mutation-checked). **Nothing further is needed
on this — it is listed so the cause is understood: never commit on a tree you did not clean first.**

---

## 2. The five process rules for this attempt

These are not suggestions. Four of the five map directly to something that went wrong.

### Rule 1 — One slice per commit. Never more than ~15 files.

The re-land order is in §4. Each slice is independently revertible and independently deployable.
If Leads looks wrong, Leads reverts — the token system does not.

### Rule 2 — Start every slice from a clean tree.

```bash
git status --short   # must print nothing before you begin
```
If it is not empty, stop and resolve it. `git add -A` on a shared checkout is how a design commit
swallowed a security audit.

### Rule 3 — The owner reviews on screen before the next slice starts.

After each slice: deploy (or run `/dev/mobile`), the owner looks at it on his phone, and says go.
The first attempt built P0 through P8 without a single human looking at P1. Eight phases of
compounding assumptions is exactly why "not even close to being as clean as the reference"
happened once already.

### Rule 4 — Verify on a device, not in a test runner.

`tsc` and vitest both passed on the reverted commit, and the Android back button still would not
close a sheet. Green gates prove the code compiles and the pure functions work. They prove nothing
about a phone.

### Rule 5 — Report gaps as gaps.

The first attempt's worklog claimed "all rebuild phases P0 through P8 completely implemented".
Measured: `AppSheet` had reached 29 of ~50 in-scope files, `EntityRow` 4 routes, `ActionBar` zero
detail screens, and `SearchScreen`, `projectMomentum`, `rubberband`, `LIST` and `SWIPE` had **no
consumers at all**. Partial work is fine and expected. Reporting partial work as complete is not,
because it removes the owner's ability to plan. **If a phase is 60% done, the worklog says 60% and
lists what is missing.**

---

## 3. Defects to fix in the re-land

Found by review of `4828e01`. Fix each in the slice that owns it.

### 3.1 Android hardware back does not close `AppSheet` — **correctness, not polish**

vaul dismisses on `Escape`; the Capacitor WebView's back button does not dispatch `Escape`. It
reaches the router, so back navigates the page out from under an open sheet. The spec called this
a correctness gate (`CEREBYL-UI-UX-REBUILD-2026.md` §6.1, §10.3) and it was never wired.

Fix: in `AppSheet`, when open on a native shell, register a back handler through
`src/lib/capacitor.ts` (**never import an `@capacitor/*` package from `src/` — root `CLAUDE.md`
§8e**) that closes the topmost sheet and swallows the event. Nested sheets must pop one level, not
all. Verify on a real phone: open a sheet, press back, the sheet closes and the route does not
change.

### 3.2 `useMediaQuery` returns `false` during SSR

`src/lib/use-media-query.ts` initialises from `window`, which does not exist on the server, so
TanStack Start renders the mobile drawer tree first and swaps after hydration. Harmless while
sheets mount closed; visible on any deep-linked open sheet (`?new=1` on `/orders`, which Ceremate
uses). Fix: default to the desktop branch on the server, or gate the swap behind a mounted flag so
the first client paint matches the server.

### 3.3 `check-tokens.sh` does not do what its own header claims

The header advertises a small-text-literal check; only three checks exist. As a direct result,
`text-[11px]` swipe labels shipped inside `entity-row.tsx`, below the 13px floor the guard was
written to enforce. Add check #4: fail on `text-[` with a value under 13px outside a
`--t-label` context, in `src/routes` and `src/components`, excluding console/portal.

### 3.4 `AppSheet` renders no `Drawer.Title` when `hideHeader` is set

vaul/Radix require a title for screen readers and will warn. Render a visually-hidden title from
the `title` prop whenever the visible header is suppressed.

### 3.5 The guard is not in CI

`scripts/ship.sh` calls `check-tokens.sh`, but `.github/workflows/verify.yml` runs only `tsc` and
tests. A guard that runs at deploy time catches the problem after the work is done. Add it to CI.

### 3.6 Motion helpers with no consumers

`projectMomentum()`, `rubberband()`, and the `LIST`/`SWIPE` presets are exported and used nowhere;
`EntityRow` uses framer-motion's `dragElastic` instead. Either wire them (the sheet detents and
swipe rows are where they belong) or delete them. **Exported-but-unused code reads as a finished
feature to the next person.** `SearchScreen` is in the same position — built, referenced only by
the gallery, never wired into the shell.

### 3.7 `PAGE` diverges from the spec

Implemented as `x: ±20px` opacity slide. The spec asks for slide-in from the right with the
outgoing view parallaxing −8%, mirrored exactly on back (symmetric paths — `apple-design` §7).
Low priority, but it is the transition the user sees on every navigation.

---

## 4. The re-land order

Each slice: clean tree → build → gates → owner review → commit → next. **Do not start a slice
before the previous one is signed off.**

Everything is recoverable from the reverted commit — take the file, do not rewrite it:

```bash
git checkout 4828e01 -- <path>     # recover a file exactly as it was built
git show 4828e01 -- <path>         # read it first
```

### Slice 1 — P0 foundation *(re-land as built, plus §3.3 and §3.5)*

Files: `src/styles.css`, `scripts/check-tokens.sh`, `scripts/ship.sh`, `.github/workflows/verify.yml`,
plus the token sweep across `src/routes/**` and `src/components/**`.

`src/lib/motion-flow.ts` and `src/lib/use-media-query.ts` come with this slice (fix §3.2 first).

**Acceptance:** `grep -rE '#[0-9a-fA-F]{6}' src/routes src/components --include='*.tsx' | grep -vE 'console\.|portal\.'` → zero · `check-tokens.sh` passes and is wired into both `ship.sh` and CI ·
**screenshots of `/leads`, `/orders`, `/dashboard` before and after are indistinguishable**, except
desktop density where `zoom: 0.8` was removed.

> This slice is ~90 files but it is a pure mechanical substitution with a machine-checkable
> acceptance test, which is why it is the one exception to the 15-file rule.

### Slice 2 — Primitives + `/dev/mobile` gallery

`src/components/mobile/*` and `src/routes/dev.mobile.tsx`, recovered as built, **with §3.1 and
§3.4 fixed**. Nothing else changes — no screen adopts them yet.

**Acceptance:** every primitive renders in the gallery in every documented state · **Android back
closes a sheet on a real phone** · 44px targets · reduced-motion path verified · `text-[11px]`
gone from `entity-row.tsx`.

### Slice 3 — Shell & navigation

`app-shell.tsx`: bottom tab bar to spec, collapsing mobile header, "More" as an `AppSheet`, blur
budget (blobs → static gradient below `md`, `.glass` opaque below `md`), `PAGE` transitions (§3.7).

**Acceptance:** at most two `backdrop-filter` layers composited on a phone · tab bar never hides on
scroll · **`NAV`, `gateOk` and `Protected` byte-identical to before** · scroll fps measured before
and after under 6× CPU throttle.

### Slices 4–9 — one section each, in this order

Leads → Clients → Orders → Products → Team → Dashboard/Analytics.

Each section slice carries **its own list screen, its own detail screen, and its own dialog
conversions together**. That is the change from last time: dialogs were done as a separate global
phase, which is why 21 in-scope files were left behind when the section work moved on.

Per slice: mobile list via `EntityRow` (desktop table behind `hidden md:block`), `StatStrip` +
`FilterSheet` + `ActionBar`, detail screen to §7.2, every `Dialog` in that section → `AppSheet`,
`ListSkeleton` matching row height, section-specific `EmptyState`.

**Acceptance per slice:** zero horizontal content scroll at 375px · no text below 13px · every
field present before is still reachable · swipe actions cancellable mid-swipe · sort/filter round-
trip through the URL · **desktop unchanged or better** · owner sign-off on a phone.

### Slice 10 — Motion polish and the leftovers

Wire or delete §3.6 · pull-to-refresh on lists · interruptible transitions · `SearchScreen` into
the shell · `prefers-reduced-motion` across the remaining files (43 of 76 done).

---

## 5. What is actually still unbuilt

Measured against `4828e01`, so this is the real remaining scope — not an estimate.

### 5.1 Files still on centred `Dialog` (21 in scope)

```
src/components/product-image-lightbox.tsx      src/routes/orders.intimations.tsx
src/components/whatsapp/whatsapp-attach-menu.tsx        src/routes/orders.requests.tsx
src/components/whatsapp/whatsapp-broadcasts.tsx         src/routes/orders.transporters.tsx
src/components/whatsapp/whatsapp-template-generator.tsx src/routes/parties.$id.tsx
src/routes/ceremate.tsx                        src/routes/products.aids.tsx
src/routes/clients.parties.tsx                 src/routes/products.all.tsx
src/routes/leads.all.tsx                       src/routes/products.offers.tsx
src/routes/leads.duplicates.tsx                src/routes/settings.index.tsx
src/routes/orders.$id.tsx                      src/routes/team.accounts.tsx
src/routes/orders.all.tsx                      src/routes/transporters.$id.tsx
src/routes/whatsapp.tsx
```
Excluded correctly: `console-shell.tsx`, everything under `console.*` / `portal.*`, and
`app-sheet.tsx` itself (it *is* the desktop dialog branch). `ConfirmDelete` stays an alert dialog.

### 5.2 Routes still scrolling a table sideways on a phone (15)

Not gated behind `hidden md:*`:

```
analytics.products.tsx      leads.$id.tsx          products.offers.tsx    trash.tsx
analytics.response-time.tsx leads.duplicates.tsx   products.stock.tsx     whatsapp.tsx
clients.portal-access.tsx   leads.followups.tsx    settings.index.tsx
dev.unicons.tsx             orders.dues.tsx        team.directory.tsx
legal.dpa.tsx
```
`orders.dues`, `leads.followups`, `products.stock` and `team.directory` are daily-use screens —
prioritise those. `legal.dpa` and `dev.unicons` are low value; `dev.unicons` can be skipped.

### 5.3 `EntityRow` adoption

Done: `leads.all`, `orders.all`, `products.all`, `clients.parties`.
Missing: `products.stock`, `team.directory`, `leads.followups`, `leads.duplicates`,
`orders.dues`, `orders.requests`, `orders.intimations`, `orders.transporters`,
`clients.portal-access`.

### 5.4 `ActionBar` on detail screens — zero of four

`leads.$id`, `parties.$id`, `orders.$id`, `transporters.$id` all received `StatStrip` and
`SectionCard` but no thumb-zone action bar. §7.2's "≤3 actions, thumb-reachable" is the point of
the archetype; without it the detail screens are a nicer-looking version of the same reach problem.

### 5.5 Reduced motion

43 of 76 framer-motion files. Automatic if every file routes through `motion-flow.ts`.

---

## 6. Verification, per slice

In this order. Steps 1–4 are the machine gates; **step 5 is the one that has caught every real
problem on this project.**

1. `npx tsc --noEmit` → **0**. The baseline is zero; any error is a regression.
2. `npm run test` → green. **Mutation-test every new test**: break the behaviour, watch it go red,
   restore. A test that cannot fail is worse than no test.
3. `npm run test:isolation` → green if the slice touched any data hook.
4. `./scripts/ship.sh --dry-run` → env gate, token guard, artifact assertion, build.
5. **Load the actual page.** `preview_start` on the dev server, or the live URL after deploy, then
   read the console and network logs. A green build proves nothing — this repo has shipped a
   typecheck-clean, test-green bundle with no backend at all.
6. **Real Android phone, every slice:** hardware back on every new sheet · one-handed reach ·
   scroll smoothness · legibility in daylight.
7. **Screenshot pairs** at 375×812 and desktop, before and after, for `/leads`, `/orders`,
   `/dashboard`, `/parties/$id`.

**Two verification traps, both of which have burned days here:**

- **Never compare local `.output` filenames to the live site** to decide whether a deploy landed.
  The hashes routinely differ on a correct deploy. Use the browser.
- **Never conclude a deploy is broken from a `curl` 404 on a chunk.** Small route stubs misreport;
  the browser fetches the same URL with 200.

---

## 7. Deploy protocol

- `./scripts/ship.sh` is the **only** deploy path. Do not reconnect Cloudflare Workers Builds — it
  raced `ship.sh` and silently overwrote good deploys twice.
- Never deploy from a git worktree: worktrees do not receive gitignored files, so `.env` is absent
  and the build inlines no Supabase config. The app builds fine and is completely dead.
- The push gate is root `CLAUDE.md` §2b. Anything touching migrations, RLS, auth, secrets or the
  typecheck baseline is **always ask, never auto-push.**
- After each slice: append to `Files/WORKLOG.md` — what shipped, commit hash, deploy verdict, what
  was verified **and what was not**, and anything the next session must know.

---

## 8. Definition of done, per slice

- [ ] Clean tree at start; the commit contains only this slice
- [ ] `tsc` 0 · tests green · isolation green (if data hooks touched) · `ship.sh --dry-run` green
- [ ] Token guard passes; no new hex, no `font-weight: 300`, no text under 13px
- [ ] Zero horizontal content scroll at 375px on every route in the slice
- [ ] Every field, action and affordance present before is still reachable
- [ ] Android hardware back verified on a real phone for every sheet in the slice
- [ ] Screenshot pair reviewed against `Files/design/leads-reference/` and signed off by the owner
- [ ] `Files/WORKLOG.md` entry stating what is done **and what is not**

---

*Design authority stays `Files/CEREBYL-UI-UX-REBUILD-2026.md`. This guide governs sequencing,
verification and the defect list. Update both as slices land.*
