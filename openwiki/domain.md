# Domain model

## Business purpose

The app is a weekly QA reporting dashboard. It presents a week-by-week view of QA status for selected projects/modules and supports maintenance tasks for the underlying records.

The dashboard copy in `src/utils/copy.ts` identifies the user-facing sections as:

- Weeks
- Projects / modules
- Issue history
- Test case distribution
- Release / version table
- Priority notes

## Core entities

The canonical persisted shape is in `db/migrations/001_initial_schema.sql`, and the TypeScript view of those entities is in `src/types/index.ts`.

### Weeks

Weeks define the reporting calendar and are identified by:

- `week_number`
- `start_date`
- `end_date`
- `is_active`

Weeks are used to select the reporting context throughout the app. `useDashboard()` defaults to an active week when one exists.

### Projects / modules

Projects represent the selectable modules or project areas shown in the dashboard. They have:

- `code`
- `name`
- `description`
- `display_order`
- `is_active`

The project list is ordered by `display_order` and the dashboard prefers active projects.

### Issue metrics

Issue metrics track weekly quality flow per project:

- `reported_count`
- `fixed_count`

The database enforces uniqueness on `(week_id, project_id)`, and the server uses an upsert so saving the same week/project combination updates the existing record rather than creating duplicates.

`useIssueHistory()` loads the history for the selected project, and the chart in `src/components/IssueHistoryChart/IssueHistoryChart.tsx` visualizes it.

### Test-case distribution

This entity captures automated, pending automation, and not-automated counts for a given week/project pair. It also uses a unique `(week_id, project_id)` constraint and upsert behavior.

`TestCaseDistributionChart` is the main read-side consumer; `TestCaseDistributionForm` is the write-side maintenance form.

### Releases

Release versions describe a weekly/project release record with:

- `version`
- `date`
- `status`
- optional `critical_issues`
- optional `changelog`

The current UI lets users browse and edit existing release rows through the record picker in `src/App.tsx`.

### Notes

Priority notes are small text items tied to a week/project pair. They include:

- `priority` in `0 | 1 | 2`
- `note_text`
- optional `author`

The notes list is ordered by priority ascending, so lower numeric priority appears first.

### Edit locks

Edit locks are attached to a resource type and resource ID. They exist to prevent concurrent edits in the maintenance forms.

Important rules:

- a lock belongs to the authenticated user who holds it
- locks expire after 15 minutes of inactivity
- a live editor refreshes the lock through client heartbeat and activity
- other editors receive a 409 conflict while the lock is active

This behavior is reflected in both the hook and API tests.

### Users and authentication

`db/migrations/002_users.sql` adds the `users` table used by self-service signup and login. The auth flow returns a JWT and the sanitized user profile to the client.

## User workflows

### Read the dashboard

1. Sign in or register.
2. Select a week and project.
3. Review the charts, releases table, and notes panel.

### Maintain records

1. Switch to the relevant maintenance tab.
2. Choose an existing record or create a new one.
3. Edit via the form while the lock is held.
4. Save, which releases the lock and refreshes the surrounding data.

The recent `RecordPicker` addition in `src/App.tsx` makes releases and notes explicitly editable by choosing an existing row rather than always defaulting to the first one.
