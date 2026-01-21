import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { AdjacencyMap } from "@/types/graph";
import { ChevronRight } from "lucide-react";
import { DataCollapsibleButton } from "./data-collapsible-trigger";
import EdgeLabelButton from "./edge-label-button";

import { cn } from "@/lib/utils";
import NodeLabelButton from "./node-label-button";

export default function AdjView({ adj }: { adj: AdjacencyMap }) {
  return (
    <div className="space-y-1">
      {[...adj.keys()].map((key1) => (
        <Collapsible key={key1}>
          <div className="relative w-full group">
            <CollapsibleTrigger asChild>
              <DataCollapsibleButton className="absolute  top-1/2 -translate-y-1/2 h-full hover:[&_svg]:text-accent-foreground hover:bg-transparent dark:hover:bg-transparent">
                <ChevronRight className="text-muted-foreground size-3" />
              </DataCollapsibleButton>
            </CollapsibleTrigger>

            <NodeLabelButton id={key1} className={cn("has-[>svg]:pl-8")} />
          </div>
          <CollapsibleContent className="pt-1 space-y-1">
            {[...adj.get(key1)!.keys()].map((key2) => (
              <Collapsible key={key2}>
                <div className="relative w-full group">
                  <CollapsibleTrigger asChild>
                    <DataCollapsibleButton className="absolute left-4 top-1/2 -translate-y-1/2 h-full hover:[&_svg]:text-accent-foreground hover:bg-transparent dark:hover:bg-transparent">
                      <ChevronRight className="text-muted-foreground size-3 " />
                    </DataCollapsibleButton>
                  </CollapsibleTrigger>
                  <NodeLabelButton
                    id={key2}
                    className={cn("has-[>svg]:pl-12")}
                  />
                </div>
                <CollapsibleContent className="pt-1 space-y-1">
                  {[...adj.get(key1)!.get(key2)!].map((edgeId) => (
                    <EdgeLabelButton
                      key={edgeId}
                      id={edgeId}
                      className="has-[>svg]:pl-16"
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
