import { useCallback } from "react";
import type { InventoryItem } from "@/data/types";
import {
  addItemToInventory,
  removeItemFromInventory,
} from "@/utils/inventoryManagement";
import { ToggleButton } from "@/components/common/ToggleButton/ToggleButton";
import {
  DebugInventoryTitle,
  DebugInventoryList,
  DebugInventoryItem,
} from "./DebugInventory.styles";

interface DebugInventoryProps {
  allItems: InventoryItem[];
  currentItemIds: string[];
  adventureId: string;
  onInventoryChange: () => void;
}

export const DebugInventory = ({
  allItems,
  currentItemIds,
  adventureId,
  onInventoryChange,
}: DebugInventoryProps) => {
  const handleToggleItem = useCallback(
    (itemId: string, isChecked: boolean) => {
      if (isChecked) {
        addItemToInventory(adventureId, itemId);
      } else {
        removeItemFromInventory(adventureId, itemId);
      }
      onInventoryChange();
    },
    [adventureId, onInventoryChange]
  );

  return (
    <>
      <DebugInventoryTitle>Inventory</DebugInventoryTitle>
      <DebugInventoryList>
        {allItems.map((item) => {
          const isChecked = currentItemIds.includes(item.id);
          return (
            <DebugInventoryItem key={item.id}>
              <ToggleButton
                label={item.name}
                isChecked={isChecked}
                onChange={(checked) => handleToggleItem(item.id, checked)}
                data-testid={`debug-item-${item.id}`}
              />
            </DebugInventoryItem>
          );
        })}
      </DebugInventoryList>
    </>
  );
};
