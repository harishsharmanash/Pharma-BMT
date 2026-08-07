  | `/help` | How-to guide + bug-report dialog | all | yes | 141 |
  | `/developer` | Public "created by" card | public | **auth footer only** | 75 |
  | `/track/$token` | Public order tracking by token | public, no auth | **no internal links at all** | 202 |
  | `/legal{,/privacy,/terms,/refund,/dpa}` | Static legal pages | public | auth footer / consent gate / settings LegalCard | 72–157 |

  ### Console (`/console`, platform ops — `ConsoleGuard`: platform hostname + `platform_admins` + TOTP MFA; own dark shell, own nav)

  | Route | Purpose | Size |
  |---|---|---|
  | `/console` | Platform dashboard: companies, users, open bugs, AI spend chart, feature adoption | 196 |
  | `/console/companies` | Company list, create-company, purge old data | 216 |
  | `/console/companies/$id` | 933-line company detail: info/status, users+add-user, feature entitlements, bug reports, recent errors, custom domain+DNS, email sending accounts/keys | 933 |
  | `/console/users` | Cross-company user search | 91 |
  | `/console/features` | Feature-request inbox from Ceremate | 107 |
  | `/console/security` | Own TOTP/MFA management | 86 |
  | `/console/errors` | Last 50 crashes across companies | 66 |
  | `/console/bugs` | Bug-report inbox + status workflow | 130 |

  ### Portal (`/portal`, distributor — **no `profiles` row by design**, data only via service-role edge functions; bottom-tab nav: Home/Catalogue/Cart/Orders + "More" sheet)

  | Route | Purpose | Reachable via |
  |---|---|---|
  | `/portal` | Home: dues summary, last order, quick actions | bottom tab |
  | `/portal/catalogue` | Product browse, divisions, search, favourites | bottom tab |
  | `/portal/product/$id` | Product detail, price ladder, add to cart | catalogue |
  | `/portal/cart` | Cart → submit as order request | bottom tab (badge) |
  | `/portal/orders` | Order history + smart reorder | bottom tab |
  | `/portal/orders/$id` | Order detail, invoice PDF, tracking, reorder | orders list |
  | `/portal/requests` | My submitted requests + review status | More sheet |
  | `/portal/dues` | Outstanding + aging + last 10 payments; pay CTA if flag on | More sheet |
  | `/portal/pay` | UPI deep link + declare-payment form | More; hard-redirects out if `portal_payments` OFF |
  | `/portal/statement` | FY ledger, running balance, PDF | More sheet |
  | `/portal/offers` | Schemes, display only | More sheet |
  | `/portal/visual-aids` | Artwork gallery + share | More sheet |
  | `/portal/notifications` | Inbox, mark-read | header bell |
  | `/portal/assistant` | Narrow account assistant (5 party-scoped tools) | More sheet |

  ### Invisible routes (no nav entry, direct-URL or single-link only)
  `/developer` (auth footer only), `/track/$token` (zero internal links — external emails/WhatsApp only, intentional), `/legal/*` (footer/consent/settings links), `/ceremate` + `/my-day` (header buttons, not sidebar), `/refer` (sidebar footer only). Staff-side, `/visual-aids`, `/offers`, `/order-requests`, `/payment-intimations`, `/hot-warm`, `/followups`, `/duplicates`, `/trash`, `/help` have **no inbound links besides the sidebar itself** — remove them from NAV and they vanish.

  ---

  ## 2. Diagnosis

  **D1. The sidebar is a flat build-order list, not a workflow.** 24 NAV items at top level (`app-shell.tsx:26-54`). Lead-related items occupy slots 2,3,4 and then again 9, 18, 22 (`/booked-areas`, `/leaderboard`, `/duplicates`) — scattered among products, orders, staff. Portal-content management (`/order-requests`, `/payment-intimations`, `/visual-aids`, `/offers`) sits as four disconnected entries between Orders and Staff.

  **D2. Leads are split across six screens.** `/leads`, `/hot-warm`, `/followups`, `/my-day`, `/duplicates`, `/leaderboard`, plus `/booked-areas` (territory comes from lead data) and the dashboard's 7 lead charts. Worse, two are **near-duplicates**: `/hot-warm` is a hard-coded temp filter over the same `useLeads()` data that `/leads` already filters (temp filter + temperature sort exist in `leads.index.tsx:45-53`), and `/followups` overlaps the RepDay day-plan logic in `my-day.tsx:89-93` (same `alertFor`/`nextFuDate` helpers, company-wide vs self scope).

  **D3. Money data is presented in six disconnected staff screens.** Today's collection & receivables (dashboard), dues aging buckets (parties list), Ledger + payment dialogs (party page), order payments panel (order page), payment intimations (portal intake), collections (team performance + leaderboard). There is no single "Money" home; a manager answering "what's outstanding and what came in today" visits three places.

  **D4. `/team` and `/users` overlap.** Both render the profiles list, both embed `TransferBookDialog` and `InactiveRepRecord` (`team.tsx:224-225`, `users.tsx:32-33`). One is HR (attendance/payroll), the other account admin — but the duplicated directory makes the boundary invisible to users.

  **D5. Settings is ~50% not settings** (see A below). Of 10 admin tabs, four are operational features wearing a Settings costume: **Backup** (Google Drive backups + full XLSX export), **Mobile app** (APK build/download), **Lead intake** (the email ingestion pipeline + intake log), and the **Assistant tab's memory/digest/notification cards** (per-user preferences and data management). Meanwhile `/activity`, `/ai-usage`, and `/users` — which *are* administration — live in the sidebar, not in Settings.

  **D5b. Settings hides per-user prefs from the people who own them.** Non-admins see only the sign-out card (`settings.tsx:71-82`), so the Assistant memory panel, daily-digest toggle, and phone-notification toggle — all per-user — are invisible to reps. The product already worked around this once (digest toggle duplicated into the notification-bell footer precisely because `/settings` is admin-only, per CLAUDE.md Phase 11). The IA is fighting itself.

  **D6. The distributor portal is staff-facing in two directions with no unified home.** Staff manage portal content across `/order-requests`, `/payment-intimations`, `/visual-aids`, `/offers`, plus the portal-access card buried in `parties.$id` — five locations, no landing page answering "how is the portal doing" (pending requests count exists only as a sidebar badge, `app-shell.tsx:131-141`).

  **D7. Admin data-hygiene screens are scattered.** `/trash` (all roles!), `/duplicates` (all roles), `/activity` (admin) are the same job — data quality/audit — in three NAV slots with three different access rules. `/trash` visible to every rep is a stretch; purge is admin-only but the entry isn't.

  **D8. Console has the same disease in miniature.** `console.companies.$companyId` is 933 lines carrying seven sections (users, entitlements, bugs, errors, domains, email keys) — a mini-app behind one nav row.

  **D9. Dead-ish ends.** `/developer` reachable only from the auth footer (fine, but note it). `/track/$token` unreachable internally by design. Nothing else is truly orphaned, but see §1's "invisible" list — the app's link graph is almost entirely sidebar-mediated, which is why section-front-pages are the right fix.

  **Settings.tsx tab inventory (D5 evidence):**

  | Tab | Contents | Verdict |
  |---|---|---|
  | Branding | Logo/crop/brand colour | genuine setting |
  | Branding | MobileAppCard (APK build, `settings.tsx:620-746`) | operational — belongs with distribution/mobile |
  | PDF/Contact | Address/GSTIN/UPI/PDF header-footer | genuine setting |
  | PDF/Contact | Order status emails toggle | genuine setting |
  | PDF/Contact | LeadIntakeCard (intake address, auto-allocate, log) | operational feature — belongs with Leads |
  | Divisions/Categories/Dosage/Packing | 4 DropdownManagers | genuine setting |
  | Backup | Drive backups + XLSX export | operational — admin data management |
  | Assistant | Usage card | setting-ish (mirrors `/ai-usage`) |
  | Assistant | Memory, daily digest, phone notifications | per-user prefs, wrong room |
  | Features | Plan-gated feature toggles | genuine setting |
  | Roles | Custom roles + permission narrowing | genuine setting (pairs with `/users`) |
  | Legal | Links to `/legal/*` | link list |

  ---

  ## 3. Proposed architecture

  Six major sections + a utility cluster. Each section gets a landing page with key numbers and cards into sub-areas. The sidebar collapses from 24 items to ~9.

  **A. Home** — `/dashboard` as-is. It already is a landing page; leave it.

  **B. Leads** (flag `leads`)
  - Landing: lead KPIs (the 10 cards currently on the dashboard stay there too — landing shows a compact subset), overdue follow-ups count, hot-lead count, duplicate-flag count, links into sub-areas.
  - Sub-areas: **All Leads** (`/leads` + `/leads/$id`), **Call List** (folds `/hot-warm` in as a saved/preset view of the leads list — it duplicates a temp filter; keep the route as a redirect or preset tab), **Follow-up Schedule** (`/followups`), **My Day** (`/my-day`), **Territories** (`/booked-areas` + `/parties/$id/territory`), **Leaderboard** (`/leaderboard`), **Duplicate Flags** (`/duplicates`).
  - Lead intake config moves here from Settings → a "Lead intake" card on the Leads landing (admin only), keeping the Settings tab as a deep-link or relocating outright.

  **C. Customers & Money** (flags `parties`, `orders`)
  - Landing: money-to-collect total, aging summary, today's collection/billing, pending portal order-request count, links.
  - Sub-areas: **Parties** (`/parties`, `/parties/$id`), **Orders** (`/orders`, `/orders/$id`), **Order Requests** (`/order-requests`), **Payment Intimations** (`/payment-intimations`), **Transporters** (`/transporters/*` — logistics lives with orders).
  - This merges today's "orders/adjacent" scatter into the money workflow and kills D3 by giving one home for receivables.

  **D. Catalogue** (flags `products`, `stock`)
  - Landing: product count, low-stock/out-of-stock count, top-5 products, links.
  - Sub-areas: **Products** (`/products`), **Stock** (`/stock`), **Product Performance** (`/product-performance`), **Offers** (`/offers`), **Visual Aids** (`/visual-aids`). Offers and visual aids are catalogue content that happens to be displayed in the portal; managing them next to the products they reference is the natural fit.

  **E. Distributor Portal (staff admin of it)** (flag `distributor_portal`)
  - Landing: pending order requests (the sidebar badge count, promoted), pending intimations, active portal users count, recent portal activity, links.
  - Sub-areas: Order Requests, Payment Intimations (cross-linked from C too — dual listing is fine), Offers, Visual Aids (cross-linked from D), and the portal-access management that today hides inside `parties/$id` gets a link/summary here (the control itself stays on the party page — that's where the party context is).
  - Opinion: C/D/E should cross-link rather than relocate offers/requests twice. One canonical home each (requests in E, offers/visual-aids in D), cards on the other section's landing.

  **F. Team** (flag `staff`)
  - Landing: headcount, today's attendance, pending leave/claims, payroll-due indicator, links.
  - Sub-areas: **Directory & HR** (`/team` as-is), **User Accounts & Roles** (`/users`), **Leaderboard** (cross-link from B). This resolves D4: one section, directory rendered once, with "HR" and "Accounts" as the two clear intents.

  **G. Settings & Admin** (one section, two tiers)
  - **Company Settings** (admin): Branding, PDF/Contact, Divisions/Categories/etc., Features, Roles, Lead intake (if not moved to B), Order emails. Backup + Mobile app move to…
  - **Administration** (admin): **Backup & Export** (from Settings), **Mobile App** (from Settings), **Activity Log** (`/activity`), **AI Usage** (`/ai-usage`), **Trash** (`/trash`, admin-only now — see risks), plus existing Users link.
  - **My Preferences** (all roles — new tab on `/settings`, not a new feature, just surfacing existing cards): Assistant memory, daily digest, phone notifications, sign-out. Fixes D5b using only what exists.

  **Utility cluster** (sidebar footer, unchanged): `/ceremate` (header), `/help`, `/refer`, `/legal/*`, `/developer`, `/track/$token` — stay exactly where and how they are; public and footer routes need no home.

  ### Mapping table — every current route → new location

  | Old route | New location |
  |---|---|
  | `/` → `/auth`, `/dashboard` | unchanged |
  | `/dashboard` | A. Home |
  | `/leads`, `/leads/$id` | B. Leads → All Leads |
  | `/hot-warm` | B. Leads → preset view/tab on All Leads (route kept as alias) |
  | `/followups` | B. Leads → Follow-up Schedule |
  | `/my-day` | B. Leads → My Day (also stays on phone primary nav) |
  | `/duplicates` | B. Leads → Duplicate Flags |
  | `/booked-areas` | B. Leads → Territories |
  | `/leaderboard` | B. Leads → Leaderboard (cross-link in F) |
  | `/products` | D. Catalogue → Products |
  | `/product-performance` | D. Catalogue → Performance |
  | `/stock` | D. Catalogue → Stock |
  | `/offers` | D. Catalogue → Offers (cross-linked from E) |
  | `/visual-aids` | D. Catalogue → Visual Aids (cross-linked from E) |
  | `/parties`, `/parties/$id`, `/parties/$id/territory` | C. Customers & Money → Parties (territory editor cross-linked from B) |
  | `/orders`, `/orders/$id` | C. Customers & Money → Orders |
  | `/order-requests` | E. Portal Admin → Requests (cross-linked from C) |
  | `/payment-intimations` | E. Portal Admin → Intimations (cross-linked from C) |
  | `/transporters`, `/transporters/$id` | C. Customers & Money → Transporters |
  | `/team` | F. Team → Directory & HR |
  | `/users` | F. Team → User Accounts |
  | `/settings` (config tabs) | G. Settings → Company Settings |
  | `/settings` Backup card | G. Administration → Backup & Export |
  | `/settings` Mobile app card | G. Administration → Mobile App |
  | `/settings` Lead intake card | B. Leads landing (admin) or stays in G — pick B |
  | `/settings` memory/digest/notification cards | G. My Preferences (all roles) |
  | `/settings` Legal card | unchanged links; also under `/help` |
  | `/activity` | G. Administration |
  | `/ai-usage` | G. Administration |
  | `/trash` | G. Administration (admin-only) |
  | `/ceremate` | header button, unchanged |
  | `/help`, `/refer` | utility cluster, unchanged |
  | `/developer`, `/legal/*`, `/track/$token` | public, unchanged |
  | `/console` + all 7 `console.*` routes | unchanged — separate shell, separate audience |
  | `/portal` + all 15 `portal.*` routes | unchanged — separate shell, separate audience |

  No route is deleted; the only behavioral change proposed is `/hot-warm` becoming a preset view with its URL preserved.

  ### Should company / console / portal settings stay separate?
  **Yes, all three.** They have three different trust domains: console is platform ops behind hostname+MFA with no company context; portal "settings" don't exist and shouldn't (distributors get nothing configurable beyond what the edge functions expose); company settings are tenant config. Merging any two merges audiences, and the console's separation is a security boundary, not an aesthetic one.

  ### Should the portal share navigation with staff?
  **No — keep it fully separate, and this is non-negotiable.** The security model (CLAUDE.md §8f) is that a party user has no `profiles` row, so every staff nav query (`useFeatures`, `useMyPermissions`, `useCompanySettings`) is meaningless-to-hostile for them. Sharing nav components would invite a future refactor that renders staff links into a portal session. The current design — portal routes reject staff, staff shell routes party users to `/portal` — is correct. Keep the two shells; unify only visual language.

  ### Phone primary nav (max 5)
  Role-aware, but the base five:

  1. **Home** (`/dashboard`)
  2. **My Day** (`/my-day`) — the rep's actual workflow hub; already a header button
  3. **Leads** (section landing)
  4. **Customers/Money** (section landing — parties+orders)
  5. **More** (sheet with everything else: Catalogue, Team, Portal Admin, Settings, Help, Trash, sign-out)

  Managers/admins can swap #2 for **Orders** or keep the same five — consistency beats per-role cleverness here. Ceremate stays as the persistent header button (it's already the "one way in"). The portal phone nav (Home/Catalogue/Cart/Orders/More) is already correct — don't touch it.

  ---

  ## 4. Risks

  **Cosmetic only (low risk):** regrouping sidebar entries, adding section landing pages, adding "More" sheets, cross-links between C/D/E. No route, query, or RLS changes. `/hot-warm` as a preset view is cosmetic if the URL is kept.

  **Touches routing (medium):** landing pages mean new routes (`/leads/home`-style) or repurposing list routes as landings — every `Link to=` and redirect (`index.tsx`, bounce logic in `booked-areas.tsx:46`, `leaderboard.tsx:27`, `portal.pay.tsx`) must be re-pointed deliberately. Keep every old URL alive as an alias; deep links are shared over WhatsApp (`?party=`, `?new=1` params on `/orders` are load-bearing for the assistant's `start_order` — CLAUDE.md 8b). TanStack's generated route tree makes misses compile-time visible, which helps.

  **Touches permissions (careful — this is where reps get hurt):**
  - Moving `/trash` to admin-only **changes what a rep can see**. Today any role can open Trash (only purge is gated). RLS on the underlying tables doesn't change, so reps lose a screen, not data — but if anyone relies on rep-restore, that's a behavior change to flag to the owner before doing it.
  - Surfacing memory/digest/notification prefs to reps via "My Preferences" exposes **existing** per-user cards to their rightful owners. These are already rep-safe (the digest toggle is already in the bell footer for exactly this reason), but verify each card's queries are self-scoped before exposing — do not assume.
  - Any landing page that aggregates counts (pending requests, stock alerts) must query through the same hooks/RLS as today's screens. **A nav reorg must not become a data reorg**: if a rep's landing shows "0 / no access" cards for manager-only sub-areas (stock, transporters, leaderboard), hide the card — don't leak counts. Standing rule stands: reps see only their own data; the new landings must be built from the same rep-scoped hooks, not new aggregate RPCs.

  **Annoyance risks:** muscle memory — 24 flat items people have learned by position get regrouped; mitigate by keeping icons/labels identical per screen and shipping the reorg before the mobile rebuild so it happens once. `/hot-warm` merging into `/leads` will annoy whoever lives on it (it's a deliberately opinionated call list); keeping the URL as a preserved preset defuses it. Dashboard losing its 10 lead cards to the Leads landing would double-annoy — proposal keeps them in both places.

  **Do not touch:** portal shell and its bottom nav, console shell, `/track/$token`, legal/auth public pages, the Ceremate single-entry header pattern, default alphabetical sort, bar-only "Leads by Source", manager-only rep-reassignment. None of these are IA problems.

  **Where I'm unsure:** whether offers/visual-aids canonically belong in Catalogue (my call) or Portal Admin — reasonable either way; I picked Catalogue because they're product content. Whether lead intake config moves to Leads or stays in Settings — I lean Leads (it's an operational pipeline), but it's admin-facing so Settings is defensible. Both are one-card moves either way.

  Nothing was modified — investigation only.

To resume this session: kimi -r session_3dd9002f-6711-4e8b-8c89-3cf7009d0ec5
