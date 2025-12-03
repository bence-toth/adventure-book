import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AdventureManagerTopBar } from "../AdventureManagerTopBar";
import { TOP_BAR_TEST_IDS } from "@/components/AdventureTopBar/testIds";
import { render } from "@/__tests__/testUtils";

describe("AdventureManagerTopBar Component", () => {
  const mockOnFileSelect = vi.fn();

  describe("Rendering", () => {
    it("renders the header element", () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders logo and app title", () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      // Should have logo
      const logo = screen.getByTestId(TOP_BAR_TEST_IDS.LOGO);
      expect(logo).toBeInTheDocument();

      // Should have the app title
      const title = screen.getByText("Adventure Book Companion");
      expect(title).toBeInTheDocument();
    });

    it("renders the context menu button", () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute(
        "aria-label",
        "Open adventure manager menu"
      );
    });
  });

  describe("Context Menu", () => {
    it("opens context menu when button is clicked", async () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      fireEvent.click(menuButton);

      await waitFor(() => {
        const contextMenu = screen.getByTestId(
          "adventure-manager-context-menu"
        );
        expect(contextMenu).toBeInTheDocument();
      });
    });

    it("displays import option in context menu", async () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      fireEvent.click(menuButton);

      await waitFor(() => {
        const importOption = screen.getByTestId(
          "adventure-manager-context-menu-import"
        );
        expect(importOption).toBeInTheDocument();
        expect(importOption).toHaveTextContent("Import adventure from YAML");
      });
    });

    it("triggers file input when import option is clicked", async () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      fireEvent.click(menuButton);

      const fileInput = screen.getByTestId("adventure-manager-file-input");
      const clickSpy = vi.spyOn(fileInput, "click");

      await waitFor(() => {
        const importOption = screen.getByTestId(
          "adventure-manager-context-menu-import"
        );
        fireEvent.click(importOption);
      });

      expect(clickSpy).toHaveBeenCalled();
    });

    it("closes context menu after import option is clicked", async () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const menuButton = screen.getByTestId(
        "adventure-manager-context-menu-button"
      );
      fireEvent.click(menuButton);

      await waitFor(() => {
        const importOption = screen.getByTestId(
          "adventure-manager-context-menu-import"
        );
        fireEvent.click(importOption);
      });

      await waitFor(() => {
        const contextMenu = screen.queryByTestId(
          "adventure-manager-context-menu"
        );
        expect(contextMenu).not.toBeInTheDocument();
      });
    });
  });

  describe("File Selection", () => {
    it("calls onFileSelect when a file is selected", () => {
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const fileInput = screen.getByTestId(
        "adventure-manager-file-input"
      ) as HTMLInputElement;

      const file = new File(["test content"], "test.yaml", {
        type: "text/yaml",
      });

      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
      });

      fireEvent.change(fileInput);

      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
      // After calling onFileSelect, the input value should be reset
      expect(fileInput.value).toBe("");
    });

    it("does not call onFileSelect when no file is selected", () => {
      mockOnFileSelect.mockClear();
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const fileInput = screen.getByTestId(
        "adventure-manager-file-input"
      ) as HTMLInputElement;

      Object.defineProperty(fileInput, "files", {
        value: [],
        writable: false,
      });

      fireEvent.change(fileInput);

      expect(mockOnFileSelect).not.toHaveBeenCalled();
      // Input should still be reset even when no file is selected
      expect(fileInput.value).toBe("");
    });

    it("allows selecting the same file multiple times", () => {
      mockOnFileSelect.mockClear();
      render(<AdventureManagerTopBar onFileSelect={mockOnFileSelect} />);

      const fileInput = screen.getByTestId(
        "adventure-manager-file-input"
      ) as HTMLInputElement;

      const file = new File(["test content"], "test.yaml", {
        type: "text/yaml",
      });

      // First selection
      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);
      expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
      expect(fileInput.value).toBe("");

      // Second selection of the same file (possible because value was reset)
      Object.defineProperty(fileInput, "files", {
        value: [file],
        writable: false,
        configurable: true,
      });
      fireEvent.change(fileInput);
      expect(mockOnFileSelect).toHaveBeenCalledTimes(2);
      expect(fileInput.value).toBe("");
    });
  });
});
