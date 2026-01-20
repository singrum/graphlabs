export type NodeData = {
  _id: string;
  _x: number;
  _y: number;
  _color: string;
  _label: string;

  // 추가 속성
  [key: string]: unknown;
};

export type EdgeData = {
  _id: string;
  _label: string;
  _source: string; // 시작 노드 ID
  _target: string; // 끝 노드 ID

  // 추가 속성
  [key: string]: unknown;
};

export type Nodes = Map<string, NodeData>;
export type Edges = Map<string, EdgeData>;
export type AdjacencyMap = Map<string, Map<string, string[]>>;

export type Graph = {
  title: string;
  nodes: Nodes;
  edges: Edges;
  succ: AdjacencyMap;
  pred: AdjacencyMap;
};
