import {apiUrl} from "@/config/env.config";
import type {Category} from "@/interfaces/product/category.interface";
import type {InventoryMetrics} from "@/interfaces/product/inventoryMetrics.interface";
import type {
  PaginatedProducts,
  Product,
  ProductDTO,
} from "@/interfaces/product/product.interface";
import type {Sort} from "@/interfaces/product/sort.interface";
import type {ApiResponse} from "@/interfaces/shared/api-response.interface";
import {generateSortParams} from "@/lib/utils";

export async function getProducts(
  page: number = 0,
  size: number = 0,
  sort: Sort[] = [],
) {
  const sortParams = generateSortParams(sort);
  const response = await fetch(
    `${apiUrl}/products?page=${page}&size=${size}${sortParams}`,
  );
  const data: ApiResponse<PaginatedProducts> = await response.json();
  return data;
}

export async function searchProducts(
  page: number = 0,
  size: number = 0,
  sort: Sort[] = [],
) {
  const sortParams = generateSortParams(sort);
  const response = await fetch(
    `${apiUrl}/products/search?page=${page}&size=${size}${sortParams}`,
  );
  const data: ApiResponse<PaginatedProducts> = await response.json();
  return data;
}

export async function createProduct(newProduct: ProductDTO) {
  const response = await fetch(`${apiUrl}/products`, {
    method: "POST",
    body: JSON.stringify(newProduct),
  });

  const json: ApiResponse<Product> = await response.json();
  return json.data;
}

export async function updateProduct(
  productId: string,
  productPayload: ProductDTO,
) {
  const response = await fetch(`${apiUrl}/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(productPayload),
  });
  const data: ApiResponse<Product> = await response.json();
  return data;
}

export async function markProductAsOutOfStock(productId: string) {
  const response = await fetch(`${apiUrl}/products/${productId}/outofstock`, {
    method: "POST",
  });
  const data: ApiResponse<void> = await response.json();
  return data;
}

export async function markProductAsInStock(productId: string) {
  const response = await fetch(`${apiUrl}/products/${productId}/instock`, {
    method: "POST",
  });
  const data: ApiResponse<void> = await response.json();
  return data;
}

export async function deleteProduct(productId: string) {
  const response = await fetch(`${apiUrl}/products/${productId}`, {
    method: "DELETE",
  });
  const data: ApiResponse<void> = await response.json();
  return data;
}

export async function getCategories() {
  const response = await fetch(`${apiUrl}/products/categories`);
  const data: ApiResponse<Category[]> = await response.json();
  return data;
}

export async function getInventoryMetrics() {
  const response = await fetch(`${apiUrl}/products/metrics`);
  const data: ApiResponse<InventoryMetrics[]> = await response.json();
  return data;
}
