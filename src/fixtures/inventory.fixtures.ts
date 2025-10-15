import type {ApiResponse} from "@/interfaces/shared/api-response.interface";
import type {
  Product,
  ProductDTO,
  PaginatedProducts,
} from "@/interfaces/product/product.interface";
import type {Category} from "@/interfaces/product/category.interface";
import type {InventoryMetrics} from "@/interfaces/product/inventoryMetrics.interface";

export const mockApiResponse = <T>(data: T): ApiResponse<T> => ({
  status: "success",
  statusCode: 200,
  message: "Success",
  data,
  error: null,
});

export const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  category: "Electronics",
  unitPrice: 99.99,
  expirationDate: "2024-12-31T00:00:00.000Z",
  quantityInStock: 10,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

export const mockProductDTO: ProductDTO = {
  name: "Test Product",
  category: "Electronics",
  unitPrice: 99.99,
  expirationDate: "2024-12-31T00:00:00.000Z",
  quantityInStock: 10,
};

export const mockProducts: Product[] = [
  {
    ...mockProduct,
    id: "1",
    name: "Laptop",
    unitPrice: 999.99,
    quantityInStock: 5,
  },
  {
    ...mockProduct,
    id: "2",
    name: "Mouse",
    unitPrice: 29.99,
    quantityInStock: 15,
  },
  {
    ...mockProduct,
    id: "3",
    name: "Book",
    category: "Books",
    unitPrice: 19.99,
    quantityInStock: 20,
  },
];

export const mockPaginatedProducts: PaginatedProducts = {
  content: mockProducts,
  page: {
    size: 10,
    number: 1,
    totalElements: 50,
    totalPages: 5,
  },
};

export const mockCategories: Category[] = ["Electronics", "Books", "Clothing"];

export const mockInventoryMetrics: InventoryMetrics[] = [
  {
    category: "Electronics",
    totalProductsInStock: 20,
    totalValueInStock: 5029.95,
    averagePriceInStock: 251.5,
  },
  {
    category: "Books",
    totalProductsInStock: 20,
    totalValueInStock: 399.8,
    averagePriceInStock: 19.99,
  },
];
