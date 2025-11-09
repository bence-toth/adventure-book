import { screen } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "../App";
import { getPassageRoute } from "../constants/routes";

// Mock the story loader with static mock data
vi.mock("../data/storyLoader", () => ({
  introduction: {
    title: "Mock Test Adventure",
    paragraphs: [
      "This is the first mock introduction paragraph.",
      "This is the second mock introduction paragraph.",
      "This is the third mock introduction paragraph.",
    ],
    action: "Begin your test adventure",
  },
  getPassage: (id: number) => {
    interface MockPassage {
      paragraphs: string[];
      choices?: { text: string; goto: number }[];
    }

    const mockPassages: Record<number, MockPassage> = {
      1: {
        paragraphs: [
          "This is mock passage 1.",
          "It has multiple paragraphs for testing.",
          "Choose your path in this test.",
        ],
        choices: [
          { text: "Go to mock passage 2", goto: 2 },
          { text: "Go to mock passage 3", goto: 3 },
          { text: "Return to start", goto: 1 },
        ],
      },
      2: {
        paragraphs: [
          "This is mock passage 2.",
          "You made the first choice in the test.",
        ],
        choices: [
          { text: "Continue to ending", goto: 4 },
          { text: "Go back to passage 1", goto: 1 },
        ],
      },
    };
    return mockPassages[id];
  },
}));

// Custom render with specific route for App testing
const renderAppWithRoute = (initialRoute: string) => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe("App Component", () => {
  it("renders Introduction component on root path", () => {
    renderAppWithRoute("/");

    // Check for the mocked title rather than specific content
    expect(screen.getByText("Mock Test Adventure")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Begin your test adventure" })
    ).toBeInTheDocument();
  });

  it("renders Passage component on passage path", () => {
    renderAppWithRoute(getPassageRoute(1));

    // Check for mocked content from passage 1
    expect(screen.getByText(/This is mock passage 1/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Go to mock passage 2/ })
    ).toBeInTheDocument();
  });

  it("redirects to root for unknown paths", () => {
    renderAppWithRoute("/unknown-path");

    // Should redirect to Introduction with mocked content
    expect(screen.getByText("Mock Test Adventure")).toBeInTheDocument();
  });

  it("handles passage routes with parameters", () => {
    renderAppWithRoute(getPassageRoute(2));

    // Check for mocked content from passage 2
    expect(screen.getByText(/This is mock passage 2/)).toBeInTheDocument();
  });
});
