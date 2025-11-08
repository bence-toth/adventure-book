import { screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { Introduction } from "../Introduction";
import { render } from "../../test/testUtils";

// Mock the story loader to return stable test data
vi.mock("../../data/storyLoader", () => ({
  introduction: {
    title: "Test Adventure",
    paragraphs: [
      "This is a test introduction paragraph.",
      "This is a second test paragraph.",
      "This is a third test paragraph.",
    ],
    action: "Begin your adventure",
  },
}));

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

  it("renders the introduction title", () => {
    render(<Introduction />);

    const title = screen.getByTestId("intro-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Test Adventure");
  });

  it("renders all introduction paragraphs", () => {
    render(<Introduction />);

    const introText = screen.getByTestId("intro-text");
    expect(introText).toBeInTheDocument();

    // Check that the correct number of paragraphs are rendered
    const expectedParagraphs = [
      "This is a test introduction paragraph.",
      "This is a second test paragraph.",
      "This is a third test paragraph.",
    ];

    expectedParagraphs.forEach((expectedText, index) => {
      const paragraph = screen.getByTestId(`intro-paragraph-${index}`);
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent(expectedText);
    });
  });

  it("renders the start adventure button with correct text", () => {
    render(<Introduction />);

    const button = screen.getByTestId("start-adventure-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Begin your adventure");
    expect(button).toHaveClass("choice-button", "start-adventure-button");
  });

  it("navigates to passage 1 when start adventure button is clicked", () => {
    render(<Introduction />);

    const button = screen.getByTestId("start-adventure-button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/passage/1");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("has correct CSS classes applied", () => {
    render(<Introduction />);

    expect(screen.getByTestId("introduction")).toBeInTheDocument();
    expect(screen.getByTestId("introduction")).toHaveClass("introduction");

    const adventureBook = screen
      .getByTestId("introduction")
      .closest(".adventure-book");
    expect(adventureBook).toBeInTheDocument();
  });
});
