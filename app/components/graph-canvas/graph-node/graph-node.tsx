import { useBoundStore } from "@/stores/use-bound-store";
import Konva from "konva";
import { memo } from "react";
import { Circle, Group, Text } from "react-konva";
import { useShallow } from "zustand/react/shallow";

export const GraphNode = memo(({ id }: { id: string }) => {
  // 1. 모든 Hook은 최상단에서 호출 (ESLint 규칙 준수)
  const [
    node, // !를 제거하여 undefined 허용
    tool,
    isSelected,
    setSelectedEntities,
    updateEntities,
    addEdge,
    setConnectingNodeId,
    connectingNodeId,
    resetEdgeEditor,
    nodeRadius,
  ] = useBoundStore(
    useShallow((state) => [
      state.graph.nodes.get(id), // ! 제거
      state.tool,
      state.selectedNodeIds.has(id),
      state.setSelectedEntities,
      state.updateEntities,
      state.addEdge,
      state.setConnectingNodeId,
      state.connectingNodeId,
      state.resetEdgeEditor,
      state.nodeRadius,
    ]),
  );

  // 2. [가드 로직] 데이터가 없으면 즉시 null 반환 (Hook 호출 이후에 위치)
  if (!node) return null;

  // 3. 이벤트 핸들러 정의
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;

    if (tool === "edge") {
      setConnectingNodeId(id);
    } else {
      // node 모드 혹은 select 모드일 때
      setSelectedEntities([id], []);
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
        // 드래그 중에 노드가 삭제될 일은 거의 없지만, updateEntities를 통해 안전하게 처리
        updateEntities("node", [id], {
          _x: e.target.x(),
          _y: e.target.y(),
        });
      }}
      listening={true}
    >
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
        // 텍스트 위치를 반지름에 맞춰 동적으로 계산
        x={-nodeRadius}
        y={nodeRadius + 8}
        width={nodeRadius * 2}
        align="center"
        fill={node._color}
        listening={false}
      />
    </Group>
  );
});
