import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError } from '../http.js';

export const projectDataRouter = Router();

// One-shot load for the consolidated "Project Data" page. Returns the issue metric,
// test coverage, releases, and notes for a single project/week combination.
projectDataRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const weekId = req.query.week_id as string | undefined;
    const projectId = req.query.project_id as string | undefined;
    if (!weekId || !projectId) {
      throw new HttpError(400, 'week_id and project_id are required', 'VALIDATION_ERROR');
    }

    const [issueMetric, testCase, releases, notes] = await Promise.all([
      queryOne(
        'select * from issue_metrics where week_id = $1 and project_id = $2',
        [weekId, projectId]
      ),
      queryOne(
        'select * from test_case_distributions where week_id = $1 and project_id = $2',
        [weekId, projectId]
      ),
      query(
        'select * from release_versions where week_id = $1 and project_id = $2 order by date desc',
        [weekId, projectId]
      ),
      query(
        'select * from notes where week_id = $1 and project_id = $2 order by priority asc, created_at asc',
        [weekId, projectId]
      )
    ]);

    res.json({ issueMetric, testCase, releases, notes });
  })
);
