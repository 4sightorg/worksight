/**
 * Drop and recreate the public schema, then seed.
 *
 *   DATABASE_URL=postgresql://… pnpm --filter @worksight/api db:reset
 */
import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({ connectionString: url });
  try {
    await pool.query('DROP SCHEMA public CASCADE');
    await pool.query('CREATE SCHEMA public');
    await pool.query('GRANT ALL ON SCHEMA public TO CURRENT_USER');
    console.log('Dropped and recreated public schema');
  } finally {
    await pool.end();
  }

  const seed = spawnSync('pnpm', ['exec', 'tsx', 'src/db/seed.ts'], {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
    shell: process.platform === 'win32',
  });
  process.exit(seed.status ?? 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
