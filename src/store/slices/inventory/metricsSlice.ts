import type {InventoryMetrics} from "@/interfaces/product/inventoryMetrics.interface";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface MetricsState {
  inventoryMetrics: InventoryMetrics[];
}

const initialState: MetricsState = {
  inventoryMetrics: [],
};

export const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    loadInventoryMetrics: (
      state,
      {payload}: PayloadAction<InventoryMetrics[]>,
    ) => {
      state.inventoryMetrics = payload;
    },
  },
});

export const {loadInventoryMetrics} = metricsSlice.actions;
