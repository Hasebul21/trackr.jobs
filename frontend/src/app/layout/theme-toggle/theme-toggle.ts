import { Component, computed, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemeService } from '../../core/theme.service';
import { buttonClasses } from '../../shared/ui';

@Component({
  selector: 'app-theme-toggle',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  protected theme = inject(ThemeService);
  protected isDark = computed(() => this.theme.resolvedTheme() === 'dark');
  protected buttonClass = buttonClasses('ghost', 'icon');
}
