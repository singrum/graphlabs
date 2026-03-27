export type PropertyType =
  | "text"
  | "number"
  | "boolean"
  | "color"
  | "node"
  | "edge"

export type Schema = Record<string, PropertyType>

export type NodeData = {
  _id: string
  _x: number
  _y: number
  _color: string
  _label: string

  // 추가 속성
  [key: string]: string | number | boolean | undefined
}

export type EdgeData = {
  _id: string
  _label: string
  _source: string // 시작 노드 ID
  _target: string // 끝 노드 ID

  // 추가 속성
  [key: string]: string | number | boolean | undefined
}

export type Nodes = Map<string, NodeData>
export type Edges = Map<string, EdgeData>
export type AdjacencyMap = Map<string, Map<string, string[]>>
export type GraphMeta = {
  id: string
  name: string
  type: string
  createdAt: number
  updatedAt: number
}
export type Graph = {
  nodes: Nodes
  edges: Edges
  nodeSchema: Schema
  edgeSchema: Schema
  succ: AdjacencyMap
  pred: AdjacencyMap
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}
