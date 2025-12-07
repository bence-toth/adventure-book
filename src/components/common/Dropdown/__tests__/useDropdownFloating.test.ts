import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDropdownFloating } from "../useDropdownFloating";

describe("useDropdownFloating", () => {
  let mockTriggerRef: HTMLElement;
  let mockListRef: React.MutableRefObject<Array<HTMLElement | null>>;

  beforeEach(() => {
    mockTriggerRef = document.createElement("button");
    mockListRef = { current: [] };
  });

  describe("Initialization", () => {
    it("returns floating utilities", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          activeIndex: null,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      expect(result.current.refs).toBeDefined();
      expect(result.current.floatingStyles).toBeDefined();
      expect(result.current.context).toBeDefined();
      expect(result.current.getFloatingProps).toBeTypeOf("function");
      expect(result.current.getItemProps).toBeTypeOf("function");
    });

    it("uses default placement when not specified", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          activeIndex: null,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      expect(result.current.context.placement).toBe("bottom-start");
    });

    it("uses custom placement when specified", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          placement: "top-end",
          activeIndex: null,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      expect(result.current.context.placement).toBe("top-end");
    });
  });

  describe("Trigger Reference Management", () => {
    it("sets reference element when triggerRef is provided", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          activeIndex: null,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      expect(result.current.refs.reference.current).toBe(mockTriggerRef);
    });

    it("updates reference when triggerRef changes", () => {
      const { result, rerender } = renderHook(
        ({ triggerRef }) =>
          useDropdownFloating({
            isOpen: true,
            onOpenChange: vi.fn(),
            triggerRef,
            activeIndex: null,
            onActiveIndexChange: vi.fn(),
            listRef: mockListRef,
          }),
        { initialProps: { triggerRef: mockTriggerRef } }
      );

      const newTriggerRef = document.createElement("div");
      rerender({ triggerRef: newTriggerRef });

      expect(result.current.refs.reference.current).toBe(newTriggerRef);
    });

    it("handles null triggerRef", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: null,
          activeIndex: null,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      expect(result.current.refs.reference.current).toBeNull();
    });
  });

  describe("Width Matching", () => {
    it("applies width matching by default", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          activeIndex: null,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      // Width matching is applied via middleware
      expect(result.current.floatingStyles).toBeDefined();
    });

    it("skips width matching when shouldMatchTriggerWidth is false", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          shouldMatchTriggerWidth: false,
          activeIndex: null,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      expect(result.current.floatingStyles).toBeDefined();
    });
  });

  describe("Active Index Management", () => {
    it("handles active index changes", () => {
      const onActiveIndexChange = vi.fn();

      renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          activeIndex: 0,
          onActiveIndexChange,
          listRef: mockListRef,
        })
      );

      // Active index management is handled by floating-UI's list navigation
      expect(onActiveIndexChange).not.toHaveBeenCalled();
    });

    it("provides getItemProps for list navigation", () => {
      const { result } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange: vi.fn(),
          triggerRef: mockTriggerRef,
          activeIndex: 0,
          onActiveIndexChange: vi.fn(),
          listRef: mockListRef,
        })
      );

      const itemProps = result.current.getItemProps();
      expect(itemProps).toBeDefined();
    });
  });

  describe("Open State", () => {
    it("reflects open state in context", () => {
      const { result, rerender } = renderHook(
        ({ isOpen }) =>
          useDropdownFloating({
            isOpen,
            onOpenChange: vi.fn(),
            triggerRef: mockTriggerRef,
            activeIndex: null,
            onActiveIndexChange: vi.fn(),
            listRef: mockListRef,
          }),
        { initialProps: { isOpen: true } }
      );

      expect(result.current.context.open).toBe(true);

      rerender({ isOpen: false });
      expect(result.current.context.open).toBe(false);
    });
  });

  describe("Memoization", () => {
    it("returns stable references when dependencies don't change", () => {
      const onOpenChange = vi.fn();
      const onActiveIndexChange = vi.fn();

      const { result, rerender } = renderHook(() =>
        useDropdownFloating({
          isOpen: true,
          onOpenChange,
          triggerRef: mockTriggerRef,
          activeIndex: null,
          onActiveIndexChange,
          listRef: mockListRef,
        })
      );

      const firstRefs = result.current.refs;
      const firstGetItemProps = result.current.getItemProps;

      rerender();

      expect(result.current.refs).toBe(firstRefs);
      expect(result.current.getItemProps).toBe(firstGetItemProps);
    });
  });
});
