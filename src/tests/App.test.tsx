import {describe} from "node:test";
import {expect, it, vi} from "vitest";
import {renderWithProviders} from "./utils/test-utils";
import App from "@/App";
import {screen} from "@testing-library/dom";

// Mock axios
vi.mock("axios");

describe("App.tsx", () => {
  it("should match with the snapshot", () => {
    const wrapper = renderWithProviders(<App />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should contain the header component", () => {
    renderWithProviders(<App />);
    const headerElement = screen.getAllByRole("heading", {level: 1});
    expect(headerElement).toBeDefined();
  });

  it("should contain the search products form", () => {
    renderWithProviders(<App />);
    const tableElement = screen.getByTestId("search-products-form");
    expect(tableElement).toBeDefined();
  });

  it("should contain the products table", () => {
    renderWithProviders(<App />);
    const tableElement = screen.getByTestId("products-table");
    expect(tableElement).toBeDefined();
  });

  it("should contain the inventory metrics component", () => {
    renderWithProviders(<App />);
    const footerElement = screen.getByTestId("inventory-metrics");
    expect(footerElement).toBeDefined();
  });
});
