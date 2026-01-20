import { itemAssets } from "@/stores/ui-slice";
import type { EdgeData, NodeData } from "@/types/graph";
import { ScrollArea } from "../ui/scroll-area";

export function PropsView({
  type,
  data,
}: {
  type: "node" | "edge";
  data: NodeData | EdgeData;
}) {
  const Icon = itemAssets[type].icon;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4 h-full">
        <div className="flex items-center gap-2">
          <Icon className="size-4" />
          <div className="font-medium">{data._label}</div>
        </div>
        <div>
          {Object.entries(data)
            .filter(([key]) => key != "_id")
            .map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <span className="text-muted-foreground text-nowrap">{key}</span>
                <span>{value!.toString()}</span>
              </div>
            ))}
        </div>
      </div>
    </ScrollArea>
  );
}
