-- Cerebyl DB fix 3/3 — apply the un-applied rep-offboarding migration.
-- Adds transfer-book-of-business + hardens RLS so deactivated users see nothing.
-- STATUS: RUN THIS. Idempotent.

-- ============================================================
-- REP OFFBOARDING + "TRANSFER BOOK OF BUSINESS"
-- 1) profiles.handles (pcd | third_party | both)
-- 2) rep_transfer_log table + RLS (managers/admins of the company)
-- 3) transfer_book_of_business(p_source, p_target) RPC
-- 4) managers can update REP profiles (deactivate / handles) — was admin-only
-- 5) deactivated users see nothing: rep-facing policies now require is_active
-- NOTE: leads carry the rep FK in `leads.rep_id`; parties in
-- `parties.assigned_rep_id`. Orders have NO explicit rep FK — they follow
-- their party, so orders are counted (not re-keyed) for the transfer log.
-- ============================================================

-- ------------------------------------------------------------
-- 1) profiles.handles
-- ------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS handles text NOT NULL DEFAULT 'pcd';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_handles_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_handles_check CHECK (handles IN ('pcd','third_party','both'));
  END IF;
END $$;

-- ------------------------------------------------------------
-- 2) rep_transfer_log
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rep_transfer_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  source_rep_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  target_rep_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  parties_moved int NOT NULL DEFAULT 0,
  leads_moved int NOT NULL DEFAULT 0,
  orders_moved int NOT NULL DEFAULT 0,
  performed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rep_transfer_log_company_idx ON public.rep_transfer_log(company_id);
GRANT SELECT, INSERT ON public.rep_transfer_log TO authenticated;
GRANT ALL ON public.rep_transfer_log TO service_role;
ALTER TABLE public.rep_transfer_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rep_transfer_log_select ON public.rep_transfer_log;
CREATE POLICY rep_transfer_log_select ON public.rep_transfer_log FOR SELECT TO authenticated
  USING (company_id = public.current_company_id() AND public.is_manager_or_admin());

DROP POLICY IF EXISTS rep_transfer_log_insert ON public.rep_transfer_log;
CREATE POLICY rep_transfer_log_insert ON public.rep_transfer_log FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND public.is_manager_or_admin());

-- ------------------------------------------------------------
-- 3) transfer_book_of_business
--    SECURITY DEFINER so the reassignment runs as one privileged unit,
--    but verifies the CALLER is an active manager/admin of the same
--    company as both reps before touching anything.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.transfer_book_of_business(p_source uuid, p_target uuid)
RETURNS TABLE(parties_moved int, leads_moved int, orders_moved int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_company uuid;
  v_source_company uuid;
  v_target_company uuid;
  v_parties int := 0;
  v_leads int := 0;
  v_orders int := 0;
BEGIN
  -- Caller must be an active manager/admin.
  IF NOT public.is_manager_or_admin() THEN
    RAISE EXCEPTION 'Only managers and admins can transfer a book of business';
  END IF;

  SELECT company_id INTO v_caller_company FROM public.profiles WHERE id = auth.uid();
  SELECT company_id INTO v_source_company FROM public.profiles WHERE id = p_source;
  SELECT company_id INTO v_target_company FROM public.profiles WHERE id = p_target;

  IF v_source_company IS NULL THEN
    RAISE EXCEPTION 'Source rep not found';
  END IF;
  IF v_target_company IS NULL THEN
    RAISE EXCEPTION 'Target rep not found';
  END IF;
  IF p_source = p_target THEN
    RAISE EXCEPTION 'Source and target rep must be different people';
  END IF;
  IF v_source_company <> v_caller_company OR v_target_company <> v_caller_company THEN
    RAISE EXCEPTION 'Both reps must belong to your company';
  END IF;

  -- Parties
  UPDATE public.parties
    SET assigned_rep_id = p_target
    WHERE assigned_rep_id = p_source AND company_id = v_caller_company;
  GET DIAGNOSTICS v_parties = ROW_COUNT;

  -- Leads (rep FK is leads.rep_id)
  UPDATE public.leads
    SET rep_id = p_target
    WHERE rep_id = p_source AND company_id = v_caller_company;
  GET DIAGNOSTICS v_leads = ROW_COUNT;

  -- Orders carry no explicit rep FK; ownership follows the party.
  -- Count orders attached to the parties that just moved (for the log).
  SELECT COUNT(*) INTO v_orders
    FROM public.orders o
    JOIN public.parties p ON p.id = o.party_id
    WHERE o.company_id = v_caller_company AND p.assigned_rep_id = p_target;

  -- Log the transfer
  INSERT INTO public.rep_transfer_log
    (company_id, source_rep_id, target_rep_id, parties_moved, leads_moved, orders_moved, performed_by)
  VALUES
    (v_caller_company, p_source, p_target, v_parties, v_leads, v_orders, auth.uid());

  parties_moved := v_parties;
  leads_moved := v_leads;
  orders_moved := v_orders;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.transfer_book_of_business(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transfer_book_of_business(uuid, uuid) TO authenticated;

-- ------------------------------------------------------------
-- 4) Managers (not just admins) may update REP profiles in their
--    company — needed for "Deactivate & keep records" and `handles`.
--    Managers cannot touch other managers/admins, cannot change the
--    role away from 'rep', and cannot move the row to another company.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS profiles_manager_update_reps ON public.profiles;
CREATE POLICY profiles_manager_update_reps ON public.profiles FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.is_manager_or_admin()
    AND role = 'rep'
  )
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.is_manager_or_admin()
    AND role = 'rep'
  );

