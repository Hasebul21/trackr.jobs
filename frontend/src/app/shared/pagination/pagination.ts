import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

// Pagination bar. Changing page only touches ?page and keeps every other
// query param, so filters survive paging. Page 1 drops ?page from the URL.
@Component({
  selector: 'app-pagination',
  imports: [NzPaginationModule],
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly rangeStart = input.required<number>();
  readonly rangeEnd = input.required<number>();
  readonly total = input.required<number>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goTo(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page <= 1 ? null : page },
      queryParamsHandling: 'merge',
    });
  }
}
