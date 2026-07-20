import fs from 'node:fs/promises';
import process from 'node:process';
import { Client } from 'pg';

const filePath = process.argv[2];

if (!filePath) {
  throw new Error('Missing SQL file path');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const sql = await fs.readFile(filePath, 'utf8');
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

try {
  await client.query(sql);
  console.log(`Executed ${filePath}`);
} finally {
  await client.end();
}
