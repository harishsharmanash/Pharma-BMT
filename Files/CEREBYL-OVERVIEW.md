# Cerebyl — Product, Architecture & Security Overview

**A vertical SaaS operating system for the Indian PCD pharma franchise industry.**

| | |
|---|---|
| **Product** | Cerebyl |
| **Live at** | https://app.cerebyl.com |
| **Category** | Vertical B2B SaaS — CRM + distribution + operations, purpose-built for one industry |
| **Market** | Indian PCD (Propaganda-Cum-Distribution) pharma franchise companies |
| **Stage** | Feature-complete v1, in production, multi-tenant, with paying-grade infrastructure |
| **Document date** | 9 August 2026 |
| **Audience** | Investors, technical due-diligence reviewers, brand/security experts |

> **Positioning note:** Cerebyl is a *business operations tool*. It makes no medical,
> clinical, or therapeutic claims of any kind. Every generated document carries a
> "Business tool only" footer. This is a deliberate regulatory boundary, not an oversight.

---

## 1. What problem this solves

### The industry

India's PCD pharma franchise model is one of the largest and least-digitised distribution
structures in the country. A PCD company owns a brand and a product catalogue, and grants
monopoly distribution rights for a geography — a district, a set of pincodes, a state — to
a franchise partner (the "party" or distributor). The company never sells to the end
customer. Its entire business is: **generate enquiries → convert them into franchise
partners → protect their territories → supply them stock → collect the money.**

A typical mid-size PCD company runs on:

- **WhatsApp** for lead enquiries, order placement, and payment follow-up
- **Excel** for rate lists, party ledgers, dues, stock, and salary
- **Tally** for accounting, months after the fact
- **A rep's memory** for who owns which territory
- **Paper or PDF** for invoices and order tracking

Nothing in that stack knows about the two things that actually define the business:
**territory monopoly** and **party-specific pricing**. Generic CRMs (Zoho, Salesforce,
HubSpot) don't model them. Generic ERPs (Tally, Busy, Marg) model billing but have no
concept of a lead pipeline, a rep, or a franchise enquiry. So the industry is split
between two categories of software, neither of which fits, and most companies end up
using both badly.

### The specific failures Cerebyl removes

| Failure in the current stack | What it costs the company |
|---|---|
| Two reps promise the same district to two different enquiries | Broken monopoly, refund demand, reputation damage |
| A duplicate enquiry from three portals gets worked by three reps | Wasted effort, an embarrassed prospect |
| Party-specific rates live in a rep's phone | Wrong billing, margin leakage, disputes |
| Dues tracked in a spreadsheet updated weekly | Cash collected late; ageing invisible |
| A distributor calls the rep to ask "where's my order?" | Every order costs a phone call |
| Rep leaves; their book of business leaves with them | Direct revenue loss |
| Owner has no number until the accountant closes the month | Decisions made blind |

### The wedge

**Territory monopoly is the wedge.** It is the one function no horizontal CRM offers, and
it is the single highest-stakes operation in this business — because double-booking a
district is not a data-entry error, it is a broken contract. Cerebyl models booked areas
as first-class data (pincode-level, mapped, exportable), which makes it structurally
correct for this industry in a way a configured Salesforce instance can never be.

---

## 2. What the product actually is

Cerebyl is a **multi-tenant platform**: many pharma companies, one codebase, one database,
strict isolation between them. Each company gets its own branded workspace, its own users,
its own data, and — optionally — its own branded Android app and its own customer portal.

### 2.1 The eight sections

The application is organised into eight top-level sections (reduced from 24 nav items in an
information-architecture restructure completed 6 Aug 2026):

**1. Dashboard** — role-aware home. Owners see revenue, dues, conversion, and lead-source
breakdown; reps see their own day, their follow-ups, and their targets. Charts are real
aggregates, not vanity tiles.

**2. Leads** — the enquiry pipeline. Capture (manual, bulk import, or automatic), scoring
into hot/warm, follow-up scheduling with overdue alerts, duplicate detection across
sources, product-interest tracking, per-rep day plans, and a conversion leaderboard.
Leads arrive automatically: a dedicated email worker receives mail at
`*@leads.cerebyl.com`, parses B2B pharma portal enquiries, and files them as structured
leads without anyone opening an inbox.

