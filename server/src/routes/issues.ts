import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, parseBody } from '../http.js';
import { issueMetricSchema } from '../validation.js';

export const issuesRouter = Router();

const DEFAULT_RANGE = 5;
const ALLOWED_RANGES = new Set([5, 10]);

/**
 * GET /issue-metrics
 *  - ?project_id=&week_id=            → exact match for one week+project (form hydration)
 *  - ?project_id=[&end_week_id=&range_weeks=]
 *                                     → history ordered by weeks.start_date asc,
 *                                       ending at the selected week and limited to N points
 */
issuesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const projectId = req.query.project_id as string | undefined;
    const weekId = req.query.week_id as string | undefined;
    const endWeekId = req.query.end_week_id as string | undefined;
    const requestedRange = Number(req.query.range_weeks ?? DEFAULT_RANGE);
    const rangeWeeks = ALLOWED_RANGES.has(requestedRange) ? requestedRange : DEFAULT_RANGE;

    if (!projectId) {
      res.json([]);
      return;
    }

    // Exact single-record lookup (used by fetchIssueMetric).
    if (weekId) {
      const rows = await query(
        `select im.* from issue_metrics im
         where im.project_id = $1 and im.week_id = $2`,
        [projectId, weekId]
      );
      res.json(rows);
      return;
    }

    const projectWeeksCte = `
      with project_weeks as (
        select w.id, w.start_date
        from weeks w
        where exists (
          select 1 from issue_metrics im where im.week_id = w.id and im.project_id = $1
          union all
          select 1 from test_case_distributions tcd where tcd.week_id = w.id and tcd.project_id = $1
          union all
          select 1 from release_versions rv where rv.week_id = w.id and rv.project_id = $1
          union all
          select 1 from notes n where n.week_id = w.id and n.project_id = $1
        )
      ),
      cumulative_history as (
        select
          coalesce(im.id::text, concat(pw.id::text, ':', $1::text)) as id,
          pw.id as week_id,
          $1::uuid as project_id,
          sum(coalesce(im.reported_count, 0)) over (order by pw.start_date asc rows between unbounded preceding and current row) as reported_count,
          sum(coalesce(im.fixed_count, 0)) over (order by pw.start_date asc rows between unbounded preceding and current row) as fixed_count,
          im.created_at,
          im.updated_at,
          pw.start_date
        from project_weeks pw
        left join issue_metrics im on im.week_id = pw.id and im.project_id = $1
      )
    `;

    // History ordered by week date, ending at the selected week and limited to N points.
    if (endWeekId) {
      const rows = await query(
        `${projectWeeksCte}
         select scoped.id,
                scoped.week_id,
                scoped.project_id,
                scoped.reported_count,
                scoped.fixed_count,
                scoped.created_at,
                scoped.updated_at
           from (
             select *
             from cumulative_history
             where start_date <= (select start_date from weeks where id = $2)
             order by start_date desc
             limit $3
           ) scoped
         order by scoped.start_date asc`,
        [projectId, endWeekId, rangeWeeks]
      );
      res.json(rows);
      return;
    }

    const rows = await query(
      `${projectWeeksCte}
       select id,
              week_id,
              project_id,
              reported_count,
              fixed_count,
              created_at,
              updated_at
       from cumulative_history
       order by start_date asc`,
      [projectId]
    );
    res.json(rows);
  })
);

issuesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(issueMetricSchema, req.body);
    const row = await queryOne(
      `insert into issue_metrics (week_id, project_id, reported_count, fixed_count)
       values ($1, $2, $3, $4)
       on conflict (week_id, project_id) do update set
         reported_count = excluded.reported_count,
         fixed_count = excluded.fixed_count,
         updated_at = now()
       returning *`,
      [body.week_id, body.project_id, body.reported_count, body.fixed_count]
    );
    res.status(201).json(row);
  })
);
