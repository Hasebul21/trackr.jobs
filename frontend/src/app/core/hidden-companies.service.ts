import { computed, Injectable, signal } from '@angular/core';
import { IdSet, loadIds, saveIds } from './persisted-ids';

// Companies the user hid from the directory, keyed by company name.
// Stored per browser, same as bookmarks.
const STORAGE_KEY = 'job-stes:hidden-companies:v1';

@Injectable({ providedIn: 'root' })
export class HiddenCompaniesService {
  readonly ids = signal<IdSet>(loadIds(STORAGE_KEY));
  readonly list = computed(() => Object.keys(this.ids()));

  has(id: string): boolean {
    return !!this.ids()[id];
  }

  hide(id: string) {
    this.set({ ...this.ids(), [id]: true });
  }

  restore(id: string) {
    const next = { ...this.ids() };
    delete next[id];
    this.set(next);
  }

  clear() {
    this.set({});
  }

  private set(ids: IdSet) {
    this.ids.set(ids);
    saveIds(STORAGE_KEY, ids);
  }
}
