import { cn } from "@/lib/utils";
import { useBoundStore } from "@/stores/use-bound-store";
import LeftbarToggle from "../leftbar/leftbar-toggle";

export default function MetaSection() {
  const title = useBoundStore((state) => state.graph.title);
  const openLeftbar = useBoundStore((state) => state.openLeftbar);
  return (
    <div
      className={cn("flex justify-between items-center px-4 py-3", {
        "gap-2 p-2 pl-4": !openLeftbar,
      })}
    >
      <div className="font-medium">{title}</div>
      <LeftbarToggle />
    </div>
  );
}
