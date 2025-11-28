import { screen, render } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TestAdventureTopBar } from "../TestAdventureTopBar";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { setupTestAdventure } from "@/__tests__/mockAdventureData";
import { AdventureContext } from "@/context/AdventureContext";
import type { AdventureContextType } from "@/context/AdventureContext";

const TEST_STORY_ID = "test-adventure-id";

describe("TestAdventureTopBar Component", () => {
  beforeEach(async () => {
    await setupTestAdventure(TEST_STORY_ID);
  });

  describe("Rendering", () => {
    it("renders the header element", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
      });
      const header = await screen.findByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders back button, title input, and navigation", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
      });

      // Should have back button
      const backButton = await screen.findByRole("button", {
        name: /back to adventure manager/i,
      });
      expect(backButton).toBeInTheDocument();

      // Should have title input
      const titleInput = await screen.findByLabelText("Adventure title");
      expect(titleInput).toBeInTheDocument();

      // Should have navigation links
      const testLink = await screen.findByRole("link", { name: /test/i });
      const editLink = await screen.findByRole("link", { name: /edit/i });
      expect(testLink).toBeInTheDocument();
      expect(editLink).toBeInTheDocument();
    });

    it("returns null when adventureId is not available", () => {
      const mockContextValue: AdventureContextType = {
        adventure: null,
        adventureId: null,
        loading: false,
        error: null,
        debugModeEnabled: false,
        isSaving: false,
        setDebugModeEnabled: vi.fn(),
        reloadAdventure: vi.fn(),
        updateAdventure: vi.fn(),
        withSaving: vi.fn(),
      };

      const { container } = render(
        <MemoryRouter initialEntries={["/"]}>
          <AdventureContext.Provider value={mockContextValue}>
            <TestAdventureTopBar />
          </AdventureContext.Provider>
        </MemoryRouter>
      );

      const header = container.querySelector("header");
      expect(header).not.toBeInTheDocument();
    });
  });

  describe("Saving Indicator", () => {
    it("shows saving indicator when isSaving is true", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
        contextOverride: { isSaving: true },
      });

      const savingIndicator = await screen.findByTestId("saving-indicator");
      expect(savingIndicator).toBeInTheDocument();
      expect(savingIndicator).toHaveTextContent("Saving...");
    });

    it("does not show saving indicator when isSaving is false", async () => {
      renderWithAdventure(<TestAdventureTopBar />, {
        adventureId: TEST_STORY_ID,
        contextOverride: { isSaving: false },
      });

      const savingIndicator = screen.queryByTestId("saving-indicator");
      expect(savingIndicator).not.toBeInTheDocument();
    });
  });
});
