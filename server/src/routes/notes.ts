import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { noteSchema } from '../validation.js';

export const notesRouter = Router();

notesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const weekId = req.query.week_id as string | undefined;
    const projectId = req.query.project_id as string | undefined;
    if (!weekId || !projectId) {
      res.json([]);
      return;
    }
    const rows = await query(
      'select * from notes where week_id = $1 and project_id = $2 order by priority asc',
      [weekId, projectId]
    );
    res.json(rows);
  })
);

notesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(noteSchema, req.body);
    const row = await queryOne(
      `insert into notes (week_id, project_id, priority, note_text, author)
       values ($1, $2, $3, $4, $5) returning *`,
      [body.week_id, body.project_id, body.priority, body.note_text, body.author ?? null]
    );
    res.status(201).json(row);
  })
);

notesRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = parseBody(noteSchema, req.body);
    const row = await queryOne(
      `update notes set week_id = $1, project_id = $2, priority = $3, note_text = $4, author = $5, updated_at = now()
       where id = $6 returning *`,
      [body.week_id, body.project_id, body.priority, body.note_text, body.author ?? null, req.params.id]
    );
    if (!row) throw new HttpError(404, 'Note not found', 'NOT_FOUND');
    res.json(row);
  })
);

notesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await query('delete from notes where id = $1', [req.params.id]);
    res.status(204).end();
  })
);
