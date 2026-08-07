# Cerebyl UI Redesign — Full Handoff for Kimi K3

**Written 22 Jul 2026. This is your single, self-contained brief.** You (Kimi K3) are taking over the visual redesign of the Cerebyl app. This document tells you everything: what the product is, what's already been reskinned (don't redo it), where the design system lives, the exact folder map, the design tokens, and a page-by-page plan. Read it top to bottom once before touching anything.

**Golden rule: you are changing how the app LOOKS, never what it DOES.** Every button, form field, dialog, permission check, and data query must survive exactly as-is. This is a reskin, not a rebuild. If you're unsure whether something is decoration or function, treat it as function and leave the behavior alone.

---

## 0. TL;DR — what to do in what order

1. **Read the design system** (Section 3) and **study the two finished reference pages** (`auth.tsx`, `dashboard.tsx`) — they define the visual language you'll extend everywhere else.
2. Work **one page-group at a time** (Section 8), in the order listed. After each group: run the verify steps in Section 9.
3. **Never touch** data hooks (`src/lib/use-*.ts`), RLS, feature-gating logic, or route loaders. Only touch JSX/className/layout and the shared UI primitives in `src/components/ui/`.
4. The typecheck baseline is **139 errors** (pre-existing, not your fault). After any change, `npx tsc --noEmit 2>&1 | grep -c "error TS"` must still say **139**. More = you broke something.

---

## 1. What Cerebyl is

Cerebyl is a **multi-company CRM for a PCD pharma franchise business**: leads, parties (customers), orders/invoices, products, stock/inventory, staff/salary, transporters, dues, plus a platform-operations "console" and an in-app AI assistant mascot named **Ceremate**. It's a **business tool only** — no medical claims (PDFs carry a "Business tool only" footer).

**Brand is locked: the product is "Cerebyl."** Never surface the words "Enthrella," "Acrowell," "Lead CRM," or "Pharma BMS" in any user-facing UI — those are dead names or backend-only. If you see one in code or on a page, it's a bug to fix, not current identity.

**Stack:** React 19 + TypeScript, TanStack Start/Router (file-based routing), TanStack Query, Supabase (Postgres + RLS + Storage + Edge Functions), Tailwind **v4** + shadcn/ui. Animation: **framer-motion** (already installed this session). Font: **Poppins** (already wired via Google Fonts in `__root.tsx`).

**Standing product rules — never regress these:**
- Dashboard "Leads by Source" is a **bar chart, never a pie**.
- **Default sort is alphabetical** everywhere; any other order is an explicit opt-in.
- **Reassigning a party's rep** is managers/admins only — reps never see that control.
- Reps only ever see their own data (enforced by RLS — you can't see or change this from the UI, just don't add anything that assumes otherwise).

---

## 2. What's ALREADY been reskinned this session — DO NOT redo these

A first pass already landed. These are your **reference implementations** — study them to learn the visual language, then apply the same patterns to the rest. **Do not rebuild them.**

| File | What was done | Status |
|---|---|---|
| `src/styles.css` | Full token swap to the Cerebyl blue palette (oklch), Poppins font var, radius bumped to `1rem`, soft/lifted/glow shadows, `.gradient-brand`/`.gradient-hero`/`.gradient-warm` utilities, Hot/Warm/Cold recolored to brand accents. Light + dark both done. | **DONE — this is your token source of truth.** |
| `src/components/ui/button.tsx` | Default variant = pill shape + `gradient-brand` fill + `shadow-glow`. Ghost/icon stay `rounded-lg`. | **DONE — use `<Button>` everywhere, don't hand-roll buttons.** |
| `src/components/app-shell.tsx` | Sidebar nav items are pill-shaped with a light-blue active state; header is a frosted-glass panel; "My Day" button got the warm-tint pill. | **DONE — this is the shell around every logged-in page.** |
| `src/routes/dashboard.tsx` | Gradient hero banner ("Good morning / A live overview of your pipeline") + framer-motion staggered fade-up on the cards. Charts untouched (still respect the bar-not-pie rule). | **DONE — reference for hero banners + entrance animation.** |
| `src/routes/auth.tsx` | Fully rebuilt to match the reference login mock: big Cerebyl wordmark top-left, decorative nav pill (Product/About/Resources — non-functional, cosmetic only), star-mesh background image, Ceremate bot popping out of a 30/70 glass card, "Created by Harish Sharma" footer. The white-label tenant path is a separate simpler branded card — leave that path alone. | **DONE — reference for glass cards + brand assets.** |

