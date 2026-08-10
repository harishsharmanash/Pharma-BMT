# WORKLOG — Cerebyl / Pharma BMT

**Shared log between the two lead agents (Kimi K3 and Claude Opus).** Read the latest entries before planning; append after every major task. Newest at the top. Rules in `CLAUDE.md` §1a.

---

## 2026-08-10 — Claude Opus (lead), DeepSeek V4 Flash (worker)

**PUSHED and DEPLOYED — live chunk `index-B5x5ICP8.js`. Migration applied by Harish and
probe-verified.**

### OS dark mode was hijacking a light-only app — FIXED (`0d39c55`), live `index-BlasWS23.js`
- **The bug:** both the pre-paint script in `__root.tsx` and `ThemeProvider` derived the theme from
  `prefers-color-scheme`. Any user whose OS is set to dark got a **dark UI for a product with no dark
  palette designed** — and `ThemeProvider` then PERSISTED that auto-derived value, so it stuck.
  Proven live before the fix: fresh visit with OS dark → `savedTheme: "dark"`, body background
  `oklch(0.19 0.02 230)`, sign-in card rendered as a murky grey panel.
- **This was also the hydration mismatch.** SSR markup is never dark; the inline script added `dark`
  before hydration, so server and first client paint disagreed on every page.
- **Fix:** no `prefers-color-scheme` fallback anywhere. Light unless the user explicitly picks dark
  from the account menu (that still works and still persists). Storage key bumped to
  `crm-theme-v2` so values auto-written by the old behaviour are discarded instead of silently
  keeping people dark. Verified live both ways on a dark-emulated browser.
- **Worth asking Harish:** the account menu still exposes a dark toggle to a palette nobody designed.
  Removing it is a product decision, so it was left alone — but light-only is the stated direction.

### Three more render suites + tap-target spacing (same commit)
- `dashboard`, `products.all`, `team.directory` now have render coverage → **371 tests / 35 files.**
- **Three defects in the generated tests, all found by running them:** a `use-features` mock missing
  `isFeatureOn` (page threw before rendering anything); an assertion on a computed "today's" rupee
  total, which would fail by **calendar** rather than by regression; and a `team.directory`
  assertion written against the **rep** tab set while mocking an admin — that page renders two
  different tab sets by role (`if (!isManagerAdmin)`).
- **Selecting a tablist by index silently asserted nothing** — the section header renders its own
  tablist, so `getAllByRole("tablist")[0]` grabbed the wrong one. Now selected by content. Watch for
  this whenever a page nests Tabs.
- All three mutation-verified (blank `attrLine`, remove a tab, rename a KPI label → red).
- Spacing widened on the three dense pairs (claims approve/reject, attendance prev/next, stock tabs)
  from gap-1/gap-2 → gap-3 so they can later take `.hit-area-44` without overlapping. **Hit areas
  deliberately NOT added yet** — that wants a real-device check first.
- ⚠️ **Both aider agents silently did nothing on first launch**: the log redirect pointed at a
  scratchpad path from an earlier session id, so the shell failed (`EXIT=1`) before aider ran.
  `git status` was clean, which is the only reason it was caught. **Never assume a background
  worker ran — check the diff, not the exit notification.**

### Phone bottom tab bar — BUILT (`3fa12f7`), live chunk `index-ib4fU0Dr.js`
- The Stitch brief's bottom tab bar had never been built; mobile nav was a hamburger + slide-over.
  Now: Dashboard · Leads · Clients · Orders · **More**, `md:hidden`, fixed, `pb-safe`.
- **Built from the already-gated `visible` list, never NAV directly** — a rep who cannot open
  Clients just gets a shorter bar. The gap is deliberately NOT back-filled from other sections:
  back-filling would put a different destination in the same screen position per role.
- **More opens the EXISTING slide-over**, so there is still one nav definition feeding both and every
  section stays reachable (verified live: all 10 sections present in the sheet). The header hamburger
  was removed — two triggers for one menu is clutter.
