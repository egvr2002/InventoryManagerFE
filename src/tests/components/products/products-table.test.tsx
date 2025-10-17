import {describe, it, expect, vi, beforeEach} from "vitest";
import {screen, within, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ProductsTable} from "@/components/products/products-table";
import {renderWithProviders} from "../../utils/test-utils";
import {
  mockProducts,
  mockProduct,
  mockApiResponse,
  mockPaginatedProducts,
} from "@/fixtures/inventory.fixtures";
import type {Product} from "@/interfaces/product/product.interface";
import * as inventoryService from "@/services/inventoryService";

vi.mock("@/services/inventoryService", () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  markProductAsInStock: vi.fn(),
  markProductAsOutOfStock: vi.fn(),
  getCategories: vi.fn(),
  getInventoryMetrics: vi.fn(),
  searchProducts: vi.fn(),
}));

describe("ProductsTable", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(inventoryService.getProducts).mockResolvedValue(
      mockApiResponse(mockPaginatedProducts),
    );
    vi.mocked(inventoryService.getCategories).mockResolvedValue(
      mockApiResponse([]),
    );
    vi.mocked(inventoryService.getInventoryMetrics).mockResolvedValue(
      mockApiResponse([]),
    );
    vi.mocked(inventoryService.deleteProduct).mockResolvedValue(
      mockApiResponse(null),
    );
    vi.mocked(inventoryService.markProductAsInStock).mockResolvedValue(
      mockApiResponse(null),
    );
    vi.mocked(inventoryService.markProductAsOutOfStock).mockResolvedValue(
      mockApiResponse(null),
    );
  });

  describe("Rendering", () => {
    it("should render the products table component", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const table = screen.getByTestId("products-table");
      expect(table).toBeInTheDocument();
    });

    it("should render table with proper structure", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should render add product button in header", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const addButton = screen.getByRole("button", {name: /new product/i});
      expect(addButton).toBeInTheDocument();
    });
  });

  describe("Table Headers", () => {
    it("should render all column headers", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Expiration Date")).toBeInTheDocument();
      expect(screen.getByText("Stock")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    it("should render checkbox in header", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const headers = screen.getAllByRole("columnheader");
      const checkboxHeader = headers[0];

      const checkbox = within(checkboxHeader).getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeDisabled();
    });

    it("should render sortable headers for category, name, price, expiration date, and stock", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const categoryButton = screen.getByRole("button", {name: /category/i});
      const nameButton = screen.getByRole("button", {name: /name/i});
      const priceButton = screen.getByRole("button", {name: /price/i});
      const expirationButton = screen.getByRole("button", {
        name: /expiration date/i,
      });
      const stockButton = screen.getByRole("button", {name: /stock/i});

      expect(categoryButton).toBeInTheDocument();
      expect(nameButton).toBeInTheDocument();
      expect(priceButton).toBeInTheDocument();
      expect(expirationButton).toBeInTheDocument();
      expect(stockButton).toBeInTheDocument();
    });
  });

  describe("Product Rows", () => {
    it("should render correct number of product rows", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(mockProducts.length + 1);
    });

    it("should display product category", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const uniqueCategories = [
        ...new Set(mockProducts.map((product) => product.category)),
      ];

      uniqueCategories.forEach((category) => {
        expect(screen.getAllByText(category).length).toBeGreaterThan(0);
      });
    });

    it("should display product name", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });

    it("should display formatted product price", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Test Product",
          unitPrice: 99.99,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });

    it("should display formatted expiration date", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Test Product",
          expirationDate: "2024-12-31",
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      expect(screen.getByText(/Dec.*31.*2024/i)).toBeInTheDocument();
    });

    it("should display N/A for missing expiration date", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Test Product",
          expirationDate: "",
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      expect(screen.getByText("N/A")).toBeInTheDocument();
    });

    it("should display stock quantity", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Test Product",
          quantityInStock: 42,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should render edit and delete buttons for each product", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Product 1",
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      expect(screen.getByRole("button", {name: /edit/i})).toBeInTheDocument();
      expect(
        screen.getByRole("button", {name: /delete product 1/i}),
      ).toBeInTheDocument();
    });

    it("should render checkbox for each product", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1);

      dataRows.forEach((row) => {
        const checkbox = within(row).getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeDisabled();
      });
    });
  });

  describe("Empty State", () => {
    it("should display no products message when products array is empty", () => {
      renderWithProviders(<ProductsTable products={[]} />, {
        preloadedState: {
          products: {
            products: [],
            isLoadingProducts: false,
          },
        },
      });

      expect(screen.getByText("No products found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Get started by adding your first product to the inventory.",
        ),
      ).toBeInTheDocument();
    });

    it("should span empty message across all columns", () => {
      renderWithProviders(<ProductsTable products={[]} />);

      const rows = screen.getAllByRole("row");
      const emptyRow = rows[1];
      const cell = within(emptyRow).getByRole("cell");

      expect(cell).toHaveAttribute("colspan", "7");
    });

    it("should not display product rows when empty", () => {
      renderWithProviders(<ProductsTable products={[]} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });
  });

  describe("Loading State", () => {
    it("should display loading message when products are loading", () => {
      renderWithProviders(<ProductsTable products={[]} />, {
        preloadedState: {
          products: {
            products: [],
            isLoadingProducts: true,
          },
        },
      });

      expect(screen.getByText("Loading products...")).toBeInTheDocument();
    });

    it("should not display empty state message when loading", () => {
      renderWithProviders(<ProductsTable products={[]} />, {
        preloadedState: {
          products: {
            products: [],
            isLoadingProducts: true,
          },
        },
      });

      expect(screen.queryByText("No products found")).not.toBeInTheDocument();
    });
  });

  describe("Out of Stock Functionality", () => {
    it("should check checkbox when product is out of stock", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Out of Stock Product",
          quantityInStock: 0,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];
      const checkbox = within(productRow).getByRole("checkbox");

      expect(checkbox).toBeChecked();
    });

    it("should not check checkbox when product is in stock", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "In Stock Product",
          quantityInStock: 10,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];
      const checkbox = within(productRow).getByRole("checkbox");

      expect(checkbox).not.toBeChecked();
    });

    it("should call markProductAsOutOfStock service when checking an in-stock product", async () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "test-123",
          name: "In Stock Product",
          quantityInStock: 10,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];
      const checkbox = within(productRow).getByRole("checkbox");

      await user.click(checkbox);

      await waitFor(() => {
        expect(inventoryService.markProductAsOutOfStock).toHaveBeenCalledWith(
          "test-123",
        );
      });
    });

    it("should call markProductAsInStock service when unchecking an out-of-stock product", async () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "test-456",
          name: "Out of Stock Product",
          quantityInStock: 0,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];
      const checkbox = within(productRow).getByRole("checkbox");

      await user.click(checkbox);

      await waitFor(() => {
        expect(inventoryService.markProductAsInStock).toHaveBeenCalledWith(
          "test-456",
        );
      });
    });

    it("should apply opacity styling to out of stock products", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Out of Stock Product",
          quantityInStock: 0,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];

      expect(productRow).toHaveClass("opacity-60");
    });

    it("should apply line-through to out of stock product cells", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Out of Stock",
          category: "Test Category",
          quantityInStock: 0,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const categoryCell = screen.getByText("Test Category");
      const nameCell = screen.getByText("Out of Stock");

      expect(categoryCell).toHaveClass("line-through");
      expect(nameCell).toHaveClass("line-through");
    });
  });

  describe("Stock Level Styling", () => {
    it("should apply red background to low stock products (< 5)", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Low Stock Product",
          quantityInStock: 3,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const stockCell = screen.getByText("3");
      expect(stockCell).toHaveClass("bg-red-100");
      expect(stockCell).toHaveClass("text-red-800");
    });

    it("should apply orange background to medium stock products (5-10)", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Medium Stock Product",
          quantityInStock: 7,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const stockCell = screen.getByText("7");
      expect(stockCell).toHaveClass("bg-orange-100");
      expect(stockCell).toHaveClass("text-orange-800");
    });

    it("should not apply special background to high stock products (> 10)", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "High Stock Product",
          quantityInStock: 15,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const stockCell = screen.getByText("15");
      expect(stockCell).not.toHaveClass("bg-red-100");
      expect(stockCell).not.toHaveClass("bg-orange-100");
    });

    it("should apply red styling to out of stock quantity", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Zero Stock Product",
          quantityInStock: 0,
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const stockCell = screen.getByText("0");
      expect(stockCell).toHaveClass("text-red-500");
      expect(stockCell).toHaveClass("line-through");
    });
  });

  describe("Expiration Date Styling", () => {
    it("should apply red background for products expiring in less than 7 days", () => {
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 5);

      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Expiring Soon",
          expirationDate: expirationDate.toISOString().split("T")[0],
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];

      expect(productRow).toHaveClass("bg-red-50");
      expect(productRow).toHaveClass("hover:bg-red-100");
    });

    it("should apply yellow background for products expiring in 7-14 days", () => {
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 10);

      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Expiring Medium Term",
          expirationDate: expirationDate.toISOString().split("T")[0],
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];

      expect(productRow).toHaveClass("bg-yellow-50");
      expect(productRow).toHaveClass("hover:bg-yellow-100");
    });

    it("should apply green background for products expiring in more than 14 days", () => {
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 20);

      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Fresh Product",
          expirationDate: expirationDate.toISOString().split("T")[0],
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];

      expect(productRow).toHaveClass("bg-green-50");
      expect(productRow).toHaveClass("hover:bg-green-100");
    });
  });

  describe("Sort Functionality", () => {
    it("should call getProducts service when clicking category header", async () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const categoryButton = screen.getByRole("button", {name: /category/i});
      await user.click(categoryButton);

      await waitFor(() => {
        expect(inventoryService.getProducts).toHaveBeenCalled();
      });
    });

    it("should call getProducts service when clicking name header", async () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const nameButton = screen.getByRole("button", {name: /name/i});
      await user.click(nameButton);

      await waitFor(() => {
        expect(inventoryService.getProducts).toHaveBeenCalled();
      });
    });

    it("should call getProducts service when clicking price header", async () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const priceButton = screen.getByRole("button", {name: /price/i});
      await user.click(priceButton);

      await waitFor(() => {
        expect(inventoryService.getProducts).toHaveBeenCalled();
      });
    });

    it("should call getProducts service when clicking expiration date header", async () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const expirationButton = screen.getByRole("button", {
        name: /expiration date/i,
      });
      await user.click(expirationButton);

      await waitFor(() => {
        expect(inventoryService.getProducts).toHaveBeenCalled();
      });
    });

    it("should call getProducts service when clicking stock header", async () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const stockButton = screen.getByRole("button", {name: /stock/i});
      await user.click(stockButton);

      await waitFor(() => {
        expect(inventoryService.getProducts).toHaveBeenCalled();
      });
    });

    it("should update sort fields in store when clicking headers", async () => {
      const {store} = renderWithProviders(
        <ProductsTable products={mockProducts} />,
      );

      const categoryButton = screen.getByRole("button", {name: /category/i});
      await user.click(categoryButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.sort.sortFields).toContainEqual({
          field: "category",
          order: "asc",
        });
      });
    });
  });

  describe("Delete Functionality", () => {
    it("should call deleteProduct service when delete is confirmed", async () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "delete-test-123",
          name: "Product To Delete",
        },
      ];

      renderWithProviders(<ProductsTable products={products} />, {
        preloadedState: {
          products: {
            products: [],
            isLoadingProducts: false,
          },
        },
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete product to delete/i,
      });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole("button", {
        name: /^delete product$/i,
      });
      await user.click(confirmButton);

      await waitFor(
        () => {
          expect(inventoryService.deleteProduct).toHaveBeenCalledWith(
            "delete-test-123",
          );
        },
        {timeout: 3000},
      );
    });

    it("should pass loading state to delete button", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Test Product",
        },
      ];

      renderWithProviders(<ProductsTable products={products} />, {
        preloadedState: {
          products: {
            products: [],
            isLoadingProducts: true,
          },
        },
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete test product/i,
      });
      expect(deleteButton).toBeDisabled();
    });
  });

  describe("Edit Functionality", () => {
    it("should render edit button for each product row", () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Editable Product",
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];
      const buttons = within(productRow).getAllByRole("button");
      const editButton = buttons.find((btn) => btn.textContent === "Edit");

      expect(editButton).toBeInTheDocument();
    });

    it("should open edit dialog when edit button is clicked", async () => {
      const products: Product[] = [
        {
          ...mockProduct,
          id: "1",
          name: "Edit Me",
        },
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const rows = screen.getAllByRole("row");
      const productRow = rows[1];
      const buttons = within(productRow).getAllByRole("button");
      const editButton = buttons.find((btn) => btn.textContent === "Edit");

      if (editButton) {
        await user.click(editButton);
      }

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Edit Product")).toBeInTheDocument();
    });
  });

  describe("Multiple Products", () => {
    it("should render multiple products correctly", () => {
      const products: Product[] = [
        {...mockProduct, id: "1", name: "Product 1"},
        {...mockProduct, id: "2", name: "Product 2"},
        {...mockProduct, id: "3", name: "Product 3"},
      ];

      renderWithProviders(<ProductsTable products={products} />);

      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
      expect(screen.getByText("Product 3")).toBeInTheDocument();
    });

    it("should render different stock levels with appropriate styling", () => {
      const products: Product[] = [
        {...mockProduct, id: "1", name: "Low", quantityInStock: 2},
        {...mockProduct, id: "2", name: "Medium", quantityInStock: 8},
        {...mockProduct, id: "3", name: "High", quantityInStock: 20},
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const lowStock = screen.getByText("2");
      const mediumStock = screen.getByText("8");
      const highStock = screen.getByText("20");

      expect(lowStock).toHaveClass("bg-red-100");
      expect(mediumStock).toHaveClass("bg-orange-100");
      expect(highStock).not.toHaveClass("bg-red-100");
      expect(highStock).not.toHaveClass("bg-orange-100");
    });
  });

  describe("Accessibility", () => {
    it("should have proper table role", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should have accessible column headers", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBeGreaterThan(0);
    });

    it("should have testid for component identification", () => {
      renderWithProviders(<ProductsTable products={mockProducts} />);

      const component = screen.getByTestId("products-table");
      expect(component).toBeInTheDocument();
    });

    it("should have accessible checkboxes with proper state", () => {
      const products: Product[] = [
        {...mockProduct, id: "1", name: "In Stock", quantityInStock: 10},
        {...mockProduct, id: "2", name: "Out of Stock", quantityInStock: 0},
      ];

      renderWithProviders(<ProductsTable products={products} />);

      const checkboxes = screen.getAllByRole("checkbox");
      const dataCheckboxes = checkboxes.slice(1);

      expect(dataCheckboxes[0]).not.toBeChecked();
      expect(dataCheckboxes[1]).toBeChecked();
    });
  });
});
