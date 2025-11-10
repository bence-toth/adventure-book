import { getInventory, saveInventory } from "./localStorage";

export const addItemToInventory = (itemId: string): void => {
  const currentInventory = getInventory();
  if (!currentInventory.includes(itemId)) {
    const updatedInventory = [...currentInventory, itemId];
    saveInventory(updatedInventory);
  }
};

export const removeItemFromInventory = (itemId: string): void => {
  const currentInventory = getInventory();
  const updatedInventory = currentInventory.filter((id) => id !== itemId);
  saveInventory(updatedInventory);
};
