import { useCallback } from "react";
import type { InventoryItem } from "@/data/types";
import { ToggleButton } from "@/components/common/ToggleButton/ToggleButton";
import {
  DebugInventoryTitle,
  DebugInventoryList,
  DebugInventoryItem,
} from "./DebugInventory.styles";

interface DebugInventoryProps {
  allItems: InventoryItem[];
  currentItemIds: string[];
  onAddItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export const DebugInventory = ({
  allItems,
  currentItemIds,
  onAddItem,
  onRemoveItem,
}: DebugInventoryProps) => {
  const handleToggleItem = useCallback(
    (itemId: string, isChecked: boolean) => {
      if (isChecked) {
        onAddItem(itemId);
      } else {
        onRemoveItem(itemId);
      }
    },
    [onAddItem, onRemoveItem]
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
