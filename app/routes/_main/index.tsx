import { db } from "@/lib/db"
import type { GraphMeta } from "@/types/graph"
import { useLoaderData } from "react-router"
import GraphList from "./+components/graph-list"
import type { Route } from "./+types"
export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<{ graphMetas: GraphMeta[] }> {
  const graphMetas = await db.getAllGraphMetas()

  return { graphMetas }
}

clientLoader.hydrate = true
export default function Home() {
  const data = useLoaderData<{
    graphMetas: GraphMeta[]
  }>()
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 flex justify-between bg-background p-6 text-lg">
        <div className="text-xl font-bold">My Graphs</div>
      </header>
      <GraphList data={data.graphMetas} />
    </div>
  )
}
