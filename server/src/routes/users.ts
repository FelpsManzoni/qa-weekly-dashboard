import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../http.js';

export const usersRouter = Router();

// Lightweight directory of authenticated users so the frontend can populate the
// "Lead QA" picker on project forms.
usersRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `select id, username, email, display_name
       from users
       order by coalesce(display_name, username) asc`
    );
    res.json(rows);
  })
);
