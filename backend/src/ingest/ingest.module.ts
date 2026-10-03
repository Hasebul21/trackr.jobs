import { Module } from '@nestjs/common';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { IngestScheduler } from './ingest.scheduler';

@Module({
  controllers: [IngestController],
  providers: [IngestService, IngestScheduler],
  exports: [IngestService],
})
export class IngestModule {}
