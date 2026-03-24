import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

export interface EdgeEditorSlice {
  connectingNodeId: string | null; // 연결 시작 노드 ID
  tempCursorPos: { x: number; y: number } | null; // 마우스 현재 위치
  setConnectingNodeId: (id: string | null) => void;
  setTempCursorPos: (pos: { x: number; y: number } | null) => void;
  resetEdgeEditor: () => void; // 상태 초기화 액션 추가
}

export const createEdgeEditorSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  EdgeEditorSlice
> = (set) => ({
  connectingNodeId: null,
  tempCursorPos: null,

  // 연결 시작 노드 설정
  setConnectingNodeId: (id) =>
    set((state) => {
      state.connectingNodeId = id;
    }, false),

  // 마우스 실시간 위치 업데이트
  setTempCursorPos: (pos) =>
    set((state) => {
      // Immer를 사용하므로 새로운 객체 참조를 할당해도 안전합니다.
      state.tempCursorPos = pos;
    }, false),

  // 연결 종료 또는 취소 시 상태 초기화
  resetEdgeEditor: () =>
    set((state) => {
      state.connectingNodeId = null;
      state.tempCursorPos = null;
    }, false),
});
