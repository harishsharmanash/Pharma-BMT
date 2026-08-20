# TICKET 2A.2b — The holds panel never filters out dead holds

## The defect

Your own test caught this, which is exactly what it is for:

```
× hides expired and released holds, shows a live one
TestingLibraryElementError: Found multiple elements with the text: /expired/i
```

`src/components/territory-holds-panel.tsx` imports `describeHoldRemaining` but **not `isHoldLive`**,
and its only transformation is a sort:

```ts
const sorted = [...holds].sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime());
```

So expired holds and released holds are rendered, each showing "expired". The panel's purpose is to
show what is **currently claimed**; a list padded with dead holds actively misleads a rep into
thinking ground is taken when it is free. The ticket specified filtering with `isHoldLive`.

## The fix

In `src/components/territory-holds-panel.tsx` only:

1. Import `isHoldLive` from `@/lib/territory-holds`.
2. Compute `now` **once** per render (`const now = new Date().toISOString()`), then
   **filter with `isHoldLive(hold, now)` before sorting**, and pass that same `now` into
   `describeHoldRemaining` instead of calling `new Date().toISOString()` per row. One clock read per
   render means a row can never disagree with the filter that admitted it.
3. The count in the header must reflect the filtered list, not the raw one.
4. Keep the empty state: when no holds are live, render the single quiet line rather than an empty
   card.

Do not change the test — it is correct and it found this.

## Acceptance
- All tests in `src/test/territory-holds-panel.test.tsx` pass.
- Removing the `isHoldLive` filter must make a test fail again. Confirm that is the case.
- Do not run shell commands; you cannot. Do not commit.
