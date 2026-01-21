import { cn } from "@/lib/utils";
import { useBoundStore } from "@/stores/use-bound-store";

export default function Rightbar({ children }: { children: React.ReactNode }) {
  const openRightbar = useBoundStore((state) => state.openRightbar);
  return (
    <div
      className={cn("fixed max-h-full w-75 top-0 right-0 h-full", {
        "p-2 h-auto w-auto": !openRightbar,
      })}
    >
      <div
        className={cn("bg-sidebar h-full flex flex-col", {
          "rounded-md border": !openRightbar,
        })}
      >
        {children}
      </div>
    </div>
  );
}
