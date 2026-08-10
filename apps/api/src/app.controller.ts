import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  @Get('ping')
  @Header('Content-Type', 'text/plain')
  ping() {
    return 'pong';
  }

  @Get('health')
  health() {
    return {
      ...this.appService.getHealth(),
      uptime: process.uptime(),
    };
  }
}
