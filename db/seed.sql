insert into weeks (week_number, calendar_year, start_date, end_date, is_active)
values
  (25, 2026, '2026-06-15', '2026-06-21', true),
  (26, 2026, '2026-06-22', '2026-06-28', true),
  (27, 2026, '2026-06-29', '2026-07-05', true)
on conflict (start_date) do update set
  week_number = excluded.week_number,
  calendar_year = excluded.calendar_year,
  end_date = excluded.end_date,
  is_active = excluded.is_active;

insert into projects (code, name, description, display_order, is_active)
values
  ('HAM', 'Harman Audio Mixer', 'Audio module validation', 1, true),
  ('HAI', 'Harman AI/STL', 'AI and STL pipeline quality', 2, true),
  ('KNOX', 'SQUAD SYSTEM', 'Core squad platform', 3, true)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

insert into issue_metrics (week_id, project_id, reported_count, fixed_count)
select w.id, p.id, data.reported_count, data.fixed_count
from (
  values
    (25, 'HAM', 8, 5),
    (26, 'HAM', 10, 7),
    (27, 'HAM', 6, 6),
    (25, 'HAI', 3, 2),
    (26, 'HAI', 5, 4),
    (27, 'HAI', 4, 3),
    (25, 'KNOX', 7, 4),
    (26, 'KNOX', 9, 6),
    (27, 'KNOX', 5, 5)
) as data(week_number, project_code, reported_count, fixed_count)
join weeks w on w.week_number = data.week_number
join projects p on p.code = data.project_code
on conflict (week_id, project_id) do update set
  reported_count = excluded.reported_count,
  fixed_count = excluded.fixed_count;

insert into test_case_distributions (week_id, project_id, automated_count, pending_auto_count, not_auto_count)
select w.id, p.id, data.automated_count, data.pending_auto_count, data.not_auto_count
from (
  values
    (27, 'HAM', 42, 10, 5),
    (27, 'HAI', 28, 12, 8),
    (27, 'KNOX', 35, 15, 7)
) as data(week_number, project_code, automated_count, pending_auto_count, not_auto_count)
join weeks w on w.week_number = data.week_number
join projects p on p.code = data.project_code
on conflict (week_id, project_id) do update set
  automated_count = excluded.automated_count,
  pending_auto_count = excluded.pending_auto_count,
  not_auto_count = excluded.not_auto_count;

insert into release_versions (week_id, project_id, version, date, status, issue_count_a, issue_count_b, issue_count_c, release_notes)
select w.id, p.id, data.version, data.release_date, data.status, data.issue_count_a, data.issue_count_b, data.issue_count_c, data.release_notes
from (
  values
    (27, 'HAM', 'v2.7.0', '2026-07-03', 'Approved', 0, 1, 0, 'Mixer stability fixes and audio route validation'),
    (27, 'HAI', 'v1.9.2', '2026-07-02', 'Conditionally Approved', 1, 0, 2, 'Model retuning and fallback improvements')
) as data(week_number, project_code, version, release_date, status, issue_count_a, issue_count_b, issue_count_c, release_notes)
join weeks w on w.week_number = data.week_number
join projects p on p.code = data.project_code;

insert into notes (week_id, project_id, priority, note_text, author)
select w.id, p.id, data.priority, data.note_text, data.author
from (
  values
    (27, 'HAM', 0, 'Audio validation blocked by missing device firmware.', 'QA Lead'),
    (27, 'HAM', 1, 'Regression pack ready for release candidate.', 'QA Lead'),
    (27, 'HAI', 2, 'Model benchmark refresh scheduled for Friday.', 'QA Analyst')
) as data(week_number, project_code, priority, note_text, author)
join weeks w on w.week_number = data.week_number
join projects p on p.code = data.project_code;
