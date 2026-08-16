import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './bootstrap';

describe('API Security hardeners (e2e)', () => {
  let app: INestApplication;
  const originalEnv = process.env;

  beforeAll(async () => {
    process.env = { ...originalEnv };
    const bootstrapped = await createApp();
    app = bootstrapped.app;
  });

  afterAll(async () => {
    process.env = originalEnv;
    await app.close();
  });

  it('includes security headers from Helmet', async () => {
    const res = await request(app.getHttpServer()).get('/ping');
    expect(res.status).toBe(200);
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('returns stable error envelope on 404', async () => {
    const res = await request(app.getHttpServer()).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      path: '/non-existent-route',
      timestamp: expect.any(String),
    });
  });

  it('allows access to /ping and /health when API_REQUIRE_AUTH=true', async () => {
    process.env.API_REQUIRE_AUTH = 'true';
    process.env.API_BEARER_TOKEN = 'test-token-123';

    const pingRes = await request(app.getHttpServer()).get('/ping');
    expect(pingRes.status).toBe(200);

    const healthRes = await request(app.getHttpServer()).get('/health');
    expect(healthRes.status).toBe(200);
  });

  it('rejects protected routes when API_REQUIRE_AUTH=true and token is missing', async () => {
    process.env.API_REQUIRE_AUTH = 'true';
    process.env.API_BEARER_TOKEN = 'test-token-123';

    const res = await request(app.getHttpServer()).get('/users');
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      statusCode: 401,
      message: 'Missing or invalid Authorization header',
      error: 'Unauthorized',
      path: '/users',
      timestamp: expect.any(String),
    });
  });

  it('allows protected routes when valid Bearer token is sent', async () => {
    process.env.API_REQUIRE_AUTH = 'true';
    process.env.API_BEARER_TOKEN = 'test-token-123';

    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer test-token-123');

    expect(res.status).toBe(200);
  });
});
