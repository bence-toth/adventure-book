import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Passage } from "@/data/types";
import { PassageLink } from "../PassageLink";

describe("PassageLink Component", () => {
  describe("Introduction Icon", () => {
    it("renders play icon for introduction", () => {
      const mockOnClick = vi.fn();
      render(<PassageLink icon="play" onClick={mockOnClick} />);

      expect(screen.getByText("Introduction")).toBeInTheDocument();
    });

    it("uses custom label for introduction when provided", () => {
      const mockOnClick = vi.fn();
      render(
        <PassageLink icon="play" label="Custom Intro" onClick={mockOnClick} />
      );

      expect(screen.getByText("Custom Intro")).toBeInTheDocument();
    });

    it("calls onClick when introduction link is clicked", () => {
      const mockOnClick = vi.fn();
      render(<PassageLink icon="play" onClick={mockOnClick} />);

      fireEvent.click(screen.getByText("Introduction"));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Passage Icons", () => {
    it("renders skull icon for defeat ending", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["You died"],
        ending: true,
        type: "defeat",
      };

      const { container } = render(
        <PassageLink passageId={1} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 1")).toBeInTheDocument();
      // Check for Lucide icon by SVG presence
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders trophy icon for victory ending", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["You won!"],
        ending: true,
        type: "victory",
      };

      const { container } = render(
        <PassageLink passageId={2} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 2")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders trophy icon for neutral ending", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["The end"],
        ending: true,
        type: "neutral",
      };

      const { container } = render(
        <PassageLink passageId={3} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 3")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders trophy icon for ending without type", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["The end"],
        ending: true,
      };

      const { container } = render(
        <PassageLink passageId={4} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 4")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders package-plus icon for add_item effect", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["You found a key"],
        choices: [{ text: "Continue", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      const { container } = render(
        <PassageLink passageId={5} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 5")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders package-minus icon for remove_item effect", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["You used the key"],
        choices: [{ text: "Continue", goto: 2 }],
        effects: [{ type: "remove_item", item: "key" }],
      };

      const { container } = render(
        <PassageLink passageId={6} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 6")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("prioritizes add_item over remove_item when both effects present", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["Complex passage"],
        choices: [{ text: "Continue", goto: 2 }],
        effects: [
          { type: "add_item", item: "sword" },
          { type: "remove_item", item: "key" },
        ],
      };

      const { container } = render(
        <PassageLink passageId={7} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 7")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders split icon for multiple choices", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["Choose your path"],
        choices: [
          { text: "Left", goto: 2 },
          { text: "Right", goto: 3 },
        ],
      };

      const { container } = render(
        <PassageLink passageId={8} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 8")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders move-up icon for single choice", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["Continue forward"],
        choices: [{ text: "Continue", goto: 2 }],
      };

      const { container } = render(
        <PassageLink passageId={9} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 9")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders move-up icon for passage without choices (default)", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["No choices passage"],
      };

      const { container } = render(
        <PassageLink passageId={11} passage={passage} onClick={mockOnClick} />
      );

      expect(screen.getByText("Passage 11")).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("calls onClick when passage link is clicked", () => {
      const mockOnClick = vi.fn();
      const passage: Passage = {
        paragraphs: ["Test passage"],
        choices: [{ text: "Go", goto: 2 }],
      };

      render(
        <PassageLink passageId={10} passage={passage} onClick={mockOnClick} />
      );

      fireEvent.click(screen.getByText("Passage 10"));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Handling", () => {
    it("throws error when neither icon nor passage is provided", () => {
      const mockOnClick = vi.fn();

      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(
          <PassageLink
            passageId={undefined}
            passage={undefined}
            onClick={mockOnClick}
          />
        );
      }).toThrow();

      console.error = consoleError;
    });
  });

  describe("Test IDs", () => {
    it("applies custom data-testid", () => {
      const mockOnClick = vi.fn();
      render(
        <PassageLink
          icon="play"
          onClick={mockOnClick}
          data-testid="custom-test-id"
        />
      );

      expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
    });
  });
});
