# CEREBYL — STANDING TICKET PREAMBLE

*This block is identical in every ticket. Read it once; the ticket-specific delta is at the end.*

## Project

Cerebyl — a multi-company CRM for the Indian PCD pharma franchise business. Leads, parties
(customers), orders/invoices, products, transporters, dues, team, stock, salary, plus a
distributor-facing portal and an AI assistant called Ceremate.

Stack: React 19 + TypeScript, TanStack Start/Router (file-based routes in `src/routes/`),
TanStack Query, Supabase (Postgres + RLS + Storage + Edge Functions), Tailwind v4 + shadcn/ui,
framer-motion, recharts. Tests: Vitest + React Testing Library.

## Brand rules — violating these is a bug, not a style choice

- The product is **Cerebyl**. The strings **"Enthrella"** and **"Acrowell"** must NEVER appear in
  any user-facing UI. Acrowell is one client company inside the platform; Enthrella is backend-only
  infrastructure. The internal dev console is "Cerebyl Operations".
- It is a **business tool only**. No medical or therapeutic claims anywhere. Generated PDFs and
  shareable assets carry a "Business tool only" footer.

## Standing product rules — never regress these

1. Dashboard "Leads by Source" is a **bar chart, never a pie**. No pie chart type exists in this
   product by deliberate decision.
2. **Default sort is alphabetical everywhere.** Any other order (highest dues, best-sellers,
   recency) is an explicit opt-in the user chooses, never a default you introduce.
3. **Reassigning a party's rep is managers/admins only.** Reps must never see that control.
4. **Reps only ever see their own data**, enforced by RLS. A UI change must never widen data access.
5. **Every paged query MUST end with `.order("id", { ascending: true })` as its last sort.**
   PostgREST caps responses at 1000 rows silently; `src/lib/fetch-all.ts` pages via `.range()`, and
   offset paging over a non-unique sort duplicates some rows and drops others. Removing that
   tiebreaker converts a fixed bug into silent data corruption.
6. **Feature flags fail closed.** New capabilities go in `DEFAULT_OFF_FEATURE_KEYS`; anything a
   client company must not switch on for itself also goes in `CONSOLE_ONLY_FEATURE_KEYS`
   (`src/lib/features.ts`).

## Conventions — reuse, do not reinvent

- Charts: `src/components/ui/chart.tsx` (recharts wrapper). Never hand-roll a chart.
- Long entity pickers: the shared `Combobox`. Fixed short enums stay as `Select`.
- Destructive actions: `ConfirmDelete`, reached from a `DropdownMenu` triggered by a ghost
  `MoreVertical` button. That is the canonical delete placement.
- Errors shown to users go through `src/lib/friendly-error.ts`; raw errors go to console and
  `logAppError`. Never wire `src/lib/lovable-error-reporting.ts` — it posts to a dead endpoint.
- Bulk reads use `src/lib/fetch-all.ts`.
- CSV export uses `downloadCsv` in `src/lib/export-csv.ts`.
- Motion must respect `prefers-reduced-motion` via `src/lib/use-motion-safe.ts`.
- Anything rendered to canvas/image (invoice JPG, catalogue assets) must render from a dedicated
  off-screen node using `position: fixed; left: -10000px`. **Never `display: none`** — html2canvas
  cannot capture it.
- The app is **light-only**. No dark palette has been designed. Do not invent one.
- Fonts: Inter. Icons: Lucide. Never SF Pro or SF Symbols.

## Mobile

The Android app is a Capacitor shell. `src/` must NEVER `import` an `@capacitor/*` package — the web
app reaches plugins through the injected bridge in `src/lib/capacitor.ts`. `mobile/` has its own
`package.json` and must never modify the root `package.json`, `bun.lock`, or `package-lock.json`.

## Database

Migrations are plain SQL files in `supabase/migrations/`, applied **by hand** by the human lead via
the Supabase SQL Editor. Never run `supabase db push`. When a ticket needs schema, write the
migration file; do not attempt to apply it.

## Verification contract — every ticket

1. `npx tsc --noEmit` must report **0 errors**. The baseline is zero; any error is a regression.
2. `npm run test` must pass.
3. Any test you write must be **mutation-verified**: break the code it covers, confirm the test goes
   red, restore. A test that passes against broken code is worse than no test. State in your report
   which mutation you used.
4. Run `git status --short` and confirm you changed only the files the ticket named.
5. **Do NOT commit, and do NOT push.** Leave your changes uncommitted in the working tree — the
   human lead reviews the diff and commits. Other agents may be working in this same checkout on
   different files, so a commit from you would sweep up their work. Do not run `git add`,
   `git commit`, `git stash`, `git checkout`, or `git restore` on any file.
6. Report concisely: what you changed, the tsc error count, the test result, the mutation you
   verified with, and anything you found that the ticket got wrong.

## Honesty rules

- If the ticket's premise is wrong — the code already does this, the named file does not exist, the
  approach cannot work — **stop and say so** in your report. Do not build something adjacent.
- Never report a command's result you did not actually run.
- Never delete or simplify away an existing feature to make your change fit. If something appears to
  be in the way, report it rather than removing it.

---
