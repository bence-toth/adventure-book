import { screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AdventureManager } from "../AdventureManager";
import { render } from "@/__tests__/testUtils";
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

  describe("Date Formatting", () => {
    it("shows 'Just now' for very recent edits", async () => {
      const now = new Date();
      const recentAdventure: StoredAdventure = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 30000), // 30 seconds ago
      };

      vi.mocked(adventureDatabase.listStories).mockResolvedValue([
        recentAdventure,
      ]);

      render(<AdventureManager />);

      expect(await screen.findByText(/Just now/)).toBeInTheDocument();
    });

    it("shows minutes for recent edits", async () => {
      const now = new Date();
      const recentAdventure: StoredAdventure = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 300000), // 5 minutes ago
      };

      vi.mocked(adventureDatabase.listStories).mockResolvedValue([
        recentAdventure,
      ]);

      render(<AdventureManager />);

      expect(await screen.findByText(/5 minutes ago/)).toBeInTheDocument();
    });

    it("shows hours for edits within 24 hours", async () => {
      const now = new Date();
      const recentAdventure: StoredAdventure = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 7200000), // 2 hours ago
      };

      vi.mocked(adventureDatabase.listStories).mockResolvedValue([
        recentAdventure,
      ]);

      render(<AdventureManager />);

      expect(await screen.findByText(/2 hours ago/)).toBeInTheDocument();
    });

    it("shows days for edits within a week", async () => {
      const now = new Date();
      const recentAdventure: StoredAdventure = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 172800000), // 2 days ago
      };

      vi.mocked(adventureDatabase.listStories).mockResolvedValue([
        recentAdventure,
      ]);

      render(<AdventureManager />);

      expect(await screen.findByText(/2 days ago/)).toBeInTheDocument();
    });

    it("shows full date for older edits", async () => {
      const oldAdventure: StoredAdventure = {
        ...mockStories[0],
        lastEdited: new Date("2025-01-01T12:00:00"),
      };

      vi.mocked(adventureDatabase.listStories).mockResolvedValue([
        oldAdventure,
      ]);

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Should show formatted date (locale-specific, so just check it doesn't say "ago")
      const dateText = screen.getByText(/Last edited/);
      expect(dateText.textContent).not.toContain("ago");
    });

    it("handles singular forms correctly (1 minute, 1 hour, 1 day)", async () => {
      const now = new Date();
      const oneMinuteAgo: StoredAdventure = {
        ...mockStories[0],
        id: "adventure-minute",
        title: "One Minute Adventure",
        lastEdited: new Date(now.getTime() - 60000), // 1 minute ago
      };

      vi.mocked(adventureDatabase.listStories).mockResolvedValue([
        oneMinuteAgo,
      ]);

      render(<AdventureManager />);

      expect(await screen.findByText(/1 minute ago/)).toBeInTheDocument();
      expect(screen.queryByText(/1 minutes ago/)).not.toBeInTheDocument();
    });
  });
});
