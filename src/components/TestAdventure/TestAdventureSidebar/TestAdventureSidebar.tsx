import { useState, useEffect } from "react";
import { getCurrentInventory } from "@/data/adventureLoader";
import { useAdventure } from "@/context/useAdventure";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import { Inventory } from "./Inventory/Inventory";
import { DebugInventory } from "./DebugInventory/DebugInventory";

export const TestAdventureSidebar = () => {
  const [currentInventoryIds, setCurrentInventoryIds] = useState<string[]>([]);
  const { adventure, adventureId, debugModeEnabled } = useAdventure();

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

  const handleInventoryChange = () => {
    if (!adventureId) return;
    setCurrentInventoryIds(getCurrentInventory(adventureId));
    window.dispatchEvent(new Event("inventoryUpdate"));
  };

  if (!adventure || !adventureId) {
    return null;
  }

  const currentItems = adventure.items.filter((item) =>
    currentInventoryIds.includes(item.id)
  );

  return (
    <Sidebar>
      {debugModeEnabled ? (
        <DebugInventory
          allItems={adventure.items}
          currentItemIds={currentInventoryIds}
          adventureId={adventureId}
          onInventoryChange={handleInventoryChange}
        />
      ) : (
        <Inventory items={currentItems} />
      )}
    </Sidebar>
  );
};
