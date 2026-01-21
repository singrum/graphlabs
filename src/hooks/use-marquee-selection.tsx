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
  const lastSelectedHashRef = useRef<string>(""); // 렉 방지를 위한 캐시
  const [isSelecting, setIsSelecting] = useState(false);

  // Zustand에서 노드, 엣지, 그리고 분리된 선택 액션들을 가져옴
  const [nodes, edges, nodeRadius, setSelectionRect, setSelectedEntities] =
    useBoundStore(
      useShallow((state) => [
        state.graph.nodes,
        state.graph.edges,
        state.nodeRadius,
        state.setSelectionRect,
        state.setSelectedEntities, // Slice에서 새로 만든 통합 액션
      ]),
    );

  /** 1. 원(노드)과 사각형 충돌 판정 */
  const isCircleIntersectingRect = (
    circleX: number,
    circleY: number,
    radius: number,
    rect: { minX: number; maxX: number; minY: number; maxY: number },
  ) => {
    const closestX = Math.max(rect.minX, Math.min(circleX, rect.maxX));
    const closestY = Math.max(rect.minY, Math.min(circleY, rect.maxY));
    const dx = circleX - closestX;
    const dy = circleY - closestY;
    return dx * dx + dy * dy <= radius * radius;
  };

  /** 2. 선(엣지)과 사각형 충돌 판정 (실시간 선택용) */
  const isLineIntersectingRect = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    rect: { minX: number; maxX: number; minY: number; maxY: number },
  ) => {
    // A. 선의 두 끝점 중 하나라도 사각형 안에 있으면 충돌
    const isInside = (x: number, y: number) =>
      x >= rect.minX && x <= rect.maxX && y >= rect.minY && y <= rect.maxY;
    if (isInside(x1, y1) || isInside(x2, y2)) return true;

    // B. 선분과 사각형의 4개 변이 교차하는지 검사 (Cohen-Sutherland 알고리즘 간소화)
    const intersect = (
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number,
      p3x: number,
      p3y: number,
      p4x: number,
      p4y: number,
    ) => {
      const det = (p2x - p1x) * (p4y - p3y) - (p2y - p1y) * (p4x - p3x);
      if (det === 0) return false;
      const lambda =
        ((p4y - p3y) * (p4x - p1x) + (p3x - p4x) * (p4y - p1y)) / det;
      const gamma =
        ((p1y - p2y) * (p4x - p1x) + (p2x - p1x) * (p4y - p1y)) / det;
      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    };

    return (
      intersect(x1, y1, x2, y2, rect.minX, rect.minY, rect.maxX, rect.minY) || // 상
      intersect(x1, y1, x2, y2, rect.minX, rect.maxY, rect.maxX, rect.maxY) || // 하
      intersect(x1, y1, x2, y2, rect.minX, rect.minY, rect.minX, rect.maxY) || // 좌
      intersect(x1, y1, x2, y2, rect.maxX, rect.minY, rect.maxX, rect.maxY) // 우
    );
  };

  const startSelection = useCallback(
    (stage: Konva.Stage) => {
      const pos = getRelativePointerPosition(stage);
      if (pos) {
        selectionStartPos.current = pos;
        setIsSelecting(true);
        setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      }
    },
    [getRelativePointerPosition, setSelectionRect],
  );

  const updateSelection = useCallback(
    (stage: Konva.Stage) => {
      if (!selectionStartPos.current) return;

      // 브라우저 렌더링 프레임에 맞춰 실행 (성능 최적화)
      requestAnimationFrame(() => {
        const currentPos = getRelativePointerPosition(stage);
        if (!currentPos || !selectionStartPos.current) return;

        const rectData = {
          x1: selectionStartPos.current.x,
          y1: selectionStartPos.current.y,
          x2: currentPos.x,
          y2: currentPos.y,
        };
        setSelectionRect(rectData);

        const minX = Math.min(rectData.x1, rectData.x2);
        const maxX = Math.max(rectData.x1, rectData.x2);
        const minY = Math.min(rectData.y1, rectData.y2);
        const maxY = Math.max(rectData.y1, rectData.y2);
        const rect = { minX, maxX, minY, maxY };

        const nextNodeIds: string[] = [];
        const nextEdgeIds: string[] = [];

        // 1. 노드 실시간 충돌 검사
        nodes.forEach((node, id) => {
          if (isCircleIntersectingRect(node._x, node._y, nodeRadius, rect)) {
            nextNodeIds.push(id);
          }
        });

        // 2. 엣지 실시간 충돌 검사
        edges.forEach((edge, id) => {
          const s = nodes.get(edge._source);
          const t = nodes.get(edge._target);
          if (s && t && isLineIntersectingRect(s._x, s._y, t._x, t._y, rect)) {
            nextEdgeIds.push(id);
          }
        });

        // 3. 성능 최적화: 해시 비교를 통해 변경사항이 있을 때만 스토어 업데이트
        const currentHash = `${nextNodeIds.sort().join(",")}|${nextEdgeIds.sort().join(",")}`;
        if (lastSelectedHashRef.current !== currentHash) {
          lastSelectedHashRef.current = currentHash;
          setSelectedEntities(nextNodeIds, nextEdgeIds);
        }
      });
    },
    [
      getRelativePointerPosition,
      setSelectionRect,
      nodes,
      edges,
      nodeRadius,
      setSelectedEntities,
    ],
  );

  const endSelection = useCallback(() => {
    selectionStartPos.current = null;
    lastSelectedHashRef.current = "";
    setIsSelecting(false);
    setSelectionRect(null);
  }, [setSelectionRect]);

  return { startSelection, updateSelection, endSelection, isSelecting };
}
