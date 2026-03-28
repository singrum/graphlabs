import type { Graph, GraphMeta } from "@/types/graph"
import Dexie, { type Table } from "dexie"
import { v4 } from "uuid"
import { defaultEdgeSchema, defaultNodeSchema } from "./default"

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
  async saveGraph(graphMeta: GraphMeta, graph: Graph) {
    await this.graphMeta.put(graphMeta)
    await this.graph.put({ id: graphMeta.id, graph })
  }

  async newGraph() {
    const id = v4()
    await this.saveGraph(
      {
        id,
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
    return id
  }
}

export const db = new MyDatabase()
