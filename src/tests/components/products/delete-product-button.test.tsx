import {describe, it, expect, vi, beforeEach} from "vitest";
import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DeleteProductButton} from "@/components/products/delete-product-button";
import {renderWithProviders} from "../../utils/test-utils";
import {mockProduct} from "@/fixtures/inventory.fixtures";

describe("DeleteProductButton", () => {
  const user = userEvent.setup();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the delete button trigger", () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent("Delete");
    });

    it("should have correct styling classes for delete button", () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      expect(deleteButton).toHaveClass("text-red-500");
      expect(deleteButton).toHaveClass("hover:text-red-700");
    });

    it("should have proper aria-label with product name", () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      expect(deleteButton).toHaveAttribute(
        "aria-label",
        `Delete ${mockProduct.name}`,
      );
    });

    it("should not show dialog initially", () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Dialog Interaction", () => {
    it("should open dialog when delete button is clicked", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should display correct product name in dialog title", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      expect(
        screen.getByText(`Delete ${mockProduct.name}?`),
      ).toBeInTheDocument();
    });

    it("should display confirmation warning message", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      expect(
        screen.getByText("This action cannot be undone."),
      ).toBeInTheDocument();
    });

    it("should render cancel and delete buttons in dialog", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      expect(screen.getByRole("button", {name: /cancel/i})).toBeInTheDocument();
      expect(
        screen.getByRole("button", {name: /delete product/i}),
      ).toBeInTheDocument();
    });

    it("should close dialog when cancel button is clicked", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      const cancelButton = screen.getByRole("button", {name: /cancel/i});
      await user.click(cancelButton);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should close dialog after confirming deletion", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      const confirmButton = screen.getByRole("button", {
        name: /delete product/i,
      });
      await user.click(confirmButton);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Callback Behavior", () => {
    it("should call onConfirm with correct product ID when delete is confirmed", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      const confirmButton = screen.getByRole("button", {
        name: /delete product/i,
      });
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).toHaveBeenCalledWith(mockProduct.id);
    });

    it("should not call onConfirm when cancel is clicked", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      const cancelButton = screen.getByRole("button", {name: /cancel/i});
      await user.click(cancelButton);

      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("should not call onConfirm when dialog is opened and closed without confirming", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      // Press Escape to close dialog
      await user.keyboard("{Escape}");

      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should disable delete trigger button when isLoading is true", () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
          isLoading={true}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      expect(deleteButton).toBeDisabled();
    });

    it("should prevent dialog from opening when button is disabled due to loading", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
          isLoading={true}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });

      // Attempt to click disabled button should not open dialog
      await user.click(deleteButton);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should display 'Delete Product' text when isLoading is false", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
          isLoading={false}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      expect(screen.getByText("Delete Product")).toBeInTheDocument();
    });

    it("should not disable buttons when isLoading is false", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
          isLoading={false}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      expect(deleteButton).not.toBeDisabled();

      await user.click(deleteButton);

      const cancelButton = screen.getByRole("button", {name: /cancel/i});
      const confirmButton = screen.getByRole("button", {
        name: /delete product/i,
      });

      expect(cancelButton).not.toBeDisabled();
      expect(confirmButton).not.toBeDisabled();
    });

    it("should default isLoading to false when not provided", () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      expect(deleteButton).not.toBeDisabled();
    });
  });

  describe("Multiple Products", () => {
    it("should handle different product IDs correctly", async () => {
      const product1 = {...mockProduct, id: "product-1", name: "Product 1"};
      const product2 = {...mockProduct, id: "product-2", name: "Product 2"};

      const {unmount} = renderWithProviders(
        <DeleteProductButton
          product={product1}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton1 = screen.getByRole("button", {
        name: `Delete ${product1.name}`,
      });
      await user.click(deleteButton1);

      const confirmButton1 = screen.getByRole("button", {
        name: /delete product/i,
      });
      await user.click(confirmButton1);

      expect(mockOnConfirm).toHaveBeenCalledWith(product1.id);

      unmount();
      vi.clearAllMocks();

      renderWithProviders(
        <DeleteProductButton
          product={product2}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton2 = screen.getByRole("button", {
        name: `Delete ${product2.name}`,
      });
      await user.click(deleteButton2);

      const confirmButton2 = screen.getByRole("button", {
        name: /delete product/i,
      });
      await user.click(confirmButton2);

      expect(mockOnConfirm).toHaveBeenCalledWith(product2.id);
    });

    it("should display correct product names for different products", async () => {
      const customProduct = {
        ...mockProduct,
        id: "custom-123",
        name: "Custom Product Name",
      };

      renderWithProviders(
        <DeleteProductButton
          product={customProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${customProduct.name}`,
      });
      await user.click(deleteButton);

      expect(
        screen.getByText(`Delete ${customProduct.name}?`),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper dialog role", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });

    it("should have descriptive button text", () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      expect(deleteButton).toHaveAccessibleName(`Delete ${mockProduct.name}`);
    });

    it("should have proper dialog structure with title and description", async () => {
      renderWithProviders(
        <DeleteProductButton
          product={mockProduct}
          onConfirm={mockOnConfirm}
        />,
      );

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${mockProduct.name}`,
      });
      await user.click(deleteButton);

      // Dialog should have a title
      expect(
        screen.getByText(`Delete ${mockProduct.name}?`),
      ).toBeInTheDocument();

      // Dialog should have a description
      expect(
        screen.getByText("This action cannot be undone."),
      ).toBeInTheDocument();
    });
  });
});
