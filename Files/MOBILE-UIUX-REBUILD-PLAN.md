# Cerebyl Mobile UI/UX Rebuild — Developer Implementation Plan

**Version 1.1 · 1 September 2026**
**Audience:** the developer implementing this. You do not need to know UI/UX theory. Every decision has already been made for you. Follow the tickets in order.
**Changed in 1.1 (read if you saw 1.0):** the plan previously told you to delete a `font-weight: 300`
rule and prescribed `font-semibold` / `font-bold` in several tickets. **Both were wrong** — the thin
weights are the design. Those instructions are corrected throughout, Law 3 is rewritten, and a
running preview at `/dev/mobile` has been added as the visual target.

**Scope:** the **mobile** experience of both apps — the staff/company app (`/dashboard`, `/leads`, `/clients`, `/orders`, `/products`, `/team`, `/analytics`) and the distributor portal (`/portal/*`).

---

## 0. READ THIS ENTIRE SECTION BEFORE YOU TOUCH ANY FILE

### 0.1 What this project is

Cerebyl is a multi-company CRM for a **PCD pharma franchise** business. Two different kinds of humans use it on a phone:

| App | Who uses it | Where the code lives | Shell file |
|---|---|---|---|
| **Staff app** | The pharma company's own reps, managers, admins | `src/routes/` (everything **except** `portal.*`) | `src/components/app-shell.tsx` |
| **Distributor portal** | The company's *customers* (distributors/stockists) | `src/routes/portal.*.tsx` | `src/routes/portal.tsx` |

They are two separate shells with two separate bottom navigation bars. **A change to one does not affect the other.** Every ticket below tells you which app it targets. If a ticket says BOTH, you make the same change twice, in two files.

### 0.2 The single rule you must never break

> **DO NOT CHANGE ANY COLOUR. DO NOT CHANGE ANY FONT FAMILY. DO NOT CHANGE THE VISUAL STYLE.**

The colour palette, the brand blue (`#1877F2` / `--st-primary`), the glass surfaces, the soft neumorphic shadows, the rounded pill buttons, the Inter font — **all of that is approved and finished.** The owner likes it. It is not what is wrong.

What is wrong is **size, spacing, density, ergonomics, state feedback, and screen structure.** That is the entire scope of this document.

Concretely, you may change:
- heights, widths, padding, margins, gaps
- font **sizes** and line-heights (never the font family)
- which element is sticky/fixed vs. scrolling
- the order and grouping of elements on a screen
- what happens on tap/press/focus/loading/empty/error
- icon sizes and stroke weights

You may **not** change:
- any hex value, any `--st-*` token value, any `oklch()` value
- `font-family` anywhere
- **font WEIGHTS** — see the boxed rule below; this is the one that has already been got wrong once
- the shadow recipes (`sh-sm`, `sh-md`, `sh-lg`, `neu-lift`, `.pill`, `.btn-ss4`) — and in
  particular the `inset 0 1px 1.5px rgba(255,255,255,.95)` top highlight inside them, which is
  the signature of the whole neumorphic look. A plain `ring-1 ring-black/5` is NOT a substitute.
- the depressed inset tag system (`.tag-depressed*`, `.chip`) — `inset 0 1.5px 3px rgba(0,0,0,.06)`,
  no border, ever
- the three button recipes: solid blue elevated pill (`.btn-ss3` / `.pill`), soft tinted pill
  (`.btn-ss5`), elevated white circle (`.btn-ss4` / `.neu-icon`)
- the border radii scale
- which colour means what (hot = red, dues = red, paid = green, primary = blue)

> ### ⚠️ THE THIN TYPE IS THE DESIGN. DO NOT MAKE TEXT BOLD.
>
> This app's elegance comes from **light font weights plus colour transparency**, not from
> weight contrast. The existing scale is `.t-body-md` 300 · `.t-body-sm` 300 · `.t-data` 350 ·
> `.t-head-sm` 450 · `.t-label` 500. Secondary text is not solid grey — it is the muted token
> **mixed toward transparent** (`color-mix(in srgb, var(--st-on-surface-variant) 72%, transparent)`).
>
> **When this plan tells you to make something more prominent, that means make it BIGGER, never
> heavier.** A price goes from 15px to 30px and stays at weight 550. A card title goes to 16px
> and stays at weight 450. If you find yourself typing `font-bold` or `font-semibold` on a
> mobile screen, stop — you are undoing the design.
>
> A first attempt at these screens replaced the thin weights with semibold and bold throughout
> and it read as a completely different, cheaper app. That is why this box exists.

If a ticket ever seems to require a colour change, **stop and ask.** It does not.

### 0.3 Where the rules come from

These changes come from an analysis of 8 professional UI/UX masterclasses the owner selected out of 30+. You do not need to watch them. Every rule that matters has been extracted, converted into a decision, and written into this document as a ticket. The source modules are referenced like `[M6]` so you can trace a rule back if you want to:

- **[M1]** E-commerce product page — 15 flaws + 3 upgrades
- **[M2]** Behavioural psychology — defaults, goal gradient, loss aversion, anchoring
- **[M3]** Conversion A/B testing — transparency, single price, immersion
- **[M4]** Lifecycle states, zero-state search, order tracking, input types
- **[M5]** Ergonomics, fintech transfer UX, interaction cost
- **[M6]** Bottom navigation bar architecture
- **[M7]** Mobile vs. desktop constraints, single-axis rule, bottom sheets
- **[M8]** Foundational dictionary — 4pt grid, typography, 6-state matrix

### 0.4 Look at the target before you start

There is a **running preview of the finished result** in the repo:

```bash
npm run dev
```

Then open **`http://localhost:8080/dev/mobile`**.

It shows four screens — product page, catalogue, leads list, order tracking — exactly as they
should look when this plan is done, in a 375×812 phone frame, with a panel naming the tickets each
one demonstrates. It is unauthenticated and driven by mock data, so it needs no login and touches
nothing live. The source is `src/routes/dev.mobile.tsx`.

**Spend ten minutes in it before you write a line of code.** Reading a spec gives you the rules;
looking at the preview tells you what "done" feels like. In particular, notice what the preview
does *not* do: it does not bolden anything, it does not flatten the shadows, and it does not
replace the depressed tags with bordered ones.

That file also contains, in its `PREVIEW_CSS` block, the exact utilities Ticket F3 adds to
`styles.css`. If you are unsure what a ticket means, find the equivalent in the preview.

### 0.5 How to work

1. Work **one ticket at a time, in the order given.** The phases are dependency-ordered. Phase 1 changes things that Phase 2 onward assume are already true.
2. After **every** ticket, run the gate (Section 11.1) and check the screen on a real phone-sized viewport.
3. **Never commit more than one ticket per commit.** Commit message: `ui: <ticket id> <short description>`.
4. **Do not push.** Commit locally and report. The lead pushes.
5. If a ticket's file has moved or the line numbers do not match, **the line numbers are a hint, not a contract** — search for the quoted code snippet instead. Line numbers in this document were correct on 1 Sep 2026.
6. If you genuinely cannot do a ticket as written, **stop and say so with the reason.** Do not improvise a different design.

### 0.6 The one thing that will trip you up

Several global CSS rules in `src/styles.css` use `!important` and will silently override any font-size you set on a component. **Ticket F2 removes them.** Until F2 is done, do not be surprised when a local font-size change appears to do nothing. Do F2 early — it is in Phase 1 for this reason.

---

## 1. DIAGNOSIS — why the app "feels messy and clumsy"

This was measured against the actual code, not guessed. The owner's instinct is correct, and the cause is not the visual style. It is three things.

### 1.1 Every interactive control in the app is too small

`src/components/ui/button.tsx` is the single component behind nearly every button in both apps. Its size definitions (lines 38–44):

| Size | Height in code | Actual pixels | Required minimum |
|---|---|---|---|
| `default` | `h-8.5` | **34px** | 44px |
| `sm` | `h-7.5` | **30px** | 44px |
| `lg` | `h-9.5` | **38px** | 44px |
| `icon` | `h-8.5 w-8.5` | **34 × 34px** | 44 × 44px |

Its base label size (line 8) is `text-xs` = **12px**; `size="sm"` drops it to **11px**.

**Not one button size in the app meets the 44 × 44px minimum** that both Apple's HIG and Android's Material guidelines require, and that `Files/design/design-system.md` §2 already documents as the standard for this project. [M6, M8]

A separate scan found **291 hard-coded square icon controls** at `h-7/h-8/h-9` across `src/routes/` and `src/components/`. Only **20** of them carry the `hit-area-44` helper that exists precisely to fix this. So roughly **93% of small controls in the app are under-sized.**

This is the number-one cause of "clumsy". Taps miss. Adjacent buttons get hit by accident. On a phone, that reads as the app being unreliable, and no amount of visual polish compensates.

### 1.2 Global `!important` rules force tiny text app-wide

`src/styles.css` lines 855–899 contain blanket overrides:

| Line | Rule | Effect |
|---|---|---|
| 857 | `input::placeholder { font-size: 11px !important }` | Every placeholder in both apps is 11px |
| 869 | `.form-hint, [data-slot="description"] { font-size: 11px !important }` | Every helper text is 11px |
| 889 | `select, [role="combobox"], [role="option"], [data-slot="select-item"], [cmdk-item] … { font-size: 12px !important }` | **Every dropdown, select, combobox, command-palette row and menu item in the app is 12px** |
| 897 | `[data-slot="select-label"], [cmdk-group-heading] { font-size: 10.5px !important }` | Every group heading is 10.5px |

Apple's published minimum legible size is 11pt, and its **default** body size is 17pt. iOS ships 17px body text and macOS ships 13px — mobile text is *larger* than desktop, not smaller, because of viewing distance and touch [M7]. This app has inverted that rule globally, with `!important`, so it cannot be fixed locally.

### 1.3 Density: ~380 sub-13px type usages in three screens

Measured counts of tiny type classes:

| File | `text-[10px]` | `text-[11px]` | `text-xs` (12px) | Total sub-13px |
|---|---|---|---|---|
| `src/routes/orders.all.tsx` | 35 | 12 | 147 | **194** |
| `src/routes/products.all.tsx` | 40 | 5 | 87 | **132** |
| `src/routes/leads.all.tsx` | 36 | 9 | 62 | **107** |
| `src/routes/dashboard.tsx` | 5 | 11 | 11 | 27 |
| `src/routes/parties.$id.tsx` | 5 | 0 | 20 | 25 |
| `src/routes/leads.$id.tsx` | 1 | 2 | 16 | 19 |

Nothing on these screens is *wrong*. There is simply too much of it, too small, all competing. Increasing type size is not cosmetic — **it forces fewer things per screen, which is the actual goal.**

### 1.4 Secondary findings

| Finding | Measured | Rule violated |
|---|---|---|
| Multi-column grids with no responsive breakpoint | **60 occurrences** | Single-axis rule [M7] — mobile permits one direction per section |
| Bottom-nav active state | colour + stroke-weight only | Dual-state rule [M6] — needs icon **fill geometry** change too |
| Bottom-nav icon size | 20px (`h-5 w-5`) | 24px required [M6] |
| Notification badges | no background-matching ring | 1.5px ring required [M6] to stop visual bleed |
| Product page action area | scrolls away with the page | Sticky bottom action dock required [M1] |
| Explicit empty states | ~23 of 121 route files | Every list needs a designed zero-state [M4, M7] |
| Bottom sheets vs. full modals | 6 bottom sheets vs. 88 dialogs | Sub-tasks belong in bottom sheets on mobile [M7] |

### 1.5 What is already right — do not "fix" these

Give credit where it is due; these are done and must not be touched:

- The `.stitch` token system, glass layers, and neumorphic shadow recipes — approved design language.
- `hit-area-44` in `styles.css` — the correct mechanism already exists; it is just barely used.
- `use-motion-safe.ts` and `motion-flow.ts` — `prefers-reduced-motion` handling is already correct. **Always use these; never hand-roll a framer-motion transition.**
- `pt-safe` / `pb-safe` utilities — safe-area handling exists and is applied on both bottom bars.
- `QuantityPicker` already has quick-quantity chips — [M1]'s "preset chips" upgrade is **partly done**.
- `GlobalSearch` already shows "Recently viewed" on focus — [M4]'s zero-state search is **partly done**.
- Both bottom bars already have 5 items (4 + More), within the 3–5 limit [M6].
- The iOS type scale tokens (`text-ios-*`) already exist in `styles.css:72-93`. **Use them. Do not invent new sizes.**

---

## 2. THE TWELVE LAWS — memorise these, they apply to every ticket

These are the standing rules. When a ticket is ambiguous, resolve it with these. When you build anything new that is not in this document, obey these.

