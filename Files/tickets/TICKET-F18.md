# TICKET F18 — lead-list ranking options

Do NOT commit. Do NOT run tsc/tests/shell. Work ONLY on the four files below.
Match the existing code style (see the --read files). Keep it small and precise —
if you find yourself writing the same sentence twice in your reasoning, STOP and
emit the edit instead.

## 1. New `src/lib/lead-ranking.ts` (currently a one-line placeholder)

Pure, dependency-free helpers. Import types from `./crm` (`Lead`) and
`./speed-to-lead` (`SlaConfig`, `slaStateFor`), and `Territory` from
`./use-territories`. Header comment block in the style of speed-to-lead.ts:
state plainly that these are RANKING KEYS for the leads list sort select —
heuristics, not scores persisted anywhere — and document every weight.

```ts
// --- lead score: temp dominates, stage progression breaks ties ---
const TEMP_WEIGHT: Record<string, number> = { Hot: 40, Warm: 25, Cold: 10 };
const STAGE_WEIGHT: Record<string, number> = {
  New: 0, Contacted: 5, "Details Shared": 10, Interested: 20, Negotiating: 30,
};
export function leadScore(lead: Lead): number
// TEMP_WEIGHT[temp ?? ""] ?? 0, plus STAGE_WEIGHT[stage] ?? 0, plus 5 when
// first_contact_at is set. Won/Lost leads score 0 (they are done, not leads).

// --- historic conversion likelihood, per source ---
export function winRateBySource(leads: Lead[]): Map<string, number>
// decided = stage Won or Lost; rate = won / decided; a source with no decided
// leads maps to 0 (documented: no history ranks below any track record).

// --- SLA risk key ---
export function slaRiskMinutesLeft(lead: Lead, cfg: SlaConfig, now: Date): number
// slaStateFor(lead, cfg, now)?.minutesLeft ?? Number.POSITIVE_INFINITY
// (non-New / contacted / Won / Lost leads are not at risk -> sort last).

// --- territory coverage (Harish: UNCOVERED areas rank FIRST) ---
export function isTerritoryCovered(lead: Lead, territories: Territory[]): boolean
// true when any territory matches, case-insensitive trimmed:
// territory.state === lead.state, OR territory.district === lead.area_city.
// Empty lead fields never match.
```

Then the sort comparators. ALL of them: decided-on leads (stage Won/Lost) sort
AFTER open leads; final tie-break is `compareByReceived(a, b)` (already exported
from `../routes/leads.all` — no, wait: circular import. Instead accept that the
caller chains tie-breaks; each comparator returns 0 on ties and leads.all chains
`|| compareByReceived(a,b)` itself.)

```ts
export function compareByScore(a: Lead, b: Lead): number        // higher score first
export function compareBySlaRisk(a, b, cfg, now): number        // smaller minutesLeft first
export function compareByNeglect(a: Lead, b: Lead): number      // larger daysSinceContact first (import from ./crm)
export function compareByConversion(winRates: Map<string, number>): (a: Lead, b: Lead) => number  // lead's source rate, higher first; missing source = 0
export function compareByTerritory(territories: Territory[]): (a: Lead, b: Lead) => number        // uncovered (isTerritoryCovered === false) FIRST
```

## 2. New `src/lib/lead-ranking.test.ts` (placeholder)

Vitest, style of `speed-to-lead.test.ts`. Minimal `Lead` fixtures via a
`mkLead(partial)` helper with sensible defaults. Cover:
- leadScore: Hot New = 40; Hot + Contacted + contacted = 50; Cold Negotiating = 40; Won anything = 0.
- winRateBySource: 2 Won 1 Lost on Meta → 2/3; source with only New leads → 0.
- slaRiskMinutesLeft: a fresh uncontacted New Hot lead → finite ~15; a Contacted lead → Infinity.
- isTerritoryCovered: state match, district match, case/whitespace difference, no match, empty lead state never matches.
- comparators: one ordering assertion each, including "decided leads last" and "uncovered before covered".

## 3. `src/routes/leads.all.tsx`

- Add five entries to `LEAD_SORT_OPTIONS` / `LeadSortOption` (keep existing ones
  untouched; `received_desc` stays the default):
  `sla_risk` "SLA risk", `lead_score` "Lead score", `neglect` "Days since contact",
  `conversion` "Conversion likelihood", `territory` "Territory: open areas first".
- The page already has `slaConfig` (useCompanySla) and `filtered` memo with the
  comparator switch — add the five cases there. `sla_risk` needs a `now` captured
  inside the memo (the page already re-renders on a 60s timer for the SLA badge —
  reuse that if present, else `new Date()` in the memo is fine).
- For territory: call `useTerritories()` from `../lib/use-territories` in the
  component (it's a react-query hook, cached — cheap) and pass `territories ?? []`.
- Chain every new comparator with `|| compareByReceived(a, b)` as the tie-break.
- The saved-filter object already carries `sortBy` and its reads are
  version-tolerant — no saved-filter changes needed; do not touch use-saved-filter.

## 4. No other file changes.

## Done criteria

Report: files touched, the exact option keys added, any deviation from this spec
and why. Do not claim tests pass — you cannot run them.
