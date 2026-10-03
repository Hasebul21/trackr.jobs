import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ApiService } from '../../core/api.service';
import { DataRefreshService } from '../../core/data-refresh.service';
import { ToastService } from '../../core/toast.service';
import { errorMessage } from '../../shared/error-message';
import { buttonClasses } from '../../shared/ui';

@Component({
  selector: 'app-refresh-button',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './refresh-button.html',
})
export class RefreshButton {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private dataRefresh = inject(DataRefreshService);
  private destroyRef = inject(DestroyRef);

  protected pending = signal(false);
  protected buttonClass = buttonClasses('outline', 'sm');

  refresh() {
    this.pending.set(true);
    this.api
      .refresh()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const detail = res.bySource
            .filter((s) => s.fetched > 0 || !s.ok)
            .map((s) => `${s.source}: ${s.fetched}${s.ok ? '' : ' (failed)'}`)
            .join(' · ');
          this.toast.success(
            `${res.totalUpserted} jobs upserted`,
            detail || 'No new jobs from any source.',
          );
          this.pending.set(false);
          this.dataRefresh.bump();
        },
        error: (err) => {
          this.toast.error('Refresh failed', errorMessage(err));
          this.pending.set(false);
        },
      });
  }
}
