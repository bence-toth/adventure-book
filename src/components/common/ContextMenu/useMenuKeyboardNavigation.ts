import { useCallback } from "react";
import type { ContextMenuItemData } from "./useMenuItems";

interface UseMenuKeyboardNavigationProps {
  activeIndex: number | null;
  menuItems: ContextMenuItemData[];
  handleSelect: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
  setActiveIndex: (
    value: number | null | ((prev: number | null) => number | null)
  ) => void;
}

/**
 * Handles keyboard navigation within the context menu
 */
export const useMenuKeyboardNavigation = ({
  activeIndex,
  menuItems,
  handleSelect,
  onOpenChange,
  setActiveIndex,
}: UseMenuKeyboardNavigationProps) => {
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
    [activeIndex, menuItems, handleSelect, onOpenChange, setActiveIndex]
  );

  return { handleKeyDown };
};
