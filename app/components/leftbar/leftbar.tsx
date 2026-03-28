import { cn } from "@/lib/utils"
import { useBoundStore } from "@/stores/use-bound-store"

export default function Leftbar({ children }: { children: React.ReactNode }) {
  const openLeftbar = useBoundStore((state) => state.openLeftbar)
  return (
    <div
      className={cn("fixed top-0 left-0 flex h-full min-h-0 w-75 flex-col", {
        "h-auto w-auto p-2": !openLeftbar,
      })}
    >
      <div
        className={cn("flex h-full flex-1 flex-col bg-sidebar", {
          "rounded-md border": !openLeftbar,
        })}
      >
        {children}
      </div>
    </div>
  )
}
