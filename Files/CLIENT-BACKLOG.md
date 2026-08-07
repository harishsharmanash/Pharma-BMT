# Cerebyl — Client Request Backlog (audited)

**Audited against the code 2026-07-25.** The previous version of this file was consolidated on 2026-07-24 from `leadenthrella/HANDOVER.md` §4 and never reconciled with what had actually shipped — **32 of its 41 "unbuilt" items were already built and live.** Building from it would have meant re-implementing working features.

Verdicts below carry `file:line` evidence. Spot-checked by Claude, not taken on trust.

**Rule for this file from now on: when something ships, move it to §3 with its evidence in the same session.** A backlog that lists shipped work is worse than no backlog — it reads like a to-do list and quietly burns days.

---

## 1. ✅ Standing-rule violation — FIXED

Parties list now defaults to alphabetical (`parties.index.tsx:89` → `useState<PartySortOption>("name_asc")`). Closed.

---

## 2. Genuinely remaining work

> **Re-audited 2026-07-28.** The 25 Jul audit went stale within hours — most of its "worth doing"
> list shipped later the same day, and this file once again read like a to-do list of finished work.
> That is the second time. **Verify with a grep before building anything from this file.**

### Shipped since the last audit — do NOT rebuild
- **Type-ahead pickers app-wide** — `Combobox` is now used across 16 route/component files.
- **Soft-delete coverage** — Trash covers leads, parties, orders, products, payments,
  party_contacts, party_documents, incentive_rules and more; `purge_trashed_rows()` exists and
  `platform-purge-old-data` calls it (plus `purge_activity_log()` at 90 days).
- **Saved filters beyond parties** — `useSavedFilter` on leads, orders, products and parties.
- **Recently-viewed** — tracks real page visits, not only global-search picks.
- **Pack-size attributes** — `dosage_form` / `pack_size` / `packing_type` are on the product form,
  shown on the list (`products.tsx:79`) and filterable (`products.tsx:149`).


### Shipped 28–29 Jul 2026 (later session)
- **Export scope headings** — every product export (catalogue/gallery/rate list/Excel) names its
  division/category/dosage form, in the file and the filename.
- **Per-division colours** — curated 13-colour palette (all WCAG AA for white text), applied in
  product list/grid and PDF headers. Migration `20260812120000`.
- **AI usage, limits and billing v1** — `ai_limits` + `claim_ai_usage`/`record_ai_tokens`/
  `my_ai_usage_today`, two-stage caps enforced server-side in IST, billable units priced per row,
  rep usage bar, admin board at `/ai-usage`. Migration `20260813120000`.
- **Mobile overflow + tap targets on the lead page**, and the over-rounded wrapping filter bars.

### Actually still open
- ~~The daily cleanup is not scheduled~~ — **DONE 30 Jul 2026.** pg_cron job
  `daily-purge-old-data` runs 21:00 UTC (02:30 IST), reads the secret from Vault, verified by a
  manual fire returning HTTP 200. Firing it also caught a latent bug: `purge_activity_log()` had
  no `GRANT EXECUTE ... TO service_role`, so the 90-day Activity Log retention had never actually
  run even when someone pressed "Run cleanup now" — fixed in
  `20260730170000_fix_purge_activity_log_grant.sql`.
- ~~Nested pack-size variants~~ — **SHIPPED 28 Jul** (`products.tsx`, `displayRows` memo): variants nest under their parent with a chevron, orphans still render top-level, selection/export untouched.
- ~~~7 delete sites still show delete on the row~~ — **VERIFIED DONE 30 Jul 2026.** All seven
  (staff docs `staff-tab.tsx:334`, order rows `orders.index.tsx:344`, ledger payments
  `parties.$id.tsx:1088` + `orders.$id.tsx:655`, party notes `:610`, party rates `:519`, lead
  product-interest `leads.$id.tsx:693`, dropdown options `settings.tsx:948`) already use the
  canonical `DropdownMenu` + ghost `MoreVertical` + `ConfirmDelete` pattern. Spot-checked two by
  hand. One remaining candidate: the header Delete on `leads.$id.tsx:199`.
- ~~Legacy `monopoly_*` columns~~ — **FULLY DONE, MIGRATION ALREADY APPLIED (verified 30 Jul 2026).**
  Code removed 28 Jul; the migration `20260811120000_drop_legacy_monopoly_columns.sql` has ALSO
  already been run against the live DB. Proof: the pre-check query errored with
  `column p.monopoly_given does not exist`, and `src/integrations/supabase/types.ts` — regenerated
  from the LIVE schema on 30 Jul — contains zero `monopoly` occurrences. Do not try to run it again.
