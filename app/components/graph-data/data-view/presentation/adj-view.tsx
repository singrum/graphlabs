import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { AdjacencyMap } from "@/types/graph"
import { ChevronRight } from "lucide-react"
import { DataCollapsibleButton } from "./data-collapsible-trigger"
import EdgeLabelButton from "./edge-label-button"

import { cn } from "@/lib/utils"
import NodeLabelButton from "./node-label-button"

export default function AdjView({ adj }: { adj: AdjacencyMap }) {
  return (
    <div className="space-y-1">
      {[...adj.keys()].map((key1) => {
        return (
          <Collapsible key={key1} className="">
            <div className="relative w-full">
              <CollapsibleTrigger
                render={
                  <DataCollapsibleButton className="group absolute top-1/2 h-full -translate-y-1/2 group-aria-[expanded=false]:rotate-0 hover:bg-muted aria-expanded:bg-transparent dark:hover:bg-muted hover:[&_svg]:text-accent-foreground">
                    <ChevronRight className="size-3 text-muted-foreground group-aria-expanded:rotate-90 group-aria-[expanded=false]:rotate-0" />
                  </DataCollapsibleButton>
                }
              />

              <NodeLabelButton id={key1} className={cn("has-[>svg]:pl-8")} />
            </div>
            <CollapsibleContent className="space-y-1 pt-1">
              {adj.get(key1)!.size ? (
                [...adj.get(key1)!.keys()].map((key2) => (
                  <Collapsible key={key2}>
                    <div className="relative w-full">
                      <CollapsibleTrigger
                        render={
                          <DataCollapsibleButton className="group absolute top-1/2 left-4 h-full -translate-y-1/2 hover:bg-muted aria-expanded:bg-transparent dark:hover:bg-muted hover:[&_svg]:text-accent-foreground">
                            <ChevronRight className="size-3 text-muted-foreground group-aria-expanded:rotate-90 group-aria-[expanded=false]:rotate-0" />
                          </DataCollapsibleButton>
                        }
                      />
                      <NodeLabelButton
                        id={key2}
                        className={cn("has-[>svg]:pl-12")}
                      />
                    </div>
                    <CollapsibleContent className="space-y-1 pt-1">
                      {[...adj.get(key1)!.get(key2)!].map((edgeId) => (
                        <EdgeLabelButton
                          key={edgeId}
                          id={edgeId}
                          className="has-[>svg]:pl-16"
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <div className="h-8 px-6 py-2 text-sm text-muted-foreground italic">
                  Has no successors
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}
