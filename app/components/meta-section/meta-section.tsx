import { cn } from "@/lib/utils"
import { useBoundStore } from "@/stores/use-bound-store"
import { ChevronsUpDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ButtonGroup } from "~/components/ui/button-group"
import LeftbarToggle from "../leftbar/leftbar-toggle"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
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
    <div
      className={cn("flex items-center justify-between px-2 py-3", {
        "gap-2 p-2": !openLeftbar,
      })}
    >
      <ButtonGroup className="mr-2 min-w-0 flex-1">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={name}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={handleKeyDown}
            className="h-8"
          />
        ) : (
          <Button
            variant="ghost"
            className="min-w-0 flex-1 justify-start truncate font-semibold"
            onClick={() => setIsEditing(true)}
          >
            {name}
          </Button>
        )}

        <Button variant="ghost" size="icon" className="shrink-0">
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </ButtonGroup>

      <LeftbarToggle />
    </div>
  )
}
