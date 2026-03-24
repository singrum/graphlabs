import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { itemAssets } from "@/stores/ui-slice";

export default function EmptySelectionView({
  type,
}: {
  type: "node" | "edge";
}) {
  const Icon = itemAssets[type].icon;
  return (
    <div className="flex items-center justify-center h-full">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>No {type}s selected</EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
