import { Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

// Projected content replaces the hint text, for hints that need a link.
@Component({
  selector: 'app-empty-state',
  imports: [Icon],
  templateUrl: './empty-state.html',
})
export class EmptyState {
  readonly heading = input('No jobs match these filters yet');
  readonly hint = input('Try clearing filters, or click Refresh to fetch a new batch.');
}
