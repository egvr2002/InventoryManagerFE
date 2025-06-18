import {Card, CardContent} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function ProductMetrics() {
  return (
    <Card>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Total products in Stock</TableHead>
                <TableHead>Total Value in Stock</TableHead>
                <TableHead>Average price in Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Food</TableCell>
                <TableCell>50</TableCell>
                <TableCell>$75</TableCell>
                <TableCell>$1.50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Clothing</TableCell>
                <TableCell>100</TableCell>
                <TableCell>$4,500</TableCell>
                <TableCell>$45.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Electornics</TableCell>
                <TableCell>0</TableCell>
                <TableCell>$0</TableCell>
                <TableCell>$0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Overall</TableCell>
                <TableCell>150</TableCell>
                <TableCell>$4,575.00</TableCell>
                <TableCell>$30.50</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
