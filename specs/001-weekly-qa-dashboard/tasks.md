---

description: "Task list for Weekly QA Dashboard implementation"

---

# Tasks: Weekly QA Dashboard

**Input**: Design documents from `specs/001-weekly-qa-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are **MANDATORY** per Constitution Principle II. Every user story includes unit and integration tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` for source code, `tests/` for tests, `db/` for schema/migrations
- Tasks reference the concrete paths defined in `specs/001-weekly-qa-dashboard/plan.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base tooling

- [x] T001 Initialize Vite + React + TypeScript project in `package.json`, `tsconfig.json`, and `vite.config.ts`
- [x] T002 [P] Add runtime and test dependencies in `package.json`
- [x] T003 [P] Configure linting and formatting in `.eslintrc.*`, `.prettierrc`, and `package.json`
- [x] T004 [P] Create base project folders in `src/`, `tests/`, and `db/` with placeholder `.gitkeep` files where needed
- [x] T005 [P] Add environment variable examples for database and API access in `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create initial PostgreSQL schema for weeks, projects, issue metrics, test case distributions, release versions, notes, and edit locks in `db/migrations/001_initial_schema.sql`
- [x] T007 [P] Create seed data for weeks, projects, issues, test cases, releases, and notes in `db/seed.sql`
- [x] T008 [P] Create shared TypeScript entity and API response types in `src/types/index.ts`
- [x] T009 [P] Create shared API client and error mapping in `src/api/client.ts`
- [x] T010 [P] Create shared edit-lock API service in `src/api/locks.ts`
- [x] T011 [P] Import design-system tokens, fonts, and global resets in `src/styles/globals.css`
- [x] T012 [P] Create shared i18n copy map for bilingual labels and messages in `src/utils/copy.ts`
- [x] T013 [P] Create shared date and formatting helpers in `src/utils/dates.ts`
- [x] T014 [P] Create shared validation helpers for numeric and text rules in `src/utils/validation.ts`
- [x] T015 Create shared EmptyState component in `src/components/EmptyState/EmptyState.tsx`
- [x] T016 Create shared loading and error presentation styles in `src/styles/globals.css`
- [x] T017 Create dashboard state hook for selected week, selected project, and refresh behavior in `src/hooks/useDashboard.ts`
- [x] T018 Create shared edit-lock hook with save/cancel/timeout handling in `src/hooks/useEditLock.ts`
- [x] T019 Create base dashboard shell and main layout regions in `src/App.tsx` and `src/App.css`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Select Week and Project to View QA Status (Priority: P1) 🎯 MVP

**Goal**: Users can select a reporting week and project/module, and maintain weeks/projects through bilingual manual-entry flows.

**Independent Test**: Load the dashboard, confirm bilingual header and selectors render, switch weeks and projects successfully, then create or edit a week/project through the maintenance UI and verify the selector data refreshes correctly.

### Tests for User Story 1 (MANDATORY — Constitution Principle II) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T020 [P] [US1] Create unit test for `src/components/Header/Header.tsx` in `tests/unit/components/Header.test.tsx`
- [x] T021 [P] [US1] Create unit test for `src/components/WeekSelector/WeekSelector.tsx` in `tests/unit/components/WeekSelector.test.tsx`
- [x] T022 [P] [US1] Create unit test for `src/components/ProjectNav/ProjectNav.tsx` in `tests/unit/components/ProjectNav.test.tsx`
- [x] T023 [P] [US1] Create unit test for `src/components/WeekForm/WeekForm.tsx` in `tests/unit/components/WeekForm.test.tsx`
- [x] T024 [P] [US1] Create unit test for `src/components/ProjectForm/ProjectForm.tsx` in `tests/unit/components/ProjectForm.test.tsx`
- [x] T025 [P] [US1] Create unit test for `src/api/weeks.ts` in `tests/unit/api/weeks.test.ts`
- [x] T026 [P] [US1] Create unit test for `src/api/projects.ts` in `tests/unit/api/projects.test.ts`
- [x] T027 [US1] Create integration test for week/project selection and refresh behavior in `tests/integration/dashboard-filter.test.tsx`
- [x] T028 [US1] Create integration test for week/project manual maintenance flow in `tests/integration/week-project-maintenance.test.tsx`

