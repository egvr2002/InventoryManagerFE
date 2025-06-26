import type {InventoryMetrics} from "@/interfaces/product/inventoryMetrics.interface";
import {formatCurrency} from "@/lib/utils";
import {Card, CardContent} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface InventoryMetricsProps {
  inventoryMetrics: InventoryMetrics[];
}

export function InventoryMetrics({inventoryMetrics}: InventoryMetricsProps) {
  return (
    <Card data-testid="inventory-metrics">
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="text-center font-semibold">
                  Total Products
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Total Value
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Average Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryMetrics.map((metric) => (
                <TableRow key={metric.category}>
                  <TableCell className="font-medium">
                    {metric.category}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {metric.totalProductsInStock}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {formatCurrency(metric.totalValueInStock)}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {formatCurrency(metric.averagePriceInStock)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
