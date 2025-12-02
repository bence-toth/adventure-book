import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { AdventureContent } from "../AdventureContent";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getAdventureContentPassageRoute } from "@/constants/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import {
  INTRODUCTION_TEST_IDS,
  getChoiceButtonTestId,
} from "@/constants/testIds";

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

  describe("Debug Mode Choice Display", () => {
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
  });

  describe("Loading State", () => {
    it("renders loading state when adventure is loading", async () => {
      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      // Should render the loading state component
      const loadingElement = await screen.findByTestId("loading-state");
      expect(loadingElement).toBeInTheDocument();
    });

    it("renders loading state for introduction when no passage ID is provided", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      const loadingElement = await screen.findByTestId("loading-state");
      expect(loadingElement).toBeInTheDocument();
    });
  });

  describe("Restart Functionality", () => {
    it("navigates to introduction when restart button is clicked", async () => {
      mockParams = { id: "4", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
      });

      // Wait for passage to load
      const passageElement = await screen.findByTestId("passage-view");
      expect(passageElement).toBeInTheDocument();

      // Click restart button
      const restartButton = screen.getByRole("button", { name: /restart/i });
      fireEvent.click(restartButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/adventure/${TEST_STORY_ID}/content/introduction`
      );
    });
  });

  describe("Loading State with isIntroduction", () => {
    it("renders loading state for passage view", async () => {
      mockParams = { id: "1", adventureId: TEST_STORY_ID };

      renderWithAdventure(<AdventureContent />, {
        adventureId: TEST_STORY_ID,
        isLoading: true,
      });

      const loadingElement = await screen.findByTestId("loading-state");
      expect(loadingElement).toBeInTheDocument();
      expect(loadingElement).toHaveTextContent("Loading passage...");
    });
  });
});
