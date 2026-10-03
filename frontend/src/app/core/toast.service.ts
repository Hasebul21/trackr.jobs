import { inject, Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

// Small wrapper so callers don't repeat the placement options. Matches the
// old sonner setup: bottom-right, closable, success/error.
@Injectable({ providedIn: 'root' })
export class ToastService {
  private notification = inject(NzNotificationService);

  success(title: string, description = '') {
    this.notification.success(title, description, { nzPlacement: 'bottomRight' });
  }

  error(title: string, description = '') {
    this.notification.error(title, description, { nzPlacement: 'bottomRight' });
  }
}
