import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiAuthGuard } from './api-auth.guard';

describe('ApiAuthGuard', () => {
  let guard: ApiAuthGuard;
  let reflector: Reflector;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    reflector = new Reflector();
    guard = new ApiAuthGuard(reflector);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function createMockContext(headers: Record<string, string> = {}, isPublic = false): ExecutionContext {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows access when API_REQUIRE_AUTH is not set', () => {
    delete process.env.API_REQUIRE_AUTH;
    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when API_REQUIRE_AUTH is false', () => {
    process.env.API_REQUIRE_AUTH = 'false';
    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access for public routes when API_REQUIRE_AUTH is true', () => {
    process.env.API_REQUIRE_AUTH = 'true';
    const context = createMockContext({}, true);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws UnauthorizedException when auth required but header is missing', () => {
    process.env.API_REQUIRE_AUTH = 'true';
    process.env.API_BEARER_TOKEN = 'secret-token';
    const context = createMockContext({}, false);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when auth required but token is invalid', () => {
    process.env.API_REQUIRE_AUTH = 'true';
    process.env.API_BEARER_TOKEN = 'secret-token';
    const context = createMockContext({ authorization: 'Bearer wrong-token' }, false);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('allows access when valid Bearer token is provided', () => {
    process.env.API_REQUIRE_AUTH = 'true';
    process.env.API_BEARER_TOKEN = 'secret-token';
    const context = createMockContext({ authorization: 'Bearer secret-token' }, false);
    expect(guard.canActivate(context)).toBe(true);
  });
});
