import { getControlPoint, getSelfLoopPoints } from "@/lib/edge-utils";
import { useBoundStore } from "@/stores/use-bound-store";
import { memo, useMemo } from "react";
import { Arrow } from "react-konva"; // Line 대신 Arrow 사용
import { useShallow } from "zustand/react/shallow";
export const GraphEdge = memo(({ id }: { id: string }) => {
  // 1. 모든 Hook은 컴포넌트 최상단에 몰아서 배치합니다. (순서 고정)
  const pointerLength = useBoundStore((state) => state.pointerLength);
  const pointerWidth = useBoundStore((state) => state.pointerWidth);
  const nodeRadius = useBoundStore((state) => state.nodeRadius);
  const tool = useBoundStore((state) => state.tool);
  const setSelectedEntities = useBoundStore(
    (state) => state.setSelectedEntities,
  );

  const edge = useBoundStore((state) => state.graph.edges.get(id));
  const isSelected = useBoundStore((state) => state.selectedEdgeIds.has(id));

  const sId = edge?._source;
  const tId = edge?._target;

  const sourceNode = useBoundStore((state) =>
    sId ? state.graph.nodes.get(sId) : null,
  );
  const targetNode = useBoundStore((state) =>
    tId ? state.graph.nodes.get(tId) : null,
  );

  const pairEdgeIds = useBoundStore(
    useShallow((state) => {
      if (!sId || !tId) return [];
      const [firstId, secondId] = sId < tId ? [sId, tId] : [tId, sId];
      const forward = state.graph.succ.get(firstId)?.get(secondId) || [];
      const backward = state.graph.succ.get(secondId)?.get(firstId) || [];
      return [...forward, ...backward];
    }),
  );

  const layout = useMemo(() => {
    if (!edge || !sourceNode || !targetNode) {
      return { points: [], isCurved: false, isLoop: false };
    }

    const sx = sourceNode._x;
    const sy = sourceNode._y;
    const tx = targetNode._x;
    const ty = targetNode._y;
    const isLoop = sId === tId;

    const tipOffset = pointerLength * 0.2;
    const adjustedRadius = nodeRadius + tipOffset;

    if (isLoop) {
      const loopIndex = pairEdgeIds.indexOf(id);
      const points = getSelfLoopPoints(
        sx,
        sy,
        adjustedRadius,
        loopIndex !== -1 ? loopIndex : 0,
      );
      return { points, isCurved: true, isLoop: true };
    }

    const total = pairEdgeIds.length;
    const index = pairEdgeIds.indexOf(id);
    const isCurved = total > 1;
    const step = 40;
    const offset = isCurved ? (index - (total - 1) / 2) * step : 0;
    const isReversed = (sId ?? "") > (tId ?? "");

    let points: number[] = [];
    if (isCurved && index !== -1) {
      const cp = getControlPoint(sx, sy, tx, ty, offset, isReversed);
      const angleSource = Math.atan2(cp.y - sy, cp.x - sx);
      const angleTarget = Math.atan2(cp.y - ty, cp.x - tx);
      points = [
        sx + Math.cos(angleSource) * adjustedRadius,
        sy + Math.sin(angleSource) * adjustedRadius,
        cp.x,
        cp.y,
        tx + Math.cos(angleTarget) * adjustedRadius,
        ty + Math.sin(angleTarget) * adjustedRadius,
      ];
    } else {
      const angle = Math.atan2(ty - sy, tx - sx);
      points = [
        sx + Math.cos(angle) * adjustedRadius,
        sy + Math.sin(angle) * adjustedRadius,
        tx - Math.cos(angle) * adjustedRadius,
        ty - Math.sin(angle) * adjustedRadius,
      ];
    }
    return { points, isCurved, isLoop: false };
  }, [
    id,
    edge,
    sourceNode,
    targetNode,
    pairEdgeIds,
    nodeRadius,
    pointerLength,
    sId,
    tId,
  ]);

  // 3. [최종 가드] 모든 Hook 호출이 끝난 후에 조건부 렌더링을 수행합니다.
  if (!edge || !sourceNode || !targetNode || layout.points.length === 0) {
    return null;
  }

  return (
    <Arrow
      points={layout.points}
      tension={layout.isLoop ? 0.5 : layout.isCurved ? 0.5 : 0}
      stroke={isSelected ? "#ffffff" : "#94a3b8"}
      strokeWidth={3}
      fill={isSelected ? "#ffffff" : "#94a3b8"}
      pointerLength={pointerLength}
      pointerWidth={pointerWidth}
      listening={true}
      lineCap="round"
      lineJoin="round"
      onClick={(e) => {
        if (tool === "select") {
          e.cancelBubble = true;
          setSelectedEntities([], [id]);
        }
      }}
    />
  );
});
