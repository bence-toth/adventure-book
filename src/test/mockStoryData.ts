import type { Story, Passage, IntroductionContent } from "../data/types";
import { getInventory, saveInventory } from "../utils/localStorage";

export const mockIntroduction: IntroductionContent = {
  title: "Mock Test Adventure",
  paragraphs: [
    "This is the first mock introduction paragraph.",
    "This is the second mock introduction paragraph.",
    "This is the third mock introduction paragraph.",
  ],
  action: "Begin your test adventure",
};

export const mockPassages: Record<number, Passage> = {
  1: {
    paragraphs: [
      "This is mock passage 1.",
      "It has multiple paragraphs for testing.",
      "Choose your path in this test.",
    ],
    choices: [
      { text: "Go to mock passage 2", goto: 2 },
      { text: "Go to mock passage 3", goto: 3 },
      { text: "Return to start", goto: 1 },
    ],
  },
  2: {
    paragraphs: [
      "This is mock passage 2.",
      "You made the first choice in the test.",
    ],
    choices: [
      { text: "Continue to ending", goto: 4 },
      { text: "Go back to passage 1", goto: 1 },
    ],
  },
  3: {
    paragraphs: [
      "This is mock passage 3.",
      "You made the second choice in the test.",
    ],
    choices: [
      { text: "Continue to ending", goto: 4 },
      { text: "Go back to passage 1", goto: 1 },
    ],
  },
  4: {
    paragraphs: [
      "This is the mock ending passage.",
      "Congratulations on completing the mock test adventure!",
    ],
    ending: true,
    type: "victory",
  },
  5: {
    paragraphs: [
      "This is another mock ending passage.",
      "This represents a different ending type for testing.",
    ],
    ending: true,
    type: "defeat",
  },
  6: {
    paragraphs: ["This is a neutral mock ending passage."],
    ending: true,
    type: "neutral",
  },
};

export const mockStory: Story = {
  metadata: {
    title: "Mock Test Adventure",
    author: "Test Author",
    version: "1.0.0",
  },
  intro: {
    paragraphs: mockIntroduction.paragraphs,
    action: mockIntroduction.action,
  },
  passages: mockPassages,
  items: [
    { id: "mock_item_1", name: "Mock Item One" },
    { id: "mock_item_2", name: "Mock Item Two" },
  ],
};

// Factory function to create a mock story loader module
// This can be used in vi.mock() calls to replace the actual story loader
export const createMockStoryLoader = () => {
  // Lazy import to avoid circular dependency during module initialization
  // These functions are imported from storyLoader only when actually called
  const addItemToInventory = (itemId: string): void => {
    const currentInventory = getInventory();
    if (!currentInventory.includes(itemId)) {
      const updatedInventory = [...currentInventory, itemId];
      saveInventory(updatedInventory);
    }
  };

  const removeItemFromInventory = (itemId: string): void => {
    const currentInventory = getInventory();
    const updatedInventory = currentInventory.filter((id) => id !== itemId);
    saveInventory(updatedInventory);
  };

  return {
    loadStory: () => mockStory,
    introduction: mockIntroduction,
    getPassage: (id: number) => mockPassages[id],
    getAllPassages: () => mockPassages,
    getInventoryItems: () => mockStory.items,
    getCurrentInventory: () => getInventory(),
    addItemToInventory,
    removeItemFromInventory,
  };
};

// Create story loader mocks with custom data
export const createCustomMockStoryLoader = (customStory: Partial<Story>) => {
  const story = { ...mockStory, ...customStory };
  const introduction: IntroductionContent = {
    title: story.metadata.title,
    paragraphs: story.intro.paragraphs,
    action: story.intro.action,
  };

  // Lazy import to avoid circular dependency during module initialization
  const addItemToInventory = (itemId: string): void => {
    const currentInventory = getInventory();
    if (!currentInventory.includes(itemId)) {
      const updatedInventory = [...currentInventory, itemId];
      saveInventory(updatedInventory);
    }
  };

  const removeItemFromInventory = (itemId: string): void => {
    const currentInventory = getInventory();
    const updatedInventory = currentInventory.filter((id) => id !== itemId);
    saveInventory(updatedInventory);
  };

  return {
    loadStory: () => story,
    introduction,
    getPassage: (id: number) => story.passages[id],
    getAllPassages: () => story.passages,
    getInventoryItems: () => story.items,
    getCurrentInventory: () => getInventory(),
    addItemToInventory,
    removeItemFromInventory,
  };
};

// Helper function to create a simple mock passage for testing specific scenarios
// Due to discriminated union types, you must create either an ending passage or a regular passage
export const createMockPassage = (
  paragraphs: string[],
  options:
    | { ending: true; type?: "victory" | "defeat" | "neutral" }
    | { choices: { text: string; goto: number }[] }
): Passage => {
  if ("ending" in options) {
    return {
      paragraphs,
      ending: true,
      ...(options.type && { type: options.type }),
    };
  } else {
    return {
      paragraphs,
      choices: options.choices,
    };
  }
};

// Helper function to create a simple mock introduction for testing
export const createMockIntroduction = (
  title: string,
  paragraphs: string[],
  action: string
): IntroductionContent => ({
  title,
  paragraphs,
  action,
});
