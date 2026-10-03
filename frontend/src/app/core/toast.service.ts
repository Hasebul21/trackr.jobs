import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

// How long a toast stays on screen, same as sonner's default.
const DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  success(title: string, description?: string) {
    this.show('success', title, description);
  }

  error(title: string, description?: string) {
    this.show('error', title, description);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(type: ToastType, title: string, description?: string) {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, type, title, description }]);
    setTimeout(() => this.dismiss(id), DURATION_MS);
  }
}
