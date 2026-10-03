import { Injectable, signal } from '@angular/core';

// Pages include `version()` in their resource params, so bumping it after a
// refresh or a mark-as-applied reloads whatever is on screen. This replaces
// router.refresh() from the Next.js version.
@Injectable({ providedIn: 'root' })
export class DataRefreshService {
  readonly version = signal(0);

  bump() {
    this.version.update((v) => v + 1);
  }
}
