import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

// stores/selection-slice.ts
export interface SelectionSlice {
  // Key: 노드 ID, Value: 선택 여부 (true)
  selectedIds: Map<string, boolean>;
  selectionRect: { x1: number; y1: number; x2: number; y2: number } | null;

  // 액션들
  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void; // 개별 선택 반전용
  clearSelection: () => void;
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
  selectedIds: new Map(),
  selectionRect: null,

  setSelectedIds: (ids) =>
    set((state) => {
      state.selectedIds.clear();
      ids.forEach((id) => state.selectedIds.set(id, true));
    }),

  toggleSelection: (id) =>
    set((state) => {
      if (state.selectedIds.has(id)) {
        state.selectedIds.delete(id);
      } else {
        state.selectedIds.set(id, true);
      }
    }),

  clearSelection: () =>
    set((state) => {
      state.selectedIds.clear();
    }),

  setSelectionRect: (rect) =>
    set((state) => {
      state.selectionRect = rect;
    }),
});
