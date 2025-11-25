import type { InventoryItem } from "@/data/types";
import {
  InventoryTitle,
  InventoryEmpty,
  InventoryList,
} from "./Inventory.styles";

interface InventoryProps {
  items: InventoryItem[];
}

export const Inventory = ({ items }: InventoryProps) => {
  return (
    <>
      <InventoryTitle>Inventory</InventoryTitle>
      {items.length === 0 ? (
        <InventoryEmpty>No items yet</InventoryEmpty>
      ) : (
        <InventoryList>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </InventoryList>
      )}
    </>
  );
};
