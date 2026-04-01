import type { StateCreator } from "zustand"
import type { BoundStore } from "./use-bound-store"

export type GraphDataMenu = "succ" | "pred" | "node" | "edge" | "adj"

export interface DataSlice {
  graphDataMenu: number
  setGraphDataMenu: (menu: number) => void
}

// immer 미들웨어로 감싸주면 set 내에서 가변 로직 작성이 가능합니다.
export const createDataSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  DataSlice
> = (set) => ({
  graphDataMenu: 0,
  setGraphDataMenu: (menu: number) => set(() => ({ graphDataMenu: menu })),
})
