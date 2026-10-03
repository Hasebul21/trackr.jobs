import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { CronSecretGuard } from './cron-secret.guard';

@Controller()
export class IngestController {
  constructor(private readonly ingest: IngestService) {}

  // Triggered by the navbar Refresh button. In a production deployment
  // you'd protect this with auth or rate limiting; for a personal tool on
  // a private URL it's fine to leave open.
  @Post('refresh')
  @HttpCode(200)
  async refresh() {
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
