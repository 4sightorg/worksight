import { Logger } from '@nestjs/common';
import { createApp } from './bootstrap';

async function bootstrap() {
  const { app } = await createApp();
  const port = Number(process.env.PORT ?? 3001);
  const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  await app.listen(port);
  Logger.log(
    `API listening on http://localhost:${port} (CORS: ${corsOrigins.join(', ')})`,
    'Bootstrap'
  );
}
bootstrap();
