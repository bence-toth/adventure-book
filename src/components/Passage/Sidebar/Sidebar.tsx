import { useState, useEffect } from "react";
import { getCurrentInventory } from "@/data/adventureLoader";
import { useAdventure } from "@/context/useAdventure";
import {
  SidebarContainer,
  SidebarTitle,
  SidebarInventoryEmpty,
  SidebarInventory,
} from "./Sidebar.styles";

export const Sidebar = () => {
  const [currentInventoryIds, setCurrentInventoryIds] = useState<string[]>([]);
  const { adventure, adventureId } = useAdventure();

  useEffect(() => {
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
    <SidebarContainer as="aside">
      <SidebarTitle>Inventory</SidebarTitle>
      {currentItems.length === 0 ? (
        <SidebarInventoryEmpty>No items yet</SidebarInventoryEmpty>
      ) : (
        <SidebarInventory>
          {currentItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </SidebarInventory>
      )}
    </SidebarContainer>
  );
};
