# Implementation Plan: Weekly QA Dashboard

**Branch**: `001-weekly-qa-dashboard` | **Date**: 2026-07-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-weekly-qa-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a Weekly QA Dashboard with Vite + React + TypeScript that reproduces the
Power Apps reference layout: week selector, project/module selector, Issue
History line chart, Test Case Distribution pie chart, release/version table,
and priority notes. Data is persisted in a hosted PostgreSQL database
(Supabase or Neon) with a small data access layer/API service. Use minimal
libraries — React components and vanilla CSS. No auth, export, or external
integrations in v1.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x, Node.js 20.x (or latest LTS)

**Primary Dependencies**: Vite (build tool), React, React DOM, a lightweight
chart library (e.g., Recharts or Chart.js) for line and pie charts. Vanilla
CSS for all styling — no CSS-in-JS, no preprocessors. Use design system
tokens from `sidi-design-system/`.

**Storage**: Hosted PostgreSQL via Supabase or Neon. Tables for weeks,
projects/modules, issue_metrics, test_case_distributions, release_versions,
notes.

**Testing**: Vitest (Vite-native test runner) + React Testing Library for unit
and integration tests. Minimum 80% line coverage per Constitution Principle
II.

**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge).

**Project Type**: Single-page web application (Vite + React + TypeScript).

**Performance Goals**: Dashboard renders interactive content within 2 seconds
on mid-tier connection (Constitution Principle IV). Charts and tables support
pagination/virtual scrolling for datasets exceeding 100 rows.

**Constraints**: Must use CSS custom properties from design system
(`sidi-design-system/`). No hardcoded colors or spacing. No emoji, no gradient
backgrounds. Bundle additions >50 KB gzipped must be justified in PR.

**Scale/Scope**: 10+ active weeks, 10+ active projects/modules, 100+ combined
data records. Single-team internal QA dashboard.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (Code Quality)**: Code MUST pass lint/type-check gates. Use
  oxlint (or ESLint with TypeScript rules) and Prettier. No dead code,
  commented-out blocks, or console.log committed.
- **Principle II (Testing Standards)**: Every feature MUST have unit tests.
  Minimum 80% line coverage. Tests written before/alongside implementation.
  Integration tests for data persistence and API service layers.
- **Principle III (UX Consistency)**: All UI MUST follow the SiDi Design
  System in `sidi-design-system/`. Use color tokens (`--sidi-*`, `--status-*`),
  typography (`--font-display`, `--font-body`), spacing (`--space-*`), radii
  (`--radius-*`), shadows (`--shadow-*`), motion tokens. Reuse existing
  primitives (Button, Input, Badge, Card, Table) before custom elements.
- **Principle IV (Performance)**: 2-second interactive render. Pagination or
  virtual scrolling for >100 rows. Debounced/batched network requests. Bundle
  size monitoring.
- **Principle V (Design System Adherence)**: Review `sidi-design-system/`
  before any UI work (SKILL.md, README.md, styles.css, ui_kits/qa_dashboard/).
  Respect `_adherence.oxlintrc.json` linter config.

**Assessment**: All principles are compatible. No violations detected. The
Vite + React + TypeScript approach deviates from the constitution's
"HTML/CSS/JS (React/JSX via Babel bundle)" tech stack reference, but this is
a modernization (Vite replaces the Babel bundle approach) and maintains
compatibility with the design system's CSS custom properties and component
patterns. Design system tokens, primitives, and guidelines remain fully
applicable.

## Project Structure

### Documentation (this feature)

```text
specs/001-weekly-qa-dashboard/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Header/
│   ├── WeekSelector/
│   ├── ProjectNav/
│   ├── IssueHistoryChart/
│   ├── TestCaseDistributionChart/
│   ├── ReleaseTable/
│   ├── NotesSection/
│   └── EmptyState/
├── api/
│   ├── client.ts          # API client (fetch wrapper)
│   ├── weeks.ts
│   ├── projects.ts
│   ├── issues.ts
│   ├── testCases.ts
│   ├── releases.ts
│   └── notes.ts
├── types/
│   └── index.ts           # TypeScript interfaces for all entities
├── hooks/
│   ├── useDashboard.ts    # Dashboard state management
│   ├── useWeeks.ts
│   ├── useProjects.ts
│   └── ...
├── styles/
│   ├── globals.css        # Import design system tokens
│   ├── header.css
│   ├── week-selector.css
│   ├── project-nav.css
│   ├── charts.css
│   ├── release-table.css
│   └── notes.css
├── utils/
│   ├── dates.ts
│   └── validation.ts
├── App.tsx
├── App.css
├── main.tsx
└── index.html

db/
├── migrations/
│   └── 001_initial_schema.sql
├── seed.sql
└── schema.sql

tests/
├── unit/
│   ├── components/
│   ├── api/
│   └── hooks/
├── integration/
│   └── dashboard.test.tsx
└── setup.ts
```

**Structure Decision**: Single-project Vite + React app with clear separation:
`src/components/` for UI, `src/api/` for data access layer, `src/hooks/` for
state management, `src/types/` for shared TypeScript interfaces, `db/` for
database migrations and seed data, `tests/` mirroring source structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. Complexity tracking not required.
