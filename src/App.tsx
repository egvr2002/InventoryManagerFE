import {useEffect} from "react";

import {useAppDispatch, useAppSelector} from "./store/hooks";
import {
  loadInventoryMetricsThunk,
  loadProductsThunk,
  searchProductsThunk,
} from "./store/slices/inventory/thunks";
import {setCurrentPage} from "./store/slices/inventory/paginationSlice";

import {SearchProducts} from "./components/products/search-products";
import {ProductsTable} from "./components/products/products-table";
import {InventoryMetrics} from "./components/products/product-metrics";
import {Header} from "./components/shared/header";
import {Pagination} from "./components/shared/pagination";

export default function App() {
  const {products} = useAppSelector((state) => state.products);
  const {inventoryMetrics} = useAppSelector((state) => state.metrics);
  const {paginationData, currentPage} = useAppSelector(
    (state) => state.pagination,
  );
  const {searchFilters} = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (searchFilters) {
      dispatch(searchProductsThunk());
    } else {
      dispatch(loadProductsThunk());
    }
  }, [dispatch, searchFilters, currentPage]);

  useEffect(() => {
    dispatch(loadInventoryMetricsThunk());
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  return (
    <div className="mx-auto min-h-dvh max-w-full justify-center space-y-6 p-4 lg:max-w-4/6">
      <Header />
      <SearchProducts />
      <ProductsTable products={products} />
      {paginationData && (
        <Pagination
          totalPages={paginationData.totalPages}
          currentPage={currentPage + 1}
          onPageChange={handlePageChange}
        />
      )}
      <InventoryMetrics inventoryMetrics={inventoryMetrics} />
    </div>
  );
}
