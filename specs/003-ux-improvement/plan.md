# Implementation Plan: UX Improvement and Data Workflow Restructure

**Status:** Ready for implementation (handover doc)  
**Date:** 2026-07-08  
**Input spec:** [specs.md](./specs.md)

## 1. Goal

Restructure the current dashboard so the main page is dashboard-only, move maintenance into a collapsible left menu with separate work areas, fix the week-selection behavior to use only real project data inside a rolling one-year window, expand project metadata, consolidate project data editing into a single save flow, and correct the dark mode / language / notes / release UX details described in `specs.md`.

## 2. Current-state facts

### 2.1 Dashboard shell does not match the requested UX yet

- [`src/App.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/App.tsx) renders the dashboard and the maintenance forms in the same page.
- [`src/App.css`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/App.css) lays out an inline `maintenance-panel` under the dashboard rather than a separate left-menu workflow.
- `useDashboard()` currently uses `activePanel` to swap inline forms; there is no concept of app sections like `dashboard`, `projects`, or `project-data`.

### 2.2 Weeks are modeled too simply for the new rules

- [`db/migrations/001_initial_schema.sql`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/db/migrations/001_initial_schema.sql) stores weeks with a globally unique `week_number`.
- That schema cannot represent multiple years of week 1..53 correctly, and it cannot reliably enforce “show only the last 1 year of data”.
- [`server/src/routes/weeks.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/server/src/routes/weeks.ts) returns all weeks ordered by `week_number desc`, not by actual recency.
- [`src/hooks/useWeeks.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/hooks/useWeeks.ts) only filters on `is_active`; it does not limit to 1 year or to weeks that contain dashboard data.

### 2.3 Project data model is missing required fields

- `projects` currently contains only `code`, `name`, `description`, `display_order`, and `is_active`.
- The spec requires new fields: `lead_qa_user_id`, `client`, and `main_technology_scope`.
- The `lead_qa_user_id` requirement implies a foreign-key relationship to authenticated users from `db/migrations/002_users.sql`.

### 2.4 Project maintenance flow does not match the requested UX

- [`src/components/forms.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/forms.tsx) renders `ProjectForm` inline rather than in an overlay.
- There is no “list all projects” page with Add/Edit pop-out modals.
- There is no read API for users that would let the frontend populate a “Lead QA” selector.

### 2.5 “Project Data” is split into four independent maintenance flows

- Issue metrics, test coverage, releases, and notes are edited through separate inline forms.
- Saves happen per form, not from one page-level Save button.
- There is no consolidated page state for `{ project, week, issue metrics, test coverage, releases, notes }`.

### 2.6 Release model and UI do not match the requested business rules

- [`src/types/index.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/types/index.ts) defines `ReleaseVersion` with `date`, `status`, `critical_issues`, and `changelog`.
- The spec requires four statuses only: `Approved`, `Failed`, `Conditionally Approved`, `Blocked`.
- The spec requires issue counts by categories `A`, `B`, `C`, and a separate long-text release notes field.
- [`src/components/ReleaseTable/ReleaseTable.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/ReleaseTable/ReleaseTable.tsx) currently renders raw text columns, includes a `DATE2` header bug, and does not support a notes overlay.

### 2.7 Notes dashboard presentation needs a structural change