**New brand assets already in the repo** at `src/assets/`:
- `cerebyl-wordmark.png` — transparent Cerebyl logo (use for auth/marketing surfaces)
- `ceremate-pill.png` — transparent Ceremate mascot holding a capsule
- `auth-backdrop.jpeg` — the blue star-mesh background used on `/auth`

More source assets are available (copy into `src/assets/` as needed) at:
`/Users/harishsharma/Library/CloudStorage/GoogleDrive-.../My Drive/Enthrella/Cerebyl/Branding/` — contains `Logos/` (Cerebyl No BG.png, Star), `Ceremate/` (Pill No bg.png, a Hello Animation GIF + MP4, holding-capsule), `Icons Gallery/` (backdrop, icon sheets). Prefer the `No BG`/`No bg` PNGs — they're transparent.

**Uncommitted git state right now** (nothing is pushed/deployed yet): `bun.lock`, `package.json`, `app-shell.tsx`, `button.tsx`, `__root.tsx`, `auth.tsx`, `dashboard.tsx`, `styles.css` are modified; `src/assets/` is new.

---

## 3. The design system — your source of truth

A proper coded design system was produced for Cerebyl. It's been **extracted for you** (videos stripped) to:

```
Pharma BMT/Files/App UI inspirations/upstream-design-system/project/
```

