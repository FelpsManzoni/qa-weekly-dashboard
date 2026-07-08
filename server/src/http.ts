import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError, type ZodSchema } from 'zod';

/** Wraps an async route so thrown errors reach the central error handler. */
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

/** Parses body with a zod schema, throwing a 400-mapped error on failure. */
export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  return schema.parse(body);
}

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: err.issues[0]?.message ?? 'Invalid request', code: 'VALIDATION_ERROR' }
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { message: err.message, code: err.code } });
    return;
  }

  // Postgres unique-violation → 409 so the client can surface duplicate errors.
  if (typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505') {
    res.status(409).json({ error: { message: 'Record already exists', code: 'DUPLICATE' } });
    return;
  }

  const message = err instanceof Error ? err.message : 'Unexpected error';
  res.status(500).json({ error: { message, code: 'INTERNAL_ERROR' } });
}
