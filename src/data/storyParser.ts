import { parse } from "yaml";
import type { Story } from "./types";

export class StoryParser {
  static parseFromString(yamlContent: string): Story {
    // The 'yaml' package's parse() function is safe by default (unlike js-yaml's load())
    // It only parses standard YAML types and doesn't execute arbitrary code or custom tags
    // This is much safer than js-yaml.load() which could execute arbitrary JavaScript
    const parsed = parse(yamlContent, {
      // Explicitly disable custom tags for extra security
      customTags: [],
      // Enforce strict YAML parsing (catch duplicate keys, etc.)
      strict: true,
    });

    // Validate the parsed object matches the Story interface
    const validatedStory = this.validateParsedObject(parsed);

    // Convert multiline text to paragraphs
    this.processTextFields(validatedStory);

    return validatedStory;
  }

  private static validateParsedObject(parsed: unknown): Story {
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid YAML: Root must be an object");
    }

    const obj = parsed as Record<string, unknown>;

    // Validate metadata
    if (!obj.metadata || typeof obj.metadata !== "object") {
      throw new Error("Invalid YAML: Missing or invalid metadata object");
    }
    const metadata = obj.metadata as Record<string, unknown>;
    if (typeof metadata.title !== "string" || !metadata.title.trim()) {
      throw new Error(
        "Invalid YAML: metadata.title must be a non-empty string"
      );
    }
    if (typeof metadata.author !== "string" || !metadata.author.trim()) {
      throw new Error(
        "Invalid YAML: metadata.author must be a non-empty string"
      );
    }
    if (typeof metadata.version !== "string" || !metadata.version.trim()) {
      throw new Error(
        "Invalid YAML: metadata.version must be a non-empty string"
      );
    }

    // Validate intro
    if (!obj.intro || typeof obj.intro !== "object") {
      throw new Error("Invalid YAML: Missing or invalid intro object");
    }
    const intro = obj.intro as Record<string, unknown>;
    if (typeof intro.text !== "string" || !intro.text.trim()) {
      throw new Error("Invalid YAML: intro.text must be a non-empty string");
    }

    // Validate passages
    if (!obj.passages || typeof obj.passages !== "object") {
      throw new Error("Invalid YAML: Missing or invalid passages object");
    }
    const passages = obj.passages as Record<string, unknown>;

    for (const [passageId, passage] of Object.entries(passages)) {
      // Validate passage ID is numeric
      if (isNaN(Number(passageId))) {
        throw new Error(
          `Invalid YAML: Passage ID '${passageId}' must be numeric`
        );
      }

      if (!passage || typeof passage !== "object") {
        throw new Error(`Invalid YAML: Passage ${passageId} must be an object`);
      }

      const passageObj = passage as Record<string, unknown>;

      // Validate required text field
      if (typeof passageObj.text !== "string" || !passageObj.text.trim()) {
        throw new Error(
          `Invalid YAML: Passage ${passageId} text must be a non-empty string`
        );
      }

      // Validate optional choices array
      if (passageObj.choices) {
        if (!Array.isArray(passageObj.choices)) {
          throw new Error(
            `Invalid YAML: Passage ${passageId} choices must be an array`
          );
        }

        for (let i = 0; i < passageObj.choices.length; i++) {
          const choice = passageObj.choices[i];
          if (!choice || typeof choice !== "object") {
            throw new Error(
              `Invalid YAML: Passage ${passageId} choice ${i} must be an object`
            );
          }

          const choiceObj = choice as Record<string, unknown>;
          if (typeof choiceObj.text !== "string" || !choiceObj.text.trim()) {
            throw new Error(
              `Invalid YAML: Passage ${passageId} choice ${i} text must be a non-empty string`
            );
          }
          if (typeof choiceObj.goto !== "number") {
            throw new Error(
              `Invalid YAML: Passage ${passageId} choice ${i} goto must be a number`
            );
          }
        }
      }

      // Validate optional ending field
      if (
        passageObj.ending !== undefined &&
        typeof passageObj.ending !== "boolean"
      ) {
        throw new Error(
          `Invalid YAML: Passage ${passageId} ending must be a boolean`
        );
      }

      // Validate optional type field
      if (passageObj.type !== undefined) {
        const validTypes = ["victory", "defeat", "neutral"];
        if (
          typeof passageObj.type !== "string" ||
          !validTypes.includes(passageObj.type)
        ) {
          throw new Error(
            `Invalid YAML: Passage ${passageId} type must be one of: ${validTypes.join(
              ", "
            )}`
          );
        }
      }
    }

    // Type assertion is now safe after validation
    return parsed as Story;
  }

  private static processTextFields(story: Story): void {
    // Process intro text
    story.intro.paragraphs = this.textToParagraphs(story.intro.text);

    // Process passage texts
    for (const passage of Object.values(story.passages)) {
      passage.paragraphs = this.textToParagraphs(passage.text);
    }
  }

  private static textToParagraphs(text: string): string[] {
    return text
      .split("\n\n")
      .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
      .filter((paragraph) => paragraph.length > 0);
  }

  static validateStory(story: Story): string[] {
    const errors: string[] = [];
    const passageNumbers = Object.keys(story.passages).map(Number);

    // Validate all goto references exist
    for (const [passageId, passage] of Object.entries(story.passages)) {
      if (passage.choices) {
        for (const choice of passage.choices) {
          if (!passageNumbers.includes(choice.goto)) {
            errors.push(
              `Passage ${passageId} has invalid goto: ${choice.goto}`
            );
          }
        }
      }
    }

    // Validate that ending passages don't have choices
    for (const [passageId, passage] of Object.entries(story.passages)) {
      if (passage.ending && passage.choices && passage.choices.length > 0) {
        errors.push(`Ending passage ${passageId} should not have choices`);
      }
    }

    return errors;
  }

  static getEndingPassages(story: Story): number[] {
    return Object.entries(story.passages)
      .filter(([, passage]) => passage.ending)
      .map(([id]) => Number(id));
  }
}
