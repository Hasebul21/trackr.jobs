import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { HiddenCompanies } from './hidden-companies';

export interface Company {
  name: string;
  url: string;
  country: string;
  auto: boolean;
  note?: string;
}

const PAGE_SIZE = 12;

@Component({
  selector: 'app-companies-grid',
  imports: [NzButtonModule, NzEmptyModule, NzIconModule, NzPaginationModule, NzTagModule],
  templateUrl: './companies-grid.html',
})
export class CompaniesGrid {
  private readonly hiddenStore = inject(HiddenCompanies);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly companies = input.required<Company[]>();
  readonly initialPage = input(1);
  // When true, a row of country chips filters the list and pagination
  // switches to local state, so changing country snaps back to page 1.
  readonly enableCountryFilter = input(false);

  protected readonly pageSize = PAGE_SIZE;
  protected readonly hiddenIds = this.hiddenStore.ids;
  protected readonly hiddenCount = this.hiddenStore.count;
  protected readonly showHidden = signal(false);
  protected readonly country = signal('All');
  protected readonly localPage = linkedSignal(() => this.initialPage());

  protected readonly countries = computed(() => {
    const set = new Set(this.companies().map((c) => c.country));
    return ['All', ...Array.from(set).sort()];
  });

  protected readonly visible = computed(() => {
    let list = this.companies();
    if (!this.showHidden()) {
      const hidden = this.hiddenIds();
      list = list.filter((c) => !hidden[c.name]);
    }
    if (this.enableCountryFilter() && this.country() !== 'All') {
      list = list.filter((c) => c.country === this.country());
    }
    return list;
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.visible().length / PAGE_SIZE)),
  );

  protected readonly page = computed(() => {
    const requested = this.enableCountryFilter() ? this.localPage() : this.initialPage();
    return Math.min(Math.max(1, requested), this.totalPages());
  });

  protected readonly start = computed(() => (this.page() - 1) * PAGE_SIZE);
  protected readonly end = computed(() =>
    Math.min(this.start() + PAGE_SIZE, this.visible().length),
  );
  protected readonly slice = computed(() => this.visible().slice(this.start(), this.end()));

  protected selectCountry(country: string): void {
    this.country.set(country);
    this.localPage.set(1);
  }

  protected toggleShowHidden(): void {
    this.showHidden.update((v) => !v);
  }

  protected hide(name: string): void {
    this.hiddenStore.hide(name);
  }

  protected restore(name: string): void {
    this.hiddenStore.restore(name);
  }

  // With the country filter on, paging is local. Otherwise it goes into
  // ?page= so the page can be bookmarked; page 1 drops the param.
  protected changePage(n: number): void {
    if (this.enableCountryFilter()) {
      this.localPage.set(n);
      return;
    }
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: n <= 1 ? null : n },
      queryParamsHandling: 'merge',
    });
  }

  protected hostname(url: string): string {
    return new URL(url).hostname.replace(/^www\./, '');
  }
}
