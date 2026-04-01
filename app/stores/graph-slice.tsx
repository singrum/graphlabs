import { db } from "@/lib/db"
import { addToAdjacency, removeFromAdjacency } from "@/lib/graph-utils"
import { getNextExclusiveLabel } from "@/lib/utils"
import type {
  DirectedGraph,
  EdgeData,
  Graph,
  GraphMeta,
  NodeData,
  UndirectedGraph,
} from "@/types/graph"
import lodash from "lodash"
import { v4 } from "uuid"
import type { StateCreator } from "zustand"
import type { BoundStore } from "./use-bound-store"
const { debounce } = lodash

export interface GraphSlice {
  graphMeta: GraphMeta
  setTitle: (title: string) => void
  graph: Graph

  sync: () => Promise<void>
  // 노드 액션
  addNode: (x: number, y: number) => void

  deleteNode: (id: string) => void

  // 엣지 액션
  addEdge: (sourceId: string, targetId: string) => void
  deleteEdge: (edgeId: string) => void

  updateEntities: (
    type: "node" | "edge",
    ids: string[],
    data: Partial<NodeData | EdgeData>
  ) => void
  deleteEntities: (type: "node" | "edge", ids: string[]) => void
  deleteSelected: () => void
}
export interface GraphInitialData {
  graphMeta: GraphMeta
  graph: Graph
}
export const createGraphSlice =
  (
    initialData: GraphInitialData
  ): StateCreator<BoundStore, [["zustand/immer", never]], [], GraphSlice> =>
  (set, get) => {
    const debouncedSync = debounce(async () => {
      const { graphMeta, graph } = get()
      await db.saveGraph(graphMeta, graph)
      console.log("IndexedDB Synced (Debounced)")
    }, 500)
    return {
      graphMeta: initialData.graphMeta,
      setTitle: (title) => {
        set((state) => {
          state.graphMeta.name = title
        })
        get().sync()
      },

      graph: initialData.graph,

      sync: async () => {
        debouncedSync()
      },

      addNode: (x, y) => {
        const id = v4()
        set((state) => {
          state.graph.nodes.set(id, {
            _id: id,
            ...{ _label: getNextExclusiveLabel(state.graph.nodes, "Node") },
            _color: "#00a2ff",
            _x: x,
            _y: y,
          } as NodeData)

          const type = state.graphMeta.type
          if (type === "directed") {
            const dg = state.graph as DirectedGraph
            if (!dg.succ.has(id)) dg.succ.set(id, new Map())
            if (!dg.pred.has(id)) dg.pred.set(id, new Map())
          } else {
            const ug = state.graph as UndirectedGraph
            if (!ug.adj.has(id)) ug.adj.set(id, new Map())
          }
        })
        get().setSelectedNodes([id])
        get().sync()
      },

      deleteNode: (nodeId) => {
        set((state) => {
          const g = state.graph
          const type = state.graphMeta.type

          if (type === "directed") {
            const dg = g as DirectedGraph

            const targets = dg.succ.get(nodeId)
            if (targets) {
              targets.forEach((edgeIds, targetId) => {
                edgeIds.forEach((edgeId) => dg.edges.delete(edgeId))
                dg.pred.get(targetId)?.delete(nodeId)
              })
            }

            const sources = dg.pred.get(nodeId)
            if (sources) {
              sources.forEach((edgeIds, sourceId) => {
                edgeIds.forEach((edgeId) => dg.edges.delete(edgeId))
                dg.succ.get(sourceId)?.delete(nodeId)
              })
            }

            dg.succ.delete(nodeId)
            dg.pred.delete(nodeId)
          } else {
            const ug = g as UndirectedGraph

            const neighbors = ug.adj.get(nodeId)
            if (neighbors) {
              neighbors.forEach((edgeIds, neighborId) => {
                edgeIds.forEach((edgeId) => ug.edges.delete(edgeId))
                ug.adj.get(neighborId)?.delete(nodeId)
              })
            }

            ug.adj.delete(nodeId)
          }

          g.nodes.delete(nodeId)
          state.selectedNodeIds.delete(nodeId)
        })

        get().sync()
      },
      addEdge: (sourceId, targetId) => {
        set((state) => {
          const edgeId = v4()
          const newEdge: EdgeData = {
            _id: edgeId,
            _source: sourceId,
            _target: targetId,
            _label: getNextExclusiveLabel(state.graph.edges, "Edge"),
          }
          state.graph.edges.set(edgeId, newEdge)

          const type = state.graphMeta.type
          const g = state.graph

          if (type === "directed") {
            const dg = g as DirectedGraph

            addToAdjacency(dg.succ, sourceId, targetId, edgeId)
            addToAdjacency(dg.pred, targetId, sourceId, edgeId)
          } else {
            const ug = g as UndirectedGraph

            addToAdjacency(ug.adj, sourceId, targetId, edgeId)
            addToAdjacency(ug.adj, targetId, sourceId, edgeId)
          }
        })

        get().sync()
      },

      deleteEdge: (edgeId) => {
        set((state) => {
          const edge = state.graph.edges.get(edgeId)
          if (!edge) return

          const { _source: source, _target: target } = edge
          const g = state.graph
          const type = state.graphMeta.type

          if (type === "directed") {
            const dg = g as DirectedGraph
            // 1. succ (출발지 기준)에서 제거
            removeFromAdjacency(dg.succ, source, target, edgeId)
            // 2. pred (도착지 기준)에서 제거
            removeFromAdjacency(dg.pred, target, source, edgeId)
          } else {
            const ug = g as UndirectedGraph
            // 무방향은 adj의 양방향 엔트리 모두에서 해당 edgeId 제거
            removeFromAdjacency(ug.adj, source, target, edgeId)
            removeFromAdjacency(ug.adj, target, source, edgeId)
          }

          // 3. 메인 Edges 맵에서 제거
          g.edges.delete(edgeId)

          // 선택 상태에서도 제거 (Optional)
          state.selectedEdgeIds.delete(edgeId)
        })

        get().sync()
      },
      updateEntities: (type, ids, partialData) => {
        set((state) => {
          const g = state.graph
          const isDirected = state.graphMeta.type === "directed"

          if (type === "node") {
            const data = partialData as Partial<NodeData>
            ids.forEach((id) => {
              const existing = g.nodes.get(id)
              if (existing) {
                g.nodes.set(id, { ...existing, ...data })
              }
            })
          } else {
            const data = partialData as Partial<EdgeData>
            ids.forEach((id) => {
              const edge = g.edges.get(id)
              if (!edge) return

              const nextSource = data._source ?? edge._source
              const nextTarget = data._target ?? edge._target

              // 연결 정보(source 또는 target)가 실제로 변경된 경우에만 인접 리스트 갱신
              if (nextSource !== edge._source || nextTarget !== edge._target) {
                if (isDirected) {
                  const dg = g as DirectedGraph
                  // 1. 기존 연결 제거
                  removeFromAdjacency(dg.succ, edge._source, edge._target, id)
                  removeFromAdjacency(dg.pred, edge._target, edge._source, id)
                  // 2. 새로운 연결 추가
                  addToAdjacency(dg.succ, nextSource, nextTarget, id)
                  addToAdjacency(dg.pred, nextTarget, nextSource, id)
                } else {
                  const ug = g as UndirectedGraph
                  // 1. 기존 연결 제거 (양방향)
                  removeFromAdjacency(ug.adj, edge._source, edge._target, id)
                  removeFromAdjacency(ug.adj, edge._target, edge._source, id)
                  // 2. 새로운 연결 추가 (양방향)
                  addToAdjacency(ug.adj, nextSource, nextTarget, id)
                  addToAdjacency(ug.adj, nextTarget, nextSource, id)
                }
              }

              // 3. 엣지 데이터 업데이트
              g.edges.set(id, { ...edge, ...data })
            })
          }
        })
        get().sync()
      },
      deleteEntities: (type, ids) => {
        set((state) => {
          const g = state.graph
          const isDirected = state.graphMeta.type === "directed"

          if (type === "node") {
            ids.forEach((nodeId) => {
              if (isDirected) {
                const dg = g as DirectedGraph

                // 1. 나가는 엣지 정리 (Out-edges)
                dg.succ.get(nodeId)?.forEach((edgeIds, targetId) => {
                  edgeIds.forEach((eid) => dg.edges.delete(eid))
                  dg.pred.get(targetId)?.delete(nodeId)
                })
                dg.succ.delete(nodeId)

                // 2. 들어오는 엣지 정리 (In-edges)
                dg.pred.get(nodeId)?.forEach((edgeIds, sourceId) => {
                  edgeIds.forEach((eid) => dg.edges.delete(eid))
                  dg.succ.get(sourceId)?.delete(nodeId)
                })
                dg.pred.delete(nodeId)
              } else {
                const ug = g as UndirectedGraph

                // 1. 인접한 모든 노드와의 연결 정리
                ug.adj.get(nodeId)?.forEach((edgeIds, neighborId) => {
                  edgeIds.forEach((eid) => ug.edges.delete(eid))
                  // 상대방의 인접 리스트에서 나(nodeId)를 삭제
                  ug.adj.get(neighborId)?.delete(nodeId)
                })
                ug.adj.delete(nodeId)
              }

              // 공통: 노드 맵에서 삭제 및 선택 해제
              g.nodes.delete(nodeId)
              state.selectedNodeIds.delete(nodeId)
            })
          } else {
            // 엣지 삭제 로직
            ids.forEach((edgeId) => {
              const edge = g.edges.get(edgeId)
              if (!edge) return

              if (isDirected) {
                const dg = g as DirectedGraph
                removeFromAdjacency(dg.succ, edge._source, edge._target, edgeId)
                removeFromAdjacency(dg.pred, edge._target, edge._source, edgeId)
              } else {
                const ug = g as UndirectedGraph
                removeFromAdjacency(ug.adj, edge._source, edge._target, edgeId)
                removeFromAdjacency(ug.adj, edge._target, edge._source, edgeId)
              }

              g.edges.delete(edgeId)
              state.selectedEdgeIds.delete(edgeId)
            })
          }
        })
        get().sync()
      },
      deleteSelected: () => {
        const state = get()
        const selectedNodeIds = Array.from(state.selectedNodeIds)
        const selectedEdgeIds = Array.from(state.selectedEdgeIds)

        if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return

        if (selectedNodeIds.length > 0) {
          state.deleteEntities("node", selectedNodeIds)
        }

        if (selectedEdgeIds.length > 0) {
          const remainingEdges = selectedEdgeIds.filter((id) =>
            state.graph.edges.has(id)
          )
          if (remainingEdges.length > 0) {
            state.deleteEntities("edge", remainingEdges)
          }
        }

        // 3. 선택 초기화
        state.setSelectedEntities([], [])
      },
    }
  }
