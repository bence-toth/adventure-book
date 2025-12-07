import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { AdventureTest } from "../AdventureTest";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import {
  INTRODUCTION_TEST_IDS,
  PASSAGE_TEST_IDS,
  getChoiceButtonTestId,
} from "../testIds";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom
const mockNavigate = vi.fn();
let mockParams = {
  id: undefined as string | undefined,
  adventureId: TEST_STORY_ID,
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

describe("AdventureTest Integration", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: undefined, adventureId: TEST_STORY_ID };
  });

  describe("Complete Adventure Flow", () => {
    it("displays introduction and navigates to first passage", async () => {
      // Start at introduction
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Verify introduction displays correctly
      const title = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(mockAdventure.metadata.title);

      const startButton = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.START_BUTTON
      );
      expect(startButton).toBeInTheDocument();

      // Start the adventure
      fireEvent.click(startButton);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/test/passage/1`
      );
    });

    it("navigates through passages via choices", async () => {
      // Start at passage 1
      mockParams = { id: "1", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const passageContainer = await screen.findByTestId(
        PASSAGE_TEST_IDS.CONTAINER
      );
      expect(passageContainer).toBeInTheDocument();
      expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();

      // Select first choice to go to passage 2
      const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
      expect(firstChoice).toHaveTextContent("Go to mock passage 2");
      fireEvent.click(firstChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/test/passage/2`
      );
    });

    it("navigates from passage to ending", async () => {
      // Start at passage 2
      mockParams = { id: "2", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 2/)).toBeInTheDocument();
      });

      // Continue to ending
      const continueChoice = await screen.findByTestId(
        getChoiceButtonTestId(0)
      );
      expect(continueChoice).toHaveTextContent("Continue to ending");
      fireEvent.click(continueChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/test/passage/4`
      );
    });

    it("displays ending passage with restart option", async () => {
      // Start at ending
      mockParams = { id: "4", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(
          screen.getByText(/This is the mock ending passage/)
        ).toBeInTheDocument();
      });

      // Verify ending UI elements
      expect(screen.getByText(/Congratulations/)).toBeInTheDocument();
      const restartButton = await screen.findByTestId(
        PASSAGE_TEST_IDS.RESTART_BUTTON
      );
      expect(restartButton).toBeInTheDocument();
    });

    it("navigates through alternative adventure paths", async () => {
      // Start at passage 1
      mockParams = { id: "1", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();
      });

      // Select second choice to go to passage 3
      const secondChoice = await screen.findByTestId(getChoiceButtonTestId(1));
      expect(secondChoice).toHaveTextContent("Go to mock passage 3");
      fireEvent.click(secondChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/test/passage/3`
      );

      // Navigate to passage 3
      mockParams = { id: "3", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 3/)).toBeInTheDocument();
      });
    });

    it("allows returning to previous passages", async () => {
      // Start at passage 2
      mockParams = { id: "2", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 2/)).toBeInTheDocument();
      });

      // Go back to passage 1
      const backChoice = await screen.findByTestId(getChoiceButtonTestId(1));
      expect(backChoice).toHaveTextContent("Go back to passage 1");
      fireEvent.click(backChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/test/passage/1`
      );
    });

    it("handles restart from ending passage", async () => {
      // Start at ending passage
      mockParams = { id: "4", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(
          screen.getByText(/This is the mock ending passage/)
        ).toBeInTheDocument();
      });

      // Click restart button
      const restartButton = await screen.findByTestId(
        PASSAGE_TEST_IDS.RESTART_BUTTON
      );
      fireEvent.click(restartButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/test/introduction`
      );
    });
  });

  describe("Error Handling", () => {
    it("renders error boundary for non-existent passage", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "999", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureTest />
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

    it("renders error boundary for invalid passage ID", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "invalid", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureTest />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorHeading = await screen.findByText(/A system error occurred/);
      expect(errorHeading).toBeInTheDocument();

      const errorMessage = screen.getAllByText(
        /is not valid\. Please use a valid number/
      );
      expect(errorMessage.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });

    it("renders error boundary for negative passage IDs", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "-1", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureTest />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorHeading = await screen.findByText(/A system error occurred/);
      expect(errorHeading).toBeInTheDocument();

      const errorMessage = screen.getAllByText(
        /is not valid\. Please use a valid number/
      );
      expect(errorMessage.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });
  });

  describe("Different Ending Types", () => {
    it("displays victory ending correctly", async () => {
      mockParams = { id: "4", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(
          screen.getByText(/This is the mock ending passage/)
        ).toBeInTheDocument();
      });

      expect(screen.getByText(/Congratulations/)).toBeInTheDocument();
    });

    it("displays defeat ending correctly", async () => {
      mockParams = { id: "5", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(
          screen.getByText(/This is another mock ending passage/)
        ).toBeInTheDocument();
      });
    });

    it("displays neutral ending correctly", async () => {
      mockParams = { id: "6", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(
          screen.getByText(/This is a neutral mock ending passage/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Passage Navigation Patterns", () => {
    it("handles circular navigation (loops between passages)", async () => {
      // Test starts at passage 1
      mockParams = { id: "1", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();
      });

      // Click choice to navigate to passage 2
      const choice1 = await screen.findByTestId(getChoiceButtonTestId(0));
      expect(choice1).toHaveTextContent("Go to mock passage 2");
      fireEvent.click(choice1);

      // Verify navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/test/passage/2`
      );

      // Note: Passage 2 has a "Go back to passage 1" choice, demonstrating
      // that circular navigation between different passages is supported
    });

    it("displays passage notes when available", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();
      });

      // In debug mode, notes should be visible
      const notesElement = screen.getByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notesElement).toBeInTheDocument();
      expect(notesElement).toHaveTextContent(
        "Initial passage for testing. Offers three choices."
      );
    });

    it("handles passages without notes", async () => {
      mockParams = { id: "3", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 3/)).toBeInTheDocument();
      });

      // Passage 3 has no notes, so notes element shouldn't be present
      const notesElement = screen.queryByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notesElement).not.toBeInTheDocument();
    });
  });

  describe("Introduction Behavior", () => {
    it("displays all introduction elements", async () => {
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Check title
      const title = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
      expect(title).toHaveTextContent(mockAdventure.metadata.title);

      // Check introduction text
      const text = await screen.findByTestId(INTRODUCTION_TEST_IDS.TEXT);
      expect(text).toBeInTheDocument();

      // Check start button
      const startButton = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.START_BUTTON
      );
      expect(startButton).toBeInTheDocument();
    });

    it("renders all introduction paragraphs", async () => {
      mockParams = { id: undefined, adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await screen.findByTestId(INTRODUCTION_TEST_IDS.CONTAINER);

      // Verify all paragraphs are rendered
      mockAdventure.intro.paragraphs.forEach((paragraph) => {
        expect(screen.getByText(paragraph)).toBeInTheDocument();
      });
    });
  });

  describe("Choice Interaction", () => {
    it("renders all available choices", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();
      });

      // Passage 1 has 3 choices
      const choice0 = await screen.findByTestId(getChoiceButtonTestId(0));
      const choice1 = await screen.findByTestId(getChoiceButtonTestId(1));
      const choice2 = await screen.findByTestId(getChoiceButtonTestId(2));

      expect(choice0).toBeInTheDocument();
      expect(choice1).toBeInTheDocument();
      expect(choice2).toBeInTheDocument();
    });

    it("displays correct choice text", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();
      });

      expect(screen.getByText("Go to mock passage 2")).toBeInTheDocument();
      expect(screen.getByText("Go to mock passage 3")).toBeInTheDocument();
      expect(screen.getByText("Continue to ending")).toBeInTheDocument();
    });

    it("does not render choices on ending passages", async () => {
      mockParams = { id: "4", adventureId: TEST_STORY_ID };
      renderWithAdventure(<AdventureTest />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      await waitFor(() => {
        expect(
          screen.getByText(/This is the mock ending passage/)
        ).toBeInTheDocument();
      });

      // Ending passages should not have choice buttons
      const choice0 = screen.queryByTestId(getChoiceButtonTestId(0));
      expect(choice0).not.toBeInTheDocument();
    });
  });
});
