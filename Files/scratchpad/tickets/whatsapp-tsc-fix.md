# Ticket: Fix typecheck error in whatsapp.tsx delivery-tick rendering

## Goal

`npx tsc --noEmit` fails with one error:
```
src/routes/whatsapp.tsx(216,68): error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string'.
```
This is on the line checking `["delivered", "read"].includes(msg.delivery_status)` — `delivery_status`
is `string | null` in the DB type, but `.includes` on a `string[]` requires a `string`.

## Files

**Edit:** `src/routes/whatsapp.tsx`

## Approach

Find the line:
```ts
{isOut && ["delivered", "read"].includes(msg.delivery_status) && (
```
Change to handle the nullable type, e.g.:
```ts
{isOut && msg.delivery_status && ["delivered", "read"].includes(msg.delivery_status) && (
```
This is the only change needed — do not touch anything else in the file.

## Constraints

Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `git status` — only `src/routes/whatsapp.tsx` modified (on top of the already-staged changes
  from the previous ticket).
