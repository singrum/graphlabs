import { useBoundStore } from "@/stores/use-bound-store";
import { Line } from "react-konva";

export const TempEdge = () => {
  const connectingNodeId = useBoundStore((state) => state.connectingNodeId);
  const tempCursorPos = useBoundStore((state) => state.tempCursorPos);
  const sourceNode = useBoundStore((state) =>
    state.graph.nodes.get(connectingNodeId || ""),
  );

  // ❌ 여기서 절대 setTempCursorPos를 호출하지 마세요.

  if (!sourceNode || !tempCursorPos) return null;

  return (
    <Line
      points={[sourceNode._x, sourceNode._y, tempCursorPos.x, tempCursorPos.y]}
      stroke="#3b82f6"
      strokeWidth={2}
      dash={[10, 5]}
    />
  );
};
