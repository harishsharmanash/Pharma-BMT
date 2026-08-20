DO $$
DECLARE
  v_company_id uuid;
BEGIN
  SELECT id INTO v_company_id FROM public.companies WHERE name = 'Acrowell Labs Pvt. Ltd.';
  PERFORM public.set_company_secret(
    v_company_id,
    'whatsapp_access_token',
    'EAAgn6flZAVsMBSNfYENGVlRpBI9anebFZC8cjtVmTrJ9lxfn39OXDiF4tKgO339rTpFZAXHS2gbFzVlUV27qRHM4aZAEzBuc1gjQA7IqOCqlPSwe2sFXbuSo43bGTZCtPhv5yGxrB0dZAQqZA7IQIsAOlj8PUlTZCFBMGa6ZB1rTZBS21yqhrUIEWqOwLsAk0rVJDAZBQUKODabcd2rybJTP0yv4Hyvemw4MMv8WLUC4AsXfMEeFrUs3G1LVVzMsiQziXEeftybSuDJs3Sqbn5cSj6tOGrZCaxoZD'
  );
END $$;
