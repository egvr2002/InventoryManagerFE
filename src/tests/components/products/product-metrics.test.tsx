import {describe, it, expect} from "vitest";
import {render, screen, within} from "@testing-library/react";
import {InventoryMetrics} from "@/components/products/product-metrics";
import {mockInventoryMetrics} from "@/fixtures/inventory.fixtures";
import type {InventoryMetrics as InventoryMetricsType} from "@/interfaces/product/inventoryMetrics.interface";

describe("InventoryMetrics", () => {
  describe("Rendering", () => {
    it("should render the inventory metrics component", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const metricsComponent = screen.getByTestId("inventory-metrics");
      expect(metricsComponent).toBeInTheDocument();
    });

    it("should render a table element", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should render with empty metrics array", () => {
      render(<InventoryMetrics inventoryMetrics={[]} />);

      const metricsComponent = screen.getByTestId("inventory-metrics");
      expect(metricsComponent).toBeInTheDocument();

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Table Headers", () => {
    it("should render all column headers correctly", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Total Products")).toBeInTheDocument();
      expect(screen.getByText("Total Value")).toBeInTheDocument();
      expect(screen.getByText("Average Price")).toBeInTheDocument();
    });

    it("should have correct number of column headers", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(4);
    });

    it("should have headers with font-semibold styling", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const categoryHeader = screen.getByText("Category");
      const totalProductsHeader = screen.getByText("Total Products");
      const totalValueHeader = screen.getByText("Total Value");
      const averagePriceHeader = screen.getByText("Average Price");

      expect(categoryHeader).toHaveClass("font-semibold");
      expect(totalProductsHeader).toHaveClass("font-semibold");
      expect(totalValueHeader).toHaveClass("font-semibold");
      expect(averagePriceHeader).toHaveClass("font-semibold");
    });
  });

  describe("Data Display", () => {
    it("should render correct number of data rows", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(mockInventoryMetrics.length + 1);
    });

    it("should display all category names", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      mockInventoryMetrics.forEach((metric) => {
        expect(screen.getByText(metric.category)).toBeInTheDocument();
      });
    });

    it("should display total products for each category", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const uniqueTotalProducts = [
        ...new Set(
          mockInventoryMetrics.map((metric) =>
            metric.totalProductsInStock.toString(),
          ),
        ),
      ];

      uniqueTotalProducts.forEach((total) => {
        expect(screen.getAllByText(total).length).toBeGreaterThan(0);
      });
    });

    it("should display formatted total value for each category", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      expect(screen.getByText("$5,029.95")).toBeInTheDocument();

      expect(screen.getByText("$399.80")).toBeInTheDocument();
    });

    it("should display formatted average price for each category", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      expect(screen.getByText("$251.50")).toBeInTheDocument();

      expect(screen.getByText("$19.99")).toBeInTheDocument();
    });

    it("should render each metric in its own row", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1);

      dataRows.forEach((row, index) => {
        const cells = within(row).getAllByRole("cell");
        const metric = mockInventoryMetrics[index];

        expect(cells[0]).toHaveTextContent(metric.category);
        expect(cells[1]).toHaveTextContent(
          metric.totalProductsInStock.toString(),
        );
      });
    });
  });

  describe("Currency Formatting", () => {
    it("should format currency values with dollar sign and decimals", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "Test",
          totalProductsInStock: 10,
          totalValueInStock: 1234.56,
          averagePriceInStock: 123.45,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      expect(screen.getByText("$1,234.56")).toBeInTheDocument();
      expect(screen.getByText("$123.45")).toBeInTheDocument();
    });

    it("should format whole number values with .00 decimals", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "Whole Numbers",
          totalProductsInStock: 5,
          totalValueInStock: 100,
          averagePriceInStock: 20,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      expect(screen.getByText("$100.00")).toBeInTheDocument();
      expect(screen.getByText("$20.00")).toBeInTheDocument();
    });

    it("should format large numbers with comma separators", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "Large Values",
          totalProductsInStock: 1000,
          totalValueInStock: 123456.78,
          averagePriceInStock: 9876.54,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      expect(screen.getByText("$123,456.78")).toBeInTheDocument();
      expect(screen.getByText("$9,876.54")).toBeInTheDocument();
    });

    it("should handle zero values correctly", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "Zero Values",
          totalProductsInStock: 0,
          totalValueInStock: 0,
          averagePriceInStock: 0,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      const zeroValues = screen.getAllByText("$0.00");
      expect(zeroValues.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Multiple Categories", () => {
    it("should handle single category", () => {
      const singleMetric: InventoryMetricsType[] = [
        {
          category: "Electronics",
          totalProductsInStock: 20,
          totalValueInStock: 5029.95,
          averagePriceInStock: 251.5,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={singleMetric} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
      expect(screen.getByText("Electronics")).toBeInTheDocument();
    });

    it("should handle multiple categories with different data", () => {
      const multipleMetrics: InventoryMetricsType[] = [
        {
          category: "Electronics",
          totalProductsInStock: 20,
          totalValueInStock: 5029.95,
          averagePriceInStock: 251.5,
        },
        {
          category: "Books",
          totalProductsInStock: 20,
          totalValueInStock: 399.8,
          averagePriceInStock: 19.99,
        },
        {
          category: "Clothing",
          totalProductsInStock: 30,
          totalValueInStock: 1500.0,
          averagePriceInStock: 50.0,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={multipleMetrics} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(4);

      expect(screen.getByText("Electronics")).toBeInTheDocument();
      expect(screen.getByText("Books")).toBeInTheDocument();
      expect(screen.getByText("Clothing")).toBeInTheDocument();
    });

    it("should maintain correct order of categories", () => {
      const orderedMetrics: InventoryMetricsType[] = [
        {
          category: "First",
          totalProductsInStock: 1,
          totalValueInStock: 100,
          averagePriceInStock: 10,
        },
        {
          category: "Second",
          totalProductsInStock: 2,
          totalValueInStock: 200,
          averagePriceInStock: 20,
        },
        {
          category: "Third",
          totalProductsInStock: 3,
          totalValueInStock: 300,
          averagePriceInStock: 30,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={orderedMetrics} />);

      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1);

      const firstRowCategory = within(dataRows[0]).getByText("First");
      const secondRowCategory = within(dataRows[1]).getByText("Second");
      const thirdRowCategory = within(dataRows[2]).getByText("Third");

      expect(firstRowCategory).toBeInTheDocument();
      expect(secondRowCategory).toBeInTheDocument();
      expect(thirdRowCategory).toBeInTheDocument();
    });
  });

  describe("Table Structure and Styling", () => {
    it("should have proper table structure with tbody and thead", () => {
      const {container} = render(
        <InventoryMetrics inventoryMetrics={mockInventoryMetrics} />,
      );

      const thead = container.querySelector("thead");
      const tbody = container.querySelector("tbody");

      expect(thead).toBeInTheDocument();
      expect(tbody).toBeInTheDocument();
    });

    it("should apply tabular-nums class to numeric cells for proper alignment", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const rows = screen.getAllByRole("row");
      const firstDataRow = rows[1];
      const cells = within(firstDataRow).getAllByRole("cell");

      expect(cells[1]).toHaveClass("tabular-nums");
      expect(cells[2]).toHaveClass("tabular-nums");
      expect(cells[3]).toHaveClass("tabular-nums");
    });

    it("should apply text-center to total products column", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const totalProductsHeader = screen.getByText("Total Products");
      expect(totalProductsHeader).toHaveClass("text-center");
    });

    it("should apply text-right to currency columns", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const totalValueHeader = screen.getByText("Total Value");
      const averagePriceHeader = screen.getByText("Average Price");

      expect(totalValueHeader).toHaveClass("text-right");
      expect(averagePriceHeader).toHaveClass("text-right");
    });

    it("should apply font-medium to category cells", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const rows = screen.getAllByRole("row");
      const firstDataRow = rows[1];
      const categoryCell = within(firstDataRow).getAllByRole("cell")[0];

      expect(categoryCell).toHaveClass("font-medium");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large numbers", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "Large Numbers",
          totalProductsInStock: 999999,
          totalValueInStock: 9999999.99,
          averagePriceInStock: 99999.99,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      expect(screen.getByText("999999")).toBeInTheDocument();
      expect(screen.getByText("$9,999,999.99")).toBeInTheDocument();
      expect(screen.getByText("$99,999.99")).toBeInTheDocument();
    });

    it("should handle decimal precision correctly", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "Precision Test",
          totalProductsInStock: 1,
          totalValueInStock: 10.99,
          averagePriceInStock: 5.55,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      expect(screen.getByText("$10.99")).toBeInTheDocument();
      expect(screen.getByText("$5.55")).toBeInTheDocument();
    });

    it("should render correctly with category names containing special characters", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "Electronics & Gadgets",
          totalProductsInStock: 10,
          totalValueInStock: 1000,
          averagePriceInStock: 100,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      expect(screen.getByText("Electronics & Gadgets")).toBeInTheDocument();
    });

    it("should handle empty category name", () => {
      const metrics: InventoryMetricsType[] = [
        {
          category: "",
          totalProductsInStock: 5,
          totalValueInStock: 500,
          averagePriceInStock: 100,
        },
      ];

      render(<InventoryMetrics inventoryMetrics={metrics} />);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
    });
  });

  describe("Accessibility", () => {
    it("should have proper table role", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("should have accessible column headers", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(4);

      headers.forEach((header) => {
        expect(header.textContent).toBeTruthy();
      });
    });

    it("should have proper row and cell structure for screen readers", () => {
      render(<InventoryMetrics inventoryMetrics={mockInventoryMetrics} />);

      const rows = screen.getAllByRole("row");
      rows.forEach((row) => {
        const cells = within(row).queryAllByRole("cell");
        const headers = within(row).queryAllByRole("columnheader");

        expect(cells.length + headers.length).toBeGreaterThan(0);
      });
    });
  });
});
