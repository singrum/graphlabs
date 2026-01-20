import { useBoundStore } from "@/stores/use-bound-store";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { GraphEdge } from "./graph-edge/graph-edge";
import { GraphNode } from "./graph-node/graph-node";
import { TempEdge } from "./temp-edge/temp-edge";

import { useCanvasView } from "@/hooks/useCanvasView";
import { useMarqueeSelection } from "@/hooks/useMarqueeSelection";
import type Konva from "konva";

export default function GraphCanvas() {
  const nodeIds = useBoundStore(
    useShallow((state) => Array.from(state.graph.nodes.keys())),
  );
  const edgeIds = useBoundStore(
    useShallow((state) => Array.from(state.graph.edges.keys())),
  );

  const [
    tool,
    connectingNodeId,
    selectionRect,
    addNode,
    setTempCursorPos,
    resetEdgeEditor,
  ] = useBoundStore(
    useShallow((state) => [
      state.tool,
      state.connectingNodeId,
      state.selectionRect,
      state.addNode,
      state.setTempCursorPos,
      state.resetEdgeEditor,
    ]),
  );

  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const isPanningRef = useRef(false);

  // 로직 분리 (Hooks)
  const { getRelativePointerPosition, handleWheel } = useCanvasView();
  const { startSelection, updateSelection, endSelection, isSelecting } =
    useMarqueeSelection(getRelativePointerPosition);

  // 스페이스바 전역 감지
  useEffect(() => {
    const down = (e: KeyboardEvent) =>
      e.code === "Space" && setIsSpacePressed(true);
    const up = (e: KeyboardEvent) =>
      e.code === "Space" && setIsSpacePressed(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage || e.target !== stage) return;

    // [수정] Panning 중이 아니고, tool이 "select"일 때만 영역 선택 시작
    if (!isSpacePressed && tool === "select") {
      startSelection(stage);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    // 1. 엣지 연결 모드 (툴에 상관없이 connectingNodeId가 있으면 우선순위)
    if (connectingNodeId) {
      setTempCursorPos(pos);
    }
    // 2. 영역 선택 (tool이 "select"일 때만 작동)
    else if (isSelecting && tool === "select") {
      updateSelection(stage);
    }
  };

  const handleMouseUp = () => {
    // tool이 select가 아닐 때 selection이 남아있을 수 있으므로 항상 end 호출 (내부에서 체크)
    endSelection();
    if (connectingNodeId) resetEdgeEditor();

    setTimeout(() => {
      isPanningRef.current = false;
    }, 0);
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanningRef.current || isSpacePressed || isSelecting) return;
    if (tool === "node" && e.target === e.target.getStage()) {
      const pos = getRelativePointerPosition(e.target.getStage());
      if (pos) addNode(pos.x, pos.y);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleStageClick}
      onWheel={handleWheel}
      draggable={
        isSpacePressed ||
        (tool === "select" && !connectingNodeId && !isSelecting)
      }
      onDragStart={(e) =>
        e.target === e.target.getStage() && (isPanningRef.current = true)
      }
      style={{
        cursor: isSpacePressed
          ? "grab"
          : connectingNodeId
            ? "crosshair"
            : "default",
      }}
    >
      <Layer>
        {edgeIds.map((id) => (
          <GraphEdge key={id} id={id} />
        ))}
        <TempEdge />
        {nodeIds.map((id) => (
          <GraphNode key={id} id={id} />
        ))}
        {tool === "select" && selectionRect && (
          <Rect
            x={Math.min(selectionRect.x1, selectionRect.x2)}
            y={Math.min(selectionRect.y1, selectionRect.y2)}
            width={Math.abs(selectionRect.x2 - selectionRect.x1)}
            height={Math.abs(selectionRect.y2 - selectionRect.y1)}
            fill="rgba(0, 162, 255, 0.1)"
            stroke="rgba(0, 162, 255, 0.5)"
            strokeWidth={1}
            listening={false}
          />
        )}
      </Layer>
    </Stage>
  );
}
