import { Button } from "@/components/ui/button";
import { itemAssets } from "@/stores/ui-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { type ComponentProps } from "react";

export default function EdgeLabelButton({
  id,
  className,
}: {
  id: string;
} & ComponentProps<"button">) {
  const setSelected = useBoundStore((state) => state.setSelected);
  const label = useBoundStore((state) => state.graph.edges.get(id)!._label);
  return (
    <Button
      className={className}
      variant="ghost"
      onClick={() => {
        setSelected({ type: "edge", id: id });
      }}
    >
      <itemAssets.edge.icon />
      {label}
    </Button>
  );
}
