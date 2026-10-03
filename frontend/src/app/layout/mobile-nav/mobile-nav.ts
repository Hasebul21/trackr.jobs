import { Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { filter, map } from 'rxjs';
import { NAV_LINKS } from '../nav-links';
import { RefreshButton } from '../refresh-button/refresh-button';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

// Mobile slide-over menu (right-side drawer) with every destination plus the
// refresh and theme controls. The drawer handles Escape, mask clicks and
// closing on navigation.
@Component({
  selector: 'app-mobile-nav',
  imports: [RouterLink, NzDrawerModule, NzIconModule, RefreshButton, ThemeToggle],
  templateUrl: './mobile-nav.html',
})
export class MobileNav {
  readonly open = input(false);
  readonly closed = output<void>();

  private router = inject(Router);

  protected links = NAV_LINKS;
  // Mobile only, and painted with the app's tokens instead of Ant's colors.
  protected wrapClass =
    'sm:hidden [&_.ant-drawer-content]:bg-[var(--background)] [&_.ant-drawer-content]:text-[var(--foreground)] [&_.ant-drawer-header]:border-[var(--border)] [&_.ant-drawer-footer]:border-[var(--border)]';

  private path = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.currentPath()),
    ),
    { initialValue: this.currentPath() },
  );

  isActive(href: string) {
    const path = this.path();
    return href === '/' ? path === '/' : path.startsWith(href);
  }

  private currentPath() {
    return this.router.url.split(/[?#]/)[0];
  }
}
