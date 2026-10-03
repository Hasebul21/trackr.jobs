import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { parseJobFilters } from './job-filters';
import type { JobsQuery } from './job-filters';

// Static routes are declared before `:id` so they are not swallowed by it.
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  list(@Query() query: JobsQuery) {
    return this.jobs.queryJobs(parseJobFilters(query));
  }

  @Get('lookup')
  async lookup(@Query('ids') idsParam?: string | string[]) {
    const raw = Array.isArray(idsParam) ? idsParam.join(',') : (idsParam ?? '');
    const ids = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 200);
    return { jobs: await this.jobs.findByIds(ids) };
  }

  @Get('facets')
  facets() {
    return this.jobs.getFacets();
  }

  @Get('stats')
  stats() {
    return this.jobs.getJobStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobs.getJob(id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  @Post(':id/applied')
  @HttpCode(200)
  async markApplied(@Param('id') id: string) {
    await this.jobs.markApplied(id);
    return { ok: true };
  }
}
