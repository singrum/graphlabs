import { useBoundStore } from "@/stores/use-bound-store";
import { PropsView } from "./props_view";

export default function NodeProps({ id }: { id: string }) {
  const node = useBoundStore((e) => e.graph.nodes.get(id)!);
  return <PropsView type="node" data={node} />;
}
