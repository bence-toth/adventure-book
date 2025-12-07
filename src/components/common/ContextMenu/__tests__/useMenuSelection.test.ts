import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMenuSelection } from "../useMenuSelection";
import type { ContextMenuItemData } from "../useMenuItems";

describe("useMenuSelection", () => {
  describe("Selection Handling", () => {
    it("calls onClick for the selected item", () => {
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();
      const onClick3 = vi.fn();

      const menuItems: ContextMenuItemData[] = [
        { onClick: onClick1, label: "Item 1", variant: "default" },
        { onClick: onClick2, label: "Item 2", variant: "default" },
        { onClick: onClick3, label: "Item 3", variant: "default" },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("1");

      expect(onClick1).not.toHaveBeenCalled();
      expect(onClick2).toHaveBeenCalledTimes(1);
      expect(onClick3).not.toHaveBeenCalled();
    });

    it("selects first item when value is 0", () => {
      const onClick = vi.fn();
      const menuItems: ContextMenuItemData[] = [
        { onClick, label: "First Item", variant: "default" },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("0");

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("selects last item correctly", () => {
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();
      const onClick3 = vi.fn();

      const menuItems: ContextMenuItemData[] = [
        { onClick: onClick1, label: "Item 1", variant: "default" },
        { onClick: onClick2, label: "Item 2", variant: "default" },
        { onClick: onClick3, label: "Item 3", variant: "default" },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("2");

      expect(onClick1).not.toHaveBeenCalled();
      expect(onClick2).not.toHaveBeenCalled();
      expect(onClick3).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("does nothing when index is out of bounds", () => {
      const onClick = vi.fn();
      const menuItems: ContextMenuItemData[] = [
        { onClick, label: "Item", variant: "default" },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("999");

      expect(onClick).not.toHaveBeenCalled();
    });

    it("does nothing when index is negative", () => {
      const onClick = vi.fn();
      const menuItems: ContextMenuItemData[] = [
        { onClick, label: "Item", variant: "default" },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("-1");

      expect(onClick).not.toHaveBeenCalled();
    });

    it("does nothing with empty menu items array", () => {
      const menuItems: ContextMenuItemData[] = [];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      // Should not throw
      result.current.handleSelect("0");
    });

    it("handles invalid string values gracefully", () => {
      const onClick = vi.fn();
      const menuItems: ContextMenuItemData[] = [
        { onClick, label: "Item", variant: "default" },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("not-a-number");

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Memoization", () => {
    it("returns same handler reference when menu items don't change", () => {
      const menuItems: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item", variant: "default" },
      ];

      const { result, rerender } = renderHook(() =>
        useMenuSelection(menuItems)
      );

      const firstHandler = result.current.handleSelect;

      rerender();

      expect(result.current.handleSelect).toBe(firstHandler);
    });

    it("returns new handler reference when menu items change", () => {
      const menuItems1: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 1", variant: "default" },
      ];

      const { result, rerender } = renderHook(
        ({ items }) => useMenuSelection(items),
        { initialProps: { items: menuItems1 } }
      );

      const firstHandler = result.current.handleSelect;

      const menuItems2: ContextMenuItemData[] = [
        { onClick: vi.fn(), label: "Item 2", variant: "default" },
      ];

      rerender({ items: menuItems2 });

      expect(result.current.handleSelect).not.toBe(firstHandler);
    });
  });

  describe("Integration", () => {
    it("works with items of different variants", () => {
      const onClickDefault = vi.fn();
      const onClickDanger = vi.fn();

      const menuItems: ContextMenuItemData[] = [
        { onClick: onClickDefault, label: "Default", variant: "default" },
        { onClick: onClickDanger, label: "Delete", variant: "danger" },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("1");

      expect(onClickDefault).not.toHaveBeenCalled();
      expect(onClickDanger).toHaveBeenCalledTimes(1);
    });

    it("works with items that have icons", () => {
      const onClick = vi.fn();
      const TestIcon = () => null;

      const menuItems: ContextMenuItemData[] = [
        {
          onClick,
          label: "With Icon",
          variant: "default",
          icon: TestIcon,
        },
      ];

      const { result } = renderHook(() => useMenuSelection(menuItems));

      result.current.handleSelect("0");

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
