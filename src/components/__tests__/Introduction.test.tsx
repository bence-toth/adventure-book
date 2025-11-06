import { screen, fireEvent } from "@testing-library/react";
import { Introduction } from "../Introduction";
import { render } from "../../test/testUtils";

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
    expect(
      screen.getByText("Welcome to the Code Adventure")
    ).toBeInTheDocument();
  });

  it("renders all introduction paragraphs", () => {
    render(<Introduction />);

    expect(screen.getByText(/Welcome, brave adventurer/)).toBeInTheDocument();
    expect(
      screen.getByText(/In this adventure, you'll encounter/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Your adventure awaits/)).toBeInTheDocument();
  });

  it("renders the start adventure button with correct text", () => {
    render(<Introduction />);

    const button = screen.getByRole("button", { name: "Begin Your Adventure" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("choice-button", "start-adventure-button");
  });

  it("navigates to passage 1 when start adventure button is clicked", () => {
    render(<Introduction />);

    const button = screen.getByRole("button", { name: "Begin Your Adventure" });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/passage/1");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("has correct CSS classes applied", () => {
    render(<Introduction />);

    expect(
      screen.getByText("Welcome to the Code Adventure").closest(".introduction")
    ).toBeInTheDocument();
    expect(
      screen
        .getByText("Welcome to the Code Adventure")
        .closest(".adventure-book")
    ).toBeInTheDocument();
  });
});
