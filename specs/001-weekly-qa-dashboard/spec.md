# Feature Specification: Weekly QA Dashboard

**Feature Branch**: `001-weekly-qa-dashboard`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "Create a Weekly QA Dashboard that reproduces the structure, information hierarchy, and functional behavior of the attached Power Apps screenshot."

## Clarifications

### Session 2026-07-07

- Q: How should duplicate weekly records for issue metrics and test case distribution be handled? → A: Allow only one record per week + project/module for issue metrics and test case distribution; edits update that single record.
- Q: What data maintenance method is required in v1? → A: Support manual entry in v1, with import explicitly out of scope for v1.
- Q: What language should the dashboard UI use in v1? → A: All dashboard UI text must be bilingual (English and Portuguese).
- Q: How should concurrent edits be handled in v1? → A: Lock the record while one user is editing it.
- Q: When should an edit lock be released? → A: Release the lock on save/cancel, and auto-expire it after 15 minutes of inactivity.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Week and Project to View QA Status (Priority: P1)

As a QA manager, I want to select a reporting week and a project/module so that I can review QA status for that specific period and scope.

**Why this priority**: Week and project selection are the primary filters that drive all dashboard content. Without this, no data can be explored.

**Independent Test**: Can be fully tested by loading the dashboard, selecting a week from the horizontal selector, selecting a project from the left navigation, and confirming all charts, tables, and notes update accordingly.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** I click a week in the horizontal week selector, **Then** all dashboard sections refresh to show data for that week.
2. **Given** a week is selected, **When** I click a project/module in the left navigation, **Then** all dashboard sections refresh to show data for that project/module within the selected week.
3. **Given** no week is selected, **When** the dashboard loads, **Then** the most recent active week is selected by default and data is shown for that week.
4. **Given** data exists for multiple weeks, **When** I switch between weeks, **Then** the Issue History chart updates to show historical data across the visible week range.

---

### User Story 2 - Review Issue Trends and Test Automation Coverage (Priority: P1)

As a QA lead, I want to compare reported and fixed issues across weeks and see automation distribution so that I can identify quality trends and understand automation coverage.

**Why this priority**: Issue tracking and automation visibility are the core analytical features of a QA dashboard. These provide immediate value for QA leads making decisions.

**Independent Test**: Can be fully tested by selecting a project, viewing the Issue History chart to confirm green (fixed) and red (reported) series are visible, and viewing the Test Case Distribution pie chart to confirm the three automation categories are displayed.

**Acceptance Scenarios**:

1. **Given** issue history data exists for the selected project, **When** the dashboard loads, **Then** the Issue History chart displays a line chart with Fixed Issues (green) and Reported Issues (red) across weeks.
2. **Given** test case data exists for the selected week and project, **When** the dashboard loads, **Then** the Test Case Distribution pie chart shows Automated, Pending Automation, and Not Automated categories with counts.
3. **Given** no issue data exists for the selected project, **When** the dashboard loads, **Then** the Issue History area shows an empty-state message instead of a chart with zero values.
4. **Given** no test case data exists for the selected week and project, **When** the dashboard loads, **Then** the Test Case Distribution area shows an empty-state message.

---

### User Story 3 - Review Release Readiness and Priority Notes (Priority: P2)

As a release stakeholder, I want to see version information, critical issues, changelogs, and priority notes so that I can understand release readiness and identify urgent QA risks.

**Why this priority**: Release information and priority notes add significant value but depend on the week/project filter being functional first.

**Independent Test**: Can be fully tested by selecting a week and project, then confirming the release/version table shows VERSION, DATE2, STATUS, CRITICAL ISSUES, and CHANGELOG columns, and that notes are displayed in priority order with correct color coding.

**Acceptance Scenarios**:

1. **Given** release data exists for the selected week and project, **When** the dashboard loads, **Then** the release/version table displays records with VERSION, DATE2, STATUS, CRITICAL ISSUES, and CHANGELOG columns.
2. **Given** no release data exists for the selected week and project, **When** the dashboard loads, **Then** the table area shows "Não foi possível localizar dados para mostrar no momento".
3. **Given** notes exist for the selected week and project, **When** the dashboard loads, **Then** notes are displayed sorted by priority with Priority 0 (red), Priority 1 (orange), and Priority 2 (yellow/gold).
4. **Given** no notes exist for the selected week and project, **When** the dashboard loads, **Then** the notes section shows a clear empty-state message.

---

### Edge Cases

- What happens when both a week and project are selected but one has data and the other does not? Each section displays its own empty state independently without breaking layout.
- What happens when a user selects an inactive week or project? The dashboard falls back to the most recent active week and the first active project/module after a refresh.
- What happens if duplicate issue or test case records exist for the same week and project? The system prevents duplicates and requires users to update the existing record for that week and project/module.
- What happens if negative counts are entered for issues, test cases, or other numeric fields? The system rejects the data with validation feedback.
- What happens when the changelog text is very long? The table layout remains readable without breaking.
- What happens when all dashboard sections have no data? Each section independently shows its empty state and the overall layout remains stable.
- What happens when the dashboard shows labels, headings, and messages? The interface presents bilingual English and Portuguese text in v1, including empty states and maintenance flows.
- What happens when two users try to edit the same record at the same time? The system locks the record while one user is editing it and blocks concurrent edits until the lock is released.
- What happens when a user abandons an edit or closes the browser? The record lock is released on save or cancel, and any inactive lock expires after 15 minutes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a full-width header with the title "WEEKLY REPORT" centered and prominent.
- **FR-001a**: System MUST present dashboard labels, headings, messages, and maintenance-flow text in both English and Portuguese in v1.
- **FR-002**: System MUST display a horizontal week selector below the header showing week numbers and date ranges.
- **FR-003**: System MUST allow users to select a week from the selector, filtering all dashboard data to that week.
- **FR-004**: System MUST clearly indicate which week is currently selected.
- **FR-005**: System MUST display a vertical list of QA projects/modules on the left side, each with an icon/visual marker, project code, description, and navigation indicator.
- **FR-006**: System MUST allow users to select a project/module from the list, filtering dashboard content to that project/module within the selected week.
- **FR-007**: System MUST visually highlight the selected project/module with a blue accent or border.
- **FR-008**: System MUST display an Issue History line chart comparing Fixed Issues (green) and Reported Issues (red) across weeks.
- **FR-009**: System MUST show historical issue values across the visible week range, not only the selected week.
- **FR-010**: System MUST display a legend identifying Fixed Issues and Reported Issues on the Issue History chart.
- **FR-011**: System MUST show an empty-state message in the Issue History area when no issue data exists.
- **FR-012**: System MUST display a Test Case Distribution pie chart showing Automated, Pending Automation, and Not Automated categories with counts.
- **FR-013**: System MUST display a legend identifying each category on the Test Case Distribution chart.
- **FR-014**: System MUST show an empty-state message in the Test Case Distribution area when no test case data exists.
- **FR-015**: System MUST display a release/version table on the top-right with columns: VERSION, DATE2, STATUS, CRITICAL ISSUES, CHANGELOG.
- **FR-016**: System MUST show "Não foi possível localizar dados para mostrar no momento" in the table area when no release data exists.
- **FR-016a**: System MUST preserve Portuguese messaging alongside English text in empty states and supporting UI copy.
- **FR-017**: System MUST display notes on the right side below the release table, grouped by priority with color differentiation: Priority 0 (red), Priority 1 (orange), Priority 2 (yellow/gold).
- **FR-018**: System MUST sort notes by priority with Priority 0 first, then Priority 1, then Priority 2.
- **FR-019**: System MUST show an empty-state message in the notes section when no notes exist.
- **FR-020**: System MUST support creating, editing, and maintaining weekly reporting periods with week number, start date, end date, and active/inactive status.
- **FR-021**: System MUST support creating, editing, and maintaining QA projects/modules with project code, name, display order, and active/inactive status.
- **FR-022**: System MUST support manually entering and editing weekly issue metrics for each project/module including reported and fixed issue counts.
- **FR-022a**: System MUST allow only one issue metrics record per week and project/module; subsequent changes MUST update the existing record instead of creating a duplicate.
- **FR-023**: System MUST prevent negative issue counts through data validation.
- **FR-024**: System MUST support manually entering and editing test case counts per week and project/module (automated, pending automation, not automated).
- **FR-024a**: System MUST allow only one test case distribution record per week and project/module; subsequent changes MUST update the existing record instead of creating a duplicate.
- **FR-025**: System MUST prevent negative test case counts through data validation.
- **FR-026**: System MUST support manually entering and editing release/version information per week and project/module (version, date, status, critical issues, changelog).
- **FR-027**: System MUST support manually entering and editing notes per week and project/module with priority level (0, 1, 2), note text, created date, and optional author.
- **FR-028**: System MUST prevent empty notes from being saved.
- **FR-029**: System MUST handle missing data independently per section without breaking the overall layout.
- **FR-030**: System MUST preserve selected week and project/module after data refresh, falling back to defaults if the selections are no longer active.
- **FR-031**: CSV import and other bulk import mechanisms are out of scope for v1.
- **FR-032**: System MUST lock a maintenance record while one user is editing it and prevent another user from editing the same record concurrently.
- **FR-033**: System MUST release an edit lock when the user saves or cancels, and MUST automatically expire the lock after 15 minutes of inactivity.

