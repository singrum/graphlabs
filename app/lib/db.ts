import type { Graph, GraphMeta } from "@/types/graph"
import Dexie, { type Table } from "dexie"

export class MyDatabase extends Dexie {
  graphMeta!: Table<GraphMeta>
  graph!: Table<{
    id: string
    graph: Graph
  }>
  constructor() {
    super("my-graph")

    this.version(1).stores({
      graphMeta: "id, name, type, createdAt, updatedAt",
      graph: "id",
    })
  }
  async getAllGraphMetas() {
    return await this.graphMeta.toArray()
  }
  async createGraph(graphMeta: GraphMeta, graph: Graph): Promise<string> {
    await this.graphMeta.add(graphMeta)
    await this.graph.add({ id: graphMeta.id, graph })
    return graphMeta.id
  }

  async getGraph(
    id: string
  ): Promise<{ graphMeta: GraphMeta; graph: Graph } | null> {
    const graphMeta = await this.graphMeta.get(id)
    if (!graphMeta) {
      return null
    }
    const graph = await this.graph.get(id)
    if (!graph) {
      return null
    }

    return { graphMeta, graph: graph.graph }
  }
  saveGraph = async (graphMeta: GraphMeta, graph: Graph) => {
    await this.graphMeta.put(graphMeta)
    await this.graph.put({ id: graphMeta.id, graph })
  }
}

export const db = new MyDatabase()