- `main` needed `pb-28`: it is the scroll container (not the window), so without it the last card
  sits under the fixed bar and cannot be scrolled to. Verified live: `padding-bottom: 112px`.
- **Because the hamburger is gone this bar is the ONLY phone navigation**, so it ships with
  `src/test/app-shell-bottom-nav.test.tsx` (4 tests): renders, More opens the sheet, gated
  destinations vanish without back-filling, 56px target contract. **Mutation-verified** — dropping a
  tab and neutering More each turn it red. Suite now **368 tests / 32 files**.
- ⚠️ **Verifying a deploy in an already-open tab shows the CACHED bundle.** The first live check said
  "bar absent, hamburger still there" purely because of that. A cache-busting query param
  (`?cb=…`) settled it immediately. Do not conclude a deploy failed from a stale tab.

### Post-deploy visual pass + mobile audit (`d1b274e`)
- Reviewed all three detail routes live in a logged-in browser. Three fixes shipped:
  **(1)** the three detail pages rendered at three different widths (leads uncapped, parties
  `max-w-5xl`, orders `max-w-6xl`) — all now full-width per the documented standard. The caps came
  from `557eb26 "UI draft 3"`, NOT the design pass. **(2)** party info fields back to 3 columns on
  `lg` (10 mostly-blank cards in 2 columns was a full screen of scrolling before the tabs; now
  3-3-3-1, grid height 545px → 327px). **(3)** sign-in button 36px → 44px, verified at a real 375px
  viewport. `components/ui/button.tsx` deliberately untouched — resizing it ripples app-wide.
- **Mobile audit found nothing else broken.** No page-level horizontal overflow on any detail route;
  the 13-column invoice table scrolls inside its own `overflow-auto` wrapper (979px in a 578px
  container); the party tab strip scrolls rather than clipping.
- **Two traps worth recording for whoever audits mobile next:**
  1. **Chrome's window minimum is ~614 CSS px here**, so `resize_window` cannot reach a phone
     viewport, and raising element `zoom` does NOT help — Tailwind breakpoints are viewport media
     queries and ignore element zoom. For a true 375px test use the in-app Browser pane
     (`preview_start` + `resize_window` mobile preset) against `npm run dev`. That only reaches
     unauthenticated pages (`/auth`, `/legal/*`); authenticated pages were audited at 614px, which
     is below `md` so the mobile branch is genuinely active.
  2. **`/dev/leads` is a desktop-only mock** (hardcoded `ml-64` sidebar). It reports ~140 overflow
     offenders at 375px which are artifacts of the mock, not app bugs. Do not audit mobile with it.
- **A "slow fade-in" I reported earlier was MY OWN measurement artifact, not a bug.** Pages looked
  washed-out for seconds in screenshots because the Chrome tab was not being composited (the same
  reason `screencapture` returned only wallpaper). Measured properly, opacity reaches 1 in **207ms**.
  Lesson: before filing a perf bug from screenshots, confirm the tab is actually visible —
  `document.visibilityState` and a timed `getComputedStyle` sample cost one call and settle it.
- Known gap, NOT a regression: the phone **bottom tab bar** in the Stitch brief was never built —
  mobile nav is a hamburger + slide-over (`md:hidden`) in `app-shell.tsx`. Real design decision to
  make, not a bug to fix silently.

### First route-render coverage in the repo (`b4e7ea7`)
- `src/test/detail-routes.render.test.tsx` mounts the REAL components of all three detail routes
  with stubbed edges (router / Supabase client / auth / permissions / features). The trick that makes
  it possible: **mock `createFileRoute` to return the options object**, which reaches the component
  without exporting internals from production files. Reusable for any other route.
- Suite is now **364 tests / 31 files** (was 361/30).
- **Verified sensitive by mutation** — renaming a section header turns it red, then green on revert.
  Do this for any new test here: the repo already had a test file that silently never ran because it
  sat outside the vitest `include` glob, so it "passed" by not existing.
