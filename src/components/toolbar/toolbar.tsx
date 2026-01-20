import type { Tool } from "@/stores/toolbar-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { Circle, MousePointer2, Slash } from "lucide-react";
import { Card } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const tools: {
  value: Tool;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}[] = [
  { value: "select", icon: MousePointer2, label: "Select" },
  { value: "node", icon: Circle, label: "Node" },
  { value: "edge", icon: Slash, label: "Edge" },
];

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
        {tools.map(({ value, icon: Icon, label }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <span>
                <ToggleGroupItem
                  value={value}
                  aria-label={`Toggle ${label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                </ToggleGroupItem>
              </span>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </Card>
  );
}
