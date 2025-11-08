/// <reference types="../vite-env" />
import { StoryParser } from "./storyParser";
import type { Story, Passage, IntroductionContent } from "./types";

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

// Note: Using getters for lazy loading - these satisfy the IntroductionContent interface
// but ensure the story is loaded on-demand when title/paragraphs are accessed.
// This allows the introduction object to be exported immediately without requiring
// the story to be loaded at module initialization time.
// Errors are now handled by React Error Boundaries for better UX.
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
