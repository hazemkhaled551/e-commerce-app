---
name: Modern Retail Blueprint
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#0051b1'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f69dc'
  on-tertiary-container: '#edf0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  price-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  price-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes an institutional, dependable, and precision-driven light-mode e-commerce foundation. It targets modern digital consumers who value friction-free navigation, explicit transactional clarity, and uncompromised speed.

The visual style blends **Corporate / Modern** discipline with high-utility e-commerce patterns:
- **Tone:** Methodical, reliable, sharp, and confident.
- **Hierarchy:** High signal-to-noise ratio where product photography and transactional triggers dominate the visual weight.
- **Surface Polish:** Clean `#FFFFFF` elevated planes set upon a calming, ultra-soft cool background `#F8FAFC`, avoiding sensory fatigue during long shopping sessions.
- **Structural Integrity:** Precision 1px dividers, disciplined typographic contrast, and deliberate micro-interactions that communicate system responsiveness and checkout integrity.

## Colors

The palette leverages a classic corporate trust blue core paired with balanced slate neutrals to maximize product visibility and legal/transactional legitimacy.

### Palette Architecture
- **Primary (`#2563EB`):** Primary actions, active navigation states, order placement actions, and key verification indicators.
- **Secondary (`#1D4ED8`):** Pressed/hover states for primary buttons, highlighted text links, and focused active components.
- **Tertiary (`#3B82F6`):** Secondary accents, progress trackers, and visual indicators.
- **Neutral Core (`#0F172A`):** Used for primary headings, body copy, and heavy emphasis to maintain maximum legibility against white surfaces.
- **Subdued Neutral (`#64748B`):** Metadata, SKU numbers, breadcrumbs, specifications, and secondary ratings.
- **Canvas (`#F8FAFC`):** Global canvas background setting the staging area for elevated component surfaces.
- **Surface & Cards (`#FFFFFF`):** High-clarity foreground planes for product cards, drawers, dialogs, and navigation headers.
- **Outlines & Dividers (`#E2E8F0`):** Subtle separation lines preserving structural containment without visual clutter.

### Functional States
- **Success / In Stock (`#16A34A`):** Inventory availability, free shipping qualifiers, confirmation checks.
- **Warning / Low Stock (`#D97706`):** Low inventory alerts, countdown timers, basket expiration notices.
- **Error / Out of Stock (`#DC2626`):** Form errors, stock depletion, failed payment notifications.

## Typography

Inter powers the type scale across all touchpoints, emphasizing clean vertical metric alignments and cross-platform consistency.

### Typographic Principles
- **Tabular Figures:** Always apply `font-variant-numeric: tabular-nums` (or CSS OpenType feature `'tnum'`) on all pricing, inventory countdowns, cart totals, and table metrics to prevent horizontal jitter during updates.
- **Clarity Over Embellishment:** Headline sizes down to body copy employ optical letter-spacing (negative tracking at scale, slight positive tracking on sub-12px elements) for rapid skimming across dense catalog pages.
- **Price Hierarchy:** Pricing styles (`price-lg`, `price-md`) command strong visual weight (`700`), positioned intentionally to clarify MSRP versus discounted rates instantly.

## Layout & Spacing

The layout model is anchored by a structured 12-column responsive fluid grid with maximum content containment at `1280px` (`max-w-7xl`).

### Responsive Logic
- **Mobile (< 768px):** 4-column layout, `1rem` outer margin, `1rem` gutters. Product listings fall into a 2-column card orientation or 1-column list configuration for dense transactional layouts.
- **Tablet (768px - 1024px):** 8-column layout, `1.5rem` outer margins, `1.5rem` gutters. Accommodates side-by-side filter panels and product displays.
- **Desktop (> 1024px):** 12-column layout, `2rem` outer margins, `1.5rem` gutters. Persistent sticky filter rails occupy 3 columns; main product feeds command the remaining 9 columns.

### Spatial Rhythm
Padding and intra-element spacing adhere to a base-4 spatial system. Component internals strictly leverage `space-xs` through `space-md`, while section separation defaults to `space-xl` and `space-2xl` to give product visuals breathing room.

## Elevation & Depth

