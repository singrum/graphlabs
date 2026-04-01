import { useBoundStore } from "@/stores/use-bound-store"
import type { UndirectedGraph } from "@/types/graph"
import AdjMapView from "../presentation/adj-map-view"

export default function AdjView() {
  const adj = useBoundStore((state) => (state.graph as UndirectedGraph).adj)
  
  return <AdjMapView adj={adj} />
}
