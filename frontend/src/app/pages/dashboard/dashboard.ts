import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { DataRefreshService } from '../../core/data-refresh.service';
import { Facets } from '../../core/models';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { errorMessage } from '../../shared/error-message';
import { ErrorState } from '../../shared/error-state/error-state';
import { JobCard } from '../../shared/job-card/job-card';
import { filtersFromParams } from '../../shared/job-filters';
import { Pagination } from '../../shared/pagination/pagination';
import { FiltersPanel } from './filters-panel/filters-panel';

// 12 = 4 rows of 3 cards on a wide screen.
const PAGE_SIZE = 12;
const NO_FACETS: Facets = { sources: [], countries: [] };

// Dashboard: filters sidebar plus a grid of job cards. Every filter lives in
// the query string so any view can be bookmarked or shared.
@Component({
  selector: 'app-dashboard',
  imports: [EmptyState, ErrorState, JobCard, Pagination, FiltersPanel],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private dataRefresh = inject(DataRefreshService);

  private params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  protected filters = computed(() => ({
    ...filtersFromParams(this.params()),
    pageSize: PAGE_SIZE,
  }));

  protected jobs = rxResource({
    params: () => ({ filters: this.filters(), version: this.dataRefresh.version() }),
    stream: ({ params }) => this.api.getJobs(params.filters),
  });

  protected facets = rxResource({
    params: () => this.dataRefresh.version(),
    stream: () => this.api.getFacets(),
  });

  // Facets are only used for the source list, so a failed facets call
  // shouldn't take the whole page down.
  protected facetsOrEmpty = computed(() => {
    if (this.facets.error()) return NO_FACETS;
    return this.facets.hasValue() ? this.facets.value() : null;
  });

  protected page = computed(() => this.filters().page ?? 1);
  protected total = computed(() => (this.jobs.hasValue() ? this.jobs.value().total : 0));
  protected totalPages = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  protected rangeStart = computed(() =>
    this.total() === 0 ? 0 : (this.page() - 1) * PAGE_SIZE + 1,
  );
  protected rangeEnd = computed(() => Math.min(this.total(), this.page() * PAGE_SIZE));

  protected errorText = computed(() => errorMessage(this.jobs.error()));
  protected skeletons = Array.from({ length: 6 }, (_, i) => i);
}
