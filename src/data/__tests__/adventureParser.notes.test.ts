import { AdventureParser } from "../adventureParser";
import { describe, it, expect } from "vitest";

describe("AdventureParser - Notes Field", () => {
  describe("parsing notes field", () => {
    it("should parse passage with notes field", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes: "This is a developer note about passage 1."
    text: "You are in passage 1."
    choices:
      - text: "Go to passage 2"
        goto: 2

  2:
    text: "You are in passage 2."
    ending: true
    type: "victory"
`;

      const adventure = AdventureParser.parseFromString(yamlContent);

      expect(adventure.passages[1].notes).toBe(
        "This is a developer note about passage 1."
      );
      expect(adventure.passages[2].notes).toBeUndefined();
    });

    it("should parse passage with notes on ending passage", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    text: "You are in passage 1."
    choices:
      - text: "Go to passage 2"
        goto: 2

  2:
    notes: "Victory ending with notes."
    text: "You are in passage 2."
    ending: true
    type: "victory"
`;

      const adventure = AdventureParser.parseFromString(yamlContent);

      expect(adventure.passages[2].notes).toBe("Victory ending with notes.");
    });

    it("should parse adventure with mix of passages with and without notes", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes: "Has notes"
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2
      - text: "Go to 3"
        goto: 3

  2:
    text: "Passage 2 without notes"
    choices:
      - text: "Go to 4"
        goto: 4

  3:
    notes: "Another passage with notes"
    text: "Passage 3"
    choices:
      - text: "Go to 4"
        goto: 4

  4:
    text: "Ending without notes"
    ending: true
`;

      const adventure = AdventureParser.parseFromString(yamlContent);

      expect(adventure.passages[1].notes).toBe("Has notes");
      expect(adventure.passages[2].notes).toBeUndefined();
      expect(adventure.passages[3].notes).toBe("Another passage with notes");
      expect(adventure.passages[4].notes).toBeUndefined();
    });

    it("should throw error for empty notes field", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes: ""
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2

  2:
    text: "Ending"
    ending: true
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 notes must not be empty or whitespace-only"
      );
    });

    it("should throw error for whitespace-only notes", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes: "   "
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2

  2:
    text: "Ending"
    ending: true
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 notes must not be empty or whitespace-only"
      );
    });

    it("should handle multi-line notes", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes: |
      This is a multi-line note.
      It has multiple lines.
      Each line provides context.
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2

  2:
    text: "Ending"
    ending: true
`;

      const adventure = AdventureParser.parseFromString(yamlContent);

      expect(adventure.passages[1].notes).toContain(
        "This is a multi-line note."
      );
      expect(adventure.passages[1].notes).toContain("It has multiple lines.");
      expect(adventure.passages[1].notes).toContain(
        "Each line provides context."
      );
    });
  });

  describe("validation of notes field", () => {
    it("should throw error if notes is not a string", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes: 123
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2

  2:
    text: "Ending"
    ending: true
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 notes must be a string"
      );
    });

    it("should throw error for whitespace-only notes", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes: "   "
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2

  2:
    text: "Ending"
    ending: true
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 notes must not be empty or whitespace-only"
      );
    });

    it("should throw error if notes is an object", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes:
      key: "value"
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2

  2:
    text: "Ending"
    ending: true
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 notes must be a string"
      );
    });

    it("should throw error if notes is an array", () => {
      const yamlContent = `
metadata:
  title: "Test Adventure"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Welcome to the test adventure."
  action: "Start adventure"

passages:
  1:
    notes:
      - "note 1"
      - "note 2"
    text: "Passage 1"
    choices:
      - text: "Go to 2"
        goto: 2

  2:
    text: "Ending"
    ending: true
`;

      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 notes must be a string"
      );
    });
  });
});
