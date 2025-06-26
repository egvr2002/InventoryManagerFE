import {Button} from "../ui/button";
import {Card, CardContent, CardHeader} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {Checkbox} from "../ui/checkbox";
import {ProductDialog} from "./product-dialog";
import {SortableHeader} from "../shared/sortable-header";
import {
  formatCurrency,
  formatDate,
  cn,
  getDaysUntilExpiration,
} from "@/lib/utils";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {
  markProductAsInStockThunk,
  markProductAsOutOfStockThunk,
  deleteProductThunk,
  loadProductsThunk,
} from "@/store/slices/inventory/thunks";
import {addSortField} from "@/store/slices/inventory/sortSlice";
import type {Product} from "@/interfaces/product/product.interface";
import type {Order} from "@/interfaces/product/sort.interface";

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({products}: ProductsTableProps) {
  const dispatch = useAppDispatch();
  const {sortFields} = useAppSelector((state) => state.sort);
  const {isLoadingProducts} = useAppSelector((state) => state.products);

  const handleCheckboxChange = (product: Product) => {
    if (product.quantityInStock === 0) {
      dispatch(markProductAsInStockThunk(product.id));
    } else {
      dispatch(markProductAsOutOfStockThunk(product.id));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    dispatch(deleteProductThunk(productId));
  };

  const handleSort = (field: string, order: Order) => {
    dispatch(addSortField({field, order}));
    dispatch(loadProductsThunk());
  };

  return (
    <Card data-testid="products-table">
      <CardHeader>
        <ProductDialog action="add" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox disabled />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    field="category"
                    sortFields={sortFields}
                    onSort={handleSort}
                  >
                    Category
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    field="name"
                    sortFields={sortFields}
                    onSort={handleSort}
                  >
                    Name
                  </SortableHeader>
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    field="unitPrice"
                    sortFields={sortFields}
                    onSort={handleSort}
                    className="justify-end"
                  >
                    Price
                  </SortableHeader>
                </TableHead>
                <TableHead className="text-center">
                  <SortableHeader
                    field="expirationDate"
                    sortFields={sortFields}
                    onSort={handleSort}
                    className="justify-center"
                  >
                    Expiration Date
                  </SortableHeader>
                </TableHead>
                <TableHead className="text-center">
                  <SortableHeader
                    field="quantityInStock"
                    sortFields={sortFields}
                    onSort={handleSort}
                    className="justify-center"
                  >
                    Stock
                  </SortableHeader>
                </TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center"
                  >
                    <div className="text-muted-foreground flex flex-col items-center justify-center space-y-1 py-2">
                      {isLoadingProducts ? (
                        <div className="text-sm">Loading products...</div>
                      ) : (
                        <>
                          <div className="text-lg">No products found</div>
                          <div className="text-sm">
                            Get started by adding your first product to the
                            inventory.
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const isOutOfStock = product.quantityInStock === 0;
                  const daysUntilExpiration = getDaysUntilExpiration(
                    product.expirationDate,
                  );

                  return (
                    <TableRow
                      key={product.id}
                      className={cn(
                        isOutOfStock && "opacity-60",

                        // Expiration date background colors
                        daysUntilExpiration !== null &&
                          daysUntilExpiration < 7 &&
                          "bg-red-50 hover:bg-red-100",
                        daysUntilExpiration !== null &&
                          daysUntilExpiration >= 7 &&
                          daysUntilExpiration <= 14 &&
                          "bg-yellow-50 hover:bg-yellow-100",
                        daysUntilExpiration !== null &&
                          daysUntilExpiration > 14 &&
                          "bg-green-50 hover:bg-green-100",
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isOutOfStock}
                          onCheckedChange={() => handleCheckboxChange(product)}
                        />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-medium",
                          isOutOfStock && "line-through",
                        )}
                      >
                        {product.category}
                      </TableCell>
                      <TableCell className={cn(isOutOfStock && "line-through")}>
                        {product.name}
                      </TableCell>

                      <TableCell
                        className={cn(
                          "text-right text-sm tabular-nums",
                          isOutOfStock && "line-through",
                        )}
                      >
                        {formatCurrency(product.unitPrice)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-center text-sm",
                          isOutOfStock && "line-through",
                        )}
                      >
                        {product.expirationDate
                          ? formatDate(product.expirationDate)
                          : "N/A"}
                      </TableCell>

                      <TableCell
                        className={cn(
                          "text-center tabular-nums",
                          isOutOfStock &&
                            "font-semibold text-red-500 line-through",
                          !isOutOfStock &&
                            product.quantityInStock < 5 &&
                            "bg-red-100 font-semibold text-red-800",
                          !isOutOfStock &&
                            product.quantityInStock >= 5 &&
                            product.quantityInStock <= 10 &&
                            "bg-orange-100 font-semibold text-orange-800",
                        )}
                      >
                        {product.quantityInStock}
                      </TableCell>

                      <TableCell className="flex items-center gap-2">
                        <ProductDialog
                          action="edit"
                          product={product}
                        />
                        /
                        <Button
                          className="m-0 p-0 text-red-500"
                          variant="link"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
