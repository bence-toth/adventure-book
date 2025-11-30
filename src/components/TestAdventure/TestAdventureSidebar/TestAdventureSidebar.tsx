import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCurrentInventory } from "@/data/adventureLoader";
import { useAdventure } from "@/context/useAdventure";
import { Sidebar } from "@/components/common/Sidebar/Sidebar";
import { ToggleButton } from "@/components/common/ToggleButton/ToggleButton";
import { Inventory } from "./Inventory/Inventory";
import { DebugInventory } from "./DebugInventory/DebugInventory";
import { DebugNavigation } from "./DebugNavigation/DebugNavigation";
import {
  SidebarLayout,
  SidebarContent,
  SidebarFooter,
} from "./TestAdventureSidebar.styles";

export const TestAdventureSidebar = () => {
  const { id } = useParams<{ id: string }>();
  const [currentInventoryIds, setCurrentInventoryIds] = useState<string[]>([]);
  const { adventure, adventureId, isDebugModeEnabled, setIsDebugModeEnabled } =
    useAdventure();

  // Parse current passage ID from URL (null means we're on introduction)
  const currentPassageId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (!adventureId) {
      return;
    }

    let isMounted = true;

    // Load initial inventory from localStorage on mount and when adventureId changes
    const updateInventory = () => {
      if (isMounted) {
        setCurrentInventoryIds(getCurrentInventory(adventureId));
      }
    };

    updateInventory();

    // Set up a listener for storage changes
    const handleStorageChange = () => {
      if (isMounted) {
        setCurrentInventoryIds(getCurrentInventory(adventureId));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from the same window
    const handleInventoryUpdate = () => {
      if (isMounted) {
        setCurrentInventoryIds(getCurrentInventory(adventureId));
      }
    };

    window.addEventListener("inventoryUpdate", handleInventoryUpdate);

    return () => {
      isMounted = false;
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
      <SidebarLayout>
        <SidebarContent>
          {isDebugModeEnabled ? (
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
        </SidebarContent>
        <SidebarFooter>
          <ToggleButton
            label="Debug mode"
            isChecked={isDebugModeEnabled}
            onChange={setIsDebugModeEnabled}
            data-testid="debug-mode-toggle"
          />
        </SidebarFooter>
      </SidebarLayout>
    </Sidebar>
  );
};
