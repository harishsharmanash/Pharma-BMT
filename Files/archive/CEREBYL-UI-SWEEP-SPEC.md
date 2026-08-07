# Cerebyl "Premium Consistency" Sweep — Agent Execution Spec

You are one of three parallel agents polishing the Cerebyl app UI to a consistent, premium standard. Read the **SHARED** section fully, then only your assigned **AGENT N** section. Edit **only the files your section lists.** Everything else is off-limits.

> Repo root: `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`
> Deep per-page functional reference (every button/dialog/gate): `../Files/CEREBYL-FRONTEND-AUDIT.md`
> Design-system page mockups (the visual bar): `../Files/App UI inspirations/upstream-design-system/project/ui_kits/`

---

## SHARED — read this first (applies to all agents)

### The mission
The design tokens are already correct (24px radius, neutral faint shadows, solid blue pill buttons, tinted badges, gridless rounded-bar charts, Poppins, `p-8` canvas). **Your job is NOT to change tokens or primitives.** Your job is to make every page you own look like it belongs to the same expensive, breathable, finished product — because right now coverage is uneven (some pages are polished, others are still raw filter-card→table template). Evenness IS the premium feeling.

### GOLDEN RULE: change how it LOOKS, never what it DOES
Preserve every button, label, dialog, form field, permission gate, role check, data query, and conditional exactly. This is a reskin. If you're unsure whether something is decoration or function, leave the behavior alone. Do not remove features, do not rename actions, do not change what a click does.

### The target vibe (Upstream aesthetic, Cerebyl blue)
Soft, breathable, spacious, high-contrast. Heavily rounded geometry. Generous whitespace to prevent data fatigue. White cards floating on the gray canvas. Large, confident numbers as visual anchors. Nothing cramped, nothing sharp-cornered.

### The deterministic style system — use these exact patterns (do not invent your own spacing)

