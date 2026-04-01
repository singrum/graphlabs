import { getControlPoint, getSelfLoopPoints } from "@/lib/edge-utils"
import { useBoundStore } from "@/stores/use-bound-store"
import type { DirectedGraph, UndirectedGraph } from "@/types/graph"

import { memo, useMemo } from "react"
import { Arrow, Line } from "react-konva" // Line 추가
import { useShallow } from "zustand/react/shallow"
const EDGE_MARGIN = 3
export const GraphEdge = memo(({ id }: { id: string }) => {
  const pointerLength = useBoundStore((state) => state.pointerLength)
  const pointerWidth = useBoundStore((state) => state.pointerWidth)
  const nodeRadius = useBoundStore((state) => state.nodeRadius)
  const tool = useBoundStore((state) => state.tool)
  const setSelectedEntities = useBoundStore(
    (state) => state.setSelectedEntities
  )

  // 그래프 타입 확인
  const graphType = useBoundStore((state) => state.graphMeta.type)
  const isDirected = graphType === "directed"

  const edge = useBoundStore((state) => state.graph.edges.get(id)!)
  const isSelected = useBoundStore((state) => state.selectedEdgeIds.has(id))

  const sId = edge._source
  const tId = edge._target

  const sourceNode = useBoundStore((state) =>
    sId ? state.graph.nodes.get(sId) : null
  )
  const targetNode = useBoundStore((state) =>
    tId ? state.graph.nodes.get(tId) : null
  )

  const pairEdgeIds = useBoundStore(
    useShallow((state) => {
      if (!sId || !tId) return []

      if (isDirected) {
        const dg = state.graph as DirectedGraph
        // [중요] 일관된 순서를 위해 항상 ID가 작은 노드에서 큰 노드 순서로 데이터를 합칩니다.
        const [first, second] = sId < tId ? [sId, tId] : [tId, sId]
        const forward = dg.succ.get(first)?.get(second) || []
        const backward = dg.succ.get(second)?.get(first) || []
        // 순서가 고정된 전체 엣지 리스트 반환
        return [...forward, ...backward]
      } else {
        const ug = state.graph as UndirectedGraph
        return ug.adj.get(sId)?.get(tId) || []
      }
    })
  )

  const layout = useMemo(() => {
    if (!edge || !sourceNode || !targetNode) {
      return { points: [], isCurved: false, isLoop: false }
    }

    const sx = sourceNode._x
    const sy = sourceNode._y
    const tx = targetNode._x
    const ty = targetNode._y
    const isLoop = sId === tId

    // 엣지가 노드 중심으로부터 떨어져야 할 실제 거리
    const effectiveRadius = nodeRadius + EDGE_MARGIN

    if (isLoop) {
      const loopIndex = pairEdgeIds.indexOf(id)
      // 루프도 effectiveRadius를 기준으로 그립니다.
      const points = getSelfLoopPoints(
        sx,
        sy,
        effectiveRadius + (isDirected ? pointerLength * 0.2 : 0),
        loopIndex !== -1 ? loopIndex : 0
      )
      return { points, isCurved: true, isLoop: true }
    }

    const total = pairEdgeIds.length
    const index = pairEdgeIds.indexOf(id)
    const isCurved = total > 1
    const step = 40
    const offset = isCurved ? (index - (total - 1) / 2) * step : 0
    const isReversed = sId > tId

    let points: number[] = []
    if (isCurved && index !== -1) {
      const cp = getControlPoint(sx, sy, tx, ty, offset, isReversed)

      const angleSource = Math.atan2(cp.y - sy, cp.x - sx)
      const angleTarget = Math.atan2(cp.y - ty, cp.x - tx)

      // nodeRadius 대신 effectiveRadius 사용
      points = [
        sx + Math.cos(angleSource) * effectiveRadius,
        sy + Math.sin(angleSource) * effectiveRadius,
        cp.x,
        cp.y,
        tx + Math.cos(angleTarget) * effectiveRadius,
        ty + Math.sin(angleTarget) * effectiveRadius,
      ]
    } else {
      const angle = Math.atan2(ty - sy, tx - sx)
      // nodeRadius 대신 effectiveRadius 사용
      points = [
        sx + Math.cos(angle) * effectiveRadius,
        sy + Math.sin(angle) * effectiveRadius,
        tx - Math.cos(angle) * effectiveRadius,
        ty - Math.sin(angle) * effectiveRadius,
      ]
    }
    return { points, isCurved, isLoop: false }
  }, [
    id,
    edge,
    sourceNode,
    targetNode,
    pairEdgeIds,
    nodeRadius,
    pointerLength,
    sId,
    tId,
    isDirected,
    EDGE_MARGIN, // 의존성 추가
  ])
  if (!edge || !sourceNode || !targetNode || layout.points.length === 0) {
    return null
  }

  const commonProps = {
    points: layout.points,
    tension: layout.isLoop ? 0.5 : layout.isCurved ? 0.5 : 0,
    stroke: isSelected ? "#ffffff" : "#94a3b8",
    strokeWidth: 3,
    lineCap: "round" as const,
    lineJoin: "round" as const,
    onClick: (e: any) => {
      if (tool === "select") {
        e.cancelBubble = true
        setSelectedEntities([], [id])
      }
    },
  }

  // 유향 그래프면 Arrow, 무방향이면 Line 렌더링
  return isDirected ? (
    <Arrow
      {...commonProps}
      fill={isSelected ? "#ffffff" : "#94a3b8"}
      pointerLength={pointerLength}
      pointerWidth={pointerWidth}
    />
  ) : (
    <Line {...commonProps} />
  )
})
