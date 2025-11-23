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
  const data = getProgressData();
  const adventureProgress = data[adventureId] || {
    passageId: null,
    inventory: [],
  };
  data[adventureId] = { ...adventureProgress, passageId };
  saveProgressData(data);
};

export const getCurrentPassageId = (adventureId: string): number | null => {
  const adventureProgress = getAdventureProgress(adventureId);
  return adventureProgress.passageId;
};

export const clearCurrentPassageId = (adventureId: string): void => {
  const data = getProgressData();
  const adventureProgress = data[adventureId] || {
    passageId: null,
    inventory: [],
  };
  data[adventureId] = { ...adventureProgress, passageId: null };
  saveProgressData(data);
};

export const saveInventory = (adventureId: string, itemIds: string[]): void => {
  const data = getProgressData();
  const adventureProgress = data[adventureId] || {
    passageId: null,
    inventory: [],
  };
  data[adventureId] = { ...adventureProgress, inventory: itemIds };
  saveProgressData(data);
};

export const getInventory = (adventureId: string): string[] => {
  const adventureProgress = getAdventureProgress(adventureId);
  const inventory = adventureProgress.inventory;
  return Array.isArray(inventory)
    ? inventory.filter((item) => typeof item === "string")
    : [];
};

export const clearInventory = (adventureId: string): void => {
  const data = getProgressData();
  const adventureProgress = data[adventureId] || {
    passageId: null,
    inventory: [],
  };
  data[adventureId] = { ...adventureProgress, inventory: [] };
  saveProgressData(data);
};
