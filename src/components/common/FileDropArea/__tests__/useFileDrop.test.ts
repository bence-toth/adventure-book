import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useFileDrop } from "../useFileDrop";
import type { DragEvent } from "react";

describe("useFileDrop Hook", () => {
  const mockOnFileDrop = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockDragEvent = (files: File[] = []): Partial<DragEvent> => ({
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: {
      files,
    } as unknown as DataTransfer,
  });

  describe("Initial State", () => {
    it("returns initial state with isDragging false", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      expect(result.current.isDragging).toBe(false);
    });

    it("returns handler functions", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      expect(typeof result.current.handleDragEnter).toBe("function");
      expect(typeof result.current.handleDragLeave).toBe("function");
      expect(typeof result.current.handleDragOver).toBe("function");
      expect(typeof result.current.handleDrop).toBe("function");
    });
  });

  describe("Drag Enter", () => {
    it("sets isDragging to true on drag enter", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });

      expect(result.current.isDragging).toBe(true);
    });

    it("prevents default and stops propagation", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragEnter(mockEvent as DragEvent<HTMLDivElement>);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it("does not set isDragging when disabled", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop, isDisabled: true })
      );

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });

      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("Drag Leave", () => {
    it("sets isDragging to false when drag counter reaches zero", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.handleDragLeave(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(false);
    });

    it("handles nested drag enter/leave correctly", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      // Enter twice (simulating nested elements)
      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      // Leave once - should still be dragging
      act(() => {
        result.current.handleDragLeave(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      // Leave again - should stop dragging
      act(() => {
        result.current.handleDragLeave(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("Drag Over", () => {
    it("prevents default and stops propagation", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      const mockEvent = createMockDragEvent();

      act(() => {
        result.current.handleDragOver(mockEvent as DragEvent<HTMLDivElement>);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe("Drop", () => {
    it("calls onFileDrop with the first file", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      const mockEvent = createMockDragEvent([file]);

      act(() => {
        result.current.handleDrop(mockEvent as DragEvent<HTMLDivElement>);
      });

      expect(mockOnFileDrop).toHaveBeenCalledWith(file);
    });

    it("calls onFileDrop with first file when multiple files dropped", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      const file1 = new File(["content1"], "test1.yaml", { type: "text/yaml" });
      const file2 = new File(["content2"], "test2.yaml", { type: "text/yaml" });
      const mockEvent = createMockDragEvent([file1, file2]);

      act(() => {
        result.current.handleDrop(mockEvent as DragEvent<HTMLDivElement>);
      });

      expect(mockOnFileDrop).toHaveBeenCalledWith(file1);
    });

    it("sets isDragging to false after drop", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.handleDrop(
          createMockDragEvent([file]) as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(false);
    });

    it("does not call onFileDrop when no files are dropped", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      act(() => {
        result.current.handleDrop(
          createMockDragEvent([]) as DragEvent<HTMLDivElement>
        );
      });

      expect(mockOnFileDrop).not.toHaveBeenCalled();
    });

    it("does not call onFileDrop when disabled", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop, isDisabled: true })
      );

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });

      act(() => {
        result.current.handleDrop(
          createMockDragEvent([file]) as DragEvent<HTMLDivElement>
        );
      });

      expect(mockOnFileDrop).not.toHaveBeenCalled();
    });

    it("resets drag counter to zero", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });

      // Enter multiple times to increment counter
      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });

      // Drop should reset counter
      act(() => {
        result.current.handleDrop(
          createMockDragEvent([file]) as DragEvent<HTMLDivElement>
        );
      });

      expect(result.current.isDragging).toBe(false);

      // Single leave should not trigger dragging again
      act(() => {
        result.current.handleDragLeave(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });

      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("Document Event Listeners", () => {
    it("hides overlay when dragend event is dispatched on document", async () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      const dragEndEvent = new Event("dragend");
      await act(async () => {
        document.dispatchEvent(dragEndEvent);
      });

      await waitFor(() => {
        expect(result.current.isDragging).toBe(false);
      });
    });

    it("hides overlay when drop event is dispatched on document", async () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      const dropEvent = new Event("drop");
      await act(async () => {
        document.dispatchEvent(dropEvent);
      });

      await waitFor(() => {
        expect(result.current.isDragging).toBe(false);
      });
    });

    it("cleans up event listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { unmount } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "dragend",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "drop",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("isDisabled Parameter", () => {
    it("works normally when isDisabled is false", () => {
      const { result } = renderHook(() =>
        useFileDrop({ onFileDrop: mockOnFileDrop, isDisabled: false })
      );

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      act(() => {
        result.current.handleDrop(
          createMockDragEvent([file]) as DragEvent<HTMLDivElement>
        );
      });

      expect(mockOnFileDrop).toHaveBeenCalledWith(file);
    });

    it("updates behavior when isDisabled changes from false to true", () => {
      const { result, rerender } = renderHook(
        ({ isDisabled }) =>
          useFileDrop({ onFileDrop: mockOnFileDrop, isDisabled }),
        { initialProps: { isDisabled: false } }
      );

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      expect(result.current.isDragging).toBe(true);

      // Change to disabled
      rerender({ isDisabled: true });

      act(() => {
        result.current.handleDragEnter(
          createMockDragEvent() as DragEvent<HTMLDivElement>
        );
      });
      // Should not change state when disabled
      expect(result.current.isDragging).toBe(true); // Still true from before
    });
  });
});
