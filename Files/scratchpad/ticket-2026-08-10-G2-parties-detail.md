# CEREBYL TICKET PREAMBLE (identical across tickets — do not restate, just obey)

You are the implementation worker on **Cerebyl**, a multi-company CRM for a PCD pharma franchise
business. Repo: `leadenthrella/` — React 19 + TypeScript, TanStack Start/Router (file-based routes),
TanStack Query, Supabase, Tailwind v4 + shadcn/ui, framer-motion.

## Hard rules — violating any of these fails the ticket
1. **Never invent a data hook, table, column, or component that does not already exist.** If a design
   calls for data we do not have, leave that element out and say so in your report. Do not fabricate
   statistics, percentages, or labels ("98% on-time") — every number on screen must come from real data.
2. **Behaviour is frozen unless the ticket says otherwise.** Loaders, mutations, dialogs, permission
   gates, role checks, query keys, routing and search params must all work exactly as before.
3. **Brand:** the product is **Cerebyl**. The strings "Enthrella", "Acrowell", "Pharma BMS" and
   "Lead CRM" must never appear in user-facing UI.
4. **Light theme only.** No dark-mode palette exists — do not invent one. No gradients on surfaces,
   no dark glass.
5. **Standing product rules:** default sort is alphabetical everywhere; "Leads by Source" is a bar
   chart, never a pie; reassigning a party's rep is managers/admins only; reps see only their own data.
6. **Do not touch** `src/components/ui/*` (shared shadcn primitives), `src/lib/fetch-all.ts`, any
   file under `supabase/`, or any `*.test.ts`. Do not add dependencies. Do not run `git commit`.
7. Pages must **not** set `min-h-screen` — the app shell owns the window frame and internal scroll.

## The "stitch" design system (source of truth)
- Tokens + utilities live in the `.stitch` block of `src/styles.css` (~lines 482-529): `.pill`,
  `.sh-sm` / `.sh-md` / `.sh-lg`, `.t-head-*`, `.t-data`, and `--st-*` custom properties.
- **Exemplar to copy from (READ-ONLY):** `src/routes/leads.all.tsx`. Page root is
  `stitch space-y-5`. Cards are `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`.
  Action buttons are `.pill sh-md` (filled primary, rounded-full). Section labels are uppercase
  `t-data text-[color:var(--st-on-surface-variant)]`. Status pills use three tones only: error-red
  tint (urgent), primary 10% tint (info), neutral grey (muted) — always dot + uppercase label.
- Dividers are `border-white/50`. Muted text is `--st-on-surface-variant`. Icons are Lucide only.
- Font is Inter, applied globally — **remove any `font-ios` class you encounter**.

## Verification contract — run these yourself before reporting
```
npx tsc --noEmit     # MUST be 0 errors. The baseline is 0; any error is a regression.
npm run test         # MUST stay green (361 tests / 30 files at time of writing).
```
Report: files changed, what changed in each, the tsc error count, the test pass count, and anything
you deliberately left alone with the reason. Do not commit. Do not push.

---

# TICKET G2 — Stitch design pass: party detail page (`parties.$id.tsx`)

The app-wide UI overhaul reached every list/section page but **never touched the detail routes**.
`src/routes/parties.$id.tsx` (~1559 lines) still wears the old interim styling. Give it the stitch
look, copying the established patterns from `src/routes/leads.all.tsx`.

**This is a VISUAL pass. Not a redesign, not a restructure.** Every section, tab, table, dialog and
button that exists today must still exist and still work when you are done.

## What to apply

1. **Page root** — `stitch` + `space-y-5`. Remove `font-ios` or any other font override. Do not add
   `min-h-screen` and remove it if present.
2. **Header block** — promote the current bare header row into a proper header card
   (`sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl`, generous padding):
   - left: icon tile or initials avatar, party name as the page title, then a badge row (party type,
     status, any tag chips that already exist) and the existing subtitle/meta line;
   - right: the existing primary actions as filled `.pill sh-md` buttons.
   - Contact quick-actions that already exist (call / WhatsApp / Maps) become circular icon buttons
     in that right group. **Only wire up quick-actions that already exist in this file** — do not
     invent a mail or chat button that has no handler today.
3. **Content cards** — every panel becomes `sh-md rounded-3xl border border-white bg-white/90
   backdrop-blur-2xl`. Section titles get the uppercase `t-data text-[color:var(--st-on-surface-variant)]`
   treatment.
4. **Label/value fields** — render values in inset boxes (`bg-white/50 rounded-lg p-3 border
   border-white`) with the label above in `t-data` uppercase, laid out `grid md:grid-cols-2 gap-6`.
   Full-width fields (address, notes) span both columns.
5. **Badges** — status / dues / tag badges move to the three stitch tones only: error-red tint for
   overdue or negative, primary 10% tint for informational, neutral grey for muted. Dot + uppercase
   label. **Never colour alone** — the text label always carries the meaning too.
6. **Tables** (ledger, rates, orders, documents, contacts): header row in
   `--st-on-surface-variant`, row dividers `border-white/50`, comfortable cell padding. Keep every
   column, every action and the existing sort behaviour exactly as-is.
7. **Timelines / activity / status-history lists** — dividers `border-white/50`, muted secondary
   text, Lucide icons tinted `--st-primary`.
8. **Empty states** — where a section currently renders bare muted text ("No notes yet"), upgrade to
   the centred pattern: Lucide icon, one short line, and the existing primary action as a `.pill`
   if that section already has one. Do not add new actions.
9. **Destructive actions** stay error-tint pills or stay inside their existing dropdown — never a
   filled red block, and never move a delete out of its `ConfirmDelete` flow.

## Explicitly out of scope — do NOT do these
- Do **not** introduce a tab bar, or convert the page to tabs. It stays a single scrolling page.
- Do **not** remove, merge, or reorder existing sections, even if a section looks redundant.
- Do **not** touch `src/components/ui/*`, the data hooks in `src/lib/use-parties.ts`, or any query.
- Do **not** add a "Key Personnel", "Recent Activity" or any other new section — if it is not on the
  page today, it does not go on the page today.
- Do **not** change what any role can see. Permission-gated blocks stay gated identically.

## Files
- `--file src/routes/parties.$id.tsx`
- `--read src/routes/leads.all.tsx` (the exemplar — copy its idioms, do not edit it)
- `--read src/components/leads-section-header.tsx` (header pattern)

## Acceptance
- Every section present before is present after, with identical data and identical actions.
- The page uses only stitch surfaces, pills and the three badge tones; no `font-ios` remains.
- `npx tsc --noEmit` = 0 errors. `npm run test` still fully green.
- In your report, list every section on the page and confirm it survived, plus anything you left
  unstyled and why.
