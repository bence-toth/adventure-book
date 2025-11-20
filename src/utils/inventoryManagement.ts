import { getInventory, saveInventory } from "./localStorage";

export const addItemToInventory = (storyId: string, itemId: string): void => {
  const currentInventory = getInventory(storyId);
  if (!currentInventory.includes(itemId)) {
    const updatedInventory = [...currentInventory, itemId];
    saveInventory(storyId, updatedInventory);
  }
};

export const removeItemFromInventory = (
  storyId: string,
  itemId: string
): void => {
  const currentInventory = getInventory(storyId);
  const updatedInventory = currentInventory.filter((id) => id !== itemId);
  saveInventory(storyId, updatedInventory);
};
