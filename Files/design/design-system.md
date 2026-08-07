# Cerebyl iOS-style design system — source of truth

Input for phase 9a. **Every value marked SOURCED is extracted verbatim from Apple's
Human Interface Guidelines** via their JSON API (see `hig-tables.md`, 157 tables,
and `hig-full.md`, 109 pages). Values marked DERIVED are our decisions — they are
not Apple's, and are flagged so nobody later mistakes them for gospel.

Points map 1:1 to CSS pixels in our WebView, so `17 pt` → `17px`.

---

## 1. Typography — SOURCED

iOS Dynamic Type, **Large (default)** size class. From the HIG typography page's
tab navigator (`Large (default)` tab) — note the macOS table on the same page has
Body at 13pt and is the wrong one to copy.

| Style | Weight | Size | Leading | Emphasized |
|---|---|---|---|---|
| Large Title | Regular | 34 | 41 | Bold |
| Title 1 | Regular | 28 | 34 | Bold |
| Title 2 | Regular | 22 | 28 | Bold |
| Title 3 | Regular | 20 | 25 | Semibold |
| Headline | Semibold | 17 | 22 | Semibold |
| Body | Regular | 17 | 22 | Semibold |
| Callout | Regular | 16 | 21 | Semibold |
| Subhead | Regular | 15 | 20 | Semibold |
| Footnote | Regular | 13 | 18 | Semibold |
| Caption 1 | Regular | 12 | 16 | Semibold |
| Caption 2 | Regular | 11 | 13 | Semibold |

Also SOURCED: **iOS default text size 17 pt, absolute minimum 11 pt.**

> **The single biggest change this brings.** Body text is **17px**. Today's app
> leans on 12–14px (`text-xs` / `text-sm`) nearly everywhere — the notification bell
> footer used `text-[11px]`. That density is the main reason the phone UI reads as
> cluttered. Adopting 17px body is not a cosmetic tweak; it forces genuinely fewer
> things per screen, which is the actual goal.

**Font: Inter.** SF Pro is licensed for Apple-platform apps only and must never ship
here. Inter is the closest freely-licensed match. Keep `-apple-system` first in the
stack so a future iOS build gets the real system font for free:
`font-family: -apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif;`

## 2. Touch targets — SOURCED

| Platform | Default control | Minimum control |
|---|---|---|
| iOS, iPadOS | **44 × 44 pt** | 28 × 28 pt |

44×44 is the target; 28×28 is the floor, not a licence to shrink.

> CLAUDE.md §8c lists touch targets as a known-open accessibility gap, deliberately
> deferred because resizing `components/ui/button.tsx` ripples app-wide. **Phase 9a
> is when that gets fixed properly** — the preferred approach recorded there is an
> invisible `::after` 44px hit area at flagged call sites, which avoids the ripple.

## 3. Contrast — SOURCED

| Text size | Weight | Minimum ratio |
|---|---|---|
| Up to 17 pt | All | **4.5:1** |
| 18 pt | All | 3:1 |
| Any | Bold | 3:1 |

> **⚠️ Correction (6 Aug, caught during 9a).** That last row is quoted verbatim from
> Apple, but taken literally it is wrong and dangerous: it would permit a 17pt bold
> Headline at 3:1. WCAG's "large text" relaxation applies at **18pt+, or 14pt+ when
> bold** — not to bold at any size. **Use 4.5:1 for all body-sized text regardless of
> weight.** Phase 9a applied 4.5:1 everywhere, which is correct.

Since body is 17pt, **4.5:1 is the working minimum for body text.**

**Audit result (9a, measured):** light theme passed everywhere (≥9.4:1). Dark theme
failed on `--muted-foreground` against every surface (3.25–3.33:1) and on
`--cold-foreground` (3.68:1). Both fixed in `.dark` only — dark-mode muted text is
now slightly lighter. This is the one deliberate appearance change 9a made to
existing screens.

## 4. Spacing — DERIVED

