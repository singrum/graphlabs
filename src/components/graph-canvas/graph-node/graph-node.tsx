import { useBoundStore } from "@/stores/use-bound-store";
import Konva from "konva";
import { memo } from "react";
import { Circle, Group, Text } from "react-konva";
import { useShallow } from "zustand/react/shallow";

export const GraphNode = memo(({ id }: { id: string }) => {
  const [
    node,
    tool,
    isSelected,
    setSelectedNodes,
    updateNodeConfig,
    addEdge,
    setConnectingNodeId,
    connectingNodeId,
    resetEdgeEditor,
    nodeRadius,
  ] = useBoundStore(
    useShallow((state) => [
      state.graph.nodes.get(id),
      state.tool,
      state.selectedNodeIds.has(id),
      state.setSelectedNodes, // 선택 영역 업데이트 함수
      state.updateNodeConfig,
      state.addEdge,
      state.setConnectingNodeId,
      state.connectingNodeId,
      state.resetEdgeEditor,
      state.nodeRadius,
    ]),
  );

  if (!node) return null;

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;

    // A. 엣지 모드일 때
    if (tool === "edge") {
      setConnectingNodeId(id);
    } else if (tool == "node") {
      if (!isSelected) {
        setSelectedNodes([id]);
      }
    } else {
      if (!isSelected) {
        setSelectedNodes([id]);
      }
    }
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === "edge" && connectingNodeId) {
      e.cancelBubble = true;
      addEdge(connectingNodeId, id);
      resetEdgeEditor();
    }
  };

  return (
    <Group
      x={node._x}
      y={node._y}
      draggable={tool === "node" || tool === "select"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDragMove={(e) => {
        updateNodeConfig(id, { _x: e.target.x(), _y: e.target.y() });
      }}
      listening={true}
    >
      {/* ... Circle 및 Text 로직 동일 */}
      <Circle
        radius={nodeRadius}
        fill={node._color}
        stroke={isSelected ? "#ffffff" : undefined}
        strokeWidth={isSelected ? 3 : 0}
        perfectDrawEnabled={false}
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
