# TICKET F17-a — FCM schema: device_tokens + user_push_prefs

You are implementing ONE new migration file. Do NOT commit. Do NOT run tsc, tests,
or any shell commands. Do NOT modify any other file.

Create exactly one file: `supabase/migrations/20260825120000_fcm_device_tokens.sql`

Follow the style of `supabase/migrations/20260821120000_territory_disputes.sql`
(header comment block, IF NOT EXISTS / IF EXISTS idempotency, `public.` prefixes,
REVOKE anon / GRANT authenticated / GRANT service_role at the end).

## Context

We are adding Firebase Cloud Messaging push notifications. FCM registration
tokens are per device AND per Android package name (each branded per-company APK
has its own package name and its own Firebase Android app). We need:

1. A `device_tokens` table to store each registered device token.
2. A `user_push_prefs` table for per-user notification preferences (category
   toggles + quiet hours). This is deliberately NOT a column on `profiles`:
   `profiles` only has an admin-update RLS policy, and adding a self-update
   policy there would let users edit their own `role`/`is_active`. A separate
   table keyed by user_id gets self-service RLS safely.

Helper functions that already exist and should be used:
`public.current_company_id()` returns the caller's company uuid.

## Table 1: public.device_tokens

Columns:
- `id` uuid PRIMARY KEY DEFAULT gen_random_uuid()
- `company_id` uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE
- `user_id` uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
- `platform` text NOT NULL CHECK (platform IN ('android','ios','web'))
- `token` text NOT NULL  (the FCM registration token)
- `package_name` text NOT NULL  (Android applicationId the token was registered
  under, e.g. 'com.cerebyl.app.base'; stored because FCM tokens are per package)
- `created_at` timestamptz NOT NULL DEFAULT now()
- `last_seen_at` timestamptz NOT NULL DEFAULT now()

Constraints:
- UNIQUE (token)  — one row per FCM token; on re-registration by a different
  user (device handover / logout-login) the row is upserted and user_id moves.

Indexes:
- `device_tokens_user_idx` on (user_id)
- `device_tokens_company_idx` on (company_id)

RLS (enable RLS). Users manage only their own tokens:
- `device_tokens_select` FOR SELECT USING (user_id = auth.uid())
- `device_tokens_insert` FOR INSERT WITH CHECK (user_id = auth.uid() AND company_id = public.current_company_id())
- `device_tokens_update` FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())
- `device_tokens_delete` FOR DELETE USING (user_id = auth.uid())

Grants: REVOKE ALL FROM anon; GRANT SELECT, INSERT, UPDATE, DELETE TO authenticated;
GRANT ALL TO service_role. (service_role needs full access: the send-push edge
function reads tokens for arbitrary users.)

## Table 2: public.user_push_prefs

Columns:
- `user_id` uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE
- `company_id` uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE
- `prefs` jsonb NOT NULL DEFAULT '{}'::jsonb
- `updated_at` timestamptz NOT NULL DEFAULT now()

Shape of `prefs` (document in a COMMENT ON COLUMN, no DB-level validation):
```
{ "categories": { "tasks": true, "sla": true, "orders": true, "digest": true },
  "quiet_hours": { "start": "22:00", "end": "07:00" } }
```

Trigger: copy the touch-trigger pattern from the territory_disputes migration —
a `public.touch_user_push_prefs()` function setting `NEW.updated_at := now()`,
and trigger `trg_touch_user_push_prefs` BEFORE UPDATE.

RLS (enable RLS). Each user reads/writes only their own row:
- `user_push_prefs_select` FOR SELECT USING (user_id = auth.uid())
- `user_push_prefs_insert` FOR INSERT WITH CHECK (user_id = auth.uid() AND company_id = public.current_company_id())
- `user_push_prefs_update` FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())
(no DELETE policy — prefs rows live and die with the profile via ON DELETE CASCADE)

Grants: REVOKE ALL FROM anon; GRANT SELECT, INSERT, UPDATE TO authenticated;
GRANT ALL TO service_role.

## Done criteria

- File exists at the exact path above, valid Postgres, idempotent (safe to run twice).
- Report the full file path and a one-line summary. Do not claim to have tested it.
