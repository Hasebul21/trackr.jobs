import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { buttonClasses } from '../ui';

// Pagination bar. Page links only change ?page and keep every other query
// param, so filters survive paging. Page 1 drops ?page from the URL.
@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly rangeStart = input.required<number>();
  readonly rangeEnd = input.required<number>();
  readonly total = input.required<number>();

  protected pageNumbers = computed(() => compactPageRange(this.page(), this.totalPages()));
  protected outlineClass = buttonClasses('outline', 'sm');
  protected currentClass = buttonClasses('default', 'sm');

  pageParams(n: number) {
    return { page: n <= 1 ? null : n };
  }
}

// At most 7 entries: first and last page, the current page with one
// neighbour on each side, and "…" for the gaps. Page 8 of 20 gives
// [1, "…", 7, 8, 9, "…", 20].
export function compactPageRange(current: number, total: number): Array<number | '…'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: Array<number | '…'> = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) out.push('…');
  for (let i = left; i <= right; i++) out.push(i);
  if (right < total - 1) out.push('…');
  out.push(total);
  return out;
}
