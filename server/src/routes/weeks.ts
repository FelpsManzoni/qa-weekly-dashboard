import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { weekSchema } from '../validation.js';

export const weeksRouter = Router();

weeksRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await query('select * from weeks order by week_number desc');
    res.json(rows);
  })
);

weeksRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(weekSchema, req.body);
    const row = await queryOne(
      `insert into weeks (week_number, start_date, end_date, is_active)
       values ($1, $2, $3, $4) returning *`,
      [body.week_number, body.start_date, body.end_date, body.is_active]
    );
    res.status(201).json(row);
  })
);

weeksRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = parseBody(weekSchema, req.body);
    const row = await queryOne(
      `update weeks set week_number = $1, start_date = $2, end_date = $3, is_active = $4, updated_at = now()
       where id = $5 returning *`,
      [body.week_number, body.start_date, body.end_date, body.is_active, req.params.id]
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
