import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ApiService } from '../../core/api.service';
import { DataRefreshService } from '../../core/data-refresh.service';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { errorMessage } from '../../shared/error-message';
import { ErrorState } from '../../shared/error-state/error-state';
import { JobCard } from '../../shared/job-card/job-card';
import { pageFromParams } from '../../shared/job-filters';
import { Pagination } from '../../shared/pagination/pagination';
import { REMOTE_PLATFORM_SOURCES } from '../../shared/sources';

const PAGE_SIZE = 12;
const PLATFORMS = ['Turing', 'Toptal', 'Arc', 'Wellfound'];

// Remote jobs from the global talent platforms. These sources are
// best-effort scrapes, so listings may be incomplete.
@Component({
  imports: [NzSkeletonModule, EmptyState, ErrorState, JobCard, Pagination],
  selector: 'app-remote',
  templateUrl: './remote.html',
})
export class Remote {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private dataRefresh = inject(DataRefreshService);

  private params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected platforms = PLATFORMS.join(', ');
  protected pageSize = PAGE_SIZE;
  protected page = computed(() => pageFromParams(this.params()));

  protected jobs = rxResource({
    params: () => ({ page: this.page(), version: this.dataRefresh.version() }),
    stream: ({ params }) =>
      this.api.getJobs({
        source: REMOTE_PLATFORM_SOURCES,
        sort: 'recent',
        page: params.page,
        pageSize: PAGE_SIZE,
      }),
  });

  protected total = computed(() => (this.jobs.hasValue() ? this.jobs.value().total : 0));
  protected totalPages = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  protected rangeStart = computed(() =>
    this.total() === 0 ? 0 : (this.page() - 1) * PAGE_SIZE + 1,
  );
  protected rangeEnd = computed(() => Math.min(this.total(), this.page() * PAGE_SIZE));

  protected errorText = computed(() => errorMessage(this.jobs.error()));
  protected skeletons = Array.from({ length: 6 }, (_, i) => i);
}
