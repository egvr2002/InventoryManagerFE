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
import {Pagination} from "../shared/pagination";
import {ProductDialog} from "./product-dialog";

export function ProductsTable() {
  return (
    <Card>
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
                <TableHead>Category</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>Food</TableCell>
                <TableCell>Watermelon</TableCell>
                <TableCell>$1.50</TableCell>
                <TableCell>12/25/2024</TableCell>
                <TableCell>80</TableCell>
                <TableCell className="flex items-center gap-2">
                  <ProductDialog action="edit" />/
                  <Button
                    className="m-0 p-0 text-red-500"
                    variant="link"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Pagination totalPages={10} />
      </CardContent>
    </Card>
  );
}
