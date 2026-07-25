import { ClassSerializerInterceptor, type INestApplication, Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import express, { type Express, type Request, type Response } from 'express';
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

  setupApiDocs(app, server);

  await app.init();

  const logger = new Logger('Bootstrap');
  if (process.env.DATABASE_URL) {
    logger.log('Data source: Postgres via DATABASE_URL (direct or PgBouncer).');
  } else {
    logger.log('Data source: @worksight/common fixtures (set DATABASE_URL to use Postgres).');
  }

  return { app, server };
}

/**
 * Docs on Vercel serverless:
 * Nest's default Swagger UI ships local swagger-ui-dist assets that never make
 * it into the function bundle (HTML 200, CSS/JS 404). Serve OpenAPI JSON
 * ourselves, Scalar as the primary UI, and a CDN-backed Swagger UI fallback.
 */
function setupApiDocs(app: INestApplication, server: Express): void {
  const config = new DocumentBuilder()
    .setTitle('WorkSight')
    .setDescription('Check your tasks, manage your well-being')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const sendOpenApi = (_req: Request, res: Response) => {
    res.json(document);
  };
  server.get('/openapi.json', sendOpenApi);
  // Back-compat with Nest's previous `/api-json` URL.
  server.get('/api-json', sendOpenApi);

  const scalar = apiReference({
    content: document,
    pageTitle: 'WorkSight API',
  });
  // `/api` is the URL people already open; Scalar replaces the broken Swagger UI.
  app.use('/api', scalar);
  app.use('/reference', scalar);

  server.get('/swagger', (_req: Request, res: Response) => {
    res.type('html').send(cdnSwaggerHtml('/openapi.json'));
  });
}

function cdnSwaggerHtml(specUrl: string): string {
  // Classic Swagger UI from CDN — no local swagger-ui-dist files required.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>WorkSight API — Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.27.1/swagger-ui.css" />
  <style>body { margin: 0; background: #fafafa; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.27.1/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.27.1/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: ${JSON.stringify(specUrl)},
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'StandaloneLayout',
    });
  </script>
</body>
</html>`;
}
