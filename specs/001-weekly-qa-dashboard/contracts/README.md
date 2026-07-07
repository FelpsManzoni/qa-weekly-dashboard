# API Contracts: Weekly QA Dashboard

The data access layer exposes RESTful endpoints for each entity. The API
client (`src/api/client.ts`) provides typed fetch wrappers. The exact base
URL depends on whether Supabase auto-generated API or a custom Express server
is used. All endpoints follow the patterns below.

## Endpoints

### Weeks

| Method | Path                    | Description              |
|--------|------------------------|--------------------------|
| GET    | /api/weeks             | List active weeks        |
| GET    | /api/weeks/:id         | Get week by ID           |
| POST   | /api/weeks             | Create week              |
| PUT    | /api/weeks/:id         | Update week              |
| DELETE | /api/weeks/:id         | Deactivate week          |

### Projects

| Method | Path                    | Description                 |
|--------|------------------------|-----------------------------|
| GET    | /api/projects          | List active projects (sorted) |
| GET    | /api/projects/:id      | Get project by ID           |
| POST   | /api/projects          | Create project              |
| PUT    | /api/projects/:id      | Update project              |
| DELETE | /api/projects/:id      | Deactivate project          |

### Issue Metrics

| Method | Path                              | Description                        |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/issues?weekId=&projectId=   | Get metrics for week+project        |
| GET    | /api/issues/history?projectId=   | Get all metrics for a project (history) |
| POST   | /api/issues                      | Create/upsert metric                |
| PUT    | /api/issues/:id                  | Update metric                       |

### Test Case Distributions

| Method | Path                                          | Description                          |
|--------|----------------------------------------------|--------------------------------------|
| GET    | /api/test-cases?weekId=&projectId=           | Get distribution for week+project     |
| POST   | /api/test-cases                             | Create/upsert distribution            |
| PUT    | /api/test-cases/:id                         | Update distribution                   |

### Release Versions

| Method | Path                                          | Description                          |
|--------|----------------------------------------------|--------------------------------------|
| GET    | /api/releases?weekId=&projectId=             | List releases for week+project        |
| POST   | /api/releases                               | Create release                       |
| PUT    | /api/releases/:id                           | Update release                       |
| DELETE | /api/releases/:id                           | Delete release                       |

### Notes

| Method | Path                                   | Description                     |
|--------|----------------------------------------|----------------------------------|
| GET    | /api/notes?weekId=&projectId=          | List notes (sorted by priority)  |
| POST   | /api/notes                            | Create note                      |
| DELETE | /api/notes/:id                        | Delete note                      |

## Response Format (List)

```json
{
  "data": [ /* entity objects */ ],
  "error": null
}
```

## Response Format (Single)

```json
{
  "data": { /* entity object */ },
  "error": null
}
```

## Error Response

```json
{
  "data": null,
  "error": {
    "message": "Description of the error",
    "code": "VALIDATION_ERROR"
  }
}
```

## Client Interface (TypeScript)

See `src/api/*.ts` for the typed client functions. Each module exports
functions like `fetchWeeks()`, `createWeek(data)`, etc. that return typed
promises.
