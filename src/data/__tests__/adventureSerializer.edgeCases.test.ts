import { AdventureSerializer } from "../adventureSerializer";
import { AdventureParser } from "../adventureParser";
import type { Adventure } from "../types";

describe("AdventureSerializer", () => {
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
});
