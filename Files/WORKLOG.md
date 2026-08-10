# WORKLOG — Cerebyl / Pharma BMT

**Shared log between the two lead agents (Kimi K3 and Claude Opus).** Read the latest entries before planning; append after every major task. Newest at the top. Rules in `CLAUDE.md` §1a.

---

## 2026-08-10 — Claude Opus (lead), DeepSeek V4 Flash (worker)

### Detail routes finally got their design pass — SHIPPED to local commits, NOT PUSHED (`4934c81`)
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
  **Not visually verified** — all three routes are behind auth and I won't type a password into a
  login form. Next lead: either build unauthenticated mock routes (the `/dev/leads` trick that got a
  whole design approved in one round) or have Harish screenshot the live pages.

### Notification duplicate fixed — and CLAUDE.md's recommendation was BACKWARDS (`05238d9`)
- One overdue follow-up buzzed the rep twice: `generate_due_notifications` section 4 (`followup_due`)
  and `generate_lead_followup_notifications_for_user` (`lead_followup`) both emitted it.
- §8g said to drop section 4. **Wrong.** Section 4 honours `fu*_status` and checks each of the five
  slots; `lead_followup` ignored status entirely (nagging about completed follow-ups) and took
  `GREATEST()` of the five dates while naming it `next_fu` — GREATEST is the *latest*, so a lead with
  an overdue fu1 and a future fu5 **silently never notified at all**. Dropped `lead_followup`.
  Migration `20260816120000` also revokes the PUBLIC/anon EXECUTE that `generate_due_notifications()`
  inherited (the 08-05 migration revoked its two siblings but missed it).
- ⚠️ **Migration is NOT applied to the live DB** — needs Harish in the SQL Editor. Until then cron
  still generates duplicates nightly; the frontend no longer calls it, so no worse than before.

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
