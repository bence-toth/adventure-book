import { AdventureSerializer } from "../adventureSerializer";
import type { Adventure } from "../types";

describe("AdventureSerializer", () => {
  describe("serializeToString", () => {
    it("should serialize a basic adventure to YAML", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Test Adventure",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Welcome to the test adventure."],
          action: "Start adventure",
        },
        passages: {
          1: {
            paragraphs: ["You are in passage 1."],
            choices: [{ text: "Go to passage 2", goto: 2 }],
          },
          2: {
            paragraphs: ["You are in passage 2."],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toContain("title:");
      expect(yaml).toContain("Test Adventure");
      expect(yaml).toContain("author:");
      expect(yaml).toContain("Test Author");
      expect(yaml).toContain("version:");
      expect(yaml).toContain("1.0");
      expect(yaml).toContain("intro:");
      expect(yaml).toContain("text:");
      expect(yaml).toContain("Welcome to the test adventure.");
      expect(yaml).toContain("action:");
      expect(yaml).toContain("Start adventure");
      expect(yaml).toContain("passages:");
      expect(yaml).toMatch(/["']?1["']?:/);
      expect(yaml).toMatch(/["']?2["']?:/);
      expect(yaml).toContain("choices:");
      expect(yaml).toContain("ending: true");
    });

    it("should serialize adventures with multiple paragraphs", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Multi-Paragraph Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: [
            "First paragraph.",
            "Second paragraph.",
            "Third paragraph.",
          ],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Passage paragraph 1.", "Passage paragraph 2."],
            choices: [{ text: "Continue", goto: 2 }],
          },
          2: {
            paragraphs: ["Final paragraph."],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      // Check that paragraphs are present (format may vary with quotes/literal blocks)
      expect(yaml).toContain("First paragraph.");
      expect(yaml).toContain("Second paragraph.");
      expect(yaml).toContain("Third paragraph.");
      expect(yaml).toContain("Passage paragraph 1.");
      expect(yaml).toContain("Passage paragraph 2.");
    });

    it("should serialize endings with types", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Ending Types Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Choose your fate"],
            choices: [
              { text: "Victory", goto: 2 },
              { text: "Defeat", goto: 3 },
              { text: "Neutral", goto: 4 },
            ],
          },
          2: {
            paragraphs: ["You won!"],
            ending: true,
            type: "victory",
          },
          3: {
            paragraphs: ["You lost!"],
            ending: true,
            type: "defeat",
          },
          4: {
            paragraphs: ["The end."],
            ending: true,
            type: "neutral",
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toMatch(/type:\s*["']?victory["']?/);
      expect(yaml).toMatch(/type:\s*["']?defeat["']?/);
      expect(yaml).toMatch(/type:\s*["']?neutral["']?/);
    });

    it("should serialize adventures with inventory items", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Inventory Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Test passage"],
            ending: true,
          },
        },
        items: [
          { id: "sword", name: "Ancient Sword" },
          { id: "shield", name: "Wooden Shield" },
        ],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toContain("items:");
      expect(yaml).toContain("sword");
      expect(yaml).toContain("Ancient Sword");
      expect(yaml).toContain("shield");
      expect(yaml).toContain("Wooden Shield");
    });

    it("should serialize passages with effects", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Effects Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["You find a sword"],
            choices: [{ text: "Continue", goto: 2 }],
            effects: [{ type: "add_item", item: "sword" }],
          },
          2: {
            paragraphs: ["You drop the sword"],
            choices: [{ text: "End", goto: 3 }],
            effects: [{ type: "remove_item", item: "sword" }],
          },
          3: {
            paragraphs: ["The end"],
            ending: true,
          },
        },
        items: [{ id: "sword", name: "Rusty Sword" }],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toContain("effects:");
      expect(yaml).toContain("add_item");
      expect(yaml).toContain("remove_item");
      expect(yaml).toContain("sword");
    });

    it("should serialize passages with multiple effects", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Multiple Effects Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["You find multiple items"],
            choices: [{ text: "End", goto: 2 }],
            effects: [
              { type: "add_item", item: "sword" },
              { type: "add_item", item: "shield" },
            ],
          },
          2: {
            paragraphs: ["The end"],
            ending: true,
          },
        },
        items: [
          { id: "sword", name: "Sword" },
          { id: "shield", name: "Shield" },
        ],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      // Check for effects with both items
      expect(yaml).toContain("effects:");
      expect(yaml).toContain("add_item");
      expect(yaml).toContain("sword");
      expect(yaml).toContain("shield");
    });

    it("should not include items array when empty", () => {
      const adventure: Adventure = {
        metadata: {
          title: "No Items Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Test passage"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      // The items key should not appear at all when array is empty
      const lines = yaml.split("\n");
      const hasItemsLine = lines.some((line) =>
        line.trim().startsWith("items:")
      );
      expect(hasItemsLine).toBe(false);
    });

    it("should not include effects array when empty", () => {
      const adventure: Adventure = {
        metadata: {
          title: "No Effects Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Test passage"],
            choices: [{ text: "End", goto: 2 }],
            effects: [],
          },
          2: {
            paragraphs: ["The end"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      // Count occurrences of effects:
      const effectsCount = (yaml.match(/effects:/g) || []).length;
      expect(effectsCount).toBe(0);
    });

    it("should handle passages with empty paragraphs gracefully", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Empty Paragraphs Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: [],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: [],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toContain('text: ""');
    });

    it("should handle special characters in strings", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Special: Characters & Quotes",
          author: 'Author "Name" Here',
          version: "1.0",
        },
        intro: {
          paragraphs: ["Text with: colons and @symbols"],
          action: "Start & Continue",
        },
        passages: {
          1: {
            paragraphs: ['Text with "quotes"'],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toBeDefined();
      expect(yaml.length).toBeGreaterThan(0);
    });

    it("should serialize adventures with numeric passage IDs", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Numeric IDs Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Passage 1"],
            choices: [{ text: "Go to 100", goto: 100 }],
          },
          100: {
            paragraphs: ["Passage 100"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toMatch(/["']?1["']?:/);
      expect(yaml).toMatch(/["']?100["']?:/);
    });

    it("should serialize adventures without ending type", () => {
      const adventure: Adventure = {
        metadata: {
          title: "No Ending Type Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["The end"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toContain("ending: true");
      // Type should not appear when not specified
      const typeMatches = yaml.match(/type:/g);
      expect(typeMatches).toBeNull();
    });

    it("should handle single choice passages", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Single Choice Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Only one choice"],
            choices: [{ text: "Continue", goto: 2 }],
          },
          2: {
            paragraphs: ["The end"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toContain("choices:");
      expect(yaml).toContain("Continue");
      expect(yaml).toContain("goto: 2");
    });

    it("should handle multiple choice passages", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Multiple Choices Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Choose wisely"],
            choices: [
              { text: "Choice A", goto: 2 },
              { text: "Choice B", goto: 3 },
              { text: "Choice C", goto: 4 },
            ],
          },
          2: {
            paragraphs: ["Ending A"],
            ending: true,
          },
          3: {
            paragraphs: ["Ending B"],
            ending: true,
          },
          4: {
            paragraphs: ["Ending C"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      expect(yaml).toContain("Choice A");
      expect(yaml).toContain("Choice B");
      expect(yaml).toContain("Choice C");
    });
  });
});
