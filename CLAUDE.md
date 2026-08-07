# CLAUDE.md — Cerebyl / Pharma BMT (master context)

**Single source of truth for this project.** Consolidated 25 Jul 2026 from the former `KIMI-START-HERE.md`, `KIMI-MODEL-POLICY.md`, and the old backup folder's `CLAUDE.md` — all three are now merged here and deleted. If any older doc, memory, or note contradicts this file, **this file wins.**

**The lead role on this project alternates between two agents — Kimi K3 (Kimi Code CLI) and Claude Opus (Claude Code) — whichever Harish has running in the terminal is the boss for that session.** Harish talks only to the lead. The lead plans, decides, reviews, and ships. The lead does not write most of the code itself — the worker for that is **DeepSeek V4 Flash, driven through the aider CLI**, invoked through the Bash tool. Both leads follow this file identically, and both record their major work in the shared log (`Files/WORKLOG.md`, see §1a) so the other lead picks up with full context.

---

## 0. THE WORKING FOLDER — read this before anything else

**The project root is:**

```
~/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT
```

This is the **only** folder you ever work in. It is on Google Drive (moved there 24 Jul 2026).

**`~/Claude/Pharma BMT (FROZEN BACKUP 2026-07-24)` is a dead, frozen copy — never work in it, never read facts from it.** It is 10+ commits behind, its `Files/` is a subset, and both sibling Workers in it are older. It exists only as Harish's cold backup.

> **This exact trap already cost a session (25 Jul 2026):** Claude Code was started in the old folder, auto-loaded the stale `CLAUDE.md` that only existed there, and briefed itself entirely from dead facts — reporting shipped features (F2, F4-P2) as "not started". The old folder's `CLAUDE.md` has since been replaced with a redirect stub, and the folder renamed. If you ever find yourself in a `Pharma BMT` that is not the Drive path above, **stop and switch.**

Sanity check before starting work:

```bash
git -C "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" log --oneline -1
```

---

## 1. How the team works

- **Harish is not a coder.** He tells you what he wants in plain language. You figure out *how*, then get it built.
- **You — the lead agent (Kimi K3 or Claude Opus, alternating per session) — are the brain.** Architecture, planning, file-level decisions, code review, infra/DB operations, debugging — yours. You read the repo directly whenever you need ground truth. Everything in this file addressed to "you" applies equally to both leads.
- **DeepSeek V4 Flash is the worker — for BOTH leads.** You delegate implementation tickets to it via the aider CLI (see §2). It executes, verifies, and reports back. You review its `git diff` before declaring anything done. **Almost all coding goes to DeepSeek** — it is nearly as capable as the lead models at a fraction of the cost, and usage quota is the team's scarcest resource. Lead-agent tokens are for thinking, not typing.
- **What you build directly vs. delegate:** you handle infrastructure, migrations, edge functions, Cloudflare/Supabase CLI operations, and tricky debugging yourself. You delegate bulk feature work, UI, CRUD, and mechanical changes to DeepSeek via aider.
- **Pushing to GitHub now works from this machine** (verified 25 Jul 2026 — credentials are in the macOS keychain via `credential.helper=osxkeychain`). The old "Device not configured / ask Harish to push" rule is **dead**; any doc or memory still saying otherwise is stale. See §2b for when you may push on your own.
- **Always verify before declaring done.** Never claim success you didn't check: type-check/build output, `git status`, `git diff`. If the worker claims something, spot-check the diff yourself.

## 1a. Shared work log — `Files/WORKLOG.md` (BOTH leads, mandatory)

Because the lead role alternates between Kimi K3 and Claude Opus, each lead **must** keep the other up to date through `Files/WORKLOG.md`:

- **At session start:** read the last few entries of `Files/WORKLOG.md` before planning — the other lead may have shipped something that changes your assumptions.
- **After every major task** (a shipped deploy, a completed ticket series, an infra/DB change, a design-system decision, a new convention): append a dated entry — what was done, commit hash(es), deploy verdict, files/areas touched, and anything the next lead must know (quirks, follow-ups, user preferences stated mid-session).
- **Keep entries dense** — 5–15 lines each, newest at the top. No blow-by-blow; only what a fresh lead needs to continue safely.
- Small fixes (typos, one-line tweaks) don't need entries. When in doubt, log it.

## 2. Invoking the worker (DeepSeek V4 Flash via aider)

aider at `~/.local/bin/aider`, configured in `~/.aider.conf.yml` with `model: deepseek/deepseek-v4-flash` (auth via `DEEPSEEK_API_KEY` in the environment). Run non-interactively from the repo root (`leadenthrella/` unless stated):

```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && \
aider --yes-always --no-auto-commits --no-suggest-shell-commands \
  --file <files to edit> --read <reference files> \
  --message-file /path/to/ticket.md
```

- **`--no-auto-commits` is mandatory.** Aider auto-commits by default; Harish's rule is no git mutations without explicit approval. The worker leaves changes uncommitted so you can `git diff` them.
- **Pass long tickets via `--message-file`**, not a giant inline string. Write the ticket to a scratchpad file first — readable, re-runnable.
- **`--file` everything it must edit, `--read` everything it only needs to see** (reference tsx, tokens css, design docs). Aider's repo-map covers the rest; don't stuff the prompt.
- **Every call is a fresh, stateless session.** Each ticket must be fully self-contained: goal, exact files to touch, relevant conventions, acceptance criteria + the verification command you expect it to run (`npx tsc --noEmit`).
- Working directory matters: cwd = the repo, so its file access and git land in the right place.

### Cost & caching policy (HARD RULES)

- **DeepSeek V4 Flash is the default for ~all coding tickets** — near-Kimi quality at a small fraction of the cost. Harish is on a usage shortage; the whole point of the stack is max output per rupee. Do not escalate to pricier models unless a ticket has demonstrably failed on DeepSeek twice.
- **Context caching is automatic** — DeepSeek's server-side disk caching is on by default for all users, no flags or code changes; cache-hit input tokens are ~90% cheaper ([DeepSeek docs](https://api-docs.deepseek.com/news/news0802/)). Nothing to configure — but you maximize hits by keeping **stable prompt prefixes**: reuse the same ticket preamble/conventions block verbatim across tickets, put the changing delta at the end. (Aider's `--cache-prompts` flag is Anthropic-only — irrelevant here.)
- **Batch related work into one ticket** rather than several small runs; each aider invocation is a fresh session that re-sends context.

### Token efficiency — standing order for both of us

Read narrowly (use the §6 file map, no blind grepping) · don't re-derive context that's already in this file · one clean pass instead of many small ones · batch mechanical changes · verify once (type-check + diff) and report concisely.

**Your own budget (lead agent — Kimi or Claude):** think at low/medium effort matched to the task — low for routine tickets/reviews, medium for planning and debugging. Review via `git diff` rather than reopening files the worker already reported on. Your subscription quota is the scarcest resource on the team.

