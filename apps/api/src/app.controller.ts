import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from './db/database.service';
import { HealthDto } from './openapi/schemas';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(private readonly db: DatabaseService) {}

  @Get('ping')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Liveness probe', description: 'Returns plain-text `pong`.' })
  @ApiProduces('text/plain')
  @ApiOkResponse({ description: 'Service is up', schema: { type: 'string', example: 'pong' } })
  ping(): string {
    return `pong`;
  }

  @Get('health')
  @ApiOperation({
    summary: 'Readiness / data-source check',
    description:
      'Reports process uptime and whether the API is serving Postgres, fixtures, or cannot reach the database.',
  })
  @ApiOkResponse({ type: HealthDto })
  async health(): Promise<HealthDto> {
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
