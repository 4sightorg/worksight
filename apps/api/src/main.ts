import { Logger } from '@nestjs/common';
import { createApp } from './bootstrap';

async function bootstrap() {
  const { app, corsOrigins } = await createApp();
  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port);
  Logger.log(
    `API listening on http://localhost:${port} (CORS: ${corsOrigins.join(', ')})`,
    'Bootstrap'
  );
}
bootstrap();
