# TICKET F2-c2 — admin SLA threshold inputs on the Settings page

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

Let a company admin edit the three per-grade response-SLA thresholds (minutes) that F2-a added to
`company_settings` (`sla_hot_minutes` / `sla_warm_minutes` / `sla_cold_minutes`, already live in
the DB and in `src/integrations/supabase/types.ts`; the `CompanySettings` type in
`src/lib/use-company.ts` already carries them as optional fields).

## Where

`src/routes/settings.index.tsx` — the admin Settings page (tabbed; `SETTINGS_TABS` near the top).
Add ONE new tab at the end: `{ value: "sla", label: "Lead SLA", icon: Timer }` (Timer from
lucide-react — already the icon used by the SLA badge).

## What to build

Inside the new tab's `TabsContent`, one `Card` titled "Speed-to-lead SLA" with description
"How quickly a new lead must get its first real contact. Uncontacted leads show a countdown badge;
a breach notifies every manager."

- Three rows, one per grade: Hot / Warm / Cold — a `Label` + numeric `Input` (minutes) + a hint
  line ("Default 15", "Default 120", "Default 1440 (= 24h)").
- Initialise the inputs from `useCompanySettings()` data, falling back to 15/120/1440 when the
  field is null/undefined.
- A Save button (primary) disabled while `useSaveCompanySettings().isPending` or while any input
  is not a positive whole number; on save call `mutateAsync({ sla_hot_minutes, sla_warm_minutes,
  sla_cold_minutes })` with numbers (parse with `parseInt`, guard `Number.isFinite` and `> 0`),
  then `toast.success("SLA thresholds saved")`; on error `toast.error(friendlyError(e))`
  (import from `@/lib/friendly-error`).
- Follow the existing tabs' structure and styling — read how an existing simple tab (e.g. the PDF
  / Contact one) builds its Card and form rows and match that idiom. Keep it simple: local
  `useState` for the three strings, no form library.
- Unknown-temp leads use the Warm threshold — state that in one muted hint line under the inputs.

## Constraints

- Touch ONLY `src/routes/settings.index.tsx`. No new files, no new dependencies, no schema changes.
- Do NOT change any existing tab.
- Do NOT commit/push/git anything.
- You cannot run tsc/tests — say so; re-read your edit and confirm the tab value is added to BOTH
  the `SETTINGS_TABS` array (with `as const` satisfied — add the literal to the array) and a
  matching `TabsContent value="sla"`, and that every identifier you use is imported.

## Report

What you changed, what you verified by eye, anything the ticket got wrong.
