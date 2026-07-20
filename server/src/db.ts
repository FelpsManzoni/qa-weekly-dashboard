import { Pool, types, type QueryResultRow } from 'pg';
import { env } from './env.js';

// pg defaults to parsing `date` columns (OID 1082) into JS Date objects, which round-trip
// through JSON as full ISO timestamps (e.g. "2026-05-11T04:00:00.000Z") instead of the plain
// 'YYYY-MM-DD' string the frontend types (Week.start_date/end_date, Release dates) expect.
// Returning the raw string avoids both the format mismatch and any timezone-shift risk.
types.setTypeParser(types.builtins.DATE, (value) => value);

export const pool = new Pool({ connectionString: env.databaseUrl });

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(text, params as never[]);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
