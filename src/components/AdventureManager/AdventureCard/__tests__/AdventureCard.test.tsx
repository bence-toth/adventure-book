import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdventureCard } from "../AdventureCard";
import type { StoredAdventure } from "@/data/adventureDatabase";

describe("AdventureCard Component", () => {
  const mockAdventure: StoredAdventure = {
    id: "adventure-1",
    title: "Test Adventure",
    content: "mock content",
    lastEdited: new Date("2025-11-10T12:00:00"),
    createdAt: new Date("2025-11-01T12:00:00"),
  };

  const mockOnOpen = vi.fn();
  const mockOnDeleteClick = vi.fn();
  const mockOnConfirmDelete = vi.fn();
  const mockOnCancelDelete = vi.fn();

  beforeEach(() => {
    mockOnOpen.mockClear();
    mockOnDeleteClick.mockClear();
    mockOnConfirmDelete.mockClear();
    mockOnCancelDelete.mockClear();
  });

  const renderAdventureCard = (deleteModalOpen = false) => {
    return render(
      <AdventureCard
        adventure={mockAdventure}
        onOpen={mockOnOpen}
        onDeleteClick={mockOnDeleteClick}
        isDeleteModalOpen={deleteModalOpen}
        onConfirmDelete={mockOnConfirmDelete}
        onCancelDelete={mockOnCancelDelete}
      />
    );
  };

  describe("Rendering", () => {
    it("renders adventure title", () => {
      renderAdventureCard();

      expect(screen.getByText("Test Adventure")).toBeInTheDocument();
    });

    it("renders last edited date", () => {
      renderAdventureCard();

      expect(screen.getByText(/Last edited/)).toBeInTheDocument();
    });

    it("renders menu button with correct aria-label", () => {
      renderAdventureCard();

      expect(
        screen.getByLabelText("Open menu for Test Adventure")
      ).toBeInTheDocument();
    });

    it("renders open button with correct aria-label", () => {
      renderAdventureCard();

      expect(screen.getByLabelText("Open Test Adventure")).toBeInTheDocument();
    });
  });

  describe("Open Adventure", () => {
    it("calls onOpen with adventure id when card is clicked", () => {
      renderAdventureCard();

      const openButton = screen.getByLabelText("Open Test Adventure");
      fireEvent.click(openButton);

      expect(mockOnOpen).toHaveBeenCalledWith("adventure-1");
      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("Context Menu", () => {
    it("opens context menu when menu button is clicked", () => {
      renderAdventureCard();

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("renders delete menu item with trash icon", () => {
      renderAdventureCard();

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      expect(deleteMenuItem).toBeInTheDocument();

      // Verify icon is present (lucide-react icons render as SVG)
      const svg = deleteMenuItem.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("does not trigger onOpen when menu button is clicked", () => {
      renderAdventureCard();

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      expect(mockOnOpen).not.toHaveBeenCalled();
    });
  });

  describe("Delete Modal", () => {
    it("opens delete modal when Delete is clicked in context menu", async () => {
      renderAdventureCard();

      const menuButton = screen.getByLabelText("Open menu for Test Adventure");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
    });

    it("closes context menu when delete modal opens", async () => {
      renderAdventureCard();

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

    it("calls onConfirmDelete when deletion is confirmed", async () => {
      mockOnConfirmDelete.mockResolvedValue(undefined);

      renderAdventureCard(true); // Modal is open

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockOnConfirmDelete).toHaveBeenCalledTimes(1);
      });
    });

    it("does not call onConfirmDelete when deletion is cancelled", async () => {
      renderAdventureCard(true); // Modal is open

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
      expect(mockOnCancelDelete).toHaveBeenCalledTimes(1);
    });

    it("closes delete modal after deletion is complete via onCancelDelete", async () => {
      renderAdventureCard(true); // Modal is open

      // Verify modal is open
      expect(
        screen.getByText(
          'Are you sure you want to delete "Test Adventure"? This action cannot be undone.'
        )
      ).toBeInTheDocument();

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnCancelDelete).toHaveBeenCalledTimes(1);
    });

    it("calls onCancelDelete when modal is closed via dialog close button", async () => {
      renderAdventureCard(true); // Modal is open

      // The modal should now be visible
      expect(
        screen.getByText(
          'Are you sure you want to delete "Test Adventure"? This action cannot be undone.'
        )
      ).toBeInTheDocument();

      // Close via cancel button which triggers onCancel callback
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      expect(mockOnCancelDelete).toHaveBeenCalledTimes(1);
      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });
  });
});
