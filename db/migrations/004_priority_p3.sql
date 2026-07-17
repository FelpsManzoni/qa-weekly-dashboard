-- Allow P3 / Low priority notes while keeping existing P0-P2 records valid.

alter table notes drop constraint if exists notes_priority_check;

alter table notes add constraint notes_priority_check
  check (priority in (0, 1, 2, 3));
