import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AdventureManager } from "../AdventureManager";
import { render } from "@/__tests__/testUtils";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import * as adventureDatabase from "@/data/adventureDatabase";
import * as importYaml from "@/utils/importYaml";
import type { StoredAdventure } from "@/data/adventureDatabase";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock adventureDatabase
vi.mock("../../../data/adventureDatabase", async () => {
  const actual = await vi.importActual("../../../data/adventureDatabase");
  return {
    ...actual,
    listStories: vi.fn(),
    deleteAdventure: vi.fn(),
    createAdventure: vi.fn(),
  };
});

// Mock importYaml
vi.mock("../../../utils/importYaml", () => ({
  importYamlFile: vi.fn(),
}));

describe("AdventureManager Component", () => {
  const mockStories: StoredAdventure[] = [
    {
      id: "adventure-1",
      title: "Adventure One",
      content: "mock content",
      lastEdited: new Date("2025-11-10T12:00:00"),
      createdAt: new Date("2025-11-01T12:00:00"),
    },
    {
      id: "adventure-2",
      title: "Adventure Two",
      content: "mock content 2",
      lastEdited: new Date("2025-11-09T12:00:00"),
      createdAt: new Date("2025-11-02T12:00:00"),
    },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(adventureDatabase.listStories).mockClear();
    vi.mocked(adventureDatabase.deleteAdventure).mockClear();
    vi.mocked(adventureDatabase.createAdventure).mockClear();
    vi.mocked(importYaml.importYamlFile).mockClear();
  });

  describe("Create New Adventure", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue(
        "new-adventure-id"
      );
    });

    it("creates a new adventure when New Adventure card is clicked", async () => {
      render(<AdventureManager />);

      const newAdventureButton = await screen.findByText(
        "Create a new adventure"
      );
      fireEvent.click(newAdventureButton);

      await waitFor(() => {
        expect(adventureDatabase.createAdventure).toHaveBeenCalledWith(
          "Untitled adventure",
          expect.stringContaining("metadata:")
        );
      });
    });

    it("navigates to the new adventure after creation", async () => {
      render(<AdventureManager />);

      const newAdventureButton = await screen.findByText(
        "Create a new adventure"
      );
      fireEvent.click(newAdventureButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/adventure/new-adventure-id/test/introduction"
        );
      });
    });

    it("uses adventure template with replaced title", async () => {
      render(<AdventureManager />);

      const newAdventureButton = await screen.findByText(
        "Create a new adventure"
      );
      fireEvent.click(newAdventureButton);

      await waitFor(() => {
        expect(adventureDatabase.createAdventure).toHaveBeenCalledWith(
          "Untitled adventure",
          expect.stringContaining('title: "Untitled adventure"')
        );
      });
    });

    it("throws StoryCreateError when adventure creation fails", async () => {
      // Mock console.error to avoid noise
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(adventureDatabase.createAdventure).mockRejectedValue(
        new Error("Failed to create")
      );

      render(
        <ErrorBoundary>
          <AdventureManager />
        </ErrorBoundary>
      );

      const newAdventureButton = await screen.findByText(
        "Create a new adventure"
      );
      fireEvent.click(newAdventureButton);

      expect(
        (await screen.findAllByText("Failed to create adventure.")).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
