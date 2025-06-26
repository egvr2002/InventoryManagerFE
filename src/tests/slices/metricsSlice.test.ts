import {describe, it, expect} from "vitest";
import {
  metricsSlice,
  loadInventoryMetrics,
} from "../../store/slices/inventory/metricsSlice";
import type {InventoryMetrics} from "../../interfaces/product/inventoryMetrics.interface";

const mockInventoryMetrics: InventoryMetrics[] = [
  {
    category: "Electronics",
    totalProductsInStock: 25,
    totalValueInStock: 5000.5,
    averagePriceInStock: 200.02,
  },
  {
    category: "Books",
    totalProductsInStock: 100,
    totalValueInStock: 1500.0,
    averagePriceInStock: 15.0,
  },
  {
    category: "Clothing",
    totalProductsInStock: 50,
    totalValueInStock: 2000.0,
    averagePriceInStock: 40.0,
  },
];

describe("metricsSlice", () => {
  it("should return the initial state", () => {
    const initialState = metricsSlice.getInitialState();

    expect(initialState).toEqual({
      inventoryMetrics: [],
    });
  });

  it("should load inventory metrics", () => {
    const initialState = {
      inventoryMetrics: [],
    };

    const action = loadInventoryMetrics(mockInventoryMetrics);
    const newState = metricsSlice.reducer(initialState, action);

    expect(newState.inventoryMetrics).toEqual(mockInventoryMetrics);
  });

  it("should replace existing metrics when loading new ones", () => {
    const initialState = {
      inventoryMetrics: mockInventoryMetrics,
    };

    const newMetrics: InventoryMetrics[] = [
      {
        category: "Food",
        totalProductsInStock: 75,
        totalValueInStock: 800.0,
        averagePriceInStock: 10.67,
      },
    ];

    const action = loadInventoryMetrics(newMetrics);
    const newState = metricsSlice.reducer(initialState, action);

    expect(newState.inventoryMetrics).toEqual(newMetrics);
    expect(newState.inventoryMetrics).toHaveLength(1);
    expect(newState.inventoryMetrics[0].category).toBe("Food");
  });

  it("should handle loading empty metrics array", () => {
    const initialState = {
      inventoryMetrics: mockInventoryMetrics,
    };

    const action = loadInventoryMetrics([]);
    const newState = metricsSlice.reducer(initialState, action);

    expect(newState.inventoryMetrics).toEqual([]);
  });

  it("should handle metrics with zero values", () => {
    const initialState = {
      inventoryMetrics: [],
    };

    const metricsWithZeros: InventoryMetrics[] = [
      {
        category: "OutOfStock",
        totalProductsInStock: 0,
        totalValueInStock: 0,
        averagePriceInStock: 0,
      },
    ];

    const action = loadInventoryMetrics(metricsWithZeros);
    const newState = metricsSlice.reducer(initialState, action);

    expect(newState.inventoryMetrics).toEqual(metricsWithZeros);
    expect(newState.inventoryMetrics[0].totalProductsInStock).toBe(0);
    expect(newState.inventoryMetrics[0].totalValueInStock).toBe(0);
    expect(newState.inventoryMetrics[0].averagePriceInStock).toBe(0);
  });

  it("should handle metrics with decimal values", () => {
    const initialState = {
      inventoryMetrics: [],
    };

    const metricsWithDecimals: InventoryMetrics[] = [
      {
        category: "Luxury",
        totalProductsInStock: 3,
        totalValueInStock: 1999.99,
        averagePriceInStock: 666.66,
      },
    ];

    const action = loadInventoryMetrics(metricsWithDecimals);
    const newState = metricsSlice.reducer(initialState, action);

    expect(newState.inventoryMetrics).toEqual(metricsWithDecimals);
    expect(newState.inventoryMetrics[0].totalValueInStock).toBe(1999.99);
    expect(newState.inventoryMetrics[0].averagePriceInStock).toBe(666.66);
  });

  it("should handle large numbers in metrics", () => {
    const initialState = {
      inventoryMetrics: [],
    };

    const metricsWithLargeNumbers: InventoryMetrics[] = [
      {
        category: "Wholesale",
        totalProductsInStock: 10000,
        totalValueInStock: 1000000.0,
        averagePriceInStock: 100.0,
      },
    ];

    const action = loadInventoryMetrics(metricsWithLargeNumbers);
    const newState = metricsSlice.reducer(initialState, action);

    expect(newState.inventoryMetrics).toEqual(metricsWithLargeNumbers);
    expect(newState.inventoryMetrics[0].totalProductsInStock).toBe(10000);
    expect(newState.inventoryMetrics[0].totalValueInStock).toBe(1000000.0);
  });

  it("should maintain order of metrics when loaded", () => {
    const initialState = {
      inventoryMetrics: [],
    };

    const action = loadInventoryMetrics(mockInventoryMetrics);
    const newState = metricsSlice.reducer(initialState, action);

    expect(newState.inventoryMetrics[0].category).toBe("Electronics");
    expect(newState.inventoryMetrics[1].category).toBe("Books");
    expect(newState.inventoryMetrics[2].category).toBe("Clothing");
  });
});