-- ------------------------------------------------------------
-- 5) Deactivated users see nothing. The manager/admin helpers already
--    require is_active, but rep-facing "own row" policies did not.
--    Recreate them with an active-caller requirement.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_active);
$$;

-- leads: rep sees only their own — and only while active
DROP POLICY IF EXISTS leads_select ON public.leads;
CREATE POLICY leads_select ON public.leads FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (rep_id = auth.uid() AND public.is_active_user()))
  );

DROP POLICY IF EXISTS leads_insert ON public.leads;
CREATE POLICY leads_insert ON public.leads FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (rep_id = auth.uid() AND public.is_active_user()))
  );

DROP POLICY IF EXISTS leads_update ON public.leads;
CREATE POLICY leads_update ON public.leads FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (rep_id = auth.uid() AND public.is_active_user()))
  )
  WITH CHECK (
    company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (rep_id = auth.uid() AND public.is_active_user()))
  );

DROP POLICY IF EXISTS leads_delete ON public.leads;
CREATE POLICY leads_delete ON public.leads FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (rep_id = auth.uid() AND public.is_active_user()))
  );

-- parties: rep sees only assigned/unowned — and only while active
DROP POLICY IF EXISTS "parties_select_same_company" ON public.parties;
CREATE POLICY "parties_select_same_company" ON public.parties FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    AND (
      public.is_manager_or_admin()
      OR (public.is_active_user() AND (assigned_rep_id = auth.uid() OR assigned_rep_id IS NULL))
    )
  );

DROP POLICY IF EXISTS "parties_insert_same_company" ON public.parties;
CREATE POLICY "parties_insert_same_company" ON public.parties FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND public.is_active_user());

-- attendance / leave / payslips / leave balances / targets / claims / advances:
-- reps may read their own rows — only while active
DROP POLICY IF EXISTS attendance_select ON public.attendance;
CREATE POLICY attendance_select ON public.attendance FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS attendance_insert ON public.attendance;
CREATE POLICY attendance_insert ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS attendance_update ON public.attendance;
CREATE POLICY attendance_update ON public.attendance FOR UPDATE TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())))
  WITH CHECK (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS leave_req_select ON public.leave_requests;
CREATE POLICY leave_req_select ON public.leave_requests FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS leave_req_insert ON public.leave_requests;
CREATE POLICY leave_req_insert ON public.leave_requests FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS leave_bal_select ON public.leave_balances;
CREATE POLICY leave_bal_select ON public.leave_balances FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS payslips_select ON public.payslips;
CREATE POLICY payslips_select ON public.payslips FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS sales_targets_select ON public.sales_targets;
CREATE POLICY sales_targets_select ON public.sales_targets FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS expense_claims_select ON public.expense_claims;
CREATE POLICY expense_claims_select ON public.expense_claims FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS expense_claims_insert ON public.expense_claims;
CREATE POLICY expense_claims_insert ON public.expense_claims FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

DROP POLICY IF EXISTS staff_advances_select ON public.staff_advances;
CREATE POLICY staff_advances_select ON public.staff_advances FOR SELECT TO authenticated
  USING (company_id = public.current_company_id()
    AND (public.is_manager_or_admin() OR (profile_id = auth.uid() AND public.is_active_user())));

-- ============================================================
-- DONE. Migrations are applied manually per project deploy process.
-- ============================================================
