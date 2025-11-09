/// <reference types="../vite-env" />
import { StoryParser } from "./storyParser";
import type {
  Story,
  Passage,
  IntroductionContent,
  InventoryItem,
} from "./types";
import { getInventory, saveInventory } from "../utils/localStorage";

// Import the YAML file as a string
import storyYaml from "./story.yaml?raw";

let loadedStory: Story | null = null;

export const loadStory = (): Story => {
  if (!loadedStory) {
    loadedStory = StoryParser.parseFromString(storyYaml);

    // Validate the story
    const errors = StoryParser.validateStory(loadedStory);
    if (errors.length > 0) {
      console.error("Story validation errors:", errors);
      throw new Error(`Story validation failed: ${errors.join(", ")}`);
    }
  }

  return loadedStory;
};

export const reloadStory = (): Story => {
  loadedStory = null;
  return loadStory();
};

export const introduction: IntroductionContent = {
  get title() {
    return loadStory().metadata.title;
  },
  get paragraphs() {
    const story = loadStory();
    return story.intro.paragraphs;
  },
  get action() {
    const story = loadStory();
    return story.intro.action;
  },
};

export const getPassage = (id: number): Passage | undefined => {
  const story = loadStory();
  return story.passages[id];
};

export const getAllPassages = (): Record<number, Passage> => {
  const story = loadStory();
  return story.passages;
};

export const getInventoryItems = (): InventoryItem[] => {
  const story = loadStory();
  return story.items;
};

export const getCurrentInventory = (): string[] => {
  return getInventory();
};

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
