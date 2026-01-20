import { useBoundStore } from "@/stores/use-bound-store";
import { memo } from "react";
import { Line } from "react-konva";

function useEdgeCoords(edgeId: string) {
  const edge = useBoundStore((state) => state.graph.edges.get(edgeId));

  const x1 = useBoundStore(
    (state) => state.graph.nodes.get(edge?._source || "")?._x,
  );
  const y1 = useBoundStore(
    (state) => state.graph.nodes.get(edge?._source || "")?._y,
  );
  const x2 = useBoundStore(
    (state) => state.graph.nodes.get(edge?._target || "")?._x,
  );
  const y2 = useBoundStore(
    (state) => state.graph.nodes.get(edge?._target || "")?._y,
  );
  if (!edge) return undefined;
  if (
    x1 === undefined ||
    y1 === undefined ||
    x2 === undefined ||
    y2 === undefined
  )
    return undefined;

  return [x1, y1, x2, y2];
}

export const GraphEdge = memo(({ id }: { id: string }) => {
  // 1. 해당 엣지 정보를 가져옴
  const coords = useEdgeCoords(id);
  if (!coords) return null;
  const [sourceNodeX, sourceNodeY, targetNodeX, targetNodeY] = coords;

  if (
    sourceNodeX === undefined ||
    sourceNodeY === undefined ||
    targetNodeX === undefined ||
    targetNodeY === undefined
  )
    return null;
  return (
    <Line
      points={[sourceNodeX, sourceNodeY, targetNodeX, targetNodeY]}
      stroke="#94a3b8"
      strokeWidth={2}
      listening={false}
      lineCap="round"
      lineJoin="round"
    />
  );
});
