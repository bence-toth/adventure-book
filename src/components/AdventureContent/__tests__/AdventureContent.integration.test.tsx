import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { getNavigationPassageTestId } from "../AdventureContentSidebar/Navigation/testIds";
import * as adventureDatabase from "@/data/adventureDatabase";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom
const mockNavigate = vi.fn();
let mockParams: { id: string | undefined; adventureId: string } = {
  id: undefined,
  adventureId: TEST_STORY_ID,
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
    useBlocker: vi.fn(() => ({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    })),
  };
});

// Mock adventureDatabase
vi.mock("@/data/adventureDatabase", async () => {
  const actual = await vi.importActual("@/data/adventureDatabase");
  return {
    ...actual,
    updateAdventureContent: vi.fn(),
  };
});

describe("AdventureContent Integration", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: undefined, adventureId: TEST_STORY_ID };
    vi.mocked(adventureDatabase.updateAdventureContent).mockResolvedValue();
  });

  describe("Introduction Editing Workflow", () => {
    it("displays introduction content for editing", async () => {
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Check title input
      const titleInput = await screen.findByTestId("introduction-title-input");
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toHaveValue(mockAdventure.metadata.title);

      // Check text input
      const textInput = await screen.findByTestId("introduction-text-input");
      expect(textInput).toBeInTheDocument();
      expect(textInput).toHaveValue(
        mockAdventure.intro.paragraphs.join("\n\n")
      );
    });

    it("allows editing introduction title", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const titleInput = await screen.findByTestId("introduction-title-input");

      // Edit title
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Test Adventure");

      // Verify the value updated
      expect(titleInput).toHaveValue("Updated Test Adventure");
    });

    it("allows editing introduction text", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("introduction-text-input");

      // Edit text
      await user.clear(textInput);
      await user.type(
        textInput,
        "This is updated introduction text.\n\nWith multiple paragraphs."
      );

      // Verify the value updated
      expect(textInput).toHaveValue(
        "This is updated introduction text.\n\nWith multiple paragraphs."
      );
    });

    it("allows resetting introduction changes", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const titleInput = await screen.findByTestId("introduction-title-input");
      const resetButton = await screen.findByTestId("reset-button");

      // Initially reset button should be disabled
      expect(resetButton).toBeDisabled();

      // Make changes
      await user.clear(titleInput);
      await user.type(titleInput, "Changed Title");

      // Reset button should be enabled
      expect(resetButton).not.toBeDisabled();

      // Click reset
      fireEvent.click(resetButton);

      // Title should be back to original
      await waitFor(() => {
        expect(titleInput).toHaveValue(mockAdventure.metadata.title);
      });

      // Reset button should be disabled again
      expect(resetButton).toBeDisabled();
    });
  });

  describe("Passage Editing Workflow", () => {
    it("displays passage content for editing", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Check text input
      const textInput = await screen.findByTestId("passage-text-input");
      expect(textInput).toBeInTheDocument();
      expect(textInput).toHaveValue(
        mockAdventure.passages[1].paragraphs.join("\n\n")
      );

      // Check notes input
      const notesInput = await screen.findByTestId("passage-notes-input");
      expect(notesInput).toBeInTheDocument();
      expect(notesInput).toHaveValue(mockAdventure.passages[1].notes || "");
    });

    it("allows editing passage text", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("passage-text-input");

      // Edit text
      await user.clear(textInput);
      await user.type(textInput, "Updated passage content.");

      // Verify the value updated
      expect(textInput).toHaveValue("Updated passage content.");
    });

    it("allows editing passage notes", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const notesInput = await screen.findByTestId("passage-notes-input");

      // Edit notes
      await user.clear(notesInput);
      await user.type(notesInput, "Updated passage notes for testing.");

      // Verify the value updated
      expect(notesInput).toHaveValue("Updated passage notes for testing.");
    });

    it("allows changing passage type from regular to ending", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const typeSelect = await screen.findByTestId("passage-type-select");

      // Should start as regular
      expect(typeSelect).toHaveTextContent("Regular");

      // Change to ending
      fireEvent.click(typeSelect);
      const endingOption = await screen.findByTestId(
        "passage-type-select-option-ending"
      );
      fireEvent.click(endingOption);

      // Ending type select should appear
      const endingTypeSelect = await screen.findByTestId("ending-type-select");
      expect(endingTypeSelect).toBeInTheDocument();
    });

    it("allows selecting ending type for ending passages", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const typeSelect = await screen.findByTestId("passage-type-select");

      // Change to ending
      fireEvent.click(typeSelect);
      const endingOption = await screen.findByTestId(
        "passage-type-select-option-ending"
      );
      fireEvent.click(endingOption);

      const endingTypeSelect = await screen.findByTestId("ending-type-select");

      // Select victory ending
      fireEvent.click(endingTypeSelect);
      const victoryOption = await screen.findByTestId(
        "ending-type-select-option-victory"
      );
      fireEvent.click(victoryOption);

      expect(endingTypeSelect).toHaveTextContent("Victory");
    });

    it("displays passage type correctly for existing ending passages", async () => {
      mockParams = { id: "4", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const typeSelect = await screen.findByTestId("passage-type-select");
      expect(typeSelect).toHaveTextContent("Ending");

      const endingTypeSelect = await screen.findByTestId("ending-type-select");
      expect(endingTypeSelect).toHaveTextContent("Victory");
    });
  });

  describe("Navigation Between Views", () => {
    it("navigates from introduction to passage view", async () => {
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Wait for introduction to load
      await screen.findByTestId("introduction-title-input");

      // Click passage 1 link
      const passage1Link = screen.getByTestId(getNavigationPassageTestId(1));
      fireEvent.click(passage1Link);

      // Should navigate to passage 1
      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/content/passage/1`
      );
    });

    it("navigates from passage view to another passage", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Wait for passage to load
      await screen.findByTestId("passage-text-input");

      // Click passage 2 link
      const passage2Link = screen.getByTestId(getNavigationPassageTestId(2));
      fireEvent.click(passage2Link);

      // Should navigate to passage 2
      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/content/passage/2`
      );
    });

    it("navigates from passage view back to introduction", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Wait for passage to load
      await screen.findByTestId("passage-text-input");

      // Click introduction link
      const introLink = screen.getByText("Introduction");
      fireEvent.click(introLink);

      // Should navigate to introduction
      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/content/introduction`
      );
    });
  });

  describe("Error Handling", () => {
    it("displays error boundary for non-existent passage", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "999", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorHeading = await screen.findByText(/A system error occurred/);
      expect(errorHeading).toBeInTheDocument();
      const errorMessage = screen.getAllByText(/Passage #999 does not exist/);
      expect(errorMessage.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("displays error boundary for invalid passage ID", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "invalid", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorHeading = await screen.findByText(/A system error occurred/);
      expect(errorHeading).toBeInTheDocument();
      const errorMessage = screen.getAllByText(/is not valid\./);
      expect(errorMessage.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });
  });

  // Note: Data persistence tests removed as they test implementation details
  // (debounced auto-save) rather than user-visible behavior

  describe("Loading States", () => {
    it("renders when adventure data is available", async () => {
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Component renders successfully with data
      expect(
        await screen.findByTestId("introduction-title-input")
      ).toBeInTheDocument();
    });

    it("renders passage when adventure data is available", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Component renders successfully with data
      expect(
        await screen.findByTestId("passage-text-input")
      ).toBeInTheDocument();
    });
  });

  describe("Sidebar Navigation", () => {
    it("displays introduction section", async () => {
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await screen.findByTestId("introduction-title-input");

      // Verify the introduction section is displayed (appears in multiple places)
      const introElements = screen.getAllByText("Introduction");
      expect(introElements.length).toBeGreaterThan(0);
    });

    it("displays passage in sidebar", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await screen.findByTestId("passage-text-input");

      // Verify passage navigation element exists
      const passage1Link = screen.getByTestId(getNavigationPassageTestId(1));
      expect(passage1Link).toBeInTheDocument();
    });

    it("displays all passages in sidebar navigation", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await screen.findByTestId("passage-text-input");

      // Check that all passage links are present
      Object.keys(mockAdventure.passages).forEach((passageId) => {
        const link = screen.getByTestId(
          getNavigationPassageTestId(Number(passageId))
        );
        expect(link).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("does not save when introduction title is empty", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const titleInput = await screen.findByTestId("introduction-title-input");
      const saveButton = await screen.findByTestId("save-button");

      // Clear title
      await user.clear(titleInput);

      // Try to save
      fireEvent.click(saveButton);

      // Should not call database update with empty title
      await waitFor(() => {
        expect(adventureDatabase.updateAdventureContent).not.toHaveBeenCalled();
      });
    });

    it("does not save when introduction text is empty", async () => {
      const user = userEvent.setup();
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("introduction-text-input");
      const saveButton = await screen.findByTestId("save-button");

      // Clear text
      await user.clear(textInput);

      // Try to save
      fireEvent.click(saveButton);

      // Should not call database update with empty text
      await waitFor(() => {
        expect(adventureDatabase.updateAdventureContent).not.toHaveBeenCalled();
      });
    });

    it("does not save when passage text is empty", async () => {
      const user = userEvent.setup();
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const textInput = await screen.findByTestId("passage-text-input");
      const saveButton = await screen.findByRole("button", { name: /save/i });

      // Clear text
      await user.clear(textInput);

      // Try to save
      fireEvent.click(saveButton);

      // Should not call database update with empty text
      await waitFor(() => {
        expect(adventureDatabase.updateAdventureContent).not.toHaveBeenCalled();
      });
    });
  });
});
