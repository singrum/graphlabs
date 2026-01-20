import { Button } from "@/components/ui/button";
import { itemAssets } from "@/stores/ui-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { type ComponentProps } from "react";

export default function NodeLabelButton({
  id,
  className,
}: {
  id: string;
} & ComponentProps<"button">) {
  const setSelected = useBoundStore((state) => state.setSelected);
  const label = useBoundStore((state) => state.graph.nodes.get(id)!._label);
  return (
    <Button
      className={className}
      variant="ghost"
      onClick={() => {
        setSelected({ type: "node", id: id });
      }}
    >
      <itemAssets.node.icon />
      {label}
    </Button>
  );
}
