import {describe, it, expect} from "vitest";
import {
  paginationSlice,
  setPaginationData,
  setCurrentPage,
} from "../../../store/slices/inventory/paginationSlice";
import type {Page} from "../../../interfaces/shared/page.interface";

const mockPaginationData: Page = {
  size: 10,
  number: 0,
  totalElements: 50,
  totalPages: 5,
};

describe("paginationSlice", () => {
  it("should return the initial state", () => {
    const initialState = paginationSlice.getInitialState();

    expect(initialState).toEqual({
      paginationData: null,
      currentPage: 0,
    });
  });

  it("should set pagination data", () => {
    const initialState = {
      paginationData: null,
      currentPage: 0,
    };

    const action = setPaginationData(mockPaginationData);
    const newState = paginationSlice.reducer(initialState, action);

    expect(newState.paginationData).toEqual(mockPaginationData);
    expect(newState.currentPage).toBe(0);
  });

  it("should set current page", () => {
    const initialState = {
      paginationData: mockPaginationData,
      currentPage: 0,
    };

    const action = setCurrentPage(2);
    const newState = paginationSlice.reducer(initialState, action);

    expect(newState.currentPage).toBe(2);
    expect(newState.paginationData).toEqual(mockPaginationData);
  });

  it("should update pagination data when new data is provided", () => {
    const initialState = {
      paginationData: mockPaginationData,
      currentPage: 1,
    };

    const newPaginationData: Page = {
      size: 20,
      number: 1,
      totalElements: 100,
      totalPages: 5,
    };

    const action = setPaginationData(newPaginationData);
    const newState = paginationSlice.reducer(initialState, action);

    expect(newState.paginationData).toEqual(newPaginationData);
    expect(newState.currentPage).toBe(1); // Should remain unchanged
  });

  it("should handle setting current page to 0", () => {
    const initialState = {
      paginationData: mockPaginationData,
      currentPage: 3,
    };

    const action = setCurrentPage(0);
    const newState = paginationSlice.reducer(initialState, action);

    expect(newState.currentPage).toBe(0);
  });

  it("should handle setting current page to negative number", () => {
    const initialState = {
      paginationData: mockPaginationData,
      currentPage: 2,
    };

    const action = setCurrentPage(-1);
    const newState = paginationSlice.reducer(initialState, action);

    expect(newState.currentPage).toBe(-1);
  });

  it("should handle edge case with large page numbers", () => {
    const initialState = {
      paginationData: mockPaginationData,
      currentPage: 0,
    };

    const action = setCurrentPage(999);
    const newState = paginationSlice.reducer(initialState, action);

    expect(newState.currentPage).toBe(999);
  });
});
