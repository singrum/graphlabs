import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

export type Tool = "node" | "edge";

export interface ToolbarSlice {
  tool: Tool;
  setTool: (tool: Tool) => void;
}

// immer 미들웨어로 감싸주면 set 내에서 가변 로직 작성이 가능합니다.
export const createToolbarSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  ToolbarSlice
> = (set) => ({
  tool: "node",
  setTool: (tool: Tool) => set(() => ({ tool })),
});
