import GraphCanvas from "@/components/graph-canvas/graph-canvas"
import GraphData from "@/components/graph-data/graph-data"
import Leftbar from "@/components/leftbar/leftbar"
import MetaSection from "@/components/meta-section/meta-section"
import Rightbar from "@/components/rightbar/rightbar"
import EdgeSelection from "@/components/selection-section/edge-selection"
import NodeSelection from "@/components/selection-section/node-selection"
import Toolbar from "@/components/toolbar/toolbar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { useGraphHotkeys } from "@/hooks/use-graph-hot-keys"
import { useBoundStore } from "@/stores/use-bound-store"

import { useShallow } from "zustand/react/shallow"

export default function Index() {
  const [openLeftbar] = useBoundStore(
    useShallow((state) => [state.openLeftbar])
  )
  useGraphHotkeys()
  return (
    <div className="h-dvh w-dvw break-all">
      <GraphCanvas />
      <Leftbar>
        <MetaSection />

        {openLeftbar && (
          <>
            <Separator />
            <GraphData />
          </>
        )}
      </Leftbar>
      <Rightbar>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel minSize={100} defaultSize={40}>
            <NodeSelection />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel minSize={100} defaultSize={30}>
            <EdgeSelection />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Rightbar>
      <Toolbar />
    </div>
  )
}
