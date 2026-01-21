import { useBoundStore } from "@/stores/use-bound-store";
import EmptySelectionView from "./empty-selection-view";
import { SelectionView } from "./selection-view";

export default function NodeSelection() {
  const selectedNodeIds = useBoundStore((e) => e.selectedNodeIds);
  if (selectedNodeIds.size === 0) {
    return <EmptySelectionView type="node" />;
  }
  return <SelectionView type="node" data={selectedNodeIds} />;
}
