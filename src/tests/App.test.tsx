import {describe} from "node:test";
import {expect, it, vi, beforeEach} from "vitest";
import {renderWithProviders} from "./utils/test-utils";
import App from "@/App";
import {screen, waitFor} from "@testing-library/dom";
import {
  mockApiResponse,
  mockPaginatedProducts,
  mockInventoryMetrics,
} from "@/fixtures/inventory.fixtures";

vi.mock("@/services/inventoryService", () => ({
  getProducts: vi.fn(() =>
    Promise.resolve(mockApiResponse(mockPaginatedProducts)),
  ),
  searchProducts: vi.fn(() =>
    Promise.resolve(mockApiResponse(mockPaginatedProducts)),
  ),
  getInventoryMetrics: vi.fn(() =>
    Promise.resolve(mockApiResponse(mockInventoryMetrics)),
  ),
  getCategories: vi.fn(() => Promise.resolve(mockApiResponse([]))),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  markProductAsOutOfStock: vi.fn(),
  markProductAsInStock: vi.fn(),
  deleteProduct: vi.fn(),
}));

describe("App.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should match with the snapshot", async () => {
    const wrapper = renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("products-table")).toBeInTheDocument();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should contain the header component", async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("products-table")).toBeInTheDocument();
    });
    const headerElement = screen.getAllByRole("heading", {level: 1});
    expect(headerElement).toBeDefined();
  });

  it("should contain the search products form", async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("search-products-form")).toBeInTheDocument();
    });
    const tableElement = screen.getByTestId("search-products-form");
    expect(tableElement).toBeDefined();
  });

  it("should contain the products table", async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("products-table")).toBeInTheDocument();
    });
    const tableElement = screen.getByTestId("products-table");
    expect(tableElement).toBeDefined();
  });

  it("should contain the inventory metrics component", async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("inventory-metrics")).toBeInTheDocument();
    });
    const footerElement = screen.getByTestId("inventory-metrics");
    expect(footerElement).toBeDefined();
  });
});
