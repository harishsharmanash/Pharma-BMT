# Mobile revamp — IA restructure + iOS-style UI rebuild

**Status: IN PROGRESS.** Started 6 Aug 2026. This is the single authority for the
revamp; it supersedes the two separate IA analyses it was synthesised from
(Claude's and Kimi's, both run independently on 6 Aug and compared).

Owner decisions already taken are recorded here as settled. Do not re-litigate them.

---

## 0. Why

The sidebar carries 24 top-level items ordered by build date rather than by how
anyone works. On a phone that is unusable, and it is the root of the "cluttered"
feeling. Feature placement drifted with it: operational tools ended up in Settings,
per-user preferences ended up somewhere reps can't reach, and one domain (Leads)
spread across six nav slots.

**Proof the structure already forced a workaround:** the daily-digest toggle was
duplicated into the notification-bell footer *because* `/settings` is admin-only and
reps could not reach their own preference. The IA is fighting itself.

## 1. Settled decisions

| Decision | Choice | Rationale |
|---|---|---|
| Design language | **Full iOS look, incl. UX and animation** | Owner's call; iOS ship is planned, so it is forward-compatible |
| Fonts | **Inter, never SF Pro** | Apple's licence permits SF Pro only for Apple-platform apps |
| Icons | **Lucide, never SF Symbols** | Same licence restriction; Lucide already in use |
| Architecture | **Responsive shared components** | One source of truth; desktop improves as a side effect |
| Rollout | **Direct, no feature flag** | No live clients; all data is owner-created test data |
| Order of work | **IA first, visuals second** | Restyling screens that are about to merge is wasted work |
| Trash | **Stays visible to all roles** | Reps must keep self-restore; only purge stays admin-only |
| Portal | **Gets its own section** | Owner treats the portal as a distinct channel he operates |
| Console | **Untouched, stays separate** | Different audience, and its separation is a security boundary |
| Portal shell | **Untouched, stays separate** | Party users have no `profiles` row — that IS the isolation guarantee |

**Android back gesture must work correctly despite iOS-style navigation.** This is a
correctness requirement, not a style one.

## 2. Target architecture

**Revised 6 Aug 2026 by owner.** **Eight sections**, each with a landing page showing
live numbers and cards into its sub-areas, plus utilities and an account menu.
Sidebar goes from 24 flat items to 8 sections. Naming and grouping below are settled.

**A. Dashboard** — REBUILT, not left as-is. Action-oriented: today's exceptions,
**quick actions** (new lead / new order / record payment / add party), and **My Day**
folded in. Analysis moves out to Analytics.
> **The governing split: Dashboard is for ACTING, Analytics is for UNDERSTANDING.**
> Dashboard answers "what do I do right now". Analytics answers "how are we doing".
> Today's dashboard tries to be both, which is why it reads as a passive view screen.

**B. Leads** — All Leads · Call List (`/hot-warm` folded in as a preset view, URL
preserved) · Follow-up Schedule · Duplicate Flags · **Lead Intake** (the email
auto-capture pipeline, moved out of Settings).
Territories and Leaderboard move OUT (to E and G).

**C. Orders & Logistics** — Orders/invoices · **Order Requests** · **Payment
Intimations** · Transporters · Delivery tracking.
Requests and intimations live here because processing them is transaction work:
request → order → dispatch → payment is one lifecycle in one place. Client Manager
shows pending counts and links across.

**D. Products** — Products · Stock · Offers · Visual Aids.
Offers are schemes on products; visual aids are product artwork. Edited while
thinking about the product, next to the rates and packs they reference. Client
Manager links to them for "what are my clients seeing".

**E. Client Manager** (formerly "Distributor Portal") — Parties · Territories
(`/booked-areas`, `/parties/$id/territory`) · Portal access & users · Portal
activity.
The rename is substantive: this is *everything about your customers* — who they
are, what area they own, their login, their activity. "Distributor Portal" named a
piece of software; "Client Manager" names a job.

**F. Team** — Directory & HR (`/team`) · User Accounts & Roles (`/users` + the Roles
card from Settings). Resolves the duplicated profiles directory (both currently
embed `TransferBookDialog` and `InactiveRepRecord`).

