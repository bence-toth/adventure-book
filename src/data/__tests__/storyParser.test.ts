import { StoryParser } from "../storyParser";
import type { Story, RawStory } from "../types";

// Note: Using 'yaml' package instead of 'js-yaml' for security
// The 'yaml' package is safe by default and doesn't execute arbitrary code

describe("StoryParser", () => {
  describe("parseFromString", () => {
    it("should parse a valid YAML story", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"

intro:
  text: |
    Welcome to the test story.
    
    This is a second paragraph.
  action: "Start adventure"

passages:
  1:
    text: |
      You are in passage 1.
      
      What do you do?
    choices:
      - text: "Go to passage 2"
        goto: 2

  2:
    text: |
      You are in passage 2.
    ending: true
    type: "victory"
`;

      const story = StoryParser.parseFromString(yamlContent);

      expect(story.metadata.title).toBe("Test Story");
      expect(story.metadata.author).toBe("Test Author");
      expect(story.metadata.version).toBe("1.0");
      expect(story.intro.paragraphs).toEqual([
        "Welcome to the test story.",
        "This is a second paragraph.",
      ]);
      expect(story.passages[1].paragraphs).toEqual([
        "You are in passage 1.",
        "What do you do?",
      ]);
      expect(story.passages[1].choices).toHaveLength(1);
      expect(story.passages[1].choices![0].text).toBe("Go to passage 2");
      expect(story.passages[1].choices![0].goto).toBe(2);
      expect(story.passages[2].ending).toBe(true);
      expect(story.passages[2].type).toBe("victory");
    });

    it("should handle single paragraph passages", () => {
      const yamlContent = `
metadata:
  title: "Single Paragraph Test"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Single paragraph intro."
  action: "Start Test"

passages:
  1:
    text: "Single paragraph passage."
    choices:
      - text: "Continue"
        goto: 2

  2:
    text: "Another single paragraph."
    ending: true
`;

      const story = StoryParser.parseFromString(yamlContent);

      expect(story.intro.paragraphs).toEqual(["Single paragraph intro."]);
      expect(story.passages[1].paragraphs).toEqual([
        "Single paragraph passage.",
      ]);
      expect(story.passages[2].paragraphs).toEqual([
        "Another single paragraph.",
      ]);
    });

    it("should handle passages without choices (endings)", () => {
      const yamlContent = `
metadata:
  title: "Ending Test"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Test intro."
  action: "Test Button"

passages:
  1:
    text: "This is an ending passage."
    ending: true
    type: "defeat"
`;

      const story = StoryParser.parseFromString(yamlContent);

      expect(story.passages[1].ending).toBe(true);
      expect(story.passages[1].type).toBe("defeat");
      expect(story.passages[1].choices).toBeUndefined();
    });

    it("should throw error for invalid YAML", () => {
      const invalidYaml = `
metadata:
  title: "Test Story"
  invalid: yaml: structure
`;

      expect(() => StoryParser.parseFromString(invalidYaml)).toThrow();
    });

    it("should throw error for missing metadata", () => {
      const yamlContent = `
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "Test passage"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Missing or invalid metadata object"
      );
    });

    it("should throw error for invalid metadata fields", () => {
      const yamlContentMissingTitle = `
metadata:
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test"
  action: "Test"
passages:
  1:
    text: "Test"
`;

      expect(() =>
        StoryParser.parseFromString(yamlContentMissingTitle)
      ).toThrow("Invalid YAML: metadata.title must be a non-empty string");

      const yamlContentEmptyAuthor = `
metadata:
  title: "Test Story"
  author: ""
  version: "1.0"
intro:
  text: "Test"
  action: "Test"
passages:
  1:
    text: "Test"
`;

      expect(() => StoryParser.parseFromString(yamlContentEmptyAuthor)).toThrow(
        "Invalid YAML: metadata.author must be a non-empty string"
      );
    });

    it("should throw error for missing intro", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
passages:
  1:
    text: "Test passage"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Missing or invalid intro object"
      );
    });

    it("should throw error for invalid intro text", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: ""
  action: "Test"
passages:
  1:
    text: "Test passage"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: intro.text must be a non-empty string"
      );
    });

    it("should throw error for missing intro action", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
passages:
  1:
    text: "Test passage"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: intro.action must be a non-empty string"
      );
    });

    it("should throw error for missing passages", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Missing or invalid passages object"
      );
    });

    it("should throw error for invalid passage ID", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  "not-a-number":
    text: "Test passage"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage ID 'not-a-number' must be numeric"
      );
    });

    it("should throw error for invalid passage structure", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: ""
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 text must be a non-empty string"
      );
    });

    it("should throw error for invalid choice structure", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "Test passage"
    choices:
      - text: ""
        goto: 2
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 choice 0 text must be a non-empty string"
      );

      const yamlContentInvalidGoto = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "Test passage"
    choices:
      - text: "Go somewhere"
        goto: "not-a-number"
