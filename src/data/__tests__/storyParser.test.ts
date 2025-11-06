import { StoryParser } from "../storyParser";
import type { Story } from "../types";

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
  });

  describe("textToParagraphs", () => {
    it("should split text by double newlines", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Para 1\n\nPara 2\n\nPara 3" },
        passages: {
          1: { text: "Passage para 1\n\nPassage para 2" },
        },
      };

      // Access the private method through the public parseFromString method
      StoryParser["processTextFields"](story);

      expect(story.intro.paragraphs).toEqual(["Para 1", "Para 2", "Para 3"]);
      expect(story.passages[1].paragraphs).toEqual([
        "Passage para 1",
        "Passage para 2",
      ]);
    });

    it("should handle single newlines within paragraphs", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Line 1\nLine 2\n\nPara 2" },
        passages: {
          1: { text: "Passage line 1\nPassage line 2" },
        },
      };

      StoryParser["processTextFields"](story);

      expect(story.intro.paragraphs).toEqual(["Line 1 Line 2", "Para 2"]);
      expect(story.passages[1].paragraphs).toEqual([
        "Passage line 1 Passage line 2",
      ]);
    });

    it("should filter out empty paragraphs", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Para 1\n\n\n\nPara 2\n\n" },
        passages: {
          1: { text: "\n\nPara 1\n\n\n\n" },
        },
      };

      StoryParser["processTextFields"](story);

      expect(story.intro.paragraphs).toEqual(["Para 1", "Para 2"]);
      expect(story.passages[1].paragraphs).toEqual(["Para 1"]);
    });
  });

  describe("validateStory", () => {
    it("should return no errors for valid story", () => {
      const validStory: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro" },
        passages: {
          1: {
            text: "Passage 1",
            choices: [{ text: "Go to 2", goto: 2 }],
          },
          2: {
            text: "Passage 2",
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
        intro: { text: "Intro" },
        passages: {
          1: {
            text: "Passage 1",
            choices: [
              { text: "Go to 2", goto: 2 },
              { text: "Go to 99", goto: 99 },
            ],
          },
          2: {
            text: "Passage 2",
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
        intro: { text: "Intro" },
        passages: {
          1: {
            text: "Ending with choices",
            ending: true,
            choices: [{ text: "This shouldn't be here", goto: 2 }],
          },
        },
      };

      const errors = StoryParser.validateStory(invalidStory);
      expect(errors).toContain("Ending passage 1 should not have choices");
    });

    it("should allow self-referencing passages (loops)", () => {
      const storyWithLoop: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro" },
        passages: {
          1: {
            text: "Looping passage",
            choices: [{ text: "Loop back", goto: 1 }],
          },
        },
      };

      const errors = StoryParser.validateStory(storyWithLoop);
      expect(errors).toEqual([]);
    });
  });

  describe("getEndingPassages", () => {
    it("should return all passages marked as endings", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro" },
        passages: {
          1: { text: "Regular passage", choices: [{ text: "Go", goto: 2 }] },
          2: { text: "Victory ending", ending: true, type: "victory" },
          3: { text: "Another passage", choices: [{ text: "Go", goto: 4 }] },
          4: { text: "Defeat ending", ending: true, type: "defeat" },
          5: { text: "Neutral ending", ending: true, type: "neutral" },
        },
      };

      const endings = StoryParser.getEndingPassages(story);
      expect(endings.sort()).toEqual([2, 4, 5]);
    });

    it("should return empty array when no endings exist", () => {
      const story: Story = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Intro" },
        passages: {
          1: { text: "Regular passage", choices: [{ text: "Go", goto: 2 }] },
          2: {
            text: "Another regular passage",
            choices: [{ text: "Go", goto: 1 }],
          },
        },
      };

      const endings = StoryParser.getEndingPassages(story);
      expect(endings).toEqual([]);
    });
  });
});
