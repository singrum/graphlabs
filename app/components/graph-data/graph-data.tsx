import { useBoundStore } from "@/stores/use-bound-store"
import { Tabs, TabsContent } from "../ui/tabs"
import GraphDataMenuList, { graphDataMenus } from "./graph-data-menu-list"

export default function GraphData() {
  const dataMenu = useBoundStore((state) => state.graphDataMenu)
  const setDataMenu = useBoundStore((state) => state.setGraphDataMenu)
  const graphType = useBoundStore((state) => state.graphMeta.type)
  return (
    <div className="no-scrollbar h-full flex-1 overflow-y-scroll">
      <Tabs
        value={dataMenu.toString()}
        onValueChange={(e) => {
          setDataMenu(Number(e))
        }}
        className="w-full gap-4 p-4"
      >
        <GraphDataMenuList />
        {graphDataMenus[graphType].map((e, index) => (
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
