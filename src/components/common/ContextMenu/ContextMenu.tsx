import type { ReactNode, ComponentType } from "react";
import { useRef, useState } from "react";
import { Dropdown } from "@/components/common/Dropdown/Dropdown";
import { useMenuItems } from "./useMenuItems";
import { useMenuSelection } from "./useMenuSelection";
import { useMenuKeyboardNavigation } from "./useMenuKeyboardNavigation";

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

  const { menuItems, dropdownOptions } = useMenuItems(children);
  const { handleSelect } = useMenuSelection(menuItems);
  const { handleKeyDown } = useMenuKeyboardNavigation({
    activeIndex,
    menuItems,
    handleSelect,
    onOpenChange,
    setActiveIndex,
  });

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      options={dropdownOptions}
      onSelect={handleSelect}
      placement={placement}
      shouldMatchTriggerWidth={false}
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
