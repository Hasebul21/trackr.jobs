import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { DataRefreshService } from '../../core/data-refresh.service';
import { errorMessage } from '../../shared/error-message';
import { ErrorState } from '../../shared/error-state/error-state';
import { badgeClasses } from '../../shared/ui';

@Component({
  imports: [NzDividerModule, NzSkeletonModule, NzStatisticModule, NzTagModule, ErrorState],
  selector: 'app-settings',
  templateUrl: './settings.html',
})
export class Settings {
  private api = inject(ApiService);
  private dataRefresh = inject(DataRefreshService);

  protected data = rxResource({
    params: () => this.dataRefresh.version(),
    stream: () => forkJoin({ stats: this.api.getStats(), settings: this.api.getSettings() }),
  });

  // Provider list joined with the per-source job counts.
  protected providers = computed(() => {
    if (!this.data.hasValue()) return [];
    const { stats, settings } = this.data.value();
    return settings.providers.map((p) => ({
      ...p,
      count: stats.bySource.find((s) => s.source === p.name)?.count ?? 0,
    }));
  });

  protected preferenceLists = computed(() => {
    if (!this.data.hasValue()) return [];
    const prefs = this.data.value().settings.preferences;
    return [
      { title: 'Preferred technologies', items: prefs.preferredTechnologies },
      { title: 'Preferred locations', items: prefs.preferredLocations },
      { title: 'Include title keywords', items: prefs.includeTitleKeywords },
      { title: 'Exclude title keywords', items: prefs.excludeTitleKeywords },
    ];
  });

  protected errorText = computed(() => errorMessage(this.data.error()));
  protected badge = badgeClasses;
  // Small uppercase label over a bold number, like the original stats.
  protected statisticClass =
    '[&_.ant-statistic-title]:mb-1 [&_.ant-statistic-title]:text-xs [&_.ant-statistic-title]:tracking-wide [&_.ant-statistic-title]:text-[var(--muted-foreground)] [&_.ant-statistic-title]:uppercase [&_.ant-statistic-content]:text-xl [&_.ant-statistic-content]:font-semibold [&_.ant-statistic-content]:text-[var(--foreground)]';

  formatDate(value: string | null): string {
    return value ? new Date(value).toLocaleString() : '—';
  }
}