### Ticket pattern that works

1. **Recon with the script, not by reading files** (see below).
2. Write the ticket: goal → exact files → step-by-step approach → constraints (§5 standing rules) → verification (`npx tsc --noEmit` error count, `npm run build`) → "commit locally, do not push".
3. Run it, read the output, then **review the actual diff** before accepting.
4. For big features, split into multiple tickets and review between them rather than one giant run.

### 🔻 TOKEN DISCIPLINE — the orchestrator's own spend is the scarcest resource

Harish's standing goal: **cut orchestrator token usage to the minimum with zero quality loss**, by pushing everything mechanical onto DeepSeek V4 Flash (via aider). The waste is never implementation (the worker does that) — it is *reconnaissance*, *re-verification*, and *retried shell commands*. Rules:

**1. Never open a file just to find line numbers. Use the recon script.**
```bash
./scripts/recon.sh <symbol> [more symbols...]
```
Returns definitions, capped references with `path:line`, containing files with line counts, plus branch/HEAD/baseline — ~25 lines instead of several hundred. Open an actual file **only** when you need to copy a code idiom, and then read a narrow `offset`/`limit` window, never the whole file.

**2. Never re-run a verification the worker already ran.** If DeepSeek reports `tsc = 0` and `build OK`, that is the result — it ran the same command on the same machine. Re-running it costs a full round-trip to learn a number you already have. **Review the `git diff` instead** — that is where real defects hide, and it is the one review step that must never be skipped.

**3. Ship with one command, not six.**
```bash
./scripts/ship.sh              # typecheck gate → build → deploy → propagation check → verdict
./scripts/ship.sh --dry-run    # verify only
```
It hardcodes `--name leadenthrella`, fails closed if typecheck exceeds baseline, and uses `grep -a` for the propagation check. Do not hand-roll the deploy ritual again; every manual attempt has cost retries.

**4. Let the ticket lean on shared context, not on restated context.** `.claude/skills/cerebyl-context/SKILL.md` carries the brand rules, standing product rules, file map, and verification contract — attach it to aider runs with `--read .claude/skills/cerebyl-context/SKILL.md` instead of re-explaining the project in every ticket. Tickets should state the *delta* — goal, files, approach, acceptance. Long tickets go in a scratchpad file and get passed as `--message-file …`.

**4b. Vendored UI/motion skills (added 28 Jul 2026).** `.claude/skills/` also carries six third-party reference skills — `motion-principles`, `mobile-principles`, `framer-motion`, `css-native`, `design-audit`, `design-dna` — copied in from `AThevon/genjutsu` and `zanwei/design-dna` at pinned commits. **Vendored on purpose, never plugin-installed**, so upstream can't silently change what our agents are told. Provenance, the security audit, and the exclusion list live in `.claude/skills/VENDORED.md` — **read it before adding any more.** Two exclusions matter: `genjutsu/paint` and `genjutsu/cast` are barred because `paint` is instructed to *replace existing design tokens*, which would overwrite the locked Cerebyl brand and the shipped F8 UI. Also note `LeonxInx/taste-skill`, cited in circulating "best Claude skills" listicles, **does not exist** — verify any such repo before trusting the list it came from.

