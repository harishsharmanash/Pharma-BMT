# cerebyl-lead-intake

Cloudflare Email Worker for Cerebyl (F2 — email lead auto-fetch). Portal
lead-notification emails sent to `{company-slug}@leads.cerebyl.com` are routed
here by Cloudflare Email Routing; the worker parses them into rows in the
Supabase `leads` table, allocates a rep, logs every message to
`lead_intake_log`, and forwards a copy to the company's real inbox.

See `Files/PLAN-F2-email-lead-autofetch-DRAFT.md` for the full plan.

## Layout

- `src/index.ts` — `email()` handler, orchestrates steps 1–9
- `src/company.ts` — slug → `company_lead_intake` lookup
- `src/supabase.ts` — service-role PostgREST helpers (plain fetch, no supabase-js)
- `src/classify.ts` — PCD vs third-party keyword scan (unsure → `pcd`)
- `src/dedupe.ts` — Indian phone normalization + existing-lead check
- `src/parse/index.ts` — parser router (IndiaMART → website → LLM fallback)
- `src/parse/indiamart.ts` — ⚠ best-effort; regexes need tuning against real samples
- `src/parse/website.ts` — generic `label: value` form parser
- `src/parse/llm.ts` — Gemini JSON-mode fallback (same `ParsedLead` shape)

PharmaHopper / Pharmavends / DawaCharcha / TradeIndia parsers are pending
real sample `.eml` files; those sources currently fall through to the LLM
fallback.

## Setup (Harish)

```sh
npm install

# Secrets — NEVER commit these anywhere:
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put GEMINI_API_KEY

npx wrangler deploy
```

Then in the Cloudflare dashboard: enable Email Routing on `cerebyl.com`, add a
catch-all route on `*@leads.cerebyl.com` → Send to Worker →
`cerebyl-lead-intake`, and verify each company's `forward_to_inbox` as a
destination address (one-click email per company).

Requires the DB migration
`leadenthrella/supabase/migrations/20260801120000_lead_intake.sql` to be
applied first (tables `company_lead_intake`, `lead_intake_log`, RPC
`allocate_lead_rep`, nullable `leads.rep_id`).

## Verify

```sh
npx tsc --noEmit
```
