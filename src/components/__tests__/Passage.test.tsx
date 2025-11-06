import { screen, fireEvent } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import { Passage } from "../Passage";

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the story loader to return stable test data
vi.mock("../../data/storyLoader", () => ({
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

// Custom render with specific route
const renderWithRoute = (initialRoute: string) => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/passage/:id" element={<Passage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Passage Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the first passage correctly", () => {
    renderWithRoute("/passage/1");

    const passage = screen.getByTestId("passage");
    expect(passage).toBeInTheDocument();

    const passageText = screen.getByTestId("passage-text");
    expect(passageText).toBeInTheDocument();

    // Check that paragraphs are rendered
    expect(screen.getByTestId("passage-paragraph-0")).toBeInTheDocument();
    expect(screen.getByTestId("passage-paragraph-1")).toBeInTheDocument();
    expect(screen.getByTestId("passage-paragraph-2")).toBeInTheDocument();

    // Check that choices are rendered
    expect(screen.getByTestId("choice-button-0")).toBeInTheDocument();
    expect(screen.getByTestId("choice-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("choice-button-2")).toBeInTheDocument();
  });

  it("navigates to correct passage when choice is clicked", () => {
    renderWithRoute("/passage/1");

    const firstChoice = screen.getByTestId("choice-button-0");
    expect(firstChoice).toHaveAttribute("data-goto", "2");

    fireEvent.click(firstChoice);

    expect(mockNavigate).toHaveBeenCalledWith("/passage/2");
  });

  it("shows error for invalid passage ID", () => {
    renderWithRoute("/passage/invalid");

    const errorDiv = screen.getByTestId("error-invalid-id");
    expect(errorDiv).toBeInTheDocument();

    expect(screen.getByText("Invalid passage ID")).toBeInTheDocument();
    expect(
      screen.getByText(/The passage ID “invalid” is not valid/)
    ).toBeInTheDocument();

    const goHomeButton = screen.getByTestId("go-to-introduction-button");
    expect(goHomeButton).toBeInTheDocument();
  });

  it("shows error for non-existent passage ID", () => {
    renderWithRoute("/passage/999");

    const errorDiv = screen.getByTestId("error-passage-not-found");
    expect(errorDiv).toBeInTheDocument();

    expect(screen.getByText("Passage not found")).toBeInTheDocument();
    expect(screen.getByText(/Passage #999 does not exist/)).toBeInTheDocument();

    const goHomeButton = screen.getByTestId("go-to-introduction-button");
    expect(goHomeButton).toBeInTheDocument();
  });

  it('navigates to introduction when "Go to Introduction" is clicked', () => {
    renderWithRoute("/passage/invalid");

    const goHomeButton = screen.getByTestId("go-to-introduction-button");
    fireEvent.click(goHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/passage/0");
  });

  it("renders passage with single choice correctly (ending passage)", () => {
    renderWithRoute("/passage/4"); // This passage is an ending passage

    const passage = screen.getByTestId("passage");
    expect(passage).toBeInTheDocument();

    // Check that this is the ending passage
    expect(screen.getByTestId("passage-paragraph-0")).toBeInTheDocument();
    expect(screen.getByTestId("passage-paragraph-1")).toBeInTheDocument();

    // Should have restart button instead of choices
    const restartButton = screen.getByTestId("restart-button");
    expect(restartButton).toBeInTheDocument();
    expect(restartButton).toHaveTextContent("Restart adventure");
  });

  it("handles negative passage IDs as invalid", () => {
    renderWithRoute("/passage/-1");

    const errorDiv = screen.getByTestId("error-invalid-id");
    expect(errorDiv).toBeInTheDocument();
    expect(screen.getByText("Invalid passage ID")).toBeInTheDocument();
  });

  it("handles passage 0 by showing reset message and redirecting", () => {
    renderWithRoute("/passage/0");

    const resetPassage = screen.getByTestId("reset-passage");
    expect(resetPassage).toBeInTheDocument();
    expect(screen.getByText("Resetting your adventure…")).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("has correct CSS classes applied", () => {
    renderWithRoute("/passage/1");

    const passage = screen.getByTestId("passage");
    expect(passage).toHaveClass("passage");

    const adventureBook = passage.closest(".adventure-book");
    expect(adventureBook).toBeInTheDocument();

    // Check that passage text is wrapped in the correct div
    const passageTextDiv = screen.getByTestId("passage-text");
    expect(passageTextDiv).toHaveClass("passage-text");
  });

  it("renders multiple paragraphs correctly", () => {
    renderWithRoute("/passage/1");

    // Check that all paragraphs from passage 1 are rendered with correct test IDs
    expect(screen.getByTestId("passage-paragraph-0")).toBeInTheDocument();
    expect(screen.getByTestId("passage-paragraph-1")).toBeInTheDocument();
    expect(screen.getByTestId("passage-paragraph-2")).toBeInTheDocument();

    // Verify paragraph content matches test data
    const expectedParagraphs = [
      "This is test passage 1.",
      "It has multiple paragraphs.",
      "Choose your path.",
    ];

    expectedParagraphs.forEach((paragraph, index) => {
      const paragraphElement = screen.getByTestId(`passage-paragraph-${index}`);
      expect(paragraphElement).toHaveTextContent(paragraph);
    });
  });
});
