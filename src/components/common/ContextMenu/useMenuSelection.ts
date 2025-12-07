import { useCallback } from "react";
import type { ContextMenuItemData } from "./useMenuItems";

/**
 * Handles menu item selection
 */
export const useMenuSelection = (menuItems: ContextMenuItemData[]) => {
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

  return { handleSelect };
};
