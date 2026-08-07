---
name: Clinical Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e2'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fc'
  surface-container: '#ededf6'
  surface-container-high: '#e7e7f1'
  surface-container-highest: '#e1e2eb'
  on-surface: '#191b22'
  on-surface-variant: '#434653'
  inverse-surface: '#2e3037'
  inverse-on-surface: '#f0f0f9'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#1d59c1'
  primary: '#003c90'
  on-primary: '#ffffff'
  primary-container: '#0f52ba'
  on-primary-container: '#bcceff'
  inverse-primary: '#b0c6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#732900'
  on-tertiary: '#ffffff'
  tertiary-container: '#993900'
  on-tertiary-container: '#ffc0a7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00419c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b22'
  surface-variant: '#e1e2eb'
typography:
  display-lead-code:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  table-cell-padding-x: 12px
  table-cell-padding-y: 8px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
---

## Brand & Style
The design system is engineered for high-stakes pharmaceutical CRM environments where data density and clarity are paramount. The brand personality is clinical, systematic, and authoritative. 

The design style follows **Modern Corporate Minimalism** with a focus on institutional reliability. It prioritizes information over decoration, utilizing generous whitespace between logical containers while maintaining tight internal density for data points. Visual cues are used exclusively for functional signaling, ensuring that medical sales representatives and administrators can scan large volumes of lead data without cognitive fatigue.

## Colors
The palette is rooted in "Trustworthy Blue" to reinforce stability and professionalism. 
- **Primary**: Used for the "North Star" actions (e.g., Save Lead, Convert, Primary Navigation).
- **Secondary**: A muted slate used for iconography and supporting text.
- **Status Palette**: Highly saturated tokens for lead statuses—Success (Won/Qualified), Danger (Lost/Overdue), Warning (Due Today), and Info (New Leads).
- **Surface**: Backgrounds use a clean, cool-tinted neutral to reduce eye strain during long-form data entry.

## Typography
This design system utilizes **Inter** for its exceptional legibility and comprehensive OpenType features. 
- **Hierarchy**: Lead codes and primary identifiers use semi-bold weights with tighter tracking. 
- **Data Labels**: Small, uppercase labels provide context without competing with the primary data values.
- **Tabular Figures**: For tables and metrics, `tnum` (tabular numbers) must be enabled to ensure columns of figures align perfectly for easy comparison.
- **Mobile Adaptation**: Large headers scale down to a maximum of 20px on mobile to preserve horizontal space in data-heavy views.

## Layout & Spacing
The layout uses a **Fluid-Fixed Hybrid** model. Navigation and sidebars are fixed, while the lead management dashboard spans the remaining width.
- **Grid**: A standard 12-column grid is used for desktop forms; however, the "Leads Table" uses a flexible column approach based on content priority.
- **Information Density**: A 4px baseline grid ensures a rhythmic vertical stack. Tables use a compact 8px vertical padding to maximize the number of visible rows on screen ("above the fold" density).
- **Side Drawers**: Quick-peek details utilize a 400px fixed-width drawer that slides from the right, maintaining the context of the main list.

## Elevation & Depth
The design system employs **Tonal Layering** over shadows to maintain a "flat but structured" look. 
- **Base Layer**: The main canvas is `#F8FAFC`.
- **Surface Layer**: Cards and table containers use a pure white `#FFFFFF` background with a 1px solid border in `#E2E8F0`.
- **Active Elevation**: Shadows are reserved strictly for temporary overlays like tooltips, dropdowns, and side-drawers to indicate they sit "above" the workflow. Use a single, diffused `0 4px 12px rgba(0,0,0,0.05)` shadow for these elements.
- **Focus States**: High-contrast 2px rings in the primary color are used for keyboard navigation and active input fields.

## Shapes
The shape language is **Soft (0.25rem)**. This provides a subtle modern touch while maintaining the professional, "square" feel expected of enterprise software. 
- **Buttons and Inputs**: 4px border radius.
- **Cards and Modals**: 8px border radius to distinguish larger containers.
- **Status Badges**: Fully rounded (pill) for immediate recognition as a non-interactive status indicator.

## Components
- **Segmented Controls**: Used for lens switching (e.g., "My Leads" vs "All Leads"). These should have a subtle grey background with a white "raised" segment for the active state.
- **High-Density Tables**: Rows must alternate with subtle zebra striping (`#F1F5F9`) on hover. Columns for "Status" use colored text with a faint 10% opacity background of the same color.
- **Side Drawers**: Headers in drawers should include the Lead Code and a "Close" button. All actions within the drawer must be pinned to the bottom.
- **Forms**: Vertical stacking for labels and inputs is preferred. Use "inline-edit" patterns for lead details to reduce the need for explicit "Edit" screens.
- **Chips/Badges**: Use for medical specialties or lead tags. These should be low-contrast (grey background) to ensure they do not compete with the primary Status indicators.
- **Action Bar**: A sticky footer or header in the lead detail view that houses the primary lifecycle actions (Qualify, Disqualify, Transfer).