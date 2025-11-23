import { screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { Passage } from "../Passage";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { setupTestAdventure } from "@/__tests__/mockAdventureData";
import { getPassageRoute } from "@/constants/routes";
import {
  PASSAGE_TEST_IDS,
  getPassageParagraphTestId,
  getChoiceButtonTestId,
} from "@/constants/testIds";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1", adventureId: TEST_STORY_ID }),
  };
});

describe("Passage Component", () => {
  beforeEach(async () => {
    mockNavigate.mockClear();
    await setupTestAdventure(TEST_STORY_ID);
  });

  it("renders the first passage correctly", async () => {
    renderWithAdventure(<Passage />, { adventureId: TEST_STORY_ID });

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
    renderWithAdventure(<Passage />, { adventureId: TEST_STORY_ID });

    const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
    expect(firstChoice).toHaveAttribute("data-goto", "2");

    fireEvent.click(firstChoice);

    expect(mockNavigate).toHaveBeenCalledWith(
      getPassageRoute(TEST_STORY_ID, 2)
    );
  });

  it("renders multiple paragraphs correctly", async () => {
    renderWithAdventure(<Passage />, { adventureId: TEST_STORY_ID });

    const paragraphs = [
      await screen.findByTestId(getPassageParagraphTestId(0)),
      await screen.findByTestId(getPassageParagraphTestId(1)),
      await screen.findByTestId(getPassageParagraphTestId(2)),
    ];

    paragraphs.forEach((paragraph) => {
      expect(paragraph).toBeInTheDocument();
    });
  });
});
