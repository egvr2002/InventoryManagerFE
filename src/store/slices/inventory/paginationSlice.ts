import type {Page} from "@/interfaces/shared/page.interface";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface PaginationState {
  paginationData: Page | null;
  currentPage: number;
}

const initialState: PaginationState = {
  paginationData: null,
  currentPage: 0,
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPaginationData: (state, {payload}: PayloadAction<Page>) => {
      state.paginationData = payload;
    },
    setCurrentPage: (state, {payload}: PayloadAction<number>) => {
      state.currentPage = payload;
    },
  },
});

export const {setPaginationData, setCurrentPage} = paginationSlice.actions;
