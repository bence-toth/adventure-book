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
    }) as Story;

    // Convert multiline text to paragraphs
    this.processTextFields(parsed);

    return parsed;
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
