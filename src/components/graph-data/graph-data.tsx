import { useBoundStore } from "@/stores/use-bound-store";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent } from "../ui/tabs";
import GraphDataMenuList, { graphDataMenus } from "./graph-data-menu-list";

export default function GraphData() {
  const [dataMenu, setDataMenu] = useBoundStore(
    useShallow((state) => [state.graphDataMenu, state.setGraphDataMenu]),
  );

  return (
    <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-full">
      <Tabs
        value={dataMenu.toString()}
        onValueChange={(e) => {
          setDataMenu(Number(e));
        }}
        className="gap-4 h-full p-4 w-full"
      >
        <GraphDataMenuList />
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