**5. Batch related work into one ticket** rather than several small runs; each aider invocation is a fresh stateless session that re-sends context (a stable ticket preamble keeps DeepSeek's automatic disk cache hitting — see §2).

**6. Delegate recon itself when an area is unfamiliar.** A ticket can be pure investigation: *"Report how X works: exact files, line numbers, data flow, and the 3 functions that matter. Change nothing."* Reading the worker's 30-line summary beats reading 800 lines yourself.

**🚧 NEVER delegate these — this is the quality floor, and the 50% target does not override it:**
- **Reviewing the worker's diff.** Always read it yourself. Accepting an unreviewed diff is how quality silently drops.
- **Architecture and design decisions** — what to build, which approach, what trade-off.
- **AI prompt changes** (`prompt.ts` / `prompt-tier2.ts`) — they force a cache re-verification and a `thoughtSignature` mistake 400s the whole assistant.
- **DB migrations, RLS, and anything touching live data.**
- **Live-infra debugging** (Cloudflare/Supabase/KV state) and any judgement about whether something is *actually* fixed.

Shorthand: **DeepSeek finds and types; the lead (Kimi or Claude) decides and reviews.**

---

## 2b. Push policy — the green-light checklist (set 25 Jul 2026)

Harish: *"when you are confident and sure 100% that everything went right in the build, you can push the commits without asking me."* That is standing authorisation — but **"100% sure" means verified, not believed.** The gate below is deliberately mechanical so it cannot be talked into a yes.

**🟢 PUSH WITHOUT ASKING only when EVERY line is true:**

1. `./scripts/ship.sh --dry-run` (or a full `ship.sh`) passed — typecheck **at or below** baseline and `npm run build` succeeded.
2. `git status --short` is **empty** — nothing uncommitted or untracked that belongs with the change.
3. You have read the **full `git diff` of every commit being pushed** with your own eyes. A worker's summary is not a substitute.
4. Every changed file is one you intended to change. No strays, no surprise files.
5. Relevant existing tests pass (e.g. `npx vitest run` in `acrowell-ai-worker`).
6. If the change touches the Worker, a prompt, or the DB: the matching artifact is **deployed AND verified live** — an asset-hash/propagation check or a PostgREST probe, not merely "the deploy command exited 0".
7. If the commits include a migration, it is **already applied to the live DB and probe-verified**, or the code degrades safely without it.

**🔴 NEVER auto-push — always ask, regardless of how good it looks:**

- Any **unapplied migration**, or anything touching **RLS, auth, grants, or live data**.
- **Secrets, keys, tokens, or env/binding changes.**
- A change to the **typecheck baseline** itself (raising or lowering).
- **Deletions or refactors too large to have genuinely reviewed** hunk by hunk.
- Any step that was **skipped, blocked, or ambiguous** — including a worker run whose output you never actually saw. (This happened 25 Jul: Kimi's background output file was empty, so its verification numbers were unread. That is an automatic red, and the fix is to re-run the checks yourself, not to assume.)
- **Force-push, history rewriting, branch deletion, or pushing anything but `main` fast-forward.** Never, under any circumstances.
- Anything you are *inferring* rather than *checking*.

**Always report after pushing**: the commit range, one line per commit, and what was verified. Push silently, never secretly.

If even one item is uncertain, the correct move is the cheap one: commit locally and ask. A wrong push costs far more than a question.

## 3. What the product is

- **Brand: Cerebyl** — locked, final. **"Enthrella" and "Acrowell" must never appear in any user-facing UI.** Acrowell is just one *client company* inside the platform; Enthrella is backend-only infra (Cloudflare account owner `admin@enthrella.com`, parked domain). The internal dev console is **"Cerebyl Operations"**. If you see "Acrowell CRM", "Lead CRM", "Pharma BMS", "Enthrella Operations", or "enthrella" in code or on a page — that's a **regression, fix it.**
- **What it does:** multi-company CRM for a **PCD pharma franchise** business — leads, parties (customers), orders/invoices, products, transporters, dues, team, plus stock/inventory and staff/salary. **Business tool only** — no medical claims (PDFs carry a "Business tool only" footer).

## 4. Infrastructure (memorize — not fully written inside the repo)

| Thing | Value |
|---|---|
| **Project root** | `~/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT` — see §0 |
| **Live app code** | `<root>/leadenthrella` (the git repo) |
| **Reference/planning docs** | `<root>/Files` (NOT version-controlled, never deleted) |
| **GitHub** | `https://github.com/harishsharmanash/leadenthrella.git` — branch `main` |
| **Live site** | `https://app.cerebyl.com` (Cloudflare Custom Domain on the Worker) |
| **Actual deploy target** | Cloudflare Worker **`leadenthrella`** (`https://leadenthrella.icy-sunset-05b0.workers.dev`) |
| **Domain/DNS/host** | Cloudflare all-in-one, account `admin@enthrella.com` |
| **Backend** | Supabase project `pharma-bms-prod`, ref `cjowrlrjyhdltbyqwozr`, ap-south-1 (Mumbai), free plan |
| **Stack** | React 19 + TypeScript, TanStack Start/Router (file-based routes), TanStack Query, Supabase (Postgres + RLS + Storage + Edge Functions), Tailwind v4 + shadcn/ui, framer-motion |
| **Ignore** | `leadenthrella-main/` is a stale duplicate — never use it |

> **Lovable is dead.** Fully migrated off Lovable Cloud 21 Jul 2026. Ignore anything mentioning `preview--leadenthrella.lovable.app`, Supabase project `crzddmxogxhirzqkrgwb`, or "Lovable rebuilds on push".

### Deploy — PUSH ≠ DEPLOY

- **Frontend:** `npm run build`, then from `.output`: `npx wrangler deploy --name leadenthrella --compatibility-date <today>`
- **DEPLOY TRAP (cost a full debug session 25 Jul 2026):** a bare `npx wrangler deploy` in `.output` ships to the wrong worker `harishsharmanash-leadenthrella`. `app.cerebyl.com` listens to worker **`leadenthrella`** — **always pass `--name leadenthrella`.**
- **COMPATIBILITY-DATE TRAP (cost a failed deploy 28 Jul 2026):** the compatibility date must be **UTC** (`date -u +%F`), never the local date. We are in IST (UTC+5:30), so between **00:00 and 05:30 IST** a local date is one day ahead of Cloudflare's clock and every deploy fails with `Can't set compatibility date in the future` (error 10021) — after the assets have already uploaded, so it looks half-done. `scripts/ship.sh` is fixed; don't "simplify" it back to `date +%F`.
- **🚨 MISSING-ENV TRAP (took app.cerebyl.com DOWN for hours, 30 Jul 2026).** `.env` was untracked and gitignored that morning (`e73013e`). A later build ran without it, Vite inlined **nothing** for `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`, and the deployed bundle had no backend at all — `auth-context` threw *"Missing Supabase environment variable(s)"* and **nobody could log in.** The build SUCCEEDED and every gate was green; only loading the live URL revealed it. Found only because an Android APK pointed at the same site.
  - `scripts/ship.sh` now has **two** gates for this: an **env gate** (pre-build, refuses to build when the `VITE_` vars are unresolvable) and an **artifact assertion** (post-build, greps the emitted `client-*.js` for the Supabase project ref). The second is the one that catches it *regardless of cause* — never remove it.
  - **A git WORKTREE never receives gitignored files, so `.env` is absent there and any build from a worktree reproduces this exactly.** Build and deploy from the main checkout only.
- **Edge functions:** `npx supabase functions deploy <name>` — deploys cleanly, no reason to avoid them.
- **Migrations:** manual via SQL Editor. **Never `supabase db push`** — the migration-tracking table on the live DB is drifted and it can try to replay everything. Audit live-schema drift via PostgREST 400-probes, not by trusting `supabase/migrations/` alone.
- `leadenthrella/.claude/skills/leadenthrella-deploy/SKILL.md` is the **detailed source of truth** for deploy/DB/edge-function/deps/types rules. Read it before touching any of those. Don't duplicate or contradict it.
- **Typecheck baseline is now 0 errors** (30 Jul 2026, pending push). It was 137/138 for months; the whole backlog was Supabase type DRIFT, cleared by regenerating `src/integrations/supabase/types.ts` from the live schema (`npx supabase gen types typescript --project-id cjowrlrjyhdltbyqwozr --schema public`), which alone took 137 -> 22, then real typing fixes for the rest. **Any error is now a regression** — the gate is `-eq 0`, not `<= 138`. If drift reappears after a migration, regenerate types rather than raising the baseline.
- Package manager: the repo has both `bun.lock` and `package-lock.json`. Dependency changes must keep the lockfile Cloudflare uses in sync, or the build fails at install with "lockfile had changes, but lockfile is frozen" — see the deploy skill.

### Sibling projects — outside the repo, easy to forget, will silently break

**AI assistant ("Ceremate") Worker:** `<root>/acrowell-ai-worker` — Cloudflare Worker at `https://acrowell-ai-worker.icy-sunset-05b0.workers.dev`. **Not a git repo, not inside `leadenthrella`.** Deploy with `npx wrangler deploy` from that folder. Its `wrangler.jsonc` carries `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` / `ALLOWED_ORIGINS` — **anything changing the app's domain or Supabase project must be mirrored here or the assistant breaks silently.** Model: `gemini-3.1-flash-lite`. CORS allows `.icy-sunset-05b0.workers.dev` + `cerebyl.com`/`.cerebyl.com`, **not** client white-label domains yet. Living spec: `Files/ai-assistant-build-spec.md` — read its build-status block first.

**Lead intake Worker:** `<root>/cerebyl-lead-intake` — Cloudflare **Email** Worker behind F2, receives catch-all `*@leads.cerebyl.com`. Also not a git repo. Has its own service-role key; keep isolated from the AI worker.

**Rule:** when auditing "is X fully updated?", enumerate *deployed artifacts*, not just the repo. The AI Worker got left pointing at dead infra once already.

## 5. Standing product rules — never regress

- Dashboard "Leads by Source" is a **bar chart, never a pie**.
- **Default sort is alphabetical everywhere.** Any other order (highest dues, best-sellers) is an explicit opt-in only.
- **Reassigning a party's rep = managers/admins only.** Reps never see that control.
- **Reps only ever see their own data** (enforced by RLS).
- Include these constraints in worker tickets whenever the ticket touches related code.

## 6. File map (so neither you nor the worker greps blind)

Routes: `src/routes/` (TanStack file-based; each domain has a list route + often a `$id.tsx` detail route). Hooks: `src/lib/use-*.ts`. Migrations: `supabase/migrations/`.

- **Leads:** `src/routes/leads*.tsx`, `src/lib/use-leads.ts`, `src/lib/use-lead-products.ts`, `src/components/lead-dialog.tsx`. Views: `hot-warm.tsx`, `followups.tsx`, `my-day.tsx`, `duplicates.tsx`, `booked-areas.tsx`, `leaderboard.tsx`.
- **Parties (customers):** `src/routes/parties*.tsx`, `src/lib/use-parties.ts`, `src/lib/use-party-rates.ts`.
- **Orders/invoices:** `src/routes/orders*.tsx`, `src/lib/use-orders.ts` (largest hook, ~620 lines).
- **Products:** `src/routes/products.tsx`, `src/routes/product-performance.tsx`, `src/lib/use-products.ts`.
- **Stock/inventory:** `src/routes/stock.tsx`, `src/lib/use-stock.ts`.
- **Staff/salary:** `src/routes/team.tsx`, `src/lib/use-staff.ts` (largest module, ~613 lines).
- **Transporters:** `src/routes/transporters*.tsx`, `src/lib/use-transporters.ts`.
- **Company/settings:** `src/routes/settings.tsx`, `src/lib/use-company.ts`.
- **Assistant (Ceremate):** `src/lib/use-assistant.ts` (~3.2k lines — the brain: message-kind union, plan executor, Tier-2 loop driver), `src/components/assistant-chat.tsx` (chat shell), `src/routes/ceremate.tsx` (full page), `src/components/ceremate/` (bubbles — `message-bubble.tsx` holds the `kind` render switch). Note: `assistant-chat.tsx` is in `components/`, **not** `routes/`.
- **Charts:** `src/components/ui/chart.tsx` (recharts wrapper) — used by `dashboard.tsx`, `product-performance.tsx`, `console.index.tsx`. Reuse it; never hand-roll a chart.
- **Other:** `dashboard.tsx`, `auth.tsx`, `users.tsx`, `trash.tsx`, `developer.tsx`, `help.tsx`, `__root.tsx` (app shell). Backups: `src/lib/use-backup.ts`. Notifications: `src/lib/use-notifications.ts`. File extraction: `src/lib/file-extract.ts`.

## 7. Reference docs — what to read, what to skip

`Files/` holds planning + reference docs (not version-controlled, so nothing is ever deleted).

- **`Files/archive/` — DO NOT READ.** Everything there is already built and shipped. A finished build plan reads exactly like a to-do list — opening one is how a shipped feature gets rebuilt by mistake. `Files/archive/README.md` has a status table if you need history.
- **Active `Files/`** holds only unbuilt work, living specs, and still-true reference: `CLIENT-BACKLOG.md` (unbuilt client requests outside the roadmap), `CEREBYL-ROADMAP-8FEATURES.md`, `ai-assistant-build-spec.md` (living authority for assistant work), `Ideas/`, `data/`, `Assets/`, `backups/`, `stress-test-assets/`, `App UI inspirations/`.
- **When you finish a feature, move its plan into `Files/archive/`** and add a one-line status to that README's table.
- Scratch/temporary files belong in the session scratchpad, never in `Files/`.

## 8. Roadmap state (verified against commits, 25 Jul 2026)

**The original 8-feature roadmap is COMPLETE.** F1 geo monopoly (3 phases, Leaflet map, `/booked-areas`, PDF export) · F2 email lead auto-fetch · F3 rep transfer/offboarding · F4-P1 order tracking (`/track/$token`) · F4-P2 order status emails · F5 product gallery/lightbox · F6 Ceremate full UI (4 phases) · F7 Ceremate rename · F8 whole-app UI overhaul. Plus: console user management, login password eye toggle, collapsible sidebar, `/refer`, quick-view peek sheets.

**Encrypted API-key storage (24 Jul).** `company_secrets(company_id, name, secret_enc bytea)` + pgcrypto; master passphrase in Supabase Vault as `company_secrets_master` (created by Harish by hand, never in repo — if lost, keys are unrecoverable and companies re-paste). All encrypt/decrypt inside security-definer `set_company_secret`/`get_company_secret`, **service_role only**. `company_email_keys` retrofitted (plaintext columns dropped). **This is THE key store** — AI keys are `name='gemini_api_key'` rows, no new infrastructure. Gotcha: its `search_path` must include the `extensions` schema for pgcrypto.

**V3 Ceremate AI — Phase 8 COMPLETE (verified live, 24–25 Jul).** Tier-2 agentic loop: worker `/analyze` (mode AUTO, second cache `gemini:cache2:name`, SSE prose vs JSON toolRequests), `analyze(question)` routed from Tier-1, frontend loop driver (≤4 steps, 6 whitelisted aggregate read-tools, stock snapshot rep-gated), streaming bubble, `assistant_usage` logging.
> **gemini-3 gotcha:** streamed `functionCall` parts carry `thoughtSignature` which MUST round-trip verbatim — worker sends the raw part as `callPart` in toolRequests, frontend echoes it in toolResults. Without it Gemini 400s "missing thought_signature".

**V3 Phase 9 — analytics brain: BUILT & DEPLOYED 25 Jul 2026.** `chartSpec` message kind (`bar | horizontalBar | line` — **no pie type exists**, by standing rule) rendered in `ceremate/message-bubble.tsx` off the shared recharts helpers · `downloadCsv` in `src/lib/export-csv.ts` with Export CSV on `reportCard`/`duesCard`/`orderList`/`chartSpec` · Tier-2 prompt teaches period-over-period, top-N, and one-observation narration.
> **Chart transport decision:** the analyst appends a fenced ` ```chart ` JSON block to its prose; the frontend parses it at stream-settle (`parseChartBlock`/`stripChartBlock` in `use-assistant.ts`), emits a separate persisted `chartSpec` bubble, and hides the block mid-stream. Chosen over a 7th `render_chart` tool because a tool call costs an extra Gemini round-trip per chart and loop latency is already the rough edge. Malformed blocks are dropped — the prose still renders, so a bad generation degrades to plain text, never an error.

> **Tier-2 loop bug found & fixed during Phase 9 verification (25 Jul, commit `2a944dd`, worker `0a6a8b62`).** The Phase 8 loop driver reassigned `toolResults` each step and posted only the latest batch, so the model lost everything fetched in earlier rounds, kept re-fetching, and burned the 4-step cap — surfacing as *"I pulled a lot of data but couldn't finish the answer."* Now the frontend accumulates rounds and sends `toolRounds`; `buildAutoContents` replays **each round as its own model/user turn pair** (flattening them would break Gemini's call/response pairing and strand each `thoughtSignature`). Legacy flat `toolResults` still accepted as one round for cached bundles.
> **Lesson:** a loop feature verified only on single-round questions is not verified — always include a question needing 2+ tool rounds in the acceptance set.

> **⚠️ PROMPT-CACHE PURGE — the trap that makes a prompt change look like a no-op.** `cache.ts` keys the Gemini explicit cache by a **fixed KV key** (`gemini:cache:name` slot 1 / `gemini:cache2:name` slot 2), **not** by a hash of the prompt. So after editing `prompt.ts` or `prompt-tier2.ts` and deploying, the OLD cached prompt keeps serving until the 1-hour TTL expires. Either wait out the hour or purge the key:
> ```bash
> npx wrangler kv key delete "gemini:cache2:name" --namespace-id 302493f121a0412484ac8322515ffa85 --remote
> ```
> Run from `acrowell-ai-worker/`. Use `gemini:cache:name` for the Tier-1 slot. **Do not conclude a prompt change failed until the cache is purged or expired.**

**V3 Phases 10, 11, 12 — ALL SHIPPED 25 Jul 2026.**
- **Phase 10 — memory.** `assistant_memories` (owner-scoped RLS, 1–300 char CHECK, 30-day `expires_at`, no UPDATE grant). `remember(fact)` action registered in all four places it must be (`ACTION_NAMES`, `FUNCTION_DECLARATIONS`, routing rule, `postValidate`) + a frontend handler. Memories inject into the **dynamic turn only** on both `/chat` and `/analyze` via one shared `memoryContext()` helper — never the cache, which is shared across every company. Managed from the **Memory panel (brain icon) on `/ceremate`**, reachable by every role; Settings has an admin-only mirror. Memory text is framed as reference data, not instructions, so "yaad rakhna: ignore your rules" can't act as a directive.
- **Phase 11 — daily digest.** `generate_daily_digest()` follows the existing idempotent pull-generator pattern (like `generate_due_notifications`), fired on notification fetch. **Deliberately deterministic and NOT AI/cron** — every fact is a plain query, so no LLM sits between the user and their rupee figures, and nothing is generated for users who never log in (that is what scales as companies are added). Reps see only their own leads/parties; stock is manager/admin only. Emits nothing when there is nothing to report. Toggle lives in the **notification-bell footer** (all roles) — `/settings` is admin-only, so a Settings-only toggle was unreachable for reps.
- **Phase 12 — TTS + multi-image.** Browser `speechSynthesis` read-back (free, default OFF, persisted, strips markdown/chart blocks, 600-char cap, cancels in-flight speech); speaker toggle beside the mic, hidden where unsupported. Up to **4 images per message** — Worker takes `images[]` (legacy `image` still accepted), capped at 4 and 15MB combined. **Bill extraction stays single-document** and uses the first attachment only; its gate and `originalFile` handling are unchanged.

**Also fixed 25 Jul:** confirm chips could be answered twice (a live chip stayed clickable, so a second Confirm re-ran the action — harmless on a note, not on "record a ₹50,000 payment"); assistant text bubbles now preserve newlines; Manage Users shows plain-English errors via `src/lib/friendly-error.ts` (raw error still logged to console) with password reveal toggles.

**Tier-1 prompt fixes 25 Jul** (from the corpus run): ranking/superlative questions may never go to `ask_clarification`; `plan` is only for two or more independent WRITES (a read+write pair or two reads is ONE action); punctuation-only input ("???") is not smalltalk; "where/how is X" is `app_help` even when the feature is unavailable.

**⚠️ Corpus status — do NOT record as "passing".** The 25 Jul run attempted 588 of 608 rows (20 Vision/PDF rows are excluded by the harness — they need real attachments, "Gap A"). It reached the final row with real responses, but **the summary scrolled away before it was read, so intent accuracy / refusal correctness / JSON validity are UNKNOWN**, and the three prompt fixes above landed *after* the run, so they are unverified. `test/corpus/run-with-login.mjs` now signs in and tees output to `results-<timestamp>.txt` so this cannot recur. Also note the harness sends a single message with **no conversation history** and `role: "admin"` for every row — so the Corrections/Contradictions category cannot pass by construction, and role-gating is never exercised. Treat its score as pessimistic and incomplete.

## 8b. Client-backlog work (25 Jul 2026, later session)

**⚠️ THE BACKLOG WAS STALE — AUDIT BEFORE BUILDING.** `Files/CLIENT-BACKLOG.md` listed 41 "unbuilt" client requests; an audit against the code found **32 already shipped** (repeat-last-order, tap-to-call, copy party details, advance payments, rep day plan, phonebook, global search, top-5 widgets, two-tap enquiry, invoice column picker…). Building from it would have meant re-implementing working features. The file is now rewritten with `file:line` evidence and a **DO-NOT-REBUILD** section; shipped items must move there in the same session. Same failure mode as `Files/archive/` — a finished item reads exactly like a to-do.

**Shipped in that pass:** parties list default sort back to alphabetical (was `reorder_due`, violating §5) · soft-delete extended to 9 more tables **including payments and transporter_payments**, which were hard-deleted with no undo · `purge_trashed_rows()` + wired into `platform-purge-old-data` (the Trash page had advertised 30-day retention while nothing ever purged) · `deleted_by` attribution, admin-only `trash.purge` permission, scrollable Trash tabs · **RESTRICTIVE RLS policies making hard delete admin-only server-side** (13 tables; `order_items`/`payslips` deliberately excluded — both are hard-deleted by ordinary order-save/payroll flows) · reusable `Combobox` on 20 long entity pickers (~503 fixed-enum Selects deliberately left alone) · `ConfirmDelete` everywhere · `ShareSheet` (format → platform: WhatsApp/Mail/SMS/Copy) · recently-viewed now tracks real visits · saved filters on leads/orders/products · in-app HSN lookup.

> **Invoice JPG bug worth remembering:** `invoiceRef` was attached to the *"Line Items" card*, so `html2canvas` could only ever capture that one card — the shared JPG had no totals, tax, paid or due. Fixed with a dedicated off-screen printable node (`position: fixed; left: -10000px` — NOT `display:none`, which html2canvas cannot capture), and the PDF's column definitions were hoisted to component scope so PDF and JPG share one source and cannot drift.

> **`?party=` was overloaded (fixed 25 Jul).** On `/orders` it meant BOTH "filter to this party" AND "open the new-order dialog" (the assistant's `start_order` relied on the latter). So the party page's "All orders for this party" popped the new-order form, and closing it landed on the unfiltered list. Now `?party=` filters only; opening the form needs an explicit `?new=1`, and `start_order` passes both.

**Still open from that pass:** (the ~7 delete-site relocations previously listed here are DONE — verified 30 Jul 2026, all use the canonical `DropdownMenu` + ghost `MoreVertical` + `ConfirmDelete` pattern; one remaining candidate is the header Delete on `leads.$id.tsx:199`) · the daily purge **IS now scheduled** (30 Jul 2026): pg_cron job `daily-purge-old-data` at 21:00 UTC / 02:30 IST, secret read from Vault (`cron_secret`), verified with a manual fire returning HTTP 200. **Firing it exposed a real bug**: `purge_activity_log()` was REVOKEd but never GRANTed to service_role, so the Activity Log's 90-day retention had never once run — fixed by migration `20260730170000_fix_purge_activity_log_grant.sql` · pack-size attributes (dosage form, volume, Alu-Alu vs Blister, + filtering) specced by Harish, not started.

**Small open items:** Tier-1 misrouted "sabse zyada dues kiske hain?" to `ask_clarification` once (routing prompt may need a ranking-question example) · 608-row corpus re-run · V6/V7 live verifications (need Harish's login) · ₹99 test rate cleanup on Shree Balaji · stale-catalog-name limitation · per-portal deterministic parsers for PharmaHopper/Pharmavends need real sample `.eml` files from Harish (Gemini fallback covers them meanwhile).

**Deferred by decision:** per-company `{slug}@orders.cerebyl.com` sender addresses (parked — eats our shared Resend quota anyway) · India GeoJSON overlay, Nominatim search box, order-time geo flagging · audio-file attach in Ceremate (low value/high effort) · `Files/CLIENT-BACKLOG.md` items as Harish prioritises them.

You own build order and approach. Drafts in `Files/` are starting points, not gospel — re-verify against current code before building.

## 8c. Production hardening shipped 30 Jul 2026 (all live on app.cerebyl.com)

A full day of production-readiness work. **All of this is DEPLOYED and VERIFIED — do not rebuild it.**

- **Tests exist now.** Vitest + RTL — **361 tests / 30 files** as of 5 Aug 2026 (was 74/10 when this
  section was written). `npm run test`. Covers order totals,
  dues, trash boundaries, invoice column parity, friendlyError, payroll, stock math, transporter
  statements, incentives, and `fetch-all`. The §2b push-gate step telling you to run tests is finally
  a real command.
- **Typecheck baseline is 0** (see §4). Any error is a regression.
- **Sentry is live** — `@sentry/tanstackstart-react`, EU region, error monitoring + light tracing
  (0.1). **PII-scrubbed**: `sendDefaultPii:false` plus `beforeSend`/`beforeSendTransaction` in
  `src/lib/sentry.ts` strip request bodies, cookies, auth headers, and reduce user to a bare uuid.
  NO session replay / logs / metrics — deliberately. DSN is public and lives in that file.
- **Security headers** in `src/server.ts`: HSTS (1yr, includeSubDomains — a durable commitment),
  nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, and a **report-only CSP that
  now reports to Sentry** (`report-uri` + `report-to` + `Reporting-Endpoints`). Proven by a real
  violation arriving. ⚠️ **CSP reports bypass our SDK scrubbing** (the browser posts them directly),
  so "Prevent Storing of IP Addresses" is enabled in Sentry — keep it on.
- **Route error boundaries** on ~48 routes (`src/components/route-error.tsx`). Display text goes
  through `friendly-error.ts`; raw errors go to console + `logAppError` (`/console/errors`, the only
  real error sink besides Sentry). **Never wire `src/lib/lovable-error-reporting.ts` — it posts to a
  dead global and makes reporting look present.**
- **Legal documents published** at public routes `/legal/{privacy,terms,refund,dpa}` (+ `/legal`
  index), linked from the auth footer and Settings. Sources in `src/content/legal/`, originals and
  backend-only caveats in `Files/legal/`. **The "pending legal review" note is backend-only by
  Harish's instruction — never surface it in the app.**
- **DPDP consent gate** — first login shows two unbundled, unchecked boxes (Terms, Privacy),
  version-tracked in `src/lib/consent.ts`; returning logins get a passive notice; a version bump
  re-prompts everyone. Audit rows go to the immutable `consent_log` table (applied live).
  Grievance officer: **Harish Sharma / support@cerebyl.com** (address is live via Cloudflare Email
  Routing, forwards to admin@enthrella.com).
- **Retention** — `companies.terminated_at` + `purge_terminated_company_data()` (applied live):
  personal data purged 180 days after termination, financial records 6 years (Indian GST).
  `parties` is classified FINANCIAL, not personal, because it is the customer of record on tax
  invoices. Nothing is in scope until a company is actually terminated.
- **Accessibility** — `src/lib/use-motion-safe.ts` makes framer-motion respect
  `prefers-reduced-motion` (the CSS blanket in `styles.css` never could); keyboard access on
  clickable rows/cards; focus rings restored. **Touch targets are still open** — deliberately not
  fixed, because resizing `components/ui/button.tsx` ripples app-wide. Preferred approach is an
  invisible `::after` 44px hit-area at the flagged call sites.
- **Vendored UI skills** — see §2 item 4b.

### 🚨 `fetch-all.ts` — the invariant you must not break
`src/lib/fetch-all.ts` fixes silent data loss: PostgREST caps responses at **1000 rows and returns
no error**, so every "fetch all" hook was dropping row #1001 onward. 20 list queries now page via
`.range()`.

**Every paged query MUST end with `.order("id", { ascending: true })` as its last sort.** Offset
paging over a non-unique sort (`date_received`, `firm_name`, `expiry_date` — and two `order_items`
queries had no sort at all) lets Postgres order ties differently per page, so a row appears twice
while another never appears. Removing that tiebreaker converts a fixed bug into silent corruption.
`stock_movements` is deliberately bounded at `STOCK_MOVEMENTS_LIMIT` (2000) with the bound disclosed
in the UI — never silently wrong. Row counts at fix time were all < 1000, so this is preventive;
`order_items` (~12/order) was the nearest threat at ~83 orders.

**Still open (performance, not correctness):** real server-side pagination, search/sort/filter in SQL,
and virtualization are NOT done. See `Files/SCALE-PLAN.md` for the staged plan and Harish's actual
target volumes (100k leads/company, 200 companies, 10k users) — and the decision to STAY
multi-tenant.

## 8d. Parked on Supabase Pro — `Files/WHEN-SUPABASE-PRO.md`

Harish deferred Supabase Pro (30 Jul 2026) until the app is feature-complete. Anything blocked by
that decision lives in **`Files/WHEN-SUPABASE-PRO.md`**.

**STANDING RULE: the moment you hit something that needs Pro — or that you are tempted to defer
"until Pro" — append it to that file in the same session, with the reason and a source reference.**
Otherwise it evaporates into chat scrollback and gets rediscovered from scratch months later.

**Equally important — check section B before you defer anything.** That file separates what is
*genuinely* gated by Pro (PITR, DB size for the load test, branching/staging, inactivity pausing)
from what merely got *called* Pro-blocked in conversation and is actually doable today. The
role-gating tests are the worked example: `acrowell-ai-worker/test/corpus/run.ts:99,107` sends
`role: "admin"` as **plain text in the AI's prompt context**, not as an authenticated session — so
that test needs a real rep login, not a paid plan. "Waiting on Pro" must never become the reason a
free-plan-doable safety test goes unbuilt.

## 8e. Mobile app — SHIPPED 3 Aug 2026 (do not rebuild)

Per-company **branded Android APKs**, built on demand. A company admin clicks **Download mobile app**
in Settings → Branding; an edge function checks entitlement, dispatches a GitHub Actions build, and
the signed APK lands in a **private Cloudflare R2 bucket**, downloaded via a short-lived presigned
URL. Verified end to end on a real phone: correct logo/name, login, invoice PDF+JPG downloads,
WhatsApp file share, camera, safe-area insets.

- **Authority: `Files/mobile-app-build.md`** (design) and **`Files/MOBILE-APP-SETUP-RUNBOOK.md`**
  (operations, secrets, and the nine real failures the first live run exposed). Read the runbook
  before touching the pipeline.
- **Shell:** `leadenthrella/mobile/` — Capacitor, its **own `package.json`**. It must never modify the
  root `package.json`/`bun.lock`/`package-lock.json`, and `src/` must never `import` an
  `@capacitor/*` package (the web app calls plugins through the injected `window.Capacitor` bridge,
  see `src/lib/capacitor.ts`). This isolation is why mobile work cannot break the production build.
- **Two feature keys**, both **fail closed** via `DEFAULT_OFF_FEATURE_KEYS`: `mobile_app` (shows the
  button) and `mobile_app_white_label` (their branding vs Cerebyl) — the latter is in
  `CONSOLE_ONLY_FEATURE_KEYS` so a company can never switch on its own paid tier.
- **Three invariants that each cost a debugging round:**
  1. **Only `applicationId` varies per company — never `namespace`.** `namespace` is the code package
     that `android:name=".MainActivity"` resolves against; rewriting it ships an APK that installs,
     brands correctly, and dies instantly with `ClassNotFoundException`.
  2. **The sanitised package id is PERMANENT per company** (stored in `company_apps.package_id`).
     Slugs must be sanitised into valid Java identifiers — keywords, hyphens and leading digits all
     break the build.
  3. **`versionCode` must strictly increase, and one keystore signs everything.** Same appId + same
     keystore + higher versionCode is what allows upgrade-in-place; break any of the three and every
     user must uninstall and reinstall.
- **The keystore is the single most irreplaceable artifact in the project.** Lose it and no installed
  app, for any company, can ever be updated in place again.
- **R2 APKs are private**, served only by presigned URLs minted after the entitlement check. Never
  make that bucket public — an APK is an executable.

## 8f. Distributor Portal — SHIPPED 5 Aug 2026 (do not rebuild)

A company's CUSTOMERS log into the **same app and URL** as staff; routing decides what
they see. One login per party, managed by a company admin from the party page.

**Authority: `Files/DISTRIBUTOR-PORTAL.md`** — read it before any portal work. It lists
every edge function, every feature already built, and the open items.

**The security model, in one paragraph:** a party user gets a `party_users` row and
**deliberately NO `profiles` row**. Every tenant policy is
`company_id = current_company_id()`, which reads `profiles` — so it returns NULL for
them and nothing matches. A distributor can read nothing from any table as an
arithmetic consequence, and every future table inherits that for free. **NEVER create a
`profiles` row for a party user** — it would hand a customer staff-level read of their
company's leads, other parties' orders and staff salaries. Second wall: distributors
never touch PostgREST; all data comes from edge functions on service_role that derive
the party from the JWT.

**Payments are OFF by default.** `portal_payments` is DEFAULT_OFF *and* CONSOLE_ONLY —
only the platform console can enable it, never a company admin. Accepting payments
in-app implies invoicing/compliance obligations the product is not ready for. The gate
is server-side (`portal-payments` 403s when off); with it off a distributor sees only
"contact your sales associate". The account statement is deliberately NOT gated —
viewing a ledger is not accepting payment.

**Six invariants:** no profiles row · `party_id` from the JWT never the body (a
`product_id` in the body is a lookup key and must still pin the token-derived
`company_id`) · product fields are an allow-list mirrored in `src/lib/portal.ts`, never
`select("*")` · order requests store `quoted_rate` so a later rate change cannot rewrite
what a customer thought they ordered · a payment intimation is NOT a payment and must
never touch `payments` until a human confirms · the portal assistant has its own
5-tool party-scoped set and must never reuse Ceremate's company-wide tools.

**Cross-tenant isolation is now provable:** `npm run test:isolation` logs in as a real
distributor with the ANON key and asserts they cannot read one row of another company.
Run it in front of a client who asks why they should share a database. A second company
("Enthrella Biotech", seeded by `scripts/seed-test-company.ts`) exists in production
purely so that suite has something to test against — keep it.

## 8g. Phone notifications — stage 1 SHIPPED 5 Aug 2026 (stage 2 needs Firebase)

The Android app previously had **no notification capability at all** — Android's app settings
correctly reported "this app doesn't send notifications", because the manifest declared only
`INTERNET` and `CAMERA` and no plugin was installed. The bell was in-app only, polled every 5
minutes while the app was open and focused.

**Stage 1 (live):** `@capacitor/local-notifications` in the mobile shell, `POST_NOTIFICATIONS`, a
`cerebyl-alerts` channel, and `src/lib/device-notifications.ts` mirroring unread rows into the tray.
Toggle: "Phone notifications" in the bell footer and Settings, native-shell gated.

**Understand the ceiling before promising anything.** These are LOCAL notifications — the phone
schedules and fires them itself. **Nothing in stage 1 can wake a closed app.** On Android only FCM
can; Web Push is not an option either, because the shell is a WebView pointed at a remote URL and
**Android WebView does not support the Push API**. Supabase Realtime only survives while the app is
foregrounded. So a rep with the app closed still learns about a live order request only on next open.

Two deliberate behaviours that look like bugs but are not:
- **The first sync after install fires nothing.** It records a baseline, so a new install doesn't
  detonate one notification per unread row. Testing "install → expect a buzz" will look broken.
- Notification ids are a stable `uuid → int32` hash (`notificationIdToInt`), because the Android
  plugin's id is a Java `int`. Determinism matters: a non-deterministic map stacks duplicates in the
  tray instead of replacing them.

**Generators are no longer JWT-bound** (migration `20260805180000`). The real logic lives in
`generate_due_notifications_for_company(uuid)`, `generate_lead_followup_notifications_for_user(uuid)`
and `generate_daily_digest_for_user(uuid)`; the original zero-arg signatures are thin wrappers
passing `auth.uid()`, so the frontend is unchanged and the logic cannot fork. `generate_notifications_all()`
is the cron entry point, restricted to active profiles signed in within 30 days — this preserves the
Phase 11 intent that dormant users cost nothing.

> **`generate_due_notifications_all()` had silently rotted** and is the cautionary tale here: written
> in July as the cron variant, it was never updated when the per-company function grew from 1 section
> to 4, and it still used the pre-`dedupe_key` conflict target. Scheduling it (there was a
> commented-out `cron.schedule` line in `20260710150000` inviting exactly that) would have produced
> duplicate `delivery_due` rows. **A second copy of a generator is a bug waiting for a cron job.**

**Known open items:** overdue lead follow-ups are generated TWICE by two functions
(`followup_due` from `generate_due_notifications` section 4, `lead_followup` from the dedicated
function) — one follow-up, two buzzes; recommend dropping section 4. `generate_due_notifications()`
is still executable by **anon** (the July migration granted to `authenticated` but never revoked
PUBLIC's default) — harmless today since `current_company_id()` is NULL for anon so it returns
immediately, but it should be revoked. No monochrome notification icon yet, so Android renders the
launcher icon as a white silhouette.

> **🚨 NEVER VERIFY A DEPLOY BY COMPARING LOCAL `.output` FILENAMES TO THE LIVE SITE.**
> This produced false alarms twice on 5–6 Aug 2026 and burned real time both days. The live entry
> chunk hash routinely differs from the one in local `.output` **even after `rm -rf .output` and a
> clean rebuild**, and the live site is nonetheless correct.
>
> **USE THE BROWSER, NOT `curl`.** Open the Browser pane on the live URL, navigate to the changed
> route, and read `read_console_messages` + `read_network_requests`. That is the only method that has
> been right every time.
>
> **`curl` gives FALSE 404s on real assets.** On 6 Aug `curl` returned 404 for
> `assets/clients-CbZcq1NW.js` four times — including with cache-busting query strings and
> `Cache-Control: no-cache` — while the browser fetched that exact URL with **200** and the page
> rendered with zero console errors. Small route/layout stub chunks (77–142 bytes) are the ones that
> misreport. Do not conclude a deploy is broken from a `curl` 404 on an individual chunk.
>
> If you must grep a bundle, grep for a **user-visible string**, never a code comment — comments are
> stripped in production, so a JSX `{/* Quick actions */}` returns 0 on a perfectly good deploy. And
> note the entry chunk is only the router shell: a `dashboard.tsx` change is NOT in it.
> Or open the Browser pane and read the network log. `ship.sh`'s STEP 6 propagation check compares
> against a local filename, so **treat a propagation failure there as advisory, not proof** — confirm
> with the command above before concluding anything is broken.
>
> Cause of the hash divergence is NOT established. Investigated 6 Aug and these were ruled out:
> stale files (every asset shares one build mtime) and Drive re-sync. The ~70 chunks sharing a single
> hash suffix are trivial route stubs with identical content — normal, not corruption. Don't repeat
> that investigation without new evidence; just use the verification above.

## 8h. Navigation restructure + design direction (6 Aug 2026)

**The IA restructure is COMPLETE and live: sidebar 24 items → 10.** Sections are
Dashboard · Leads · Clients · Orders · Products · Team · Analytics · Settings
(+ Trash, Help). Authority with commit hashes: **`Files/MOBILE-REVAMP-PLAN.md`** —
read it before touching navigation. All 13 legacy URLs still redirect (verified live).

**Four rules it produced, which generalise:**
1. **Never group by feature flag** — that is a deployment concern leaking into nav.
2. **A nav change must never become a data change** — landing pages use the same
   rep-scoped hooks/RLS; hide a card a role cannot open rather than show a count.
3. **Every old URL stays alive** — deep links are shared over WhatsApp, and
   `?party=` / `?new=1` on `/orders` are load-bearing for the assistant.
4. **A list route becoming landing + sub-route needs `validateSearch` on BOTH** —
   `beforeLoad` gets the route's *validated* search, so a landing without the schema
   reads every param as `undefined` and forwarding silently never fires.

**Design direction is owner-approved.** The signed-off reference lives in
`Files/design/leads-reference/` (`leads-reference-SELF-CONTAINED.tsx` is canonical;
runnable at `/dev/leads`). Supporting: `Files/design/design-system.md` — note it
labels every value **SOURCED** (verbatim from Apple's HIG) vs **DERIVED** (ours);
keep that distinction. `hig-full.md` / `hig-tables.md` are 109 pages + 157 tables
extracted from Apple's JSON API (developer.apple.com renders client-side).
Constraints: **light-only** (no dark palette designed — do not invent one) · Inter
never SF Pro · Lucide never SF Symbols (both Apple-platform-licensed only) · heavy
`backdrop-filter` blur is the main WebView frame-rate risk.

> **⚠️ The rollout is NOT finished.** Only the app shell and the Leads section wear
> the approved look; every other section still has interim iOS styling, and the
> detail routes (`leads.$id`, `parties.$id`, `orders.$id`) have had no pass at all.
> Harish on the shipped Leads pages: *"not even close to being as clean as the one we
> built in local host."* The reference is the standard — **ask for a screenshot of
> the live page and diff it against the reference rather than guessing.**

> **🚨 `npm run dev` WORKS NOW — it never did before 6 Aug 2026.** TanStack Start's
> import-protection plugin blocks any `**/*.client.*` import from server code, and
> `src/router.tsx` imported `instrument.client.ts`. **Production builds were
> unaffected, so it went unnoticed for months** and every visual check was done by
> deploying. Fixed by renaming to `instrument-browser.ts` (it already self-guarded
> with `typeof window`). Use `preview_start` with **`cerebyl-dev`** (config lives in
> the PROJECT-ROOT `.claude/launch.json`, not the repo's). Still no login, so for
> logged-in screens build an unauthenticated mock route — that is how `/dev/leads`
> got a whole design approved in one round.

**Known duplication to fix:** `LogCallDialog` now exists in both `leads.all.tsx` and
`leads.$id.tsx`. Behaviour is identical today; extract it. This repo has been bitten
by exactly this twice (`/team` vs `/users`, and `generate_due_notifications_all`).

## 9. Keep this file current

After any change that alters **infrastructure, paths, domain, brand, workflow, or completed-phase status** (not routine feature work), update **this file**, `leadenthrella/CLAUDE.md`, and the deploy skill **in the same session**. Same rule for housekeeping: shipped work's docs move to `Files/archive/` with a status line in its README table, and the deploy ritual (build + `wrangler deploy --name leadenthrella`) is part of "done", never an afterthought. Stale infra facts are how the AI Worker got left pointing at dead infrastructure once, and how a whole session got briefed from a frozen backup folder — don't repeat it.
