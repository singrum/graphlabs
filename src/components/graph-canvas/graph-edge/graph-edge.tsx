import { getControlPoint, getSelfLoopPoints } from "@/lib/edge-utils";
import { useBoundStore } from "@/stores/use-bound-store";
import { memo, useMemo } from "react";
import { Arrow } from "react-konva"; // Line 대신 Arrow 사용
import { useShallow } from "zustand/react/shallow";
export const GraphEdge = memo(({ id }: { id: string }) => {
  const pointerLength = useBoundStore((state) => state.pointerLength);
  const pointerWidth = useBoundStore((state) => state.pointerWidth);
  const edge = useBoundStore((state) => state.graph.edges.get(id))!;
  const isSelected = useBoundStore((state) => state.selectedEdgeIds.has(id));
  const tool = useBoundStore((state) => state.tool);
  const nodeRadius = useBoundStore((state) => state.nodeRadius);
  const setSelectedEntities = useBoundStore(
    (state) => state.setSelectedEntities,
  );

  const sId = edge._source;
  const tId = edge._target;

  const sx = useBoundStore((state) => state.graph.nodes.get(sId)!._x);
  const sy = useBoundStore((state) => state.graph.nodes.get(sId)!._y);
  const tx = useBoundStore((state) => state.graph.nodes.get(tId)!._x);
  const ty = useBoundStore((state) => state.graph.nodes.get(tId)!._y);

  const pairEdgeIds = useBoundStore(
    useShallow((state) => {
      const [firstId, secondId] = sId < tId ? [sId, tId] : [tId, sId];

      const forward = state.graph.succ.get(firstId)?.get(secondId) || [];
      const backward = state.graph.succ.get(secondId)?.get(firstId) || [];

      return [...forward, ...backward];
    }),
  );

  const isLoop = sId === tId; // 자기 자신인지 확인

  // 4. 레이아웃 계산
  const layout = useMemo(() => {
    if (isLoop) {
      const points = getSelfLoopPoints(
        sx,
        sy,
        nodeRadius,
        pairEdgeIds.indexOf(id),
      );
      return { points, isCurved: true, isLoop: true };
    }
    const total = pairEdgeIds.length;
    const index = pairEdgeIds.indexOf(id);
    const isCurved = total > 1;
    const step = 40;
    const offset = isCurved ? (index - (total - 1) / 2) * step : 0;
    const isReversed = sId > tId;

    let points: number[] = [];

    if (isCurved) {
      const cp = getControlPoint(sx, sy, tx, ty, offset, isReversed);
      const angleSource = Math.atan2(cp.y - sy, cp.x - sx);
      const angleTarget = Math.atan2(cp.y - ty, cp.x - tx);

      points = [
        sx + Math.cos(angleSource) * nodeRadius,
        sy + Math.sin(angleSource) * nodeRadius,
        cp.x,
        cp.y,
        tx + Math.cos(angleTarget) * nodeRadius,
        ty + Math.sin(angleTarget) * nodeRadius,
      ];
    } else {
      const angle = Math.atan2(ty - sy, tx - sx);
      points = [
        sx + Math.cos(angle) * nodeRadius,
        sy + Math.sin(angle) * nodeRadius,
        tx - Math.cos(angle) * nodeRadius,
        ty - Math.sin(angle) * nodeRadius,
      ];
    }

    return { points, isCurved, isLoop: false };
  }, [id, sx, sy, tx, ty, pairEdgeIds, nodeRadius, isLoop, sId, tId]);

  return (
    <Arrow
      points={layout.points}
      tension={layout.isLoop ? 0.5 : layout.isCurved ? 0.5 : 0}
      stroke={isSelected ? "#00a2ff" : "#94a3b8"}
      strokeWidth={isSelected ? 3 : 2}
      fill={isSelected ? "#00a2ff" : "#94a3b8"}
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
