import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileDropArea } from "../FileDropArea";
import { render } from "@/__tests__/testUtils";

describe("FileDropArea Component", () => {
  const mockOnFileDrop = vi.fn();

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

    it("shows overlay when dragging over", () => {
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
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });

      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();
      expect(screen.getByText("Drop file here")).toBeInTheDocument();
    });

    it("hides overlay when drag leaves", () => {
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

      // Enter and leave once
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      fireEvent.dragLeave(dropArea, {
        dataTransfer: { files: [] },
      });

      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();
    });
  });

  describe("File Drop Handling", () => {
    it("calls onFileDrop with any file", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      expect(mockOnFileDrop).toHaveBeenCalledTimes(1);
      expect(mockOnFileDrop).toHaveBeenCalledWith(file);
    });

    it("calls onFileDrop with first file when multiple files dropped", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const file1 = new File(["content1"], "test1.yaml", { type: "text/yaml" });
      const file2 = new File(["content2"], "test2.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file1, file2] },
      });

      expect(mockOnFileDrop).toHaveBeenCalledTimes(1);
      expect(mockOnFileDrop).toHaveBeenCalledWith(file1);
    });

    it("hides overlay after successful drop", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("drop-area");

      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();
    });
  });

  describe("Custom Drop Label", () => {
    it("uses custom drop label when provided", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop your adventure here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const dropArea = screen.getByTestId("drop-area");
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });

      expect(screen.getByText("Drop your adventure here")).toBeInTheDocument();
    });

    it("displays the provided drop label", () => {
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
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });

      expect(screen.getByText("Drop file here")).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("does not show overlay when disabled and dragging", () => {
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
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });

      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();
    });

    it("does not call onFileDrop when disabled", () => {
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

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("drop-area");

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      expect(mockOnFileDrop).not.toHaveBeenCalled();
    });

    it("works normally when disabled is false", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          isDisabled={false}
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const dropArea = screen.getByTestId("drop-area");
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });

      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      fireEvent.drop(dropArea, {
        dataTransfer: { files: [file] },
      });

      expect(mockOnFileDrop).toHaveBeenCalledWith(file);
    });
  });

  describe("Drag Events", () => {
    it("prevents default on dragOver", () => {
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
      const event = new Event("dragover", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "dataTransfer", {
        value: { files: [] },
      });

      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      dropArea.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("prevents default on drop", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div>Content</div>
        </FileDropArea>
      );

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const dropArea = screen.getByTestId("drop-area");
      const event = new Event("drop", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "dataTransfer", {
        value: { files: [file] },
      });

      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      dropArea.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Drag Cancellation", () => {
    it("hides overlay when drag is cancelled (dragend event)", async () => {
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
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      // Cancel drag (e.g., press ESC or drag back to original location)
      const dragEndEvent = new Event("dragend", { bubbles: true });
      await act(async () => {
        document.dispatchEvent(dragEndEvent);
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId("file-drop-overlay")
        ).not.toBeInTheDocument();
      });
    });

    it("hides overlay when file is dropped outside the drop area", async () => {
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
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      // Drop outside the drop area
      const dropEvent = new Event("drop", { bubbles: true });
      await act(async () => {
        document.dispatchEvent(dropEvent);
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId("file-drop-overlay")
        ).not.toBeInTheDocument();
      });
    });

    it("handles multiple drag enter/leave events correctly", () => {
      render(
        <FileDropArea
          onFileDrop={mockOnFileDrop}
          dropLabel="Drop file here"
          data-testid="drop-area"
        >
          <div data-testid="inner-element">Content</div>
        </FileDropArea>
      );

      const dropArea = screen.getByTestId("drop-area");
      const innerElement = screen.getByTestId("inner-element");

      // Enter the drop area
      fireEvent.dragEnter(dropArea, {
        dataTransfer: { files: [] },
      });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      // Enter a nested element (counter should increment)
      fireEvent.dragEnter(innerElement, {
        dataTransfer: { files: [] },
      });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      // Leave the nested element (counter should decrement but still > 0)
      fireEvent.dragLeave(innerElement, {
        dataTransfer: { files: [] },
      });
      expect(screen.getByTestId("file-drop-overlay")).toBeInTheDocument();

      // Leave the drop area (counter should reach 0)
      fireEvent.dragLeave(dropArea, {
        dataTransfer: { files: [] },
      });
      expect(screen.queryByTestId("file-drop-overlay")).not.toBeInTheDocument();
    });
  });
});
