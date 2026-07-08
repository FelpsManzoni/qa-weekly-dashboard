# Architecture

## System shape

The repository is split into three runtime layers:

- **Frontend SPA** in `src/`, built with Vite + React + TypeScript.
- **API server** in `server/`, built with Express, `pg`, JWT authentication, bcrypt password hashing, and zod validation.
- **PostgreSQL database** in `db/migrations/` and `db/seed.sql`.

The main data path is:

`component → hook → src/api/* → HTTP → server/src/routes/* → PostgreSQL`

The repo’s own README describes the same top-level architecture, and `CLAUDE.md` adds the stricter code conventions that current work should preserve.

## Frontend architecture

`src/App.tsx` is the top-level composition point. It wires together:

- `useAuth()` for session state
- `useWeeks()` and `useProjects()` for selectable context
- `useDashboard()` for selected week/project and active maintenance tab
- `useIssueHistory()`, `useTestCaseDistribution()`, `useReleases()`, and `useNotes()` for data loading
- `IssueMetricForm`, `TestCaseDistributionForm`, `ReleaseForm`, `NoteForm`, `WeekForm`, and `ProjectForm` for maintenance

`src/main.tsx` gates the app behind `AuthProvider` and `AuthScreen`. That means the dashboard is intentionally inaccessible until authentication succeeds.

### Data fetching conventions

`src/api/client.ts` centralizes fetch behavior:

- stores the auth token in localStorage
- adds `Authorization: Bearer ...` when a token exists
- normalizes every request into `{ data, error }`
- invokes a registered unauthorized handler on 401 responses
- returns `null` data on 204 responses
- exposes `queryString()` for optional request parameters

Because API helpers never throw, hooks own the error translation. That pattern is important for existing tests and UI rendering states.

`src/hooks/useAsyncData.ts` is the shared async state primitive. It tracks loading/error/data and refresh behavior, and it expects stable loader identities. Several hooks memoize their loaders with `useCallback` specifically to avoid refresh loops.

### Auth and session handling

`src/hooks/useAuth.tsx` owns session bootstrap and logout behavior:

- if a token exists, it validates it with `/api/auth/me`
- login and registration store the returned token and user
- any 401 from the API forces a logout via the unauthorized handler

`src/components/Auth/AuthScreen.tsx` renders the sign-in / sign-up form used before the app is available.

### Edit-lock flow

`src/hooks/useEditLock.ts` coordinates the client side of record locking:

- acquires a lock when editing an existing record
- refreshes the lock on a heartbeat and recent activity
- releases the lock on save or unmount
- surfaces the server’s lock conflict as a user-visible message

The lock policy is mirrored server-side in `server/src/routes/locks.ts`. Locks are owned by the authenticated user and expire after 15 minutes of inactivity.

### UI conventions

The application uses the SiDi design system via `src/styles/globals.css` and the `sidi-design-system/` directory. `CLAUDE.md` treats that design system as mandatory, so future UI changes should avoid hardcoded spacing/color values and use the established tokens.

## Backend architecture

`server/src/app.ts` constructs the Express app and mounts routes under `/api`.

Important boundaries:

- `/api/health` is public
- `/api/auth/*` is public for registration, login, and current-user checks
- all data routes require `requireAuth`

`server/src/index.ts` runs migrations before starting the server and optionally loads seed data.

`server/src/auth.ts` is responsible for:

- bcrypt password hashing and verification
- JWT signing and verification
- rejecting unauthenticated requests with consistent error payloads

`server/src/http.ts` provides the shared error handling behavior, including API error shaping and validation mapping.

## Why the architecture matters

The recent code changes show a deliberate move toward a fuller product workflow: authenticated users, editable records, maintained audit-like locks, and a record picker for editing existing releases and notes. The structure keeps those concerns isolated so the dashboard UI stays mostly presentational while stateful rules remain in hooks and the API.
