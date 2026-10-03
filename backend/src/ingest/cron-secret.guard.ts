import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

// Auth for the cron endpoint is the shared CRON_SECRET, sent as a Bearer
// token by the scheduler. `?secret=` is also accepted for ad-hoc curl testing.
@Injectable()
export class CronSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const secret = this.config.get<string>('CRON_SECRET');

    if (secret) {
      const auth = req.headers.authorization ?? '';
      if (auth === `Bearer ${secret}`) return true;
      if (req.query.secret === secret) return true;
    }
    throw new UnauthorizedException({ error: 'unauthorized' });
  }
}
