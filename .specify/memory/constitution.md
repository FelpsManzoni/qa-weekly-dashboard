<!--
  Sync Impact Report
  ==================
  Version change: (template) → 1.0.0
  Modified principles: N/A (initial population from template)
  Added sections:
    - I. Code Quality
    - II. Testing Standards (NON-NEGOTIABLE)
    - III. User Experience Consistency
    - IV. Performance Requirements
    - V. Design System Adherence
    - Technology Stack & Constraints
    - Development Workflow
    - Governance (initially populated)
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/tasks-template.md ✅ updated (tests now marked MANDATORY per Principle II)
    - .specify/templates/plan-template.md ✅ no changes needed (Constitution Check section is generic)
    - .specify/templates/spec-template.md ✅ no changes needed
    - .specify/templates/checklist-template.md ✅ no changes needed
  Follow-up TODOs: None
-->

# QA Weekly Dashboard Constitution

## Core Principles

### I. Code Quality

All source code MUST follow established linting and formatting conventions
defined in the project's toolchain (e.g., oxlint, Prettier). Code MUST be
self-documenting: meaningful names, single-responsibility functions, and minimal
comments. Dead code, commented-out blocks, and console logging MUST NOT be
committed. Every PR MUST pass automated lint and type-check gates before
merge.

### II. Testing Standards (NON-NEGOTIABLE)

Every feature MUST include unit tests that cover its public API and core logic.
Test coverage MUST achieve at least 80% line coverage for new code. Tests MUST
be written before or alongside implementation — red-green-refactor cycle is
strongly encouraged. Integration tests MUST be added for any feature that
persists data, calls external services, or spans module boundaries. All tests
MUST be runnable via a single command and MUST pass before merge.

### III. User Experience Consistency

All UI screens, components, and interactions MUST follow the SiDi Design
System found in `sidi-design-system/`. This includes, but is not limited to:
color tokens (`--sidi-*`, `--status-*`), typography (`--font-display`,
`--font-body`), spacing scale (`--space-*`), radii (`--radius-*`), shadows
(`--shadow-*`), and motion tokens. Hardcoded colors, spacing, or typography
values are PROHIBITED. New components MUST reuse existing primitives (Button,
Input, Badge, Card, Table) before building custom elements.

### IV. Performance Requirements

Dashboard pages MUST render interactive content within 2 seconds on a
representative mid-tier connection. Data-heavy views (tables, charts) MUST
support pagination or virtual scrolling for datasets exceeding 100 rows.
Network requests MUST be debounced or batched where feasible. Bundle size MUST
be monitored; any addition exceeding 50 KB gzipped MUST be justified in the PR
description.

### V. Design System Adherence

Before implementing any UI work, developers MUST review the
`sidi-design-system/` folder — particularly `SKILL.md`, `README.md`,
`styles.css`, and the `ui_kits/qa_dashboard/` directory — to understand
existing patterns. The `_adherence.oxlintrc.json` linter config from the design
system MUST be respected. Any deviation from the design system requires written
justification and team approval.

## Technology Stack & Constraints

- **Frontend**: HTML, CSS, JavaScript (React/JSX via Babel bundle) as defined
  by the design system's `_ds_bundle.js` entry point.
- **Styling**: CSS custom properties only — no CSS-in-JS, no preprocessors.
- **Fonts**: Poppins (display) and Inter (body) — loaded via Google Fonts.
- **Icons**: Lucide Icons from CDN (stroke-based, monochrome, inherited color).
- **No emoji, no gradient backgrounds, no pill-everything aesthetic.**
- All component props MUST be typed (`.d.ts` sibling files).

## Development Workflow

1. **Plan**: Review existing design system patterns in `sidi-design-system/`.
2. **Spec**: Write feature spec with user stories and test scenarios.
3. **Test**: Write unit/integration tests first (red phase).
4. **Implement**: Build feature against tests (green phase).
5. **Refactor**: Clean up while keeping tests green.
6. **Verify**: Run lint, type-check, and full test suite.
7. **Review**: PR must reference spec, design system compliance, and test
   coverage.

## Governance

This Constitution supersedes all ad-hoc practices. Amendments require a PR
that updates this file, includes a rationale, and is approved by the team.
The version field follows semantic versioning: MAJOR for principle
removals/redefinitions, MINOR for additions, PATCH for clarifications.
Every spec and plan MUST check compliance against these principles before
proceeding.

**Version**: 1.0.0 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-07