**G. Analytics** — NEW SECTION. Analysis of every module: sales trends, collections
and dues aging, lead funnel and source, **Product Performance**, stock movement,
**Leaderboard**, team performance, portal adoption.

**H. Settings & Admin** — Company Settings (admin: branding, PDF/contact, dropdowns,
features) · Administration (admin: backup & export, mobile app, activity log, AI
usage) · Trash (all roles).

**Account menu (avatar, every role)** — profile · **theme** · notification
preferences · assistant memory · **sign out**. Shipped 6 Aug.

**Utilities, unchanged:** Ceremate (header), Help, Refer, Legal, Developer,
`/track/$token`.

### Phone primary nav (5)
Dashboard · Leads · Clients · Orders · More.
My Day no longer needs its own tab now that it lives in the Dashboard.
Same five for every role — consistency beats per-role cleverness.
Portal's own bottom nav (Home/Catalogue/Cart/Orders/More) is already correct: **do not touch it.**

## 3. Governing principles

1. **Never group by feature flag.** Four nav items are adjacent today only because
   they share `feature: "distributor_portal"` — a deployment concern leaking into
   navigation. Group by what the user is trying to do.
2. **No feature may be lost.** Every current route must land somewhere. The mapping
   table in the source analyses covers all of them.
3. **A nav change must never become a data change.** Landing pages must aggregate
   through the same rep-scoped hooks and RLS as today's screens. If a sub-area is
   not permitted for a role, hide the card — never render a count they cannot open.
4. **Every old URL stays alive as an alias.** Deep links are shared over WhatsApp,
   and `?party=` / `?new=1` on `/orders` are load-bearing for the assistant's
   `start_order`.

## 4. Phases

Each phase ships and is verified on a real device before the next starts.

1. ~~**Account menu + Settings split.**~~ **SHIPPED 6 Aug 2026** (`cf7b73e`, `30ea3e1`).
   `src/components/account-menu.tsx` (avatar menu, every role: name/role, theme,
   daily-summary + phone-notification toggles, Assistant memory link, destructive
   Sign out) · new `/account` page holding the memory panel · per-user cards removed
   from `settings.tsx` · bell-footer duplicates removed · `/settings` back to
   admin-only `Company Settings`. Adds no new queries — the prefs read the loaded
   profile and localStorage. **Not click-tested in a browser** (no login available
   to Claude); static/build verification only.
2. ~~**Leads consolidation.**~~ **SHIPPED 6 Aug 2026** (`fb427a6`, `f777a99`).
   `/leads` is now the section landing; list moved to `/leads/all`; `/hot-warm`
   redirects to `/leads/all?preset=hot-warm` ("Call List"); `/followups` and
   `/duplicates` redirect into the section; lead intake moved out of Settings to
   `/leads/intake` (admin). Landing cards gate on `leads.view` / admin, so no role
   sees a count it cannot act on. Four NAV entries → one. **Not click-tested as a
   staff role** (no login available to Claude).
3. ~~**Dashboard rebuild.**~~ **SHIPPED 6 Aug 2026** (`2912d7d`, `ca83b17`, `adbfda9`).
   Quick actions + My Day folded in; analysis stripped out.
   Pulled early — it is the screen the owner looks at most and is largely
   independent of the other sections. Quick actions deep-link into existing
   dialogs (`/leads/all?new=1`, `/orders?new=1`, `/parties?new=1`,
   `/parties/$id?action=pay`); My Day lives in `src/components/my-day-content.tsx`
   (all roles — rep/manager/admin variants already existed); `/my-day` still
   resolves; header sun buttons removed; "Needs attention today" derives from
   hooks the page already loads; analysis demoted below the fold, marked
   `// PHASE 7: moves to Analytics`. **Not click-tested as a staff role** (no
   login available to the agent).
