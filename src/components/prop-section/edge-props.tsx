import { useBoundStore } from "@/stores/use-bound-store";
import { PropsView } from "./props_view";

export default function EdgeProps({ id }: { id: string }) {
  const edge = useBoundStore((e) => e.graph.edges.get(id)!);
  return <PropsView type="edge" data={edge} />;
}
