SELECT cs.company_id, cs.name IS NOT NULL AS has_gemini_key
FROM company_secrets cs
JOIN companies c ON c.id = cs.company_id
WHERE c.name = 'Acrowell Labs Pvt. Ltd.' AND cs.name = 'gemini_api_key';
