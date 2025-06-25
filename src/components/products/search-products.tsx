import {useEffect} from "react";
import {Search, X} from "lucide-react";
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
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {
  loadCategoriesThunk,
  searchProductsThunk,
} from "@/store/slices/inventory/thunks";
import {
  setSearchFilters,
  clearSearchFilters,
} from "@/store/slices/inventory/searchSlice";
import type {
  Availability,
  SearchFilters,
} from "@/interfaces/product/search-filters.interface";

export function SearchProducts() {
  const {categories} = useAppSelector((state) => state.categories);
  const {searchFilters} = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadCategoriesThunk());
  }, [dispatch]);

  const handleSearchProducts = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const filters: SearchFilters = {
      name: formData.get("name")?.toString() || "",
      category: formData.get("category")?.toString() || "all",
      availability: (formData.get("availability")?.toString() ||
        "all") as Availability,
    };
    dispatch(setSearchFilters(filters));
    dispatch(searchProductsThunk());
  };

  const handleClear = () => {
    dispatch(clearSearchFilters());
    dispatch(searchProductsThunk());
  };

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={handleSearchProducts}
          className="space-y-6"
        >
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
              defaultValue={searchFilters?.name}
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-12 gap-2">
            <Label
              className="col-span-full md:col-span-2"
              htmlFor="category"
            >
              Category
            </Label>
            <Select
              name="category"
              defaultValue={searchFilters?.category}
            >
              <SelectTrigger
                className="col-span-full w-full md:col-span-10"
                id="category"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.toString()}
                    value={category.toString()}
                  >
                    {category}
                  </SelectItem>
                ))}
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
            <Select
              name="availability"
              defaultValue={searchFilters?.availability}
            >
              <SelectTrigger
                className="col-span-full w-full md:col-span-6"
                id="availability"
              >
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <div className="col-span-full flex gap-2 md:col-span-4">
              <Button
                className="flex-1 md:w-full"
                type="submit"
              >
                <Search className="mr-2 size-4" /> Search
              </Button>

              {searchFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 md:w-full"
                >
                  <X className="mr-2 size-4" /> Clear
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
