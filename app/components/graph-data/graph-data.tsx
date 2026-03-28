import { useBoundStore } from "@/stores/use-bound-store"
import { useShallow } from "zustand/react/shallow"
import { Tabs, TabsContent } from "../ui/tabs"
import GraphDataMenuList, { graphDataMenus } from "./graph-data-menu-list"

export default function GraphData() {
  const [dataMenu, setDataMenu] = useBoundStore(
    useShallow((state) => [state.graphDataMenu, state.setGraphDataMenu])
  )

  return (
    <div className="h-full flex-1 overflow-y-scroll">
      <Tabs
        value={dataMenu.toString()}
        onValueChange={(e) => {
          setDataMenu(Number(e))
        }}
        className="w-full gap-4 p-4"
      >
        <GraphDataMenuList />
        {graphDataMenus.map((e, index) => (
          <TabsContent
            key={e.value}
            value={index.toString()}
            hidden={dataMenu !== index}
          >
            <e.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
