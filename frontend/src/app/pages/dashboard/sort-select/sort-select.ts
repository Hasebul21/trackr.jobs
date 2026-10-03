import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';

// Sort dropdown bound to ?sort. "score" (relevance) is the default and is
// left out of the URL. Like the original app, the dashboard doesn't render
// it at the moment; ?sort still works when set in the URL.
@Component({
  selector: 'app-sort-select',
  imports: [FormsModule, NzSelectModule],
  templateUrl: './sort-select.html',
})
export class SortSelect {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected value = computed(() => this.params().get('sort') ?? 'score');

  onChange(value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: value === 'score' ? null : value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
