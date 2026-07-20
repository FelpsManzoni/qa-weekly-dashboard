import { Router } from 'express';
import { query, queryOne } from '../db.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { lockSchema } from '../validation.js';
import type { AuthedRequest } from '../auth.js';

export const locksRouter = Router();

// Locks expire after 15 minutes of inactivity; heartbeat extends the window.
const LOCK_MINUTES = 15;

type LockRow = {
  id: string;
  resource_type: string;
  resource_id: string;
  owner_id: string;
  expires_at: string;
};

function futureExpiry(): string {
  return new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString();
}

/** POST /locks — acquire (or refresh own) lock for a resource. */
locksRouter.post(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    const body = parseBody(lockSchema, req.body);
    const ownerId = req.user!.id;

    const existing = await queryOne<LockRow>(
      'select * from edit_locks where resource_type = $1 and resource_id = $2',
      [body.resource_type, body.resource_id]
    );

    if (existing) {
      const expired = new Date(existing.expires_at).getTime() <= Date.now();
      if (!expired && existing.owner_id !== ownerId) {
        throw new HttpError(409, 'Record locked by another editor.', 'LOCKED');
      }
      // Expired or already ours → take/refresh it.
      const refreshed = await queryOne<LockRow>(
        'update edit_locks set owner_id = $1, expires_at = $2 where id = $3 returning *',
        [ownerId, futureExpiry(), existing.id]
      );
      res.json(refreshed);
      return;
    }

    const created = await queryOne<LockRow>(
      `insert into edit_locks (resource_type, resource_id, owner_id, expires_at)
       values ($1, $2, $3, $4) returning *`,
      [body.resource_type, body.resource_id, ownerId, futureExpiry()]
    );
    res.status(201).json(created);
  })
);

/** PUT /locks/:id — heartbeat: extend expiry if the caller owns the lock. */
locksRouter.put(
  '/:id',
  asyncHandler(async (req: AuthedRequest, res) => {
    const ownerId = req.user!.id;
    const row = await queryOne<LockRow>(
      'update edit_locks set expires_at = $1 where id = $2 and owner_id = $3 returning *',
      [futureExpiry(), req.params.id, ownerId]
    );
    if (!row) throw new HttpError(409, 'Lock not held by you', 'LOCKED');
    res.json(row);
  })
);

/** DELETE /locks/:id — release. */
locksRouter.delete(
  '/:id',
  asyncHandler(async (req: AuthedRequest, res) => {
    await query('delete from edit_locks where id = $1 and owner_id = $2', [req.params.id, req.user!.id]);
    res.status(204).end();
  })
);
