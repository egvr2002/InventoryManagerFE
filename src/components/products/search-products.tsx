import {Search} from "lucide-react";
import {Button} from "../ui/button";
import {Card, CardContent} from "../ui/card";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function SearchProducts() {
  return (
    <Card>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-12 justify-between gap-2">
            <Label
              className="col-span-full md:col-span-2"
              htmlFor="name"
            >
              Name
            </Label>
            <Input
              className="col-span-full md:col-span-10"
              type="text"
              id="name"
              name="name"
            />
          </div>

          <div className="grid grid-cols-12 gap-2">
            <Label
              className="col-span-full md:col-span-2"
              htmlFor="category"
            >
              Category
            </Label>

            <Select name="category">
              <SelectTrigger
                className="col-span-full w-full md:col-span-8"
                id="category"
              >
                <SelectValue>Select a category</SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <Label
              className="col-span-full md:col-span-2"
              htmlFor="availability"
            >
              Availability
            </Label>
            <Select name="availability">
              <SelectTrigger
                className="col-span-full w-full md:col-span-8"
                id="availability"
              >
                <SelectValue>Select availability</SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="inStock">In Stock</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="col-span-full mt-4 justify-self-end md:col-span-2 md:m-0 md:w-full"
              type="submit"
            >
              <Search className="size-4" /> Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
