# Ticket: add a public `/legal/data-deletion` page

## Goal

Meta's App Review requires a **"User data deletion instructions URL"** — a public page that tells a
person exactly how to get their data deleted. We currently point that field at a placeholder. Add a
new public legal page at `/legal/data-deletion` and link it from the legal index.

This is a CONTENT page only. No new data model, no new hooks, no deletion logic — the in-app
deletion tools and the 180-day/6-year retention purge already exist and are described in the
Privacy Policy. This page just explains, in one place, how to request deletion.

## Files

**Create:** `src/routes/legal.data-deletion.tsx`

**Edit:** `src/routes/legal.index.tsx` — add a fifth entry to the `docs` array.

**Read only (copy the pattern exactly):**
- `src/routes/legal.refund.tsx` — the canonical shape of a legal route in this app
  (`createFileRoute`, `errorComponent: RouteError`, `head:` meta, `<LegalPage title=... updated=...>`).
- `src/components/legal-page.tsx` — the shared shell; do not restyle it.
- `src/content/legal/privacy-policy.md` sections 5, 6 and 10 — the retention periods, the rights
  list, and the Grievance Officer block. **The new page must not contradict them.**

## Approach

### 1. `src/routes/legal.data-deletion.tsx`

Mirror `legal.refund.tsx` exactly: same imports, `createFileRoute("/legal/data-deletion")`,
`errorComponent: RouteError`, `head:` with title `"Data Deletion — Cerebyl"` and a one-line
description, component wrapped in `<LegalPage title="Data Deletion" updated="14 August 2026">`.

Content — use these headings and these facts, do not invent any others:

1. **Intro** — one short paragraph: this page explains how to request deletion of personal data held
   by Cerebyl (https://app.cerebyl.com), operated by Harish Sharma, sole proprietor, Karnal, Haryana,
   India.
2. **"Deleting data yourself in the app"** — the Service provides in-app tools to delete individual
   records and to delete your account. Deleted records go to the Bin/Trash and are purged after the
   retention period.
3. **"Requesting deletion by email"** — email **support@cerebyl.com** from the address on the
   account, stating what should be deleted (whole account, or specific records). We respond within
   the timeframes required by the DPDP Act.
4. **"What gets deleted, and what we must keep"** — personal and contact data is deleted within
   **180 days**; **financial and invoice records are retained for 6 years** to meet Indian statutory
   and tax obligations, after which they are deleted. Backups cycle and purge in the ordinary course.
   (These numbers must match the Privacy Policy exactly — take them from §5 there.)
5. **"If you are a customer of a business that uses Cerebyl"** — where Cerebyl acts as a Processor
   for a Customer Company, direct the request to that company; we assist them in responding. (Same
   substance as Privacy Policy §6's final paragraph.)
6. **"Contact"** — Grievance Officer: Cerebyl — Harish Sharma, **support@cerebyl.com**.

Keep the tone and length in line with `legal.refund.tsx`. Plain `<p>` / `<h2>` / `<strong>` only —
no new components, no new CSS classes.

### 2. `src/routes/legal.index.tsx`

Add a fifth object to the `docs` array, after the DPA entry:

```
{
  to: "/legal/data-deletion",
  title: "Data Deletion",
  description: "How to request deletion of your personal data.",
  icon: Trash2,
}
```

Add `Trash2` to the existing `lucide-react` import. Do not change the grid, the markup, or any
other entry.

## Constraints

- **No medical claims** and no mention of "Enthrella" or "Acrowell" anywhere in the copy.
- Do not touch `src/content/legal/*.md`, the Privacy Policy, or any retention/purge code.
- Do not change `LegalPage` or any shared component.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- `git status --short` → exactly two files changed: the new route and `legal.index.tsx`.
- In your report, quote the retention sentence you wrote verbatim so it can be checked against the
  Privacy Policy.
