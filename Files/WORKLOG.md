# WORKLOG — Cerebyl / Pharma BMT

**Shared log between the two lead agents (Kimi K3 and Claude Opus).** Read the latest entries before planning; append after every major task. Newest at the top. Rules in `CLAUDE.md` §1a.

---

## 2026-08-07 — Kimi K3 (lead), DeepSeek V4 Flash (worker)

### Stitch v2 full-app page restructure — SHIPPED ✓ (commit `dd503e8`)
- Harish supplied `stitch_pharma_lead_manager 2` (16 Stitch screen designs, now archived at `Files/design/stitch-v2/`). Full structural analysis written to `Files/design/stitch-v2/ANALYSIS.md` (per-screen structure + common patterns; the folder has two DESIGN.md dialects — screens follow **luminous_3d_precise**, that's the standard).
- Split into 6 DeepSeek tickets (`Files/scratchpad/ticket-2026-08-07-D1..D6-*.md`), run in 3 parallel pairs via aider. Restructured: dashboard (12-col bento), leads (table anatomy, grid cards, peek-drawer header w/ circular call/WhatsApp actions), orders list + dues (KPI strips, titled table cards), intimations (3-col card grid), portal requests (rich inline cards), transporters (wide cards + sticky right detail panel), clients parties/territories (full-width map+sidebar split), products/team/analytics/settings.
- Structure-only: no nav/menu bars touched, no token/color changes, no data/logic changes. Verified per diff.
- **DeepSeek slips I fixed manually** (watch for this pattern — it invents things under design pressure): undefined `StatCell` component (dashboard), invented `useStaff` hook (team.directory — real hook is `useProfiles` from `@/lib/use-leads`), fabricated "98% on-time rate" stat (transporters panel — replaced with real Status), dropped per-row Edit on transporters (restored via `onEdit` prop on the detail panel).

### ⚠️ Cloudflare Workers Builds CI hazard (ACTION PENDING for Harish)
- The GitHub repo is connected to **Cloudflare Workers Builds**: after our push, CI auto-deployed its own build 22s after our manual deploy, overwriting it — and the CI build has **no Supabase env baked in** (would throw "Missing Supabase environment variable" for all users). We re-deployed our verified build on top.
- **Harish asked to disconnect**: Workers → leadenthrella → Settings → Builds → disconnect repo. Deploys must only come from `scripts/ship.sh`. Until then, every `git push` races the CI — after any push, verify the live chunk matches before declaring shipped.

### Ticket C earlier same day — SHIPPED ✓ (commit `44c9006`)
- Fixed section-header geometry drift (all 6 `*-section-header.tsx` + skeletons): root cause was `flex-wrap` — now `flex-nowrap`, title `min-w-0`, description `truncate`, lens bar `shrink-0`. Bar no longer shifts between tabs of a section.
- `/products` → `/products/all` and `/team` → `/team/directory` redirects (hubs retired, `?action=export_*` forwarding preserved).
- Toolbar pill-ification completed across clients/analytics/dues pages.

### Already-live state Harish may think is missing (stale bundle on his end)
- Clients lens bar (Parties/Territories/Portal Access) IS on all three clients pages since `dd503e8`.
- Settings subsection bar and Bin tab strip already use the `bar-primary` sliding-thumb theme; Trash was renamed to **Bin** everywhere (page title, "Empty bin", no "Trash" strings remain in `src/`). If he reports these missing → hard-refresh first.

### Conventions locked this session
- Page structure standard: full-width (no `max-w-*` page caps), `space-y-5` rhythm, page padding from app shell (`md:p-8`); KPI strips = glass cards w/ icon chip + uppercase label + big value; table cards w/ "Showing X–Y of Z" footers; never invent data hooks for design elements that have no backing data.
- Aider ticket pattern that worked: stable preamble + per-ticket delta, `--read` the ANALYSIS.md + design HTMLs, 2 parallel aider instances on disjoint file sets is safe, 3-reflection-limit risk on big tickets — keep tickets to ≤4 target files.