**Law 1 — 44 × 44px minimum, always.** Every tappable thing — button, icon, chip, list row, tab, checkbox, close X — must have a touch area of at least 44 × 44 CSS pixels. If the *visible* control must stay smaller for design reasons, keep the visible size and add the `hit-area-44` class, which expands only the invisible hit region. [M6, M8]

**Law 2 — Adjacent hit areas must not overlap.** `hit-area-44` uses `inset: -8px`. Two icon buttons sitting 4px apart will have overlapping invisible areas, and the later element in the DOM wins — which *kills* part of the first button. **Where two icon buttons are adjacent, either space them at least 16px apart, or apply `hit-area-44` to only one of them.** This is a real bug that has already happened in this repo. Never "finish the job" by adding the class to both.

**Law 3 — Raise the SIZE, never the WEIGHT.** 13px is the absolute floor on mobile; 14–16px is
the target for anything a human reads as a sentence. Never use `text-[10px]` or `text-[11px]` on
any mobile surface; `text-xs` (12px) is permitted only inside dense data tables on desktop-width
viewports. **But every size increase keeps the existing thin weight** — 300 for body and secondary,
350–400 for data and numbers, 450 for headings and card titles, 500 for labels, tags and active
states, 550 for the one large figure on a screen. Thin type at 14px is legible and elegant; thin
type at 10px is not, which is why the sizes move and the weights do not. Secondary text also keeps
its transparency rather than becoming solid grey. [M7, M8]

**Law 4 — Single axis per section.** A block of content on a phone either stacks vertically in one column, or scrolls horizontally as a carousel. **Never both.** Any `grid-cols-2` or higher without an `md:` prefix is a bug. The fix is either `grid-cols-1 md:grid-cols-2`, or convert to a horizontal scroller. [M7]

**Law 5 — Never nest a card inside a card.** Padding inside padding destroys the readable width on a 375px screen. If you need grouping inside a card, use a hairline divider (`.card-divider`) and spacing, not a second bordered/shadowed surface. [M7]

**Law 6 — 4/8pt spacing grid.** Every margin, padding and gap must be a multiple of 4, and preferably of 8: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48`. Screen side margin is **16px**. Section gap is **24px**. No `p-[13px]`, no `gap-[7px]`. [M8]

**Law 7 — Every interactive element must define all six states.** Default, Hover, Focus, Pressed, Loading, Disabled/Error. A button with no pressed state and no loading state feels broken even when it works. Section 3.3 gives the exact spec. [M8]

**Law 8 — The primary action never scrolls away.** On any screen whose purpose is a single decision (add to cart, send request, record payment, save), the action sits in a **sticky bottom dock** above the tab bar, and the dock shows the number the user is committing to. [M1]

**Law 9 — Never show a blank screen.** Every list, search, and filter result needs a designed state for: loading (skeleton), empty-because-new (what to do next + the action), empty-because-filtered (what to clear), and error (plain-English message + retry). Four states, not one. [M4, M7]

**Law 10 — Show the total inside the button.** Any CTA that commits money or quantity states it: `Add to cart · ₹1,240`, `Send request · 12 items`, `Record payment · ₹50,000`. Never a bare `Submit`. [M1, M3]

**Law 11 — Sub-tasks open in a bottom sheet, not a new page.** Picking a filter, choosing a rep, selecting a template, adjusting a quantity — these are bottom sheets that keep the underlying screen visible. Full page navigation is for changing *what you are looking at*, not for a decision about what is already on screen. [M7]

**Law 12 — Recognition over recall.** Show avatars, logos, photos and names next to raw identifiers (account numbers, product codes, party IDs). Offer preset chips instead of empty text fields wherever the set of likely answers is known. Every field the user does not have to type is a field they cannot get wrong. [M5]

---

## 3. PHASE 1 — FOUNDATIONS

These five tickets are global. They are the highest-leverage work in the document and everything after them assumes they are done. **Do these first, in this order.**

---

### ✅ TICKET F1 — Make every button meet 44px

**App:** BOTH · **File:** `src/components/ui/button.tsx` · **Risk:** high ripple, low complexity

This is the single most impactful change in the plan. One file, and every button in both apps becomes usable.

**What is wrong:** sizes are 30–38px tall with 11–12px labels (see §1.1).

**What to do.** Replace the `size` block (currently lines 38–44) with the following. Note carefully: the *visible* pill does not have to grow to 44px in every case — for `sm` and `icon` we keep the visible size and add an invisible hit area, because growing every small pill would blow up dense toolbars. `default` and `lg` do grow, because those are real action buttons.

Replace this:

```tsx
      size: {
        default: "h-8.5 px-3.5 py-1.5",
        sm: "h-7.5 px-2.5 text-[11px]",
        lg: "h-9.5 px-5 text-xs font-medium",
        // SS4: Circular Icon size
        icon: "h-8.5 w-8.5 rounded-full p-0 bg-white text-[#1877F2] shadow-[0_3px_10px_-1px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:shadow-md active:scale-95",
      },
```

With this:

```tsx
      size: {
        // 44px real height on touch, 36px on pointer-precise viewports where a
        // mouse makes the extra height pure wasted density. Label 14px so the
        // control is legible without dominating a dense toolbar.
        default: "h-11 md:h-9 px-4 py-2 text-sm",
        // Stays visibly small (32px) for dense toolbars, but hit-area-44
        // expands the INVISIBLE touch region to 48px. Label lifted 11px -> 13px
        // (Law 3: 13px is the floor).
        sm: "hit-area-44 h-8 px-3 text-[13px]",
        // The primary-action size. Full 48px, 15px label.
        lg: "h-12 md:h-10 px-6 text-[15px] font-medium",
        // Visible circle stays 36px so toolbars keep their proportions; the
        // hit area becomes 52px. See Law 2 before putting two of these side by
        // side.
        icon: "hit-area-44 h-9 w-9 rounded-full p-0 bg-white text-[#1877F2] shadow-[0_3px_10px_-1px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:shadow-md active:scale-95",
      },
