import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HiddenCompanies } from './hidden-companies';

export interface Company {
  name: string;
  url: string;
  country: string;
  auto: boolean;
  note?: string;
}

const PAGE_SIZE = 12;

const BUTTON =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] [&_svg]:size-4 [&_svg]:shrink-0';
const SIZE_SM = 'h-8 rounded-md px-3 text-xs';
const SIZE_ICON = 'h-9 w-9';
const VARIANT_DEFAULT = 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90';
const VARIANT_OUTLINE =
  'border border-[var(--border)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]';
const VARIANT_GHOST = 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]';

@Component({
  selector: 'app-companies-grid',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './companies-grid.html',
})
export class CompaniesGrid {
  private readonly hiddenStore = inject(HiddenCompanies);

  readonly companies = input.required<Company[]>();
  readonly initialPage = input(1);
  readonly basePath = input('/companies');
  // When true, a row of country chips filters the list and pagination
  // switches to local state, so changing country snaps back to page 1.
  readonly enableCountryFilter = input(false);

  protected readonly btnDefaultSm = `${BUTTON} ${VARIANT_DEFAULT} ${SIZE_SM}`;
  protected readonly btnOutlineSm = `${BUTTON} ${VARIANT_OUTLINE} ${SIZE_SM}`;
  protected readonly btnGhostSm = `${BUTTON} ${VARIANT_GHOST} ${SIZE_SM}`;
  protected readonly btnGhostIcon = `${BUTTON} ${VARIANT_GHOST} ${SIZE_ICON}`;

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
  protected readonly pageNumbers = computed(() => compactPageRange(this.page(), this.totalPages()));

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

  protected goTo(n: number): void {
    this.localPage.set(n);
  }

  // Page 1 drops the query param so the URL stays clean.
  protected queryFor(n: number): { page: number | null } {
    return { page: n <= 1 ? null : n };
  }

  protected hostname(url: string): string {
    return new URL(url).hostname.replace(/^www\./, '');
  }
}

// At most 7 entries: first and last page, the current page with one
// neighbour each side, and '…' for gaps. Page 8 of 20 gives
// [1, '…', 7, 8, 9, '…', 20].
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
