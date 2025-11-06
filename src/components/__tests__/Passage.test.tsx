import { screen, fireEvent } from "@testing-library/react";
import { render as rtlRender } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
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

    expect(
      screen.getByText(/In the beginning, there was code/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You find yourself standing at the entrance/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Enter the realm of functions/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Explore the data structures/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Turn back to safety/ })
    ).toBeInTheDocument();
  });

  it("navigates to correct passage when choice is clicked", () => {
    renderWithRoute("/passage/1");

    const functionsButton = screen.getByRole("button", {
      name: /Enter the realm of functions/,
    });
    fireEvent.click(functionsButton);

    expect(mockNavigate).toHaveBeenCalledWith("/passage/2");
  });

  it("shows error for invalid passage ID", () => {
    renderWithRoute("/passage/invalid");

    expect(screen.getByText("Invalid passage ID")).toBeInTheDocument();
    expect(
      screen.getByText(/The passage ID "invalid" is not valid/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to Introduction" })
    ).toBeInTheDocument();
  });

  it("shows error for non-existent passage ID", () => {
    renderWithRoute("/passage/999");

    expect(screen.getByText("Passage not found")).toBeInTheDocument();
    expect(screen.getByText(/Passage 999 does not exist/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to Introduction" })
    ).toBeInTheDocument();
  });

  it('navigates to introduction when "Go to Introduction" is clicked', () => {
    renderWithRoute("/passage/invalid");

    const goHomeButton = screen.getByRole("button", {
      name: "Go to Introduction",
    });
    fireEvent.click(goHomeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/passage/0");
  });

  it("renders passage with single choice correctly", () => {
    renderWithRoute("/passage/9"); // This passage has only one choice

    expect(screen.getByText(/You step through the portal/)).toBeInTheDocument();
    expect(
      screen.getByText(/The adventure has changed you forever/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Start a new adventure/ })
    ).toBeInTheDocument();
  });

  it("handles negative passage IDs as invalid", () => {
    renderWithRoute("/passage/-1");

    expect(screen.getByText("Invalid passage ID")).toBeInTheDocument();
  });

  it("handles passage 0 by showing reset message and redirecting", () => {
    renderWithRoute("/passage/0");

    expect(screen.getByText("Resetting your adventure...")).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("has correct CSS classes applied", () => {
    renderWithRoute("/passage/1");

    expect(
      screen.getByText(/In the beginning, there was code/).closest(".passage")
    ).toBeInTheDocument();
    expect(
      screen
        .getByText(/In the beginning, there was code/)
        .closest(".adventure-book")
    ).toBeInTheDocument();

    // Check that passage text is wrapped in the correct div
    const passageTextDiv = screen
      .getByText(/In the beginning, there was code/)
      .closest(".passage-text");
    expect(passageTextDiv).toBeInTheDocument();
  });

  it("renders multiple paragraphs correctly", () => {
    renderWithRoute("/passage/1");

    // Check that all paragraphs from passage 1 are rendered
    expect(
      screen.getByText(/In the beginning, there was code/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You find yourself standing at the entrance/)
    ).toBeInTheDocument();
    expect(screen.getByText(/What do you choose to do/)).toBeInTheDocument();

    // Verify they are separate paragraph elements
    const paragraphs = screen
      .getAllByText(/.*/)
      .filter((element) => element.tagName === "P");
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
  });
});
