-- =============================================================================
-- RLS AUDIT — run this in the Supabase SQL Editor (read-only, changes nothing)
-- =============================================================================
-- Purpose: find any table in `public` that is reachable by a logged-in user but
-- is NOT protected by row-level security. That is the single failure mode that
-- would let one company (or, soon, one distributor) read another's data.
--
-- Run this BEFORE creating the first distributor account, and again after any
-- migration that adds a table.
--
-- Expected result: query 1 returns ZERO rows. Anything it returns is a hole.
-- =============================================================================

-- 1. TABLES WITH NO RLS, OR RLS ENABLED BUT NO POLICY  ← must return 0 rows
--    "RLS enabled but no policies" is the nastiest case: it silently denies
--    everything to normal users, which usually gets 'fixed' by someone adding
--    a permissive policy in a hurry.
SELECT
  c.relname                                        AS table_name,
  c.relrowsecurity                                 AS rls_enabled,
  c.relforcerowsecurity                            AS rls_forced,
  COALESCE(p.policy_count, 0)                      AS policy_count,
  CASE
    WHEN NOT c.relrowsecurity THEN 'NO RLS — any authenticated user can read every row'
    WHEN COALESCE(p.policy_count, 0) = 0 THEN 'RLS on but ZERO policies — table is fully closed; verify this is intended'
  END                                              AS problem
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN (
  SELECT schemaname, tablename, COUNT(*) AS policy_count
  FROM pg_policies WHERE schemaname = 'public'
  GROUP BY schemaname, tablename
) p ON p.tablename = c.relname
WHERE n.nspname = 'public'
  AND c.relkind = 'r'                              -- ordinary tables only
  AND (NOT c.relrowsecurity OR COALESCE(p.policy_count, 0) = 0)
ORDER BY c.relname;


-- 2. POLICIES THAT DO NOT SCOPE BY COMPANY  ← review each one by hand
--    Every tenant-scoped table should reference current_company_id() (or an
--    equivalent join). A policy that does not is either a deliberate global
--    table (feature catalogues, etc.) or a cross-tenant leak.
SELECT
  tablename,
  policyname,
  cmd                                              AS applies_to,
  roles,
  qual                                             AS using_expression,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND COALESCE(qual, '') NOT LIKE '%current_company_id%'
  AND COALESCE(with_check, '') NOT LIKE '%current_company_id%'
  AND COALESCE(qual, '') NOT LIKE '%is_platform_admin%'
ORDER BY tablename, policyname;


-- 3. DANGEROUSLY PERMISSIVE POLICIES  ← must return 0 rows
--    A `USING (true)` on a tenant table exposes every row to every user.
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND (btrim(COALESCE(qual, '')) IN ('true', '(true)')
       OR btrim(COALESCE(with_check, '')) IN ('true', '(true)'))
ORDER BY tablename;


-- 4. SECURITY DEFINER FUNCTIONS  ← review: these run with the OWNER's rights
--    and bypass RLS. Each one must check the caller itself.
SELECT
  p.proname                                        AS function_name,
  pg_get_function_identity_arguments(p.oid)        AS args,
  CASE WHEN p.prosecdef THEN 'SECURITY DEFINER' ELSE 'invoker' END AS security,
  COALESCE(
    (SELECT string_agg(a, ', ') FROM unnest(p.proconfig) a WHERE a LIKE 'search_path%'),
    '⚠ NO search_path SET — vulnerable to search_path hijacking'
  )                                                AS search_path
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prosecdef
ORDER BY p.proname;


-- 5. WHAT anon CAN REACH  ← anon is the pre-login role; it should reach almost
--    nothing. Anything here is readable by the whole internet if RLS lets it.
SELECT table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND table_schema = 'public'
ORDER BY table_name, privilege_type;
