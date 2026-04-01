import {
  getControlPoint,
  isCurveIntersectingRect,
  isLineIntersectingRect,
  isLoopIntersectingRect,
} from "@/lib/edge-utils"
import { useBoundStore } from "@/stores/use-bound-store"
import type { DirectedGraph, UndirectedGraph } from "@/types/graph"
import type Konva from "konva"
import { useCallback, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"

export function useMarqueeSelection(
  getRelativePointerPosition: (
    stage: Konva.Stage
  ) => { x: number; y: number } | null
) {
  const selectionStartPos = useRef<{ x: number; y: number } | null>(null)
  const lastSelectedHashRef = useRef<string>("")
  const [isSelecting, setIsSelecting] = useState(false)

  const {
    graph,
    graphMeta,
    nodeRadius,
    setSelectionRect,
    setSelectedEntities,
  } = useBoundStore(
    useShallow((state) => ({
      graph: state.graph,
      graphMeta: state.graphMeta,
      nodeRadius: state.nodeRadius,
      setSelectionRect: state.setSelectionRect,
      setSelectedEntities: state.setSelectedEntities,
    }))
  )

  const isDirected = graphMeta.type === "directed"
  const startSelection = useCallback(
    (stage: Konva.Stage) => {
      const pos = getRelativePointerPosition(stage)
      if (pos) {
        selectionStartPos.current = pos
        setIsSelecting(true)
        setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y })
      }
    },
    [getRelativePointerPosition, setSelectionRect]
  )

  const updateSelection = useCallback(
    (stage: Konva.Stage) => {
      if (!selectionStartPos.current) return

      requestAnimationFrame(() => {
        const currentPos = getRelativePointerPosition(stage)
        if (!currentPos || !selectionStartPos.current) return

        const rectData = {
          x1: selectionStartPos.current.x,
          y1: selectionStartPos.current.y,
          x2: currentPos.x,
          y2: currentPos.y,
        }
        setSelectionRect(rectData)

        const rect = {
          minX: Math.min(rectData.x1, rectData.x2),
          maxX: Math.max(rectData.x1, rectData.x2),
          minY: Math.min(rectData.y1, rectData.y2),
          maxY: Math.max(rectData.y1, rectData.y2),
        }

        const nextNodeIds: string[] = []
        const nextEdgeIds: string[] = []

        // 1. 노드 충돌 검사
        graph.nodes.forEach((node, id) => {
          const closestX = Math.max(rect.minX, Math.min(node._x, rect.maxX))
          const closestY = Math.max(rect.minY, Math.min(node._y, rect.maxY))
          const dx = node._x - closestX
          const dy = node._y - closestY
          if (dx * dx + dy * dy <= nodeRadius * nodeRadius) nextNodeIds.push(id)
        })

        // 2. 엣지 충돌 검사
        graph.edges.forEach((edge, id) => {
          const s = graph.nodes.get(edge._source)
          const t = graph.nodes.get(edge._target)
          if (!s || !t) return

          const isLoop = edge._source === edge._target

          // [수정] GraphEdge 컴포넌트와 동일한 Pair 정규화 로직 적용
          let pairEdgeIds: string[] = []
          if (isDirected) {
            const dg = graph as DirectedGraph
            // 일관된 순서를 위해 항상 ID가 작은 노드에서 큰 노드 순서로 데이터를 합침
            const [first, second] =
              edge._source < edge._target
                ? [edge._source, edge._target]
                : [edge._target, edge._source]

            const forward = dg.succ.get(first)?.get(second) || []
            const backward = dg.succ.get(second)?.get(first) || []
            pairEdgeIds = isLoop ? forward : [...forward, ...backward]
          } else {
            const ug = graph as UndirectedGraph
            pairEdgeIds = ug.adj.get(edge._source)?.get(edge._target) || []
          }

          const total = pairEdgeIds.length
          const index = pairEdgeIds.indexOf(id)

          if (isLoop) {
            if (isLoopIntersectingRect(s._x, s._y, nodeRadius, index, rect)) {
              nextEdgeIds.push(id)
            }
          } else {
            const isCurved = total > 1
            // [수정] index 기반 offset 계산 동기화
            const step = 40
            const offset = isCurved ? (index - (total - 1) / 2) * step : 0

            // [수정] 현재 엣지의 실제 방향에 따른 reversed 판별 동기화
            // (pairEdgeIds를 source < target 기준으로 뽑았으므로 실제 엣지가 그 반대면 reverse)
            const isReversed = edge._source > edge._target

            if (isCurved) {
              const cp = getControlPoint(
                s._x,
                s._y,
                t._x,
                t._y,
                offset,
                isReversed
              )

              const angleSource = Math.atan2(cp.y - s._y, cp.x - s._x)
              const angleTarget = Math.atan2(cp.y - t._y, cp.x - t._x)

              const curveS = {
                x: s._x + Math.cos(angleSource) * nodeRadius,
                y: s._y + Math.sin(angleSource) * nodeRadius,
              }
              const curveT = {
                x: t._x + Math.cos(angleTarget) * nodeRadius,
                y: t._y + Math.sin(angleTarget) * nodeRadius,
              }

              if (
                isCurveIntersectingRect(
                  curveS.x,
                  curveS.y,
                  cp.x,
                  cp.y,
                  curveT.x,
                  curveT.y,
                  rect
                )
              ) {
                nextEdgeIds.push(id)
              }
            } else {
              // 직선 충돌 검사 (트리밍 포함)
              const dx = t._x - s._x
              const dy = t._y - s._y
              const angle = Math.atan2(dy, dx)

              const trimmedS = {
                x: s._x + Math.cos(angle) * nodeRadius,
                y: s._y + Math.sin(angle) * nodeRadius,
              }
              const trimmedT = {
                x: t._x - Math.cos(angle) * nodeRadius,
                y: t._y - Math.sin(angle) * nodeRadius,
              }

              if (
                isLineIntersectingRect(
                  trimmedS.x,
                  trimmedS.y,
                  trimmedT.x,
                  trimmedT.y,
                  rect
                )
              ) {
                nextEdgeIds.push(id)
              }
            }
          }
        })

        // 해시 비교 및 업데이트 (생략되지 않도록 유지)
        const currentHash = `${nextNodeIds.sort().join(",")}|${nextEdgeIds.sort().join(",")}`
        if (lastSelectedHashRef.current !== currentHash) {
          lastSelectedHashRef.current = currentHash
          setSelectedEntities(nextNodeIds, nextEdgeIds)
        }
      })
    },
    [
      getRelativePointerPosition,
      setSelectionRect,
      graph,
      isDirected,
      nodeRadius,
      setSelectedEntities,
    ]
  )

  const endSelection = useCallback(() => {
    // 마우스 버튼만 누르고 뗐을 때 (움직임이 없었을 때) 0개 선택 처리
    if (selectionStartPos.current && lastSelectedHashRef.current === "") {
      setSelectedEntities([], [])
    }
    selectionStartPos.current = null
    lastSelectedHashRef.current = ""
    setIsSelecting(false)
    setSelectionRect(null)
  }, [setSelectionRect, setSelectedEntities])

  return { startSelection, updateSelection, endSelection, isSelecting }
}
