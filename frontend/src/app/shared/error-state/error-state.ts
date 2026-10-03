import { Component, input, output } from '@angular/core';
import { buttonClasses } from '../ui';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
})
export class ErrorState {
  readonly message = input('');
  readonly retry = output<void>();

  protected buttonClass = buttonClasses();
}
