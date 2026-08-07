# Lovable Exit Plan — cutting ALL ties with Lovable

*Written 20 July 2026. Companion to `PHASE-E-CUSTOM-DOMAINS-SOLUTION.md` (which solves hosting + white-label). This document is the "full exit" path from its §8: end state is **zero Lovable dependency and a $0 Lovable bill**.*

---

## 1. What "cutting ties" actually means

Lovable has its hooks in four places. Three are easy; one is the real work.

| # | Tie | Exit difficulty |
|---|---|---|
| 1 | **Frontend hosting** (publishing from Lovable) | ✅ Solved by the Phase E plan — Cloudflare Pages deploys from GitHub |
| 2 | **Code / build workflow** | ✅ Already done — the repo is in GitHub, you build with Claude/Kimi |
| 3 | **Build tooling** — `vite.config.ts` uses `@lovable.dev/vite-tanstack-config` | 🟡 30-minute job in a build session (replace with standard Vite + TanStack config) |
| 4 | **The backend — Lovable Cloud** (database, auth, storage, edge functions) | 🔴 The real migration. This document. |

## 2. Why your exit is easier than most (verified in the repo today)

I inspected `leadenthrella/` and `acrowell-ai-worker/` before writing this:

- **Everything structural is already in GitHub:** 29 migration files (tables + RLS + storage policies), 9 edge functions, and `supabase/config.toml`. That means the new backend can be rebuilt by replaying the repo, not by hand.
- **No Lovable runtime dependencies in the app:** zero imports of `lovable.auth` or `@lovable.dev/*` in `src/`. The app talks to Supabase through `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` env vars — swapping backends is swapping two values.
- **No Google/OAuth sign-in** — auth is email/password + TOTP. Password logins migrate with their hashes intact, so **users keep their existing passwords** and their authenticator-app 2FA keeps working.
- **Storage uses the signed-URL pattern** (paths in the DB, URLs generated at runtime), so files survive the move without rewriting any stored URLs.
- **The AI worker is a Cloudflare Worker** pointing at the Supabase URL via a config variable — one value to change, one redeploy.

What does NOT travel automatically (true for every Lovable exit): **table data, storage files, auth user accounts, and edge-function secrets.** Those get moved deliberately in Steps 4–6 below.

## 3. End state & monthly cost

| Piece | Provider after exit | Cost |
|---|---|---|
| Frontend hosting + all client custom domains | Cloudflare Pages + Cloudflare for SaaS | $0 (until 100+ client domains) |
| Database, auth, storage, edge functions | **Your own Supabase org, Pro plan** | ~$25/mo flat |
| AI worker | Cloudflare Workers (already there) | $0–5/mo |
| Lovable | — | **$0** |

Supabase Pro rather than Free because this is production with paying clients: Free projects pause after inactivity and have no daily backups. Use a **Free** project only as the migration rehearsal sandbox if you want extra caution.

---

## 4. The exit sequence

Do this **after** the Phase E hosting move (frontend on Pages, still talking to Lovable Cloud). That way the risky data move is decoupled from the hosting move, and each step is independently reversible.

### Step 0 — Inventory day (30 min, no changes)

1. **List every edge-function secret** in the Lovable Cloud dashboard (Cloud → Edge Functions → Secrets): names only, e.g. `OPENAI_API_KEY`, `CRON_SECRET`, Razorpay keys, `CF_API_TOKEN`… You'll re-enter these by hand in the new project. Store the list in your password manager.
2. **Check for direct database access:** in the dashboard you use for SQL, look for *Project Settings → Database → Connection string*. If a Postgres connection string is available, the data migration takes the easy path (pg_dump). If not, we use the scripted fallback in §5.2 — note which applies.
3. Pick a **maintenance window** (a low-traffic evening) and tell client(s) in advance: "brief planned maintenance, log in again afterwards."

### Step 1 — Create your own Supabase project (15 min)

