import type {SearchFilters} from "@/interfaces/product/search-filters.interface";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface SearchState {
  searchFilters: SearchFilters | null;
}

const initialState: SearchState = {
  searchFilters: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchFilters: (state, {payload}: PayloadAction<SearchFilters>) => {
      state.searchFilters = payload;
    },

    clearSearchFilters: (state) => {
      state.searchFilters = null;
    },
  },
});

export const {setSearchFilters, clearSearchFilters} = searchSlice.actions;