### Implementation for User Story 1

- [x] T029 [P] [US1] Create weeks data service in `src/api/weeks.ts`
- [x] T030 [P] [US1] Create projects data service in `src/api/projects.ts`
- [x] T031 [P] [US1] Create week selector state hook in `src/hooks/useWeeks.ts`
- [x] T032 [P] [US1] Create project selector state hook in `src/hooks/useProjects.ts`
- [x] T033 [P] [US1] Create bilingual header component in `src/components/Header/Header.tsx` with styles in `src/components/Header/Header.css`
- [x] T034 [P] [US1] Create bilingual week selector component in `src/components/WeekSelector/WeekSelector.tsx` with styles in `src/components/WeekSelector/WeekSelector.css`
- [x] T035 [P] [US1] Create bilingual project navigation component in `src/components/ProjectNav/ProjectNav.tsx` with styles in `src/components/ProjectNav/ProjectNav.css`
- [x] T036 [P] [US1] Create week maintenance form in `src/components/WeekForm/WeekForm.tsx` with styles in `src/components/WeekForm/WeekForm.css`
- [x] T037 [P] [US1] Create project maintenance form in `src/components/ProjectForm/ProjectForm.tsx` with styles in `src/components/ProjectForm/ProjectForm.css`
- [x] T038 [US1] Wire week and project selectors into `src/App.tsx`
- [x] T039 [US1] Wire week and project manual-entry forms into `src/App.tsx`
- [x] T040 [US1] Add selector and maintenance layout styling in `src/App.css`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Review Issue Trends and Test Automation Coverage (Priority: P1)

**Goal**: Users can review issue trends and test automation coverage for the selected project/week, and maintain issue/test-case records through bilingual manual-entry flows with duplicate prevention.

**Independent Test**: Select a project and confirm the issue history line chart and test case distribution pie chart update correctly; create or edit issue metrics and test case distribution records, then verify charts refresh and duplicate week/project records are not created.

### Tests for User Story 2 (MANDATORY — Constitution Principle II) ⚠️

- [x] T041 [P] [US2] Create unit test for `src/components/IssueHistoryChart/IssueHistoryChart.tsx` in `tests/unit/components/IssueHistoryChart.test.tsx`
- [x] T042 [P] [US2] Create unit test for `src/components/TestCaseDistributionChart/TestCaseDistributionChart.tsx` in `tests/unit/components/TestCaseDistributionChart.test.tsx`
- [x] T043 [P] [US2] Create unit test for `src/components/IssueMetricForm/IssueMetricForm.tsx` in `tests/unit/components/IssueMetricForm.test.tsx`
- [x] T044 [P] [US2] Create unit test for `src/components/TestCaseDistributionForm/TestCaseDistributionForm.tsx` in `tests/unit/components/TestCaseDistributionForm.test.tsx`
- [x] T045 [P] [US2] Create unit test for `src/api/issues.ts` in `tests/unit/api/issues.test.ts`
- [x] T046 [P] [US2] Create unit test for `src/api/testCases.ts` in `tests/unit/api/testCases.test.ts`
- [x] T047 [US2] Create integration test for chart rendering and empty states in `tests/integration/charts.test.tsx`
- [x] T048 [US2] Create integration test for issue/test-case maintenance and duplicate prevention in `tests/integration/metrics-maintenance.test.tsx`

### Implementation for User Story 2

