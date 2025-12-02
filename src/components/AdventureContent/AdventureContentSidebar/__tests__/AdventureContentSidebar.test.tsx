import { screen, render } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AdventureContentSidebar } from "../AdventureContentSidebar";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { setupTestAdventure } from "@/__tests__/mockAdventureData";
import { AdventureContext } from "@/context/AdventureContext";
import type { AdventureContextType } from "@/context/AdventureContext";

const TEST_STORY_ID = "test-adventure-id";

describe("AdventureContentSidebar", () => {
  beforeEach(async () => {
    await setupTestAdventure(TEST_STORY_ID);
  });

  it("should render the navigation", async () => {
    renderWithAdventure(<AdventureContentSidebar />, {
      adventureId: TEST_STORY_ID,
    });

    expect(await screen.findByText("Passages")).toBeInTheDocument();
  });

  it("should render navigation links for all passages", async () => {
    renderWithAdventure(<AdventureContentSidebar />, {
      adventureId: TEST_STORY_ID,
    });

    // Should render introduction link
    expect(await screen.findByText("Introduction")).toBeInTheDocument();

    // Should render passage links (mock adventure has 6 passages)
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Passage ${i}`)).toBeInTheDocument();
    }
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
          <AdventureContentSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should return null when adventureId is null
    expect(container.firstChild).toBeNull();
  });

  it("should return null when adventure is not loaded yet", () => {
    const mockContextValue: AdventureContextType = {
      adventure: null,
      adventureId: TEST_STORY_ID,
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
      <MemoryRouter initialEntries={["/"]}>
        <AdventureContext.Provider value={mockContextValue}>
          <AdventureContentSidebar />
        </AdventureContext.Provider>
      </MemoryRouter>
    );

    // Component should return null when adventure is still loading
    expect(container.firstChild).toBeNull();
  });
});
