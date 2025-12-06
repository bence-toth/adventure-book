import { AdventureParser } from "../adventureParser";
import {} from "../types";

// Note: Using 'yaml' package instead of 'js-yaml' for security
// The 'yaml' package is safe by default and doesn't execute arbitrary code

describe("AdventureParser", () => {
  describe("parseFromString", () => {
    it("should parse a valid adventure YAML", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: |
    Welcome to the test adventure.
    
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

      const adventure = AdventureParser.parseFromString(yamlContent);

      expect(adventure.metadata.title).toBe("Test Adventure");
      expect(adventure.metadata.author).toBe("Test Author");
      expect(adventure.metadata.version).toBe("1.0");
      expect(adventure.intro.paragraphs).toEqual([
        "Welcome to the test adventure.",
        "This is a second paragraph.",
      ]);
      expect(adventure.passages[1].paragraphs).toEqual([
        "You are in passage 1.",
        "What do you do?",
      ]);
      expect(adventure.passages[1].choices).toHaveLength(1);
      expect(adventure.passages[1].choices![0].text).toBe("Go to passage 2");
      expect(adventure.passages[1].choices![0].goto).toBe(2);
      expect(adventure.passages[2].ending).toBe(true);
      expect(adventure.passages[2].type).toBe("victory");
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

      const adventure = AdventureParser.parseFromString(yamlContent);

      expect(adventure.intro.paragraphs).toEqual(["Single paragraph intro."]);
      expect(adventure.passages[1].paragraphs).toEqual([
        "Single paragraph passage.",
      ]);
      expect(adventure.passages[2].paragraphs).toEqual([
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

      const adventure = AdventureParser.parseFromString(yamlContent);

      expect(adventure.passages[1].ending).toBe(true);
      expect(adventure.passages[1].type).toBe("defeat");
      expect(adventure.passages[1].choices).toBeUndefined();
    });

    it("should throw error for invalid YAML", () => {
      const invalidYaml = `
metadata:
  title: "Test Adventure"
  invalid: yaml: structure
`;

      expect(() => AdventureParser.parseFromString(invalidYaml)).toThrow();
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

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
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
        AdventureParser.parseFromString(yamlContentMissingTitle)
      ).toThrow("Invalid YAML: metadata.title must be a non-empty string");

      const yamlContentEmptyAuthor = `
metadata:
  title: "Test Adventure"
  author: ""
  version: "1.0"
intro:
  text: "Test"
  action: "Test"
passages:
  1:
    text: "Test"
`;

      expect(() =>
        AdventureParser.parseFromString(yamlContentEmptyAuthor)
      ).toThrow("Invalid YAML: metadata.author must be a non-empty string");
    });

    it("should throw error for missing intro", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
passages:
  1:
    text: "Test passage"
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Missing or invalid intro object"
      );
    });

    it("should throw error for invalid intro text", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
intro:
  text: ""
  action: "Test"
passages:
  1:
    text: "Test passage"
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: intro.text must be a non-empty string"
      );
    });

    it("should throw error for missing intro action", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
passages:
  1:
    text: "Test passage"
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: intro.action must be a non-empty string"
      );
    });

    it("should throw error for missing passages", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Missing or invalid passages object"
      );
    });

    it("should throw error for invalid passage ID", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  "not-a-number":
    text: "Test passage"
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage ID 'not-a-number' must be numeric"
      );
    });

    it("should throw error for invalid passage structure", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: ""
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 text must be a non-empty string"
      );
    });

    it("should throw error for invalid choice structure", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
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

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 choice 0 text must be a non-empty string"
      );

      const yamlContentInvalidGoto = `
metadata:
  title: "Test Adventure"
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

      expect(() =>
        AdventureParser.parseFromString(yamlContentInvalidGoto)
      ).toThrow(
        "Invalid YAML: Passage 1 choice 0 goto must be a positive integer"
      );
    });

    it("should throw error for invalid goto references", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "Test passage"
    choices:
      - text: "Go to missing passage"
        goto: 99
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Passage 1 has invalid goto: 99"
      );
    });

    it("should throw error for invalid passage type", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
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

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 type must be one of: victory, defeat, neutral"
      );
    });

    it("should throw error for ending: false", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
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

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 ending must be true (or omitted for non-ending passages)"
      );
    });

    it("should throw error for without ending: true", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
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

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 type can only be used with ending: true"
      );
    });

    it("should throw error for non-ending passages without choices", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Test"
passages:
  1:
    text: "This passage has no choices and is not marked as ending"
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Non-ending passage 1 must have at least one choice"
      );
    });

    it("should throw error for non-ending passages with empty choices array", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
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

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Non-ending passage 1 must have at least one choice"
      );
    });

    it("should throw error for ending passages with choices", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
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

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Ending passage 1 must not have choices"
      );
    });
  });
});
