import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from './env.js';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
};

export type AuthedRequest = Request & { user?: AuthUser };

const TOKEN_TTL = '7d';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, env.jwtSecret, { expiresIn: TOKEN_TTL });
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: { message: 'Authentication required', code: 'UNAUTHENTICATED' } });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser & { iat: number; exp: number };
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      display_name: decoded.display_name ?? null
    };
    next();
  } catch {
    res.status(401).json({ error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' } });
  }
}
