import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Icon } from '../../shared/icon/icon';

const DEBOUNCE_MS = 300;

// Navbar search box. Writes ?q= to the current URL 300ms after the last
// keystroke, dropping ?page so results start from the first page.
@Component({
  selector: 'app-search-input',
  imports: [Icon],
  templateUrl: './search-input.html',
})
export class SearchInput {
  private router = inject(Router);

  protected value = signal('');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // Keep the box in sync when the URL changes from elsewhere,
    // e.g. "Clear all" in the filters panel or the back button.
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        if (this.timer) return;
        const q = this.router.parseUrl(this.router.url).queryParamMap.get('q') ?? '';
        if (q !== this.value()) this.value.set(q);
      });

    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  onInput(value: string) {
    this.value.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = undefined;
      // Empty commands keep the current path and only touch the query string.
      this.router.navigate([], {
        queryParams: { q: value || null, page: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }, DEBOUNCE_MS);
  }
}
