import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type AppDatabase = PostgresJsDatabase<typeof schema>;

export type DatabaseHandle = {
  db: AppDatabase;
  sql: ReturnType<typeof postgres>;
};

/**
 * Create a Drizzle client when `DATABASE_URL` is set (Neon or local Postgres).
 * Returns null so the API can keep serving `@worksight/common` fixtures.
 */
export function createDatabase(connectionString = process.env.DATABASE_URL): DatabaseHandle | null {
  const url = connectionString?.trim();
  if (!url) {
    return null;
  }

  const sql = postgres(url, {
    max: 10,
    prepare: false, // required for Neon serverless / pooled connections
  });
  const db = drizzle(sql, { schema });
  return { db, sql };
}
