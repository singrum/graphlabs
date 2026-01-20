import { type GraphDataMenu } from "@/stores/data-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import EdgeView from "./data-view/container/edge-view";
import NodeView from "./data-view/container/node-view";
import PredView from "./data-view/container/pred-view";
import SuccView from "./data-view/container/succ-view";

const graphDataMenus: {
  value: GraphDataMenu;
  component: React.ComponentType;
}[] = [
  { value: "succ", component: SuccView },
  { value: "pred", component: PredView },
  { value: "node", component: NodeView },
  { value: "edge", component: EdgeView },
];

export default function GraphData() {
  const [dataMenu, setDataMenu] = useBoundStore(
    useShallow((state) => [state.graphDataMenu, state.setGraphDataMenu]),
  );

  return (
    <ScrollArea className="overflow-auto h-full">
      <Tabs
        value={dataMenu.toString()}
        onValueChange={(e) => {
          setDataMenu(Number(e));
        }}
        className="gap-4 h-full p-4 w-full"
      >
        <TabsList className="w-full">
          {graphDataMenus.map((menu, index) => (
            <TabsTrigger key={menu.value} value={index.toString()}>
              {menu.value}
            </TabsTrigger>
          ))}
        </TabsList>
        {graphDataMenus.map((e, index) => (
          <TabsContent
            key={e.value}
            value={index.toString()}
            forceMount
            hidden={dataMenu !== index}
          >
            <e.component />
          </TabsContent>
        ))}
      </Tabs>
    </ScrollArea>
  );
}
