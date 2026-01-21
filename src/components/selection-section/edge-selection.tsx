import { useBoundStore } from "@/stores/use-bound-store";
import { useShallow } from "zustand/react/shallow"; // 1. useShallow 임포트
import EmptySelectionView from "./empty-selection-view";
import { SelectionView } from "./selection-view";

export default function EdgeSelection() {
  // 2. useShallow를 사용하여 배열 내부 값의 얕은 비교를 수행
  const selectedEdgeData = useBoundStore(
    useShallow(
      (state) =>
        Array.from(state.selectedEdgeIds)
          .map((id) => state.graph.edges.get(id))
          .filter((edge) => !!edge), // 안전하게 undefined 필터링
    ),
  );

  const edgeSchema = useBoundStore((state) => state.graph.edgeSchema);

  if (selectedEdgeData.length === 0) {
    return <EmptySelectionView type="edge" />;
  }

  return (
    <SelectionView type="edge" data={selectedEdgeData} schema={edgeSchema} />
  );
}
