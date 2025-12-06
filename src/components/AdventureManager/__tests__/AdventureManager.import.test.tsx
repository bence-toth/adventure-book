import { screen, fireEvent, waitFor } from "@testing-library/react";
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

  describe("Empty State", () => {
    it("still shows New Adventure card when no stories exist", async () => {
      vi.mocked(adventureDatabase.listStories).mockResolvedValue([]);

      render(<AdventureManager />);

      expect(
        await screen.findByText("Create a new adventure")
      ).toBeInTheDocument();
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
          "/adventure/imported-id/test/introduction"
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
