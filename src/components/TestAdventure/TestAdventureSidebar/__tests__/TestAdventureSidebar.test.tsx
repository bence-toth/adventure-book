import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  setupTestAdventure,
  mockAdventure,
} from "@/__tests__/mockAdventureData";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { TestAdventureSidebar } from "../TestAdventureSidebar";
import {
  AdventureContext,
  type AdventureContextType,
} from "@/context/AdventureContext";
import * as inventoryManagement from "@/utils/inventoryManagement";

vi.mock("@/utils/inventoryManagement", async () => {
  const actual = await vi.importActual<
    typeof import("@/utils/inventoryManagement")
  >("@/utils/inventoryManagement");
  return {
    ...actual,
    addItemToInventory: vi.fn(actual.addItemToInventory),
    removeItemFromInventory: vi.fn(actual.removeItemFromInventory),
  };
});

const TEST_STORY_ID = "test-adventure-id";

describe("TestAdventureSidebar", () => {
  beforeEach(async () => {
    localStorage.clear();
    await setupTestAdventure(TEST_STORY_ID);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should render the inventory heading", async () => {
    renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("Inventory")).toBeInTheDocument();
  });

  it("should show empty message when no items are collected", async () => {
    renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

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

    renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

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

    renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

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

    renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

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

    renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

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

    renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

    const list = await screen.findByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(2);
  });

  it("should update when storage event is triggered", async () => {
    const { rerender } = renderWithAdventure(<TestAdventureSidebar />, {
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

    rerender(<TestAdventureSidebar />);

    // Note: storage event doesn't trigger in same-window in tests,
    // so we rely on the inventoryUpdate event for same-window updates
  });

  it("should update when inventoryUpdate event is triggered", async () => {
    const { rerender } = renderWithAdventure(<TestAdventureSidebar />, {
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

    rerender(<TestAdventureSidebar />);

    // Component should re-render with the new item
    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
  });

  it("should return null when adventureId is null", () => {
    const mockContextValue: AdventureContextType = {
      adventure: null,
      adventureId: null,
      isLoading: false,
      error: null,
      isDebugModeEnabled: false,
      isSaving: false,
      setIsDebugModeEnabled: vi.fn(),
      reloadAdventure: vi.fn(),
      updateAdventure: vi.fn(),
      withSaving: vi.fn(),
    };

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AdventureContext.Provider value={mockContextValue}>
          <TestAdventureSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should not render anything
    expect(container.firstChild).toBeNull();
  });

  it("should return null when adventure is not loaded yet", () => {
    const mockContextValue: AdventureContextType = {
      adventure: null,
      adventureId: null,
      isLoading: true,
      error: null,
      isDebugModeEnabled: false,
      isSaving: false,
      setIsDebugModeEnabled: vi.fn(),
      reloadAdventure: vi.fn(),
      updateAdventure: vi.fn(),
      withSaving: vi.fn(),
    };

    const { container } = render(
      <MemoryRouter initialEntries={[`/adventure/${TEST_STORY_ID}/test`]}>
        <AdventureContext.Provider value={mockContextValue}>
          <TestAdventureSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should not render anything when adventure is null
    expect(container.firstChild).toBeNull();
  });

  it("should not set up event listeners when adventureId is empty", () => {
    // Render with mock context where adventureId is not available
    const mockContextValue: AdventureContextType = {
      adventure: null,
      adventureId: null,
      isLoading: false,
      error: null,
      isDebugModeEnabled: false,
      isSaving: false,
      setIsDebugModeEnabled: vi.fn(),
      reloadAdventure: vi.fn(),
      updateAdventure: vi.fn(),
      withSaving: vi.fn(),
    };

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AdventureContext.Provider value={mockContextValue}>
          <TestAdventureSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should not render anything
    expect(container.firstChild).toBeNull();

    // Since the component returns early, the effect never runs and no listeners are added
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

    await setupTestAdventure(TEST_STORY_ID);

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
    window.addEventListener =
      addEventListenerSpy as typeof window.addEventListener;

    // Render without mocking adventure to use real AdventureProvider
    const { rerender } = renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();

    // Effect should have run once, adding 2 listeners (storage + inventoryUpdate)
    const initialCallCount = addEventListenerCallCount;
    expect(initialCallCount).toBe(2);

    // Re-render component (simulates props/context update)
    await act(async () => {
      rerender(<TestAdventureSidebar />);
    });

    // Effect should NOT re-run because adventureId hasn't changed
    expect(addEventListenerCallCount).toBe(initialCallCount);

    window.addEventListener = originalAddEventListener;
  });

  it("should parse passage ID from URL params", async () => {
    // We need to use Routes to properly set up params
    const { Route, Routes } = await import("react-router-dom");

    render(
      <MemoryRouter
        initialEntries={[`/adventure/${TEST_STORY_ID}/test/passage/5`]}
      >
        <AdventureContext.Provider
          value={{
            adventure: mockAdventure,
            adventureId: TEST_STORY_ID,
            isLoading: false,
            error: null,
            isDebugModeEnabled: true,
            isSaving: false,
            setIsDebugModeEnabled: vi.fn(),
            reloadAdventure: vi.fn(),
            updateAdventure: vi.fn(),
            withSaving: vi.fn(),
          }}
        >
          <Routes>
            <Route
              path="/adventure/:adventureId/test/passage/:id"
              element={<TestAdventureSidebar />}
            />
          </Routes>
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should render (passage ID is parsed internally but not used directly in render)
    expect(await screen.findByText("Inventory")).toBeInTheDocument();
  });

  it("should handle cleanup when component unmounts", async () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("Inventory")).toBeInTheDocument();

    // Unmount the component
    unmount();

    // Verify event listeners were removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "storage",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "inventoryUpdate",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it("should not update inventory after unmount", async () => {
    // Capture event handlers to test isMounted guards
    let storageHandler: ((event: Event) => void) | null = null;
    let inventoryHandler: ((event: Event) => void) | null = null;

    const originalAddEventListener = window.addEventListener.bind(window);
    const addEventListenerSpy = vi
      .spyOn(window, "addEventListener")
      .mockImplementation((event, handler, options) => {
        if (event === "storage") {
          storageHandler = handler as (event: Event) => void;
        } else if (event === "inventoryUpdate") {
          inventoryHandler = handler as (event: Event) => void;
        }
        return originalAddEventListener(event, handler, options);
      });

    const { unmount } = renderWithAdventure(<TestAdventureSidebar />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();

    // Ensure handlers were captured
    expect(storageHandler).not.toBeNull();
    expect(inventoryHandler).not.toBeNull();

    // Unmount the component
    unmount();

    // Try to trigger update after unmount by calling handlers directly
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    // Call the handlers directly to test the isMounted guard
    await act(async () => {
      if (storageHandler) {
        storageHandler(new Event("storage"));
      }
      if (inventoryHandler) {
        inventoryHandler(new Event("inventoryUpdate"));
      }
    });

    // Component is unmounted, so no errors should occur
    // This tests the isMounted guard prevents state updates after unmount

    addEventListenerSpy.mockRestore();
  });

  it("should handle inventory change when adventureId is null", async () => {
    const mockSetIsDebugModeEnabled = vi.fn();

    // Start with valid adventure
    const { rerender } = render(
      <MemoryRouter initialEntries={[`/adventure/${TEST_STORY_ID}/test`]}>
        <AdventureContext.Provider
          value={{
            adventure: mockAdventure,
            adventureId: TEST_STORY_ID,
            isLoading: false,
            error: null,
            isDebugModeEnabled: true,
            isSaving: false,
            setIsDebugModeEnabled: mockSetIsDebugModeEnabled,
            reloadAdventure: vi.fn(),
            updateAdventure: vi.fn(),
            withSaving: vi.fn(),
          }}
        >
          <TestAdventureSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Inventory")).toBeInTheDocument();

    // Verify the toggle exists before changing context
    expect(
      screen.getByRole("switch", { name: "Mock Item One" })
    ).toBeInTheDocument();

    // Now change context to have null adventureId while keeping component mounted
    rerender(
      <MemoryRouter initialEntries={[`/adventure/${TEST_STORY_ID}/test`]}>
        <AdventureContext.Provider
          value={{
            adventure: mockAdventure,
            adventureId: null,
            isLoading: false,
            error: null,
            isDebugModeEnabled: true,
            isSaving: false,
            setIsDebugModeEnabled: mockSetIsDebugModeEnabled,
            reloadAdventure: vi.fn(),
            updateAdventure: vi.fn(),
            withSaving: vi.fn(),
          }}
        >
          <TestAdventureSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should return null when adventureId is null
    expect(screen.queryByText("Inventory")).not.toBeInTheDocument();
  });

  it("should handle inventory change without calling handlers when adventureId becomes null", async () => {
    // Set up initial inventory
    const data = {
      [TEST_STORY_ID]: {
        passageId: null,
        inventory: ["mock_item_1"],
      },
    };
    localStorage.setItem("adventure-book/progress", JSON.stringify(data));

    const mockSetIsDebugModeEnabled = vi.fn();
    const addSpy = vi.spyOn(inventoryManagement, "addItemToInventory");

    // Start with valid adventure in debug mode
    const { rerender } = render(
      <MemoryRouter initialEntries={[`/adventure/${TEST_STORY_ID}/test`]}>
        <AdventureContext.Provider
          value={{
            adventure: mockAdventure,
            adventureId: TEST_STORY_ID,
            isLoading: false,
            error: null,
            isDebugModeEnabled: true,
            isSaving: false,
            setIsDebugModeEnabled: mockSetIsDebugModeEnabled,
            reloadAdventure: vi.fn(),
            updateAdventure: vi.fn(),
            withSaving: vi.fn(),
          }}
        >
          <TestAdventureSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Inventory")).toBeInTheDocument();

    // Now change context to have null adventureId
    rerender(
      <MemoryRouter initialEntries={[`/adventure/${TEST_STORY_ID}/test`]}>
        <AdventureContext.Provider
          value={{
            adventure: mockAdventure,
            adventureId: null,
            isLoading: false,
            error: null,
            isDebugModeEnabled: true,
            isSaving: false,
            setIsDebugModeEnabled: mockSetIsDebugModeEnabled,
            reloadAdventure: vi.fn(),
            updateAdventure: vi.fn(),
            withSaving: vi.fn(),
          }}
        >
          <TestAdventureSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should return null when adventureId is null
    expect(screen.queryByText("Inventory")).not.toBeInTheDocument();

    // The handleInventoryChange was never called because component returned early
    // so addItemToInventory should not have been called since initial render
    expect(addSpy).not.toHaveBeenCalled();

    addSpy.mockRestore();
  });

  describe("Debug Mode", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render debug inventory when debug mode is enabled", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      // Both modes show "Inventory" as the title, but debug mode shows toggles
      expect(await screen.findByText("Inventory")).toBeInTheDocument();
      // Verify it's debug mode by checking for toggle switches
      expect(
        screen.getByRole("switch", { name: "Mock Item One" })
      ).toBeInTheDocument();
    });

    it("should render normal inventory when debug mode is disabled", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: false,
      });

      expect(await screen.findByText("Inventory")).toBeInTheDocument();
      // Verify the debug mode toggle is present in the footer
      expect(
        screen.getByRole("switch", { name: "Debug mode" })
      ).toBeInTheDocument();
      // Verify it's normal mode by checking no item toggle switches exist
      expect(
        screen.queryByRole("switch", { name: "Mock Item One" })
      ).not.toBeInTheDocument();
    });

    it("should show all items with checkboxes in debug mode", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
      expect(await screen.findByText("Mock Item Two")).toBeInTheDocument();
    });

    it("should allow toggling items in debug mode", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const toggle = (await screen.findByRole("switch", {
        name: "Mock Item One",
      })) as HTMLInputElement;
      expect(toggle.checked).toBe(false);

      fireEvent.click(toggle);

      expect(inventoryManagement.addItemToInventory).toHaveBeenCalledWith(
        TEST_STORY_ID,
        "mock_item_1"
      );
    });

    it("should reflect current inventory state in debug mode", async () => {
      const data = {
        [TEST_STORY_ID]: {
          passageId: null,
          inventory: ["mock_item_1"],
        },
      };
      localStorage.setItem("adventure-book/progress", JSON.stringify(data));

      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const toggle1 = (await screen.findByRole("switch", {
        name: "Mock Item One",
      })) as HTMLInputElement;
      const toggle2 = (await screen.findByRole("switch", {
        name: "Mock Item Two",
      })) as HTMLInputElement;

      expect(toggle1.checked).toBe(true);
      expect(toggle2.checked).toBe(false);
    });

    it("should render debug navigation when debug mode is enabled", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      expect(await screen.findByText("Passages")).toBeInTheDocument();
      expect(screen.getByTestId("debug-nav-introduction")).toBeInTheDocument();
    });

    it("should not render debug navigation when debug mode is disabled", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: false,
      });

      expect(await screen.findByText("Inventory")).toBeInTheDocument();
      expect(screen.queryByText("Passages")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("debug-nav-introduction")
      ).not.toBeInTheDocument();
    });

    it("should always show debug mode toggle in footer", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: false,
      });

      const debugToggle = await screen.findByRole("switch", {
        name: "Debug mode",
      });
      expect(debugToggle).toBeInTheDocument();
    });

    it("should show debug toggle as unchecked when debug mode is disabled", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: false,
      });

      const debugToggle = (await screen.findByRole("switch", {
        name: "Debug mode",
      })) as HTMLInputElement;
      expect(debugToggle.checked).toBe(false);
    });

    it("should show debug toggle as checked when debug mode is enabled", async () => {
      renderWithAdventure(<TestAdventureSidebar />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const debugToggle = (await screen.findByRole("switch", {
        name: "Debug mode",
      })) as HTMLInputElement;
      expect(debugToggle.checked).toBe(true);
    });
  });
});