Visual hierarchy uses a hybrid strategy combining **low-contrast outlines** with **ambient, low-opacity shadows** to avoid heavy borders or muddy layers in light mode.

### Elevation Hierarchy
- **Level 0 (Base / Canvas):** Surface color `#F8FAFC`. Zero elevation, zero border.
- **Level 1 (Cards & Inputs):** Surface `#FFFFFF`, border `1px solid #E2E8F0`. Shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`. Used for passive catalog items and static content blocks.
- **Level 2 (Hover States & Dropdowns):** Surface `#FFFFFF`, border `1px solid #CBD5E1`. Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`. Card hover states translate `translateY(-2px)` to affirm interactivity.
- **Level 3 (Modals, Overlays, Sticky Cart Bars):** Surface `#FFFFFF`, border `1px solid #E2E8F0`. Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system adopts a **Soft (`1`)** shape language. This ensures buttons, input controls, and product thumbnails appear modern and approachable while retaining the structured precision expected of enterprise retail storefronts.

### Token Application
- **Base Components (`0.25rem` / `4px`):** Checkboxes, radio inner indicators, small badges, and micro-steppers.
- **Standard (`0.375rem` - `0.5rem` / `rounded-lg`):** Primary buttons, input fields, dropdown select menus, standard product card wrappers, and image frame containers.
- **Elevated Modals & Floating Drawers (`0.75rem` / `rounded-xl`):** Flyout carts, checkout summary panels, and modal containers.
- **Full Pill (`9999px`):** Category chips, inventory status tags (e.g., "In Stock"), and circular icon-only trigger buttons.

## Components

### Buttons
- **Primary:** Background `#2563EB`, text `#FFFFFF`, border `none`, `rounded-lg` (0.5rem), font weight `600`. Hover: `#1D4ED8`. Active: scale `0.98`. Focus ring: 2px offset with `#3B82F6`.
- **Secondary / Outline:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`. Hover: `#F8FAFC` and border `#CBD5E1`.
- **Ghost:** Text `#64748B`, background transparent. Hover: `#F1F5F9`, text `#0F172A`.

### Product Cards
- **Structure:** Surface `#FFFFFF`, border `1px solid #E2E8F0`, rounded `rounded-lg`.
- **Image Staging:** 1:1 or 4:5 aspect ratio wrapper with a subtle neutral-slate background `#F1F5F9` to anchor non-standard product photos.
- **Content Flow:** Category label (`label-caps`, `#64748B`), Product Title (`body-md`, `#0F172A`, 2-line clamp), Pricing Row (`price-md`, tabular numbers), and a secondary "Add to Cart" quick-action button.

### Form Inputs & Selectors
- **Input Fields:** Height 42px, padding `0 0.75rem`, border `1px solid #E2E8F0`, background `#FFFFFF`, text `#0F172A`, placeholder `#94A3B8`, `rounded-lg`. Focus state: border `#2563EB`, outer box-shadow ring `0 0 0 3px rgba(37, 99, 235, 0.15)`.
- **Checkboxes & Radios:** 18px x 18px, border `1px solid #CBD5E1`, border-radius `4px` (checkbox) or `9999px` (radio). Checked state: `#2563EB` fill with sharp `#FFFFFF` icon.

### Chips & Stock Badges
- **Status Badges:** Fully rounded pill (`9999px`), padding `2px 8px`, font size `11px`, font weight `600`.
  - In Stock: Background `#DCFCE7`, text `#16A34A`.
  - Low Stock: Background `#FEF3C7`, text `#D97706`.
  - Out of Stock: Background `#FEE2E2`, text `#DC2626`.
- **Filter Chips:** Height 32px, `rounded-lg`, border `1px solid #E2E8F0`, background `#FFFFFF`. Active state: background `#DBEAFE`, text `#1D4ED8`, border `#93C5FD`.

### Quantity Stepper
- Compact inline control, border `1px solid #E2E8F0`, `rounded-lg`. Contains decrement button, tabular quantity number, and increment button. Disables decrement button at quantity `1`.

### Cart Drawer & Checkout Summary
- High elevation (Level 3), dividing line `1px solid #E2E8F0`, structured item listing rows with fixed thumbnail frames (64px x 64px), tabular line items, and a persistent fixed sticky checkout button container at the base.