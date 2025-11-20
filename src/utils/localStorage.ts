// Unique key for this GitHub Pages project to avoid conflicts
const STORAGE_KEY = "adventure-book/progress";

interface StoryProgress {
  passageId: number | null;
  inventory: string[];
}

interface ProgressData {
  [storyId: string]: StoryProgress;
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

const getStoryProgress = (storyId: string): StoryProgress => {
  const data = getProgressData();
  return data[storyId] || { passageId: null, inventory: [] };
};

export const saveCurrentPassageId = (
  storyId: string,
  passageId: number
): void => {
  try {
    const data = getProgressData();
    const storyProgress = data[storyId] || { passageId: null, inventory: [] };
    data[storyId] = { ...storyProgress, passageId };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to save passage ID to localStorage:", error);
  }
};

export const getCurrentPassageId = (storyId: string): number | null => {
  try {
    const storyProgress = getStoryProgress(storyId);
    return storyProgress.passageId;
  } catch (error) {
    console.warn("Failed to get passage ID from localStorage:", error);
    return null;
  }
};

export const clearCurrentPassageId = (storyId: string): void => {
  try {
    const data = getProgressData();
    const storyProgress = data[storyId] || { passageId: null, inventory: [] };
    data[storyId] = { ...storyProgress, passageId: null };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to clear passage ID from localStorage:", error);
  }
};

export const saveInventory = (storyId: string, itemIds: string[]): void => {
  try {
    const data = getProgressData();
    const storyProgress = data[storyId] || { passageId: null, inventory: [] };
    data[storyId] = { ...storyProgress, inventory: itemIds };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to save inventory to localStorage:", error);
  }
};

export const getInventory = (storyId: string): string[] => {
  try {
    const storyProgress = getStoryProgress(storyId);
    const inventory = storyProgress.inventory;
    return Array.isArray(inventory)
      ? inventory.filter((item) => typeof item === "string")
      : [];
  } catch (error) {
    console.warn("Failed to get inventory from localStorage:", error);
    return [];
  }
};

export const clearInventory = (storyId: string): void => {
  try {
    const data = getProgressData();
    const storyProgress = data[storyId] || { passageId: null, inventory: [] };
    data[storyId] = { ...storyProgress, inventory: [] };
    saveProgressData(data);
  } catch (error) {
    console.warn("Failed to clear inventory from localStorage:", error);
  }
};
