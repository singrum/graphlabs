import { useBoundStore } from "@/stores/use-bound-store"
import { useShallow } from "zustand/react/shallow"
import EdgeLabelButton from "../presentation/edge-label-button"

export default function EdgeView() {
  const edges = useBoundStore(
    useShallow((state) => [...state.graph.edges.keys()])
  )
  return (
    <div className="space-y-1">
      {edges.map((edgeId) => (
        <EdgeLabelButton
          key={edgeId}
          id={edgeId}
          className="w-full justify-start hover:bg-accent dark:hover:bg-accent/50"
        />
      ))}
    </div>
  )
}
