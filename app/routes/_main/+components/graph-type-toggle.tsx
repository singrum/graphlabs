import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSearchParams } from "react-router"

export default function GraphTypeToggle() {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <ToggleGroup
      spacing={2}
      size="lg"
      variant="outline"
      value={[searchParams.get("type") ?? "directed"]}
      onValueChange={(value) => {
        setSearchParams((prev) => {
          prev.set("type", value[0])
          return prev
        })
      }}
    >
      <ToggleGroupItem value="undirected" aria-label="Toggle Undirected">
        Undirected
      </ToggleGroupItem>
      <ToggleGroupItem value="directed" aria-label="Toggle Directed">
        Directed
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
