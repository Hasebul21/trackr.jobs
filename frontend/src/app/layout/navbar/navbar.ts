import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { buttonClasses } from '../../shared/ui';
import { MobileNav } from '../mobile-nav/mobile-nav';
import { NAV_LINKS } from '../nav-links';
import { RefreshButton } from '../refresh-button/refresh-button';
import { SearchInput } from '../search-input/search-input';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NzButtonModule,
    NzIconModule,
    MobileNav,
    RefreshButton,
    SearchInput,
    ThemeToggle,
  ],
  templateUrl: './navbar.html',
  // display: contents so the sticky header is positioned against the page,
  // not this host element.
  host: { class: 'contents' },
})
export class Navbar {
  protected links = NAV_LINKS;
  protected linkClass = buttonClasses('ghost', 'sm');
  protected iconButtonClass = buttonClasses('ghost', 'icon');
  protected menuOpen = signal(false);
}
