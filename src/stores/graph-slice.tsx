import type { EdgeData, NodeData } from "@/types/graph";
import type { CircleConfig } from "konva/lib/shapes/Circle";
import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

export interface GraphSlice {
  nodes: Map<string, NodeData>;
  edges: Map<string, EdgeData>;
  succ: Map<string, Set<string>>;
  pred: Map<string, Set<string>>;

  // 노드 관련 액션
  addNode: (node: NodeData) => void;
  updateNodeConfig: (id: string, config: Partial<CircleConfig>) => void;
  deleteNode: (id: string) => void;

  // 엣지 관련 액션
  addEdge: (sourceId: string, targetId: string) => void;
  deleteEdge: (id: string) => void;
}

// immer 미들웨어로 감싸주면 set 내에서 가변 로직 작성이 가능합니다.
export const createGraphSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  GraphSlice
> = (set) => ({
  nodes: new Map<string, NodeData>(),
  edges: new Map<string, EdgeData>(),
  succ: new Map<string, Set<string>>(),
  pred: new Map<string, Set<string>>(),
  // [노드 추가]
  addNode: (newNode) =>
    set((state) => {
      state.nodes.set(newNode.id, newNode);
    }),

  // [노드 설정 업데이트]
  updateNodeConfig: (id, config) =>
    set((state) => {
      const node = state.nodes.get(id);
      if (node) {
        Object.assign(node.config, config);
      }
    }),

  // [노드 삭제]
  deleteNode: (id) =>
    set((state) => {
      state.nodes.delete(id);
      for (const [edgeId, edge] of state.edges) {
        if (edge.source === id || edge.target === id) {
          state.edges.delete(edgeId);
        }
      }
    }),

  // [엣지 추가]
  addEdge: (source, target) =>
    set((state) => {
      const edgeId = `edge-${source}-${target}-${Date.now()}`;
      state.edges.set(edgeId, { ...{ id: edgeId, source, target } });
    }),

  // [엣지 삭제]
  deleteEdge: (id) =>
    set((state) => {
      state.edges.delete(id);
    }),
});
