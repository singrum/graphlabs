import { cn } from "@/lib/utils"
import type { GraphType } from "@/types/graph"
import { MoveUpRight, Slash } from "lucide-react"
import type { ComponentProps } from "react"
const graphTypes = {
  undirected: { icon: Slash },
  directed: { icon: MoveUpRight },
}

export default function GraphIcon({
  className,
  size,
  type,
  ...props
}: { type: GraphType; size?: "sm" | "md" | "lg" } & ComponentProps<"div">) {
  const graphType = graphTypes[type]
  const itemMediaClassName = {
    undirected: "bg-undirected/20 text-undirected border-undirected",
    directed: "bg-directed/20 text-directed border-directed",
  }
  const boxSizeClassName = {
    sm: "size-6",
    md: "size-8",
    lg: "size-9",
  }
  const iconSizeClassName = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  }
  if (!graphType) {
    return null
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm border",
        itemMediaClassName[type],
        boxSizeClassName[size || "md"],
        className
      )}
      {...props}
    >
      <graphType.icon
        className={cn("size-5", iconSizeClassName[size || "md"])}
      />
    </div>
  )
}
