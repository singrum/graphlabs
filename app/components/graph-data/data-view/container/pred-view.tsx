import { useBoundStore } from "@/stores/use-bound-store"
import type { DirectedGraph } from "@/types/graph"
import AdjMapView from "../presentation/adj-map-view"

export default function PredView() {
  const pred = useBoundStore((state) => (state.graph as DirectedGraph).pred)

  return <AdjMapView adj={pred} />
}
