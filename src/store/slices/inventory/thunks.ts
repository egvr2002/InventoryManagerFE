import {inventoryApi} from "@/api/inventoryApi";

import type {
  PaginatedProducts,
  Product,
  ProductDTO,
} from "@/interfaces/product/product.interface";
import type {Category} from "@/interfaces/product/category.interface";
import type {ApiResponse} from "@/interfaces/shared/api-response.interface";
import type {AppDispatch, RootState} from "@/store/store";

import {setProducts} from "./productSlice";
import {loadCategories} from "./categorySlice";
import {loadInventoryMetrics} from "./metricsSlice";
import {setPaginationData} from "./paginationSlice";

import type {InventoryMetrics} from "@/interfaces/product/inventoryMetrics.interface";
import {generateSortParams} from "@/lib/utils";

export function loadProductsThunk() {
  return async function (dispatch: AppDispatch, getState: () => RootState) {
    const state = getState();
    const {currentPage} = state.pagination;
    const {sortFields} = state.sort;

    const sortParams = generateSortParams(sortFields);

    const {data} = await inventoryApi.get<ApiResponse<PaginatedProducts>>(
      `/products?page=${currentPage}&size=10${sortParams}`,
    );

    dispatch(setProducts(data.data!.content));
    dispatch(setPaginationData(data.data!.page));
  };
}

export function addProductThunk(product: ProductDTO) {
  return async function (dispatch: AppDispatch) {
    await inventoryApi.post<ApiResponse<Product>>("/products", product);
    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function updateProductThunk(productId: string, product: ProductDTO) {
  return async function (dispatch: AppDispatch) {
    await inventoryApi.put<ApiResponse<Product>>(
      `/products/${productId}`,
      product,
    );
    dispatch(loadProductsThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function markProductAsOutOfStockThunk(productId: string) {
  return async function (dispatch: AppDispatch) {
    await inventoryApi.post<ApiResponse<void>>(
      `/products/${productId}/outofstock`,
    );
    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function markProductAsInStockThunk(productId: string) {
  return async function (dispatch: AppDispatch) {
    await inventoryApi.post<ApiResponse<void>>(
      `/products/${productId}/instock`,
    );
    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function deleteProductThunk(productId: string) {
  return async function (dispatch: AppDispatch) {
    await inventoryApi.delete<ApiResponse<void>>(`/products/${productId}`);
    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function loadInventoryMetricsThunk() {
  return async function (dispatch: AppDispatch) {
    const {data} =
      await inventoryApi.get<ApiResponse<InventoryMetrics[]>>(
        "/products/metrics",
      );
    dispatch(loadInventoryMetrics(data.data!));
  };
}

export function loadCategoriesThunk() {
  return async function (dispatch: AppDispatch) {
    const {data} = await inventoryApi.get<ApiResponse<Category[]>>(
      "/products/categories",
    );
    dispatch(loadCategories(data.data!));
  };
}

export function searchProductsThunk() {
  return async function (dispatch: AppDispatch, getState: () => RootState) {
    const state = getState();
    const {searchFilters} = state.search;
    const {sortFields} = state.sort;
    const {currentPage} = state.pagination;

    const name = searchFilters?.name || "";
    const category = searchFilters?.category || "all";
    const availability = searchFilters?.availability || "all";

    const sortParams = generateSortParams(sortFields);

    const {data} = await inventoryApi.get<ApiResponse<PaginatedProducts>>(
      `/products/search?name=${name}&category=${category}&availability=${availability}&page=${currentPage}${sortParams}`,
    );
    dispatch(setProducts(data.data!.content));
    dispatch(setPaginationData(data.data!.page));
  };
}