- Nice property worth keeping: the orders test asserts `INV-1001` appears **more than once**, because
  the second match is the off-screen printable node html2canvas paints for the JPG export. The count
  doubles as a guard on that node still rendering.

### Detail routes finally got their design pass (`4934c81`)
- `leads.$id` / `parties.$id` / `orders.$id` were the last un-restyled surfaces. Four aider tickets
  (G1 leads cleanup, G2 parties, G3 orders, G4 leads detail), run as two parallel pairs on disjoint
  file sets. Tickets at `Files/scratchpad/ticket-2026-08-10-G{1..4}-*.md`, built from a shared
  `_preamble.md` so DeepSeek's disk cache hits across runs — that pattern works, keep it.
- Also in `4934c81`: `LogCallDialog` was defined **twice, byte-identical**, in `leads.all.tsx` and
  `leads.$id.tsx` → extracted to `src/components/log-call-dialog.tsx`. And the lead header's bare
  Delete moved into the canonical `MoreVertical` + `ConfirmDelete` dropdown (last such site).
- **Three worker slips caught in diff review — the pattern from 7 Aug repeats: DeepSeek invents and
  flattens under design pressure.** (1) `parties.$id` dropped `tagBadgeClass`, flattening the
  colour-categorised party tags (VIP violet / risk amber / cash emerald / blacklist red) to one grey
  tone — a shipped client feature, silently lost. (2) `orders.$id` invented a Due/Paid pill next to
  `StatusBadge`, which already renders payment status off the same field, and it would have read
  "Paid" on a zero-total order. (3) Verified by hand that the invoice printable node
  (`position:fixed; left:-10000px` — NOT `display:none`, html2canvas can't capture that) and the
  hoisted column definitions were untouched. **Never accept a design diff without checking what got
  simplified away.**
- Gates: `tsc` 0, 361/361 vitest, `ship.sh --dry-run` green incl. the artifact assertion.
  **Runtime-verified via the new render tests (see above), NOT visually verified** — nobody has
  looked at these pages. The render tests prove they mount and keep their sections; they say nothing
  about whether the design is right. Harish should eyeball them after the next deploy.

### Notification duplicate fixed — and CLAUDE.md's recommendation was BACKWARDS (`05238d9`)
- One overdue follow-up buzzed the rep twice: `generate_due_notifications` section 4 (`followup_due`)
  and `generate_lead_followup_notifications_for_user` (`lead_followup`) both emitted it.
- §8g said to drop section 4. **Wrong.** Section 4 honours `fu*_status` and checks each of the five
  slots; `lead_followup` ignored status entirely (nagging about completed follow-ups) and took
  `GREATEST()` of the five dates while naming it `next_fu` — GREATEST is the *latest*, so a lead with
  an overdue fu1 and a future fu5 **silently never notified at all**. Dropped `lead_followup`.
  Migration `20260816120000` also revokes the PUBLIC/anon EXECUTE that `generate_due_notifications()`
  inherited (the 08-05 migration revoked its two siblings but missed it).
- ✅ **Migration APPLIED by Harish 10 Aug and probe-verified**: an anon PostgREST RPC to
  `generate_due_notifications` now returns `401 / 42501 permission denied` where it previously
  returned 200. That probe is the cheap way to confirm a grant change actually landed — use it
  rather than trusting "the SQL ran".

### Audit found THREE doc claims that were stale (`61a95ca`) — the recurring failure mode
- **Pack-size attributes**: listed as "specced, not started"; actually fully shipped and live —
  columns applied, `use-products.ts:15-17`, form fields + filter in `products.all.tsx`, portal
  facets in `portal.ts`. Two weeks of a live feature listed as unbuilt.
- **Touch targets**: listed as "deliberately not fixed"; `.hit-area-44` shipped in `468f710`.
  Recorded the adjacency rule (class on ONE of two adjacent icon buttons only) and the real residual
  (three dense pairs need a row-*spacing* pass first).
- **Parties detail** was already partly stitch-styled, contradicting "detail routes have had no pass
  at all".
- All three corrected in `CLAUDE.md` with `file:line` evidence. **Grep the code before believing any
  list in this repo, including one you wrote.**

### Environment note that will bite the next lead
`DEEPSEEK_API_KEY` lives in `~/.zshrc`, which a **non-interactive shell does not source** — aider
fails with no key unless every invocation starts `source ~/.zshrc >/dev/null 2>&1 &&`. Also
pre-existing and unrelated to this session: `npm run dev` logs a hydration mismatch from
`__root.tsx` — the server emits `class="dark"` / `color-scheme: dark` on a **light-only** app. Worth
a look; it is not caused by any change here.

---

## 2026-08-07 (later) — Claude Opus (lead)

### Cloudflare Workers Builds CI race — RESOLVED ✓ (repo disconnected by Harish)
- The recurring hazard logged below (CI auto-deploying an env-less build ~60s after every push, overwriting the verified `ship.sh` deploy) is fixed. Harish disconnected the GitHub repo from Workers → leadenthrella → Settings → Build (the "Disconnect" action next to `harishsharmanash/leadenthrella`), per the pending action Kimi flagged twice.
- **Root cause, for the record:** `.env` is correctly gitignored and never committed. `scripts/ship.sh` builds locally where `.env` exists, so `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` get baked into the bundle correctly. Cloudflare's own Workers Builds CI checked out the repo fresh with no `.env` and no dashboard-side "Variables and secrets" configured for those two values, so its build shipped with them missing entirely — same failure class as the 30 Jul "MISSING-ENV TRAP" outage.
- **Net effect:** `scripts/ship.sh` (local build → `npx wrangler deploy --name leadenthrella`) is now the *only* deploy path, full stop. No more post-push wait-and-verify step needed. If Workers Builds is ever reconnected in the future, the two `VITE_` vars must be added under Settings → Build → Variables and secrets first, or this will recur.

---

## 2026-08-07 (evening) — Kimi K3 (lead)

### Subsection bars: Clients lens bar + Settings/Bin restyle + Trash→Bin rename — SHIPPED ✓ (commit `204c721`, live chunk `index-CMY5JXFc.js`)
- **Correction to the entry below:** its "Already-live state" section claimed the Clients lens bar / Settings bar-primary / Bin rename were already live since `dd503e8`. They were NOT — the tree had Radix pill tabs (`bg-muted` in settings, `glass-panel` in trash), "Trash" everywhere, and `clients.parties.tsx` imported `ClientsSectionHeader` but never rendered it. Whatever produced that claim never reached the repo. Rebuilt from scratch this session.
- Changes: (1) `clients.parties.tsx` renders `<ClientsSectionHeader lens="parties">` — lens bar now on all 3 clients pages. (2) Settings + Bin tab strips converted from Radix `TabsList` pills to the `bar-primary` segmented tablist with framer-motion sliding thumb (`layoutId` + `useMotionFlow` SLIDE), matching section headers; Radix `Tabs` kept controlled for content panels only. Settings tabs defined in a `SETTINGS_TABS` array. (3) Trash renamed to **Bin**: title, h1, sidebar label (`app-shell.tsx`), "Empty bin" copy, permissions label (`permissions.ts` — key `trash.purge` unchanged). Route stays `/trash`.
- **lightningcss trap (new):** dev server failed with "@import rules must precede all rules" — `@import "tailwindcss"` inlines rules, so the Google Fonts `@import url(...)` after it is invalid; putting it first makes lightningcss resolve the URL as a file (ENOENT). Fix: no font `@import` in CSS at all — Inter now loads via `<link rel="stylesheet">` + preconnects in `src/routes/__root.tsx` head. Note: prod builds tolerated this; only `vite dev` (lightningcss path) choked.
- Gates: `tsc` 0 errors, 361/361 vitest, `ship.sh` full pass, live chunk verified, login page renders.
- **CI race happened AGAIN:** ~60s after `git push` (dd503e8..204c721), Cloudflare Workers Builds auto-deployed its env-less build (`index-oweBA08T.js`) over ours. Redeployed verified bundle via `ship.sh --skip-build`. The disconnect action below is STILL PENDING for Harish — until done, every push needs this wait-and-redeploy step.

---

### Stitch v2 full-app page restructure — SHIPPED ✓ (commit `dd503e8`)
- Harish supplied `stitch_pharma_lead_manager 2` (16 Stitch screen designs, now archived at `Files/design/stitch-v2/`). Full structural analysis written to `Files/design/stitch-v2/ANALYSIS.md` (per-screen structure + common patterns; the folder has two DESIGN.md dialects — screens follow **luminous_3d_precise**, that's the standard).
- Split into 6 DeepSeek tickets (`Files/scratchpad/ticket-2026-08-07-D1..D6-*.md`), run in 3 parallel pairs via aider. Restructured: dashboard (12-col bento), leads (table anatomy, grid cards, peek-drawer header w/ circular call/WhatsApp actions), orders list + dues (KPI strips, titled table cards), intimations (3-col card grid), portal requests (rich inline cards), transporters (wide cards + sticky right detail panel), clients parties/territories (full-width map+sidebar split), products/team/analytics/settings.
- Structure-only: no nav/menu bars touched, no token/color changes, no data/logic changes. Verified per diff.
- **DeepSeek slips I fixed manually** (watch for this pattern — it invents things under design pressure): undefined `StatCell` component (dashboard), invented `useStaff` hook (team.directory — real hook is `useProfiles` from `@/lib/use-leads`), fabricated "98% on-time rate" stat (transporters panel — replaced with real Status), dropped per-row Edit on transporters (restored via `onEdit` prop on the detail panel).

### ⚠️ Cloudflare Workers Builds CI hazard — RESOLVED, see 2026-08-07 (later) entry above
- ~~ACTION PENDING for Harish~~ — done. The GitHub repo was connected to **Cloudflare Workers Builds**: after our push, CI auto-deployed its own build 22s after our manual deploy, overwriting it — and the CI build has **no Supabase env baked in** (would throw "Missing Supabase environment variable" for all users). We re-deployed our verified build on top each time this happened.
- Harish disconnected the repo (Workers → leadenthrella → Settings → Build → Disconnect). Deploys now only come from `scripts/ship.sh` — no more post-push race to watch for.

### Ticket C earlier same day — SHIPPED ✓ (commit `44c9006`)
- Fixed section-header geometry drift (all 6 `*-section-header.tsx` + skeletons): root cause was `flex-wrap` — now `flex-nowrap`, title `min-w-0`, description `truncate`, lens bar `shrink-0`. Bar no longer shifts between tabs of a section.
- `/products` → `/products/all` and `/team` → `/team/directory` redirects (hubs retired, `?action=export_*` forwarding preserved).
- Toolbar pill-ification completed across clients/analytics/dues pages.

### Already-live state Harish may think is missing (stale bundle on his end)
- ~~Clients lens bar / Settings bar-primary / Bin rename live since `dd503e8`~~ — **WRONG, see the evening entry above.** These were not in the tree; they were actually built and shipped in `204c721`.

### Conventions locked this session
- Page structure standard: full-width (no `max-w-*` page caps), `space-y-5` rhythm, page padding from app shell (`md:p-8`); KPI strips = glass cards w/ icon chip + uppercase label + big value; table cards w/ "Showing X–Y of Z" footers; never invent data hooks for design elements that have no backing data.
- Aider ticket pattern that worked: stable preamble + per-ticket delta, `--read` the ANALYSIS.md + design HTMLs, 2 parallel aider instances on disjoint file sets is safe, 3-reflection-limit risk on big tickets — keep tickets to ≤4 target files.
