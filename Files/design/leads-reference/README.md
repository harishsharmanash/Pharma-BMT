# Leads design reference — the APPROVED look

Saved 6 Aug 2026 at the owner's request. This is the version he reviewed on
localhost and approved with *"this looks cleaaannnn mann"*.

**Its purpose: the live pages are NOT yet this clean.** The owner's assessment of
the shipped version: *"it has some looks of the new design but not even close to
being as clean as the one we built in local host."* These files are the target to
close that gap against — they are the standard, not a starting point to reinterpret.

## Files

| File | What it is |
|---|---|
| `leads-reference-SELF-CONTAINED.tsx` | **The canonical one.** Carries its own `<style>` token block, so it renders exactly as approved regardless of what happens to `styles.css` later. Use this to compare against. |
| `leads-reference-CURRENT.tsx` | The same page after tokens were promoted to `styles.css` (uses `--st-*`). Renders identically today, but depends on the shared stylesheet. |
| `stitch-tokens.css` | The shared `.stitch` token block as promoted into `src/styles.css`. |

**Runnable:** the page is live at `/dev/leads` (unauthenticated, mock data) and at
`http://localhost:8080/dev/leads` when the `cerebyl-dev` server is up.

## Why the live pages fell short of this

The reference was hand-built to match the Stitch export pixel-for-pixel. The rollout
to the real pages was a separate pass over live data and lost fidelity. Known
suspects to check first when closing the gap:

- **Card proportions and internal spacing** — the reference uses a fixed rhythm
  (`p-6`, `gap-6`, `rounded-3xl`) that dense real data can push out of shape.
- **The drawer** — the reference is a fixed 420px panel *inside* the canvas flow,
  not an overlay Sheet. If the real page kept Sheet semantics it will feel different.
- **Chip discipline** — exactly two chips per card (stage + product interest). Real
  leads carry more badges (duplicate, converted), which crowds the row.
- **Toolbar** — every control is a filled pill of equal weight and height, on one
  line. Real filters are Selects/Comboboxes with different intrinsic heights.
- **Glass layering** — three ambient blobs, a glass outer container, a `bg-white/70`
  content panel, and `bg-white/60` cards. Miss any layer and it flattens.

## Standing constraints on this design

- **Light-only.** No dark palette was designed. Do not invent one.
- **Colour lives on the section icon tile**, not on every control — though note the
  approved reference *does* make every toolbar button primary blue, which was the
  owner's explicit choice over the more conventional single-primary hierarchy.
- Heavy `backdrop-filter` blur is the main frame-rate risk in the Android WebView.
- Icons are Lucide, never Material Symbols (licence + one icon set).
