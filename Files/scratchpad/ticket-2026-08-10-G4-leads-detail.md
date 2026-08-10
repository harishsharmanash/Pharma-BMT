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

# TICKET G4 — Stitch design pass: lead detail page (`leads.$id.tsx`)

The app-wide UI overhaul reached every list/section page but **never touched the detail routes**.
`src/routes/leads.$id.tsx` still wears the old interim styling. Give it the stitch look.

**This is a VISUAL pass. Not a redesign, not a restructure.** Every section, dialog and button that
exists today must still exist and still work when you are done.

Unlike the other detail pages, this one has an approved design reference — see below. Follow it for
*visual idiom* only, never at the cost of dropping something the page does today.

## The approved reference (from the signed-off Stitch screen for this page)

- **Header card** — a glass card (`sh-md rounded-3xl border border-white bg-white/90
  backdrop-blur-2xl`, 32px padding). Left: a large circular avatar/initials tile (~96px), the lead
  name as the page title, then a badge row (stage pill, temperature pill) and the existing
  firm/received-date subtitle. Right: circular icon buttons for the contact actions that already
  exist in this file (call, WhatsApp) plus the existing primary actions as `.pill sh-md` buttons.
- **Two-column bento** — `grid grid-cols-1 lg:grid-cols-3 gap-6`, main column `lg:col-span-2`,
  side column one span. Map the page's existing content onto it:
  - main: the Overview/detail grid, then Call summary;
  - side: the Status card, Products-interested card, and the Follow-up history timeline.
  If the file already uses a 12-column grid with 8/4 spans, that is the same ratio — keep it and
  just move the gap to 24px (`gap-6`).
- **Field presentation** — label above in uppercase `t-data text-[color:var(--st-on-surface-variant)]`,
  value in an inset box (`bg-white/50 rounded-lg p-3 border border-white`), laid out
  `grid md:grid-cols-2 gap-6`. Address and other long fields span both columns.
- **Empty states** — centred: a ~64px Lucide icon, a short headline, one line of muted copy, and
  the section's existing action as an outlined pill. Replaces bare muted text like
  "No follow-ups scheduled yet."
- **Badges** — three stitch tones only (error-red tint / primary 10% tint / neutral grey), dot +
  uppercase label. Temperature keeps the existing Hot/Warm/Cold semantics.

## 🚫 Where the reference is WRONG for us — do not copy these
The reference screen was generated from a mock and contains things our app must not adopt:
- It shows a **clinical persona** ("Dr. Sarah Jenkins", "Chief of Neurology"). Cerebyl is a **B2B
  pharma sales CRM** — leads are retailers, stockists and distributors, never doctors or patients.
  No stethoscope/heartbeat/clinical iconography anywhere.
- It adds a **tab bar** (Info / Contacts / Documents / Ledger / Diary). **Do not add tabs.** The page
  stays a single scrolling page.
- It adds a **"Key Personnel"** card and replaces the follow-up timeline with a generic "Recent
  Activity" empty state. **Do not do either.** The follow-up history timeline is real data the reps
  rely on — it stays, fully intact.
- It uses a **photo avatar**. We have no photo field for leads — use an initials or icon tile.
- It caps width at `max-w-7xl` and sets `h-screen` with its own sticky header. **Ignore all three** —
  our app shell owns the frame, scroll and header. Do not set `min-h-screen` or `h-screen`.

## Also in scope
- Remove any `font-ios` class on this page (Inter is the global font now).
- Keep the `LogCallDialog` import pointing at the shared `src/components/log-call-dialog.tsx`.
- The header's destructive action lives inside a `MoreVertical` dropdown with `ConfirmDelete` —
  leave that structure alone, just restyle the trigger to match the stitch icon-button look.

## Explicitly out of scope
- Do **not** touch `src/components/ui/*`, `src/lib/use-leads.ts`, `src/lib/use-lead-products.ts`,
  or any query/mutation.
- Do **not** change permission gating, routing, or search params.
- Do **not** remove, merge or reorder existing sections.

## Files
- `--file src/routes/leads.$id.tsx`
- `--read src/routes/leads.all.tsx` (exemplar — copy its idioms, do not edit it)
- `--read src/components/leads-section-header.tsx` (header pattern)

## Acceptance
- Every section present before is present after, with identical data and actions — in particular the
  follow-up history timeline and the products-interested card.
- No tabs, no Key Personnel card, no clinical imagery, no `font-ios`, no `min-h-screen`/`h-screen`.
- `npx tsc --noEmit` = 0 errors. `npm run test` still fully green.
- Report: list every section and confirm it survived, and name anything from the reference you
  deliberately did not copy.
