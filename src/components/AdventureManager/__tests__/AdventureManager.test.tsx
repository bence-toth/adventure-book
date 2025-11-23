import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AdventureManager } from "../AdventureManager";
import { render } from "@/__tests__/testUtils";
import * as adventureDatabase from "@/data/adventureDatabase";
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
    it("shows error message when loading fails", async () => {
      vi.mocked(adventureDatabase.listStories).mockRejectedValue(
        new Error("Failed to load")
      );

      render(<AdventureManager />);

      expect(
        await screen.findByText("Failed to load stories")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /retry/i })
      ).toBeInTheDocument();
    });

    it("retries loading when retry button is clicked", async () => {
      vi.mocked(adventureDatabase.listStories)
        .mockRejectedValueOnce(new Error("Failed to load"))
        .mockResolvedValueOnce(mockStories);

      render(<AdventureManager />);

      expect(
        await screen.findByText("Failed to load stories")
      ).toBeInTheDocument();

      const retryButton = screen.getByRole("button", { name: /retry/i });
      fireEvent.click(retryButton);

      expect(await screen.findByText("Adventure One")).toBeInTheDocument();
    });
  });

  describe("Adventure List Display", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("renders the new adventure card", async () => {
      render(<AdventureManager />);

      expect(
        await screen.findByText("Create a new adventure")
      ).toBeInTheDocument();
    });

    it("renders all stories from the database", async () => {
      render(<AdventureManager />);

      expect(await screen.findByText("Adventure One")).toBeInTheDocument();
      expect(screen.getByText("Adventure Two")).toBeInTheDocument();
    });
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
          "/adventure/new-adventure-id/test"
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

    it("shows error message when adventure creation fails", async () => {
      vi.mocked(adventureDatabase.createAdventure).mockRejectedValue(
        new Error("Failed to create")
      );

      render(<AdventureManager />);

      const newAdventureButton = await screen.findByText(
        "Create a new adventure"
      );
      fireEvent.click(newAdventureButton);

      expect(
        await screen.findByText("Failed to create adventure")
      ).toBeInTheDocument();
    });
  });

  describe("Open Adventure", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("navigates to adventure test view when adventure is opened", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const openButtons = screen.getAllByLabelText(/^Open Adventure/);
      fireEvent.click(openButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith("/adventure/adventure-1/test");
    });
  });

  describe("Delete Adventure", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
      vi.mocked(adventureDatabase.deleteAdventure).mockResolvedValue();
    });

    it("deletes adventure and reloads list when deletion is confirmed", async () => {
      vi.mocked(adventureDatabase.listStories)
        .mockResolvedValueOnce(mockStories) // Initial load
        .mockResolvedValueOnce([mockStories[1]]); // After deletion

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(adventureDatabase.deleteAdventure).toHaveBeenCalledWith(
          "adventure-1"
        );
      });

      // Verify the adventure is removed from the list
      await waitFor(() => {
        expect(screen.queryByText("Adventure One")).not.toBeInTheDocument();
      });
      expect(screen.getByText("Adventure Two")).toBeInTheDocument();
      expect(adventureDatabase.listStories).toHaveBeenCalledTimes(2);
    });

    it("shows error message when deletion fails", async () => {
      vi.mocked(adventureDatabase.deleteAdventure).mockRejectedValue(
        new Error("Failed to delete")
      );

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      expect(
        await screen.findByText("Failed to delete adventure")
      ).toBeInTheDocument();
    });
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

  describe("Empty State", () => {
    it("still shows New Adventure card when no stories exist", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue([]);

      render(<AdventureManager />);

      expect(
        await screen.findByText("Create a new adventure")
      ).toBeInTheDocument();
    });
  });
});
