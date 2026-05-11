---
name: Hyper-Vibrant Fintech
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464556'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#777588'
  outline-variant: '#c7c4d9'
  surface-tint: '#473bf8'
  primary: '#1e00b5'
  on-primary: '#ffffff'
  primary-container: '#311be7'
  on-primary-container: '#b7b6ff'
  inverse-primary: '#c2c1ff'
  secondary: '#3a6a0e'
  on-secondary: '#ffffff'
  secondary-container: '#b6f086'
  on-secondary-container: '#3e6f13'
  tertiary: '#630064'
  on-tertiary: '#ffffff'
  tertiary-container: '#89008a'
  on-tertiary-container: '#ff99f5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c2c1ff'
  on-primary-fixed: '#0d006a'
  on-primary-fixed-variant: '#2a0ae3'
  secondary-fixed: '#b9f389'
  secondary-fixed-dim: '#9ed670'
  on-secondary-fixed: '#0c2000'
  on-secondary-fixed-variant: '#275000'
  tertiary-fixed: '#ffd7f6'
  tertiary-fixed-dim: '#ffaaf4'
  on-tertiary-fixed: '#380038'
  on-tertiary-fixed-variant: '#810082'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 20px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  section-gap: 40px
  baseline: 4px
---

## Brand & Style

This design system is built on a "High-Contrast Minimalist" philosophy, blending the reliability of traditional banking with the high-energy aesthetic of modern digital rewards. The goal is to evoke a sense of speed, financial empowerment, and technological sophistication.

The visual language balances massive, confident typography with spacious layouts. It utilizes a mix of **Minimalism** for structural elements and **Vibrant Accents** for interactive rewards. Deep indigo surfaces are used to anchor the experience, while neon greens and pinks act as high-frequency signals for "value-add" moments like cashback and success states. The user should feel like they are using a tool that is both professional and rewarding.

## Colors

The palette is engineered for high-impact distinction. 

- **Primary (#4D43FE):** A deep, saturated indigo used for main action containers, active navigation states, and brand-heavy components.
- **Secondary (#B5EF85):** A vibrant "Acid Green" reserved exclusively for positive financial growth, success indicators, and "Free Cash" callouts.
- **Tertiary (#E72BE7):** A "Neon Magenta" used for secondary rewards, special offers, and to break the visual monotony of the primary indigo.
- **Neutrals:** The system uses a pristine white (#FFFFFF) for primary surfaces and a very light cool gray (#F8F9FA) for the background to make white cards pop. Black (#000000) is reserved for high-contrast headlines.

## Typography

The typography system relies on a pairing of **Hanken Grotesk** for headlines and **Inter** for utility. 

Headlines are designed to be "loud" and "heavy," using Extra Bold weights and tight letter spacing to command attention. This mimics the confident editorial style of modern fintech apps. Body copy is kept utilitarian and highly legible with Inter, ensuring that financial data and transaction details are easily scannable. Numeric values, especially currency, should always use a medium or semi-bold weight to ensure prominence.

## Layout & Spacing

This design system utilizes a **fluid grid** with generous safe areas. 

- **Mobile:** A 4-column grid with 20px outer margins. Components take up the full width or span 2 columns for smaller cards.
- **Desktop/Tablet:** A 12-column grid with a maximum content width of 1200px. 
- **Rhythm:** A 4px baseline grid governs all spacing. Vertical stacks use 24px gaps between major sections to maintain a clean, airy feel that prevents the high-contrast elements from feeling cluttered. Cards should have internal padding of 20px to 24px to mirror the external margins.

## Elevation & Depth

Depth is achieved through **Tonal Layering** rather than traditional heavy shadows. 

1. **Base Layer:** The light gray background (#F8F9FA).
2. **Surface Layer:** Pure white cards with a very subtle, large-radius "Ambient Shadow" (offset 0, 8px blur, 4% black opacity). This makes cards appear to float slightly above the canvas.
3. **Primary Layer:** High-saturation indigo cards that use no shadows but rely on color contrast to establish hierarchy.
4. **Interactive Layer:** Subtle inner glows or 1px semi-transparent white borders are used on dark containers to provide "high-tech" definition.

## Shapes

The shape language is defined by **Soft Geometricism**. 

Containers and cards utilize large radii (16px to 24px) to feel friendly and modern. Smaller elements like buttons and input fields follow suit with a 12px-16px radius. "Pill" shapes are reserved exclusively for status indicators (chips) and the primary navigation bar markers. This consistency in rounding ensures that even high-contrast, aggressive colors feel approachable and safe for a financial context.

## Components

### Buttons
- **Primary:** Solid indigo background with white text. High-contrast, 16px border radius.
- **Success/Cashback:** Solid bright green background with black text for maximum legibility.
- **Ghost:** Transparent background with a 1.5px indigo border.

### Cards
- **High-Contrast Cards:** Indigo background with white text and icons. Used for "Hero" moments like QR scanning or balance checks.
- **Standard Cards:** White background with subtle shadows. Used for transactional lists and settings.
- **Feature Cards:** Subtle gradients or "Glass" overlays for secondary features like "Credit Score."

### Inputs & Fields
- Search bars should use a white background with a light gray border and 16px corner radius.
- Icons within inputs should be monochrome (dark gray) to avoid competing with primary action buttons.

### Chips & Badges
- Small, pill-shaped indicators for status (e.g., "New," "Primary," "Success"). 
- Use the Secondary (Green) or Tertiary (Pink) palette for these to draw the eye to specific updates.

### List Items
- Clean, 1px horizontal dividers or simple 12px vertical spacing between items.
- Avatars for transaction history should use soft-colored backgrounds with a single initial or high-quality brand logo.