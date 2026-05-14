"use client";

// Bookmarks live in localStorage — no account system in v1. Zustand
// `persist` middleware handles serialization + hydration.

import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookmarkState = {
  ids: Record<string, true>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  list: () => string[];
  clear: () => void;
};

export const useBookmarks = create<BookmarkState>()(
  persist(
    (set, get) => ({
      ids: {},
      toggle: (id) =>
        set((s) => {
          const next = { ...s.ids };
          if (next[id]) delete next[id];
          else next[id] = true;
          return { ids: next };
        }),
      has: (id) => !!get().ids[id],
      list: () => Object.keys(get().ids),
      clear: () => set({ ids: {} }),
    }),
    { name: "job-stes:bookmarks:v1" },
  ),
);
