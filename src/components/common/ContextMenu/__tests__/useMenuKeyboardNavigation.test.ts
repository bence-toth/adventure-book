import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMenuKeyboardNavigation } from "../useMenuKeyboardNavigation";
import type { ContextMenuItemData } from "../useMenuItems";

describe("useMenuKeyboardNavigation", () => {
  const createMockEvent = (
    key: string,
    shiftKey = false
  ): React.KeyboardEvent => {
    const event = {
      key,
      shiftKey,
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;
    return event;
  };

  describe("Tab Navigation", () => {
    it("moves to next item on Tab", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
        { onClick: vi.fn(), label: "Item 3", variant: "default" },
      ];

      const setActiveIndex = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 0,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
        })
      );

      const event = createMockEvent("Tab");
      result.current.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(setActiveIndex).toHaveBeenCalled();

      // Call the callback to verify the logic
      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(0)).toBe(1);
    });

    it("moves to previous item on Shift+Tab", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
        { onClick: vi.fn(), label: "Item 3", variant: "default" },
      ];

      const setActiveIndex = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 1,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
        })
      );

      const event = createMockEvent("Tab", true);
      result.current.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(setActiveIndex).toHaveBeenCalled();

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(1)).toBe(0);
    });

    it("wraps to last item on Tab from last position", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
        { onClick: vi.fn(), label: "Item 3", variant: "default" },
      ];

      const setActiveIndex = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 2,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
        })
      );

      const event = createMockEvent("Tab");
      result.current.handleKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(2)).toBe(0);
    });

    it("wraps to first item on Shift+Tab from first position", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
        { onClick: vi.fn(), label: "Item 3", variant: "default" },
      ];

      const setActiveIndex = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 0,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
        })
      );

      const event = createMockEvent("Tab", true);
      result.current.handleKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(0)).toBe(2);
    });

    it("starts at first item on Tab when no item is active", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
      ];

      const setActiveIndex = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: null,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
        })
      );

      const event = createMockEvent("Tab");
      result.current.handleKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(null)).toBe(0);
    });

    it("wraps to last item on Shift+Tab when no item is active", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
        { onClick: vi.fn(), label: "Item 3", variant: "default" },
      ];

      const setActiveIndex = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: null,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
        })
      );

      const event = createMockEvent("Tab", true);
      result.current.handleKeyDown(event);

      const callback = setActiveIndex.mock.calls[0][0] as (
        prev: number | null
      ) => number | null;
      expect(callback(null)).toBe(2);
    });
  });

  describe("Enter Key Selection", () => {
    it("selects active item on Enter", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
      ];

      const handleSelect = vi.fn();
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 1,
          menuItems,
          handleSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleSelect).toHaveBeenCalledWith("1");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does nothing on Enter when no item is active", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item", variant: "default" },
      ];

      const handleSelect = vi.fn();
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: null,
          menuItems,
          handleSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleSelect).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("does nothing on Enter when active index is out of bounds", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item", variant: "default" },
      ];

      const handleSelect = vi.fn();
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 999,
          menuItems,
          handleSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
        })
      );

      const event = createMockEvent("Enter");
      result.current.handleKeyDown(event);

      expect(handleSelect).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Space Key Selection", () => {
    it("selects active item on Space", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
      ];

      const handleSelect = vi.fn();
      const onOpenChange = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 0,
          menuItems,
          handleSelect,
          onOpenChange,
          setActiveIndex: vi.fn(),
        })
      );

      const event = createMockEvent(" ");
      result.current.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleSelect).toHaveBeenCalledWith("0");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does nothing on Space when no item is active", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item", variant: "default" },
      ];

      const handleSelect = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: null,
          menuItems,
          handleSelect,
          onOpenChange: vi.fn(),
          setActiveIndex: vi.fn(),
        })
      );

      const event = createMockEvent(" ");
      result.current.handleKeyDown(event);

      expect(handleSelect).not.toHaveBeenCalled();
    });
  });

  describe("Other Keys", () => {
    it("does not prevent default for unhandled keys", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item", variant: "default" },
      ];

      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 0,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex: vi.fn(),
        })
      );

      const event = createMockEvent("Escape");
      result.current.handleKeyDown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("ignores arrow keys", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
      ];

      const setActiveIndex = vi.fn();
      const { result } = renderHook(() =>
        useMenuKeyboardNavigation({
          activeIndex: 0,
          menuItems,
          handleSelect: vi.fn(),
          onOpenChange: vi.fn(),
          setActiveIndex,
        })
      );

      const event = createMockEvent("ArrowDown");
      result.current.handleKeyDown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(setActiveIndex).not.toHaveBeenCalled();
    });
  });

  describe("Memoization", () => {
    it("returns same handler reference when dependencies don't change", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item", variant: "default" },
      ];

      const props = {
        activeIndex: 0,
        menuItems,
        handleSelect: vi.fn(),
        onOpenChange: vi.fn(),
        setActiveIndex: vi.fn(),
      };

      const { result, rerender } = renderHook(() =>
        useMenuKeyboardNavigation(props)
      );

      const firstHandler = result.current.handleKeyDown;

      rerender();

      expect(result.current.handleKeyDown).toBe(firstHandler);
    });

    it("returns new handler reference when dependencies change", () => {
      const menuItems1: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
      ];

      const props1 = {
        activeIndex: 0,
        menuItems: menuItems1,
        handleSelect: vi.fn(),
        onOpenChange: vi.fn(),
        setActiveIndex: vi.fn(),
      };

      const { result, rerender } = renderHook(
        (props) => useMenuKeyboardNavigation(props),
        { initialProps: props1 }
      );

      const firstHandler = result.current.handleKeyDown;

      const menuItems2: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
      ];

      const props2 = {
        ...props1,
        menuItems: menuItems2,
      };

      rerender(props2);

      expect(result.current.handleKeyDown).not.toBe(firstHandler);
    });
  });
});
