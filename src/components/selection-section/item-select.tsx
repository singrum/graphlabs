import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { itemAssets } from "@/stores/ui-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import { useMemo } from "react";

export default function ItemSelect({
  type,
  id,
  onValueChange, // 콜백 추가
}: {
  type: "node" | "edge";
  id: string | null;
  onValueChange: (id: string) => void;
}) {
  const Icon = itemAssets[type].icon;

  const collection = useBoundStore((state) =>
    type === "node" ? state.graph.nodes : state.graph.edges,
  );
  const currentItem = id ? collection.get(id) : null;

  const options = useMemo(() => {
    return Array.from(
      (collection as Map<string, { _id: string; _label: string }>).values(),
    ).map((data) => ({
      id: data._id,
      label: data._label,
    }));
  }, [collection]);

  return (
    <Select value={currentItem?._id || ""} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="mixed" />
      </SelectTrigger>

      <SelectContent>
        {options.map(({ id: optionId, label }) => (
          <SelectItem key={optionId} value={optionId}>
            <div className="flex items-center gap-2">
              <Icon className="size-4" />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
