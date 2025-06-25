import {configureStore} from "@reduxjs/toolkit";
import {productSlice} from "./slices/inventory/productSlice";
import {categorySlice} from "./slices/inventory/categorySlice";
import {paginationSlice} from "./slices/inventory/paginationSlice";
import {searchSlice} from "./slices/inventory/searchSlice";
import {sortSlice} from "./slices/inventory/sortSlice";
import {metricsSlice} from "./slices/inventory/metricsSlice";

export const store = configureStore({
  reducer: {
    products: productSlice.reducer,
    categories: categorySlice.reducer,
    pagination: paginationSlice.reducer,
    search: searchSlice.reducer,
    sort: sortSlice.reducer,
    metrics: metricsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
