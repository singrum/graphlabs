import { useBoundStore } from "@/stores/use-bound-store";
import type Konva from "konva";
import { useCallback, useRef, useState } from "react";

export function useMarqueeSelection(
  getRelativePointerPosition: (
    stage: Konva.Stage,
  ) => { x: number; y: number } | null,
) {
  const selectionStartPos = useRef<{ x: number; y: number } | null>(null);

  // 1. 선택 진행 여부를 useState로 관리하여 에러 해결 및 리렌더링 보장
  const [isSelecting, setIsSelecting] = useState(false);

  // 2. Zustand 상태를 필요한 것만 가져옴
  const nodes = useBoundStore((state) => state.graph.nodes);
  const selectionRect = useBoundStore((state) => state.selectionRect);
  const { setSelectionRect, setSelectedIds } = useBoundStore();

  const startSelection = useCallback(
    (stage: Konva.Stage) => {
      const pos = getRelativePointerPosition(stage);
      if (pos) {
        selectionStartPos.current = pos;
        setIsSelecting(true); // 선택 시작 상태 업데이트
        setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      }
    },
    [getRelativePointerPosition, setSelectionRect],
  );

  const updateSelection = useCallback(
    (stage: Konva.Stage) => {
      // 렌더링 중이 아닌 이벤트 핸들러 내부이므로 .current 접근 가능
      if (!selectionStartPos.current) return;
      const currentPos = getRelativePointerPosition(stage);
      if (currentPos) {
        setSelectionRect({
          x1: selectionStartPos.current.x,
          y1: selectionStartPos.current.y,
          x2: currentPos.x,
          y2: currentPos.y,
        });
      }
    },
    [getRelativePointerPosition, setSelectionRect],
  );

  const endSelection = useCallback(() => {
    if (selectionRect) {
      const selected: string[] = [];
      const { x1, y1, x2, y2 } = selectionRect;
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      // O(N) 연산 수행 (nodes가 Map인 경우)
      nodes.forEach((node, id) => {
        const { _x, _y } = node;
        if (_x >= minX && _x <= maxX && _y >= minY && _y <= maxY) {
          selected.push(id);
        }
      });
      setSelectedIds(selected);
    }

    // 상태 초기화
    selectionStartPos.current = null;
    setIsSelecting(false); // 선택 종료 상태 업데이트
    setSelectionRect(null);
  }, [selectionRect, nodes, setSelectedIds, setSelectionRect]);

  return {
    startSelection,
    updateSelection,
    endSelection,
    isSelecting, // 이제 안전하게 상태를 반환합니다.
  };
}
