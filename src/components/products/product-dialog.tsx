import {useState} from "react";
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
import {useAppDispatch} from "@/store/hooks";
import {
  addProductThunk,
  updateProductThunk,
} from "@/store/slices/inventory/thunks";
import type {Product, ProductDTO} from "@/interfaces/product/product.interface";

interface ProductDialogProps {
  action: "add" | "edit";
  product?: Product;
}

export function ProductDialog({action, product}: ProductDialogProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleFormAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const productData: ProductDTO = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      unitPrice: parseFloat(formData.get("unitPrice") as string),
      expirationDate: new Date(formData.get("expirationDate") as string),
      quantityInStock: parseInt(formData.get("quantityInStock") as string),
    };

    try {
      if (action === "add") {
        dispatch(addProductThunk(productData));
      } else if (action === "edit" && product?.id) {
        dispatch(updateProductThunk(product.id, productData));
      }

      setOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      data-testid="product-dialog"
    >
      <DialogTrigger asChild>
        <Button
          className="m-0 w-fit p-0"
          variant={action === "edit" ? "link" : "default"}
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
          <DialogTitle>{action === "add" ? "New" : "Edit"} Product</DialogTitle>
          <DialogDescription>
            {action === "add"
              ? "Add a new product to your inventory"
              : "Update the product information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormAction}>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                defaultValue={product?.name}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                type="text"
                name="category"
                id="category"
                defaultValue={product?.category}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantityInStock">Stock Quantity</Label>
              <Input
                type="number"
                name="quantityInStock"
                id="quantityInStock"
                min="0"
                defaultValue={product?.quantityInStock}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input
                type="number"
                name="unitPrice"
                id="unitPrice"
                step="0.01"
                min="0"
                defaultValue={product?.unitPrice}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                type="date"
                name="expirationDate"
                id="expirationDate"
                defaultValue={
                  product?.expirationDate
                    ? new Date(product.expirationDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">
              {action === "add" ? "Create Product" : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
