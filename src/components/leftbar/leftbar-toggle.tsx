import { useBoundStore } from "@/stores/use-bound-store";
import { Sidebar } from "lucide-react";
import { Button } from "../ui/button";

export default function LeftbarToggle() {
  const openLeftbar = useBoundStore((state) => state.openLeftbar);
  const setOpenLeftbar = useBoundStore((state) => state.setOpenLeftbar);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground"
      onClick={() => {
        setOpenLeftbar(!openLeftbar);
      }}
    >
      <Sidebar />
    </Button>
  );
}
