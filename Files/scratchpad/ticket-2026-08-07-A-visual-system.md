# TICKET A — Lead colors, slimmer cards, table spacing, search z-index, primary/secondary bar design system

Repo: `leadenthrella/` — React 19 + TanStack Start + Tailwind v4 + shadcn + framer-motion. Stitch tokens + `.pill`/`.sh-*`/`.t-*` utilities in `src/styles.css`. Do not commit. Visual-only; preserve all behavior.

## A1 — Lead temperature + stage colors, brighter and guiding (src/routes/leads.all.tsx, src/styles.css)

Current temp pills are muted (Warm = blue-grey, Cold = grey). Make temperature a bright traffic-light language and give every stage its own hue:

- Add accent tokens to the `.stitch` block in styles.css (oklch or hex, your call but consistent with existing token style):
  - `--st-hot: #E5484D` (vibrant coral red) / container `#FDECEC`
  - `--st-warm: #F59E0B` (bright amber) / container `#FEF3DE`
  - `--st-cold: #38BDF8` (sky blue) / container `#E8F6FE`
- Update `ST_TEMP` in leads.all.tsx (~line 69): Hot = `--st-hot` on its container + pulsing dot (keep the pulse), Warm = `--st-warm` on container, Cold = `--st-cold` on container. Uppercase label + dot as now. Apply the same map to `TempBadge` in `src/components/lead-dialog.tsx` (it mirrors ST_TEMP — keep them in sync).
- Stage chips on cards (currently all blue-tinted): per-stage hues as tints (10-12% bg, full-strength text, uppercase, existing chip shape): New = blue `#3B82F6`, Contacted = violet `#8B5CF6`, Details Shared = teal `#14B8A6`, Qualified/Negotiation (whatever stages exist in STAGES) = indigo `#6366F1`, Won = green `#22C55E`, Lost = slate `#64748B`. Implement as a `ST_STAGE` map next to ST_TEMP with a sensible default; use it on cards AND in the table Stage column.

## A2 — Slim the lead card front (src/routes/leads.all.tsx, LeadCard ~line 611)

Remove from the card front: the product-interest chip AND any summary/interest text block (the multi-line "PCD PHARMA FRANCHISE FOR…" text). The card shows: lead code + duplicate icon, temp pill, name, firm, stage chip (now colored per A1), follow-up date + meta chip. Product interest/summary stays ONLY in the peek drawer and the lead detail page — do not remove it there.

## A3 — Table corner spacing, app-wide (src/components/ui/table.tsx + styles.css if needed)

Owner: "in table formats everywhere, corner text sits too close to the boundary — not premium." Fix at the primitive level so every table benefits:
- TableHead: add comfortable padding — `px-5 py-3.5`, first cell `pl-6`, last cell `pr-6`.
- TableCell: `px-5 py-4`, first `pl-6`, last `pr-6` (preserve any existing alignment utilities; increase, don't restyle).
- Ensure the table's outer container keeps `rounded-3xl` with `overflow-hidden` so corners clip cleanly.
Check one dense table (leads table view) and one simple one (followups) visually consistent after the change.

## A4 — Bug: universal search suggestions render UNDER the menu bar / section content (src/components/global-search.tsx or wherever GlobalSearch lives — find it)

The header's universal search dropdown is overlapped by the top menu bar and section content (stacking bug). The suggestion panel must render above EVERYTHING when open: give the results popover a very high z-index (e.g. `z-[100]`), verify its stacking context isn't trapped (if it's inside the header's backdrop-blur container that creates a stacking context, portal it or raise appropriately). The menu bar and sticky bars sit at z-20/z-30 — suggestions must clear them.

## A5 — Bar design system: primary vs secondary (src/styles.css, src/components/app-shell.tsx, section headers)

Owner's directive: the LEADS LENS BAR style (elevated white pill bar: `sh-lg rounded-full border border-white bg-white/90 backdrop-blur-xl`, compact height, sliding powder-blue thumb `bg-[--st-primary]/10` + primary text) is now the PRIMARY bar language. The current menu-bar style (white bar + SOLID blue filled active pill, `--st-primary` bg + `--st-on-primary` text) becomes the SECONDARY language for one-level-down buttons/pills.

Apply:
1. Create reusable classes in styles.css: `.bar-primary` (the elevated white lens-bar container) and `.bar-primary-thumb` (powder-blue sliding thumb), and refactor `leads-section-header.tsx`, `products-section-header.tsx`, `team-section-header.tsx` to use them (no visual change there — just dedupe).
2. Restyle the main menu bar in app-shell.tsx to `.bar-primary`: white elevated bar, items dark `--st-on-surface`, active = powder-blue thumb with `--st-primary` text (same sliding layoutId animation, keep). Width stays `max-w-6xl mx-auto`, current thickness.
3. Universal search bar in the header (GlobalSearch trigger/input): same elevated white pill treatment (`.bar-primary` visual language, `sh-sm`-to-`sh-md` as fits) so all primary chrome matches.
4. Secondary language = filled blue `.pill sh-md` (solid `--st-primary`) — that's what toolbar action buttons / filter pills already use. Document it in one comment block above `.bar-primary` in styles.css: "Primary chrome = elevated white bar w/ powder-blue thumb; secondary actions = filled blue pill". Do NOT restyle the toolbar buttons in this ticket.
5. The orders pending badge on the menu bar: with the powder-blue thumb, badge = `bg-[--st-primary] text-[--st-on-primary]` always (it now reads fine on white and on the tint).

## Verify

`npx tsc --noEmit` = 0 and `npm run build` passes. Report: the exact tokens added, files touched, and confirmation that the search popover now clears the menu bar.
