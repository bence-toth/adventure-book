import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { DocumentManager } from "../DocumentManager";
import { render } from "@/__tests__/testUtils";
import * as storyDatabase from "@/data/storyDatabase";
import type { StoredStory } from "@/data/storyDatabase";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock storyDatabase
vi.mock("../../../data/storyDatabase", async () => {
  const actual = await vi.importActual("../../../data/storyDatabase");
  return {
    ...actual,
    listStories: vi.fn(),
    deleteStory: vi.fn(),
    createStory: vi.fn(),
  };
});

describe("DocumentManager Component", () => {
  const mockStories: StoredStory[] = [
    {
      id: "story-1",
      title: "Adventure One",
      content: "mock content",
      lastEdited: new Date("2025-11-10T12:00:00"),
      createdAt: new Date("2025-11-01T12:00:00"),
    },
    {
      id: "story-2",
      title: "Adventure Two",
      content: "mock content 2",
      lastEdited: new Date("2025-11-09T12:00:00"),
      createdAt: new Date("2025-11-02T12:00:00"),
    },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(storyDatabase.listStories).mockClear();
    vi.mocked(storyDatabase.deleteStory).mockClear();
    vi.mocked(storyDatabase.createStory).mockClear();
  });

  describe("Loading State", () => {
    it("shows loading state initially", async () => {
      vi.mocked(storyDatabase.listStories).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<DocumentManager />);

      expect(screen.getByText("Loading stories...")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("shows error message when loading fails", async () => {
      vi.mocked(storyDatabase.listStories).mockRejectedValue(
        new Error("Failed to load")
      );

      render(<DocumentManager />);

      expect(
        await screen.findByText("Failed to load stories")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /retry/i })
      ).toBeInTheDocument();
    });

    it("retries loading when retry button is clicked", async () => {
      vi.mocked(storyDatabase.listStories)
        .mockRejectedValueOnce(new Error("Failed to load"))
        .mockResolvedValueOnce(mockStories);

      render(<DocumentManager />);

      expect(
        await screen.findByText("Failed to load stories")
      ).toBeInTheDocument();

      const retryButton = screen.getByRole("button", { name: /retry/i });
      fireEvent.click(retryButton);

      expect(await screen.findByText("Adventure One")).toBeInTheDocument();
    });
  });

  describe("Story List Display", () => {
    beforeEach(() => {
      vi.mocked(storyDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("renders the new story card", async () => {
      render(<DocumentManager />);

      expect(
        await screen.findByText("Create a new adventure")
      ).toBeInTheDocument();
    });

    it("renders all stories from the database", async () => {
      render(<DocumentManager />);

      expect(await screen.findByText("Adventure One")).toBeInTheDocument();
      expect(screen.getByText("Adventure Two")).toBeInTheDocument();
    });

    it("displays story titles correctly", async () => {
      render(<DocumentManager />);

      const title1 = await screen.findByText("Adventure One");
      const title2 = screen.getByText("Adventure Two");

      expect(title1).toBeInTheDocument();
      expect(title2).toBeInTheDocument();
    });

    it("displays last edited dates in relative format", async () => {
      render(<DocumentManager />);

      // Wait for stories to load
      await screen.findByText("Adventure One");

      // Check that date formatting is applied (looking for "ago" or specific date format)
      const dateElements = screen.getAllByText(/Last edited/);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it("renders Open button for each story", async () => {
      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const openButtons = screen.getAllByLabelText(/^Open Adventure/);
      expect(openButtons).toHaveLength(2);
    });

    it("renders Delete button for each story", async () => {
      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const menuButtons = screen.getAllByRole("button", { name: /open menu/i });
      expect(menuButtons).toHaveLength(2);
    });
  });

  describe("Create New Story", () => {
    beforeEach(() => {
      vi.mocked(storyDatabase.listStories).mockResolvedValue(mockStories);
      vi.mocked(storyDatabase.createStory).mockResolvedValue("new-story-id");
    });

    it("creates a new story when New Story card is clicked", async () => {
      render(<DocumentManager />);

      const newStoryButton = await screen.findByText("Create a new adventure");
      fireEvent.click(newStoryButton);

      await waitFor(() => {
        expect(storyDatabase.createStory).toHaveBeenCalledWith(
          "Untitled adventure",
          expect.stringContaining("metadata:")
        );
      });
    });

    it("navigates to the new story after creation", async () => {
      render(<DocumentManager />);

      const newStoryButton = await screen.findByText("Create a new adventure");
      fireEvent.click(newStoryButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/adventure/new-story-id/test"
        );
      });
    });

    it("uses story template with replaced title", async () => {
      render(<DocumentManager />);

      const newStoryButton = await screen.findByText("Create a new adventure");
      fireEvent.click(newStoryButton);

      await waitFor(() => {
        expect(storyDatabase.createStory).toHaveBeenCalledWith(
          "Untitled adventure",
          expect.stringContaining('title: "Untitled adventure"')
        );
      });
    });

    it("shows error message when story creation fails", async () => {
      vi.mocked(storyDatabase.createStory).mockRejectedValue(
        new Error("Failed to create")
      );

      render(<DocumentManager />);

      const newStoryButton = await screen.findByText("Create a new adventure");
      fireEvent.click(newStoryButton);

      expect(
        await screen.findByText("Failed to create story")
      ).toBeInTheDocument();
    });
  });

  describe("Open Story", () => {
    beforeEach(() => {
      vi.mocked(storyDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("navigates to story test view when Open is clicked", async () => {
      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const openButtons = screen.getAllByLabelText(/^Open Adventure/);
      fireEvent.click(openButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith("/adventure/story-1/test");
    });

    it("navigates to correct story when multiple stories exist", async () => {
      render(<DocumentManager />);

      await screen.findByText("Adventure Two");

      const openButtons = screen.getAllByLabelText(/^Open Adventure/);
      fireEvent.click(openButtons[1]);

      expect(mockNavigate).toHaveBeenCalledWith("/adventure/story-2/test");
    });
  });

  describe("Delete Story", () => {
    beforeEach(() => {
      vi.mocked(storyDatabase.listStories).mockResolvedValue(mockStories);
      vi.mocked(storyDatabase.deleteStory).mockResolvedValue();
    });

    it("shows context menu when ellipsis button is clicked", async () => {
      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("shows confirmation dialog when Delete is clicked from context menu", async () => {
      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      expect(
        screen.getByText(
          'Are you sure you want to delete "Adventure One"? This action cannot be undone.'
        )
      ).toBeInTheDocument();
    });

    it("closes context menu and does not delete story when user cancels confirmation", async () => {
      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText("Delete Story")).not.toBeInTheDocument();
      });
      expect(storyDatabase.deleteStory).not.toHaveBeenCalled();
    });

    it("deletes story when user confirms", async () => {
      vi.mocked(storyDatabase.listStories)
        .mockResolvedValueOnce(mockStories) // Initial load
        .mockResolvedValueOnce([mockStories[1]]); // After deletion

      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(storyDatabase.deleteStory).toHaveBeenCalledWith("story-1");
      });

      // Verify the story is removed from the list
      await waitFor(() => {
        expect(screen.queryByText("Adventure One")).not.toBeInTheDocument();
      });
      expect(screen.getByText("Adventure Two")).toBeInTheDocument();
    });

    it("reloads story list after deletion", async () => {
      vi.mocked(storyDatabase.listStories)
        .mockResolvedValueOnce(mockStories)
        .mockResolvedValueOnce([mockStories[1]]);

      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(storyDatabase.listStories).toHaveBeenCalledTimes(2);
      });
    });

    it("shows error message when deletion fails", async () => {
      vi.mocked(storyDatabase.deleteStory).mockRejectedValue(
        new Error("Failed to delete")
      );

      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      expect(
        await screen.findByText("Failed to delete story")
      ).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("shows 'Just now' for very recent edits", async () => {
      const now = new Date();
      const recentStory: StoredStory = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 30000), // 30 seconds ago
      };

      vi.mocked(storyDatabase.listStories).mockResolvedValue([recentStory]);

      render(<DocumentManager />);

      expect(await screen.findByText(/Just now/)).toBeInTheDocument();
    });

    it("shows minutes for recent edits", async () => {
      const now = new Date();
      const recentStory: StoredStory = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 300000), // 5 minutes ago
      };

      vi.mocked(storyDatabase.listStories).mockResolvedValue([recentStory]);

      render(<DocumentManager />);

      expect(await screen.findByText(/5 minutes ago/)).toBeInTheDocument();
    });

    it("shows hours for edits within 24 hours", async () => {
      const now = new Date();
      const recentStory: StoredStory = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 7200000), // 2 hours ago
      };

      vi.mocked(storyDatabase.listStories).mockResolvedValue([recentStory]);

      render(<DocumentManager />);

      expect(await screen.findByText(/2 hours ago/)).toBeInTheDocument();
    });

    it("shows days for edits within a week", async () => {
      const now = new Date();
      const recentStory: StoredStory = {
        ...mockStories[0],
        lastEdited: new Date(now.getTime() - 172800000), // 2 days ago
      };

      vi.mocked(storyDatabase.listStories).mockResolvedValue([recentStory]);

      render(<DocumentManager />);

      expect(await screen.findByText(/2 days ago/)).toBeInTheDocument();
    });

    it("shows full date for older edits", async () => {
      const oldStory: StoredStory = {
        ...mockStories[0],
        lastEdited: new Date("2025-01-01T12:00:00"),
      };

      vi.mocked(storyDatabase.listStories).mockResolvedValue([oldStory]);

      render(<DocumentManager />);

      await screen.findByText("Adventure One");

      // Should show formatted date (locale-specific, so just check it doesn't say "ago")
      const dateText = screen.getByText(/Last edited/);
      expect(dateText.textContent).not.toContain("ago");
    });

    it("handles singular forms correctly (1 minute, 1 hour, 1 day)", async () => {
      const now = new Date();
      const oneMinuteAgo: StoredStory = {
        ...mockStories[0],
        id: "story-minute",
        title: "One Minute Story",
        lastEdited: new Date(now.getTime() - 60000), // 1 minute ago
      };

      vi.mocked(storyDatabase.listStories).mockResolvedValue([oneMinuteAgo]);

      render(<DocumentManager />);

      expect(await screen.findByText(/1 minute ago/)).toBeInTheDocument();
      expect(screen.queryByText(/1 minutes ago/)).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("still shows New Story card when no stories exist", async () => {
      vi.mocked(storyDatabase.listStories).mockResolvedValue([]);

      render(<DocumentManager />);

      expect(
        await screen.findByText("Create a new adventure")
      ).toBeInTheDocument();
    });
  });
});
