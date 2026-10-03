import { Component, computed, input } from '@angular/core';
import { CompaniesGrid } from '../../components/companies-grid/companies-grid';
import { PLATFORMS } from './job-platforms.data';

@Component({
  imports: [CompaniesGrid],
  selector: 'app-job-platforms',
  templateUrl: './job-platforms.html',
})
export class JobPlatforms {
  // Bound from the ?page= query param.
  readonly page = input<string>();

  protected readonly platforms = PLATFORMS;
  protected readonly initialPage = computed(() => {
    const requested = Number(this.page());
    return Number.isFinite(requested) && requested >= 1 ? requested : 1;
  });
}
