/// <reference types="../vite-env" />
import { AdventureParser } from "./adventureParser";
import { AdventureSerializer } from "./adventureSerializer";
import type {
  Adventure,
  Passage,
  IntroductionContent,
  InventoryItem,
} from "./types";
import { getAdventure, updateAdventureContent } from "./adventureDatabase";

// Import the YAML file as a string (for backwards compatibility)
import adventureYaml from "./adventure.yaml?raw";

let loadedAdventure: Adventure | null = null;
let currentAdventureId: string | null = null;

// Invalidate the cache for a specific adventure ID
export const invalidateAdventureCache = (adventureId?: string): void => {
  if (!adventureId || currentAdventureId === adventureId) {
    loadedAdventure = null;
    currentAdventureId = null;
  }
};

// Load an adventure from IndexedDB by ID
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

  loadedAdventure = adventure;
  currentAdventureId = adventureId;

  return adventure;
};

// Load the default adventure from the YAML file
export const loadAdventure = (): Adventure => {
  if (!loadedAdventure) {
    loadedAdventure = AdventureParser.parseFromString(adventureYaml);
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

// Save an adventure back to the database
export const saveAdventureById = async (
  adventureId: string,
  adventure: Adventure
): Promise<void> => {
  // Serialize the adventure to YAML format
  const yamlContent = AdventureSerializer.serializeToString(adventure);

  // Update the content in the database
  await updateAdventureContent(adventureId, yamlContent);

  // Invalidate the cache to force reload on next access
  invalidateAdventureCache(adventureId);
};
