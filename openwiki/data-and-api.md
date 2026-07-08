# Data and API

## API response shape

`src/api/client.ts` standardizes all HTTP helpers into an envelope:

- `{ data, error }` for item and list responses
- 204 responses become `{ data: null, error: null }`
- 401 responses trigger the unauthorized handler in the auth context

This means UI code should expect API helpers to resolve rather than throw.

## Validation strategy

Validation is duplicated on purpose:

- frontend checks live in `src/utils/validation.ts`
- backend checks live in `server/src/validation.ts`

The server is the source of truth, but the frontend validates early so the forms can show immediate feedback.

Observed rules from the backend schemas:

- week numbers must be 1–53, and end dates must be after start dates
- project codes must be uppercase alphanumeric
- issue/test-case counts must be non-negative integers
- release version and status are required strings
- note priority is one of 0, 1, or 2
- lock resources require a resource type and UUID resource ID

## Database tables

The initial schema in `db/migrations/001_initial_schema.sql` creates:

- `weeks`
- `projects`
- `issue_metrics`
- `test_case_distributions`
- `release_versions`
- `notes`
- `edit_locks`

`db/migrations/002_users.sql` adds:

- `users`

Notable constraints:

- `weeks.week_number` is unique
- `issue_metrics` and `test_case_distributions` are unique by `(week_id, project_id)`
- notes require non-empty trimmed text
- edit locks are unique by `(resource_type, resource_id)`

## REST routes

Routes are mounted in `server/src/app.ts`.

### Public

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` with a valid JWT

### Protected

- `GET/POST/PUT/DELETE /api/weeks`
- `GET/POST/PUT/DELETE /api/projects`
- `GET/POST /api/issue-metrics`
- `GET/POST /api/test-case-distributions`
- `GET/POST/PUT/DELETE /api/releases`
- `GET/POST/PUT/DELETE /api/notes`
- `POST/PUT/DELETE /api/locks`

## Route behavior worth remembering

### Weeks and projects

These are the base selection tables. The frontend expects them in descending / ordered display order and uses them to keep the dashboard context valid.

### Issue metrics

`GET /api/issue-metrics` supports multiple modes:

- exact lookup by `project_id` + `week_id`
- history for a project
- history window around a selected week via `around_week_id`

The server returns history ordered by week number, which matches the chart expectations.

### Test-case distributions

The read route requires both week and project IDs. The write route upserts by `(week_id, project_id)`.

### Releases and notes

Both resources are scoped by week/project on read. Releases are ordered by date descending; notes are ordered by priority ascending.

### Locks

Locks are the concurrency control layer for edit forms. `POST /api/locks` acquires or refreshes a lock, `PUT /api/locks/:id` extends it, and `DELETE /api/locks/:id` releases it.

The server rejects a lock acquisition with 409 when another editor holds an unexpired lock.

## Data-model implications for change work

If you change an entity type in `src/types/index.ts`, check all three of these places together:

1. the SQL schema/migration
2. the zod schema in `server/src/validation.ts`
3. the corresponding API route and client wrapper

That coupling is deliberate and is what keeps the dashboard and API aligned.
