# OpenWiki quickstart

Weekly QA Dashboard is a Vite + React + TypeScript application backed by a self-hosted Node/Express API and PostgreSQL. It tracks weekly QA status by week and project/module, including issue history, test-case distribution, release/version details, and priority notes. The app is authenticated; users can sign up and sign in before using the dashboard or maintenance forms.

## What this repository contains

- **Frontend SPA** in `src/` — the dashboard UI, auth screen, charts, tables, selectors, and maintenance forms.
- **API server** in `server/` — Express routes, authentication, validation, edit-lock enforcement, and database access.
- **Database schema** in `db/` — migrations and seed data for weeks, projects, metrics, releases, notes, locks, and users.
- **Tests** in `tests/` and `server/test/` — unit and integration coverage for the SPA and API.
- **Deployment support** in `Dockerfile`, `docker-compose.yml`, and `deploy/`.
- **Design system assets** in `sidi-design-system/` — required UI tokens and component guidance.

## High-level architecture

Browser → SPA → `/api` REST client → Express API → PostgreSQL.

The frontend keeps a strict layering: components call hooks, hooks call `src/api/*`, and the API client handles request envelopes and auth token storage. The backend serves `/api/health`, public auth routes, and protected data routes. Migrations run on API startup.

## Main product areas

1. **Weekly dashboard** — selectable week and project/module context, issue history chart, test-case distribution chart, releases table, and priority notes.
2. **Maintenance workflows** — create/edit weeks, projects, issue metrics, test coverage, releases, and notes.
3. **Authentication and access control** — self-service registration, login, JWT session handling, and authenticated edit-lock ownership.
4. **Data integrity** — zod validation, snake_case database fields, and server-side upserts for unique weekly/project records.

## Where to start

- `README.md` for the short operational overview.
- `src/App.tsx` for the dashboard composition and maintenance panel wiring.
- `server/src/app.ts` for route registration and auth boundaries.
- `db/migrations/001_initial_schema.sql` and `db/migrations/002_users.sql` for the persisted model.
- `tests/integration/` for user-facing flows and `tests/unit/` for lower-level behavior.

## OpenWiki map

- [Architecture](architecture.md) — application layering, auth, edit locks, and request flow.
- [Domain model](domain.md) — weeks, projects, metrics, releases, notes, and how the dashboard uses them.
- [Data and API](data-and-api.md) — tables, validation, REST routes, and API envelopes.
- [Testing and change guide](testing-and-change-guide.md) — how to change the system safely and what to test.

## Change guidance for future agents

- Keep business logic in the API and hooks, not inside presentational components.
- Preserve the `{ data, error }` API envelope pattern; callers expect requests not to throw.
- Treat `src/types/index.ts` and the SQL migrations as a pair; schema changes usually require both.
- Respect the SiDi design system tokens in `src/styles/globals.css` and `sidi-design-system/`.
- When working on editable records, check the lock flow in `src/hooks/useEditLock.ts` and `server/src/routes/locks.ts`.
