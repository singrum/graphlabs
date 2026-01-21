// stores/selection-slice.ts

import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

export interface SelectionSlice {
  // 노드와 엣지 선택 상태를 각각 관리
  selectedNodeIds: Map<string, boolean>;
  selectedEdgeIds: Map<string, boolean>;
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
  selectedNodeIds: new Map(),
  selectedEdgeIds: new Map(),
  selectionRect: null,

  // 노드와 엣지를 한꺼번에 설정 (Marquee 선택 시 유용)
  setSelectedEntities: (nodeIds, edgeIds) =>
    set((state) => {
      state.selectedNodeIds.clear();
      state.selectedEdgeIds.clear();
      nodeIds.forEach((id) => state.selectedNodeIds.set(id, true));
      edgeIds.forEach((id) => state.selectedEdgeIds.set(id, true));
    }),

  setSelectedNodes: (ids) =>
    set((state) => {
      state.selectedNodeIds.clear();
      ids.forEach((id) => state.selectedNodeIds.set(id, true));
    }),

  setSelectedEdges: (ids) =>
    set((state) => {
      state.selectedEdgeIds.clear();
      ids.forEach((id) => state.selectedEdgeIds.set(id, true));
    }),

  toggleNodeSelection: (id) =>
    set((state) => {
      if (state.selectedNodeIds.has(id)) state.selectedNodeIds.delete(id);
      else state.selectedNodeIds.set(id, true);
    }),

  toggleEdgeSelection: (id) =>
    set((state) => {
      if (state.selectedEdgeIds.has(id)) state.selectedEdgeIds.delete(id);
      else state.selectedEdgeIds.set(id, true);
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
