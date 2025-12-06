import { AdventureParser } from "../adventureParser";
import {} from "../types";

// Note: Using 'yaml' package instead of 'js-yaml' for security
// The 'yaml' package is safe by default and doesn't execute arbitrary code

describe("AdventureParser - inventory and effects", () => {
  it("should parse an adventure with inventory items", () => {
    const yamlContent = `
metadata:
  title: "Inventory Test"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"
  - id: "another_item"
    name: "Another Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    ending: true
`;

    const adventure = AdventureParser.parseFromString(yamlContent);

    expect(adventure.items).toHaveLength(2);
    expect(adventure.items[0]).toEqual({
      id: "test_item",
      name: "Test Item",
    });
    expect(adventure.items[1]).toEqual({
      id: "another_item",
      name: "Another Item",
    });
  });

  it("should parse an adventure without inventory items", () => {
    const yamlContent = `
metadata:
  title: "No Inventory Test"
  author: "Test Author"
  version: "1.0"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    ending: true
`;

    const adventure = AdventureParser.parseFromString(yamlContent);

    expect(adventure.items).toEqual([]);
  });

  it("should parse passages with effects", () => {
    const yamlContent = `
metadata:
  title: "Effects Test"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "You find an item"
    effects:
      - type: "add_item"
        item: "test_item"
    choices:
      - text: "Continue"
        goto: 2

  2:
    text: "You continue your journey"
    effects:
      - type: "remove_item"
        item: "test_item"
    choices:
      - text: "End"
        goto: 3

  3:
    text: "The end"
    ending: true
`;

    const adventure = AdventureParser.parseFromString(yamlContent);

    expect(adventure.passages[1].effects).toHaveLength(1);
    expect(adventure.passages[1].effects![0]).toEqual({
      type: "add_item",
      item: "test_item",
    });
    expect(adventure.passages[2].effects).toHaveLength(1);
    expect(adventure.passages[2].effects![0]).toEqual({
      type: "remove_item",
      item: "test_item",
    });
  });

  it("should reject invalid inventory item structure", () => {
    const yamlContent = `
metadata:
  title: "Invalid Inventory"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test"
    ending: true
`;

    expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
      /items\[.*\] name must be a non-empty string/
    );
  });

  it("should reject duplicate inventory item IDs", () => {
    const yamlContent = `
metadata:
  title: "Duplicate IDs"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "First Item"
  - id: "test_item"
    name: "Duplicate Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test"
    ending: true
`;

    expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
      /Duplicate item IDs: test_item/
    );
  });

  it("should reject effects referencing non-existent inventory items", () => {
    const yamlContent = `
metadata:
  title: "Invalid Effect"
  author: "Test Author"
  version: "1.0"

items:
  - id: "valid_item"
    name: "Valid Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    effects:
      - type: "add_item"
        item: "nonexistent_item"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    ending: true
`;

    expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
      /effect .* references unknown item: nonexistent_item/
    );
  });

  it("should reject invalid effect types", () => {
    const yamlContent = `
metadata:
  title: "Invalid Effect Type"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    effects:
      - type: "invalid_type"
        item: "test_item"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    ending: true
`;

    expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
      /effect .* must be one of: add_item, remove_item/
    );
  });

  it("should reject ending passages with effects", () => {
    const yamlContent = `
metadata:
  title: "Ending With Effects"
  author: "Test Author"
  version: "1.0"

items:
  - id: "test_item"
    name: "Test Item"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "Test passage"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    effects:
      - type: "add_item"
        item: "test_item"
    ending: true
`;

    expect(() => AdventureParser.parseFromString(yamlContent)).toThrow(
      /Ending passage 2 must not have effects/
    );
  });

  it("should parse passages with multiple effects", () => {
    const yamlContent = `
metadata:
  title: "Multiple Effects"
  author: "Test Author"
  version: "1.0"

items:
  - id: "item1"
    name: "Item One"
  - id: "item2"
    name: "Item Two"

intro:
  text: "Test intro"
  action: "Start"

passages:
  1:
    text: "You find multiple items"
    effects:
      - type: "add_item"
        item: "item1"
      - type: "add_item"
        item: "item2"
    choices:
      - text: "End"
        goto: 2

  2:
    text: "The end"
    ending: true
`;

    const adventure = AdventureParser.parseFromString(yamlContent);

    expect(adventure.passages[1].effects).toHaveLength(2);
    expect(adventure.passages[1].effects![0]).toEqual({
      type: "add_item",
      item: "item1",
    });
    expect(adventure.passages[1].effects![1]).toEqual({
      type: "add_item",
      item: "item2",
    });
  });
});
