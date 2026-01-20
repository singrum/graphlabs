import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { itemAssets } from "@/stores/ui-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { type ComponentProps } from "react";
import { useShallow } from "zustand/react/shallow";

export default function NodeLabelButton({
  id,
  className,
}: {
  id: string;
} & ComponentProps<"button">) {
  const label = useBoundStore((state) => state.graph.nodes.get(id)!._label);
  const [selectedIds, setSelectedIds] = useBoundStore(
    useShallow((state) => [state.selectedIds, state.setSelectedIds]),
  );

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start group-hover:bg-accent dark:group-hover:bg-accent/50",
        {
          "bg-accent dark:bg-accent group-hover:bg-accent dark:hover:bg-accent":
            selectedIds.has(id),
        },
        className,
      )}
      onClick={() => {
        if (selectedIds.has(id)) {
          if (selectedIds.size === 1) {
            setSelectedIds([]);
            return;
          }
        }
        setSelectedIds([id]);
      }}
    >
      <itemAssets.node.icon />
      {label}
    </Button>
  );
}
