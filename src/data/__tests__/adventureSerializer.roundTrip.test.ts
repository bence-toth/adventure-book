import { AdventureSerializer as Serializer } from "../adventureSerializer";
import { AdventureParser as Parser } from "../adventureParser";

describe("Serializer", () => {
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
      const adventure = Parser.parseFromString(originalYaml);

      // Serialize it back to YAML
      const serializedYaml = Serializer.serializeToString(adventure);

      // Parse the serialized YAML
      const reparsed = Parser.parseFromString(serializedYaml);

      // Verify all data is preserved
      expect(reparsed.metadata).toEqual(adventure.metadata);
      expect(reparsed.intro).toEqual(adventure.intro);
      expect(reparsed.passages).toEqual(adventure.passages);
      expect(reparsed.items).toEqual(adventure.items);
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

      const adventure = Parser.parseFromString(originalYaml);
      const serializedYaml = Serializer.serializeToString(adventure);
      const reparsed = Parser.parseFromString(serializedYaml);

      expect(reparsed.items).toEqual(adventure.items);
      expect(reparsed.passages[1].effects).toEqual(
        adventure.passages[1].effects
      );
      expect(reparsed.passages[2].effects).toEqual(
        adventure.passages[2].effects
      );
    });

    it("should handle complex multi-branch adventures", () => {
      const originalYaml = `
metadata:
  title: "Complex "
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
  action: "Start "

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

      const adventure = Parser.parseFromString(originalYaml);
      const serializedYaml = Serializer.serializeToString(adventure);
      const reparsed = Parser.parseFromString(serializedYaml);

      // Validate structure is preserved
      expect(Object.keys(reparsed.passages).sort()).toEqual(
        Object.keys(adventure.passages).sort()
      );

      // Validate specific passages
      expect(reparsed.passages[1]).toEqual(adventure.passages[1]);
      expect(reparsed.passages[10]).toEqual(adventure.passages[10]);
      expect(reparsed.passages[100]).toEqual(adventure.passages[100]);
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

      const adventure = Parser.parseFromString(originalYaml);
      const serializedYaml = Serializer.serializeToString(adventure);

      // Parse should succeed without errors
      expect(() => Parser.parseFromString(serializedYaml)).not.toThrow();

      const reparsed = Parser.parseFromString(serializedYaml);

      // Content should be functionally equivalent (whitespace may be normalized)
      expect(reparsed.metadata).toEqual(adventure.metadata);
      expect(reparsed.passages[1].paragraphs.length).toBe(
        adventure.passages[1].paragraphs.length
      );
    });
  });
});
