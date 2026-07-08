import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, parseBody } from '../http.js';
import { testCaseDistributionSchema } from '../validation.js';

export const testCasesRouter = Router();

testCasesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const weekId = req.query.week_id as string | undefined;
    const projectId = req.query.project_id as string | undefined;
    if (!weekId || !projectId) {
      res.json([]);
      return;
    }
    const rows = await query(
      'select * from test_case_distributions where week_id = $1 and project_id = $2',
      [weekId, projectId]
    );
    res.json(rows);
  })
);

testCasesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(testCaseDistributionSchema, req.body);
    const row = await queryOne(
      `insert into test_case_distributions
         (week_id, project_id, automated_count, pending_auto_count, not_auto_count)
       values ($1, $2, $3, $4, $5)
       on conflict (week_id, project_id) do update set
         automated_count = excluded.automated_count,
         pending_auto_count = excluded.pending_auto_count,
         not_auto_count = excluded.not_auto_count,
         updated_at = now()
       returning *`,
      [body.week_id, body.project_id, body.automated_count, body.pending_auto_count, body.not_auto_count]
    );
    res.status(201).json(row);
  })
);
