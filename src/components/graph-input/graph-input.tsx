import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function GraphInput() {
  return (
    <div>
      <Label className="flex flex-col gap-2 items-start">
        Data
        <Textarea />
      </Label>
    </div>
  );
}
