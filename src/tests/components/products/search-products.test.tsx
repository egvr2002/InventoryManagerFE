import {describe, it, expect, vi, beforeEach} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SearchProducts} from "@/components/products/search-products";
import {renderWithProviders} from "../../utils/test-utils";
import {
  mockApiResponse,
  mockCategories,
  mockPaginatedProducts,
} from "@/fixtures/inventory.fixtures";
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

describe("SearchProducts", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(inventoryService.getCategories).mockResolvedValue(
      mockApiResponse(mockCategories),
    );
    vi.mocked(inventoryService.searchProducts).mockResolvedValue(
      mockApiResponse(mockPaginatedProducts),
    );
    vi.mocked(inventoryService.getProducts).mockResolvedValue(
      mockApiResponse(mockPaginatedProducts),
    );
    vi.mocked(inventoryService.getInventoryMetrics).mockResolvedValue(
      mockApiResponse([]),
    );
  });

  describe("Rendering", () => {
    it("should render the search products form", () => {
      renderWithProviders(<SearchProducts />);

      const form = screen.getByTestId("search-products-form");
      expect(form).toBeInTheDocument();
    });

    it("should render all form labels", () => {
      renderWithProviders(<SearchProducts />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/availability/i)).toBeInTheDocument();
    });

    it("should render name input field", () => {
      renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("type", "text");
      expect(nameInput).toHaveAttribute("name", "name");
      expect(nameInput).toHaveAttribute("placeholder", "Enter product name");
    });

    it("should render category select field", () => {
      renderWithProviders(<SearchProducts />);

      const categorySelect = screen.getByLabelText(/category/i);
      expect(categorySelect).toBeInTheDocument();
    });

    it("should render availability select field", () => {
      renderWithProviders(<SearchProducts />);

      const availabilitySelect = screen.getByLabelText(/availability/i);
      expect(availabilitySelect).toBeInTheDocument();
    });

    it("should render search button", () => {
      renderWithProviders(<SearchProducts />);

      const searchButton = screen.getByRole("button", {name: /search/i});
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toHaveAttribute("type", "submit");
    });

    it("should render the component within a card", () => {
      const {container} = renderWithProviders(<SearchProducts />);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe("Categories Loading", () => {
    it("should call getCategories service on mount", async () => {
      renderWithProviders(<SearchProducts />);

      await waitFor(() => {
        expect(inventoryService.getCategories).toHaveBeenCalled();
      });
    });

    it("should display categories in the select dropdown", async () => {
      renderWithProviders(<SearchProducts />);

      await waitFor(() => {
        expect(inventoryService.getCategories).toHaveBeenCalled();
      });

      const categorySelect = screen.getByLabelText(/category/i);
      await user.click(categorySelect);

      await waitFor(() => {
        mockCategories.forEach((category) => {
          expect(screen.getByText(category)).toBeInTheDocument();
        });
      });
    });

    it("should display 'All Categories' option in category select", async () => {
      renderWithProviders(<SearchProducts />);

      const categorySelect = screen.getByLabelText(/category/i);
      await user.click(categorySelect);

      await waitFor(() => {
        expect(screen.getByText("All Categories")).toBeInTheDocument();
      });
    });
  });

  describe("Availability Options", () => {
    it("should display all availability options", async () => {
      renderWithProviders(<SearchProducts />);

      const availabilitySelect = screen.getByLabelText(/availability/i);
      await user.click(availabilitySelect);

      await waitFor(() => {
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("In Stock")).toBeInTheDocument();
        expect(screen.getByText("Out of Stock")).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should submit form with name only", async () => {
      renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Test Product");

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });

    it("should submit form with all fields filled", async () => {
      renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Laptop");

      const categorySelect = screen.getByLabelText(/category/i);
      await user.click(categorySelect);
      await waitFor(() => {
        const electronicsOption = screen.getByText("Electronics");
        user.click(electronicsOption);
      });

      const availabilitySelect = screen.getByLabelText(/availability/i);
      await user.click(availabilitySelect);
      await waitFor(() => {
        const inStockOption = screen.getByText("In Stock");
        user.click(inStockOption);
      });

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });

    it("should update store with search filters on submit", async () => {
      const {store} = renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Test Product");

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.search.searchFilters).toEqual({
          name: "Test Product",
          category: "all",
          availability: "all",
        });
      });
    });

    it("should call searchProductsThunk after form submission", async () => {
      renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Product");

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });

    it("should submit form with empty name field", async () => {
      renderWithProviders(<SearchProducts />);

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });
  });

  describe("Clear Functionality", () => {
    it("should not display clear button when no search filters exist", () => {
      renderWithProviders(<SearchProducts />);

      const clearButton = screen.queryByRole("button", {name: /clear/i});
      expect(clearButton).not.toBeInTheDocument();
    });

    it("should display clear button when search filters exist", () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              name: "Test",
              category: "Electronics",
              availability: "in_stock",
            },
          },
        },
      });

      const clearButton = screen.getByRole("button", {name: /clear/i});
      expect(clearButton).toBeInTheDocument();
    });

    it("should clear search filters when clear button is clicked", async () => {
      const {store} = renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              name: "Test",
              category: "Electronics",
              availability: "in_stock",
            },
          },
        },
      });

      const clearButton = screen.getByRole("button", {name: /clear/i});
      await user.click(clearButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.search.searchFilters).toBeNull();
      });
    });

    it("should call searchProductsThunk after clearing filters", async () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              name: "Test",
              category: "Electronics",
              availability: "in_stock",
            },
          },
        },
      });

      const clearButton = screen.getByRole("button", {name: /clear/i});
      await user.click(clearButton);

      await waitFor(() => {
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });

    it("should have correct button styling for clear button", () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              name: "Test",
            },
          },
        },
      });

      const clearButton = screen.getByRole("button", {name: /clear/i});
      expect(clearButton).toHaveAttribute("type", "button");
    });
  });

  describe("Default Values", () => {
    it("should populate name field with existing search filter", () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              name: "Existing Product",
            },
          },
        },
      });

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      expect(nameInput.value).toBe("Existing Product");
    });

    it("should populate category field with existing search filter", async () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              category: "Books",
            },
          },
        },
      });

      const categorySelect = screen.getByLabelText(/category/i);
      expect(categorySelect).toBeInTheDocument();

      // Open the select to verify the correct value
      await user.click(categorySelect);

      await waitFor(() => {
        // The Books option should be visible when opened (there may be multiple instances)
        const booksElements = screen.getAllByText("Books");
        expect(booksElements.length).toBeGreaterThan(0);
      });
    });

    it("should populate availability field with existing search filter", () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              availability: "in_stock",
            },
          },
        },
      });

      const availabilitySelect = screen.getByLabelText(/availability/i);
      expect(availabilitySelect).toHaveTextContent("In Stock");
    });

    it("should populate all fields with existing search filters", () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              name: "Laptop",
              category: "Electronics",
              availability: "out_of_stock",
            },
          },
        },
      });

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const categorySelect = screen.getByLabelText(/category/i);
      const availabilitySelect = screen.getByLabelText(/availability/i);

      expect(nameInput.value).toBe("Laptop");
      expect(categorySelect).toBeInTheDocument();
      expect(availabilitySelect).toBeInTheDocument();
      expect(availabilitySelect.textContent).toContain("Out of Stock");
    });
  });

  describe("Form Behavior", () => {
    it("should prevent default form submission", async () => {
      renderWithProviders(<SearchProducts />);

      const form = screen.getByTestId("search-products-form");
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(submitEvent, "preventDefault");

      form.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should handle category selection", async () => {
      renderWithProviders(<SearchProducts />);

      const categorySelect = screen.getByLabelText(/category/i);
      await user.click(categorySelect);

      await waitFor(() => {
        const booksOption = screen.getByText("Books");
        expect(booksOption).toBeInTheDocument();
      });
    });

    it("should handle availability selection", async () => {
      renderWithProviders(<SearchProducts />);

      const availabilitySelect = screen.getByLabelText(/availability/i);
      await user.click(availabilitySelect);

      await waitFor(() => {
        const inStockOption = screen.getByText("In Stock");
        expect(inStockOption).toBeInTheDocument();
      });
    });
  });

  describe("Button Icons", () => {
    it("should render search icon in search button", () => {
      renderWithProviders(<SearchProducts />);

      const searchButton = screen.getByRole("button", {name: /search/i});
      const svg = searchButton.querySelector("svg");

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("lucide-search");
    });

    it("should render X icon in clear button when visible", () => {
      renderWithProviders(<SearchProducts />, {
        preloadedState: {
          search: {
            searchFilters: {
              name: "Test",
            },
          },
        },
      });

      const clearButton = screen.getByRole("button", {name: /clear/i});
      const svg = clearButton.querySelector("svg");

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("lucide-x");
    });
  });

  describe("Form Layout", () => {
    it("should have proper form structure", () => {
      renderWithProviders(<SearchProducts />);

      const form = screen.getByTestId("search-products-form");
      expect(form.tagName).toBe("FORM");
    });

    it("should contain all required form elements", () => {
      renderWithProviders(<SearchProducts />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/availability/i)).toBeInTheDocument();
      expect(screen.getByRole("button", {name: /search/i})).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty categories array", async () => {
      vi.mocked(inventoryService.getCategories).mockResolvedValue(
        mockApiResponse([]),
      );

      renderWithProviders(<SearchProducts />);

      await waitFor(() => {
        expect(inventoryService.getCategories).toHaveBeenCalled();
      });

      const categorySelect = screen.getByLabelText(/category/i);
      await user.click(categorySelect);

      await waitFor(() => {
        expect(screen.getByText("All Categories")).toBeInTheDocument();
      });
    });

    it("should handle form submission with special characters in name", async () => {
      renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Product & Test <>");

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });

    it("should handle rapid form submissions", async () => {
      renderWithProviders(<SearchProducts />);

      const searchButton = screen.getByRole("button", {name: /search/i});

      await user.click(searchButton);
      await user.click(searchButton);
      await user.click(searchButton);

      await waitFor(() => {
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible labels for all form fields", () => {
      renderWithProviders(<SearchProducts />);

      const nameLabel = screen.getByText("Name");
      const categoryLabel = screen.getByText("Category");
      const availabilityLabel = screen.getByText("Availability");

      expect(nameLabel).toBeInTheDocument();
      expect(categoryLabel).toBeInTheDocument();
      expect(availabilityLabel).toBeInTheDocument();
    });

    it("should have proper form testid for testing", () => {
      renderWithProviders(<SearchProducts />);

      const form = screen.getByTestId("search-products-form");
      expect(form).toBeInTheDocument();
    });

    it("should have accessible button text", () => {
      renderWithProviders(<SearchProducts />);

      const searchButton = screen.getByRole("button", {name: /search/i});
      expect(searchButton).toHaveAccessibleName();
    });

    it("should have proper input attributes", () => {
      renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute("id", "name");
      expect(nameInput).toHaveAttribute("name", "name");
    });

    it("should have proper select attributes", () => {
      renderWithProviders(<SearchProducts />);

      const categoryTrigger = screen.getByLabelText(/category/i);
      const availabilityTrigger = screen.getByLabelText(/availability/i);

      expect(categoryTrigger).toHaveAttribute("id", "category");
      expect(availabilityTrigger).toHaveAttribute("id", "availability");
    });
  });

  describe("Integration", () => {
    it("should work with complete search flow", async () => {
      const {store} = renderWithProviders(<SearchProducts />);

      await waitFor(() => {
        expect(inventoryService.getCategories).toHaveBeenCalled();
      });

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Gaming");

      const categorySelect = screen.getByLabelText(/category/i);
      await user.click(categorySelect);

      await waitFor(() => {
        const electronicsOption = screen.getByText("Electronics");
        user.click(electronicsOption);
      });

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.search.searchFilters?.name).toBe("Gaming");
        expect(inventoryService.searchProducts).toHaveBeenCalled();
      });
    });

    it("should work with search and clear flow", async () => {
      const {store} = renderWithProviders(<SearchProducts />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "Test");

      const searchButton = screen.getByRole("button", {name: /search/i});
      await user.click(searchButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.search.searchFilters?.name).toBe("Test");
      });

      const clearButton = await screen.findByRole("button", {name: /clear/i});
      await user.click(clearButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.search.searchFilters).toBeNull();
      });
    });
  });
});
