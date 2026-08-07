# Kimi Prompt 01 — Rep offboarding + "transfer book of business" (Feature 3)

_Paste everything below into a fresh Kimi chat. It is self-contained._

---

You are working in the **Cerebyl** codebase at `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`. Cerebyl is a multi-company CRM for a PCD pharma franchise business (React 19 + TypeScript, TanStack Start/Router + Query, Supabase Postgres + RLS, Tailwind v4 + shadcn/ui). Roles: `rep`, `manager`, `admin`.

**LANE RULE (another agent is working in parallel):** You may edit DB migrations, `src/lib/use-staff.ts`, `src/lib/use-leads.ts`, `src/routes/users.tsx`, `src/routes/team.tsx`, and add new hook/component files for THIS feature. **Do NOT** touch styling, global CSS, `src/components/ui/*` primitives, `src/routes/auth.tsx`, or console routes — another agent owns those. Use existing UI components as-is; do not restyle. UI polish for this feature comes in a later design pass — keep your UI plain and functional.

**Deploy/DB:** write migrations as new timestamped files in `supabase/migrations/`. They are applied manually per the project's deploy process — do not assume auto-apply. Regenerate DB types if the project has a types-gen step. Do not push to git (the owner pushes).

## Problem
Today, when a rep leaves, the team reuses their account (rename + change password). This corrupts staff/payroll history (old and new person share one record). Fix it by separating three concerns that already partly exist:
- **HR identity** — `staff` record + `employment_status` + `employment_status_history` (already exists). Never reused, never deleted.
- **Login account** — `profiles.is_active` (already exists; RLS already gates on `role IN ('manager','admin') AND is_active`). Deactivate on offboard.
- **Book of business** — parties (`parties.assigned_rep_id`), leads (`leads.assigned_to` + its follow-up columns), and their orders. **Transferable** between reps.

## Build

### 1. Migration
- Add `rep_transfer_log` table: `id, company_id, source_rep_id, target_rep_id, parties_moved int, leads_moved int, orders_moved int, performed_by, created_at`. RLS: insert/select for managers+admins of that company only.
- Add a Postgres function `transfer_book_of_business(p_source uuid, p_target uuid)` that, in a single transaction:
  - Verifies caller is manager/admin of the same company as both reps (raise on mismatch).
  - Reassigns `parties.assigned_rep_id` from source→target; `leads.assigned_to` from source→target; any order/opportunity rows carrying an explicit rep FK → target (leave party-derived ownership alone since it follows the party).
  - Writes one `rep_transfer_log` row with the moved counts.
  - Returns the counts.
- Do **not** delete anything.

### 2. Offboard action
- A "Deactivate & keep records" action (managers/admins only) that sets `profiles.is_active = false` and records an `employment_status_history` entry (e.g. status `left`). All HR/payroll/attendance/document rows stay intact and queryable.
- Ensure a deactivated rep cannot log in / sees no data. Verify the existing app auth guard blocks `is_active = false`; if it doesn't, add that guard (block at the session/guard layer with a clear "account deactivated" message). Confirm RLS already hides their data (it should, via the `is_active` checks).

### 3. Rep `handles` field (used later by lead auto-allocation)
- Add `profiles.handles text NOT NULL DEFAULT 'pcd'` with allowed `pcd | third_party | both`. Surface a selector on the rep in user settings (managers/admins only). No allocation logic yet — just store it.

### 4. Transfer UI (managers/admins only)
- On a rep in `users.tsx`/`team.tsx`: **"Transfer book of business"** → pick target rep (must be an **existing active** rep; to move to a brand-new person, create them first via the existing add-user flow, then transfer). Show a confirm dialog with a live preview of counts (X parties, Y leads) that will move. On confirm, call the RPC, toast the result, invalidate queries.
- After transfer, offer to deactivate the source rep.

### 5. Active / Inactive tabs
- In the users/team list, add **Active** and **Inactive** tabs filtering on `is_active`. Default = Active. Default sort **alphabetical** (project rule).
- From the **Inactive** tab, a manager/admin can open the full past-rep record — documents, personal details, attendance, salary structures, payslips, settlements — **read-only**. Reuse existing staff detail views; just make them reachable for inactive reps and non-editable.

## Standing rules (do not violate)
- Reassigning/transferring a party's rep = **managers/admins only**; reps never see these controls.
- Reps only ever see their own data (RLS).
- Default sort alphabetical everywhere.
- Never hard-delete rep/staff/HR data.

## Report back
List migration files added, the RPC signature, files changed, and confirm: (a) deactivated reps can't log in, (b) their data is hidden by RLS, (c) their HR/payroll history remains viewable in the Inactive tab, (d) transfer moves parties+leads and logs counts.
</content>
