import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { defaultEdgeSchema, defaultNodeSchema } from "@/lib/default"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router"
import { v4 } from "uuid"

export default function NewGraphButton() {
  const navigate = useNavigate()
  return (
    <Button
      variant="outline"
      onClick={async () => {
        const id = await db.createGraph(
          {
            id: v4(),
            name: "New Graph",
            type: "directed",
            createdAt: new Date().getMilliseconds(),
            updatedAt: new Date().getMilliseconds(),
          },
          {
            nodes: new Map(),
            edges: new Map(),
            nodeSchema: defaultNodeSchema,
            edgeSchema: defaultEdgeSchema,
            succ: new Map(),
            pred: new Map(),
          }
        )
        navigate(`/graph/${id}`)
      }}
    >
      <Plus /> New Graph
    </Button>
  )
}
