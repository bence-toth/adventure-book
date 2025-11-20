/// <reference types="../vite-env" />
import { StoryParser } from "./storyParser";
import type {
  Story,
  Passage,
  IntroductionContent,
  InventoryItem,
} from "./types";
import { getInventory } from "../utils/localStorage";
import {
  addItemToInventory,
  removeItemFromInventory,
} from "../utils/inventoryManagement";
import { getStory } from "./storyDatabase";

// Import the YAML file as a string (for backwards compatibility)
import storyYaml from "./story.yaml?raw";

let loadedStory: Story | null = null;
let currentStoryId: string | null = null;

/**
 * Load a story from IndexedDB by ID
 */
export const loadStoryById = async (storyId: string): Promise<Story> => {
  // Check if we already have this story loaded
  if (loadedStory && currentStoryId === storyId) {
    return loadedStory;
  }

  const storedStory = await getStory(storyId);

  if (!storedStory) {
    throw new Error(`Story with id ${storyId} not found`);
  }

  const story = StoryParser.parseFromString(storedStory.content);

  // Validate the story
  const errors = StoryParser.validateStory(story);
  if (errors.length > 0) {
    console.error("Story validation errors:", errors);
    throw new Error(`Story validation failed: ${errors.join(", ")}`);
  }

  loadedStory = story;
  currentStoryId = storyId;

  return story;
};

/**
 * Load the default story from the YAML file (for backwards compatibility)
 */
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
  currentStoryId = null;
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

// Re-export inventory management functions from the shared utility
export { addItemToInventory, removeItemFromInventory };
