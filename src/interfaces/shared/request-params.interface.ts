import type {SearchFilters} from "@/interfaces/product/search-filters.interface";

export interface PaginationRequest {
  page?: number;
  size?: number;
}

export interface SortRequest {
  sortParams?: string;
}

export type ProductListRequest = PaginationRequest & SortRequest;

export type ProductSearchRequest = ProductListRequest & SearchFilters;
