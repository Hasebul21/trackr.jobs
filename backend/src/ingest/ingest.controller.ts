import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngestService } from './ingest.service';
import { CronSecretGuard } from './cron-secret.guard';

@Controller()
export class IngestController {
  constructor(private readonly ingest: IngestService) {}

  // Triggered by the navbar Refresh button. It's open (there are no
  // accounts), so we refuse back-to-back runs to keep it from being used
  // to hammer the job boards or the database.
  @Post('refresh')
  @HttpCode(200)
  async refresh() {
    if (this.ingest.isOnCooldown()) {
      throw new HttpException(
        'Jobs were refreshed a moment ago. Try again in a couple of minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const report = await this.ingest.runIngest();
    return {
      ok: true,
      totalUpserted: report.totalUpserted,
      bySource: report.bySource,
    };
  }

  // External cron hits this with GET; POST is exposed too for parity.
  @Get('cron/refresh')
  @UseGuards(CronSecretGuard)
  cronRefreshGet() {
    return this.cronRefresh();
  }

  @Post('cron/refresh')
  @HttpCode(200)
  @UseGuards(CronSecretGuard)
  cronRefreshPost() {
    return this.cronRefresh();
  }

  private async cronRefresh() {
    const report = await this.ingest.runIngest();
    return {
      ok: true,
      durationMs: report.finishedAt.getTime() - report.startedAt.getTime(),
      totalFetched: report.totalFetched,
      totalUpserted: report.totalUpserted,
      bySource: report.bySource,
    };
  }
}
