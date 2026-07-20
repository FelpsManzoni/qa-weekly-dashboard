# Data Model: Weekly QA Dashboard

## Entity Relationship Overview

```
weeks 1───* issue_metrics *───1 projects
weeks 1───* test_case_distributions *───1 projects
weeks 1───* release_versions *───1 projects
weeks 1───* notes *───1 projects
```

Every data entity (issue_metrics, test_case_distributions, release_versions,
notes) has a composite foreign key to (week_id, project_id). This ensures all
dashboard data is scoped to a week + project combination.

---

## Entity: `weeks`

| Column       | Type         | Constraints                  |
|-------------|-------------|------------------------------|
| id          | UUID        | PK, default gen_random_uuid()|
| week_number | INTEGER     | NOT NULL, UNIQUE             |
| start_date  | DATE        | NOT NULL                     |
| end_date    | DATE        | NOT NULL                     |
| is_active   | BOOLEAN     | NOT NULL, DEFAULT true       |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()      |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()      |

**Constraints**:
- `week_number` must be positive (1-53)
- `end_date` must be after `start_date`
- `week_number` unique to prevent duplicate week entries

**Relationships**:
- Has many `issue_metrics`, `test_case_distributions`, `release_versions`, `notes`

---

## Entity: `projects`

| Column       | Type         | Constraints                  |
|-------------|-------------|------------------------------|
| id          | UUID        | PK, default gen_random_uuid()|
| code        | VARCHAR(20)  | NOT NULL, UNIQUE             |
| name        | VARCHAR(255) | NOT NULL                     |
| description | TEXT        |                              |
| display_order | INTEGER   | NOT NULL, DEFAULT 0          |
| is_active   | BOOLEAN     | NOT NULL, DEFAULT true       |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()      |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()      |

**Constraints**:
- `code` must be uppercase alphanumeric (e.g., HAM, HAI, WALLET, KNOX)
- `display_order` determines left navigation sort order

**Relationships**:
- Has many `issue_metrics`, `test_case_distributions`, `release_versions`, `notes`

---

## Entity: `issue_metrics`

| Column         | Type      | Constraints                     |
|---------------|-----------|---------------------------------|
| id            | UUID      | PK, default gen_random_uuid()   |
| week_id       | UUID      | NOT NULL, FK → weeks(id)        |
| project_id    | UUID      | NOT NULL, FK → projects(id)     |
| reported_count | INTEGER  | NOT NULL, CHECK (>= 0)          |
| fixed_count   | INTEGER   | NOT NULL, CHECK (>= 0)          |
| created_at    | TIMESTAMPTZ | NOT NULL, DEFAULT now()        |
| updated_at    | TIMESTAMPTZ | NOT NULL, DEFAULT now()        |

**Constraints**:
- `reported_count` >= 0
- `fixed_count` >= 0
- UNIQUE (week_id, project_id) — one metric row per week+project

**Relationships**:
- Belongs to `weeks` and `projects`

---

## Entity: `test_case_distributions`

| Column              | Type      | Constraints                     |
|--------------------|-----------|---------------------------------|
| id                 | UUID      | PK, default gen_random_uuid()   |
| week_id            | UUID      | NOT NULL, FK → weeks(id)        |
| project_id         | UUID      | NOT NULL, FK → projects(id)     |
| automated_count    | INTEGER   | NOT NULL, CHECK (>= 0)          |
| pending_auto_count | INTEGER   | NOT NULL, CHECK (>= 0)          |
| not_auto_count     | INTEGER   | NOT NULL, CHECK (>= 0)          |
| created_at         | TIMESTAMPTZ | NOT NULL, DEFAULT now()        |
| updated_at         | TIMESTAMPTZ | NOT NULL, DEFAULT now()        |

**Constraints**:
- All count columns >= 0
- UNIQUE (week_id, project_id)

**Relationships**:
- Belongs to `weeks` and `projects`

---

## Entity: `release_versions`

| Column          | Type         | Constraints                     |
|----------------|-------------|---------------------------------|
| id             | UUID        | PK, default gen_random_uuid()   |
| week_id        | UUID        | NOT NULL, FK → weeks(id)        |
| project_id     | UUID        | NOT NULL, FK → projects(id)     |
| version        | VARCHAR(50)  | NOT NULL                        |
| date           | DATE        | NOT NULL                        |
| status         | VARCHAR(50)  | NOT NULL                        |
| critical_issues | TEXT       |                                 |
| changelog      | TEXT        |                                 |
| created_at     | TIMESTAMPTZ  | NOT NULL, DEFAULT now()         |
| updated_at     | TIMESTAMPTZ  | NOT NULL, DEFAULT now()         |

**Constraints**:
- No uniqueness constraint on (week_id, project_id, version) — allows multiple
  releases per week+project (uncommon but supported)

**Relationships**:
- Belongs to `weeks` and `projects`

---

## Entity: `notes`

| Column       | Type         | Constraints                     |
|-------------|-------------|---------------------------------|
| id          | UUID        | PK, default gen_random_uuid()   |
| week_id     | UUID        | NOT NULL, FK → weeks(id)        |
| project_id  | UUID        | NOT NULL, FK → projects(id)     |
| priority    | INTEGER     | NOT NULL, CHECK (IN (0, 1, 2))  |
| note_text   | TEXT        | NOT NULL, CHECK (length > 0)    |
| author      | VARCHAR(255) |                                |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()         |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()         |

**Constraints**:
- `priority` must be 0, 1, or 2
- `note_text` must not be empty
- `author` is optional

**Relationships**:
- Belongs to `weeks` and `projects`

---

## Validation Rules (Shared)

| Rule | Applies To |
|------|-----------|
| Negative counts rejected (CHECK >= 0) | issue_metrics, test_case_distributions |
| Empty notes rejected (CHECK length > 0) | notes |
| Priority must be 0, 1, or 2 | notes |
| Week number must be 1-53 | weeks |
| End date after start date | weeks |
| Duplicate (week_id, project_id) prevented via UNIQUE constraint | issue_metrics, test_case_distributions |
| Project code must be uppercase alphanumeric | projects (application-level) |