### Key Entities

- **Week**: A reporting period with week number, start date, end date, and active/inactive status. Used to filter all dashboard data by time period.
- **Project/Module**: A QA project or module with code, name, display order, and active/inactive status. Represents the scope entity for all dashboard metrics.
- **Issue Metric**: Weekly issue counts (reported, fixed) for a specific week and project/module. Drives the Issue History chart.
- **Test Case Distribution**: Weekly test case counts (automated, pending automation, not automated) for a specific week and project/module. Drives the Test Case Distribution chart.
- **Release/Version**: A release record (version, date, status, critical issues, changelog) linked to a week and project/module. Displayed in the release table.
- **Note**: A priority-level note (priority 0/1/2, text, created date, optional author) linked to a week and project/module. Displayed in the notes section.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the full weekly review workflow (select week, select project, view all four data sections) in under 30 seconds on first use.
- **SC-002**: The dashboard loads and displays complete data within 2 seconds of selecting a week or project filter.
- **SC-003**: All four data sections (Issue History, Test Case Distribution, Release/Version table, Notes) display correctly with independent empty-state handling when data is missing.
- **SC-004**: The dashboard remains stable and usable with at least 10 active weeks, 10 active projects/modules, and 100 combined data records across all entity types.
- **SC-005**: Users can enter or import data for all six entity types (weeks, projects, issue metrics, test case distributions, releases, notes) without requiring technical assistance.
- **SC-006**: The dashboard layout matches the reference screenshot structure: top header, week selector, left project navigation, central charts, right-side release table and notes.
- **SC-007**: When two maintainers target the same record, only one edit session remains active at a time, and abandoned locks clear automatically within 15 minutes.

## Assumptions

- The reference Power Apps screenshot represents the target layout and information hierarchy; exact pixel-level replication is not required as long as the same structural layout is achieved.
- Data entry is performed through a form-based interface (either inline or separate maintenance screens) rather than direct database manipulation.
- Manual entry is the only required data maintenance method in v1; import capabilities are intentionally deferred.
- The dashboard is a web-based application accessible via standard modern browsers.
- Users have a reliable internet connection for loading the dashboard and any data dependencies.
- Week numbering follows the ISO week date system (Week 1 is the week containing the first Thursday of the year).
- The date format displayed is DD/MM/YYYY as shown in the example (02/07/2026 - 07/07/2026).
- The bilingual presentation may show English and Portuguese copy together in the same view rather than requiring a language switch in v1.
- Data persistence is managed by the underlying system; the specification focuses on dashboard behavior and data flows.
- The green color for Fixed Issues and red color for Reported Issues are the standard semantic status colors as defined in the project design system.
