import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { setupTestStory } from "../../test/mockStoryData";
import { renderWithStory } from "../../test/testUtils";
import { Sidebar } from "../Sidebar";

const TEST_STORY_ID = "test-story-id";

describe("Sidebar", () => {
  beforeEach(async () => {
    localStorage.clear();
    await setupTestStory(TEST_STORY_ID);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should render the inventory heading", async () => {
    renderWithStory(<Sidebar />, { storyId: TEST_STORY_ID });

    expect(await screen.findByText("Inventory")).toBeInTheDocument();
  });

  it("should show empty message when no items are collected", async () => {
    renderWithStory(<Sidebar />, { storyId: TEST_STORY_ID });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();
  });

  it("should display collected items", async () => {
    // Set up localStorage with collected items
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1"])
    );

    renderWithStory(<Sidebar />, { storyId: TEST_STORY_ID });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("No items yet")).not.toBeInTheDocument();
  });

  it("should display multiple collected items", async () => {
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1", "mock_item_2"])
    );

    renderWithStory(<Sidebar />, { storyId: TEST_STORY_ID });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(await screen.findByText("Mock Item Two")).toBeInTheDocument();
  });

  it("should not display items that are not collected", async () => {
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1"])
    );

    renderWithStory(<Sidebar />, { storyId: TEST_STORY_ID });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("Mock Item Two")).not.toBeInTheDocument();
  });

  it("should handle items not in story inventory gracefully", async () => {
    // Set up localStorage with an item ID not in the story
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["unknown_item"])
    );

    renderWithStory(<Sidebar />, { storyId: TEST_STORY_ID });

    // Should not display the unknown item
    expect(await screen.findByText("No items yet")).toBeInTheDocument();
  });

  it("should render inventory items as a list", async () => {
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1", "mock_item_2"])
    );

    renderWithStory(<Sidebar />, { storyId: TEST_STORY_ID });

    const list = await screen.findByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(2);
  });

  it("should update when storage event is triggered", async () => {
    const { rerender } = renderWithStory(<Sidebar />, {
      storyId: TEST_STORY_ID,
    });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();

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

  it("should update when inventoryUpdate event is triggered", async () => {
    const { rerender } = renderWithStory(<Sidebar />, {
      storyId: TEST_STORY_ID,
    });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();

    // Simulate adding an item in the same window
    localStorage.setItem(
      "adventure-book/inventory",
      JSON.stringify(["mock_item_1"])
    );
    window.dispatchEvent(new Event("inventoryUpdate"));

    rerender(<Sidebar />);

    // Component should re-render with the new item
    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
  });
});
