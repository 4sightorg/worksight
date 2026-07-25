import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Express } from 'express';
import { createApp } from './bootstrap';

let cached: Express | undefined;
let boot: Promise<Express> | undefined;

async function getServer(): Promise<Express> {
  if (cached) {
    return cached;
  }
  boot ??= createApp().then(({ server }) => {
    cached = server;
    return server;
  });
  return boot;
}

/**
 * Vercel Node serverless entry. Cached across warm invocations in the same isolate.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const server = await getServer();
  server(req, res);
}
