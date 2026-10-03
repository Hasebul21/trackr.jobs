import { Component, DOCUMENT, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { Icon } from '../../shared/icon/icon';
import { buttonClasses } from '../../shared/ui';
import { NAV_LINKS } from '../nav-links';
import { RefreshButton } from '../refresh-button/refresh-button';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

// Mobile slide-over menu, only shown below the sm breakpoint. Closes on
// link tap, backdrop tap and Escape, and locks body scroll while open.
@Component({
  selector: 'app-mobile-nav',
  imports: [RouterLink, Icon, RefreshButton, ThemeToggle],
  templateUrl: './mobile-nav.html',
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class MobileNav {
  readonly open = input(false);
  readonly closed = output<void>();

  private router = inject(Router);
  private document = inject(DOCUMENT);

  protected links = NAV_LINKS;
  protected iconButtonClass = buttonClasses('ghost', 'icon');

  private path = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.currentPath()),
    ),
    { initialValue: this.currentPath() },
  );

  constructor() {
    effect((onCleanup) => {
      if (!this.open()) return;
      const body = this.document.body;
      const prevOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
      onCleanup(() => (body.style.overflow = prevOverflow));
    });
  }

  isActive(href: string) {
    const path = this.path();
    return href === '/' ? path === '/' : path.startsWith(href);
  }

  onEscape() {
    if (this.open()) this.closed.emit();
  }

  private currentPath() {
    return this.router.url.split(/[?#]/)[0];
  }
}
