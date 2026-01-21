import { sampleGraph } from "@/lib/sample-graphs";
import type { EdgeData, Graph, NodeData } from "@/types/graph";
import type { CircleConfig } from "konva/lib/shapes/Circle";
import { v4 } from "uuid";
import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

let nodeCnt = 0;
let edgeCnt = 0;

export interface GraphSlice {
  graph: Graph;

  setTitle: (title: string) => void;

  // 노드 액션
  addNode: (x: number, y: number) => void;
  updateNodeConfig: (id: string, config: Partial<CircleConfig>) => void;
  deleteNode: (id: string) => void;

  // 엣지 액션
  addEdge: (sourceId: string, targetId: string) => void;
  deleteEdge: (edgeId: string) => void;
}

export const createGraphSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  GraphSlice
> = (set, get) => ({
  graph: sampleGraph,

  setTitle: (title) =>
    set((state) => {
      state.graph.title = title;
    }),

  addNode: (x, y) => {
    const id = v4();
    set((state) => {
      state.graph.nodes.set(id, {
        _id: id,
        ...{ _label: `Node ${++nodeCnt}` },
        _color: "#00a2ff",
        _x: x,
        _y: y,
      } as NodeData);
      // 인접 리스트 초기화 (옵션)
      if (!state.graph.succ.has(id)) state.graph.succ.set(id, new Map());
      if (!state.graph.pred.has(id)) state.graph.pred.set(id, new Map());
    });
    get().setSelectedNodes([id]);
  },

  updateNodeConfig: (id, config) =>
    set((state) => {
      const node = state.graph.nodes.get(id);
      if (node) {
        Object.assign(node, config);
      }
    }),

  deleteNode: (nodeId) =>
    set((state) => {
      // 1. 해당 노드와 연결된 모든 엣지 식별 및 삭제
      // 나가는 엣지들
      const targets = state.graph.succ.get(nodeId);
      if (targets) {
        targets.forEach((edgeIds, targetId) => {
          edgeIds.forEach((edgeId) => state.graph.edges.delete(edgeId));
          // 상대방(target)의 pred에서도 제거
          state.graph.pred.get(targetId)?.delete(nodeId);
        });
      }

      // 들어오는 엣지들
      const sources = state.graph.pred.get(nodeId);
      if (sources) {
        sources.forEach((edgeIds, sourceId) => {
          edgeIds.forEach((edgeId) => state.graph.edges.delete(edgeId));
          // 상대방(source)의 succ에서도 제거
          state.graph.succ.get(sourceId)?.delete(nodeId);
        });
      }

      // 2. 인접 리스트에서 노드 엔트리 자체를 삭제
      state.graph.succ.delete(nodeId);
      state.graph.pred.delete(nodeId);

      // 3. 노드 삭제
      state.graph.nodes.delete(nodeId);
    }),

  addEdge: (source, target) =>
    set((state) => {
      const edgeId = v4();
      const newEdge: EdgeData = {
        _id: edgeId,
        _source: source,
        _target: target,
        _label: `Edge ${++edgeCnt}`,
      };

      // 1. Edges 맵에 추가
      state.graph.edges.set(edgeId, newEdge);

      // 2. succ 업데이트 (source -> target)
      if (!state.graph.succ.has(source))
        state.graph.succ.set(source, new Map());
      const sourceMap = state.graph.succ.get(source)!;
      if (!sourceMap.has(target)) sourceMap.set(target, []);
      sourceMap.get(target)!.push(edgeId);

      // 3. pred 업데이트 (target -> source)
      if (!state.graph.pred.has(target))
        state.graph.pred.set(target, new Map());
      const targetMap = state.graph.pred.get(target)!;
      if (!targetMap.has(source)) targetMap.set(source, []);
      targetMap.get(source)!.push(edgeId);
    }),

  deleteEdge: (edgeId) =>
    set((state) => {
      const edge = state.graph.edges.get(edgeId);
      if (!edge) return;

      const { _source: source, _target: target } = edge;

      // 1. succ에서 제거
      const sourceMap = state.graph.succ.get(source);
      if (sourceMap && sourceMap.has(target)) {
        const list = sourceMap.get(target)!;
        const newList = list.filter((id) => id !== edgeId);
        if (newList.length === 0) sourceMap.delete(target);
        else sourceMap.set(target, newList);
      }

      // 2. pred에서 제거
      const targetMap = state.graph.pred.get(target);
      if (targetMap && targetMap.has(source)) {
        const list = targetMap.get(source)!;
        const newList = list.filter((id) => id !== edgeId);
        if (newList.length === 0) targetMap.delete(source);
        else targetMap.set(source, newList);
      }

      // 3. 메인 맵에서 제거
      state.graph.edges.delete(edgeId);
    }),
});
