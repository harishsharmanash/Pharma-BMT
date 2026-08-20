# Ticket: parameterise `seed-test-company.ts` so it can seed a SECOND company

## Goal

`scripts/seed-test-company.ts` currently hardcodes one fixture company ("Enthrella Biotech") and one
manifest path. We need to run the exact same battle-tested seeding logic a second time to create a
**separate demo company for Meta App Review**, without touching or endangering the existing
Enthrella Biotech fixture (which `npm run test:isolation` depends on).

Make the company name, email domain, and manifest path **overridable by environment variables**,
defaulting to today's values so every existing call site and the isolation test keep working
unchanged.

## Files

**Edit:** `scripts/seed-test-company.ts` — only the constant declarations and the header comment.

**Read only:**
- `scripts/seed-isolation-check.ts` or whatever `npm run test:isolation` points at (check
  `package.json` scripts) — to confirm nothing imports `COMPANY_NAME` in a way this would break.

## Approach

### 1. Make the three constants environment-overridable

Currently (around line 86):
```ts
export const COMPANY_NAME = "Enthrella Biotech";
export const EMAIL_DOMAIN = "seed.enthrellabiotech.test";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const MANIFEST_PATH = join(SCRIPT_DIR, ".seed-manifest.json");
```

Change to read from env with the SAME defaults:
```ts
export const COMPANY_NAME = process.env.SEED_COMPANY_NAME ?? "Enthrella Biotech";
export const EMAIL_DOMAIN = process.env.SEED_EMAIL_DOMAIN ?? "seed.enthrellabiotech.test";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const MANIFEST_PATH =
  process.env.SEED_MANIFEST ?? join(SCRIPT_DIR, ".seed-manifest.json");
```

**The defaults must be byte-identical to what is there now.** With no env vars set, behaviour must be
completely unchanged — this is the safety property that protects the existing fixture.

### 2. `MANIFEST_BACKUP_PATH` must follow the same override

`MANIFEST_BACKUP_PATH` (around line 267) already reads `process.env.SEED_MANIFEST_BACKUP`. Leave that
mechanism as-is, but check: if a caller overrides `SEED_MANIFEST` and does NOT override
`SEED_MANIFEST_BACKUP`, the second company's manifest would be mirrored over the FIRST company's
backup file. That is a data-loss trap.

Fix it by deriving the default backup path from the manifest filename rather than hardcoding one
name. Read the current default and make the fallback include the manifest's basename so two
different manifests can never collide. Keep `SEED_MANIFEST_BACKUP` as an explicit override that still
wins.

### 3. Update the header comment block

The docstring at the top says `("Enthrella Biotech")` and `--apply refuses to run if "Enthrella
Biotech" already exists`. Update it to explain the env overrides and add a usage example:

```
 *   SEED_COMPANY_NAME="Cerebyl Demo Pharma" \
 *   SEED_EMAIL_DOMAIN="demo.cerebyl.test" \
 *   SEED_MANIFEST="scripts/.seed-manifest-demo.json" \
 *   node scripts/seed-test-company.ts --apply
```

Keep the existing safety notes intact — do not reword or weaken them.

## Constraints

- **Do NOT change any seeding logic, table list, plan data, or teardown behaviour.** This ticket is
  constants + comments ONLY.
- Do not change the dry-run default. Running with no flags must still write nothing.
- Do not touch `.seed-manifest.json` or any manifest file on disk.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green.
- `git status --short` → exactly one file changed: `scripts/seed-test-company.ts`.
- `git diff` must show changes ONLY to the constant declarations, the `MANIFEST_BACKUP_PATH`
  default, and the header comment. Any change to seeding or teardown logic is a ticket failure.
- In your report, quote the four constant declarations verbatim as they now read.
