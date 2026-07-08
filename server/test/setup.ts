// Env must exist before any module that reads it (env.ts validates eagerly).
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://test:test@localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.PORT = process.env.PORT ?? '3999';
