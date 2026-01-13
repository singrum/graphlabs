import { useBoundStore } from "@/stores/use-bound-store";
import Konva from "konva";
import { memo } from "react";
import { Circle, Group, Text } from "react-konva";

export const GraphNode = memo(({ id }: { id: string }) => {
  const node = useBoundStore((state) => state.nodes.get(id));
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
      x={node.config.x}
      y={node.config.y}
      draggable={tool === "node"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragStart={(e) => tool === "node" && e.target.cache()}
      onDragMove={(e) => {
        updateNodeConfig(id, { x: e.target.x(), y: e.target.y() });
      }}
      onDragEnd={(e) => {
        e.target.clearCache();
      }}
    >
      <Circle
        radius={25}
        fill={node.config.color || "#3b82f6"}
        stroke="white"
        strokeWidth={2}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={5}
      />
      <Text
        text={node.config.label}
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
