import { useState, useEffect } from "react";
import { getCurrentInventory } from "../data/storyLoader";
import { useStory } from "../hooks/useStory";
import "./Sidebar.css";

export const Sidebar = () => {
  const [currentInventoryIds, setCurrentInventoryIds] = useState<string[]>([]);
  const { story } = useStory();

  useEffect(() => {
    // Load initial inventory from localStorage
    setCurrentInventoryIds(getCurrentInventory());

    // Set up a listener for storage changes
    const handleStorageChange = () => {
      setCurrentInventoryIds(getCurrentInventory());
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from the same window
    const handleInventoryUpdate = () => {
      setCurrentInventoryIds(getCurrentInventory());
    };

    window.addEventListener("inventoryUpdate", handleInventoryUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("inventoryUpdate", handleInventoryUpdate);
    };
  }, []);

  if (!story) {
    return null;
  }

  const currentItems = story.items.filter((item) =>
    currentInventoryIds.includes(item.id)
  );

  return (
    <aside className="sidebar">
      <h2>Inventory</h2>
      {currentItems.length === 0 ? (
        <p className="sidebar-inventory-empty">No items yet</p>
      ) : (
        <ul className="sidebar-inventory">
          {currentItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </aside>
  );
};