Apple publishes no universal spacing grid; the HIG describes margins qualitatively.
We use an **8pt grid** (4pt for tight optical adjustments), consistent with common
iOS practice and with Tailwind's existing scale in this repo:

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48`

Screen side margin **16px**; grouped-list inset **16px**; section gap **24–32px**.

## 5. Motion — DERIVED (HIG is qualitative here)

The HIG's motion guidance is principled, not numeric: motion should communicate
hierarchy and causality, and must never be required to understand content.

- Standard transition **300ms**, `cubic-bezier(0.32, 0.72, 0, 1)` (iOS-like ease-out)
- Small state changes **200ms**; sheet present/dismiss **350–400ms**
- **`prefers-reduced-motion` must be respected** — `src/lib/use-motion-safe.ts`
  already exists for exactly this and must be used, not bypassed.

## 5b. Section identity — how sections differ (decided 6 Aug, HIG-grounded)

Goal: sections should feel distinct, not interchangeable. Rule: **same grammar,
different vocabulary.** Navigation, type scale, spacing and motion are identical
everywhere; what varies is what the content itself demands.

> **Correction to an earlier recommendation.** "One accent colour per section" was
> proposed in brainstorming and is **wrong as stated**, per the HIG Color page:
> *"Avoid using the same color to mean different things"* and *"apply color
> sparingly… reserve it for elements that truly benefit from emphasis, such as status
> indicators or primary actions."* This app already spends colour semantically —
> hot/warm/cold, dues red, paid green — so eight section colours would collide with
> status meaning. The HIG also notes that for mostly-monochrome apps, the **brand
> colour as the single app accent** is the effective choice.

**Therefore:**
1. **One app accent (Cerebyl brand)** for interactivity and primary actions,
   everywhere. Never recolour buttons, links or controls per section.
2. **Section colour lives ONLY on the section's icon tile** — the Apple Settings
   pattern, where every icon is a different colour but every control is one blue.
3. **Identity comes primarily from the layout primitive**, chosen to match the data:

| Section | Data shape | Primitive |
|---|---|---|
| Dashboard | mixed, time-sensitive | widget grid |
| Leads | pipeline / lenses on one dataset | **segmented control**, not a card hub |
| Clients | entities + territory | directory rows + map |
| Orders | transactions over time | ledger + status timeline |
| Products | catalogue of things | image grid |
| Analytics | trends | chart-first canvas |
| Team | people | avatar-led rows |
| Settings | configuration | grouped inset list |

4. **Card anatomy varies by entity, frame does not.** Same radius, shadow, padding;
   different primary signal — lead → temperature dot + next follow-up; order →
   status chip + ₹ + progress rail; party → dues badge + territory; product → pack
   shot + rate + stock bar; staff → avatar + attendance dot.
5. **Section-specific empty states** — highest-impact identity lever, zero
   structural risk.
6. **Never rely on colour alone** (HIG accessibility): pair every colour signal with
   a glyph or text label so it survives colour-blindness and greyscale.
7. **One motion system.** Per-section easing reads as sloppiness. Animation is for
   state change only — stage moves, numbers counting, charts drawing once. Mind the
   WebView on mid-range Android: avoid blur and large-area transforms.

## 6. Components to build

Nav bar (large title collapsing to inline on scroll) · grouped inset lists ·
bottom tab bar (5 items) · sheets with detents · segmented control · form rows ·
buttons (filled / tinted / plain) · search field · empty states.

**Icons: Lucide only.** SF Symbols are licensed for Apple platforms only.

## 7. Android correctness — non-negotiable

The app ships on Android today. iOS styling must not break platform behaviour:
- **System back gesture must work on every screen**, including sheets and modals.
- Safe-area insets via the existing `pt-safe` utility (`styles.css:259`).
- No hover-dependent affordances — see the vendored `mobile-principles` skill.

## 8. Scope rule

Responsive shared components: **desktop must improve alongside mobile, never
regress.** One component set, adapting by breakpoint.
