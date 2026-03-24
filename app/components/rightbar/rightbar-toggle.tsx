import { useBoundStore } from "@/stores/use-bound-store";
import { Sidebar } from "lucide-react";
import { Button } from "../ui/button";

export default function RightbarToggle() {
  const openRightbar = useBoundStore((state) => state.openRightbar);
  const setOpenRightbar = useBoundStore((state) => state.setOpenRightbar);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground"
      onClick={() => {
        setOpenRightbar(!openRightbar);
      }}
    >
      <Sidebar />
    </Button>
  );
}
