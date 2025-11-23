import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StoryCard } from "../StoryCard";
import type { StoredStory } from "@/data/storyDatabase";

describe("StoryCard Component", () => {
  const mockStory: StoredStory = {
    id: "story-1",
    title: "Test Adventure",
    content: "mock content",
    lastEdited: new Date("2025-11-10T12:00:00"),
    createdAt: new Date("2025-11-01T12:00:00"),
  };

  const mockOnOpen = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnOpen.mockClear();
    mockOnDelete.mockClear();
  });

  describe("Rendering", () => {
    it("renders story title", () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("Test Adventure")).toBeInTheDocument();
    });

    it("renders last edited date", () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(/Last edited/)).toBeInTheDocument();
    });

    it("renders menu button with correct aria-label", () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      expect(
        screen.getByLabelText("Open menu for Test Adventure")
      ).toBeInTheDocument();
    });

    it("renders open button with correct aria-label", () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByLabelText("Open Test Adventure")).toBeInTheDocument();
    });
  });

  describe("Open Story", () => {
    it("calls onOpen with story id when card is clicked", () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const openButton = screen.getByLabelText("Open Test Adventure");
      fireEvent.click(openButton);

      expect(mockOnOpen).toHaveBeenCalledWith("story-1");
      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("Context Menu", () => {
    it("opens context menu when menu button is clicked", () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("does not trigger onOpen when menu button is clicked", () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      expect(mockOnOpen).not.toHaveBeenCalled();
    });
  });

  describe("Delete Modal", () => {
    it("opens delete modal when Delete is clicked in context menu", async () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      expect(
        screen.getByText(
          'Are you sure you want to delete "Test Adventure"? This action cannot be undone.'
        )
      ).toBeInTheDocument();
    });

    it("closes context menu when delete modal opens", async () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      // Context menu should be closed (Delete menu item should not be visible)
      await waitFor(() => {
        const deleteMenuItems = screen.queryAllByRole("menuitem");
        expect(deleteMenuItems).toHaveLength(0);
      });
    });

    it("calls onDelete when deletion is confirmed", async () => {
      mockOnDelete.mockResolvedValue(undefined);

      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
      });
    });

    it("does not call onDelete when deletion is cancelled", async () => {
      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText("Delete Story")).not.toBeInTheDocument();
      });

      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it("closes delete modal after deletion is complete", async () => {
      mockOnDelete.mockResolvedValue(undefined);

      render(
        <StoryCard
          story={mockStory}
          onOpen={mockOnOpen}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText("Delete Story")).not.toBeInTheDocument();
      });
    });
  });
});
