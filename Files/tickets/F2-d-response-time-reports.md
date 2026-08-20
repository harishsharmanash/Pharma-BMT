# TICKET F2-d — speed-to-lead reports (response-time analytics)

Read `.claude/TICKET-PREAMBLE.md` first (attached as --read). It is the standing preamble; this
file is the delta.

## Goal

The F2 reporting surface: median and p90 first-response time by rep, by source, and by arrival
hour, plus conversion rate bucketed by response time. Data: `leads.first_contact_at` vs
`leads.created_at` (both timestamptz). Leads with NULL `first_contact_at` are EXCLUDED everywhere
(uncontacted or no evidence — never fabricate).

## What to build

### 1. Pure module `src/lib/response-time.ts` + `src/lib/response-time.test.ts`

```ts
export function responseMinutes(l: { first_contact_at?: string | null; created_at: string }): number | null;
// minutes between created_at and first_contact_at, rounded; null when missing or NEGATIVE
// (clock skew guard).

export function median(xs: number[]): number | null;   // null on empty; average of middle two on even
export function p90(xs: number[]): number | null;      // nearest-rank: sort asc, index ceil(0.9*n)-1

export type ResponseStat = { key: string; n: number; median: number | null; p90: number | null };
export function summarizeBy<T>(rows: T[], minutes: (r: T) => number | null, key: (r: T) => string): ResponseStat[];
// groups rows with non-null minutes, sorted alphabetically by key (standing rule:
// alphabetical default).

export type ConversionBucket = { label: string; maxMinutes: number | null };  // null = "+"
export const RESPONSE_BUCKETS: ConversionBucket[] = [
  { label: "≤15m", maxMinutes: 15 }, { label: "≤1h", maxMinutes: 60 },
  { label: "≤4h", maxMinutes: 240 }, { label: "≤24h", maxMinutes: 1440 },
  { label: ">24h", maxMinutes: null },
];
export type BucketStat = { label: string; decided: number; won: number; winRate: number | null };
export function conversionByBucket(
  rows: { minutes: number; stage: string }[],
): BucketStat[];
// A row lands in the FIRST bucket whose maxMinutes >= minutes (">24h" catches the rest).
// "decided" = stage Won or Lost; winRate = won/decided, null when decided = 0.
// Rows whose stage is neither Won nor Lost count toward neither.
```

Tests (mutation-guarded, per preamble): median odd/even/empty; p90 nearest-rank at n=10 (index 8)
and n=1; negative minutes → null; summarizeBy grouping + ALPHABETICAL key order (fixture keys
inserted non-alphabetically — if the sort is deleted the test must go red); bucket boundaries —
exactly 15 → "≤15m", 16 → "≤1h"; winRate null when no decided leads; open stages excluded from
decided. In your report list the exact mutations the lead should apply.

### 2. Route `src/routes/analytics.response-time.tsx`

Model on `src/routes/analytics.leaderboard.tsx` (attached as --read) for the guard and layout:
manager/admin only, `AnalyticsSectionHeader` with `lens="response-time"`, `useLeads()` for data,
`useProfiles()` for rep names.

Four cards, each a `Card` with a small table (not charts — numbers are the point here; charts
come later if wanted):

1. **By rep** — summarizeBy(leads, responseMinutes, l => repName(l.rep_id) ?? "Unassigned").
2. **By source** — key `l.source ?? "Unknown"`.
3. **By arrival hour** — key the arrival hour from `created_at` ("09:00"…"17:00" style label,
   e.g. `${String(h).padStart(2,"0")}:00`), via summarizeBy with an explicit sort by hour number
   ascending (chronological is the meaningful order here — alphabetical would scatter it; that is
   the documented exception, note it in a comment).
4. **Conversion by response time** — conversionByBucket over contacted leads, in RESPONSE_BUCKETS
   order (never alphabetical — fixed semantic order), columns: bucket, decided, won, win rate %.
   One muted line under it: "Won share of decided leads (Won + Lost) with a recorded first
   response. Open leads are excluded."

Column format: minutes under 60 as "Nm", else "Xh Ym" (reuse the formatHm idiom from
`src/lib/speed-to-lead.ts` — if that helper isn't exported, export a shared one from there rather
than duplicating).

### 3. Register the lens — `src/components/analytics-section-header.tsx`

Add `"response-time"` to the `AnalyticsLens` union and an entry
`{ value: "response-time", label: "Response Time", to: "/analytics/response-time" }` under the
same manager/admin + reports-permission condition as the leaderboard entry (read the file; mirror
its existing conditional pattern exactly).

## Constraints

- No new dependencies. No schema changes. Do NOT touch `speed-to-lead.ts` except exporting a
  shared minutes-formatter if needed.
- Alphabetical default everywhere EXCEPT the two documented cases above (hour-of-day chronological,
  bucket semantic order).
- Do NOT commit/push/git anything.
- You cannot run tsc/tests — say so; re-read your edits and report what you verified by eye.

## Report

Files changed, the exact mutations for the lead, anything the ticket got wrong.
