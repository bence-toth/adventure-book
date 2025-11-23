import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewStoryCard } from "../NewStoryCard";

describe("NewStoryCard Component", () => {
  it("renders the new story card with correct text", () => {
    const mockOnClick = vi.fn();
    render(<NewStoryCard onClick={mockOnClick} />);

    expect(screen.getByText("Create a new adventure")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(<NewStoryCard onClick={mockOnClick} />);

    const button = screen.getByText("Create a new adventure");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders the plus icon", () => {
    const mockOnClick = vi.fn();
    const { container } = render(<NewStoryCard onClick={mockOnClick} />);

    // Check for SVG element (lucide-react renders SVG)
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
