import { getControlPoint, getSelfLoopPoints } from "@/lib/edge-utils"
import { useBoundStore } from "@/stores/use-bound-store"
import type { DirectedGraph, UndirectedGraph } from "@/types/graph"

import { memo, useMemo } from "react"
import { Arrow, Line } from "react-konva" // Line 추가
import { useShallow } from "zustand/react/shallow"

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

  const edge = useBoundStore((state) => state.graph.edges.get(id))
  const isSelected = useBoundStore((state) => state.selectedEdgeIds.has(id))

  const sId = edge?._source
  const tId = edge?._target

  const sourceNode = useBoundStore((state) =>
    sId ? state.graph.nodes.get(sId) : null
  )
  const targetNode = useBoundStore((state) =>
    tId ? state.graph.nodes.get(tId) : null
  )

  // 인접 리스트 참조 (타입에 따라 분기)
  const pairEdgeIds = useBoundStore(
    useShallow((state) => {
      if (!sId || !tId) return []

      if (isDirected) {
        const dg = state.graph as DirectedGraph
        const forward = dg.succ.get(sId)?.get(tId) || []
        const backward = dg.succ.get(tId)?.get(sId) || []
        return [...forward, ...backward]
      } else {
        const ug = state.graph as UndirectedGraph
        // 무방향은 adj 하나만 확인하면 됨 (이미 양방향 데이터가 들어있음)
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

    // 유향 그래프일 때만 화살표 촉만큼 오프셋을 줍니다.
    const tipOffset = isDirected ? pointerLength * 0.2 : 0
    const adjustedRadius = nodeRadius + tipOffset

    if (isLoop) {
      const loopIndex = pairEdgeIds.indexOf(id)
      const points = getSelfLoopPoints(
        sx,
        sy,
        adjustedRadius,
        loopIndex !== -1 ? loopIndex : 0
      )
      return { points, isCurved: true, isLoop: true }
    }

    const total = pairEdgeIds.length
    const index = pairEdgeIds.indexOf(id)
    const isCurved = total > 1
    const step = 40
    const offset = isCurved ? (index - (total - 1) / 2) * step : 0

    // 무방향일 때는 source/target 순서가 중요하지 않으므로 일관된 오프셋 계산을 위해 ID 비교
    const isReversed = (sId ?? "") > (tId ?? "")

    let points: number[] = []
    if (isCurved && index !== -1) {
      const cp = getControlPoint(sx, sy, tx, ty, offset, isReversed)

      // Undirected일 때는 화살표가 없으므로 굳이 곡선 끝점을 노드 경계면에 맞출 필요가 적지만,
      // 깔끔한 시각화를 위해 계산은 유지합니다.
      const angleSource = Math.atan2(cp.y - sy, cp.x - sx)
      const angleTarget = Math.atan2(cp.y - ty, cp.x - tx)

      points = [
        sx + Math.cos(angleSource) * nodeRadius,
        sy + Math.sin(angleSource) * nodeRadius,
        cp.x,
        cp.y,
        tx + Math.cos(angleTarget) * nodeRadius,
        ty + Math.sin(angleTarget) * nodeRadius,
      ]
    } else {
      const angle = Math.atan2(ty - sy, tx - sx)
      points = [
        sx + Math.cos(angle) * nodeRadius,
        sy + Math.sin(angle) * nodeRadius,
        tx - Math.cos(angle) * nodeRadius,
        ty - Math.sin(angle) * nodeRadius,
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
