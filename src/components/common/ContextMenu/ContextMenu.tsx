import type { ReactNode, ComponentType } from "react";
import { useMemo, useCallback } from "react";
import { useRef, useState } from "react";
import {
  Dropdown,
  type DropdownOption,
} from "@/components/common/Dropdown/Dropdown";

interface ContextMenuItemData {
  onClick: () => void;
  label: string;
  variant: "default" | "danger";
  icon?: ComponentType<Record<string, unknown>>;
  testId?: string;
}

interface ContextMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  triggerRef: HTMLElement | null;
  children: ReactNode;
  placement?:
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  "data-testid"?: string;
}

export const ContextMenu = ({
  isOpen,
  onOpenChange,
  triggerRef,
  children,
  placement = "bottom-start",
  "data-testid": dataTestId,
}: ContextMenuProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  // Extract menu items from children to convert to Dropdown options
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

  // Convert to Dropdown options
  const dropdownOptions: DropdownOption[] = menuItems.map((item, index) => ({
    value: String(index),
    label: item.label,
    icon: item.icon,
    variant: item.variant,
    testId: item.testId,
  }));

  const handleSelect = useCallback(
    (value: string) => {
      const index = parseInt(value, 10);
      const item = menuItems[index];
      if (item) {
        item.onClick();
      }
    },
    [menuItems]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Handle Tab navigation - trap tabs within the menu
      if (event.key === "Tab") {
        event.preventDefault();
        setActiveIndex((prev) => {
          if (event.shiftKey) {
            // Shift+Tab: Move to previous item
            if (prev === null || prev === 0) {
              return menuItems.length - 1; // Loop to last
            }
            return prev - 1;
          } else {
            // Tab: Move to next item
            if (prev === null) {
              return 0; // Start at first
            }
            if (prev === menuItems.length - 1) {
              return 0; // Loop to first
            }
            return prev + 1;
          }
        });
        return;
      }

      // Handle selection when menu is open
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (activeIndex !== null && menuItems[activeIndex]) {
          handleSelect(String(activeIndex));
          onOpenChange(false);
        }
      }
    },
    [activeIndex, menuItems, handleSelect, onOpenChange]
  );

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      options={dropdownOptions}
      onSelect={handleSelect}
      placement={placement}
      matchTriggerWidth={false}
      role="menu"
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      listRef={listRef}
      onKeyDown={handleKeyDown}
      data-testid={dataTestId || "context-menu"}
    />
  );
};

interface ContextMenuItemProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "danger";
  icon?: ComponentType<Record<string, unknown>>;
  "data-testid"?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ContextMenuItem = (_props: ContextMenuItemProps) => {
  // This component is just a marker for extracting menu items from children
  // It doesn't render anything directly
  return null;
};
