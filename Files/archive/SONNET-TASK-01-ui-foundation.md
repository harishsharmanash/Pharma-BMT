# Sonnet Task 01 — UI foundation + auth/console reskin + product gallery (F8 + F5)

**Run as:** Claude Code, **Sonnet**, in `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`.
**Runs in parallel with Kimi (F3).** LANE RULE: you own styling, design tokens, `src/components/ui/*` primitives, `src/routes/auth.tsx`, console routes (`src/routes/console*`, `developer.tsx`), and product-gallery files. **Do NOT touch** `team.tsx`, `users.tsx`, `use-staff.ts`, `use-leads.ts`, or any `supabase/migrations/*` — Kimi is in those. Commit only; Harish pushes (Bash can't push here). Follow the `leadenthrella-deploy` skill for anything that reaches the live site.

## Goal
Establish the "premium playful glass" design system, then prove it on **auth** first (reference screen Harish approves) and **console** second. Plus ship **F5** (product gallery + image lightbox). Do NOT reskin the whole app yet — foundation + these two surfaces + gallery only.

## Design system (implement as tokens/utilities, don't hardcode per-component)
- **Preserve the existing Cerebyl brand/accent hue** already in the theme — read current CSS variables first and keep the hue. You are upgrading the *system* (shape, elevation, glass, motion), NOT the brand color.
- **Radius:** cards `20px`, inputs/buttons `12px`, pills full-round. **Shadows:** soft multi-layer elevation (e.g. `0 1px 2px rgba(0,0,0,.04), 0 10px 30px -12px rgba(0,0,0,.12)`); cards visibly float.
- **Surfaces:** light neutral body, white cards, plus one **dark "hero" surface** (near-black) for emphasis panels/CTAs (see NL Corp sidebar + the dark price card in the inspiration). **Glass panels:** `backdrop-blur` + translucent bg + hairline border, used sparingly (nav, overlays, hero).
- **Pill navigation:** icon+label pills; active = solid dark pill.
- **Motion (subtle, purposeful):** ease `cubic-bezier(0.22,1,0.36,1)`, 150–220ms; button press `scale .97`; card hover lift; route transitions via View Transitions API; light list stagger. Add framer-motion only if CSS isn't enough. Respect `prefers-reduced-motion`.
- **Theme-aware:** must work in existing light/dark.

## Deliverables
1. Design tokens + primitive updates (`button`, `card`, `input`, `badge`, nav) — no visual regressions elsewhere.
2. **`auth.tsx` reskinned** as the reference screen (glass card on a soft/gradient bg, animated submit, polished inputs).
3. **Console** surfaces reskinned to match.
4. **F5 image lightbox:** clicking any product image (products list + detail) opens a fullscreen zoomable popout modal; swipeable if multiple.
5. **F5 Product Showcase:** a "Product Showcase" button on selected products opens a fullscreen swipeable gallery (use Embla — shadcn carousel; confirm dep, add if missing) sliding left/right like a phone gallery.

## Proof for Harish
Use the preview browser: launch the dev server, screenshot **auth before/after** and the **product showcase**, and share. This is the design green-light gate — surface it clearly so Harish can approve the direction before broader rollout.

## Report back
List every file changed, the token names introduced, and any new dep. Flag anything that will need a migration or backend (hand to Kimi/Claude — don't build DB here).
</content>
