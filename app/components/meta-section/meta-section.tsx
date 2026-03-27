import { cn } from "@/lib/utils"
import { useBoundStore } from "@/stores/use-bound-store"
import LeftbarToggle from "../leftbar/leftbar-toggle"

export default function MetaSection() {
  const openLeftbar = useBoundStore((state) => state.openLeftbar)
  const name = useBoundStore((state) => state.graphMeta.name)
  return (
    <div
      className={cn("flex items-center justify-between px-4 py-3", {
        "gap-2 p-2 pl-4": !openLeftbar,
      })}
    >
      <div className="font-medium">{name}</div>
      <LeftbarToggle />
    </div>
  )
}
