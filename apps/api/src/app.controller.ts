import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
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
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
