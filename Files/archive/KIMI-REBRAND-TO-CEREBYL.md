# Kimi task — full rebrand to **Cerebyl**

*Paste this whole file into a fresh Kimi chat. Self-contained. Written 22 July 2026.*

## The job in one line
The app is being renamed to **Cerebyl**. Remove every customer- and operator-facing mention of the old names **"Acrowell CRM" / "Lead CRM" / "Pharma Lead CRM"** and **"Enthrella"** from the app's UI, and replace with **Cerebyl**. This is a text/branding pass only — no logic, schema, routing, or behaviour changes.

Repo: `/Users/harishsharma/Claude/Pharma BMT/leadenthrella` (branch `main`). Pull latest first.

---

## ⛔ DO NOT TOUCH — these contain the old strings but are real infrastructure. Renaming them BREAKS the app.

These are non-negotiable. If you "helpfully" rename any of these, the AI assistant or login stops working:

1. **`src/lib/use-assistant.ts`** — the URLs
   `https://acrowell-ai-worker.icy-sunset-05b0.workers.dev/chat` and `/extract`
   (`ASSISTANT_URL`, `EXTRACT_URL`). These are the **real deployed Worker hostname**. Leave them EXACTLY as-is.
   Also leave the code comments in this file that mention `acrowell-ai-worker/src/...` — they point at a real sibling folder by that name.
   Also leave `ORDER_PREFILL_STORAGE_KEY = "acrowell_order_prefill_v1"` — it's an internal browser-storage key, never shown to anyone.
