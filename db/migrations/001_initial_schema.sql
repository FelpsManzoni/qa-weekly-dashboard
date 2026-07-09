create extension if not exists pgcrypto;

create table if not exists weeks (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null unique check (week_number between 1 and 53),
  start_date date not null,
  end_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date > start_date)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  code varchar(20) not null unique,
  name varchar(255) not null,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists issue_metrics (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references weeks(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  reported_count integer not null check (reported_count >= 0),
  fixed_count integer not null check (fixed_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_id, project_id)
);

create table if not exists test_case_distributions (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references weeks(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  automated_count integer not null check (automated_count >= 0),
  pending_auto_count integer not null check (pending_auto_count >= 0),
  not_auto_count integer not null check (not_auto_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_id, project_id)
);

create table if not exists release_versions (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references weeks(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  version varchar(50) not null,
  released_date date not null,
  verified_date date,
  status varchar(50) not null,
  tests_pass integer not null default 0 check (tests_pass >= 0),
  tests_fail integer not null default 0 check (tests_fail >= 0),
  tests_not_tested integer not null default 0 check (tests_not_tested >= 0),
  critical_issues text,
  changelog text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references weeks(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  priority integer not null check (priority in (0, 1, 2)),
  note_text text not null check (char_length(trim(note_text)) > 0),
  author varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists edit_locks (
  id uuid primary key default gen_random_uuid(),
  resource_type varchar(50) not null,
  resource_id uuid not null,
  owner_id varchar(255) not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (resource_type, resource_id)
);

create index if not exists idx_issue_metrics_project on issue_metrics(project_id);
create index if not exists idx_test_case_project on test_case_distributions(project_id);
create index if not exists idx_release_versions_project on release_versions(project_id);
create index if not exists idx_notes_project on notes(project_id);
create index if not exists idx_edit_locks_expires on edit_locks(expires_at);
