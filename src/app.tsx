import GraphCanvas from "./components/graph-canvas/graph-canvas";
import GraphData from "./components/graph-data/graph-data";
import Leftbar from "./components/leftbar/leftbar";
import MetaSection from "./components/meta-section/meta-section";
import PropSection from "./components/prop-section/prop-section";

import { ThemeProvider } from "./components/theme-provider";
import Toolbar from "./components/toolbar/toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { Separator } from "./components/ui/separator";
import { useBoundStore } from "./stores/use-bound-store";

export default function App() {
  const openLeftbar = useBoundStore((state) => state.openLeftbar);
  const isSelected = useBoundStore((state) => state.selected !== null);
  return (
    <div className="h-dvh w-dvw break-all">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GraphCanvas />
        <Leftbar>
          <MetaSection />

          {openLeftbar && (
            <>
              <Separator />
              {isSelected ? (
                <ResizablePanelGroup orientation="vertical">
                  <ResizablePanel>
                    <GraphData />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel>
                    <PropSection />
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <GraphData />
              )}
            </>
          )}
        </Leftbar>
        <Toolbar />
      </ThemeProvider>
    </div>
  );
}
