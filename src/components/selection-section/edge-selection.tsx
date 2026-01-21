import { useBoundStore } from "@/stores/use-bound-store";
import EmptySelectionView from "./empty-selection-view";
import { SelectionView } from "./selection-view";

export default function EdgeSelection() {
  const selectedEdgeIds = useBoundStore((e) => e.selectedEdgeIds);
  if (selectedEdgeIds.size === 0) {
    return <EmptySelectionView type="edge" />;
  }
  return <SelectionView type="edge" data={selectedEdgeIds} />;
}
