import { describe, it, expect, vi, beforeEach } from "vitest";
import { importYamlFile } from "../importYaml";
import * as adventureParser from "@/data/adventureParser";
import * as adventureDatabase from "@/data/adventureDatabase";

// Mock dependencies
vi.mock("@/data/adventureParser");
vi.mock("@/data/adventureDatabase");

describe("importYamlFile", () => {
  const mockAdventure = {
    metadata: {
      title: "Test Adventure",
      author: "Test Author",
      version: "1.0.0",
    },
    intro: {
      paragraphs: ["Introduction text"],
      action: "Begin",
    },
    passages: {
      1: {
        paragraphs: ["First passage"],
        choices: [{ text: "Choice 1", goto: 2 }],
      },
      2: {
        paragraphs: ["Second passage"],
        ending: true as const,
      },
    },
    items: [],
  };

  // Helper to create a mock File with text() method
  const createMockFile = (
    content: string,
    name: string,
    type: string
  ): File => {
    const file = new File([content], name, { type });
    // Add text() method that real File objects have
    Object.defineProperty(file, "text", {
      value: () => Promise.resolve(content),
      writable: false,
    });
    return file;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("File validation", () => {
    it("rejects files with invalid extension", async () => {
      const file = createMockFile("content", "test.txt", "text/plain");

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("File must be a YAML file (.yaml or .yml)");
      }
    });

    it("accepts .yaml files", async () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    ending: true
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockReturnValue(mockAdventure);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue("test-id");

      const result = await importYamlFile(file);

      expect(result.success).toBe(true);
    });

    it("accepts .yml files", async () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    ending: true
`;
      const file = createMockFile(yamlContent, "test.yml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockReturnValue(mockAdventure);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue("test-id");

      const result = await importYamlFile(file);

      expect(result.success).toBe(true);
    });

    it("rejects empty files", async () => {
      const file = createMockFile("", "test.yaml", "text/yaml");

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("File is empty");
      }
    });

    it("rejects files with only whitespace", async () => {
      const file = createMockFile("   \n\t  ", "test.yaml", "text/yaml");

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("File is empty");
      }
    });
  });

  describe("YAML parsing", () => {
    it("returns parsing errors when YAML is malformed", async () => {
      const yamlContent = "invalid: yaml: content:";
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockImplementation(() => {
        throw new Error("Invalid YAML structure");
      });

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid YAML structure");
      }
    });

    it("returns parsing errors when adventure structure is invalid", async () => {
      const yamlContent = `
metadata:
  title: "Test"
passages: invalid
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockImplementation(() => {
        throw new Error("Invalid YAML: Missing or invalid passages object");
      });

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Invalid YAML: Missing or invalid passages object"
        );
      }
    });

    it("calls parser with file content", async () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    ending: true
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockReturnValue(mockAdventure);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue("test-id");

      await importYamlFile(file);

      expect(
        adventureParser.AdventureParser.parseFromString
      ).toHaveBeenCalledWith(yamlContent);
    });

    it("returns validation errors when references are invalid", async () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    choices:
      - text: "Go to 99"
        goto: 99
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockImplementation(() => {
        throw new Error("Passage 1 has invalid goto: 99");
      });

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Passage 1 has invalid goto: 99");
      }
    });

    it("proceeds to database save when validation passes", async () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    ending: true
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockReturnValue(mockAdventure);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue("test-id");

      const result = await importYamlFile(file);

      expect(result.success).toBe(true);
      expect(adventureDatabase.createAdventure).toHaveBeenCalled();
    });
  });

  describe("Database import", () => {
    it("creates adventure in database with correct title and content", async () => {
      const yamlContent = `
metadata:
  title: "My Adventure"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    ending: true
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockReturnValue(mockAdventure);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue("test-id");

      await importYamlFile(file);

      expect(adventureDatabase.createAdventure).toHaveBeenCalledWith(
        "Test Adventure",
        yamlContent
      );
    });

    it("returns adventure ID on successful import", async () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    ending: true
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockReturnValue(mockAdventure);
      vi.mocked(adventureDatabase.createAdventure).mockResolvedValue(
        "new-adventure-id"
      );

      const result = await importYamlFile(file);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.adventureId).toBe("new-adventure-id");
      }
    });

    it("returns error when database save fails", async () => {
      const yamlContent = `
metadata:
  title: "Test"
  author: "Author"
  version: "1.0.0"
intro:
  text: "Intro"
  action: "Start"
passages:
  1:
    text: "Passage"
    ending: true
`;
      const file = createMockFile(yamlContent, "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockReturnValue(mockAdventure);
      vi.mocked(adventureDatabase.createAdventure).mockRejectedValue(
        new Error("Database error")
      );

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Database error");
      }
    });
  });

  describe("Error handling", () => {
    it("handles generic file read errors", async () => {
      // Create a file with a text() method that rejects
      const file = new File(["content"], "test.yaml", { type: "text/yaml" });
      Object.defineProperty(file, "text", {
        value: () => Promise.reject(new Error("File read error")),
        writable: false,
        configurable: true,
      });

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("File read error");
      }
    });

    it("handles unknown errors gracefully", async () => {
      const file = createMockFile("content", "test.yaml", "text/yaml");

      vi.mocked(
        adventureParser.AdventureParser.parseFromString
      ).mockImplementation(() => {
        throw "String error"; // Non-Error object
      });

      const result = await importYamlFile(file);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Failed to parse YAML file");
      }
    });
  });
});
