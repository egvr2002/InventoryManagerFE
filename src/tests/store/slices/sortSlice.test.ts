import type {Order, Sort} from "@/interfaces/product/sort.interface";
import {
  addSortField,
  setSortFields,
  sortSlice,
} from "@/store/slices/inventory/sortSlice";
import {describe, it, expect} from "vitest";

const mockSortFields: Sort[] = [
  {field: "name", order: "asc" as Order},
  {field: "price", order: "desc" as Order},
];

describe("sortSlice", () => {
  it("should return the initial state", () => {
    const initialState = sortSlice.getInitialState();

    expect(initialState).toEqual({
      sortFields: [],
    });
  });

  it("should set sort fields", () => {
    const initialState = {
      sortFields: [],
    };

    const action = setSortFields(mockSortFields);
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toEqual(mockSortFields);
  });

  it("should add a new sort field", () => {
    const initialState = {
      sortFields: [],
    };

    const newSortField: Sort = {field: "category", order: "asc"};
    const action = addSortField(newSortField);
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toEqual([newSortField]);
  });

  it("should update existing sort field when field already exists with different order", () => {
    const initialState = {
      sortFields: [{field: "name", order: "asc" as Order}],
    };

    const updatedSortField: Sort = {field: "name", order: "desc" as Order};
    const action = addSortField(updatedSortField);
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toEqual([updatedSortField]);
    expect(newState.sortFields).toHaveLength(1);
  });

  it("should remove sort field when adding same field with same order", () => {
    const initialState = {
      sortFields: [{field: "name", order: "asc" as Order}],
    };

    const sameSortField: Sort = {field: "name", order: "asc" as Order};
    const action = addSortField(sameSortField);
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toEqual([]);
  });

  it("should limit sort fields to maximum of 2", () => {
    const initialState = {
      sortFields: [
        {field: "name", order: "asc" as Order},
        {field: "price", order: "desc" as Order},
      ],
    };

    const newSortField: Sort = {field: "category", order: "asc" as Order};
    const action = addSortField(newSortField);
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toHaveLength(2);
    expect(newState.sortFields[0]).toEqual({
      field: "price",
      order: "desc" as Order,
    });
    expect(newState.sortFields[1]).toEqual(newSortField);
  });

  it("should handle adding sort field when already at limit", () => {
    const initialState = {
      sortFields: [
        {field: "name", order: "asc" as Order},
        {field: "price", order: "desc" as Order},
      ],
    };

    const newSortField: Sort = {field: "stock", order: "asc" as Order};
    const action = addSortField(newSortField);
    const newState = sortSlice.reducer(initialState, action);

    // Should remove first and add new one
    expect(newState.sortFields).toEqual([
      {field: "price", order: "desc" as Order},
      {field: "stock", order: "asc" as Order},
    ]);
  });

  it("should handle multiple sort fields with different orders", () => {
    const initialState = {
      sortFields: [],
    };

    // Add first sort field
    let action = addSortField({field: "name", order: "asc" as Order});
    let newState = sortSlice.reducer(initialState, action);

    // Add second sort field
    action = addSortField({field: "price", order: "desc" as Order});
    newState = sortSlice.reducer(newState, action);

    expect(newState.sortFields).toEqual([
      {field: "name", order: "asc" as Order},
      {field: "price", order: "desc" as Order},
    ]);
  });

  it("should replace all sort fields when setting new ones", () => {
    const initialState = {
      sortFields: [{field: "oldField", order: "asc" as Order}],
    };

    const action = setSortFields(mockSortFields);
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toEqual(mockSortFields);
    expect(
      newState.sortFields.some((field) => field.field === "oldField"),
    ).toBe(false);
  });

  it("should handle clearing sort fields", () => {
    const initialState = {
      sortFields: mockSortFields,
    };

    const action = setSortFields([]);
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toEqual([]);
  });

  it("should handle updating middle field in existing sort fields", () => {
    const initialState = {
      sortFields: [
        {field: "name", order: "asc" as Order},
        {field: "price", order: "desc" as Order},
      ],
    };

    // Update the first field's order
    const action = addSortField({field: "name", order: "desc" as Order});
    const newState = sortSlice.reducer(initialState, action);

    expect(newState.sortFields).toEqual([
      {field: "name", order: "desc" as Order},
      {field: "price", order: "desc" as Order},
    ]);
  });
});
