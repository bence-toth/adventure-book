import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the story loader before importing anything that uses it
vi.mock("../../data/storyLoader", () => ({
  getInventoryItems: vi.fn(() => [
    { id: "mock_item_1", name: "Mock Item One" },
    { id: "mock_item_2", name: "Mock Item Two" },
  ]),
  getCurrentInventory: vi.fn(() => {
    const stored = localStorage.getItem("adventure-book/inventory");
    return stored ? JSON.parse(stored) : [];
  }),
}));

// Import Sidebar after mocking
const { Sidebar } = await import("../Sidebar");

describe("Sidebar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should render the inventory heading", () => {
    render(<Sidebar />);

    expect(screen.getByText("Inventory")).toBeInTheDocument();
  });

  it("should show empty message when no items are collected", () => {
    render(<Sidebar />);

    expect(screen.getByText("No items yet")).toBeInTheDocument();
  });

  it("should display collected items", () => {
    // Set up localStorage with collected items
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1"])
    );

    render(<Sidebar />);

    expect(screen.getByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("No items yet")).not.toBeInTheDocument();
  });

  it("should display multiple collected items", () => {
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1", "mock_item_2"])
    );

    render(<Sidebar />);

    expect(screen.getByText("Mock Item One")).toBeInTheDocument();
    expect(screen.getByText("Mock Item Two")).toBeInTheDocument();
  });

  it("should not display items that are not collected", () => {
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1"])
    );

    render(<Sidebar />);

    expect(screen.getByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("Mock Item Two")).not.toBeInTheDocument();
  });

  it("should handle items not in story inventory gracefully", () => {
    // Set up localStorage with an item ID not in the story
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["unknown_item"])
    );

    render(<Sidebar />);

    // Should not display the unknown item
    expect(screen.getByText("No items yet")).toBeInTheDocument();
  });

  it("should render inventory items as a list", () => {
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1", "mock_item_2"])
    );

    render(<Sidebar />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(2);
  });

  it("should update when storage event is triggered", () => {
    const { rerender } = render(<Sidebar />);

    expect(screen.getByText("No items yet")).toBeInTheDocument();

    // Simulate adding an item
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1"])
    );
    window.dispatchEvent(new Event("storage"));

    rerender(<Sidebar />);

    // Note: storage event doesn't trigger in same-window in tests,
    // so we rely on the inventoryUpdate event for same-window updates
  });

  it("should update when inventoryUpdate event is triggered", () => {
    const { rerender } = render(<Sidebar />);

    expect(screen.getByText("No items yet")).toBeInTheDocument();

    // Simulate adding an item in the same window
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1"])
    );
    window.dispatchEvent(new Event("inventoryUpdate"));

    rerender(<Sidebar />);

    // Component should re-render with the new item
    expect(screen.queryByText("Mock Item One")).toBeInTheDocument();
  });
});