- [x] T049 [P] [US2] Create issue metrics data service in `src/api/issues.ts`
- [x] T050 [P] [US2] Create test case distribution data service in `src/api/testCases.ts`
- [x] T051 [P] [US2] Create issue history data hook in `src/hooks/useIssueHistory.ts`
- [x] T052 [P] [US2] Create test case distribution data hook in `src/hooks/useTestCaseDistribution.ts`
- [x] T053 [P] [US2] Create issue history chart component in `src/components/IssueHistoryChart/IssueHistoryChart.tsx` with styles in `src/components/IssueHistoryChart/IssueHistoryChart.css`
- [x] T054 [P] [US2] Create test case distribution chart component in `src/components/TestCaseDistributionChart/TestCaseDistributionChart.tsx` with styles in `src/components/TestCaseDistributionChart/TestCaseDistributionChart.css`
- [x] T055 [P] [US2] Create issue metrics maintenance form in `src/components/IssueMetricForm/IssueMetricForm.tsx` with styles in `src/components/IssueMetricForm/IssueMetricForm.css`
- [x] T056 [P] [US2] Create test case distribution maintenance form in `src/components/TestCaseDistributionForm/TestCaseDistributionForm.tsx` with styles in `src/components/TestCaseDistributionForm/TestCaseDistributionForm.css`
- [x] T057 [US2] Wire issue history and test case charts into `src/App.tsx`
- [x] T058 [US2] Wire issue/test-case maintenance forms into `src/App.tsx`
- [x] T059 [US2] Add center-column chart and maintenance layout styling in `src/App.css`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Review Release Readiness and Priority Notes (Priority: P2)

**Goal**: Users can review release records and priority notes for the selected project/week, and maintain those records through bilingual manual-entry flows with lock protection.

**Independent Test**: Select a week and project and confirm the release table and notes update correctly; create or edit a release or note, verify bilingual copy is shown, and confirm concurrent edits are blocked while an active lock exists.

### Tests for User Story 3 (MANDATORY — Constitution Principle II) ⚠️

- [x] T060 [P] [US3] Create unit test for `src/components/ReleaseTable/ReleaseTable.tsx` in `tests/unit/components/ReleaseTable.test.tsx`
- [x] T061 [P] [US3] Create unit test for `src/components/NotesSection/NotesSection.tsx` in `tests/unit/components/NotesSection.test.tsx`
- [x] T062 [P] [US3] Create unit test for `src/components/ReleaseForm/ReleaseForm.tsx` in `tests/unit/components/ReleaseForm.test.tsx`
- [x] T063 [P] [US3] Create unit test for `src/components/NoteForm/NoteForm.tsx` in `tests/unit/components/NoteForm.test.tsx`
- [x] T064 [P] [US3] Create unit test for `src/api/releases.ts` in `tests/unit/api/releases.test.ts`
- [x] T065 [P] [US3] Create unit test for `src/api/notes.ts` in `tests/unit/api/notes.test.ts`
- [x] T066 [P] [US3] Create unit test for `src/api/locks.ts` in `tests/unit/api/locks.test.ts`
- [x] T067 [US3] Create integration test for release table and notes rendering in `tests/integration/releases-notes.test.tsx`
- [x] T068 [US3] Create integration test for edit locking and 15-minute expiry behavior in `tests/integration/edit-locks.test.tsx`

### Implementation for User Story 3

