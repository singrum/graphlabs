import GraphIcon from "@/components/graph-icon/graph-icon"
import { Button } from "@/components/ui/button"
import type { GraphMeta } from "@/types/graph"
import { Link } from "react-router"
import NewGraphButton from "./new-graph-button"

export default function GraphList({ data }: { data: GraphMeta[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-6 pb-6">
      <NewGraphButton />
      {data.map((graphMeta) => (
        <Button
          size="lg"
          key={graphMeta.id}
          variant="outline"
          render={
            <Link to={`/graph/${graphMeta.id}`}>
              <div className="flex w-full items-center justify-start gap-1 truncate">
                <GraphIcon type={graphMeta.type} />
                <div>
                  <h3 className="text-lg font-semibold">{graphMeta.name}</h3>
                </div>
              </div>
            </Link>
          }
        />
      ))}
    </div>
  )
}
