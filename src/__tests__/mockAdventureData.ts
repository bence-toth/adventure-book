import type { Adventure, Passage, IntroductionContent } from "@/data/types";
import { saveAdventure } from "@/data/adventureDatabase";
import { AdventureSerializer } from "@/data/adventureSerializer";
import { vi } from "vitest";

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
    notes: "Initial passage for testing. Offers three choices.",
    choices: [
      { text: "Go to mock passage 2", goto: 2 },
      { text: "Go to mock passage 3", goto: 3 },
      { text: "Continue to ending", goto: 4 },
    ],
  },
  2: {
    paragraphs: [
      "This is mock passage 2.",
      "You made the first choice in the test.",
    ],
    notes: "Second passage demonstrating first choice path.",
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
    notes: "Victory ending passage for testing.",
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

export const mockAdventure: Adventure = {
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

// Mock YAML content for the test adventure
export const mockAdventureYaml = `metadata:
  title: "Mock Test Adventure"
  author: "Test Author"
  version: "1.0.0"

intro:
  text: |
    This is the first mock introduction paragraph.
    
    This is the second mock introduction paragraph.
    
    This is the third mock introduction paragraph.
  action: "Begin your test adventure"

passages:
  1:
    notes: "Initial passage for testing. Offers three choices."
    text: |
      This is mock passage 1.
      
      It has multiple paragraphs for testing.
      
      Choose your path in this test.
    choices:
      - text: "Go to mock passage 2"
        goto: 2
      - text: "Go to mock passage 3"
        goto: 3
      - text: "Continue to ending"
        goto: 4
  2:
    notes: "Second passage demonstrating first choice path."
    text: |
      This is mock passage 2.
      
      You made the first choice in the test.
    choices:
      - text: "Continue to ending"
        goto: 4
      - text: "Go back to passage 1"
        goto: 1
  3:
    text: |
      This is mock passage 3.
      
      You made the second choice in the test.
    choices:
      - text: "Continue to ending"
        goto: 4
      - text: "Go back to passage 1"
        goto: 1
  4:
    notes: "Victory ending passage for testing."
    text: |
      This is the mock ending passage.
      
      Congratulations on completing the mock test adventure!
    ending: true
    type: "victory"
  5:
    text: |
      This is another mock ending passage.
      
      This represents a different ending type for testing.
    ending: true
    type: "defeat"
  6:
    text: |
      This is a neutral mock ending passage.
    ending: true
    type: "neutral"

items:
  - id: "mock_item_1"
    name: "Mock Item One"
  - id: "mock_item_2"
    name: "Mock Item Two"
`;

// Setup a test adventure in IndexedDB
// @param adventureId The ID to use for the test adventure (defaults to "test-adventure-id")
// @returns Promise that resolves when the adventure is saved
export const setupTestAdventure = async (
  adventureId = "test-adventure-id"
): Promise<void> => {
  await saveAdventure({
    id: adventureId,
    title: mockAdventure.metadata.title,
    content: mockAdventureYaml,
    lastEdited: new Date(),
    createdAt: new Date(),
  });
};

// Factory function to create a mock adventure loader module
// This can be used in vi.mock() calls to replace the actual adventure loader
export const createMockAdventureLoader = () => {
  let currentAdventure = { ...mockAdventure };

  return {
    loadAdventure: () => currentAdventure,
    loadAdventureById: async () => currentAdventure,
    reloadAdventure: () => currentAdventure,
    invalidateAdventureCache: vi.fn(),
    saveAdventureById: async (_adventureId: string, adventure: Adventure) => {
      currentAdventure = { ...adventure };
      // Mock implementation for testing - just return the serialized YAML
      return AdventureSerializer.serializeToString(adventure);
    },
    introduction: mockIntroduction,
    getPassage: (id: number) => currentAdventure.passages[id],
    getAllPassages: () => currentAdventure.passages,
    getInventoryItems: () => currentAdventure.items,
  };
};

// Create adventure loader mocks with custom data
export const createCustomMockAdventureLoader = (
  customAdventure: Partial<Adventure>
) => {
  const adventure = { ...mockAdventure, ...customAdventure };
  const introduction: IntroductionContent = {
    title: adventure.metadata.title,
    paragraphs: adventure.intro.paragraphs,
    action: adventure.intro.action,
  };

  return {
    loadAdventure: () => adventure,
    loadAdventureById: async () => adventure,
    reloadAdventure: () => adventure,
    invalidateAdventureCache: vi.fn(),
    saveAdventureById: vi.fn(),
    introduction,
    getPassage: (id: number) => adventure.passages[id],
    getAllPassages: () => adventure.passages,
    getInventoryItems: () => adventure.items,
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
