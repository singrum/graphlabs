import { useBoundStore } from "@/stores/use-bound-store"
import { useState, type ComponentProps } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
export default function EditMetadataDialogTrigger(
  props: ComponentProps<typeof DialogTrigger>
) {
  const initialName = useBoundStore((state) => state.graphMeta.name)
  const [name, setName] = useState(initialName)
  const setTitle = useBoundStore((state) => state.setTitle)
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Metadata</DialogTitle>
          <DialogDescription hidden>
            Here you can edit the metadata of the graph, such as its name and
            type.
          </DialogDescription>
        </DialogHeader>
        <Label>
          Name
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Label>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose
            render={<Button>Save Changes</Button>}
            onClick={() => {
              setTitle(name)
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
