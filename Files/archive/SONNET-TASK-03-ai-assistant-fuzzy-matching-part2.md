# Sonnet Task 03 — AI assistant fuzzy matching, part 2 (SS8b continued)

**Run as:** Claude Code, Sonnet, in `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`.
**Scope:** `src/lib/use-assistant.ts` only. Pure client-side matching logic — the AI Worker is unaffected, no migration, no deploy needed.

## Background
Commit `1d7e32b` ("AI assistant: fuzzy, punctuation-insensitive name matching (SS8b, part 1)") replaced raw substring matching with normalized + ranked matching (`normalize()`, `tokens()`, `nameScore()`, `rankByScore()`) in the four exported resolver functions: `resolveLeadMatches`, `resolvePartyMatches`, `resolveProductMatches`, `resolveTransporterMatches`. That fixed cases like "acrexa 120" failing to match "Acrexa-120".

That commit was explicitly marked "part 1." A grep of the file turns up roughly 9 more raw `.toLowerCase().includes(...)` call sites that have the same fragility and were not touched:

- `~line 470` — order lookup by invoice_no / party firm_name
- `~line 481` — dropdown-option value matching (has its own comment `§V2.0.3` — "Never invents a new value," read that context before changing)
- `~line 768` — inline product lookup by name (duplicates logic `resolveProductMatches` already has — should probably just call the resolver instead of re-implementing)
- `~line 776` — inline party lookup by firm_name (same duplication issue vs. `resolvePartyMatches`)
- `~line 786` — inline transporter lookup by name (same duplication issue vs. `resolveTransporterMatches`)
- `~line 1305` — document-type match
- `~line 1458` and `~line 1936` — product lookup by division/category/name (two near-identical blocks — check if they should also just call `resolveProductMatches`)
- `~line 2192` — stock location lookup by name
- `~line 2382` — **rep full-name matching for lead/party assignment** — this is the highest-value fix in this batch, since a manager typing a slightly-off rep name (typo, missing middle name, etc.) during an assign action is exactly the kind of failure the part-1 fix was written to prevent elsewhere.
- `~line 2550`, `~line 2582` — city / batch_no filters — lower priority, these are filters over an already-narrowed result set, not entity resolution; use judgment on whether fuzzy-matching them adds real value or just risk. Fine to leave as plain substring if they're filtering, not resolving.

Line numbers are from the state at commit `1d7e32b` — re-grep before editing, they may have shifted:
```bash
grep -n "\.toLowerCase().includes\|\.filter((.*=>.*includes" src/lib/use-assistant.ts
```

## What to do
1. Read the full `nameScore`/`rankByScore`/`normalize`/`tokens` implementation already in the file (search for "Fuzzy, punctuation/space-insensitive name matching") to understand the exact pattern to extend.
2. For each of the entity-resolution call sites above (**not** the two filter-only ones unless you judge it clearly helps), replace the raw `.includes()` check with the same `normalize()`/`nameScore()` approach — either by calling the existing exported resolver function directly (preferred where the duplication is exact, e.g. the inline product/party/transporter lookups), or by writing an equivalent scored match inline where the entity type doesn't have an existing resolver (rep names, document types, stock locations).
3. For the **rep-name match** (`~line 2382`) specifically: this assigns a lead/party to a rep by name text the user typed — make sure a close-but-imperfect name still resolves to the *best* match, not silently fails or grabs a wrong lower-quality match. This is user-facing correctness, treat it carefully.
4. Do not change the AI Worker, any prompt, any cache logic, or any other file. Do not change the *exported* resolver functions' signatures — only their internal callers/duplicated inline logic.
5. If you find a call site where fuzzy-matching would change existing behavior in a way you're not confident about (e.g., the dropdown-option matcher at `~481` has an explicit "never invents a new value" constraint — don't loosen that), leave it and note it in your report rather than guessing.

## Verify
```bash
cd "/Users/harishsharma/Claude/Pharma BMT/leadenthrella"
npx tsc --noEmit 2>&1 | grep -c "error TS"   # must stay 139
bun run build                                  # must succeed
```

## Report back
List every call site you changed (with before/after line numbers), which ones you left alone and why, and confirm tsc stayed at 139 and the build passed.
</content>
