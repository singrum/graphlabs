import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

// stores/selection-slice.ts
export interface SelectionSlice {
  selectedIds: string[];
  selectionRect: { x1: number; y1: number; x2: number; y2: number } | null;
  setSelectedIds: (ids: string[]) => void;
  setSelectionRect: (
    rect: { x1: number; y1: number; x2: number; y2: number } | null,
  ) => void;
}

export const createSelectionSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  SelectionSlice
> = (set) => ({
  selectedIds: [],
  selectionRect: null,
  setSelectedIds: (ids) =>
    set((state) => {
      state.selectedIds = ids;
    }),
  setSelectionRect: (rect) =>
    set((state) => {
      state.selectionRect = rect;
    }),
});
