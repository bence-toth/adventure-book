import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDropdownScrollClose } from "../useDropdownScrollClose";

describe("useDropdownScrollClose", () => {
  let mockElement: HTMLElement;
  let mockRefs: {
    reference: React.MutableRefObject<HTMLElement | null>;
  };

  beforeEach(() => {
    mockElement = document.createElement("button");
    document.body.appendChild(mockElement);
    mockRefs = {
      reference: { current: mockElement },
    };

    // Mock getBoundingClientRect
    mockElement.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 50,
      top: 100,
      left: 50,
      bottom: 150,
      right: 150,
      x: 50,
      y: 100,
      toJSON: () => ({}),
    }));
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
  });

  describe("Scroll Detection", () => {
    it("does not attach listeners when dropdown is closed", () => {
      const onOpenChange = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      renderHook(() =>
        useDropdownScrollClose({
          isOpen: false,
          onOpenChange,
          refs: mockRefs,
        })
      );

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true
      );

      addEventListenerSpy.mockRestore();
    });

    it("attaches scroll listener when dropdown is open", () => {
      const onOpenChange = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      renderHook(() =>
        useDropdownScrollClose({
          isOpen: true,
          onOpenChange,
          refs: mockRefs,
        })
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true
      );

      addEventListenerSpy.mockRestore();
    });

    it("does not attach listeners when shouldCloseOnScroll is false", () => {
      const onOpenChange = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      renderHook(() =>
        useDropdownScrollClose({
          isOpen: true,
          onOpenChange,
          refs: mockRefs,
          shouldCloseOnScroll: false,
        })
      );

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true
      );

      addEventListenerSpy.mockRestore();
    });

    it("removes listeners on cleanup", () => {
      const onOpenChange = vi.fn();
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() =>
        useDropdownScrollClose({
          isOpen: true,
          onOpenChange,
          refs: mockRefs,
        })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Visibility Checks", () => {
    it("calls onOpenChange when element scrolls above viewport", () => {
      const onOpenChange = vi.fn();

      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 50,
        top: -100,
        left: 50,
        bottom: -50,
        right: 150,
        x: 50,
        y: -100,
        toJSON: () => ({}),
      }));

      renderHook(() =>
        useDropdownScrollClose({
          isOpen: true,
          onOpenChange,
          refs: mockRefs,
        })
      );

      // Trigger scroll event
      window.dispatchEvent(new Event("scroll"));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls onOpenChange when element scrolls below viewport", () => {
      const onOpenChange = vi.fn();

      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 50,
        top: window.innerHeight + 100,
        left: 50,
        bottom: window.innerHeight + 150,
        right: 150,
        x: 50,
        y: window.innerHeight + 100,
        toJSON: () => ({}),
      }));

      renderHook(() =>
        useDropdownScrollClose({
          isOpen: true,
          onOpenChange,
          refs: mockRefs,
        })
      );

      // Trigger scroll event
      window.dispatchEvent(new Event("scroll"));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not call onOpenChange when element is visible", () => {
      const onOpenChange = vi.fn();

      renderHook(() =>
        useDropdownScrollClose({
          isOpen: true,
          onOpenChange,
          refs: mockRefs,
        })
      );

      // Trigger scroll event
      window.dispatchEvent(new Event("scroll"));

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("skips check in test environment with zero dimensions", () => {
      const onOpenChange = vi.fn();

      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));

      renderHook(() =>
        useDropdownScrollClose({
          isOpen: true,
          onOpenChange,
          refs: mockRefs,
        })
      );

      // Trigger scroll event
      window.dispatchEvent(new Event("scroll"));

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("State Changes", () => {
    it("reattaches listeners when isOpen changes to true", () => {
      const onOpenChange = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      const { rerender } = renderHook(
        ({ isOpen }) =>
          useDropdownScrollClose({
            isOpen,
            onOpenChange,
            refs: mockRefs,
          }),
        { initialProps: { isOpen: false } }
      );

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true
      );

      rerender({ isOpen: true });

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true
      );

      addEventListenerSpy.mockRestore();
    });

    it("removes listeners when isOpen changes to false", () => {
      const onOpenChange = vi.fn();
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { rerender } = renderHook(
        ({ isOpen }) =>
          useDropdownScrollClose({
            isOpen,
            onOpenChange,
            refs: mockRefs,
          }),
        { initialProps: { isOpen: true } }
      );

      rerender({ isOpen: false });

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("handles null reference gracefully", () => {
      const onOpenChange = vi.fn();
      const nullRefs = {
        reference: { current: null },
      };

      expect(() => {
        renderHook(() =>
          useDropdownScrollClose({
            isOpen: true,
            onOpenChange,
            refs: nullRefs,
          })
        );
      }).not.toThrow();
    });

    it("handles virtual elements without parentElement", () => {
      const onOpenChange = vi.fn();
      const virtualRef = {
        reference: { current: { getBoundingClientRect: vi.fn() } as never },
      };

      expect(() => {
        renderHook(() =>
          useDropdownScrollClose({
            isOpen: true,
            onOpenChange,
            refs: virtualRef,
          })
        );
      }).not.toThrow();
    });
  });
});
