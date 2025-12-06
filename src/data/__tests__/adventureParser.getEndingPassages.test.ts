import { AdventureParser } from "../adventureParser";
import type { Adventure } from "../types";

// Note: Using 'yaml' package instead of 'js-yaml' for security
// The 'yaml' package is safe by default and doesn't execute arbitrary code

describe("AdventureParser", () => {
  describe("getEndingPassages", () => {
    it("should return all passages marked as endings", () => {
      const adventure: Adventure = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { paragraphs: ["Intro"], action: "Test" },
        passages: {
          1: {
            paragraphs: ["Regular passage"],
            choices: [{ text: "Go", goto: 2 }],
          },
          2: {
            paragraphs: ["Victory ending"],
            ending: true,
            type: "victory",
          },
          3: {
            paragraphs: ["Another passage"],
            choices: [{ text: "Go", goto: 4 }],
          },
          4: {
            paragraphs: ["Defeat ending"],
            ending: true,
            type: "defeat",
          },
          5: {
            paragraphs: ["Neutral ending"],
            ending: true,
            type: "neutral",
          },
        },
        items: [],
      };

      const endings = AdventureParser.getEndingPassages(adventure);
      expect(endings.sort()).toEqual([2, 4, 5]);
    });

    it("should return empty array when no endings exist", () => {
      const adventure: Adventure = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { paragraphs: ["Intro"], action: "Test" },
        passages: {
          1: {
            paragraphs: ["Regular passage"],
            choices: [{ text: "Go", goto: 2 }],
          },
          2: {
            paragraphs: ["Another regular passage"],
            choices: [{ text: "Go", goto: 1 }],
          },
        },
        items: [],
      };

      const endings = AdventureParser.getEndingPassages(adventure);
      expect(endings).toEqual([]);
    });
  });
});
