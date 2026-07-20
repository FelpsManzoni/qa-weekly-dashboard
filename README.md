# qa-weekly-dashboard

Weekly QA dashboard — a Vite + React + TypeScript SPA backed by a self-hosted
Node/Express API and PostgreSQL. Shows issue history, test-case distribution,
releases, and priority notes per week and project/module. Access is gated behind
login (self-service signup); edit-locks are tied to the authenticated user.

## Architecture

```
Browser ─► web (nginx: serves the SPA, proxies /api) ─► api (Express + JWT) ─► db (Postgres)
```

- `src/` — React SPA. Data flows component → hook → `src/api/*` (REST) → API.
- `server/` — Express + `pg` API. Auth (JWT/bcrypt), validation (zod), edit-locks.
- `db/` — SQL migrations (run automatically on API startup) and seed data.
- `deploy/`, `Dockerfile`, `server/Dockerfile`, `docker-compose.yml` — containerized deploy.

## Deploy with Docker (recommended)

Everything runs in containers; no external services are required.

```bash
cp .env.example .env          # then edit POSTGRES_PASSWORD, JWT_SECRET, HOST_PORT
docker compose up -d --build
```

Open `http://<host>:<HOST_PORT>` (default `8080`), click **Create account**, and sign in.
The API applies migrations on first boot, so the schema is provisioned automatically.
To also load sample data on first boot, set `SEED_FILE=/app/db/seed.sql` in `.env`.
Data persists in the `db_data` volume across `docker compose restart`.

## Local development

```bash
# 1. Start Postgres (via Docker) and set env
docker compose up -d db
cp .env.example .env          # ensure DATABASE_URL points at localhost:5432

# 2. API
cd server && npm install && npm run dev     # http://localhost:3000

# 3. Frontend (new shell, repo root)
npm install && npm run dev                  # http://localhost:5173
```

With the API on a different origin, set `VITE_API_URL=http://localhost:3000/api` (frontend)
and `CORS_ORIGINS=http://localhost:5173` (API) in `.env`.

### Database scripts (manual)

```bash
npm run db:migrate    # apply db/migrations against DATABASE_URL
npm run db:seed       # load db/seed.sql
```

## Quality gates

```bash
npm run lint          # eslint
npm run build         # typecheck + vite build
npm run coverage      # vitest with ≥80% thresholds
cd server && npm test # API/route tests
```
