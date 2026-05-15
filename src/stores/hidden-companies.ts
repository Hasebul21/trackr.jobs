"use client";

// Hidden companies live in localStorage — per-browser, no server roundtrip.
// Same pattern as bookmarks; the key is the company `name` since that's
// the directory's stable identifier.

import { create } from "zustand";
import { persist } from "zustand/middleware";

type HiddenState = {
  ids: Record<string, true>;
  hide: (id: string) => void;
  restore: (id: string) => void;
  clear: () => void;
};

export const useHiddenCompanies = create<HiddenState>()(
  persist(
    (set) => ({
      ids: {},
      hide: (id) => set((s) => ({ ids: { ...s.ids, [id]: true } })),
      restore: (id) =>
        set((s) => {
          const next = { ...s.ids };
          delete next[id];
          return { ids: next };
        }),
      clear: () => set({ ids: {} }),
    }),
    { name: "job-stes:hidden-companies:v1" },
  ),
);
