import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { releaseSchema } from '../validation.js';

export const releasesRouter = Router();

releasesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const weekId = req.query.week_id as string | undefined;
    const projectId = req.query.project_id as string | undefined;
    const releasedBefore = req.query.released_before as string | undefined;
    const rawLimit = req.query.limit as string | undefined;
    const parsedLimit = rawLimit ? Number(rawLimit) : null;

    if (!projectId) {
      res.json([]);
      return;
    }

    if (releasedBefore) {
      const rows = await query(
        `select *
         from release_versions
         where project_id = $1
           and released_date <= $2
         order by released_date desc, created_at desc
         limit $3`,
        [projectId, releasedBefore, Number.isFinite(parsedLimit) && parsedLimit ? parsedLimit : 5]
      );
      res.json(rows);
      return;
    }

    if (!weekId) {
      res.json([]);
      return;
    }

    const rows = await query(
      'select * from release_versions where week_id = $1 and project_id = $2 order by released_date desc, created_at desc',
      [weekId, projectId]
    );
    res.json(rows);
  })
);

releasesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(releaseSchema, req.body);
    const row = await queryOne(
      `insert into release_versions
        (week_id, project_id, version, released_date, verified_date, status, tests_pass, tests_fail, tests_not_tested, issue_count_a, issue_count_b, issue_count_c, release_notes)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`,
      [
        body.week_id,
        body.project_id,
        body.version,
        body.released_date,
        body.verified_date,
        body.status,
        body.tests_pass,
        body.tests_fail,
        body.tests_not_tested,
        body.issue_count_a,
        body.issue_count_b,
        body.issue_count_c,
        body.release_notes ?? null
      ]
    );
    res.status(201).json(row);
  })
);

releasesRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = parseBody(releaseSchema, req.body);
    const row = await queryOne(
      `update release_versions
       set week_id = $1, project_id = $2, version = $3, released_date = $4, verified_date = $5, status = $6,
         tests_pass = $7, tests_fail = $8, tests_not_tested = $9, issue_count_a = $10, issue_count_b = $11,
         issue_count_c = $12, release_notes = $13, updated_at = now()
       where id = $14 returning *`,
      [
        body.week_id,
        body.project_id,
        body.version,
        body.released_date,
        body.verified_date,
        body.status,
        body.tests_pass,
        body.tests_fail,
        body.tests_not_tested,
        body.issue_count_a,
        body.issue_count_b,
        body.issue_count_c,
        body.release_notes ?? null,
        req.params.id
      ]
    );
    if (!row) throw new HttpError(404, 'Release not found', 'NOT_FOUND');
    res.json(row);
  })
);

releasesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await query('delete from release_versions where id = $1', [req.params.id]);
    res.status(204).end();
  })
);
