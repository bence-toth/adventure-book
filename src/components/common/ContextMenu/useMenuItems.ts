import type { ReactNode, ComponentType } from "react";
import { useMemo } from "react";
import { ContextMenuItem } from "./ContextMenu";
import type { DropdownOption } from "@/components/common/Dropdown/Dropdown";

export interface ContextMenuItemData {
  onClick: () => void;
  label: string;
  variant: "default" | "danger";
  icon?: ComponentType<Record<string, unknown>>;
  testId?: string;
}

interface ContextMenuItemProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "danger";
  icon?: ComponentType<Record<string, unknown>>;
  "data-testid"?: string;
}

/**
 * Extracts menu items from children and converts them to Dropdown options
 */
export const useMenuItems = (children: ReactNode) => {
  const menuItems = useMemo(() => {
    const items: ContextMenuItemData[] = [];

    const children_array = Array.isArray(children) ? children : [children];
    children_array.forEach((child) => {
      if (
        child &&
        typeof child === "object" &&
        "type" in child &&
        child.type === ContextMenuItem
      ) {
        const props = (child as { props: ContextMenuItemProps }).props;
        items.push({
          onClick: props.onClick,
          label: typeof props.children === "string" ? props.children : "",
          variant: props.variant || "default",
          icon: props.icon,
          testId: props["data-testid"],
        });
      }
    });

    return items;
  }, [children]);

  const dropdownOptions: DropdownOption[] = useMemo(
    () =>
      menuItems.map((item, index) => ({
        value: String(index),
        label: item.label,
        icon: item.icon,
        variant: item.variant,
        testId: item.testId,
      })),
    [menuItems]
  );

  return { menuItems, dropdownOptions };
};
