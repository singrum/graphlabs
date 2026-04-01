import { cn } from "@/lib/utils"
import { useBoundStore } from "@/stores/use-bound-store"
import { Home } from "lucide-react"
import { Link } from "react-router"
import GraphIcon from "../graph-icon/graph-icon"
import LeftbarToggle from "../leftbar/leftbar-toggle"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import EditMetadataDialogTrigger from "./edit-metadata-dialog-trigger"
export default function MetaSection() {
  const openLeftbar = useBoundStore((state) => state.openLeftbar)
  const name = useBoundStore((state) => state.graphMeta.name)
  const setTitle = useBoundStore((state) => state.setTitle)

  return (
    <div className={cn("flex h-12 items-stretch justify-between")}>
      <Button
        variant="ghost"
        size="icon-lg"
        className="font-muted-foreground size-12 shrink-0 rounded-none"
        render={
          <Link to="/">
            <Home />
          </Link>
        }
      />
      <Separator orientation="vertical" />
      <div className="flex min-w-0 flex-1 items-stretch">
        <EditMetadataDialogTrigger
          render={
            <Button
              variant="ghost"
              className="h-full w-full min-w-0 flex-1 justify-start gap-3 truncate rounded-none px-3 font-semibold"
            >
              <GraphIcon
                size="sm"
                type={useBoundStore((state) => state.graphMeta.type)}
              />
              {name}
            </Button>
          }
        />
      </div>
      <div>
        <LeftbarToggle className="size-12 rounded-none" />
      </div>
    </div>
  )
}
