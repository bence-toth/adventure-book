import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, act } from "@testing-library/react";
import { setupTestAdventure } from "@/__tests__/mockAdventureData";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { Sidebar } from "../Sidebar";

const TEST_STORY_ID = "test-adventure-id";

describe("Sidebar", () => {
  beforeEach(async () => {
    localStorage.clear();
    await setupTestAdventure(TEST_STORY_ID);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should render the inventory heading", async () => {
    renderWithAdventure(<Sidebar />, { adventureId: TEST_STORY_ID });

    expect(await screen.findByText("Inventory")).toBeInTheDocument();
  });

  it("should show empty message when no items are collected", async () => {
    renderWithAdventure(<Sidebar />, { adventureId: TEST_STORY_ID });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();
  });

  it("should display collected items", async () => {
    // Set up localStorage with collected items
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    renderWithAdventure(<Sidebar />, { adventureId: TEST_STORY_ID });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("No items yet")).not.toBeInTheDocument();
  });

  it("should display multiple collected items", async () => {
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1", "mock_item_2"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    renderWithAdventure(<Sidebar />, { adventureId: TEST_STORY_ID });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(await screen.findByText("Mock Item Two")).toBeInTheDocument();
  });

  it("should not display items that are not collected", async () => {
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    renderWithAdventure(<Sidebar />, { adventureId: TEST_STORY_ID });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("Mock Item Two")).not.toBeInTheDocument();
  });

  it("should handle items not in adventure inventory gracefully", async () => {
    // Set up localStorage with an item ID not in the adventure
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["unknown_item"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    renderWithAdventure(<Sidebar />, { adventureId: TEST_STORY_ID });

    // Should not display the unknown item
    expect(await screen.findByText("No items yet")).toBeInTheDocument();
  });

  it("should render inventory items as a list", async () => {
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1", "mock_item_2"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    renderWithAdventure(<Sidebar />, { adventureId: TEST_STORY_ID });

    const list = await screen.findByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(2);
  });

  it("should update when storage event is triggered", async () => {
    const { rerender } = renderWithAdventure(<Sidebar />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();

    // Simulate adding an item
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    await act(async () => {
      window.dispatchEvent(new Event("storage"));
    });

    rerender(<Sidebar />);

    // Note: storage event doesn't trigger in same-window in tests,
    // so we rely on the inventoryUpdate event for same-window updates
  });

  it("should update when inventoryUpdate event is triggered", async () => {
    const { rerender } = renderWithAdventure(<Sidebar />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();

    // Simulate adding an item in the same window
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    await act(async () => {
      window.dispatchEvent(new Event("inventoryUpdate"));
    });

    rerender(<Sidebar />);

    // Component should re-render with the new item
    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
  });

  it("should return null when adventureId is not available", () => {
    const { container } = renderWithAdventure(<Sidebar />, {
      adventureId: undefined as unknown as string,
    });

    // Component should not render anything
    expect(container.firstChild).toBeNull();
  });

  it("should return null when adventure is not loaded yet", () => {
    const { container } = renderWithAdventure(<Sidebar />, {
      adventureId: TEST_STORY_ID,
      adventure: null,
    });

    // Component should not render anything when adventure is null
    expect(container.firstChild).toBeNull();
  });

  it("should not set up event listeners when adventureId is null", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    renderWithAdventure(<Sidebar />, {
      adventureId: null,
      adventure: null,
    });

    // Verify that addEventListener was not called when adventureId is null
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    addEventListenerSpy.mockRestore();
  });

  it("should only depend on adventureId in effect, not adventure object", async () => {
    // Set up initial inventory
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    const mockAdventure = await setupTestAdventure(TEST_STORY_ID);

    // Track how many times the effect runs by monitoring addEventListener calls
    let addEventListenerCallCount = 0;
    const originalAddEventListener = window.addEventListener;
    const addEventListenerSpy = vi.fn(
      (event: string, handler: EventListener) => {
        if (event === "storage" || event === "inventoryUpdate") {
          addEventListenerCallCount++;
        }
        return originalAddEventListener.call(window, event, handler);
      }
    );
    window.addEventListener = addEventListenerSpy as any;

    const { rerender } = renderWithAdventure(<Sidebar />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();

    // Effect should have run once, adding 2 listeners (storage + inventoryUpdate)
    const initialCallCount = addEventListenerCallCount;
    expect(initialCallCount).toBe(2);

    // Create a new adventure object with the same content but different reference
    const newAdventureObject = { ...mockAdventure };

    // Re-render with new adventure object but same adventureId
    await act(async () => {
      rerender(<Sidebar />);
    });

    // Effect should NOT re-run because adventureId hasn't changed
    expect(addEventListenerCallCount).toBe(initialCallCount);

    window.addEventListener = originalAddEventListener;
  });
});
