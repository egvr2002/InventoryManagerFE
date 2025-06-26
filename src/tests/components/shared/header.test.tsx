import {describe, it, expect} from "vitest";
import {screen} from "@testing-library/react";
import {Header} from "@/components/shared/header";
import {renderWithProviders} from "../../utils/test-utils";

describe("Header", () => {
  it("should render the header with correct title", () => {
    renderWithProviders(<Header />);

    const heading = screen.getByRole("heading", {level: 1});
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Inventory Manager");
  });

  it("should have the correct styling classes", () => {
    renderWithProviders(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    const heading = screen.getByRole("heading", {level: 1});
    expect(heading).toHaveClass("text-center", "text-xl", "font-medium");
  });

  it("should highlight 'Manager' text with green color", () => {
    renderWithProviders(<Header />);

    const managerSpan = screen.getByText("Manager");
    expect(managerSpan).toHaveClass("text-green-700");
  });

  it("should contain 'Inventory' and 'Manager' text", () => {
    renderWithProviders(<Header />);

    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
  });
});
