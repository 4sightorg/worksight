import { ClassSerializerInterceptor, type INestApplication, Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { type Express } from 'express';
import { AppModule } from './app.module';

export type BootstrappedApp = {
  app: INestApplication;
  server: Express;
};

/**
 * Shared Nest bootstrap for local (`main.ts`) and Vercel (`api/index.ts`).
 * Returns the underlying Express instance so serverless can hand requests to it
 * without calling `app.listen()`.
 */
export async function createApp(): Promise<BootstrappedApp> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('WorkSight')
    .setDescription('Check your tasks, manage your well-being')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();

  const logger = new Logger('Bootstrap');
  if (process.env.DATABASE_URL) {
    logger.log('Data source: Postgres via DATABASE_URL (direct or PgBouncer).');
  } else {
    logger.log('Data source: @worksight/common fixtures (set DATABASE_URL to use Postgres).');
  }

  return { app, server };
}
