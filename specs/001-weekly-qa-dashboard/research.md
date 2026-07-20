# Research: Weekly QA Dashboard

## Technology Decisions

### Build Tool: Vite
- **Decision**: Vite 5.x with React + TypeScript template
- **Rationale**: Fast dev server, native TypeScript support, optimized builds, minimal configuration.
  Aligns with the user's requirement for minimal libraries.
- **Alternatives**: Create React App (deprecated, slower), Next.js (too heavy for a single-page
  dashboard), Webpack (more configuration overhead).

### UI Framework: React 18
- **Decision**: React 18 with functional components and hooks
- **Rationale**: Industry standard, component-based architecture matches the dashboard's modular
  layout (header, week selector, project nav, charts, table, notes). No additional UI framework
  needed — vanilla CSS with design system tokens suffices.
- **Alternatives**: Vue, Svelte, Solid — all valid but React aligns with the existing design
  system's JSX component patterns.

### Chart Library: Recharts
- **Decision**: Recharts (lightweight, React-native charting library)
- **Rationale**: Designed for React, supports Line charts (Issue History) and Pie charts
  (Test Case Distribution) out of the box. Small bundle size, composable components,
  responsive by default.
- **Alternatives**: Chart.js + react-chartjs-2 (good but heavier wrapper), D3 (too low-level
  for this scope), ECharts (larger bundle).

### Database: Hosted PostgreSQL (Supabase or Neon)
- **Decision**: Supabase or Neon — both provide hosted PostgreSQL with connection pooling,
  SSL, and generous free tiers. Final choice deferred to deployment environment.
- **Rationale**: User explicitly requires hosted PostgreSQL. Supabase offers additional
  features (real-time, auth) for future iteration. Neon is serverless with branching
  for development.
- **Alternatives**: AWS RDS, Google Cloud SQL, Railway — all viable but more configuration
  overhead.

### CSS Approach: Vanilla CSS with Design System Tokens
- **Decision**: Plain CSS files per component, importing `sidi-design-system/` tokens
- **Rationale**: No CSS-in-JS, no preprocessors per user requirements. Design system
  tokens (`--sidi-*`, `--status-*`, `--space-*`, etc.) are already available as CSS
  custom properties. Each component gets a co-located CSS file.
- **Alternatives**: CSS Modules (adds build config), Tailwind (adds dependency,
  contradicts "vanilla CSS" requirement), Styled Components (CSS-in-JS, unnecessary).

### Testing: Vitest + React Testing Library
- **Decision**: Vitest (Vite-native) with React Testing Library and jsdom
- **Rationale**: Native Vite integration, fast, same config as build. React Testing
  Library encourages testing user behavior over implementation details.
- **Alternatives**: Jest (slower, requires separate config), Cypress (E2E, overkill
  for unit/integration).

### Data Access Layer: REST API via Supabase Client or Custom Express Server
- **Decision**: Supabase client library (if Supabase chosen) implements REST/GraphQL
  directly from the browser; alternatively, a thin Node.js Express server providing
  REST endpoints if more control is needed. Both approaches use the same PostgreSQL
  schema.
- **Rationale**: Minimal abstraction over database. The user wants a "small data access
  layer" — either Supabase's auto-generated REST API or a minimal Express server with
  `node-postgres` fits this requirement.
- **Alternatives**: tRPC (adds complexity), Prisma (heavy for this scope), raw SQL
  (sufficient via Supabase or `pg`).

## Design System Alignment

The `sidi-design-system/` provides:
- **Color tokens**: `--sidi-green-dark`, `--sidi-purple-dark`, `--neutral-*`, `--status-*`
- **Typography**: Poppins (display), Inter (body) — loaded via Google Fonts
- **Spacing**: 4px base, `--space-1` through `--space-20`
- **Components**: Button, Input, Badge, Card, Table (JSX + .d.ts)
- **UI Kit**: qa_dashboard/ with Header, StatCard, ProjectStatus, ProgressBar

All dashboard components MUST use these tokens and patterns per Constitution Principle V.
The existing Table component in `sidi-design-system/project/components/core/Table.jsx`
serves as the base for the release/version table. The existing Card component wraps
chart sections.
