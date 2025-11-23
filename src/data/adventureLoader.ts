/// <reference types="../vite-env" />
import { AdventureParser } from "./adventureParser";
import type {
  Adventure,
  Passage,
  IntroductionContent,
  InventoryItem,
} from "./types";
import { getInventory } from "@/utils/localStorage";
import {
  addItemToInventory,
  removeItemFromInventory,
} from "@/utils/inventoryManagement";
import { getAdventure } from "./adventureDatabase";

// Import the YAML file as a string (for backwards compatibility)
import adventureYaml from "./adventure.yaml?raw";

let loadedAdventure: Adventure | null = null;
let currentAdventureId: string | null = null;

/**
 * Load an adventure from IndexedDB by ID
 */
export const loadAdventureById = async (
  adventureId: string
): Promise<Adventure> => {
  // Check if we already have this adventure loaded
  if (loadedAdventure && currentAdventureId === adventureId) {
    return loadedAdventure;
  }

  const storedAdventure = await getAdventure(adventureId);

  if (!storedAdventure) {
    throw new Error(`Adventure with id ${adventureId} not found`);
  }

  const adventure = AdventureParser.parseFromString(storedAdventure.content);

  // Validate the adventure
  const errors = AdventureParser.validateAdventure(adventure);
  if (errors.length > 0) {
    console.error("Adventure validation errors:", errors);
    throw new Error(`Adventure validation failed: ${errors.join(", ")}`);
  }

  loadedAdventure = adventure;
  currentAdventureId = adventureId;

  return adventure;
};

/**
 * Load the default adventure from the YAML file (for backwards compatibility)
 */
export const loadAdventure = (): Adventure => {
  if (!loadedAdventure) {
    loadedAdventure = AdventureParser.parseFromString(adventureYaml);

    // Validate the adventure
    const errors = AdventureParser.validateAdventure(loadedAdventure);
    if (errors.length > 0) {
      console.error("Adventure validation errors:", errors);
      throw new Error(`Adventure validation failed: ${errors.join(", ")}`);
    }
  }

  return loadedAdventure;
};

export const reloadAdventure = (): Adventure => {
  loadedAdventure = null;
  currentAdventureId = null;
  return loadAdventure();
};

export const introduction: IntroductionContent = {
  get title() {
    return loadAdventure().metadata.title;
  },
  get paragraphs() {
    const adventure = loadAdventure();
    return adventure.intro.paragraphs;
  },
  get action() {
    const adventure = loadAdventure();
    return adventure.intro.action;
  },
};

export const getPassage = (id: number): Passage | undefined => {
  const adventure = loadAdventure();
  return adventure.passages[id];
};

export const getAllPassages = (): Record<number, Passage> => {
  const adventure = loadAdventure();
  return adventure.passages;
};

export const getInventoryItems = (): InventoryItem[] => {
  const adventure = loadAdventure();
  return adventure.items;
};

export const getCurrentInventory = (adventureId: string): string[] => {
  return getInventory(adventureId);
};

// Re-export inventory management functions from the shared utility
// Note: These now require an adventureId parameter
export { addItemToInventory, removeItemFromInventory };
