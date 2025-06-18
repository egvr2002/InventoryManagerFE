import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {Button} from "../ui/button";
import {Plus} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
interface ProductDialogProps {
  action: "add" | "edit";
}

// This is a dialog to create or edit products
export function ProductDialog({action}: ProductDialogProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger>
          <Button
            className="m-0 p-0"
            variant={action == "edit" ? "link" : "default"}
            type="button"
          >
            {action === "add" ? (
              <>
                <Plus /> New product
              </>
            ) : (
              "Edit"
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "add" ? "New" : "Edit"} Product
            </DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
              odio excepturi laborum!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                type="text"
                name="category"
                id="category"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                name="stock"
                id="stock"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input
                type="number"
                name="unitPrice"
                id="unitPrice"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                type="date"
                name="expirationDate"
                id="expirationDate"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
