import type {Paginated} from "../shared/paginated.interface";

export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Date;
  quantityInStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PaginatedProducts = Paginated<Product>;

export type ProductDTO = Omit<Product, "id" | "createdAt" | "updatedAt">;
