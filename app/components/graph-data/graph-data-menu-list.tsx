import type { GraphDataMenu } from "@/stores/data-slice";
import React from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import EdgeView from "./data-view/container/edge-view";
import PredView from "./data-view/container/pred-view";
import SuccView from "./data-view/container/succ-view";
export const graphDataMenus: {
  value: GraphDataMenu;
  component: React.ComponentType;
}[] = [
  { value: "succ", component: SuccView },
  { value: "pred", component: PredView },

  { value: "edge", component: EdgeView },
];

export default function GraphDataMenuList() {
  return (
    <TabsList className="w-full">
      {graphDataMenus.map((menu, index) => (
        <TabsTrigger key={menu.value} value={index.toString()}>
          {menu.value}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
