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
passages:
  1:
    text: "Test passage"
`;

      expect(() => StoryParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: intro.text must be a non-empty string"
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
  });

  describe("textToParagraphs", () => {
    it("should split text by double newlines", () => {
      const rawStory = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Para 1\n\nPara 2\n\nPara 3" },
        passages: {
          1: { text: "Passage para 1\n\nPassage para 2" },
        },
      };

      // Access the private method directly for testing purposes
      const processedStory = StoryParser["processTextFields"](rawStory);

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
        intro: { text: "Line 1\nLine 2\n\nPara 2" },
        passages: {
          1: { text: "Passage line 1\nPassage line 2" },
        },
      };

      const processedStory = StoryParser["processTextFields"](rawStory);

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
        intro: { text: "Para 1\n\n\n\nPara 2\n\n" },
        passages: {
          1: { text: "\n\nPara 1\n\n\n\n" },
        },
      };

      const processedStory = StoryParser["processTextFields"](rawStory);

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
          2: { text: "Valid text" },
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
        intro: { text: "   \n\n   " }, // Only whitespace
        passages: {
          1: { text: "" }, // Empty string
          2: { text: "   " }, // Only spaces
        },
      };

      const processedStory = StoryParser["processTextFields"](rawStory);

      expect(processedStory.intro.paragraphs).toEqual([]);
      expect(processedStory.passages[1].paragraphs).toEqual([]);
      expect(processedStory.passages[2].paragraphs).toEqual([]);
    });
  });

  describe("validateStory", () => {
    it("should return no errors for valid story", () => {
      const validStory: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro", paragraphs: ["Intro"] },
        passages: {
          1: {
            text: "Passage 1",
            paragraphs: ["Passage 1"],
            choices: [{ text: "Go to 2", goto: 2 }],
          },
          2: {
            text: "Passage 2",
            paragraphs: ["Passage 2"],
            ending: true,
          },
        },
      };

      const errors = StoryParser.validateStory(validStory);
      expect(errors).toEqual([]);
    });

    it("should detect invalid goto references", () => {
      const invalidStory: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro", paragraphs: ["Intro"] },
        passages: {
          1: {
            text: "Passage 1",
            paragraphs: ["Passage 1"],
            choices: [
              { text: "Go to 2", goto: 2 },
              { text: "Go to 99", goto: 99 },
            ],
          },
          2: {
            text: "Passage 2",
            paragraphs: ["Passage 2"],
            choices: [{ text: "Go to 100", goto: 100 }],
          },
        },
      };

      const errors = StoryParser.validateStory(invalidStory);
      expect(errors).toContain("Passage 1 has invalid goto: 99");
      expect(errors).toContain("Passage 2 has invalid goto: 100");
    });

    it("should detect ending passages with choices", () => {
      const invalidStory: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro", paragraphs: ["Intro"] },
        passages: {
          1: {
            text: "Ending with choices",
            paragraphs: ["Ending with choices"],
            ending: true,
            choices: [{ text: "This shouldn't be here", goto: 2 }],
          },
        },
      };

      const errors = StoryParser.validateStory(invalidStory);
      expect(errors).toContain("Ending passage 1 should not have choices");
    });
  });

  describe("getEndingPassages", () => {
    it("should return all passages marked as endings", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro", paragraphs: ["Intro"] },
        passages: {
          1: {
            text: "Regular passage",
            paragraphs: ["Regular passage"],
            choices: [{ text: "Go", goto: 2 }],
          },
          2: {
            text: "Victory ending",
            paragraphs: ["Victory ending"],
            ending: true,
            type: "victory",
          },
          3: {
            text: "Another passage",
            paragraphs: ["Another passage"],
            choices: [{ text: "Go", goto: 4 }],
          },
          4: {
            text: "Defeat ending",
            paragraphs: ["Defeat ending"],
            ending: true,
            type: "defeat",
          },
          5: {
            text: "Neutral ending",
            paragraphs: ["Neutral ending"],
            ending: true,
            type: "neutral",
          },
        },
      };

      const endings = StoryParser.getEndingPassages(story);
      expect(endings.sort()).toEqual([2, 4, 5]);
    });

    it("should return empty array when no endings exist", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro", paragraphs: ["Intro"] },
        passages: {
          1: {
            text: "Regular passage",
            paragraphs: ["Regular passage"],
            choices: [{ text: "Go", goto: 2 }],
          },
          2: {
            text: "Another regular passage",
            paragraphs: ["Another regular passage"],
            choices: [{ text: "Go", goto: 1 }],
          },
        },
      };

      const endings = StoryParser.getEndingPassages(story);
      expect(endings).toEqual([]);
    });
  });
});
