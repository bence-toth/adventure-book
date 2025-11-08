import { introduction, getAllPassages, getPassage } from "../storyLoader";
import type { IntroductionContent } from "../types";

describe("Introduction Data", () => {
  it("has the correct structure", () => {
    expect(introduction).toBeDefined();
    expect(introduction.title).toBe("Welcome to the Code Adventure");
    expect(introduction.action).toBe("Begin your adventure");
    expect(Array.isArray(introduction.paragraphs)).toBe(true);
    expect(introduction.paragraphs.length).toBeGreaterThan(0);
  });

  it("contains expected content in paragraphs", () => {
    expect(introduction.paragraphs[0]).toContain("Welcome, brave adventurer");
    expect(introduction.paragraphs[1]).toContain("In this adventure");
    expect(introduction.paragraphs[2]).toContain("Your adventure awaits");
  });

  it("matches IntroductionContent interface", () => {
    // Type checking - this will fail at compile time if structure is wrong
    const testIntro: IntroductionContent = introduction;
    expect(testIntro).toBeDefined();
  });
});

describe("Passages Data", () => {
  it("has passages available", () => {
    const allPassages = getAllPassages();
    expect(allPassages).toBeDefined();
    expect(Object.keys(allPassages).length).toBeGreaterThan(0);
  });

  it("has passage with id 1 as starting passage", () => {
    const startingPassage = getPassage(1);
    expect(startingPassage).toBeDefined();
    expect(startingPassage?.paragraphs?.[0]).toContain(
      "In the beginning, there was code"
    );
  });

  it("all passages have required properties", () => {
    const allPassages = getAllPassages();
    Object.entries(allPassages).forEach(([id, passage]) => {
      expect(id).toBeDefined();
      expect(!isNaN(Number(id))).toBe(true);
      expect(passage.paragraphs).toBeDefined();
      expect(Array.isArray(passage.paragraphs)).toBe(true);
      expect(passage.paragraphs!.length).toBeGreaterThan(0);
      passage.paragraphs!.forEach((paragraph) => {
        expect(typeof paragraph).toBe("string");
        expect(paragraph.length).toBeGreaterThan(0);
      });
      if (passage.choices) {
        expect(Array.isArray(passage.choices)).toBe(true);
      }
    });
  });

  it("all choices have required properties", () => {
    const allPassages = getAllPassages();
    Object.entries(allPassages).forEach(([, passage]) => {
      if (passage.choices) {
        passage.choices.forEach((choice) => {
          expect(choice.text).toBeDefined();
          expect(typeof choice.text).toBe("string");
          expect(choice.goto).toBeDefined();
          expect(typeof choice.goto).toBe("number");
        });
      }
    });
  });

  it("all choice gotos reference valid passages or are loops", () => {
    const allPassages = getAllPassages();
    const validIds = new Set(Object.keys(allPassages).map(Number));

    Object.entries(allPassages).forEach(([id, passage]) => {
      const passageId = Number(id);
      if (passage.choices) {
        passage.choices.forEach((choice) => {
          // goto should either be a valid passage id or reference itself (loop)
          expect(validIds.has(choice.goto) || choice.goto === passageId).toBe(
            true
          );
        });
      }
    });
  });

  it("has specific key passages for testing", () => {
    // Test that important passages exist for our component tests
    expect(getPassage(1)).toBeDefined(); // Starting passage
    expect(getPassage(9)).toBeDefined(); // Ending passage
    expect(getPassage(2)).toBeDefined(); // Functions path
    expect(getPassage(3)).toBeDefined(); // Data structures path
  });

  it("all passages contain meaningful paragraph content", () => {
    const allPassages = getAllPassages();
    Object.values(allPassages).forEach((passage) => {
      // Each passage should have at least one paragraph
      expect(passage.paragraphs!.length).toBeGreaterThan(0);

      // Each paragraph should have substantial content (not just whitespace)
      passage.paragraphs!.forEach((paragraph) => {
        expect(paragraph.trim().length).toBeGreaterThan(10);
      });
    });

    // At least some passages should have multiple paragraphs to showcase the feature
    const multiParagraphPassages = Object.values(allPassages).filter(
      (p) => p.paragraphs!.length > 1
    );
    expect(multiParagraphPassages.length).toBeGreaterThan(0);
  });
});
