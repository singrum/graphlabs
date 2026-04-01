import { useBoundStore } from "@/stores/use-bound-store"
import type { DirectedGraph } from "@/types/graph"
import AdjMapView from "../presentation/adj-map-view"

export default function SuccView() {
  const succ = useBoundStore((state) => (state.graph as DirectedGraph).succ)

  return <AdjMapView adj={succ} />
}
