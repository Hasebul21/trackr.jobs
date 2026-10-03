import { Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { buttonClasses } from '../ui';

// Page-level error with a retry button, in place of Next's error.tsx.
@Component({
  selector: 'app-error-state',
  imports: [NzButtonModule, NzResultModule],
  templateUrl: './error-state.html',
})
export class ErrorState {
  readonly message = input('');
  readonly retry = output<void>();

  protected buttonClass = buttonClasses();
}
