# Legal documents — BACKEND NOTES (do NOT publish this file, do NOT surface in app)

These four documents (privacy-policy, terms-of-service, refund-policy, dpa) are **AI-drafted
on 30 Jul 2026** from Harish's stated facts. They are solid interim cover, written to be
DPDP-aware and internally consistent, with no gaps that would get them summarily rejected.

**They are NOT a substitute for a lawyer's sign-off.** Per Harish's instruction this caveat
lives ONLY here in the backend, never in the app UI or the published documents themselves.
When the business is registered (GST, entity) via a CA/lawyer, have them ratify these.

## Facts used (change these when the business registers)
- **Operator:** Harish Sharma, sole proprietor (NOT yet a registered company). Karnal, Haryana 132001, India.
- **Product/brand:** Cerebyl · app at https://app.cerebyl.com
- **Contact + Grievance Officer:** Harish Sharma, support@cerebyl.com (email only — no public postal address until registered)
- **Governing law / jurisdiction:** India; courts at Karnal, Haryana
- **Payments:** NONE yet. Refund/paid-plan clauses are written forward-looking; revisit when a processor (Razorpay/Stripe) is added.
- **Refund stance:** no refunds.
- **Minors:** service is not offered to under-18s.
- **Sub-processors:** Supabase (Postgres/auth/storage, AWS ap-south-1 Mumbai) · Cloudflare (hosting, CDN, email routing) · Google (Gemini AI, the assistant) · Resend (transactional email)
- **Data residency:** India (ap-south-1).
- **Retention:** personal/contact data purged 180 days after account termination; financial/invoice records kept 6 years (Indian statutory) then purged.
- **Nature:** business tool only. NO medical claims, NO medical advice anywhere.

## TODO before these are "final" (for the CA/lawyer pass)
- Replace "sole proprietor Harish Sharma" with the registered entity name + CIN/GSTIN once registered.
- Add registered office address once it exists.
- Re-do Refund Policy properly once a payment processor is chosen (processors mandate specific wording).
- Confirm the multi-tenant Processor/Fiduciary split in the DPA matches the client contract you actually sign.
- Have counsel confirm the liability cap, indemnity, and arbitration clauses are enforceable for a sole proprietor.

## Where these get published in-app
Link them from the auth page footer and Settings. The consent checkboxes at signup must be
UNBUNDLED and UNCHECKED (separate Terms / Privacy / — Marketing only if you ever send marketing).
That signup-consent UI + the consent audit-log table is a SEPARATE build task, not done yet.
