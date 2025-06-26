import type {Product} from "@/interfaces/product/product.interface";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface ProductState {
  isLoadingProducts: boolean;
  products: Product[];
}

const initialState: ProductState = {
  isLoadingProducts: true,
  products: [],
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setIsLoadingProducts: (state) => {
      state.isLoadingProducts = true;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.isLoadingProducts = false;
    },
  },
});

export const {setProducts, setIsLoadingProducts} = productSlice.actions;
