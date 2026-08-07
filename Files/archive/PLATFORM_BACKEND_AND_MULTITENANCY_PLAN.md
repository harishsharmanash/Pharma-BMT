# Enthrella Platform — Developer Backend, Multi-Company Setup & Cost Plan

*A plain-language brainstorming document. Written for Harish (non-developer owner) so you can understand every decision, then hand pieces of it to Claude/Lovable to build.*

*Date: 19 July 2026 · Currency: ₹ (INR) · FX assumption: $1 = ₹86*

---

## 0. How to read this doc

I've split it into three parts so you never get lost:

1. **The idea** — how a "one app, many companies" business is normally built (the big picture).
2. **What to build** — the developer backend, the custom-domain question, and the new in-app features (roles + feature toggles).
3. **The money** — what you've spent, and a month-by-month cost table for the next 12 months.

Wherever I use a technical word, I explain it in brackets the first time. Nothing here is decided in stone — the last section lists the choices that are yours to make.

---

## 1. The big picture: three "floors" of the same building

Right now you think of Acrowell CRM as *one app*. To run it as a business serving many companies, think of it as a **building with three floors**. Same building, same plumbing — but different people are allowed on different floors.

| Floor | Who uses it | What they can do | Exists today? |
|-------|-------------|------------------|---------------|
| **Floor 1 — The App (tenant side)** | A company's staff (sales reps, admins) | Use leads, parties, orders, the AI co-worker, etc. | ✅ Yes — this is what you built |
| **Floor 2 — Company Admin** | The *owner/admin* of one company | Add their own staff, create roles, turn features on/off (within what they're allowed) | ⚠️ Partly — needs the new features below |
| **Floor 3 — Developer / Platform Admin (you, alone)** | **Only you** | Create companies, hand out tokens, decide which features each company is *allowed*, see every company's logs and errors, read AI usage data | ❌ Not built yet — this is the main thing you're asking for |

**Key idea — "multi-tenant":** A *tenant* is one company living inside your app. A *multi-tenant* app means many companies share the **same code, same database, same servers** — but each company only ever sees **its own data**, thanks to security rules (in your case Supabase "Row Level Security" / RLS, which you already use). This is the single most important concept in the whole doc, because it's what makes both the developer backend *and* the custom-domain feature cheap and easy. **One system, many companies — not many systems.**

---

## 2. Floor 3 — The Developer Backend (your control room)

This is your "mission control." It's a **separate, password-protected area** (e.g. `enthrella.com/admin` or a hidden `/developer` route) that only your account can open. Think of it as the dashboard an airline's operations team uses — the passengers (companies) never see it.

Here's everything it should eventually do, grouped so it's easy to prioritise. I've marked each with **Must-have (v1)**, **Should-have (v2)**, or **Nice-to-have (later)**.

### 2.1 Company management  *(Must-have)*
- **Create / edit / suspend / delete a company** — the "New Company" button that spins up a fresh, empty CRM for a client in seconds.
- Set the company's **plan** (Free / Starter / Pro / Custom) and **status** (Active, Trial, Suspended for non-payment, Archived).
- Set a **trial end date** and **who to contact** (owner name, phone, email).
- **Impersonate / "View as this company"** — a safe way for you to log in *as* a company (read-only or full) to reproduce a bug they reported. This is gold for support. (Every serious SaaS has this; it must be logged so it's auditable.)

### 2.2 Feature entitlements — "what each company is *allowed*"  *(Must-have)*
This is the heart of "Company A wants 3 features, Company B wants 10."
- A master **list of all features/modules** (Leads, Parties, Orders, Products, Stock, Staff/Salary, Transporters, AI Co-worker, Backups, etc.).
- For each company, a set of **on/off switches ("entitlements")** — the features *you* permit them to have. This is the **outer gate**.
- The company admin then has their *own* toggles (Floor 2) — the **inner gate** — but they can only switch on things you've already permitted. (More on this two-gate design in §4.)
- Bonus: **per-feature limits** later, e.g. "max 5 users on Starter," "AI limited to 500 messages/month."

> **Analogy:** You (developer) decide which *rooms of the house* a tenant rents. The tenant (company admin) decides which *lights inside those rooms* to switch on. They can't light up a room they never rented.

### 2.3 Users & tokens management  *(Must-have)*
- See **all users across all companies**, search by name/email/phone, reset a password, disable an account, unlock someone who's locked out.
- **Tokens / API keys**: view, rotate (regenerate), or revoke the keys each company uses — including the **Gemini/AI key** and any Supabase service keys. "Rotate" = replace a key with a new one if it leaks, without breaking the app.
- See **who is logged in / last active**.

### 2.4 Logs, errors & health monitoring  *(Must-have — this is the "something crashed, let's go see why" part you described)*
- A **per-company activity log**: who did what, when (created order, deleted party, changed a rate…).
- An **error log**: when the app throws an error for a company, capture the error message, which page, which user, timestamp — so you open their profile and *immediately* see "Order #123 failed to save because the transporter field was empty at 3:04pm."
- **Uptime / health**: is the app up? Are the AI worker and database responding?
- **Alerts**: get an email/WhatsApp ping when a company hits an error a lot, or when AI spend spikes.

> Tools that do the heavy lifting here cheaply (mostly free tiers): **Sentry** (catches and groups crashes with the exact line of code), **Supabase logs** (database/queries), and **Cloudflare analytics** (traffic). You don't have to build crash-tracking from scratch — you plug Sentry in and read it in your admin panel or in Sentry's own dashboard.

### 2.5 AI & product analytics — "learn from usage to improve the AI"  *(Should-have — and a real competitive edge)*
Every message a user sends the AI co-worker, and every action they take, is **data you can learn from**. Capture (with care — see privacy note):
- **What people ask the AI** the most (top intents: "show me today's follow-ups," "add an order," etc.) → tells you what to make faster/better.
- **Where the AI fails or gets corrected** → your training/improvement backlog. This is how you make the co-worker smarter over time.
- **Which features get used vs. ignored** → what to build next, what to drop.
- **Per-company usage & AI cost** → so you can price fairly and spot heavy users.

> **Privacy note (important, since this is pharma customer data):** Store this in a way you can defend. Prefer logging *patterns* (intents, feature names, counts, error types) over raw customer records. If you must store the actual AI messages, keep them in a **separate analytics store**, restrict access to just you, and put a line in each company's terms saying anonymised usage data is used to improve the service. Never mix one company's data into another's, and never feed one company's private data to another's AI.

### 2.6 Billing & subscriptions  *(Should-have)*
- Track each company's plan, **next renewal date**, payment status (Paid / Overdue).
- Auto-**suspend** a company (read-only lock) when they don't pay, auto-restore when they do.
- Later: connect **Razorpay/Stripe** to collect payments automatically and generate invoices. (Not urgent while you have 2 free pilots.)

### 2.7 Platform-wide stats  *(Nice-to-have)*
- Total companies, total users, total orders processed, total AI messages, total AI spend — your "business at a glance" screen.

---

## 3. The custom-domain / white-label question (your Acrowell Labs example)

You asked the exact right question:

> *If a client wants to run the app on **their own** domain (e.g. `acrowelllabs.com`), do I set up a whole separate copy — new API keys, new workers, new accounts — for them? Or can one system serve them on their own domain?*

**Short answer: Do NOT set up a separate copy. Serve them from your one system, mapped to their domain. This is called "white-labelling," and it's a standard, well-solved thing.**

### 3.1 Why not separate copies
Separate infrastructure per client means: separate deployments to update every time you fix a bug, separate keys to rotate, separate databases to back up, separate bills. With 20 clients you'd have 20 apps to babysit — it does not scale, and it's exactly the trap you're sensing. Avoid it.

### 3.2 How white-labelling actually works (in plain steps)
Because your app is **multi-tenant** (§1), the app already knows how to show only one company's data. Adding a custom domain is mostly a *routing + branding* job:

1. **They point their domain at you.** The client adds two small DNS records at their domain registrar (a CNAME/A record) pointing `app.acrowelllabs.com` to your servers. You give them the exact lines to paste — it's a 5-minute copy-paste for them.
2. **You register the domain in your Developer Backend.** In the company's profile, you add a field: "Custom domain = `app.acrowelllabs.com` → belongs to Company: Acrowell Labs."
3. **The app resolves the company by its domain.** When a request comes in, the app looks at *which domain it came through*: `enthrella.com/bmt` → Acrowell BMT; `app.acrowelllabs.com` → Acrowell Labs. Then it loads that company's data, logo, colours, and enabled features. Same code, same database, same AI key — just a different "front door" and a different skin.
4. **SSL/HTTPS is automatic.** Cloudflare (which you already use) can issue the security certificate for the client's domain automatically ("SSL for SaaS" / custom hostnames). No manual certificate juggling.
5. **Branding per company** — logo, name, colours, and even "hide the Enthrella name" — all come from that company's settings row. So Acrowell Labs sees *their* logo and, if you allow it, never sees "Enthrella" at all. To them it's *their* software. To you it's one system.

> **Analogy:** A shopping mall (your platform) has many shops (companies). One shop puts up its own signboard on a side entrance from the main road (custom domain). Customers walk straight into that shop and think it's a standalone store — but the mall's electricity, security, and plumbing (your servers, database, AI) are shared behind the wall.

### 3.3 The one real exception
If a big client has a **hard legal/compliance requirement** that their database must be physically separate ("data isolation"), *then* you give them their own database — but ideally still the **same codebase** (so you maintain one app, not many). This is rare for a small pharma CRM. Cross that bridge only when a client's contract forces it. Default = shared, white-labelled.

### 3.4 What this means for "Acrowell Labs wants only lead management"
Easy, and it's the payoff of everything above:
- In your Developer Backend, create the company "Acrowell Labs."
- Under **entitlements**, switch **ON only "Leads"** (and its sub-views), switch **OFF** everything else.
- Add their custom domain.
- Done. They get a lead-management-only app on their own domain, and you built *nothing new* — you just flipped switches.

---

## 4. New in-app features to add (Floor 2 — Company Admin powers)

Two features you named, plus how they connect to the developer backend.

### 4.1 Roles & permissions the admin can edit ("RBAC")
**RBAC = Role-Based Access Control** — a fancy name for "what each job title is allowed to do."

- The company admin can **create users** (already partly there) *and* **create/edit roles** — e.g. "Sales Rep," "Manager," "Accountant," "Read-only Auditor."
- For each role, the admin ticks a grid of **permissions**: can view leads / can edit leads / can delete orders / can see dues / can export data / can use AI, etc.
- Assign a role to each user. Change the role → their powers change instantly.

**How to build it sanely:** define permissions as a simple list (e.g. `leads.view`, `leads.edit`, `orders.delete`, `reports.export`). A role is just a checklist of those. This keeps it flexible — new feature later just adds new permission lines. Start with 3–4 **preset roles** (Admin, Manager, Rep, Viewer) that admins can clone and tweak, so nobody faces a blank grid.

### 4.2 Feature toggles the admin controls — with the two-gate rule
- In **Settings**, the company admin sees toggles for features (Stock, Staff/Salary, Transporters, AI, etc.) and turns on only what they want cluttering their screens.
- **The critical rule you already described:** the admin can only toggle features **you (developer) have entitled**. If you haven't allowed "Staff/Salary" for that company, the toggle is greyed out / hidden — they *cannot* switch it on.

**The two gates, together:**
```
Developer entitlement (Floor 3)      Company toggle (Floor 2)      Result
        ON                                    ON                   Feature visible & usable
        ON                                    OFF                  Allowed, but they chose to hide it
        OFF                                   (greyed out)         Not available at all
```
This gives you clean upsell power: a company on Starter asks for Stock → you flip their entitlement ON → the toggle appears in *their* settings → they enable it. No code change, no deploy.

---

## 5. Suggested build order (so you're not overwhelmed)

You don't build all of Floor 3 at once. Recommended sequence:

1. **Phase A — Foundations (do first).** Add the "entitlements" switches per company + the two-gate feature toggles. This alone unlocks "Company A = 3 features, Company B = 10" and the Acrowell-Labs-lead-only case. *Highest value, lowest effort.*
2. **Phase B — Roles & permissions (RBAC)** inside each company. Needed before you take on companies with more than a couple of staff.
3. **Phase C — Developer console basics:** create/suspend company, view users, impersonate/"view as," reset passwords.
4. **Phase D — Error & activity logging** (plug in Sentry + a per-company activity log). Do this before you have paying clients, so support is painless.
5. **Phase E — Custom domains / white-label.** Do when your first client actually asks for their own domain.
6. **Phase F — AI & usage analytics**, then **billing automation** (Razorpay) last, once revenue justifies it.

---

## 6. The money — what you've spent & the next 12 months

> **All figures in ₹. These are ballpark planning numbers, not invoices — every assumption is labelled so you can correct any single number and I'll recompute.**

### 6.1 What you've spent so far (one-time / to date)

| Item | What it's for | Amount (₹) | Notes |
|------|---------------|-----------:|-------|
| Lovable — 100 credits | Building the app (AI dev tool) | ~2,150 | ≈ $25 |
| Google AI Studio top-up | Gemini AI (the co-worker's brain) | 2,500 | Prepaid, still being drawn down |
| Cloudflare | Domain/DNS/CDN | ~430 | ≈ $5, one-time |
| **Subtotal spent** | | **~5,080** | |
| Domain `enthrella.com` | Your platform address | 1,800 / yr | Renews **15 Aug 2026** |

**So far, out of pocket ≈ ₹5,000, plus the ₹1,800 domain renewal coming in August.** Very lean.

### 6.2 Assumptions behind the 12-month forecast

| Driver | Assumption |
|--------|-----------|
| **Growth** | Start with **2 free** pilot companies. Add **2 paying** companies **each month**. So Month 1 = 4 companies, Month 12 = 26 companies. |
| **AI (Gemini) cost** | ~₹300 per active company per month (blended average, moderate use). Scales with company count. This is your main variable cost. |
| **Backend (Supabase / Lovable Cloud)** | **Free tier** covers roughly the first ~4 months of low data; then **Pro ≈ ₹2,150/mo** (~$25) from Month 5 as data/companies grow. |
| **Lovable subscription** | ₹2,150/mo kept for ongoing development this year. **You can cancel this** once the app is stable and fully moved to Cloudflare + Supabase — see §6.5. |
| **Frontend hosting** | Cloudflare Pages — effectively **₹0** ongoing. |
| **Domain** | ₹1,800/yr ≈ ₹150/mo (spread out). |
| **Not included** | Your own tools (Claude subscription), Razorpay fees (only if/when you charge), marketing. Add these separately when relevant. |

### 6.3 Month-by-month cost forecast (₹)

| Month | Companies | AI (Gemini) | Backend (Supabase) | Lovable (dev) | Domain | **Monthly total** |
|-------|:---------:|------------:|-------------------:|--------------:|-------:|------------------:|
| 1 | 4 | 1,200 | 0 (free) | 2,150 | 150 | **3,500** |
| 2 | 6 | 1,800 | 0 (free) | 2,150 | 150 | **4,100** |
| 3 | 8 | 2,400 | 0 (free) | 2,150 | 150 | **4,700** |
| 4 | 10 | 3,000 | 0 (free) | 2,150 | 150 | **5,300** |
| 5 | 12 | 3,600 | 2,150 | 2,150 | 150 | **8,050** |
| 6 | 14 | 4,200 | 2,150 | 2,150 | 150 | **8,650** |
| 7 | 16 | 4,800 | 2,150 | 2,150 | 150 | **9,250** |
| 8 | 18 | 5,400 | 2,150 | 2,150 | 150 | **9,850** |
| 9 | 20 | 6,000 | 2,150 | 2,150 | 150 | **10,450** |
| 10 | 22 | 6,600 | 2,150 | 2,150 | 150 | **11,050** |
| 11 | 24 | 7,200 | 2,150 | 2,150 | 150 | **11,650** |
| 12 | 26 | 7,800 | 2,150 | 2,150 | 150 | **12,250** |

**12-month totals (rounded):**

| Category | Year total (₹) |
|----------|---------------:|
| AI (Gemini) | ~54,000 |
| Backend (Supabase Pro, months 5–12) | ~17,200 |
| Lovable (development) | ~25,800 |
| Domain | ~1,800 |
| **Total for the year** | **~98,800 (≈ ₹1 lakh)** |

**Plain-English summary:** Expect to spend **around ₹1 lakh over the next 12 months** — starting near **₹3,500/month** and rising to about **₹12,000/month** by month 12 as companies and AI usage grow. Average ≈ **₹8,200/month**. Add the **₹5,000 already spent** and you're at roughly **₹1.05 lakh all-in for the year**.

### 6.4 Where pricing would slot in (you said "not decided yet")
You add 2 paying companies a month. Whatever you charge, income compounds fast while costs grow slowly:
- If a company pays **₹X/month**, then by Month 12 you have **24 paying companies** → monthly income = **24 × ₹X**.
- Your Month-12 cost is only ~₹12,250. So your **break-even price** across the year is roughly **₹12,250 ÷ 24 ≈ ₹510 per company per month** — i.e. even charging **~₹500–600/company** covers *all* platform costs by month 12; anything above that is profit. Realistically a pharma CRM sells for far more than that, so the platform is comfortably self-funding once a handful of clients pay. *(Tell me a price and I'll build the full profit/break-even table.)*

### 6.5 How to cut costs
- **Cancel Lovable (~₹25,800/yr)** once the app is stable and you're editing via Claude Code + Cloudflare/Supabase directly. Biggest single saving.
- **Gemini Flash, prompt caching, and short prompts** keep AI cost low — your AI cost model already tracks this (`AI_Cost_Model.xlsx`). ₹300/company is conservative; it may run lower.
- **Stay on free tiers** (Cloudflare Pages, Supabase free, Sentry free) as long as your data volumes allow — could push the Supabase Pro start past Month 5.
- **Annual billing** on Supabase/tools often saves ~2 months vs monthly.

---

## 7. Decisions that are yours to make (open questions)

1. **Admin location & security.** Do you want the developer console at `enthrella.com/admin` (hidden route, only your login) — plus should I require a second factor (OTP) for it, since it can see every company?
2. **Branding on white-label domains.** For clients on their own domain, do you want the Enthrella name fully hidden ("pure white-label"), or a small "Powered by Enthrella" footer?
3. **AI data retention.** Are you comfortable storing *anonymised patterns only*, or do you also want to keep raw AI conversations for training? (Affects your privacy terms.)
4. **Pricing tiers.** When ready, define 2–3 plans (which features + user limits per plan). That instantly maps to the entitlement switches in §2.2.
5. **First thing to build.** My recommendation is **Phase A (entitlements + two-gate toggles)** — it delivers the "3 vs 10 features" and "Acrowell-Labs-leads-only" outcomes immediately. Want me to spec that phase in detail next?

---

*Prepared as a planning/brainstorming reference. Nothing here changes your app until you approve a build phase. Ask me to expand any section (e.g. a detailed spec for the Developer Backend, or the full profit model once you set a price).*
