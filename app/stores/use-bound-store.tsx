import type { Graph, GraphMeta } from "@/types/graph"
import { createContext, useContext, useState, type ReactNode } from "react"
import { create, useStore } from "zustand"
import { immer } from "zustand/middleware/immer"
import { createDataSlice, type DataSlice } from "./data-slice"
import {
  createEdgeEditorSlice,
  type EdgeEditorSlice,
} from "./edge-editor-slice"
import { createGraphSlice, type GraphSlice } from "./graph-slice"
import { createSelectionSlice, type SelectionSlice } from "./selection-slice"
import { createSettingsSlice, type SettingsSlice } from "./settings-slice"
import { createToolbarSlice, type ToolbarSlice } from "./toolbar-slice"
import { createUISlice, type UISlice } from "./ui-slice"
export type BoundStore = GraphSlice &
  ToolbarSlice &
  EdgeEditorSlice &
  DataSlice &
  UISlice &
  SelectionSlice &
  SettingsSlice
export const createBoundStore = ({
  graphMeta,
  graph,
}: {
  graphMeta: GraphMeta
  graph: Graph
}) => {
  return create<BoundStore>()(
    immer((...a) => ({
      ...createGraphSlice({ graphMeta, graph })(...a),
      ...createToolbarSlice(...a),
      ...createEdgeEditorSlice(...a),
      ...createDataSlice(...a),
      ...createUISlice(...a),
      ...createSelectionSlice(...a),
      ...createSettingsSlice(...a),
    }))
  )
}

export type BoundStoreApi = ReturnType<typeof createBoundStore>

export const BoundStoreContext = createContext<BoundStoreApi | undefined>(
  undefined
)

export interface BoundStoreProviderProps {
  children: ReactNode
  initialData: {
    graphMeta: GraphMeta
    graph: Graph
  }
}

export const BoundStoreProvider = ({
  children,
  initialData,
}: BoundStoreProviderProps) => {
  const [store] = useState(() => createBoundStore(initialData))
  return (
    <BoundStoreContext.Provider value={store}>
      {children}
    </BoundStoreContext.Provider>
  )
}

export const useBoundStore = <T,>(selector: (store: BoundStore) => T): T => {
  const boundStoreContext = useContext(BoundStoreContext)
  if (!boundStoreContext) {
    throw new Error(`useBoundStore must be used within BoundStoreProvider`)
  }

  return useStore(boundStoreContext, selector)
}
