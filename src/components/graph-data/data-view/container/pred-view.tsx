import { useBoundStore } from "@/stores/use-bound-store";
import AdjView from "../presentation/adj-view";

export default function PredView() {
  const pred = useBoundStore((state) => state.graph.pred);

  return <AdjView adj={pred} />;
}
