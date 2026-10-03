import { Component, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

// Collapsible filter section built on <details>. All sections start open.
@Component({
  selector: 'app-filter-group',
  imports: [NzIconModule],
  templateUrl: './filter-group.html',
})
export class FilterGroup {
  readonly label = input.required<string>();
  readonly count = input(0);
  readonly last = input(false);
}
