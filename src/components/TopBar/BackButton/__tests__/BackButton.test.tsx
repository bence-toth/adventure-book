import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BackButton } from "../BackButton";
import { ROUTES } from "@/constants/routes";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("BackButton", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the back button", () => {
    render(<BackButton />);
    const button = screen.getByRole("button", {
      name: /back to document manager/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("has the correct test id", () => {
    render(<BackButton />);
    const button = screen.getByTestId(TOP_BAR_TEST_IDS.BACK_BUTTON);
    expect(button).toBeInTheDocument();
  });

  it("navigates to document manager when clicked", async () => {
    const user = userEvent.setup();
    render(<BackButton />);

    const button = screen.getByRole("button", {
      name: /back to document manager/i,
    });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ROOT);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