- [x] T069 [P] [US3] Create release versions data service in `src/api/releases.ts`
- [x] T070 [P] [US3] Create notes data service in `src/api/notes.ts`
- [x] T071 [P] [US3] Create releases data hook in `src/hooks/useReleases.ts`
- [x] T072 [P] [US3] Create notes data hook in `src/hooks/useNotes.ts`
- [x] T073 [P] [US3] Create release table component in `src/components/ReleaseTable/ReleaseTable.tsx` with styles in `src/components/ReleaseTable/ReleaseTable.css`
- [x] T074 [P] [US3] Create priority notes component in `src/components/NotesSection/NotesSection.tsx` with styles in `src/components/NotesSection/NotesSection.css`
- [x] T075 [P] [US3] Create release maintenance form in `src/components/ReleaseForm/ReleaseForm.tsx` with styles in `src/components/ReleaseForm/ReleaseForm.css`
- [x] T076 [P] [US3] Create note maintenance form in `src/components/NoteForm/NoteForm.tsx` with styles in `src/components/NoteForm/NoteForm.css`
- [x] T077 [US3] Wire release table and notes section into `src/App.tsx`
- [x] T078 [US3] Wire release/note maintenance forms and lock handling into `src/App.tsx`
- [x] T079 [US3] Add right-column table, notes, and maintenance layout styling in `src/App.css`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T080 [P] Add responsive dashboard layout refinements in `src/App.css`
- [x] T081 [P] Add shared accessibility and bilingual copy assertions in `tests/unit/components/` test files
- [x] T082 [P] Add final validation for lock timeout and refresh fallback logic in `src/hooks/useDashboard.ts` and `src/hooks/useEditLock.ts`
- [x] T083 [P] Add final seed-data adjustments for realistic weekly scenarios in `db/seed.sql`
- [x] T084 Ensure all components use design-system tokens and avoid hardcoded styles across `src/components/` and `src/styles/`
- [ ] T085 Run full test suite with coverage via `package.json` scripts and capture >=80% coverage in CI config files
- [ ] T086 Run end-to-end quickstart validation steps against `specs/001-weekly-qa-dashboard/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 delivers the primary MVP filter and maintenance context
  - US2 and US3 depend on US1 filter context in `src/App.tsx`, but their data modules and UI components can be developed in parallel after Phase 2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Establishes active week/project selection and week/project maintenance
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Requires selected week/project context from US1 when wiring into `src/App.tsx`
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Requires selected week/project context from US1 and shared edit-lock infrastructure from Phase 2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Data services before hooks
- Hooks before components
- Components before `src/App.tsx` integration
- Integration tests before story sign-off

### Parallel Opportunities

- All Setup tasks marked `[P]` can run in parallel
- Foundational tasks T006-T018 have broad parallelism after project bootstrap
- Within US1, APIs, hooks, and forms/components can be split across team members
- Within US2, the issue path and test-case path can be developed in parallel until `src/App.tsx` integration
- Within US3, the release path and notes path can be developed in parallel until `src/App.tsx` integration
- Cross-story parallelism: US2 and US3 feature work can proceed simultaneously once US1 selection context is defined

---

## Parallel Example: User Story 2

```bash
# Launch failing tests first for US2:
Task: "Create unit test for src/components/IssueHistoryChart/IssueHistoryChart.tsx in tests/unit/components/IssueHistoryChart.test.tsx"
Task: "Create unit test for src/components/TestCaseDistributionChart/TestCaseDistributionChart.tsx in tests/unit/components/TestCaseDistributionChart.test.tsx"
Task: "Create unit test for src/api/issues.ts in tests/unit/api/issues.test.ts"
Task: "Create unit test for src/api/testCases.ts in tests/unit/api/testCases.test.ts"

# Build the issue and test-case service paths in parallel:
Task: "Create issue metrics data service in src/api/issues.ts"
Task: "Create test case distribution data service in src/api/testCases.ts"
Task: "Create issue history data hook in src/hooks/useIssueHistory.ts"
Task: "Create test case distribution data hook in src/hooks/useTestCaseDistribution.ts"

# Build the two chart/form pairs in parallel:
Task: "Create issue history chart component in src/components/IssueHistoryChart/IssueHistoryChart.tsx"
Task: "Create issue metrics maintenance form in src/components/IssueMetricForm/IssueMetricForm.tsx"
Task: "Create test case distribution chart component in src/components/TestCaseDistributionChart/TestCaseDistributionChart.tsx"
Task: "Create test case distribution maintenance form in src/components/TestCaseDistributionForm/TestCaseDistributionForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm bilingual selectors, refresh behavior, and manual week/project maintenance work independently
5. Demo MVP if needed

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo MVP
3. Add User Story 2 → Test independently → Demo chart workflows and duplicate protection
4. Add User Story 3 → Test independently → Demo release/note flows and edit locking
5. Finish Polish → Validate quality gates and quickstart scenarios

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. After Phase 2:
   - Developer A: US1 selectors and week/project forms
   - Developer B: US2 issue/test-case charts and forms
   - Developer C: US3 release/note table, forms, and lock UX
3. Integrate all stories in `src/App.tsx` and validate with integration tests

---

## Notes

- Every task follows the required checklist format with task ID and file path
- `[P]` means different files and no dependency on unfinished sibling tasks
- Story-labeled tasks only appear inside story phases
- Manual-entry maintenance flows are included because they are required by the clarified spec
- Bilingual UI requirements are represented in shared copy tasks and story-specific UI tasks
- Edit-lock behavior is represented in schema, API, hook, form, and integration-test tasks