**Page shell (every route's top-level wrapper):**
```jsx
<div className="space-y-6">          {/* or wrap in motion.div — see Motion below */}
  {/* page header */}
  {/* sections */}
</div>
```
The app-shell already provides `p-8` canvas padding — do NOT add another outer padding.

**Page header (every list/detail page starts with one):**
```jsx
<div className="flex items-center justify-between gap-4">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">Page Title</h1>
    <p className="text-sm text-muted-foreground">One-line subtitle / count.</p>
  </div>
  <div className="flex items-center gap-2">{/* primary actions, right-aligned */}</div>
</div>
```

**Cards:** always use the shared `<Card>` primitive (never hand-roll a `<div className="rounded... border... bg-white">`). 
- For a card with a **titled section header above a list/table/content block**, add a hairline under the header: give `<CardHeader>` the class `border-b` and use `<CardContent className="pt-6">` (so content clears the line). This is the "card anatomy" premium detail.
- For **compact KPI / stat tiles** (a small label + a big number), do NOT add a hairline — keep them clean: `<Card><CardContent className="p-5"><div className="text-xs text-muted-foreground">Label</div><div className="mt-2 text-2xl font-semibold">Value</div></CardContent></Card>`.

**Spacing scale (stick to these, don't improvise):**
- Between major page sections: `space-y-6`
- Grid gaps between cards: `gap-4` (tight KPI rows) or `gap-6` (chart/content grids)
- Inside a card content block: `space-y-4` (or `space-y-1.5` for dense stat lists)
- Filter/toolbar rows: `gap-2` to `gap-3`
- Never use `space-y-2`/`space-y-3` as the *section* rhythm — it reads cramped. Sections breathe at `space-y-6`.

**Filter/toolbar bars:** a floating pill container, not a heavy card:
```jsx
<div className="flex flex-wrap items-center gap-2 rounded-full border bg-card p-2 shadow-soft">
  {/* search (rounded-full, ghost), selects, view-toggle, sort */}
</div>
```
Keep the existing filter controls and their state/logic — only restyle the container + controls.

**Buttons:** always the shared `<Button>`. Primary action = default variant (solid blue pill). Secondary = `variant="outline"`. Icon-only = `variant="ghost" size="icon"`. Destructive = `variant="destructive"`. Never hand-roll buttons. When a page has toolbar overload (many header buttons), group secondary/export actions into a `DropdownMenu` triggered by a `...` icon button, keeping the 1–2 primary actions visible.

**Status badges:** always the shared `<Badge>` (already tinted: bg at 12% opacity + full-strength text). For domain statuses use the traffic-light tokens via inline color where a Badge variant doesn't fit: `text-[color:var(--hot)]`, `var(--warm)`, `var(--cold)`, `var(--alert-overdue)`, `var(--alert-due)`, `var(--alert-upcoming)`. Never invent a new hex or an ad-hoc `bg-amber-100 text-amber-700` — route every status color through these tokens. Reuse `TempBadge`/`AlertBadge`/`ReorderPill`/`TrendBadge` where they already exist.

**Tables:** wrap in a `<Card>`. Header row: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`. Body rows: `border-b border-border hover:bg-muted/50 transition-colors`, no vertical borders. Whole row clickable where it already routes somewhere (keep existing behavior). Row action menus stay as-is, just restyled.

**Empty states:** where a list/table can be empty, ensure a centered, friendly empty state (icon + short line in `text-muted-foreground`), not a bare "No data." If one exists, keep it; if it's a bare string, upgrade it to a small centered block.

**Loading states:** keep existing skeletons; if a page shows a raw spinner or nothing, use `animate-pulse rounded-2xl bg-muted` blocks matching the content shape.

**Motion (framer-motion, already installed):** wrap the page body so content fades up on mount. Copy this exact pattern from `src/routes/dashboard.tsx` (your canonical reference) — a `motion.div` with `initial="hidden" animate="show"`, `staggerChildren: 0.06`, children variant `{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }`, `duration: 0.35, ease: "easeOut"`. Apply it at the section level (header, each card group), NOT to every tiny element. Don't animate table rows. Respect reduced-motion is already handled globally.

**Hover/press:** cards that are clickable can add `card-hover` (lift). Dense table rows must NOT lift. Buttons already have `press-scale`.

### Reference pages — match this bar
- `src/routes/dashboard.tsx` — hero banner + motion + KPI tiles + chart cards. **This is your gold standard for a finished page.**
- `src/routes/auth.tsx` — glass card + brand assets (for any auth-adjacent surface).
- `src/routes/leads.index.tsx` and `src/routes/parties.index.tsx` — already-reskinned list pages (pill filter bar, card grid, badges). Match their structure on comparable list pages.
- The `ui_kits/` mockups (`web-app/Dashboard.jsx`, `web-app/Leads.jsx`, `parties/Parties.jsx`, `console/Console.jsx`) show the intended look for their page types.

### LOCKED — never edit these (all agents):
- `src/styles.css` (tokens are final)
- `src/components/ui/**` (all shadcn primitives — Button, Card, Badge, Table, Dialog, Sheet, Tabs, etc.)
- `src/components/app-shell.tsx`, `global-search.tsx`, `notification-bell.tsx`, `view-toggle.tsx`, `sort-select.tsx`, `company-branding.tsx`, `feature-gate.tsx`, `assistant-chat.tsx`
- `src/routes/dashboard.tsx`, `src/routes/auth.tsx` (done)
- Everything in `src/lib/**`, `src/integrations/**`, `supabase/**`
- `src/routeTree.gen.ts` (auto-generated)
If a locked shared component genuinely needs a change to hit the look, DO NOT edit it — leave a short note in your final report and move on.

### Special rules
- **Console routes stay DARK.** The `console.*` pages + console-shell/login/mfa use a permanent dark zinc palette regardless of the app light/dark toggle. Keep them dark; apply Cerebyl blue accents on the dark base. Do not convert them to the light theme. (Only Agent 3 touches these.)
- **`orders.$id.tsx` line-items card is an `html2canvas` print surface** for JPG export — keep it renderable: do not wrap it in CSS transforms/filters/`backdrop-blur` that break canvas capture. (Only Agent 2 touches this.)
- **Do NOT convert any detail route into a slide-in sheet** — that structural change is a separate later pass. Detail routes stay as full pages.
- Do not add new npm/bun dependencies. framer-motion is already available.

### Verify protocol (IMPORTANT — parallel-safe)
After editing your files:
1. Typecheck (read-only, safe to run concurrently with other agents):
   ```
   cd "/Users/harishsharma/Claude/Pharma BMT/leadenthrella" && npx tsc --noEmit 2>&1 | grep -c "error TS"
   ```
   The baseline is **139**. Your changes must keep it at 139. If it rises, you introduced a type error in your files — fix it before finishing.
2. **Do NOT run `bun run build`** (it writes `.output/` and collides with the other agents). **Do NOT start the dev server** (single port; the coordinator verifies visually after all agents finish).
3. Do NOT run `git commit`, `git reset`, `git checkout`, or push. Just leave your edited files in the working tree.

### Final report
When done, report: which files you restyled, anything you deliberately left (and why), any locked-file change you wished you could make, and the final `tsc` error count.

---

## AGENT 1 — CRM (Leads + Parties)

**Your files (edit only these):**
`src/routes/leads.tsx`, `src/routes/leads.index.tsx`, `src/routes/leads.$id.tsx`, `src/routes/hot-warm.tsx`, `src/routes/followups.tsx`, `src/routes/duplicates.tsx`, `src/routes/booked-areas.tsx`, `src/routes/leaderboard.tsx`, `src/routes/my-day.tsx`, `src/routes/parties.tsx`, `src/routes/parties.index.tsx`, `src/routes/parties.$id.tsx`, `src/components/lead-dialog.tsx`

**Notes for your pages** (read each page's section in `CEREBYL-FRONTEND-AUDIT.md` first):
- `leads.index` + `parties.index` are already reskinned references — bring the *rest* up to their standard; only refine them if they drift from the spec.
- `leads.$id` / `parties.$id`: apply the page-header pattern; **fix toolbar overload** — group secondary actions into a `...` DropdownMenu, keep the 1–2 primary actions (e.g. "Log a call" / "Repeat last order") as visible solid/outline buttons. Use pill-segmented tabs (`bg-muted p-1 rounded-xl`, active tab = white pill) instead of underline tabs. Ledger/products/timeline sections become clean titled cards with the header hairline.
- `hot-warm`: bold gradient hero header (flame icon), keep it filter-free.
- `followups`: table; keep the inline "+3d" snooze mini-pill.
- `duplicates`: two titled cards; keep behavior (still no click-through — don't add one).
- `booked-areas`: state cards → accordion detail; keep the manager-only redirect.
- `leaderboard`: it's a *ranking* — add rank badges/medals/visual hierarchy so it doesn't read like a plain dues table.
- `my-day`: it's your best card-list page already (3 role variants) — refine spacing/cards to spec, keep all 3 role branches.
- `lead-dialog.tsx`: floating-label feel, consistent footer (Cancel / Save). Keep every field and the rep-hidden-for-reps logic.

---

## AGENT 2 — Commerce (Orders + Products + Stock + Transporters)

**Your files (edit only these):**
`src/routes/orders.tsx`, `src/routes/orders.index.tsx`, `src/routes/orders.$id.tsx`, `src/routes/products.tsx`, `src/routes/product-performance.tsx`, `src/routes/stock.tsx`, `src/routes/transporters.tsx`, `src/routes/transporters.index.tsx`, `src/routes/transporters.$id.tsx`, `src/components/product-image-lightbox.tsx`

**Notes for your pages** (read each page's section in `CEREBYL-FRONTEND-AUDIT.md` first):
- `orders.index`: "New Order" split dropdown, pill filter bar, table in a card, status badges via tokens.
- `orders.$id`: **fix the 9-button toolbar** — keep PDF/JPG/Excel/WhatsApp/Email/Copy/Columns/Edit/Duplicate/Cancel but group exports into a `...` menu, keep primary actions visible. ⚠️ The **Line-Items card is an html2canvas print surface** — do not wrap it in transforms/filters/backdrop-blur. Pill-segmented look for any tabbed content. Standardize the payment-row delete to a confirm dialog.
- `products.tsx`: **stock.tsx and this are the two biggest under-treated pages — give them the most attention.** Swap the bespoke list/grid toggle for the shared `view-toggle`. Click-to-zoom thumbnails via the lightbox. Keep all split-buttons, bulk rate-adjust, import wizard.
- `product-performance`: it's a *report* — KPI stat cards + `TrendBadge` rows; the trend data is bar-shaped (bar chart only, never pie).
- `stock.tsx`: **6 tabs, currently barely styled — big win here.** Pill-segmented tabs. Keep the batch-recall lookup, FEFO auto-suggest, the 3-card Issue&Returns layout, click-to-cycle grids. Swap the raw HTML checkbox in LocationDialog for the shadcn `Switch`.
- `transporters.*`: standard list + detail; standardize the payment-delete confirm to match the rate-delete confirm.

---

## AGENT 3 — Admin + Console (keep console DARK)

**Your files (edit only these):**
`src/routes/team.tsx`, `src/routes/settings.tsx`, `src/routes/users.tsx`, `src/routes/help.tsx`, `src/routes/trash.tsx`, `src/routes/developer.tsx`, `src/routes/index.tsx`, `src/routes/console.tsx`, `src/routes/console.index.tsx`, `src/routes/console.companies.tsx`, `src/routes/console.companies.index.tsx`, `src/routes/console.companies.$companyId.tsx`, `src/routes/console.users.tsx`, `src/routes/console.bugs.tsx`, `src/routes/console.errors.tsx`, `src/routes/console.security.tsx`, `src/components/console-shell.tsx`, `src/components/console-login.tsx`, `src/components/console-mfa.tsx`, `src/components/report-bug-dialog.tsx`

**Notes for your pages** (read each page's section in `CEREBYL-FRONTEND-AUDIT.md` first):
- `team.tsx`: **biggest file in the app, 8 tabs, under-treated — your #1 priority.** Pill-segmented tabs. KPI tiles on the HR dashboard tab. Keep the attendance click-to-cycle grid, payroll PDF payslips, TransferBook dialog, InactiveRepRecord viewer, and every role-gated tab exactly.
- `settings.tsx`, `users.tsx`: form-heavy — grouped titled cards (with header hairline), consistent destructive-action confirm dialogs (standardize the friction: same `AlertDialog` treatment everywhere).
- `help.tsx`: pure docs — turn stacked plain cards into a real FAQ/article layout (accordion or clean article cards).
- `trash.tsx`: already an activity-feed list — brand it to spec.
- `developer.tsx`: match `auth.tsx`'s glass-card language (3 contact pills).
- `index.tsx`: just a redirect spinner — give it the brand spinner (blue, centered).
- `console.*` + `console-shell/login/mfa`: **KEEP DARK** (permanent zinc palette). Apply Cerebyl blue accents on the dark base, 24px radius, breathing room — but do not switch it to the light theme. Add charts to the console dashboard where it currently shows chartable data (AI spend / adoption %) as plain tiles. Standardize destructive-action friction (archiving a company currently has zero confirm — add an `AlertDialog`). Reference `ui_kits/console/Console.jsx` for the target dark look.

---

**End of spec. Work only your files, keep behavior identical, keep tsc at 139, don't build or start the server.**
