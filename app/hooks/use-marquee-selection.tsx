import {
  getControlPoint,
  isCurveIntersectingRect,
  isLineIntersectingRect,
  isLoopIntersectingRect,
} from "@/lib/edge-utils";
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
  const lastSelectedHashRef = useRef<string>("");
  const [isSelecting, setIsSelecting] = useState(false);

  // 스토어에서 필요한 데이터만 추출
  const {
    nodes,
    edges,
    succ,
    nodeRadius,
    setSelectionRect,
    setSelectedEntities,
  } = useBoundStore(
    useShallow((state) => ({
      nodes: state.graph.nodes,
      edges: state.graph.edges,
      succ: state.graph.succ,
      nodeRadius: state.nodeRadius,
      setSelectionRect: state.setSelectionRect,
      setSelectedEntities: state.setSelectedEntities,
    })),
  );

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

        const rect = {
          minX: Math.min(rectData.x1, rectData.x2),
          maxX: Math.max(rectData.x1, rectData.x2),
          minY: Math.min(rectData.y1, rectData.y2),
          maxY: Math.max(rectData.y1, rectData.y2),
        };

        const nextNodeIds: string[] = [];
        const nextEdgeIds: string[] = [];

        // 1. 노드 충돌 검사
        nodes.forEach((node, id) => {
          const closestX = Math.max(rect.minX, Math.min(node._x, rect.maxX));
          const closestY = Math.max(rect.minY, Math.min(node._y, rect.maxY));
          const dx = node._x - closestX;
          const dy = node._y - closestY;
          if (dx * dx + dy * dy <= nodeRadius * nodeRadius)
            nextNodeIds.push(id);
        });

        // 2. 엣지 충돌 검사 (곡선 포함)
        edges.forEach((edge, id) => {
          const s = nodes.get(edge._source);
          const t = nodes.get(edge._target);
          if (!s || !t) return;

          const isLoop = edge._source === edge._target;

          if (isLoop) {
            const selfEdges = succ.get(edge._source)?.get(edge._target) || [];
            const index = selfEdges.indexOf(id);
            // 루프는 이미 getSelfLoopPoints 내부에서 radius를 반영하여 테두리부터 그리므로 그대로 사용
            if (isLoopIntersectingRect(s._x, s._y, nodeRadius, index, rect)) {
              nextEdgeIds.push(id);
            }
          } else {
            const [fId, secId] =
              edge._source < edge._target
                ? [edge._source, edge._target]
                : [edge._target, edge._source];
            const forward = succ.get(fId)?.get(secId) || [];
            const backward = succ.get(secId)?.get(fId) || [];
            const pairEdgeIds = [...forward, ...backward];

            const total = pairEdgeIds.length;
            const index = pairEdgeIds.indexOf(id);
            const isCurved = total > 1;

            // ✅ 핵심: 노드 테두리 좌표로 보정 (Trim)
            // 직선의 경우 단순히 두 점 사이의 각도를 구해 radius만큼 이동시킵니다.
            const dx = t._x - s._x;
            const dy = t._y - s._y;
            const angle = Math.atan2(dy, dx);

            // 실제 화면에 그려지는 엣지의 시작점과 끝점
            const trimmedS = {
              x: s._x + Math.cos(angle) * nodeRadius,
              y: s._y + Math.sin(angle) * nodeRadius,
            };
            const trimmedT = {
              x: t._x - Math.cos(angle) * nodeRadius,
              y: t._y - Math.sin(angle) * nodeRadius,
            };

            if (isCurved) {
              const step = 40;
              const offset = (index - (total - 1) / 2) * step;
              const isReversed = edge._source > edge._target;

              // 1. 노드 중심 기준 제어점을 구하되
              const cp = getControlPoint(
                s._x,
                s._y,
                t._x,
                t._y,
                offset,
                isReversed,
              );

              // 2. 곡선의 실제 시작/끝 각도를 계산하여 테두리 좌표 구함 (GraphEdge 로직과 동일)
              const angleSource = Math.atan2(cp.y - s._y, cp.x - s._x);
              const angleTarget = Math.atan2(cp.y - t._y, cp.x - t._x);

              const curveS = {
                x: s._x + Math.cos(angleSource) * nodeRadius,
                y: s._y + Math.sin(angleSource) * nodeRadius,
              };
              const curveT = {
                x: t._x + Math.cos(angleTarget) * nodeRadius,
                y: t._y + Math.sin(angleTarget) * nodeRadius,
              };

              // 보정된 curveS, curveT를 사용하여 충돌 검사
              if (
                isCurveIntersectingRect(
                  curveS.x,
                  curveS.y,
                  cp.x,
                  cp.y,
                  curveT.x,
                  curveT.y,
                  rect,
                )
              ) {
                nextEdgeIds.push(id);
              }
            } else {
              // 3. 직선일 때도 보정된 trimmedS, trimmedT 사용
              if (
                isLineIntersectingRect(
                  trimmedS.x,
                  trimmedS.y,
                  trimmedT.x,
                  trimmedT.y,
                  rect,
                )
              ) {
                nextEdgeIds.push(id);
              }
            }
          }
        });

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
      succ,
      nodeRadius,
      setSelectedEntities,
    ],
  );

  const endSelection = useCallback(() => {
    // 마우스 버튼만 누르고 뗐을 때 (움직임이 없었을 때) 0개 선택 처리
    if (selectionStartPos.current && lastSelectedHashRef.current === "") {
      setSelectedEntities([], []);
    }
    selectionStartPos.current = null;
    lastSelectedHashRef.current = "";
    setIsSelecting(false);
    setSelectionRect(null);
  }, [setSelectionRect, setSelectedEntities]);

  return { startSelection, updateSelection, endSelection, isSelecting };
}
