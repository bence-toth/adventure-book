import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCurrentInventory } from "@/data/adventureLoader";
import { useAdventure } from "@/context/useAdventure";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import { Inventory } from "./Inventory/Inventory";
import { DebugInventory } from "./DebugInventory/DebugInventory";
import { DebugNavigation } from "./DebugNavigation/DebugNavigation";

export const TestAdventureSidebar = () => {
  const { id } = useParams<{ id: string }>();
  const [currentInventoryIds, setCurrentInventoryIds] = useState<string[]>([]);
  const { adventure, adventureId, debugModeEnabled } = useAdventure();

  // Parse current passage ID from URL (null means we're on introduction)
  const currentPassageId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (!adventureId) {
      return;
    }

    // Load initial inventory from localStorage on mount
    // Using queueMicrotask to avoid synchronous setState in effect
    queueMicrotask(() => {
      setCurrentInventoryIds(getCurrentInventory(adventureId));
    });

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
        <>
          <DebugInventory
            allItems={adventure.items}
            currentItemIds={currentInventoryIds}
            adventureId={adventureId}
            onInventoryChange={handleInventoryChange}
          />
          <DebugNavigation
            adventure={adventure}
            adventureId={adventureId}
            currentPassageId={currentPassageId}
          />
        </>
      ) : (
        <Inventory items={currentItems} />
      )}
    </Sidebar>
  );
};
