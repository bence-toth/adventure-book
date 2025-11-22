import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { Introduction } from "../Introduction";
import { renderWithStory } from "../../../test/testUtils";
import { setupTestStory } from "../../../test/mockStoryData";
import { getPassageRoute, SPECIAL_PASSAGES } from "../../../constants/routes";
import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "../../../constants/testIds";

const TEST_STORY_ID = "test-story-id";

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
  beforeEach(async () => {
    mockNavigate.mockClear();
    await setupTestStory(TEST_STORY_ID);
  });

  it("renders the introduction title", async () => {
    renderWithStory(<Introduction />, { storyId: TEST_STORY_ID });

    const title = await screen.findByTestId(INTRODUCTION_TEST_IDS.TITLE);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Mock Test Adventure");
  });

  it("renders all introduction paragraphs", async () => {
    renderWithStory(<Introduction />, { storyId: TEST_STORY_ID });

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
    renderWithStory(<Introduction />, { storyId: TEST_STORY_ID });

    const button = await screen.findByTestId(
      INTRODUCTION_TEST_IDS.START_BUTTON
    );
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Begin your test adventure");
  });

  it("navigates to passage 1 when start adventure button is clicked", async () => {
    renderWithStory(<Introduction />, { storyId: TEST_STORY_ID });

    const button = await screen.findByTestId(
      INTRODUCTION_TEST_IDS.START_BUTTON
    );
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(
      getPassageRoute(TEST_STORY_ID, SPECIAL_PASSAGES.START)
    );
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("has correct CSS classes applied", async () => {
    renderWithStory(<Introduction />, { storyId: TEST_STORY_ID });

    const container = await screen.findByTestId(
      INTRODUCTION_TEST_IDS.CONTAINER
    );
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("introduction");
  });
});
