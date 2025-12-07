import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FileDropArea } from "../FileDropArea";
import { render } from "@/__tests__/testUtils";
import * as useFileDropModule from "../useFileDrop";

describe("FileDropArea Component", () => {
  const mockOnFileDrop = vi.fn();

  beforeEach(() => {
    // Restore the original implementation before each test
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders children", () => {
      render(
        <FileDropArea onFileDrop={mockOnFileDrop} dropLabel="Drop file here">
          <div data-testid="test-child">Test Content</div>
        </FileDropArea>
      );

      expect(screen.getByTestId("test-child")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("does not show overlay by default", () => {
      render(
        <FileDropArea onFileDrop={mockOnFileDrop} dropLabel="Drop file here">
          <div>Content</div>
        </FileDropArea>
      );

      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();
    });

    it("shows overlay when isDragging is true", () => {
      vi.spyOn(useFileDropModule, "useFileDrop").mockReturnValue({
        isDragging: true,
        handleDragEnter: vi.fn(),
        handleDragLeave: vi.fn(),
        handleDragOver: vi.fn(),
        handleDrop: vi.fn(),
      });

      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();
      expect(screen.getByText("Drop file here")).toBeInTheDocument();
    });

    it("displays custom drop label", () => {
      vi.spyOn(useFileDropModule, "useFileDrop").mockReturnValue({
        isDragging: true,
        handleDragEnter: vi.fn(),
        handleDragLeave: vi.fn(),
        handleDragOver: vi.fn(),
        handleDrop: vi.fn(),
      });

      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop your adventure here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      expect(screen.getByText("Drop your adventure here")).toBeInTheDocument();
    });
  });

  describe("Integration with useFileDrop Hook", () => {
    it("calls useFileDrop with correct parameters", () => {
      const useFileDropSpy = vi.spyOn(useFileDropModule, "useFileDrop");

      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          isDisabled={true}
        >
          <div>Content</div>
        </FileDropArea>
      );

      expect(useFileDropSpy).toHaveBeenCalledWith({
        onFileDrop: mockOnFileDrop,
        isDisabled: true,
      });
    });

    it("passes default isDisabled value to hook", () => {
      const useFileDropSpy = vi.spyOn(useFileDropModule, "useFileDrop");

      render(
        <FileDropArea onFileDrop={mockOnFileDrop} dropLabel="Drop file here">
          <div>Content</div>
        </FileDropArea>
      );

      expect(useFileDropSpy).toHaveBeenCalledWith({
        onFileDrop: mockOnFileDrop,
        isDisabled: false,
      });
    });

    it("attaches drag event handlers to container", () => {
      const mockHandlers = {
        isDragging: false,
        handleDragEnter: vi.fn(),
        handleDragLeave: vi.fn(),
        handleDragOver: vi.fn(),
        handleDrop: vi.fn(),
      };

      vi.spyOn(useFileDropModule, "useFileDrop").mockReturnValue(mockHandlers);

      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const dropArea = screen.getByTestId("drop-area");

      fireEvent.dragEnter(dropArea, { dataTransfer: { files: [] } });
      expect(mockHandlers.handleDragEnter).toHaveBeenCalled();

      fireEvent.dragLeave(dropArea, { dataTransfer: { files: [] } });
      expect(mockHandlers.handleDragLeave).toHaveBeenCalled();

      fireEvent.dragOver(dropArea, { dataTransfer: { files: [] } });
      expect(mockHandlers.handleDragOver).toHaveBeenCalled();

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      fireEvent.drop(dropArea, { dataTransfer: { files: [file] } });
      expect(mockHandlers.handleDrop).toHaveBeenCalled();
    });
  });

  describe("End-to-End Drag and Drop", () => {
    it("completes full drag and drop cycle", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const dropArea = screen.getByTestId("drop-area");

      // Start dragging
      fireEvent.dragEnter(dropArea, { dataTransfer: { files: [] } });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      // Drop file
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      fireEvent.drop(dropArea, { dataTransfer: { files: [file] } });

      // Verify callback was called
      expect(mockOnFileDrop).toHaveBeenCalledWith(file);

      // Overlay should be hidden
      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();
    });

    it("handles drag enter and leave without dropping", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const dropArea = screen.getByTestId("drop-area");

      // Start dragging
      fireEvent.dragEnter(dropArea, { dataTransfer: { files: [] } });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      // Leave without dropping
      fireEvent.dragLeave(dropArea, { dataTransfer: { files: [] } });

      // Overlay should be hidden and callback not called
      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();
      expect(mockOnFileDrop).not.toHaveBeenCalled();
    });

    it("works with disabled state", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          isDisabled={true}
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const dropArea = screen.getByTestId("drop-area");

      // Try to drag when disabled
      fireEvent.dragEnter(dropArea, { dataTransfer: { files: [] } });
      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();

      // Try to drop when disabled
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      fireEvent.drop(dropArea, { dataTransfer: { files: [file] } });
      expect(mockOnFileDrop).not.toHaveBeenCalled();
    });
  });
});