**3. Clients (Parties)** — converted franchise partners. Full profiles with contacts,
documents, notes, status history, **party-specific rate cards**, dues and ageing,
reorder patterns, and **territory ownership on an interactive map** with pincode-level
booking and PDF export. Reassigning a party to a different rep is an admin/manager-only
control by design.

**4. Orders** — the money layer. Order capture with per-party rates, GST-compliant invoice
generation (PDF and shareable JPG), a public order-tracking link (`/track/<token>`) a
customer can open without an account, automated status emails, payments and advances,
dues ledger with ageing, transporter assignment, transporter rate cards and statements,
and inbound order requests from the distributor portal.

**5. Products** — catalogue with divisions, categories, molecule search, HSN lookup,
image galleries with a lightbox, promotional offers, visual aids (marketing collateral
for distributors), and **stock/inventory**: batches, locations, movements, expiry
tracking, and purchase entry.

**6. Team** — staff directory, roles and permissions, attendance, leave requests and
balances, salary structures, payroll runs and payslips, advances, expense claims,
incentive rules, sales targets, and a full **rep offboarding / book-of-business transfer**
workflow so a departing rep's parties and leads move cleanly rather than disappearing.

**7. Analytics** — company overview, product performance, rep leaderboard, period-over-period
comparison, CSV export on every report.

