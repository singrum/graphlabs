import GraphCanvas from "./components/graph-canvas/graph-canvas";
import GraphInput from "./components/graph-input/graph-input";
import Leftbar from "./components/leftbar/leftbar";

import { ThemeProvider } from "./components/theme-provider";
import Toolbar from "./components/toolbar/toolbar";

export default function App() {
  return (
    <div className="h-dvh w-dvw ">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GraphCanvas />
        <Leftbar>
          <GraphInput />
        </Leftbar>

        <Toolbar />
      </ThemeProvider>
    </div>
  );
}
