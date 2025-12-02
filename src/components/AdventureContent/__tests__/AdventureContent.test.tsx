import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getAdventureContentPassageRoute } from "@/constants/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import {
  PASSAGE_TEST_IDS,
  INTRODUCTION_TEST_IDS,
  getPassageParagraphTestId,
  getIntroParagraphTestId,
  getChoiceButtonTestId,
} from "@/constants/testIds";
import type { Adventure } from "@/data/types";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
let mockParams = { id: "1", adventureId: TEST_STORY_ID };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

// Mock adventureLoader
vi.mock("@/data/adventureLoader", async () => {
  const actual = await vi.importActual("@/data/adventureLoader");
  return {
    ...actual,
    addItemToInventory: vi.fn(),
    removeItemFromInventory: vi.fn(),
  };
});

describe("AdventureContent Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("Introduction Mode", () => {
    it("renders introduction when no passage id is provided", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const introContainer = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.CONTAINER
      );
      expect(introContainer).toBeInTheDocument();

      const introTitle = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
      expect(introTitle).toBeInTheDocument();
      expect(introTitle).toHaveTextContent(mockAdventure.metadata.title);

      const introText = await screen.findByTestId(INTRODUCTION_TEST_IDS.TEXT);
      expect(introText).toBeInTheDocument();
    });

    it("renders all introduction paragraphs", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Check that the correct number of paragraphs are rendered
      const expectedParagraphs = [
        "This is the first mock introduction paragraph.",
        "This is the second mock introduction paragraph.",
        "This is the third mock introduction paragraph.",
      ];

      for (let index = 0; index < expectedParagraphs.length; index++) {
        const paragraph = await screen.findByTestId(
          getIntroParagraphTestId(index)
        );
        expect(paragraph).toBeInTheDocument();
        expect(paragraph).toHaveTextContent(expectedParagraphs[index]);
      }
    });

    it("renders start adventure button in introduction mode", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const button = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.START_BUTTON
      );
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Begin your test adventure");
    });

    it("navigates to passage 1 when start button is clicked in introduction mode", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const button = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.START_BUTTON
      );
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureContentPassageRoute(TEST_STORY_ID, 1)
      );
    });

    it("shows loading message in introduction mode while adventure is loading", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      const container = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.CONTAINER
      );
      expect(container).toHaveTextContent("Loading adventure...");
    });
  });

  it("renders the first passage correctly", async () => {
    renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    const passage = await screen.findByTestId(PASSAGE_TEST_IDS.CONTAINER);
    expect(passage).toBeInTheDocument();

    const passageText = await screen.findByTestId(PASSAGE_TEST_IDS.TEXT);
    expect(passageText).toBeInTheDocument();

    // Check that paragraphs are rendered
    expect(
      await screen.findByTestId(getPassageParagraphTestId(0))
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId(getPassageParagraphTestId(1))
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId(getPassageParagraphTestId(2))
    ).toBeInTheDocument();

    // Check that choices are rendered
    expect(
      await screen.findByTestId(getChoiceButtonTestId(0))
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId(getChoiceButtonTestId(1))
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId(getChoiceButtonTestId(2))
    ).toBeInTheDocument();
  });

  it("navigates to correct passage when choice is clicked", async () => {
    renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
    expect(firstChoice).toHaveAttribute("data-goto", "2");

    fireEvent.click(firstChoice);

    expect(mockNavigate).toHaveBeenCalledWith(
      getAdventureContentPassageRoute(TEST_STORY_ID, 2)
    );
  });

  it("renders multiple paragraphs correctly", async () => {
    renderWithAdventure(<AdventureContent />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    const paragraphs = [
      await screen.findByTestId(getPassageParagraphTestId(0)),
      await screen.findByTestId(getPassageParagraphTestId(1)),
      await screen.findByTestId(getPassageParagraphTestId(2)),
    ];

    paragraphs.forEach((paragraph) => {
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe("Ending Passages", () => {
    it("renders restart button for ending passages", async () => {
      mockParams = { id: "4", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const restartButton = await screen.findByTestId(
        PASSAGE_TEST_IDS.RESTART_BUTTON
      );
      expect(restartButton).toBeInTheDocument();
      expect(restartButton).toHaveTextContent("Restart adventure");
    });
  });

  describe("Error Handling", () => {
    it("renders introduction view when id param is undefined", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Should render introduction instead of throwing an error
      const introContainer = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.CONTAINER
      );
      expect(introContainer).toBeInTheDocument();

      const introTitle = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
      expect(introTitle).toBeInTheDocument();
      expect(introTitle).toHaveTextContent(mockAdventure.metadata.title);

      const startButton = await screen.findByTestId(
        INTRODUCTION_TEST_IDS.START_BUTTON
      );
      expect(startButton).toBeInTheDocument();
    });

    it("throws AdventureLoadError when there is a load error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          error: "Failed to load adventure",
        }
      );

      expect(
        (await screen.findAllByText("Failed to load adventure")).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws AdventureNotFoundError when adventure is not found", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: null,
        }
      );

      expect(
        (await screen.findAllByText("Adventure not found.")).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws InvalidPassageIdError for non-numeric passage IDs", async () => {
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

      const errorMessages = await screen.findAllByText(/is not valid/);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws InvalidPassageIdError for negative passage IDs", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockParams = { id: "-5", adventureId: TEST_STORY_ID };

      renderWithAdventure(
        <ErrorBoundary>
          <AdventureContent />
        </ErrorBoundary>,
        {
          adventureId: TEST_STORY_ID,
          adventure: mockAdventure,
        }
      );

      const errorMessages = await screen.findAllByText(/is not valid/);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("throws PassageNotFoundError when passage does not exist", async () => {
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

      const errorMessages = await screen.findAllByText(/does not exist/);
      expect(errorMessages.length).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe("Loading State", () => {
    it("shows loading message while adventure is loading", async () => {
      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      const container = await screen.findByTestId(PASSAGE_TEST_IDS.CONTAINER);
      expect(container).toHaveTextContent("Loading passage...");
    });
  });

  describe("Debug Mode Choice Display", () => {
    it("shows choice text with passage ID prefix (always enabled in content view)", async () => {
      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
      const secondChoice = await screen.findByTestId(getChoiceButtonTestId(1));
      const thirdChoice = await screen.findByTestId(getChoiceButtonTestId(2));

      expect(firstChoice).toHaveTextContent("2: Go to mock passage 2");
      expect(secondChoice).toHaveTextContent("3: Go to mock passage 3");
      expect(thirdChoice).toHaveTextContent("1: Return to start");
    });

    it("maintains correct navigation", async () => {
      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
      expect(firstChoice).toHaveTextContent("2: Go to mock passage 2");
      expect(firstChoice).toHaveAttribute("data-goto", "2");

      fireEvent.click(firstChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureContentPassageRoute(TEST_STORY_ID, 2)
      );
    });

    it("formats multi-digit passage IDs correctly in debug mode", async () => {
      const adventureWithHighPassageIds: Adventure = {
        ...mockAdventure,
        passages: {
          ...mockAdventure.passages,
          1: {
            paragraphs: ["Test passage"],
            choices: [
              { text: "Go to passage 42", goto: 42 },
              { text: "Go to passage 123", goto: 123 },
            ],
          },
        },
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: adventureWithHighPassageIds,
        isDebugModeEnabled: true,
      });

      const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
      const secondChoice = await screen.findByTestId(getChoiceButtonTestId(1));

      expect(firstChoice).toHaveTextContent("42: Go to passage 42");
      expect(secondChoice).toHaveTextContent("123: Go to passage 123");
    });
  });
});
