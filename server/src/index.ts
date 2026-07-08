import path from 'node:path';
import { createApp } from './app.js';
import { env } from './env.js';
import { runMigrations, runSeed } from './migrate.js';

const migrationsDir = process.env.MIGRATIONS_DIR ?? path.resolve(process.cwd(), '../db/migrations');
const seedFile = process.env.SEED_FILE;

async function main() {
  await runMigrations(migrationsDir);
  if (seedFile) {
    await runSeed(seedFile);
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[server] listening on :${env.port}`);
  });
}

main().catch((err) => {
  console.error('[server] failed to start:', err);
  process.exit(1);
});
