# Cerebyl UI/UX Rebuild — Apple-grade mobile, on top of the approved look

**Version 1.0 — 24 Aug 2026 · Author: Claude Opus (lead) · Status: ready to execute**

**Audience:** the implementing developer (a worker agent, or any engineer picking
this up cold). Everything needed to build is in this file. Where it says *file:line*, that line
was read on 24 Aug 2026 against `main` @ `f622b25`.

---

## 0. How to use this document

Read Parts 1–4 once, in order. They are the *why* and the *law*. Then work Part 11 ticket by
ticket, and check every ticket against Part 12 before calling it done.

Three rules that override anything you might infer from the code you find:

1. **This is an additive rebuild, not a re-skin.** The visual identity — the Stitch look: white
   glass panels, blue pills, soft neumorphic shadows, light-only — is **approved and locked**.
   We are not replacing it. We are (a) making it *consistent*, (b) making it *legible and
   reachable on a phone*, and (c) giving it *Apple's behaviour* — springs, gestures,
   interruptibility. If a ticket ever tempts you to change the palette or the shape language,
   the ticket is wrong. Stop and ask.
2. **The approved reference wins on LOOK; the `apple-design` skill wins on MOTION.**
   Look: `Files/design/leads-reference/leads-reference-SELF-CONTAINED.tsx` (runnable at
   `/dev/leads`). Motion: `leadenthrella/.claude/skills/apple-design/SKILL.md` (vendored 24 Aug
   2026, pinned `56de6f5`, MIT — read its `CEREBYL LOCAL AMENDMENT` block first).
3. **Mobile is the primary target. Desktop must improve alongside, never regress.** One
   responsive component set. Every ticket's acceptance criteria include a desktop check.

Supporting documents, in precedence order:

| Doc | What it governs | Still true? |
|---|---|---|
| This file | The rebuild — tokens, primitives, archetypes, phases | Authority |
| `Files/design/leads-reference/` | The approved visual standard | Authority on look |
| `.claude/skills/apple-design/SKILL.md` | Motion, gesture, materials | Authority on behaviour |
| `Files/design/design-system.md` | iOS type/target/contrast research (SOURCED vs DERIVED) | True as research; its 17px body is **superseded** — see §4.2 |
| `Files/MOBILE-REVAMP-PLAN.md` | The IA restructure (24 → 10 nav items) | Shipped; IA is settled, do not redo |
| Root `CLAUDE.md` §§3, 5, 8e–8i | Brand, product rules, mobile shell, security | Non-negotiable |

---

## 1. The verdict, in one page

**The app does not have a design system. It has three, layered on top of each other, none of
them finished.** That — not taste, not the colour, not the shadows — is why the phone UI reads as
cluttered and why the owner's judgement on the shipped Leads pages was *"not even close to being
as clean as the one we built in local host."*

The three layers, all live simultaneously:

| Layer | Where it lives | Reach today |
|---|---|---|
| **1. shadcn/Tailwind defaults** | `src/components/ui/*` (47 components) | Everything not explicitly restyled — roughly 85 of 122 routes |
| **2. iOS system** (phase 9a) | `--font-ios`, `text-ios-*`, `ease-ios`, `src/components/ios/*` (9 components) | **20 files** |
| **3. Stitch system** (approved) | `.stitch` scope, `--st-*`, `sh-*`, `pill`, `neu-*` (`styles.css:538-600`) | **17 files** |

And a fourth, unofficial layer that is *larger than layers 2 and 3 combined*: **hardcoded hex.**
`#1877F2` appears **570 times** across the source, `#edf2f9` 168 times, `#008FE0` 108 times —
spread over **97 files** — while the token that is supposed to mean "our blue",
`--st-primary`, is `#2589f5` (`styles.css:539`). Three different blues are shipping as "the
brand colour", and none of the 570 call sites can be changed by editing a token.

That is the whole diagnosis. Everything below follows from it:

- **You cannot polish a system you cannot address.** Any global refinement — density, contrast,
  a new accent — currently means 97 files of find-and-replace, so it never happens, so drift
  compounds. **Part 11 / P0 fixes this first, with zero visual change.**
- **The mobile experience was never designed; it was inherited.** 48 files render `<table>`,
  34 routes wrap one in `overflow-x-auto` — that is a desktop table sideways-scrolling on a
  5-inch phone — and only **11 routes** have a distinct mobile rendering. 60 files open a
  centred `Dialog` for data entry; only **2** use the bottom-sheet `Drawer`, even though `vaul`
  is already a dependency.
- **Density is fighting legibility, and losing.** `.stitch .t-body-md` is **13px at weight 300**
  (`styles.css:565`), `t-label` is **10px uppercase**; `text-xs` appears in 156 files and
  10–11px literals in 98. Meanwhile 140 controls are `h-8.5` — **34px tall, against a 44px
  minimum** we already documented and already have a utility for.
- **Motion is decorative, not physical.** 73 files import framer-motion; only **11** use the
  shared `useMotionFlow()` presets, only **2** use `whileTap`. Nothing in the app is
  gesture-driven, nothing is interruptible, no sheet has a detent, no row has a swipe action.

**What we are buying with this rebuild.** A rep on a mid-range Android phone, standing in a
chemist's shop, holding the phone in one hand: today they squint at 13px/300 text on glass,
scroll a table sideways to find a due amount, and tap a 34px target twice. After this rebuild
they read 16px text, swipe a lead row to call it, pull up a sheet with their thumb, and every
number they need is in the top third of the screen. That is the deliverable — not a prettier
screenshot.

---

## 2. Audit — what is actually on screen today

Measured 24 Aug 2026. Reproduce any line with the command in the footnote.

### 2.1 Token integrity — **failing**

```
#1877F2   570 occurrences      ← "Facebook blue", the de-facto accent
#edf2f9   168                  ← the de-facto tinted-fill
#008FE0   108                  ← a third blue (brand/logo lineage)
#e3ecf8    28 · #4db8f0 28 · #f8fafc 17 · #0f172a 15 · #0070c0 11 · #1565C0 8
97 files contain at least one hardcoded hex
--st-primary: #2589f5         ← the token that is supposed to be the accent (styles.css:539)
```

**Consequence:** the design system is decorative. `--st-primary` controls the shell and almost
nothing else. A single owner decision — "make the blue slightly deeper" — is currently a
97-file change, which means it will never be made, which means the app can never be tuned.

### 2.2 Type & density — **failing on mobile**

| Where | Value | Verdict |
|---|---|---|
| `.stitch .t-body-md` (`styles.css:565`) | 13px / 18px / **weight 300** | Below any mobile body minimum; 300-weight on glass is the single worst legibility choice in the app |
| `.stitch .t-data` (`:567`) | 12px / weight 350 | This renders **money** |
| `.stitch .t-label` (`:568`) | 10px uppercase | Acceptable *only* as a micro-label; currently used as a content style |
| Table headers, `leads.all.tsx:679-683` | `text-[10px]` | Sideways-scrolled on a phone |
| `text-xs` (12px) | **156 files** | The app's de-facto body size |
| `text-[10px]` / `text-[11px]` | **98 files** | — |
| `design-system.md` says body should be | **17px** | Never adopted anywhere |

The 17px iOS body was researched, documented, and then quietly ignored because it does not fit a
dense CRM. That was the right instinct and the wrong resolution — the answer is not to keep
13px/300, it is to pick a defensible middle. §4.2 does.

### 2.3 Touch targets — **failing**

`h-8.5` = 34px appears **140 times** in routes; `h-8` = 32px another 32 times. The 44px minimum
is documented (`design-system.md` §2), the utility exists (`.hit-area-44`, `styles.css:282`),
and it is applied at roughly nine call sites. Note the adjacency rule already learned the hard
way (root `CLAUDE.md` §8c): where two icon buttons sit adjacent, the invisible hit area goes on
**one only**, or the later element's overlay eats the first.

