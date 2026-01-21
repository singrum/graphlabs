import { addToAdjacency, removeFromAdjacency } from "@/lib/graph-utils";
import { sampleGraph } from "@/lib/sample-graphs";
import type { EdgeData, Graph, NodeData, Schema } from "@/types/graph";
import { v4 } from "uuid";
import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";
const initialNodeSchema: Schema = {
  _id: "text",
  _label: "text",
  _color: "color",
  _x: "number",
  _y: "number",
};

const initialEdgeSchema: Schema = {
  _id: "text",
  _label: "text",
  _source: "node",
  _target: "node",
};

let nodeCnt = 0;
let edgeCnt = 0;

export interface GraphSlice {
  graph: Graph;

  setTitle: (title: string) => void;

  // 노드 액션
  addNode: (x: number, y: number) => void;

  deleteNode: (id: string) => void;

  // 엣지 액션
  addEdge: (sourceId: string, targetId: string) => void;
  deleteEdge: (edgeId: string) => void;

  updateEntities: (
    type: "node" | "edge",
    ids: string[],
    data: Partial<NodeData | EdgeData>,
  ) => void;
}

export const createGraphSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  GraphSlice
> = (set, get) => ({
  graph: {
    ...sampleGraph,
    nodeSchema: initialNodeSchema,
    edgeSchema: initialEdgeSchema,
  },

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

  updateEntities: (type, ids, partialData) =>
    set((state) => {
      const { nodes, edges, succ, pred } = state.graph;

      if (type === "node") {
        const data = partialData as Partial<NodeData>;
        ids.forEach((id) => {
          const existing = nodes.get(id)!;
          nodes.set(id, { ...existing, ...data });
        });
      } else {
        const data = partialData as Partial<EdgeData>;
        ids.forEach((id) => {
          const edge = edges.get(id)!;

          const nextSource = data._source ?? edge._source;
          const nextTarget = data._target ?? edge._target;

          // 연결 정보가 변경된 경우에만 인접 리스트 동기화
          if (nextSource !== edge._source || nextTarget !== edge._target) {
            // 1. 기존 연결 제거
            removeFromAdjacency(succ, edge._source, edge._target, id);
            removeFromAdjacency(pred, edge._target, edge._source, id);

            // 2. 새로운 연결 추가
            addToAdjacency(succ, nextSource, nextTarget, id);
            addToAdjacency(pred, nextTarget, nextSource, id);
          }

          // 3. 엣지 데이터 업데이트
          edges.set(id, { ...edge, ...data });
        });
      }
    }),
});
