import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {productSlice} from "./slices/inventory/productSlice";
import {categorySlice} from "./slices/inventory/categorySlice";
import {paginationSlice} from "./slices/inventory/paginationSlice";
import {searchSlice} from "./slices/inventory/searchSlice";
import {sortSlice} from "./slices/inventory/sortSlice";
import {metricsSlice} from "./slices/inventory/metricsSlice";

const rootReducer = combineReducers({
  products: productSlice.reducer,
  categories: categorySlice.reducer,
  pagination: paginationSlice.reducer,
  search: searchSlice.reducer,
  sort: sortSlice.reducer,
  metrics: metricsSlice.reducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