- [`src/components/NotesSection/NotesSection.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/NotesSection/NotesSection.tsx) repeats `NOTES:` inside each note item.
- The spec wants one `NOTES` title only, then grouped colored priority blocks containing sequential note lists.

### 2.8 Theme/language support exists, but specific UX fixes are still needed

- [`src/hooks/usePreferences.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/hooks/usePreferences.tsx) and [`src/components/PreferencesControls/PreferencesControls.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/PreferencesControls/PreferencesControls.tsx) already provide theme and language toggles.
- The theme button icon currently shows the target state, not the current state.
- The language button currently shows `PT`/`EN` text, not the currently active language flag.
- Dark-mode contrast still needs a full pass on buttons and text.

## 3. Confirmed implementation decisions

1. Keep the app as a single Vite + React SPA without adding a routing library. Section navigation can be managed in local app state because the requested screens are few and already share data/hooks.
2. Preserve the existing API envelope style and hook layering. New flows should still go `component -> hook/state -> src/api/* -> server routes`.
3. Add a new SQL migration instead of rewriting `001_initial_schema.sql`, because these changes alter persisted data and should be incremental.
4. Treat “weeks are counted Monday to Sunday” as the source-of-truth rule. Week records must validate that `start_date` is a Monday and `end_date` is the following Sunday.
5. Treat the 1-year retention rule as a display and fetch rule based on `start_date >= current_date - interval '1 year'`, not merely `is_active`.
6. Keep note priorities at `0 | 1 | 2` for now, because that is the current supported model and the spec only explicitly references `P0` as an example, not a new expanded priority taxonomy.

## 4. Required backend and data-model changes

### 4.1 New database migration

Create a new migration, for example `db/migrations/003_ux_workflow_updates.sql`, that:

- Adds `calendar_year integer not null` to `weeks`.
- Replaces the current uniqueness rule on `weeks.week_number` with a composite unique constraint on `(calendar_year, week_number)`, or alternatively a unique `start_date`. Either option is acceptable, but the migration must remove the “one week number for all time” limitation.
- Adds a check that `start_date` is Monday and `end_date = start_date + 6 days`.
- Adds `lead_qa_user_id uuid references users(id)`, `client varchar(255)`, and `main_technology_scope varchar(255)` to `projects`.
- Updates `release_versions` to support the new release structure:
  - `status` constrained to the four allowed values.
  - `issue_count_a integer not null default 0`
  - `issue_count_b integer not null default 0`
  - `issue_count_c integer not null default 0`
  - `release_notes text`
- Migrates existing `changelog` data into `release_notes` if present.
- Drops or deprecates `critical_issues` once the new structured counts exist.

### 4.2 Server validation updates

Update [`server/src/validation.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/server/src/validation.ts) to:

- Validate the new week rules:
  - `calendar_year`
  - Monday `start_date`
  - Sunday `end_date`
  - exact 7-day span
- Validate new project fields.
- Restrict release status to the four allowed values.
- Validate `issue_count_a/b/c` as non-negative integers.
- Validate `release_notes` as optional long text.

### 4.3 New or changed API routes

Update existing routes and add small supporting routes as needed:

- [`server/src/routes/weeks.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/server/src/routes/weeks.ts)
  - Return weeks ordered by actual recency, not plain `week_number`.
  - Filter to the rolling last year.
  - Optionally support a “dashboard-only” mode that returns only weeks with data for the selected project.
- [`server/src/routes/projects.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/server/src/routes/projects.ts)
  - Read/write the new project fields.
  - Return all projects for project-management screens, not just active ones.
- Add a lightweight authenticated users route such as `GET /api/users` so the frontend can populate the Lead QA selector.
- [`server/src/routes/releases.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/server/src/routes/releases.ts)
  - Read/write the new release fields.
  - Keep ordering by newest release date first.
- Consider adding one aggregate endpoint for the new Project Data page, for example `GET /api/project-data?project_id=&week_id=` returning `{ issueMetric, testCaseDistribution, releases, notes }`.
  - This is not strictly required, but it is the cleanest way to support a single page load and reduces orchestration complexity in the client.

## 5. Required frontend architecture changes

### 5.1 Replace the inline maintenance panel with an app shell

Refactor [`src/App.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/App.tsx) into an application shell that manages:

- A collapsible left side menu.
- Three top-level sections:
  - `dashboard`
  - `projects`
  - `project-data`
- Dashboard-specific selection state that stays visible only in the dashboard page.

Recommended shape:

- Create a new app-shell state hook such as `src/hooks/useAppSection.ts`.
- Move current inline maintenance rendering out of `App.tsx`.
- Introduce components similar to:
  - `src/components/AppShell/AppShell.tsx`
  - `src/components/SideMenu/SideMenu.tsx`
  - `src/components/ProjectsPage/ProjectsPage.tsx`
  - `src/components/ProjectDataPage/ProjectDataPage.tsx`

### 5.2 Dashboard page adjustments

The main dashboard view should render only:

- Header
- Week carousel selector
- Stacked project selector
- Dashboard visual content

That means:

- Remove the maintenance section from the dashboard page.
- Keep header actions: page title, logged-in user, refresh, logout.
- Ensure week and project selectors drive the dashboard data view only.

### 5.3 Week-selection behavior

Implement a project-aware week selector flow:

- On dashboard load, select the latest available week with data for the currently selected project.
- Show only weeks that have data for that selected project.
- Keep weeks ordered newest on the left, matching the spec.
- When week changes, refresh issue history, test distribution, releases, and notes.

This will require coordinated updates in:

- [`src/hooks/useWeeks.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/hooks/useWeeks.ts)
- [`src/hooks/useDashboard.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/hooks/useDashboard.ts)
- [`src/components/WeekSelector/WeekSelector.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/WeekSelector/WeekSelector.tsx)
- Possibly a new API helper for project-scoped week availability.

### 5.4 Projects management page

Implement a dedicated Projects page that:

- Lists all registered projects.
- Opens an overlay modal for “Add new”.
- Opens an overlay modal when clicking an existing project.
- Supports fields:
  - Code
  - Name
  - Description
  - Lead QA
  - Client
  - Main Technology Scope
  - Display order
  - Active flag

Recommended component split:

- `ProjectsPage.tsx` for the list and page state
- `ProjectModal.tsx` for add/edit overlay
- Reuse or evolve the current `ProjectForm` rather than duplicating form logic

### 5.5 Consolidated Project Data page

Implement a dedicated `Project Data` page with:

- Project dropdown selector
- Week dropdown selector
- Loaded sections for:
  - Issue metrics
  - Test coverage
  - Releases
  - Notes
- One page-level Save button that persists all edited sections together

Recommended state model:

- Load one page draft object for the selected project/week.
- Keep edits local until Save.
- On Save, submit the underlying resources in a controlled sequence:
  - issue metrics
  - test coverage
  - releases
  - notes
- If the backend keeps separate endpoints, wrap the page-level save in one hook such as `useProjectDataEditor`.

### 5.6 Releases UI changes

Update the release management and dashboard presentation to match the spec:

- Release table columns:
  - Release date (`dd/mm/yyyy`)
  - Version number
  - Status
  - Issues found (`A`, `B`, `C`)
  - Release notes button
- Render status as semantic badges with required colors:
  - Approved = green
  - Failed = red
  - Conditionally Approved = orange
  - Blocked = blue
- Replace inline long-text display with a notes overlay/modal opened from the table button.

Likely touched files:

- [`src/components/ReleaseTable/ReleaseTable.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/ReleaseTable/ReleaseTable.tsx)
- `src/components/ReleaseNotesModal/ReleaseNotesModal.tsx`
- Release form/editor fields in [`src/components/forms.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/forms.tsx) or its replacement in `ProjectDataPage`
- [`src/utils/dates.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/utils/dates.ts) for reliable `dd/mm/yyyy` formatting

### 5.7 Notes UI changes

Rework [`src/components/NotesSection/NotesSection.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/NotesSection/NotesSection.tsx) so it:

- Shows the title once.
- Groups notes by priority.
- Renders one colored priority block per group.
- Renders notes as sequential items inside each block.

### 5.8 Theme/language UX fixes

Update existing preference controls and dark styling:

- Theme button must display the current mode icon, not the opposite mode.
- Language control must display the active language using:
  - Brazil flag for Portuguese
  - USA flag for English
- Review dark-mode surfaces, button fills, and text contrast across:
  - Header
  - Side menu
  - Dashboard cards
  - Forms/modals
  - Table headers/cells

Main touchpoints:

- [`src/components/PreferencesControls/PreferencesControls.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/components/PreferencesControls/PreferencesControls.tsx)
- [`src/styles/globals.css`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/styles/globals.css)
- Component CSS files under `src/components/**`

## 6. Type and client updates

Update [`src/types/index.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/types/index.ts) to reflect:

- `Week.calendar_year`
- New project fields
- New release fields
- A typed `ReleaseStatus` union
- Optional aggregate type for the `Project Data` page payload

Update API clients in:

- [`src/api/weeks.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/api/weeks.ts)
- [`src/api/projects.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/api/projects.ts)
- [`src/api/releases.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/src/api/releases.ts)
- Add `src/api/users.ts` if the Lead QA picker uses a dedicated route
- Add `src/api/projectData.ts` if the aggregate endpoint is introduced

## 7. Implementation sequence

### Phase 1. Data model and contracts

1. Add the new DB migration.
2. Update server validation schemas.
3. Update affected API routes and add any missing support routes.
4. Update shared frontend types and API clients.

### Phase 2. App shell and navigation

1. Refactor `App.tsx` into shell + sections.
2. Add collapsible side menu.
3. Remove inline maintenance panel from the dashboard page.

### Phase 3. Weeks and dashboard behavior

1. Implement project-scoped week availability.
2. Enforce rolling one-year filtering.
3. Default to the latest week with data.
4. Verify Monday-to-Sunday labeling and display.

### Phase 4. Projects management

1. Build the projects list page.
2. Build add/edit modal flow.
3. Wire Lead QA user selection.

### Phase 5. Project Data page

1. Build the consolidated editor state.
2. Add project/week selectors.
3. Move issue metrics, test coverage, releases, and notes editing into this page.
4. Implement page-level Save behavior.

### Phase 6. UI polish and spec-specific fixes

1. Fix dark-mode icon and language flag display.
2. Rework notes section grouping.
3. Rework releases table and release-notes overlay.
4. Review dark-mode contrast.

## 8. Test plan

Update and add tests close to the affected layers.

### 8.1 Frontend unit/integration

- Update existing component tests for:
  - [`tests/unit/components/ReleaseTable.test.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/tests/unit/components/ReleaseTable.test.tsx)
  - [`tests/unit/components/NotesSection.test.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/tests/unit/components/NotesSection.test.tsx)
  - [`tests/unit/components/ProjectForm.test.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/tests/unit/components/ProjectForm.test.tsx)
  - [`tests/unit/components/WeekSelector.test.tsx`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/tests/unit/components/WeekSelector.test.tsx)
- Add tests for:
  - side menu open/close behavior
  - dashboard-only page composition
  - projects modal open/add/edit/cancel
  - project data page load/edit/save
  - release notes overlay
  - theme icon and language flag behavior

### 8.2 API and hook tests

- Update API wrapper tests for projects, weeks, releases, and any new aggregate endpoint.
- Add hook tests for:
  - project-scoped week selection
  - page-draft save orchestration on `Project Data`

### 8.3 Server tests

- Extend [`server/test/server.test.ts`](/Users/felpsmanzoni/Documents/Development/SiDi/qa-weekly-dashboard/server/test/server.test.ts) for:
  - new week validation rules
  - new project fields
  - restricted release statuses
  - release issue counts and release notes
  - new users lookup route if added

## 9. Verification commands

Run from repo root after implementation:

```bash
npm run lint
npm run build
npm test
cd server && npm test
```

## 10. Implementation risks and watchouts

1. The week schema change is the highest-risk item because it alters uniqueness and affects dashboard filtering, history queries, and seeded data.
2. The new consolidated Project Data save flow can create partial-write risk if it remains split across multiple endpoints. If that happens, the backend should expose one transactional aggregate save endpoint instead of relying on client-side sequencing.
3. The Lead QA field introduces a dependency on authenticated users existing in the database and being queryable by the frontend.
4. Dark-mode polishing must be checked visually across both auth and authenticated screens, because the preferences controls live outside the dashboard shell.

## 11. Files expected to change

### Database / server

- `db/migrations/003_ux_workflow_updates.sql` or equivalent new migration
- `db/seed.sql`
- `server/src/validation.ts`
- `server/src/routes/weeks.ts`
- `server/src/routes/projects.ts`
- `server/src/routes/releases.ts`
- `server/src/routes/issues.ts` if aggregate/project-scoped week logic is added there
- `server/src/routes/notes.ts` if aggregate save support is added
- `server/src/routes/testCases.ts` if aggregate save support is added
- `server/src/app.ts`
- `server/test/server.test.ts`

### Frontend

- `src/App.tsx`
- `src/App.css`
- `src/types/index.ts`
- `src/utils/dates.ts`
- `src/utils/copy.ts`
- `src/hooks/useDashboard.ts`
- `src/hooks/useWeeks.ts`
- `src/hooks/useProjects.ts`
- `src/hooks/usePreferences.tsx`
- `src/api/projects.ts`
- `src/api/weeks.ts`
- `src/api/releases.ts`
- `src/components/PreferencesControls/PreferencesControls.tsx`
- `src/components/WeekSelector/WeekSelector.tsx`
- `src/components/ProjectNav/ProjectNav.tsx`
- `src/components/ReleaseTable/ReleaseTable.tsx`
- `src/components/NotesSection/NotesSection.tsx`
- `src/components/forms.tsx` or the replacement forms split

### Likely new frontend files

- `src/components/SideMenu/*`
- `src/components/ProjectsPage/*`
- `src/components/ProjectDataPage/*`
- `src/components/Modal/*`
- `src/components/ReleaseNotesModal/*`
- `src/api/users.ts`
- `src/api/projectData.ts`
- `src/hooks/useProjectDataEditor.ts`
