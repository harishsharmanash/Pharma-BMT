# TICKET — Menu bar color inversion + header brand tweaks + lens thumb color

Repo: `leadenthrella/`, stitch design system (tokens + `.pill`/`.sh-*` in `src/styles.css`). Do not commit. Visual-only changes; preserve all behavior and gating.

## 1. Top menu bar — invert colors, thicker, narrower (src/components/app-shell.tsx, ~line 227)

Current: full-width filled `--st-primary` blue bar, white text, white sliding bubble. Change to:

- Base: WHITE — `bg-white/90 backdrop-blur-xl border border-white sh-md rounded-full`, and THICKER than now: `py-2.5` on the bar, items `py-2`.
- Not edge-to-edge: cap the width — `mx-auto max-w-6xl` (keep horizontally scrollable fallback, never wrap).
- Items: icon + text, inactive = `text-[color:var(--st-on-surface)]` (near-black), hover = `text-[color:var(--st-primary)]`.
- Active item: sliding bubble (`motion.span layoutId`, existing spring) filled BLUE — `bg-[color:var(--st-primary)] rounded-full sh-sm` — with active icon+text `text-[color:var(--st-on-primary)] font-semibold`. Blue pill sliding on a white bar.
- Orders pending-count badge on the bar: keep visible — on white base use `bg-[color:var(--st-primary)] text-[color:var(--st-on-primary)]`; when its item is active, invert to `bg-white text-[color:var(--st-primary)]` so it reads on the blue pill.

## 2. Header brand block (src/components/app-shell.tsx, desktop header ~line 197)

- Company name: show it COMPLETE — remove the `max-w-[10rem] truncate` clamp; let it take the space it needs (allow it to shrink gracefully only on very narrow widths).
- "Powered by Cerebyl": the word **Cerebyl** becomes a link to `/refer` — styled `text-[color:var(--st-primary)] hover:underline`, the rest of the line stays `--st-on-surface-variant`. (Refer page exists at src/routes/refer.tsx.)

## 3. Lens bar active thumb — powder blue (src/components/leads-section-header.tsx, src/components/products-section-header.tsx, src/components/team-section-header.tsx)

The active sliding thumb in the `All / Call List / Follow-ups / Duplicates` style bars is currently white-on-white. Change the thumb to powder blue: `bg-[color:var(--st-primary)]/10` with a subtle `shadow-inner` — active label text becomes `text-[color:var(--st-primary)] font-semibold` so it reads on the tint. Keep the bar itself white/elevated (`sh-lg`) as is.

## Verify

`npx tsc --noEmit` in leadenthrella/ = 0 errors. Report per-file changes.
