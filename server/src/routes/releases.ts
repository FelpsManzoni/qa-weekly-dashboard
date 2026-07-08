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
    if (!weekId || !projectId) {
      res.json([]);
      return;
    }
    const rows = await query(
      'select * from release_versions where week_id = $1 and project_id = $2 order by date desc',
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
      `insert into release_versions (week_id, project_id, version, date, status, critical_issues, changelog)
       values ($1, $2, $3, $4, $5, $6, $7) returning *`,
      [body.week_id, body.project_id, body.version, body.date, body.status, body.critical_issues ?? null, body.changelog ?? null]
    );
    res.status(201).json(row);
  })
);

releasesRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = parseBody(releaseSchema, req.body);
    const row = await queryOne(
      `update release_versions set week_id = $1, project_id = $2, version = $3, date = $4, status = $5,
         critical_issues = $6, changelog = $7, updated_at = now()
       where id = $8 returning *`,
      [body.week_id, body.project_id, body.version, body.date, body.status, body.critical_issues ?? null, body.changelog ?? null, req.params.id]
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