1. supabase.com → New organization (e.g. "Enthrella") → New project:
   - Name: `leadenthrella-prod` · Region: **Mumbai** (closest to your users) · Plan: **Pro**
   - Set a strong database password — save it in the password manager.
2. From Project Settings → API, note: **Project URL**, **publishable key**, **service_role key** (secret — server-side only).

### Step 2 — Deploy schema + edge functions from the repo (build session)

On your Mac, in the repo:

```bash
cd "/Users/harishsharma/Claude/Pharma BMT/leadenthrella"
npx supabase login
npx supabase link --project-ref <new-project-ref>      # asks for the DB password
npx supabase db push                                   # replays all 29 migrations
npx supabase functions deploy                          # deploys all 9 edge functions
npx supabase secrets set KEY=value KEY2=value2 ...     # from the Step-0 inventory
```

- If `db push` fails on a migration, it means that object was created in the Lovable UI and never captured in a migration file — the build session fixes the migration chain and re-runs. (Verification in Step 8 catches this anyway.)
- House-rule change to note: on your own Supabase, the old Lovable constraints are gone — migrations apply via CLI instead of paste-into-SQL-editor, and `storage.buckets` SQL is no longer blocked (we still create the bucket by hand in Step 3 for clarity).

### Step 3 — Dashboard configuration (30 min, Harish)

In the **new** project dashboard:

1. **Storage → New bucket:** name `company-assets`, private. (Same name as today — stored paths keep working. The RLS policies already redeployed with `db push`.)
2. **Database → Extensions:** enable `pg_cron` + `pg_net` if you use scheduled jobs (the 30-day cleanup from Phase D2).
3. **Authentication → URL Configuration:** Site URL `https://app.enthrella.com`; redirect allow-list: your Pages URLs + localhost for testing. (Client custom domains get added per-domain as they onboard — §6.5 of the Phase E doc.)
4. **Authentication → Sign In / Providers:** email/password on; confirm TOTP MFA available (it is, built-in).
5. **Recommended, not blocking:** set up **custom SMTP** (Resend free tier or Amazon SES) under Authentication → SMTP. Supabase's built-in email is rate-limited and fine for testing, but client invites/password resets deserve real delivery before you scale.

### Step 4 — Rehearsal import (dry run)

Run the full data migration (§5) into the new project **while Lovable Cloud stays live**. Then point a **test deployment** at it (a Pages preview branch with the new env vars) and click through everything. This proves the process end-to-end with zero risk. Before the real cutover, wipe the imported data (or drop/recreate the project) so the real import starts clean.

### Step 5 — Real data migration (maintenance window)

**Writes during this window would be lost** — do it inside the announced window.

#### 5.1 Primary path — pg_dump (needs the connection string from Step 0)

```bash
# SOURCE = Lovable Cloud connection string, TARGET = new project connection string
pg_dump --data-only --no-owner --no-privileges \
  --schema=auth --schema=public --schema=storage \
  "$SOURCE_DATABASE_URL" > lovable-data.sql

psql "$TARGET_DATABASE_URL" -v ON_ERROR_STOP=1 -f lovable-data.sql
```

Dumping `auth` is what preserves **bcrypt password hashes and TOTP factors** — users log back in with the same password and the same authenticator app. Never use CSV table exports for this; they strip password hashes and force a platform-wide password reset.

#### 5.2 Fallback path — scripted export (if Lovable Cloud gives no direct DB access)

1. Temporarily deploy a throwaway edge function on Lovable Cloud that returns its injected `SUPABASE_SERVICE_ROLE_KEY`; copy it; delete the function immediately. (Treat that key like a master password — it bypasses all RLS.)
2. A build session writes a one-off script that uses the admin API to: export `auth.users` + `auth.identities` + MFA factors, dump every `public` table as JSON, and download every storage file — then imports all of it into the new project with the new service key.
3. Same verification (Step 8) applies.

### Step 6 — Storage files copy

The database dump only carries storage *metadata*, not the file bytes. Copy the actual files:

