import {describe, it, expect} from "vitest";
import {
  categorySlice,
  loadCategories,
} from "../../../store/slices/inventory/categorySlice";
import type {Category} from "../../../interfaces/product/category.interface";

const mockCategories: Category[] = ["Electronics", "Books", "Clothing", "Food"];

describe("categorySlice", () => {
  it("should return the initial state", () => {
    const initialState = categorySlice.getInitialState();

    expect(initialState).toEqual({
      categories: [],
    });
  });

  it("should load categories", () => {
    const initialState = {
      categories: [],
    };

    const action = loadCategories(mockCategories);
    const newState = categorySlice.reducer(initialState, action);

    expect(newState.categories).toEqual(mockCategories);
  });

  it("should replace existing categories when loading new ones", () => {
    const initialState = {
      categories: ["OldCategory1", "OldCategory2"],
    };

    const action = loadCategories(mockCategories);
    const newState = categorySlice.reducer(initialState, action);

    expect(newState.categories).toEqual(mockCategories);
    expect(newState.categories).not.toContain("OldCategory1");
    expect(newState.categories).not.toContain("OldCategory2");
  });

  it("should handle loading empty categories array", () => {
    const initialState = {
      categories: mockCategories,
    };

    const action = loadCategories([]);
    const newState = categorySlice.reducer(initialState, action);

    expect(newState.categories).toEqual([]);
  });

  it("should handle loading single category", () => {
    const initialState = {
      categories: [],
    };

    const singleCategory: Category[] = ["Electronics"];
    const action = loadCategories(singleCategory);
    const newState = categorySlice.reducer(initialState, action);

    expect(newState.categories).toEqual(singleCategory);
    expect(newState.categories).toHaveLength(1);
  });
});
