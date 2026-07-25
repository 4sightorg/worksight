import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';

/**
 * Thin Pool wrapper around DATABASE_URL.
 *
 * Accepts a direct Postgres URL or a PgBouncer (transaction) URL. Do not point
 * this at the Supabase REST host — the API talks SQL, not PostgREST.
 */
@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool | null;

  constructor() {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      this.pool = null;
      this.logger.warn('DATABASE_URL unset — API will serve @worksight/common fixtures');
      return;
    }
    this.pool = new Pool({
      connectionString: url,
      // PgBouncer transaction pooling cannot use prepared statements across
      // checkouts; disable them so either URL shape works.
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    });
    this.logger.log(`Postgres pool ready (${this.redact(url)})`);
  }

  get enabled(): boolean {
    return this.pool !== null;
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('DATABASE_URL is not configured');
    }
    return this.pool.query<T>(text, params);
  }

  async withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('DATABASE_URL is not configured');
    }
    const client = await this.pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool?.end();
  }

  private redact(url: string): string {
    return url.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
  }
}
