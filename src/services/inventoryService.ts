import {inventoryApi} from "@/api/inventoryApi";

import type {
  PaginatedProducts,
  Product,
  ProductDTO,
} from "@/interfaces/product/product.interface";
import type {Category} from "@/interfaces/product/category.interface";
import type {ApiResponse} from "@/interfaces/shared/api-response.interface";
import type {InventoryMetrics} from "@/interfaces/product/inventoryMetrics.interface";
import type {
  ProductListRequest,
  ProductSearchRequest,
} from "@/interfaces/shared/request-params.interface";

export const getProducts = async (params: ProductListRequest) => {
  const {page = 1, size = 10, sortParams = ""} = params;

  const response = await inventoryApi.get<ApiResponse<PaginatedProducts>>(
    `/products?page=${page}&size=${size}${sortParams}`,
  );

  return response.data;
};

export const createProduct = async (product: ProductDTO) => {
  const response = await inventoryApi.post<ApiResponse<Product>>(
    "/products",
    product,
  );

  return response.data;
};

export const updateProduct = async (
  productId: Product["id"],
  product: ProductDTO,
) => {
  const response = await inventoryApi.put<ApiResponse<Product>>(
    `/products/${productId}`,
    product,
  );

  return response.data;
};

export const markProductAsOutOfStock = async (productId: Product["id"]) => {
  const response = await inventoryApi.post<ApiResponse<void>>(
    `/products/${productId}/outofstock`,
  );

  return response.data;
};

export const markProductAsInStock = async (productId: Product["id"]) => {
  const response = await inventoryApi.post<ApiResponse<void>>(
    `/products/${productId}/instock`,
  );

  return response.data;
};

export const deleteProduct = async (productId: Product["id"]) => {
  const response = await inventoryApi.delete<ApiResponse<void>>(
    `/products/${productId}`,
  );

  return response.data;
};

export const getInventoryMetrics = async () => {
  const response =
    await inventoryApi.get<ApiResponse<InventoryMetrics[]>>(
      "/products/metrics",
    );

  return response.data;
};

export const getCategories = async () => {
  const response = await inventoryApi.get<ApiResponse<Category[]>>(
    "/products/categories",
  );

  return response.data;
};

export const searchProducts = async (params: ProductSearchRequest) => {
  const {
    name = "",
    category = "all",
    availability = "all",
    page = 1,
    size = 10,
    sortParams = "",
  } = params;

  const searchParams = new URLSearchParams({
    name,
    category,
    availability,
    page: page.toString(),
    size: size.toString(),
  });

  const queryString = `${searchParams.toString()}${sortParams}`;

  const response = await inventoryApi.get<ApiResponse<PaginatedProducts>>(
    `/products/search?${queryString}`,
  );

  return response.data;
};
