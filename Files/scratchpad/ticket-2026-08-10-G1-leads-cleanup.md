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

# TICKET G1 — Leads: de-duplicate LogCallDialog + canonicalise the header Delete

Two independent cleanups in the leads routes. Both are small; do them in one pass.

## Part 1 — Extract the duplicated `LogCallDialog`

`LogCallDialog` is defined **twice**, with identical props and behaviour:
- `src/routes/leads.$id.tsx:334`
- `src/routes/leads.all.tsx:987`

This repo has been bitten by copy-paste duplication twice before (`/team` vs `/users`, and a second
copy of a notification generator that would have produced duplicate rows the moment it was
scheduled). A second copy is a bug waiting to happen — the two will drift.

**Do this:**
1. Read both definitions first and confirm they are genuinely equivalent. **If they differ in any
   behavioural way, stop and report the difference instead of merging** — do not silently pick one.
2. Create `src/components/log-call-dialog.tsx` exporting `LogCallDialog` with the same props
   (`open`, `onOpenChange`, `lead`, `onSaved`). Move the implementation there verbatim, including
   the "[YYYY-MM-DD] Status: note" stamping behaviour that `leads.all.tsx:773` depends on.
3. Delete both local definitions and import the shared one in each route.
4. Keep the explanatory comment at `leads.all.tsx:773` accurate — if it references the local
   definition, update the wording so it still points a reader at the right place.

## Part 2 — Canonical delete pattern on the lead header

`src/routes/leads.$id.tsx:199` has a Delete action sitting directly in the page header. Every other
delete site in the app was already converted to the canonical pattern:

> a `DropdownMenu` triggered by a ghost `MoreVertical` icon button, with the destructive item inside
> it, wired to the shared `ConfirmDelete` component.

Find a converted example to copy — `src/routes/orders.index.tsx` around line 344, or
`src/routes/settings.tsx` around line 948 — and match it exactly.

**Do this:** move the header Delete into a `DropdownMenu` + ghost `MoreVertical` trigger, keep the
existing `ConfirmDelete` confirmation and the exact same delete mutation and post-delete navigation.
If other header actions (Edit, Convert, Log a call) are present, **leave them as visible pill
buttons** — only the destructive action moves into the menu. Preserve any permission gating on it.

## Files
- `--file src/routes/leads.$id.tsx`
- `--file src/routes/leads.all.tsx`
- `--file src/components/log-call-dialog.tsx` (new — create it)

## Acceptance
- `LogCallDialog` is defined exactly once in the repo; both routes import it; logging a call from
  the leads list and from the lead detail page both still work and still stamp the note identically.
- The lead detail header shows no bare Delete button; deleting goes through the `MoreVertical`
  dropdown and still asks for confirmation before deleting.
- `npx tsc --noEmit` = 0 errors. `npm run test` still fully green.
