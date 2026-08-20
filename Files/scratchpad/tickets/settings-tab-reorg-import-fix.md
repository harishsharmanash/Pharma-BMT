# Ticket: Fix missing Select import in settings.index.tsx

## Goal

`npx tsc --noEmit` fails with ~30 errors, all "Cannot find name 'Select'/'SelectTrigger'/
'SelectValue'/'SelectContent'/'SelectItem'" in `src/routes/settings.index.tsx`. The
`WhatsAppSetupCard` component (moved into this file in the previous edit) uses these components
but the import was never added.

## Files

**Edit:** `src/routes/settings.index.tsx`

## Approach

Add this import line near the other `@/components/ui/*` imports at the top of the file:
```ts
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

Also fix the one remaining `Parameter 'v' implicitly has an 'any' type` error — it's on the
`onValueChange={(v) => setMode(v as "single" | "multi")}` line inside `WhatsAppSetupCard`. Type
the parameter explicitly: `(v: string) => setMode(v as "single" | "multi")`.

## Constraints

- This is the ONLY fix needed — do not touch anything else in the file. Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `git status` — only `src/routes/settings.index.tsx` modified.
