import { useState, useEffect } from "react";
import { getCurrentInventory } from "@/data/storyLoader";
import { useStory } from "@/context/useStory";
import {
  SidebarContainer,
  SidebarTitle,
  SidebarInventoryEmpty,
  SidebarInventory,
} from "./Sidebar.styles";

export const Sidebar = () => {
  const [currentInventoryIds, setCurrentInventoryIds] = useState<string[]>([]);
  const { story, storyId } = useStory();

  useEffect(() => {
    if (!storyId) return;

    // Load initial inventory from localStorage
    setCurrentInventoryIds(getCurrentInventory(storyId));

    // Set up a listener for storage changes
    const handleStorageChange = () => {
      setCurrentInventoryIds(getCurrentInventory(storyId));
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from the same window
    const handleInventoryUpdate = () => {
      setCurrentInventoryIds(getCurrentInventory(storyId));
    };

    window.addEventListener("inventoryUpdate", handleInventoryUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("inventoryUpdate", handleInventoryUpdate);
    };
  }, [storyId]);

  if (!story) {
    return null;
  }

  const currentItems = story.items.filter((item) =>
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
