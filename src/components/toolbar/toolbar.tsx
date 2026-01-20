import type { Tool } from "@/stores/toolbar-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { Circle, Pointer, Slash } from "lucide-react";
import { Card } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
export default function Toolbar() {
  const tool = useBoundStore((state) => state.tool);
  const setTool = useBoundStore((state) => state.setTool);

  return (
    <Card className="fixed bottom-0 left-1/2 -translate-x-1/2 p-2 mb-4">
      <ToggleGroup
        type="single"
        spacing={1}
        value={tool}
        onValueChange={(value) => {
          if (value) setTool(value as Tool);
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <ToggleGroupItem value="select" aria-label="Toggle select">
                <Pointer className="h-4 w-4" />
              </ToggleGroupItem>
            </span>
          </TooltipTrigger>
          <TooltipContent>Select</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <ToggleGroupItem value="node" aria-label="Toggle node">
                <Circle className="h-4 w-4" />
              </ToggleGroupItem>
            </span>
          </TooltipTrigger>
          <TooltipContent>Node</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <ToggleGroupItem value="edge" aria-label="Toggle edge">
                <Slash className="h-4 w-4" />
              </ToggleGroupItem>
            </span>
          </TooltipTrigger>
          <TooltipContent>Edge</TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </Card>
  );
}
