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
    const weekStartDate = req.query.week_start_date as string | undefined;
    const projectId = req.query.project_id as string | undefined;
    if (!projectId || (!weekId && !weekStartDate)) {
      throw new HttpError(400, 'project_id and a week selector are required', 'VALIDATION_ERROR');
    }

    let resolvedWeekId = weekId ?? null;

    if (weekStartDate) {
      const week = await queryOne<{ id: string }>(
        'select id from weeks where start_date = $1',
        [weekStartDate]
      );

      if (weekId && week && week.id !== weekId) {
        throw new HttpError(400, 'week_id does not match week_start_date', 'VALIDATION_ERROR');
      }

      if (!week) {
        res.json({ issueMetric: null, testCase: null, releases: [], notes: [] });
        return;
      }

      resolvedWeekId = week.id;
    }

    if (!resolvedWeekId) {
      throw new HttpError(400, 'Unable to resolve requested week', 'VALIDATION_ERROR');
    }

    const [issueMetric, testCase, releases, notes] = await Promise.all([
      queryOne(
        'select * from issue_metrics where week_id = $1 and project_id = $2',
        [resolvedWeekId, projectId]
      ),
      queryOne(
        'select * from test_case_distributions where week_id = $1 and project_id = $2',
        [resolvedWeekId, projectId]
      ),
      query(
        'select * from release_versions where week_id = $1 and project_id = $2 order by date desc',
        [resolvedWeekId, projectId]
      ),
      query(
        'select * from notes where week_id = $1 and project_id = $2 order by priority asc, created_at asc',
        [resolvedWeekId, projectId]
      )
    ]);

    res.json({ issueMetric, testCase, releases, notes });
  })
);
