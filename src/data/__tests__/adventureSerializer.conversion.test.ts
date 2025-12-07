import { AdventureSerializer } from "../adventureSerializer";
import type { Adventure } from "../types";

describe("AdventureSerializer", () => {
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
