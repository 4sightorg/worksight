import { Controller, Get, Header } from '@nestjs/common';
import { DatabaseService } from './db/database.service';

@Controller()
export class AppController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  getHello(): string {
    return `hello`;
  }

  @Get('ping')
  @Header('Content-Type', 'text/plain')
  ping() {
    return `pong`;
  }

  @Get('health')
  async health() {
    if (!this.db.enabled) {
      return { status: 'ok', uptime: process.uptime(), database: 'fixtures' };
    }
    try {
      await this.db.query('SELECT 1');
      return { status: 'ok', uptime: process.uptime(), database: 'postgres' };
    } catch {
      return { status: 'degraded', uptime: process.uptime(), database: 'unreachable' };
    }
  }
}
