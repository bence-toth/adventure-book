import { screen } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { TestAdventure } from "../TestAdventure";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import {} from "@/constants/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { INTRODUCTION_TEST_IDS } from "../testIds";

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

describe("TestAdventure Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("Error Handling", () => {
    it("renders introduction view when id param is undefined", async () => {
      mockParams = {
        id: undefined as unknown as string,
        adventureId: TEST_STORY_ID,
      };

      renderWithAdventure(<TestAdventure />, {
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
          <TestAdventure />
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
          <TestAdventure />
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
          <TestAdventure />
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
          <TestAdventure />
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
          <TestAdventure />
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
});
