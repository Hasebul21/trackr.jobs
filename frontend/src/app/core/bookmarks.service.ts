import { computed, Injectable, signal } from '@angular/core';
import { IdSet, loadIds, saveIds } from './persisted-ids';

// Bookmarks live in localStorage, there is no account system.
const STORAGE_KEY = 'job-stes:bookmarks:v1';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  readonly ids = signal<IdSet>(loadIds(STORAGE_KEY));
  readonly list = computed(() => Object.keys(this.ids()));

  has(id: string): boolean {
    return !!this.ids()[id];
  }

  toggle(id: string) {
    const next = { ...this.ids() };
    if (next[id]) delete next[id];
    else next[id] = true;
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
