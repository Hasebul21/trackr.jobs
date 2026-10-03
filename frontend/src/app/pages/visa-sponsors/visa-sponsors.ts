import { Component, computed, input } from '@angular/core';
import { CompaniesGrid } from '../../components/companies-grid/companies-grid';
import { VISA_SPONSORS } from './visa-sponsors.data';

@Component({
  imports: [CompaniesGrid],
  selector: 'app-visa-sponsors',
  templateUrl: './visa-sponsors.html',
})
export class VisaSponsors {
  // Bound from the ?page= query param.
  readonly page = input<string>();

  protected readonly sponsors = VISA_SPONSORS;
  protected readonly initialPage = computed(() => {
    const requested = Number(this.page());
    return Number.isFinite(requested) && requested >= 1 ? requested : 1;
  });
}
