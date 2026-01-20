import { useBoundStore } from "@/stores/use-bound-store";
import EdgeProps from "./edge-props";
import NodeProps from "./node-props";

export default function PropSection() {
  const selected = useBoundStore((e) => e.selected);

  return (
    selected && (
      <>
        {selected.type === "node" ? (
          <NodeProps id={selected.id} />
        ) : (
          <EdgeProps id={selected.id} />
        )}
      </>
    )
  );
}
