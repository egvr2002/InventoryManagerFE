import {describe, it, expect} from "vitest";
import {
  productSlice,
  setProducts,
} from "../../../store/slices/inventory/productSlice";
import type {Product} from "../../../interfaces/product/product.interface";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Test Product 1",
    category: "Electronics",
    unitPrice: 99.99,
    expirationDate: new Date("2024-12-31"),
    quantityInStock: 10,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "2",
    name: "Test Product 2",
    category: "Books",
    unitPrice: 19.99,
    expirationDate: new Date("2025-06-30"),
    quantityInStock: 5,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  },
];

describe("productSlice", () => {
  it("should return the initial state", () => {
    const initialState = productSlice.getInitialState();

    expect(initialState).toEqual({
      isLoadingProducts: true,
      products: [],
    });
  });

  it("should set products and update loading state", () => {
    const initialState = {
      isLoadingProducts: true,
      products: [],
    };

    const action = setProducts(mockProducts);
    const newState = productSlice.reducer(initialState, action);

    expect(newState.products).toEqual(mockProducts);
    expect(newState.isLoadingProducts).toBe(false);
  });

  it("should handle setProducts with empty array", () => {
    const initialState = {
      isLoadingProducts: true,
      products: mockProducts,
    };

    const action = setProducts([]);
    const newState = productSlice.reducer(initialState, action);

    expect(newState.products).toEqual([]);
    expect(newState.isLoadingProducts).toBe(false);
  });

  it("should overwrite existing products when setting new ones", () => {
    const initialState = {
      isLoadingProducts: false,
      products: mockProducts,
    };

    const newProducts: Product[] = [
      {
        id: "3",
        name: "New Product",
        category: "Clothing",
        unitPrice: 29.99,
        expirationDate: new Date("2024-12-31"),
        quantityInStock: 15,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      },
    ];

    const action = setProducts(newProducts);
    const newState = productSlice.reducer(initialState, action);

    expect(newState.products).toEqual(newProducts);
    expect(newState.products).toHaveLength(1);
    expect(newState.isLoadingProducts).toBe(false);
  });
});
