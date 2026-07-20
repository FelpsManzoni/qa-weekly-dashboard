# Quickstart: Weekly QA Dashboard

## Prerequisites

- Node.js 20.x (or latest LTS)
- npm 10.x
- Access to a hosted PostgreSQL database (Supabase or Neon) with the schema
  applied (see `db/migrations/001_initial_schema.sql`)
- Environment variables configured (see `.env.example`)

## Setup

```bash
# Install dependencies
npm install

# Copy environment file and configure database connection
cp .env.example .env
# Edit .env with your DATABASE_URL and API keys

# Run database migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

## Validation Scenarios

### Scenario 1: Dashboard loads with default data

1. Ensure database has seed data for at least 2 weeks and 2 projects
2. Start the dev server and open `http://localhost:5173`
3. **Expected**: Header shows "WEEKLY REPORT", week selector shows active
   weeks, project navigation shows active projects, default week/project
   selected, charts and tables display data

### Scenario 2: Week filtering

1. Click a different week in the horizontal week selector
2. **Expected**: All dashboard sections refresh — charts update, release table
   and notes show data for the selected week (or empty states)

### Scenario 3: Project filtering

1. Click a different project in the left navigation
2. **Expected**: Issue History chart (historical data for selected project),
   Test Case Distribution, releases, and notes update to the selected project

### Scenario 4: Empty state handling

1. Select a week and project that have no release data
2. **Expected**: Release table shows "Não foi possível localizar dados para
   mostrar no momento"
3. Other sections (Issue History, charts, notes) remain unaffected

### Scenario 5: Data validation

1. Attempt to create an issue metric with a negative count
2. **Expected**: Request is rejected with validation error (400)
3. Verify database does not contain the invalid record

### Scenario 6: Test suite

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

**Expected**: All tests pass with >= 80% line coverage.

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main dashboard layout and filter state |
| `src/api/*.ts` | Data access layer (typed API functions) |
| `src/hooks/useDashboard.ts` | Dashboard state (selected week, project) |
| `db/migrations/001_initial_schema.sql` | Database schema |
| `db/seed.sql` | Sample data for development |
| `src/types/index.ts` | TypeScript interfaces for all entities |
