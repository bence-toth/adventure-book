import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Adventure } from "@/data/types";
import { DebugNavigation } from "../DebugNavigation";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createMockAdventure = (): Adventure => ({
  metadata: {
    title: "Test Adventure",
    author: "Test Author",
    version: "1.0.0",
  },
  intro: {
    paragraphs: ["Introduction text"],
    action: "Start",
  },
  passages: {
    1: {
      paragraphs: ["Passage 1"],
      choices: [
        { text: "Choice A", goto: 2 },
        { text: "Choice B", goto: 3 },
      ],
    },
    2: {
      paragraphs: ["Passage 2"],
      ending: true,
      type: "victory",
    },
    3: {
      paragraphs: ["Passage 3"],
      ending: true,
      type: "defeat",
    },
    4: {
      paragraphs: ["Passage 4"],
      choices: [{ text: "Continue", goto: 5 }],
      effects: [{ type: "add_item", item: "key" }],
    },
    5: {
      paragraphs: ["Passage 5"],
      choices: [{ text: "Continue", goto: 1 }],
      effects: [{ type: "remove_item", item: "key" }],
    },
  },
  items: [{ id: "key", name: "Key" }],
});

describe("DebugNavigation Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Rendering", () => {
    it("renders navigation title", () => {
      const mockAdventure = createMockAdventure();
      render(
        <MemoryRouter>
          <DebugNavigation
            adventure={mockAdventure}
            adventureId="test-adventure"
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Passages")).toBeInTheDocument();
    });

    it("renders introduction link", () => {
      const mockAdventure = createMockAdventure();
      render(
        <MemoryRouter>
          <DebugNavigation
            adventure={mockAdventure}
            adventureId="test-adventure"
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId("debug-nav-introduction")).toBeInTheDocument();
      expect(screen.getByText("Introduction")).toBeInTheDocument();
    });

    it("renders all passage links in sorted order", () => {
      const mockAdventure = createMockAdventure();
      render(
        <MemoryRouter>
          <DebugNavigation
            adventure={mockAdventure}
            adventureId="test-adventure"
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId("debug-nav-passage-1")).toBeInTheDocument();
      expect(screen.getByTestId("debug-nav-passage-2")).toBeInTheDocument();
      expect(screen.getByTestId("debug-nav-passage-3")).toBeInTheDocument();
      expect(screen.getByTestId("debug-nav-passage-4")).toBeInTheDocument();
      expect(screen.getByTestId("debug-nav-passage-5")).toBeInTheDocument();

      expect(screen.getByText("Passage 1")).toBeInTheDocument();
      expect(screen.getByText("Passage 2")).toBeInTheDocument();
      expect(screen.getByText("Passage 3")).toBeInTheDocument();
      expect(screen.getByText("Passage 4")).toBeInTheDocument();
      expect(screen.getByText("Passage 5")).toBeInTheDocument();
    });

    it("renders passages in ascending order even if defined out of order", () => {
      const mockAdventure: Adventure = {
        ...createMockAdventure(),
        passages: {
          3: {
            paragraphs: ["Passage 3"],
            ending: true,
          },
          1: {
            paragraphs: ["Passage 1"],
            choices: [{ text: "Go", goto: 2 }],
          },
          2: {
            paragraphs: ["Passage 2"],
            choices: [{ text: "Go", goto: 3 }],
          },
        },
      };

      render(
        <MemoryRouter>
          <DebugNavigation
            adventure={mockAdventure}
            adventureId="test-adventure"
          />
        </MemoryRouter>
      );

      const passageLinks = screen.getAllByText(/^Passage \d+$/);
      expect(passageLinks[0]).toHaveTextContent("Passage 1");
      expect(passageLinks[1]).toHaveTextContent("Passage 2");
      expect(passageLinks[2]).toHaveTextContent("Passage 3");
    });
  });

  describe("Navigation", () => {
    it("navigates to introduction when introduction link is clicked", () => {
      const mockAdventure = createMockAdventure();
      render(
        <MemoryRouter>
          <DebugNavigation
            adventure={mockAdventure}
            adventureId="test-adventure"
          />
        </MemoryRouter>
      );

      const introLink = screen.getByTestId("debug-nav-introduction");
      fireEvent.click(introLink);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/test-adventure/test"
      );
    });

    it("navigates to correct passage when passage link is clicked", () => {
      const mockAdventure = createMockAdventure();
      render(
        <MemoryRouter>
          <DebugNavigation
            adventure={mockAdventure}
            adventureId="test-adventure"
          />
        </MemoryRouter>
      );

      const passage2Link = screen.getByTestId("debug-nav-passage-2");
      fireEvent.click(passage2Link);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/test-adventure/test/passage/2"
      );
    });

    it("navigates to correct passage for multiple different passages", () => {
      const mockAdventure = createMockAdventure();
      render(
        <MemoryRouter>
          <DebugNavigation
            adventure={mockAdventure}
            adventureId="test-adventure"
          />
        </MemoryRouter>
      );

      // Click passage 1
      fireEvent.click(screen.getByTestId("debug-nav-passage-1"));
      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/test-adventure/test/passage/1"
      );

      // Click passage 5
      fireEvent.click(screen.getByTestId("debug-nav-passage-5"));
      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/test-adventure/test/passage/5"
      );
    });
  });
});