### 2.4 Mobile layout — **largely absent**

| Signal | Count | What it means |
|---|---|---|
| Files rendering `<table>`/`<Table>` | 48 | Desktop-first data presentation |
| Routes with `overflow-x-auto` | 34 | A table scrolling sideways on a phone |
| Routes with any `md:hidden` mobile branch | **11** | Fewer than 1 in 10 routes designed for a phone |
| Files importing `ui/dialog` | 60 | Centred modal — wrong archetype on mobile |
| Files using `ui/drawer` (vaul) | **2** | The right archetype, almost unused |
| Largest routes | `products.all.tsx` 2776 · `orders.all.tsx` 2698 · `clients.parties.tsx` 2068 · `leads.all.tsx` 1865 | Monoliths; mobile and desktop markup tangled in one file |

### 2.5 Motion — **decorative**

`framer-motion` imported in **73 files**; `useMotionFlow()` used in **11**; `whileTap` in **2**;
`.press-scale` in 8. `motion-flow.ts` (49 lines) offers exactly three presets — SLIDE, POP, MENU
— all duration/`stiffness` based, none velocity-aware, none interruptible by design. There is no
drag primitive, no detent, no swipe action, no rubber-band, no momentum projection anywhere in
the codebase. Reduced-motion is honoured in `motion-flow.ts` but only **28 of 67**
framer-motion files respect it overall (root `CLAUDE.md` §8i, still open).

### 2.6 Performance risks already shipped

- **Three ambient blurred blobs** in the shell (`app-shell.tsx:283-285`): `blur(120px)` over
  80vw × 80vw, `blur(100px)` over 70vw, `blur(150px)` over 50vw. On a mid-range Android WebView
  each is a full-screen GPU blur pass, repainted on every scroll that changes their compositing
  context. This is the most expensive thing in the app and it is pure decoration.
- **Stacked glass:** `.glass` panel + `backdrop-blur-xl` mobile header + `backdrop-blur-xl`
  bottom tab bar + `backdrop-blur-md` toolbars. `styles.css:348` already carries a comment
  warning that per-row `backdrop-filter` is a GPU pass each — the warning is right and is being
  violated one level up.
- **`.app-density { zoom: 0.8 }`** at `styles.css:802` for `min-width: 768px`. `zoom` is a
  non-standard scaling of the layout viewport: it desynchronises `env(safe-area-inset-*)`,
  `position: fixed` maths, and hit-testing in some engines. It is a density hack standing in for
  a density *scale*.

> Reproduce: `grep -rhoE '#[0-9a-fA-F]{6}' src/routes src/components --include='*.tsx' | sort | uniq -c | sort -rn`
> · `grep -rl 'overflow-x-auto' src/routes --include='*.tsx' | wc -l`
> · `grep -rhoE 'h-8\.5|h-8"' src/routes --include='*.tsx' | sort | uniq -c`

---

## 3. Research — how the best mobile products actually do it

Not a survey. Twelve laws, each with who proved it and what we take. Everything here is
translated into a concrete rule in Part 4 onwards; nothing is left as inspiration.

### 3.1 The thumb owns the bottom third

Steven Hoober's field observation work (2013, ~1,300 users) put roughly half of one-handed use
on a single thumb, and the reachable arc of that thumb is the bottom ~40% of the screen and the
side nearest the holding hand. Every consumer product built since has bottom-anchored its
navigation and its primary action: iOS tab bars, Material 3's bottom app bar and FAB menu,
Instagram, Uber, Swiggy, PhonePe, CRED. Apple's own iOS 26 redesign moved *more* chrome down —
floating, bottom-anchored controls over content.

**Cerebyl take:** navigation, primary action, confirm buttons, and filter controls all live in
the bottom 40%. Titles, identity and status live at the top. **Nothing destructive is ever in
the thumb arc.** Our current mobile layout puts filters, actions, and pagination at the top and
middle — the exact inversion.

### 3.2 Enterprise density is a *scale*, not a size

Salesforce Mobile and SAP Fiori both solved "a CRM has too many fields for a phone" the same
way: a **compact layout** — a fixed, small set of fields promoted to the record header, with
everything else pushed one level down into related lists or tabs. Stripe's dashboard does the
same: one hero number, a sparkline, then a table you opt into. None of them shrink the type.
They **cut the number of things**, and keep each remaining thing readable.

**Cerebyl take:** every entity gets a *compact layout* contract — exactly 4 header fields, one
stat strip of at most 4 numbers, then progressive disclosure. Density comes from fewer items,
never from smaller text. This is the single change that fixes "cluttered".

### 3.3 Sheets, not modals

A centred dialog on a phone is a desktop artefact: it fights the keyboard, it is unreachable
one-handed, and it has no dismissal gesture. Every strong mobile product uses a bottom sheet
with detents and drag-to-dismiss — iOS `UISheetPresentationController`, Material 3 bottom
sheets, and on the web precisely the library we already ship, **vaul** (by the same author as
the `apple-design` skill).

**Cerebyl take:** on `< md`, every `Dialog` becomes a `Drawer`. One responsive wrapper, 60 call
sites, no per-site decisions.

### 3.4 The row is a control surface, not a label

Mail, Things, Superhuman, Gmail, Swiggy's order list: a list row carries a **swipe action** for
its one or two dominant verbs, and a long-press for the rest. It removes an entire
navigate → act → go back loop for the most common task.

**Cerebyl take:** leads swipe to Call and to Log follow-up; parties swipe to Call and WhatsApp;
orders swipe to Share invoice and Record payment. Each is a verb the rep does dozens of times a
day and currently reaches in three taps.

### 3.5 Optimistic, then reconciled

Linear's reputation is built on one thing: the UI never waits for the server. Local state
updates instantly, the mutation reconciles behind it, failure rolls back with a toast.

**Cerebyl take:** the field has bad signal. Every list-level mutation (stage change, follow-up
tick, temperature change) is optimistic through TanStack Query's `onMutate`/rollback. This is a
UX law, not a nicety — a rep on 3G currently watches a spinner to change one dropdown.

### 3.6 Motion is a conversation, not a cutscene

This is the `apple-design` skill's core, and it is what separates a good-looking app from one
that feels alive: motion starts from the current on-screen value, inherits the gesture's
velocity, projects momentum forward, and can be grabbed and reversed mid-flight. Springs, not
durations, because a spring is inherently interruptible.

**Cerebyl take:** Part 5 replaces our three duration-based presets with a spring vocabulary and
a drag primitive. Everything a finger can touch gets a spring.

### 3.7 One accent, colour spent on meaning

Apple's HIG and Material 3 agree, and our own `design-system.md` §5b already concluded it: in a
mostly-monochrome app, one brand accent carries all interactivity, and colour is otherwise
reserved for status. Our status vocabulary is already spoken for — hot/warm/cold, dues red,
paid green. Section identity comes from the **layout primitive** and the icon tile, never from
recolouring controls.

**Cerebyl take:** unchanged from `design-system.md` §5b, now actually enforceable once §4.1
gives us one addressable accent token.

### 3.8 Skeletons that match, empty states that instruct

