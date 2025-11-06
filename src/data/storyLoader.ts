/// <reference types="../vite-env" />
import { StoryParser } from "./storyParser";
import type { Story, IntroductionContent } from "./types";

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
    return story.intro.paragraphs || [];
  },
  buttonText: "Begin Your Adventure",
};

export const getPassage = (id: number) => {
  const story = loadStory();
  return story.passages[id];
};

export const getAllPassages = () => {
  const story = loadStory();
  return story.passages;
};
