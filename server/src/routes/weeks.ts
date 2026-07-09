import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { weekSchema } from '../validation.js';

export const weeksRouter = Router();

// Weeks are a rolling one-year window: we only surface weeks whose Monday start is
// within the last year. Ordered by start_date desc so the newest week is first.
const RECENCY_FILTER = `start_date >= (current_date - interval '1 year') and is_active = true`;

weeksRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const projectId = req.query.project_id as string | undefined;

    // Project-scoped: return only weeks that actually contain data for that project.
    if (projectId) {
      const rows = await query(
        `select w.* from weeks w
         where w.start_date >= (current_date - interval '1 year') and w.is_active = true
           and exists (
             select 1 from issue_metrics im where im.week_id = w.id and im.project_id = $1
             union all
             select 1 from test_case_distributions tcd where tcd.week_id = w.id and tcd.project_id = $1
             union all
             select 1 from release_versions rv where rv.week_id = w.id and rv.project_id = $1
             union all
             select 1 from notes n where n.week_id = w.id and n.project_id = $1
           )
         order by w.start_date desc`,
        [projectId]
      );
      res.json(rows);
      return;
    }

    const rows = await query(`select * from weeks where ${RECENCY_FILTER} order by start_date desc`);
    res.json(rows);
  })
);

weeksRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(weekSchema, req.body);
    const row = await queryOne(
      `insert into weeks (week_number, calendar_year, start_date, end_date, is_active)
       values ($1, $2, $3, $4, $5) returning *`,
      [body.week_number, body.calendar_year, body.start_date, body.end_date, body.is_active]
    );
    res.status(201).json(row);
  })
);

weeksRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = parseBody(weekSchema, req.body);
    const row = await queryOne(
      `update weeks set week_number = $1, calendar_year = $2, start_date = $3, end_date = $4, is_active = $5, updated_at = now()
       where id = $6 returning *`,
      [body.week_number, body.calendar_year, body.start_date, body.end_date, body.is_active, req.params.id]
    );
    if (!row) throw new HttpError(404, 'Week not found', 'NOT_FOUND');
    res.json(row);
  })
);

weeksRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await query('delete from weeks where id = $1', [req.params.id]);
    res.status(204).end();
  })
);
