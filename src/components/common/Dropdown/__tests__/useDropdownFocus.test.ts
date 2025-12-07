import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDropdownFocus } from "../useDropdownFocus";

describe("useDropdownFocus", () => {
  let mockListRef: React.MutableRefObject<Array<HTMLElement | null>>;
  let mockElements: HTMLElement[];

  beforeEach(() => {
    // Create mock elements
    mockElements = [
      document.createElement("div"),
      document.createElement("div"),
      document.createElement("div"),
    ];

    // Add focus method to each element
    mockElements.forEach((el) => {
      el.focus = vi.fn();
    });

    mockListRef = { current: mockElements };
  });

  describe("Focus Management", () => {
    it("focuses active element when dropdown is open", () => {
      renderHook(() =>
        useDropdownFocus({
          isOpen: true,
          activeIndex: 1,
          listRef: mockListRef,
        })
      );

      expect(mockElements[1].focus).toHaveBeenCalled();
    });

    it("does not focus when dropdown is closed", () => {
      renderHook(() =>
        useDropdownFocus({
          isOpen: false,
          activeIndex: 1,
          listRef: mockListRef,
        })
      );

      expect(mockElements[1].focus).not.toHaveBeenCalled();
    });

    it("does not focus when activeIndex is null", () => {
      renderHook(() =>
        useDropdownFocus({
          isOpen: true,
          activeIndex: null,
          listRef: mockListRef,
        })
      );

      mockElements.forEach((el) => {
        expect(el.focus).not.toHaveBeenCalled();
      });
    });

    it("focuses first element when activeIndex is 0", () => {
      renderHook(() =>
        useDropdownFocus({
          isOpen: true,
          activeIndex: 0,
          listRef: mockListRef,
        })
      );

      expect(mockElements[0].focus).toHaveBeenCalled();
      expect(mockElements[1].focus).not.toHaveBeenCalled();
      expect(mockElements[2].focus).not.toHaveBeenCalled();
    });

    it("focuses last element when activeIndex points to last item", () => {
      renderHook(() =>
        useDropdownFocus({
          isOpen: true,
          activeIndex: 2,
          listRef: mockListRef,
        })
      );

      expect(mockElements[0].focus).not.toHaveBeenCalled();
      expect(mockElements[1].focus).not.toHaveBeenCalled();
      expect(mockElements[2].focus).toHaveBeenCalled();
    });
  });

  describe("Active Index Changes", () => {
    it("refocuses when activeIndex changes", () => {
      const { rerender } = renderHook(
        ({ activeIndex }) =>
          useDropdownFocus({
            isOpen: true,
            activeIndex,
            listRef: mockListRef,
          }),
        { initialProps: { activeIndex: 0 } }
      );

      expect(mockElements[0].focus).toHaveBeenCalled();
      vi.clearAllMocks();

      rerender({ activeIndex: 1 });

      expect(mockElements[1].focus).toHaveBeenCalled();
    });

    it("stops focusing when activeIndex becomes null", () => {
      const { rerender } = renderHook(
        ({ activeIndex }) =>
          useDropdownFocus({
            isOpen: true,
            activeIndex,
            listRef: mockListRef,
          }),
        { initialProps: { activeIndex: 0 as number | null } }
      );

      expect(mockElements[0].focus).toHaveBeenCalled();
      vi.clearAllMocks();

      rerender({ activeIndex: null });

      mockElements.forEach((el) => {
        expect(el.focus).not.toHaveBeenCalled();
      });
    });

    it("does not call focus repeatedly for same activeIndex", () => {
      const { rerender } = renderHook(
        ({ activeIndex }) =>
          useDropdownFocus({
            isOpen: true,
            activeIndex,
            listRef: mockListRef,
          }),
        { initialProps: { activeIndex: 1 } }
      );

      expect(mockElements[1].focus).toHaveBeenCalledTimes(1);

      rerender({ activeIndex: 1 });

      // Should still only be called once since React optimizes effects with same deps
      expect(mockElements[1].focus).toHaveBeenCalledTimes(1);
    });
  });

  describe("Open State Changes", () => {
    it("focuses when dropdown opens with activeIndex set", () => {
      const { rerender } = renderHook(
        ({ isOpen }) =>
          useDropdownFocus({
            isOpen,
            activeIndex: 1,
            listRef: mockListRef,
          }),
        { initialProps: { isOpen: false } }
      );

      expect(mockElements[1].focus).not.toHaveBeenCalled();

      rerender({ isOpen: true });

      expect(mockElements[1].focus).toHaveBeenCalled();
    });

    it("does not attempt focus when dropdown closes", () => {
      const { rerender } = renderHook(
        ({ isOpen }) =>
          useDropdownFocus({
            isOpen,
            activeIndex: 1,
            listRef: mockListRef,
          }),
        { initialProps: { isOpen: true } }
      );

      expect(mockElements[1].focus).toHaveBeenCalledTimes(1);
      vi.clearAllMocks();

      rerender({ isOpen: false });

      expect(mockElements[1].focus).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles null element at activeIndex gracefully", () => {
      mockListRef.current[1] = null;

      expect(() => {
        renderHook(() =>
          useDropdownFocus({
            isOpen: true,
            activeIndex: 1,
            listRef: mockListRef,
          })
        );
      }).not.toThrow();
    });

    it("handles empty listRef", () => {
      mockListRef.current = [];

      expect(() => {
        renderHook(() =>
          useDropdownFocus({
            isOpen: true,
            activeIndex: 0,
            listRef: mockListRef,
          })
        );
      }).not.toThrow();
    });

    it("handles activeIndex out of bounds", () => {
      expect(() => {
        renderHook(() =>
          useDropdownFocus({
            isOpen: true,
            activeIndex: 999,
            listRef: mockListRef,
          })
        );
      }).not.toThrow();
    });

    it("handles negative activeIndex", () => {
      expect(() => {
        renderHook(() =>
          useDropdownFocus({
            isOpen: true,
            activeIndex: -1,
            listRef: mockListRef,
          })
        );
      }).not.toThrow();
    });
  });

  describe("List Reference Changes", () => {
    it("uses updated listRef when it changes", () => {
      const newElements = [document.createElement("div")];
      newElements[0].focus = vi.fn();
      const newListRef = { current: newElements };

      const { rerender } = renderHook(
        ({ listRef }) =>
          useDropdownFocus({
            isOpen: true,
            activeIndex: 0,
            listRef,
          }),
        { initialProps: { listRef: mockListRef } }
      );

      expect(mockElements[0].focus).toHaveBeenCalled();
      vi.clearAllMocks();

      rerender({ listRef: newListRef });

      expect(newElements[0].focus).toHaveBeenCalled();
    });
  });
});
