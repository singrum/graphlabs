import type { GraphDataMenu } from "@/stores/data-slice"
import { useBoundStore } from "@/stores/use-bound-store"
import type { GraphType } from "@/types/graph"
import React from "react"
import { TabsList, TabsTrigger } from "../ui/tabs"
import AdjView from "./data-view/container/adj-view"
import EdgeView from "./data-view/container/edge-view"
import PredView from "./data-view/container/pred-view"
import SuccView from "./data-view/container/succ-view"
export const graphDataMenus: Record<
  GraphType,
  {
    value: GraphDataMenu
    component: React.ComponentType
  }[]
> = {
  directed: [
    { value: "succ", component: SuccView },
    { value: "pred", component: PredView },
    { value: "edge", component: EdgeView },
  ],
  undirected: [
    { value: "adj", component: AdjView },
    { value: "edge", component: EdgeView },
  ],
}

export default function GraphDataMenuList() {
  const graphType = useBoundStore((state) => state.graphMeta.type)
  return (
    <TabsList className="w-full">
      {graphDataMenus[graphType].map((menu, index) => (
        <TabsTrigger key={menu.value} value={index.toString()}>
          {menu.value}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
