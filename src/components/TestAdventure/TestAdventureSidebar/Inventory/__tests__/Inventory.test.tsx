import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inventory } from "../Inventory";
import type { InventoryItem } from "@/data/types";

describe("Inventory", () => {
  it("should render the inventory title", () => {
    render(<Inventory items={[]} />);
    expect(screen.getByText("Inventory")).toBeInTheDocument();
  });

  it("should show empty message when no items are provided", () => {
    render(<Inventory items={[]} />);
    expect(screen.getByText("No items yet")).toBeInTheDocument();
  });

  it("should display a single item", () => {
    const items: InventoryItem[] = [
      { id: "test-item-1", name: "Test Item One" },
    ];
    render(<Inventory items={items} />);
    expect(screen.getByText("Test Item One")).toBeInTheDocument();
    expect(screen.queryByText("No items yet")).not.toBeInTheDocument();
  });

  it("should display multiple items", () => {
    const items: InventoryItem[] = [
      { id: "test-item-1", name: "Test Item One" },
      { id: "test-item-2", name: "Test Item Two" },
      { id: "test-item-3", name: "Test Item Three" },
    ];
    render(<Inventory items={items} />);
    expect(screen.getByText("Test Item One")).toBeInTheDocument();
    expect(screen.getByText("Test Item Two")).toBeInTheDocument();
    expect(screen.getByText("Test Item Three")).toBeInTheDocument();
  });

  it("should render items in a list", () => {
    const items: InventoryItem[] = [
      { id: "test-item-1", name: "Test Item One" },
      { id: "test-item-2", name: "Test Item Two" },
    ];
    render(<Inventory items={items} />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(2);
  });

  it("should not render a list when items array is empty", () => {
    render(<Inventory items={[]} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
