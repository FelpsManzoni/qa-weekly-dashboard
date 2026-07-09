import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { projectSchema } from '../validation.js';

export const projectsRouter = Router();

// Project-management screens need every registered project (active and inactive).
// The dashboard continues to filter to active projects on the client.
projectsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await query('select * from projects order by display_order asc');
    res.json(rows);
  })
);

projectsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(projectSchema, req.body);
    const row = await queryOne(
      `insert into projects (code, name, description, lead_qa_user_id, client, main_technology_scope, display_order, is_active)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`,
      [
        body.code,
        body.name,
        body.description ?? null,
        body.lead_qa_user_id ?? null,
        body.client ?? null,
        body.main_technology_scope ?? null,
        body.display_order,
        body.is_active
      ]
    );
    res.status(201).json(row);
  })
);

projectsRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = parseBody(projectSchema, req.body);
    const row = await queryOne(
      `update projects set code = $1, name = $2, description = $3, lead_qa_user_id = $4,
          client = $5, main_technology_scope = $6, display_order = $7, is_active = $8, updated_at = now()
       where id = $9 returning *`,
      [
        body.code,
        body.name,
        body.description ?? null,
        body.lead_qa_user_id ?? null,
        body.client ?? null,
        body.main_technology_scope ?? null,
        body.display_order,
        body.is_active,
        req.params.id
      ]
    );
    if (!row) throw new HttpError(404, 'Project not found', 'NOT_FOUND');
    res.json(row);
  })
);

projectsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await query('delete from projects where id = $1', [req.params.id]);
    res.status(204).end();
  })
);
