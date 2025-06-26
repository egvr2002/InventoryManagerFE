import type {SearchFilters} from "@/interfaces/product/search-filters.interface";
import {
  searchSlice,
  setSearchFilters,
  clearSearchFilters,
} from "@/store/slices/inventory/searchSlice";
import {describe, it, expect} from "vitest";

const mockSearchFilters: SearchFilters = {
  name: "laptop",
  category: "Electronics",
  availability: "in_stock",
};

describe("searchSlice", () => {
  it("should return the initial state", () => {
    const initialState = searchSlice.getInitialState();

    expect(initialState).toEqual({
      searchFilters: null,
    });
  });

  it("should set search filters", () => {
    const initialState = {
      searchFilters: null,
    };

    const action = setSearchFilters(mockSearchFilters);
    const newState = searchSlice.reducer(initialState, action);

    expect(newState.searchFilters).toEqual(mockSearchFilters);
  });

  it("should clear search filters", () => {
    const initialState = {
      searchFilters: mockSearchFilters,
    };

    const action = clearSearchFilters();
    const newState = searchSlice.reducer(initialState, action);

    expect(newState.searchFilters).toBeNull();
  });

  it("should replace existing search filters when setting new ones", () => {
    const initialState = {
      searchFilters: mockSearchFilters,
    };

    const newSearchFilters: SearchFilters = {
      name: "phone",
      category: "Electronics",
      availability: "out_of_stock",
    };

    const action = setSearchFilters(newSearchFilters);
    const newState = searchSlice.reducer(initialState, action);

    expect(newState.searchFilters).toEqual(newSearchFilters);
    expect(newState.searchFilters?.name).toBe("phone");
    expect(newState.searchFilters?.availability).toBe("out_of_stock");
  });

  it("should handle partial search filters", () => {
    const initialState = {
      searchFilters: null,
    };

    const partialSearchFilters: SearchFilters = {
      name: "book",
    };

    const action = setSearchFilters(partialSearchFilters);
    const newState = searchSlice.reducer(initialState, action);

    expect(newState.searchFilters).toEqual(partialSearchFilters);
    expect(newState.searchFilters?.name).toBe("book");
    expect(newState.searchFilters?.category).toBeUndefined();
    expect(newState.searchFilters?.availability).toBeUndefined();
  });

  it("should handle empty string values in search filters", () => {
    const initialState = {
      searchFilters: null,
    };

    const emptySearchFilters: SearchFilters = {
      name: "",
      category: "",
      availability: "all",
    };

    const action = setSearchFilters(emptySearchFilters);
    const newState = searchSlice.reducer(initialState, action);

    expect(newState.searchFilters).toEqual(emptySearchFilters);
    expect(newState.searchFilters?.name).toBe("");
    expect(newState.searchFilters?.category).toBe("");
    expect(newState.searchFilters?.availability).toBe("all");
  });

  it("should handle all availability types", () => {
    const initialState = {
      searchFilters: null,
    };

    // Test "in_stock"
    let action = setSearchFilters({availability: "in_stock"});
    let newState = searchSlice.reducer(initialState, action);
    expect(newState.searchFilters?.availability).toBe("in_stock");

    // Test "out_of_stock"
    action = setSearchFilters({availability: "out_of_stock"});
    newState = searchSlice.reducer(initialState, action);
    expect(newState.searchFilters?.availability).toBe("out_of_stock");

    // Test "all"
    action = setSearchFilters({availability: "all"});
    newState = searchSlice.reducer(initialState, action);
    expect(newState.searchFilters?.availability).toBe("all");
  });
});
