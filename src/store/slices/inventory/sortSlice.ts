import type {Sort} from "@/interfaces/product/sort.interface";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface SortState {
  sortFields: Sort[];
}

const initialState: SortState = {
  sortFields: [],
};

export const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortFields: (state, {payload}: PayloadAction<Sort[]>) => {
      state.sortFields = payload;
    },
    addSortField: (state, {payload}: PayloadAction<Sort>) => {
      const existingIndex = state.sortFields.findIndex(
        (sort) => sort.field === payload.field,
      );

      if (existingIndex !== -1) {
        const existingSort = state.sortFields[existingIndex];
        if (existingSort.order === payload.order) {
          state.sortFields.splice(existingIndex, 1);
        } else {
          state.sortFields[existingIndex].order = payload.order;
        }
      } else {
        if (state.sortFields.length >= 2) {
          state.sortFields.shift();
        }
        state.sortFields.push(payload);
      }
    },
  },
});

export const {setSortFields, addSortField} = sortSlice.actions;
