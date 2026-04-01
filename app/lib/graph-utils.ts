import type { DirectedGraph, Schema, UndirectedGraph } from "@/types/graph"
export const defaultNodeSchema: Schema = {
  _id: "text",
  _label: "text",
  _color: "color",
  _x: "number",
  _y: "number",
}

export const defaultEdgeSchema: Schema = {
  _id: "text",
  _label: "text",
  _source: "node",
  _target: "node",
}

export const createEmptyUndirectedGraph = (): UndirectedGraph => ({
  nodes: new Map(),
  edges: new Map(),
  nodeSchema: defaultNodeSchema,
  edgeSchema: defaultEdgeSchema,
  adj: new Map(),
})

export const createEmptyDirectedGraph = (): DirectedGraph => ({
  nodes: new Map(),
  edges: new Map(),
  nodeSchema: defaultNodeSchema,
  edgeSchema: defaultEdgeSchema,
  succ: new Map(),
  pred: new Map(),
})

/**
 * 인접 리스트(succ 또는 pred)에 특정 엣지 ID를 추가하는 함수
 */
export const addToAdjacency = (
  map: Map<string, Map<string, string[]>>,
  fromId: string,
  toId: string,
  edgeId: string
) => {
  if (!map.has(fromId)) map.set(fromId, new Map())
  const targetMap = map.get(fromId)!

  const list = targetMap.get(toId) || []
  // 중복 추가 방지 및 불변성 유지
  if (!list.includes(edgeId)) {
    targetMap.set(toId, [...list, edgeId])
  }
}

/**
 * 인접 리스트(succ 또는 pred)에서 특정 엣지 ID를 제거하는 함수
 */
export const removeFromAdjacency = (
  map: Map<string, Map<string, string[]>>,
  fromId: string,
  toId: string,
  edgeId: string
) => {
  const targetMap = map.get(fromId)
  if (!targetMap) return

  const list = targetMap.get(toId)
  if (!list) return

  const filtered = list.filter((id) => id !== edgeId)

  if (filtered.length === 0) {
    targetMap.delete(toId)
  } else {
    targetMap.set(toId, filtered)
  }
}
