import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { IntroductionView } from "../IntroductionView";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import {
  INTRODUCTION_TEST_IDS,
  getIntroParagraphTestId,
} from "@/constants/testIds";

describe("IntroductionView Component", () => {
  const mockOnStart = vi.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
  });

  it("renders adventure title", () => {
    render(
      <IntroductionView adventure={mockAdventure} onStart={mockOnStart} />
    );

    const title = screen.getByTestId(INTRODUCTION_TEST_IDS.TITLE);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(mockAdventure.metadata.title);
  });

  it("renders all introduction paragraphs", () => {
    render(
      <IntroductionView adventure={mockAdventure} onStart={mockOnStart} />
    );

    const expectedParagraphs = [
      "This is the first mock introduction paragraph.",
      "This is the second mock introduction paragraph.",
      "This is the third mock introduction paragraph.",
    ];

    expectedParagraphs.forEach((text, index) => {
      const paragraph = screen.getByTestId(getIntroParagraphTestId(index));
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent(text);
    });
  });

  it("renders start button with correct text", () => {
    render(
      <IntroductionView adventure={mockAdventure} onStart={mockOnStart} />
    );

    const button = screen.getByTestId(INTRODUCTION_TEST_IDS.START_BUTTON);
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Begin your test adventure");
  });

  it("calls onStart when start button is clicked", () => {
    render(
      <IntroductionView adventure={mockAdventure} onStart={mockOnStart} />
    );

    const button = screen.getByTestId(INTRODUCTION_TEST_IDS.START_BUTTON);
    fireEvent.click(button);

    expect(mockOnStart).toHaveBeenCalledTimes(1);
  });

  it("renders container with correct test ID", () => {
    render(
      <IntroductionView adventure={mockAdventure} onStart={mockOnStart} />
    );

    const container = screen.getByTestId(INTRODUCTION_TEST_IDS.CONTAINER);
    expect(container).toBeInTheDocument();
  });
});
