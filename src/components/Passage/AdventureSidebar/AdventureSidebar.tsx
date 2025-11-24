import { useState, useEffect } from "react";
import { getCurrentInventory } from "@/data/adventureLoader";
import { useAdventure } from "@/context/useAdventure";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import {
  InventoryTitle,
  InventoryEmpty,
  InventoryList,
} from "./AdventureSidebar.styles";

export const AdventureSidebar = () => {
  const [currentInventoryIds, setCurrentInventoryIds] = useState<string[]>([]);
  const { adventure, adventureId } = useAdventure();

  useEffect(() => {
    if (!adventureId) {
      return;
    }

    // Load initial inventory from localStorage
    setCurrentInventoryIds(getCurrentInventory(adventureId));

    // Set up a listener for storage changes
    const handleStorageChange = () => {
      setCurrentInventoryIds(getCurrentInventory(adventureId));
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from the same window
    const handleInventoryUpdate = () => {
      setCurrentInventoryIds(getCurrentInventory(adventureId));
    };

    window.addEventListener("inventoryUpdate", handleInventoryUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("inventoryUpdate", handleInventoryUpdate);
    };
  }, [adventureId]);

  if (!adventure) {
    return null;
  }

  const currentItems = adventure.items.filter((item) =>
    currentInventoryIds.includes(item.id)
  );

  return (
    <Sidebar>
      <InventoryTitle>Inventory</InventoryTitle>
      {currentItems.length === 0 ? (
        <InventoryEmpty>No items yet</InventoryEmpty>
      ) : (
        <InventoryList>
          {currentItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </InventoryList>
      )}
    </Sidebar>
  );
};
