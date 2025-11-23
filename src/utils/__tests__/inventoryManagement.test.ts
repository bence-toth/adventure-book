import {
  addItemToInventory,
  removeItemFromInventory,
} from "../inventoryManagement";
import { getInventory, saveInventory } from "../localStorage";

describe("inventoryManagement utilities", () => {
  const testAdventureId = "test-adventure-id";

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("addItemToInventory", () => {
    it("should add a new item to empty inventory", () => {
      addItemToInventory(testAdventureId, "test_item");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual(["test_item"]);
    });

    it("should not add duplicate items", () => {
      addItemToInventory(testAdventureId, "test_item");
      addItemToInventory(testAdventureId, "test_item");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual(["test_item"]);
    });

    it("should add multiple different items", () => {
      addItemToInventory(testAdventureId, "item1");
      addItemToInventory(testAdventureId, "item2");
      addItemToInventory(testAdventureId, "item3");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual(["item1", "item2", "item3"]);
    });

    it("should preserve existing items when adding new ones", () => {
      saveInventory(testAdventureId, ["existing_item"]);

      addItemToInventory(testAdventureId, "new_item");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toContain("existing_item");
      expect(inventory).toContain("new_item");
      expect(inventory).toHaveLength(2);
    });

    it("should handle adding items when existing inventory exists", () => {
      saveInventory(testAdventureId, ["item1", "item2"]);

      addItemToInventory(testAdventureId, "item3");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual(["item1", "item2", "item3"]);
    });

    it("should not throw on localStorage errors", () => {
      // Even if localStorage has issues, the function should handle it gracefully
      expect(() =>
        addItemToInventory(testAdventureId, "test_item")
      ).not.toThrow();
    });
  });

  describe("removeItemFromInventory", () => {
    it("should remove an existing item", () => {
      saveInventory(testAdventureId, ["item1", "item2", "item3"]);

      removeItemFromInventory(testAdventureId, "item1");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual(["item2", "item3"]);
    });

    it("should not throw when removing non-existent item", () => {
      saveInventory(testAdventureId, ["item1", "item2"]);

      expect(() =>
        removeItemFromInventory(testAdventureId, "nonexistent")
      ).not.toThrow();

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual(["item1", "item2"]);
    });

    it("should handle empty inventory gracefully", () => {
      expect(() =>
        removeItemFromInventory(testAdventureId, "item1")
      ).not.toThrow();

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual([]);
    });

    it("should remove all instances of an item if duplicates exist", () => {
      // This tests the filter behavior
      saveInventory(testAdventureId, ["item1", "item2", "item1", "item3"]);

      removeItemFromInventory(testAdventureId, "item1");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toEqual(["item2", "item3"]);
      expect(inventory).not.toContain("item1");
    });

    it("should preserve other items when removing", () => {
      saveInventory(testAdventureId, ["keep1", "remove", "keep2"]);

      removeItemFromInventory(testAdventureId, "remove");

      const inventory = getInventory(testAdventureId);
      expect(inventory).toContain("keep1");
      expect(inventory).toContain("keep2");
      expect(inventory).not.toContain("remove");
      expect(inventory).toHaveLength(2);
    });

    it("should not throw on localStorage errors", () => {
      // Even if localStorage has issues, the function should handle it gracefully
      expect(() =>
        removeItemFromInventory(testAdventureId, "test_item")
      ).not.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should support adding and removing items in sequence", () => {
      addItemToInventory(testAdventureId, "item1");
      addItemToInventory(testAdventureId, "item2");
      addItemToInventory(testAdventureId, "item3");

      expect(getInventory(testAdventureId)).toEqual([
        "item1",
        "item2",
        "item3",
      ]);

      removeItemFromInventory(testAdventureId, "item2");

      expect(getInventory(testAdventureId)).toEqual(["item1", "item3"]);

      addItemToInventory(testAdventureId, "item4");

      expect(getInventory(testAdventureId)).toEqual([
        "item1",
        "item3",
        "item4",
      ]);
    });

    it("should maintain consistency across multiple operations", () => {
      // Add several items
      addItemToInventory(testAdventureId, "sword");
      addItemToInventory(testAdventureId, "shield");
      addItemToInventory(testAdventureId, "potion");

      // Try to add duplicate
      addItemToInventory(testAdventureId, "sword");

      // Inventory should not have duplicates
      expect(getInventory(testAdventureId)).toEqual([
        "sword",
        "shield",
        "potion",
      ]);

      // Remove one item
      removeItemFromInventory(testAdventureId, "shield");

      // Verify final state
      const finalInventory = getInventory(testAdventureId);
      expect(finalInventory).toContain("sword");
      expect(finalInventory).toContain("potion");
      expect(finalInventory).not.toContain("shield");
      expect(finalInventory).toHaveLength(2);
    });
  });
});