4. ~~**Client Manager.**~~ **SHIPPED 6 Aug 2026** (`8c3c6f2`, `25fa81e`).
   `/clients` landing; parties list → `/clients/parties`; booked areas →
   `/clients/territories`. `/parties` and `/booked-areas` redirect with
   `search: true` so the dashboard's `?new=1` Add Party action survives. Detail
   routes (`/parties/$id`, `/parties/$id/territory`) deliberately left in place —
   they are deep-linked by the assistant and WhatsApp shares. Route guards moved
   byte-identically (`Protected` + `FeatureGate` + the rep→dashboard effect).
   Introduced the reusable **`anyOf` NAV gate**: a section entry shows when the role
   can open ANY sub-area. Parties default sort still alphabetical. **Verified in a
   real browser** — `/clients` rendered, zero console errors.
5. ~~**Orders & Logistics.**~~ **SHIPPED 6 Aug 2026** (`383aa48`, `b4baace`, `7bdec5c`).
   `/orders` is the landing; list at `/orders/all`; `/order-requests` →
   `/orders/requests`, `/payment-intimations` → `/orders/intimations`,
   `/transporters` → `/orders/transporters` (all `search: true`). `/orders/$id`,
   `/transporters/$id` and `/track/$token` untouched. Pending-requests badge moved
   to the section entry. **Verified in a real browser**: `/orders?party=…`
   forwarded to `/orders/all?party=…` with the chunks loading.
   > **Review catch (`7bdec5c`):** phase 5 moved `validateSearch` to `/orders/all`
   > and left the landing without a schema. `beforeLoad` gets the route's
   > *validated* search, so `?party=`/`?new=`/`?dup=` would read as `undefined` and
   > the forwarding would silently never fire — no error, no failing test, and the
   > assistant's `start_order` quietly broken. **When a list route becomes a
   > landing + sub-route, `validateSearch` must exist on BOTH.** All internal
   > callers pass `new: true` (boolean → `new=true`); the "?new=1" phrasing in
   > §8b is loose — the validator only accepts `true`/`"true"`.
