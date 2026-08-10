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

# TICKET G3 — Stitch design pass: order/invoice detail page (`orders.$id.tsx`)

The app-wide UI overhaul reached every list/section page but **never touched the detail routes**.
`src/routes/orders.$id.tsx` (~1007 lines) still wears the old interim styling. Give it the stitch
look, copying the established patterns from `src/routes/leads.all.tsx`.

**This is a VISUAL pass. Not a redesign, not a restructure.** Every section, table, dialog and button
that exists today must still exist and still work when you are done.

## 🚨 The one thing that must not break: invoice PDF and JPG output

This file owns invoice generation. Two hazards, both of which have bitten this repo before:

- There is a **dedicated off-screen printable node** positioned `position: fixed; left: -10000px`.
  It is off-screen on purpose — `html2canvas` **cannot capture `display: none`**. Do not change its
  positioning strategy, do not wrap it in a conditional, do not move it inside a card you restyle,
  and do not apply `backdrop-blur` or transparency to it. If a ref (`invoiceRef` or similar) is
  attached to it, that ref must stay attached to exactly the same node.
- The invoice **column definitions are hoisted to component scope** so the PDF and the JPG share one
  source of truth and cannot drift. Leave that hoisting alone.

The printable/exported invoice is a **document, not a UI surface** — it stays on plain white with
solid borders. Apply zero stitch styling to it. Restyle only the on-screen page around it.

## What to apply

1. **Page root** — `stitch` + `space-y-5`. Remove `font-ios` or any other font override. No
   `min-h-screen`.
2. **Header block** — a header card (`sh-md rounded-3xl border border-white bg-white/90
   backdrop-blur-2xl`): left = icon tile, invoice/order number as the title, then a badge row
   (order status, payment status, overdue state) and the existing meta line (party name, date).
   Right = existing actions as filled `.pill sh-md` buttons (Share, Download, Edit, Record payment…).
3. **Content cards** — line items, totals, payments/ledger, tracking, transporter, notes: each
   becomes `sh-md rounded-3xl border border-white bg-white/90 backdrop-blur-2xl` with an uppercase
   `t-data text-[color:var(--st-on-surface-variant)]` section label.
4. **Line-items table** — header row `--st-on-surface-variant`, dividers `border-white/50`. Keep
   every column, the column-picker behaviour, and free-goods display exactly as they are. Money
   stays right-aligned and tabular.
5. **Totals block** — keep the existing arithmetic and every line (subtotal, tax, paid, due). Give
   the grand total clear visual weight. **Do not recompute or re-derive any total in the markup** —
   read the same values the file already computes.
6. **Badges** — three stitch tones only: error-red tint for overdue/unpaid, primary 10% tint for
   informational, neutral grey for muted/complete. Dot + uppercase label, never colour alone.
   Red must keep meaning "overdue/destructive" and green "paid/positive" — do not repurpose either.
7. **Payments / activity list** — dividers `border-white/50`, muted secondary text, Lucide icons
   tinted `--st-primary`. Per-row actions stay in their existing dropdown + `ConfirmDelete` flow.
8. **Empty states** — bare muted text becomes the centred icon + one-line pattern. No new actions.

## Explicitly out of scope — do NOT do these
- Do **not** touch the printable invoice node, `generateJpg`, the PDF builder, or the shared column
  definitions beyond leaving them exactly as they are.
- Do **not** introduce tabs or reorder/merge sections.
- Do **not** touch `src/components/ui/*`, `src/lib/use-orders.ts`, or any query.
- Do **not** change the `?party=` / `?new=1` search-param handling — those are load-bearing for the
  AI assistant's `start_order` action.
- Do **not** change what any role can see.

## Files
- `--file src/routes/orders.$id.tsx`
- `--read src/routes/leads.all.tsx` (the exemplar — copy its idioms, do not edit it)
- `--read src/components/leads-section-header.tsx` (header pattern)

## Acceptance
- Every section present before is present after, with identical data, totals and actions.
- The printable invoice node is byte-for-byte unchanged in structure and positioning.
- No `font-ios` remains; only stitch surfaces, pills and the three badge tones on screen.
- `npx tsc --noEmit` = 0 errors. `npm run test` still fully green.
- In your report: list every section and confirm it survived, and state explicitly what you did
  (or did not do) to the printable invoice node.
