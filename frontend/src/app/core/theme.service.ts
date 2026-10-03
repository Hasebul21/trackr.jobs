import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

// Same localStorage key next-themes used, so a saved choice carries over.
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);
  private media = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');

  readonly theme = signal<Theme>(readStoredTheme());
  private systemDark = signal(this.media?.matches ?? false);

  readonly resolvedTheme = computed(() => {
    const theme = this.theme();
    if (theme === 'system') return this.systemDark() ? 'dark' : 'light';
    return theme;
  });

  constructor() {
    this.media?.addEventListener('change', (e) => this.systemDark.set(e.matches));

    effect(() => {
      const root = this.document.documentElement;
      const dark = this.resolvedTheme() === 'dark';
      root.classList.toggle('dark', dark);
      root.style.colorScheme = dark ? 'dark' : 'light';
    });
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode); the choice just won't persist.
    }
  }
}

function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    // ignore
  }
  return 'system';
}
