# TICKET 2A.1 — Territory soft-hold (F4a): schema + hooks

## Goal

Today a territory is either booked or not. There is no way for a rep working a live enquiry to
reserve ground while the deal is in progress — and **most double-booking happens in exactly that gap
between "verbally promised" and "formally booked"**. The soft-hold closes it: a time-limited,
visible reservation that expires by itself if the deal doesn't convert.

This ticket adds the data layer and hooks only. **No UI** — that is 2A.2.

## Critical context

`party_territories` (bookings) has RLS `is_manager_or_admin()`, so **reps cannot write territories at
all today**. Holds are the rep-facing primitive, so this new table needs its own, rep-writable
policy. **Do not touch `party_territories` or its RLS** — widening it would let reps book monopolies.

A hold is *not* a booking. It blocks nobody at the database level; it is a visible claim that the
overlap check (2A.2) will surface. Per the owner's ruling, overlaps **never block a write** — they
require a reason and create a dispute record. Do not add any blocking constraint here.

## Files

Create:
- `supabase/migrations/20260818120000_territory_holds.sql`
- `src/lib/use-territory-holds.ts`
- `src/lib/territory-holds.ts` (pure helpers)
- `src/lib/territory-holds.test.ts`

Touch nothing else.

## Schema — implement exactly this

The area/scope columns deliberately mirror `party_territories` so the existing `scopesOverlap` /
`areasOverlap` helpers in `src/lib/use-territories.ts` can compare a hold against a booking without
translation. Read that file first and match the column names precisely.

```
public.territory_holds
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
  company_id       uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE
  held_by          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
  lead_id          uuid REFERENCES public.leads(id) ON DELETE SET NULL
  scope_type       text NOT NULL DEFAULT 'all'
                     CHECK (scope_type IN ('all','product','division','category'))
  scope_value      text
  scope_product_id uuid REFERENCES public.products(id) ON DELETE CASCADE
  area_type        text NOT NULL CHECK (area_type IN ('state','district','pincode','pin'))
  state            text
  district         text
  pincode          text
  lat              double precision
  lng              double precision
  radius_km        numeric
  note             text
  expires_at       timestamptz NOT NULL
  released_at      timestamptz
  created_at       timestamptz NOT NULL DEFAULT now()
  updated_at       timestamptz NOT NULL DEFAULT now()
```

- Copy the two CHECK constraints from `party_territories` verbatim (scope shape and area shape),
  renamed `territory_holds_scope_ck` / `territory_holds_area_ck`.
- `CREATE INDEX territory_holds_live_idx ON public.territory_holds (company_id, expires_at)
   WHERE released_at IS NULL;`
- `BEFORE UPDATE` trigger setting `updated_at`, same pattern as `trg_touch_party_territories`.

RLS (enable it, then):

- **SELECT**: `company_id = public.current_company_id()` — **every rep sees every live hold.** That
  visibility is the entire point; a hold nobody can see prevents nothing. This is a deliberate,
  narrow exception to "reps see only their own data": a hold carries no customer or financial data,
  only a claimed area.
- **INSERT** (WITH CHECK): `company_id = public.current_company_id() AND held_by = auth.uid()` — a
  rep may only place a hold in their own name.
- **UPDATE**: `company_id = public.current_company_id() AND (held_by = auth.uid() OR public.is_manager_or_admin())`
  — releasing early is the holder's or a manager's call.
- No DELETE policy. Releasing sets `released_at`; expiry is by `expires_at`.

Grants (RLS filters rows but confers no table privilege — this repo has shipped a missing-grant bug
before):
```sql
REVOKE ALL ON public.territory_holds FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.territory_holds TO authenticated;
GRANT ALL ON public.territory_holds TO service_role;
```

**There is no auto-expiry job, deliberately.** A hold is expired when `expires_at <= now()`; nothing
needs to delete it. A scheduled deleter would be a second source of truth and this repo has been
bitten by duplicate generators before.

## Hooks (`src/lib/use-territory-holds.ts`)

Follow `src/lib/use-territories.ts` for shape and naming.

- `useTerritoryHolds()` — all holds for the company, paged via `fetchAllRows`, ordered
  `expires_at` ascending then **`.order("id", { ascending: true })` last** (mandatory tiebreaker).
- `usePlaceHold()` — insert; `held_by` is the current user, `expires_at` computed from a duration.
- `useReleaseHold()` — sets `released_at = now()`.
- Invalidate `["territory_holds"]` on success.

## Pure helpers (`src/lib/territory-holds.ts`)

- `isHoldLive(hold, now: string): boolean` — `released_at` null AND `expires_at > now`. Pass `now`
  in; never read the clock inside.
- `holdExpiryFromDuration(startIso: string, days: number): string`.
- `describeHoldRemaining(hold, now): string` — "expires in 3 days" / "expires today" / "expired".

## Acceptance

- Do not run shell commands; you cannot in this session. The lead runs the gates.
- Do not apply the migration — the lead applies it by hand.
- Tests cover `isHoldLive` (live, released, expired, boundary where `expires_at === now`) and
  `describeHoldRemaining`.
- **Build each test so no other rule could satisfy it** — a released hold whose `expires_at` is in
  the future must still be not-live, and vice versa. State the mutation that kills each test.
- Do not commit.
