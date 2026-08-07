-- Cerebyl DB fix 2/3 — restore storage.objects RLS policies.
-- Fixes SS5: product-image / party-doc / staff-file / bug-attachment UPLOADS
-- (all failed with 'new row violates row-level security policy'). Idempotent.
-- STATUS: RUN THIS.


DROP POLICY IF EXISTS "company_assets_read_own_company" ON storage.objects;
CREATE POLICY "company_assets_read_own_company"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'company-assets'
  AND (storage.foldername(name))[1]::uuid = public.current_company_id()
);

DROP POLICY IF EXISTS "company_assets_admin_insert" ON storage.objects;
CREATE POLICY "company_assets_admin_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'company-assets'
  AND public.is_admin()
  AND (storage.foldername(name))[1]::uuid = public.current_company_id()
);

DROP POLICY IF EXISTS "company_assets_admin_update" ON storage.objects;
CREATE POLICY "company_assets_admin_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'company-assets'
  AND public.is_admin()
  AND (storage.foldername(name))[1]::uuid = public.current_company_id()
)
WITH CHECK (
  bucket_id = 'company-assets'
  AND public.is_admin()
  AND (storage.foldername(name))[1]::uuid = public.current_company_id()
);

DROP POLICY IF EXISTS "company_assets_admin_delete" ON storage.objects;
CREATE POLICY "company_assets_admin_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'company-assets'
  AND public.is_admin()
  AND (storage.foldername(name))[1]::uuid = public.current_company_id()
);

DROP POLICY IF EXISTS "product_images_read_same_company" ON storage.objects;
CREATE POLICY "product_images_read_same_company" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'products'
  );

DROP POLICY IF EXISTS "product_images_write_manager_admin" ON storage.objects;
CREATE POLICY "product_images_write_manager_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'products'
    AND public.is_manager_or_admin()
  );

DROP POLICY IF EXISTS "product_images_update_manager_admin" ON storage.objects;
CREATE POLICY "product_images_update_manager_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'products'
    AND public.is_manager_or_admin()
  );

DROP POLICY IF EXISTS "product_images_delete_manager_admin" ON storage.objects;
CREATE POLICY "product_images_delete_manager_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'products'
    AND public.is_manager_or_admin()
  );

DROP POLICY IF EXISTS "party_docs_read_same_company" ON storage.objects;
CREATE POLICY "party_docs_read_same_company" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'parties'
  );

DROP POLICY IF EXISTS "party_docs_write_same_company" ON storage.objects;
CREATE POLICY "party_docs_write_same_company" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'parties'
  );

DROP POLICY IF EXISTS "party_docs_update_manager_admin" ON storage.objects;
CREATE POLICY "party_docs_update_manager_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'parties'
    AND public.is_manager_or_admin()
  );

DROP POLICY IF EXISTS "party_docs_delete_admin" ON storage.objects;
CREATE POLICY "party_docs_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'parties'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "staff_files_read_same_company" ON storage.objects;
CREATE POLICY "staff_files_read_same_company" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'staff'
  );

DROP POLICY IF EXISTS "staff_files_write_same_company" ON storage.objects;
CREATE POLICY "staff_files_write_same_company" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'staff'
    AND public.is_manager_or_admin()
  );

DROP POLICY IF EXISTS "staff_files_delete_same_company" ON storage.objects;
CREATE POLICY "staff_files_delete_same_company" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'staff'
    AND public.is_manager_or_admin()
  );

DROP POLICY IF EXISTS "bug_files_read" ON storage.objects;
CREATE POLICY "bug_files_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[2] = 'bug-reports'
    AND ((storage.foldername(name))[1] = public.current_company_id()::text OR public.is_platform_admin())
  );

DROP POLICY IF EXISTS "bug_files_write" ON storage.objects;
CREATE POLICY "bug_files_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[1] = public.current_company_id()::text
    AND (storage.foldername(name))[2] = 'bug-reports'
  );

DROP POLICY IF EXISTS "bug_files_delete" ON storage.objects;
CREATE POLICY "bug_files_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'company-assets'
    AND (storage.foldername(name))[2] = 'bug-reports'
    AND public.is_platform_admin()
  );

DROP POLICY IF EXISTS "branding_public_read" ON storage.objects;
CREATE POLICY "branding_public_read" ON storage.objects
  FOR SELECT TO anon
  USING (
    bucket_id = 'company-assets'
    AND (
      (storage.foldername(name))[2] = 'branding'
      OR (storage.foldername(name))[2] LIKE 'logo.%'
    )
  );

NOTIFY pgrst, 'reload schema';