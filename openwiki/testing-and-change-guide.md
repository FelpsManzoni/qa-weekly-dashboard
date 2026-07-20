# Testing and change guide

## What is already covered

The repository has both frontend and backend tests:

- `tests/unit/api/*` for API wrappers
- `tests/unit/components/*` for render and interaction behavior
- `tests/unit/hooks/*` for stateful hook logic
- `tests/unit/utils/*` for validation helpers
- `tests/integration/*` for user-level dashboard flows
- `server/test/server.test.ts` for server routes and auth/lock behavior

The current config also keeps the test environment heavy enough for the SPA and API code paths.

## Useful commands

From the repository root:

```bash
npm run lint
npm run build
npm test
npm run coverage
```

For backend-only work:

```bash
cd server && npm test
```

## What to check when changing major areas

### Auth and session code

Touchpoints:

- `src/hooks/useAuth.tsx`
- `src/components/Auth/AuthScreen.tsx`
- `src/api/auth.ts`
- `server/src/routes/auth.ts`
- `server/src/auth.ts`

Risks:

- token bootstrap and logout behavior
- 401 handling through the unauthorized callback
- keeping the returned user shape consistent between server and client

### Edit-lock behavior

Touchpoints:

- `src/hooks/useEditLock.ts`
- `src/api/locks.ts`
- `server/src/routes/locks.ts`
- maintenance forms in `src/components/forms.tsx`

Risks:

- lock ownership must remain tied to the authenticated user
- activity/heartbeat timing must stay below the 15-minute server expiry
- existing save flows release the lock after a successful write

### Dashboard selection and filtering

Touchpoints:

- `src/hooks/useDashboard.ts`
- `src/hooks/useIssueHistory.ts`
- `src/hooks/useWeeks.ts`
- `src/hooks/useProjects.ts`
- `src/App.tsx`

Risks:

- active week/project fallback behavior
- stale selections when records are deactivated or deleted
- chart queries that depend on the selected week context

### Maintenance forms

Touchpoints:

- `src/components/forms.tsx`
- `src/api/weeks.ts`
- `src/api/projects.ts`
- `src/api/issues.ts`
- `src/api/testCases.ts`
- `src/api/releases.ts`
- `src/api/notes.ts`

Risks:

- record picker behavior for releases and notes
- keeping validation aligned with server schemas
- remembering that issue/test-case records are keyed by week + project

### Schema changes

Touchpoints:

- `db/migrations/*.sql`
- `server/src/validation.ts`
- `src/utils/validation.ts`
- `src/types/index.ts`
- matching `src/api/*` wrappers
- matching tests

Risks:

- snake_case fields are used across the stack
- the frontend types mirror database columns closely
- upsert behavior depends on the unique constraints in the schema

## Recent implementation context to keep in mind

The latest commit history shows the MVP was completed in two major stages: the initial feature build and a follow-up that added auth and maintenance refinements. The current uncommitted work continues that direction by reorganizing forms and adding more focused tests. When changing this area, prefer incremental edits that preserve the current layering rather than introducing direct component-to-fetch coupling.

## Good defaults for future agents

- Read `README.md` and `CLAUDE.md` before editing behavior.
- Prefer updating the source of truth rather than patching around a failing test.
- Add or adjust tests near the affected layer.
- Re-run at least `npm test` and, for cross-cutting changes, `npm run build`.