Facebook's shipped skeleton pattern works because the placeholder has the *same geometry* as the
content — no layout shift on settle. And an empty state that names the next action ("Add your
first lead") converts materially better than one that states a fact ("No leads").

**Cerebyl take:** `src/components/skeleton-loaders.tsx` exists — every list gets a skeleton whose
row height matches its real row within 2px, and every empty state gets a verb.

### 3.9 Chrome that gets out of the way

iOS large titles collapse to inline on scroll; Material's top app bar lifts on scroll; Safari
and Chrome shrink their toolbars. The screen is small — chrome earns its pixels continuously.

**Cerebyl take:** we already have the machinery (`app-shell.tsx:114-160` scroll handler drives
`menuVisible`) — it is applied to the desktop menu bar only. Extend it to the mobile header, and
never to the tab bar (navigation must not vanish).

### 3.10 Search is a destination

Instagram, Linear, Notion, Spotlight: search is a full-screen mode with instant local results,
not a 200px input crammed into a toolbar. Ours is a `w-full sm:w-48` input inside a filter bar
(`leads.all.tsx:404`) at 12px.

**Cerebyl take:** tapping search on mobile opens a full-screen search surface with recents and
scoped results. `GlobalSearch` already exists — it needs a mobile presentation, not a rewrite.

### 3.11 Numbers are typography

Bloomberg, Stripe, and every banking app set figures in tabular (monospaced) numerals so columns
align and a changing digit does not shift its neighbours. Inter ships `font-feature-settings:
"tnum"`. We currently render ₹ amounts at 12px weight 350, proportional.

**Cerebyl take:** a `.num` utility — tabular numerals, weight 500 minimum, never below 15px on
mobile. Money is the most-read content in this app.

### 3.12 Offline and slow are the normal case

Indian field-sales reality: mid-range Android, patchy 3G, a phone that has been awake all day.
Swiggy, Zomato, PhonePe and Ola all optimise for the *bad* case — small payloads, cached shells,
graceful degradation.

**Cerebyl take:** the performance budget in Part 9 is a hard gate, not an aspiration. If a
change costs frames on a mid-range Android WebView, it does not ship, no matter how good the
screenshot looks.

---

## 4. Cerebyl Mobile Design Language v2 — the law

This part is normative. Everything in Parts 6–8 is built out of it. It **extends** the Stitch
tokens; it does not replace them.

### 4.1 Colour — one addressable accent

All of this goes into the `.stitch` block in `src/styles.css`. The values are chosen so that
**P0 produces zero visual change** — we are promoting what is already on screen into tokens, not
picking new colours.

```css
.stitch {
  /* ACCENT — one interactive colour for the entire app */
  --st-primary: #1877F2;              /* was #2589f5; adopt the value 570 call sites already use */
  --st-primary-hover: #1568d8;
  --st-primary-soft: #edf2f9;         /* the 168-occurrence tinted fill, promoted */
  --st-primary-soft-border: #e3ecf8;
  --st-on-primary: #ffffff;

  /* BRAND — Cerebyl identity. Wordmark, logo lockups, /refer, auth. NOT for controls. */
  --st-brand: #008FE0;

  /* SURFACES — unchanged */
  --st-background: #f8f9ff;
  --st-surface: rgba(255,255,255,0.80);
  --st-surface-solid: #ffffff;
  --st-surface-sunken: #f8fafc;

  /* TEXT — see §4.2 for the contrast floor */
  --st-on-surface: #191b22;
  --st-on-surface-variant: #434653;   /* 4.5:1 on white — the FLOOR for secondary text */
  --st-on-surface-faint: #737784;     /* decorative only; never for data */

  /* STATUS — meaning, never decoration. Pair every one with a glyph or word. */
  --st-hot: #E5484D;   --st-hot-container: #FDECEC;
  --st-warm: #F59E0B;  --st-warm-container: #FEF3DE;
  --st-cold: #38BDF8;  --st-cold-container: #E8F6FE;
  --st-success: #16A34A; --st-success-container: #E7F6EC;
  --st-error: #ba1a1a;   --st-error-container: #ffdad6;
}
```

**Rules.**

1. **No hex literal may appear in a `.tsx` file. Ever.** P0 removes all 97 files' worth; a lint
   guard (P0.5) keeps them out. The only permitted hex in the codebase is inside `styles.css`.
2. `--st-primary` is the **only** colour that means "you can touch this". Never recolour a
   control per section.
3. `--st-brand` (#008FE0) is identity, not interaction. It appears on the wordmark, the auth
   screen, and `/refer`. If you are tempted to use it on a button, use `--st-primary`.
4. Status colours **always** ship with a glyph or a word — never colour alone (colour-blindness,
   greyscale, sunlight on a phone screen).
5. **Decision needed from the owner (see Appendix D-1):** adopting `#1877F2` as `--st-primary`
   keeps every live screen pixel-identical but shifts the `/dev/leads` reference by a hair.
   Adopting `#2589f5` instead keeps the reference exact and changes 570 live call sites. The
   recommendation is `#1877F2` — match what shipped, then tune once, in one place.

### 4.2 Type — the Cerebyl Mobile Scale

This supersedes both the 17px iOS body in `design-system.md` §1 and the 13px/300 `t-body-md` in
`styles.css:565`. The reasoning: 17px is Apple's *consumer* body and does not survive a
four-column CRM row; 13px at weight 300 is unreadable on glass in daylight. Enterprise mobile
(Salesforce, Stripe, Fiori) lands at 15–16px body with 13px secondary, and Material 3's
`body-large` is 16px. We take that.

| Token | Mobile | Desktop | Weight | Used for |
|---|---|---|---|---|
| `--t-display` | 28 / 34 | 32 / 38 | 600 | Screen title (Leads, Orders) |
| `--t-title` | 22 / 28 | 24 / 30 | 600 | Section heading, sheet title |
| `--t-headline` | 17 / 22 | 17 / 22 | 600 | **Entity name** — lead firm, party name, product |
| `--t-body` | **16 / 22** | 15 / 21 | 400 | Default text. Replaces `t-body-md` |
| `--t-secondary` | 14 / 19 | 13 / 18 | 400 | Supporting line under an entity |
| `--t-meta` | 13 / 17 | 12 / 16 | 450 | Chips, timestamps, table cells |
| `--t-label` | 11 / 14 | 11 / 14 | 600 | **Uppercase micro-labels only**, `letter-spacing: .06em` |
| `--t-num` | inherits | inherits | 500 | Money & counts. `font-variant-numeric: tabular-nums` |

**Hard floors.**

- **Nothing below 13px on mobile except `--t-label`,** and `--t-label` may never carry data —
  it labels the thing above or below it.
- **Weight floor 400 for anything on a translucent surface.** Weight 300 is banned outright: it
  is the single biggest legibility defect in the audit.
- **Money is never below 15px and never below weight 500.** Always `--t-num`.
- Contrast floor **4.5:1 for all body-sized text regardless of weight** — note the correction
  already recorded in `design-system.md` §3: Apple's "bold → 3:1" row is wrong if applied at
  17px, and we do not apply it.

### 4.3 Space — an 8pt grid with two densities

```css
--sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px; --sp-12: 48px;

--screen-margin: 16px;          /* phone side gutter — never less */
--card-padding: 16px;           /* phone */  /* 24px ≥ md */
--row-height-min: 56px;         /* a list row that is a control surface */
--section-gap: 24px;            /* phone */  /* 32px ≥ md */
--tabbar-height: 56px;
--thumb-safe: 96px;             /* bottom padding on any scroll container above a tab bar */
```

**Delete `.app-density { zoom: 0.8 }`** (`styles.css:802`). Desktop density comes from the
responsive column of the type scale plus `--card-padding: 24px`, not from scaling the viewport.
`zoom` breaks `env()` and fixed-position maths, and it is why desktop and mobile disagree about
what "16px" means.

### 4.4 Shape & elevation

Keep the Stitch shape language exactly as approved. It is codified, not changed:

```
radius:  pill 9999px (buttons, chips, inputs) · 16px (list rows, small cards)
         24px (cards, sheets, panels) · 28px (bottom sheet top corners)
shadow:  sh-sm  resting chips/rows      sh-md  cards, buttons
         sh-lg  panels, sheets          neu-lift  interactive lift (hover/press)
border:  1px rgba(255,255,255,0.8) on glass surfaces — the highlight edge is part of the look
```

**Concentric radii rule** (Apple, and it is why the reference looks "clean"): a child inside a
parent with radius R and padding P should have radius `R − P`. A 24px card with 16px padding
holds 8px children — *not* another 24px card. Nesting equal radii is the most common way the
live pages lose fidelity against `/dev/leads`.

### 4.5 Materials — and the blur budget

Translucency is part of the approved look and stays. But §12 of the `apple-design` skill assumes
an iPhone GPU, and we ship to a mid-range Android WebView. **Therefore:**

> **BLUR BUDGET: at most 2 `backdrop-filter` layers in the compositing path at any time on a
> phone. Adding a third requires removing one.**

Current spend on a phone: glass panel (1) + mobile header `backdrop-blur-2xl` (2) + bottom tab
bar `backdrop-blur-xl` (3) + any `backdrop-blur-md` toolbar (4). **We are at four and must get
to two.** Resolution:

- **Header and tab bar keep their blur** — they are the two layers, they overlap scrolling
  content, and that is exactly what the material is for.
- **The outer `.glass` panel becomes an opaque surface on `< md`** (`--st-surface-solid` at 92%
  with the highlight border). It sits over the background blobs, which nothing scrolls behind,
  so the blur buys nothing on a phone.
- **Toolbars and cards lose `backdrop-blur-*` entirely on mobile.** They get
  `--st-surface` (solid-ish white) instead. Visually near-identical over our light background;
  materially cheaper.
- **The three ambient blobs are replaced on `< md`** by a single pre-baked CSS
  `radial-gradient` background — same look, zero blur passes. Keep the live blobs on `≥ md`.

Also adopt, from the skill: **materialise, don't fade** — sheets and popovers animate blur radius
and scale together on enter, so a surface reads as arriving rather than appearing; and **scroll
edge effects, not hard dividers** — where content passes under floating chrome, fade a short
gradient mask instead of drawing a 1px border.

---

## 5. Motion system — Apple's behaviour, in our code

Everything here replaces the contents of `src/lib/motion-flow.ts`. **No component may write an
inline `transition` object again**; if a motion is not in this vocabulary, it gets added here
first. That is what makes the app feel like one product.

### 5.1 The spring vocabulary

Apple's two parameters (damping ratio, response) map onto framer-motion's `bounce` + `duration`
spring API. `bounce ≈ 1 − damping`.

| Preset | Apple equivalent | framer-motion | Use for |
|---|---|---|---|
| `SPRING.snap` | damping 1.0, response 0.25 | `{type:'spring', bounce:0, duration:0.25}` | Chips, toggles, small state changes |
| `SPRING.default` | damping 1.0, response 0.4 | `{bounce:0, duration:0.4}` | Layout moves, nav indicators, cards |
| `SPRING.sheet` | damping 0.8, response 0.3 | `{bounce:0.15, duration:0.3}` | Sheets, drawers, detents |
| `SPRING.playful` | damping 0.8, response 0.4 | `{bounce:0.25, duration:0.4}` | **Only after a flick/throw.** Never on a fade-in |
| `SPRING.gesture` | — | `{bounce:0, duration:0.35, velocity: v}` | Any release-from-drag, velocity handed in |

**The bounce rule, verbatim from the skill and non-negotiable:** overshoot is earned by momentum.
A menu that faded in must not bounce. A card you flicked must.

### 5.2 The five behaviours that make it feel Apple

1. **Response — kill latency.** Feedback begins on `pointerdown`, not on `click`, and not at the
   end of the animation. Every tappable surface gets `whileTap={{scale:0.97}}` via `POP`.
   Currently 2 files do this.
2. **Direct manipulation — 1:1 tracking.** While a finger is down, the element follows it
   exactly: Pointer Events with `setPointerCapture`, and respect the grab offset (the element
   must not jump to centre under the thumb).
3. **Interruptibility — the most important one.** Every animation must be grabbable mid-flight
   and must start from the *current on-screen value*, never from a nominal start state. In
   framer-motion this means animating a `MotionValue` and never remounting to restart.
4. **Velocity handoff.** On release, the spring inherits the gesture's velocity
   (`info.velocity.y` from `onDragEnd`) so there is no seam between drag and animation.
5. **Momentum projection.** Decide the landing point from velocity, not from position:
   `projected = current + (v/1000) · d/(1−d)`, `d ≈ 0.998`. Then snap to the nearest detent to
   *that* point. And decide dismiss-vs-restore from the **sign of the velocity**, not from how
   far the sheet was dragged — a fast flick down dismisses even from 10px.

### 5.3 Rubber-banding

At any scroll or drag boundary, resist rather than stop dead:
`displacement = (Δ · c) / (Δ · c / limit + 1)`, `c ≈ 0.55`. Applies to the sheet's top detent,
the top of pull-to-refresh, and horizontal swipe actions past their action width.

### 5.4 What `motion-flow.ts` must export after P0

```ts
SPRING          // the table in §5.1
POP             // whileTap press feedback (reduced-motion → {})
MENU            // dropdown/popover enter+exit (materialise: blur+scale, not opacity alone)
PAGE            // route transition: forward = slide-in from right + parent -8% parallax
SHEET           // detent spring + drag handlers + velocity/projection helpers
SWIPE           // row swipe-action primitive: thresholds, rubber-band, snap-back
LIST            // staggered list entry — max 8 items, 20ms apart, then no stagger
useReducedMotion → every export collapses to duration 0. Reduced motion REMOVES movement;
                   it does not shorten it. (Already the rule in motion-flow.ts:9 — keep it.)
```

### 5.5 Motion budget

- Nothing animates `width`, `height`, `top`, `left`, or `box-shadow`. Transform and opacity only
  (plus `filter: blur()` on the two permitted material layers).
- Route transitions ≤ 350ms. A rep changing screens 200 times a day must never wait on us.
- Stagger caps at 8 elements. A 40-row list that staggers is a 40-row list that feels slow.
- Every `motion` element that animates on scroll gets `will-change` **added on interaction start
  and removed on settle** — never left on in CSS.

---

## 6. The component contract

Build these once, in `src/components/mobile/` (new). Every screen in Part 8 is assembled from
them. Each has a fixed prop contract so a screen ticket cannot invent a variant.

### 6.1 `<AppSheet>` — replaces `Dialog` on mobile

Wraps vaul's `Drawer` below `md`, and the existing `Dialog` at `md` and up. **One component, 60
call sites converted, no per-site decisions.**

```tsx
<AppSheet
  open onOpenChange
  title="Add lead"                 // required — sheets always announce themselves
  detents={[0.5, 0.92]}            // fractions of viewport; default [0.92]
  dismissible                      // drag-down + scrim tap; false for unsaved-changes guards
  footer={<PrimaryAction/>}        // pinned in the thumb zone, above the keyboard
>
```
Requirements: grab handle 36×5px, 28px top radius, scrim `rgba(0,0,0,0.4)`, drag is 1:1,
release uses momentum projection (§5.2.5), Android hardware back closes it (**correctness
requirement, root `CLAUDE.md` / `design-system.md` §7**), body scroll locked, focus trapped,
and the footer sits above `env(keyboard-inset-height, 0px)`.

### 6.2 `<EntityRow>` — the list primitive

Replaces bespoke card markup in every list route.

```tsx
<EntityRow
  leading={<TempDot temp="hot"/>}        // status glyph or avatar, 40px
  title="Shree Balaji Pharma"            // --t-headline, 1 line, truncate
  subtitle="Jaipur · Raj · added 2d ago" // --t-secondary, 1 line
  trailing={<Money value={48200}/>}      // --t-num, right-aligned, tabular
  chips={[stage, interest]}              // MAXIMUM TWO. This is enforced, not advisory.
  swipeLeft={{icon: Phone, label:'Call', tone:'success', onAction}}
  swipeRight={{icon: CalendarPlus, label:'Follow-up', tone:'primary', onAction}}
  onPress={...}
/>
```
Requirements: min-height 56px (72px when it has a subtitle), whole row is one tap target, press
state via `POP`, swipe uses `SWIPE` with rubber-band past the action width, and the swipe action
fires **on release past threshold OR on flick velocity** — not on distance alone.

> **The two-chip rule is load-bearing.** The approved reference allows exactly two chips per
> card; the live Leads cards added Duplicate and Converted badges and that is documented as a
> primary cause of the fidelity gap (`Files/design/leads-reference/PUNCH-LIST.md` §2). A third
> signal goes on the leading glyph or into the detail screen.

### 6.3 `<StatStrip>` — the compact layout header

2–4 numbers, horizontally scrollable only if 4 exceed the width. Each: `--t-label` caption above,
`--t-num` value below, optional delta chip. This is the "one hero number" pattern from §3.2 and
it is what replaces the top-of-screen table on every list route.

### 6.4 `<ActionBar>` — the thumb-zone action surface

Sticky, bottom, above the tab bar, `pb-safe`. **At most one primary action** (filled pill,
full-width on phone) plus up to two secondary icon actions. Destructive actions are **never**
here — they live in the overflow menu behind a `ConfirmDelete`.

### 6.5 `<FilterSheet>` — replaces the toolbar pill row on mobile

The Leads toolbar is currently eight controls in a horizontally-scrolling row of 34px pills at
12px (`leads.all.tsx:399-495`). On mobile that becomes: **one** "Filters" button showing the
active count, opening a 50%-detent sheet with full-height 44px rows. The desktop toolbar stays
exactly as approved — this is a `< md` presentation only.

### 6.6 `<SearchScreen>` — search as a destination (§3.10)

Full-screen on mobile, autofocus, recents, scoped result groups, `Esc`/back to exit. Wraps the
existing `GlobalSearch` logic; no query changes.

### 6.7 Supporting primitives

| Component | Contract |
|---|---|
| `<Money value tone?/>` | `--t-num`, `₹` prefix, Indian grouping (1,23,456), never below 15px |
| `<StatusChip kind label/>` | Status colour **+ glyph + word**. Never colour alone |
| `<SectionCard title action?/>` | 24px radius, 16px padding (24 ≥ md), `sh-md`, concentric children |
| `<EmptyState icon title action/>` | Verb in the action. One per section, section-specific |
| `<ListSkeleton rows height/>` | Row height must match the real row within 2px |
| `<PullToRefresh/>` | Rubber-banded, spring-settled, triggers the route's `refetch()` |

---

## 7. Screen archetypes — the layout law

Every screen in the app is one of five archetypes. If a screen does not fit one, it is the
screen that is wrong.

### 7.1 List (leads, parties, orders, products, stock, team)

```
┌─────────────────────────────┐
│ ‹  Logo      🔔  ⚙  [avatar]│  header, collapses on scroll down
├─────────────────────────────┤
│ Leads                       │  --t-display
│ [ All ][ Hot ][ Follow-up ] │  segmented lens, sliding indicator (layoutId + SPRING.default)
├─────────────────────────────┤
│ 🔍 Search        ⚙ Filters ③│  44px controls; Filters opens FilterSheet
├─────────────────────────────┤
│ ● Shree Balaji Pharma    ₹48,200 │  EntityRow — swipe → Call
│   Jaipur · Raj · 2d ago         │
│   [Negotiation] [Tablets]       │  exactly two chips
├─────────────────────────────┤
│ … rows …                    │
├─────────────────────────────┤
│           [ + Add lead ]    │  ActionBar, thumb zone
│ ▣ Dash  ◔ Leads  ◕ Clients …│  tab bar, pb-safe
└─────────────────────────────┘
```
**Laws.** No `<table>` below `md`. No horizontal scroll of content, ever — only of a deliberate
chip rail. Pagination is replaced by infinite scroll with a "Showing 60 of 340" footer line.
Sort/filter state lives in the URL (deep links are shared over WhatsApp — root `CLAUDE.md` §8h
rule 3). Default sort stays alphabetical everywhere except Leads, which stays
`date_received` descending (`CLAUDE.md` §5 — do not "fix" this).

### 7.2 Detail (leads.$id, parties.$id, orders.$id) — **the biggest win, currently unstyled**

```
┌─────────────────────────────┐
│ ‹ Back                  ⋯   │  overflow menu holds edit/delete/share
├─────────────────────────────┤
│ ● Shree Balaji Pharma       │  identity block: --t-display + status glyph
│   Jaipur, Rajasthan         │
├─────────────────────────────┤
│  ₹48,200  │  12  │  4 days  │  StatStrip — compact layout, max 4
│  Dues     │Orders│ Last seen │
├─────────────────────────────┤
│ [ Call ]  [ WhatsApp ] [ ⋯ ]│  ≤3 actions, thumb-reachable
├─────────────────────────────┤
│ ▸ Contact & address         │  SectionCards, collapsible, remembered per user
│ ▸ Orders (12)               │
│ ▸ Payments & dues           │
│ ▸ Territory                 │
│ ▸ Activity                  │
└─────────────────────────────┘
```
**Laws.** Exactly 4 fields in the identity block. StatStrip max 4 numbers. Max 3 primary
actions; everything else in `⋯`. Sections are collapsed by default below the first two, and the
open/closed state persists per user. **Destructive actions live at the bottom of `⋯`, behind
`ConfirmDelete`, never in the thumb arc** (this also finishes the one open relocation noted in
`CLAUDE.md` §8b — the header Delete at `leads.$id.tsx:199`).

### 7.3 Form (create/edit anything)

Below `md`, always an `<AppSheet>`; at `md`+, the existing dialog. Single column, 44px inputs,
16px labels above fields (never placeholder-as-label), errors inline below the field in
`--st-error` with a glyph, and a **sticky footer with one primary action**. Keyboard must never
cover the focused field or the footer. Unsaved-changes guard on dismiss when the form is dirty.

### 7.4 Dashboard — for ACTING

Already decided in `MOBILE-REVAMP-PLAN.md` §2: *Dashboard answers "what do I do right now";
Analytics answers "how are we doing".* Structure: a greeting line, **My Day** exceptions
(overdue follow-ups, dues crossed terms, pending requests) as tappable rows, a 2×2 quick-action
grid (New lead / New order / Record payment / Add party), then at most two glanceable widgets.
No analysis, no charts that require interpretation — those belong in Analytics.

### 7.5 Analytics — for UNDERSTANDING

Chart-first canvas. One chart per card, one question per chart, a single-sentence observation
under each. Always reuse `src/components/ui/chart.tsx` — never hand-roll (root `CLAUDE.md` §6).
**Leads by Source stays a bar chart, never a pie** (§5, standing rule). On mobile, charts are
full-bleed to the screen margin and scroll vertically; no chart scrolls horizontally.

---

## 8. Section-by-section application

Eight sections, in build order. Each gets: the archetype, the compact layout (what is promoted),
the swipe verbs, and the specific defect to fix. **The IA is settled — do not re-plan it.**

### 8.1 Leads — `leads.index / leads.all / leads.$id / leads.followups / leads.duplicates / leads.intake`

Reference-standard section; also the one with a documented fidelity gap. Work the punch list at
`Files/design/leads-reference/PUNCH-LIST.md` **first**, then apply this part.

- **List:** `EntityRow` — leading = temperature dot (glyph + colour), title = firm name,
  subtitle = `city · state · nth follow-up due`, trailing = stage chip, chips = stage +
  product interest (**two, no more** — remove the Duplicate and Converted badges per punch-list
  §2). Lens segmented control on the same line as the title (punch-list §3).
- **Swipe:** left → Call (`tel:`), right → Log follow-up (opens a 50%-detent sheet).
- **Detail (`leads.$id`, 748 lines, no design pass ever):** identity = firm, contact, city,
  source. StatStrip = temperature · days in stage · follow-ups done/total · quoted value.
  Actions = Call · WhatsApp · ⋯. Sections = Contact, Products of interest, Follow-up timeline,
  Objections, Activity. **Move the header Delete into `⋯`.**
- **Also:** extract the duplicated `LogCallDialog` (exists in both `leads.all.tsx` and
  `leads.$id.tsx` — flagged in `CLAUDE.md` §8h; this repo has shipped that same duplication bug
  twice before).

### 8.2 Clients — `clients.index / clients.parties / clients.territories / clients.portal-access`

- **List:** leading = avatar/initials, title = party name, subtitle = `city · rep`, trailing =
  `<Money>` dues (red when overdue, with a glyph), chips = credit tier + territory.
- **Swipe:** left → Call, right → WhatsApp.
- **Detail (`parties.$id`, 1590 lines):** the archetype in §7.2 verbatim. StatStrip =
  dues · orders · last order · credit tier.
- **Fix:** `clients.parties.tsx` is 2068 lines with a table inside `overflow-x-auto`. Split the
  mobile list into `EntityRow`s and keep the table for `≥ md` only.
- **Do not touch** the portal shell or `portal.*` routes — party users have no `profiles` row and
  that separation *is* the isolation guarantee (`CLAUDE.md` §8f). The portal's own bottom nav is
  already correct.

### 8.3 Orders — `orders.index / orders.all / orders.$id / orders.requests / orders.intimations / orders.dues / orders.transporters`

- **List:** leading = status glyph, title = party name, subtitle = `invoice no · date`,
  trailing = `<Money>` total + paid/due state, chips = status + payment state.
- **Swipe:** left → Share invoice (`ShareSheet`), right → Record payment (sheet).
- **Detail (`orders.$id`, 1022 lines):** identity = party + invoice no. StatStrip = total ·
  paid · due · items. A **status timeline** (placed → dispatched → delivered → paid) as the
  first section — this is a ledger archetype and the timeline is its signature.
- **Preserve exactly:** `?party=` filters only, `?new=1` opens the form. Both are load-bearing
  for Ceremate's `start_order` (`CLAUDE.md` §8b).
- **Badge counts** for pending requests + intimations already feed the tab bar
  (`app-shell.tsx:173-175`) — keep them wired.

### 8.4 Products — `products.index / products.all / products.stock / products.offers / products.aids`

- **Archetype: image grid**, not rows — the primitive is the identity here (`design-system.md`
  §5b). 2-up on phone, 4-up at `md`. Pack shot, name, rate, stock bar.
- `products.all.tsx` is the largest file in the app (2776 lines). Do **not** refactor its logic
  in a design ticket — change only presentation. Pack attributes (`dosage_form`, `pack_size`,
  `packing_type`) are shipped and must keep rendering (`CLAUDE.md` §8b — do not rebuild).
- **Stock** stays a table at `≥ md`; on mobile it becomes rows with a batch/expiry sub-line.
  The `STOCK_MOVEMENTS_LIMIT` (2000) bound must stay disclosed in the UI.

### 8.5 Team — `team.index / team.directory / team.accounts`

Avatar-led rows, attendance dot, role chip. Detail = person: attendance, incentives, assigned
territories, payroll. **Reassigning a party's rep stays managers/admins only** (`CLAUDE.md` §5).

### 8.6 Analytics — `analytics.index / overview / products / leaderboard / response-time`

Archetype §7.5. Full-bleed charts, one observation sentence each, CSV export retained.

### 8.7 Dashboard — `dashboard.tsx`

Archetype §7.4. This is the highest-traffic screen in the app and it is currently a passive view
screen. Rebuild it as exceptions + quick actions.

### 8.8 Settings & utilities — `settings.index / settings.admin.* / trash / help / account / ceremate / whatsapp`

Grouped inset list, 44px rows, section icon tiles carrying the only per-section colour. Ceremate
keeps its own chat layout — **do not restyle the message bubbles or the `kind` render switch**
(`src/components/ceremate/message-bubble.tsx`); it is a shipped, verified surface with a
chart-block parser attached to it.

**Console (`console.*`) is out of scope entirely** — different audience, and its separation is a
security boundary (`MOBILE-REVAMP-PLAN.md` §1).

---

## 9. Performance budget — a gate, not an aspiration

Target device: **mid-range Android (4 GB RAM, ~2021 SoC), Chrome WebView, 3G**. Not an iPhone.

| Budget | Limit | How to check |
|---|---|---|
| `backdrop-filter` layers on a phone | **2** | `grep -rn 'backdrop-blur\|backdrop-filter' src \| wc -l` and read each |
| Scroll frame rate, any list | **≥ 55 fps** sustained | Chrome DevTools → Performance, 6× CPU throttle |
| Interaction → first visual feedback | **≤ 100 ms** | Feedback on `pointerdown`, never on `click` |
| Route transition | **≤ 350 ms** | `PAGE` preset |
| Animated properties | transform / opacity only (+ blur on the 2 material layers) | Code review |
| Long list without virtualization | **≤ 200 rows** | Above that, virtualize or paginate |
| Largest route bundle | no regression vs `main` | `npm run build` output |
| `will-change` left on in CSS | **zero** | `grep -rn 'will-change' src/styles.css` |

**Three specific removals** (each is measurable):
1. The three ambient blurred blobs (`app-shell.tsx:283-285`) → a static radial gradient on
   `< md`.
2. `.app-density { zoom: 0.8 }` (`styles.css:802`) → responsive type/padding tokens.
3. Per-card/toolbar `backdrop-blur-*` on mobile → solid `--st-surface`.

**Do not** add a virtualization library in this rebuild. Server-side pagination and
virtualization are a separate, already-planned workstream (`Files/SCALE-PLAN.md`). If a list
exceeds 200 rows on a phone today, cap the mobile render and disclose it in the footer line.

---

## 10. Accessibility & Android correctness

Not optional, and two of these are correctness bugs rather than polish.

1. **Touch targets ≥ 44×44.** Prefer `.hit-area-44` (`styles.css:282`) over resizing, to avoid
   the app-wide ripple. **Adjacency rule: where two icon buttons sit adjacent, apply it to ONE
   only** — overlapping invisible areas make the later element eat the first (`CLAUDE.md` §8c).
   The three known dense pairs (claims approve/reject, attendance prev/next, stock tabs) need a
   row-*spacing* pass before they can take hit areas at all.
2. **`prefers-reduced-motion` in all 67 framer-motion files** (28 done). Reduced motion
   *removes* movement — it does not shorten it. Enforced automatically if every file goes
   through `motion-flow.ts`.
3. **The Android hardware back gesture must work on every screen, including every sheet and
   modal.** This is a correctness requirement, not a style one. Test each new sheet on a device.
4. **Contrast 4.5:1 for all body-sized text**, regardless of weight. Weight-300 body text is
   banned by §4.2 anyway.
5. **Never colour alone.** Every status carries a glyph or a word.
6. **No hover-dependent affordance.** If it only appears on hover, it does not exist on a phone.
7. **Focus visible** on every interactive element; keyboard access on clickable rows and cards
   (already restored once — do not regress it).
8. **Safe areas** via `pt-safe` / `pb-safe` (`styles.css:318-323`) on every fixed bar.
9. **Screen-reader labels** on every icon-only button — `aria-label` with the verb.

---

## 11. The build plan

Nine phases. Each is a set of worker tickets. **Ticket authoring rules are
in root `CLAUDE.md` §2 and are not repeated here — but three bite every time:** keep every
`--file`/`--read` path inside `leadenthrella/`; the worker cannot run `tsc` or the tests, so its
verification is speculation and the lead runs the gates; and every ticket says **"commit
locally, do not push."**

Attach to every ticket: `--read .claude/skills/cerebyl-context/SKILL.md`,
`--read .claude/skills/apple-design/SKILL.md`, and `--read` this file.

Each phase ships and is verified on a real device before the next starts.

---

### P0 — Foundation: make the system addressable *(no visual change)*

The most important phase and the least visible. **Acceptance for the whole phase: a screenshot
diff of `/leads`, `/orders`, `/dashboard` before and after shows no perceptible change.**

**P0.1 — Token promotion.** Replace every hardcoded hex in `src/routes/**` and
`src/components/**` with a `--st-*` token. `#1877F2` → `--st-primary` (and set
`--st-primary: #1877F2`), `#edf2f9` → `--st-primary-soft`, `#008FE0` → `--st-brand`,
`#e3ecf8` → `--st-primary-soft-border`, `#f8fafc` → `--st-surface-sunken`, greys → the
`--st-on-surface*` ramp. 97 files. Mechanical — ideal worker task, but **review the diff for
semantic mistakes**: a `#008FE0` on a *button* must become `--st-primary`, not `--st-brand`.
*Acceptance:* `grep -rE '#[0-9a-fA-F]{6}' src/routes src/components --include='*.tsx'` returns
**zero**; `npx tsc --noEmit` = 0; build succeeds.

**P0.2 — Type scale.** Add the §4.2 tokens to `styles.css`. Redefine `.stitch .t-body-md` to
16px/400 mobile (15px ≥ md) and `t-data` to `--t-meta`. Add `.num`. **Delete weight 300 from the
stylesheet entirely.**
*Acceptance:* no `font-weight: 300` anywhere in `styles.css`; no `text-[10px]`/`text-[11px]`
outside `--t-label` usage.

**P0.3 — Spacing & density.** Add the §4.3 tokens. **Delete `.app-density { zoom: 0.8 }`** and
compensate with responsive padding/type. *This one will visibly change desktop* — it is the
single exception to the no-change rule for this phase, and it needs a desktop screenshot check.

**P0.4 — Motion vocabulary.** Rewrite `src/lib/motion-flow.ts` to export the full §5.4 set.
Keep `SLIDE`/`POP`/`MENU` as aliases so the 11 existing consumers keep working.

**P0.5 — Guard rails.** An ESLint rule (or a `scripts/check-tokens.sh` wired into
`scripts/ship.sh`) that **fails the build** on: a hex literal in a `.tsx`, `font-weight:300`, a
`text-[<13px]` literal, or a new `backdrop-blur` beyond the budget. Without this, P0 decays
within a month — that is precisely how the app got to 570 literals.

---

### P1 — Shell & navigation

**P1.1 — Bottom tab bar to spec.** `app-shell.tsx:455`. 56px + `pb-safe`, 44px targets, active
indicator via `layoutId` + `SPRING.default` (keep `nav-active-mobile` distinct from the desktop
`nav-active` id — sharing one makes the pill fly between DOM trees), labels always visible,
badge counts preserved, `POP` on press.
**The tab bar never hides on scroll.**

**P1.2 — Mobile header.** Collapse-on-scroll-down / reveal-on-scroll-up, reusing the existing
handler (`app-shell.tsx:114-160`). Back button ≥44px. Title becomes the screen name.

**P1.3 — "More" sheet.** The 5th tab opens an `AppSheet` (not the current overlay) listing the
remaining sections as 56px rows with icon tiles.

**P1.4 — Blur budget.** Implement §4.5: blobs → static gradient on `< md`; `.glass` → opaque on
`< md`; strip `backdrop-blur-*` from toolbars and cards.
*Acceptance:* at most two `backdrop-filter` layers composited on a phone; scroll fps measured
before/after on a throttled profile.

**P1.5 — Page transitions.** `PAGE` preset on route change: forward slides in from the right
with the outgoing view parallaxing −8%; back is the exact mirror (**symmetric paths** —
`apple-design` §7). Reduced motion → cross-fade.

---

### P2 — Primitives

Build all of §6 in `src/components/mobile/`, plus a **`/dev/mobile` gallery route** rendering
every primitive in every state with mock data — unauthenticated, exactly like `/dev/leads`. This
is how the owner reviews without a login, and how the worker verifies without guessing. Build the
gallery **first**, in the same ticket as the first primitive.

Order: `AppSheet` → `EntityRow` → `StatStrip` → `ActionBar` → `FilterSheet` → `SearchScreen` →
supporting primitives.

*Acceptance per primitive:* renders in the gallery in all documented states; keyboard accessible;
reduced-motion path verified; Android back closes any sheet; 44px targets; no hex literals.

---

### P3 — Dialogs → sheets *(60 call sites)*

Convert every `ui/dialog` import to `<AppSheet>`. Mechanical once the primitive exists; batch
by section, ~10 files per ticket. **Do not convert:** `ConfirmDelete` (an alert dialog is correct
for a destructive confirm) or anything under `console.*` or `portal.*`.

*Acceptance:* every converted form is usable one-handed with the keyboard open; the primary
action stays visible above the keyboard; dirty forms warn on drag-dismiss.

---

### P4 — List screens

One ticket per section, in the §8 order. Replace the mobile branch with `EntityRow` +
`StatStrip` + `FilterSheet` + `ActionBar`. **Keep the desktop table** — put it behind
`hidden md:block` and render rows below `md`.

*Acceptance per screen:* zero horizontal scroll at 375px; no text below 13px; swipe actions work
and are cancellable mid-swipe; sort/filter round-trip through the URL; skeleton matches row
height; empty state names a verb; the desktop view is unchanged or better.

---

### P5 — Detail screens *(the biggest perceived win)*

`leads.$id` → `parties.$id` → `orders.$id`, then `transporters.$id`, `console`-free others.
Apply §7.2 exactly. Each ticket: identity block, StatStrip, ≤3 actions, collapsible
SectionCards, destructive into `⋯`.

*Acceptance:* every field currently on the screen still reachable (**no feature may be lost** —
`MOBILE-REVAMP-PLAN.md` §3); nothing destructive in the thumb arc; section open/closed state
persists.

---

### P6 — Dashboard & Analytics

P6.1 Dashboard rebuild (§7.4). P6.2 Analytics chart-first pass (§7.5). Charts must keep using
`src/components/ui/chart.tsx`; Leads-by-Source stays a bar chart.

---

### P7 — Motion polish

Gesture-driven sheets with real detents and velocity handoff · swipe actions with rubber-band ·
pull-to-refresh on every list · interruptible page transitions · `POP` on every tappable ·
materialise-on-enter for sheets and popovers · staggered list entry capped at 8.

**This is the phase that makes it feel Apple, and the one most likely to be faked.** Verify by
*interrupting* every animation mid-flight: it must reverse smoothly from where it is, never snap
to a start value.

---

### P8 — Accessibility, performance, and the reduced-motion sweep

Finish `prefers-reduced-motion` across all 67 files · touch-target sweep incl. the three dense
pairs (spacing first) · contrast audit at the new type sizes · fps profiling on a throttled
device profile · bundle-size check.

---

### Suggested sequencing

P0 is one focused session. P1+P2 together. P3 batches alongside P4 (a section's dialogs convert
with its list). P5 is the owner-visible payoff — do not defer it behind Analytics. P7 and P8
close out.

---

## 12. Verification protocol

**Nothing is "done" on a screenshot.** The gates, in order, for every ticket:

1. `npx tsc --noEmit` → **0 errors.** The baseline is 0; any error is a regression
   (`CLAUDE.md` §4).
2. `npm run test` → all pass (currently 644 tests / 65 files). **Mutation-test any new test**
   before committing — this repo has shipped a suite that passed while the behaviour under test
   was deleted (`CLAUDE.md` §2 rule 7).
3. `npm run test:isolation` → run it if a ticket touches any data hook, not just RLS.
4. `./scripts/ship.sh --dry-run` → env gate + artifact assertion + build.
5. **Read the full `git diff` yourself.** Never accept a worker summary. The known failure mode
   on this project is the worker *deleting shipped features while restyling* — read design diffs
   for what vanished, not only for what appeared.
6. **Browser verification on the live URL** — `preview_start`, navigate to the changed route,
   `read_console_messages` + `read_network_requests`. **Never verify a deploy by comparing local
   `.output` filenames to the live site, and never conclude a deploy is broken from a `curl` 404
   on a chunk** — both produced false alarms and cost real time (`CLAUDE.md` §8g).
7. **Device check on a real Android phone** at the end of each phase: back gesture on every new
   sheet, one-handed reachability, scroll fps, sunlight legibility.

**Screenshot discipline.** Before starting a phase, capture `/leads`, `/orders`, `/dashboard`,
`/parties/$id` at 375×812 and at desktop. After, capture the same six. Diff them. For P0 the
expected diff is *nothing* (except desktop density from P0.3).

**Local dev works now** — `npm run dev` via `preview_start` with `cerebyl-dev` (config in the
project-root `.claude/launch.json`). There is still no login for an agent, so **build mock
routes under `/dev/*` for anything that needs auth** — that is how `/dev/leads` got a whole
design approved in one round, and it is why `/dev/mobile` is part of P2.

---

## 13. Risks & rollback

| Risk | Likelihood | Mitigation |
|---|---|---|
| **Worker deletes a shipped feature while restyling** | High — it has happened | Every design diff reviewed for removals; §11 acceptance requires "every field still reachable"; `/dev/*` gallery catches missing states |
| Token promotion changes a colour semantically (brand vs accent) | Medium | Review P0.1 diff by call site, not by count; screenshot diff must be empty |
| Blur removal visibly flattens the approved look | Medium | Compare against `/dev/leads` at 375px; if it flattens, restore blur on the card layer and remove it from the header instead — the budget is 2, the *choice* of which 2 is ours |
| 16px body breaks dense layouts | Medium | That is the point (§3.2) — cut items, don't shrink text. If a row genuinely cannot fit, it is carrying a field that belongs in the detail screen |
| Sheet conversion breaks Android back | Medium | Explicit per-sheet device test; it is a correctness gate, not a polish item |
| Scope creep into logic during a design ticket | High | Tickets say "presentation only"; any hook/query change is a separate ticket |
| Phase drags and the app is half-converted for weeks | Medium | Each phase is independently shippable; a section may sit in the old look without breaking |

**Rollback:** every phase is its own commit range on `main`. A phase reverts cleanly because P0
made the system addressable — a token revert restores the old palette in one file. Do **not**
build a feature flag for this (no live clients; `MOBILE-REVAMP-PLAN.md` §1 settled it).

**Push policy is unchanged** — the green-light checklist in root `CLAUDE.md` §2b applies to every
commit in this plan.

---

## 14. Definition of done

The rebuild is complete when all of the following are true and **verified, not believed**:

- [ ] `grep -rE '#[0-9a-fA-F]{6}' src/routes src/components --include='*.tsx'` → zero
- [ ] No text below 13px on mobile except `--t-label`; no `font-weight: 300` in the stylesheet
- [ ] Every interactive target ≥ 44×44 (or `.hit-area-44`, one per adjacent pair)
- [ ] Zero horizontal content scroll at 375px on every non-console route
- [ ] Every `Dialog` below `md` is an `AppSheet`; Android back closes each one
- [ ] Every list has swipe actions, a skeleton matching its row height, and a verb in its empty state
- [ ] All three detail screens follow §7.2; nothing destructive in the thumb arc
- [ ] All 67 framer-motion files respect `prefers-reduced-motion`
- [ ] ≤ 2 `backdrop-filter` layers on a phone; ≥ 55 fps scrolling under 6× CPU throttle
- [ ] `tsc` 0 · `npm run test` green · `npm run test:isolation` green · `ship.sh` green
- [ ] Owner has reviewed `/dev/mobile` and the six screenshot pairs and signed off
- [ ] `Files/WORKLOG.md` entry per phase; this file updated with what actually shipped

---

## Appendix A — Token quick reference

| Purpose | Token | Value |
|---|---|---|
| Interactive accent | `--st-primary` | `#1877F2` |
| Tinted fill | `--st-primary-soft` | `#edf2f9` |
| Cerebyl brand (identity only) | `--st-brand` | `#008FE0` |
| Page background | `--st-background` | `#f8f9ff` |
| Card surface | `--st-surface` | `rgba(255,255,255,.80)` |
| Primary text | `--st-on-surface` | `#191b22` |
| Secondary text (4.5:1 floor) | `--st-on-surface-variant` | `#434653` |
| Body text | `--t-body` | 16/22 · 400 (15/21 ≥ md) |
| Entity name | `--t-headline` | 17/22 · 600 |
| Money | `--t-num` | ≥15px · 500 · tabular |
| Screen gutter | `--screen-margin` | 16px |
| Row minimum | `--row-height-min` | 56px |
| Tab bar | `--tabbar-height` | 56px + `pb-safe` |
| Scroll padding above tab bar | `--thumb-safe` | 96px |

## Appendix B — Migration map (old → new)

| Today | Becomes |
|---|---|
| `text-[#1877F2]` / `bg-[#1877F2]` | `text-[color:var(--st-primary)]` / `bg-[color:var(--st-primary)]` |
| `bg-[#edf2f9]` | `bg-[color:var(--st-primary-soft)]` |
| `text-xs` on content | `--t-meta` (13px) or `--t-body` (16px) — never 12px for data |
| `text-[10px]` / `text-[11px]` | `--t-label`, uppercase, labels only |
| `h-8.5` control | `h-11` (44px) on mobile, `h-9` ≥ md — or keep size + `.hit-area-44` |
| `.t-body-md` (13/300) | `--t-body` (16/400) |
| `Dialog` | `AppSheet` (auto-switches at `md`) |
| bespoke card markup in a list | `EntityRow` |
| toolbar pill row on mobile | `FilterSheet` |
| `<table>` on mobile | `EntityRow` list; table stays `hidden md:block` |
| inline `transition={{...}}` | a `SPRING.*` preset from `motion-flow.ts` |
| `.app-density { zoom: .8 }` | responsive type + `--card-padding` |
| 3 blurred blobs | static radial gradient `< md` |

## Appendix C — Do not break (verified live; each has cost a session before)

1. **Brand:** "Enthrella" / "Acrowell" must never appear in user-facing UI. Console is
   "Cerebyl Operations".
2. **Leads by Source is a bar chart. Never a pie.**
3. **Default sort alphabetical everywhere**, except Leads = `date_received` desc.
4. **Reassigning a party's rep = managers/admins only. Reps see only their own data** (RLS).
5. `?party=` filters only; `?new=1` opens the order form — Ceremate depends on both.
6. **Every legacy URL keeps redirecting** — deep links are shared over WhatsApp.
7. **Portal (`portal.*`) and Console (`console.*`) are out of scope.** Party users have no
   `profiles` row; that is the isolation guarantee.
8. **Ceremate's message bubbles and `kind` switch** stay as they are (chart-block parser).
9. **`src/` must never import an `@capacitor/*` package** — use `src/lib/capacitor.ts`.
10. **Every paged query keeps `.order("id", {ascending:true})` last** (`fetch-all.ts` invariant).
11. **Never wire `src/lib/lovable-error-reporting.ts`** — it posts to a dead global.
12. Pack attributes, touch-target work, the trash/purge system, and the distributor portal are
    **shipped** — audit before "building" anything that looks like them.

## Appendix D — Decisions the owner must make before P0

**D-1. Which blue is `--st-primary`?**
`#1877F2` (recommended — matches all 570 live call sites, zero visual change, the reference
shifts imperceptibly) or `#2589f5` (the reference stays exact, 570 live call sites change).

**D-2. Body text 16px on mobile.** This is a real density change: fewer rows per screen, by
design. Confirm on `/dev/mobile` before P4 rolls it across every list.

**D-3. Swipe verbs.** Proposed: leads → Call / Log follow-up · parties → Call / WhatsApp ·
orders → Share invoice / Record payment. These should be the two things the owner's reps actually
do most, so they are his call, not ours.

**D-4. Desktop density after `zoom: 0.8` is deleted.** Desktop will look slightly larger. Confirm
that is wanted, or specify a compensating scale.

---

*End of document. Update this file with what actually shipped after each phase, and log each
phase in `Files/WORKLOG.md` (root `CLAUDE.md` §1a).*
