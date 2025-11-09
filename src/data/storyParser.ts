import { parse } from "yaml";
import type { Story, RawStory, InventoryItem } from "./types";

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

    // Validate the parsed object matches the RawStory interface
    const rawStory = this.validateParsedObject(parsed);

    // Convert multiline text to paragraphs and transform to processed Story
    const processedStory = this.processTextFields(rawStory);

    return processedStory;
  }

  private static validateParsedObject(parsed: unknown): RawStory {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Invalid YAML: Root must be an object");
    }

    const obj = parsed as Record<string, unknown>;

    // Validate metadata
    if (
      !obj.metadata ||
      typeof obj.metadata !== "object" ||
      Array.isArray(obj.metadata)
    ) {
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
    if (
      !obj.intro ||
      typeof obj.intro !== "object" ||
      Array.isArray(obj.intro)
    ) {
      throw new Error("Invalid YAML: Missing or invalid intro object");
    }
    const intro = obj.intro as Record<string, unknown>;
    if (typeof intro.text !== "string" || !intro.text.trim()) {
      throw new Error("Invalid YAML: intro.text must be a non-empty string");
    }
    if (typeof intro.action !== "string" || !intro.action.trim()) {
      throw new Error("Invalid YAML: intro.action must be a non-empty string");
    }

    // Validate passages
    if (
      !obj.passages ||
      typeof obj.passages !== "object" ||
      Array.isArray(obj.passages)
    ) {
      throw new Error("Invalid YAML: Missing or invalid passages object");
    }
    const passages = obj.passages as Record<string, unknown>;

    // Validate inventory
    const inventoryItems: InventoryItem[] = [];
    if (obj.items !== undefined) {
      if (!Array.isArray(obj.items)) {
        throw new Error("Invalid YAML: items must be an array");
      }

      for (let i = 0; i < obj.items.length; i++) {
        const item = obj.items[i];
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          throw new Error(`Invalid YAML: items[${i}] must be an object`);
        }

        const itemObj = item as Record<string, unknown>;
        if (typeof itemObj.id !== "string" || !itemObj.id.trim()) {
          throw new Error(
            `Invalid YAML: items[${i}] id must be a non-empty string`
          );
        }
        if (typeof itemObj.name !== "string" || !itemObj.name.trim()) {
          throw new Error(
            `Invalid YAML: items[${i}] name must be a non-empty string`
          );
        }

        inventoryItems.push({
          id: itemObj.id,
          name: itemObj.name,
        });
      }

      const itemIds = inventoryItems.map((item) => item.id);
      const duplicates = itemIds.filter(
        (id, index) => itemIds.indexOf(id) !== index
      );
      if (duplicates.length > 0) {
        throw new Error(
          `Invalid YAML: Duplicate item IDs: ${duplicates.join(", ")}`
        );
      }
    }

    for (const [passageId, passage] of Object.entries(passages)) {
      // Validate passage ID is numeric
      if (isNaN(Number(passageId))) {
        throw new Error(
          `Invalid YAML: Passage ID '${passageId}' must be numeric`
        );
      }

      if (!passage || typeof passage !== "object" || Array.isArray(passage)) {
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
          if (!choice || typeof choice !== "object" || Array.isArray(choice)) {
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
          if (
            typeof choiceObj.goto !== "number" ||
            !Number.isInteger(choiceObj.goto) ||
            choiceObj.goto <= 0
          ) {
            throw new Error(
              `Invalid YAML: Passage ${passageId} choice ${i} goto must be a positive integer`
            );
          }
        }
      }

      // Validate optional ending field - can only be true
      if (passageObj.ending !== undefined) {
        if (passageObj.ending !== true) {
          throw new Error(
            `Invalid YAML: Passage ${passageId} ending must be true (or omitted for non-ending passages)`
          );
        }
      }

      // Validate ending has no choices
      if (
        passageObj.ending === true &&
        passageObj.choices &&
        Array.isArray(passageObj.choices) &&
        passageObj.choices.length > 0
      ) {
        throw new Error(
          `Invalid YAML: Ending passage ${passageId} must not have choices`
        );
      }

      // Validate non-ending passages have at least one choice
      if (
        passageObj.ending !== true &&
        (!passageObj.choices ||
          !Array.isArray(passageObj.choices) ||
          passageObj.choices.length === 0)
      ) {
        throw new Error(
          `Invalid YAML: Non-ending passage ${passageId} must have at least one choice`
        );
      }

      // Validate optional type field - only allowed with ending: true
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
        // Type can only be used with ending: true
        if (passageObj.ending !== true) {
          throw new Error(
            `Invalid YAML: Passage ${passageId} type can only be used with ending: true`
          );
        }
      }

      // Validate optional effects array
      if (passageObj.effects !== undefined) {
        if (!Array.isArray(passageObj.effects)) {
          throw new Error(
            `Invalid YAML: Passage ${passageId} effects must be an array`
          );
        }

        // Validate ending passages cannot have effects
        if (passageObj.ending === true) {
          throw new Error(
            `Invalid YAML: Ending passage ${passageId} must not have effects`
          );
        }

        for (let i = 0; i < passageObj.effects.length; i++) {
          const effect = passageObj.effects[i];
          if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
            throw new Error(
              `Invalid YAML: Passage ${passageId} effect ${i} must be an object`
            );
          }

          const effectObj = effect as Record<string, unknown>;
          if (typeof effectObj.type !== "string") {
            throw new Error(
              `Invalid YAML: Passage ${passageId} effect ${i} type must be a string`
            );
          }

          const validEffectTypes = ["add_item", "remove_item"];
          if (!validEffectTypes.includes(effectObj.type)) {
            throw new Error(
              `Invalid YAML: Passage ${passageId} effect ${i} type must be one of: ${validEffectTypes.join(
                ", "
              )}`
            );
          }

          if (typeof effectObj.item !== "string" || !effectObj.item.trim()) {
            throw new Error(
              `Invalid YAML: Passage ${passageId} effect ${i} item must be a non-empty string`
            );
          }

          // Validate that the effect references a valid inventory item
          const itemExists = inventoryItems.some(
            (inventoryItem) => inventoryItem.id === effectObj.item
          );
          if (!itemExists) {
            throw new Error(
              `Invalid YAML: Passage ${passageId} effect ${i} references unknown item: ${effectObj.item}`
            );
          }
        }
      }
    }

    // Type assertion is now safe after validation
    return parsed as RawStory;
  }

  private static processTextFields(rawStory: RawStory): Story {
    // Create processed story with paragraphs
    const processedStory: Story = {
      metadata: rawStory.metadata,
      intro: {
        paragraphs: this.textToParagraphs(rawStory.intro.text),
        action: rawStory.intro.action,
      },
      passages: {},
      items: rawStory.items || [],
    };

    // Process passage texts
    for (const [id, rawPassage] of Object.entries(rawStory.passages)) {
      const paragraphs = this.textToParagraphs(rawPassage.text);

      if (rawPassage.ending === true) {
        // Ending passage
        processedStory.passages[Number(id)] = {
          paragraphs,
          ending: true,
          ...(rawPassage.type && { type: rawPassage.type }),
          ...(rawPassage.effects && { effects: rawPassage.effects }),
        };
      } else {
        // Regular passage with choices
        processedStory.passages[Number(id)] = {
          paragraphs,
          choices: rawPassage.choices,
          ...(rawPassage.effects && { effects: rawPassage.effects }),
        };
      }
    }

    return processedStory;
  }

  private static textToParagraphs(text: string): string[] {
    // Handle edge cases
    if (!text) {
      return [];
    }

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
      if ("choices" in passage && passage.choices) {
        for (const choice of passage.choices) {
          if (!passageNumbers.includes(choice.goto)) {
            errors.push(
              `Passage ${passageId} has invalid goto: ${choice.goto}`
            );
          }
        }
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
