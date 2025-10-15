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
import {toast} from "@/lib/toast";

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
      toast.error("Failed to load products", {
        description: "Please try again later",
      });
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
      toast.error("Failed to create product", {
        description: "Please try again later",
      });
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
      toast.error("Failed to update product", {
        description: "Please try again later",
      });
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
      toast.error("Failed to mark product as out of stock", {
        description: "Please try again later",
      });
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
      toast.error("Failed to mark product as in stock", {
        description: "Please try again later",
      });
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
      toast.error("Failed to delete product", {
        description: "Please try again later",
      });
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
      toast.error("Failed to load inventory metrics", {
        description: "Please try again later",
      });
      return;
    }

    dispatch(loadInventoryMetrics(data!.data!));
  };
}

export function loadCategoriesThunk() {
  return async function (dispatch: AppDispatch) {
    const [error, data] = await tryCatch(getCategories());

    if (error) {
      toast.error("Failed to load categories", {
        description: "Please try again later",
      });
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
      toast.error("Failed to search products", {
        description: "Please try again later",
      });
      return;
    }

    dispatch(setProducts(data!.data!.content));
    dispatch(setPaginationData(data!.data!.page));
  };
}
