create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username varchar(50) not null unique,
  email varchar(255) not null unique,
  password_hash text not null,
  display_name varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Edit locks are now owned by an authenticated user. owner_id historically held a
-- random per-session id (varchar), so we keep the column type and simply store the
-- user's uuid as text. No destructive change to existing rows.
create index if not exists idx_users_username on users(username);
