import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { itemAssets } from "@/stores/ui-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { type ComponentProps } from "react";

export default function EdgeLabelButton({
  id,
  className,
}: {
  id: string;
} & ComponentProps<"button">) {
  const setSelectedEdges = useBoundStore((state) => state.setSelectedEdges);
  const selectedEdgeIds = useBoundStore((state) => state.selectedEdgeIds);
  const label = useBoundStore((state) => state.graph.edges.get(id)!._label);
  return (
    <Button
      className={cn(
        "w-full justify-start group-hover:bg-accent dark:group-hover:bg-accent/50",
        {
          "bg-accent dark:bg-accent hover:bg-accent dark:group-hover:bg-accent":
            selectedEdgeIds.has(id),
        },
        className,
      )}
      variant="ghost"
      onClick={() => {
        if (selectedEdgeIds.size > 1) {
          setSelectedEdges([id]);
        } else if (!selectedEdgeIds.has(id)) {
          setSelectedEdges([id]);
        } else {
          setSelectedEdges([]);
        }
      }}
    >
      <itemAssets.edge.icon />
      {label}
    </Button>
  );
}