```

**Also** change the base class on line 8. Find `whitespace-nowrap rounded-full text-xs font-medium` and change `text-xs` to `text-sm`. Leave the rest of that long string exactly as it is.

**Also** on line 8, find `[&_svg]:size-3.5` and change it to `[&_svg]:size-4`. Icons inside buttons go from 14px to 16px.

**Why the `md:` variants:** the app has a desktop mode with `zoom: 0.8` applied (`styles.css:801-806`). Forcing 44px everywhere on desktop would make the CRM tables absurdly tall. Touch height on phone, compact on desktop — this is standard and correct.

**Acceptance criteria:**
1. `npx tsc --noEmit` reports 0 errors.
2. `npm run build` succeeds.
3. On a 375px-wide viewport, every `<Button>` measures ≥ 44px in the *pointer* dimension. Verify with browser devtools: inspect any button, and the highlighted box (including the `::after` pseudo-element for `sm`/`icon`) must be ≥ 44px tall.
4. Open `/leads`, `/orders`, `/products`, `/portal/catalogue`, `/portal/cart` at 375px. **No button may overflow its container, wrap to two lines, or overlap a neighbour.** If a toolbar now overflows, fix it by making that toolbar horizontally scrollable (`flex overflow-x-auto no-scrollbar -mx-4 px-4`), **not** by shrinking the button back.
5. Screenshot each of those 5 screens before and after, and attach both to the ticket.

**Expected fallout:** some dense toolbars will get tighter. That is expected and is handled in later tickets. Do not undo F1 to fix a layout — fix the layout.

---

### ✅ TICKET F2 — Delete the global `!important` type-shrinkers

**App:** BOTH · **File:** `src/styles.css` (lines ~848–899) · **Risk:** medium, wide visual effect

**What is wrong:** four blanket `!important` rules force 10.5–12px text on every placeholder, hint, dropdown, select, combobox, command-palette row and menu item in both apps (see §1.2). They cannot be overridden locally, so every later ticket in this document would silently fail while these exist.

**What to do.** Find this block (it starts near line 848 with the comment `App-Wide Cloudy, Light, Compact Placeholders & Input Suggestions`) and replace the whole run of four rules with the version below. Keep the comments — they explain the intent to the next person. Colours are unchanged; only sizes and the `!important` flags change.

```css
/* -------------------------------------------------------------------------- */
/* App-Wide Placeholders & Input Hints                                        */
/*                                                                            */
/* These were 10.5-12px !important until 1 Sep 2026. That put every            */
/* placeholder, dropdown row and helper line below the 13px mobile legibility  */
/* floor AND made it unfixable at the component level. Sizes raised to the     */
/* floor; !important removed so components can opt up where they need to.      */
/* Colour and weight are unchanged.                                           */
/* -------------------------------------------------------------------------- */
input::placeholder,
textarea::placeholder,
.stitch input::placeholder,
.stitch textarea::placeholder {
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.01em;
  color: color-mix(in srgb, var(--st-on-surface-variant, #64748b) 55%, transparent);
  opacity: 0.9;
}

.form-description,
.form-hint,
.field-hint,
[data-slot="description"] {
  font-size: 13px;
  line-height: 18px;
  font-weight: 350;
  color: color-mix(in srgb, var(--st-on-surface-variant, #64748b) 80%, transparent);
}

/* -------------------------------------------------------------------------- */
/* App-Wide Dropdown, Select, Combobox & Menu Typography                      */
/*                                                                            */
/* Menu rows are TAPPED, so they are governed by Law 1 as well as Law 3: 15px  */
/* label, 44px minimum row height. min-height here rather than padding so a    */
/* two-line row still grows correctly.                                        */
/* -------------------------------------------------------------------------- */
select,
[role="combobox"],
[role="menuitem"],
[role="menuitemcheckbox"],
[role="menuitemradio"],
[role="option"],
[data-slot="select-trigger"],
[data-slot="select-item"],
[data-slot="select-content"],
[data-slot="dropdown-menu-item"],
[cmdk-item],
[cmdk-input] {
  font-size: 15px;
  font-weight: 400;
  letter-spacing: -0.01em;
}

[role="menuitem"],
[role="menuitemcheckbox"],
[role="menuitemradio"],
[role="option"],
[data-slot="select-item"],
[data-slot="dropdown-menu-item"],
[cmdk-item] {
  min-height: 44px;
}

[data-slot="select-trigger"],
[role="combobox"] {
  min-height: 44px;
}

[data-slot="select-label"],
[data-slot="dropdown-menu-label"],
[cmdk-group-heading] {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
```

**Do NOT touch this rule.** An earlier draft of this plan told you to delete its `font-weight: 300`.
That instruction was wrong and has been removed — the thin weight is the design (see the boxed rule
in §0.2). Leave it exactly as it is:

```css
.text-muted-foreground {
  font-weight: 300;          /* KEEP. This is the design language, not a bug. */
  letter-spacing: -0.01em;
}
```

The legibility concern that motivated the original instruction is real, but the correct fix is the
one this ticket already makes — **raising the sizes** off the 10–12px floor — not thickening the
strokes. 300-weight at 14px reads cleanly; 300-weight at 10px does not.

**Acceptance criteria:**
1. `grep -c '!important' src/styles.css` returns a number **at least 5 lower** than before your change. (Some `!important` rules elsewhere in the file are legitimate — the toast positioning and the `.tag-depressed` system. Leave those alone.)
2. Open a `<Select>` and a `<Combobox>` on `/leads` at 375px. Every row is ≥ 44px tall and the label is clearly readable.
3. Open the global search (magnifier in the header). Rows are ≥ 44px and 15px.
4. No dropdown's popover now overflows the screen. If one does, add `max-h-[60vh] overflow-y-auto` to that popover's content, do not shrink the rows.

---

### ✅ TICKET F3 — Add the missing foundation utilities

**App:** BOTH · **File:** `src/styles.css` · **Risk:** none (purely additive)

You will need these in almost every later ticket. Add them **once**, here, so nobody hand-rolls them five times.

Append this block to the end of `src/styles.css`:

```css
/* ==========================================================================
   MOBILE UI/UX REBUILD — shared primitives (added 1 Sep 2026)
   See Files/MOBILE-UIUX-REBUILD-PLAN.md. Structural only: no new colours,
   every value reuses an existing token.
   ========================================================================== */

/* --- Sticky bottom action dock (Law 8) -----------------------------------
   The persistent CTA surface on decision screens. Sits ABOVE the bottom tab
   bar, which is why the bottom padding stacks the tab-bar height on top of
   the safe-area inset. --app-tabbar-h is the measured height of the phone
   tab bar in both shells; change it there and everything follows.          */
:root {
  --app-tabbar-h: 64px;
}

.action-dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 35; /* above content (0-30), below the More sheet overlay (40) */
  padding: 12px 16px;
  padding-bottom: calc(12px + var(--app-tabbar-h) + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.92);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.04);
}

/* Put this on the SCROLLING container of any screen that has an .action-dock,
   so the last row can always be scrolled clear of the dock. */
.has-action-dock {
  padding-bottom: calc(96px + var(--app-tabbar-h) + env(safe-area-inset-bottom));
}

/* --- Tab bar badge ring (M6) ---------------------------------------------
   A notification badge overlapping an icon needs a ring in the BAR's colour
   so the two shapes read as separate. Without it the badge visually bleeds
   into the icon. */
.tab-badge {
  box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.95);
}

/* --- Section rhythm (Law 6) ---------------------------------------------
   One class for "this is a section of a mobile screen". Stops every screen
   inventing its own vertical rhythm. */
.screen-section {
  margin-top: 24px;
}
.screen-section:first-child {
  margin-top: 0;
}

/* --- Horizontal scroller (Law 4) ----------------------------------------
   The ONLY sanctioned way to show more than one column of anything on a
   phone. Bleeds to the screen edge so the row reads as scrollable.        */
.h-scroller {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.h-scroller::-webkit-scrollbar {
  display: none;
}
.h-scroller > * {
  scroll-snap-align: start;
  flex: 0 0 auto;
}

/* --- 6-state matrix: focus ring (Law 7, state 3) -------------------------
   2px high-contrast ring, offset so it never sits on top of the control's
   own border. Uses the existing brand token — no new colour. */
.focus-ring-2:focus-visible {
  outline: 2px solid var(--st-primary, #1877F2);
  outline-offset: 2px;
}

/* --- 6-state matrix: pressed (Law 7, state 4) ---------------------------- */
.pressable {
  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1);
}
.pressable:active {
  transform: scale(0.96);
}

/* --- Large-title kerning (M8) -------------------------------------------
   -2% tracking + tight leading on display headings. Applies only where the
   class is set; it is not a global type change. */
.title-display {
  letter-spacing: -0.02em;
  line-height: 1.15;
}

@media (prefers-reduced-motion: reduce) {
  .pressable {
    transition: none;
  }
  .pressable:active {
    transform: none;
  }
  .h-scroller {
    scroll-snap-type: none;
  }
}
```

**Acceptance criteria:**
1. `npm run build` succeeds.
2. No visual change anywhere yet — this ticket adds classes but applies none. Load `/dashboard` and `/portal` and confirm they look identical to before.

---

### ✅ TICKET F4 — The 6-state matrix on inputs

**App:** BOTH · **Files:** `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/select.tsx` · **Risk:** low

**What is wrong:** inputs are ~34–36px tall with no consistent focus ring and no error state, so a user tapping into a field on a phone gets almost no feedback that anything happened. [M8]

**What to do.** In each of the three files, find the base class string on the root element and make these three changes. **Do not change colours.**

1. Height → `h-11` (44px) on touch, `md:h-9` on desktop. If the file currently has `h-9` or `h-10`, replace it with `h-11 md:h-9`.
2. Font size → `text-[15px]`. If it currently has `text-xs` or `text-sm`, replace it.
3. Focus → ensure the string contains `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]/40 focus-visible:border-[#1877F2]`. If a `focus-visible:ring-*` already exists, leave the existing colour and just make sure the ring is `ring-2`, not `ring-1`.
4. Error → add `aria-invalid:border-rose-500 aria-invalid:ring-2 aria-invalid:ring-rose-500/25` to the base string.

For `textarea.tsx`, use `min-h-[88px]` instead of a fixed height.

**Acceptance criteria:**
1. `npx tsc --noEmit` → 0 errors.
2. Tap any text field on `/portal/pay` at 375px: the field is ≥ 44px tall, the caret is visible without zooming, and a clear 2px ring appears on focus.
3. Set `aria-invalid="true"` on any input in devtools — it turns to the rose error treatment.
4. **iOS zoom check (important):** on iOS Safari/WebView, an input with a font-size below 16px causes the browser to auto-zoom the whole page on focus. Your fields are now 15px. Confirm the app's viewport meta tag contains `maximum-scale=1` — check `src/routes/__root.tsx`. If it does not, **do not add it** (it harms accessibility); instead raise the input font size to `text-base` (16px) and report that you did.

---

### ✅ TICKET F5 — A shared mobile empty-state component

**App:** BOTH · **File:** create `src/components/mobile-empty-state.tsx` · **Risk:** none (new file)

**What is wrong:** only ~23 of 121 route files have any explicit empty state, and the ones that exist are ad-hoc one-liners of grey text. A blank screen with one grey sentence tells the user nothing about what to do. [M4, M7]

**What to do.** Create this file exactly:

```tsx
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one empty/zero state for mobile screens. Every list, search result and
 * filtered view uses this — never a bare line of grey text.
 *
 * Four distinct situations, and they are NOT the same message:
 *  - variant="empty"    nothing exists yet -> tell them how to create the first one
 *  - variant="filtered" data exists but the filter hides it -> offer to clear it
 *  - variant="search"   a query returned nothing -> echo the query, offer reset
 *  - variant="error"    something broke -> plain English + retry
 *
 * Colours come from existing tokens only. No new palette.
 */
export function MobileEmptyState({
  icon: Icon,
  title,
  body,
  action,
  variant = "empty",
  className,
}: {
  icon: LucideIcon;
  /** One short sentence. Say what IS true, not what is missing. */
  title: string;
  /** One or two lines telling them the single next thing to do. */
  body?: string;
  /** The primary action. Omit only when there genuinely isn't one. */
  action?: ReactNode;
  variant?: "empty" | "filtered" | "search" | "error";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-14 text-center",
        className,
      )}
      role={variant === "error" ? "alert" : undefined}
    >
      <div
        className={cn(
          "mb-4 grid h-14 w-14 place-items-center rounded-2xl",
          variant === "error"
            ? "bg-rose-50 text-rose-500"
            : "bg-[#edf2f9] text-[#1877F2]",
        )}
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <p className="text-[17px] font-[450] leading-snug text-[color:var(--st-on-surface)]">
        {title}
      </p>
      {body && (
        <p
          className="mt-1.5 max-w-[280px] text-[15px] font-[300] leading-relaxed"
          style={{
            color:
              "color-mix(in srgb, var(--st-on-surface-variant) 80%, transparent)",
          }}
        >
          {body}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
```

**Acceptance criteria:**
1. `npx tsc --noEmit` → 0 errors.
2. Not yet used anywhere — that is correct. Ticket S1 rolls it out.

---

## 4. PHASE 2 — NAVIGATION (the most-tapped region of the app)

The bottom bar is touched more than any other pixel in a mobile app. [M6] devotes 24 minutes to it alone. Both of our bars are structurally sound (5 items, safe-area aware) but fail on four specific points.

---

### ✅ TICKET N1 — Staff app bottom tab bar

**App:** STAFF · **File:** `src/components/app-shell.tsx` (lines ~490–545) · **Risk:** medium

**What is wrong** (measured against [M6]):

| # | Current | Required |
|---|---|---|
| 1 | Icons `h-5 w-5` = 20px | **24px** |
| 2 | Active state = colour + `stroke-[2.5]` | Colour **+ filled icon geometry** — two distinct visual changes |
| 3 | Badge has no ring, sits at `-right-2 -top-1` | 1.5px ring in the bar's background colour, positioned in the top-right quadrant of the icon |
| 4 | No press feedback, no sliding indicator | Micro-scale bounce on tap; the desktop bar already has a sliding thumb, the phone bar has nothing |
| 5 | Labels `text-[11px]` | 11px is inside the 10–12pt rule, so **this one is fine — leave it** |

**Why "filled icon geometry" matters:** relying on colour alone to signal the active tab fails for colour-blind users and washes out in sunlight. Two independent visual channels is the accessibility requirement, not a stylistic preference.

**What to do.**

**Step 1 — add the fill.** Lucide icons do not have separate filled variants, but they accept a `fill` prop. At the top of the tab `<Link>` render (around line 514), replace:

```tsx
<Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
```

with:

```tsx
<Icon
  className={cn("h-6 w-6 transition-all duration-200", active && "stroke-[2.4]")}
  // Dual-state rule: the active tab changes BOTH colour and icon geometry.
  // Colour alone is not an accessible active indicator.
  fill={active ? "currentColor" : "none"}
  fillOpacity={active ? 0.16 : 0}
/>
```

**Step 2 — ring the badge.** Replace the badge `className` at line ~517:

```tsx
className="absolute -right-2 -top-1 grid min-w-4 place-items-center rounded-full bg-[color:var(--st-primary)] px-1 text-[10px] font-semibold leading-4 text-[color:var(--st-on-primary)]"
```

with:

```tsx
className="tab-badge absolute -right-2.5 -top-1.5 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-[color:var(--st-primary)] px-1 text-[11px] font-semibold leading-[18px] text-[color:var(--st-on-primary)]"
```

(`tab-badge` is the ring class you added in F3.)

**Step 3 — press feedback and the sliding indicator.** Add `pressable` to the tab `className` string, and add a sliding active pill behind the content, matching the pattern the desktop bar already uses at line ~256. Inside the tab `<Link>`, as the **first** child, add:

```tsx
{active && (
  <motion.span
    layoutId="mobile-tab-thumb"
    transition={SLIDE}
    className="absolute inset-x-1 inset-y-0.5 -z-10 rounded-2xl bg-[color:var(--st-primary)]/10"
  />
)}
```

`SLIDE` and `motion` are already imported in this file — check the top of the file and confirm before adding. `layoutId` must be `"mobile-tab-thumb"` and must not collide with the desktop bar's `"nav-active"` or the sidebar's `navId`.

**Step 4 — the "More" button.** Apply the exact same treatment (24px icon, `pressable`) to the More button at lines ~530–542, but **do not** give it the `layoutId` thumb — it opens a sheet, it is not a destination.

**Step 5 — bar height.** The bar must clear the Android/iOS gesture bar. It already has `pb-safe`. Confirm the nav element at line ~492 keeps `pb-safe` and add `min-h-[64px]` to the inner flex row so `--app-tabbar-h: 64px` from F3 is accurate.

**Acceptance criteria:**
1. At 375px, tab icons measure 24 × 24px.
2. The active tab is distinguishable in a **greyscale screenshot** — take one and confirm. If you cannot tell which tab is active in greyscale, the fill did not apply.
3. Tapping a tab produces a visible scale-down bounce, and the tinted pill slides between tabs rather than jumping.
4. With `prefers-reduced-motion: reduce` set in devtools, the pill does **not** slide and the bounce does not happen — it should snap instantly. (`useMotionFlow` handles this; if it still animates you used a raw framer-motion transition instead of `SLIDE`.)
5. Force a pending count > 0 (temporarily hard-code `totalOrderPending = 5`) and confirm the badge has a visible white ring separating it from the icon. Undo the hard-code.
6. Each tab's tap area is ≥ 44px tall and the five tabs do not overlap.

---

### ✅ TICKET N2 — Distributor portal bottom tab bar

**App:** PORTAL · **File:** `src/routes/portal.tsx` (`BottomTab`, lines 131–155; nav at 287–305; skeleton at 80–88) · **Risk:** medium

**What is wrong:** the same four failures as N1, plus the skeleton at line 80–88 must be updated to match or the app will visibly jump on load.

**What to do.** Apply N1 Steps 1–5 to `BottomTab`, with these portal-specific differences:

1. The portal's badge uses `bg-destructive` (cart count / unread). **Keep that colour** — it is semantically correct. Only add the `tab-badge` ring class and resize to `min-h-[18px] min-w-[18px] text-[11px]`.
2. The portal bar is `sticky bottom-0`, not `fixed`. **Leave it sticky** — do not convert it. Its `grid grid-cols-5` is correct for exactly 5 fixed tabs (this is one of the few sanctioned exceptions to Law 4, because the tab bar is chrome, not content).
3. `layoutId` here must be `"portal-tab-thumb"`.
4. `BottomTab` currently uses TanStack Router's `activeProps` for the active style rather than a boolean. To get `active` as a value you can branch on, use the router's `useMatchRoute` or add `useRouterState` and compare pathnames — mirror how `app-shell.tsx` does it at line ~502. **Do not** try to read `activeProps` at runtime; it does not work that way.
5. Update `PortalShellSkeleton` (lines 80–88): icon skeleton `h-5 w-5` → `h-6 w-6`, and the row `min-h-14` → `min-h-16`, so the skeleton matches the real bar's new height.

**Acceptance criteria:** same six checks as N1, run on `/portal`, `/portal/catalogue`, `/portal/cart`, `/portal/orders`. Plus: reload `/portal` with a throttled connection and confirm the skeleton bar and the real bar are the same height (no jump).

---

### ✅ TICKET N3 — The "More" sheet becomes a bottom sheet on the staff app

**App:** STAFF · **File:** `src/components/app-shell.tsx` (lines ~546–570) · **Risk:** medium

**What is wrong:** tapping "More" in the bottom-right corner opens a panel that slides in from the **left edge** and fills the full screen height. The user's thumb is at the bottom-right; the content appears at the top-left. That mismatch between where you touched and where the thing appeared is disorienting, and the full-height panel is the desktop sidebar reused on a phone. [M7] is explicit: supplementary tasks belong in bottom sheets that keep context.

The portal already does this correctly (`portal.tsx:308`, `side="bottom"`). Make the staff app match.

**What to do.** Replace the `AnimatePresence` block that renders `renderSidebar("nav-active-mobile")` in a left-anchored `motion.div` with the app's existing `Sheet` primitive anchored to the bottom, listing the sections that are not in the tab bar.

```tsx
<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
  <SheetContent
    side="bottom"
    className="rounded-t-3xl border-t border-white/60 pb-safe md:hidden"
  >
    <SheetHeader className="pb-1">
      <SheetTitle className="text-[17px]">More</SheetTitle>
      <SheetDescription className="sr-only">
        Sections not shown in the bottom bar
      </SheetDescription>
    </SheetHeader>
    <div className="grid grid-cols-1 gap-1 pb-2">
      {visible
        .filter((n) => !BOTTOM_TAB_ORDER.includes(n.to))
        .map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="pressable focus-ring-2 flex min-h-[52px] items-center gap-3 rounded-2xl px-3 text-[15px] font-medium text-[color:var(--st-on-surface)] transition-colors hover:bg-[color:var(--st-surface-container-low)]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--st-surface-container-low)] text-[color:var(--st-primary)]">
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      <Link
        to="/settings"
        onClick={() => setMobileOpen(false)}
        className="pressable focus-ring-2 flex min-h-[52px] items-center gap-3 rounded-2xl px-3 text-[15px] font-medium text-[color:var(--st-on-surface)]"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--st-surface-container-low)] text-[color:var(--st-primary)]">
          <Settings className="h-5 w-5" />
        </span>
        Settings
      </Link>
    </div>
  </SheetContent>
</Sheet>
```

You must import `Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription` from `@/components/ui/sheet` at the top of `app-shell.tsx`.

**Important — do not delete `renderSidebar`.** It is still used for the desktop sidebar. Only the *mobile* consumer of it changes.

**Also:** gate Settings on `profile?.role === "admin" || profile?.role === "manager"`, exactly as the header button at line ~445 does. A rep must not see it.

**Acceptance criteria:**
1. Tapping More on a 375px viewport slides a panel **up from the bottom**; the page behind stays visible at the top.
2. Every row is ≥ 52px and 15px text.
3. Tabs already in the bottom bar (Dashboard, Leads, Clients, Orders) do **not** appear again in the sheet.
4. Log in as a rep (or temporarily stub `profile.role = "rep"`): Settings is absent, and any section the rep cannot access is absent. Undo the stub.
5. The desktop sidebar at ≥ 768px is completely unchanged. Screenshot to confirm.
6. Swiping the sheet down closes it.

---

### ✅ TICKET N4 — Mobile header: one line, one purpose

**App:** BOTH · **Files:** `src/components/app-shell.tsx` (header, lines ~438–466), `src/routes/portal.tsx` (header, lines ~232–283) · **Risk:** low

**What is wrong:** the staff mobile header packs six things into a 375px-wide strip: back button, logo, notification bell, settings gear, a Ceremate pill with text, and an account avatar. Several are 34px controls sitting a few pixels apart — which is a direct Law 2 violation (overlapping hit areas) as soon as F1 lands. It is also the densest, most cramped surface in the app.

**What to do.**

**Staff header:**
1. Remove the **Settings** gear from the header. It is now reachable from the More sheet (N3). One route in, not two.
2. Collapse the Ceremate button to **icon-only** on phones — drop the "Ceremate" / "AI" text label, keep the pill and the icon, keep the `aria-label`. Text labels on a 375px header are what forces everything else to shrink.
3. Ensure the remaining controls — back, bell, Ceremate, avatar — sit with **at least 8px of gap** (`gap-2`) so their 44px hit areas do not overlap (Law 2). Currently `gap-1.5` (6px). Change to `gap-2`.
4. Add the page title. Right now the header shows only a logo, so the user has no idea what screen they are on after a deep link. Add a centred, truncating title driven by the route:

```tsx
// Put this near the top of AppShell, after `pathname` is defined.
// One flat map, no cleverness — a wrong title is worse than no title.
const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/clients": "Clients",
  "/orders": "Orders",
  "/products": "Products",
  "/team": "Team",
  "/analytics": "Analytics",
  "/whatsapp": "WhatsApp",
  "/settings": "Settings",
  "/ceremate": "Ceremate",
};
const pageTitle =
  Object.entries(TITLES).find(
    ([to]) => pathname === to || pathname.startsWith(to + "/"),
  )?.[1] ?? "";
```

Render it between the left and right control groups:

```tsx
<div className="pointer-events-none absolute inset-x-0 flex justify-center">
  <span className="max-w-[45%] truncate text-[16px] font-[450] text-[color:var(--st-on-surface)]">
    {pageTitle}
  </span>
</div>
```

The header element needs `relative` for this to position. It probably already has it — check.

**Portal header:** the portal header is already clean (logo + name + bell + avatar). Two changes only:
1. The bell link is `h-10 w-10` (40px) — add `hit-area-44`.
2. The badge at line ~277 gets the `tab-badge` ring class and `min-h-[18px] min-w-[18px] text-[11px]`, matching N2.

**Acceptance criteria:**
1. At 375px the staff header has no horizontal overflow and no control is clipped.
2. The page title is visible and correct on `/leads`, `/orders/all`, `/products`, `/team`.
3. On a very long company name with a wide logo, the title truncates with an ellipsis and does not push the avatar off-screen.
4. No two adjacent header controls have overlapping hit areas — verify by tapping the left edge of each control and confirming the correct one fires.

---

## 5. PHASE 3 — LAYOUT LAWS APPLIED

Phase 1 and 2 fixed the chrome. Phase 3 fixes the content area, which is where the "cluttered" feeling actually lives.

---

### ✅ TICKET L1 — Kill 2D grids on mobile (Law 4)

**App:** BOTH · **Files:** 60 occurrences across `src/routes/` and `src/components/` · **Risk:** low, but tedious — do it carefully

**What is wrong:** 60 places use `grid-cols-2`, `grid-cols-3` or `grid-cols-4` with **no responsive prefix**, so a 2–4 column desktop grid is rendered inside a 343px content width on a phone. Each cell ends up ~160px wide, which is why labels wrap, numbers truncate, and everything reads as cramped. A phone viewport permits one direction per section. [M7]

**Find them all:**

```bash
grep -rn --include='*.tsx' 'grid-cols-[234]' src/routes src/components | grep -v 'md:grid-cols\|sm:grid-cols\|lg:grid-cols'
```

**The decision rule — apply this to each hit, do not think about it further:**

| What the grid holds | Fix |
|---|---|
| **Labelled key–value stats** (MRP / PTR / PTS / Margin, order totals, party details) | `grid-cols-1 md:grid-cols-2` — stack into a definition list on phone |
| **A set of equally-important shortcuts or tiles** (quick actions, category tiles) | Convert to the `h-scroller` class from F3 — horizontal carousel |
| **Exactly 2 short numeric cells** that genuinely fit (e.g. two 3-character values) | `grid-cols-2 md:grid-cols-4` — allowed, but only if you have *looked at it* at 375px and nothing wraps |
| **A tab bar or segmented control** | Leave it. Chrome is exempt (see N2 note). |

**Priority files** (do these first, they are the ones users see most):

1. `src/routes/orders.$id.tsx` — 4 occurrences
2. `src/routes/portal.statement.tsx` — 3
3. `src/routes/portal.product.$productId.tsx` — 3 (**note:** the price ladder here is handled properly in Ticket P4 — skip it in L1 and let P4 own it)
4. `src/routes/parties.$id.tsx` — 3
5. `src/routes/products.all.tsx` — 2
6. `src/routes/portal.visual-aids.tsx` — 2
7. `src/components/stock/issue-tab.tsx`, `src/components/staff/leave-tab.tsx`, `src/components/staff/claims-tab.tsx`, `src/components/share-sheet.tsx` — 2 each
8. `src/routes/settings.index.tsx` — 2
9. Everything else — 1 each

**Skip these files entirely:** `console.*.tsx`. The platform console is desktop-only and is out of scope for this whole document.

**Acceptance criteria:**
1. Re-run the grep. Every remaining hit is either in `console.*`, or is a documented exception you can justify in one sentence in the commit message.
2. At 375px, open `/orders/<any id>`, `/parties/<any id>`, `/portal/statement`. **No text wraps mid-word, no number is truncated, no label is cut off.**
3. At 1280px, the same screens look the same as they did before your change. Screenshot before/after at desktop width to prove you did not regress desktop.

---

### ✅ TICKET L2 — Un-nest cards (Law 5)

**App:** BOTH · **Risk:** low

**What is wrong:** cards inside cards. Each `Card` adds ~16–20px of padding per side plus a border and shadow. Two levels of nesting costs ~72px of a 375px screen — nearly 20% of the width gone to chrome.

**Find them:**

```bash
grep -rn --include='*.tsx' -B2 -A8 '<Card' src/routes/portal.*.tsx src/routes/dashboard.tsx src/routes/parties.\$id.tsx src/routes/orders.\$id.tsx | grep -n 'rounded-2xl border\|rounded-xl border\|<Card'
```

Then read each hit and check by eye whether a bordered/shadowed surface sits inside another bordered/shadowed surface.

**The fix:** keep the **outer** card. Replace the inner one with:
- a `.card-divider` hairline above it, and
- `pt-4 mt-4` spacing, and
- a small uppercase label if the group needs a name.

So this pattern:

```tsx
<Card>
  <CardContent>
    <h3>Totals</h3>
    <div className="rounded-xl border p-4">   {/* <-- inner card */}
      ...
    </div>
  </CardContent>
</Card>
```

becomes:

```tsx
<Card>
  <CardContent>
    <h3>Totals</h3>
    <div className="card-divider mt-4 pt-4">   {/* hairline, not a box */}
      ...
    </div>
  </CardContent>
</Card>
```

**Known offenders to check first:** `portal.product.$productId.tsx` (the price-ladder box at line 276 and the margin calculator at 341 both sit inside the page card), `portal.index.tsx` (lines 88–176), `parties.$id.tsx`, `orders.$id.tsx`.

**Acceptance criteria:**
1. On any mobile screen, count the nested bordered surfaces by eye. Maximum depth is **one** card.
2. The content width inside every card at 375px is at least 300px.

---

### ✅ TICKET L3 — Consistent screen rhythm (Law 6)

**App:** BOTH · **Risk:** low

**What is wrong:** vertical gaps between sections are arbitrary — `space-y-2`, `space-y-3`, `space-y-4`, and hard-coded `mt-1`/`mt-0.5` values appear interchangeably on the same screen. Inconsistent whitespace breaks the perceptual grouping that tells a user "these things belong together and those don't". [M1, M8]

**What to do.** For every **top-level route component** in the staff and portal mobile screens, standardise on:

| Level | Value | Class |
|---|---|---|
| Screen side margin | 16px | already set by the shell (`main` has `p-3`, portal has `p-4`) — **change the staff shell's `main` from `p-3` to `p-4`** so both are 16px |
| Gap between major sections | 24px | `space-y-6` on the screen root, or `.screen-section` |
| Gap between rows inside a section | 12px | `space-y-3` |
| Gap between a label and its value | 4px | `mt-1` |
| Card internal padding | 16px | `p-4` |

**Two rules, no exceptions:**
- **No value that is not a multiple of 4.** Delete every `space-y-0.5`, `mt-0.5`, `gap-[5px]`, `p-[13px]` you find on a mobile screen and round to the nearest 4px step.
- **A screen root uses exactly one `space-y-*` value.** If a screen currently has `space-y-3` at the root and `space-y-4` on a child wrapper doing the same job, collapse to one.

**Priority screens:** `portal.index.tsx`, `portal.catalogue.tsx`, `portal.cart.tsx`, `portal.orders.tsx`, `portal.dues.tsx`, `dashboard.tsx`, `leads.$id.tsx`, `orders.$id.tsx`, `parties.$id.tsx`.

**Acceptance criteria:**
1. `grep -rn --include='*.tsx' 'space-y-0\.5\|mt-0\.5\|gap-0\.5' src/routes/portal.*.tsx src/routes/dashboard.tsx` returns nothing.
2. Screenshot `/portal` and `/dashboard` at 375px. The vertical rhythm is visibly regular — put a ruler on it if you have to.
3. The staff `main` element is `p-4` on phones (was `p-3`), and the `pb-28` clearance for the tab bar is still present.

---

## 6. PHASE 4 — THE DISTRIBUTOR PRODUCT PAGE (flagship rebuild)

`src/routes/portal.product.$productId.tsx` is the closest thing this app has to an e-commerce product detail page, and [M1] is a 15-point teardown of exactly this screen type. This is the single screen where the most improvement is available, and it is the screen a paying distributor uses to decide to spend money.

**Read the whole of Phase 4 before starting P1.**

The current screen renders, top to bottom, as one long scroll: back/heart row → image gallery → title/brand/pack/composition → badges → description → a bordered price grid → margin calculator accordion → quantity chips + stepper + "Add to cart". The Add to cart button is at the very bottom of the scroll.

---

### ✅ TICKET P1 — Sticky bottom action dock (Law 8, [M1] upgrade #2)

**App:** PORTAL · **File:** `src/routes/portal.product.$productId.tsx` · **Risk:** medium · **Impact: highest in this phase**

**What is wrong:** a distributor scrolls down to read composition, pack size, margin — and by the time they have decided to order, the Add-to-cart control has scrolled off the top. They must scroll back up. Purchase decisions are made *after* reading, not before, so the buying control must be permanently reachable.

**What to do.**

1. Move `<QuantityPicker minQty={minQty} onAdd={onAdd} />` (currently line 328, inside `ProductBody`) **out** of the scrolling content and into a fixed dock.
2. Add `has-action-dock` (from F3) to the page's root scrolling wrapper so the last content row can clear the dock.
3. The dock is **two rows**, not one. Row 1 is the stepper plus the unit maths; row 2 is a
   full-width CTA with the running total inside it (Law 10).

   **Why two rows and not side by side.** A side-by-side layout was tried first and it breaks: at
   375px the stepper eats ~150px, and a label like `Add to cart · ₹19,500` then wraps onto two
   lines inside the pill. A full-width button cannot wrap however large the total gets, and the
   `₹78 × 250` line above it does useful work — it shows the user the arithmetic behind the total.

```tsx
{/* Sticky purchase dock — the buying decision is made after reading, so the
    control must never scroll away. Two rows: the CTA label must never wrap. */}
<div className="action-dock md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
  <div className="mx-auto max-w-lg">
    <div className="mb-2.5 flex items-center justify-between gap-3">
      <QtyStepper value={qty} onChange={setQty} min={minQty} />
      <span className="text-[13px] font-[300] tabular-nums text-[color:var(--st-on-surface-variant)]">
        {inr(Number(product.rate))} × {qty}
      </span>
    </div>
    <Button size="lg" className="w-full" disabled={adding} onClick={() => onAdd(qty)}>
      {adding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding…
        </>
      ) : (
        <>Add to cart · {inr(qty * Number(product.rate))}</>
      )}
    </Button>
  </div>
</div>
```

4. The quantity **preset chips** stay in the scrolling content, directly above the price block — they are a browsing aid, not part of the commit action. See P5.
5. `qty` state must be lifted from inside `QuantityPicker` up to `PortalProductDetail`, because both the chips (in content) and the stepper (in the dock) now write to it. This is the only structural refactor in this ticket; do it cleanly with `useState` in the parent and pass `value`/`onChange` down.

**Acceptance criteria:**
1. On `/portal/product/<any id>` at 375px, scroll to the very bottom. The dock is still visible and the button is fully tappable.
2. The button label shows a live rupee total that updates when you change the quantity.
3. The last content element can be scrolled fully clear of the dock (nothing is permanently hidden behind it).
4. The dock sits **above** the portal's bottom tab bar and does not cover it.
5. On a viewport ≥ 768px the dock is inline in the page flow, not fixed.
6. Pressing Add to cart shows a spinner in the button and the button is disabled during the operation (Law 7, state 5).

---

### ✅ TICKET P2 — Collapsing header with sticky product title ([M1] upgrade #1)

**App:** PORTAL · **File:** `src/routes/portal.product.$productId.tsx` · **Risk:** medium

**What is wrong:** the back button and favourite heart are at the top of the scroll and disappear immediately. Once a distributor has scrolled past the gallery, there is nothing on screen telling them which product they are looking at, and no way back except a system gesture.

**What to do.** Use the pattern that already exists in this repo — `src/components/ios/ios-nav-bar.tsx` implements exactly this collapse behaviour with an `IntersectionObserver`. **Read that file first.** Either reuse `IosNavBar` directly, or copy its sentinel/observer approach.

The required behaviour:
- At scroll top: a transparent bar with just the back button (left) and heart (right), floating over the gallery.
- Once the product title scrolls under the bar: the bar gains the frosted `glass-panel` background and the **product name fades in, centred, truncated to one line**.
- Back and heart stay pinned throughout.

**Also fix the icon contrast problem** ([M1] flaw #1): the back and heart buttons currently float over the product photograph. Product photos vary — a white pill bottle on a white background makes a dark icon invisible; a dark box makes a light icon invisible. The buttons already use `btn-ss4`, which gives them a white circular background — **that is the correct fix and it is already in place.** Two changes only:
- `btn-ss4 h-9 w-9` → `btn-ss4 hit-area-44 h-10 w-10` (Law 1)
- Add a hairline for the white-on-white case: append `ring-1 ring-black/5` to the className.

**Acceptance criteria:**
1. Scroll `/portal/product/<id>` at 375px: the product name appears in the top bar as the title scrolls out, with a fade — not a hard cut.
2. Back and heart are visible and tappable at every scroll position.
3. Load a product whose primary image is near-white and one whose image is near-black. The back/heart icons are clearly visible on both. (If you cannot find such products, temporarily point `image_url` at a plain white and a plain black image to test, then revert.)
4. With `prefers-reduced-motion: reduce`, the title swap is instant, not faded.

---

### ✅ TICKET P3 — Fix the information order ([M1] flaws #7, #9, #13, #14)

**App:** PORTAL · **File:** `src/routes/portal.product.$productId.tsx` (lines ~245–275) · **Risk:** low

**What is wrong:** a distributor answers three questions in order — *what is it? · can I trust it / does it sell? · what does it cost me?* The current order buries the price below the description, and the badges (division, category, dosage form) sit between the identity block and the money.

**Current order:** name → brand → pack → composition → division/category/dosage badges → description → price grid.

**Required order:**

1. **Name** — `text-[20px] font-[450] title-display` (up from `text-lg`; size grows, weight does not). Uses the `title-display` class from F3 for the -2% tracking that makes large headings look professional [M8].
2. **Brand + pack** on one line, `text-[15px]`, muted. These are the identity qualifiers.
3. **Composition** — `text-[15px]`, still muted, but on its own line. For a pharma buyer this is the single most important trust signal after the name; it must sit high, not below the fold.
4. **Price block** — moves **up to here**, directly under composition. See P4 for its new structure.
5. **Quantity preset chips** — see P5.
6. **Badges** (division / category / dosage form) — move **down**, below the price. They are filters, not decision inputs.
7. **Description** accordion — collapsed by default on mobile. Long-form copy should not push everything else down.
8. **Margin calculator** accordion — unchanged position, last.

**Two specific text fixes:**
- Remove any label text that duplicates what the value already communicates. The price block currently labels a rupee value with a word; a `₹` symbol already says "this is money" [M1 flaw #13]. Keep the *disambiguating* labels — MRP, PTR, PTS, Margin, Your rate — because those distinguish four different prices from each other. Only remove genuinely redundant ones.
- Body copy (`description`, `composition`) gets `leading-relaxed` (150% line height) and `text-[15px]` [M1 flaw #8]. Currently `text-sm leading-relaxed` — just raise the size.

**Acceptance criteria:**
1. On a 375px viewport with no scrolling, the user can see: product name, brand, pack, composition, and their rate. **Take a screenshot of the un-scrolled screen and confirm all five are visible.** This is the acceptance test — if the price is below the fold, the ticket is not done.
2. The description is collapsed by default and expands on tap.
3. Nothing was deleted — every field that was on the page before is still on the page.

---

### ✅ TICKET P4 — Rebuild the price ladder ([M1] flaw #15, [M3] price anchoring, [M2] contrast effect)

**App:** PORTAL · **File:** `src/routes/portal.product.$productId.tsx` (lines ~276–316) · **Risk:** low

**What is wrong:** MRP, Your rate, PTR, PTS, Margin and Min. order are rendered as six equal cells in a `grid-cols-2`. Every number has the same visual weight, so the distributor has to read all six and work out which one they care about. The one that matters — **their rate** — is not visually dominant. And the MRP, which is the anchor that makes their rate look good, is not positioned as an anchor.

**What to do.** Replace the six-cell grid with a hierarchy. This is a **layout and type-size change only** — every colour stays as it is.

```tsx
{/* Price ladder. Hierarchy, not a grid of equals: the distributor's own rate
    is the number they are deciding on, so it is the only large one. MRP sits
    directly above it as the anchor that gives it meaning. */}
<div className="card-divider mt-5 pt-5">
  {/* Anchor: the MRP their retailer will see. Struck through so the
      relationship to "your rate" is immediate. */}
  {p.mrp != null && (
    <div className="flex items-baseline gap-2">
      <span className="text-[13px] uppercase tracking-wide text-[color:var(--st-on-surface-variant)]">
        MRP
      </span>
      <span className="text-[15px] tabular-nums text-[color:var(--st-on-surface-variant)] line-through">
        {inr(Number(p.mrp))}
      </span>
    </div>
  )}

  {/* The decision number. */}
  <div className="mt-1 flex items-end gap-2.5">
    <span className="text-[30px] font-[550] leading-none tabular-nums title-display">
      {inr(p.rate)}
    </span>
    <span className="pb-1 text-[13px] text-[color:var(--st-on-surface-variant)]">
      your rate
    </span>
    {p.is_special_rate && (
      <Badge variant="secondary" className="mb-0.5">Special</Badge>
    )}
  </div>

  {/* The scheme, if one applies, reads as a further improvement on the
      number above it — not as a seventh equal cell. */}
  {schemeRate && (
    <p className="mt-1.5 text-[13px] tabular-nums text-emerald-700">
      With {schemeRate.title}: {inr(schemeRate.effective)} per unit
    </p>
  )}

  {/* Trade margins: secondary, one line, only shown when they exist. */}
  {(ptr !== null || pts !== null || margin !== null) && (
    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
      {ptr !== null && (
        <div>
          <dt className="text-[color:var(--st-on-surface-variant)]">PTR</dt>
          <dd className="font-medium tabular-nums">{inr(ptr)}</dd>
        </div>
      )}
      {pts !== null && (
        <div>
          <dt className="text-[color:var(--st-on-surface-variant)]">PTS</dt>
          <dd className="font-medium tabular-nums">{inr(pts)}</dd>
        </div>
      )}
      {margin !== null && (
        <div>
          <dt className="text-[color:var(--st-on-surface-variant)]">Margin</dt>
          <dd className="font-medium tabular-nums text-emerald-600">{inr(margin)}</dd>
        </div>
      )}
    </dl>
  )}

  {minQty > 1 && (
    <p className="mt-3 text-[13px] text-[color:var(--st-on-surface-variant)]">
      Minimum order {minQty.toLocaleString("en-IN")} units
    </p>
  )}
</div>
```

**Note the strike-through on MRP.** This is not a discount claim — MRP genuinely is the retail price and the distributor genuinely pays less. It is an accurate representation of a real price relationship, which is the only kind that is acceptable. **Do not** invent a struck-through "was" price anywhere in this app.

**Acceptance criteria:**
1. On any product, "your rate" is unambiguously the largest number on the screen.
2. A product with no PTR/PTS/margin data renders cleanly with no empty cells and no stray labels.
3. A product with `min_order_qty` of 1 shows no minimum-order line.
4. A product with an active scheme shows the effective rate line; one without shows nothing.
5. Numbers use `tabular-nums` so they align. Confirm on a list of several products.

---

### ✅ TICKET P5 — Quantity presets in content, stepper in the dock ([M1] upgrade #3, [M4] input matrix)

**App:** PORTAL · **Files:** `src/components/portal/quantity-picker.tsx`, `src/routes/portal.product.$productId.tsx` · **Risk:** medium

**What is already right:** `QUICK_QUANTITIES = [10, 20, 50, 100, 500]` already exists. Pharma is ordered in tens and hundreds, so one-tap presets are exactly correct here and this is genuinely good work. **Do not remove it.**

**What is wrong:**
1. The chips are `h-8` (32px) with `text-xs` — Law 1 and Law 3 violations.
2. The chips, the stepper and the CTA are one undifferentiated block at the bottom of the page. [M4]'s input matrix says these are two different jobs: **presets are for the common case (one tap, low precision needed); the stepper/keypad is for the exact case.** They should not look like one control.
3. The presets are hard-coded and identical for every product. A product with `min_order_qty` of 200 shows a `10` chip that cannot be used.

**What to do.**

1. **Split the component.** `QuantityPicker` becomes two exports from the same file:
   - `QuantityPresets({ value, onChange, minQty })` — the chip row, rendered in page content above the price block.
   - `QtyStepper({ value, onChange, min })` — minus / numeric input / plus, rendered in the dock (P1).
   The existing `clampQty` logic is correct and must be reused by both — do not duplicate it.

2. **Size the chips properly:** `h-8 … text-xs` → `h-11 px-4 text-[15px]`. They stay in the `h-scroller` so they can overflow.

3. **Make the presets respect `minQty`.** Filter out any preset below the minimum, and if the minimum is not in the list, prepend it:

```tsx
const presets = useMemo(() => {
  const base = QUICK_QUANTITIES.filter((q) => q >= min);
  return base.includes(min as never) || base.length === 0 ? [min, ...base] : base;
}, [min]);
```

Deduplicate the result. A chip the user cannot legally pick is worse than no chip.

4. **Numeric input type.** The stepper's text field must use `inputMode="numeric"` and `pattern="[0-9]*"` so the phone raises the number pad, not the full keyboard. Check whether it already does; if not, add it. [M4]

**Acceptance criteria:**
1. Chips are ≥ 44px tall and read at 15px.
2. On a product with `min_order_qty = 100`, the chips shown start at 100 — no unusable chip is rendered.
3. Tapping a chip sets the quantity and the dock's rupee total updates immediately.
4. The stepper's field opens the numeric keypad on a real phone or in device emulation.
5. Typing garbage into the field and blurring clamps to a valid quantity (existing `clampQty` behaviour — confirm the refactor did not break it). Run `npx vitest run src/components/portal/quantity-picker.test.ts` and confirm it passes.
6. **Mutation check:** deliberately break `clampQty` (e.g. `return raw`) and confirm the test suite goes **red**. Restore it. A test that passes with the behaviour deleted is not a test.

---

### ✅ TICKET P6 — Product image gallery discipline ([M1] flaws #1, #2, #10)

**App:** PORTAL · **Files:** `src/routes/portal.product.$productId.tsx` (Gallery), `src/routes/portal.catalogue.tsx` · **Risk:** low

**What is wrong:** product images come from whatever the company uploaded. Some are studio shots on white, some are photos on a desk, some are strip packs against a coloured background. In a catalogue grid this reads as chaos, and it is the single biggest reason a catalogue "looks unprofessional" regardless of how good the code is. [M1 flaw #2]

**This is partly a content problem, not a code problem — say so honestly rather than trying to fix it in CSS.** What code can do:

1. **Force a consistent frame.** Every product image, in both the gallery and the catalogue card, renders inside a fixed `aspect-square` container with `object-contain` (never `object-cover`, which crops a pack shot) on a neutral surface (`bg-[color:var(--st-surface-container-low)]`). This makes a mixed set of images at least *dimensionally* consistent.
2. **Standardise the placeholder.** Products with no image get the same `Package` icon on the same neutral surface at the same size, everywhere. Currently the fallbacks differ between screens.
3. **Gallery dots must be ≥ 44px tappable.** If the gallery has pagination dots, wrap each in a 44px hit area — a 6px dot is not a control.

4. **Raise the content issue with the owner, in writing.** Add a note to the ticket saying: *"Image consistency is capped by what companies upload. The highest-value non-code fix is a documented image spec for company admins — square, product centred, plain light background — surfaced at the upload point in `/products`. Recommend this as a follow-up."* Do not implement that yourself in this ticket.

**Acceptance criteria:**
1. Every product tile in `/portal/catalogue` is exactly square and no product image is cropped.
2. A product with no image and a product with an image sit on the same neutral tile shape.
3. Gallery pagination controls, if present, are ≥ 44px.

---

## 7. PHASE 5 — LISTS, SEARCH, AND THE THREE DENSE SCREENS

### ✅ TICKET C1 — The three heavy screens: a type-density pass

**App:** STAFF · **Files:** `src/routes/orders.all.tsx`, `src/routes/products.all.tsx`, `src/routes/leads.all.tsx` · **Risk:** medium · **This is the biggest single-ticket workload in the plan**

**What is wrong:** these three files contain **433 sub-13px type usages** between them (§1.3). They are the screens a rep spends their day in, and they are the reason the app reads as cluttered.

**Do these one file at a time, one commit each.** Start with `leads.all.tsx` — it is the smallest and it is the section whose design is already owner-approved, so you have a reference to check against (`Files/design/leads-reference/leads-reference-SELF-CONTAINED.tsx`, runnable at `/dev/leads`).

**The substitution table.** Apply mechanically, then look at the result and fix what breaks:

| Current | Replace with | Applies to |
|---|---|---|
| `text-[10px]` | `text-[12px]` | Only micro-labels on badges/chips. If it is a *sentence*, use 13px. |
| `text-[11px]` | `text-[13px]` | All of them |
| `text-xs` (12px) on a **mobile card** | `text-[13px]` | Card body text, metadata lines |
| `text-xs` on a **desktop table cell** | leave as `text-xs md:text-xs`, but add `text-[13px]` for the mobile branch | Table cells only |
| `text-sm` (14px) on a card **title** | `text-[16px]` at **weight 450** (`font-[450]`) | Card and row titles |
| A card's single most important value | `text-[18px]` at **weight 550** (`font-[550]`) | Party name, order total, lead name |

> Note the weights in that table. **Do not substitute `font-semibold` (600) or `font-bold` (700).**
> Tailwind's named weights skip the values this design uses — write the numeric arbitrary value
> (`font-[450]`, `font-[550]`) so you land on the app's actual scale. Law 3.

**Then — and this is the part that actually fixes "cluttered" — remove fields.** Raising type sizes without removing content just makes the same clutter bigger. For each card in these three screens, apply this discipline:

- **A mobile list card shows at most 5 pieces of information:** a title, one identifying subtitle, one primary value (money/count/date), and a maximum of **two** status chips.
- Everything else moves to the detail screen or the peek drawer. It is not deleted from the app; it is deleted from the *card*.
- The approved leads reference already enforces exactly this ("exactly two chips per card: stage + product interest"). Match it.

**Concretely for `leads.all.tsx`:** the punch-list at `Files/design/leads-reference/PUNCH-LIST.md` §4 already itemises what the owner wants changed here, with line numbers. **Read that file and do its items 1, 9 and 10 as part of this ticket** — they are chip discipline and spacing, which is exactly this ticket's job. Leave its items 2–8 (toolbar, badges, pagination) for a separate pass; they are not mobile-density work.

**Acceptance criteria per file:**
1. `grep -c 'text-\[10px\]\|text-\[11px\]' src/routes/<file>` returns **0**.
2. Every mobile card shows ≤ 5 information items and ≤ 2 chips. Count them on screen.
3. At 375px, take a screenshot of the list. Compare against the same screenshot before your change. It must show **fewer rows per screen** than before — that is the intended outcome, not a regression.
4. At 1280px, the desktop table view is unchanged. Screenshot to prove it.
5. No data became unreachable: anything removed from a card is still visible in the detail route or the peek drawer. List in the commit message exactly which fields you moved and where to.

---

### ✅ TICKET C2 — Zero-state search ([M4])

**App:** BOTH · **Files:** `src/components/global-search.tsx`, `src/routes/portal.catalogue.tsx` · **Risk:** low

**What is already right:** `global-search.tsx` already stores and shows "Recently viewed" on focus (lines 79, 139, 162–165). That is [M4]'s first zero-state module and it is done. Credit where due.

**What is wrong:**
1. The portal catalogue search (`portal.catalogue.tsx:103-109`) has **no zero state at all** — focusing it shows the unfiltered product list with an empty box above it.
2. Neither search offers anything beyond recents. [M4] specifies three modules: recent history (with one-tap removal), trending/popular, and personalised suggestions.

**What to do.**

**Portal catalogue** — when the search field is focused and the query is empty, render a panel above the results containing, in this order:
1. **Recent searches** — last 5, from `localStorage` under a party-scoped key (`cerebyl_portal_recent_search_<partyId>`), each with a small × to remove it individually. Party-scoped, because a shared device must not leak one distributor's search history to another.
2. **Reorder from last order** — the products in this party's most recent order. `useReorderData` already exists in `src/lib/use-portal.ts` and is used by the cart (`portal.cart.tsx:4`). Reuse it; do not write a new query.
3. **Divisions** — the division chips that already exist on this screen, restated here as tappable shortcuts.

Do **not** invent a "trending products" feature — that needs cross-party aggregation which the portal's security model deliberately forbids (a distributor must never learn what other distributors buy). Note this in the commit message so nobody adds it later.

**Global search (staff)** — add one section below Recently viewed: **"Jump to"** with 4 fixed shortcuts (My day, Followups due, Dues, Add lead). Static, no query needed.

**Both** — the empty-result state uses `MobileEmptyState` from F5 with `variant="search"`, echoing the query back: *"No products match 'paracetmol'"*, and a button that clears the query. Echoing the query back is what lets a user spot their own typo.

**Acceptance criteria:**
1. Tapping the catalogue search field with an empty query shows recents + reorder + divisions, not a bare list.
2. Each recent search has a working individual × that removes only that entry.
3. Searching for a nonsense string shows the empty state **with the string quoted in it** and a working Clear button.
4. Log in as a different party on the same browser: the recent searches are that party's, not the previous one's. This is a security check, not a cosmetic one — verify it.

---

### ✅ TICKET C3 — Catalogue card structure ([M4] category cards)

**App:** PORTAL · **File:** `src/routes/portal.catalogue.tsx` · **Risk:** low

**What to do.** Each catalogue row/tile shows exactly, and only:

1. Square product image (P6 rules) or the standard placeholder
2. Product name — `text-[16px] font-[450]`, max 2 lines then ellipsis
3. Pack — `text-[13px]` muted, one line
4. **Rate** — `text-[18px] font-[550] tabular-nums` (the decision number)
5. One action: Add (opens the quantity presets in a bottom sheet — Law 11), plus the favourite heart

Everything else currently on the card — composition, division badge, category badge, PTR, PTS, margin — moves to the product detail page. A catalogue is for *scanning*; a detail page is for *deciding*. [M4]

**The Add flow:** tapping Add must **not** navigate away. It opens a bottom sheet containing the preset chips and stepper from P5, with the same `Add to cart · ₹total` CTA. Law 11. The sheet primitive is already imported in this file.

**Acceptance criteria:**
1. At 375px, a full product card is legible without squinting and shows exactly the 5 items above.
2. Tapping Add opens a bottom sheet; the catalogue stays visible behind it; dismissing returns you to the same scroll position.
3. Adding from the sheet fires the same toast the product page does.
4. Favourite toggling still works and its control is ≥ 44px.

---

## 8. PHASE 6 — ORDERS, TRACKING, AND MONEY

### ✅ TICKET O1 — Humanised order tracking ([M4])

**App:** PORTAL (primary), STAFF (secondary) · **Files:** `src/routes/portal.orders.$orderId.tsx`, `src/routes/orders.$id.tsx` · **Risk:** low

**What is wrong:** the gap between placing an order and receiving it is the highest-anxiety period in the whole distributor relationship, and the current screen answers it with a status string and a table. [M4] specifies three components; we have none of them.

**What to do** on `portal.orders.$orderId.tsx`:

1. **A reassurance header at the very top.** One sentence in plain English stating the current state and, where the data exists, the expected date: *"On track — expected Thursday, 4 September"*. If no ETA data exists, state what is true without inventing one: *"Dispatched on 2 September"* or *"Your order is with the sales team for confirmation"*. **Never fabricate an ETA.** If the schema has no expected-delivery field, say so in the ticket and render only the confirmed facts.

2. **A vertical progress stepper**, not a status badge. Stages: Requested → Confirmed → Packed → Dispatched → Delivered. Completed stages get a filled dot and the timestamp; the current stage is emphasised; future stages are muted outlines. Vertical, one column (Law 4).

3. **A contact card.** Whoever the distributor should call about this order — the assigned rep, or the transporter once dispatched — with name, and one-tap call and WhatsApp buttons. The party's rep is already available in the portal data. A phone number that requires copying into another app is a phone number that does not get used.

Then apply the same stepper component to the staff-side `orders.$id.tsx`, so a rep sees the identical timeline their customer sees. Build it once as `src/components/order-progress-stepper.tsx` and import it in both — **do not** write it twice. This repo has been bitten by duplicated components before (`/team` vs `/users`).

**Acceptance criteria:**
1. Every order status the schema can produce maps to a stage, including cancelled/rejected — which must render as an explicit terminal state, not as a stepper stuck at step 1.
2. Call and WhatsApp buttons are ≥ 44px and actually open the dialer / WhatsApp on a real phone.
3. The component file exists once and is imported by both routes.
4. An order with no dispatch data renders without empty rows or "null".

---

### ✅ TICKET O2 — Transparent totals on every commitment ([M3], Law 10)

**App:** BOTH · **Files:** `src/routes/portal.cart.tsx`, `src/routes/portal.pay.tsx`, order-creation flows in `src/routes/orders.all.tsx` · **Risk:** low

**What is wrong:** `portal.cart.tsx:258` submits with the label `Send order request`. The total sits separately at line 247–248. A user has to look in two places to know what they are committing to. [M3]'s clearest finding is that stating the commitment inside the action is what removes hesitation.

**What to do.**

**Cart** (`portal.cart.tsx`):
1. Move the total + CTA into an `action-dock` (F3), sticky at the bottom, above the tab bar. Add `has-action-dock` to the scrolling wrapper.
2. CTA label becomes `Send request · ₹<total>`, and below it a single `text-[13px]` line of muted reassurance stating exactly what happens next and that it is not yet an invoice — e.g. *"A rep confirms before anything is billed."* This is [M3]'s transparency finding and it is also simply true, which is the only reason to say it.
3. Line 258's pending label `Sending…` stays, with a spinner (Law 7 state 5).

**Payment** (`portal.pay.tsx`): the confirm action states the amount: `Record payment · ₹50,000`. Additionally, [M5]'s balance-preview finding applies directly here — show the resulting outstanding balance **before** the user confirms: *"Outstanding after this: ₹1,20,000"*. The dues data is already loaded on the portal. This removes the single biggest source of payment-entry anxiety.

**Acceptance criteria:**
1. No commit-action button in either app reads as a bare verb. Grep for `>Submit<`, `>Save<`, `>Send<`, `>Confirm<` in the portal routes and fix each one that commits money or quantity.
2. The cart CTA total matches the line-item sum exactly, including when the cart is edited with the dock open.
3. The payment screen's "outstanding after" figure is computed, not hard-coded, and updates as the amount is typed.
4. An empty cart shows `MobileEmptyState` with a "Browse catalogue" action — not a disabled submit button.

---

### ✅ TICKET O3 — Dues: state the loss, not the gain ([M2] loss aversion)

**App:** BOTH · **Files:** `src/routes/orders.dues.tsx`, `src/routes/portal.dues.tsx` · **Risk:** low — **and read the caution below before starting**

**The caution.** [M2]'s loss-aversion finding is real behavioural science, and it is also the technique most easily turned into a dark pattern. In this app it must be used **only to state facts the user genuinely needs and would want stated**, never to manufacture pressure. Specifically:

- ✅ Allowed: showing *which* invoices are overdue and by how many days, because that is information a distributor needs and currently has to compute.
- ✅ Allowed: ordering the list most-overdue-first so the thing that matters is at the top.
- ❌ **Not allowed:** countdown timers, artificial urgency, red-screen alarm treatments, or guilt-framed dismiss buttons ("I'll risk it"). Those work in the source material's consumer-app examples; in a B2B credit relationship they damage the very relationship the app exists to support.

If you find yourself writing copy designed to make someone feel bad, stop — you have gone past the line.

**What to do.**
1. Each due row states the concrete fact: *"₹45,000 · 23 days overdue · Invoice #1042"* rather than a generic "Overdue" chip. Specific beats categorical.
2. Sort overdue items first, then by days overdue descending. This is a deliberate, documented exception to the app's alphabetical-default rule (`CLAUDE.md` §5) — **note it in a code comment** citing this ticket, or someone will "fix" it back later.
3. Total outstanding is a single prominent figure at the top, `text-[28px] font-[550] tabular-nums`.
4. One action per row: Record payment (portal) / Log payment (staff).
5. Zero dues renders a positive empty state via `MobileEmptyState`: *"All settled — nothing outstanding."* A clean ledger is good news and should read like it.

**Acceptance criteria:**
1. Every overdue row shows amount, day count, and invoice reference.
2. The sort order comment exists and cites this ticket.
3. No countdown, no timer, no guilt-framed copy anywhere. Re-read your strings before committing.
4. Zero-dues state is positive, not blank.

---

## 9. PHASE 7 — FORMS AND INPUT ([M4], [M5], Law 12)

### ✅ TICKET I1 — Right control for the right input ([M4] input matrix)

**App:** BOTH · **Risk:** low

**The rule, decided — apply it, do not re-litigate it per field:**

| Kind of input | Control | Where this occurs in our app |
|---|---|---|
| Frequent, precise, must be exact | **Numeric keypad field + stepper** (`inputMode="numeric"`) | Order quantities, payment amounts, stock counts, rates |
| One-time setup, bounded range, approximate is fine | **Segmented control or preset chips** | Credit tier, GST %, follow-up interval, salary cycle |
| Choosing from a known short list (≤ 6) | **Preset chips**, plus "Other" if the list is not exhaustive | Lead source, stage, temperature, dosage form |
| Choosing from a long list | **Combobox with type-ahead** (already exists — `src/components/ui/combobox.tsx`) | Party, product, transporter, rep |
| A date | Native date input on mobile | Follow-up date, invoice date, expiry |

**Two mandatory sweeps:**

1. **Every numeric field in both apps gets `inputMode="numeric"` (or `"decimal"` for money) and `pattern="[0-9]*"`.** Find them:
   ```bash
   grep -rn --include='*.tsx' 'type="number"' src/routes src/components | grep -v inputMode
   ```
   Every hit is a bug — on a phone it raises a full QWERTY keyboard for a number.

2. **Every `<Select>` with 6 or fewer fixed options on a mobile-primary screen becomes preset chips.** A select costs three taps (open, scroll, choose); chips cost one. [M5] The repo has ~503 fixed-enum selects, so **do not attempt all of them.** Scope this ticket to the portal (`portal.*.tsx`) plus `leads.all.tsx` filters, and list what you converted.

**Acceptance criteria:**
1. The grep above returns zero hits in `src/routes/portal.*` and the staff screens listed.
2. On a real phone or device emulation, tapping any quantity or amount field raises the number pad.
3. Converted chip groups are ≥ 44px, horizontally scrollable, and show the selected state with fill + colour (not colour alone — same dual-state rule as the tab bar).

---

### ✅ TICKET I2 — Smart defaults ([M2])

**App:** BOTH · **Risk:** low

**What is wrong:** the app's create-forms open empty. Empty fields make the user do data entry; pre-filled fields turn the task into verification, which is faster and produces fewer errors. The research is unambiguous that most people never change a sensible default. [M2]

**What to do — pre-fill these, and only these** (each is a case where the default is genuinely right almost always, and always overridable):

| Form | Field | Default |
|---|---|---|
| New order | Party | Most recent party this rep ordered for |
| New order | Date | Today |
| New lead | Assigned rep | The logged-in rep |
| New lead | Date received | Today |
| New lead | Stage | The first stage in the pipeline |
| Record payment | Amount | The full outstanding for that party |
| Record payment | Date | Today |
| Add stock | Location | The only location, if there is exactly one |
| Portal order request | Quantity | The product's `min_order_qty` |

**Rules on defaults, non-negotiable:**
- A default must be **visibly a value**, not a greyed placeholder. The user must see the real value and be able to change it.
- Never default a field whose wrong value is expensive and hard to notice — do **not** default GST rate, discount, party credit tier, or rep assignment on an existing record.
- Never pre-tick a consent, terms, or opt-in checkbox. That is a legal requirement here, not a preference: the DPDP consent gate (`src/lib/consent.ts`) deliberately ships **unchecked, unbundled** boxes and must stay that way.

**Acceptance criteria:**
1. Each form above opens with its defaults filled and clearly editable.
2. No consent or legal checkbox is pre-ticked anywhere. Grep for `defaultChecked` and `checked={true}` and verify every hit.
3. Changing a default and saving persists the changed value, not the default.

---

### ✅ TICKET I3 — Recognition over recall ([M5], Law 12)

**App:** BOTH · **Risk:** low

**What to do:**

1. **Recent-recipient row.** On any screen that picks a party — new order, record payment, assign — put a horizontal avatar row of the 5 most recent parties directly above the search field. One tap instead of type-and-select. Use `h-scroller` from F3 and the existing `UserAvatar` component.
2. **Never show a bare identifier.** Anywhere an account number, GST number, invoice number, product code or party ID is displayed, the human-readable name sits with it and is the more prominent of the two. Sweep `parties.$id.tsx`, `orders.$id.tsx`, `portal.statement.tsx`.
3. **Confirmation screens echo identity, not just values.** A payment confirmation shows the party's name and avatar, not just the amount and an ID. This is the single cheapest defence against paying the wrong party.

**Acceptance criteria:**
1. New-order and record-payment screens both show a recent-parties row that works with one tap.
2. No screen shows a raw ID as the primary label for something that has a name.

---

### ✅ TICKET I4 — Live feedback while typing ([M5])

**App:** BOTH · **Risk:** low

**What to do.** Where a numeric input has a computable consequence, show the consequence live, below the field, as the user types:

| Screen | Field | Live feedback to show |
|---|---|---|
| Portal cart / product | Quantity | `12 units · ₹1,240` |
| Record payment | Amount | `Outstanding after this: ₹1,20,000` |
| Margin calculator | Selling price | Already does this — **leave it, it is correct** |
| Stock issue | Quantity | `Remaining after issue: 240` |
| New order line | Rate × qty | Line total, and the running order total |

Feedback text is `text-[13px]`, muted, and updates on every keystroke (no debounce needed for local arithmetic).

**Acceptance criteria:**
1. Each row above shows live feedback that is arithmetically correct.
2. Clearing the field removes the feedback line cleanly rather than showing `NaN`, `₹0` or `undefined`. Test by selecting-all and deleting.

---

## 10. PHASE 8 — STATES AND POLISH

### ✅ TICKET S1 — Four states on every list (Law 9)

**App:** BOTH · **Risk:** low, high volume

**What to do.** For every list-bearing route in both apps, implement all four states using `MobileEmptyState` from F5:

| State | Trigger | Content |
|---|---|---|
| **Loading** | `isLoading` | Skeleton rows shaped like the real rows — never a bare spinner on a full page. `src/components/skeleton-loaders.tsx` already exists; use it. |
| **Empty (new)** | Loaded, zero rows, no filters | What this screen is for + the button to create the first item |
| **Empty (filtered)** | Loaded, zero rows, filters active | Which filters are hiding things + a Clear filters button |
| **Error** | `isError` | `friendlyError(error)` (already exists in `src/lib/friendly-error.ts`) + a Retry button that refetches |

**Empty ≠ filtered-empty.** These are different situations needing different messages, and conflating them is the most common version of this bug. If a user has filtered to zero results and you tell them "no leads yet", you have told them something false.

**Route checklist:** `leads.all`, `leads.followups`, `leads.duplicates`, `orders.all`, `orders.dues`, `orders.requests`, `orders.intimations`, `orders.transporters`, `products.all`, `products.offers`, `clients.parties`, `clients.territories`, `team`, `portal.catalogue`, `portal.orders`, `portal.dues`, `portal.requests`, `portal.offers`, `portal.notifications`, `portal.statement`, `portal.visual-aids`.

**Acceptance criteria:**
1. Every route above renders all four states. Test each by: throttling the network (loading), filtering to nonsense (filtered), and temporarily breaking the query URL (error).
2. The error state's Retry button actually refetches — click it with the network restored and confirm data loads.
3. No route shows a raw error object, a stack trace, or a Postgres error string. Everything goes through `friendlyError`.

---

### ✅ TICKET S2 — Pressed and loading states everywhere (Law 7)

**App:** BOTH · **Risk:** low

**What to do:**

1. **Pressed.** Every tappable card, list row and chip gets `pressable` (F3). Buttons already have `active:scale-[0.97]` from `buttonVariants` — leave those. A list row that does not visibly react to touch feels broken on a phone even when the navigation works.
2. **Loading.** Every button that triggers an async mutation must, while pending: be `disabled`, show a `Loader2` spinner, and change its label to a present-participle (`Saving…`, `Sending…`, `Adding…`). The codebase has 143 buttons already wired to `isPending`/`isLoading` but only **16** `Loader2` imports — so most of those disable without any visual explanation of why.

   Find them:
   ```bash
   grep -rn --include='*.tsx' 'disabled={.*isPending\|disabled={.*isLoading' src/routes src/components
   ```
   Every hit needs the spinner and the label change.

3. **Focus.** Every custom interactive element that is not a `<Button>` gets `focus-ring-2` (F3). Native focus rings must never be removed without a replacement.

**Acceptance criteria:**
1. Tap-and-hold any list card: it visibly scales down.
2. Every async action button shows a spinner and a changed label while pending. Throttle the network to 3G to see it.
3. Tab through any form with a keyboard: every control shows a clear 2px ring.
4. With `prefers-reduced-motion: reduce`, the press scale does not animate.

---

### ✅ TICKET S3 — Bottom sheets for sub-tasks (Law 11, [M7])

**App:** BOTH · **Risk:** medium

**What is wrong:** 88 `DialogContent` usages against 6 bottom sheets. A centre-screen modal on a phone covers the context and puts its actions out of thumb reach.

**What to do.** Convert to `Sheet side="bottom"` any dialog that is a **decision about something already on screen**:

- Filter panels (`leads.all`, `orders.all`, `products.all`, `portal.catalogue` — this one is already a Sheet, confirm it is `side="bottom"`)
- Sort pickers
- Quantity pickers (C3)
- Share sheets (`src/components/share-sheet.tsx`)
- Assign-rep / assign-task pickers
- Log call (`src/components/log-call-dialog.tsx`)
- Date-range pickers

**Keep as centre dialogs:**
- Destructive confirmations (`ConfirmDelete`) — a centred modal is the correct pattern for "are you sure", because it should feel interruptive
- The consent gate — legally must be blocking and unmissable
- Anything with a form longer than about 6 fields, which needs the height

**Sheet requirements:** `rounded-t-3xl`, `pb-safe`, a visible grab handle at the top, swipe-down to dismiss, and a `max-h-[85vh]` with internal scroll so it never covers the entire screen.

**Acceptance criteria:**
1. Every converted sheet slides up from the bottom, can be swiped down to dismiss, and leaves the top of the page visible.
2. Destructive confirmations are still centred dialogs.
3. No sheet's content is unreachable — long content scrolls inside the sheet, with the primary action pinned and always visible.

---

### ✅ TICKET S4 — Progressive onboarding density ([M4] lifecycle, [M2] goal gradient)

**App:** BOTH · **Risk:** medium · **Do this last — it is the only ticket that changes behaviour rather than presentation**

**What is wrong:** a brand-new company with 0 leads and 0 orders sees the identical dashboard as a company with 40,000 leads: a full grid of charts and counters showing zeros. That is the worst possible first impression and it teaches the new user nothing. [M4]

**What to do** on `src/routes/dashboard.tsx` and `src/routes/portal.index.tsx`:

Branch the dashboard on how much data exists — **not** on account age, which is unreliable:

| Condition | Show |
|---|---|
| No leads **and** no orders | A setup checklist: Add your first product → Add your first party → Add your first lead. Each row links to the action and shows a tick when done. Plus a completion meter that **starts above zero** — creating the account is itself the first completed step, so the meter opens at "1 of 4 done", never at 0%. [M2] |
| Some data, under ~20 records | Today's actions only: follow-ups due, pending requests, recent activity. No charts — a chart of 6 data points is noise. |
| Established | The current full dashboard, unchanged |

**Why the meter starts above zero:** a progress indicator that opens at 0% reads as "nothing has happened and there is a lot to do", which suppresses the first action. Showing credit already earned for a step genuinely completed measurably increases completion. It must reflect something **actually true** — the account really does exist — never a fabricated head start.

**Acceptance criteria:**
1. Create a fresh test company with no data: the dashboard shows the checklist, not a wall of zeros.
2. Each checklist row ticks when its item genuinely exists in the database, and the meter recalculates.
3. An established company's dashboard is **byte-for-byte unchanged**. Diff the rendered output if you need to be sure.
4. No chart renders with fewer than 3 data points anywhere.

---

## 11. VERIFICATION — how you prove a ticket is done

### 11.1 The gate — run after EVERY ticket, no exceptions

```bash
npx tsc --noEmit
```
Must report **0 errors**. The project baseline is zero; any error is a regression you introduced.

```bash
npm run build
```
Must succeed.

```bash
npm run test
```
The suite spans 74 test files. All must pass. If a test was already failing before you started, say so explicitly rather than letting it be blamed on your change.

```bash
npm run test:isolation
```
Only required if you touched anything under `/portal` or any edge function. It proves cross-tenant isolation still holds.

```bash
git status --short
```
Review every changed file. If a file you did not intend to change is listed, find out why before committing.

### 11.2 The visual check — the gate is not enough

**A green build proves nothing about UI work.** This project has shipped typecheck-clean, fully-broken releases more than once. You must look at the screen.

1. Start the dev server. Use the browser preview tooling with the `cerebyl-dev` configuration (defined in the **project-root** `.claude/launch.json`, not the repo's).
2. Set the viewport to **375 × 812** (iPhone-class). This is the target device. If it works at 375 it works everywhere.
3. Open every screen the ticket touched.
4. Check the browser console for errors and warnings. Zero new ones.
5. Take a screenshot **before and after** and attach both to the ticket.

**Screens with no unauthenticated route** (most of them) need a login. If you cannot get one, build a temporary mock route under `/dev/` — that is the established pattern here (`/dev/leads` is how an entire design got approved in one review round). Delete the mock before committing, or leave it under `/dev/` where it is already conventional.

### 11.3 The five checks that catch what screenshots miss

Run these on every ticket that changes a screen:

1. **Greyscale test.** Screenshot, desaturate. Can you still tell what is active, what is a button, what is a warning? If not, you are relying on colour alone.
2. **Thumb test.** On the 375px viewport, is every primary action reachable in the bottom two-thirds of the screen? Top-corner primary actions are unreachable one-handed.
3. **Long-content test.** Put a 60-character company name, a ₹99,99,999 amount, and a product name with no spaces into the screen. Nothing may overflow, clip, or push another element off-screen.
4. **Empty test.** Render the screen with zero data. It must show a designed state, not a blank region.
5. **Reduced-motion test.** Set `prefers-reduced-motion: reduce` in devtools. All animation stops. Nothing becomes invisible or unusable as a result.

### 11.4 Definition of done for a ticket

- [ ] Gate passes (11.1)
- [ ] Visual check done at 375px, before/after screenshots attached (11.2)
- [ ] All five checks in 11.3 pass
- [ ] Desktop (≥ 768px) is verified unchanged unless the ticket explicitly says otherwise
- [ ] No colour, font-family, or shadow recipe was altered
- [ ] Committed locally with message `ui: <TICKET-ID> <description>`
- [ ] **Not pushed**

---

## 12. THINGS YOU MUST NOT DO

These have each cost this project real time before. Read them.

1. **Do not push to git.** Commit locally, report, stop. The lead pushes after review.
2. **Do not change colours, fonts, shadows, or radii.** Stated three times now because it is the most likely way this work goes wrong.
3. **Do not run `supabase db push`.** The live migration-tracking table is drifted and it can attempt to replay everything. No ticket here needs a migration.
4. **Do not touch RLS, auth, edge functions, or anything under `supabase/`.** Nothing in this plan requires it. If a ticket seems to, you have misread it — ask.
5. **Do not create a `profiles` row for a portal user, ever.** The entire distributor isolation guarantee rests on party users having no `profiles` row. This is a security boundary, not a design choice.
6. **Do not verify a deploy by comparing local `.output` filenames against the live site.** It gives false failures. Use the browser: load the live URL, navigate to the changed route, read the console and network logs.
7. **Do not `curl` an individual JS chunk to check a deploy.** Small route stubs return false 404s while the browser fetches them successfully with 200.
8. **Do not add `hit-area-44` to two adjacent icon buttons.** Their invisible areas overlap and the later one in the DOM partially kills the first. Space them instead. (Law 2.)
9. **Do not hand-roll a framer-motion transition.** Use `useMotionFlow()` and `useMotionSafe()`. They already handle `prefers-reduced-motion` correctly; a raw transition does not.
10. **Do not build a chart by hand.** `src/components/ui/chart.tsx` is the shared recharts wrapper. Also: "Leads by Source" is a **bar chart, never a pie**, and no pie chart type exists anywhere in this product by standing rule.
11. **Do not "fix" the leads list to sort alphabetically.** It sorts newest-received-first on `date_received`, deliberately, because leads arrive by email intake and bulk import so row-insert time is not arrival time. Everything else in the app defaults to alphabetical.
12. **Do not read anything in `Files/archive/`.** Everything there is already built and shipped. A finished build plan reads exactly like a to-do list, and rebuilding a shipped feature from one has already happened here.
13. **Do not add a dark mode to any Stitch-styled surface.** The approved design is light-only. No dark palette was ever designed. Do not invent one.
14. **Do not use "Enthrella" or "Acrowell" in any user-facing text.** The brand is **Cerebyl**. Acrowell is one client company inside the platform; Enthrella is backend-only infrastructure. Seeing either in the UI is a regression to fix.
15. **Do not add a feature that was not asked for.** This document is a polish and ergonomics pass. If you think something new is needed, write it down and raise it — do not build it.

---

## 13. SEQUENCING AND EFFORT

Work strictly top to bottom. Later phases assume earlier ones are done.

| Phase | Tickets | Est. effort | Blocks what |
|---|---|---|---|
| **1 — Foundations** | F1 F2 F3 F4 F5 | 2–3 days | Everything |
| **2 — Navigation** | N1 N2 N3 N4 | 2 days | Nothing, but highest visibility |
| **3 — Layout laws** | L1 L2 L3 | 2–3 days | Phases 4–6 |
| **4 — Product page** | P1 P2 P3 P4 P5 P6 | 3–4 days | — |
| **5 — Lists & search** | C1 C2 C3 | 4–5 days (C1 alone is 3) | — |
| **6 — Orders & money** | O1 O2 O3 | 2–3 days | — |
| **7 — Forms & input** | I1 I2 I3 I4 | 2–3 days | — |
| **8 — States & polish** | S1 S2 S3 S4 | 3–4 days | S4 last |

**Total: roughly 20–28 working days** for one developer, assuming review between phases.

**If time is short, this is the priority order.** These five tickets alone deliver most of the perceived improvement:

1. **F1** — 44px controls. One file. Fixes "clumsy" more than anything else in this document.
2. **F2** — remove the `!important` type shrinkers. One file. Unblocks every other type fix.
3. **N1 + N2** — the bottom bars. The most-touched pixels in the app.
4. **P1** — sticky purchase dock. The highest-value single screen change for a paying distributor.
5. **C1 (leads.all.tsx only)** — the density pass on one screen, to prove the approach before doing all three.

---

## 14. REFERENCE — where things live

| What | Where |
|---|---|
| Staff app shell, bottom tab bar, mobile header | `src/components/app-shell.tsx` |
| Portal shell, portal tab bar, More sheet | `src/routes/portal.tsx` |
| All design tokens, utilities, global CSS | `src/styles.css` |
| Button variants and sizes | `src/components/ui/button.tsx` |
| iOS type scale tokens (`text-ios-*`) | `src/styles.css` lines 72–93 |
| Stitch design tokens (`--st-*`) | `src/styles.css` lines ~530–560 |
| Reduced-motion helpers | `src/lib/use-motion-safe.ts`, `src/lib/motion-flow.ts` |
| Reusable iOS primitives (nav bar, sheet, list, segmented) | `src/components/ios/` |
| Skeleton loaders | `src/components/skeleton-loaders.tsx` |
| Plain-English error messages | `src/lib/friendly-error.ts` |
| Shared chart wrapper | `src/components/ui/chart.tsx` |
| **The mobile target for THIS plan (start here)** | `src/routes/dev.mobile.tsx`, runnable at `/dev/mobile` — four finished screens |
| The approved desktop/leads visual reference | `Files/design/leads-reference/leads-reference-SELF-CONTAINED.tsx`, runnable at `/dev/leads` |
| Owner's existing punch-list against that reference | `Files/design/leads-reference/PUNCH-LIST.md` |
| Design system with sourced HIG values | `Files/design/design-system.md` |
| Project rules, infrastructure, standing decisions | `CLAUDE.md` (project root) — **read §5 before changing any default sort** |

---

## 15. GLOSSARY

- **Touch target** — the region that responds to a tap. Can be larger than the visible control; that is what `hit-area-44` exploits.
- **Safe area** — the strip at the bottom of a modern phone reserved for the home-indicator gesture, and the notch at the top. `pb-safe` / `pt-safe` handle these. Content in the safe area gets swallowed by system gestures.
- **Dual-state** — signalling an active/selected state with **two** independent visual changes (e.g. colour *and* fill), so it survives colour-blindness and sunlight.
- **Single-axis rule** — a section of a phone screen scrolls in one direction only: vertical stack, or horizontal carousel. Never a 2D grid.
- **Zero state / empty state** — what a screen shows when it has no data. Four distinct kinds; see Law 9.
- **Action dock** — a sticky bottom bar holding the screen's primary action, so it never scrolls away.
- **Bottom sheet** — a panel that slides up from the bottom edge and leaves the page visible behind it. The mobile equivalent of a modal, but reachable by thumb.
- **Anchor (pricing)** — a reference number shown next to a price so the price has meaning. Our MRP-above-your-rate treatment is an anchor, and an accurate one.
- **Goal gradient** — people work harder as a goal looks closer, which is why a progress meter should show genuinely-earned credit rather than opening at zero.
- **PDP** — product detail page. In our app: `/portal/product/$productId`.
- **PTR / PTS** — Price To Retailer / Price To Stockist. Standard pharma distribution price points.

---

*End of plan. Questions go to the lead before you improvise — a wrong guess costs more than a question.*
