import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMenuItems } from "../useMenuItems";
import { ContextMenuItem } from "../ContextMenu";
import { createElement } from "react";

describe("useMenuItems", () => {
  describe("Menu Item Extraction", () => {
    it("extracts menu items from single child", () => {
      const onClick = vi.fn();
      const children = createElement(ContextMenuItem, {
        onClick,
        children: "Test Item",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems).toHaveLength(1);
      expect(result.current.menuItems[0]).toEqual({
        onClick,
        label: "Test Item",
        variant: "default",
        icon: undefined,
        testId: undefined,
      });
    });

    it("extracts menu items from multiple children", () => {
      const onClick1 = vi.fn();
      const onClick2 = vi.fn();
      const onClick3 = vi.fn();
      const children = [
        createElement(ContextMenuItem, {
          onClick: onClick1,
          children: "Item 1",
        }),
        createElement(ContextMenuItem, {
          onClick: onClick2,
          children: "Item 2",
        }),
        createElement(ContextMenuItem, {
          onClick: onClick3,
          children: "Item 3",
        }),
      ];

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems).toHaveLength(3);
      expect(result.current.menuItems[0].label).toBe("Item 1");
      expect(result.current.menuItems[1].label).toBe("Item 2");
      expect(result.current.menuItems[2].label).toBe("Item 3");
    });

    it("handles empty children", () => {
      const { result } = renderHook(() => useMenuItems([]));

      expect(result.current.menuItems).toHaveLength(0);
      expect(result.current.dropdownOptions).toHaveLength(0);
    });

    it("filters out non-ContextMenuItem children", () => {
      const onClick = vi.fn();
      const children = [
        createElement(ContextMenuItem, { onClick, children: "Valid Item" }),
        createElement("div", { children: "Not a menu item" }),
        null,
        undefined,
      ];

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems).toHaveLength(1);
      expect(result.current.menuItems[0].label).toBe("Valid Item");
    });
  });

  describe("Variant Handling", () => {
    it("defaults to default variant when not specified", () => {
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Default Item",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems[0].variant).toBe("default");
    });

    it("uses danger variant when specified", () => {
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Delete",
        variant: "danger",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems[0].variant).toBe("danger");
    });

    it("uses default variant when explicitly specified", () => {
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Normal",
        variant: "default",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems[0].variant).toBe("default");
    });
  });

  describe("Icon Handling", () => {
    it("includes icon when provided", () => {
      const TestIcon = () => null;
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "With Icon",
        icon: TestIcon,
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems[0].icon).toBe(TestIcon);
    });

    it("leaves icon undefined when not provided", () => {
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Without Icon",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems[0].icon).toBeUndefined();
    });
  });

  describe("Test ID Handling", () => {
    it("includes test ID when provided", () => {
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Test Item",
        "data-testid": "custom-test-id",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems[0].testId).toBe("custom-test-id");
    });

    it("leaves test ID undefined when not provided", () => {
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Test Item",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.menuItems[0].testId).toBeUndefined();
    });
  });

  describe("Dropdown Options Conversion", () => {
    it("converts menu items to dropdown options", () => {
      const onClick = vi.fn();
      const TestIcon = () => null;
      const children = createElement(ContextMenuItem, {
        onClick,
        children: "Test Item",
        variant: "danger",
        icon: TestIcon,
        "data-testid": "test-id",
      });

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.dropdownOptions).toHaveLength(1);
      expect(result.current.dropdownOptions[0]).toEqual({
        value: "0",
        label: "Test Item",
        variant: "danger",
        icon: TestIcon,
        testId: "test-id",
      });
    });

    it("assigns sequential indices as values", () => {
      const children = [
        createElement(ContextMenuItem, {
          onClick: vi.fn(),
          children: "Item 1",
        }),
        createElement(ContextMenuItem, {
          onClick: vi.fn(),
          children: "Item 2",
        }),
        createElement(ContextMenuItem, {
          onClick: vi.fn(),
          children: "Item 3",
        }),
      ];

      const { result } = renderHook(() => useMenuItems(children));

      expect(result.current.dropdownOptions[0].value).toBe("0");
      expect(result.current.dropdownOptions[1].value).toBe("1");
      expect(result.current.dropdownOptions[2].value).toBe("2");
    });
  });

  describe("Memoization", () => {
    it("returns same references when children don't change", () => {
      const children = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Test Item",
      });

      const { result, rerender } = renderHook(() => useMenuItems(children));

      const firstMenuItems = result.current.menuItems;
      const firstDropdownOptions = result.current.dropdownOptions;

      rerender();

      expect(result.current.menuItems).toBe(firstMenuItems);
      expect(result.current.dropdownOptions).toBe(firstDropdownOptions);
    });

    it("returns new references when children change", () => {
      const children1 = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Item 1",
      });

      const { result, rerender } = renderHook(
        ({ children }) => useMenuItems(children),
        { initialProps: { children: children1 } }
      );

      const firstMenuItems = result.current.menuItems;
      const firstDropdownOptions = result.current.dropdownOptions;

      const children2 = createElement(ContextMenuItem, {
        onClick: vi.fn(),
        children: "Item 2",
      });

      rerender({ children: children2 });

      expect(result.current.menuItems).not.toBe(firstMenuItems);
      expect(result.current.dropdownOptions).not.toBe(firstDropdownOptions);
    });
  });
});
