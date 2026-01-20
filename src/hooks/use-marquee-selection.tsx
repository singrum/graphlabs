import { useBoundStore } from "@/stores/use-bound-store";
import type Konva from "konva";
import { useCallback, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export function useMarqueeSelection(
  getRelativePointerPosition: (
    stage: Konva.Stage,
  ) => { x: number; y: number } | null,
) {
  const selectionStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const [nodes, setSelectionRect, setSelectedIds, nodeRadius] = useBoundStore(
    useShallow((state) => [
      state.graph.nodes,
      state.setSelectionRect,
      state.setSelectedIds,
      state.nodeRadius,
    ]),
  );

  // --- 도움말: 원과 사각형의 충돌 판정 함수 ---
  const isCircleIntersectingRect = (
    circleX: number,
    circleY: number,
    radius: number,
    rect: { minX: number; maxX: number; minY: number; maxY: number },
  ) => {
    // 1. 사각형 내에서 원의 중심과 가장 가까운 점을 찾음
    const closestX = Math.max(rect.minX, Math.min(circleX, rect.maxX));
    const closestY = Math.max(rect.minY, Math.min(circleY, rect.maxY));

    // 2. 그 점과 원의 중심 사이의 거리를 계산 (피타고라스)
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // 3. 거리의 제곱이 반지름의 제곱보다 작거나 같으면 충돌(겹침)
    return distanceSquared <= radius * radius;
  };

  const startSelection = useCallback(
    (stage: Konva.Stage) => {
      const pos = getRelativePointerPosition(stage);
      if (pos) {
        selectionStartPos.current = pos;
        setIsSelecting(true);
        setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
        // 시작 시점에 선택 영역 초기화 (필요시)
        setSelectedIds([]);
      }
    },
    [getRelativePointerPosition, setSelectionRect, setSelectedIds],
  );

  const updateSelection = useCallback(
    (stage: Konva.Stage) => {
      if (!selectionStartPos.current) return;
      const currentPos = getRelativePointerPosition(stage);
      if (!currentPos) return;

      // 1. 사각형 영역 업데이트
      const rectData = {
        x1: selectionStartPos.current.x,
        y1: selectionStartPos.current.y,
        x2: currentPos.x,
        y2: currentPos.y,
      };
      setSelectionRect(rectData);

      // 2. 실시간 선택 로직 실행 (O(N))
      const minX = Math.min(rectData.x1, rectData.x2);
      const maxX = Math.max(rectData.x1, rectData.x2);
      const minY = Math.min(rectData.y1, rectData.y2);
      const maxY = Math.max(rectData.y1, rectData.y2);

      const selected: string[] = [];

      nodes.forEach((node, id) => {
        const { _x, _y } = node;

        // 원과 사각형의 충돌 검사 (실시간)
        if (
          isCircleIntersectingRect(_x, _y, nodeRadius, {
            minX,
            maxX,
            minY,
            maxY,
          })
        ) {
          selected.push(id);
        }
      });

      // 3. 즉시 Store 업데이트 (Map 기반이므로 효율적)
      setSelectedIds(selected);
    },
    [
      getRelativePointerPosition,
      setSelectionRect,
      nodes,
      setSelectedIds,
      nodeRadius,
    ],
  );

  const endSelection = useCallback(() => {
    selectionStartPos.current = null;
    setIsSelecting(false);
    setSelectionRect(null);
    // 선택된 ID는 이미 updateSelection에서 실시간으로 반영되었으므로 초기화하지 않음
  }, [setSelectionRect]);

  return { startSelection, updateSelection, endSelection, isSelecting };
}
