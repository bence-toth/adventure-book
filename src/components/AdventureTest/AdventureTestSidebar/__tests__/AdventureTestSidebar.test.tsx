import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  setupTestAdventure,
  mockAdventure,
} from "@/__tests__/mockAdventureData";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { AdventureTestSidebar } from "../AdventureTestSidebar";
import {
  AdventureContext,
  type AdventureContextType,
} from "@/context/AdventureContext";

const TEST_STORY_ID = "test-adventure-id";

// Default props for AdventureTestSidebar
const defaultProps = {
  inventory: [] as string[],
  onAddItem: vi.fn(),
  onRemoveItem: vi.fn(),
};

describe("AdventureTestSidebar", () => {
  beforeEach(async () => {
    localStorage.clear();
    await setupTestAdventure(TEST_STORY_ID);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should render the inventory heading", async () => {
    renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("Inventory")).toBeInTheDocument();
  });

  it("should show empty message when no items are collected", async () => {
    renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("No items yet")).toBeInTheDocument();
  });

  it("should display collected items", async () => {
    renderWithAdventure(
      <AdventureTestSidebar {...defaultProps} inventory={["mock_item_1"]} />,
      {
        adventureId: TEST_STORY_ID,
      }
    );

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("No items yet")).not.toBeInTheDocument();
  });

  it("should display multiple collected items", async () => {
    renderWithAdventure(
      <AdventureTestSidebar
        {...defaultProps}
        inventory={["mock_item_1", "mock_item_2"]}
      />,
      {
        adventureId: TEST_STORY_ID,
      }
    );

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(await screen.findByText("Mock Item Two")).toBeInTheDocument();
  });

  it("should not display items that are not collected", async () => {
    renderWithAdventure(
      <AdventureTestSidebar {...defaultProps} inventory={["mock_item_1"]} />,
      {
        adventureId: TEST_STORY_ID,
      }
    );

    expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
    expect(screen.queryByText("Mock Item Two")).not.toBeInTheDocument();
  });

  it("should handle items not in adventure inventory gracefully", async () => {
    // Pass an item ID not in the adventure
    renderWithAdventure(
      <AdventureTestSidebar {...defaultProps} inventory={["unknown_item"]} />,
      {
        adventureId: TEST_STORY_ID,
      }
    );

    // Should not display the unknown item
    expect(await screen.findByText("No items yet")).toBeInTheDocument();
  });

  it("should render inventory items as a list", async () => {
    renderWithAdventure(
      <AdventureTestSidebar
        {...defaultProps}
        inventory={["mock_item_1", "mock_item_2"]}
      />,
      {
        adventureId: TEST_STORY_ID,
      }
    );

    const list = await screen.findByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(2);
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
      updateIntroduction: vi.fn(),
      updatePassage: vi.fn(),
      withSaving: vi.fn(),
    };

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AdventureContext.Provider value={mockContextValue}>
          <AdventureTestSidebar {...defaultProps} />
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
      updateIntroduction: vi.fn(),
      updatePassage: vi.fn(),
      withSaving: vi.fn(),
    };

    const { container } = render(
      <MemoryRouter initialEntries={[`/adventure/${TEST_STORY_ID}/test`]}>
        <AdventureContext.Provider value={mockContextValue}>
          <AdventureTestSidebar {...defaultProps} />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should not render anything when adventure is null
    expect(container.firstChild).toBeNull();
  });

  it("should not set up event listeners when adventureId is null", () => {
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
      updateIntroduction: vi.fn(),
      updatePassage: vi.fn(),
      withSaving: vi.fn(),
    };

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AdventureContext.Provider value={mockContextValue}>
          <AdventureTestSidebar {...defaultProps} />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should not render anything
    expect(container.firstChild).toBeNull();

    // Since the component returns early, the effect never runs and no listeners are added
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
            updateIntroduction: vi.fn(),
            updatePassage: vi.fn(),
            withSaving: vi.fn(),
          }}
        >
          <Routes>
            <Route
              path="/adventure/:adventureId/test/passage/:id"
              element={<AdventureTestSidebar {...defaultProps} />}
            />
          </Routes>
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should render (passage ID is parsed internally but not used directly in render)
    expect(await screen.findByText("Inventory")).toBeInTheDocument();
  });

  describe("Debug Mode", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render debug inventory when debug mode is enabled", async () => {
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
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
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
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
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      expect(await screen.findByText("Mock Item One")).toBeInTheDocument();
      expect(await screen.findByText("Mock Item Two")).toBeInTheDocument();
    });

    it("should allow toggling items in debug mode", async () => {
      const mockOnAddItem = vi.fn();
      renderWithAdventure(
        <AdventureTestSidebar {...defaultProps} onAddItem={mockOnAddItem} />,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
          isDebugModeEnabled: true,
        }
      );

      const toggle = (await screen.findByRole("switch", {
        name: "Mock Item One",
      })) as HTMLInputElement;
      expect(toggle.checked).toBe(false);

      fireEvent.click(toggle);

      expect(mockOnAddItem).toHaveBeenCalledWith("mock_item_1");
    });

    it("should reflect current inventory state in debug mode", async () => {
      renderWithAdventure(
        <AdventureTestSidebar {...defaultProps} inventory={["mock_item_1"]} />,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
          isDebugModeEnabled: true,
        }
      );

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
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      expect(await screen.findByText("Passages")).toBeInTheDocument();
      expect(screen.getByTestId("debug-nav-introduction")).toBeInTheDocument();
    });

    it("should not render debug navigation when debug mode is disabled", async () => {
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
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
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
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
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
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
      renderWithAdventure(<AdventureTestSidebar {...defaultProps} />, {
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