```bash
# S3 credentials: old project → Storage → S3 Access; new project likewise
aws s3 sync s3://company-assets ./storage-backup/company-assets \
  --endpoint-url https://<old-ref>.supabase.co/storage/v1/s3 --profile old
aws s3 sync ./storage-backup/company-assets s3://company-assets \
  --endpoint-url https://<new-ref>.supabase.co/storage/v1/s3 --profile new
```

Verify: file counts match between the two buckets.

### Step 7 — Repoint everything

1. **Pages:** update environment variables `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` to the new project → redeploy. This is the cutover moment: `app.enthrella.com` now runs on your Supabase.
2. **AI worker:** update `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` in `acrowell-ai-worker/wrangler.jsonc` → `npx wrangler deploy`. (Also confirm `ALLOWED_ORIGINS` covers `app.enthrella.com` and planned client domains.)
3. **Build tooling:** build session replaces `@lovable.dev/vite-tanstack-config` with the standard Vite + TanStack Router config (the file's own comment lists what it must keep). Verify `npm run build` passes and deploy.
4. **Local dev:** update the local `.env` to the new project.

### Step 8 — Verification checklist (Harish, click-by-click)

- [ ] Open `app.enthrella.com` — log in with your **existing password** (proves auth migrated)
- [ ] Console login at `/console` — **authenticator-app 2FA still works** (proves TOTP migrated)
- [ ] A company: dashboard numbers look right; open an order; open a stored file/logo (proves storage)
- [ ] AI assistant answers a question (proves worker + edge functions + secrets)
- [ ] Create a test lead, refresh, still there (proves writes)
- [ ] **Row-count check** (build session runs): compare every table's count, old vs new — must match exactly
- [ ] **Table-list check**: table list in old vs new — catches anything ever created via UI that wasn't in migrations
- [ ] Bug-report upload + cleanup button work (proves storage policies + cron path)

### Step 9 — Fallback window, then cancel Lovable

1. Keep Lovable Cloud running untouched for **7 days** as the safety net. Rollback = revert the two Pages env vars + worker var (old values kept in the password manager). Do **not** let anyone write to the old backend during this week.
2. After a clean week: cancel the Lovable subscription (Settings → Billing → Downgrade; the cancel button is behind the Stripe portal). Deleting the Lovable *project* kills the old database — do that last, or simply leave the project dormant on the free plan for a month before deleting. Lovable Cloud cannot be "disconnected" self-service; cancelling + deleting the project is the exit.

---

## 5. Honest risks

- **Direct DB access on Lovable Cloud is the one unknown** (Step 0 settles it in 2 minutes). The scripted fallback (§5.2) covers the "no" answer; it just costs a build session instead of one command.
- **UI-created objects:** anything ever created by clicking in the Lovable Cloud UI rather than via a migration file won't redeploy. The Step-8 table-list comparison catches this; fix = write a migration for the stragglers.
- **Sessions reset:** the new project has new JWT keys, so everyone logs in once more. Passwords and 2FA carry over; active sessions don't. Do the cutover in the announced window.
- **Edge-function secrets are manual:** forgetting one (e.g. an AI key) = that feature silently fails. The Step-0 inventory + Step-8 checklist exist precisely for this.
- **Ordering matters:** don't cancel Lovable before the fallback week is clean. Deleting the project is irreversible.

## 6. Suggested timeline

| Day | What |
|---|---|
| 1 | Phase E one-time Cloudflare setup (frontend onto Pages, backend still Lovable Cloud) |
| 2–3 | Phase E build (custom domains system) |
| 4 | Steps 0–3 of this plan (new Supabase fully stood up) |
| 5 | Step 4 rehearsal import + test deployment click-through |
| 6 (evening) | Steps 5–7 real migration + repoint, inside the maintenance window |
| 7–13 | Step 8 verification + fallback week |
| 14 | Step 9: cancel Lovable. Ties cut. |

Total hands-on effort: roughly **2 build sessions + ~3 hours of your clicking**, spread over two weeks with a safety net the whole way.
