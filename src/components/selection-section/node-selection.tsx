import { useBoundStore } from "@/stores/use-bound-store";
import { useShallow } from "zustand/react/shallow";
import EmptySelectionView from "./empty-selection-view";
import { SelectionView } from "./selection-view";

export default function NodeSelection() {
  const selectedNodeData = useBoundStore(
    useShallow((state) =>
      Array.from(state.selectedNodeIds)
        .map((id) => state.graph.nodes.get(id))
        .filter((node) => !!node),
    ),
  );
  const nodeSchema = useBoundStore((e) => e.graph.nodeSchema);
  if (selectedNodeData.length === 0) {
    return <EmptySelectionView type="node" />;
  }
  return (
    <SelectionView type="node" data={selectedNodeData} schema={nodeSchema} />
  );
}
