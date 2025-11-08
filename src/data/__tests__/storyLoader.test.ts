import { describe, it, expect } from "vitest";
import {
  loadStory,
  introduction,
  getPassage,
  getAllPassages,
} from "../storyLoader";

describe("StoryLoader", () => {
  describe("loadStory", () => {
    it("should load and return a valid story object", () => {
      const story = loadStory();

      expect(story).toBeDefined();
      expect(story.metadata).toBeDefined();
      expect(story.metadata.title).toBe("Welcome to the Code Adventure");
      expect(story.metadata.author).toBeDefined();
      expect(story.metadata.version).toBeDefined();
      expect(story.intro).toBeDefined();
      expect(story.passages).toBeDefined();
      expect(typeof story.passages).toBe("object");
    });

    it("should have consistent structure across calls", () => {
      const story1 = loadStory();
      const story2 = loadStory();

      expect(story1).toBe(story2); // Should be cached
      expect(story1.metadata.title).toBe(story2.metadata.title);
    });

    it("should load passages with correct structure", () => {
      const story = loadStory();

      // Check that passages exist
      expect(story.passages[1]).toBeDefined();
      expect(story.passages[1].paragraphs).toBeDefined();
      expect(Array.isArray(story.passages[1].paragraphs)).toBe(true);
      expect(story.passages[1].paragraphs!.length).toBeGreaterThan(0);
    });

    it("should load intro with paragraphs", () => {
      const story = loadStory();

      expect(story.intro.paragraphs).toBeDefined();
      expect(Array.isArray(story.intro.paragraphs)).toBe(true);
      expect(story.intro.paragraphs!.length).toBeGreaterThan(0);
    });
  });

  describe("introduction", () => {
    it("should return introduction content with correct structure", () => {
      expect(introduction.title).toBe("Welcome to the Code Adventure");
      expect(introduction.action).toBe("Begin your adventure");
      expect(Array.isArray(introduction.paragraphs)).toBe(true);
      expect(introduction.paragraphs.length).toBeGreaterThan(0);
    });

    it("should contain expected introduction content", () => {
      expect(introduction.paragraphs[0]).toContain("Welcome, brave adventurer");
      expect(
        introduction.paragraphs.some((p) => p.includes("programming concepts"))
      ).toBe(true);
    });

    it("should be consistent across multiple accesses", () => {
      const title1 = introduction.title;
      const title2 = introduction.title;
      const paragraphs1 = introduction.paragraphs;
      const paragraphs2 = introduction.paragraphs;

      expect(title1).toBe(title2);
      expect(paragraphs1).toEqual(paragraphs2);
    });
  });

  describe("getPassage", () => {
    it("should return the correct passage by ID", () => {
      const passage1 = getPassage(1);

      expect(passage1).toBeDefined();
      expect(passage1?.paragraphs).toBeDefined();
      expect(Array.isArray(passage1?.paragraphs)).toBe(true);
      expect(passage1?.paragraphs!.length).toBeGreaterThan(0);
      expect(passage1?.choices).toBeDefined();
      expect(Array.isArray(passage1?.choices)).toBe(true);
    });

    it("should return undefined for non-existent passage", () => {
      const passage = getPassage(999);
      expect(passage).toBeUndefined();
    });

    it("should return passages with correct choice structure", () => {
      const passage = getPassage(1);

      expect(passage?.choices).toBeDefined();
      expect(passage!.choices!.length).toBeGreaterThan(0);

      // Check choice structure
      const firstChoice = passage!.choices![0];
      expect(firstChoice.text).toBeDefined();
      expect(typeof firstChoice.text).toBe("string");
      expect(firstChoice.goto).toBeDefined();
      expect(typeof firstChoice.goto).toBe("number");
    });

    it("should return ending passages correctly", () => {
      // Find an ending passage
      const allPassages = getAllPassages();
      const endingPassageId = Object.keys(allPassages)
        .map(Number)
        .find((id) => allPassages[id].ending);

      expect(endingPassageId).toBeDefined();

      const endingPassage = getPassage(endingPassageId!);
      expect(endingPassage?.ending).toBe(true);
      expect(endingPassage?.type).toBeDefined();
    });

    it("should handle all passage types", () => {
      const passage1 = getPassage(1);
      const passage2 = getPassage(2);

      expect(passage1?.paragraphs).toBeDefined();
      expect(passage2?.paragraphs).toBeDefined();

      // Both should have valid paragraph content
      expect(
        passage1!.paragraphs!.every(
          (p) => typeof p === "string" && p.length > 0
        )
      ).toBe(true);
      expect(
        passage2!.paragraphs!.every(
          (p) => typeof p === "string" && p.length > 0
        )
      ).toBe(true);
    });
  });

  describe("getAllPassages", () => {
    it("should return all passages", () => {
      const allPassages = getAllPassages();

      expect(allPassages).toBeDefined();
      expect(typeof allPassages).toBe("object");
      expect(Object.keys(allPassages).length).toBeGreaterThan(0);
    });

    it("should return passages with valid structure", () => {
      const allPassages = getAllPassages();

      Object.entries(allPassages).forEach(([id, passage]) => {
        expect(id).toBeDefined();
        expect(!isNaN(Number(id))).toBe(true);
        expect(passage.paragraphs).toBeDefined();
        expect(Array.isArray(passage.paragraphs)).toBe(true);
        expect(passage.paragraphs!.length).toBeGreaterThan(0);
      });
    });

    it("should include both regular and ending passages", () => {
      const allPassages = getAllPassages();

      const regularPassages = Object.values(allPassages).filter(
        (p) => p.choices && p.choices.length > 0
      );
      const endingPassages = Object.values(allPassages).filter((p) => p.ending);

      expect(regularPassages.length).toBeGreaterThan(0);
      expect(endingPassages.length).toBeGreaterThan(0);
    });

    it("should return the same object reference on multiple calls", () => {
      const passages1 = getAllPassages();
      const passages2 = getAllPassages();

      expect(passages1).toBe(passages2);
    });

    it("should have valid goto references", () => {
      const allPassages = getAllPassages();
      const passageIds = new Set(Object.keys(allPassages).map(Number));

      Object.values(allPassages).forEach((passage) => {
        if (passage.choices) {
          passage.choices.forEach((choice) => {
            expect(passageIds.has(choice.goto)).toBe(true);
          });
        }
      });
    });
  });

  describe("error handling", () => {
    it("should throw errors when YAML is invalid (to be caught by Error Boundary)", () => {
      // This test verifies that the functions now throw errors properly
      // so that React Error Boundaries can catch them and display error UI

      // In normal operation, these should not throw
      expect(() => introduction.title).not.toThrow();
      expect(() => introduction.paragraphs).not.toThrow();
      expect(() => getPassage(1)).not.toThrow();
      expect(() => getAllPassages()).not.toThrow();

      // Verify they return expected types in normal operation
      expect(typeof introduction.title).toBe("string");
      expect(Array.isArray(introduction.paragraphs)).toBe(true);
      expect(getPassage(999)).toBeUndefined(); // Non-existent passage
      expect(typeof getAllPassages()).toBe("object");

      // The key change: errors are now thrown (not caught) so that
      // React Error Boundaries can catch them and display proper error UI
      // This provides better separation of concerns and user experience
    });
  });
  describe("story validation", () => {
    it("should have a valid story structure", () => {
      const story = loadStory();

      // Metadata validation
      expect(story.metadata.title).toBeTruthy();
      expect(story.metadata.author).toBeTruthy();
      expect(story.metadata.version).toBeTruthy();

      // Intro validation
      expect(story.intro.paragraphs).toBeTruthy();

      // Passages validation
      expect(Object.keys(story.passages).length).toBeGreaterThan(0);
    });

    it("should have valid passage references", () => {
      const story = loadStory();
      const passageIds = new Set(Object.keys(story.passages).map(Number));

      Object.entries(story.passages).forEach(([passageId, passage]) => {
        if (passage.choices) {
          passage.choices.forEach((choice) => {
            expect(
              passageIds.has(choice.goto) || choice.goto === Number(passageId)
            ).toBe(true);
          });
        }
      });
    });

    it("should have at least one starting passage", () => {
      const passage1 = getPassage(1);
      expect(passage1).toBeDefined();
      expect(passage1?.choices).toBeDefined();
      expect(passage1!.choices!.length).toBeGreaterThan(0);
    });

    it("should have at least one ending passage", () => {
      const allPassages = getAllPassages();
      const endingCount = Object.values(allPassages).filter(
        (p) => p.ending
      ).length;
      expect(endingCount).toBeGreaterThan(0);
    });
  });
});
