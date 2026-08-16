import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class ApiAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireAuth = (process.env.API_REQUIRE_AUTH ?? '').toLowerCase();
    const isAuthRequired = requireAuth === 'true' || requireAuth === '1' || requireAuth === 'yes';

    if (!isAuthRequired) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    const expectedToken = process.env.API_BEARER_TOKEN;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.substring(7).trim();
    if (!expectedToken || token !== expectedToken) {
      throw new UnauthorizedException('Invalid API bearer token');
    }

    return true;
  }
}
