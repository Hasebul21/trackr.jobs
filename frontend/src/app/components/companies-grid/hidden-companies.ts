import { Injectable, computed, signal } from '@angular/core';

// Same storage key and shape the old zustand store used, so a hide list
// saved by the previous app is picked up as-is.
const STORAGE_KEY = 'job-stes:hidden-companies:v1';

type HiddenIds = Record<string, true>;

@Injectable({ providedIn: 'root' })
export class HiddenCompanies {
  private readonly state = signal<HiddenIds>(load());

  readonly ids = this.state.asReadonly();
  readonly count = computed(() => Object.keys(this.state()).length);

  isHidden(name: string): boolean {
    return !!this.state()[name];
  }

  hide(name: string): void {
    this.update({ ...this.state(), [name]: true });
  }

  restore(name: string): void {
    const next = { ...this.state() };
    delete next[name];
    this.update(next);
  }

  clear(): void {
    this.update({});
  }

  private update(ids: HiddenIds): void {
    this.state.set(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { ids }, version: 0 }));
    } catch {
      // Storage can be unavailable (private mode, quota); keep the in-memory state.
    }
  }
}

function load(): HiddenIds {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw)?.state?.ids : null;
    return ids && typeof ids === 'object' ? ids : {};
  } catch {
    return {};
  }
}
