import * as yaml from "js-yaml";
import type { Story } from "./types";

export class StoryParser {
  static parseFromString(yamlContent: string): Story {
    const parsed = yaml.load(yamlContent) as Story;

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
