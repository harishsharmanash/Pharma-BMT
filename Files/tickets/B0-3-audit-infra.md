# TICKET B0.3 — AUDIT ONLY: territory, notifications, and catalogue data quality

## THIS IS AN INVESTIGATION TICKET. CHANGE NO PRODUCT CODE.

The only file you may write is `Files/tickets/reports/REPORT-B0-3.md`. Do not edit, create, or
delete anything else. Do not commit. Do not run tsc or tests.

## Method

Read the actual code. Every claim carries `path:line` evidence. Say "unclear" rather than guessing.

## Questions to answer

### Q1 — Territory / monopoly (the product's commercial wedge)
Files: `supabase/migrations/20260810120000_party_territories.sql`,
`supabase/migrations/20260811120000_drop_legacy_monopoly_columns.sql`,
`src/lib/use-territories.ts`, `src/components/territory-map.tsx`,
`src/routes/parties_.$id.territory.tsx`, `src/routes/booked-areas.tsx`,
`src/routes/clients.territories.tsx`.

- Give the complete `party_territories` schema: every column, every CHECK, every index, and the RLS
  policies on it.
- How is an overlap detected today? Find `findMonopolyGeoOverlap` or its successor and describe
  exactly what it compares (pincode sets? lat/lng radius? district strings?) and **when** it runs —
  before a write, as a warning, or only as a report?
- **Critically: can a territory be booked today that overlaps an existing one?** Is the check
  advisory or blocking? Quote the code that decides.
- Is there any concept of a **temporary hold / reservation** with an expiry? (We believe not —
  confirm.)
- Is there any **dispute** record, or any audit trail of who booked what and when? What does the
  activity log capture for territory changes?
- How are pincodes represented — a list, a range, a geo radius, free text? This determines whether
  set-overlap logic is even possible.
- Are territories scoped per product/division/category, and how does that interact with overlap?

### Q2 — Notification and push stack
Files: `src/lib/use-notifications.ts`, `src/lib/device-notifications.ts`,
`src/lib/use-device-notifications.ts`, `src/components/notification-bell.tsx`,
`supabase/migrations/20260805180000_notification_generators_for_cron.sql`,
`mobile/capacitor.config.ts`, `mobile/android/app/src/main/AndroidManifest.xml`.

- List every notification **type** the system generates today and which function generates each.
- How does a notification reach a phone today, precisely? Trace the whole path.
- What does the local-notification mirror do on first run, and why? (There is a deliberate baseline
  behaviour — describe it.)
- Are there per-category preferences or quiet hours today? Where are preferences stored?
- Is there ANY deep-linking from a notification into a specific record?
- What would have to change to add FCM: list the files, the manifest entries, the Capacitor plugin,
  and where a device token would be stored. **Do not implement any of it** — just the inventory.

### Q3 — Catalogue data quality (this decides whether a whole feature is viable)
Files: `src/lib/use-products.ts`, `src/routes/products.all.tsx`,
`supabase/migrations/20260808120000_product_pack_attributes.sql`, and the products table definition.

We intend to build photo-to-product recognition: a distributor photographs any company's product,
we extract the composition and match it against the catalogue. That requires composition data to be
machine-parseable. Find out whether it is.

- What columns hold **composition / molecule / salt** data on products? Exact names and types.
- Is composition **one free-text field** or structured (molecule + strength + unit)?
- Look at how composition is entered in the UI — free text input, dropdown, or repeated fields?
- Is there any existing normalisation, parsing, or molecule search anywhere in the codebase?
- What do `dosage_form`, `pack_size`, `packing_type` contain and are they constrained by
  `dropdown_options`?
- **Report the actual shape of real data if any seed/sample/test data exists in the repo** — e.g.
  `scripts/seed-test-company.ts`, `Files/data/`, or test fixtures. Show 5–10 real composition
  strings verbatim so we can judge how parseable they are. This is the single most valuable output
  of this ticket.

### Q4 — AI worker model wiring
Files: `../acrowell-ai-worker/src/index.ts`, `gemini.ts`, `cache.ts`, `extract.ts`, `validate.ts`.
(This is a SEPARATE folder outside the git repo — read only, change nothing.)

- Where is the model name chosen? Is it one constant, several, or inline strings? List every place a
  model id appears.
- What distinct AI call types exist today (chat, analyse, extract, vision…)? Describe each endpoint
  and what it does.
- How does the explicit prompt cache work, and what is the KV key strategy?
- What is logged per call today — model, tokens, latency, cost? Where does it land?
- What would an abstraction layer have to preserve to avoid breaking things? Specifically: describe
  the `thoughtSignature` round-trip requirement and where it is handled.

## Report format

`Files/tickets/reports/REPORT-B0-3.md`, one section per question, each ending with:

`VERDICT: ALREADY BUILT | PARTIALLY BUILT (extend X) | NOT BUILT`
(For Q3, instead end with: `COMPOSITION DATA: MACHINE-PARSEABLE | PARTIALLY PARSEABLE | FREE TEXT ONLY`.)

Then **"Traps for the builder"**.
