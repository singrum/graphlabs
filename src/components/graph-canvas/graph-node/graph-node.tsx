import { useBoundStore } from "@/stores/use-bound-store";
import Konva from "konva";
import { memo } from "react";
import { Circle, Group, Text } from "react-konva";

export const GraphNode = memo(({ id }: { id: string }) => {
  const node = useBoundStore((state) => state.graph.nodes.get(id));
  const tool = useBoundStore((state) => state.tool);

  const updateNodeConfig = useBoundStore((state) => state.updateNodeConfig);
  const addEdge = useBoundStore((state) => state.addEdge);
  const { connectingNodeId, setConnectingNodeId, resetEdgeEditor } =
    useBoundStore();

  if (!node) return null;

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "edge") {
      e.cancelBubble = true; // Stage 클릭 이벤트 방지
      setConnectingNodeId(id);
    }
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "edge" && connectingNodeId && connectingNodeId !== id) {
      e.cancelBubble = true;
      addEdge(connectingNodeId, id);
      resetEdgeEditor();
    }
  };

  return (
    <Group
      x={node._x}
      y={node._y}
      draggable={tool === "node"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragMove={(e) => {
        updateNodeConfig(id, { _x: e.target.x(), _y: e.target.y() });
      }}
    >
      <Circle
        radius={25}
        fill={node._color || "#3b82f6"}
        stroke="white"
        strokeWidth={2}
      />
      <Text
        text={node._label}
        fontSize={12}
        x={-25}
        y={30}
        width={50}
        align="center"
        fill="#333"
        listening={false}
      />
    </Group>
  );
});
