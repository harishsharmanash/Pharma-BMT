# TICKET 2A.3a — territory_disputes table (schema only)

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

Create ONE new migration file `supabase/migrations/20260821120000_territory_disputes.sql` that adds
the `public.territory_disputes` table. Nothing else. Do not touch any other file.

Context (F4b, owner's ruling — do not re-litigate): a territory overlap NEVER blocks a write. Reps
and managers may both save over an overlap, but the override requires a typed reason, and that
reason auto-creates a row in this table. A dispute is raised when:

- a rep places a `territory_holds` row that overlaps an existing `party_territories` booking or
  another live hold, or
- a manager saves a `party_territories` row that overlaps another party's booking.

## Schema (write exactly this shape)

```sql
CREATE TABLE IF NOT EXISTS public.territory_disputes (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  raised_by               uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason                  text NOT NULL CHECK (btrim(reason) <> ''),
  -- the row whose save was the override: exactly one of these two
  hold_id                 uuid REFERENCES public.territory_holds(id) ON DELETE CASCADE,
  territory_id            uuid REFERENCES public.party_territories(id) ON DELETE CASCADE,
  -- the pre-existing row(s) it overlapped: at least one of these two
  conflicts_territory_id  uuid REFERENCES public.party_territories(id) ON DELETE CASCADE,
  conflicts_hold_id       uuid REFERENCES public.territory_holds(id) ON DELETE CASCADE,
  -- durable human-readable description, e.g.
  -- "Hold on Maharashtra (All products) vs Shree Pharma's territory — Pincode 422001"
  summary                 text NOT NULL DEFAULT '',
  status                  text NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
  resolved_by             uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at             timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT territory_disputes_subject_ck
    CHECK (num_nonnulls(hold_id, territory_id) = 1),
  CONSTRAINT territory_disputes_conflict_ck
    CHECK (conflicts_territory_id IS NOT NULL OR conflicts_hold_id IS NOT NULL),
  CONSTRAINT territory_disputes_resolution_ck
    CHECK ((status = 'resolved') = (resolved_at IS NOT NULL))
);
```

Design notes (the reasoning, so you don't "fix" it):

- FKs are `ON DELETE CASCADE` deliberately: `SET NULL` would violate the two cardinality CHECKs and
  block the delete. Bookings and holds are soft-deleted/released in practice, so hard deletes are
  rare; the `summary` column preserves the human-readable record while rows exist.
- Overlap detection stays client-side only (`scopesOverlap`/`areasOverlap` in
  `src/lib/use-territories.ts`). Do NOT write a SQL trigger to detect overlaps — that would be a
  second, drifting implementation of the comparison logic.

Also include:

- `COMMENT ON TABLE` one-liner in the style of the territory_holds migration.
- Index: `territory_disputes_open_idx ON (company_id, created_at) WHERE status = 'open'`.
- An `updated_at` touch trigger, same pattern as `trg_touch_territory_holds` in
  `supabase/migrations/20260818120000_territory_holds.sql` (attached as --read) — own function
  `public.touch_territory_disputes()`, DROP TRIGGER IF EXISTS then CREATE TRIGGER.
- RLS, mirroring the territory_holds policies exactly in structure:
  - `territory_disputes_select`: FOR SELECT USING `company_id = public.current_company_id()`
    (company-wide on purpose — a dispute nobody can see resolves nothing).
  - `territory_disputes_insert`: FOR INSERT WITH CHECK
    `company_id = public.current_company_id() AND raised_by = auth.uid()`.
  - `territory_disputes_update`: FOR UPDATE, managers/admins only, USING and WITH CHECK
    `company_id = public.current_company_id() AND public.is_manager_or_admin()`.
    (This is the resolve path.)
  - `ENABLE ROW LEVEL SECURITY`, DROP POLICY IF EXISTS before each CREATE POLICY.
- Grants, identical shape to territory_holds:
  `REVOKE ALL ... FROM anon; GRANT SELECT, INSERT, UPDATE ... TO authenticated; GRANT ALL ... TO service_role;`

## Constraints

- One file only. Match the header-comment style of the territory_holds migration (a short
  `====` banner explaining what the table is and the design intent).
- No `supabase db push`, no applying it — the human lead applies it by hand.
- Keep the file under ~110 lines. If you feel it growing past that, you are adding things the
  ticket did not ask for.
- Do NOT regenerate `src/integrations/supabase/types.ts` in this ticket.
- Do NOT commit anything.

## Verification

You cannot run commands (`--no-suggest-shell-commands`), so do not claim to have run any. Instead:
re-read your file once after writing and check by eye that (a) both CHECK constraints reference only
columns that exist, (b) every referenced table/column matches the territory_holds migration
attached, (c) policies use `public.current_company_id()`, `public.is_manager_or_admin()` and
`auth.uid()` exactly as the holds migration does. Report: the file path, its line count, and any
deviation from this ticket.