`;

      expect(() => StoryParser.parseFromString(yamlContentInvalidGoto)).toThrow(
        "Invalid YAML: Passage 1 choice 0 goto must be a positive integer"
      );
    });

    it("should throw error for invalid passage type", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "Test passage"
    ending: true
    type: "invalid-type"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 type must be one of: victory, defeat, neutral"
      );
    });

    it("should throw error for ending: false", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "Test passage"
    ending: false
    choices:
      - text: "Go somewhere"
        goto: 2
  2:
    text: "Another passage"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 ending must be true (or omitted for non-ending passages)"
      );
    });

    it("should throw error for type without ending: true", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "Test passage"
    type: "victory"
    choices:
      - text: "Go somewhere"
        goto: 2
  2:
    text: "Another passage"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 type can only be used with ending: true"
      );
    });

    it("should throw error for non-ending passages without choices", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "This passage has no choices and is not marked as ending"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Non-ending passage 1 must have at least one choice"
      );
    });

    it("should throw error for non-ending passages with empty choices array", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "This passage has empty choices array"
    choices: []
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Non-ending passage 1 must have at least one choice"
      );
    });

    it("should throw error for ending passages with choices", () => {
      const yamlContent = `
metadata:
  title: "Test Story"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "This is an ending but has choices"
    ending: true
    choices:
      - text: "This shouldn't be allowed"
        goto: 2
  2:
    text: "Another passage"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Ending passage 1 must not have choices"
      );
    });
  });

  describe("textToParagraphs", () => {
    it("should split text by double newlines", () => {
      const rawStory = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Para 1\n\nPara 2\n\nPara 3", action: "Test" },
        passages: {
          1: { text: "Passage para 1\n\nPassage para 2", ending: true },
        },
      } as const;

      // Access the private method directly for testing purposes
      const processedStory = StoryParser["processTextFields"](
        rawStory as RawStory
      );

      expect(processedStory.intro.paragraphs).toEqual([
        "Para 1",
        "Para 2",
        "Para 3",
      ]);
      expect(processedStory.passages[1].paragraphs).toEqual([
        "Passage para 1",
        "Passage para 2",
      ]);
    });

    it("should handle single newlines within paragraphs", () => {
      const rawStory = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Line 1\nLine 2\n\nPara 2", action: "Test" },
        passages: {
          1: { text: "Passage line 1\nPassage line 2", ending: true },
        },
      } as const;

      const processedStory = StoryParser["processTextFields"](
        rawStory as RawStory
      );

      expect(processedStory.intro.paragraphs).toEqual([
        "Line 1 Line 2",
        "Para 2",
      ]);
      expect(processedStory.passages[1].paragraphs).toEqual([
        "Passage line 1 Passage line 2",
      ]);
    });

    it("should filter out empty paragraphs", () => {
      const rawStory = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Para 1\n\n\n\nPara 2\n\n", action: "Test" },
        passages: {
          1: { text: "\n\nPara 1\n\n\n\n", ending: true },
        },
      } as const;

      const processedStory = StoryParser["processTextFields"](
        rawStory as RawStory
      );

      expect(processedStory.intro.paragraphs).toEqual(["Para 1", "Para 2"]);
      expect(processedStory.passages[1].paragraphs).toEqual(["Para 1"]);
    });

    it("should handle missing or undefined text fields defensively", () => {
      // Test with a malformed raw story object that bypassed validation somehow
      const malformedRawStory = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: {}, // Missing text field
        passages: {
          1: {}, // Missing text field
          2: { text: "Valid text", ending: true },
        },
      } as unknown as RawStory;

      // Should not crash and should set empty paragraphs
      expect(() => {
        const processedStory =
          StoryParser["processTextFields"](malformedRawStory);
        expect(processedStory.intro.paragraphs).toEqual([]);
        expect(processedStory.passages[1].paragraphs).toEqual([]);
        expect(processedStory.passages[2].paragraphs).toEqual(["Valid text"]);
      }).not.toThrow();
    });

    it("should handle empty or whitespace-only text", () => {
      const rawStory = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "   \n\n   ", action: "Test" }, // Only whitespace
        passages: {
          1: { text: "", ending: true }, // Empty string
          2: { text: "   ", ending: true }, // Only spaces
        },
      } as const;

      const processedStory = StoryParser["processTextFields"](
        rawStory as RawStory
      );

      expect(processedStory.intro.paragraphs).toEqual([]);
      expect(processedStory.passages[1].paragraphs).toEqual([]);
      expect(processedStory.passages[2].paragraphs).toEqual([]);
    });
  });

  describe("validateStory", () => {
    it("should return no errors for valid story", () => {
      const validStory: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { paragraphs: ["Intro"], action: "Test" },
        passages: {
          1: {
            paragraphs: ["Passage 1"],
            choices: [{ text: "Go to 2", goto: 2 }],
          },
          2: {
            paragraphs: ["Passage 2"],
            ending: true,
          },
        },
        items: [],
      };

      const errors = StoryParser.validateStory(validStory);
      expect(errors).toEqual([]);
    });

    it("should detect invalid goto references", () => {
      const invalidStory: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { paragraphs: ["Intro"], action: "Test" },
        passages: {
          1: {
            paragraphs: ["Passage 1"],
            choices: [
              { text: "Go to 2", goto: 2 },
              { text: "Go to 99", goto: 99 },
            ],
          },
          2: {
            paragraphs: ["Passage 2"],
            choices: [{ text: "Go to 100", goto: 100 }],
          },
        },
        items: [],
      };

      const errors = StoryParser.validateStory(invalidStory);
      expect(errors).toContain("Passage 1 has invalid goto: 99");
      expect(errors).toContain("Passage 2 has invalid goto: 100");
    });
  });

  describe("getEndingPassages", () => {
    it("should return all passages marked as endings", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { paragraphs: ["Intro"], action: "Test" },
        passages: {
          1: {
            paragraphs: ["Regular passage"],
            choices: [{ text: "Go", goto: 2 }],
          },
          2: {
            paragraphs: ["Victory ending"],
            ending: true,
            type: "victory",
          },
          3: {
            paragraphs: ["Another passage"],
            choices: [{ text: "Go", goto: 4 }],
          },
          4: {
            paragraphs: ["Defeat ending"],
            ending: true,
            type: "defeat",
          },
          5: {
            paragraphs: ["Neutral ending"],
            ending: true,
            type: "neutral",
          },
        },
        items: [],
      };

      const endings = StoryParser.getEndingPassages(story);
      expect(endings.sort()).toEqual([2, 4, 5]);
    });

    it("should return empty array when no endings exist", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { paragraphs: ["Intro"], action: "Test" },
        passages: {
          1: {
            paragraphs: ["Regular passage"],
            choices: [{ text: "Go", goto: 2 }],
          },
          2: {
            paragraphs: ["Another regular passage"],
            choices: [{ text: "Go", goto: 1 }],
          },
        },
        items: [],
      };

      const endings = StoryParser.getEndingPassages(story);
      expect(endings).toEqual([]);
    });
  });

  describe("inventory and effects", () => {
    it("should parse a story with inventory items", () => {
      const yamlContent = `
metadata:
  title: "Inventory Test"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"
  - id: "another_item"
    name: "Another Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    ending: true
`;

      const story = StoryParser.parseFromString(yamlContent);

      expect(story.items).toHaveLength(2);
      expect(story.items[0]).toEqual({ id: "test_item", name: "Test Item" });
      expect(story.items[1]).toEqual({
        id: "another_item",
        name: "Another Item",
      });
    });

    it("should parse a story without inventory items", () => {
      const yamlContent = `
metadata:
  title: "No Inventory Test"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    ending: true
`;

      const story = StoryParser.parseFromString(yamlContent);

      expect(story.items).toEqual([]);
    });

    it("should parse passages with effects", () => {
      const yamlContent = `
metadata:
  title: "Effects Test"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "You find an item"
    effects:
      - type: "add_item"
        item: "test_item"
    choices:
      - text: "Continue"
        goto: 2

  2:
    text: "You continue your journey"
    effects:
      - type: "remove_item"
        item: "test_item"
    choices:
      - text: "End"
        goto: 3

  3:
    text: "The end"
    ending: true
`;

      const story = StoryParser.parseFromString(yamlContent);

      expect(story.passages[1].effects).toHaveLength(1);
      expect(story.passages[1].effects![0]).toEqual({
        type: "add_item",
        item: "test_item",
      });
      expect(story.passages[2].effects).toHaveLength(1);
      expect(story.passages[2].effects![0]).toEqual({
        type: "remove_item",
        item: "test_item",
      });
    });

    it("should reject invalid inventory item structure", () => {
      const yamlContent = `
metadata:
  title: "Invalid Inventory"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        /items\[.*\] name must be a non-empty string/
      );
    });

    it("should reject duplicate inventory item IDs", () => {
      const yamlContent = `
metadata:
  title: "Duplicate IDs"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "First Item"
  - id: "test_item"
    name: "Duplicate Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        /Duplicate item IDs: test_item/
      );
    });

    it("should reject effects referencing non-existent inventory items", () => {
      const yamlContent = `
metadata:
  title: "Invalid Effect"
  author: "Test Author"
  version: "1.0"

items:
  - id: "valid_item"
    name: "Valid Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    effects:
      - type: "add_item"
        item: "nonexistent_item"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        /effect .* references unknown item: nonexistent_item/
      );
    });

    it("should reject invalid effect types", () => {
      const yamlContent = `
metadata:
  title: "Invalid Effect Type"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    effects:
      - type: "invalid_type"
        item: "test_item"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        /effect .* type must be one of: add_item, remove_item/
      );
    });

    it("should reject ending passages with effects", () => {
      const yamlContent = `
metadata:
  title: "Ending With Effects"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    effects:
      - type: "add_item"
        item: "test_item"
    ending: true
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        /Ending passage 2 must not have effects/
      );
    });

    it("should parse passages with multiple effects", () => {
      const yamlContent = `
metadata:
  title: "Multiple Effects"
  author: "Test Author"
  version: "1.0"

items:
  - id: "item1"
    name: "Item One"
  - id: "item2"
    name: "Item Two"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "You find multiple items"
    effects:
      - type: "add_item"
        item: "item1"
      - type: "add_item"
        item: "item2"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    ending: true
`;

      const story = StoryParser.parseFromString(yamlContent);

      expect(story.passages[1].effects).toHaveLength(2);
      expect(story.passages[1].effects![0]).toEqual({
        type: "add_item",
        item: "item1",
      });
      expect(story.passages[1].effects![1]).toEqual({
        type: "add_item",
        item: "item2",
      });
    });
  });
});
