import { cn } from "@/lib/utils"
import { useBoundStore } from "@/stores/use-bound-store"
import { Sidebar } from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "../ui/button"

export default function LeftbarToggle({
  className,
}: ComponentProps<typeof Button>) {
  const openLeftbar = useBoundStore((state) => state.openLeftbar)
  const setOpenLeftbar = useBoundStore((state) => state.setOpenLeftbar)

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-muted-foreground", className)}
      onClick={() => {
        setOpenLeftbar(!openLeftbar)
      }}
    >
      <Sidebar />
    </Button>
  )
}
