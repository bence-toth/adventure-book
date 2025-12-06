import { screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AdventureManager } from "../AdventureManager";
import { render } from "@/__tests__/testUtils";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import * as adventureDatabase from "@/data/adventureDatabase";
import * as importYaml from "@/utils/importYaml";

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
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(adventureDatabase.listStories).mockClear();
    vi.mocked(adventureDatabase.deleteAdventure).mockClear();
    vi.mocked(adventureDatabase.createAdventure).mockClear();
    vi.mocked(importYaml.importYamlFile).mockClear();
  });

  describe("Loading State", () => {
    it("shows loading state initially", async () => {
      vi.mocked(adventureDatabase.listStories).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<AdventureManager />);

      expect(screen.getByText("Loading stories...")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("throws StoriesLoadError when loading fails", async () => {
      // Mock console.error to avoid noise
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(adventureDatabase.listStories).mockRejectedValue(
        new Error("Failed to load")
      );

      render(
        <ErrorBoundary>
          <AdventureManager />
        </ErrorBoundary>
      );

      expect(
        (await screen.findAllByText("Failed to load stories.")).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
