import type { StateCreator } from "zustand";
import type { BoundStore } from "./use-bound-store";

export interface SettingsSlice {
  nodeRadius: number;
  setNodeRadius: (radius: number) => void;
}

// immer 미들웨어로 감싸주면 set 내에서 가변 로직 작성이 가능합니다.
export const createSettingsSlice: StateCreator<
  BoundStore,
  [["zustand/immer", never]],
  [],
  SettingsSlice
> = (set) => ({
  nodeRadius: 20,
  setNodeRadius: (radius: number) => set(() => ({ nodeRadius: radius })),
});
