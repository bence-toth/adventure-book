import { introduction, passages } from "../content";
import type { IntroductionContent, Passage } from "../types";

describe("Introduction Data", () => {
  it("has the correct structure", () => {
    expect(introduction).toBeDefined();
    expect(introduction.title).toBe("Welcome to the Code Adventure");
    expect(introduction.buttonText).toBe("Begin Your Adventure");
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
  it("is an array with passages", () => {
    expect(Array.isArray(passages)).toBe(true);
    expect(passages.length).toBeGreaterThan(0);
  });

  it("has passage with id 1 as starting passage", () => {
    const startingPassage = passages.find((p) => p.id === 1);
    expect(startingPassage).toBeDefined();
    expect(startingPassage?.paragraphs[0]).toContain(
      "In the beginning, there was code"
    );
  });

  it("all passages have required properties", () => {
    passages.forEach((passage) => {
      expect(passage.id).toBeDefined();
      expect(typeof passage.id).toBe("number");
      expect(passage.paragraphs).toBeDefined();
      expect(Array.isArray(passage.paragraphs)).toBe(true);
      expect(passage.paragraphs.length).toBeGreaterThan(0);
      passage.paragraphs.forEach((paragraph) => {
        expect(typeof paragraph).toBe("string");
        expect(paragraph.length).toBeGreaterThan(0);
      });
      expect(Array.isArray(passage.choices)).toBe(true);
      expect(passage.choices.length).toBeGreaterThan(0);
    });
  });

  it("all choices have required properties", () => {
    passages.forEach((passage) => {
      passage.choices.forEach((choice) => {
        expect(choice.text).toBeDefined();
        expect(typeof choice.text).toBe("string");
        expect(choice.nextId).toBeDefined();
        expect(typeof choice.nextId).toBe("number");
      });
    });
  });

  it("all choice nextIds reference valid passages or are loops", () => {
    const validIds = new Set(passages.map((p) => p.id));

    passages.forEach((passage) => {
      passage.choices.forEach((choice) => {
        // nextId should either be a valid passage id or reference itself (loop)
        expect(
          validIds.has(choice.nextId) || choice.nextId === passage.id
        ).toBe(true);
      });
    });
  });

  it("matches Passage interface structure", () => {
    // Type checking - this will fail at compile time if structure is wrong
    const testPassages: Passage[] = passages;
    expect(testPassages).toBeDefined();
  });

  it("has specific key passages for testing", () => {
    // Test that important passages exist for our component tests
    expect(passages.find((p) => p.id === 1)).toBeDefined(); // Starting passage
    expect(passages.find((p) => p.id === 9)).toBeDefined(); // Ending passage
    expect(passages.find((p) => p.id === 2)).toBeDefined(); // Functions path
    expect(passages.find((p) => p.id === 3)).toBeDefined(); // Data structures path
  });

  it("all passages contain meaningful paragraph content", () => {
    passages.forEach((passage) => {
      // Each passage should have at least one paragraph
      expect(passage.paragraphs.length).toBeGreaterThan(0);

      // Each paragraph should have substantial content (not just whitespace)
      passage.paragraphs.forEach((paragraph) => {
        expect(paragraph.trim().length).toBeGreaterThan(10);
      });

      // At least some passages should have multiple paragraphs to showcase the feature
      const multiParagraphPassages = passages.filter(
        (p) => p.paragraphs.length > 1
      );
      expect(multiParagraphPassages.length).toBeGreaterThan(0);
    });
  });
});
