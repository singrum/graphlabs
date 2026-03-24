import { Button } from "@/components/ui/button"
import { CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function DataCollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <CollapsibleTrigger
      render={
        <DataCollapsibleButton className={cn(className)} {...props}>
          {children}
        </DataCollapsibleButton>
      }
    ></CollapsibleTrigger>
  )
}

export function DataCollapsibleButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        "items-center justify-center [&_svg]:transition-transform data-[state=closed]:[&_svg]:rotate-0 data-[state=open]:[&_svg]:rotate-90",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