6. ~~**Products.**~~ **SHIPPED 6 Aug 2026** (`d2ca2dc`, `ec7d6e7`, `770dd49`).
   `/products` landing; catalogue at `/products/all`; `/stock` → `/products/stock`,
   `/offers` → `/products/offers`, `/visual-aids` → `/products/aids`.
   `/product-performance` deliberately left alone (moves to Analytics in phase 7).
   The phase-5 lesson was applied correctly: `/products` owned an `action` schema
   (the assistant's `export_catalogue` / `export_rate_list` / `export_gallery`), now
   shared via a `PRODUCTS_EXPORT_ACTIONS` constant on BOTH routes so they cannot
   drift. Kimi also caught that global-search product hits would have landed on the
   section page instead of the list — fixed in the same pass.
   **Verified live:** `/products?action=export_catalogue` → 1 redirect →
   `/products/all?action=export_catalogue`; bare `/products` → 0 redirects.

> **Redirect verification technique (works, unlike per-asset curl):**
> ```bash
> curl -s -o /dev/null -w "%{num_redirects} %{url_effective}\n" -L "https://app.cerebyl.com/<path>?<param>"
> ```
> Document requests through `curl -L` report the SSR redirect chain accurately.
> Do NOT use `curl` to check individual asset chunks — that gives false 404s.
>
> **Retry before believing a `0 redirects` result.** Immediately after a deploy,
> Cloudflare edge PoPs catch up at different rates: on 6 Aug `/ai-usage` and
> `/activity` — structurally identical redirect files — each reported `0 redirects`
> on one attempt and `1` on the next, in opposite order. Wait ~30s and re-run before
> concluding a redirect is missing.
7. ~~**Analytics.**~~ **SHIPPED 6 Aug 2026** (`a0d99be`, `8fc6d63`, `89cdb8f`).
   New `/analytics` section: Overview (all the charts moved verbatim off the
   dashboard), `/analytics/products`, `/analytics/leaderboard`.
   `/product-performance` and `/leaderboard` redirect in. **Dashboard 504 → 264
   lines** and its query count 6 → 5 for every role — the Dashboard/Analytics split
   is now real, not just declared. Nothing deleted: all 7 charts, the 10-card KPI
   strip and the month/top-5 cards moved. **"Leads by Source" is still a bar chart**
   with its never-a-pie comment intact. A role with no reachable sub-area gets no
   NAV entry and no dashboard link card.

**Full legacy-URL regression, verified live 6 Aug after phase 7** — all 13 resolve:
`/product-performance`→`/analytics/products` · `/leaderboard`→`/analytics/leaderboard` ·
`/stock`→`/products/stock` · `/offers`→`/products/offers` · `/visual-aids`→`/products/aids` ·
`/hot-warm`→`/leads/all?preset=hot-warm` · `/followups`→`/leads/followups` ·
`/duplicates`→`/leads/duplicates` · `/parties`→`/clients/parties` ·
`/booked-areas`→`/clients/territories` · `/order-requests`→`/orders/requests` ·
`/payment-intimations`→`/orders/intimations` · `/transporters`→`/orders/transporters`.
8. ~~**Team merge + Settings/Admin cleanup.**~~ **SHIPPED 6 Aug 2026**
   (`b40b547`, `f6eea99`, `93ab336`, `7304158`). `/team` section with
   `/team/directory` + `/team/accounts`; `/users` redirects in; Roles card moved
   from Settings to `/team/accounts`. The duplicated profiles directory became one
   shared `src/components/staff/profiles-directory.tsx`, parameterised by props
   (`showSearch`, `showContacts`, `statusColumn`, `renderAdminActions`) rather than
   forced into one page — the two uses had genuinely diverged.
   `/settings` is now Company Settings only; **Administration** at `/settings/admin`
   holds Backup & Export, Mobile App, Activity Log and AI Usage; `/activity` and
   `/ai-usage` redirect in. Admin guard lives once in the `/settings` layout and
   covers the subtree. **Trash stayed a standalone ungated NAV entry** — deliberately
   NOT nested under Administration, since nesting risked admin-gating it.
   **Final NAV (10): Dashboard · Leads · Clients · Orders · Products · Team ·
   Analytics · Settings · Trash · Help** — down from 24.

**IA restructure COMPLETE.** Phases 1–8 shipped 6 Aug 2026. Only the visual rebuild
(9a/9b) remains.
9a. ~~**Design system.**~~ **SHIPPED 6 Aug 2026** (`7826fa8`, `92bd84f`, `9a12be5`,
   `102b1cc`, `3a384f9`). Tokens in `src/styles.css` (iOS type scale, `font-ios`,
   `ease-ios`), 10 components in `src/components/ios/`, reference page at
   **`/dev/ios`** (admin-only, not in NAV). Dark-mode contrast failures fixed
   (`--muted-foreground` 3.25–3.33 → 4.77–5.21). 44px hit areas added to icon
   buttons — **deliberately skipped** on dense adjacent pairs (claims approve/reject,
   attendance prev/next, stock tabs) where overlapping targets would misroute taps;
   those need a row-spacing pass first. Verified live: `.text-ios-body` = 17px/22px.

9b. **Section restyles — 1 of 8 done.**
   - ~~Dashboard~~ **SHIPPED** (`d6d1cc3` + `f48797a`).
   - **NEXT: Leads + Clients** — ticket is written and ready at
     `scratchpad/ticket-9b-leads-clients.md` (re-create from the pattern if the
     scratchpad is gone). Then Orders, Products, Analytics, Team, Settings.
   - Detail routes (`leads.$id`, `parties.$id`, `orders.$id`) are deliberately
     out of scope so far — they are large and need their own pass.

> **⚠️ THE PILOT'S LESSON — carry it into every remaining section.**
> The dashboard restyle turned navigating elements into `<button>` + `useNavigate`,
> silently killing middle-click and open-in-new-tab, and making navigation
> non-semantic. `asChild` now exists on `IosButton` and `IosListRow` for exactly
> this: **things that NAVIGATE render as `<Link>` anchors; only things that ACT are
> buttons.** `/dev/ios` demonstrates both forms — copy from there.

## SESSION END 6 Aug 2026 — where this actually stands

**Superseded direction.** Phases 9a/9b built an iOS-styled system, and 8 of 8
sections were restyled with it. The owner then generated a new look in **Google
Stitch**, approved it, and it replaced the iOS visual language for the shell and
Leads. The iOS tokens (`text-ios-*`, `--font-ios`, `ease-ios`) are still in
`styles.css` and still used by the not-yet-converted sections — **do not delete
them**, and do not "restore" the iOS look on the shell.

**Shipped in the final push** (`893fc39`, `385de83`, `9064799`):
`--st-*` Stitch tokens in `styles.css` under a `.stitch` scope · motion primitives
in `src/lib/motion-flow.ts` (SLIDE spring / POP press / MENU dropdown, all
reduced-motion aware) · app shell restyled with **framer-motion `layoutId` sliding
indicators** (`nav-active` desktop, `nav-active-mobile` sheet — separate ids, or the
pill tries to fly between two DOM trees) · company name + "Powered by Cerebyl" in
the sidebar · company logo with Cerebyl-wordmark fallback in the top bar · Leads
pages on live data.

**Verified by Claude, not taken on trust:** NAV routes and every permission gate
byte-identical, `gateOk`/`anyOf` intact, **`Protected` byte-identical (91 lines)** —
so a full shell rewrite left auth/consent/portal routing untouched.

### NEXT SESSION — start here
1. **Close the fidelity gap on Leads.** Owner: *"not even close to being as clean as
   the one we built in local host."* Standard = `Files/design/leads-reference/`.
   **Get a screenshot of the live page and diff it** rather than guessing; the
   README lists the four prime suspects.
2. Then roll the approved look to the other seven sections.
3. Detail routes (`leads.$id`, `parties.$id`, `orders.$id`) have had no pass at all.
4. Extract the duplicated `LogCallDialog`.
5. Still unverified by a human: the sliding animations, and phase 1's account menu
   Sign out **as a rep**.

## Earlier pause note (superseded by the section above)

Paused at the owner's request, ahead of Kimi's 5-hour usage limit. State at pause:
**working tree clean, 0 unpushed commits, HEAD `f48797a`, everything deployed and
live.** A Leads+Clients run was stopped mid-planning *before* it edited any file —
nothing partial was left behind.

**Not yet verified by a human — do this first on resume:**
1. `https://app.cerebyl.com/dev/ios` (admin login) — does the design system look
   right? If not, only ONE screen has been restyled so far.
2. The Dashboard at 17px body text — confirm the density change is wanted before it
   reaches the remaining seven sections.
3. Phase 1's account menu: Sign out works for a **rep** (it is now the only route to
   it).
