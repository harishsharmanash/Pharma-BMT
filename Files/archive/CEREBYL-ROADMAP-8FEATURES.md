# Cerebyl — 8-Feature Build Roadmap (locked 22 Jul 2026)

Master architecture map. Planning by Claude (Opus); execution split between **Sonnet** (in-repo direct builds) and **Kimi** (paste-ready prompts). Both run in parallel on non-overlapping lanes. Deploy/migration/edge rules = the `leadenthrella-deploy` skill (single source of truth). Product = **Cerebyl**; AI assistant = **Ceremate** (two different names — don't let one overwrite the other).

Design North Star (from `Files/App UI inspirations/`) = **"premium playful glass"**: big rounded cards (16–24px), soft layered shadows, a dark "hero" surface for emphasis on a light body, frosted-glass panels, pill nav, colored pill badges, vertical timeline/stepper components, cute rounded 3D bot mascot (→ Ceremate).

---

## Phase / parallel plan

| Phase | Feature | Agent | Notes |
|---|---|---|---|
| 1 (parallel) | UI foundation + auth/console reskin + **F5** gallery/lightbox | **Sonnet** | `SONNET-TASK-01-ui-foundation.md` |
| 1 (parallel) | **F3** rep transfer/offboarding (backend + wiring) | **Kimi** | `KIMI-PROMPT-01-rep-transfer.md` |
| 2 | **F6+F7** Ceremate full UI + rename | Sonnet+Kimi | after design system lands |
| 3 | **F1** geo monopoly (map + radius) | Kimi | needs leaflet/maplibre dep + India GeoJSON |
| 4 | **F2** email lead auto-fetch | Claude/infra + Kimi | Cloudflare Email Worker + parsers |
| 5 | **F4** order emails + tracking page | Kimi | email-only for now |

Lane rule for Phase 1: Sonnet owns styling/primitives/auth/console/products; Kimi owns DB/hooks/team/users and **must not restyle** or touch global CSS. Later-phase Kimi prompts are written **just-in-time** (by Sonnet) to avoid drift — do NOT pre-write them.

---

## F1 — Geo monopoly + radius (Phase 3)
Today: monopoly = 4 text fields (`monopoly_given/division/district/state`), conflict = exact string match. No geo at all.
- Map: **Leaflet or MapLibre + free OpenStreetMap tiles** (NOT Google Maps). India state/district GeoJSON shipped static (DataMeet).
- Per-monopoly: **drop-a-pin (lat/lng) + radius_km** (50/100/custom). Conflict = haversine distance vs radii → draws as a circle. Replaces string match; keep string fields for display/back-compat.
- Pin: drop-on-map primary; Nominatim (free) optional geocode helper.
- Map download: render current view → PNG → existing PDF pipeline + party table (by state/district).
- Keep existing state→district→party-count dropdown, booked-areas drill-down, order-flagging.
- **Reps: read-only map.** Reassignment stays managers/admins-only.
- Open build detail: circles only (no polygons/district-snap) per Harish.

## F2 — Email lead auto-fetch (Phase 4) — website + portals only
Meta/WhatsApp deferred (Meta leads land in WhatsApp, not email — separate sensitive project). Two intake options, company chooses:
- **Option A (default): dedicated Cloudflare address** `company@leads.cerebyl.com`. Company points IndiaMART/PharmaHopper/Pharmavends/DawaCharcha/website at it (one-time per portal). **Cloudflare Email Routing (free) → Email Worker** parses lead + inserts to Supabase, **and forwards original to company's real inbox** (Cloudflare forward = free + unlimited; one-time destination verify click). Cost per company = **$0**.
- **Option B: connect existing inbox via IMAP app-password.** We poll read-only. Mailbox untouched. Cost $0; downside = stored credential + setup friction.
- MX takeover = rejected (only works for custom domains, routes ALL their mail through us, fragile).
- Parsers: per-source template regex first; Gemini worker fallback only for ambiguous (cheap).
- De-dupe on phone vs existing leads.
- **PCD vs Third-Party classification:** keywords (third-party/3rd party/contract mfg/loan license → Third-Party; else → **PCD default when unsure**). New rep setting `handles = PCD | Third-Party | Both`. Auto-allocation = **round-robin within matching role pool** (Both-reps always eligible); no match → unassigned for manager. Company setting to toggle auto-allocation on/off.
- Infra note: enable Email Routing on cerebyl.com (or a `leads.` subdomain zone) with catch-all → Worker; Worker reads `to` to resolve company.

## F3 — Rep offboarding + data transfer (Phase 1, Kimi) — see Kimi prompt
Extends existing infra: `profiles.is_active` already exists + RLS keys off it; `staff.employment_status` + `employment_status_history` already separate HR record. Build: atomic "transfer book of business" RPC (parties/leads/open orders/followups A→B, existing or new rep) + audit log; Active/Inactive tabs in users/team; keep inactive reps' HR/payroll/attendance queryable; RLS so inactive = no login/no data. Replaces the rename-and-reuse hack. Managers/admins only.

## F4 — Order notifications + tracking page (Phase 5) — email only
- **Public tokenized tracking page** (no login): status timeline (Confirmed→Dispatched→Delivered), items, tracking link, payment-pending. Signed token route. (Order already has `fulfillment_status` default 'Placed'.)
- **Email** on status change. Sending: prefer per-company Gmail SMTP (500/day free each, better deliverability/branding) over a single Brevo account (300/day total). Decide at build.
- SMS dropped. WhatsApp deferred.

## F5 — Product gallery + image lightbox (Phase 1, Sonnet) — see Sonnet task
Fullscreen swipeable gallery (Embla) from a "Product Showcase" button on selected products + click-to-zoom lightbox on any product image. No backend.

## F6 — Ceremate full Gemini-style UI (Phase 2)
Model behind it = `gemini-3.1-flash-lite` (vision + function calling; **already receives images + PDFs today** via `downscaleImage` in `use-assistant.ts`).
- Replace bottom-right drawer → **full-page surface**; entry from **sidebar menu + top header**.
- Left rail: **conversation history** (new `assistant_conversations` + `assistant_messages` tables — currently ephemeral) + **New chat** + Search chats.
- **"+" menu = app actions** (not generic upload): Add order / party / lead / product; **Request a feature** → `feature_requests` table + notify Harish. Each launches a **guided in-chat workflow** (prebuilt structured flow) over the *same* worker + cache.
- **3 attach pickers:** Document (pdf/xlsx/docx/html/csv/image) / Image / Audio. **No video.** New types (xlsx/docx/csv/html) = free in-worker text extraction → tokens. Audio = native Gemini audio or Cloudflare Workers AI Whisper (free tier).
- **Mic (WhisperFlow-style):** tap to lock-listen, transcribe into input, **send only on user action.** v1 = **browser Web Speech API (free, Chrome-strong/Safari-weak).**
- **Cost:** no new subscription; per-use tokens at flash-lite rate (~$0.10 / 1M input) = fractions of a cent; realistic total impact a few $/month. Mic = $0.

## F7 — Rename → Ceremate (Phase 2, with F6)
All "AI assistant / co-worker" strings → **Ceremate** ("Ceremate is working…", "Ask Ceremate"). Replace Hindi example intro with an **English capability guide written as Ceremate introducing itself**. Cute 3D bot avatar. Sibling AI Worker repo (`acrowell-ai-worker`, outside repo) may carry strings too — check it.

## F8 — Whole-app UI overhaul (Phase 1 foundation, then rollout)
Design tokens (radius/shadow/glass/motion/accent/dark-hero/type) + primitives + micro-animation rules on existing Tailwind v4 / shadcn; framer-motion or CSS + view-transitions. Roll out screen-by-screen; auth + console first (Phase 1), then everything. F5/F6/F7 render against it. Sonnet implements from the design spec (Opus already made the design decisions).
</content>
