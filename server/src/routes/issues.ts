import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, parseBody } from '../http.js';
import { issueMetricSchema } from '../validation.js';

export const issuesRouter = Router();

// Number of weeks on each side of the selected week to include in the history window.
const DEFAULT_RANGE = 4;

/**
 * GET /issue-metrics
 *  - ?project_id=&week_id=            → exact match for one week+project (form hydration)
 *  - ?project_id=[&around_week_id=]   → history ordered by weeks.week_number asc (#6),
 *                                        optionally windowed ±DEFAULT_RANGE weeks (#7/#10)
 */
issuesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const projectId = req.query.project_id as string | undefined;
    const weekId = req.query.week_id as string | undefined;
    const aroundWeekId = req.query.around_week_id as string | undefined;

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

    // History ordered by week_number, optionally scoped to a window around a week.
    if (aroundWeekId) {
      const rows = await query(
        `select im.* from issue_metrics im
         join weeks w on w.id = im.week_id
         where im.project_id = $1
           and w.week_number between
             (select week_number from weeks where id = $2) - $3
             and (select week_number from weeks where id = $2) + $3
         order by w.week_number asc`,
        [projectId, aroundWeekId, DEFAULT_RANGE]
      );
      res.json(rows);
      return;
    }

    const rows = await query(
      `select im.* from issue_metrics im
       join weeks w on w.id = im.week_id
       where im.project_id = $1
       order by w.start_date asc`,
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
