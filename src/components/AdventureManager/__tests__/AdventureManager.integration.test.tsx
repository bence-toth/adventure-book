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
vi.mock("@/data/adventureDatabase", async () => {
  const actual = await vi.importActual("@/data/adventureDatabase");
  return {
    ...actual,
    listStories: vi.fn(),
    deleteAdventure: vi.fn(),
    createAdventure: vi.fn(),
  };
});

// Mock importYaml
vi.mock("@/utils/importYaml", () => ({
  importYamlFile: vi.fn(),
}));

describe("AdventureManager Integration", () => {
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

  describe("Loading and Display", () => {
    it("shows loading state initially", async () => {
      vi.mocked(adventureDatabase.listStories).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<AdventureManager />);

      expect(screen.getByText("Loading stories...")).toBeInTheDocument();
    });

    it("displays all stories after loading", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);

      render(<AdventureManager />);

      expect(await screen.findByText("Adventure One")).toBeInTheDocument();
      expect(screen.getByText("Adventure Two")).toBeInTheDocument();
      expect(screen.getByText("Create a new adventure")).toBeInTheDocument();
    });

    it("shows new adventure card when no stories exist", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue([]);

      render(<AdventureManager />);

      expect(
        await screen.findByText("Create a new adventure")
      ).toBeInTheDocument();
    });
  });

  describe("Error Boundary Integration", () => {
    it("throws StoriesLoadError when loading fails", async () => {
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

    it("throws StoryCreateError when creation fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
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

    it("throws StoryDeleteError when deletion fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
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

  describe("User Interactions", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("navigates to adventure when opened", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const openButtons = screen.getAllByLabelText(/^Open Adventure/);
      fireEvent.click(openButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/adventure/adventure-1/test/introduction"
      );
    });

    it("creates and navigates to new adventure", async () => {
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue(
        "new-adventure-id"
      );

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

    it("deletes adventure after confirmation", async () => {
      vi.mocked(adventureDatabase.deleteAdventure).mockResolvedValue();
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

      await waitFor(() => {
        expect(screen.queryByText("Adventure One")).not.toBeInTheDocument();
      });
      expect(screen.getByText("Adventure Two")).toBeInTheDocument();
    });

    it("cancels delete without removing adventure", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);
      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      expect(adventureDatabase.deleteAdventure).not.toHaveBeenCalled();
      expect(screen.getByText("Adventure One")).toBeInTheDocument();
    });
  });

  describe("File Import Integration", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("imports file successfully and navigates", async () => {
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
        expect(mockNavigate).toHaveBeenCalledWith(
          "/adventure/imported-id/test/introduction"
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

      expect(
        screen.getByText("Invalid YAML: Missing metadata")
      ).toBeInTheDocument();
    });

    it("can close import error modal", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: "Some error",
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

      const closeButton = screen.getByRole("button", { name: "Close" });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Import Failed")).not.toBeInTheDocument();
      });
    });
  });

  describe("Modal State Management", () => {
    beforeEach(() => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue(mockStories);
    });

    it("disables file drop when delete modal is open", async () => {
      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const menuButton = screen.getByLabelText("Open menu for Adventure One");
      fireEvent.click(menuButton);
      const deleteMenuItem = screen.getByText("Delete");
      fireEvent.click(deleteMenuItem);

      expect(
        screen.getByText(/Are you sure you want to delete/)
      ).toBeInTheDocument();

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      expect(importYaml.importYamlFile).not.toHaveBeenCalled();
    });

    it("disables file drop when import error modal is open", async () => {
      vi.mocked(importYaml.importYamlFile).mockResolvedValue({
        success: false,
        error: "Error 1",
      });

      render(<AdventureManager />);

      await screen.findByText("Adventure One");

      const file1 = new File(["content"], "test1.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("adventure-manager-drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file1] },
      });

      await waitFor(() => {
        expect(screen.getByText("Import Failed")).toBeInTheDocument();
      });

      const file2 = new File(["content"], "test2.yaml", { type: "text/yaml" });

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file2] },
      });

      expect(importYaml.importYamlFile).toHaveBeenCalledTimes(1);
    });

    it("re-enables file drop after closing modals", async () => {
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

      const dropArea = screen.getByTestId("adventure-manager-drop-area");
      const file1 = new File(["content"], "test1.yaml", { type: "text/yaml" });

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file1] },
      });

      await waitFor(() => {
        expect(screen.getByText("Import Failed")).toBeInTheDocument();
      });

      const closeButton = screen.getByRole("button", { name: "Close" });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Import Failed")).not.toBeInTheDocument();
      });

      const file2 = new File(["content"], "test2.yaml", { type: "text/yaml" });

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file2] },
      });

      await waitFor(() => {
        expect(importYaml.importYamlFile).toHaveBeenCalledTimes(2);
      });
    });
  });
});
