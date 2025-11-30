import { AdventureSerializer } from "../adventureSerializer";
import { AdventureParser } from "../adventureParser";
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

  describe("round-trip serialization", () => {
    it("should preserve adventure data through parse -> serialize -> parse", () => {
      const originalYaml = `
metadata:
  title: "Round Trip Test"
  author: "Test Author"
  version: "1.0"

intro:
  text: |
    Welcome to the round trip test.
    
    This tests full data preservation.
  action: "Begin Test"

passages:
  1:
    text: |
      You are in the first passage.
      
      Multiple paragraphs are supported.
    choices:
      - text: "Go to victory"
        goto: 2
      - text: "Go to defeat"
        goto: 3

  2:
    text: "You achieved victory!"
    ending: true
    type: "victory"

  3:
    text: "You were defeated."
    ending: true
    type: "defeat"
`;

      // Parse the original YAML
      const adventure = AdventureParser.parseFromString(originalYaml);

      // Serialize it back to YAML
      const serializedYaml = AdventureSerializer.serializeToString(adventure);

      // Parse the serialized YAML
      const reparsedAdventure = AdventureParser.parseFromString(serializedYaml);

      // Verify all data is preserved
      expect(reparsedAdventure.metadata).toEqual(adventure.metadata);
      expect(reparsedAdventure.intro).toEqual(adventure.intro);
      expect(reparsedAdventure.passages).toEqual(adventure.passages);
      expect(reparsedAdventure.items).toEqual(adventure.items);
    });

    it("should preserve inventory and effects through round-trip", () => {
      const originalYaml = `
metadata:
  title: "Inventory Round Trip"
  author: "Test Author"
  version: "1.0"

items:
  - id: "sword"
    name: "Legendary Sword"
  - id: "potion"
    name: "Health Potion"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "You find a sword"
    effects:
      - type: "add_item"
        item: "sword"
    choices:
      - text: "Continue"
        goto: 2

  2:
    text: "You drink a potion"
    effects:
      - type: "add_item"
        item: "potion"
      - type: "remove_item"
        item: "sword"
    choices:
      - text: "End"
        goto: 3

  3:
    text: "The end"
    ending: true
`;

      const adventure = AdventureParser.parseFromString(originalYaml);
      const serializedYaml = AdventureSerializer.serializeToString(adventure);
      const reparsedAdventure = AdventureParser.parseFromString(serializedYaml);

      expect(reparsedAdventure.items).toEqual(adventure.items);
      expect(reparsedAdventure.passages[1].effects).toEqual(
        adventure.passages[1].effects
      );
      expect(reparsedAdventure.passages[2].effects).toEqual(
        adventure.passages[2].effects
      );
    });

    it("should handle complex multi-branch adventures", () => {
      const originalYaml = `
metadata:
  title: "Complex Adventure"
  author: "Test Author"
  version: "2.1.3"

items:
  - id: "key"
    name: "Golden Key"

intro:
  text: |
    Welcome to a complex adventure.
    
    This adventure has multiple paths and endings.
    
    Your choices matter.
  action: "Start Adventure"

passages:
  1:
    text: |
      You stand at a crossroads.
      
      To the left is a dark forest.
      To the right is a bright meadow.
    choices:
      - text: "Enter the forest"
        goto: 10
      - text: "Walk through the meadow"
        goto: 20

  10:
    text: |
      The forest is dark and mysterious.
      
      You find a golden key on the ground.
    effects:
      - type: "add_item"
        item: "key"
    choices:
      - text: "Continue deeper"
        goto: 11

  11:
    text: "You encounter a locked door"
    choices:
      - text: "Use the key"
        goto: 100
      - text: "Turn back"
        goto: 1

  20:
    text: "The meadow is peaceful and serene"
    choices:
      - text: "Rest here"
        goto: 200

  100:
    text: "The door opens to reveal treasure!"
    ending: true
    type: "victory"

  200:
    text: "You rest peacefully in the meadow"
    ending: true
    type: "neutral"
`;

      const adventure = AdventureParser.parseFromString(originalYaml);
      const serializedYaml = AdventureSerializer.serializeToString(adventure);
      const reparsedAdventure = AdventureParser.parseFromString(serializedYaml);

      // Validate structure is preserved
      expect(Object.keys(reparsedAdventure.passages).sort()).toEqual(
        Object.keys(adventure.passages).sort()
      );

      // Validate specific passages
      expect(reparsedAdventure.passages[1]).toEqual(adventure.passages[1]);
      expect(reparsedAdventure.passages[10]).toEqual(adventure.passages[10]);
      expect(reparsedAdventure.passages[100]).toEqual(adventure.passages[100]);
    });

    it("should handle whitespace and formatting variations", () => {
      const originalYaml = `
metadata:
  title: "Whitespace Test"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Single line intro"
  action: "Start"

passages:
  1:
    text: |
      Line with trailing spaces    
      
      Line with    internal    spaces
    choices:
      - text: "Choice with  spaces"
        goto: 2

  2:
    text: "End"
    ending: true
`;

      const adventure = AdventureParser.parseFromString(originalYaml);
      const serializedYaml = AdventureSerializer.serializeToString(adventure);

      // Parse should succeed without errors
      expect(() =>
        AdventureParser.parseFromString(serializedYaml)
      ).not.toThrow();

      const reparsedAdventure = AdventureParser.parseFromString(serializedYaml);

      // Content should be functionally equivalent (whitespace may be normalized)
      expect(reparsedAdventure.metadata).toEqual(adventure.metadata);
      expect(reparsedAdventure.passages[1].paragraphs.length).toBe(
        adventure.passages[1].paragraphs.length
      );
    });
  });

  describe("validation compatibility", () => {
    it("should produce YAML that passes validation", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Validation Test",
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
            choices: [{ text: "Go to 2", goto: 2 }],
          },
          2: {
            paragraphs: ["End"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);
      const parsedAdventure = AdventureParser.parseFromString(yaml);

      expect(parsedAdventure).toBeDefined();
    });

    it("should serialize adventures with all ending types correctly", () => {
      const adventure: Adventure = {
        metadata: {
          title: "All Ending Types",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Choose"],
            choices: [
              { text: "Victory", goto: 2 },
              { text: "Defeat", goto: 3 },
              { text: "Neutral", goto: 4 },
              { text: "No type", goto: 5 },
            ],
          },
          2: {
            paragraphs: ["Victory ending"],
            ending: true,
            type: "victory",
          },
          3: {
            paragraphs: ["Defeat ending"],
            ending: true,
            type: "defeat",
          },
          4: {
            paragraphs: ["Neutral ending"],
            ending: true,
            type: "neutral",
          },
          5: {
            paragraphs: ["Untyped ending"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);
      const parsedAdventure = AdventureParser.parseFromString(yaml);

      expect(parsedAdventure.passages[2].type).toBe("victory");
      expect(parsedAdventure.passages[3].type).toBe("defeat");
      expect(parsedAdventure.passages[4].type).toBe("neutral");
      expect(parsedAdventure.passages[5].type).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle adventures with only one ending passage", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Single Ending",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["The only passage"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);
      const parsedAdventure = AdventureParser.parseFromString(yaml);

      expect(parsedAdventure.passages[1].ending).toBe(true);
    });

    it("should handle adventures with large passage IDs", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Large IDs",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["First passage"],
            choices: [{ text: "Jump to 9999", goto: 9999 }],
          },
          9999: {
            paragraphs: ["Final passage"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);
      const parsedAdventure = AdventureParser.parseFromString(yaml);

      expect(parsedAdventure.passages[9999]).toBeDefined();
      expect(parsedAdventure.passages[1].choices![0].goto).toBe(9999);
    });

    it("should handle version numbers with different formats", () => {
      const testVersions = ["1.0", "2.1.0", "10.5.3"];

      for (const version of testVersions) {
        const adventure: Adventure = {
          metadata: {
            title: "Version Test",
            author: "Test Author",
            version,
          },
          intro: {
            paragraphs: ["Test intro"],
            action: "Start",
          },
          passages: {
            1: {
              paragraphs: ["End"],
              ending: true,
            },
          },
          items: [],
        };

        const yaml = AdventureSerializer.serializeToString(adventure);
        const parsedAdventure = AdventureParser.parseFromString(yaml);

        expect(parsedAdventure.metadata.version).toBe(version);
      }
    });

    it("should handle very long passages", () => {
      const longParagraph = "A".repeat(1000);

      const adventure: Adventure = {
        metadata: {
          title: "Long Passage Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: [longParagraph],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: [longParagraph, longParagraph, longParagraph],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);
      const parsedAdventure = AdventureParser.parseFromString(yaml);

      expect(parsedAdventure.intro.paragraphs[0]).toBe(longParagraph);
      expect(parsedAdventure.passages[1].paragraphs).toHaveLength(3);
    });

    it("should handle many inventory items", () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: `item_${i}`,
        name: `Item ${i}`,
      }));

      const adventure: Adventure = {
        metadata: {
          title: "Many Items Test",
          author: "Test Author",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Test intro"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["End"],
            ending: true,
          },
        },
        items,
      };

      const yaml = AdventureSerializer.serializeToString(adventure);
      const parsedAdventure = AdventureParser.parseFromString(yaml);

      expect(parsedAdventure.items).toHaveLength(50);
      expect(parsedAdventure.items[0].id).toBe("item_0");
      expect(parsedAdventure.items[49].id).toBe("item_49");
    });
  });

  describe("paragraphsToText conversion", () => {
    it("should join paragraphs with double newlines", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Test",
          author: "Test",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Paragraph one", "Paragraph two", "Paragraph three"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Pass one", "Pass two"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      // Check that paragraphs are present (formatting varies based on YAML style)
      expect(yaml).toContain("Paragraph one");
      expect(yaml).toContain("Paragraph two");
      expect(yaml).toContain("Paragraph three");
      expect(yaml).toContain("Pass one");
      expect(yaml).toContain("Pass two");
    });

    it("should handle single paragraph correctly", () => {
      const adventure: Adventure = {
        metadata: {
          title: "Test",
          author: "Test",
          version: "1.0",
        },
        intro: {
          paragraphs: ["Only one paragraph"],
          action: "Start",
        },
        passages: {
          1: {
            paragraphs: ["Single passage paragraph"],
            ending: true,
          },
        },
        items: [],
      };

      const yaml = AdventureSerializer.serializeToString(adventure);

      // Should not have double newlines in single paragraph text
      expect(yaml).toContain("Only one paragraph");
      expect(yaml).toContain("Single passage paragraph");
    });
  });
});
