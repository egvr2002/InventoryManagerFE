import type {ProductDTO} from "@/interfaces/product/product.interface";
import type {AppDispatch, RootState} from "@/store/store";

import {setProducts} from "./productSlice";
import {loadCategories} from "./categorySlice";
import {loadInventoryMetrics} from "./metricsSlice";
import {setPaginationData} from "./paginationSlice";

import {
  getProducts,
  createProduct,
  updateProduct,
  markProductAsOutOfStock,
  markProductAsInStock,
  deleteProduct,
  getInventoryMetrics,
  getCategories,
  searchProducts,
} from "@/services/inventoryService";

import {generateSortParams} from "@/lib/utils";
import {tryCatch} from "@/lib/tryCatch";

export function loadProductsThunk() {
  return async function (dispatch: AppDispatch, getState: () => RootState) {
    const state = getState();
    const {currentPage} = state.pagination;
    const {sortFields} = state.sort;

    const sortParams = generateSortParams(sortFields);

    const [error, data] = await tryCatch(
      getProducts({
        page: currentPage,
        size: 10,
        sortParams,
      }),
    );

    if (error) {
      console.error("Failed to load products:", error);
      return;
    }

    dispatch(setProducts(data!.data!.content));
    dispatch(setPaginationData(data!.data!.page));
  };
}

export function addProductThunk(product: ProductDTO) {
  return async function (dispatch: AppDispatch) {
    const [error] = await tryCatch(createProduct(product));

    if (error) {
      console.error("Failed to create product:", error);
      return;
    }

    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function updateProductThunk(productId: string, product: ProductDTO) {
  return async function (dispatch: AppDispatch) {
    const [error] = await tryCatch(updateProduct(productId, product));

    if (error) {
      console.error("Failed to update product:", error);
      return;
    }

    dispatch(loadProductsThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function markProductAsOutOfStockThunk(productId: string) {
  return async function (dispatch: AppDispatch) {
    const [error] = await tryCatch(markProductAsOutOfStock(productId));

    if (error) {
      console.error("Failed to mark product as out of stock:", error);
      return;
    }

    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function markProductAsInStockThunk(productId: string) {
  return async function (dispatch: AppDispatch) {
    const [error] = await tryCatch(markProductAsInStock(productId));

    if (error) {
      console.error("Failed to mark product as in stock:", error);
      return;
    }

    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function deleteProductThunk(productId: string) {
  return async function (dispatch: AppDispatch) {
    const [error] = await tryCatch(deleteProduct(productId));

    if (error) {
      console.error("Failed to delete product:", error);
      return;
    }

    dispatch(loadProductsThunk());
    dispatch(loadCategoriesThunk());
    dispatch(loadInventoryMetricsThunk());
  };
}

export function loadInventoryMetricsThunk() {
  return async function (dispatch: AppDispatch) {
    const [error, data] = await tryCatch(getInventoryMetrics());

    if (error) {
      console.error("Failed to load inventory metrics:", error);
      return;
    }

    dispatch(loadInventoryMetrics(data!.data!));
  };
}

export function loadCategoriesThunk() {
  return async function (dispatch: AppDispatch) {
    const [error, data] = await tryCatch(getCategories());

    if (error) {
      console.error("Failed to load categories:", error);
      return;
    }

    dispatch(loadCategories(data!.data!));
  };
}

export function searchProductsThunk() {
  return async function (dispatch: AppDispatch, getState: () => RootState) {
    const state = getState();
    const {searchFilters} = state.search;
    const {sortFields} = state.sort;
    const {currentPage} = state.pagination;

    const sortParams = generateSortParams(sortFields);

    const [error, data] = await tryCatch(
      searchProducts({
        ...searchFilters,
        page: currentPage,
        size: 10,
        sortParams,
      }),
    );

    if (error) {
      console.error("Failed to search products:", error);
      return;
    }

    dispatch(setProducts(data!.data!.content));
    dispatch(setPaginationData(data!.data!.page));
  };
}
