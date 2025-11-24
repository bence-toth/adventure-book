import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { Introduction } from "../Introduction";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { getPassageRoute, SPECIAL_PASSAGES } from "@/constants/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "@/constants/testIds";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Introduction Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the introduction title", async () => {
    renderWithAdventure(<Introduction />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    const title = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Mock Test Adventure");
  });

  it("renders all introduction paragraphs", async () => {
    renderWithAdventure(<Introduction />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    const introText = await screen.findByTestId(INTRODUCTION_TEST_IDS.TEXT);
    expect(introText).toBeInTheDocument();

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

  it("renders the start adventure button with correct text", async () => {
    renderWithAdventure(<Introduction />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    const button = await screen.findByTestId(
      INTRODUCTION_TEST_IDS.START_BUTTON
    );
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Begin your test adventure");
  });

  it("navigates to passage 1 when start adventure button is clicked", async () => {
    renderWithAdventure(<Introduction />, {
      adventureId: TEST_STORY_ID,
      adventure: mockAdventure,
    });

    const button = await screen.findByTestId(
      INTRODUCTION_TEST_IDS.START_BUTTON
    );
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(
      getPassageRoute(TEST_STORY_ID, SPECIAL_PASSAGES.START)
    );
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  describe("Error Handling", () => {
    it("throws AdventureLoadError when there is a load error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderWithAdventure(
        <ErrorBoundary>
          <Introduction />
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
          <Introduction />
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
  });
});
