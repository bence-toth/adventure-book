// Unique key for this GitHub Pages project to avoid conflicts
const STORAGE_KEY = "adventure-book/progress";

interface AdventureProgress {
  passageId: number | null;
  inventory: string[];
}

interface ProgressData {
  [adventureId: string]: AdventureProgress;
}

const getProgressData = (): ProgressData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return {};
    }
    const data = JSON.parse(saved);
    return typeof data === "object" && data !== null ? data : {};
  } catch (error) {
    console.warn("Failed to get progress data from localStorage:", error);
    return {};
  }
};

const saveProgressData = (data: ProgressData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save progress data to localStorage:", error);
  }
};

const getAdventureProgress = (adventureId: string): AdventureProgress => {
  const data = getProgressData();
  return data[adventureId] || { passageId: null, inventory: [] };
};

export const saveCurrentPassageId = (
  adventureId: string,
  passageId: number
): void => {
  try {
    const data = getProgressData();
    const adventureProgress = data[adventureId] || {
      passageId: null,
      inventory: [],
    };
    data[adventureId] = { ...adventureProgress, passageId };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to save passage ID to localStorage:", error);
  }
};

export const getCurrentPassageId = (adventureId: string): number | null => {
  try {
    const adventureProgress = getAdventureProgress(adventureId);
    return adventureProgress.passageId;
  } catch (error) {
    console.warn("Failed to get passage ID from localStorage:", error);
    return null;
  }
};

export const clearCurrentPassageId = (adventureId: string): void => {
  try {
    const data = getProgressData();
    const adventureProgress = data[adventureId] || {
      passageId: null,
      inventory: [],
    };
    data[adventureId] = { ...adventureProgress, passageId: null };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to clear passage ID from localStorage:", error);
  }
};

export const saveInventory = (adventureId: string, itemIds: string[]): void => {
  try {
    const data = getProgressData();
    const adventureProgress = data[adventureId] || {
      passageId: null,
      inventory: [],
    };
    data[adventureId] = { ...adventureProgress, inventory: itemIds };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to save inventory to localStorage:", error);
  }
};

export const getInventory = (adventureId: string): string[] => {
  try {
    const adventureProgress = getAdventureProgress(adventureId);
    const inventory = adventureProgress.inventory;
    return Array.isArray(inventory)
      ? inventory.filter((item) => typeof item === "string")
      : [];
  } catch (error) {
    console.warn("Failed to get inventory from localStorage:", error);
    return [];
  }
};

export const clearInventory = (adventureId: string): void => {
  try {
    const data = getProgressData();
    const adventureProgress = data[adventureId] || {
      passageId: null,
      inventory: [],
    };
    data[adventureId] = { ...adventureProgress, inventory: [] };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to clear inventory from localStorage:", error);
  }
};
