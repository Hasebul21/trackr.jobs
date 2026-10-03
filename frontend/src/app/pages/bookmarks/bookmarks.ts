import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { BookmarksService } from '../../core/bookmarks.service';
import { DataRefreshService } from '../../core/data-refresh.service';
import { EmptyState } from '../../shared/empty-state/empty-state';
import { errorMessage } from '../../shared/error-message';
import { ErrorState } from '../../shared/error-state/error-state';
import { JobCard } from '../../shared/job-card/job-card';
import { buttonClasses } from '../../shared/ui';

// Saved jobs. The ids live in localStorage; the job data is looked up from
// the API. Jobs that no longer exist (e.g. marked as applied) just drop out.
@Component({
  imports: [RouterLink, NzButtonModule, NzSkeletonModule, EmptyState, ErrorState, JobCard],
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.html',
})
export class Bookmarks {
  private api = inject(ApiService);
  private dataRefresh = inject(DataRefreshService);
  protected bookmarks = inject(BookmarksService);

  protected jobs = rxResource({
    params: () => ({ ids: this.bookmarks.list(), version: this.dataRefresh.version() }),
    stream: ({ params }) =>
      params.ids.length === 0 ? of({ jobs: [] }) : this.api.getJobsByIds(params.ids),
  });

  protected errorText = computed(() => errorMessage(this.jobs.error()));
  protected clearClass = buttonClasses('outline', 'sm');
  protected skeletons = [0, 1, 2];
}
