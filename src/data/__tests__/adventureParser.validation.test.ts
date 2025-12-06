import { AdventureParser } from "../adventureParser";
import {} from "../types";

// Note: Using 'yaml' package instead of 'js-yaml' for security
// The 'yaml' package is safe by default and doesn't execute arbitrary code

describe("AdventureParser", () => {
  describe("validation edge cases", () => {
    it("should throw error for null root object", () => {
      expect(() => AdventureParser.parseFromString("null")).toThrow(
        "Invalid YAML: Root must be an object"
      );
    });

    it("should throw error for array root object", () => {
      expect(() => AdventureParser.parseFromString("[]")).toThrow(
        "Invalid YAML: Root must be an object"
      );
    });

    it("should throw error for empty string version", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: ""
intro:
  text: "Test"
  action: "Test"
passages:
  1:
    text: "Test"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: metadata.version must be a non-empty string"
      );
    });

    it("should throw error for empty intro text", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
intro:
  text: "   "
  action: "Test"
passages:
  1:
    text: "Test"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: intro.text must be a non-empty string"
      );
    });

    it("should throw error for empty intro action", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
intro:
  text: "Test intro"
  action: "   "
passages:
  1:
    text: "Test"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: intro.action must be a non-empty string"
      );
    });

    it("should throw error for non-array items", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
items: "not an array"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: items must be an array"
      );
    });

    it("should throw error for invalid item structure", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
items:
  - "not an object"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: items[0] must be an object"
      );
    });

    it("should throw error for missing item id", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
items:
  - name: "Test Item"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: items[0] id must be a non-empty string"
      );
    });

    it("should throw error for passages not being an object", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Start"
passages: []
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Missing or invalid passages object"
      );
    });

    it("should throw error for passage being array", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1: []
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 must be an object"
      );
    });

    it("should throw error for non-array choices", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    choices: "not an array"
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 choices must be an array"
      );
    });

    it("should throw error for invalid choice structure", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    choices:
      - "not an object"
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 choice 0 must be an object"
      );
    });

    it("should throw error for non-array effects", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
items:
  - id: "test_item"
    name: "Test Item"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    effects: "not an array"
    choices:
      - text: "Continue"
        goto: 2
  2:
    text: "End"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 effects must be an array"
      );
    });

    it("should throw error for invalid effect structure", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
items:
  - id: "test_item"
    name: "Test Item"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    effects:
      - "not an object"
    choices:
      - text: "Continue"
        goto: 2
  2:
    text: "End"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 effect 0 must be an object"
      );
    });

    it("should throw error for invalid effect (non-string)", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
items:
  - id: "test_item"
    name: "Test Item"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    effects:
      - type: 123
        item: "test_item"
    choices:
      - text: "Continue"
        goto: 2
  2:
    text: "End"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 effect 0 type must be a string"
      );
    });

    it("should throw error for empty effect item", () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Test"
  version: "1.0"
items:
  - id: "test_item"
    name: "Test Item"
intro:
  text: "Test intro"
  action: "Start"
passages:
  1:
    text: "Test"
    effects:
      - type: "add_item"
        item: ""
    choices:
      - text: "Continue"
        goto: 2
  2:
    text: "End"
    ending: true
`;
      expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
        "Invalid YAML: Passage 1 effect 0 item must be a non-empty string"
      );
    });
  });
});
