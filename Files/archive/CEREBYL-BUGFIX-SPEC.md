# Cerebyl Bugfix/Feature Batch — Agent Execution Spec

Three parallel agents. Read the SHARED section, then only your AGENT section. Edit **only** your listed files.

> Repo root: `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`

## SHARED
- **Golden rule: change behavior only where the item explicitly asks; otherwise looks-only.** Preserve every existing button, gate, and query.
- **Design system is already set** (24px radius, neutral shadows, solid blue pill `<Button>`, tinted `<Badge>`, Poppins, `card-hover`, framer-motion fade-up). Match existing pages — `dashboard.tsx`, `leads.index.tsx`, `parties.index.tsx` are the reference bar. Use tokens, never raw hex.
- **LOCKED (no agent edits):** `src/styles.css`, `src/components/ui/**` EXCEPT Agent C may edit `src/components/ui/chart.tsx`, `src/lib/**`, `src/integrations/**`, `supabase/**`, `routeTree.gen.ts`, and any file not in your list.
- **Verify:** `npx tsc --noEmit 2>&1 | grep -c "error TS"` must stay **139**. Do NOT run `bun run build` or start the dev server (they collide across agents / with the coordinator). No git commit/reset/checkout.
- Report files changed, anything deferred, final tsc count.

---

## AGENT A — Sidebar collapse + "Using Cerebyl" referral page
**Files:** `src/components/app-shell.tsx`, and a NEW route file `src/routes/refer.tsx`.

**SS1 — Collapsible sidebar.** In `app-shell.tsx`, add a collapse toggle so the sidebar can shrink to an **icon-only rail** and expand back.
- Add a collapse button (e.g. a `PanelLeftClose`/`PanelLeftOpen` lucide icon, ghost button) in the sidebar header (desktop only).
- Collapsed = `w-16`, icons centered, labels + company name/subtitle hidden; expanded = current `w-64`. Animate the width transition smoothly (`transition-[width] duration-300`, or a framer-motion width animation).
- When collapsed, hovering a nav icon shows the label as a tooltip — use the existing `@/components/ui/tooltip` (`Tooltip`/`TooltipTrigger`/`TooltipContent` side="right"). Wrap the app in `TooltipProvider` if not already.
- Persist the collapsed state to `localStorage` (key e.g. `crm-sidebar-collapsed`) and read it on init so it survives reloads. Guard `localStorage` for SSR (`typeof window !== "undefined"`).
- The mobile drawer behavior stays exactly as-is (collapse is desktop-only). Keep all nav gating/logic untouched.

**SS6 — "You are using Cerebyl" + referral page.** 
- In the sidebar footer (or bottom-right of the shell), replace/augment the current "Cerebyl / Business tool only." footer with a line **"You are using Cerebyl"** where **Cerebyl** is a `<Link to="/refer">` styled in the brand blue (`text-primary hover:underline`). When the sidebar is collapsed, show just a small clickable brand mark. Keep "Business tool only." somewhere small.
- Create `src/routes/refer.tsx` — a new route at `/refer`, wrapped in `<Protected>` and `AppShell` like other pages (look at how `dashboard.tsx` wires `createFileRoute` + `Protected`). Content (marketing/contact page, no backend needed):
  - Hero header (reuse the `gradient-hero` banner style from `dashboard.tsx`): title like "Love Cerebyl? Share it." / subtitle "Get Cerebyl for your business, or refer a friend."
  - A "Refer a friend" card: explain "Refer another pharma business — when they join, you **both get 300 free AI assistant messages**." Include a prominent (non-functional-for-now) "Copy referral link" or "Refer now" button and a short 1-2-3 how-it-works.
  - A "Get Cerebyl for your business" contact card reusing the developer contact details from `src/routes/developer.tsx` (Email / Call / WhatsApp rows — copy the same links/handles that file uses). Match the glass-card / pill styling.
  - Fade-up motion like other pages. This is a real, polished page — not a stub.

---

## AGENT B — Empty-trash buttons + Statement PDF fix
**Files:** `src/routes/trash.tsx`, `src/routes/parties.$id.tsx`.

