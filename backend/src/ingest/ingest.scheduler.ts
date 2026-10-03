import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IngestService } from './ingest.service';

// In-process alternative to an external cron hitting /api/cron/refresh.
// Off by default so a deploy that already has an external cron doesn't
// ingest twice; set ENABLE_CRON=1 to turn it on.
@Injectable()
export class IngestScheduler {
  private readonly logger = new Logger(IngestScheduler.name);

  constructor(
    private readonly ingest: IngestService,
    private readonly config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS, { waitForCompletion: true })
  async handleCron() {
    if (this.config.get<string>('ENABLE_CRON') !== '1') return;

    try {
      const report = await this.ingest.runIngest();
      this.logger.log(
        `Scheduled ingest done: fetched ${report.totalFetched}, upserted ${report.totalUpserted}`,
      );
    } catch (err) {
      this.logger.error('Scheduled ingest failed', (err as Error).stack);
    }
  }
}
