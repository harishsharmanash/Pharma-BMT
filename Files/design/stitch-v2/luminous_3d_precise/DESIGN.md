---
name: Luminous 3D Precise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#414753'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#717785'
  outline-variant: '#c0c6d5'
  surface-tint: '#005eb2'
  primary: '#005cad'
  on-primary: '#ffffff'
  primary-container: '#0074d9'
  on-primary-container: '#fefcff'
  inverse-primary: '#a7c8ff'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#565d63'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f757c'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3b'
  on-primary-fixed-variant: '#004788'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  section-gap: 64px
  card-padding: 32px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
---

## Brand & Style

The design system embodies a premium, futuristic medical-tech aesthetic. It transitions from traditional flat clinical interfaces to a high-end **3D UI** and **Glassmorphism** style. The personality is hyper-professional yet technologically advanced, evoking feelings of trust, innovation, and "intelligent wellness." 

The visual narrative is defined by:
- **Depth & Tactility:** Layers are treated as physical glass panes with varying levels of frosted transparency.
- **Luminosity:** Elements aren't just colored; they emit light, particularly the signature crystalline blue accents.
- **Soft Precision:** High-precision data is housed in soft, organic shapes with generous breathing room.

## Colors

The palette is rooted in a "Sterile Tech" foundation, utilizing pure whites and cool-toned grays to allow the 3D crystalline elements to pop.

- **Primary (Cerebyl Blue):** A vibrant, glowing blue used for call-to-actions, active states, and crystalline 3D accents.
- **Glass Surfaces:** Pure white (`#FFFFFF`) with 60%–80% opacity, utilizing `backdrop-filter: blur(20px)`.
- **Background:** A very soft gradient transition between white and a subtle cool gray (`#F1F5F9`) to provide a canvas for light and shadow.
- **Accents:** Use gradients of the primary blue to simulate the crystalline light-refraction seen in the brand assets.

## Typography

This design system relies on **Inter** to maintain its clinical heritage, but uses increased scale and weight variance to drive the premium feel.

- **Contrast:** High-contrast weight usage (Bold for titles, Regular for data) ensures legibility against semi-transparent backgrounds.
- **Scale:** Larger font sizes are used for headers to command attention in high-whitespace layouts.
- **Hierarchy:** Use the "neutral" color at 70% opacity for secondary labels to maintain depth without sacrificing clarity.

## Layout & Spacing

The layout follows a **fluid grid** model with significantly expanded margins to emphasize the premium nature of the product.

- **Whitespace:** Sections should be separated by at least 64px to create a "breatheable" environment.
- **Card Internals:** Padding within containers is increased to 32px to ensure content never feels cramped near the rounded edges.
- **Reflow:** On mobile, margins reduce to 20px, and large 3D icons are scaled down or centered to maintain visual balance.

## Elevation & Depth

Hierarchy is established through **Soft Depth** and **Tonal Layering** rather than traditional high-contrast shadows.

- **Glassmorphism:** All primary containers use a white semi-transparent fill with a heavy backdrop blur. A 1px white inner-border (stroke) at 40% opacity should be applied to simulate the edge of a glass pane.
- **Shadows:** Use multi-layered ambient shadows. A typical card shadow should consist of a very large, soft blur (e.g., `0 20px 50px rgba(0,0,0,0.05)`) combined with a closer, slightly darker shadow for definition.
- **Inner Glow:** Apply a subtle `inset` white shadow to the top-left of buttons and cards to enhance the 3D "extruded" effect.

## Shapes

The shape language is organic and approachable. 
- **Large Radius:** Base containers and cards must use a minimum of `24px` (or `rounded-xl`) to match the soft 3D aesthetic.
- **Pill Shapes:** Interactive elements like buttons, tags, and search bars utilize full-rounded pill shapes.
- **3D Icons:** Iconography follows the crystalline star and "Ceremate" robot style, featuring soft beveled edges and glossy finishes.

## Components

### Buttons
- **Style:** Pill-shaped with a subtle top-to-bottom blue gradient.
- **Effect:** A 1px inner light-border on the top edge to create a 3D "pressable" look.
- **State:** Hover should increase the glow (drop-shadow) of the primary color.

### Input Fields
- **Style:** Inset 'skeuomorphic' fields. Use an inner shadow (`inset 0 2px 4px rgba(0,0,0,0.05)`) to make the field appear carved into the glass surface.
- **Background:** Slightly more opaque than the container it sits in.

### Cards
- **Style:** Glassmorphic with `backdrop-filter: blur(20px)`.
- **Border:** A 1px translucent white border to define the edge against the background.

### 3D Assets & Icons
- **Primary Icon:** The 4-pointed blue crystalline star.
- **Assistant:** The "Ceremate" robot should be used for empty states, AI interactions, and onboarding.
- **Status Pods:** Use soft-glow icons for alerts (e.g., the heart-shield or the status-check assets).