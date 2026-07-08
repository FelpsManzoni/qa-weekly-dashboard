# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Weekly QA Dashboard — a Vite + React + TypeScript SPA backed by a **self-hosted Node/Express
API and PostgreSQL** (in `server/`). Reproduces a Power Apps QA report: week selector,
project/module nav, Issue History line chart, Test Case Distribution pie chart, release/version
table, and priority notes. The whole app is gated behind login (self-service signup). UI is
bilingual (English / Portuguese). The stack runs in Docker: nginx serves the SPA and proxies
`/api` to the API, which talks to Postgres.

## Commands

Frontend (repo root):

```bash
npm run dev          # Vite dev server (:5173)
npm run build        # type-check (app + node tsconfigs) then vite build
npm run lint         # eslint over .ts/.tsx (server/ is excluded — it has its own typecheck)
npm test             # vitest run (single pass)
npm run coverage     # vitest with v8 coverage — thresholds enforced at 80% (all metrics)
npm run db:migrate   # apply db/migrations via DATABASE_URL (manual; API also auto-migrates)
npm run db:seed      # apply db/seed.sql via DATABASE_URL
```

Backend (`cd server`): `npm run dev` (tsx watch, :3000), `npm run build`, `npm test`,
`npm run typecheck`.

Docker (repo root): `docker compose up -d --build` brings up db + api + web; open
`http://<host>:${HOST_PORT:-8080}`.

Run a single test: `npx vitest run tests/integration/edit-locks.test.tsx` or
`npx vitest run -t "acquires a lock"`. The suite runs with the `forks` pool (see
`vite.config.ts`).

## Environment

Copy `.env.example` to `.env`.

- **Frontend (browser, Vite-exposed)**: `VITE_API_URL` — API base URL. Defaults to same-origin
  `/api` (the Docker/nginx setup). Only `VITE_`-prefixed vars reach client code.
- **Backend (`server/`) + db scripts**: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGINS`.
- **Docker Compose**: `POSTGRES_*`, `HOST_PORT`, `SEED_FILE` (set to `/app/db/seed.sql` to seed
  on first boot).

## Architecture

Strict layered stack. Data flows **component → hook → `src/api/*` (REST) → API server → Postgres**.
Never call `fetch` or the API directly from a component.

**`src/api/`** — data access layer. `client.ts` owns the fetch wrapper (`apiGet/apiPost/apiPut/
apiDelete`, plus `queryString`, the auth-token store, and the 401 handler). Every call returns
`{ data, error }` (`ApiListResponse` / `ApiItemResponse`) and **never throws**. Per-entity
modules (`weeks.ts`, `projects.ts`, `issues.ts`, `testCases.ts`, `releases.ts`, `notes.ts`,
`locks.ts`, `auth.ts`) call specific REST endpoints and keep the `{ data, error }` shape.

**`src/hooks/`** — state layer. `useAsyncData` is the base primitive: wraps a loader, tracks
`{ data, isLoading, error }`, exposes `refresh`. **Loaders passed to it MUST be memoized**
(`useCallback`) — an unstable loader identity causes an infinite refresh loop (this bit the
original code; see the comment in `useAsyncData.ts`). `useDashboard` holds selection state;
`useAuth` (a context provider) holds the session; `useEditLock` handles edit-locking + heartbeat.

**`server/`** — Express + `pg` API (TypeScript, own package.json). `app.ts` mounts routes under
`/api`; all except `/api/auth/*` require a JWT (`requireAuth`). Auth = bcrypt + JWT. Validation
via zod (`validation.ts`) mirrors `src/utils/validation.ts`. Migrations run automatically on
startup (`migrate.ts`). Errors go through the central `errorHandler` (`http.ts`), which maps zod
→ 400 and Postgres unique-violation → 409.

**`src/components/`** — presentational; each is a folder with colocated `.tsx` + `.css`. The six
maintenance forms all live in `src/components/forms.tsx` (imported directly from there).
`App.tsx` wires hooks together and passes a shared `refreshAll()` as `onSaved`/`onRefresh`.
`main.tsx` gates `<App/>` behind `<AuthScreen/>` via the `AuthProvider`.

**`src/types/index.ts`** — single source of truth for entity + API-envelope types. DB columns are
snake_case; types mirror them exactly (`week_id`, `reported_count`).

### Edit locks

Guarded by the `edit_locks` table (`api/locks.ts` + `useEditLock`, enforced server-side in
`server/src/routes/locks.ts`). Keyed by `(resource_type, resource_id)`; **owner is the
authenticated user**. 15-minute expiry, refreshed by a client heartbeat (interval + throttled
activity). All six forms acquire a lock when editing an existing record and block save on
`lock.error`.

### Database

Migrations in `db/migrations/` (Postgres, `pgcrypto`). Tables: `weeks`, `projects`,
`issue_metrics`, `test_case_distributions`, `release_versions`, `notes`, `edit_locks`, `users`.
`issue_metrics` and `test_case_distributions` are unique on `(week_id, project_id)` — the API
upserts with `ON CONFLICT (week_id, project_id)`. Changing types in `src/types/` usually means a
matching migration + a `server/` route/schema change.

## Design system (mandatory)

All UI MUST use the SiDi Design System in `sidi-design-system/`. `src/styles/globals.css`
imports `sidi-design-system/project/styles.css`, which defines the CSS custom properties.
**Never hardcode colors, spacing, radii, shadows, or fonts** — use tokens (`--brand-primary`,
`--text-primary`, `--surface-page`, `--space-*`, `--radius-*`, `--font-body`, `--font-display`,
status tokens). No emoji, no gradient backgrounds. Read `sidi-design-system/project/SKILL.md`
and `README.md` before UI work.

## Conventions

- **Bilingual copy** lives in `src/utils/copy.ts` as `{ en, pt }` `BilingualText`. Render
  with `bilingualText()` (`"English / Português"`). Do not inline user-facing strings in
  components — add them to `copy.ts`.
- API functions never throw; propagate the `{ data, error }` envelope up to the hook layer.
- Match snake_case DB field names in TypeScript types exactly.

## Spec-driven workflow

This repo uses Spec Kit. The feature spec, plan, data model, and tasks live under
`specs/001-weekly-qa-dashboard/`. The project **constitution**
(`.specify/memory/constitution.md`) is binding: Code Quality, Testing Standards (≥80%
coverage, NON-NEGOTIABLE), UX Consistency, Performance (≤2s interactive render), and Design
System Adherence. Consult the plan and constitution before large changes. `AGENTS.md` simply
points here.

## OpenWiki

This repository has documentation located in the /openwiki directory.

Start here:
- [OpenWiki quickstart](openwiki/quickstart.md)

OpenWiki includes repository overview, architecture notes, workflows, domain concepts, operations, integrations, testing guidance, and source maps.

When working in this repository, read the OpenWiki quickstart first, then follow its links to the relevant architecture, workflow, domain, operation, and testing notes.
