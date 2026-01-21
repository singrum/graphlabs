// stores/selection-slice.ts

import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

export interface SelectionSlice {
  // 노드와 엣지 선택 상태를 각각 관리
  selectedNodeIds: Set<string>;
  selectedEdgeIds: Set<string>;
  selectionRect: { x1: number; y1: number; x2: number; y2: number } | null;

  // 액션들
  setSelectedEntities: (nodeIds: string[], edgeIds: string[]) => void;
  setSelectedNodes: (ids: string[]) => void;
  setSelectedEdges: (ids: string[]) => void;
  toggleNodeSelection: (id: string) => void;
  toggleEdgeSelection: (id: string) => void;
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
  selectedNodeIds: new Set(),
  selectedEdgeIds: new Set(),
  selectionRect: null,

  // 노드와 엣지를 한꺼번에 설정 (Marquee 선택 시 유용)
  setSelectedEntities: (nodeIds, edgeIds) =>
    set((state) => {
      state.selectedNodeIds.clear();
      state.selectedEdgeIds.clear();
      nodeIds.forEach((id) => state.selectedNodeIds.add(id));
      edgeIds.forEach((id) => state.selectedEdgeIds.add(id));
    }),

  setSelectedNodes: (ids) =>
    set((state) => {
      state.selectedNodeIds.clear();
      ids.forEach((id) => state.selectedNodeIds.add(id));
    }),

  setSelectedEdges: (ids) =>
    set((state) => {
      state.selectedEdgeIds.clear();
      ids.forEach((id) => state.selectedEdgeIds.add(id));
    }),

  toggleNodeSelection: (id) =>
    set((state) => {
      if (state.selectedNodeIds.has(id)) state.selectedNodeIds.delete(id);
      else state.selectedNodeIds.add(id);
    }),

  toggleEdgeSelection: (id) =>
    set((state) => {
      if (state.selectedEdgeIds.has(id)) state.selectedEdgeIds.delete(id);
      else state.selectedEdgeIds.add(id);
    }),

  clearSelection: () =>
    set((state) => {
      state.selectedNodeIds.clear();
      state.selectedEdgeIds.clear();
    }),

  setSelectionRect: (rect) =>
    set((state) => {
      state.selectionRect = rect;
    }),
});
