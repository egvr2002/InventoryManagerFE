import type {Category} from "@/interfaces/product/category.interface";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    loadCategories: (state, {payload}: PayloadAction<Category[]>) => {
      state.categories = payload;
    },
  },
});

export const {loadCategories} = categorySlice.actions;
