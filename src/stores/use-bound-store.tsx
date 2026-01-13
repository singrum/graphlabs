import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createEdgeEditorSlice,
  type EdgeEditorSlice,
} from "./edge-editor-slice";
import { createGraphSlice, type GraphSlice } from "./graph-slice";
import { createToolbarSlice, type ToolbarSlice } from "./toolbar-slice";
export type BoundStore = GraphSlice &
  ToolbarSlice &
  EdgeEditorSlice /* & OtherSlices */;

export const useBoundStore = create<BoundStore>()(
  immer((...a) => ({
    ...createGraphSlice(...a),
    ...createToolbarSlice(...a),
    ...createEdgeEditorSlice(...a),
  }))
);
