---
name: sidi-design
description: Design system for SiDi QA Team Dashboard. Contains colors, typography, spacing, component library, and a complete QA dashboard UI kit. Use this to build dashboards and tools for QA teams with consistent, data-forward design.
user-invocable: true
---

Read the README.md file in this design system to understand the brand, color palette, component library, and UI kit.

## Quick Start

1. **Copy `styles.css`** into your project — it imports all tokens (colors, type, spacing).
2. **Use CSS custom properties** — `background: var(--brand-primary)`, `color: var(--text-primary)`, etc.
3. **Reuse components** — Button, Input, Badge, Card, Table are ready to use.
4. **Follow the QA Dashboard structure** — use the UI kit as a template for new screens.

## Key Files

- `README.md` — full design guide, token reference, architecture
- `styles.css` — CSS entry point (imports all tokens)
- `components/core/` — Button, Input, Badge, Card, Table
- `ui_kits/qa_dashboard/` — main dashboard UI kit and components
- `guidelines/` — foundation cards (colors, type, spacing, brand)
- `assets/logos/` — brand mark and symbol variants

## Brand Essentials

- **Primary Color:** Dark Green (#006325)
- **Accent:** Bright Green (#00ed3c)
- **Secondary:** Dark Purple (#480e60)
- **Type:** Poppins (display), Inter (body) [substituted; originals TBD]
- **Tone:** Professional, data-forward, no fluff
- **Approach:** Flat, straightforward, focused on clarity

## Status Colors (QA-specific)

- **Pass:** oklch-derived green
- **Fail:** oklch-derived red
- **Warning:** oklch-derived amber
- **Running:** oklch-derived purple
- **Blocked:** Gray

See `guidelines/colors-status.html` for swatches.

## For Designers

Use this system to create QA dashboards, reports, and team tools. All components and colors are documented in the Design System tab. Extend the UI kit with new screens as needed—always reference tokens, never hardcode colors or spacing.

## For Developers

Import the bundle and reference CSS custom properties. Example:

```html
<link rel="stylesheet" href="/path/to/styles.css">
<script src="/path/to/_ds_bundle.js"></script>
<script type="text/babel">
  const { Button } = window.SiDiDesignSystem_a5e0ec;
  // Use <Button>Click me</Button>
</script>
```

All colors, type scales, spacing, and shadows are available as tokens — use them instead of hardcoding values.

## Questions?

See the README.md for detailed guidance on typography, colors, motion, components, and the QA Dashboard UI kit. Report issues or suggest additions to help refine the system.
