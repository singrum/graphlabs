import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router"

export default function NewGraphButton() {
  const navigate = useNavigate()
  return (
    <Button
      variant="outline"
      onClick={async () => {
        const id = await db.newGraph()
        navigate(`/graph/${id}`)
      }}
    >
      <Plus /> New Graph
    </Button>
  )
}