4. Phone notifications on a rebuilt APK (see §8g) — the first sync after install
   fires nothing by design.

Claude could not verify any of this: `/dev/ios` needs admin, the test browser holds
a distributor session, and **`npm run dev` is broken in this repo** (SSR
import-protection error on `instrument.client` in `router.tsx`).

## 5. Reference material

- **`Files/design/hig-full.md`** — 109 pages / ~120k words extracted from Apple's
  Human Interface Guidelines via their JSON API (developer.apple.com renders client
  side, so the JSON twin at `/tutorials/data/<path>.json` is the only machine
  route). Covers Layout, Typography, Color, Materials, Motion, Accessibility, and
  every component and pattern page. **Use this, do not guess at Apple's guidance.**
- Note: the URL originally supplied (`technologyoverviews/app-design-and-ui`) is
  framework documentation — SwiftUI/UIKit, windows, scenes, asset catalogs — and is
  **not** design guidance. The HIG is the correct source.
- Vendored UI skills in `.claude/skills/`: `motion-principles`, `mobile-principles`,
  `framer-motion`, `css-native`, `design-audit`, `design-dna`. See `VENDORED.md`;
  `paint` and `cast` remain excluded.

## 6. Risks

- `settings.tsx` is 1,464 lines and holds branding, backups, features, legal,
  assistant memory and sign-out. Splitting it is the highest-risk mechanical change
  in phase 1.
- Landing pages add queries to screens that currently make none — watch the
  Supabase free-plan budget.
- Route changes reach phones instantly (WebView on a remote URL): no APK rebuild
  needed, but equally no staged rollback. Verify on a device before shipping.
- Muscle memory: 24 items learned by position get regrouped. Keep icons and labels
  identical per screen, and do the reorg once, before the visual rebuild.
