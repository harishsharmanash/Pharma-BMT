# PLAN — Full automated app test (Harish's idea, 25 Jul 2026; for Monday)

**The idea, in his words:** use the PDFs and photos we already have to test the front end, back end and everything automatically through Claude — so he provides files and nothing else, and gets a detailed go-through of every feature: AI features, OCR/bill uploads, and the ordinary CRM flows.

This came out of the Vision/PDF harness (`run-vision.mjs`), which went from "20 rows never tested by anything" to 19/20 automated in one sitting. The insight: **the expensive part of testing was never the running — it was a human clicking through.** Wherever a flow can be driven by an API call plus a file, it can be automated.

---

## What already exists (do not rebuild)
- `acrowell-ai-worker/test/corpus/run.ts` — 608-row intent corpus (588 runnable).
- `run-with-login.mjs` — signs in and tees output to a results file.
- `run-vision.mjs` — 20 Vision/PDF rows with real attachments. **19/20.**
- `Files/stress-test-assets/` — 11 real bills (5 Acrowell invoices, 6 larger photo-scale ones), 2 product photos (Allowish face wash = existing Acrowell product; Fruiter Syrup = non-catalogue), visiting cards, a credit note.
- `leadenthrella/scripts/ship.sh` — typecheck gate → build → deploy → propagation check.

## What this plan adds

### Tier 1 — extraction accuracy (highest value, cheapest)
Run all 11 real bills through the Worker's `/extract` endpoint and report what came back per bill: party name, invoice no, date, line-item count, subtotal/GST/total. Today nothing checks whether the numbers it reads are *right* — only that it picked the right intent.
Needs a small expected-values file (Harish reads each bill once, writes the true totals). That one-time effort turns 11 bills into a permanent regression suite.

### Tier 2 — role-gating (a real hole)
`run.ts` hardcodes `role: "admin"` for every row, so **reps-see-only-their-own-data has never been tested by anything.** It is one of the four standing product rules. Run a subset as a rep token and assert refusals/scoping.

### Tier 3 — duplicate detection
Upload the **Allowish** photo (a product already in the catalogue). It should recognise the existing product, not silently create a second copy. Nothing tests this today.

### Tier 4 — CRM flows without the AI
Drive the ordinary paths through PostgREST with a real session: create → edit → soft-delete → restore from Trash → confirm totals move. This is where 25 Jul's worst bug lived (deleted payments still counted as paid) and no automated test would have caught it.

### Tier 5 — the app itself
Browser-driven checks of the things only a rendered page shows: the invoice JPG actually containing totals, the share sheet opening, Trash tabs scrolling. Lowest priority, highest effort.

---

## Sequencing
Tier 1 → 2 → 4 first; they are cheap and cover the areas that actually broke. Tier 3 is a nice-to-have. Tier 5 only if the others are stable.

## Traps (learned the hard way — see the test-harness memory)
- **Purge the Gemini prompt cache after any prompt edit**, or the run measures the previous prompt. This wasted three separate runs on 25 Jul.
- **Every Gemini-backed run costs real budget** and each account is capped at 500K tokens/day. Deterministic tiers (2, 4) cost nothing — prefer them.
- **Never let Claude handle the test-account password.** Harish exports it; the runner reads it from the environment only.
- `corpus.json` is exported from the xlsx — hand edits are lost on re-export.
