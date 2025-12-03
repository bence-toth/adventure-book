import { stringify } from "yaml";
import type { Adventure } from "./types";

export class AdventureSerializer {
  // Serializes an Adventure object back to YAML string format
  // This is the inverse operation of AdventureParser.parseFromString
  static serializeToString(adventure: Adventure): string {
    // Convert the processed Adventure back to raw format for YAML serialization
    const rawAdventure = this.adventureToRaw(adventure);

    // Serialize to YAML with appropriate formatting
    const yamlString = stringify(rawAdventure, {
      // Use plain style for simple strings, quoted for complex ones
      defaultStringType: "PLAIN",
      defaultKeyType: "PLAIN",
      // Indent with 2 spaces
      indent: 2,
      // Use literal style for multiline text
      lineWidth: 0,
      // Preserve newlines in multiline strings
      blockQuote: "literal",
    });

    return yamlString;
  }

  // Converts a processed Adventure object back to raw format
  // suitable for YAML serialization
  private static adventureToRaw(adventure: Adventure): Record<string, unknown> {
    // Convert intro paragraphs back to multiline text
    const introText = this.paragraphsToText(adventure.intro.paragraphs);

    // Convert passages
    const rawPassages: Record<string, unknown> = {};

    for (const [id, passage] of Object.entries(adventure.passages)) {
      const passageText = this.paragraphsToText(passage.paragraphs);

      if (passage.ending === true) {
        // Ending passage
        rawPassages[id] = {
          text: passageText,
          ...(passage.notes && { notes: passage.notes }),
          ending: true,
          ...(passage.type && { type: passage.type }),
        };
      } else {
        // Regular passage with choices
        rawPassages[id] = {
          text: passageText,
          ...(passage.notes && { notes: passage.notes }),
          choices: passage.choices,
          ...(passage.effects &&
            passage.effects.length > 0 && { effects: passage.effects }),
        };
      }
    }

    // Build the raw adventure object
    const rawAdventure: Record<string, unknown> = {
      metadata: {
        title: adventure.metadata.title,
        author: adventure.metadata.author,
        version: adventure.metadata.version,
      },
      intro: {
        text: introText,
        action: adventure.intro.action,
      },
      passages: rawPassages,
    };

    // Add items array only if it contains items
    if (adventure.items && adventure.items.length > 0) {
      rawAdventure.items = adventure.items;
    }

    return rawAdventure;
  }

  // Converts an array of paragraphs back to multiline text format
  // Joins paragraphs with double newlines to match the original format
  private static paragraphsToText(paragraphs: string[]): string {
    if (!paragraphs || paragraphs.length === 0) {
      return "";
    }

    return paragraphs.join("\n\n");
  }
}
