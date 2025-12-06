import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PassageView } from "../PassageView";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import {
  PASSAGE_TEST_IDS,
  getPassageParagraphTestId,
  getChoiceButtonTestId,
} from "../../testIds";
import type { Passage } from "@/data/types";

describe("PassageView Component", () => {
  const mockOnChoiceClick = vi.fn();
  const mockOnRestart = vi.fn();

  const normalPassage = mockAdventure.passages[1];
  const endingPassage = mockAdventure.passages[4];
  const passageWithoutNotes: Passage = {
    paragraphs: ["Passage without notes", "For testing"],
    choices: [{ text: "Test choice", goto: 2 }],
  };

  beforeEach(() => {
    mockOnChoiceClick.mockClear();
    mockOnRestart.mockClear();
  });

  describe("Normal Passages", () => {
    it("renders passage paragraphs", () => {
      render(
        <PassageView
          passage={normalPassage}
          isDebugModeEnabled={false}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      normalPassage.paragraphs.forEach((_, index) => {
        const paragraph = screen.getByTestId(getPassageParagraphTestId(index));
        expect(paragraph).toBeInTheDocument();
      });
    });

    it("renders choice buttons without debug mode", () => {
      render(
        <PassageView
          passage={normalPassage}
          isDebugModeEnabled={false}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const firstChoice = screen.getByTestId(getChoiceButtonTestId(0));
      expect(firstChoice).toHaveTextContent("Go to mock passage 2");
      expect(firstChoice).not.toHaveTextContent("2: Go to mock passage 2");
    });

    it("renders choice buttons with debug mode enabled", () => {
      render(
        <PassageView
          passage={normalPassage}
          isDebugModeEnabled={true}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const firstChoice = screen.getByTestId(getChoiceButtonTestId(0));
      expect(firstChoice).toHaveTextContent("2: Go to mock passage 2");
    });

    it("calls onChoiceClick with correct passage ID", () => {
      render(
        <PassageView
          passage={normalPassage}
          isDebugModeEnabled={false}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const firstChoice = screen.getByTestId(getChoiceButtonTestId(0));
      fireEvent.click(firstChoice);

      expect(mockOnChoiceClick).toHaveBeenCalledWith(2);
    });

    it("renders notes when debug mode is enabled and notes exist", () => {
      const passageWithNotes: Passage = {
        ...normalPassage,
        notes: "Test notes for developers",
      };

      render(
        <PassageView
          passage={passageWithNotes}
          isDebugModeEnabled={true}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const notes = screen.getByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).toBeInTheDocument();
      expect(notes).toHaveTextContent("Test notes for developers");
    });

    it("does not render notes when debug mode is disabled", () => {
      const passageWithNotes: Passage = {
        ...normalPassage,
        notes: "Test notes for developers",
      };

      render(
        <PassageView
          passage={passageWithNotes}
          isDebugModeEnabled={false}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const notes = screen.queryByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).not.toBeInTheDocument();
    });

    it("does not render notes when passage has no notes", () => {
      render(
        <PassageView
          passage={passageWithoutNotes}
          isDebugModeEnabled={true}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const notes = screen.queryByTestId(PASSAGE_TEST_IDS.NOTES);
      expect(notes).not.toBeInTheDocument();
    });
  });

  describe("Ending Passages", () => {
    it("renders restart button for ending passages", () => {
      render(
        <PassageView
          passage={endingPassage}
          isDebugModeEnabled={false}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const restartButton = screen.getByTestId(PASSAGE_TEST_IDS.RESTART_BUTTON);
      expect(restartButton).toBeInTheDocument();
      expect(restartButton).toHaveTextContent("Restart adventure");
    });

    it("calls onRestart when restart button is clicked", () => {
      render(
        <PassageView
          passage={endingPassage}
          isDebugModeEnabled={false}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const restartButton = screen.getByTestId(PASSAGE_TEST_IDS.RESTART_BUTTON);
      fireEvent.click(restartButton);

      expect(mockOnRestart).toHaveBeenCalledTimes(1);
    });

    it("does not render choice buttons for ending passages", () => {
      render(
        <PassageView
          passage={endingPassage}
          isDebugModeEnabled={false}
          onChoiceClick={mockOnChoiceClick}
          onRestart={mockOnRestart}
        />
      );

      const choiceButton = screen.queryByTestId(getChoiceButtonTestId(0));
      expect(choiceButton).not.toBeInTheDocument();
    });
  });

  it("renders container with correct test ID", () => {
    render(
      <PassageView
        passage={normalPassage}
        isDebugModeEnabled={false}
        onChoiceClick={mockOnChoiceClick}
        onRestart={mockOnRestart}
      />
    );

    const container = screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER);
    expect(container).toBeInTheDocument();
  });
});
