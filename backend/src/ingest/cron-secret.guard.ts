import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

// Auth for the cron endpoint is the shared CRON_SECRET, sent as a Bearer
// token. We don't accept it as a query param because URLs end up in logs.
// For manual testing: curl -H "Authorization: Bearer $CRON_SECRET" ...
@Injectable()
export class CronSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const secret = this.config.get<string>('CRON_SECRET');

    if (secret) {
      const expected = Buffer.from(`Bearer ${secret}`);
      const actual = Buffer.from(req.headers.authorization ?? '');
      if (
        actual.length === expected.length &&
        timingSafeEqual(actual, expected)
      ) {
        return true;
      }
    }
    throw new UnauthorizedException({ error: 'unauthorized' });
  }
}
