import { Component, computed, input } from '@angular/core';
import { CompaniesGrid } from '../../components/companies-grid/companies-grid';
import { COMPANIES } from './companies.data';

@Component({
  imports: [CompaniesGrid],
  selector: 'app-companies',
  templateUrl: './companies.html',
})
export class Companies {
  // Bound from the ?page= query param.
  readonly page = input<string>();

  protected readonly companies = COMPANIES;
  protected readonly initialPage = computed(() => {
    const requested = Number(this.page());
    return Number.isFinite(requested) && requested >= 1 ? requested : 1;
  });
}
