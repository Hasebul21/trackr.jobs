import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Facets } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';
import { buttonClasses } from '../../../shared/ui';
import { FilterGroup } from '../filter-group/filter-group';

// Fixed target countries, always selectable even when a country has no
// jobs right now. Order is the preferred priority.
const COUNTRY_OPTIONS = ['Bangladesh', 'Japan', 'Singapore', 'Malaysia', 'Thailand'];

const SENIORITY_OPTIONS = [
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'junior', label: 'Junior' },
];

const POSTED_OPTIONS = [
  { value: '1', label: 'Last 24h' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

@Component({
  selector: 'app-filters-panel',
  imports: [NgTemplateOutlet, Icon, FilterGroup],
  templateUrl: './filters-panel.html',
  host: { class: 'contents' },
})
export class FiltersPanel {
  readonly facets = input.required<Facets>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected countries = COUNTRY_OPTIONS;
  protected seniorities = SENIORITY_OPTIONS;
  protected postedOptions = POSTED_OPTIONS;

  // On mobile the panel starts collapsed behind a "Filters" button so the
  // job grid stays above the fold. On lg+ it is always shown.
  protected mobileOpen = signal(false);

  protected hasAny = computed(() => this.params().keys.length > 0);
  protected days = computed(() => this.params().get('days'));
  protected countryCount = computed(() => this.params().getAll('country').length);
  protected levelCount = computed(() => this.params().getAll('level').length);
  protected sourceCount = computed(() => this.params().getAll('source').length);
  protected visaRemoteCount = computed(
    () => (this.isOn('visa') ? 1 : 0) + (this.isOn('remote') ? 1 : 0),
  );
  protected postedCount = computed(() => (this.days() ? 1 : 0));
  protected totalCount = computed(
    () =>
      this.countryCount() +
      this.levelCount() +
      this.sourceCount() +
      this.visaRemoteCount() +
      this.postedCount(),
  );

  protected clearClass = `${buttonClasses('ghost', 'xs')} text-xs`;

  isOn(key: string): boolean {
    return this.params().get(key) === '1';
  }

  isSelected(key: string, value: string): boolean {
    return this.params().getAll(key).includes(value);
  }

  chipClass(active: boolean): string {
    return `${buttonClasses(active ? 'default' : 'outline', 'xs')} text-[11px]`;
  }

  toggleValue(key: string, value: string) {
    const current = this.params().getAll(key);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    this.update({ [key]: next.length ? next : null });
  }

  setFlag(key: string, on: boolean) {
    this.update({ [key]: on ? '1' : null });
  }

  toggleDays(value: string) {
    this.update({ days: this.days() === value ? null : value });
  }

  clearAll() {
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
  }

  // Any filter change goes back to page 1.
  private update(changes: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...changes, page: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
