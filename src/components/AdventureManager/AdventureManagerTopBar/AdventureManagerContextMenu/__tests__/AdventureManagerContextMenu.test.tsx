import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AdventureManagerContextMenu } from "../AdventureManagerContextMenu";
import { render } from "@/__tests__/testUtils";

describe("AdventureManagerContextMenu Component", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnImportClick = vi.fn();
  const mockTriggerRef = document.createElement("button");

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("does not render when open is false", () => {
      render(
        <AdventureManagerContextMenu
          open={false}
          onOpenChange={mockOnOpenChange}
          triggerRef={mockTriggerRef}
          onImportClick={mockOnImportClick}
        />
      );

      const contextMenu = screen.queryByTestId(
        "adventure-manager-context-menu"
      );
      expect(contextMenu).not.toBeInTheDocument();
    });

    it("renders when open is true", () => {
      render(
        <AdventureManagerContextMenu
          open={true}
          onOpenChange={mockOnOpenChange}
          triggerRef={mockTriggerRef}
          onImportClick={mockOnImportClick}
        />
      );

      const contextMenu = screen.getByTestId("adventure-manager-context-menu");
      expect(contextMenu).toBeInTheDocument();
    });

    it("renders import menu item with correct text and icon", () => {
      render(
        <AdventureManagerContextMenu
          open={true}
          onOpenChange={mockOnOpenChange}
          triggerRef={mockTriggerRef}
          onImportClick={mockOnImportClick}
        />
      );

      const importItem = screen.getByTestId(
        "adventure-manager-context-menu-import"
      );
      expect(importItem).toBeInTheDocument();
      expect(importItem).toHaveTextContent("Import adventure from YAML");
    });
  });

  describe("Interactions", () => {
    it("calls onImportClick when import item is clicked", () => {
      render(
        <AdventureManagerContextMenu
          open={true}
          onOpenChange={mockOnOpenChange}
          triggerRef={mockTriggerRef}
          onImportClick={mockOnImportClick}
        />
      );

      const importItem = screen.getByTestId(
        "adventure-manager-context-menu-import"
      );
      fireEvent.click(importItem);

      expect(mockOnImportClick).toHaveBeenCalledTimes(1);
    });
  });
});
