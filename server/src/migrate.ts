import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pool } from './db.js';

/**
 * Applies every .sql file in the migrations dir in lexical order. Each migration is
 * written to be idempotent (create table if not exists / on conflict), so re-running
 * on an existing database is safe. Runs automatically on server startup.
 */
export async function runMigrations(migrationsDir: string): Promise<void> {
  let files: string[];
  try {
    files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();
  } catch (err) {
    console.warn(`[migrate] No migrations found at ${migrationsDir}:`, (err as Error).message);
    return;
  }

  for (const file of files) {
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
    console.log(`[migrate] applied ${file}`);
  }
}

export async function runSeed(seedFile: string): Promise<void> {
  try {
    const sql = await readFile(seedFile, 'utf8');
    await pool.query(sql);
    console.log(`[seed] applied ${path.basename(seedFile)}`);
  } catch (err) {
    console.warn(`[seed] skipped:`, (err as Error).message);
  }
}