**Read these first, in this order:**
1. `readme.md` — the design system's own overview: philosophy, priorities, what to fix.
2. `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — raw design tokens (hex). Note: `src/styles.css` in the app has **already translated these to oklch** — the app's values win, but read these to understand intent.
3. `SKILL.md` — how the brand wants to be used.
4. `components/**/*.jsx` + matching `*.prompt.md` — 20 reference components (Button, Card, Badge, DataTable, SideNav, TopBar, Tabs, Modal, InfoBanner, AssistantFAB, inputs, etc.). These are **reference specimens** showing the intended look — you'll re-implement their patterns using the app's existing shadcn primitives, not copy them wholesale.
5. `ui_kits/web-app/Dashboard.jsx` + `Leads.jsx`, `ui_kits/parties/Parties.jsx`, `ui_kits/console/Console.jsx` — full **page mockups** in the target language. These are the closest thing to "here's what the finished page should look like." Study them hard before redesigning the matching route.

**Also read (functional + visual intent):**
- `Pharma BMT/Files/CEREBYL-FRONTEND-AUDIT.md` — **the most important doc.** A from-the-code inventory of every route, every button, every dialog, every role-gate. This is your ground truth for "what functionality must survive." When you redesign a page, open its section here first.
- `Pharma BMT/Files/App UI inspirations/Design file explainations/gemini-code-*.md` (3 files) — the original design blueprints (Phase 1 tokens, Phase 2 shell/dashboard, Phase 3 leads/parties). The design system above refines these; treat them as supporting rationale, not the final spec.

**Where the design system and the app's tokens disagree, the app's `src/styles.css` wins** (it's already live and correct). Don't re-derive colors from the hex files.

---

## 4. Repo folder map

Live app repo root: `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`

```
leadenthrella/
├── src/
│   ├── assets/                    ← brand images (wordmark, ceremate, backdrop) — ADD more here
│   ├── styles.css                 ← ★ DESIGN TOKENS (done) — all colors/radius/shadows/gradients
│   ├── router.tsx, server.ts, start.ts
│   ├── routeTree.gen.ts           ← AUTO-GENERATED, never edit by hand
│   │
│   ├── routes/                    ← ★ every page (TanStack file-based routing)
│   │   ├── __root.tsx             ← html shell, <head>, fonts, 404/error pages   [done: font link]
│   │   ├── index.tsx              ← redirect gate (spinner → /dashboard or /auth)
│   │   ├── auth.tsx               ← ★ login  [DONE — reference]
│   │   ├── developer.tsx          ← "contact the developer" card
│   │   ├── dashboard.tsx          ← ★ home  [DONE — reference]
│   │   ├── my-day.tsx             ← role-based daily page (3 different bodies)
│   │   ├── leads.tsx / leads.index.tsx / leads.$id.tsx
│   │   ├── hot-warm.tsx, followups.tsx, duplicates.tsx, booked-areas.tsx, leaderboard.tsx
│   │   ├── parties.tsx / parties.index.tsx / parties.$id.tsx
│   │   ├── orders.tsx / orders.index.tsx / orders.$id.tsx
│   │   ├── products.tsx, product-performance.tsx
│   │   ├── stock.tsx              ← 6 tabs
│   │   ├── team.tsx               ← staff/HR/payroll, 8 tabs (biggest page)
│   │   ├── transporters.tsx / .index.tsx / .$id.tsx
│   │   ├── settings.tsx, users.tsx, trash.tsx, help.tsx
│   │   └── console.*.tsx          ← platform-ops console (7 routes) — SEE §7, keep it DARK
│   │
│   ├── components/
│   │   ├── ui/                    ← ★ shadcn primitives (button, card, dialog, table, tabs,
│   │   │                             badge, input, select, sheet, dropdown-menu, etc.)
│   │   │                             Reskin these ONCE and every page benefits.
│   │   ├── app-shell.tsx          ← ★ sidebar + header + Protected wrapper  [DONE]
│   │   ├── assistant-chat.tsx     ← Ceremate FAB + slide-out chat (redesign scoped separately)
│   │   ├── console-shell.tsx / console-login.tsx / console-mfa.tsx  ← console chrome (dark)
│   │   ├── lead-dialog.tsx        ← shared Add/Edit Lead dialog (+ TempBadge, AlertBadge exports)
│   │   ├── global-search.tsx, notification-bell.tsx, view-toggle.tsx, sort-select.tsx,
│   │   ├── product-image-lightbox.tsx  ← fullscreen swipeable image viewer (already nice — extend it)
│   │   ├── company-branding.tsx, feature-gate.tsx, report-bug-dialog.tsx
│   │
│   ├── lib/                       ← ✗ DO NOT TOUCH for styling
│   │   ├── use-*.ts               ← data hooks (useLeads, useParties, useOrders, useStock, useStaff…)
│   │   ├── crm.ts                 ← STAGES/TEMPS/alertFor() helpers + shared enums
│   │   ├── auth-context.tsx, theme.tsx, permissions.ts, features.ts, utils.ts (cn())
│   │
│   └── integrations/supabase/     ← ✗ client + generated types — never touch
│
├── supabase/migrations/           ← ✗ DB — never touch for a UI job
├── package.json, bun.lock         ← use `bun`, not npm (see §9)
└── .claude/skills/leadenthrella-deploy/SKILL.md  ← deploy rules (read if you ever deploy)
```

**Rule of thumb:** you edit `src/routes/*.tsx` (JSX + className only), `src/components/*.tsx` (presentational), and `src/components/ui/*` (primitives). You do **not** edit `src/lib/`, `src/integrations/`, `supabase/`, or `routeTree.gen.ts`.

---

## 5. Design tokens — the exact values you must use

These are **already in `src/styles.css`** (as oklch). Use the **Tailwind utility names**, not raw hex. Never hardcode a hex color in a component.

**Core colors (Tailwind classes):**
- `bg-primary` / `text-primary` = deep brand blue `#005A9C` — primary buttons, active states, key accents
- `--ring` / accent blue `#008FE0` — focus rings, secondary highlights, chart-1
- `bg-background` = app base gray `#F4F4F4` (makes white cards pop)
- `bg-card` = white surface
- `text-foreground` = dark forest `#203233` (use instead of pure black)
- `text-muted-foreground` = secondary gray text
- `bg-destructive` = red `#E5484D`
- `border-border` = hairline `#E3E8E8`

**Gradients (utility classes, already defined):**
- `.gradient-brand` — blue→blue 135°. For buttons, FAB, small/medium emphasis.
- `.gradient-hero` — blue→blue→yellow 120°. **Hero banners ONLY** (top-of-page welcome strips). Never on dense data screens.
- `.gradient-warm` — blue→yellow→white. Sparingly, for soft accents.

**Radius / shape:** `--radius` = `1rem`. Cards → `rounded-2xl`, buttons/inputs → `rounded-full` or `rounded-xl`, badges → `rounded-full`. Soft geometry everywhere.

**Shadows (utility classes):** `.shadow-soft` (default card), `.shadow-lifted` (hover/overlay), `.shadow-glow` (primary buttons).

**Glass (utility classes, already defined):** `.glass-panel` (frosted translucent surface — nav, overlays, hero cards), `.glass-hero` / `.hero-surface` (dark emphasis surface). Use glass **sparingly** — not as the default card look.

**Status / traffic-light tokens** (use these, don't invent per-file color mappings):
- Temperature: `--hot` (orange), `--warm` (yellow), `--cold` (blue) — access as `text-[color:var(--hot)]` etc., or via the `TempBadge` component already in `lead-dialog.tsx`.
- Alerts: `--alert-overdue` (red), `--alert-due` (yellow), `--alert-upcoming` (green), `--alert-closed`, `--alert-nofu`.
- Status pills (from the audit — normalize ad-hoc badges to these): success = blue/green tint, warning = amber tint, danger = red tint, neutral = gray.

**Typography:** Poppins. Page titles `text-2xl/3xl font-semibold tracking-tight`. Card headers `text-sm/lg font-medium`. Table headers `text-xs font-semibold uppercase tracking-wider text-muted-foreground`. Body `text-sm`.

**Motion (framer-motion):** page content fades up on mount (`opacity 0→1, y 12→0`, ~350ms ease-out, stagger children ~60ms — copy the exact pattern from `dashboard.tsx`). Buttons already have `press-scale` (active:scale-0.97). Cards can opt into `.card-hover` (lift on hover) — but **not** dense list/table rows. Respect `prefers-reduced-motion` (already handled globally in styles.css).

---

## 6. The redesign philosophy (from the audit's executive summary)

**The core problem to fix:** ~30 of the app's ~37 routes currently use ONE visual template — filter card → table/grid → row-actions dropdown → dialogs. A sales report looks identical to a customer directory looks identical to a bug inbox. **Don't just reskin that template — give different KINDS of pages different SHAPES.**

**Pages that already break the mold — use as pattern seeds, don't flatten them:**
- `/my-day` — stat-tiles + card-lists, 3 role variants, zero tables. Best "dashboard" pattern.
- `/dashboard` — chart-heavy (already reskinned).
- `product-performance` — KPI stat-cards + trend badges ("report" shape).
- `stock` Issue & Returns — 3 side-by-side mini-form cards.
- `team` Attendance — click-to-cycle spreadsheet grid.
- `product-image-lightbox` — fullscreen immersive viewer. Extend this to party docs / staff photos.

**Toolbar-overload screens to consolidate into menus:**
- `/orders/$id` — 9 header buttons → group exports into a "..." / dropdown, keep primary actions visible.
- `/parties/$id` — 7 header buttons → cluster Call/WhatsApp/Maps/Copy into one pill group, isolate "Repeat last order" as primary, tuck Edit/Delete into a "..." menu.

**Normalize these inconsistencies as you go:**
- Products has a bespoke list/grid toggle — switch it to the shared `view-toggle.tsx`.
- Stock's `LocationDialog` uses a raw HTML checkbox — use the shadcn `Switch`.
- Party's `DocumentDialog` uses a native `<select>` — use the shadcn `Select`.
- Ad-hoc badge colors everywhere — route them all through the status tokens in §5.

**Do NOT silently drop these known functionality gaps — leave the behavior, just note them:** `/duplicates` has no click-through; console Errors log has no filter; `/console/users` has no per-user actions; no "empty trash" bulk button. These are pre-existing; don't "fix" them as part of a reskin unless asked.

---

## 7. The console (`/console/*`) is deliberately DARK — keep it that way

The platform-ops console (`console.*.tsx` routes + `console-shell.tsx`) uses a **permanently dark zinc palette regardless of the app's light/dark toggle.** This split identity is intentional (it's the "back office," visually distinct from the client-facing app). When you reskin it, keep it dark — apply the Cerebyl blue accents on the dark base, but do not unify it with the light main app. Read `ui_kits/console/Console.jsx` for the target look.

---

## 8. Page-by-page plan — work in this order

For **each** page: (1) open its section in `CEREBYL-FRONTEND-AUDIT.md`, (2) look at the matching `ui_kits/` mockup if one exists, (3) reskin JSX/layout only, (4) verify (§9). Keep every button label, dialog, and gate identical.

### Group A — Shell & entry (mostly done, finish the stragglers)
- ✅ `auth.tsx`, `dashboard.tsx`, `app-shell.tsx` — DONE.
- `index.tsx` — just a spinner; give it the brand spinner treatment.
- `developer.tsx` — same background/card language as `auth.tsx`; three contact pills (Email/Call/WhatsApp). Match the auth glass card.
- `__root.tsx` — restyle the 404 + error-boundary pages with brand shapes (keep the "Try again" / "Go home" buttons).

### Group B — Leads family (`ui_kits/web-app/Leads.jsx` is your mockup)
- `leads.index.tsx` — floating pill filter bar (search + Stage/Temp/Rep selects + sort + view-toggle); default grid of `rounded-2xl` cards with `card-hover`; AlertBadge + TempBadge top-right; phone as `tel:` link; duplicate-warning icon inline. Bulk-action bar slides up from bottom-center when in select mode. Keep Quick-enquiry + Add-lead dialogs.
- `leads.$id.tsx` — 2-col asymmetric layout (8/4). Header: "Log a call" (primary), "Convert to Party" (success pill), Edit, Delete-with-confirm. Products-interested card with inline editing + "Generate Bill Summary". Follow-up history as a vertical timeline.
- `hot-warm.tsx` — bold gradient hero header with a flame icon; no filters/search (keep it that way); card/row → detail.
- `followups.tsx` — table; keep the inline "+3d" snooze mini-pill.
- `duplicates.tsx` — two stacked sections; style as cards (behavior unchanged — still no click-through).
- `booked-areas.tsx` — state cards → accordion detail on click (keep the manager-only redirect).
- `leaderboard.tsx` — this is a *ranking* — add rank badges/medals/visual hierarchy, don't leave it as a plain dues-style table.

### Group C — Parties & Orders (`ui_kits/parties/Parties.jsx` is your mockup)
- `parties.index.tsx` — birthday/doc-expiry alert banners on top; pill filter bar with the Save-view/Apply-saved segmented control; grid/table via view-toggle; `ReorderPill` colored by the status tokens (never/overdue-red/due-amber/plain).
- `parties.$id.tsx` — **fix the 7-button overload** (§6). Pill-segmented tabs (not underline tabs). Ledger tab: 4 stat cards + secondary-outline export/advance/reminder buttons. Replace the native `<select>` in DocumentDialog with shadcn Select.
- `orders.index.tsx` — "New Order" split dropdown (Upload bill / Add manually); filter card; single table; status badges via tokens.
- `orders.$id.tsx` — **fix the 9-button toolbar** (§6): keep PDF/JPG/Excel/WhatsApp/Email/Copy/Columns but group exports; keep Edit/Duplicate/Cancel. ⚠️ The Line-Items card doubles as an `html2canvas` print surface for JPG export — keep it renderable (don't wrap it in transforms/filters that break canvas capture). Standardize the payment-row delete to use a confirm dialog.

### Group D — Products, Stock, Transporters
- `products.tsx` — swap bespoke toggle for shared `view-toggle`; click-to-zoom thumbnails via the lightbox; keep all split-buttons, bulk rate-adjust, import wizard.
- `product-performance.tsx` — it's a report: KPI stat cards + TrendBadge rows; consider a real bar/line chart (bar, per the standing rule).
- `stock.tsx` — 6 tabs, pill-segmented. Keep the batch-recall lookup, FEFO auto-suggest, the 3-card Issue&Returns layout, the click-to-cycle attendance-style grids. Swap the raw checkbox in LocationDialog for `Switch`.
- `transporters.*` — standard pattern with view-toggle; standardize the payment-delete confirm to match the rate-delete confirm.

### Group E — Team, Users, Settings, Help, Trash
- `team.tsx` — biggest file, 8 tabs. Pill-segmented tabs; KPI tiles on the HR dashboard; keep the attendance click-to-cycle grid, payroll PDF payslips, TransferBook dialog, InactiveRepRecord viewer.
- `users.tsx`, `settings.tsx` — form-heavy; floating labels, grouped cards, consistent destructive-action confirm dialogs (standardize the friction — §6).
- `help.tsx` — pure docs → real FAQ/article layout, not stacked plain cards.
- `trash.tsx` — already an activity-feed list; brand it.

### Group F — Console (keep DARK — §7)
- `console.index.tsx` + the 6 other console routes + `console-shell/login/mfa`. Dark zinc base + Cerebyl blue accents. Add charts to the console dashboard (it has chartable AI-spend/adoption data currently shown as plain tiles). Standardize the destructive-action friction (archiving a company currently has zero confirm — add one).

### Group G — Overlays
- `assistant-chat.tsx` — the Ceremate FAB + slide-out. Use the `AssistantFAB.jsx` mockup + the Ceremate mascot asset. (Its full redesign may be scoped separately — do the FAB + panel chrome, keep the message/plan-confirmation logic intact.)
- Shared dialogs (`lead-dialog.tsx` etc.) — floating labels, consistent footers (Cancel / Save).

---

## 9. How to work, verify, and NOT break things

**Dependencies — this repo uses `bun`, not npm.**
- Adding a dep: `bun add <pkg>` (regenerates `bun.lock`) — commit both `package.json` + `bun.lock` together or the Cloudflare build fails ("lockfile is frozen"). framer-motion is already added.
- Don't rely on `package-lock.json` (it exists but isn't what Cloudflare uses).

**Verify after every page — these actually run on this machine:**
```bash
cd "/Users/harishsharma/Claude/Pharma BMT/leadenthrella"
npx tsc --noEmit 2>&1 | grep -c "error TS"   # must stay 139 (pre-existing baseline)
bun run build                                  # must succeed
```
- ⚠️ The `leadenthrella-deploy` skill says the baseline is "132" — **that's stale, the real current baseline is 139.** More than 139 = you introduced a type error.
- `bun run lint` reports thousands of pre-existing prettier warnings — that's longstanding noise, ignore it, don't get drawn into formatting the whole repo.
- Run the dev server with `bun run dev` (port 8080) and eyeball the page before moving on.

**Hard "do not touch" list:**
- `src/lib/**` (data hooks, permissions, features, crm helpers), `src/integrations/**`, `supabase/**`, `routeTree.gen.ts`.
- Any RLS assumption, any role/feature/permission gate (three independent gating dimensions per nav item — preserve all three).
- The `html2canvas` print surface on `orders.$id.tsx` (keep it capturable).
- The white-label tenant branding path in `auth.tsx` (separate from the main login — leave it).
- The console's permanent-dark palette (§7).

**Preserve these mechanics exactly (whatever the visuals become):** the order-import wizard + AI bill-extraction, FEFO auto-suggest, batch recall/traceability, the `/my-day` 3-way role branch, per-row payslip PDF generation.

**Nothing is deployed.** All work stays local until Harish explicitly says to deploy. Don't run `wrangler deploy` or push to git unless told.

---

## 10. If anything's ambiguous

Ask Harish rather than guessing on **functionality**. For **visual** judgment calls, default to: the `ui_kits/` mockups > the design-system components > the two finished reference pages (`auth.tsx`, `dashboard.tsx`) > the gemini blueprints. When in doubt, softer/cleaner/more-whitespace beats denser.

---

**End of handoff. Start with Group B (Leads), since the shell/dashboard/auth are already done and Leads has a full mockup waiting in `ui_kits/web-app/Leads.jsx`.**
