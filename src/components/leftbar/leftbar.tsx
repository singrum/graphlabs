import { cn } from "@/lib/utils";
import { useBoundStore } from "@/stores/use-bound-store";

export default function Leftbar({ children }: { children: React.ReactNode }) {
  const openLeftbar = useBoundStore((state) => state.openLeftbar);
  return (
    <div
      className={cn("fixed max-h-full w-75 top-0 left-0 h-full", {
        "p-2 h-auto w-auto": !openLeftbar,
      })}
    >
      <div
        className={cn("bg-sidebar h-full flex flex-col", {
          "rounded-md border": !openLeftbar,
        })}
      >
        {children}
      </div>
    </div>
  );
}
