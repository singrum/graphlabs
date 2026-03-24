import { useBoundStore } from "@/stores/use-bound-store";
import AdjView from "../presentation/adj-view";

export default function SuccView() {
  const succ = useBoundStore((state) => state.graph.succ);

  return <AdjView adj={succ} />;
}
