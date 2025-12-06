import { AdventureSerializer } from "../adventureSerializer";
import { AdventureParser } from "../adventureParser";
import type { Adventure } from "../types";

describe("AdventureSerializer", () => {
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
});
