import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-toaster',
  imports: [Icon],
  templateUrl: './toaster.html',
})
export class Toaster {
  protected toast = inject(ToastService);
}