2. **`src/lib/use-platform-analytics.ts`** — the comment mentioning `acrowell-ai-worker/src/gemini.ts` is a real path. Leave it.
3. **Anything containing the string `leadenthrella`** (e.g. `.workers.dev` URLs, `.claude/launch.json`'s `"leadenthrella-dev"`). That's the deployment/repo name, NOT the brand — leave every occurrence.
4. **`isPlatformHostname()` in `src/lib/use-domain-branding.ts`** — the `enthrella.com` / `.enthrella.com` entries in the allow-list are live domain logic, not display text. **Do not remove or change any hostname entry.** (You *may* update plain English code-comments in this file per the rules below, just not the hostname strings themselves.)
5. **Everything under `supabase/functions/`** — leave all edge functions alone. (Claude handles those separately — they need redeploys and correctness review.)
6. **Do NOT rename any client-company data.** "Acrowell Labs" exists as a real client company row in the live database. Never rename company data, seed data, or anything that could be a real record.

If you're unsure whether a given `acrowell`/`enthrella` hit is infrastructure or display text: **a URL, hostname, email address, env var, storage key, or file path = leave it. On-screen words a human reads = change it.**

---

## ✅ The brand to apply

- **Product name:** `Cerebyl`
- **Tagline / descriptor** (use where the old strings had "Pharma Lead Management" / "Multi-company pharma lead management" etc.): **`AI-powered pharma business management`** (short form where space is tight: `Pharma business management`).
  - Harish can tweak this wording later — just apply it consistently so there's one tagline, not five.
- The internal developer console currently called **"Enthrella Operations"** becomes **"Cerebyl Operations"**. "Enthrella" alone (e.g. the sidebar wordmark) becomes **"Cerebyl"**.

---

## The exact changes

### 1. Page titles (`head()` meta titles) — replace the brand half of each

Every one of these becomes `"<Page> — Cerebyl"`. Full list (file : current title → new title):

| File | New title |
|---|---|
| `src/routes/__root.tsx` (line ~86, and the matching `og:title` + `twitter:title` ~88/92) | `Cerebyl — AI-powered pharma business management` |
| `src/routes/auth.tsx` (~15) | title `Sign in — Cerebyl`; description → `Sign in to Cerebyl.` |
| `src/routes/dashboard.tsx` | `Dashboard — Cerebyl` |
| `src/routes/leads.index.tsx` | `Leads — Cerebyl` |
| `src/routes/leads.$id.tsx` | `Lead details — Cerebyl` |
| `src/routes/hot-warm.tsx` | `Hot & Warm — Cerebyl` |
| `src/routes/followups.tsx` | `Follow-Up Schedule — Cerebyl` |
| `src/routes/my-day.tsx` | `My Day — Cerebyl` |
| `src/routes/booked-areas.tsx` | `Booked Areas — Cerebyl` |
| `src/routes/duplicates.tsx` | `Duplicate Flags — Cerebyl` |
| `src/routes/leaderboard.tsx` | `Leaderboard — Cerebyl` |
| `src/routes/parties.index.tsx` | `Parties — Cerebyl` |
| `src/routes/parties.$id.tsx` | `Party — Cerebyl` |
| `src/routes/orders.index.tsx` | `Orders — Cerebyl` |
| `src/routes/orders.$id.tsx` | `Order — Cerebyl` |
| `src/routes/products.tsx` | `Products — Cerebyl` |
| `src/routes/product-performance.tsx` | `Product Performance — Cerebyl` |
| `src/routes/stock.tsx` | `Stock — Cerebyl` |
| `src/routes/team.tsx` | `Team — Cerebyl` |
| `src/routes/transporters.index.tsx` | `Transporters — Cerebyl` |
| `src/routes/transporters.$id.tsx` | `Transporter — Cerebyl` |
| `src/routes/settings.tsx` (~54) | `Company Settings — Cerebyl` |
| `src/routes/users.tsx` | `Manage Users — Cerebyl` |
| `src/routes/help.tsx` (~7) | `Help — Cerebyl` |
| `src/routes/trash.tsx` | `Trash — Cerebyl` |
| `src/routes/developer.tsx` (~7) | `Developer — Cerebyl` |
| `src/routes/console.tsx` (~16) | `Cerebyl Operations` |
| `src/routes/console.index.tsx` | `Dashboard — Cerebyl Operations` |
| `src/routes/console.companies.index.tsx` | `Companies — Cerebyl Operations` |
| `src/routes/console.companies.$companyId.tsx` (~33) | `Company — Cerebyl Operations` |
| `src/routes/console.users.tsx` | `Users — Cerebyl Operations` |
| `src/routes/console.bugs.tsx` | `Bug reports — Cerebyl Operations` |
| `src/routes/console.errors.tsx` | `Errors — Cerebyl Operations` |
| `src/routes/console.security.tsx` | `Security — Cerebyl Operations` |

### 2. On-screen text (not titles)

- **`src/components/app-shell.tsx`**
  - ~line 78: the sidebar subtitle under the company name currently `Lead CRM` → `Cerebyl`.
  - ~line 102: footer `Pharma Lead CRM` → `Cerebyl`. (Leave the `Business tool only.` line on ~103 as-is.)
- **`src/routes/auth.tsx`**
  - ~line 89: `const displayName = tenant?.name ?? "Acrowell CRM";` → default `"Cerebyl"`.
  - ~line 118: the muted subtitle `Multi-company pharma lead management` → `AI-powered pharma business management`.
  - The "Created by Harish Sharma" `/developer` link at the bottom: leave the link, it's fine.
- **`src/components/console-shell.tsx`**
  - ~line 33: the wordmark `Enthrella` → `Cerebyl`.
  - ~line 78: header `Enthrella Operations` → `Cerebyl Operations`.
- **`src/components/console-login.tsx`**
  - ~line 26: heading `Enthrella Operations` → `Cerebyl Operations`.
- **`src/routes/developer.tsx`**
  - ~line 22: `Enthrella Online Solutions` → `Cerebyl`.
- **`src/routes/help.tsx`**
  - ~line 15: heading `How Acrowell CRM works` → `How Cerebyl works`.
- **`src/routes/settings.tsx`**
  - ~line 539: the textarea placeholder `e.g. Acrowell Labs — Pharma Manufacturer`. This is an EXAMPLE for the *client's own* invoice header, so do NOT put "Cerebyl" here — make it a neutral placeholder: `e.g. Your Company Name — Pharma Manufacturer`.

### 3. Code comments mentioning "Enthrella" (cosmetic, optional but do it)

Plain-English comments that say "Enthrella" in a branding sense → "Cerebyl". Specifically:
- `src/lib/use-domain-branding.ts` ~line 12 (`hide Enthrella naming`), ~line 34 (`normal Enthrella experience`). **Only the comment words — do NOT touch the `enthrella.com` hostname strings lower in the same file.**
- `src/routes/auth.tsx` ~line 75 comment (`the normal Enthrella login`).
- `src/routes/console.companies.$companyId.tsx` ~line 628 (`no Enthrella naming` inside the Custom domain card description that users see) → `no Cerebyl naming`. This one is actually on-screen text, so definitely change it.

---

## Verify before you hand back
1. `grep -rniE "acrowell crm|lead crm|pharma lead|enthrella operations|enthrella online" src` → must return **zero** hits.
2. `grep -rn "acrowell-ai-worker.icy-sunset" src` → must still return the **two** URL hits in `use-assistant.ts` (proof you didn't break the assistant).
3. `grep -rn "leadenthrella" src .claude` → the deployment-name hits must still be present and unchanged.
4. `npx tsc --noEmit` → error count must be unchanged from before your edits (the project has a known pre-existing baseline; you must not add new errors).
5. Do a quick visual read of `auth.tsx`, `app-shell.tsx`, `console-shell.tsx` to confirm the wordmarks read "Cerebyl" cleanly.

## When done
Commit with a clear message (e.g. `Rebrand app UI to Cerebyl (Acrowell/Enthrella removed from all user-facing text)`) and tell Harish to push. Do not push yourself.

---

### Not your job (Claude is handling these — don't touch)
- AI Worker CORS/allow-origins for the new `app.cerebyl.com` domain.
- The `supabase/functions/platform-manage-domain` edge function's stale `customers.enthrella.com` fallback + own-domain list.
- The `seed-demo` edge function's "Acrowell Labs" demo company.
- Any renaming of the deployed Worker or `enthrella.com`/`admin@enthrella.com` infrastructure.