- **608-row corpus re-run** — still never scored (see the warning in `../CLAUDE.md` §8).

### Smaller / lower value
- ~~Nested pack-size variants~~ — SHIPPED — `parent_product_id` exists (`products.tsx:1233-1241`, migration `20260711170000:41`) but the list renders variants as standalone rows instead of nesting them.
- ~~Dedicated HSN lookup view~~ — **ALREADY BUILT (verified 30 Jul 2026).** "HSN lookup" button
  `products.tsx:803` opens `HsnLookupDialog` (`:1178`, defined `:1190`) — read-only, distinct HSN
  codes with the products grouped under each. It is a dialog rather than a route; that is a UI
  choice, not a missing feature. DO NOT REBUILD.
- ~~JPG in the share flow~~ — **ALREADY BUILT (verified 30 Jul 2026).** `invoiceFormats`
  (`orders.$id.tsx:340-348`) registers a real `jpg` format calling `generateJpg()`, and
  `ShareSheet` dispatches it to WhatsApp / Mail / Text / Copy (`share-sheet.tsx:105-122,168-171`).
  DO NOT REBUILD.
- **Email a report from the app** — **PARTLY BUILT (verified 30 Jul 2026).** `ShareSheet` (with a
  Mail platform button) is wired on BOTH `orders.$id.tsx` and `parties.$id.tsx`, so invoices and
  party statements already have an email path via device `mailto` (`order-share.ts:34`). Still
  genuinely missing: leads / products / stock exports are download-only, and there is no
  server-sent email (everything relies on the device mail client).
- **Product gallery public link** — the image-first PDF shipped (`products.tsx:397-445`); the public view-only link alternative did not. Storage/persistence question still undecided.

---

## 3. Already shipped — DO NOT REBUILD (verified 2026-07-25)

**Orders:** repeat last order (`parties.$id.tsx:215` → `?dup=`) · item count per row · free-goods ₹ value · type-ahead product add in order entry
**Parties:** Open in Maps · coloured/categorised tags · lifetime business in the header (`:160`, not buried) · copy details to clipboard (`:197-210`) · has-dues vs clear filter (`parties.index.tsx:318-325`) · status-history tab (`:519-525`) · owner-rep column (`:429,464`)
**Money:** today's collection KPI (`dashboard.tsx:40,92`) · payment-mode breakdown (`:42-47,123-132`) · advance-payment UI (`parties.$id.tsx:1087-1133`) · highest-dues opt-in
**Products:** image-first gallery PDF
**Leads:** two-tap quick enquiry (`leads.index.tsx:177,504-556`) · structured lost-reason dropdown (`lead-dialog.tsx:94-104`) · follow-up due/overdue reminders in the bell
**Team:** rep home screen + day plan (`my-day.tsx`) · per-rep monthly orders + ₹ collected (`leaderboard.tsx:31-33,138-139`) · start-of-day check-in (`:58-71`) · phonebook (`team.tsx:117-215`)
**Transporters:** tap-to-call · bulk freight-paid (`transporters.$id.tsx:230-249`) · shipments-this-month
**Finding:** global search (`global-search.tsx`, mounted `app-shell.tsx:198`)
**Sharing:** party statement PDF (`parties.$id.tsx:986-1022`) · invoice print column picker (`orders.$id.tsx:64,412`)
**Dashboard:** this-month vs last-month sales (`:101-119`) · top-5 customers & products (`:136-160`)

**Resolved bug:** "Manage Users → editing name/phone silently fails" — fixed. `users.tsx:364-367,382` now selects the updated row and throws loudly on error or zero rows; RLS permits it via `profiles_admin_update` and `profiles_manager_update_reps`. Caveat: migrations are applied by hand, so if the live DB ever lacks those policies it returns — now as a visible error, not silence.

---

## 4. Known caveats on "done" items
- **Start-of-day check-in** writes real attendance, but the checked-in badge is localStorage-per-device.
- **Bulk freight-paid** is per-transporter, not cross-transporter.
- **Leaderboard** shows monthly orders and ₹ collected but still *ranks* by conversion.
- **Follow-up reminders** are in-app bell only — no push or SMS.
