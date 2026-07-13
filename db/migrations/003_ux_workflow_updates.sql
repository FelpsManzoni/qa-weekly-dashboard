-- UX workflow updates: weeks calendar year + Monday/Sunday rule, project metadata,
-- and the restructured release model. Written to be re-runnable (idempotent alters).

-- ---------------------------------------------------------------------------
-- Weeks: support multiple years of week 1..53 and enforce Monday→Sunday spans.
-- ---------------------------------------------------------------------------
alter table weeks add column if not exists calendar_year integer;

-- Backfill the year from start_date for any pre-existing rows, then make it required.
update weeks set calendar_year = extract(year from start_date) where calendar_year is null;
alter table weeks alter column calendar_year set not null;

-- Normalize legacy rows to the Monday/Sunday convention before adding checks.
with normalized as (
  select id, date_trunc('week', start_date)::date as monday_start
  from weeks
  where extract(isodow from start_date) <> 1
     or extract(isodow from end_date) <> 7
     or end_date <> start_date + interval '6 days'
)
update weeks w
set start_date = normalized.monday_start,
    end_date = normalized.monday_start + interval '6 days',
    calendar_year = extract(year from normalized.monday_start)
from normalized
where w.id = normalized.id;

-- The old rule "one week_number for all time" cannot represent year-over-year weeks.
alter table weeks drop constraint if exists weeks_week_number_key;

-- start_date is now the canonical unique key for a week.
do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.conname = 'weeks_start_date_key'
      and t.relname = 'weeks'
      and n.nspname = current_schema()
  ) then
    alter table weeks add constraint weeks_start_date_key unique (start_date);
  end if;
end $$;

-- Enforce the Monday→Sunday, exact 7-day rule.
do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.conname = 'weeks_monday_check'
      and t.relname = 'weeks'
      and n.nspname = current_schema()
  ) then
    alter table weeks add constraint weeks_monday_check check (extract(isodow from start_date) = 1);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.conname = 'weeks_sunday_check'
      and t.relname = 'weeks'
      and n.nspname = current_schema()
  ) then
    alter table weeks add constraint weeks_sunday_check check (extract(isodow from end_date) = 7);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.conname = 'weeks_span_check'
      and t.relname = 'weeks'
      and n.nspname = current_schema()
  ) then
    alter table weeks add constraint weeks_span_check check (end_date = start_date + interval '6 days');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Projects: lead QA (FK to users), client, and main technology scope.
-- ---------------------------------------------------------------------------
alter table projects add column if not exists lead_qa_user_id uuid references users(id) on delete set null;
alter table projects add column if not exists client varchar(255);
alter table projects add column if not exists main_technology_scope varchar(255);

-- ---------------------------------------------------------------------------
-- Release versions: four fixed statuses, structured issue counts, long-text notes.
-- ---------------------------------------------------------------------------
alter table release_versions add column if not exists released_date date;
alter table release_versions add column if not exists verified_date date;
alter table release_versions add column if not exists tests_pass integer not null default 0;
alter table release_versions add column if not exists tests_fail integer not null default 0;
alter table release_versions add column if not exists tests_not_tested integer not null default 0;
alter table release_versions add column if not exists issue_count_a integer not null default 0;
alter table release_versions add column if not exists issue_count_b integer not null default 0;
alter table release_versions add column if not exists issue_count_c integer not null default 0;
alter table release_versions add column if not exists release_notes text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = current_schema()
      and table_name = 'release_versions'
      and column_name = 'date'
  ) then
    execute 'update release_versions set released_date = date where released_date is null and date is not null';
  end if;
end $$;

update release_versions set released_date = current_date where released_date is null;
alter table release_versions alter column released_date set not null;

-- Migrate existing changelog text into the new release_notes field.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = current_schema()
      and table_name = 'release_versions'
      and column_name = 'changelog'
  ) then
    execute 'update release_versions set release_notes = changelog where release_notes is null and changelog is not null';
  end if;
end $$;

-- Normalize legacy status labels before enforcing the allowed set.
update release_versions set status = 'Failed' where status = 'Fail';

-- Restrict status to the four allowed business values.
do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.conname = 'release_versions_status_check'
      and t.relname = 'release_versions'
      and n.nspname = current_schema()
  ) then
    alter table release_versions add constraint release_versions_status_check
      check (status in ('Approved', 'Failed', 'Conditionally Approved', 'Blocked'));
  end if;
end $$;

-- The legacy free-text fields are superseded by the structured columns above.
alter table release_versions drop column if exists critical_issues;
alter table release_versions drop column if exists changelog;
alter table release_versions drop column if exists date;
