# SiDi Design System

**SiDi QA Team Dashboard** — a design system for the quality assurance tracking product at the SiDi Research and Development Institute.

## Overview

This design system provides the visual foundation, component library, and UI kit for the SiDi QA Dashboard—a straightforward, simple interface for tracking test quality across all QA projects.

**Company:** SiDi (Serviços de Inteligência Digital) Research & Development Institute  
**Product:** QA Team Dashboard  
**Purpose:** Track quality metrics for all projects the QA team participates in

---

## Visual Foundations

### Color System

The brand palette comes directly from **Paleta de cores.webp** (uploaded assets):
- **Dark Green** (#006325) — brand primary, used for accents and active states
- **Bright Green** (#00ed3c) — attention-grabbing accent for highlights
- **Dark Purple** (#480e60) — secondary brand color
- **Light Purple** (#b094fb) — softer secondary, used in backgrounds
- **Black** (#000000) — strong contrast for text
- **Gray** (#979a9c) — neutral midtone

**QA Status Colors:** The brand did not define status colors (pass/fail/warning/running), so these are derived in oklch() to maintain the same vivid quality-of-light as the brand greens. This ensures new hues feel native to the palette rather than imported.

### Typography

**Font Substitution:** No font files were provided. We use:
- **Poppins** (Google Fonts, 500–800 weights) — matches the geometric, rounded-terminal aesthetic of the SiDi wordmark on the logo assets
- **Inter** (Google Fonts, 400–600 weights) — neutral, highly legible at dashboard scales

**Ask:** Please provide original font files (TTF/OTF) if the brand uses custom typefaces. We can then update `@font-face` rules in `tokens/typography.css`.

### Spacing

4px base unit. No "pill everything" design — soft but not excessive rounding. Cards use 6–10px radius, inputs 6px.

### Shadows

Flat dashboard with sparingly used shadows for elevation:
- **sm:** `0 1px 2px rgba(0,0,0,0.06)` — subtle depth
- **md:** `0 2px 8px rgba(0,0,0,0.08)` — card/dropdown elevation
- **lg:** `0 8px 24px rgba(0,0,0,0.12)` — modal elevation

### Interaction & Motion

- **Ease:** Standard cubic-bezier (0.4, 0, 0.2, 1) — smooth but not floaty
- **Durations:** 120ms (fast interactions), 200ms (normal transitions)
- **Hover states:** Opacity change, lighter/darker background color
- **Press states:** Slight scale reduction (97%) for tactile feedback

---

## Content Fundamentals

**Tone & Voice:** Professional, direct, data-forward. No marketing fluff; all copy serves the dashboard's core purpose—reporting QA metrics.

**Casing:** Sentence case for headings and labels (e.g., "Project status", not "PROJECT STATUS"). All-caps reserved for small labels and category names when space is constrained.

**Style:** "You" is avoided—copy stays neutral ("Tests run today" vs. "Your tests run today"). Imperative verbs for actions ("Run tests", "View report").

**Emoji:** Not used. The brand does not employ emoji; the visual system relies on color badges and icons instead.

**Specificity:** Copy is concrete—"98.2% pass rate" over "Good performance". Numbers are precise to one decimal place where relevant.

---

## Iconography

No custom icon set was provided. For the QA Dashboard, we recommend:
- **Lucide Icons** (CDN-available, open-source) for simple, clean icons matching the brand's minimalist aesthetic
- **System icons** only where necessary to avoid visual clutter

When adding icons, prioritize:
- Line weight consistency with the brand (stroke-based, not filled)
- Monochrome usage (inherit color from context, no multi-color glyphs)
- High recognizability (choose standard icons; avoid novel designs)

---

## Architecture

### Files & Folders

```
sidi-design-system/
├── styles.css                      # Global CSS entry point (@import manifest)
├── tokens/
│   ├── colors.css                  # Color custom properties
│   ├── typography.css              # Type scale, font-family, weights
│   └── spacing.css                 # Spacing, radius, shadow, motion
├── components/
│   └── core/                        # Reusable UI primitives
│       ├── Button.jsx / .d.ts
│       ├── Input.jsx / .d.ts
│       ├── Badge.jsx / .d.ts
│       ├── Card.jsx / .d.ts
│       ├── Table.jsx / .d.ts
│       └── card.html                # @dsCard specimen
├── ui_kits/
│   └── qa_dashboard/                # QA Dashboard UI kit
│       ├── index.html               # @dsCard main dashboard view
│       ├── Header.jsx
│       ├── StatCard.jsx
│       ├── ProjectStatus.jsx
│       └── ProgressBar.jsx
├── guidelines/                      # Foundation specimens (@dsCard tagged)
│   ├── colors-brand.html
│   ├── colors-ramps.html
│   ├── colors-neutral.html
│   ├── colors-status.html
│   ├── type-display.html
│   ├── type-body.html
│   ├── type-scale.html
│   ├── spacing-scale.html
│   ├── spacing-in-use.html
│   ├── radius-shadow.html
│   ├── brand-logo.html
│   └── brand-symbol.html
├── assets/
│   └── logos/                       # Brand logo & symbol variants
│       ├── sidi-logo-*.png
│       ├── sidi-symbol-*.png
│       └── (icon fonts TBD)
└── readme.md (this file)
```

### Tokens (CSS Custom Properties)

- **Colors:** Brand primaries, neutrals, semantic status colors (pass/fail/warning/running/blocked)
- **Typography:** Font families, scale (xs–4xl), weights (400–800), line heights
- **Spacing:** Scale from 4px to 80px
- **Radius:** sm (6px), md (10px), lg (14px), full (999px)
- **Shadows:** sm/md/lg elevation levels
- **Motion:** Standard easing, fast (120ms) and normal (200ms) durations

All tokens are CSS custom properties on `:root` and can be read via `var(--token-name)`.

### Components

**Core primitives** (`components/core/`):
- **Button** — primary/secondary/ghost/danger variants, sm/md/lg sizes, disabled state
- **Input** — text/email/password/search/number, with error state, sizes
- **Badge** — status labels (default/success/danger/warning/info), sizes sm/md/lg
- **Card** — simple container with padding and elevation options
- **Table** — data table with striped rows, header styling, flexible columns

Each component:
- Exports as a named function (`export function Button(props) {...}`)
- Reads styles from CSS custom properties (no CSS-in-JS)
- Has a sibling `.d.ts` file defining props
- Is rendered in a `card.html` specimen showing all variants

### UI Kit: QA Dashboard

A full-page recreation of the main dashboard interface:
- **Sidebar navigation** — projects, tests, reports
- **Header** — title and subtitle
- **Stats grid** — total projects, avg pass rate, tests run today, issues found
- **Projects table** — project name, status badge, pass rate, last run timestamp

The UI kit is a static HTML prototype (not fully interactive) but demonstrates:
- Layout and hierarchy
- Component usage (badges, tables, cards)
- Spacing and alignment
- Color application

---

## Tokens List

### Colors (Base + Semantic)

| Token | Value | Usage |
|-------|-------|-------|
| `--sidi-green-dark` | #006325 | Brand primary |
| `--sidi-green-bright` | #00ed3c | Accent highlight |
| `--sidi-purple-dark` | #480e60 | Secondary |
| `--sidi-purple-light` | #b094fb | Light secondary |
| `--sidi-black` | #000000 | Text/contrast |
| `--sidi-gray` | #979a9c | Neutral midtone |
| `--neutral-50` to `--neutral-1000` | Gray scale | UI surfaces, text |
| `--status-pass`, `--status-pass-bg` | oklch-derived green | Pass state |
| `--status-fail`, `--status-fail-bg` | oklch-derived red | Fail state |
| `--status-warning`, `--status-warning-bg` | oklch-derived amber | Warning state |
| `--status-running`, `--status-running-bg` | oklch-derived purple | Running state |
| `--status-blocked`, `--status-blocked-bg` | Gray scale | Blocked state |

### Typography

| Token | Value |
|-------|-------|
| `--font-display` | Poppins, sans-serif |
| `--font-body` | Inter, sans-serif |
| `--text-xs` to `--text-4xl` | 12px to 48px |
| `--weight-regular` to `--weight-extrabold` | 400–800 |
| `--leading-tight`, `--leading-normal`, `--leading-relaxed` | 1.15, 1.4, 1.6 |

### Spacing & Elevation

| Token | Value |
|-------|-------|
| `--space-1` to `--space-20` | 4px to 80px |
| `--radius-sm` to `--radius-full` | 6px to 999px |
| `--shadow-sm` to `--shadow-lg` | Elevation levels |

---

## How to Use This System

### For Designers

1. **Browse the Design System tab** — see all foundation specimens, components, and the QA Dashboard UI kit
2. **Reference tokens in designs** — use CSS custom property names (`--sidi-green-dark`, etc.) to stay on-brand
3. **Use component variants** — the "Core Components" card shows all Button/Input/Badge states
4. **Adapt the QA Dashboard** — extend the UI kit for new screens (reports, test details, settings)

### For Developers

1. **Link `styles.css`** — all tokens are available as CSS variables
2. **Import components from the bundle** — in consuming projects, components are available via `window.<Namespace>`
3. **Copy the UI kit structure** — use `Header`, `StatCard`, `ProjectStatus` as templates for new screens
4. **Respect the token contract** — never hardcode colors or spacing; always use `var(--token-name)`

---

## Intentional Decisions

### Font Substitution

The original brand fonts are not available; **Poppins** and **Inter** are close matches but not exact. The design system will be more polished once true brand fonts are supplied.

### Status Colors in oklch()

QA workflows need five status states (pass/fail/warning/running/blocked), but the brand palette only defines green and purple. Rather than arbitrarily choosing reds and oranges, we derived new hues using oklch() color space, rotating the hue while preserving the brand's lightness and chroma. This ensures status colors feel native to the palette.

### Simple, Straightforward Design

No unnecessary decoration:
- Flat product (shadows only for elevation)
- No gradient backgrounds
- No icon fonts or emoji
- No pill-everything aesthetic
- Focus on clarity and quick scanning (important for a dashboard)

---

## Caveats & Next Steps

### Missing Pieces

1. **Original fonts** — Poppins/Inter are substitutes. Provide TTF/OTF files to update `tokens/typography.css`.
2. **Icon set** — No custom icons provided. Plan to use Lucide Icons from CDN or provide your own SVG/icon-font assets.
3. **Real data & interactivity** — The QA Dashboard UI kit is a static prototype. For a production dashboard, integrate real API data and add click-through functionality.

### Ask the Team

To iterate toward a perfect design system:

1. **Font files:** Do you have original brand fonts? If so, attach them so we can update the `@font-face` rules.
2. **Icon approach:** Should we link Lucide Icons from CDN, or do you have a custom icon set to provide?
3. **Scope of UI kit:** Are there additional dashboard screens (test details, project settings, reports) you'd like included in the UI kit?
4. **Additional components:** Beyond Button/Input/Badge/Card/Table, are there specialized components (DatePicker, Dropdown, Tabs, Modals) needed for the full product?
5. **Color tweaks:** Does the oklch-derived status palette feel right, or should we adjust specific hues?

---

## Project Context

**Sources:**
- `uploads/Logotipos.webp` — brand logo wordmarks (colored variants)
- `uploads/Simbolos.webp` — brand symbol 'S' mark (color/gradient variants)
- `uploads/Paleta de cores.webp` — official color palette (6 colors)

**Compiler Output:**
- `_ds_bundle.js` — runtime library (auto-generated)
- `_ds_manifest.json` — component & token index (auto-generated)
- `_adherence.oxlintrc.json` — linting rules for consuming projects (auto-generated)

---

*This design system is ready for use. Copy it into consuming projects and link `styles.css` to inherit all tokens and components.*
