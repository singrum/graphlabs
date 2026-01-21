import { getControlPoint } from "@/lib/edge-utils";
import { useBoundStore } from "@/stores/use-bound-store";
import { memo, useMemo } from "react";
import { Arrow } from "react-konva"; // Line 대신 Arrow 사용
import { useShallow } from "zustand/react/shallow";
export const GraphEdge = memo(({ id }: { id: string }) => {
  // 1. 단순 원시값들은 개별 구독 (가장 안전)
  const edge = useBoundStore((state) => state.graph.edges.get(id))!;
  const isSelected = useBoundStore((state) => state.selectedEdgeIds.has(id));
  const tool = useBoundStore((state) => state.tool);
  const nodeRadius = useBoundStore((state) => state.nodeRadius);
  const setSelectedEntities = useBoundStore(
    (state) => state.setSelectedEntities,
  );

  const sId = edge._source;
  const tId = edge._target;

  // 2. 좌표값 개별 구독 (숫자형이므로 무한 루프 위험 제로)
  const sx = useBoundStore((state) => state.graph.nodes.get(sId)?._x);
  const sy = useBoundStore((state) => state.graph.nodes.get(sId)?._y);
  const tx = useBoundStore((state) => state.graph.nodes.get(tId)?._x);
  const ty = useBoundStore((state) => state.graph.nodes.get(tId)?._y);

  // 3. [여기가 범인] 중복 엣지 ID 배열 구독
  // useShallow를 사용하여 배열 내부의 ID들이 정확히 일치할 때만 리렌더링을 차단합니다.
  const pairEdgeIds = useBoundStore(
    useShallow((state) => {
      const [firstId, secondId] = sId < tId ? [sId, tId] : [tId, sId];

      const forward = state.graph.succ.get(firstId)?.get(secondId) || [];
      const backward = state.graph.succ.get(secondId)?.get(firstId) || [];

      return [...forward, ...backward];
    }),
  );

  // 4. 레이아웃 계산
  const layout = useMemo(() => {
    if (
      sx === undefined ||
      sy === undefined ||
      tx === undefined ||
      ty === undefined
    )
      return null;

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

    return { points, isCurved };
  }, [id, sx, sy, tx, ty, pairEdgeIds, nodeRadius]);

  if (!layout) return null;

  return (
    <Arrow
      points={layout.points}
      tension={layout.isCurved ? 0.5 : 0}
      stroke={isSelected ? "#00a2ff" : "#94a3b8"}
      strokeWidth={isSelected ? 3 : 2}
      fill={isSelected ? "#00a2ff" : "#94a3b8"}
      pointerLength={8}
      pointerWidth={8}
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
