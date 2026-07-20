import { Router } from 'express';
import { queryOne } from '../db.js';
import { hashPassword, verifyPassword, signToken, requireAuth, type AuthedRequest, type AuthUser } from '../auth.js';
import { asyncHandler, HttpError, parseBody } from '../http.js';
import { loginSchema, registerSchema } from '../validation.js';

export const authRouter = Router();

type UserRow = AuthUser & { password_hash: string };

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const body = parseBody(registerSchema, req.body);
    const password_hash = await hashPassword(body.password);

    const existing = await queryOne<{ id: string }>(
      'select id from users where username = $1 or email = $2',
      [body.username, body.email]
    );
    if (existing) {
      throw new HttpError(409, 'Username or email already in use', 'DUPLICATE');
    }

    const user = await queryOne<UserRow>(
      `insert into users (username, email, password_hash, display_name)
       values ($1, $2, $3, $4)
       returning id, username, email, display_name, password_hash`,
      [body.username, body.email, password_hash, body.display_name ?? null]
    );
    if (!user) {
      throw new HttpError(500, 'Failed to create user');
    }

    const authUser: AuthUser = { id: user.id, username: user.username, email: user.email, display_name: user.display_name };
    res.status(201).json({ token: signToken(authUser), user: authUser });
  })
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = parseBody(loginSchema, req.body);
    const user = await queryOne<UserRow>(
      'select id, username, email, display_name, password_hash from users where username = $1',
      [body.username]
    );

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      throw new HttpError(401, 'Invalid username or password', 'INVALID_CREDENTIALS');
    }

    const authUser: AuthUser = { id: user.id, username: user.username, email: user.email, display_name: user.display_name };
    res.json({ token: signToken(authUser), user: authUser });
  })
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    res.json({ user: req.user });
  })
);
