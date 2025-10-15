import {describe, it, expect, beforeEach, afterEach} from "vitest";
import MockAdapter from "axios-mock-adapter";
import {inventoryApi} from "@/api/inventoryApi";
import * as inventoryService from "@/services/inventoryService";
import {
  mockApiResponse,
  mockProduct,
  mockProductDTO,
  mockProducts,
  mockPaginatedProducts,
  mockCategories,
  mockInventoryMetrics,
} from "@/fixtures/inventory.fixtures";

describe("InventoryService", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(inventoryApi);
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getProducts", () => {
    it("should fetch products with default parameters", async () => {
      mock
        .onGet("/products?page=1&size=10")
        .reply(200, mockApiResponse(mockPaginatedProducts));

      const result = await inventoryService.getProducts({
        page: 1,
        size: 10,
        sortParams: "",
      });

      expect(result.data?.content).toHaveLength(3);
      expect(result.data?.content[0].name).toBe("Laptop");
      expect(result.data?.page.size).toBe(10);
    });

    it("should fetch products with pagination parameters", async () => {
      mock
        .onGet("/products?page=2&size=20")
        .reply(200, mockApiResponse(mockPaginatedProducts));

      const result = await inventoryService.getProducts({
        page: 2,
        size: 20,
        sortParams: "",
      });

      expect(result.data?.content).toHaveLength(3);
      expect(result.status).toBe("success");
    });

    it("should fetch products with sort parameters", async () => {
      mock
        .onGet("/products?page=1&size=10&sort=name,asc")
        .reply(200, mockApiResponse(mockPaginatedProducts));

      const result = await inventoryService.getProducts({
        page: 1,
        size: 10,
        sortParams: "&sort=name,asc",
      });

      expect(result.data?.content).toHaveLength(3);
      expect(result.status).toBe("success");
    });

    it("should handle API errors", async () => {
      mock.onGet("/products?page=1&size=10").reply(500, {
        status: "error",
        message: "Internal Server Error",
      });

      await expect(
        inventoryService.getProducts({page: 1, size: 10, sortParams: ""}),
      ).rejects.toThrow();
    });

    it("should handle network errors", async () => {
      mock.onGet("/products?page=1&size=10").networkError();

      await expect(
        inventoryService.getProducts({page: 1, size: 10, sortParams: ""}),
      ).rejects.toThrow();
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const newProduct = {
        ...mockProductDTO,
        name: "New Laptop",
        unitPrice: 1299.99,
      };
      const createdProduct = {...mockProduct, id: "4", ...newProduct};

      mock.onPost("/products").reply(201, mockApiResponse(createdProduct));

      const result = await inventoryService.createProduct(newProduct);

      expect(result.data?.name).toBe("New Laptop");
      expect(result.data?.id).toBe("4");
      expect(result.status).toBe("success");
    });

    it("should handle validation errors", async () => {
      mock.onPost("/products").reply(400, {
        status: "error",
        message: "Validation failed",
      });

      await expect(
        inventoryService.createProduct(mockProductDTO),
      ).rejects.toThrow();
    });
  });

  describe("updateProduct", () => {
    it("should update an existing product", async () => {
      const productId = "1";
      const updatedData = {
        ...mockProductDTO,
        name: "Updated Laptop",
        unitPrice: 899.99,
      };
      const updatedProduct = {...mockProduct, id: productId, ...updatedData};

      mock
        .onPut(`/products/${productId}`)
        .reply(200, mockApiResponse(updatedProduct));

      const result = await inventoryService.updateProduct(
        productId,
        updatedData,
      );

      expect(result.data?.name).toBe("Updated Laptop");
      expect(result.data?.unitPrice).toBe(899.99);
      expect(result.status).toBe("success");
    });

    it("should handle product not found error", async () => {
      mock.onPut("/products/999").reply(404, {
        status: "error",
        message: "Product not found",
      });

      await expect(
        inventoryService.updateProduct("999", mockProductDTO),
      ).rejects.toThrow();
    });
  });

  describe("markProductAsOutOfStock", () => {
    it("should mark a product as out of stock", async () => {
      mock
        .onPost("/products/1/outofstock")
        .reply(200, mockApiResponse(undefined));

      const result = await inventoryService.markProductAsOutOfStock("1");

      expect(result.status).toBe("success");
    });

    it("should handle errors when marking product as out of stock", async () => {
      mock.onPost("/products/999/outofstock").reply(404, {
        status: "error",
        message: "Product not found",
      });

      await expect(
        inventoryService.markProductAsOutOfStock("999"),
      ).rejects.toThrow();
    });
  });

  describe("markProductAsInStock", () => {
    it("should mark a product as in stock", async () => {
      mock.onPost("/products/1/instock").reply(200, mockApiResponse(undefined));

      const result = await inventoryService.markProductAsInStock("1");

      expect(result.status).toBe("success");
    });

    it("should handle errors when marking product as in stock", async () => {
      mock.onPost("/products/999/instock").reply(404, {
        status: "error",
        message: "Product not found",
      });

      await expect(
        inventoryService.markProductAsInStock("999"),
      ).rejects.toThrow();
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      mock.onDelete("/products/1").reply(200, mockApiResponse(undefined));

      const result = await inventoryService.deleteProduct("1");

      expect(result.status).toBe("success");
    });

    it("should handle product not found on delete", async () => {
      mock.onDelete("/products/999").reply(404, {
        status: "error",
        message: "Product not found",
      });

      await expect(inventoryService.deleteProduct("999")).rejects.toThrow();
    });
  });

  describe("getInventoryMetrics", () => {
    it("should fetch inventory metrics", async () => {
      mock
        .onGet("/products/metrics")
        .reply(200, mockApiResponse(mockInventoryMetrics));

      const result = await inventoryService.getInventoryMetrics();

      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].category).toBe("Electronics");
      expect(result.data?.[1].category).toBe("Books");
    });

    it("should handle errors when fetching metrics", async () => {
      mock.onGet("/products/metrics").reply(500, {
        status: "error",
        message: "Failed to calculate metrics",
      });

      await expect(inventoryService.getInventoryMetrics()).rejects.toThrow();
    });

    it("should handle empty metrics response", async () => {
      mock.onGet("/products/metrics").reply(200, mockApiResponse([]));

      const result = await inventoryService.getInventoryMetrics();

      expect(result.data).toEqual([]);
    });
  });

  describe("getCategories", () => {
    it("should fetch all categories", async () => {
      mock
        .onGet("/products/categories")
        .reply(200, mockApiResponse(mockCategories));

      const result = await inventoryService.getCategories();

      expect(result.data).toHaveLength(3);
      expect(result.data).toContain("Electronics");
      expect(result.data).toContain("Books");
    });

    it("should handle errors when fetching categories", async () => {
      mock.onGet("/products/categories").reply(500, {
        status: "error",
        message: "Failed to fetch categories",
      });

      await expect(inventoryService.getCategories()).rejects.toThrow();
    });

    it("should handle empty categories response", async () => {
      mock.onGet("/products/categories").reply(200, mockApiResponse([]));

      const result = await inventoryService.getCategories();

      expect(result.data).toEqual([]);
    });
  });

  describe("searchProducts", () => {
    it("should search products with all filters", async () => {
      mock.onGet(/\/products\/search\?.*/).reply((config) => {
        const url = new URL(`http://localhost${config.url}`);
        expect(url.searchParams.get("name")).toBe("laptop");
        expect(url.searchParams.get("category")).toBe("Electronics");
        expect(url.searchParams.get("availability")).toBe("in_stock");
        return [200, mockApiResponse(mockPaginatedProducts)];
      });

      const result = await inventoryService.searchProducts({
        name: "laptop",
        category: "Electronics",
        availability: "in_stock",
        page: 1,
        size: 10,
        sortParams: "",
      });

      expect(result.data?.content).toHaveLength(3);
      expect(result.status).toBe("success");
    });

    it("should search products with partial filters", async () => {
      const partialResults = {
        ...mockPaginatedProducts,
        content: [mockProducts[0]],
      };

      mock.onGet(/\/products\/search\?.*/).reply((config) => {
        const url = new URL(`http://localhost${config.url}`);
        expect(url.searchParams.get("name")).toBe("laptop");
        return [200, mockApiResponse(partialResults)];
      });

      const result = await inventoryService.searchProducts({
        name: "laptop",
        page: 1,
        size: 10,
        sortParams: "",
      });

      expect(result.data?.content).toHaveLength(1);
    });

    it("should search products with sort parameters", async () => {
      mock.onGet(/\/products\/search\?.*/).reply((config) => {
        expect(config.url).toContain("&sort=name,asc");
        return [200, mockApiResponse(mockPaginatedProducts)];
      });

      const result = await inventoryService.searchProducts({
        name: "laptop",
        page: 1,
        size: 10,
        sortParams: "&sort=name,asc",
      });

      expect(result.data?.content).toHaveLength(3);
    });

    it("should handle no search results", async () => {
      const emptyResults = {...mockPaginatedProducts, content: []};

      mock
        .onGet(/\/products\/search\?.*/)
        .reply(200, mockApiResponse(emptyResults));

      const result = await inventoryService.searchProducts({
        name: "nonexistent",
        page: 1,
        size: 10,
        sortParams: "",
      });

      expect(result.data?.content).toEqual([]);
    });

    it("should handle search errors", async () => {
      mock.onGet(/\/products\/search\?.*/).reply(500, {
        status: "error",
        message: "Search failed",
      });

      await expect(
        inventoryService.searchProducts({
          name: "laptop",
          page: 1,
          size: 10,
          sortParams: "",
        }),
      ).rejects.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle timeout errors", async () => {
      mock.onGet("/products?page=1&size=10").timeout();

      await expect(
        inventoryService.getProducts({page: 1, size: 10, sortParams: ""}),
      ).rejects.toThrow();
    });

    it("should handle malformed response data", async () => {
      mock.onGet("/products?page=1&size=10").reply(200, null);

      const result = await inventoryService.getProducts({
        page: 1,
        size: 10,
        sortParams: "",
      });

      expect(result).toBeNull();
    });

    it("should handle concurrent requests", async () => {
      mock
        .onGet("/products?page=1&size=10")
        .reply(200, mockApiResponse(mockPaginatedProducts));
      mock
        .onGet("/products/metrics")
        .reply(200, mockApiResponse(mockInventoryMetrics));
      mock
        .onGet("/products/categories")
        .reply(200, mockApiResponse(mockCategories));

      const [products, metrics, categories] = await Promise.all([
        inventoryService.getProducts({page: 1, size: 10, sortParams: ""}),
        inventoryService.getInventoryMetrics(),
        inventoryService.getCategories(),
      ]);

      expect(products.data?.content).toBeDefined();
      expect(metrics.data).toHaveLength(2);
      expect(categories.data).toHaveLength(3);
    });
  });
});
