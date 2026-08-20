# TICKET B0.1 — AUDIT ONLY: rep-side surface

## THIS IS AN INVESTIGATION TICKET. CHANGE NO PRODUCT CODE.

The only file you may write is the report file added to this session:
`Files/tickets/reports/REPORT-B0-1.md`. Do not edit, create, or delete anything else. Do not commit.
Do not run `npx tsc` or the test suite — nothing is being changed.

We are about to build a large feature set and this project has repeatedly wasted work rebuilding
things that were already shipped. Your job is to tell us **exactly what already exists** so the real
tickets can extend rather than duplicate.

## Method

**Your ENTIRE output must be an edit to the report file. Do not answer in the chat.** A chat answer
is a failed ticket — the report file is the only thing anyone will read.

Read the actual code. Every claim must be backed by **a short verbatim quote of the code** plus the
file path. **Do not cite line numbers** — you cannot see them, and guessing produces false
citations. `path` + quoted snippet is the required evidence format.

Where you are unsure, say "unclear" rather than guessing. Where a file you need was not added to the
chat, **say which file you would need** rather than inferring its contents. Precision beats volume.

## Questions to answer

### Q1 — "My Day" / task list
Files: `src/routes/my-day.tsx`, `src/components/my-day-content.tsx`, `src/lib/use-notifications.ts`.

- What does the My Day screen actually show today? List each section and where its data comes from.
- Is there a **tasks table** or any persisted task entity anywhere in `supabase/migrations/`? Search
  for it. Or is My Day purely derived/read-only from leads, orders, and notifications?
- Can a user mark anything **done**, **postpone** it, or **dismiss** it today? If so, where is that
  state stored?
- Can a manager or admin **assign** anything to a specific rep today?
- Is there any notion of task **priority** or **ordering**, or is it grouped by section?

### Q2 — Speed-to-lead
- Does any column resembling `first_contact_at` exist on leads? Check `src/lib/use-leads.ts`,
  `src/integrations/supabase/types.ts`, and `supabase/migrations/`.
- What timestamps DO exist on a lead (creation, received, last contact, follow-up dates)? List them
  with their exact column names.
- How is a call currently logged? Look at `src/components/log-call-dialog.tsx` and any related hook.
  Does logging a call write a timestamp anywhere durable?
- Is there any existing SLA, countdown, or ageing/staleness indicator on leads anywhere?
- Where would a per-company configurable threshold naturally live — is there an existing
  company-settings pattern for numeric config? Point at it.

### Q3 — Lead list sorting and saved filters
Files: `src/routes/leads.all.tsx`, `src/routes/leads.index.tsx`, `src/lib/use-leads.ts`,
`src/components/sort-select.tsx`.

- What is the **current default sort** on the leads list? Quote the code.
- What sort options exist today? List them.
- How do **saved filters** work — where are they stored, what shape, and are they per-user?
- Is there any existing **lead score** concept anywhere in the codebase?
- Where is the **lost reason** captured when a lead is marked lost? Is it free text or a picker?

### Q4 — Objection library
- Does anything resembling an objection/response knowledge base exist? Search broadly.
- Does `src/routes/help.tsx` or any content system hold company-editable structured content that
  could be a precedent to follow? Describe the pattern if so.

### Q5 — Voice / audio
- Is there ANY audio capture in the app today? Check the Ceremate assistant
  (`src/components/assistant-chat.tsx`, `src/lib/use-assistant.ts`) — there is a mic control
  somewhere; find out exactly what it does. Is it browser speech recognition, an upload, or
  something else?
- What does `src/lib/capacitor.ts` expose today, and is there any microphone permission in
  `mobile/android/app/src/main/AndroidManifest.xml`?

## Report format

Write `Files/tickets/reports/REPORT-B0-1.md` with one section per question. Each section ends with a
one-line verdict in exactly this form:

`VERDICT: ALREADY BUILT | PARTIALLY BUILT (extend X) | NOT BUILT`

Then a final section **"Traps for the builder"** — anything you noticed that would cause a naive
implementation to break something that currently works (shared components, role-gating, an existing
consumer of a column you'd want to change, a route both roles use differently).
