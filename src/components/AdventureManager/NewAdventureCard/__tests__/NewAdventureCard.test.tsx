import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewAdventureCard } from "../NewAdventureCard";

describe("NewAdventureCard Component", () => {
  it("renders the new adventure card with correct text", () => {
    const mockOnClick = vi.fn();
    render(<NewAdventureCard onClick={mockOnClick} />);

    expect(screen.getByText("Create a new adventure")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(<NewAdventureCard onClick={mockOnClick} />);

    const button = screen.getByText("Create a new adventure");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders the plus icon", () => {
    const mockOnClick = vi.fn();
    const { container } = render(<NewAdventureCard onClick={mockOnClick} />);

    // Check for SVG element (lucide-react renders SVG)
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
