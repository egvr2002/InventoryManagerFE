import type {Category} from "./category.interface";

export interface InventoryMetrics {
  category: Category;
  totalProductsInStock: number;
  totalValueInStock: number;
  averagePriceInStock: number;
}
