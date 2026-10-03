import { HttpErrorResponse } from '@angular/common/http';

// Pulls a readable message out of an HTTP or runtime error for toasts and
// error states. Nest error bodies look like { message: string | string[] }.
export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as { message?: unknown } | null;
    if (body && typeof body === 'object') {
      if (typeof body.message === 'string') return body.message;
      if (Array.isArray(body.message)) return body.message.join(', ');
    }
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}
