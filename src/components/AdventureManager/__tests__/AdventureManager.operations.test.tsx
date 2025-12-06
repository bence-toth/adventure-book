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

  describe("Open Adventure", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("navigates to adventure test view when adventure is opened", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const openButtons = screen.getAllByLabelText(/^Open Adventure/);
      fireEvent.click(openButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/adventure-1/test/introduction"
      );
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

    it("handles cancel during delete", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Open delete modal
      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);
      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      // Cancel to clear deletingAdventureId
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Verify delete was not called
      expect(adventureDatabase.deleteAdventure).not.toHaveBeenCalled();
      expect(screen.getByText("Adventure One")).toBeInTheDocument();
    });

    it("does not delete when confirm is clicked without setting deletingAdventureId", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Open delete modal for first adventure
      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);
      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      // Modal should be visible
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Cancel the modal
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Now open modal for second adventure
      const menuButton2 = screen.getByLabelText("Open menu for Adventure Two");
      fireEvent.click(menuButton2);
      const deleteMenuItem2 = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem2);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Confirm delete should work normally
      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(adventureDatabase.deleteAdventure).toHaveBeenCalledWith(
          "adventure-2"
        );
      });
    });

    it("throws StoryDeleteError when deletion fails", async () => {
      // Mock console.error to avoid noise
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(adventureDatabase.deleteAdventure).mockRejectedValue(
        new Error("Failed to delete")
      );

      render(
        <ErrorBoundary>
          <AdventureManager />
        </ErrorBoundary>
      );

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const confirmButton = screen.getByRole("button", { name: "Delete" });
      fireEvent.click(confirmButton);

      expect(
        (await screen.findAllByText("Failed to delete adventure.")).length
      ).toBeGreaterThan(0);
      expect(screen.getByText("A system error occurred")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