**SS2 — "Empty [section]" button.** In `trash.tsx`, each section (Leads/Parties/Orders/Products tab) has a `purge(id)` that hard-deletes one row. Add an **"Empty trash" button** for the current section:
- Place it top-right of the section (near the list header), `variant="outline"` with a `Trash2` icon, destructive-tinted text, disabled when the section has 0 rows.
- Clicking opens an `AlertDialog` (match the existing per-row "Delete forever" confirm already in this file): title like "Empty {section} trash?", body warning it permanently deletes all N items and cannot be undone.
- On confirm, purge every row currently in that section (loop the existing `purge` logic over all `rows`, or issue one `delete` filtered to those ids). Reuse the existing supabase delete + `qc.invalidateQueries` pattern already in the file. Toast the count. Keep per-row Restore/Delete-forever working.

**SS9 — Statement PDF ₹ glitch.** In `parties.$id.tsx`, the account-statement PDF (search `autoTable(doc` / `Total billed:`) prints raw `₹` into jsPDF, which renders as a stray "¹" and mangles spacing.
- Add a PDF-safe currency helper identical in spirit to `inrPdf` in `src/routes/orders.$id.tsx` (around line 58): returns `` `Rs. ${v.toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2})}` `` — ASCII "Rs. " prefix, never the ₹ glyph.
- Use it for every currency value inside the PDF: the Debit/Credit/Balance table cells and the "Total billed / Total paid / Outstanding" summary line. (Leave the on-screen React UI's ₹ exactly as-is — the glyph is only broken in the PDF.)
- Improve the PDF structure while you're there: give the summary totals clear spacing/line breaks (three lines or a small table rather than one cramped run-on line), keep the branded header. Don't change what data is included.

---

## AGENT C — Chart polish (dashboard + product performance)
**Files:** `src/routes/dashboard.tsx`, `src/routes/product-performance.tsx`, and if needed `src/components/ui/chart.tsx`.

The charts look cheap: **diagonal/rotated x-axis labels**, no animation, and a pointless all-green "Trend" column. Fix across both pages.

**SS3/SS4 — make charts look premium:**
- **Kill all diagonal axis text.** Any BarChart currently using `angle={-20}`/`angle={-25}` + `textAnchor="end"` on long category labels (Leads by State, Leads by Source, Follow-Up Outcomes on dashboard; the product breakdown chart on product-performance) — **convert these to horizontal bar charts** (`layout="vertical"`, category on the `YAxis`, value on the `XAxis`) so long names read straight across. Keep short-label charts (Pipeline by Stage, Alert Status) vertical but with horizontal, non-rotated labels (truncate to ~10 chars with ellipsis if needed). **Leads by Source must stay a bar chart — never a pie** (standing rule). Temperature Split donut stays a donut.
- **Enable enter animations** on all charts: recharts animates by default via `isAnimationActive` — ensure it's on with a pleasant `animationDuration={800}` and `animationEasing="ease-out"`. Do not pass `isAnimationActive={false}`.
- **Consistent styling:** rounded bar tops (reuse `CHART_BAR_RADIUS` from `chart.tsx`), faint/no gridlines, and the shared floating tooltip (`chartTooltipContentStyle` + `chartTooltipCursor` from `chart.tsx`) on every chart. Axis text should use `fontSize={11}` and `fill="var(--muted-foreground)"` / `stroke` via currentColor for light+dark parity. Give horizontal-bar YAxis enough `width` so labels aren't clipped.
- If you enhance `chart.tsx`'s shared tooltip/helpers, keep it backward-compatible (other pages import it).

**SS3 — fix the pointless "Trend" column** in `product-performance.tsx`: the `TrendBadge` currently shows a green "+100%" for every row because the previous-period value is 0, which is meaningless. Change it so: when the previous-period value is 0 (no prior data), show a neutral **"New"** badge instead of a fake +100%; only show the ▲/▼ percentage (emerald/destructive) when the previous value is > 0. Keep the column, keep the real trend math for rows that do have prior data.

---
**End. Only your files. tsc stays 139. No build, no dev server, no git.**
