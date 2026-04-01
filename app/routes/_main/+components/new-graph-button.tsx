import { Button } from "@/components/ui/button"
import NewGraphDialogTrigger from "./new-graph-dialog-trigger"

export default function NewGraphButton() {
  return (
    <NewGraphDialogTrigger
      render={<Button variant="outline">New Graph</Button>}
    />
  )
}
