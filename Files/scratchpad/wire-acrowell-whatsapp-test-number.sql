DO $$
DECLARE
  v_company_id uuid;
BEGIN
  SELECT id INTO v_company_id FROM public.companies WHERE name = 'Acrowell Labs Pvt. Ltd.';
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: Acrowell Labs Pvt. Ltd.';
  END IF;

  PERFORM public.set_company_secret(
    v_company_id,
    'whatsapp_access_token',
    'EAAgn6flZAVsMBSHIjGYVdxLImRaZBsteZBUYGfjtwS5sDAhQ9bLc5Fb22ub3cuqKu8ugiBQ7Sa0M3t9xMjmjBH6chbsO7zUu2HYudiO2jreoYa9SWQY8MMqRdKOk0kk4n6HfWrI9F9AXqtozqy4TiHZBagKh3WP0ihAzJmZBch5v24UjYcuLPTJKbFKPCKc9txM8tPspraxWlEeQplzSObh4lt6RWjM0FMT4GbxgXOJUifHVsq9xZCThqho9WZBhhu0wZAz7QKoxZBSPuXHhYr0OIKGkO'
  );

  INSERT INTO public.company_whatsapp_accounts (company_id, mode, status, primary_waba_id, updated_at)
  VALUES (v_company_id, 'single', 'live', '1838214670880461', now())
  ON CONFLICT (company_id) DO UPDATE
    SET mode = EXCLUDED.mode,
        status = EXCLUDED.status,
        primary_waba_id = EXCLUDED.primary_waba_id,
        error_message = NULL,
        updated_at = now();

  INSERT INTO public.company_whatsapp_numbers
    (company_id, waba_id, phone_number_id, display_phone_number, role, verified_at, updated_at)
  VALUES
    (v_company_id, '1838214670880461', '1304355099426401', '+1 555 674 0155', 'primary', now(), now())
  ON CONFLICT (phone_number_id) DO UPDATE
    SET waba_id = EXCLUDED.waba_id,
        display_phone_number = EXCLUDED.display_phone_number,
        role = EXCLUDED.role,
        verified_at = now(),
        updated_at = now();

  INSERT INTO public.company_features (company_id, feature_key, allowed, enabled, updated_at)
  VALUES (v_company_id, 'whatsapp_integration', true, true, now())
  ON CONFLICT (company_id, feature_key) DO UPDATE
    SET allowed = true, enabled = true, updated_at = now();
END $$;
