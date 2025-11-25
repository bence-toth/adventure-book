import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DebugInventory } from "../DebugInventory";
import type { InventoryItem } from "@/data/types";
import * as inventoryManagement from "@/utils/inventoryManagement";

vi.mock("@/utils/inventoryManagement", () => ({
  addItemToInventory: vi.fn(),
  removeItemFromInventory: vi.fn(),
}));

describe("DebugInventory", () => {
  const mockAdventureId = "test-adventure-id";
  const mockOnInventoryChange = vi.fn();

  const mockItems: InventoryItem[] = [
    { id: "item-1", name: "Test Item One" },
    { id: "item-2", name: "Test Item Two" },
    { id: "item-3", name: "Test Item Three" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the debug inventory title", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={[]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );
    expect(screen.getByText("Inventory")).toBeInTheDocument();
  });

  it("should display all items with checkboxes", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={[]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    expect(screen.getByText("Test Item One")).toBeInTheDocument();
    expect(screen.getByText("Test Item Two")).toBeInTheDocument();
    expect(screen.getByText("Test Item Three")).toBeInTheDocument();
  });

  it("should check items that are in current inventory", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={["item-1", "item-3"]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    const toggle1 = screen.getByRole("switch", {
      name: "Test Item One",
    }) as HTMLInputElement;
    const toggle2 = screen.getByRole("switch", {
      name: "Test Item Two",
    }) as HTMLInputElement;
    const toggle3 = screen.getByRole("switch", {
      name: "Test Item Three",
    }) as HTMLInputElement;

    expect(toggle1.checked).toBe(true);
    expect(toggle2.checked).toBe(false);
    expect(toggle3.checked).toBe(true);
  });

  it("should call addItemToInventory when checking an unchecked item", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={[]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    const toggle = screen.getByRole("switch", { name: "Test Item One" });
    fireEvent.click(toggle);

    expect(inventoryManagement.addItemToInventory).toHaveBeenCalledWith(
      mockAdventureId,
      "item-1"
    );
    expect(mockOnInventoryChange).toHaveBeenCalled();
  });

  it("should call removeItemFromInventory when unchecking a checked item", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={["item-2"]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    const toggle = screen.getByRole("switch", { name: "Test Item Two" });
    fireEvent.click(toggle);

    expect(inventoryManagement.removeItemFromInventory).toHaveBeenCalledWith(
      mockAdventureId,
      "item-2"
    );
    expect(mockOnInventoryChange).toHaveBeenCalled();
  });

  it("should render items in a list", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={[]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(3);
  });

  it("should handle empty items array", () => {
    render(
      <DebugInventory
        allItems={[]}
        currentItemIds={[]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    expect(screen.getByText("Inventory")).toBeInTheDocument();
    const list = screen.getByRole("list");
    expect(list.children).toHaveLength(0);
  });

  it("should toggle multiple items independently", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={["item-1"]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    // Check item 2
    fireEvent.click(screen.getByRole("switch", { name: "Test Item Two" }));
    expect(inventoryManagement.addItemToInventory).toHaveBeenCalledWith(
      mockAdventureId,
      "item-2"
    );

    // Uncheck item 1
    fireEvent.click(screen.getByRole("switch", { name: "Test Item One" }));
    expect(inventoryManagement.removeItemFromInventory).toHaveBeenCalledWith(
      mockAdventureId,
      "item-1"
    );

    expect(mockOnInventoryChange).toHaveBeenCalledTimes(2);
  });

  it("should use unique IDs for checkboxes and labels", () => {
    render(
      <DebugInventory
        allItems={mockItems}
        currentItemIds={[]}
        adventureId={mockAdventureId}
        onInventoryChange={mockOnInventoryChange}
      />
    );

    const toggle1 = screen.getByTestId("debug-item-item-1");
    const toggle2 = screen.getByTestId("debug-item-item-2");

    expect(toggle1).toBeInTheDocument();
    expect(toggle2).toBeInTheDocument();
  });
});
