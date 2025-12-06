import { useState, useEffect, useCallback, useMemo } from "react";
import type { Adventure } from "@/data/types";

interface UseTestAdventureStateParams {
  adventure: Adventure | null;
  passageId: number | null;
  isIntroduction: boolean;
}

interface UseTestAdventureStateReturn {
  inventory: string[];
  handleAddItem: (itemId: string) => void;
  handleRemoveItem: (itemId: string) => void;
}

/**
 * Custom hook for managing test adventure state, primarily inventory management.
 * Handles inventory state, route-based resets, and passage effect processing.
 *
 * Key responsibilities:
 * - Maintains inventory state across passage navigation
 * - Resets inventory when returning to introduction
 * - Processes passage effects (add_item, remove_item) on navigation
 * - Provides callbacks for manual inventory manipulation in debug mode
 * - Prevents duplicate items in inventory
 */
export const useTestAdventureState = ({
  adventure,
  passageId,
  isIntroduction,
}: UseTestAdventureStateParams): UseTestAdventureStateReturn => {
  // Key insight: inventory should be reset based on route, not in an effect
  // Normalize NaN to null to prevent infinite re-renders
  const normalizedPassageId =
    passageId !== null && isNaN(passageId) ? null : passageId;

  const inventoryKey = useMemo(
    () => (isIntroduction ? "intro" : normalizedPassageId),
    [isIntroduction, normalizedPassageId]
  );

  const [inventory, setInventory] = useState<string[]>([]);
  const [lastInventoryKey, setLastInventoryKey] = useState(inventoryKey);

  // Reset inventory when route changes to introduction
  // This is done in render (not useEffect) to avoid cascading updates
  if (inventoryKey !== lastInventoryKey) {
    if (inventoryKey === "intro") {
      setInventory([]);
    }
    setLastInventoryKey(inventoryKey);
  }

  // Apply passage effects to inventory when the user navigates to a new passage.
  // Each passage can define inventory effects (add/remove items) that should modify the inventory
  // when they arrive at that passage, supporting conditional choices and narrative state.
  // This processes passage effects and updates the inventory state accordingly.
  // It runs whenever passageId changes, iterating through the passage's effects array and
  // applying add_item or remove_item transformations to the inventory. Endings are skipped
  // since they don't have effects by design.
  useEffect(() => {
    if (
      !adventure ||
      isIntroduction ||
      normalizedPassageId === null ||
      isNaN(normalizedPassageId)
    )
      return;

    const passage = adventure.passages[normalizedPassageId];
    if (passage && !passage.ending && passage.effects) {
      passage.effects.forEach((effect) => {
        if (effect.type === "add_item") {
          setInventory((prev) =>
            prev.includes(effect.item) ? prev : [...prev, effect.item]
          );
        } else if (effect.type === "remove_item") {
          setInventory((prev) => prev.filter((id) => id !== effect.item));
        }
      });
    }
  }, [normalizedPassageId, adventure, isIntroduction]);

  // Inventory management callbacks for debug mode
  const handleAddItem = useCallback((itemId: string) => {
    setInventory((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setInventory((prev) => prev.filter((id) => id !== itemId));
  }, []);

  return {
    inventory,
    handleAddItem,
    handleRemoveItem,
  };
};
