import {
  addItemToInventory,
  removeItemFromInventory,
} from "../inventoryManagement";
import { getInventory, saveInventory } from "../localStorage";

describe("inventoryManagement utilities", () => {
  const testStoryId = "test-story-id";

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("addItemToInventory", () => {
    it("should add a new item to empty inventory", () => {
      addItemToInventory(testStoryId, "test_item");

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual(["test_item"]);
    });

    it("should not add duplicate items", () => {
      addItemToInventory(testStoryId, "test_item");
      addItemToInventory(testStoryId, "test_item");

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual(["test_item"]);
    });

    it("should add multiple different items", () => {
      addItemToInventory(testStoryId, "item1");
      addItemToInventory(testStoryId, "item2");
      addItemToInventory(testStoryId, "item3");

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual(["item1", "item2", "item3"]);
    });

    it("should preserve existing items when adding new ones", () => {
      saveInventory(testStoryId, ["existing_item"]);

      addItemToInventory(testStoryId, "new_item");

      const inventory = getInventory(testStoryId);
      expect(inventory).toContain("existing_item");
      expect(inventory).toContain("new_item");
      expect(inventory).toHaveLength(2);
    });

    it("should handle adding items when existing inventory exists", () => {
      saveInventory(testStoryId, ["item1", "item2"]);

      addItemToInventory(testStoryId, "item3");

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual(["item1", "item2", "item3"]);
    });

    it("should not throw on localStorage errors", () => {
      // Even if localStorage has issues, the function should handle it gracefully
      expect(() => addItemToInventory(testStoryId, "test_item")).not.toThrow();
    });
  });

  describe("removeItemFromInventory", () => {
    it("should remove an existing item", () => {
      saveInventory(testStoryId, ["item1", "item2", "item3"]);

      removeItemFromInventory(testStoryId, "item1");

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual(["item2", "item3"]);
    });

    it("should not throw when removing non-existent item", () => {
      saveInventory(testStoryId, ["item1", "item2"]);

      expect(() =>
        removeItemFromInventory(testStoryId, "nonexistent")
      ).not.toThrow();

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual(["item1", "item2"]);
    });

    it("should handle empty inventory gracefully", () => {
      expect(() => removeItemFromInventory(testStoryId, "item1")).not.toThrow();

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual([]);
    });

    it("should remove all instances of an item if duplicates exist", () => {
      // This tests the filter behavior
      saveInventory(testStoryId, ["item1", "item2", "item1", "item3"]);

      removeItemFromInventory(testStoryId, "item1");

      const inventory = getInventory(testStoryId);
      expect(inventory).toEqual(["item2", "item3"]);
      expect(inventory).not.toContain("item1");
    });

    it("should preserve other items when removing", () => {
      saveInventory(testStoryId, ["keep1", "remove", "keep2"]);

      removeItemFromInventory(testStoryId, "remove");

      const inventory = getInventory(testStoryId);
      expect(inventory).toContain("keep1");
      expect(inventory).toContain("keep2");
      expect(inventory).not.toContain("remove");
      expect(inventory).toHaveLength(2);
    });

    it("should not throw on localStorage errors", () => {
      // Even if localStorage has issues, the function should handle it gracefully
      expect(() =>
        removeItemFromInventory(testStoryId, "test_item")
      ).not.toThrow();
    });
  });

  describe("integration scenarios", () => {
    it("should support adding and removing items in sequence", () => {
      addItemToInventory(testStoryId, "item1");
      addItemToInventory(testStoryId, "item2");
      addItemToInventory(testStoryId, "item3");

      expect(getInventory(testStoryId)).toEqual(["item1", "item2", "item3"]);

      removeItemFromInventory(testStoryId, "item2");

      expect(getInventory(testStoryId)).toEqual(["item1", "item3"]);

      addItemToInventory(testStoryId, "item4");

      expect(getInventory(testStoryId)).toEqual(["item1", "item3", "item4"]);
    });

    it("should maintain consistency across multiple operations", () => {
      // Add several items
      addItemToInventory(testStoryId, "sword");
      addItemToInventory(testStoryId, "shield");
      addItemToInventory(testStoryId, "potion");

      // Try to add duplicate
      addItemToInventory(testStoryId, "sword");

      // Inventory should not have duplicates
      expect(getInventory(testStoryId)).toEqual(["sword", "shield", "potion"]);

      // Remove one item
      removeItemFromInventory(testStoryId, "shield");

      // Verify final state
      const finalInventory = getInventory(testStoryId);
      expect(finalInventory).toContain("sword");
      expect(finalInventory).toContain("potion");
      expect(finalInventory).not.toContain("shield");
      expect(finalInventory).toHaveLength(2);
    });
  });
});
