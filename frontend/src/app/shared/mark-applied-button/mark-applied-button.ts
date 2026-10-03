import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ApiService } from '../../core/api.service';
import { DataRefreshService } from '../../core/data-refresh.service';
import { ToastService } from '../../core/toast.service';
import { errorMessage } from '../error-message';
import { buttonClasses } from '../ui';

// Marks a job as applied. The backend deletes the job, so on success we
// reload the current page's data and the card drops out of the list.
@Component({
  selector: 'app-mark-applied-button',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './mark-applied-button.html',
})
export class MarkAppliedButton {
  readonly id = input.required<string>();
  readonly jobTitle = input.required<string>();

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private dataRefresh = inject(DataRefreshService);
  private destroyRef = inject(DestroyRef);

  protected pending = signal(false);
  protected buttonClass = buttonClasses('ghost', 'icon');

  markApplied(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.pending.set(true);

    this.api
      .markApplied(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.pending.set(false);
          if (!res.ok) {
            this.toast.error('Could not mark as applied', 'unknown error');
            return;
          }
          this.toast.success('Marked as applied', this.jobTitle());
          this.dataRefresh.bump();
        },
        error: (err) => {
          this.pending.set(false);
          this.toast.error('Could not mark as applied', errorMessage(err));
        },
      });
  }
}
