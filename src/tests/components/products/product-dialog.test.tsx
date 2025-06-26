import {describe, it, expect, vi, beforeEach} from "vitest";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {Product} from "@/interfaces/product/product.interface";
import {ProductDialog} from "@/components/products/product-dialog";
import {renderWithProviders} from "../../utils/test-utils";
import {
  addProductThunk,
  updateProductThunk,
} from "@/store/slices/inventory/thunks";

vi.mock("@/store/slices/inventory/thunks", () => ({
  addProductThunk: vi.fn(),
  updateProductThunk: vi.fn(),
  loadProductsThunk: vi.fn(),
  loadCategoriesThunk: vi.fn(),
  loadInventoryMetricsThunk: vi.fn(),
}));

const mockAddProductThunk = vi.mocked(addProductThunk);
const mockUpdateProductThunk = vi.mocked(updateProductThunk);

describe("ProductDialog", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();

    mockAddProductThunk.mockReturnValue(() => Promise.resolve());
    mockUpdateProductThunk.mockReturnValue(() => Promise.resolve());
  });

  describe("Add Product Dialog", () => {
    it("should render the add produc test dialog trigger button", () => {
      renderWithProviders(<ProductDialog action="add" />);

      const triggerButton = screen.getByRole("button", {name: /new product/i});
      expect(triggerButton).toBeInTheDocument();
    });

    it("should open dialog when trigger button is clicked", async () => {
      renderWithProviders(<ProductDialog action="add" />);

      const triggerButton = screen.getByRole("button", {name: /new product/i});
      await user.click(triggerButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("New Product")).toBeInTheDocument();
      expect(
        screen.getByText("Add a new product to your inventory"),
      ).toBeInTheDocument();
    });

    it("should render all form fields with correct labels", async () => {
      renderWithProviders(<ProductDialog action="add" />);

      const triggerButton = screen.getByRole("button", {name: /new product/i});
      await user.click(triggerButton);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/stock quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/unit price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expiration date/i)).toBeInTheDocument();
    });

    it("should have required attributes on form fields", async () => {
      renderWithProviders(<ProductDialog action="add" />);

      const triggerButton = screen.getByRole("button", {name: /new product/i});
      await user.click(triggerButton);

      expect(screen.getByLabelText(/name/i)).toBeRequired();
      expect(screen.getByLabelText(/category/i)).toBeRequired();
      expect(screen.getByLabelText(/stock quantity/i)).toBeRequired();
      expect(screen.getByLabelText(/unit price/i)).toBeRequired();
    });

    it("should submit form with correct data when all fields are filled", async () => {
      renderWithProviders(<ProductDialog action="add" />);

      const triggerButton = screen.getByRole("button", {name: /new product/i});
      await user.click(triggerButton);

      await user.type(screen.getByLabelText(/name/i), "Test Product");
      await user.type(screen.getByLabelText(/category/i), "Electronics");
      await user.type(screen.getByLabelText(/stock quantity/i), "10");
      await user.type(screen.getByLabelText(/unit price/i), "29.99");
      await user.type(screen.getByLabelText(/expiration date/i), "2024-12-31");

      const submitButton = screen.getByRole("button", {
        name: /create product/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddProductThunk).toHaveBeenCalledWith({
          name: "Test Product",
          category: "Electronics",
          quantityInStock: 10,
          unitPrice: 29.99,
          expirationDate: new Date("2024-12-31"),
        });
      });
    });

    it("should close dialog after successful form submission", async () => {
      renderWithProviders(<ProductDialog action="add" />);

      const triggerButton = screen.getByRole("button", {name: /new product/i});
      await user.click(triggerButton);

      await user.type(screen.getByLabelText(/name/i), "Test Product");
      await user.type(screen.getByLabelText(/category/i), "Electronics");
      await user.type(screen.getByLabelText(/stock quantity/i), "10");
      await user.type(screen.getByLabelText(/unit price/i), "29.99");

      const submitButton = screen.getByRole("button", {
        name: /create product/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should close dialog when cancel button is clicked", async () => {
      renderWithProviders(<ProductDialog action="add" />);

      const triggerButton = screen.getByRole("button", {name: /new product/i});
      await user.click(triggerButton);

      const cancelButton = screen.getByRole("button", {name: /cancel/i});
      await user.click(cancelButton);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Edit Product Dialog", () => {
    const mockProduct: Product = {
      id: "1",
      name: "Existing Product",
      category: "Electronics",
      quantityInStock: 5,
      unitPrice: 19.99,
      expirationDate: new Date("2024-06-30"),
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    };

    it("should render the edit product dialog trigger button", () => {
      renderWithProviders(
        <ProductDialog
          action="edit"
          product={mockProduct}
        />,
      );

      const triggerButton = screen.getByRole("button", {name: /edit/i});
      expect(triggerButton).toBeInTheDocument();
    });

    it("should open dialog with correct title and description for edit mode", async () => {
      renderWithProviders(
        <ProductDialog
          action="edit"
          product={mockProduct}
        />,
      );

      const triggerButton = screen.getByRole("button", {name: /edit/i});
      await user.click(triggerButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Edit Product")).toBeInTheDocument();
      expect(
        screen.getByText("Update the product information"),
      ).toBeInTheDocument();
    });

    it("should pre-populate form fields with existing product data", async () => {
      renderWithProviders(
        <ProductDialog
          action="edit"
          product={mockProduct}
        />,
      );

      const triggerButton = screen.getByRole("button", {name: /edit/i});
      await user.click(triggerButton);

      expect(screen.getByDisplayValue("Existing Product")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Electronics")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("19.99")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-06-30")).toBeInTheDocument();
    });

    it("should submit form with updated data when editing", async () => {
      renderWithProviders(
        <ProductDialog
          action="edit"
          product={mockProduct}
        />,
      );

      const triggerButton = screen.getByRole("button", {name: /edit/i});
      await user.click(triggerButton);

      // Update some fields
      const nameField = screen.getByLabelText(/name/i);
      await user.clear(nameField);
      await user.type(nameField, "Updated Product");

      const priceField = screen.getByLabelText(/unit price/i);
      await user.clear(priceField);
      await user.type(priceField, "25.99");

      const submitButton = screen.getByRole("button", {
        name: /update product/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateProductThunk).toHaveBeenCalledWith("1", {
          name: "Updated Product",
          category: "Electronics",
          quantityInStock: 5,
          unitPrice: 25.99,
          expirationDate: new Date("2024-06-30"),
        });
      });
    });

    it("should display correct button text for edit mode", async () => {
      renderWithProviders(
        <ProductDialog
          action="edit"
          product={mockProduct}
        />,
      );

      const triggerButton = screen.getByRole("button", {name: /edit/i});
      await user.click(triggerButton);

      expect(
        screen.getByRole("button", {name: /update product/i}),
      ).toBeInTheDocument();
    });
  });

  it("should prevent form submission when required fields are missing", async () => {
    renderWithProviders(<ProductDialog action="add" />);

    const triggerButton = screen.getByRole("button", {name: /new product/i});
    await user.click(triggerButton);

    const submitButton = screen.getByRole("button", {
      name: /create product/i,
    });
    await user.click(submitButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(mockAddProductThunk).not.toHaveBeenCalled();
  });
});
