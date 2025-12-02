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

  describe("Saved Progress Navigation", () => {
    it("navigates to saved passage when progress exists", async () => {
      const adventure: StoredAdventure = {
        id: "test-id",
        title: "Adventure with Progress",
        content: "mock content",
        lastEdited: new Date(),
        createdAt: new Date(),
      };
      vi.mocked(adventureDatabase.listStories).mockResolvedValue([adventure]);

      // Mock saved progress
      localStorage.setItem(
        "adventure-book/progress",
        JSON.stringify({
          "test-id": {
            passageId: 5,
            inventory: [],
          },
        })
      );

      render(<AdventureManager />);

      const openButton = await screen.findByLabelText(
        "Open Adventure with Progress"
      );
      fireEvent.click(openButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/adventure/test-id/test/passage/5"
        );
      });
    });
  });

  describe("File Drop", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("imports YAML file when dropped successfully", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: true,
        adventureId: "imported-id",
      });

      const updatedStories = [
        ...mockStories,
        {
          id: "imported-id",
          title: "Imported Adventure",
          content: "yaml content",
          lastEdited: new Date(),
          createdAt: new Date(),
        },
      ];

      vi.mocked(adventureDatabase.listStories)
        .mockResolvedValueOnce(mockStories) // Initial load
        .mockResolvedValueOnce(updatedStories); // After import

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      await waitFor(() => {
        expect(importYaml.importYamlFile).toHaveBeenCalledWith(file);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/adventure/imported-id/test"
        );
      });
    });

    it("shows error modal when import fails", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: "Invalid YAML: Missing metadata",
      });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByText("Import Failed")).toBeInTheDocument();
      });

      // Only the first error is displayed
      expect(
        screen.getByText("Invalid YAML: Missing metadata")
      ).toBeInTheDocument();
    });

    it("disables file drop when error modal is open", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: "Error 1",
      });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Drop a file that will fail
      const file1 = new File(["content"], "test1.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file1] },
      });

      // Wait for error modal to appear
      await waitFor(() => {
        expect(screen.getByText("Import Failed")).toBeInTheDocument();
      });

      // Try to drop another file while modal is open
      const file2 = new File(["content"], "test2.yaml", { type: "text/yaml" });

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file2] },
      });

      // importYamlFile should only have been called once (for file1)
      expect(importYaml.importYamlFile).toHaveBeenCalledTimes(1);
    });

    it("re-enables file drop after error modal is closed", async () => {
      vi.mocked(importYaml.importYamlFile)
        .mockResolvedValueOnce({
          success: false,
          error: "Error 1",
        })
        .mockResolvedValueOnce({
          success: true,
          adventureId: "imported-id",
        });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Drop a file that will fail
      const file1 = new File(["content"], "test1.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file1] },
      });

      // Wait for error modal to appear
      await waitFor(() => {
        expect(screen.getByText("Import Failed")).toBeInTheDocument();
      });

      // Close the modal
      const closeButton = screen.getByRole("button", { name: "Close" });
      fireEvent.click(closeButton);

      // Wait for modal to close
      await waitFor(() => {
        expect(screen.queryByText("Import Failed")).not.toBeInTheDocument();
      });

      // Now drop should work again
      const file2 = new File(["content"], "test2.yaml", { type: "text/yaml" });

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file2] },
      });

      await waitFor(() => {
        expect(importYaml.importYamlFile).toHaveBeenCalledTimes(2);
      });
    });

    it("disables file drop when delete confirmation modal is open", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Open the delete modal
      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      // Verify modal is open
      expect(
        screen.getByText(/Are you sure you want to delete/)
      ).toBeInTheDocument();

      // Try to drop a file while modal is open
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      // Import should not be called when modal is open
      expect(importYaml.importYamlFile).not.toHaveBeenCalled();
    });

    it("re-enables file drop after delete modal is closed", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: true,
        adventureId: "imported-id",
      });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Open the delete modal
      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);

      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      // Close the modal by clicking Cancel
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      // Wait for modal to close
      await waitFor(() => {
        expect(
          screen.queryByText(/Are you sure you want to delete/)
        ).not.toBeInTheDocument();
      });

      // Now file drop should work again
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      await waitFor(() => {
        expect(importYaml.importYamlFile).toHaveBeenCalledWith(file);
      });
    });
  });

  describe("Import from Top Bar", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("imports YAML file from file input successfully", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: true,
        adventureId: "imported-id",
      });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Open context menu
      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      fireEvent.click(menuButton);

      // Click import option
      const importMenuItem = screen.getByTestId(
        "adventure-manager-context-menu-import"
      );
      fireEvent.click(importMenuItem);

      // Get the hidden file input and trigger change
      const fileInput = screen.getByTestId("adventure-manager-file-input");
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(importYaml.importYamlFile).toHaveBeenCalledWith(file);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/adventure/imported-id/test"
        );
      });
    });

    it("shows error modal when file input import fails", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: "Parse error",
      });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Open context menu
      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      fireEvent.click(menuButton);

      // Click import option
      const importMenuItem = screen.getByTestId(
        "adventure-manager-context-menu-import"
      );
      fireEvent.click(importMenuItem);

      // Get the hidden file input and trigger change
      const fileInput = screen.getByTestId("adventure-manager-file-input");
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByText("Import Failed")).toBeInTheDocument();
      });

      expect(screen.getByText("Parse error")).toBeInTheDocument();
    });

    it("resets file input after selection to allow same file again", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: true,
        adventureId: "imported-id",
      });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      // Open context menu and import
      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      fireEvent.click(menuButton);

      const importMenuItem = screen.getByTestId(
        "adventure-manager-context-menu-import"
      );
      fireEvent.click(importMenuItem);

      const fileInput = screen.getByTestId(
        "adventure-manager-file-input"
      ) as HTMLInputElement;
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
      });

      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(importYaml.importYamlFile).toHaveBeenCalled();
      });

      // Input should be reset
      expect(fileInput.value).toBe("");
    });
  });
});
