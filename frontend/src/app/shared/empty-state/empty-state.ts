import { Component, input } from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

// Projected content replaces the hint text, for hints that need a link.
@Component({
  selector: 'app-empty-state',
  imports: [NzEmptyModule],
  templateUrl: './empty-state.html',
})
export class EmptyState {
  readonly heading = input('No jobs match these filters yet');
  readonly hint = input('Try clearing filters, or click Refresh to fetch a new batch.');
}
