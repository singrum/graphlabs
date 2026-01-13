import { useBoundStore } from "@/stores/use-bound-store";
import type Konva from "konva";
import { useCallback } from "react";
import { Layer, Stage } from "react-konva";

import { GraphEdge } from "./graph-edge/graph-edge";
import { GraphNode } from "./graph-node/graph-node";
import { TempEdge } from "./temp-edge/temp-edge";

export default function GraphCanvas() {
  // ID 목록만 구독 (내용물 변경 시에만 Stage 리렌더링)
  const nodes = useBoundStore((state) => state.nodes);
  const edges = useBoundStore((state) => state.edges);
  const nodeIds = Array.from(nodes.keys());
  const edgeIds = Array.from(edges.keys());

  const tool = useBoundStore((state) => state.tool);
  const connectingNodeId = useBoundStore((state) => state.connectingNodeId);

  const addNode = useBoundStore((state) => state.addNode);
  const setTempCursorPos = useBoundStore((state) => state.setTempCursorPos);
  const resetEdgeEditor = useBoundStore((state) => state.resetEdgeEditor);

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (connectingNodeId) {
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) setTempCursorPos(pos);
      }
    },
    [connectingNodeId, setTempCursorPos]
  );

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (tool !== "node" || e.target !== e.target.getStage()) return;
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        addNode({
          id: `node-${Date.now()}`,
          config: {
            x: pos.x,
            y: pos.y,
            label: `N${nodeIds.length + 1}`,
            color: "#3b82f6",
          },
        });
      }
    },
    [tool, addNode, nodeIds.length]
  );

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={handleStageClick}
      onMouseMove={handleMouseMove}
      onMouseUp={() => connectingNodeId && resetEdgeEditor()}
      style={{ backgroundColor: "#f8fafc" }}
    >
      <Layer>
        {edgeIds.map((id) => (
          <GraphEdge key={id} id={id} />
        ))}

        <TempEdge />

        {nodeIds.map((id) => (
          <GraphNode key={id} id={id} />
        ))}
      </Layer>
    </Stage>
  );
}
