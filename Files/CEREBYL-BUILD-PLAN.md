# CEREBYL BUILD PLAN — execution plan for `CEREBYL-BUILD-SPEC.md`

**Written:** 10 Aug 2026 · Claude Opus (lead)
**Source of truth for WHAT to build:** `~/Desktop/CEREBYL-BUILD-SPEC.md` (24 features, 6 phases).
**This document is HOW we build it** — batching, lanes, ticket structure, gates, and who does what.

> **Division of labour (Harish's instruction, 10 Aug):** the lead agent does planning, ticket
> authoring, diff review, migrations and deploys. **Everything else goes to DeepSeek V4 Flash via
> aider.** No lead-written feature code. The five things the lead never delegates (CLAUDE.md §2)
> stay non-delegated: diff review, architecture calls, AI prompt edits, DB migrations, live-infra
> debugging. Those are the 5%.

---

## 0. What I found before planning (read this first — it changes the spec)

Three findings materially alter the spec's sequence. All three are architecture calls, so they are
mine, and they are why this plan does not just mirror Part 2 of the spec.

### 0.1 🚨 F1 (offline-first) is BLOCKED on the mobile shell, not on sync code

`leadenthrella/mobile/capacitor.config.ts` sets `server.url = 'https://app.cerebyl.com'` and
`webDir: 'www'` is an explicit stub — **nothing is bundled into the APK.** The Android app is a
WebView pointed at a remote URL. With no network it does not render a cached screen; it renders
nothing at all. Every word of F1 — local cache, write queue, "Saved, will send when you're back
online" — is unreachable until the shell serves assets locally.

That is a real fork with real cost, and it is the first thing that needs a decision:

**DECIDED 10 Aug 2026 (Harish): Option A — bundled assets with OTA web-bundle updates.**

| Option | What changes | Verdict |
|---|---|---|
| **A. Bundle assets into the APK + OTA updates** — `webDir` gets the real build; a writable data-dir bundle is swapped at runtime from R2 | Build pipeline (`scripts/build-branded-apk.sh`, GitHub Actions) runs `npm run build` and copies `.output/public`; a live-update plugin downloads newer bundles | **CHOSEN** |
| B. Service worker on the remote URL | No pipeline change | Rejected — depends on Android WebView SW quirks, first launch still needs network, and it wins less than A |
| C. Hybrid shell-bundled + remote chunks | Best of both on paper | Rejected — most moving parts for the least marginal gain over A |

**Why A stopped being a trade-off.** The first draft of this plan said A costs the "push a fix and
every phone has it in 60s" advantage. That was wrong: Capacitor can load the WebView from a
**writable app-data directory**, so the APK ships baked-in assets as a *baseline* and the app
downloads newer web bundles over the air, applying them on next launch. This is the CodePush
mechanism, explicitly permitted by both stores as long as downloaded code does not change the app's
primary purpose. Result:

| Change type | Delivery |
|---|---|
| UI, routes, hooks, styling, bug fixes — **~99% of our work** | OTA bundle, next launch, no store involvement |
| New Capacitor plugin, new Android permission, Capacitor bump | Store release — historically 3–4 times total |

**We already own most of the pipe.** `src/components/app-update-prompt.tsx` already compares the
running `versionCode` against the latest ready build; `src/lib/mobile-app.ts` holds the comparison
logic; branded APKs already sit in a **private R2 bucket behind presigned URLs after an entitlement
check**. An OTA bundle is a smaller artifact through the identical pipe. The difference is that
today's prompt makes the user reinstall an APK; OTA swaps silently.

**The one non-negotiable detail: a boot fail-safe.** If a downloaded bundle fails to boot, the app
must revert to the baseline baked into the APK. Without it, one bad bundle bricks every phone with
no way to push a fix — strictly worse than today. Any live-update implementation that lacks this is
rejected on sight.

Implementation note: an open-source, self-hostable Capacitor live-update plugin
(`@capgo/capacitor-updater`) can serve bundles from our own R2; a hand-rolled swap on
`@capacitor/filesystem` is also viable. **Batch 0.9 prototypes it before we commit** — see below.

### 0.1b Owner decisions, 10 Aug 2026 — these override the spec where they differ

**Territory collisions never block.** The spec (F4b) says an overlap "blocks the write". Harish's
ruling: **no block for reps or managers — either may override, but the override requires a reason,
and that reason auto-creates the dispute record.** Rationale given: this is not tightly regulated in
Indian pharma, so leniency is correct and a hard block would obstruct legitimate reassignment. This
also matches the behaviour already shipped, where the UI says *"You can still save — the manager may
be reassigning deliberately."*

Consequences for Batch 2A: F4b becomes **"require a reason and record a dispute"**, not "block the
write". The pre-write check still runs and still detects the overlap — it just gates on a reason
instead of refusing. Note that `party_territories` RLS is `is_manager_or_admin()`, so reps cannot
book territories at all today; **the rep-facing primitive is the F4a soft-hold**, which needs its own
table with its own rep-writable policy. Do not widen the booking table's RLS.

**Leads sort by date received, newest first.** Recorded as a documented exception to the
alphabetical-default rule in `CLAUDE.md` §5. The key is `date_received`, not `created_at`.

**FCM is READY as of 11 Aug 2026 — no longer a blocker.** Firebase project `cerebyl` under the
`enthrella.com` org, Sender ID `873469779814`, FCM API (V1) enabled, Android app registered for
`com.cerebyl.app.base`, `google-services.json` committed. Service-account key lives OUTSIDE the repo
at `~/Documents/cerebyl-fcm-service-account.json` and is gitignored by pattern. **FCM registers per
package name, so every branded per-company APK needs its own Firebase Android app and its own
google-services.json baked into that build** — an APK-pipeline change, not a console click. Budget
for it in 1C.2.

**Adoption analytics: NOT Google/Firebase Analytics** (decided 11 Aug 2026). The shell is a WebView
pointed at a remote URL, so Firebase Analytics can only ever see `app_open` — everything interesting
happens inside the WebView and would need event-by-event bridging, which breaches the rule that
`src/` never imports `@capacitor/*`. It also adds a sub-processor to the DPDP surface for near-zero
signal. Measure adoption from our own database, where every meaningful action is already a row.
Crashlytics before Analytics if mobile telemetry is ever wanted.

### 0.2 Several spec features already exist in part — audit before building

Per the standing rule (`CLAUDE.md` §8b, memory *"Audit before building"*), every backlog in this
project has listed shipped work as outstanding. Evidence already found:

| Spec item | What already exists | Verdict |
|---|---|---|
| F15 My Day | `src/components/my-day-content.tsx` (283 lines), `src/routes/my-day.tsx` | Likely a **read-only** dashboard, not a task system with Done/Postpone/Dismiss + a `tasks` table. Extend, don't rebuild. |
| F6 schemes | `src/lib/use-offers.ts` — header says **"DISPLAY ONLY — nothing here is ever auto-applied to an order"** | Real build, but it must *extend* offers, not replace them. Two scheme concepts side by side would be a disaster. |
| F14 statement | `src/routes/portal.statement.tsx`, `portal.dues.tsx` | Ageing buckets + dispute flag may be partly there. |
| F4 territory | `party_territories` table (mig `20260810120000`), `use-territories.ts`, `territory-map.tsx`, `/booked-areas` | Bookings exist. **Holds, collision blocking and disputes do not.** |
| F17 push | Stage 1 local notifications shipped 5 Aug (`device-notifications.ts`) | Spec's "not built" is stale; the gap is **FCM only**. |
| F13 deep zoom | `product_media` table, `product-image-lightbox.tsx` | May be most of the way there. |
| F9 calculator | `portal.product.$productId.tsx`, `product_pts_ptr` migration | PTS/PTR data exists; the calculator UI may not. |

**Batch 0 is seven DeepSeek *investigation* tickets that change no code** and report file:line
evidence. I fold their answers into the real tickets. This costs ~1 day and has already paid for
itself twice on this project.

### 0.3 F11 folds into F8, and F24 must run before F23

The spec already recommends one status ladder for credit tier + loyalty. Treating them as separate
features invites a parallel implementation; in this plan **F11 is a sub-ticket of F8**, never a
batch of its own. And F24 (score the corpus) is the regression gate for F23 (provider abstraction) —
scoring must complete and be *read* before any model swap. The 25 Jul run reached the last row and
the summary scrolled away unread; that is not a score.

---

## 1. The batching principle

Three rules decide what gets built alongside what.

**Rule 1 — batch by file surface, not by theme.** Two features that touch the same files must be
serial; two that touch disjoint files can run concurrently in separate worktrees. The single biggest
structural fact in this repo is that **the rep-side surface (`src/routes/leads*`, `use-leads.ts`,
`my-day*`) and the distributor-side surface (`src/routes/portal.*`, `src/lib/portal*.ts`, the portal
edge functions) share almost no files.** That is what makes two full lanes possible.

**Rule 2 — schema first, one migration per batch.** Every batch opens with a schema sub-ticket
DeepSeek *writes* as SQL and I *review and apply by hand* via the SQL Editor (never `db push`), one
tap-to-copy block per migration. Feature tickets then never block on schema, and I only do one
manual DB session per batch instead of one per ticket.

**Rule 3 — a stable ticket preamble, a changing tail.** DeepSeek's disk cache is automatic and
keyed on prefix, so every ticket in this programme opens with the **identical** preamble block
(project conventions, standing rules, verification contract) and puts the delta at the end. One
preamble file, reused verbatim ~60 times.

### The three lanes

| Lane | Owns these files | Runs |
|---|---|---|
| **A — Rep / company app** | `src/routes/leads*`, `dashboard.tsx`, `my-day*`, `src/lib/use-leads.ts`, `use-tasks.ts`, territory files, `src/components/lead-*` | Batches 1A → 5A |
| **B — Distributor portal** | `src/routes/portal.*`, `src/lib/portal*.ts`, `supabase/functions/portal-*` | Batches 1B → 4B |
| **C — Infra / AI worker / mobile** | `acrowell-ai-worker/**` (separate repo), `leadenthrella/mobile/**`, `src/lib/offline/*`, `src/lib/device-notifications.ts` | Continuous, disjoint from A and B |

**Max three concurrent aider agents**, one per lane, each in its own git worktree with explicit file
ownership (this pattern is proven — see memory *"Parallel Kimi agents"*). Shared files
(`src/lib/features.ts`, `permissions.ts`, `src/routes/__root.tsx`, `styles.css`) are **owned by
nobody**: any change to them is a separate, serialised ticket I schedule between batches.

> ⚠️ **Worktrees never receive `.env` (gitignored), so a build from a worktree reproduces the
> MISSING-ENV trap exactly.** Worktrees are for *coding only*. Every build, `ship.sh` run and deploy
> happens in the main checkout after merge.

---

## 2. The batches

Effort is DeepSeek ticket count, not calendar time. Dependencies are hard unless marked soft.

### Batch 0 — Audit & decisions · *blocking, ~7 tickets, all investigation*
Seven read-only tickets, one per row of §0.2, each reporting exact files, line numbers, data flow,
and a "build / extend / already done" verdict. Plus **0.8: corpus scoring (F24)** — DeepSeek fixes
the harness to write a machine-readable summary, I run it and *read* the result.
**Gate:** your decision on §0.1 (offline architecture). Nothing in Batch 1C starts without it.

### Batch 1C — Platform infrastructure · *lane C, ~8 tickets, parallel with 1A and 1B*
| # | Feature | Notes |
|---|---|---|
| 1C.1 | **F23** AI provider abstraction | Separate repo (`acrowell-ai-worker`) — zero conflict risk. Task taxonomy `classify / extract / ocr / analyse / converse`, model+tokens+latency logged against existing metering. **Prompt files are mine, not DeepSeek's** (§2 hard rule) — DeepSeek does the routing layer, I do any `prompt*.ts` edit. |
| 1C.2 | **F17** FCM push infra | Device token registration, per-category prefs, quiet hours, deep-link payload. **Needs a Firebase project from you** — it is the one external dependency in the whole plan. |
| 1C.3 | **F1** offline foundation | Per the §0.1 decision. Local store, write queue with client-generated IDs, idempotent server handling, sync-state indicator component, explicit cacheable/never-cached lists (dues, live stock, ledger = never), price-change confirmation rule. |

### Batch 1A — Rep productivity core · *lane A, ~10 tickets*
F15 tasks (schema → auto-population → three-action row → manager injection → offline queue),
F2 speed-to-lead (`first_contact_at`, SLA config, countdown badge, breach notify, the three
reports), F18 ranking as filter options on top of the existing saved-filters mechanism.
**F16 voice-note splits across lanes:** the transcription/extraction endpoint is a lane-C ticket on
the worker; the record→review→confirm UI is a lane-A ticket. It ships only after a real
Hindi/Punjabi/English code-switched test with actual reps — that is a you-and-me task, not a
DeepSeek one.
**Depends on:** 1C.1 (F16 extraction), 1C.2 (1A push wiring), 1C.3 (task completion offline).

### Batch 1B — Distributor quick wins · *lane B, ~7 tickets, parallel with 1A*
F9 margin/GST calculator (S, self-contained, best first ticket in the lane), F13 deep-zoom
(pending the 0.2 audit — may be near-done), F14 statement + ageing + **per-invoice dispute flag**
routing to a company task (so it lands after 1A's `tasks` table exists — soft dependency, sequence
it late in the batch).

### Batch 2A — Territory hardened · *lane A, ~9 tickets*
F4a soft-hold first and **alone** (the spec is right: it removes most double-booking by itself),
then F4b collision detection (block the write, never overwrite; auto-open a dispute), F4c dispute
resolution (manager/admin only via **restrictive** RLS, immutable audit rows), F4d dormancy review
queue that **never auto-releases**. Then **F3 objection library** — new tables, contextual surfacing
inside the lead record filtered by product interest, rep-submit/manager-approve, usage tracking,
and wiring the same taxonomy into the lost-reason picker.
**Depends on:** Batch 0 territory audit; 1A `tasks` table (dormancy + dispute both create tasks).

### Batch 2B — Scheme engine · *lane B, ~8 tickets*
F6, the largest distributor item. Rules engine (quantity slabs, value slabs, X+Y free goods,
percentage, combos, time-bound), **server-side computation**, cart-time prompts, and the invariant
that matters commercially: **the scheme is locked to the order at the rate displayed.** Configurable
globally / by party group / per party, stacking correctly on party rate cards.
**Must extend `use-offers.ts`, not duplicate it** — see §0.2. Pair with F10 predictive reorder
(cadence detection, explainable cards, one-tap basket, near-expiry suppression) since both live in
the cart surface.

### Batch 3C — Composition index · *lane C, ~4 tickets*
F12's prerequisite: normalised molecule+strength index across the catalogue, composition-family and
therapeutic-category grouping. Independently useful (it improves existing molecule search), so it
ships and proves itself before 3A depends on it.

### Batch 3A — Photo-to-product · *lane A + C, ~8 tickets · the flagship*
F12. OCR pass → composition extraction → match against the 3C index → exact match routes to the
product page, no match routes to a filtered composition-family list. Works on any company's
packaging. Graceful partial reads with user correction, aggressive caching.
**The regulatory framing is a hard constraint enforced in two places** — the model prompt (mine) and
the UI copy (DeepSeek's, with my review): catalogue navigation results only, never therapeutic
substitution language, "Business tool only" footer on every screen.

### Batch 3B — Branded catalogue generator · *lane B, ~6 tickets*
F7. Two-key entitlement (`CONSOLE → ADMIN`, `DEFAULT_OFF_FEATURE_KEYS` + `CONSOLE_ONLY_FEATURE_KEYS`,
exactly the F8-mobile pattern already proven in `features.ts`), the granular company-set permission
matrix, four output formats. Reuses the existing html2canvas/PDF machinery — **and the invoice-JPG
lesson applies verbatim**: render from a dedicated off-screen printable node at
`position: fixed; left: -10000px`, never `display:none`.

### Batch 4B — Credit, tiers, loyalty · *lane B, ~7 tickets*
F8 scoring model (payment timeliness weighted recent, order consistency, dispute rate, tenure, value
trend), admin-set thresholds and benefits, transparent to the distributor, manual override, change
logging, advance warning before a tier drop. **F11 loyalty is implemented inside this as one status
ladder**, never a parallel one. The schema here determines whether F22 is ever possible — design it
with that in mind now, build nothing of F22 yet.

### Batch 5A — Intelligence · *lane A, ~8 tickets*
F19 predictive stock-out (velocity + lead time + batch stock, expiry-aware, flags on the products
list not a report), F20 proactive alerts (five types, console-gated default off, every alert links
to source records and is dismissible with a reason), then **F5 coaching digest LAST** — it needs a
quarter of real F2/F15 data behind it and is worthless before that. Reuses the Tier-2 whitelisted
aggregate tools, which is what structurally prevents hallucinated numbers.

### Batch 6 — Built dark · *~6 tickets, only after 5A is live*
F21 benchmarking (minimum cohort **enforced in code**, opt-in, aggregates only, security-definer
computation with no raw cross-tenant read path — and if the isolation model has to bend, we stop),
F22 cross-company credit signal (schema + computation, off, unmarketed, legal review before it is
ever switched on).

### Rough shape

```
        Batch 0  ──────────────► (audit + your offline decision)
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
  1A        1B        1C          ← three lanes, concurrent
   │         │         │
  2A        2B        3C
   │         │         │
   └────► 3A ◄─────────┘          ← 3A needs 3C's index + 1C's provider layer
             │
            3B ──► 4B
             │
            5A ──► 6
```

---

## 3. How each ticket is built and accepted

### The preamble (written once, reused verbatim ~60 times)
`Files/scratchpad/TICKET-PREAMBLE.md` — project identity, the §5 standing product rules, the
never-regress list, the file map, and the verification contract. Attached to every aider run as
`--read`, alongside `.claude/skills/cerebyl-context/SKILL.md`. Cache hits come from this being
byte-identical every time; the ticket body is the delta.

### The invocation
```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && \
aider --yes-always --no-auto-commits --no-suggest-shell-commands \
  --read .claude/skills/cerebyl-context/SKILL.md --read ../Files/scratchpad/TICKET-PREAMBLE.md \
  --file <files to edit> --read <reference files> \
  --message-file ../Files/scratchpad/tickets/<batch>-<n>.md
```

### Every ticket carries the same five sections
1. **Goal** — one paragraph, user-visible outcome.
2. **Files** — exact paths to edit, exact paths to read. Nothing else may be touched.
3. **Approach** — numbered steps, including which existing pattern to copy (`Combobox`,
   `ConfirmDelete`, `chart.tsx`, `fetch-all`, the `DropdownMenu + ghost MoreVertical` delete pattern).
4. **Constraints** — the standing rules relevant to *this* ticket, restated (bar chart never pie;
   alphabetical default sort; reps see only their own data; every paged query ends
   `.order("id", { ascending: true })`; no `Enthrella`/`Acrowell` in UI; feature keys fail closed).
5. **Acceptance** — `npx tsc --noEmit` = **0**, `npm run test` green, new tests written **and
   mutation-verified** (break the code, watch the test go red, restore), `git status` reviewed,
   **commit locally, do not push.**

### My review loop per ticket — the part that is not delegable
- Read the **full `git diff`**, specifically hunting for **deletions**. This worker has a proven
  habit of removing shipped features while restyling (memory: *"DeepSeek worker review"*).
- Confirm no stray files, no shared-file edits it didn't own, no test that passes by never running.
- Do **not** re-run a verification the worker already ran and reported (§2 rule 2) — read the diff
  instead.

### My gate per batch
`./scripts/ship.sh --dry-run` → full `ship.sh` → **load the live URL in the Browser pane and read
console + network.** A green build proves nothing (memory: *"A green build proves nothing"*, and
the MISSING-ENV outage). Never verify a deploy by comparing local `.output` filenames to live.
Then the §2b push checklist, then a `WORKLOG.md` entry.

---

## 4. What only you can supply

1. **The §0.1 offline architecture decision** — blocks 1C.3 and, downstream, F1's application to the
   portal cart. Everything else proceeds meanwhile.
2. **A Firebase project + service account** for FCM (1C.2). External dependency, no code path around it.
3. **Real reps for the F16 voice test** on code-switched Hindi/Punjabi/English. The plumbing is easy;
   the transcription quality is the entire risk, and a clean-English demo proves nothing.
4. **Applying each batch's migration** in the Supabase SQL Editor — I hand you one tap-to-copy block
   per migration (memory: *"One SQL per block"*).
5. **Indian counsel** before F12 ships production copy, and before F21/F22 are ever switched on.
   Not a blocker for building; a hard blocker for enabling.

## 5. What I am flagging as risk, not blocking on

- **F1 is scoped L and is the most likely thing to slip.** It is also the adoption gate for the whole
  portal. If §0.1 goes badly, the honest move is to ship F1 as offline-*tolerant* and say so.
- **F12's value depends entirely on catalogue data quality.** If compositions in `products` are free
  text with inconsistent strength formats, the 3C index is a data-cleaning project wearing an AI hat.
  The Batch 0 audit will tell us; I have not assumed either way.
- **F6 must not fork the offers concept.** Two scheme systems in one cart is worse than no scheme
  engine.
- **This is ~90 DeepSeek tickets across six months of scope.** The plan is designed so that stopping
  after any batch leaves a coherent product, not a half-built one.
