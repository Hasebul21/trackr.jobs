import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ApiService } from '../../core/api.service';
import { Job } from '../../core/models';
import { BookmarkButton } from '../../shared/bookmark-button/bookmark-button';
import { errorMessage } from '../../shared/error-message';
import { ErrorState } from '../../shared/error-state/error-state';
import { RelativeTimePipe } from '../../shared/relative-time-pipe';
import { sourceLabel } from '../../shared/sources';
import { badgeClasses, buttonClasses } from '../../shared/ui';

@Component({
  imports: [
    RouterLink,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzResultModule,
    NzSkeletonModule,
    NzTagModule,
    BookmarkButton,
    ErrorState,
    RelativeTimePipe,
  ],
  selector: 'app-job-detail',
  templateUrl: './job-detail.html',
})
export class JobDetail {
  // Bound from the :id route param.
  readonly id = input.required<string>();

  private api = inject(ApiService);

  // Some sources don't give a company name; show the source instead,
  // same as the job card does.
  protected companyName(j: Job): string {
    return j.company === 'Unknown' ? sourceLabel(j.source) : j.company;
  }

  protected job = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this.api.getJob(params),
  });

  protected notFound = computed(() => {
    const err = this.job.error();
    return err instanceof HttpErrorResponse && err.status === 404;
  });
  protected errorText = computed(() => errorMessage(this.job.error()));

  protected badge = badgeClasses;
  protected primaryClass = buttonClasses();
}
