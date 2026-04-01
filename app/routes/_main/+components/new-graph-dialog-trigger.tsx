import GraphIcon from "@/components/graph-icon/graph-icon"
import { db } from "@/lib/db"
import type { GraphType } from "@/types/graph"
import { MoveUpRight, Slash } from "lucide-react"
import { type ComponentProps } from "react"
import { useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

import { Item, ItemContent, ItemGroup, ItemTitle } from "~/components/ui/item"

const graphTypes: {
  label: string
  value: GraphType
  icon: React.ComponentType
}[] = [
  { label: "Undirected Graph", value: "undirected", icon: Slash },
  { label: "Directed Graph", value: "directed", icon: MoveUpRight },
]

export default function NewGraphDialogTrigger(
  props: ComponentProps<typeof DialogTrigger>
) {
  const navigate = useNavigate()
  const itemMediaClassName = [
    "bg-undirected/20 text-undirected border-undirected border",
    "bg-directed/20 text-directed border-directed border",
  ]
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription className="hidden">
            Create a new graph to start visualizing your data.
          </DialogDescription>
        </DialogHeader>
        <ItemGroup className="">
          {graphTypes.map((graphType, i) => (
            <Button
              key={graphType.value}
              className="h-auto cursor-pointer gap-2 bg-transparent dark:bg-transparent"
              variant="outline"
              onClick={async () => {
                const id = await db.newGraph(graphType.value)
                navigate(`/graph/${id}`)
              }}
              render={
                <Item key={graphType.value} className="flex gap-4">
                  <GraphIcon type={graphType.value} />

                  <ItemContent>
                    <ItemTitle className="text-center">
                      {graphType.label}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              }
            />
          ))}
        </ItemGroup>
      </DialogContent>
    </Dialog>
  )
}
