import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createDataSlice, type DataSlice } from "./data-slice";
import {
  createEdgeEditorSlice,
  type EdgeEditorSlice,
} from "./edge-editor-slice";
import { createGraphSlice, type GraphSlice } from "./graph-slice";
import { createSelectionSlice, type SelectionSlice } from "./selection-slice";
import { createToolbarSlice, type ToolbarSlice } from "./toolbar-slice";
import { createUISlice, type UISlice } from "./ui-slice";
export type BoundStore = GraphSlice &
  ToolbarSlice &
  EdgeEditorSlice &
  DataSlice &
  UISlice &
  SelectionSlice;

export const useBoundStore = create<BoundStore>()(
  immer((...a) => ({
    ...createGraphSlice(...a),
    ...createToolbarSlice(...a),
    ...createEdgeEditorSlice(...a),
    ...createDataSlice(...a),
    ...createUISlice(...a),
    ...createSelectionSlice(...a),
  })),
);
