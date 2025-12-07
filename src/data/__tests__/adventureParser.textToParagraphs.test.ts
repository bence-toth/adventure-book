import { AdventureParser } from "../adventureParser";
import type { RawAdventure } from "../types";

// Note: Using 'yaml' package instead of 'js-yaml' for security
// The 'yaml' package is safe by default and doesn't execute arbitrary code

describe("AdventureParser", () => {
  describe("textToParagraphs", () => {
    it("should split text by double newlines", () => {
      const rawAdventure = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Para 1\n\nPara 2\n\nPara 3", action: "Test" },
        passages: {
          1: { text: "Passage para 1\n\nPassage para 2", ending: true },
        },
      } as const;

      // Access the private method directly for testing purposes
      const processedAdventure = AdventureParser["processTextFields"](
        rawAdventure as RawAdventure
      );

      expect(processedAdventure.intro.paragraphs).toEqual([
        "Para 1",
        "Para 2",
        "Para 3",
      ]);
      expect(processedAdventure.passages[1].paragraphs).toEqual([
        "Passage para 1",
        "Passage para 2",
      ]);
    });

    it("should handle single newlines within paragraphs", () => {
      const rawAdventure = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Line 1\nLine 2\n\nPara 2", action: "Test" },
        passages: {
          1: { text: "Passage line 1\nPassage line 2", ending: true },
        },
      } as const;

      const processedAdventure = AdventureParser["processTextFields"](
        rawAdventure as RawAdventure
      );

      expect(processedAdventure.intro.paragraphs).toEqual([
        "Line 1 Line 2",
        "Para 2",
      ]);
      expect(processedAdventure.passages[1].paragraphs).toEqual([
        "Passage line 1 Passage line 2",
      ]);
    });

    it("should filter out empty paragraphs", () => {
      const rawAdventure = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "Para 1\n\n\n\nPara 2\n\n", action: "Test" },
        passages: {
          1: { text: "\n\nPara 1\n\n\n\n", ending: true },
        },
      } as const;

      const processedAdventure = AdventureParser["processTextFields"](
        rawAdventure as RawAdventure
      );

      expect(processedAdventure.intro.paragraphs).toEqual(["Para 1", "Para 2"]);
      expect(processedAdventure.passages[1].paragraphs).toEqual(["Para 1"]);
    });

    it("should handle missing or undefined text fields defensively", () => {
      // Test with a malformed raw adventure object that bypassed validation somehow
      const malformedRawAdventure = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: {}, // Missing text field
        passages: {
          1: {}, // Missing text field
          2: { text: "Valid text", ending: true },
        },
      } as unknown as RawAdventure;

      // Should not crash and should set empty paragraphs
      expect(() => {
        const processedAdventure = AdventureParser["processTextFields"](
          malformedRawAdventure
        );
        expect(processedAdventure.intro.paragraphs).toEqual([]);
        expect(processedAdventure.passages[1].paragraphs).toEqual([]);
        expect(processedAdventure.passages[2].paragraphs).toEqual([
          "Valid text",
        ]);
      }).not.toThrow();
    });

    it("should handle empty or whitespace-only text", () => {
      const rawAdventure = {
        metadata: { title: "Test", author: "Author", version: "1.0" },
        intro: { text: "   \n\n   ", action: "Test" }, // Only whitespace
        passages: {
          1: { text: "", ending: true }, // Empty string
          2: { text: "   ", ending: true }, // Only spaces
        },
      } as const;

      const processedAdventure = AdventureParser["processTextFields"](
        rawAdventure as RawAdventure
      );

      expect(processedAdventure.intro.paragraphs).toEqual([]);
      expect(processedAdventure.passages[1].paragraphs).toEqual([]);
      expect(processedAdventure.passages[2].paragraphs).toEqual([]);
    });
  });
});
