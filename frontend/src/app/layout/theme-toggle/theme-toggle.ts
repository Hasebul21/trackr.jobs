import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { Icon } from '../../shared/icon/icon';
import { buttonClasses } from '../../shared/ui';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected theme = inject(ThemeService);
  protected isDark = computed(() => this.theme.resolvedTheme() === 'dark');
  protected buttonClass = buttonClasses('ghost', 'icon');
}
