import { screen, fireEvent } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "../App";
import { getPassageRoute } from "../constants/routes";
import {
  INTRODUCTION_TEST_IDS,
  PASSAGE_TEST_IDS,
  ERROR_TEST_IDS,
  getPassageParagraphTestId,
  getChoiceButtonTestId,
} from "../constants/testIds";

// Mock the story loader to return stable test data
vi.mock("../data/storyLoader", () => ({
  introduction: {
    title: "Test Adventure",
    paragraphs: [
      "This is a test introduction paragraph.",
      "This is a second test paragraph.",
      "This is a third test paragraph.",
    ],
    action: "Begin your adventure",
  },
  getPassage: (id: number) => {
    interface MockPassage {
      text: string;
      paragraphs: string[];
      choices?: { text: string; goto: number }[];
      ending?: boolean;
      type?: string;
    }

    const mockPassages: Record<number, MockPassage> = {
      1: {
        text: "This is test passage 1.\n\nIt has multiple paragraphs.\n\nChoose your path.",
        paragraphs: [
          "This is test passage 1.",
          "It has multiple paragraphs.",
          "Choose your path.",
        ],
        choices: [
          { text: "Go to passage 2", goto: 2 },
          { text: "Go to passage 3", goto: 3 },
          { text: "Return to start", goto: 1 },
        ],
      },
      2: {
        text: "This is test passage 2.\n\nYou made choice 1.",
        paragraphs: ["This is test passage 2.", "You made choice 1."],
        choices: [
          { text: "Continue to passage 4", goto: 4 },
          { text: "Go back to passage 1", goto: 1 },
        ],
      },
      3: {
        text: "This is test passage 3.\n\nYou made choice 2.",
        paragraphs: ["This is test passage 3.", "You made choice 2."],
        choices: [
          { text: "Continue to passage 4", goto: 4 },
          { text: "Go back to passage 1", goto: 1 },
        ],
      },
      4: {
        text: "This is the ending passage.\n\nCongratulations on completing the test adventure!",
        paragraphs: [
          "This is the ending passage.",
          "Congratulations on completing the test adventure!",
        ],
        choices: [{ text: "Start new adventure", goto: 1 }],
        ending: true,
        type: "victory",
      },
    };
    return mockPassages[id];
  },
}));

describe("Adventure Book Integration Tests", () => {
  const renderApp = () => {
    return rtlRender(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
  };

  it("completes a full adventure flow", () => {
    renderApp();

    // Start at introduction
    expect(screen.getByTestId(INTRODUCTION_TEST_IDS.TITLE)).toBeInTheDocument();
    expect(screen.getByTestId(INTRODUCTION_TEST_IDS.TITLE)).toHaveTextContent(
      "Test Adventure"
    );

    // Click start adventure
    const startButton = screen.getByTestId(INTRODUCTION_TEST_IDS.START_BUTTON);
    fireEvent.click(startButton);

    // Should be at passage 1
    expect(screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER)).toBeInTheDocument();
    expect(screen.getByTestId(getPassageParagraphTestId(0))).toHaveTextContent(
      "This is test passage 1."
    );

    // Choose the first choice (go to passage 2)
    const firstChoice = screen.getByTestId(getChoiceButtonTestId(0));
    expect(firstChoice).toHaveAttribute("data-goto", "2");
    fireEvent.click(firstChoice);

    // Should be at passage 2
    expect(screen.getByTestId(getPassageParagraphTestId(0))).toHaveTextContent(
      "This is test passage 2."
    );

    // Choose the first choice (go to passage 4)
    const nextChoice = screen.getByTestId(getChoiceButtonTestId(0));
    expect(nextChoice).toHaveAttribute("data-goto", "4");
    fireEvent.click(nextChoice);

    // Should be at ending passage 4
    expect(screen.getByTestId(getPassageParagraphTestId(0))).toHaveTextContent(
      "This is the ending passage."
    );
    expect(
      screen.getByTestId(PASSAGE_TEST_IDS.RESTART_BUTTON)
    ).toBeInTheDocument();
  });

  it("handles error states in the flow", () => {
    rtlRender(
      <MemoryRouter initialEntries={[getPassageRoute("invalid")]}>
        <App />
      </MemoryRouter>
    );

    // Should show error page with invalid passage ID
    expect(screen.getByTestId(ERROR_TEST_IDS.INVALID_ID)).toBeInTheDocument();
    expect(screen.getByText("Invalid passage ID")).toBeInTheDocument();
    expect(screen.getByText(/is not valid/)).toBeInTheDocument();

    // Should have button to go back to introduction
    const goHomeButton = screen.getByTestId(
      ERROR_TEST_IDS.GO_TO_INTRODUCTION_BUTTON
    );
    expect(goHomeButton).toBeInTheDocument();
  });

  it("navigates through different story paths", () => {
    rtlRender(
      <MemoryRouter initialEntries={[getPassageRoute(1)]}>
        <App />
      </MemoryRouter>
    );

    // From passage 1, choose second option (go to passage 3)
    const secondChoice = screen.getByTestId(getChoiceButtonTestId(1));
    expect(secondChoice).toHaveAttribute("data-goto", "3");
    fireEvent.click(secondChoice);

    // Should be at passage 3
    expect(screen.getByTestId(getPassageParagraphTestId(0))).toHaveTextContent(
      "This is test passage 3."
    );

    // Check that choices are available
    expect(screen.getByTestId(getChoiceButtonTestId(0))).toBeInTheDocument();
    expect(screen.getByTestId(getChoiceButtonTestId(1))).toBeInTheDocument();
  });

  it("handles the ending passage correctly", () => {
    rtlRender(
      <MemoryRouter initialEntries={[getPassageRoute(4)]}>
        <App />
      </MemoryRouter>
    );

    // Should show ending passage
    expect(screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER)).toBeInTheDocument();
    expect(screen.getByTestId(getPassageParagraphTestId(0))).toHaveTextContent(
      "This is the ending passage."
    );

    // Should have restart button
    expect(
      screen.getByTestId(PASSAGE_TEST_IDS.RESTART_BUTTON)
    ).toBeInTheDocument();
  });

  it("maintains consistent styling across all pages", () => {
    // Test introduction styling
    renderApp();
    expect(
      screen.getByTestId(INTRODUCTION_TEST_IDS.CONTAINER)
    ).toBeInTheDocument();
    expect(screen.getByTestId(INTRODUCTION_TEST_IDS.CONTAINER)).toHaveClass(
      "introduction"
    );

    // Test passage styling
    rtlRender(
      <MemoryRouter initialEntries={[getPassageRoute(1)]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER)).toBeInTheDocument();
    expect(screen.getByTestId(PASSAGE_TEST_IDS.CONTAINER)).toHaveClass(
      "passage"
    );

    // Test error styling
    rtlRender(
      <MemoryRouter initialEntries={[getPassageRoute(999)]}>
        <App />
      </MemoryRouter>
    );
    expect(
      screen.getByTestId(ERROR_TEST_IDS.PASSAGE_NOT_FOUND)
    ).toBeInTheDocument();
    expect(screen.getByTestId(ERROR_TEST_IDS.PASSAGE_NOT_FOUND)).toHaveClass(
      "error"
    );
  });
});
