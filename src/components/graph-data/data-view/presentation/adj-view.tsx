import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { AdjacencyMap } from "@/types/graph";
import { ChevronRight } from "lucide-react";
import { DataCollapsibleButton } from "./data-collapsible-trigger";
import EdgeLabelButton from "./edge-label-button";

import NodeLabelButton from "./node-label-button";

export default function AdjView({ adj }: { adj: AdjacencyMap }) {
  return (
    <div className="">
      {[...adj.keys()].map((key1) => (
        <Collapsible key={key1}>
          <div className="relative w-full group">
            <CollapsibleTrigger asChild>
              <DataCollapsibleButton className="absolute  top-1/2 -translate-y-1/2 h-full hover:[&_svg]:text-accent-foreground hover:bg-transparent dark:hover:bg-transparent">
                <ChevronRight className="text-muted-foreground size-3" />
              </DataCollapsibleButton>
            </CollapsibleTrigger>

            <NodeLabelButton
              id={key1}
              className="has-[>svg]:pl-8 w-full justify-start group-hover:bg-accent dark:group-hover:bg-accent/50"
            />
          </div>
          <CollapsibleContent>
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
                    className="has-[>svg]:pl-12 w-full justify-start group-hover:bg-accent dark:group-hover:bg-accent/50"
                  />
                </div>
                <CollapsibleContent>
                  {[...adj.get(key1)!.get(key2)!].map((edgeId) => (
                    <EdgeLabelButton
                      key={edgeId}
                      id={edgeId}
                      className="has-[>svg]:pl-16 w-full justify-start hover:bg-accent dark:hover:bg-accent/50"
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
