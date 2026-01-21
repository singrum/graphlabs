import { Circle, Slash } from "lucide-react";
import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

export type Tool = "node" | "edge";

export interface UISlice {
  openLeftbar: boolean;
  setOpenLeftbar: (openLeftbar: boolean) => void;

  openRightbar: boolean;
  setOpenRightbar: (openRightbar: boolean) => void;

}

export const itemAssets = {
  node: {
    icon: Circle,
  },
  edge: {
    icon: Slash,
  },
};

// immer 미들웨어로 감싸주면 set 내에서 가변 로직 작성이 가능합니다.
export const createUISlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  UISlice
> = (set) => ({
  openLeftbar: true,
  setOpenLeftbar: (openLeftbar: boolean) => set(() => ({ openLeftbar })),

  openRightbar: true,
  setOpenRightbar: (openRightbar: boolean) => set(() => ({ openRightbar })),

  
});
