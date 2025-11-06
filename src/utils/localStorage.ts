// Unique key for this GitHub Pages project to avoid conflicts
const STORAGE_KEY = "adventure-book/currentPassageId";

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
