# IA pass — Claude's independent proposal

Written before reading Kimi's report, so the two can be compared honestly.

## 1. The core finding

**The sidebar has 24 items and they are ordered by build date, not by how anyone
works.** Everything else follows from that. A phone can carry about five primary
destinations; we are asking users to scan twenty-four.

Three structural causes, each visible in `src/components/app-shell.tsx`:

**(a) Grouping by feature flag instead of by domain.** Four consecutive nav items —
Order Requests, Payment Intimations, Visual Aids, Offers — are adjacent for exactly
one reason: they share `feature: "distributor_portal"`. That is a deployment
concern leaking into navigation. A payment intimation belongs with payments; an
offer belongs with the catalogue. Nobody thinks "show me my distributor-portal
things."

**(b) One domain split across many top-level entries.** Leads occupies six nav
slots — Leads, Hot & Warm, Follow-Up Schedule, Booked Areas, Leaderboard,
Duplicate Flags — plus My Day, which is a lead workflow living in the header. That
is seven entry points to one concept.

**(c) Important destinations demoted to chrome.** `my-day.tsx` is 273 lines of
genuine rep workflow reachable only via an unlabelled sun icon in the header
(`app-shell.tsx:241`). `/refer` hides in a sidebar footer link. Meanwhile
`Duplicate Flags` and `Trash` get full nav slots. The prominence of an item is
uncorrelated with its importance.

## 2. Diagnosis by area

| Problem | Evidence | Why it matters |
|---|---|---|
| Leads scattered | 6 NAV entries + `/my-day` in header | The most-used domain is the hardest to navigate |
| Portal-facing staff tools grouped by flag | NAV lines for order-requests, payment-intimations, visual-aids, offers | Users can't find them by task |
| Catalogue split | `/products`, `/stock`, `/product-performance`, `/offers`, `/visual-aids` | Five entries for "what we sell and how much we have" |
| Admin tools split | `/users`, `/activity`, `/ai-usage`, `/trash`, `/settings` | Five slots of pure administration in the daily nav |
| Settings conflates two audiences | `settings.tsx` is 1,464 lines, admin-only until today | A rep needs *account* settings; only an admin needs *company* settings. There is no distinction |
| Transporters orphaned conceptually | `/transporters` top level | It's part of fulfilling an order, not a peer of Leads |

**The Settings conflation is the single most consequential one** and it caused
today's bug: because `/settings` meant "company configuration", it was gated to
admins, so moving Sign out there stranded every rep. Personal settings and
organisation settings are different things for different people and must be
separated regardless of what else we do.

## 3. Proposed architecture

Five primary destinations, each a section with a landing page that shows live
numbers and links into its sub-areas. Everything else lives behind **More** or in
the account menu.

### Home
Landing: today's orders, billing, collections, money to collect; my day plan;
what needs attention.
Absorbs: `dashboard`, `my-day` (promoted out of the header), notification digest,
`refer`, `help`.

### Leads
Landing: pipeline by stage, today's follow-ups, hot count.
Sub-areas: All leads · Hot & Warm · Follow-up schedule · Duplicates · Leaderboard ·
Booked areas (map).
Absorbs 6 nav entries plus the My Day lead workflow.

### Parties
Landing: party count, outstanding dues, top customers, reorder-due list.
Sub-areas: All parties · Party detail · Territory map · Statements & dues.

### Orders
Landing: today's orders and billing, pending order requests badge, dues aging.
Sub-areas: Orders & invoices · Order requests · Payment intimations ·
Transporters · Delivery tracking.
Rationale: this is the order *lifecycle* — placed, requested, delivered, paid.
Transporters and payment intimations are steps in it, not separate domains.

### Catalogue
Landing: product count, stock alerts, batches expiring within 90 days.
Sub-areas: Products · Stock · Product performance · Offers · Visual aids.

### More (not a tab — a menu)
Team · Reports · Admin (Manage users, Activity log, AI usage, Trash, Company
settings, Features) · Legal · Help.

### Account (avatar menu, every role)
Profile · Theme · Notification preferences · **Sign out**.
This is where sign-out belongs — not in Company Settings, which is the accident we
shipped today as a stopgap.

## 4. Answers to the three specific questions

**Should company / console / portal settings stay separate?**
- **Console stays completely separate.** It is the platform operator's tool
  (`console-shell.tsx`), a different audience with a different mental model.
  Merging it would be a category error.
- **Company settings folds into Admin** as one section with tabs. Portal
  configuration becomes a tab inside it, not a peer.
- **Account settings splits out** and is available to every role.

**Should the distributor portal share navigation with staff?**
**No — and this is a security position, not an aesthetic one.** Portal users
deliberately have no `profiles` row (§8f), which is the entire isolation
guarantee. A shared shell invites someone to "just add a profiles row" to make
navigation work, which would hand a customer staff-level read of their company's
leads, other parties' orders, and staff salaries. Keep `PortalLayout` separate and
keep the temptation away.

**What belongs in a phone's primary navigation?**
Home, Leads, Parties, Orders, Catalogue. Ceremate stays a persistent floating
action, and notifications stay a bell — both are utilities available everywhere,
not destinations.

## 5. Risks

- **A nav change must never imply a permission change.** Folding six routes into
  Leads means the Leads landing must itself respect `perm`/`roles`/`feature`, and a
  section whose children are all hidden must hide entirely rather than render an
  empty page. Reps are restricted by RLS; the UI must not appear to promise data
  the database will refuse.
- **Old URLs must redirect, not 404.** The APK is a WebView on the live URL, and
  `/track/$token` links live in customers' emails. Every retired path needs a
  redirect.
- **Route changes reach phones instantly** (WebView on a remote URL), with no APK
  rebuild — and equally no staged rollback. Verify on a device before shipping.
- **`settings.tsx` is 1,464 lines.** Splitting it is the highest-risk mechanical
  change here; it holds branding, backups, features, legal, AI memory and now
  sign-out.
- Landing pages that show live counts add queries to screens that currently do
  none. Watch the free-plan query budget.

## 6. Sequence I would choose

1. Split Account vs Company settings (fixes today's stopgap properly).
2. Collapse Leads' six entries into one section — biggest win, one domain.
3. Orders lifecycle consolidation (absorbs the flag-grouped portal items).
4. Catalogue consolidation.
5. Home rebuild with My Day promoted.
6. Admin/More cleanup.
7. Only then the visual restyle, on a structure that has stopped moving.
