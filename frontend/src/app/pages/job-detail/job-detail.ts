import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { BookmarkButton } from '../../shared/bookmark-button/bookmark-button';
import { errorMessage } from '../../shared/error-message';
import { ErrorState } from '../../shared/error-state/error-state';
import { Icon } from '../../shared/icon/icon';
import { RelativeTimePipe } from '../../shared/relative-time-pipe';
import { badgeClasses, buttonClasses } from '../../shared/ui';

@Component({
  imports: [RouterLink, BookmarkButton, ErrorState, Icon, RelativeTimePipe],
  selector: 'app-job-detail',
  templateUrl: './job-detail.html',
})
export class JobDetail {
  // Bound from the :id route param.
  readonly id = input.required<string>();

  private api = inject(ApiService);

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
  protected applyClass = buttonClasses();
}
