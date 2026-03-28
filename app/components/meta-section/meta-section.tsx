import { cn } from "@/lib/utils"
import { useBoundStore } from "@/stores/use-bound-store"
import { Home } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import LeftbarToggle from "../leftbar/leftbar-toggle"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
export default function MetaSection() {
  const openLeftbar = useBoundStore((state) => state.openLeftbar)
  const name = useBoundStore((state) => state.graphMeta.name)
  const setTitle = useBoundStore((state) => state.setTitle)

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 수정 모드 진입 시 자동 포커스
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") setIsEditing(false)
  }

  return (
    <div className={cn("flex h-12 items-stretch justify-between")}>
      <Button
        variant="ghost"
        size="icon-lg"
        className="size-12 shrink-0 rounded-none"
        render={
          <Link to="/">
            <Home className="stroke-muted-foreground" />
          </Link>
        }
      />
      <Separator orientation="vertical" />
      <div className="flex min-w-0 flex-1 items-stretch">
        {isEditing ? (
          <Input
            className="h-full rounded-none border-none px-4 font-semibold"
            ref={inputRef}
            value={name}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Button
            variant="ghost"
            className="h-full min-w-0 flex-1 justify-start truncate rounded-none px-4 font-semibold"
            onClick={() => setIsEditing(true)}
          >
            {name}
          </Button>
        )}
      </div>
      <div>
        <LeftbarToggle className="size-12 rounded-none" />
      </div>
    </div>
  )
}