**8. Settings** — company profile, branding (logo, name, colours), feature toggles, user
management, backups (scheduled to the company's own Google Drive via OAuth), data import
mappings, encrypted API-key storage, legal documents, and the mobile-app build button.

Plus: a **Bin** with 30-day retention and real restore, an in-app **Help** system, and a
**referral** page.

### 2.2 Ceremate — the built-in AI assistant

Ceremate is a conversational analyst embedded in the product. It is not a chatbot bolted
onto a marketing page; it can read and act on the company's live data within that user's
permissions.

- **Two tiers.** Tier 1 handles routing, quick lookups, and write actions (log a call,
  record a payment, start an order, set a follow-up). Tier 2 is an **agentic analytics
  loop** — up to four reasoning steps over six whitelisted read-only aggregate tools — for
  questions like *"which products dropped this quarter versus last, and which parties
  drove it?"*
- **It draws charts.** The analyst emits a structured chart specification alongside its
  prose, which the app renders as a real bar or line chart with CSV export.
- **It remembers.** Owner-scoped memories with a 30-day expiry, injected as *reference
  data* rather than instructions — so a stored note can never act as a command that
  overrides the assistant's rules. This is a deliberate prompt-injection defence.
- **It reads documents.** Photograph a bill or upload a PDF and it extracts the data.
- **It speaks and listens.** Voice input and optional browser text-to-speech read-back.
- **It is metered.** Every interaction records input, cached, and output tokens per company
  and per user, with server-side daily caps — the browser only *displays* the limit; the
  cap is enforced in a security-definer database function that the AI worker calls before
  doing any work. A limit checked in a browser is advice, not a cap.

### 2.3 The Distributor Portal — the network effect

This is the strategic feature. A pharma company's **customers** log into the same app at
the same URL; routing decides what they see. A distributor gets:

catalogue at *their* negotiated rates with PTS/PTR and margin shown · molecule and division
search · favourites · product pages with images and descriptions · a cart and order request
flow · their dues and ageing · order history, invoices, and live tracking · reorder
suggestions from their own buying history · an account statement PDF defaulting to the
Indian financial year · marketing visual aids · offers · notifications · and their own
party-scoped AI assistant.

On the company side, order requests arrive in an inbox and convert to real orders in one
click, at the **rate the distributor was actually shown** — not whatever the rate card says
today.

**Why it matters commercially:** every distributor onboarded is a second user base the
company did not have to sell to, and it makes switching away from Cerebyl a customer-facing
event, not an internal IT decision. That is a real retention moat.

**Payments are deliberately off by default.** Accepting money in-app carries invoicing and
compliance obligations the product is not ready to assume. Distributors can *declare* a
payment (an intimation), which a human must confirm before it touches the ledger. A payment
intimation is not a payment — that invariant is enforced in code.

### 2.4 Mobile

Per-company **branded Android APKs**, built on demand. A company admin clicks "Download
mobile app"; an entitlement check runs, a CI build is dispatched, and a signed APK lands in
a private object store delivered by a short-lived presigned URL. The company's own logo and
name are on the launcher icon. White-labelling is a separate paid entitlement that only the
platform console can grant — a company cannot switch itself onto a higher tier.

The shell adds native camera, file share to WhatsApp, safe-area handling, and phone
notifications. Notification capability is honestly scoped: today's implementation mirrors
unread items into the system tray while the app is reachable; waking a fully closed app
requires push infrastructure that is specified but not yet built.

---

## 3. Architecture

### 3.1 Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, TanStack Start + Router (file-based routing), TanStack Query |
| UI | Tailwind v4, shadcn/ui on Radix primitives, framer-motion, Recharts, Leaflet |
| Backend | Supabase — PostgreSQL with Row-Level Security, Storage, Edge Functions |
| Edge / hosting | Cloudflare Workers, custom domain, global edge delivery |
| AI | Google Gemini via a dedicated Cloudflare Worker with server-side prompt caching |
| Mobile | Capacitor shell, GitHub Actions CI, private R2 object storage |
| Monitoring | Sentry (EU region), plus an in-app error console |

**Scale of the codebase:** ~352 TypeScript/TSX source files, ~65,000 lines, 72 database
tables, 70 migrations, 21 edge functions, 361 automated tests across 30 files, zero
TypeScript errors as an enforced gate.

### 3.2 Why these choices

- **Edge-delivered frontend.** The app is served from Cloudflare's global network. For
  users on variable Indian mobile networks, this is the difference between a tool that
  feels instant and one that gets abandoned.
- **PostgreSQL with row-level security.** Isolation is enforced by the *database*, not by
  application code. Application-layer tenancy is one forgotten `WHERE` clause away from a
  data breach; database-layer tenancy fails closed.
- **Multi-tenant, explicitly chosen over per-client deployments.** Two hundred companies
  as two hundred deployments means two hundred migration runs per schema change and two
  hundred builds per bug fix — for a small team, one security patch becomes a
  two-hundred-deploy project and shipping stops. The scale numbers here are not large for
  Postgres: 200 companies × 100,000 leads is 20M indexed rows, which is ordinary.
  Per-company variation is handled by feature flags and configuration, not forked code.
- **Edge functions on a service role for anything a customer touches.** The distributor
  portal never talks to the database API directly. Every byte a customer sees passes
  through a function that derives their identity from their token.

### 3.3 Deployment discipline

One scripted deploy path performs, in order: TypeScript gate (must be zero errors) →
environment-variable gate → build → **artifact assertion** (the emitted bundle is grepped
to confirm the backend configuration was actually baked in) → deploy → propagation check →
verdict. Multiple deploy paths were deliberately eliminated after a CI race condition once
overwrote a verified build with an unconfigured one.

That artifact assertion exists because of a real outage: a build once succeeded with every
gate green while shipping a bundle with no backend configuration at all, and nobody could
log in. The lesson — *a green build proves nothing; load the URL* — is now enforced
mechanically rather than remembered.

---

## 4. Security & data protection

Security here is structural, not a checklist bolted on before a compliance review.

### 4.1 Tenant isolation

Every tenant-scoped table carries `company_id`, and every policy on it resolves to
`company_id = current_company_id()` — a database function reading the authenticated user's
profile. This pattern appears **287 times across 70 migrations**. There is no application
code path that can bypass it, because the check is inside Postgres.

**Isolation is provable, not asserted.** A dedicated test suite (`npm run test:isolation`)
logs in as a real distributor user with a public anonymous key and asserts that they cannot
read a single row belonging to another company. A second real company exists in production
purely so that suite has something to test against. This can be run in front of a
prospective client who asks why they should share a database with competitors.

### 4.2 Role-based access, enforced at two levels

Three base roles — **rep**, **manager**, **admin** — form the security backbone in RLS, and
they cannot be edited away. On top of them sits a granular permission layer for custom roles
(e.g. a role with reporting access but no payroll access). The permission layer can *remove*
capability from an admin-based role; it can never *grant* rep-based roles something RLS
would deny.

Standing rules that are enforced, not documented: reps see only their own leads, parties,
and orders; reassigning a party to a different rep is manager/admin only; payroll and bin-purge
are excluded from manager by default; hard deletion is admin-only through *restrictive*
RLS policies on thirteen tables — meaning the database refuses the delete regardless of what
the client sends.

### 4.3 The distributor isolation model

This is the part worth showing a technical reviewer.

A distributor user gets a row in `party_users` and **deliberately no row in `profiles`**.
Since every tenant policy resolves through `current_company_id()`, which reads `profiles`,
that function returns NULL for a distributor — and `company_id = NULL` is never true. A
distributor can therefore read nothing from any table, **not because someone remembered to
write a rule, but as an arithmetic consequence of the schema.** Every table added in the
future inherits that denial for free.

Second wall: distributors never touch the database API at all. All portal data flows through
edge functions running on a service role that derive the party and company **from the JWT,
never from the request body**. A product or order id in a request body is a lookup key only;
every query still pins the token-derived company.

Third wall: the fields a portal response may contain are a hard-coded allow-list, mirrored
byte-identically on both sides. There is no `select *` in the portal path — internal notes
and base cost rates are structurally incapable of leaking.

### 4.4 Secrets

Company API keys (e.g. a company's own AI key or email credentials) are stored encrypted at
rest in a dedicated table using pgcrypto, with the master passphrase held in Supabase Vault
and never in the repository. Encryption and decryption happen only inside security-definer
functions callable by the service role — the key material is never reachable from the
browser, and never appears in a database row in plaintext.

### 4.5 Transport, headers, and monitoring

HSTS with a one-year max-age and subdomain inclusion · `X-Content-Type-Options: nosniff` ·
`X-Frame-Options: DENY` · a referrer policy · a permissions policy · and a Content-Security
Policy currently in report-only mode with violations reporting to Sentry.

Error monitoring is **PII-scrubbed by construction**: default PII collection is off, and
before-send hooks strip request bodies, cookies, and authorisation headers, and reduce the
user object to a bare UUID. No session replay, no log ingestion — deliberately. Because
browser-generated CSP reports bypass the SDK's scrubbing entirely, IP-address storage is
disabled at the monitoring provider.

Roughly 48 routes carry error boundaries. Users see plain-English messages; raw errors go to
the console and an internal error log.

### 4.6 Indian regulatory posture (DPDP Act)

- **Published legal documents** at public routes: privacy policy, terms, refund policy, and
  a data-processing addendum, linked from both the login screen and settings.
- **A consent gate on first login** with two *unbundled, unchecked* boxes (terms and
  privacy) — unbundled consent is a specific DPDP requirement. Consent is version-tracked;
  a version bump re-prompts every user. Every acceptance is written to an immutable audit
  table.
- **A named grievance officer** with a live, monitored contact address.
- **A retention policy in code, not prose.** Company termination starts two clocks:
  personal data is purged 180 days after termination; financial records are retained six
  years to satisfy Indian GST obligations. Customer (party) records are classified as
  *financial* rather than personal precisely because they are the customer of record on a
  tax invoice.
- **Scheduled purges actually run.** A nightly job enforces bin retention, activity-log
  retention, and post-termination purges — verified by firing it manually and reading the
  result, not by assuming the schedule works.

### 4.7 Data integrity

One invariant worth calling out because it represents the engineering standard: the
database API silently caps responses at 1,000 rows and **returns no error**. Every
"fetch everything" query in the app was therefore quietly dropping row 1,001 onward. All
20 such queries now page explicitly, and every paged query is required to end with a unique
tiebreaker sort — because paging over a non-unique sort lets the database order ties
differently per page, which duplicates one row and loses another. The one query that is
still bounded is bounded *visibly*, with the limit disclosed in the interface. The principle:
**never be silently wrong.**

---

## 5. Honest assessment

An investor or reviewer should have the weaknesses as clearly as the strengths.

### What is genuinely strong

1. **Vertical fit no horizontal product can match.** Territory monopoly, party-specific
   rate cards, PTS/PTR margins, GST invoicing, Indian FY statements, HSN lookup — these are
   not configurations of a generic CRM, they are the product.
2. **Real breadth, shipped.** CRM, orders and invoicing, inventory, payroll, a customer
   portal, a branded mobile app, and an AI analyst are all live in production. Most
   competitors in this niche cover one or two of those.
3. **Security architecture that survives scrutiny.** The distributor model in §4.3 is the
   kind of design a technical due-diligence reviewer notices: isolation as a consequence of
   schema shape rather than a rule someone remembered.
4. **Institutional discipline visible in the artifacts.** Zero-error type gate, 361 tests,
   provable cross-tenant isolation, a single scripted deploy path with a post-build artifact
   assertion, published legal docs, DPDP consent, retention jobs that were verified by firing
   them. Very few products at this stage have any of that, let alone all of it.
5. **The portal is a retention moat.** Once a company's distributors are logging in daily,
   churn stops being an internal IT decision.
6. **Cost structure.** Edge hosting, a managed Postgres, and heavily-cached AI inference
   mean gross margin per tenant is high and largely fixed. AI usage is metered per company
   with the true token cost recorded alongside the billed amount, so margin is observable
   per message rather than discovered at month end.

### What is not done, and should be said plainly

1. **Scale is architected but not yet proven.** The app currently loads full datasets into
   the browser and filters client-side. That is correct and fast at present volumes and will
   not hold at the target of 100,000 leads per company. Server-side pagination, SQL-side
   search and aggregation, and list virtualisation are planned and specified but not built.
   This is a known, scoped, ordinary engineering task — not an architectural dead end — but
   it must be completed before onboarding a large client.
2. **Design rollout is partial.** An approved visual direction exists and is live on the app
   shell and the leads section; other sections and the detail pages still carry interim
   styling. The product looks good, not yet uniformly excellent.
3. **The AI quality bar is unmeasured.** A 608-question evaluation corpus exists, but its
   last full run was never scored. Until it is, claims about assistant accuracy should be
   made carefully.
4. **Push notifications are incomplete.** Reaching a user whose app is fully closed requires
   push infrastructure that is designed but not yet stood up.
5. **The CSP is report-only.** It should be enforced once the violation stream is clean.
6. **Infrastructure is on free/entry tiers.** Point-in-time recovery, a staging environment,
   and headroom for load testing all require a paid database plan — a deliberate deferral
   with a tracked list, not an oversight, but a real prerequisite before enterprise clients.
7. **Team concentration.** The product is built by a very small team with heavy AI
   assistance. That is why the velocity and breadth exist; it is also the single largest
   operational risk, and key-person dependency should be assumed until it is addressed.
8. **Commercial validation is the open question.** The engineering is well ahead of the
   go-to-market. Nothing in this document substitutes for paying customers.

### The verdict

**As a product:** this is a serious, unusually complete vertical SaaS. The feature surface
is wider than the category norm, the security model is better than the category norm by a
significant margin, and the wedge (territory monopoly) is defensible because it is
structural rather than cosmetic.

**As an investment:** the technical risk is low and well-understood — the remaining work is
scale engineering and design polish, both of which are ordinary and scoped. The real risk is
commercial: whether Indian PCD pharma companies, who currently pay nothing for WhatsApp and
Excel, will pay for software, and how quickly they can be reached. That is a distribution
and pricing question, not a build question. The build is largely done.

**The single most compelling proof point to demonstrate in a room:** run the cross-tenant
isolation test live. It logs in as a real customer of one company, with a public key, and
demonstrates in seconds that they cannot read one row belonging to another. Most SaaS
companies cannot do that on demand.

---

## 6. One-paragraph summary

**Cerebyl is the operating system for Indian PCD pharma franchise businesses.** It replaces
the WhatsApp-plus-Excel stack these companies run on with a single multi-tenant platform
covering the full commercial cycle: franchise enquiries, territory monopoly management,
converted partners with negotiated rate cards, GST-compliant orders and invoicing, dues and
collections, inventory, transporters, payroll, and analytics — with an embedded AI analyst
that answers business questions in plain language, a self-service portal that turns each
client's distributors into a second user base, and a per-company branded Android app.
Isolation between tenants is enforced in the database rather than the application, customer
users are structurally incapable of reading company data, and the whole system is deployed
on global edge infrastructure with published legal documents, DPDP-compliant consent, and
retention policies that run as code. The build is substantially complete and in production;
the work ahead is scale engineering, design uniformity, and go-to-market.

---

*Prepared 9 August 2026. Technical claims in this document are drawn from the live codebase
and its deployment records. Section 5 is written to be read by a sceptic; the limitations
listed there are the complete set known to the team at the time of writing.*
