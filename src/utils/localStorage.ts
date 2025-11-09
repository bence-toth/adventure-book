// Unique key for this GitHub Pages project to avoid conflicts
const STORAGE_KEY = "adventure-book/currentPassageId";
const INVENTORY_STORAGE_KEY = "adventure-book/inventory";

export const saveCurrentPassageId = (passageId: number): void => {
  try {
    localStorage.setItem(STORAGE_KEY, passageId.toString());
  } catch (error) {
    console.warn("Failed to save passage ID to localStorage:", error);
  }
};

export const getCurrentPassageId = (): number | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return null;
    }
    const passageId = parseInt(saved, 10);
    return isNaN(passageId) ? null : passageId;
  } catch (error) {
    console.warn("Failed to get passage ID from localStorage:", error);
    return null;
  }
};

export const clearCurrentPassageId = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear passage ID from localStorage:", error);
  }
};

export const saveInventory = (itemIds: string[]): void => {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(itemIds));
  } catch (error) {
    console.warn("Failed to save inventory to localStorage:", error);
  }
};

export const getInventory = (): string[] => {
  try {
    const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (saved === null) {
      return [];
    }
    const inventory = JSON.parse(saved);
    return Array.isArray(inventory) ? inventory : [];
  } catch (error) {
    console.warn("Failed to get inventory from localStorage:", error);
    return [];
  }
};

export const clearInventory = (): void => {
  try {
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear inventory from localStorage:", error);
  }
};
