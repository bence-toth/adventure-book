import { getInventory, saveInventory } from "./localStorage";

export const addItemToInventory = (
  adventureId: string,
  itemId: string
): void => {
  const currentInventory = getInventory(adventureId);
  if (!currentInventory.includes(itemId)) {
    const updatedInventory = [...currentInventory, itemId];
    saveInventory(adventureId, updatedInventory);
  }
};

export const removeItemFromInventory = (
  adventureId: string,
  itemId: string
): void => {
  const currentInventory = getInventory(adventureId);
  const updatedInventory = currentInventory.filter((id) => id !== itemId);
  saveInventory(adventureId, updatedInventory);
};
