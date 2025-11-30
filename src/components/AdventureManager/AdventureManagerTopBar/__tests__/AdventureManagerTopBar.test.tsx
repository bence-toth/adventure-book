import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AdventureManagerTopBar } from "../AdventureManagerTopBar";
import { TOP_BAR_TEST_IDS } from "@/constants/testIds";
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
});
